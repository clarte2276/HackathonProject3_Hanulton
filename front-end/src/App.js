import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import './App.css';

import Home from './components/home/Home';
import NavbarTop from './components/Navbar/NavbarTop';
import NavbarBottom from './components/Navbar/NavbarBottom';
import BoardBuy from './components/board/BoardBuy';

function App() {
  return (
    <div className="App">
      <Router>
        <div>
          <NavbarTop />
        </div>
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/buy" element={<BoardBuy />} />
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
