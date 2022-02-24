package com.web.curation.model.alert;

import java.time.LocalDateTime;
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

import org.springframework.data.annotation.CreatedDate;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.web.curation.dto.alert.AlertResponse;
import com.web.curation.model.account.MyUser;
import com.web.curation.model.match.JoinState;
import com.web.curation.model.study.StudyArticle;
import com.web.curation.model.study.StudyJoin;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class Alert {
	
	@Id
	@GeneratedValue
	private Long id;
	
	private Long userId;
	
	private String userName;
	
	@Enumerated(value = EnumType.STRING)
	private AlertType AlertType;
	
	private String message;
	
	private Long studyId;
	
	private String studyName;
	
	// studyArticle
	private Long articleId;
	
	@Column
	private Boolean state;
	
    @CreatedDate
    @Column(columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP", 
    		insertable = false, 
    		updatable = false)
	private LocalDateTime createDate;
    
    public Alert(Long userId, String userName, Long studyId, String studyName, Long articleId) {
    	this.userId = userId;
    	this.userName = userName;
    	this.studyId = studyId;
    	this.studyName = studyName;
    	this.articleId = articleId;
    }
    
    public AlertResponse toResponse() {
    	return new AlertResponse(id, userId, userName, AlertType, message, studyId, studyName, articleId, createDate, state);
    }
}
