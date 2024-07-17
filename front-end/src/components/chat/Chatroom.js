import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BasicNavbar from '../Navbar/BasicNavbar';
import './Chatroom.css';

const Chatroom = () => {
  const { sender, receiver } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [roomMessages, setRoomMessages] = useState([]);
  const [myNickname, setMyNickname] = useState(''); // 닉네임 상태 추가

  const fetchMessages = async () => {
    try {
      console.log(`Fetching messages for sender ${sender} to receiver ${receiver}`);
      const response = await axios.get(`/chat/chatroom/${sender}/to/${receiver}/messages`);
      console.log('Fetched messages:', response.data);
      if (Array.isArray(response.data)) {
        const processedMessages = response.data.map((msg) => ({
          ...msg,
          isMyMessage: msg.receiver_id === receiver && msg.sender_id === sender,
        }));
        setMessages(processedMessages);
      } else {
        console.error('Fetched data is not an array:', response.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('/api/user'); // 사용자의 닉네임을 가져오는 API 엔드포인트
      setMyNickname(response.data.nickname);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get('/api/user', { withCredentials: true }); // 사용자 정보를 가져오는 API 엔드포인트
      setMyNickname(response.data.nickname);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
    fetchUserInfo(); // 사용자 정보 로드
    //인터벌
    const interval = setInterval(fetchMessages, 5000);

    //초기화
    return () => clearInterval(interval);
  }, [sender, receiver]);

  useEffect(() => {
    console.log('Messages state updated:', messages);
    if (Array.isArray(messages) && messages.length) {
      setRoomMessages(
        messages.filter(
          (msg) =>
            (msg.receiver_id === receiver && msg.sender_id === sender) ||
            (msg.receiver_id === sender && msg.sender_id === receiver)
        )
      );
    }
  }, [messages, receiver, sender]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === '') return;
    try {
      const formattedMessage = `${myNickname} : ${newMessage}`;
      console.log('Sending message:', {
        sender,
        receiver,
        content: formattedMessage,
      });
      const sender_id = sender;
      const receiver_id = receiver;

      console.log('Sending message:', {
        sender_id,
        receiver_id,
        content: formattedMessage,
      });

      //백엔드에 보내기
      const response = await axios.post(`/chat/chatroom/${sender}/to/${receiver}/messages`, {
        sender,
        receiver,
        content: formattedMessage,
      });
      console.log('Response:', response);

      const newMsg = {
        sender_id,
        receiver_id,
        content: formattedMessage,
        isMyMessage: true,
      };

      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };
  return (
    <div className="chattingRoomAll">
      <BasicNavbar title="채팅" />
      <div className="chattingRoom">
        <div className="chatroom-messages">
          {roomMessages.map((msg, index) => (
            <div key={index} className={msg.isMyMessage ? 'my-message-container' : 'other-message-container'}>
              <p className={msg.isMyMessage ? 'my-message' : 'other-message'}>{msg.content}</p>
            </div>
          ))}
        </div>
        <div className="msgsendItem">
          <div className="inputMessage">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Typing your message"
            />
          </div>
          <div className="sendBtnContent">
            <button onClick={handleSendMessage} className="sendmessageBtn">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatroom;
