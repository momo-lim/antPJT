package com.web.curation.repository.study;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.web.curation.model.study.StudyJoin;

@Repository
public interface StudyJoinRepo extends JpaRepository<StudyJoin, Long> {
	List<StudyJoin> findByjoinMemberId(Long joinMemberId);
	List<StudyJoin> findByjoinStudyId(Long joinStudyId);
	Optional<StudyJoin> findByJoinMemberIdAndJoinStudyId(Long joinMemberId, Long joinStudyId);
	void deleteByJoinStudyIdAndJoinMemberId(Long joinStudyId, Long joinMemberId);
}
