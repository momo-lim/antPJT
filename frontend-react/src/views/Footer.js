import React from 'react';

export default function Footer() {
  return (
    <div
      style={{
        display: 'flex',
        marginTop: '50px',
        width: '100vw',
        height: '12vh',
        backgroundColor: 'rgb(240,240,240)',
        padding: '30px',
      }}
    >
      <div style={{ marginLeft: '28%', marginTop: '20px' }}>
        <span
          style={{
            color: 'rgb(50,50,32)',
            fontSize: '15px',
            fontWeight: '700',
          }}
        >
          구미 2반 7조 - 개미키우기
        </span>
        <p
          style={{
            color: 'rgb(100,100,100)',
            fontSize: '13px',
            fontWeight: '300',
            marginBottom: '5px',
          }}
        >
          김덕규, 김준하, 김병준
        </p>
        <p
          style={{
            color: 'rgb(100,100,100)',
            fontSize: '13px',
            fontWeight: '300',
            marginTop: '5px',
          }}
        >
          서상용, 임현모
        </p>
      </div>
      <div
        style={{ marginBottom: '0px', marginTop: '100px', marginLeft: '50px' }}
      >
        <span style={{ fontWeight: '650', color: 'rgb(80, 80, 80)' }}>
          개인정보처리방침
        </span>
        <span style={{ color: 'rgb(70,70,70)' }}> | 이용약관 | </span>
        <span style={{ color: 'rgb(70,70,70)' }}>고객센터</span>
      </div>
    </div>
  );
}
