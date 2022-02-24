import React, { useState } from 'react';
import axios from 'axios';
import InfoKospiKosdaq from '../components/InfoKospiKosdaq';
// import InfoKosdaq from '../components/InfoKosdaq';
import InfoDetail from '../components/InfoDetail';
import InfoSearch from '../components/InfoSearch';
import InfoNews from '../components/InfoNews';

function Info() {
  const [code, setCode] = useState('005930');
  const [news, setNews] = useState([]);
  const [name, setName] = useState('삼성전자');

  const handletr = (stockName) => {
    setName(stockName);

    axios
      .get(`/api/finance/code?stockName=${stockName}`)
      .then((res) => setCode(res.data))
      .catch((err) => console.log(err));
  };

  const getData = (dataCode, dataName) => {
    setCode(dataCode);
    setName(dataName);
  };

  const getNews = (data) => {
    setNews(data);
  };

  return (
    <div>
      <div
        style={{
          marginTop: '105px',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <InfoSearch getData={getData} />
        <InfoDetail detailData={code} getNews={getNews} />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <InfoNews newsData={news} nameData={name} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <InfoKospiKosdaq Infoname="kospi" ontr={handletr} />
        <InfoKospiKosdaq Infoname="kosdaq" ontr={handletr} />
      </div>
    </div>
  );
}

export default Info;
