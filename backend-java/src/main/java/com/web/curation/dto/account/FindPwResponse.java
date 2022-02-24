package com.web.curation.dto.account;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class FindPwResponse {

	private Long id;
	private String email;
	
}
