import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import axios from 'axios';
import MatchItemUpdate from './MatchItemUpdate';
import MatchItemDetail from './MatchItemDetail';
import MatchItemAppliList from './MatchItemAppliList';
import BtnAppli from './BtnAppli';

// 글작성자 ? 수정/삭제/닫기 : 닫기    || 드랍다운(수정/삭제) 우측 상단 & 닫기 우측하단
// 수정창에서 닫기버튼 누르면 디테일로
export default function MatchItemModal({ pk, handleClickClose }) {
  const yourId = useSelector((state) => state.user.userInfo.userId);
  const [item, setItem] = useState([]);
  const [mode, setMode] = useState(1);
  const goUpdate = () => {
    setMode(2);
  };
  const getItem = () => {
    axios
      .get(`/api/match/${pk}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((res) => {
        console.log(res.data, 'console');
        setItem(res.data);
      })
      .catch((err) => {
        console.log(err);
        alert('존재하지 않는 글입니다');
        handleClickClose();
      });
  };
  useEffect(() => {
    getItem();
  }, []);
  const goDetail = () => {
    getItem();
    setMode(1);
    // item을 다시 가져옴
  };
  // 마감
  const setStateTrue = () => {
    axios
      .put(
        `/api/match/${item.articleId}?state=${true}&loginUserId=${yourId}`,
        [],
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then(() => {
        getItem();
      })
      .catch((err) => console.log(err));
  };
  // 모집
  const setStateFalse = () => {
    axios
      .put(
        `/api/match/${item.articleId}?state=${false}&loginUserId=${yourId}`,
        [],
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then(() => {
        getItem();
      })
      .catch((err) => console.log(err));
  };
  // 삭제
  const deleteItem = () => {
    axios.delete(`/api/match/${item.articleId}`, {
      params: { loginUserId: yourId },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    });
    handleClickClose();
  };

  // ---------------------------css-------------------------------

  return (
    <div>
      <Dialog fullWidth maxWidth="md" open>
        {mode === 1 && (
          <div>
            <MatchItemDetail item={item} />
            {item.writerId === yourId && (
              <MatchItemAppliList item={item} pk={pk} />
            )}
          </div>
        )}
        {mode === 2 && <MatchItemUpdate item={item} goDetail={goDetail} />}
        <DialogActions>
          {/* ---------------------------작성자아닐때 버튼(신청버튼)--------------------------- */}
          {item.writerId !== yourId && mode === 1 && (
            <BtnAppli item={item} yourId={yourId} />
          )}
          {/* ---------------------------작성자일 때 보여지는 버튼--------------------------- */}
          {item.writerId === yourId && mode === 1 && (
            <div>
              {item.state === true && (
                <Button onClick={setStateFalse}>모집</Button>
              )}
              {item.state === false && (
                <Button onClick={setStateTrue}>마감</Button>
              )}
              <Button onClick={goUpdate}>수정</Button>
              <Button onClick={deleteItem}>삭제</Button>
            </div>
          )}
          {mode === 2 && (
            <div>
              <Button onClick={goDetail}>이전</Button>
            </div>
          )}
          <Button onClick={handleClickClose}>닫기</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
