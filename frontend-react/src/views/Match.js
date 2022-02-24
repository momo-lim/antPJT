import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import MatchList from './MatchList';

function Match() {
  const isLogin = useSelector((state) => state.user.isLogin);
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLogin) {
      navigate('/login');
      alert('로그인 후 이용해주세요.');
    }
  }, []);
  return (
    <div style={{ marginTop: '15vh' }}>
      <MatchList />
      <div style={{ height: '40vh' }} />
    </div>
  );
}

export default Match;
