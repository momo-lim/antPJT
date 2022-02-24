import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { Wysiwyg } from '@mui/icons-material';
import ContentEditor from './ContentEditor';
import InfoSearchStudy from './InfoSearchStudy';

export default function StudyItemCreate(props) {
  const { studyId } = useParams();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [financeCode, setFinanceCode] = useState('');
  const [financeData, setFinanceData] = useState([]);

  const userId = useSelector((state) => state.user.userInfo.userId);
  const { handleClickClose } = props;

  const handleTitle = (e) => {
    setTitle(e.target.value);
  };
  // const handleContent = (e) => {
  //   setContent(e.target.value);
  // };

  useEffect(() => {
    axios
      .get(`/api/finance/${financeCode}`)
      .then((res) => {
        setFinanceData(res.data);
      })
      .catch((err) => {
        console.log(err);
        alert('종목을 제대로 입력해주세요.');
      });
  }, [financeCode]);

  const onClickCreate = () => {
    let temp = '';
    if (financeData.curPrice) temp = financeData.curPrice.replace(',', '');

    const body = {
      title,
      content,
      stockCode: financeData.code,
      stockName: financeData.stockName,
      stockPrice: temp,
    };

    if (title === '') {
      alert('제목을 입력해주세요.');
    } else if (content === '') {
      alert('내용을 입력해주세요.');
    } else {
      console.log(body);
      axios
        .post(`/api/study/${studyId}`, body, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
          },
          params: {
            loginUserId: userId,
          },
        })
        .then((res) => {
          console.log(res);
          handleClickClose();
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  // -----------------------------------css--------------------------------
  const DialogTitleDesign = {
    display: 'table',
    backgroundColor: '#001E60',
    textAlign: 'left',
    color: 'white',
    marginLeft: '1.5rem',
    borderBottomLeftRadius: '1.5rem',
    fontWeight: 'bold',
  };

  const DialogTitleText = {
    display: 'table-cell',
    verticalAlign: 'middle',
    marginTop: '0px',
    marginBottom: '0px',
  };
  const DialogTitleIcon = {
    display: 'table-cell',
    verticalAlign: 'middle',
    marginTop: '3px',
    marginRight: '-20px',
    marginBottom: '0px',
  };

  return (
    <div>
      <Dialog open fullWidth maxWidth="md">
        <DialogTitle style={DialogTitleDesign}>
          <Wysiwyg sx={{ fontSize: 25 }} style={DialogTitleIcon} />
          <p style={DialogTitleText}>Study 글쓰기</p>
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="제목을 입력해 주세요."
            type="title"
            fullWidth
            variant="standard"
            onChange={handleTitle}
          />

          <InfoSearchStudy getData={setFinanceCode} />
          {financeData.stockName && (
            <div style={{ margin: '20px', marginBottom: '20px' }}>
              <span style={{ color: 'rgb(10, 0, 97)', fontWeight: '700' }}>
                {' '}
                · {financeData.stockName}
              </span>
            </div>
          )}
          <ContentEditor setText={setContent} />
          <hr />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={onClickCreate} size="small">
            작성
          </Button>
          <Button variant="contained" onClick={handleClickClose} size="small">
            닫기
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
