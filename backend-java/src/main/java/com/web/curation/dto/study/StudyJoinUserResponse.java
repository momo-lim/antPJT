package com.web.curation.dto.study;

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
public class StudyJoinUserResponse {
	private Long UserId;
	private String UserName;
	private Long StudyId;
	private Boolean leader;
}
