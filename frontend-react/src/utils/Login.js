import axios from 'axios';
import { setLoginTime } from '../redux/userSlice';
import store from '../redux/store';

const JWT_EXPIRY_TIME = 10 * 60 * 1000;

export const onSilentRefresh = () => {
  axios
    .get('/api/account/token/refresh', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    // eslint-disable-next-line no-use-before-define
    .then((res) => onLoginSuccess(res))
    .catch((error) => {
      console.log(error);
    });
};

export const onLoginSuccess = (response) => {
  // redux에 로그인 시간도 동기화 시킴
  store.dispatch(setLoginTime());
  // accessToken 만료하기 1분 전에 로그인 연장
  setTimeout(onSilentRefresh, JWT_EXPIRY_TIME - 60 * 1000);

  // accessToken 설정
  localStorage.setItem('accessToken', response.data.accessToken);
};
