package com.web.curation.repository.study;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.web.curation.model.study.StudyComment;

@Repository
public interface StudyCommentRepo extends JpaRepository<StudyComment, Long>{
	List<StudyComment> findByStudyArticleId(Long studyArticleId);
	Optional<StudyComment> findByStudyArticleIdAndId(Long studyArticleId, Long Id);
	void deleteByStudyArticleIdAndId(Long studyArticleId, Long Id);
}
