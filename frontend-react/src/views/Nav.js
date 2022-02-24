import React, { useState } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import { Button } from '@mui/material';
import { logout } from '../redux/userSlice';
import StudyCreateBtn from '../components/StudyCreateBtn';
import AlertList from '../components/AlertList';
import '../css/Nav.css';
import antLogo from '../image/miniAnt.png';

function nav() {
  // 로그인 상태 체크
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loginPage = useSelector((state) => state.user.isLogin);
  const yourId = useSelector((state) => state.user.userInfo.userId);
  const email = useSelector((state) => state.user.userInfo.email);
  const yourName = useSelector((state) => state.user.userInfo.userName);
  const [openList, setOpenList] = useState(false);
  const [studyList, setStudyList] = useState([]);

  const clickLogout = (e) => {
    e.preventDefault();
    dispatch(logout());
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    navigate('/login');
  };

  const getStudyList = () => {
    axios
      .get(`/api/account/${yourId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: {
          email,
        },
      })
      .then((res) => {
        console.log(res.data);
        console.log(studyList);
        setStudyList(res.data.joinStudy);
        setOpenList(true);
      })
      .catch((err) => {
        alert('다시 시도해주세요.');
        console.log(err);
      });
  };
  // const userName = useSelector((state) => state.user.username);
  // const clickStudy = () => {
  //   navigate('/study');
  // };

  // -----------------------css--------------------------------
  // const navbarDesign = {
  //   backgroundColor: '#f0f0f1',
  // };

  return (
    <nav className="container navbar">
      {/* 왼쪽 */}
      <div className="item itemLeft">
        {loginPage && <StudyCreateBtn />}
        {/* 스터디 리스트 */}
        {!openList && loginPage && (
          <Button variant="contained" size="small" onClick={getStudyList}>
            가입 스터디 ▼
          </Button>
        )}
        {openList && loginPage && (
          <Button
            variant="contained"
            size="small"
            onClick={() => setOpenList(false)}
          >
            가입 스터디 ▲
          </Button>
        )}
        {openList && (
          <div className="studyList">
            {studyList.map((item) => (
              <div>
                <a href={`/study/${item.studyId}`}>{item.studyName}</a>
                <hr />
              </div>
            ))}
          </div>
        )}
      </div>
      {/* 중앙 */}
      <div className="item itemCenter">
        <div>
          <img src={antLogo} alt="miniAnt" width="45px" height="45px" />
          <span>Happy Ant</span>
        </div>
        <ul className="linkContainer">
          <NavLink
            style={{ marginLeft: '25px' }}
            to="/info"
            className={({ isActive }) =>
              isActive ? 'linkItem active' : 'linkItem inactive'
            }
          >
            주식게시판
          </NavLink>
          <NavLink
            to="/match"
            className={({ isActive }) =>
              isActive ? 'linkItem active' : 'linkItem inactive'
            }
          >
            매치게시판
          </NavLink>
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive ? 'linkItem active' : 'linkItem inactive'
            }
          >
            프로필게시판
          </NavLink>
        </ul>
      </div>
      {/* 오른쪽 */}
      <div className="item itemRight">
        {!loginPage && (
          <ul className="memberContainer">
            <li>
              <Link to="/join">회원가입</Link>
            </li>
            <li>
              <Link to="/login">로그인</Link>
            </li>
          </ul>
        )}
        {loginPage && (
          <div className="memberContainer">
            <div
              style={{
                position: 'relative',
                top: '10px',
                marginLeft: '20px',
                marginRight: '10px',
              }}
            >
              <a href="/profile">{yourName}</a>
            </div>
            <AlertList />
            <div
              style={{
                position: 'relative',
                top: '10px',
                marginLeft: '40px',
              }}
            >
              <a href="/" onClick={clickLogout}>
                로그아웃
              </a>
            </div>
            {/* <FormControl style={{ width: '256px' }}>
            <InputLabel id="demo-simple-select-label">내스터디 목록</InputLabel>
            <Select label="스터디 목록" value={studyId} onChange={clickStudy}>
              <MenuItem onClick={console.log('1번')} value={1}>
                1번 스터디 이름
              </MenuItem>
              <MenuItem onClick={console.log('2번')} value={2}>
                2번 스터디 이름
              </MenuItem>
              <MenuItem onClick={console.log('3번')} value={3}>
                3번 스터디 이름
              </MenuItem>
            </Select>
          </FormControl> */}
          </div>
        )}
      </div>
    </nav>
  );
}

export default nav;
