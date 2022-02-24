import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import '../css/StudyCommentList.css';
import StudyCommentCreate from './StudyCommentCreate';

// 스터디의 게시글 id 받아옴 -> 해당 id로 코멘트 리스트 조회 -> 코멘트 개수 2개이상이면 거기부터 <더보기>로 표시 -> 더보기 클릭시 댓글 리스트 모달창으로 보여주고 무한스크롤 구현
// if 댓글작성자? 수정 삭제버튼 표시
export default function StudyCommentList({ articleId }) {
  const { studyId } = useParams();
  const [updateCommentContent, setUpdateCommentContent] = useState('');
  const [selectUpdateComment, setSelectUpdateComment] = useState('');
  const [comment, setComment] = useState([]);
  const yourId = useSelector((state) => state.user.userInfo.userId);

  const getComment = () => {
    axios
      .get(`/api/study/${studyId}/${articleId}/comment`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((res) => {
        setComment(res.data);
      });
  };

  const deleteComment = (e, commentId) => {
    e.preventDefault();
    console.log('삭제 시도');
    axios
      .delete(`/api/study/${studyId}/${articleId}/${commentId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: {
          loginUserId: yourId,
        },
      })
      .then(() => {
        setSelectUpdateComment('');
        getComment();
      })
      .catch((err) => console.log(err));
  };

  const checkEnterSubmit = (e, commentId) => {
    if (e.key === 'Enter') {
      axios
        .put(`/api/study/${studyId}/${articleId}/${commentId}`, [], {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            loginUserId: yourId,
            content: updateCommentContent,
          },
        })
        .then(() => {
          setSelectUpdateComment('');
          setUpdateCommentContent('');
          getComment();
        })
        .catch((err) => console.log(err));
    }
  };

  const submitUpdateCommentContent = (e, commentId) => {
    e.preventDefault();
    axios
      .put(`/api/study/${studyId}/${articleId}/${commentId}`, [], {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        params: {
          loginUserId: yourId,
          content: updateCommentContent,
        },
      })
      .then(() => {
        setSelectUpdateComment('');
        setUpdateCommentContent('');
        getComment();
      })
      .catch((err) => console.log(err));
  };

  const handleUpdateCommentContent = (e) => {
    setUpdateCommentContent(e.target.value);
  };
  const cancleUpdate = () => {
    setSelectUpdateComment('');
  };

  const handleSelectUpdateComment = (e, idx) => {
    e.preventDefault();
    setSelectUpdateComment(idx);
  };

  useEffect(() => {
    getComment();
  }, []);

  // ----------------------------------------css--------------------------------
  // -----------------------------------------------------------------------------렌더 ---------------------------------------------------------
  return (
    <div key={`studyArticleComment${articleId}`}>
      <div>
        {comment.length === 0 && <p>댓글이 없어요.</p>}
        {comment.map((item, idx) => (
          <div className="wrapComment">
            <hr />
            {/* -------댓글내용(수정하려고 선택된 댓글이면 수정 폼 보여줌)-------- */}

            <div className="itemComment">
              <div className="upperLineComm">
                <span className="nameComm">{item.writerName}</span>
                <span className="dateComm">
                  {item.createDate.slice(0, 10)} {item.createDate.slice(11)}
                </span>
                {yourId === item.writerId && (
                  <div>
                    {selectUpdateComment !== idx && (
                      <div className="iconComment">
                        <a
                          onClick={(e) => handleSelectUpdateComment(e, idx)}
                          href="/"
                          key={`commentUpdate${item.commentId}`}
                        >
                          <EditIcon fontSize="small" />
                        </a>
                        <a
                          key={`commentDelete${item.commentId}`}
                          onClick={(e) => deleteComment(e, item.commentId)}
                          href="/"
                        >
                          <DeleteForeverIcon fontSize="small" />
                        </a>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {selectUpdateComment === idx ? (
                <div className="updateLineComm">
                  <TextField
                    key={`update${item.commentId}`}
                    variant="standard"
                    defaultValue={item.content}
                    onChange={handleUpdateCommentContent}
                    onKeyPress={(e) => {
                      checkEnterSubmit(e, item.commentId);
                    }}
                    fullWidth
                  />

                  <Button
                    key={`commentUpdate${item.commentId}`}
                    onClick={(e) =>
                      submitUpdateCommentContent(e, item.commentId)
                    }
                  >
                    완료
                  </Button>
                  <Button
                    key={`commentDelete${item.commentId}`}
                    onClick={() => cancleUpdate()}
                  >
                    취소
                  </Button>
                </div>
              ) : (
                <span className="contentComm">{item.content}</span>
              )}
            </div>
          </div>
        ))}
      </div>
      <StudyCommentCreate articleId={articleId} reRender={getComment} />
    </div>
  );
}
