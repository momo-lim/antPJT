import React from 'react';
import ContentViewer from './ContentViewer';
import '../css/MatchItemDetail.css';

export default function MatchItemDetail(props) {
  const { item } = props;
  console.log(item);
  return (
    <div className="page">
      <h1 style={{ marginBottom: '8px' }}>{item.title}</h1>
      {item.state ? (
        <span style={{ color: 'red' }}>마감</span>
      ) : (
        <span style={{ color: 'blue', fontWeight: '650' }}>모집중</span>
      )}
      <br />
      <span className="secondLine">작성자 : {item.writerName}</span>
      {item.createDate && (
        <span style={{ marginLeft: '50px' }} className="secondLine">
          {item.createDate.slice(0, 10)} {item.createDate.slice(11)}
        </span>
      )}
      <hr />
      <h3>({item.studyName}) 에서 스터디원을 모으고 있어요!</h3>
      <div className="content">
        <ContentViewer initialValue={item.content} />
      </div>
      <p className="interest">관심분야 : {item.studyInterest}</p>
    </div>
  );
}
