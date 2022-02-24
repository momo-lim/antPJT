import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Box from '@mui/material/Box';
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

export default function BtnEntrust(props) {
  const [memberList, setMemberList] = useState([]);
  const [selected, setSelected] = useState('');
  const Info = useSelector((state) => state.user.userInfo);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleOpen2 = () => setOpen2(true);
  const handleClose = () => setOpen(false);
  const handleClose2 = () => setOpen2(false);

  const { studyId } = props;
  // 해당 스터디의 멤버 조회
  const member = () => {
    axios
      .get(`/api/study/${studyId}/member`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((res) => {
        setMemberList(res.data);
      })
      .catch((err) => {
        console.log(err, 'member error');
      });
  };
  useEffect(() => {
    member();
  }, []);

  const handleSelect = (e) => {
    setSelected(e.target.value);
    console.log(selected, 'select');
  };

  // 위임하기
  const onEntrust = (e) => {
    e.preventDefault();
    console.log('entrust');
    axios
      .post(
        `/api/study/${studyId}/member/${selected}/leader?loginUserId=${Info.userId}`,
        [],
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((res) => {
        console.log(res.data, '위임완료');
        handleClose();
        // eslint-disable-next-line no-restricted-globals
        location.reload();
      })
      .catch((err) => console.log(err, '위임 error'));
  };

  // 추방하기
  const onDeport = (e) => {
    e.preventDefault();
    console.log('onclick');
    axios
      .delete(
        `/api/study/${studyId}/member/${selected}?loginUserId=${Info.userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
        }
      )
      .then((res) => {
        console.log(res, '스터디원 추방');
        alert('추방하였습니다');
        handleClose2();
      })
      .catch((err) => console.log(err, '추방 error'));
  };

  return (
    <div>
      <hr />
      {/* 위임,추방 option */}
      <h4>위임 / 추방</h4>
      <div>
        <select onChange={handleSelect} value={selected}>
          {memberList.map((item) => (
            <option value={item.userId} key={item.userId}>
              {item.userName}
            </option>
          ))}
        </select>

        {/* 위임하기 */}
        <br />
        <button type="submit" onClick={handleOpen}>
          위임하기
        </button>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              위임하시겠습니까?
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <button type="submit" onClick={onEntrust}>
                수락
              </button>
              <button type="submit" onClick={handleClose}>
                거절
              </button>
            </Typography>
          </Box>
        </Modal>

        {/* 추방하기 */}
        <button type="submit" onClick={handleOpen2}>
          추방하기
        </button>
        <Modal
          open={open2}
          onClose={handleClose2}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              추방하시겠습니까?
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <button type="submit" onClick={onDeport}>
                수락
              </button>
              <button type="submit" onClick={handleClose2}>
                거절
              </button>
            </Typography>
          </Box>
        </Modal>
      </div>
    </div>
  );
}
