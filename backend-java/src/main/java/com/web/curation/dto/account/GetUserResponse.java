package com.web.curation.dto.account;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;

import com.web.curation.dto.match.MatchArticleResponse;
import com.web.curation.dto.study.StudyArticleResponse;
import com.web.curation.dto.study.StudyCommentResponse;
import com.web.curation.dto.study.StudyResponse;
import com.web.curation.model.account.MyRole;
import com.web.curation.model.match.MatchArticle;
import com.web.curation.model.match.MatchJoin;
import com.web.curation.model.study.StudyArticle;
import com.web.curation.model.study.StudyComment;
import com.web.curation.model.study.StudyJoin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GetUserResponse {

	private Long userId;
	private String email;
	private String userName;
	private String question;
	private String answer;
	private LocalDateTime createDate;
	private List<String> roles;
	private List<MatchArticleResponse> matchArticles;
	private List<MatchArticleResponse> matchJoinArticles;
	private List<StudyResponse> joinStudy;
	private List<StudyArticleResponse> studyArticles;
	private List<StudyCommentResponse> studyComments;
	private List<StudyResponse> manageStudy;
	
	
}
