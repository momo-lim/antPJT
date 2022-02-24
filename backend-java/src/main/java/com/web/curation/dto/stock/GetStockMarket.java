package com.web.curation.dto.stock;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class GetStockMarket {

	private String name;
	private String price;
	private String variablePrice;
	private String dayRange;
	private String img;
	
}
