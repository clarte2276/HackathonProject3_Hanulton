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
        {location.pathname !== '/' && (
          <div>
            <Link className="TapTap" to="/">
              Home
            </Link>
          </div>
        )}
        {location.pathname !== '/boardbuy' && (
          <div>
            <Link className="TapTap" to="/boardbuy">
              삽니다
            </Link>
          </div>
        )}
        {location.pathname !== '/boardsell' && (
          <div>
            <Link className="TapTap" to="/boardsell">
              팝니다
            </Link>
          </div>
        )}
        {location.pathname !== '/boardads' && (
          <div>
            <Link className="TapTap" to="/boardads">
              홍보
            </Link>
          </div>
        )}
      </>
    );
  }

  const getGreetingText = () => {
    switch (location.pathname) {
      case '/':
        return 'Home';
      case '/boardbuy':
        return '삽니다';
      case '/boardsell':
        return '팝니다';
      case '/boardads':
        return '홍보';
      default:
        return '반가워요!';
    }
  };

  const getNewPostPath = () => {
    switch (location.pathname) {
      case '/boardsell':
        return '/boardsell/process/new_Post';
      case '/boardbuy':
        return '/boardbuy/process/new_Post';
      case '/boardads':
        return '/boardads/process/new_Post';
      default:
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
