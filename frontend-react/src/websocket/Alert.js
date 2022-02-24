import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import SockJsClient from 'react-stomp';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import { setAlertLength } from '../redux/userSlice';

export default function Alert() {
  const isLogin = useSelector((state) => state.user.isLogin);
  const userId = useSelector((state) => state.user.userInfo.userId);
  const $websocket = useRef(null);
  const dispatch = useDispatch();

  // 알림창 ui
  const { enqueueSnackbar } = useSnackbar();

  // const handleMsg = (msg) => {
  //   console.log(msg);
  // };

  // const handleClickSendTo = () => {
  //   $websocket.current.sendMessage('/sendTo');
  // };

  // const handleClickSendTemplate = () => {
  //   $websocket.current.sendMessage('/Te');
  // };

  // 서버로부터 메시지가 왔을 때 실행되는 부분
  const onAlert = (msg) => {
    enqueueSnackbar(`${msg.content}`, {
      variant: `info`,
    });

    axios
      .get(`/api/alert/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((res) => {
        dispatch(setAlertLength(res.data.length));
      })
      .catch((err) => console.log(err));
  };

  return (
    <div>
      {isLogin && (
        <SockJsClient
          url="http://i6d207.p.ssafy.io/api/happy-ant-websocket"
          topics={[`/alert/${userId}`]}
          onMessage={onAlert}
          ref={$websocket}
        />
      )}
    </div>
  );
}
