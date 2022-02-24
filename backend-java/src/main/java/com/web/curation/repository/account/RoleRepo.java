package com.web.curation.repository.account;

import org.springframework.data.jpa.repository.JpaRepository;

import com.web.curation.model.account.MyRole;

public interface RoleRepo extends JpaRepository<MyRole, Long> {

	MyRole findByName(String name);
	
}
