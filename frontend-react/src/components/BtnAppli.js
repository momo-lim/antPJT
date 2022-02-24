import axios from 'axios';
import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import { Button, Input } from '@mui/material';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

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

export default function BtnAppli(props) {
  const { item, yourId } = props;
  const [inputContent, setInputContent] = useState('');
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // content 입력
  const handleInputContent = (e) => {
    setInputContent(e.target.value);
  };

  const applyStudy = () => {
    console.log(item.articleId, yourId);
    axios
      .post(`/api/match/join/${item.articleId}`, [], {
        params: {
          joinUserId: yourId,
          content: inputContent,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then(() => {
        alert('신청되었습니다.');
        handleClose();
      })
      .catch(() => {
        alert('이미 신청한 스터디입니다.');
        handleClose();
      });
  };

  return (
    <div>
      <Button onClick={handleOpen}>신청</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <Input
              placeholder="각오 한 마디"
              value={inputContent}
              onChange={handleInputContent}
              fullwidth
            />
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <button type="submit" onClick={applyStudy}>
              신청
            </button>
            <button type="submit" onClick={handleClose}>
              취소
            </button>
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}
