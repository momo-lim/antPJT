package com.web.curation.model.match;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.web.curation.dto.match.MatchJoinUserResponse;
import com.web.curation.model.account.MyUser;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@NoArgsConstructor
@ToString
public class MatchJoin {
	
	@Id
	@GeneratedValue
	private Long id;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "joinUser_id")
	@JsonBackReference
	private MyUser joinUser;
	
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "joinArticle_id")
	@JsonBackReference
	private MatchArticle joinArticle;
	
	// 소개
	@Column
	private String content;
	
	@Enumerated(value = EnumType.STRING)
	private JoinState state;
	
	// 모집글의 신청자 목록 조회 Response
	public MatchJoinUserResponse toJoinUserResponse() {
		return new MatchJoinUserResponse(joinUser.getId(), joinUser.getName(), joinArticle.getId(), content, state);
	}
}
