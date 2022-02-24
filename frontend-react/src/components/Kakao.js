import axios from 'axios';
import React, { useState } from 'react';
import { Modal, Box } from '@mui/material';

import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Guideline from './Guideline';

import { login } from '../redux/userSlice';

const { Kakao } = window;

function KakaoLogin() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const loginWithKakao = () => {
    Kakao.Auth.loginForm({
      success() {
        // console.log(authObj);
        Kakao.API.request({
          url: '/v2/user/me',
          success(response) {
            console.log(response);
            console.log('여기에 정보');

            const params = new URLSearchParams();
            params.append('email', response.kakao_account.email);
            params.append('password', `${response.id}Zz!`);
            // 회원가입
            axios({
              method: 'post',
              url: '/api/account/signup',
              data: {
                email: response.kakao_account.email,
                name: response.kakao_account.profile.nickname,
                password: `${response.id}Zz!`,
              },
            })
              .then((res) => {
                console.log(res);
                // 회원가입 성공
                // 자동 로그인

                setOpen(true);

                axios({
                  method: 'post',
                  url: '/api/account/login',
                  data: params,
                })
                  .then((ress) => {
                    console.log(ress);
                    dispatch(login(ress.data));
                    localStorage.setItem('accessToken', ress.data.accessToken);
                    localStorage.setItem(
                      'refreshToken',
                      ress.data.refreshToken
                    );

                    axios({
                      method: 'get',
                      url: `/api/account/{id}?email=${response.kakao_account.email}`,
                      headers: {
                        Authorization: `Bearer ${ress.data.accessToken}`,
                      },
                    })
                      .then((getRes) => dispatch(login(getRes.data)))
                      .catch((getErr) => console.log(getErr));

                    // localStorage.setItem('jwt', res.data.token);
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              })
              .catch((error) => {
                console.log(error);
                // 회원가입 실패

                // 이미 존재하는 회원이라면 로그인 시도

                axios({
                  method: 'post',
                  url: '/api/account/login',
                  data: params,
                })
                  .then((ress) => {
                    console.log(ress);
                    dispatch(login(ress.data));
                    // localStorage.setItem('jwt', res.data.token);
                    localStorage.setItem('accessToken', ress.data.accessToken);
                    localStorage.setItem(
                      'refreshToken',
                      ress.data.refreshToken
                    );

                    axios({
                      method: 'get',
                      url: `/api/account/{id}?email=${response.kakao_account.email}`,
                      headers: {
                        Authorization: `Bearer ${ress.data.accessToken}`,
                      },
                    })
                      .then((res) => {
                        dispatch(login(res.data));
                        navigate('/profile');
                      })
                      .catch((err) => console.log(err));
                  })
                  .catch((err) => {
                    console.log(err);
                  });
              });
          },
        });
      },
      // 회원가입 실패
      fail(err) {
        console.log(err);
        alert('로그인에 실패했습니다.');
      },
    });
  };
  // 모달
  const style = {
    position: 'absolute',
    // 배치(가운데 정렬)
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // 크기
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };
  return (
    <div>
      {/* eslint-disable jsx-a11y/anchor-is-valid */}
      <a
        id="custom-login-btn"
        style={{ marginLeft: '0' }}
        onClick={loginWithKakao}
        href="#"
      >
        <img
          src="https://developers.kakao.com/tool/resource/static/img/button/login/full/ko/kakao_login_medium_wide.png"
          width="270"
          // height="45"

          alt="카카오"
        />
      </a>
      {/* 모달 */}
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

export default KakaoLogin;
