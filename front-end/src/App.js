import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';

import Signup from './components/mypage/Signup.js';
import Login from './components/mypage/Login.js';
import Mypage from './components/mypage/Mypage.js';
import MypageEdit from './components/mypage/MypageEdit.js';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <div className="content">
          <Routes>
            <Route path="/signuppage" element={<Signup />} />
            <Route path="/loginpage" element={<Login />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/mypage/edit" element={<MypageEdit />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
