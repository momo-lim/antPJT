import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import ContentEditor from './ContentEditor';

export default function StudyItemUpdate({ articleId, refresh }) {
  const { studyId } = useParams();
  const yourId = useSelector((state) => state.user.userInfo.userId);

  const [modalState, setModalState] = useState(false);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const [item, setItem] = useState('');

  // 마운트때는 실행하지 않고 item state가 변경됐을때만 실행 (처음 렌더링때 실행 안 한다)
  const didMount = useRef(false);
  useEffect(() => {
    if (didMount.current) setModalState(true);
    else didMount.current = true;
  }, [item]);

  const modalOpen = (e) => {
    e.preventDefault();
    axios
      .get(`/api/study/${studyId}/${articleId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((res) => {
        setItem(res.data);
      })
      .catch((err) => console.log(err));
  };
  const modalClose = () => {
    setModalState(false);
  };

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };

  // 작성 버튼 클릭
  const updateArticle = () => {
    const body = {
      title,
      content,
      loginUserId: yourId,
    };

    axios
      .put(`/api/study/${studyId}/${articleId}`, [], {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: body,
      })
      .then((res) => {
        console.log(res);
        refresh();
        modalClose();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // ----------------------------css ----------------------------
  const DialogTitleDesign = {
    backgroundColor: '#001E60',
    textAlign: 'left',
    color: 'white',
    marginLeft: '1.5rem',
    borderBottomLeftRadius: '1.5rem',
    fontWeight: 'bold',
  };

  return (
    <div>
      <a key={`updateButton${articleId}`} href="/" onClick={modalOpen}>
        수정
      </a>
      <Dialog open={modalState} fullWidth maxWidth="md">
        <DialogTitle style={DialogTitleDesign}>
          게시글을 수정해주세요.
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="제목"
            type="title"
            fullWidth
            variant="standard"
            defaultValue={item.title}
            onChange={handleTitle}
          />
          <ContentEditor setText={setContent} initialValue={item.content} />
        </DialogContent>
        <DialogActions>
          <Button onClick={updateArticle}>완료</Button>
          <Button onClick={modalClose}>닫기</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
