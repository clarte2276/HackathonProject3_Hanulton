import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./Chatroom.css";

const Chatroom = () => {
  const { sender, receiver } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [roomMessages, setRoomMessages] = useState([]);

  // 주기적으로 메시지를 가져오는 함수
  const fetchMessages = async () => {
    try {
      console.log(
        `Fetching messages for sender ${sender} to receiver ${receiver}`
      );
      const response = await axios.get(
        `/chat/chatroom/${sender}/to/${receiver}`
      );
      console.log("Fetched messages:", response.data);
      if (Array.isArray(response.data)) {
        setMessages(response.data);
      } else {
        console.error("Fetched data is not an array:", response.data);
        // 메세지를 받아올 때 isMyMessage 속성 설정
        const processedMessages = response.data.map((msg) => ({
          ...msg,
          isMyMessage: msg.receiver === receiver && msg.sender === sender,
        }));

        setMessages(processedMessages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  useEffect(() => {
    // 초기 메시지 로드
    fetchMessages();

    // 1초마다 fetchMessages 함수를 호출
    const interval = setInterval(fetchMessages, 5000);

    // 컴포넌트가 언마운트될 때 인터벌 정리
    return () => clearInterval(interval);
  }, [sender, receiver]);

  useEffect(() => {
    if (Array.isArray(messages) && messages.length) {
      setRoomMessages(
        messages.filter(
          (msg) =>
            (msg.receiver === receiver && msg.sender === sender) ||
            (msg.receiver === sender && msg.sender === receiver)
        )
      );
    }
  }, [messages, receiver, sender]);

  const handleSendMessage = async () => {
    if (newMessage.trim() === "") return;
    try {
      console.log("Sending message:", {
        sender,
        receiver,
        content: newMessage,
      });

      // 백엔드에 새 메시지 보내기
      const response = await axios.post(
        `/chat/chatroom/${sender}/to/${receiver}`,
        {
          sender,
          receiver,
          content: newMessage,
        }
      );

      console.log("Response:", response);

      // 메시지를 성공적으로 보낸 후 메시지 목록 업데이트
      const newMsg = {
        sender,
        receiver,
        content: newMessage,
        isMyMessage: true,
      };

      // 기존 메시지에 추가하지 않고 새 배열로 설정하여 유지
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="chattingRoom">
      <div className="chatroom-messages">
        {roomMessages.map((msg, index) => (
          <div
            key={index}
            className={
              msg.isMyMessage
                ? "my-message-container"
                : "other-message-container"
            }
          >
            <p className={msg.isMyMessage ? "my-message" : "other-message"}>
              {msg.content}
            </p>
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
        <button onClick={handleSendMessage} className="sendmessageBtn">
          Send
        </button>
      </div>
    </div>
  );
};

export default Chatroom;
