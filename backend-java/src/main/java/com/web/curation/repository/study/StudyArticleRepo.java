package com.web.curation.repository.study;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Repository;

import com.web.curation.model.study.StudyArticle;

@Repository
public interface StudyArticleRepo extends JpaRepository<StudyArticle, Long>, JpaSpecificationExecutor<StudyArticle>{
	List<StudyArticle> findByStudyId(Long studyId);
	Optional<StudyArticle> findByStudyIdAndId(Long studyId, Long Id);
	void deleteByStudyIdAndId(Long studyId, Long Id);
	List<StudyArticle> findByStudyWriterIdAndStudyId(Long studyWriterId, Long StudyId);
	List<StudyArticle> findByStudyWriterNameContains(String studyWriterName);
	List<StudyArticle> findByStockNameContains(String stockName);
}
