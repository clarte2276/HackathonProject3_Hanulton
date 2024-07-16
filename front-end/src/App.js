import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './components/home/Home';
import NavbarBottom from './components/Navbar/NavbarBottom';
import BoardSell from './components/board/BoardSell.js';
import SellCreate from './components/board/CRUD/SellCreate.js';
import SellRead from './components/board/CRUD/SellRead.js';
import Signup from './components/mypage/Signup.js';
import Login from './components/mypage/Login.js';
import Mypage from './components/mypage/Mypage.js';
import MypageEdit from './components/mypage/MypageEdit.js';
import Chatlist from './components/chat/Chatlist.js';
import Chatroom from './components/chat/Chatroom.js';

function App() {
  return (
    <div className="App">
      <Router>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/boardsell" element={<BoardSell />} />
            <Route path="/boardsell/process/new_Post" element={<SellCreate />} />
            <Route path="/boardsell/PostView/:no" element={<SellRead />} />
            <Route path="/signuppage" element={<Signup />} />
            <Route path="/loginpage" element={<Login />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/mypage/edit" element={<MypageEdit />} />
            <Route path="/chat/list" element={<Chatlist />} />
            <Route path="/chat/chatroom/:sender/to/:receiver" element={<Chatroom />} />
          </Routes>
        </div>
        <div>
          <NavbarBottom />
        </div>
      </Router>
    </div>
  );
}

export default App;
