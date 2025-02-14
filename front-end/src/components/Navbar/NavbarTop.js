import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import plus from '../images/plus.png';
// import search from '../images/search.png';
import chat from '../images/chat.png';
import './NavbarTop.css';

function NavbarTop() {
  const location = useLocation();
  const navigate = useNavigate();
  const [view, setView] = useState(false);

  const checkLogin = async (e, targetPath) => {
    e.preventDefault(); // 링크 기본 동작을 막음
    console.log('checkLogin 호출됨');
    try {
      const response = await fetch('/process/check-login', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // 쿠키를 포함하여 요청
      });
      const result = await response.json();
      console.log('응답 받음:', result); // 디버깅용 로그
      if (result.loggedIn) {
        navigate(targetPath); // 로그인 상태라면 원래 가려던 경로로 이동
      } else {
        navigate('/Loginpage', { state: { from: targetPath } }); // 로그인되지 않은 상태라면 로그인 페이지로 리디렉션, 원래 경로 저장
      }
    } catch (error) {
      console.error('세션 확인 중 오류 발생:', error);
      navigate('/Loginpage', { state: { from: targetPath } }); // 오류 발생 시 로그인 페이지로 리디렉션, 원래 경로 저장
    }
  };

  function Dropdown() {
    return (
      <>
        {location.pathname !== '/boardsell' && (
          <div>
            <Link className="TapTap" to="/boardsell">
              우리요리
            </Link>
          </div>
        )}
        {location.pathname !== '/boardcookfriend' && (
          <div>
            <Link className="TapTap" to="/boardcookfriend">
              레시피 공유
            </Link>
          </div>
        )}
      </>
    );
  }

  const getGreetingText = () => {
    if (location.pathname === '/boardsell') {
      return '우리요리';
    } else if (location.pathname.startsWith('/boardsell')) {
      return '우리요리';
    } else if (location.pathname.startsWith('/boardcookfriend')) {
      return '레시피 공유';
    } else {
      return '반가워요!';
    }
  };

  const getNewPostPath = () => {
    if (location.pathname.startsWith('/boardsell')) {
      return '/boardsell/process/new_Post';
    } else if (location.pathname.startsWith('/boardcookfriend')) {
      return '/boardcookfriend/process/new_Post';
    } else {
      return '#';
    }
  };

  return (
    <div className="navbarTop_all">
      <div className="navbarTop_layout">
        <div>
          <ul
            className="menuTap"
            onClick={() => {
              setView(!view);
            }}
          >
            {getGreetingText()} {view ? '▲' : '▼'}
            {view && <Dropdown />}
          </ul>
        </div>
        <div className="searchChat">
          <div className="icon_layout">
            <Link to={getNewPostPath()}>
              <img src={plus} alt="글작성" width={18} />
            </Link>
          </div>
          <div className="icon_layout">
            <Link to={'/chat/list'}>
              <img src={chat} alt="채팅" width={24} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavbarTop;
