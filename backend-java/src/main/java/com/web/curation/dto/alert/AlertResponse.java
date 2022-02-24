package com.web.curation.dto.alert;

import java.time.LocalDateTime;

import com.web.curation.model.alert.AlertType;

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
public class AlertResponse {
	
	private Long AlertId;
	private Long userId;
	private String userName;
	private AlertType type;
	private String message;
	private Long studyId;
	private String studyName;
	private Long articleId;
	private LocalDateTime createDate;
	private Boolean read;
}
