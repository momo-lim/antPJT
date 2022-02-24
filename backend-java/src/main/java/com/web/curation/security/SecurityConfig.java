package com.web.curation.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.web.curation.service.filter.CustomAuthenticationFilter;
import com.web.curation.service.filter.CustomAuthorizationFilter;

import lombok.RequiredArgsConstructor;

@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@ComponentScan(basePackages = {"com.web.curation"})
@RequiredArgsConstructor
public class SecurityConfig extends WebSecurityConfigurerAdapter{

	private final UserDetailsService userDetailsService;
	private final BCryptPasswordEncoder bCryptPasswordEncoder;
	
	@Override
	protected void configure(AuthenticationManagerBuilder auth) throws Exception {
		auth.userDetailsService(userDetailsService).passwordEncoder(bCryptPasswordEncoder);
	}

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		CustomAuthenticationFilter customAuthenticationFilter = new CustomAuthenticationFilter(authenticationManagerBean());
		customAuthenticationFilter.setFilterProcessesUrl("/account/login");
		http.csrf().disable();
		http.sessionManagement().sessionCreationPolicy(SessionCreationPolicy.STATELESS);
//		http.authorizeRequests().anyRequest().permitAll();
		http.addFilter(new CustomAuthenticationFilter(authenticationManagerBean()));
		http.authorizeRequests().antMatchers("/account/login", "/account/token/refresh", "/account/signup", 
				"/account/find_pw", "/account/find_pw/success", "/account/search").permitAll();
//		http.authorizeRequests().antMatchers("/account").permitAll();
		http.authorizeRequests().antMatchers(HttpMethod.OPTIONS, "/oauth/token").permitAll();		
		http.authorizeRequests().antMatchers(HttpMethod.GET, "/finance/**").permitAll();
		http.authorizeRequests().antMatchers(HttpMethod.GET, "/account/user/**").hasAnyAuthority("ROLE_USER");
		http.authorizeRequests().antMatchers(HttpMethod.GET, "/account").hasAnyAuthority("ROLE_ADMIN");
		http.authorizeRequests().antMatchers(HttpMethod.POST, "/account/user/save/**").hasAnyAuthority("ROLE_ADMIN");
		http.authorizeRequests().anyRequest().authenticated();
		http.addFilter(customAuthenticationFilter);
		http.addFilterBefore(new CustomAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class);
		
//		http.authorizeRequests().antMatchers("/myaccount/login").permitAll();
//		http.authorizeRequests().antMatchers("/myaccount/**", "/myaccount/token/refresh").permitAll();
//		http.authorizeRequests().antMatchers(HttpMethod.GET,"/myaccount/user/**").hasAnyAuthority("ROLE_USER");
//		http.authorizeRequests().antMatchers(HttpMethod.POST,"/myaccount/user/save/**").hasAnyAuthority("ROLE_ADMIN");
//		http.authorizeRequests().anyRequest().authenticated();
//		http.addFilter(customAuthenticationFilter);
//		http.addFilterBefore(new CustomAuthorizationFilter(), UsernamePasswordAuthenticationFilter.class);
	}

	@Override
	public void configure(WebSecurity web) throws Exception {
		
		web.ignoring().antMatchers("/v2/api-docs",
                "/configuration/ui",
                "/swagger-resources/**",
                "/configuration/security",
                "/configuration/**",
                "/swagger-ui.html",
                "/webjars/**",
                "/happy-ant-websocket/**",
				// 아래는 index.html 테스트 용
                "/app.js",
				"/app.js:**",
				"/favicon.ico",
				"/main.css",
                "/");

	}
	
	@Bean
	@Override
	public AuthenticationManager authenticationManagerBean() throws Exception{
		return super.authenticationManagerBean();
	}
	

}
