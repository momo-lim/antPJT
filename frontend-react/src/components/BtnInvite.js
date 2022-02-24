import axios from 'axios';
import Box from '@mui/material/Box';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Typography from '@mui/material/Typography';
import { Modal, TextField } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function BtnInvite(props) {
  const Info = useSelector((state) => state.user.userInfo);
  const { studyInfo } = props;
  const { studyMember } = props;
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };
  const handleContent = (e) => {
    setContent(e.target.value);
  };

  // 모집글 작성하기
  const onInvite = (e) => {
    e.preventDefault();
    const data = {
      content,
      title,
    };
    axios
      .post(
        `/api/match?loginUserId=${Info.userId}&studyId=${studyInfo.studyId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((res) => {
        console.log(res, '모집글 작성');
        alert('작성하였습니다');
        handleClose();
      })
      .catch((err) => console.log(err, '작성 error'));
  };

  return (
    <div>
      <hr />
      {/* 모집글 작성하기 */}
      <button type="submit" onClick={handleOpen}>
        모집글 작성하기
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          width: '400px',
        }}
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            모집글 작성
          </Typography>
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
          </div>
          <div>
            <TextField
              autoFocus
              margin="dense"
              label="내용"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={15}
              onChange={handleContent}
            />
          </div>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            스터디 이름 : {studyInfo.studyName}
            <br />
            관심 분야 : {studyInfo.interest}
            <br />
            현재 인원 : {studyMember.length}
          </Typography>
          <hr />
          <Typography id="modal-modal-title" variant="h6" component="h2">
            작성하시겠습니까?
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <button type="submit" onClick={onInvite}>
              수락
            </button>
            <button type="submit" onClick={handleClose}>
              거절
            </button>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
