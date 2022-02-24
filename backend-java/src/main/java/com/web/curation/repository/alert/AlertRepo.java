package com.web.curation.repository.alert;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.web.curation.model.alert.Alert;


@Repository
public interface AlertRepo extends JpaRepository<Alert, Long> {
	List<Alert> findByUserId(Long userId);
	Optional<Alert> findByUserIdAndId(Long userId, Long id);
}
