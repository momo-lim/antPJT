package com.web.curation.repository.account;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.web.curation.model.account.MyUser;

public interface UserRepo extends JpaRepository<MyUser, Long> {
	
	MyUser findByEmail(String email);
	boolean existsByEmail(String email);


	
}