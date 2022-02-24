import axios from 'axios';
import React, { useEffect, useState } from 'react';

function InfoNews({ newsData, nameData }) {
  const [allNews, setAllNews] = useState();
  const [cutNews, setCutNews] = useState();
  const [todayKos, setTodayKos] = useState();
  const [toggle, setToggle] = useState('1');
  const [newsState, setNewsState] = useState(false);
  useEffect(() => {
    axios
      .get('/api/finance/news')
      .then((res) => {
        setCutNews(res.data.slice(0, 5));
        setAllNews(res.data);
        if (res.data.length > 5) {
          setNewsState(true);
        }
      })
      .catch((err) => console.log(err));

    axios
      .get('/api/finance/today/stock')
      .then((res) => {
        setTodayKos(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const onKospi = () => {
    setToggle('1');
  };
  const onKosdaq = () => {
    setToggle('2');
  };
  const onKospi200 = () => {
    setToggle('3');
  };

  const handleNews = () => {
    setCutNews(allNews);
    setNewsState(false);
  };

  return (
    <div className="newsDiv">
      <div>
        <br />

        <h2 className="newsH2">{nameData}</h2>
        <span> 의 주요뉴스</span>
        <br />
        <br />
        {newsData &&
          newsData.map((item) => (
            <div key={item.url}>
              <a
                target="_blank"
                className="newsA"
                href={item.url}
                rel="noreferrer"
              >
                {item.articleSummary}
              </a>
            </div>
          ))}
        <br />
        <br />
        <h3>오늘의 증시</h3>
        <button onClick={onKospi} type="button" className="InfoButton">
          코스피
        </button>
        <button onClick={onKosdaq} type="button" className="InfoButton">
          코스닥
        </button>
        <button onClick={onKospi200} type="button" className="InfoButton">
          코스피200
        </button>
        {todayKos && toggle === '1' && todayKos.kospi.dayRange[0] === '+' ? (
          <div>
            <div className="newsToday">
              <p>{todayKos.kospi.name}</p>
              <p>{todayKos.kospi.price}</p>
              <p className="newsTodayPlusColor">
                {todayKos.kospi.variablePrice}
              </p>
              <p className="newsTodayPlusColor">{todayKos.kospi.dayRange}</p>
            </div>
            <img className="newsTodayImg" src={todayKos.kospi.img} alt="kos" />
          </div>
        ) : null}
        {todayKos && toggle === '1' && todayKos.kospi.dayRange[0] === '-' ? (
          <div>
            <div className="newsToday">
              <p>{todayKos.kospi.name}</p>
              <p>{todayKos.kospi.price}</p>
              <p className="newsTodayMinusColor">
                {todayKos.kospi.variablePrice}
              </p>
              <p className="newsTodayMinusColor">{todayKos.kospi.dayRange}</p>
            </div>
            <img className="newsTodayImg" src={todayKos.kospi.img} alt="kos" />
          </div>
        ) : null}
        {todayKos && toggle === '2' && todayKos.kosdaq.dayRange[0] === '+' ? (
          <div>
            <div className="newsToday">
              <p>{todayKos.kosdaq.name}</p>
              <p>{todayKos.kosdaq.price}</p>
              <p className="newsTodayPlusColor">
                {todayKos.kosdaq.variablePrice}
              </p>
              <p className="newsTodayPlusColor">{todayKos.kosdaq.dayRange}</p>
            </div>
            <img className="newsTodayImg" src={todayKos.kosdaq.img} alt="kos" />
          </div>
        ) : null}
        {todayKos && toggle === '2' && todayKos.kosdaq.dayRange[0] === '-' ? (
          <div>
            <div className="newsToday">
              <p>{todayKos.kosdaq.name}</p>
              <p>{todayKos.kosdaq.price}</p>
              <p className="newsTodayMinusColor">
                {todayKos.kosdaq.variablePrice}
              </p>
              <p className="newsTodayMinusColor">{todayKos.kosdaq.dayRange}</p>
            </div>
            <img className="newsTodayImg" src={todayKos.kosdaq.img} alt="kos" />
          </div>
        ) : null}
        {todayKos && toggle === '3' && todayKos.kospi200.dayRange[0] === '+' ? (
          <div>
            <div className="newsToday">
              <p>{todayKos.kospi200.name}</p>
              <p>{todayKos.kospi200.price}</p>
              <p className="newsTodayPlusColor">
                {todayKos.kospi200.variablePrice}
              </p>
              <p className="newsTodayPlusColor">{todayKos.kospi200.dayRange}</p>
            </div>
            <img
              className="newsTodayImg"
              src={todayKos.kospi200.img}
              alt="kos"
            />
          </div>
        ) : null}
        {todayKos && toggle === '3' && todayKos.kospi200.dayRange[0] === '-' ? (
          <div>
            <div className="newsToday">
              <p>{todayKos.kospi200.name}</p>
              <p>{todayKos.kospi200.price}</p>
              <p className="newsTodayMinusColor">
                {todayKos.kospi200.variablePrice}
              </p>
              <p className="newsTodayMinusColor">
                {todayKos.kospi200.dayRange}
              </p>
            </div>
            <img
              className="newsTodayImg"
              src={todayKos.kospi200.img}
              alt="kos"
            />
          </div>
        ) : null}
      </div>
      <div className="newsMain">
        <br />
        <h3 className="newsH2">오늘</h3> <span>주요뉴스</span>
        <br />
        <br />
        {cutNews &&
          cutNews.map((item) => {
            if (item.img) {
              return (
                <div key={item.articleSubject} className="newsTd">
                  <img className="newsImg" src={item.img} alt="주요뉴스" />

                  <a
                    target="_blank"
                    className="newsA"
                    href={item.url}
                    rel="noreferrer"
                  >
                    <h4 className="newsH2">{item.articleSubject}</h4>
                  </a>

                  <p>
                    <a
                      target="_blank"
                      className="newsA"
                      href={item.url}
                      rel="noreferrer"
                    >
                      {item.articleSummary}
                    </a>
                  </p>
                </div>
              );
            }
            return (
              <div key={item.articleSubject} className="newsTd">
                <a
                  target="_blank"
                  className="newsA"
                  href={item.url}
                  rel="noreferrer"
                >
                  <h4 className="newsH2">{item.articleSubject}</h4>
                </a>

                <p>
                  <a
                    target="_blank"
                    className="newsA"
                    href={item.url}
                    rel="noreferrer"
                  >
                    {item.articleSummary}
                  </a>
                </p>
              </div>
            );
          })}
        {newsState && (
          <button
            style={{ marginLeft: '450px' }}
            className="InfoButton"
            type="button"
            onClick={handleNews}
          >
            더 보기
          </button>
        )}
      </div>
    </div>
  );
}

export default InfoNews;
