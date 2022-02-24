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
public class GetStockMarketResponse {

	private String time;
	
	private GetStockMarket kospi;
	private GetStockMarket kosdaq;
	private GetStockMarket kospi200;
	
}
