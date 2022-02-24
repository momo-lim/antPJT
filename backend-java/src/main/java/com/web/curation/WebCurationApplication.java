package com.web.curation;

import java.util.ArrayList;

import java.util.List;

import org.springframework.boot.CommandLineRunner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.web.curation.model.account.MyRole;
import com.web.curation.model.account.MyUser;
import com.web.curation.service.AccountService;


@SpringBootApplication
public class WebCurationApplication {

	public static void main(String[] args) {
		SpringApplication.run(WebCurationApplication.class, args);
	}
	
	@Bean
	PasswordEncoder passwordEncoder() {
		return new BCryptPasswordEncoder();
	}	
	
	@Bean
	CommandLineRunner run(AccountService accountService) {
		return args ->{
			//권한 생성			
			List<MyRole> roles= accountService.getRoles();
			if(roles.size() ==0) {
				accountService.saveRole(new MyRole(null,"ROLE_USER"));
				accountService.saveRole(new MyRole(null,"ROLE_ADMIN"));
		 		// 임시 user data 추가
				accountService.saveUser(new MyUser(null, "deokkyu@ssafy.com", "ssafy123A!", "김덕규", "question", "answer", new ArrayList<>()));
				accountService.saveUser(new MyUser(null, "qudwns@ssafy.com", "ssafy123A!", "김병준", "question", "answer", new ArrayList<>()));
				accountService.saveUser(new MyUser(null, "wnsgk@ssafy.com", "ssafy123A!", "김준하", "question", "answer", new ArrayList<>()));
				accountService.saveUser(new MyUser(null, "tkddyd@ssafy.com", "ssafy123A!", "서상용", "question", "answer", new ArrayList<>()));
				accountService.saveUser(new MyUser(null, "gusah@ssafy.com", "ssafy123A!", "임현모", "question", "answer", new ArrayList<>()));
				
				accountService.addRoleToUser("deokkyu@ssafy.com", "ROLE_USER");
				accountService.addRoleToUser("deokkyu@ssafy.com", "ROLE_ADMIN");
				accountService.addRoleToUser("qudwns@ssafy.com", "ROLE_USER");
				accountService.addRoleToUser("qudwns@ssafy.com", "ROLE_ADMIN");				
				accountService.addRoleToUser("wnsgk@ssafy.com", "ROLE_USER");
				accountService.addRoleToUser("wnsgk@ssafy.com", "ROLE_ADMIN");
				accountService.addRoleToUser("tkddyd@ssafy.com", "ROLE_USER");				
				accountService.addRoleToUser("tkddyd@ssafy.com", "ROLE_ADMIN");				
				accountService.addRoleToUser("gusah@ssafy.com", "ROLE_USER");
				accountService.addRoleToUser("gusah@ssafy.com", "ROLE_ADMIN");
			}		
			
		};
	}

	
	

}
