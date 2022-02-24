package com.web.curation.controller;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpStatus.FORBIDDEN;

import java.io.IOException;
import java.net.URI;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
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
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.web.curation.dto.account.FindPwRequest;
import com.web.curation.dto.account.FindPwSuccessRequest;
import com.web.curation.dto.account.GetUserResponse;
import com.web.curation.dto.account.LoginRequest;
import com.web.curation.dto.account.LoginResponse;
import com.web.curation.dto.account.SignupRequest;
import com.web.curation.dto.match.MatchArticleResponse;
import com.web.curation.dto.study.StudyRequest;
import com.web.curation.model.BasicResponse;
import com.web.curation.model.account.MyRole;
import com.web.curation.model.account.MyUser;
import com.web.curation.service.AccountService;
import com.web.curation.service.AccountServiceImpl;
import com.web.curation.service.StudyService;
import com.web.curation.model.match.MatchArticle;
import com.web.curation.repository.account.UserRepo;
import com.web.curation.repository.match.MatchArticleRepo;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.Data;
import lombok.RequiredArgsConstructor;


@ApiResponses(value = { @ApiResponse(code = 401, message = "Unauthorized", response = BasicResponse.class),
        @ApiResponse(code = 403, message = "Forbidden", response = BasicResponse.class),
        @ApiResponse(code = 404, message = "Not Found", response = BasicResponse.class),
        @ApiResponse(code = 500, message = "Failure", response = BasicResponse.class) })

@RestController
@CrossOrigin(origins = { "http://localhost:3000" })
@RequestMapping(value = "/account")
@RequiredArgsConstructor
public class AccountController {
    
	@Autowired
	MatchArticleRepo articleRepo;
    
	@Autowired	
	AccountService accountService;
	@Autowired	
	StudyService studyService;
	
	private final PasswordEncoder passwordEncoder;
	private final UserRepo userRepo;
	
    @GetMapping("")
    @ApiOperation(value = "모든 회원 정보 조회")
    public ResponseEntity<List<GetUserResponse>> getAllUsers(){
    	List<GetUserResponse> users = new ArrayList<>();
		accountService.findAll().forEach(user -> {
    		users.add(user.toResponse());
    	});;	
    	return new ResponseEntity<List<GetUserResponse>>(users,HttpStatus.OK);
    }
    
    @GetMapping("/search")
    @ApiOperation(value = "회원 검색")
    public ResponseEntity<String> searchUser(@RequestParam String email){
    	boolean isExistsEmail = accountService.existsByEmail(email);

    	if(isExistsEmail) {
    		MyUser user = accountService.findByEmail(email);
    		return new ResponseEntity<String>(user.getEmail(), HttpStatus.OK);
    	}
    	    	
    	return new ResponseEntity<String>("none", HttpStatus.OK);
    }
	
    @PostMapping(value="/find_pw")
    @ApiOperation(value= "비밀번호 찾기")
    public ResponseEntity<String> findPw(@RequestBody FindPwRequest userInfo){
    	
    	String res = accountService.findPw(userInfo);
    	System.out.println(res.toString());
    	    	
    	return new ResponseEntity<String>(res, HttpStatus.OK);    	
    }
    
    @PostMapping(value = "/find_pw/success")
    @ApiOperation(value = "비밀번호 찾기 검증 후 비밀번호 변경")
    public ResponseEntity<String> updatePwAfterFindPw(@RequestBody FindPwSuccessRequest userInfo ){
    	
    	accountService.updatePw(userInfo);
    	
		return new ResponseEntity<String>("Update user password", HttpStatus.OK);   	
    }
    
    @PostMapping(value = "/signup")
    @ApiOperation(value = "회원가입")
    public ResponseEntity<String> signUp(@Valid @RequestBody SignupRequest userInfo) {
    	MyUser user = userInfo.toEntity();
    	
    	String emailPattern = "\\w+@\\w+\\.\\w+(\\.\\w+)?";
    	String pwPattern = "(?=.*[0-9])(?=.*[a-zA-Z])(?=.*\\W)(?=\\S+$).{8,16}";
    	
    	boolean isEmail= userInfo.getEmail().matches(emailPattern);
    	boolean isPw= userInfo.getPassword().matches(pwPattern);
    	
//    	이메일 패턴 검사
    	if(!isEmail) {
    		return new ResponseEntity<String>("Not valid email", HttpStatus.BAD_REQUEST);
    	}
    	
//    	이메일 중복 검사
    	if(accountService.checkDupliByEmail(userInfo.getEmail())) {
    		return new ResponseEntity<String>("Duplicate email", HttpStatus.CONFLICT);
    	}    	
    	
//    	비밀번호 패턴 검사
    	if(!isPw) {
    		return new ResponseEntity<String>("Not valid password", HttpStatus.FORBIDDEN);
    	}
    	
    	user.setPassword(passwordEncoder.encode(user.getPassword()));
    	
    	accountService.save( user);
    	accountService.addRoleToUser(user.getEmail(), "ROLE_USER");
    	
    	// 스터디 생성
    	MyUser newUser = userRepo.findByEmail(user.getEmail());
    	StudyRequest form = new StudyRequest();
    	studyService.createStudy(form, newUser.getId());
    	return new ResponseEntity<String>("Accept", HttpStatus.OK);
    }
    
    @GetMapping(value ="/{id}")
    @ApiOperation(value = "회원정보 조회")
    public ResponseEntity<GetUserResponse> getUser(@RequestParam String email ){
    	MyUser user = accountService.findByEmail(email);
    	return new ResponseEntity<GetUserResponse>(user.toResponse(), HttpStatus.OK);
    }
    
    @PutMapping(value ="/{id}")
    @ApiOperation(value = "회원 정보 수정")
    public void updateUser(
    		@PathVariable("id") Long id,
    		@RequestParam(required = false) String password,    		
    		@RequestParam(required = false) String question,
    		@RequestParam(required = false) String answer) {
    	accountService.updateUser(id, password, question, answer);
    }

    @DeleteMapping(value ="/{id}")
    @ApiOperation(value = "회원 탈퇴")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
    	accountService.deleteById(id);
        return new ResponseEntity<Void>(HttpStatus.NO_CONTENT);
    }    
    
	@PostMapping(value ="/user/save")
	public ResponseEntity<MyUser> saveUser(@RequestBody MyUser user) {
		URI uri= URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/account/user/save").toUriString());
		return ResponseEntity.created(uri).body(accountService.saveUser(user));
	}
	
	@PostMapping(value ="/role/save")
	public ResponseEntity<MyRole> saveRole(@RequestBody MyRole role) {
		URI uri= URI.create(ServletUriComponentsBuilder.fromCurrentContextPath().path("/account/role/save").toUriString());
		return ResponseEntity.created(uri).body(accountService.saveRole(role));
	}
	
	@PostMapping(value ="/role/addtouser")
	public ResponseEntity<?> addRoleToUser(@RequestBody RoleToUserForm form) {
		accountService.addRoleToUser(form.getEmail(), form.getRoleName());
		return ResponseEntity.ok().build();
	}
	
	@GetMapping(value ="/token/refresh")
	public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws JsonGenerationException, JsonMappingException, IOException {
		String authorizationHeader = request.getHeader(AUTHORIZATION);
		if(authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
			try {
				String refreshToken = authorizationHeader.substring("Bearer ".length());
				Algorithm algorithm = Algorithm.HMAC256("secret".getBytes());
				JWTVerifier verifier = JWT.require(algorithm).build();
				DecodedJWT decodedJWT = verifier.verify(refreshToken); 
				String email = decodedJWT.getSubject();
				MyUser user = accountService.getUser(email);

				String accessToken = JWT.create()
						.withSubject(user.getEmail())
						.withExpiresAt(new Date(System.currentTimeMillis() + 10 * 60 * 1000))
						.withIssuer(request.getRequestURL().toString())
						.withClaim("roles", user.getRoles().stream().map(MyRole::getName).collect(Collectors.toList()))
						.sign(algorithm);
				
				Map<String, String> tokens = new HashMap<>();
				tokens.put("accessToken", accessToken);
				tokens.put("refreshToken", refreshToken);
				response.setContentType(MediaType.APPLICATION_JSON_VALUE);		
				new ObjectMapper().writeValue(response.getOutputStream(), tokens);
				
			} catch (Exception e) {
				response.setHeader("error", e.getMessage());
				response.setStatus(FORBIDDEN.value());
				//					response.sendError(FORBIDDEN.value());
				Map<String, String> error = new HashMap<>();
				error.put("errorMessage", e.getMessage());
				response.setContentType(MediaType.APPLICATION_JSON_VALUE);		
				new ObjectMapper().writeValue(response.getOutputStream(), error);
			}				
		}
		else {
			throw new RuntimeException("Refresh token is missing");
		}		
	}
	
	@Data
	class RoleToUserForm{
		private String email;
		private String roleName;
	}
    
    @GetMapping("/account/test/{user_id}")
    @ApiOperation(value = "(TEST) 작성한 모집글 보기")
    public List<MatchArticle> getMatchrticles(
    				@PathVariable("user_id") Long user_id) {
    	return articleRepo.findByWriterId(user_id);
    }    
}