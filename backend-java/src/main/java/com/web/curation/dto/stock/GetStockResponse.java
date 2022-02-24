package com.web.curation.dto.stock;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GetStockResponse {

	private String code;
	private String stockName;
	private String curPrice;                // 현재가
	private String diffAmount;           // 전일비
	private String dayRange;             // 등락률
	private String volume;             	// 거래량
	private String tradingValue;		// 거래대금
	private String marketPrice;			// 시가
	private String highPrice;			// 고가
	private String lowPrice;			// 저가
	private String priceType;			// 상승,하락 구분
	private String time;				// 시간
	
	private String dayChartUrl;
	private String weekChartUrl;
	private String month3ChartUrl;
	private String yearChartUrl;
	private String year3ChartUrl;
	private String year5ChartUrl;
	private String year10ChartUrl;
	
	private List<GetSubNewsResponse> newsList;
	

	
}
