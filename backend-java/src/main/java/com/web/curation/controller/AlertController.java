package com.web.curation.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.util.HtmlUtils;


import com.web.curation.dto.alert.AlertMessage;
import com.web.curation.dto.alert.AlertRequest;
import com.web.curation.dto.alert.AlertResponse;
import com.web.curation.dto.alert.ChatMessage;
import com.web.curation.dto.alert.ChatRequest;
import com.web.curation.dto.study.StudyArticleResponse;
import com.web.curation.service.AlertService;
import com.web.curation.service.MatchService;

import io.swagger.annotations.ApiOperation;

@CrossOrigin(origins = { "http://localhost:3000" })
@RestController // Json 형태로 객체 데이터를 반환
@RequestMapping("alert")
public class AlertController {
	
	@Autowired
    private AlertService alertService;
	
	// WebSocket
	@MessageMapping("/alert/{userId}") // 채팅 기능 용도 (메시지를 보내는 주소: /app/alert/{userId}) (알림 기능에서는 필요없음)
	@SendTo("/alert/{userId}") // (웹소켓 주소: 프론트에서 연결하면 메시지 받을 수 있음)
	public AlertMessage alertWithStudy(@DestinationVariable("userId") Long userId, AlertRequest message) {
		return alertService.alertWithStudy(userId, message);
	}
	
	@MessageMapping("/study/{studyId}") // 채팅 기능 용도 (메시지를 보내는 주소: /app/study/{studyId})
	@SendTo("/study/{studyId}") // (웹소켓 주소: 프론트에서 연결하면 메시지 받을 수 있음)
	public ChatMessage chat(ChatRequest message) {
		return alertService.chatting(message);
	}
	
	
	// API
	@GetMapping("{userId}")
    @ApiOperation(value = "알림 목록 조회")
    public List<AlertResponse> getAlertList(@PathVariable("userId") Long userId) {
    	return alertService.getAlertList(userId);
    }
	
	@PutMapping("{userId}/{alertId}")
	@ApiOperation(value = "알림 '읽음'로 수정")
	public void updateAlert(@PathVariable("userId") Long userId,
							@PathVariable("alertId") Long alertId) {
		alertService.updateAlert(userId, alertId);
	}
	
	@DeleteMapping("{userId}/{alertId}")
	@ApiOperation(value = "알림 삭제")
	public void deleteAlert(@PathVariable("userId") Long userId,
							@PathVariable("alertId") Long alertId) {
		alertService.deleteAlert(userId, alertId);
	}
}
