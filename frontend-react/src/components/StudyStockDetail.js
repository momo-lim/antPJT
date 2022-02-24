import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudyStockChart from './StudyStockChart';
import '../css/StudyStockDetail.css';

export default function StudyStockDetail({ stockCode, stockPrice, date }) {
  const [data, setData] = useState('');
  const [chart, setChart] = useState('1');
  const [nowPrice, setNowPrice] = useState('1000');

  useEffect(() => {
    axios
      .get(`/api/finance/${stockCode}`)
      .then((res) => {
        setData(res.data);
        setNowPrice(res.data.curPrice);
      })
      .catch((err) => console.log(err));
  }, [stockCode]);

  const onDay = () => {
    setChart('1');
  };
  const onWeek = () => {
    setChart('2');
  };
  const onMonth3 = () => {
    setChart('3');
  };
  const onYear = () => {
    setChart('4');
  };
  const onYear3 = () => {
    setChart('5');
  };
  const onYear5 = () => {
    setChart('6');
  };
  const onYear10 = () => {
    setChart('7');
  };

  const btnStyle = {
    backgroundColor: 'rgb(0, 102, 255, 0.8)',
    color: 'white',
    marginLeft: '4px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  };

  return (
    <div className="stockDiv">
      <div className="stockLeft">
        <p className="stockTitle">주식 정보</p>
        <StudyStockChart
          nowPrice={nowPrice}
          prevPrice={stockPrice}
          date={date}
        />
        <div
          style={{ marginLeft: '0px', marginRight: '28px' }}
          className="stockBorder"
        >
          <div>
            <div className="stockSmall">{date.slice(0, 10)}</div>
            <div>{stockPrice.toLocaleString()}</div>
          </div>
          <div>▶▶</div>
          <div />
          <div>
            <div className="stockSmall">현재가</div>
            <div>{data.curPrice}</div>
          </div>
          <div>
            <div>
              {parseInt(nowPrice.replace(/,/g, ''), 10) >= stockPrice ? (
                <div>
                  <span
                    style={{ marginLeft: '50px' }}
                    className="stockPlus stockSmall stockPercent"
                  >
                    +
                    {Math.round(
                      ((parseInt(nowPrice.replace(/,/g, ''), 10) - stockPrice) /
                        stockPrice) *
                        100 *
                        100
                    ) / 100}
                    %
                  </span>
                </div>
              ) : (
                <div>
                  <span
                    style={{ marginLeft: '50px' }}
                    className="stockMinus stockSmall stockPercent"
                  >
                    {Math.round(
                      ((parseInt(nowPrice.replace(/,/g, ''), 10) - stockPrice) /
                        stockPrice) *
                        100 *
                        100
                    ) / 100}
                    %
                  </span>
                </div>
              )}
              {parseInt(nowPrice.replace(/,/g, ''), 10) >= stockPrice ? (
                <div>
                  <span
                    style={{ marginLeft: '50px' }}
                    className="stockSmall stockPlus"
                  >
                    +{parseInt(nowPrice.replace(/,/g, ''), 10) - stockPrice}
                  </span>
                </div>
              ) : (
                <div>
                  <span
                    style={{ marginLeft: '50px' }}
                    className="stockSmall stockMinus"
                  >
                    {parseInt(nowPrice.replace(/,/g, ''), 10) - stockPrice}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <hr />
      <div className="stockRight">
        <div className="stockRightUpper">
          <div style={{ marginLeft: '10px' }}>
            <button onClick={onDay} type="button" style={btnStyle}>
              1일
            </button>
            <button onClick={onWeek} type="button" style={btnStyle}>
              1주일
            </button>
            <button onClick={onMonth3} type="button" style={btnStyle}>
              3개월
            </button>
            <button onClick={onYear} type="button" style={btnStyle}>
              1년
            </button>
            <button onClick={onYear3} type="button" style={btnStyle}>
              3년
            </button>
            <button onClick={onYear5} type="button" style={btnStyle}>
              5년
            </button>
            <button onClick={onYear10} type="button" style={btnStyle}>
              10년
            </button>
          </div>
          <span className="stockDate">{data.time}</span>
        </div>
        <div style={{ marginBottom: '20px', marginLeft: '10px' }}>
          {chart === '1' && (
            <img src={data.dayChartUrl} alt="1일" width={680} height={300} />
          )}
          {chart === '2' && (
            <img src={data.weekChartUrl} alt="1주일" width={680} height={300} />
          )}
          {chart === '3' && (
            <img
              src={data.month3ChartUrl}
              alt="3개월"
              width={680}
              height={300}
            />
          )}
          {chart === '4' && (
            <img src={data.yearChartUrl} alt="1년" width={680} height={300} />
          )}
          {chart === '5' && (
            <img src={data.year3ChartUrl} alt="3년" width={680} height={300} />
          )}
          {chart === '6' && (
            <img src={data.year5ChartUrl} alt="5년" width={680} height={300} />
          )}
          {chart === '7' && (
            <img
              src={data.year10ChartUrl}
              alt="10년"
              width={680}
              height={300}
            />
          )}
        </div>
        <div className="stockRightDown">
          <div className="stockBorder">
            <div>
              <div className="stockSmall">현재가</div>
              <div>{data.curPrice}</div>
            </div>
            <div>
              <div>
                {data.priceType === '상승' ? (
                  <div>
                    <span
                      style={{ marginLeft: '50px' }}
                      className="stockPlus stockSmall stockPercent"
                    >
                      +{data.dayRange}%
                    </span>
                  </div>
                ) : (
                  <div>
                    <span
                      style={{ marginLeft: '50px' }}
                      className="stockMinus stockSmall stockPercent"
                    >
                      -{data.dayRange}%
                    </span>
                  </div>
                )}
                {data.priceType === '상승' ? (
                  <div>
                    <span
                      style={{ marginLeft: '50px' }}
                      className="stockSmall stockPlus"
                    >
                      +{data.diffAmount}
                    </span>
                  </div>
                ) : (
                  <div>
                    <span
                      style={{ marginLeft: '50px' }}
                      className="stockSmall stockMinus"
                    >
                      -{data.diffAmount}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="stockBorder" style={{ display: 'flex' }}>
            <div>
              <div
                style={{ fontSize: '14px' }}
                className="stockPercent stockPlus"
              >
                고가 : {data.highPrice}
              </div>
              <div
                style={{ fontSize: '14px' }}
                className="stockPercent stockMinus"
              >
                저가 : {data.lowPrice}
              </div>
            </div>
            <div style={{ marginLeft: '50px' }}>
              <div style={{ fontSize: '14px' }}>
                거래대금 : {data.tradingValue}
              </div>
              <div style={{ fontSize: '14px' }}>거래량 : {data.volume}</div>
            </div>
            <div style={{ fontSize: '14px', marginLeft: '50px' }}>
              시가 : {data.marketPrice}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
