package com.web.curation.dto.study;

import com.web.curation.model.study.StudyArticle;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class StudyArticleRequest {
	private String title;
	private String content;
	private String stockCode;
	private String stockName;
	private Integer stockPrice;
}
