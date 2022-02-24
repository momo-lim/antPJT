 package com.web.curation.repository.match;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.web.curation.model.match.MatchJoin;

@Repository
public interface MatchJoinRepo extends JpaRepository<MatchJoin, Long> {
	List<MatchJoin> findByJoinUserId(Long joinUserId);
	List<MatchJoin> findByJoinArticleId(Long joinArticleId);
	Optional<MatchJoin> findByJoinUserIdAndJoinArticleId(Long joinUserId, Long joinArticleId);
}
