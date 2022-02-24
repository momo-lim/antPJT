import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { TextField, Button } from '@mui/material';
import axios from 'axios';

export default function StudyCommentCreate({ articleId, reRender }) {
  const yourId = useSelector((state) => state.user.userInfo.userId);
  const [inputContent, setIntputContent] = useState('');
  const { studyId } = useParams();
  const handleContent = (e) => setIntputContent(e.target.value);

  const submitContent = () => {
    if (inputContent !== '') {
      axios
        .post(`/api/study/${studyId}/${articleId}`, [], {
          params: {
            content: inputContent,
            loginUserId: yourId,
          },
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        })
        .then((res) => {
          console.log(res);
          reRender();
          setIntputContent('');
        })
        .catch((err) => console.log(err));
    } else {
      alert('내용을 입력해주세요');
    }
  };
  const submitWithEnter = (e) => {
    if (e.key === 'Enter' && inputContent !== '') {
      submitContent();
    }
  };

  return (
    <div className="wrap">
      <TextField
        style={{ marginLeft: '20px', width: '85%' }}
        value={inputContent}
        onChange={handleContent}
        onKeyPress={submitWithEnter}
        size="small"
        variant="standard"
        placeholder="댓글을 써주세요."
        multiline
      />
      <Button size="small" variant="contained" onClick={submitContent}>
        작성
      </Button>
    </div>
  );
}
