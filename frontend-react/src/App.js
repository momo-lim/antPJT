import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Join from './views/Join';
import Login from './views/Login';
import Profile from './views/Profile';
import Nav from './views/Nav';
import Match from './views/Match';
import Study from './views/Study';
import StudyList from './views/StudyList';
import Main from './views/Main';
import Alert from './websocket/Alert';
import Info from './views/Info';
import Footer from './views/Footer';
import { onSilentRefresh } from './utils/Login';
import { logout } from './redux/userSlice';

function App() {
  // 로그인 만료시간
  const LOGIN_EXPIRE_TIME = 10 * 60 * 1000;
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.user.isLogin);
  const loginTime = useSelector((state) => state.user.loginTime);

  useEffect(() => {
    const now = new Date().getTime();
    if (isLogin && now - loginTime >= LOGIN_EXPIRE_TIME) {
      dispatch(logout());
      navigate('/login');
    }
    if (isLogin && now - loginTime <= LOGIN_EXPIRE_TIME) onSilentRefresh();
  }, []);

  return (
    <div>
      <Nav />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/join" element={<Join />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/match" element={<Match />} />
        <Route path="/study/:studyId" element={<Study />} />
        <Route path="/studyList" element={<StudyList />} />
        <Route path="/Info" element={<Info />} />
      </Routes>
      <Footer />
      <Alert />
    </div>
  );
}

export default App;
