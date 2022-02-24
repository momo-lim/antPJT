package com.web.curation.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.web.curation.dto.account.FindPwRequest;
import com.web.curation.dto.account.FindPwResponse;
import com.web.curation.dto.account.FindPwSuccessRequest;
import com.web.curation.model.account.MyRole;
import com.web.curation.model.account.MyUser;
import com.web.curation.model.study.Study;
import com.web.curation.repository.account.RoleRepo;
import com.web.curation.repository.account.UserRepo;
import com.web.curation.repository.study.StudyJoinRepo;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;


@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AccountServiceImpl implements AccountService, UserDetailsService {

	@Autowired
	private UserRepo userRepo;
	@Autowired
	private StudyJoinRepo studyJoinRepo;

	private final RoleRepo roleRepo;
	private final PasswordEncoder passwordEncoder;
	
	@Override
	public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
		MyUser user = userRepo.findByEmail(email);
		if(user==null) {
			log.error("User not found in the database");
			throw new UsernameNotFoundException("User not found in the database");
		}
		else {
			log.info("User found in the database: {}", email);
		}
		Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
		user.getRoles().forEach(role -> {
			authorities.add(new SimpleGrantedAuthority(role.getName()));
		});
		return new org.springframework.security.core.userdetails.User(user.getEmail(), user.getPassword(), authorities);
	}
	
	
	
	@Override
	public MyUser saveUser(MyUser user) {
		log.info("Saving new user {} to the database", user.getEmail());
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return userRepo.save(user);
	}

	@Override
	public MyRole saveRole(MyRole role) {
		log.info("Saving new role {} to the database", role.getName());
		return roleRepo.save(role);
	}

	@Override
	public void addRoleToUser(String email, String roleName) {
		log.info("Adding role {} to user {}	",roleName, email);
		MyUser user = userRepo.findByEmail(email);
		MyRole role = roleRepo.findByName(roleName);
		user.getRoles().add(role);
		
		
	}

	@Override
	public MyUser getUser(String email) {
		log.info("Fetching user {}", email);
		return userRepo.findByEmail(email);
	}

	@Override
	public List<MyUser> getUsers() {
		log.info("Fetching all users ");
		return userRepo.findAll();
	}
	
	public List<MyUser> findAll() {
		List<MyUser> users = new ArrayList<>();
		userRepo.findAll().forEach(u -> users.add(u));
		return users;
	}

	
	public void signUp(MyUser userInfo){
		MyUser user = new MyUser();
		user.setEmail(userInfo.getEmail());
		user.setName(userInfo.getName());
		user.setPassword(passwordEncoder.encode( userInfo.getPassword()));
		user.setQuestion(userInfo.getQuestion());
		user.setAnswer(userInfo.getAnswer());	
		
		userRepo.save(user);

    }
	

	
	public void save(MyUser user) {
		userRepo.save(user);		
	}
	

	
	public Optional<MyUser> findById(Long id) {
		Optional<MyUser> user = userRepo.findById(id);
		return user;
	}

	
	public void deleteById(Long id) {
		MyUser user = userRepo.findById(id).orElseThrow(() -> new ResponseStatusException(
											HttpStatus.NOT_FOUND, "존재하지 않는 유저 id입니다."));
		List<Study> manageStudy = user.getManageStudy();
		if (manageStudy.size() > 0) {
			manageStudy.forEach(study -> {
				if (studyJoinRepo.findByjoinStudyId(study.getId()).size() > 1) {
					throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "관리하고 있는 스터디가 있습니다. leader 위임을 하세요");
				}
			});
		}
		userRepo.deleteById(id);
	}
	
	public void updateById(Long id, MyUser updatedMember) {
		Optional<MyUser> user = userRepo.findById(id);
		if(user.isPresent()) {
			user.get().setPassword(updatedMember.getPassword());
			user.get().setName(updatedMember.getName());
			userRepo.save(user.get());
		}
	}
	
	@Transactional
	public void updateUser(Long id, String password, String question, String answer) {
		MyUser user = userRepo.findById(id).orElseThrow(() -> new IllegalStateException(
				"id of user does not exist"));
		if(password !=null && !Objects.equals(user.getPassword(),passwordEncoder.encode(password) )) {
			
			user.setPassword(passwordEncoder.encode(password));			
		}
		
		if(question !=null && !Objects.equals(user.getQuestion(), question)) {
			user.setQuestion(question);
		}
		
		if(answer !=null && !Objects.equals(user.getAnswer(), answer)) {
			user.setAnswer(answer);
		}
	}

	public MyUser findByEmail(String email) {
		
		MyUser user = userRepo.findByEmail(email);		
		
		return user;
	}
	
	@Override
	public String findPw(FindPwRequest userInfo) {

		String msg = null;
		
		boolean isExistsEmail = userRepo.existsByEmail(userInfo.getEmail());
		
		if(!isExistsEmail) {
			msg = "Is not valid email";
			return msg;
		}
		
		MyUser user = userRepo.findByEmail(userInfo.getEmail());
		FindPwResponse userResponse = new FindPwResponse(null, null);
		userResponse.setId(user.getId());
		userResponse.setEmail(user.getEmail());
		
		if(!userInfo.getQuestion().equals(user.getQuestion())) {
			msg = "Is not valid question";
			return msg;
		}else {
			if(!userInfo.getAnswer().equals(user.getAnswer())) {
				msg ="Is not valid answer";
				return msg;
			}else {
				msg = "Success";
				return msg;
			}			
		}
		
		
		
	}
	
	public boolean existsByEmail(String email) {
		boolean isExists = userRepo.existsByEmail(email);
		
		return isExists;
	}
	
	public boolean checkDupliByEmail(String email) {
		List<String> emails = new ArrayList<>();
		userRepo.findAll().forEach(u -> emails.add(u.getEmail()));
		
		boolean isDupli = false;
		for (String e : emails) {
			if(e.equals(email)) {
				isDupli = true;
				break;
			}			
		}
		
		return isDupli;
	}



	@Override
	public List<MyRole> getRoles() {
		
		return roleRepo.findAll();
	}



	@Override
	public void updatePw(FindPwSuccessRequest userInfo) {
		
		MyUser user = userRepo.findByEmail(userInfo.getEmail()); 
		user.setPassword(passwordEncoder.encode(userInfo.getPassword()));		
		
	}





	
}
