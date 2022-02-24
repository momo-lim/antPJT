package com.web.curation.dto.stock;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GetStockListResponse {

	private String no;
	private String stockName;
	private String curPrice;                // 현재가
	private String diffAmount;           // 전일비
	private String dayRange;             // 등락률
	private String parValue;             // 액면가
	private String marketCap;            // 시가총액
	private String numOfListedShares; 	// 상장 주식 수
	private String foreignRate;       	// 외국인 비율
	private String volume;             	// 거래량
	private String per;                  // per
	private String roe;                  // roe
	private String discussionRoomUrl;    // 토론방 url

	
	public String getDiscussionRoomUrl() {
		return "https://finance.naver.com"+discussionRoomUrl;
	}
	
	
	
	
}
