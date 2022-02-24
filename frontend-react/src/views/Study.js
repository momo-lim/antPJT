import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import Fab from '@mui/material/Fab';
import AddIcon from '@mui/icons-material/Add';
import StudyItemCreate from '../components/StudyItemCreate';
import MatchItemCreate from '../components/MatchItemCreate';
import Chat from '../websocket/Chat';
import StudyList from './StudyList';
import BtnEntrust from '../components/BtnEntrust';
import BtnDelete from '../components/BtnDelete';
import StudyMemberInvite from '../components/StudyMemberInvite';
import BtnChangeStudyInfo from '../components/BtnChangeStudyInfo';
import StudyDelete from '../components/StudyDelete';
import '../css/Study.css';

export default function Study() {
  const { studyId } = useParams();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [open3, setOpen3] = useState(false);
  const [studyInfo, setStudyInfo] = useState('');
  const [studyMember, setMemberInfo] = useState('');
  const [refresh, setRefresh] = useState(false);
  const handleClickOpen3 = () => {
    setOpen3(true);
  };
  const handleClickClose3 = () => {
    setOpen3(false);
    setRefresh(!refresh);
  };

  useEffect(() => {
    axios({
      method: 'get',
      url: `/api/study/${studyId}`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then((response) => {
        setStudyInfo(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    axios({
      method: 'get',
      url: `/api/study/${studyId}/member`,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
      .then((response) => {
        setMemberInfo(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);
  console.log(studyInfo, 'studyInfo');
  console.log(studyMember, 'studyMember');
  // ----------------------css-------------------
  const asideDiv = {
    width: '150px',
    height: '87vh',
    borderRadius: '7px',
    paddingLeft: '.5rem',
    marginTop: '115px',
    marginLeft: '10px',
    float: 'left',
    backgroundColor: '#ffffff',
    position: 'fixed',
    z: -1,
  };

  const sectionDiv = {
    width: '90%',
    float: 'left',
    margin: '.5rem',
    marginRight: '2rem',
    marginTop: '105px',
    marginLeft: '150px',
    padding: '.5rem',
  };

  const createIconPosition = {
    position: 'fixed',
    right: '47px',
    bottom: '50px',
  };
  const createIconPosition2 = {
    position: 'fixed',
    right: '20px',
    bottom: '10px',
    fontWeight: '900',
  };

  return (
    <div className="back">
      <Chat studyName={studyInfo.studyName} />
      <Fab
        color="primary"
        aria-label="add"
        style={createIconPosition}
        size="medium"
        onClick={handleClickOpen3}
      >
        <AddIcon />
      </Fab>
      <p style={createIconPosition2}>스터디 글쓰기</p>
      <aside className="shadow" style={asideDiv}>
        <h1>{studyInfo.studyName}</h1>
        {studyInfo.leaderId === userInfo.userId && <MatchItemCreate />}
        <br />
        <button type="submit" onClick={handleClickOpen3}>
          스터디글 작성
        </button>
        {/* 리더에게만 위임/추방 보여주기 */}
        {studyInfo.leaderId === userInfo.userId ? (
          <BtnEntrust studyId={studyId} />
        ) : null}
        {studyInfo.leaderId === userInfo.userId ? (
          <div>
            <BtnChangeStudyInfo studyInfo={studyInfo} />
            <StudyMemberInvite />
          </div>
        ) : null}
        <BtnDelete studyId={studyId} />
        {studyInfo.leaderId === userInfo.userId ? (
          <StudyDelete studyId={studyId} />
        ) : null}
      </aside>
      <section style={sectionDiv}>
        <StudyList studyId={studyId} refresh={refresh} />
        {open3 && <StudyItemCreate handleClickClose={handleClickClose3} />}
      </section>
      <div style={{ height: '95vh' }} />
    </div>
  );
}
