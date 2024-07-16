import React, { useState, useEffect } from 'react';
import './Mypage.css';
import { useNavigate } from 'react-router-dom';
import useUserData from '../useUserData';
import mypageUser from '../images/mypageuser.png';
import axios from 'axios';

function Mypage() {
  const navigate = useNavigate();
  const {
    name,
    nickname,
    birth,
    id,
    password,
    store,
    setName,
    setNickname,
    setBirth,
    setId,
    setPassword,
    setStore,
    handleSave,
    fetchUserData,
  } = useUserData();

  useEffect(() => {
    // useUserData.js에서 제공하는 fetchUserData를 호출하여 초기 데이터를 불러옴
    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        '/process/logout',
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        alert('로그아웃 되었습니다.');
        navigate('/'); // 로그아웃 후 메인 페이지로 이동하기
      } else {
        throw new Error('로그아웃에 실패했습니다. 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('로그아웃 도중 오류 발생:', error);
      alert('로그아웃 도중 오류가 발생했습니다.');
    }
  };

  return (
    <div className="myPage">
      <form className="userProfileForm">
        <div className="userProfile">
          <img className="mypageImg" src={mypageUser} alt="프로필 이미지"></img>
        </div>
        <div className="userProfileStore">
          <p>{store}</p>
        </div>
        <div className="userProfileNickname">
          <p>{nickname}</p>
        </div>
        <div className="centered">
          <button className="editBtn" onClick={() => navigate('/mypage/edit')}>
            프로필 수정
          </button>
          <button className="logoutBtn" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </form>
    </div>
  );
}

export default Mypage;
