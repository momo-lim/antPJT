package com.web.curation.dto.match;


import com.web.curation.model.match.MatchArticle;

import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class MatchArticleRequest {
	private String title;
	private String content;
}
