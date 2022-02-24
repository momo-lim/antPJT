import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const theme = createTheme();
function Changeprofile() {
  const navigate = useNavigate();

  const [pwd, setPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');

  const onSubmit = (event) => {
    event.preventDefault();
    if (pwd !== confirmPwd) {
      alert('비밀번호가 맞지 않습니다.');
      setPwd('');
      setConfirmPwd('');
    } else {
      axios({
        method: 'post',
        url: '/api/accounts/signup',
        data: {
          password: pwd,
        },
      })
        .then((response) => {
          console.log(response);
          // 회원가입 하고 나면 프로필로 이동하기, 자동 로그인
        })
        .catch((error) => {
          console.log(error);
          // 일단 여기에 작성해놓자.
          navigate('/profile');
        });
    }
  };

  const onPwdHandler = (event) => {
    setPwd(event.target.value);
    console.log(event.target.value);
  };

  const onConfirmPwdHandler = (event) => {
    setConfirmPwd(event.target.value);
    console.log(event.target.value);
  };

  return (
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
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            비밀번호 변경
          </Typography>
          <Box component="form" noValidate onSubmit={onSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
                  label="비밀번호"
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
            </Grid>
            {pwd !== '' && confirmPwd !== '' ? (
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                변경하기
              </Button>
            ) : (
              <Button
                disabled
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                변경하기
              </Button>
            )}
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default Changeprofile;
