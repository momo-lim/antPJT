import axios from 'axios';
import * as React from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom';
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

export default function BtnDelete(props) {
  const Info = useSelector((state) => state.user.userInfo);
  const { studyId } = props;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const navigate = useNavigate();

  // 탈퇴하기
  const onDelete = (e) => {
    e.preventDefault();
    console.log('onclick');
    axios
      .delete(
        `/api/study/${studyId}/member/${Info.userId}?loginUserId=${Info.userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((res) => {
        console.log(res, '탈퇴');
        navigate('/profile');
      })
      .catch((err) => console.log(err, '탈퇴 error'));
  };

  return (
    <div>
      <Button onClick={handleOpen}>탈퇴하기</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            <p>탈퇴 시 재가입이 불가능합니다.</p>
            <p>탈퇴하시겠습니까?</p>
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            <button type="submit" onClick={onDelete}>
              탈퇴
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
