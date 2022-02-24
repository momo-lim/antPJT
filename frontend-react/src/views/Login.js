import React, { useState, useEffect } from 'react';
import { Button, Paper, Input } from '@mui/material';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from 'notistack';
import FindPassword from '../components/FindPassword';
import { login, setAlertLength } from '../redux/userSlice';

import Kakao from '../components/Kakao';
import { onLoginSuccess } from '../utils/Login';
import loginAnt from '../image/login.png';

export default function Login() {
  const [inputId, setInputId] = useState('');
  const [inputPw, setInputPw] = useState('');
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const isLogin = useSelector((state) => state.user.isLogin);

  useEffect(() => {
    if (isLogin) {
      navigate('/profile');
    }
  }, []);
  // 이벤트 관리
  const handleInputId = (e) => {
    setInputId(e.target.value);
  };
  const handleInputPw = (e) => {
    setInputPw(e.target.value);
  };
  // 비밀번호찾기 모달창 open / close
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClickClose = () => {
    setOpen(false);
  };
  // 회원가입 버튼
  const clickJoin = () => {
    navigate('/join');
  };
  // 로그인 버튼
  const onClickLogin = (e) => {
    e.preventDefault();

    axios
      .post('/api/account/login', [], {
        params: {
          email: inputId,
          password: inputPw,
        },
      })
      .then((res) => {
        onLoginSuccess(res);
        localStorage.setItem('refreshToken', res.data.refreshToken);
        console.log(res.data.accessToken);

        // store에 저장할 정보요청
        axios
          .get(`/api/account/{id}?email=${inputId}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
          })
          .then((response) => {
            dispatch(login(response.data));
            enqueueSnackbar(`${response.data.userName}님 안녕하세요!`, {
              variant: `success`,
            });
            navigate('/profile');
            axios
              .get(`/api/alert/${response.data.userId}`, {
                headers: {
                  Authorization: `Bearer ${localStorage.getItem(
                    'accessToken'
                  )}`,
                },
              })
              .then((ress) => {
                dispatch(setAlertLength(ress.data.length));
              })
              .catch((errr) => console.log(errr));
          });
      })
      .catch((err) => {
        console.log(err);
        alert('로그인 정보를 확인하세요');
      });
  };

  const onCheckEnter = (e) => {
    if (e.key === 'Enter') {
      onClickLogin(e);
    }
  };

  // ----------------------------- css --------------------------------
  const loginPaper = {
    position: 'fixed',
    left: '980px',
    top: '250px',
    width: '400px',
    height: '540px',
    textAlign: 'center',
    verticalAlign: 'middle',
    borderRadius: '50px',
  };

  const innerPaper = {
    textAlign: 'left',
    position: 'relative',
    left: '70px',
    top: '50px',
    width: '270px',
  };

  const background = {
    backgroundColor: 'white',
    height: '100vh',
  };

  const loginBtn = {
    width: '100%',
  };

  const ourName = {
    textAlign: 'center',
    fontSize: '80px',
    position: 'fixed',
    left: '450px',
    top: '220px',
    color: 'black',
    fontWeight: '900',
  };

  const SNS = {
    paddingTop: '8px',
  };

  const logo = {
    position: 'fixed',
    top: '335px',
    left: '500px',
  };
  // ---------------------------- render--------------------------------
  return (
    <div style={background}>
      <img
        style={logo}
        src={loginAnt}
        alt="loginAnt"
        width="480px"
        height="380px"
      />
      <div style={ourName}>개미키우기</div>
      <Paper elevation={5} style={loginPaper}>
        <div style={innerPaper}>
          <h1>Login</h1>
          <label htmlFor="input_id">Username</label>
          <br />
          <Input
            placeholder="E-mail을 입력해주세요"
            value={inputId}
            onChange={handleInputId}
            onKeyPress={onCheckEnter}
            fullWidth
          />
          <br />
          <br />
          <label htmlFor="input_pw">Password</label>
          <br />
          <Input
            placeholder="비밀번호를 입력해주세요"
            type="password"
            value={inputPw}
            onChange={handleInputPw}
            onKeyPress={onCheckEnter}
            fullWidth
          />
          <br />
          <br />
          <Button
            type="button"
            style={loginBtn}
            variant="contained"
            onClick={onClickLogin}
          >
            Login
          </Button>
          <div style={{ marginTop: '10px' }}>
            <Button
              type="button"
              style={{ width: '135px' }}
              variant="outlined"
              onClick={clickJoin}
            >
              회원가입
            </Button>
            <Button
              type="button"
              style={{ width: '135px' }}
              variant="outlined"
              onClick={handleClickOpen}
            >
              비밀번호 찾기
            </Button>
            {/* 모달창 open -> 가입 이메일 입력 -> [추가항목 보임] 비밀번호 찾기 질문 입력/확인 -> 비밀번호 변경 완료 확인 및 재로그인 하라고 알려줌  */}
          </div>
          <div style={SNS}>
            <Kakao />
          </div>
        </div>
        {open && <FindPassword handleClickClose={handleClickClose} />}
      </Paper>
    </div>
  );
}
