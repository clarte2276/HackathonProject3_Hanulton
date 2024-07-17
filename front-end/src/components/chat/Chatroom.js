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

  const fetchMessages = async () => {
    try {
      console.log(`Fetching messages for sender ${sender} to receiver ${receiver}`);
      const response = await axios.get(`/chat/chatroom/${sender}/to/${receiver}/messages`);
      console.log('Fetched messages:', response.data);
      if (Array.isArray(response.data)) {
        const processedMessages = response.data.map((msg) => ({
          ...msg,
        }));
        setMessages(processedMessages);
      } else {
        console.error('Fetched data is not an array:', response.data);
      }
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    fetchMessages();
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
      console.log('Sending message:', {
        sender,
        receiver,
        content: newMessage,
      });
      const sender_id = sender;
      const receiver_id = receiver;

      console.log('Sending message:', {
        sender_id,
        receiver_id,
        content: newMessage,
      });

      //백엔드에 보내기
      const response = await axios.post(`/chat/chatroom/${sender}/to/${receiver}/messages`, {
        sender,
        receiver,
        content: newMessage,
      });
      console.log('Response:', response);

      const newMsg = {
        sender_id,
        receiver_id,
        content: newMessage,
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
            <div key={index}>
              <p>{msg.content}</p>
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
