import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import MatchItemAppliAccept from './MatchItemAppliAccept';

export default function MatchingAppliList(props) {
  const { item } = props;
  const { pk } = props;
  const yourId = useSelector((state) => state.user.userInfo.userId);
  const [applilist, setApplilist] = useState('');
  console.log(pk, 'ok');
  // 신청자 정보 받아오기
  const getApplilist = () => {
    axios
      .get(`/api/match/join/${pk}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((res) => {
        console.log(res.data, '신청자 리스트');
        setApplilist(res.data);
      })
      .catch((err) => console.log(err, 'applierror'));
  };
  if (!applilist.length) {
    getApplilist();
  }
  // 로그인 한 사람과 작성자가 같을 시 보이는 부분
  if (item.writerId === yourId) {
    const listing = () => {
      const result = [];
      for (let i = 0; i < applilist.length; i += 1) {
        // 지원자의 state의 상태를 통해 리스트에 띄울지 말지 정함
        if (!applilist[i].state) {
          result.push(
            <div key={i}>
              <span>
                {`${applilist[i].userName}`}
                <MatchItemAppliAccept
                  pk={pk}
                  content={applilist[i].content}
                  userId={applilist[i].userId}
                  refresh={getApplilist}
                />
              </span>
            </div>
          );
        }
      }
      return result;
    };

    return (
      <div>
        <hr />
        <h4>신청자</h4>
        {listing()}
      </div>
    );
  }
  // 로그인 한 유저와 작성자가 다를 시 null 추출
  return null;
}
