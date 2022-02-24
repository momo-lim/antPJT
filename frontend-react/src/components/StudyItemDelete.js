import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

export default function StudyItemDelete({ articleId, refresh }) {
  const { studyId } = useParams();
  const yourId = useSelector((state) => state.user.userInfo.userId);
  const deleteArticle = (e) => {
    e.preventDefault();
    axios
      .delete(`/api/study/${studyId}/${articleId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: {
          loginUserId: yourId,
        },
      })
      .then(() => {
        console.log('삭제성공');
        refresh();
      })
      .catch((err) => console.log(err));
  };

  return (
    <div style={{ marginLeft: '20px' }}>
      <a href="/" onClick={deleteArticle}>
        삭제
      </a>
    </div>
  );
}
