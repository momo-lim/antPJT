package com.web.curation.dto.stock;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GetNewsResponse {

	String articleSubject;
	String articleSummary;
	String url;
	String img;

}
