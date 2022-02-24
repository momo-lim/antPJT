package com.web.curation.dto.account;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class FindPwSuccessRequest {
	private String email;
	private String question;
	private String answer;
	private String password;
}
