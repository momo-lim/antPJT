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

export default function BtnChangeStudyInfo(props) {
  const [interest, setInterest] = useState('');
  const [name, setStudyName] = useState('');
  const userId = useSelector((state) => state.user.userInfo.userId);
  const { studyInfo } = props;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleStudyName = (e) => {
    setStudyName(e.target.value);
  };
  const handleInterest = (e) => {
    setInterest(e.target.value);
  };

  const onClickChange = () => {
    axios
      .put(
        `/api/study/${studyInfo.studyId}?interest=${interest}&loginUserId=${userId}&name=${name}`,
        [],
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        handleClose();
        // eslint-disable-next-line no-restricted-globals
        location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <hr />
      <button type="submit" onClick={handleOpen}>
        스터디 정보 수정
      </button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            스터디 정보 수정
          </Typography>
          <div>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="스터디 이름"
              type="title"
              fullWidth
              variant="standard"
              onChange={handleStudyName}
            />
          </div>
          <div>
            <TextField
              autoFocus
              margin="dense"
              label="관심 분야"
              type="title"
              fullWidth
              variant="outlined"
              multiline
              rows={15}
              onChange={handleInterest}
            />
          </div>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <button type="submit" onClick={onClickChange}>
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
