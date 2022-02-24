import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { PersonSearch } from '@mui/icons-material';
import ContentEditor from './ContentEditor';

export default function MatchItemCreate() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const userId = useSelector((state) => state.user.userInfo.userId);
  const { studyId } = useParams();
  const [open, setOpen] = useState(false);

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleContent = (val) => {
    setContent(val);
    console.log(val);
  };

  const modalOpen = () => {
    setOpen(true);
  };
  const modalClose = () => {
    setOpen(false);
  };

  const onClickCreate = () => {
    const data = {
      title,
      content,
    };
    if (title === '') {
      alert('제목을 기입해주세요.');
    } else if (content === '') {
      alert('내용을 기입해주세요.');
    } else {
      axios
        .post('/api/match', data, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            studyId,
            loginUserId: userId,
          },
        })
        .then((response) => {
          console.log(response);
          modalClose();
        })
        .catch((error) => {
          console.log(error);
          modalClose();
        });
    }
  };

  // -------------------css---------------------------
  const DialogTitleDesign = {
    display: 'table',
    backgroundColor: '#001E60',
    textAlign: 'left',
    color: 'white',
    marginLeft: '1.5rem',
    borderBottomLeftRadius: '1.5rem',
    fontWeight: 'bold',
  };

  const DialogTitleText = {
    display: 'table-cell',
    verticalAlign: 'middle',
    marginTop: '0px',
    marginBottom: '0px',
  };
  const DialogTitleIcon = {
    display: 'table-cell',
    verticalAlign: 'middle',
    marginTop: '2px',
    marginRight: '-21px',
    marginBottom: '0px',
  };

  const BtnStyle = {
    border: '1px solid',
    borderColor: '#001E60',
    color: '#001E60',
  };

  return (
    <div>
      <button type="submit" onClick={modalOpen}>
        모집글작성
      </button>
      <Dialog open={open} fullWidth maxWidth="md">
        <DialogTitle style={DialogTitleDesign}>
          <PersonSearch sx={{ fontSize: 25 }} style={DialogTitleIcon} />
          <p style={DialogTitleText}>모집글쓰기</p>
        </DialogTitle>
        <DialogContent>
          <div>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="제목"
              type="title"
              fullWidth
              variant="standard"
              onChange={handleTitle}
            />
            <ContentEditor setText={handleContent} />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClickCreate} style={BtnStyle}>
            작성
          </Button>
          <Button onClick={modalClose} style={BtnStyle}>
            취소
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
