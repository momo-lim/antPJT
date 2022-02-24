package com.web.curation.service;

import java.util.ArrayList;

import java.util.List;
import java.util.Objects;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.server.ResponseStatusException;

import com.web.curation.dto.match.MatchArticleRequest;
import com.web.curation.dto.match.MatchArticleResponse;
import com.web.curation.dto.match.MatchJoinUserResponse;
import com.web.curation.dto.study.StudyArticleRequest;
import com.web.curation.dto.study.StudyArticleResponse;
import com.web.curation.dto.study.StudyCommentResponse;
import com.web.curation.dto.study.StudyJoinUserResponse;
import com.web.curation.dto.study.StudyRequest;
import com.web.curation.dto.study.StudyResponse;
import com.web.curation.model.account.MyUser;
import com.web.curation.model.match.MatchArticle;
import com.web.curation.model.match.MatchJoin;
import com.web.curation.model.study.Study;
import com.web.curation.model.study.StudyArticle;
import com.web.curation.model.study.StudyComment;
import com.web.curation.model.study.StudyJoin;
import com.web.curation.repository.account.UserRepo;
import com.web.curation.repository.alert.AlertRepo;
import com.web.curation.repository.match.MatchArticleRepo;
import com.web.curation.repository.study.StudyArticleRepo;
import com.web.curation.repository.study.StudyCommentRepo;
import com.web.curation.repository.study.StudyJoinRepo;
import com.web.curation.repository.study.StudyRepo;
import com.web.curation.specification.MatchArticleSpec;
import com.web.curation.specification.StudyArticleSpec;

@Service
public class StudyService {
	
	@Autowired
	private StudyRepo studyRepo;
	@Autowired
	private UserRepo userRepo;
	@Autowired
	private StudyJoinRepo joinRepo;
	@Autowired
	private MatchArticleRepo MatchArticleRepo;
	@Autowired
	private StudyArticleRepo articleRepo;
	@Autowired
	private StudyCommentRepo commentRepo;
	@Autowired
	private AlertService alertService;

	
	// 스터디 존재 확인
	public Study checkAndGetStudy(Long studyId) {
		return studyRepo.findById(studyId).orElseThrow(() -> new ResponseStatusException(
				HttpStatus.NOT_FOUND, "존재하지 않는 스터디 id입니다.", new IllegalArgumentException()));
	}
	// 유저 존재 확인
	public MyUser checkAndGetUser(Long userId) {
		return userRepo.findById(userId).orElseThrow(() -> new ResponseStatusException(
				HttpStatus.NOT_FOUND, "존재하지 않는 유저 id입니다.", new IllegalArgumentException()));
	}
	
	
    public List<StudyArticleResponse> getArticleList(Long studyId) {
    	checkAndGetStudy(studyId);
    	List<StudyArticleResponse> articleList = new ArrayList<>();
    	
    	articleRepo.findByStudyId(studyId).forEach(article -> {
    		StudyArticleResponse response = article.toResponse();
    		articleList.add(response);
    	});
    	return articleList;
    }
    
    public StudyArticleResponse getArticle(Long studyId, Long articleId) {
    	StudyArticle article = checkAndGetStudyArticle(studyId, articleId);
    	StudyArticleResponse response = article.toResponse();
    	return response;
    }
    

    // 스터디에 게시글 작성하면 alert
    public void addNewArticle(Long studyId, Long writerId, StudyArticleRequest form) {
    	Study study = checkAndGetStudy(studyId);
    	MyUser writer = checkAndGetUser(writerId);
    	
    	checkStudyMember(studyId, writerId);
    	
    	StudyArticle article = new StudyArticle(study, writer, writer.getName(),
    							form.getTitle(), form.getContent(),
    							form.getStockCode(), form.getStockName(), form.getStockPrice());
    	StudyArticle newArticle = articleRepo.save(article);
    	
    	// 멤버가 있는 스터디의 모든 멤버에게 게시글 작성 알림
    	// 최초생성 직후 또는 멤버 추방/탈퇴로 혼자가 된 경우 알림 X
    	// 작성자한테는 알림X
    	if (study.getStudyMembers().size() > 1) {
    		alertService.studyArticleToAlert(studyId, newArticle);
    	}
    }
    
    @Transactional // 변경된 데이터를 DB에 저장
    public void updateArticle(
    		Long studyId,
    		Long articleId,
    		Long userId,
    		String title,
    		String content) {
    	StudyArticle article = checkAndGetStudyArticle(studyId, articleId);
    	checkWriter(article.getStudyWriter().getId(), userId);
    	
    	if (title != null && title.length() > 0 && !Objects.equals(article.getTitle(), title)) {
    		article.setTitle(title);
    	}
    	
    	if (content != null && content.length() > 0 && !Objects.equals(article.getContent(), content)) {
    		article.setContent(content);
    	}
    }
    
    @Transactional
    public void deleteArticle(Long studyId, Long articleId, Long userId) {
    	StudyArticle article = checkAndGetStudyArticle(studyId, articleId);
    	checkWriter(article.getStudyWriter().getId(), userId);
    	articleRepo.deleteByStudyIdAndId(studyId, articleId);
    }
    
    
    // 검색 키워드 하나로  '특정 스터디'의 제목  or 내용 검색하기
    public List<StudyArticleResponse> searchArticle(Long studyId, String keyWord) {
    	checkAndGetStudy(studyId);
    	List<StudyArticleResponse> articleList = new ArrayList<>();
    	
		articleRepo.findAll(StudyArticleSpec.searchWith(studyId, keyWord)).forEach(article -> {
			StudyArticleResponse response = article.toResponse();
    		articleList.add(response);
		});
    	return articleList;
    }
	
    // 작성자로 검색
    public List<StudyArticleResponse> searchArticleWithWriter(Long studyId, String Keyword) {
    	List<StudyArticleResponse> articleList = new ArrayList<>();
    	articleRepo.findByStudyWriterNameContains(Keyword).forEach(article -> {
    		StudyArticleResponse response = article.toResponse();
    		articleList.add(response);
    	});
    	return articleList;
    }
    
    // 주식 종목을 첨부한 게시글 검색
    public List<StudyArticleResponse> searchArticleWithStockName(Long studyId, String Keyword) {
    	List<StudyArticleResponse> articleList = new ArrayList<>();
    	articleRepo.findByStockNameContains(Keyword).forEach(article -> {
    		StudyArticleResponse response = article.toResponse();
    		articleList.add(response);
    	});
    	return articleList;
    }
    
    // 아래는 댓글
    // 아래는 댓글
    
    // 스터디의 게시글인지 확인
    public StudyArticle checkAndGetStudyArticle(Long studyId, Long articleId) {
    	// articleId로 존재여부 조회 -> studyId 비교
    	return articleRepo.findByStudyIdAndId(studyId, articleId)
					.orElseThrow(() -> new ResponseStatusException(
					HttpStatus.BAD_REQUEST, "스터디 또는 게시글 id를 확인하세요",
					new IllegalArgumentException()));
    }
    
    // 스터디의 멤버인지 확인
    public StudyJoin checkStudyMember(Long studyId, Long userId) {
    	return joinRepo.findByJoinMemberIdAndJoinStudyId(userId, studyId).orElseThrow(() ->
    			new ResponseStatusException(
    				HttpStatus.BAD_REQUEST, userId + " 번 유저는 스터디 멤버(리더)가 아닙니다.",
    				new IllegalArgumentException()));
    }
    
    // 게시글의 댓글인지 확인
    public StudyComment CheckAndGetComment(Long articleId, Long commentId) {
    	return commentRepo.findByStudyArticleIdAndId(articleId, commentId)
			    			.orElseThrow(() -> new ResponseStatusException(
			    					HttpStatus.BAD_REQUEST, "게시글 또는 댓글 id를 확인하세요",
			    					new IllegalArgumentException()));
    }
    
    // 작성자인지 확인
    public void checkWriter(Long writerId, Long userId) {
    	if (writerId != userId) {
    		throw new ResponseStatusException(
    				HttpStatus.BAD_REQUEST, "게시글(댓글) 작성자가 아닙니다.",
    				new IllegalArgumentException());
    	}
    }
    
    public List<StudyCommentResponse> getCommentList(Long studyId, Long articleId) {
    	checkAndGetStudyArticle(studyId, articleId);
    	
    	List<StudyCommentResponse> commentList = new ArrayList<>();
    	
    	commentRepo.findByStudyArticleId(articleId).forEach(comment -> {
    		StudyCommentResponse response = comment.toResponse();
    		commentList.add(response);
    	});
    	
    	return commentList;
    }
	
    // 스터디 게시글 작성자에게 alert
    public void addNewComment(Long studyId, Long articleId, Long loginUserId, String content) {
    	MyUser writer = checkAndGetUser(loginUserId);
    	StudyArticle article = checkAndGetStudyArticle(studyId, articleId);
    	checkStudyMember(studyId, loginUserId);
    	
    	StudyComment comment = new StudyComment(article, writer, content);
    	StudyComment newComment = commentRepo.save(comment);
    	// 작성자가 아닌 다른 유저가 댓글 달면 작성자에게 alert
    	if (article.getStudyWriter().getId() != writer.getId()) {
    		alertService.studyCommentToAlert(studyId, newComment);
    	}
    }
    
    @Transactional // 변경된 데이터를 DB에 저장
    public void updateComment(Long studyId, Long articleId, Long commentId, Long userId, String content) {
    	checkAndGetStudyArticle(studyId, articleId);

    	StudyComment comment = CheckAndGetComment(articleId, commentId);
    	checkWriter(comment.getStudyCommenter().getId(), userId);
    	if (content != null && content.length() > 0 && !Objects.equals(comment.getContent(), content)) {
    		comment.setContent(content);
    	}
    }
    
    @Transactional
    public void deleteComment(Long studyId, Long articleId, Long commentId, Long userId) {
    	checkAndGetStudyArticle(studyId, articleId);
    	StudyComment comment = CheckAndGetComment(articleId, commentId);
    	checkWriter(comment.getStudyCommenter().getId(), userId);
    	commentRepo.deleteByStudyArticleIdAndId(articleId, commentId);
    }
    
    public List<StudyJoinUserResponse> searchMember(Long studyId) {
    	checkAndGetStudy(studyId);
    	List<StudyJoinUserResponse> response = new ArrayList<>();
    	joinRepo.findByjoinStudyId(studyId).forEach(join -> {
    		response.add(join.toJoinUserResponse());
    	});
    	return response;
    }
    
    ////// 스터디 관리

    @Transactional
    public void delegateLeader(Long studyId, Long userId, Long loginUserId) {
    	checkAndGetStudy(studyId);
    	MyUser user = checkAndGetUser(userId);
    	// 스터디 멤버(리더)인지 검증
    	StudyJoin loginUser = checkStudyMember(studyId, loginUserId);
    	StudyJoin newLeader = checkStudyMember(studyId, userId);
    	if (!loginUser.getLeader()) {
    		throw new ResponseStatusException(
    				HttpStatus.BAD_REQUEST, "leader 권한이 없습니다.",
    				new IllegalArgumentException());
    	} else if (userId == loginUserId) {
    		throw new ResponseStatusException(
    				HttpStatus.BAD_REQUEST, "위임할 유저를 선택하세요",
    				new IllegalArgumentException());
    	} else {
    		Study study = checkAndGetStudy(studyId);
    		loginUser.setLeader(false);
    		newLeader.setLeader(true);
    		study.setLeader(user);
    	}
    }
    
    @Transactional
    public void deleteMember(Long studyId, Long userId, Long loginUserId) {
    	checkAndGetStudy(studyId);
    	checkAndGetUser(userId);
    	// 스터디 멤버(리더)인지 검증
    	StudyJoin loginUser = checkStudyMember(studyId, loginUserId);
    	checkStudyMember(studyId, userId);
    	if (loginUser.getLeader()) {
    		// 로그인 한 유저가 리더이면 다른 유저 추방 가능
    		if (userId == loginUserId) {
    			throw new ResponseStatusException(
    					HttpStatus.BAD_REQUEST, "리더는 탈퇴할 수 없습니다.",
    					new IllegalArgumentException());
    		} else {
    			joinRepo.deleteByJoinStudyIdAndJoinMemberId(studyId, userId);
    		}
    	// 로그인한 유저가 리더가 아니면 탈퇴 가능
    	} else if (userId == loginUserId) {
    		joinRepo.deleteByJoinStudyIdAndJoinMemberId(studyId, userId);
    	} else {
    		throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST, "userId와 loginUserId가 일치하지 않습니다.",
					new IllegalArgumentException());
    	}
    }
    
    public void inviteUser(Long studyId, String email) {
    	checkAndGetStudy(studyId);
    	MyUser user = userRepo.findByEmail(email);
    	if (user == null) {
    		throw new ResponseStatusException(
					HttpStatus.NOT_FOUND, "존재하지 않는 유저 email입니다.");
    	}
		if (joinRepo.findByJoinMemberIdAndJoinStudyId(user.getId(), studyId).isPresent()) {
    		throw new ResponseStatusException(
    				HttpStatus.BAD_REQUEST,
    				"이미 스터디에 가입한 회원입니다.",
    				new IllegalArgumentException());
		} else {
	    	// alert
	    	alertService.inviteToAlert(studyId, user.getId(), user.getName());
		}

    }

	// 스터디에서 '초대'로 멤버 추가
	@Transactional
	public void addNewStudyMember(Long studyId, Long joinUserId) {
		Study study = checkAndGetStudy(studyId);
		MyUser joinUser = checkAndGetUser(joinUserId);
		if (joinRepo.findByJoinMemberIdAndJoinStudyId(joinUserId, studyId).isPresent()) {
    		throw new ResponseStatusException(
    				HttpStatus.BAD_REQUEST,
    				"이미 스터디에 가입한 회원입니다.",
    				new IllegalArgumentException());
		} else {
			// 스터디에 유저추가(멤버)
			StudyJoin join = new StudyJoin(null, joinUser, study, false);
			joinRepo.save(join);
			alertService.ApprovedToAlert(studyId, joinUserId, joinUser.getName());
		}
	}
    
    public Long createStudy(StudyRequest form, Long userId) {
    	MyUser user = checkAndGetUser(userId);
    	Study study = form.toEntity();
    	study.setLeader(user);
    	if (study.getName() == null) {
    		study.setName(user.getName() + "의 스터디");
    	}
    	Study newStudy = studyRepo.save(study);
    	// 조인 테이블에도 추가
    	StudyJoin join = new StudyJoin(null, user, study, true);
		joinRepo.save(join);
		return newStudy.getId();
    }
    
    public StudyResponse getStudy(Long studyId) {
    	StudyResponse response = checkAndGetStudy(studyId).toResponse();
    	return response;
    }
    
    @Transactional // 변경된 데이터를 DB에 저장
    public void updateStudy(
    		Long studyId,
    		Long loginUserId,
    		String name,
    		String interest) {
    	Study study = checkAndGetStudy(studyId);
    	if (study.getLeader().getId() != loginUserId) {
    		throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST, "leader 권한이 없습니다.",
					new IllegalArgumentException());
    	}
    	if (name != null && name.length() > 0 && !Objects.equals(study.getName(), name)) {
    		study.setName(name);
    	}
    	if (interest != null && interest.length() > 0 && !Objects.equals(study.getInterest(), interest)) {
    		study.setInterest(interest);
    	}
    }
    
    @Transactional
    public void deleteStudy(Long studyId, Long loginUserId) {
    	Study study = checkAndGetStudy(studyId);
    	if (study.getLeader().getId() != loginUserId) {
    		throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST, "leader 권한이 없습니다.");
    	}
    	if (joinRepo.findByjoinStudyId(studyId).size() > 1) {
    		throw new ResponseStatusException(
					HttpStatus.BAD_REQUEST, "멤버가 없는 스터디만 폐쇄 가능합니다.");
    	}
    	studyRepo.deleteById(studyId);
    }
}
