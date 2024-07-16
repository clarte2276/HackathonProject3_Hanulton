import React, { useState, useEffect } from 'react';
import './Chatlist.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import BasicNavbar from '../Navbar/BasicNavbar';

const Chatlist = () => {
  const [dataList, setDataList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get('/process/check-login', { withCredentials: true })
      .then((response) => {
        if (!response.data.loggedIn) {
          navigate('/loginpage');
        } else {
          fetchChatList();
        }
      })
      .catch((error) => {
        console.error('Error checking login status:', error);
      });
  }, []);

  const fetchChatList = () => {
    axios
      .post('/chat/list', {}, { withCredentials: true })
      .then((response) => {
        setDataList(response.data);
      })
      .catch((error) => {
        console.error('There was an error fetching the chat list!', error);
      });
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = Array.isArray(dataList) ? dataList.slice(indexOfFirstPost, indexOfLastPost) : [];

  const handleChatItemClick = (userId) => {
    window.parent.postMessage({ userId }, '*');
  };

  return (
    <div>
      <BasicNavbar title="채팅" />
      <ul>
        {currentPosts.map((item) => (
          <li key={item.id}>
            <div className="img_name">
              <Link className="chat-item" onClick={() => handleChatItemClick(item.id)}>
                <span className="user_nickname">{item.nickname}</span>
              </Link>
            </div>
          </li>
        ))}
      </ul>
      <div className="pagination">
        {Array.from({ length: Math.ceil(dataList.length / postsPerPage) }, (_, i) => (
          <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={currentPage === i + 1 ? 'active' : ''}>
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Chatlist;
