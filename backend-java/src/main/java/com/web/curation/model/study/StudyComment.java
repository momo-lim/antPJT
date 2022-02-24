package com.web.curation.model.study;

import java.time.LocalDateTime;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

import org.springframework.data.annotation.CreatedDate;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.web.curation.dto.study.StudyArticleResponse;
import com.web.curation.dto.study.StudyCommentResponse;
import com.web.curation.model.account.MyUser;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@Entity
@NoArgsConstructor
@ToString
public class StudyComment {
	
	@Id
    @GeneratedValue
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "studyArticle_id",
				referencedColumnName = "id",
				updatable = false)
	@JsonBackReference
	private StudyArticle studyArticle ;
    
    @ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "studyCommenter_id",
				referencedColumnName = "id",
				updatable = false)
	@JsonBackReference
	private MyUser studyCommenter;
    
	@Column
	private String content;
	
    @CreatedDate
    @Column(columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP", 
    		insertable = false, 
    		updatable = false)
	private LocalDateTime createDate;
	
    @CreatedDate
	@Column(columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP",
			insertable = false, 
    		updatable = false)
	private LocalDateTime updateDate;
    
    
    
	public StudyCommentResponse toResponse() {
		return new StudyCommentResponse(id, studyArticle.getId(), content, 
								studyCommenter.getId(), studyCommenter.getName(), 
								createDate, updateDate);
	}

	public StudyComment(StudyArticle studyArticle, MyUser studyCommenter, String content) {
		super();
		this.studyArticle = studyArticle;
		this.studyCommenter = studyCommenter;
		this.content = content;
	}
}
