import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Badge, IconButton, ClickAwayListener } from '@mui/material';
import CampaignIcon from '@mui/icons-material/Campaign';

export default function AlertList() {
  const [alertList, setAlertList] = useState([]);
  const [open, setOpen] = useState(false);
  const yourId = useSelector((state) => state.user.userInfo.userId);
  const count = useSelector((state) => state.user.alertLength);

  const getAlert = () => {
    axios
      .get(`/api/alert/${yourId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then((res) => {
        setAlertList(res.data);
      })
      .catch((err) => console.log(err));
  };
  const openTooltip = () => {
    if (open === false) {
      getAlert();
      setOpen(true);
    } else {
      setOpen(false);
    }
  };
  const closeTooltip = () => {
    setOpen(false);
  };

  // 링크 연결중 (시간되면 article 바로 띄워주는걸로)
  const getLink = (item) => {
    switch (item.type) {
      case 'MATCH':
        return `/study/${item.studyId}`;
      case 'INVITE':
        return '/profile';
      case 'ARTICLE':
        return `/study/${item.studyId}`;
      case 'COMMENT':
        return `/study/${item.studyId}`;
      default:
        return '/profile';
    }
  };

  function notificationsLabel(cnt) {
    if (cnt === 0) {
      return 'no notifications';
    }
    if (cnt > 99) {
      return 'more than 99 notifications';
    }
    return `${cnt} notifications`;
  }

  const deleteAlert = (alertId) => {
    axios
      .delete(`/api/alert/${yourId}/${alertId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then(() => {
        getAlert();
      })
      .catch((err) => console.log(err));
  };

  const studyAccept = (studyId, alertId) => {
    axios
      .post(`/api/study/${studyId}/member/${yourId}`, [], {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      .then(() => {
        deleteAlert(alertId);
        getAlert();
        alert('스터디에 가입되었어요!');
      });
  };

  const studyReject = () => {
    axios.post(`/api/`);
  };

  // ---------------------------css----------------------------------
  const ItemDesign = {
    textDecorationLine: 'none',
  };

  const styles = {
    position: 'absolute',
    top: '90px',
    right: '15px',
    zIndex: 1,
    border: '1px solid #010101',
    p: 1,
    backgroundColor: 'white',
    width: '350px',
    height: '300px',
    borderRadius: '5px',
    overflowY: 'auto',
    padding: '10px',
  };

  return (
    <ClickAwayListener
      mouseEvent="onMouseDown"
      touchEvent="onTouchStart"
      onClickAway={closeTooltip}
    >
      <div>
        <IconButton
          onClick={openTooltip}
          aria-label={notificationsLabel(count)}
        >
          <Badge color="primary" badgeContent={count}>
            <CampaignIcon />
          </Badge>
        </IconButton>
        {open ? (
          <div style={styles}>
            {alertList.length >= 1 ? (
              alertList
                .slice(0)
                .reverse()
                .map((item) => (
                  <div key={`alertItem${item.alertId}`}>
                    <a style={ItemDesign} href={getLink(item)}>
                      {item.message}
                    </a>
                    <button
                      key={`delete${item.alertId}`}
                      onClick={() => deleteAlert(item.alertId)}
                      type="submit"
                    >
                      삭제
                    </button>
                    {/* 초대 알람이면 [수락 / 거부] 버튼 표시 */}
                    {item.type === 'INVITE' && (
                      <div>
                        <button
                          key={`accept${item.alertId}`}
                          onClick={() =>
                            studyAccept(item.studyId, item.alertId)
                          }
                          type="submit"
                        >
                          수락
                        </button>
                        <button
                          key={`reject${item.alertId}`}
                          onClick={() => studyReject(item.studyId)}
                          type="submit"
                        >
                          거부
                        </button>
                      </div>
                    )}
                    <hr />
                  </div>
                ))
            ) : (
              <div>아무 소식이 없어요..</div>
            )}
          </div>
        ) : null}
      </div>
    </ClickAwayListener>
  );
}
