import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import axios from 'axios';
import { useSnackbar } from 'notistack';

import {
  Modal,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import Guideline from '../components/Guideline';
import { login } from '../redux/userSlice';
import { onLoginSuccess } from '../utils/Login';

const theme = createTheme();
function Join() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [checkBox, setCheckBox] = useState(false);
  const [open, setOpen] = useState(false);
  const [hint, setHint] = useState('');
  const [hintAnswer, setHintAnswer] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const isLogin = useSelector((state) => state.user.isLogin);

  React.useEffect(() => {
    if (isLogin) {
      navigate('/profile');
    }
  }, []);

  // 가입하기 버튼 눌렀을때
  const onSubmit = (event) => {
    event.preventDefault();
    if (pwd !== confirmPwd) {
      alert('비밀번호가 일치하지 않습니다.');
      setPwd('');
      setConfirmPwd('');
    } else {
      axios({
        method: 'post',
        url: '/api/account/signup',
        data: {
          answer: hintAnswer,
          email,
          name,
          password: pwd,
          question: hint,
        },
      })
        .then((response) => {
          const params = new URLSearchParams();
          params.append('email', email);
          params.append('password', pwd);
          // 회원가입 버튼 누르고 정상 응답이 반환되면 모달창(가이드라인) 오픈
          // 모달창에서 프로필 작성하러 가기 누르면 로그인처리 됨과 동시에 프로필로 이동
          setOpen(true);
          // 로그인
          axios({
            method: 'post',
            url: '/api/account/login',
            data: params,
          })
            .then((ress) => {
              onLoginSuccess(ress);
              localStorage.setItem('refreshToken', ress.data.refreshToken);

              axios
                .get(`/api/account/{id}?email=${email}`, {
                  headers: { Authorization: `Bearer ${ress.data.accessToken}` },
                })
                .then((res) => {
                  dispatch(login(res.data));
                  enqueueSnackbar(`${response.data.userName}님 안녕하세요!`, {
                    variant: `success`,
                  });
                });
            })
            .catch((err) => {
              console.log(err);
            });
        })
        // 회원가입 에러
        .catch((error) => {
          console.log(error);

          if (error.response.status === 409) {
            alert('이미 존재하는 회원 입니다.');
            setEmail('');
          } else if (error.response.status === 403) {
            alert('비밀번호 양식이 맞지 않습니다.');
            setPwd('');
            setConfirmPwd('');
          } else {
            alert('이메일 양식이 맞지 않습니다.');
          }
        });
    }
  };

  // 이메일
  const onEmailHandler = (event) => {
    setEmail(event.target.value);
  };

  // 이름
  const onNameHandler = (event) => {
    setName(event.target.value);
  };

  // 비밀번호
  const onPwdHandler = (event) => {
    setPwd(event.target.value);
  };

  // 비밀번호 확인
  const onConfirmPwdHandler = (event) => {
    setConfirmPwd(event.target.value);
  };

  // 개인정보 수집동의 박스
  const onCheckBox = (event) => {
    setCheckBox(event.target.checked);
  };

  // 비밀번호 찾기

  const handleChange = (event) => {
    setHint(event.target.value);
  };

  // 비밀번호 찾기 힌트답변

  const onhintAnswer = (event) => {
    setHintAnswer(event.target.value);
  };

  // 모달

  const style = {
    position: 'absolute',
    // 배치(가운데 정렬)
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // 크기
    width: 1200,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div style={{ marginTop: '140px' }}>
      <ThemeProvider theme={theme}>
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar sx={{ m: 1 }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              회원 가입
            </Typography>
            <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="이메일"
                    value={email}
                    onChange={onEmailHandler}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="name"
                    label="이름"
                    value={name}
                    onChange={onNameHandler}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="비밀번호 (8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.)"
                    type="password"
                    id="pwd"
                    value={pwd}
                    onChange={onPwdHandler}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    label="비밀번호 확인"
                    type="password"
                    id="confirmPwd"
                    value={confirmPwd}
                    onChange={onConfirmPwdHandler}
                  />
                </Grid>
                {/* 비밀번호찾기 */}
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      비밀번호 찾기 힌트
                    </InputLabel>
                    <Select
                      value={hint}
                      label="비밀번호 찾기 힌트"
                      onChange={handleChange}
                    >
                      <MenuItem value={1}>가장 기억에 남는 말은?</MenuItem>
                      <MenuItem value={2}>졸업한 초등학교 이름은?</MenuItem>
                      <MenuItem value={3}>고향 이름은?</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="hintAnswer"
                    label="힌트 답변"
                    value={hintAnswer}
                    onChange={onhintAnswer}
                  />
                </Grid>

                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        value={checkBox}
                        onChange={onCheckBox}
                        color="primary"
                      />
                    }
                    label="개인정보 수집 동의"
                  />
                </Grid>
              </Grid>
              {checkBox === true &&
              email !== '' &&
              name !== '' &&
              pwd !== '' &&
              confirmPwd !== '' &&
              hint !== '' &&
              hintAnswer !== '' ? (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  가입하기
                </Button>
              ) : (
                <Button
                  disabled
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  가입하기
                </Button>
              )}
            </Box>
          </Box>
        </Container>
      </ThemeProvider>
      <Modal
        open={open}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Guideline />
        </Box>
      </Modal>
    </div>
  );
}

export default Join;
