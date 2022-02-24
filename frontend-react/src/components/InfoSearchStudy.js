import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AddIcon from '@mui/icons-material/Add';

function InfoSearchStudy({ getData }) {
  const [allData, setAllData] = useState([]);
  // const [findData, setFindData] = useState('');
  const [searchValue, setSearchValue] = useState('');

  // 검색창에 띄울 종목이름 모두 조회
  useEffect(() => {
    axios
      .get('/api/finance')
      .then((res) => {
        setAllData(res.data);
        console.log(res);
      })
      .catch((err) => console.log(err));
  }, []);
  // 검색한 종목이름으로 코드 조회
  const findSearch = () => {
    axios
      .get(`/api/finance/search/{stockname}?stockName=${searchValue}`)
      .then((res) => {
        getData(res.data.stockCode, searchValue);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  // 엔터키 눌렀을때
  const handleSearch = (e) => {
    if (e.key === 'Enter') {
      findSearch();
    }
  };

  // 검색어 저장(엔터 눌렀을때랑 검색버튼 눌렀을때 둘다 적용하기 위해)
  const saveSearch = (e) => {
    setSearchValue(e.target.value);
  };

  return (
    <div style={{ margin: 'auto' }}>
      <div className="div">
        <input
          className="input"
          onKeyPress={handleSearch}
          onChange={saveSearch}
          list="depList"
          type="text"
          autoComplete="off"
          placeholder="종목 검색"
        />
        <button
          className="button"
          onClick={findSearch}
          value={searchValue}
          type="button"
        >
          <AddIcon style={{ cursor: 'pointer' }} />
        </button>
      </div>
      <datalist onChange={handleSearch} id="depList">
        {allData.map((item) => (
          <option key={item.stockCode}>{item.stockName}</option>
        ))}
      </datalist>
    </div>
  );
}

export default InfoSearchStudy;
