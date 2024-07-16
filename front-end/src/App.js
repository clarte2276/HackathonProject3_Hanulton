import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/home/Home";
import NavbarBottom from "./components/Navbar/NavbarBottom";
import BoardBuy from "./components/board/BoardBuy";
import Signup from "./components/mypage/Signup.js";
import Login from "./components/mypage/Login.js";
import Mypage from "./components/mypage/Mypage.js";
import MypageEdit from "./components/mypage/MypageEdit.js";

function App() {
  return (
    <div className="App">
      <Router>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/boardbuy" element={<BoardBuy />} />
            <Route path="/signuppage" element={<Signup />} />
            <Route path="/loginpage" element={<Login />} />
            <Route path="/mypage" element={<Mypage />} />
            <Route path="/mypage/edit" element={<MypageEdit />} />
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
