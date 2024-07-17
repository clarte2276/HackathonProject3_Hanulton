import React, { useState, useEffect } from 'react';
import './MypageEdit.css';
import { useNavigate } from 'react-router-dom';
import useUserData from '../useUserData';
import axios from 'axios';
import BasicNavbar from '../Navbar/BasicNavbar';

function MypageEdit() {
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'nickname':
        setNickname(value);
        break;
      case 'password':
        setPassword(value);
        break;
      default:
        break;
    }
  };

  const handleSaveWrapper = async (e) => {
    e.preventDefault();
    await handleSave();
    navigate('/mypage');
  };

  return (
    <div className="myPageEditAll">
      <BasicNavbar title="프로필 수정"></BasicNavbar>
      <div className="myPageEdit">
        <form onSubmit={handleSaveWrapper} className="userEditForm">
          <div className="userEditName">
            <p>이름</p>
            <input type="text" name="name" value={name} disabled />
          </div>
          <div className="userEditNickname">
            <p>닉네임</p>
            <input type="text" name="nickname" value={nickname} onChange={handleInputChange} />
          </div>
          <div className="userEditInfo">
            <p>가게 이름</p>
            <input type="text" name="store" value={store} disabled />
            <p>생년월일</p>
            <input type="text" name="birth" placeholder="8자리를 입력해주세요." value={birth} disabled />
            <p className="a_id">아이디 </p>
            <input type="text" value={id} disabled />{' '}
          </div>
          <div className="userEditPw">
            <p className="a_pw">비밀번호</p>
            <input type="text" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <div className="centered">
            <button type="submit" className="saveBtn">
              수정 완료
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default MypageEdit;
