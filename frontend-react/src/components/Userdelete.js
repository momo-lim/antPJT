import axios from 'axios';
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../redux/userSlice';

function Userdelete() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.userInfo);
  const onClick = (e) => {
    e.preventDefault();
    if (window.confirm('회원 탈퇴를 하시겠습니까?')) {
      // 여기서 삭제
      console.log(user);
      console.log('유저유저');
      axios({
        method: 'delete',
        url: `/api/account/${user.userId}`,
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
        .then((response) => {
          console.log(response);
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          dispatch(logout());
          navigate('/login');
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      alert('취소합니다.');
    }
  };

  return (
    <div>
      <a href="/" onClick={onClick}>
        회원 탈퇴
      </a>
    </div>
  );
}

export default Userdelete;
