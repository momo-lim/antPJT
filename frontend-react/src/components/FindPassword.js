import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  TextField,
  Button,
  DialogTitle,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';

// 1단계 : email 기입 -> email 존재 확인후 존재하면 setLevel+1 || 버튼 : next버튼 닫기버튼
// 2단계 : 질문 리스트에서 선택 후 답변 기입 -> 해당 이메일에 기입된 정보가 맞으면 수정페이지로 이동 || 버튼 : prev / next / close
// 3단계 : 수정페이지에서 새로운 password 및 password_confirm 확인 후 valid하면 해당 유저의 정보수정 (PUT메서드)
export default function FindPassword(props) {
  const navigate = useNavigate();
  const [level, setLevel] = useState(0);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [pwAnswer, setAnswer] = useState('');
  const [pwQuestion, setPwQuestion] = useState(1);
  const { handleClickClose } = props;

  // 인풋 입력
  const handlePassword = (e) => {
    setPassword(e.target.value);
  };
  const handlePasswordConfirm = (e) => {
    setPasswordConfirm(e.target.value);
  };
  const handleEmail = (e) => {
    setEmail(e.target.value);
  };
  const handleQuestion = (e) => {
    setPwQuestion(e.target.value);
  };
  const handlePwAnswer = (e) => {
    setAnswer(e.target.value);
  };

  // 돌아가기 버튼
  const handlePrev = () => {
    if (level >= 1) {
      setLevel(level - 1);
    }
  };

  // 인풋 검사
  const emailCheck = () => {
    if (email === '') {
      alert('email을 입력해주세요');
    } else {
      axios
        .get(`/api/account/search?email=${email}`)
        // .get(`/account/{id}?email=${email}`)
        .then((res) => {
          if (res.data !== 'none') {
            console.log('email 조회 완료');
            setLevel(level + 1);
          } else {
            alert('email을 다시 확인해주세요.');
          }
        })
        .catch((error) => {
          console.log(error);
          alert('email을 다시 확인해주세요.');
        });
    }
  };
  const questionCheck = () => {
    const body = {
      email,
      question: pwQuestion,
      answer: pwAnswer,
    };
    console.log(body);
    axios
      .post('/api/account/find_pw', body)
      .then((res) => {
        if (res.data === 'Success') {
          console.log(res);
          setLevel(level + 1);
        } else {
          alert('오류!');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // 비번 제출
  const submitNewPassword = () => {
    if (password !== passwordConfirm) {
      alert('비밀번호가 맞지 않습니다.');
      console.log('비번 안 맞음');
    } else {
      const body = {
        email,
        question: pwQuestion,
        answer: pwAnswer,
        password,
      };
      // test용
      console.log(body);
      axios
        .post('/api/account/find_pw/success', body)
        .then((res) => {
          // 비번 변경 성공 메시지
          alert('비밀번호 변경이 완료되었습니다! 다시 로그인해주세요!');
          console.log(res);
          navigate('/login');
        })
        .catch((error) => {
          // 비번 변경 실패 메시지
          console.log(error);
          alert('비밀번호 변경에 실패했습니다.');
        });

      handleClickClose();
      navigate('/login');
    }
  };

  // const submit = (res) => {
  //   axios.post()
  // }

  return (
    <div>
      <Dialog open>
        <DialogTitle>
          비밀번호 찾기[
          {level + 1}
          /3]
        </DialogTitle>
        <DialogContent>
          {level === 0 && (
            <div>
              <DialogContentText>
                비밀번호를 찾기 위해서 가입 이메일을 입력해주세요.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="name"
                label="E-mail Address"
                type="email"
                fullWidth
                variant="standard"
                onChange={handleEmail}
              />
            </div>
          )}

          {level === 1 && (
            <div>
              <br />
              <br />
              <br />
              <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">
                  비밀번호 찾기 힌트
                </InputLabel>
                <Select
                  value={pwQuestion}
                  label="비밀번호 찾기 힌트"
                  onChange={handleQuestion}
                >
                  <MenuItem value={1}>가장 기억에 남는 말은?</MenuItem>
                  <MenuItem value={2}>졸업한 초등학교 이름은?</MenuItem>
                  <MenuItem value={3}>고향 이름은?</MenuItem>
                </Select>
              </FormControl>
              <br />
              <TextField
                required
                fullWidth
                id="hintAnswer"
                label="힌트 답변"
                value={pwAnswer}
                onChange={handlePwAnswer}
              />
            </div>
          )}

          {level === 2 && (
            <div>
              <DialogContentText>
                새로운 비밀번호를 입력해주세요
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                id="paswword"
                label="Password"
                type="password"
                fullWidth
                variant="standard"
                onChange={handlePassword}
              />
              <TextField
                margin="dense"
                id="passwordConfirm"
                label="Password Confirmation"
                type="password"
                fullWidth
                variant="standard"
                onChange={handlePasswordConfirm}
              />
            </div>
          )}

          {/* {level === 3 && <div></div>} */}
        </DialogContent>
        <DialogActions>
          {level > 0 && <Button onClick={handlePrev}>◀ Prev</Button>}
          {level === 0 && <Button onClick={emailCheck}>Next ▶</Button>}
          {level === 1 && <Button onClick={questionCheck}>Submit ▶</Button>}
          {level === 2 && <Button onClick={submitNewPassword}>Enter</Button>}
          <Button onClick={handleClickClose}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
