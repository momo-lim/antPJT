package com.web.curation.specification;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.criteria.CriteriaBuilder;
import javax.persistence.criteria.CriteriaQuery;
import javax.persistence.criteria.Predicate;
import javax.persistence.criteria.Root;

import org.springframework.data.jpa.domain.Specification;

import com.web.curation.model.match.MatchArticle;



public class MatchArticleSpec {
	
	public enum MartchArticleSearchKey {
		TITLE("title"),
		CONTENT("content");
		
		private final String value;
		
		MartchArticleSearchKey(String value) {
			this.value = value;
		}
		
		public String getValue() {
			return value;
		}
	}
	
	// 제목만 검색하기
	public static Specification<MatchArticle> likeTitle(String title) {
		return new Specification<MatchArticle>() {
			@Override
			public Predicate toPredicate(Root<MatchArticle> root, CriteriaQuery<?> query, CriteriaBuilder criteriaBuilder) {
				return criteriaBuilder.like(root.get("title"), "%" + title + "%");
			}
		};
	}
	
	// 제목, 내용 동시 검색
	public static Specification<MatchArticle> searchWith(String keyword) {
		Map<MartchArticleSearchKey, Object> searchKeyword = toMartchArticleSearchKey(keyword);
	    return (Specification<MatchArticle>) ((root, query, builder) -> {
	        List<Predicate> predicate = getPredicateMatchArticle(searchKeyword, root, builder);
	        return builder.or(predicate.toArray(new Predicate[0]));
	    });
	}
	private static Map<MartchArticleSearchKey, Object> toMartchArticleSearchKey(String keyword) {
    	Map<String, Object> searchKeyword = new HashMap<>();
    	searchKeyword.put("title", keyword);
    	searchKeyword.put("content", keyword);
    	Map<MartchArticleSearchKey, Object> searchKeys = new HashMap<>();
    	for (String key : searchKeyword.keySet()) {
    		searchKeys.put(MartchArticleSearchKey.valueOf(key.toUpperCase()), searchKeyword.get(key));
    	}
    	return searchKeys;
	}
	private static List<Predicate> getPredicateMatchArticle(Map<MartchArticleSearchKey, Object> searchKeyword, Root<MatchArticle> root, CriteriaBuilder builder) {
	    List<Predicate> predicate = new ArrayList<>();
	    for (MartchArticleSearchKey key : searchKeyword.keySet()) {
	        switch (key) {
	            case TITLE:
	            case CONTENT:
	            	predicate.add(builder.like(root.get(key.getValue()), "%" + searchKeyword.get(key) + "%"));
	            	break;
	        }
	    }
	    return predicate;
	}
}
