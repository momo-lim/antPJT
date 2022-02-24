// 하단 DB 설정 부분은 Sub PJT II에서 데이터베이스를 구성한 이후에 주석을 해제하여 사용.

package com.web.curation.model.account;

import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;
import lombok.AllArgsConstructor;
//import lombok.Data;
import lombok.Data;
import lombok.Getter;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.persistence.Table;

import org.springframework.data.annotation.CreatedDate;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.web.curation.dto.account.GetUserResponse;
import com.web.curation.dto.match.MatchArticleResponse;
import com.web.curation.dto.study.StudyArticleResponse;
import com.web.curation.dto.study.StudyCommentResponse;
import com.web.curation.dto.study.StudyResponse;
import com.web.curation.model.alert.Alert;
import com.web.curation.model.match.MatchArticle;
import com.web.curation.model.match.MatchJoin;
import com.web.curation.model.study.Study;
import com.web.curation.model.study.StudyArticle;
import com.web.curation.model.study.StudyComment;
import com.web.curation.model.study.StudyJoin;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Pattern;


@Getter
@Setter
@Entity
@NoArgsConstructor
@AllArgsConstructor
public class MyUser {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
	
    @Column    
    @NotBlank(message = "이메일은 필수 입력 값입니다.")
    @Email(message = "이메일 형식에 맞지 않습니다.")
    private String email;

    @Column
    @NotBlank(message = "비밀번호는 필수 입력 값입니다.")
//    @Pattern(regexp = "(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\\W)(?=\\S+$).{8,16}", message = "비밀번호는 8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.")

    private String password;

    @Column
    @NotBlank(message = "이름은 필수 입력 값입니다.")
    private String name;
    
    private String question;    
    private String answer;
    
    @ManyToMany(fetch = FetchType.EAGER)
//    @ManyToMany(cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    private Collection<MyRole> roles = new ArrayList<>();

    @CreatedDate
    @Column(columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP", 
    		insertable = false, 
    		updatable = false)
    private LocalDateTime createDate;
    
    @OneToMany(mappedBy="writer", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @JsonManagedReference
    private List<MatchArticle> matchArticles = new ArrayList<MatchArticle>();
    
    @OneToMany(mappedBy="joinUser", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @JsonManagedReference
    private List<MatchJoin> matchJoinArticles = new ArrayList<MatchJoin>();
    
    
    @OneToMany(mappedBy="joinMember", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @JsonManagedReference
    private List<StudyJoin> joinStudy = new ArrayList<StudyJoin>();
    
    @OneToMany(mappedBy="studyWriter", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @JsonManagedReference
    private List<StudyArticle> studyArticles = new ArrayList<StudyArticle>();
    
    @OneToMany(mappedBy="studyCommenter", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @JsonManagedReference
    private List<StudyComment> studyComments = new ArrayList<StudyComment>();
    
    @OneToMany(mappedBy="leader", cascade = CascadeType.ALL, orphanRemoval = true)
    @ToString.Exclude
    @JsonManagedReference
    private List<Study> manageStudy = new ArrayList<Study>();
    
    
    
    public MyUser(@NotBlank(message = "이메일은 필수 입력 값입니다.") String email,
			@NotBlank(message = "비밀번호는 필수 입력 값입니다.") @Pattern(regexp = "(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\\W)(?=\\S+$).{8,16}", message = "비밀번호는 8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.") String password) {
    	super();
    	this.email = email;
    	this.password = password;
    }

		
	public MyUser(@NotBlank(message = "이메일은 필수 입력 값입니다.") String email,
			@NotBlank(message = "비밀번호는 필수 입력 값입니다.") @Pattern(regexp = "(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\\W)(?=\\S+$).{8,16}", message = "비밀번호는 8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.") String password,
			@NotBlank(message = "이름은 필수 입력 값입니다.") String name, String question, String answer) {
		super();
		this.email = email;
		this.password = password;
		this.name = name;		
		this.question = question;
		this.answer = answer;
	}
	
	public MyUser(Long id, String email, String name, String question, String answer) {
		super();
		this.id = id;
		this.email = email;
		this.name = name;
		this.question = question;
		this.answer = answer;
	}


	
    public MyUser(Long id, @NotBlank(message = "이메일은 필수 입력 값입니다.") @Email(message = "이메일 형식에 맞지 않습니다.") String email,
			@NotBlank(message = "비밀번호는 필수 입력 값입니다.") @Pattern(regexp = "(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\\W)(?=\\S+$).{8,16}", message = "비밀번호는 8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.") String password,
			@NotBlank(message = "이름은 필수 입력 값입니다.") String name, String question, String answer,
			Collection<MyRole> roles) {
		super();
		this.id = id;
		this.email = email;
		this.password = password;
		this.name = name;
		this.question = question;
		this.answer = answer;
		this.roles = roles;
	}

	public MyUser(Long id, @NotBlank(message = "이메일은 필수 입력 값입니다.") @Email(message = "이메일 형식에 맞지 않습니다.") String email,
			@NotBlank(message = "이름은 필수 입력 값입니다.") String name, String question, String answer,
			Collection<MyRole> roles, LocalDateTime createDate, List<MatchArticle> matchArticles,
			List<MatchJoin> matchJoinArticles, List<StudyJoin> joinStudy, List<StudyArticle> studyArticles,
			List<StudyComment> studyComments, List<Study> manageStudy) {
		super();
		this.id = id;
		this.email = email;
		this.name = name;
		this.question = question;
		this.answer = answer;
		this.roles = roles;
		this.createDate = createDate;
		this.matchArticles = matchArticles;
		this.matchJoinArticles = matchJoinArticles;
		this.joinStudy = joinStudy;
		this.studyArticles = studyArticles;
		this.studyComments = studyComments;
		this.manageStudy = manageStudy;
	}
    
    public GetUserResponse toResponse() {
    	List<String> rRes = new ArrayList<>();
    	roles.forEach(role -> {rRes.add(role.getName());});
    	List<MatchArticleResponse> maRes = new ArrayList<>();
    	matchArticles.forEach(article -> {maRes.add(article.toResponse());});
       	List<MatchArticleResponse> mjaRes = new ArrayList<>();
    	matchJoinArticles.forEach(article -> {mjaRes.add(article.getJoinArticle().toResponse());});
    	List<StudyResponse> sRes = new ArrayList<>();
    	joinStudy.forEach(study -> {sRes.add(study.getJoinStudy().toResponse());});
    	List<StudyArticleResponse> saRes = new ArrayList<>();
    	studyArticles.forEach(article -> {saRes.add(article.toResponse());});
    	List<StudyCommentResponse> scRes = new ArrayList<>();
    	studyComments.forEach(comment -> {scRes.add(comment.toResponse());});
    	List<StudyResponse> smRes = new ArrayList<>();
    	manageStudy.forEach(study -> {smRes.add(study.toResponse());});
    	return new GetUserResponse(id, email, name, question, answer, createDate,
    							rRes, maRes, mjaRes, sRes, saRes, scRes, smRes);
    }
    
    
}
