import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
// import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import SockJsClient from 'react-stomp';
import { Fab, Input } from '@mui/material';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import '../css/Chat.css';

export default function Chat({ studyName }) {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState('');
  const loginCheck = useSelector((state) => state.user.isLogin);
  const yourId = useSelector((state) => state.user.userInfo.userId);
  const userName = useSelector((state) => state.user.userInfo.userName);
  const $websocket = useRef(null);
  const scrollRef = useRef(null);
  const { studyId } = useParams();
  const [chatting, setChatting] = useState([]);
  const handleClickSendTo = (e) => {
    if (e.key === 'Enter' && content !== '') {
      setContent('');
      $websocket.current.sendMessage(
        `/study/${studyId}`,
        JSON.stringify({
          userId: yourId,
          name: userName,
          content: e.target.value,
        })
      );
    }
  };

  const scrollToBottom = () => {
    scrollRef.current.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatting]);

  const handleContent = (e) => {
    setContent(e.target.value);
  };

  // 서버로부터 메시지가 왔을 때 실행되는 부분
  const onAlert = (msg) => {
    setChatting([...chatting, msg]);
  };

  // -----------------------------css---------------------------------
  const chatIconPosition = {
    position: 'fixed',
    right: '47px',
    bottom: '140px',
  };
  const chatIconPosition2 = {
    position: 'fixed',
    right: '54px',
    bottom: '100px',
    fontWeight: '700',
  };
  const chatItemViisible = {
    visibility: 'visible',
    opacity: '90%',
    width: '350px',
    height: '480px',
    background: 'white',
    position: 'fixed',
    right: '20px',
    bottom: '200px',
    border: '1px solid',
    borderRadius: '10px',
    padding: '10px',
    zIndex: '5',
  };
  const chatItemInvisible = {
    visibility: 'hidden',
    width: '0px',
    height: '0px',
    position: 'fixed',
  };

  const chatInputStyle = { marginTop: '15px' };

  return (
    <div>
      {loginCheck && (
        <div>
          <Fab
            style={chatIconPosition}
            size="medium"
            color="secondary"
            aria-label="chat"
            onClick={() => setShow(!show)}
          >
            <ChatBubbleOutlineIcon />
          </Fab>
          <p style={chatIconPosition2}>채팅</p>
          <div style={show ? chatItemViisible : chatItemInvisible}>
            <div className="chatTitle">
              <p>{studyName}</p>
            </div>
            <div id="chatLog" className="chatLog">
              {chatting.map((item) => (
                <div className="cleanDiv">
                  {item.userId !== yourId ? (
                    <div className="cleanDiv">
                      <p className="yourName">{item.name}</p>
                      <p className="yourMessage">{item.content}</p>
                    </div>
                  ) : (
                    <div className="cleanDiv myMessageDiv">
                      <p className="myMessage">{item.content}</p>
                    </div>
                  )}
                </div>
              ))}
              <div ref={scrollRef} />
            </div>
            <div style={chatInputStyle}>
              <Input
                placeholder="채팅을 입력해주세요"
                size="small"
                autoFocus
                fullWidth
                onKeyPress={handleClickSendTo}
                onChange={handleContent}
                value={content}
              />
            </div>
          </div>
          <SockJsClient
            url="http://i6d207.p.ssafy.io/api/happy-ant-websocket"
            topics={[`/study/${studyId}`]}
            onMessage={onAlert}
            ref={$websocket}
          />
        </div>
      )}
    </div>
  );
}
