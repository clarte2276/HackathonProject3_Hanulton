import { React, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Map from '../images/location_on.png';
import Mypage from '../images/mypageuser.png';
import Home from '../images/mypage.png';
import './NavbarBottom.css';

function NavbarBottom() {
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

  return (
    <div className="navbarBottom_all">
      <div className="navbarBottom_layout">
        <div className="navbarBottom_center">
          <br />
          <Link className="navbarBottom_centerlayout" to={'/boardsell'}>
            <img src={Home} alt="home" width={30} />
            <div className="Link_text">Home</div>
          </Link>
          <br />
        </div>
        <div className="navbarBottom_center">
          <br />
          <Link className="navbarBottom_centerlayout" href="/mypage" onClick={(e) => checkLogin(e, '/mypage')}>
            <img src={Mypage} alt="내페이지" width={30} />
            <div className="Link_text">Mypage</div>
          </Link>
          <br />
        </div>
        <div className="navbarBottom_center">
          <br />
          <Link className="navbarBottom_centerlayout" to={'/map'}>
            <img src={Map} alt="거래" width={30} />
            <div className="Link_text">Map</div>
          </Link>
          <br />
        </div>
      </div>
    </div>
  );
}

export default NavbarBottom;
