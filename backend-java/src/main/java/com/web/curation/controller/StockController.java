package com.web.curation.controller;

import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.web.curation.dto.stock.GetNewsResponse;
import com.web.curation.dto.stock.GetStockListResponse;
import com.web.curation.dto.stock.GetStockMarketResponse;
import com.web.curation.dto.stock.GetStockResponse;
import com.web.curation.model.BasicResponse;
import com.web.curation.model.stock.Stock;
import com.web.curation.service.StockService;

import io.swagger.annotations.ApiOperation;
import io.swagger.annotations.ApiResponse;
import io.swagger.annotations.ApiResponses;
import lombok.RequiredArgsConstructor;

@ApiResponses(value = { @ApiResponse(code = 401, message = "Unauthorized", response = BasicResponse.class),
        @ApiResponse(code = 403, message = "Forbidden", response = BasicResponse.class),
        @ApiResponse(code = 404, message = "Not Found", response = BasicResponse.class),
        @ApiResponse(code = 500, message = "Failure", response = BasicResponse.class) })

@RestController
@CrossOrigin(origins = { "http://localhost:3000" })
@RequestMapping(value = "/finance")
@RequiredArgsConstructor
public class StockController {

	private final StockService stockService;
	
	@GetMapping("/today/stock")
	@ApiOperation(value = "오늘의 증시 정보 조회")
	public ResponseEntity<GetStockMarketResponse> getTodayKospiInfo(){
		return new ResponseEntity<GetStockMarketResponse> (stockService.getTodayStockInfo(), HttpStatus.OK);
	}
	
	@GetMapping("/news")
	@ApiOperation(value = "뉴스 정보 조회(https://finance.naver.com/news/mainnews.naver)")
	public ResponseEntity<List<GetNewsResponse>> getNewsInfo(){
		return new ResponseEntity<List<GetNewsResponse>> (stockService.getNewsInfo(), HttpStatus.OK);
	}
	
	@GetMapping("/kospi")
	@ApiOperation(value = "코스피 시가총액 50순위 종목 조회")
	public ResponseEntity<List<GetStockListResponse>> getKospiStockList(HttpServletRequest request) {
		return new ResponseEntity<List<GetStockListResponse>> (stockService.getKospiStockList(), HttpStatus.OK);
	
	}
	
	@GetMapping("/kosdaq")
	@ApiOperation(value = "코스닥 시가총액 50순위 종목 조회")
	public ResponseEntity<List<GetStockListResponse>> getKosdaqStockList(HttpServletRequest request){
		return new ResponseEntity<List<GetStockListResponse>> (stockService.getKosdaqStockList(), HttpStatus.OK);
	}
	
	@GetMapping("/{code}")
	@ApiOperation(value = "종목 상세 정보 조회")
	public ResponseEntity<GetStockResponse> getStockInfo(@PathVariable String code){
		return new ResponseEntity<GetStockResponse> (stockService.getStock(code), HttpStatus.OK);
	}
	
	
	@GetMapping("/search")
	@ApiOperation(value = "종목 검색 결과 조회(포함 검색)")
	public ResponseEntity<List<Stock>> searchStock(@RequestParam String stockName ){
		
		List<Stock> stockList = new ArrayList<>();
		
		stockList = stockService.searchStockList(stockName);
		
		return new ResponseEntity<List<Stock>> (stockList, HttpStatus.OK);		
	}
	
	@GetMapping("/search/{stockName}")
	@ApiOperation(value = "종목 검색 결과 조회(일치 검색)")
	public ResponseEntity<Stock> getStockByName(@RequestParam String stockName){
		
		Stock stock = new Stock();
		
		stock = stockService.getStockByName(stockName);
		
		return new ResponseEntity<Stock> (stock , HttpStatus.OK);
	}
	
	@GetMapping("/code")
	@ApiOperation(value = "코드 정보 조회")
	public ResponseEntity<String> getCodeByName(@RequestParam String stockName){
		
		String stockCode = stockService.getStockCodeByName(stockName);
		
		return new ResponseEntity<String> (stockCode, HttpStatus.OK);
	}
	
	@GetMapping("")
	@ApiOperation(value = "모든 주식 정보 조회")
	public ResponseEntity<List<Stock>> getAllStocks(){
		List<Stock> stockList = stockService.getAllStocks();
		
		return new ResponseEntity<List<Stock>>(stockList,HttpStatus.OK);
	}
	
	
	
	
}