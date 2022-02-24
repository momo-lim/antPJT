import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  TextField,
} from '@mui/material';
import axios from 'axios';
import { useParams } from 'react-router-dom';

export default function StudyMemberInvite() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState(false);
  const [disabled, setDisabled] = useState(true);
  const [email, setEmail] = useState('');
  const { studyId } = useParams();

  useEffect(() => {
    setError(false);
    setEmail('');
    setDisabled(true);
  }, [open]);

  const emailCheck = (e) => {
    setEmail(e.target.value);
    axios
      .get(`/api/account/search?email=${e.target.value}`)
      .then((res) => {
        if (res.data !== 'none') {
          console.log('email 조회 완료');
          setError(false);
          setDisabled(false);
        } else {
          setError(true);
          setDisabled(true);
        }
      })
      .catch(setError(true));
  };

  const submitInvite = () => {
    axios
      .post(`/api/study/${studyId}/member/invite`, [], {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: { userEmail: email },
      })
      .then(alert(`${email}님에게 스터디 초대를 보냈습니다`))
      .catch((err) => console.log(err));
  };
  const closeModal = () => {
    setOpen(false);
  };
  const openModal = () => {
    setOpen(true);
  };

  return (
    <div>
      <button type="submit" onClick={openModal}>
        멤버 초대
      </button>
      <Dialog open={open}>
        <DialogTitle>스터디원 초대</DialogTitle>
        <DialogContent>
          <TextField
            style={{ margin: '10px', width: '400px' }}
            error={error}
            label="초대할 멤버의 이메일을 써주세요."
            variant="outlined"
            onChange={emailCheck}
          />
        </DialogContent>
        <DialogActions>
          <button disabled={disabled} type="submit" onClick={submitInvite}>
            초대
          </button>
          <button type="submit" onClick={closeModal}>
            닫기
          </button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
