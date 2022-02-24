package com.web.curation.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.web.curation.dto.match.MatchArticleRequest;
import com.web.curation.dto.match.MatchArticleResponse;
import com.web.curation.dto.match.MatchJoinUserResponse;
import com.web.curation.model.match.JoinState;
import com.web.curation.model.account.MyUser;
import com.web.curation.model.match.MatchArticle;
import com.web.curation.model.match.MatchJoin;
import com.web.curation.model.study.Study;
import com.web.curation.model.study.StudyJoin;
import com.web.curation.repository.account.UserRepo;
import com.web.curation.repository.match.MatchArticleRepo;
import com.web.curation.repository.match.MatchJoinRepo;
import com.web.curation.repository.study.StudyJoinRepo;
import com.web.curation.repository.study.StudyRepo;
import com.web.curation.specification.MatchArticleSpec;

@Service
public class MatchService {
	
	@Autowired // 스프링 부트가 미리 생성해놓은 객체를 가져다가 자동 연결함
    private MatchArticleRepo articleRepo;
	@Autowired
    private UserRepo userRepo;
    @Autowired 
    private MatchJoinRepo joinRepo;
	@Autowired
	private StudyRepo studyRepo;
	@Autowired
	private StudyJoinRepo studyJoinRepo;
	@Autowired
	private AlertService alertService;
    
    public List<MatchArticleResponse> getArticleList() {
    	List<MatchArticleResponse> articleList = new ArrayList<>();
    	
    	articleRepo.findAll().forEach(article -> {
    		MatchArticleResponse response = article.toResponse();
    		articleList.add(response);
    	});
    	return articleList;
    }
    
    public MatchArticleResponse getArticle(Long articleId) {
    	MatchArticle article = articleRepo.findById(articleId).orElseThrow(() -> new ResponseStatusException(
																HttpStatus.NOT_FOUND, "존재하지 않는 게시글 id입니다.",
																new IllegalArgumentException()));
    	MatchArticleResponse response = article.toResponse();
    	return response;
    }
    
    @Transactional
    public void addNewArticle(MatchArticleRequest form, Long userId, Long studyId) {
    	MyUser writer = userRepo.findById(userId).orElseThrow(() -> new ResponseStatusException(
													HttpStatus.NOT_FOUND, "존재하지 않는 유저 id입니다.",
													new IllegalArgumentException()));
    	// 1. dto를 Entity로 변경
    	Study study = studyRepo.findById(studyId).orElseThrow(() ->
				new ResponseStatusException(HttpStatus.NOT_FOUND, "존재하지 않는 스터디 id입니다."));
    	
    	if (study.getLeader().getId() != userId) {
    		throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "leader 권한이 없습니다.");
    	}
    	
    	MatchArticle article = new MatchArticle(form.getTitle(), form.getContent(), false,
    							writer, writer.getName(), study);
    	// 2. Repository를 이용하여 Entity를 DB에 저장함
    	articleRepo.save(article);
    }
    
    @Transactional // 변경된 데이터를 DB에 저장
    public void updateArticle(
    		Long articleId,
    		Long userId,
    		String title,
    		String content,
    		Boolean state) {
    	MatchArticle article = articleRepo.findById(articleId)
    			.orElseThrow(() -> new ResponseStatusException(
						HttpStatus.NOT_FOUND, "존재하지 않는 게시글 id입니다.",
						new IllegalArgumentException()));
    	if (article.getWriter().getId() != userId) {
    		throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST, "게시글(댓글) 작성자가 아닙니다.",
					new IllegalArgumentException());
    	}
    	if (title != null && title.length() > 0 && !Objects.equals(article.getTitle(), title)) {
    		article.setTitle(title);
    	}
    	if (content != null && content.length() > 0 && !Objects.equals(article.getContent(), content)) {
    		article.setContent(content);
    	}
    	if (state != null && !Objects.equals(article.getState(), state)) {
    		article.setState(state);
    	}
    }
    
    public void deleteArticle(Long articleId, Long userId) {
    	MatchArticle article = articleRepo.findById(articleId).orElseThrow(() -> new ResponseStatusException(
																HttpStatus.NOT_FOUND, "존재하지 않는 게시글 id입니다.",
																new IllegalArgumentException()));
    	if (article.getWriter().getId() != userId) {
    		throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST, "게시글(댓글) 작성자가 아닙니다.",
					new IllegalArgumentException());
    	}
    	articleRepo.deleteById(articleId);
    }
    
    
    // 검색 키워드 하나로 제목 & 내용 검색하기
    public List<MatchArticleResponse> searchArticle(String keyWord) {
    	List<MatchArticleResponse> articleList = new ArrayList<>();
    	
		articleRepo.findAll(MatchArticleSpec.searchWith(keyWord)).forEach(article -> {
			MatchArticleResponse response = article.toResponse();
    		articleList.add(response);
		});
    	return articleList;
    }
    
    // 키워드로 작성자 검색
    public List<MatchArticleResponse> searchArticleWithWriter(String Keyword) {
    	List<MatchArticleResponse> articleList = new ArrayList<>();
    	articleRepo.findByWriterNameContains(Keyword).forEach(article -> {
    		MatchArticleResponse response = article.toResponse();
    		articleList.add(response);
    	});
    	return articleList;
    }
    
    // 스터디 신청
    public void joinStudy(Long articleId, Long joinUserId, String content) {
    	MatchArticle article = articleRepo.findById(articleId).orElseThrow(() -> new ResponseStatusException(
																HttpStatus.NOT_FOUND, "존재하지 않는 게시글 id입니다.",
																new IllegalArgumentException()));

    	MyUser joinUser = userRepo.findById(joinUserId)
    			.orElseThrow(() -> new ResponseStatusException(
						HttpStatus.NOT_FOUND, "존재하지 않는 유저 id입니다.",
						new IllegalArgumentException()));
    	if (article.getWriter().getId() == joinUserId) {
    		throw new ResponseStatusException(
    				HttpStatus.BAD_REQUEST, "작성한 모집글에 신청할 수 없습니다.",
    				new IllegalArgumentException());
    	} 
		if (joinRepo.findByJoinUserIdAndJoinArticleId(joinUserId, articleId).isPresent()) {
    		throw new ResponseStatusException(
    				HttpStatus.BAD_REQUEST, "이미 신청한 모집글입니다.",
    				new IllegalArgumentException());
    	} 
    	if (article.getState()) {
			// 1. 모집글 작성자가 임의로 마감 (모집글 수정으로 마감)
			throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "모집이 마감되었습니다.");
    	} 

		if (studyJoinRepo.findByJoinMemberIdAndJoinStudyId(joinUserId, article.getMatchStudy().getId()).isPresent()) {
			throw new ResponseStatusException(
    				HttpStatus.BAD_REQUEST, "스터디 멤버는 신청할 수 없습니다.",
    				new IllegalArgumentException());
		}

    	MatchJoin join = new MatchJoin();
    	join.setJoinArticle(article);
    	join.setJoinUser(joinUser);
    	join.setContent(content);
    	
    	joinRepo.save(join);
    }
    
    public List<MatchArticleResponse> getJoinArticle(Long userId) {
    	List<MatchArticleResponse> response = new ArrayList<>();
    	joinRepo.findByJoinUserId(userId).forEach(join -> {
    		response.add(join.getJoinArticle().toResponse());
    	});
    	if (response.isEmpty()) {
    		throw new ResponseStatusException(
    				HttpStatus.NOT_FOUND, "신청한 모집글이 없습니다.",
    				new IllegalArgumentException());
    	}
    	return response;
    }
    
    public List<MatchJoinUserResponse> getJoinUser(Long articleId) {
    	List<MatchJoinUserResponse> response = new ArrayList<>();
    	joinRepo.findByJoinArticleId(articleId).forEach(join -> {
    		response.add(join.toJoinUserResponse());
    	});
    	if (response.isEmpty()) {
    		throw new ResponseStatusException(
    				HttpStatus.NOT_FOUND, "신청자가 없습니다.",
    				new IllegalArgumentException());
    	}
    	return response;
    }
    
	// 모집글에서 '승인'으로 멤버 추가
	@Transactional
	public void addNewMatchMember(Long articleId, Long joinUserId) {
		// 검증
		MatchArticle article = articleRepo.findById(articleId).orElseThrow(() -> new ResponseStatusException(
																HttpStatus.NOT_FOUND, "존재하지 않는 게시글 id입니다.",
																new IllegalArgumentException()));

		MyUser leader = article.getWriter();
		MyUser joinUser = userRepo.findById(joinUserId).orElseThrow(() -> new ResponseStatusException(
														HttpStatus.NOT_FOUND, "존재하지 않는 유저 id입니다.",
														new IllegalArgumentException()));
		if (leader.getId() == joinUserId) {
    		throw new ResponseStatusException(
    				HttpStatus.BAD_REQUEST, "모집글 작성자는 일반 멤버로 추가할 수 없습니다.",
    				new IllegalArgumentException());
		}
		joinRepo.findByJoinUserIdAndJoinArticleId(joinUserId, articleId)
							.orElseThrow(() -> new ResponseStatusException(
							HttpStatus.NOT_FOUND, "모집글 신청자가 아닙니다."));


		// 스터디에 멤버 추가
		Study study = article.getMatchStudy();

		if (studyJoinRepo.findByJoinMemberIdAndJoinStudyId(joinUserId, study.getId()).isPresent()) {
    		throw new ResponseStatusException(
    				HttpStatus.BAD_REQUEST, "이미 스터디에 가입한 회원입니다.",
    				new IllegalArgumentException());
		} else {
			// 스터디에 유저(멤버)추가
			StudyJoin join = new StudyJoin(null, joinUser, study, false);
			studyJoinRepo.save(join);
			MatchJoin matchJoin = joinRepo.findByJoinUserIdAndJoinArticleId(joinUserId, articleId)
											.orElseThrow(() -> new ResponseStatusException(
																HttpStatus.BAD_REQUEST, "유저 또는 게시글 id를 확인하세요",
																new IllegalArgumentException()));
			matchJoin.setState(JoinState.APPROVED);
			alertService.ApprovedToAlert(study.getId(), joinUser.getId(), joinUser.getName());
		}

	}
	
	// 신청자 거부
	@Transactional
	public void denyJoinUser(Long articleId, Long joinUserId) {
		MatchJoin join = joinRepo.findByJoinUserIdAndJoinArticleId(joinUserId, articleId)
												.orElseThrow(() -> new ResponseStatusException(
														HttpStatus.BAD_REQUEST, "유저 또는 게시글 id를 확인하세요",
														new IllegalArgumentException()));
		if (join.getState() == null) {
			join.setState(JoinState.DENIED);
		} else {
			throw new ResponseStatusException(
    				HttpStatus.BAD_REQUEST, "승인 또는 거부한 신청자입니다.",
    				new IllegalArgumentException());
		}
		
	}
}
