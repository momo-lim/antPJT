package com.web.curation.dto.account;

import com.web.curation.model.account.MyUser;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@AllArgsConstructor
@ToString
public class SignupRequest {
	
    private String email;
    private String password;
    private String name;   
    private String question;
    private String answer;
    
    public MyUser toEntity() {    	
    	
//    	id, email, password, name, age, score, question, answer, createDates
    	return new MyUser( email, password, name, question, answer);
    }
    
}
