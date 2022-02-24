package com.web.curation.dto.study;

import com.web.curation.model.study.Study;

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
public class StudyRequest {
	private String name;
	private String interest;
	
	public Study toEntity() {
		return new Study(name, interest);
	}
}
