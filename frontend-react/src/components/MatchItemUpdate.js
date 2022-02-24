import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useSelector } from 'react-redux';
import ContentEditor from './ContentEditor';

export default function MatchItemUpdate(props) {
  const { item, goDetail } = props;

  const [inputTitle, setInputTitle] = useState('');
  const [inputContent, setInputContent] = useState('');
  const yourId = useSelector((state) => state.user.userInfo.userId);

  const handleInputTitle = (e) => {
    setInputTitle(e.target.value);
  };

  const clickSubmit = () => {
    console.log(item.articleId);
    console.log(yourId);
    axios
      .put(`/api/match/${item.articleId}`, [], {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: {
          loginUserId: yourId,
          title: inputTitle,
          content: inputContent,
        },
      })
      .then(goDetail)
      .catch((err) => console.log(err));
  };

  // ------------------------------css--------------------------------
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
          defaultValue={item.title}
          variant="standard"
          onChange={handleInputTitle}
        />
        <ContentEditor setText={setInputContent} initialValue={item.content} />
        <DialogActions>
          <Button onClick={clickSubmit}>완료✔</Button>
        </DialogActions>
      </DialogContent>
    </div>
  );
}
