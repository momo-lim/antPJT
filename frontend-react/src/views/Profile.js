import axios from 'axios';
import * as React from 'react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login } from '../redux/userSlice';
import UserDelete from '../components/Userdelete';
import '../css/Profile.css';
import profileAnt from '../image/profile.png';

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isLogin = useSelector((state) => state.user.isLogin);
  const userInfo = useSelector((state) => state.user.userInfo);
  useEffect(() => {
    if (!isLogin) {
      navigate('/login');
      alert('로그인 후 이용해주세요.');
    }
  }, []);

  // study 생성하기

  // 로그인 확인
  const loginPage = useSelector((state) => state.user.isLogin);

  // 유저 정보 가져오기
  const Info = useSelector((state) => state.user.userInfo);
  console.log(Info.email);
  const renewal = () => {
    axios
      .get(`/api/account/{id}?email=${Info.email}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((response) => {
        dispatch(login(response.data));
      })
      .catch((err) => console.log(err, 'profile err'));
  };
  useEffect(() => {
    renewal();
  }, []);

  console.log(Info, '유저 정보');
  const study = Info.joinStudy;
  console.log(study, '스터디');
  const goToPage = (id, e) => {
    navigate(`/study/${id}`);
    console.log(id);
    e.preventDefault();
  };

  const btnStyle = {
    backgroundColor: 'rgb(0, 102, 255, 0.8)',
    color: 'white',
    marginLeft: '4px',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
  };
  // 스터디 리스트 나열하기
  const studyList = () => {
    if (study.length !== 0) {
      const list = [];
      for (let i = 0; i < study.length; i += 1) {
        list.push(
          <div
            style={{
              borderRadius: '5px',
              border: 'rgb(170,170,170) 1px solid',
              padding: '15px',
              marginBottom: '5px',
            }}
            key={i}
          >
            <span
              style={{ fontSize: '20px', fontWeight: '600' }}
            >{`${study[i].studyName}`}</span>
            <button
              style={btnStyle}
              type="button"
              onClick={(e) => goToPage(`${study[i].studyId}`, e)}
            >
              방문하기
            </button>
            <span
              style={{
                marginLeft: '10px',
                color: 'rgb(100,100,100)',
                fontSize: '12px',
              }}
            >
              생성일 : {study[i].createDate.slice(0, 10)}
            </span>
            <p>관심분야 : {study[i].interest}</p>
          </div>
        );
      }
      return <div>{list}</div>;
    }
    return <div>스터디를 신청해 보세요!</div>;
  };

  return (
    <div className="back">
      <div style={{ height: '145px' }} />
      {loginPage && (
        <div className="main">
          {/* 왼쪽 공간 */}
          <div className="profile">
            <h1
              style={{
                marginBottom: '0px',
              }}
            >
              {Info.userName}님의 프로필
            </h1>
            <p
              style={{
                marginTop: '5px',
                marginBottom: '30px',
                color: 'rgb(100, 100, 100)',
                fontSize: '14px',
              }}
            >
              가입일 : {userInfo.createDate.slice(0, 10)}
            </p>
            <hr />
            <br />
            <p>E-mail : {userInfo.email}</p>
            <br />
            <p>가입된 스터디 : {userInfo.joinStudy.length}개</p>
            <p style={{ marginBottom: '5px' }}>
              작성한 글 수 : {userInfo.studyArticles.length}개
            </p>
            <p className="profileAlert">* 삭제한 글은 포함되지 않아요.</p>
            <p style={{ marginBottom: '5px' }}>
              작성한 댓글 수 : {userInfo.studyComments.length}개
            </p>
            <p className="profileAlert">* 삭제한 댓글은 포함되지 않아요.</p>
          </div>
          {/* 오른쪽 공간 */}
          <div className="right">
            {/* 오른 위 */}
            <div className="first">
              <div>
                <h2>스터디 목록</h2>
                <hr />
              </div>
              <div style={{ overflowY: 'auto', height: '380px' }}>
                {studyList()}
              </div>
            </div>
            {/* 오른 아래 */}
            <div className="second">
              <h3>회원관리</h3>
              <UserDelete />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'end' }}>
            <img
              style={{ marginBottom: '150px' }}
              src={profileAnt}
              alt="ant"
              width={150}
              height={300}
            />
          </div>
        </div>
      )}
      {!loginPage && (
        <div>
          <h1>안녕하세요 로그인을 해주시겠어요?</h1>
        </div>
      )}
    </div>
  );
}

export default Profile;
