package com.web.curation.service;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.web.curation.dto.alert.AlertMessage;
import com.web.curation.dto.alert.AlertRequest;
import com.web.curation.dto.alert.AlertResponse;
import com.web.curation.dto.alert.ChatMessage;
import com.web.curation.dto.alert.ChatRequest;
import com.web.curation.dto.match.MatchArticleResponse;
import com.web.curation.model.account.MyUser;
import com.web.curation.model.alert.Alert;
import com.web.curation.model.alert.AlertType;
import com.web.curation.model.match.MatchArticle;
import com.web.curation.model.study.Study;
import com.web.curation.model.study.StudyArticle;
import com.web.curation.model.study.StudyComment;
import com.web.curation.model.study.StudyJoin;
import com.web.curation.repository.account.UserRepo;
import com.web.curation.repository.alert.AlertRepo;
import com.web.curation.repository.study.StudyJoinRepo;
import com.web.curation.repository.study.StudyRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AlertService {
    private final SimpMessageSendingOperations messagingTemplate;
    
	@Autowired
	private AlertRepo alertRepo;
	@Autowired
	private StudyJoinRepo joinRepo;
	@Autowired
	private UserRepo userRepo;
	@Autowired
	private StudyRepo studyRepo;
	
	
	//// WebSocket ////
	
	////  알림 보내기
	
	// 스터디의 모든 멤버들에게 게시글 작성 알림
    public void studyArticleToAlert(Long studyId, StudyArticle article) {
    	Study study = checkAndGetStudy(studyId);
    	List<StudyJoin> join = joinRepo.findByjoinStudyId(studyId);
    	
    	join.forEach(member -> {
    		MyUser user = member.getJoinMember();
    		if (user.getId() != article.getStudyWriter().getId()) {
    			Alert alert = new Alert(user.getId(), user.getName(), studyId, study.getName(), article.getId());
            	alert.setAlertType(AlertType.ARTICLE);
            	alert.setMessage(user.getName() + "님, '" + study.getName() + "'에 새 게시글이 작성되었습니다.");
            	Alert newAlert = alertRepo.save(alert);
            	AlertMessage message = new AlertMessage(newAlert.getId(), user.getId(), newAlert.getMessage());
                messagingTemplate.convertAndSend("/alert/" + message.getUserId(), message);
    		}
    	});
    }
    
    // 스터디 게시글 작성자에게 댓글 작성 알림
    public void studyCommentToAlert(Long studyId, StudyComment comment) {
    	Study study = checkAndGetStudy(studyId);
    	StudyArticle article = comment.getStudyArticle();
    	MyUser writer = article.getStudyWriter();
    	Alert alert = new Alert(writer.getId(), writer.getName(), studyId, study.getName(), article.getId());
    	alert.setAlertType(AlertType.COMMENT);
    	alert.setMessage(article.getWriterName() + "님, 게시글에 댓글이 작성되었습니다.");
    	Alert newAlert = alertRepo.save(alert);
    	AlertMessage message = new AlertMessage(newAlert.getId(), writer.getId(), newAlert.getMessage());
        messagingTemplate.convertAndSend("/alert/" + message.getUserId(), message);
    }
    
    // 모집글 신청 결과 승인이면 알림
    public void ApprovedToAlert(Long studyId, Long userId, String userName) {
    	Study study = checkAndGetStudy(studyId);
    	Alert alert = new Alert(userId, userName, studyId, study.getName(), null);
    	alert.setAlertType(AlertType.MATCH);
    	alert.setMessage(userName + "님, '" + study.getName() + "'에 가입되었습니다.");
    	Alert newAlert = alertRepo.save(alert);
    	AlertMessage message = new AlertMessage(newAlert.getId(), userId, newAlert.getMessage());
        messagingTemplate.convertAndSend("/alert/" + message.getUserId(), message);
    }
    
    // 스터디에 초대되면 알림
    public void inviteToAlert(Long studyId, Long userId, String userName) {
    	Study study = checkAndGetStudy(studyId);
    	Alert alert = new Alert(userId, userName, studyId, study.getName(), null);
    	alert.setAlertType(AlertType.INVITE);
    	alert.setMessage(userName + "님, '" + study.getName() + "'에 초대되었습니다.");
    	Alert newAlert = alertRepo.save(alert);
    	AlertMessage message = new AlertMessage(newAlert.getId(), userId, newAlert.getMessage());
        messagingTemplate.convertAndSend("/alert/" + message.getUserId(), message);
    }
    
    // 알림 보내기 방법 2(@sendTo 어노테이션(컨트롤러에 있음))
	public AlertMessage alertWithStudy(Long userId, AlertRequest message) {
		System.out.println(userId);
		System.out.println(message.getContent());
		return new AlertMessage(message.getAlertId(), userId, message.getContent());
	}
	
	public ChatMessage chatting(ChatRequest message) {
		MyUser user = userRepo.findById(message.getUserId()).orElseThrow(() -> new ResponseStatusException(
													HttpStatus.NOT_FOUND, "존재하지 않는 유저 id입니다.",
													new IllegalArgumentException()));
		System.out.println(user.getId());
		System.out.println(message.getContent());
		return new ChatMessage(user.getId(), user.getName(), message.getContent());
	}
	
	
	
	//// API ////
	
    public List<AlertResponse> getAlertList(Long userId) {
    	List<AlertResponse> alertList = new ArrayList<>();
    	alertRepo.findByUserId(userId).forEach(alert -> {
    		AlertResponse response = alert.toResponse();
    		alertList.add(response);
    	});
    	return alertList;
    }
    
    @Transactional
    public void updateAlert(Long userId, Long alertId) {
    	Alert alert = checkAndGetAlert(alertId, userId);
    	alert.setState(true);
    }
    
    public void deleteAlert(Long userId, Long alertId) {
    	checkAndGetAlert(userId, alertId);
    	alertRepo.deleteById(alertId);
    }
    
    /// 객체 확인용
	public Study checkAndGetStudy(Long studyId) {
		return studyRepo.findById(studyId).orElseThrow(() -> new ResponseStatusException(
				HttpStatus.NOT_FOUND, "존재하지 않는 스터디 id입니다.", new IllegalArgumentException()));
	}
	
	public Alert checkAndGetAlert(Long userId, Long alertId) {
		return alertRepo.findByUserIdAndId(userId, alertId)
							.orElseThrow(() -> new ResponseStatusException(
							HttpStatus.BAD_REQUEST, "알림 또는 유저 id를 확인하세요"));
	}
}
