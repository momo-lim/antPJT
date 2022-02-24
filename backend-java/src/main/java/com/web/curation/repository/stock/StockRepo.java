package com.web.curation.repository.stock;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.web.curation.model.stock.Stock;

public interface StockRepo extends JpaRepository<Stock, String>{

	List<Stock> findByStockNameContaining(String stockName);
	Stock findByStockName(String stockName);
	boolean existsByStockName(String stockname);
	
}
