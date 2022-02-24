package com.web.curation.service;

import java.util.List;
import java.util.Optional;

import com.web.curation.dto.account.FindPwRequest;
import com.web.curation.dto.account.FindPwSuccessRequest;
import com.web.curation.model.account.MyRole;
import com.web.curation.model.account.MyUser;

public interface AccountService {
	MyUser saveUser(MyUser user);
	MyRole saveRole(MyRole role);	
	void addRoleToUser(String email, String roleName );
	MyUser getUser(String email);
	List<MyUser> getUsers();
	List<MyRole> getRoles();
	
	void signUp(MyUser userInfo);
	void save(MyUser user);
	List<MyUser> findAll();
	Optional<MyUser> findById(Long id);
	void deleteById(Long id);
	void updateById(Long id, MyUser updatedMember);
	void updateUser(Long id, String password, String question, String answer);
	MyUser findByEmail(String email);
	boolean checkDupliByEmail(String email);
	boolean existsByEmail(String email);
	String findPw(FindPwRequest userInfo);
	void updatePw(FindPwSuccessRequest userInfo);
}
