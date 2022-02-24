package com.web.curation.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.web.curation.component.stock.JsoupComponent;
import com.web.curation.dto.stock.GetNewsResponse;
import com.web.curation.dto.stock.GetStockListResponse;
import com.web.curation.dto.stock.GetStockMarketResponse;
import com.web.curation.dto.stock.GetStockResponse;
import com.web.curation.model.stock.Stock;
import com.web.curation.repository.stock.StockRepo;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StockService {

private final JsoupComponent jsoupComponent;
private final StockRepo stockRepo;


	public List<Stock> getAllStocks(){
		
		return stockRepo.findAll();
	}

	public boolean existsByStockName(String stockName) {
		
		boolean isExists = stockRepo.existsByStockName(stockName);
		
		return isExists;
	}
  
	public List<Stock> searchStockList(String stockName){
		
		List<Stock> stockList = stockRepo.findByStockNameContaining(stockName);
		
		return stockList;		
	}
	
	public Stock getStockByName(String stockName) {
		
		Stock stock = stockRepo.findByStockName(stockName);
		return stock;
	}
	
	public String getStockCodeByName(String stockName) {
		
		Stock stock = stockRepo.findByStockName(stockName);
		
		return stock.getStockCode();
	}		  
	  
	public List<GetStockListResponse> getKospiStockList() {
		return jsoupComponent.getKospiStockList();
	}
	  
	public List<GetStockListResponse> getKosdaqStockList(){
		return jsoupComponent.getKosdaqStockList();
	}
	  
	public GetStockResponse getStock(String code) {
		return jsoupComponent.getStockInfo(code);
	}
	
	public List<GetNewsResponse> getNewsInfo(){
		return jsoupComponent.getNewsInfo();
	}
	
	public GetStockMarketResponse getTodayStockInfo() {
		return jsoupComponent.getTodayStockInfo();
	}

}
