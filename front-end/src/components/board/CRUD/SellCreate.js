import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import BasicNavbar from '../../Navbar/BasicNavbar';
import './CRUD.css';
import axios from 'axios';

function SellCreate() {
  const navigate = useNavigate();
  const location = useLocation();
  const { nextNo } = location.state || {};

  const [board, setBoard] = useState({
    title: '',
    sellprice: '',
    originprice: '',
    body: '',
  });
  const [file, setFile] = useState(null);

  const { title, body, sellprice, originprice } = board;

  const onChange = (event) => {
    const { value, name } = event.target;
    setBoard({
      ...board,
      [name]: value,
    });
  };

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const saveBoard = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('file', file);
    formData.append('no', nextNo);
    formData.append('title', title);
    formData.append('content', body);
    formData.append('created_date', new Date().toISOString());
    formData.append('originprice', originprice);
    formData.append('sellprice', sellprice);

    try {
      const response = await axios.post(`/boardsell/process/new_Post`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const newPostId = response.data.no;
      alert('등록되었습니다.');
      navigate(`/boardsell`, { state: { newPostId } });
    } catch (error) {
      console.error('Error saving post:', error);
      alert('글을 저장하는 도중 오류가 발생했습니다.');
    }
  };

  const backToList = () => {
    navigate('/boardsell');
  };

  const getBoard = () => {
    switch (location.pathname) {
      case '/boardsell/process/new_Post':
        return '팝니다';
      case '/boardbuy/process/new_Post':
        return '삽니다';
      case '/boardads/process/new_Post':
        return '홍보';
      default:
        return '';
    }
  };

  return (
    <div className="Create_all">
      <div>
        <div>
          <BasicNavbar title="글쓰기" />
        </div>
        <div className="boardName_layout">
          <div className="boardTitle">게시판</div>
          <div className="boardName">{getBoard()}</div>
        </div>
        <form onSubmit={saveBoard}>
          <div className="BoardInput_all">
            <div className="titleBody_layout">
              <p>
                <p className="titleBody_nameLayout">
                  <span className="titleBody_name">제목</span>
                </p>
                <input
                  className="titleInput"
                  type="text"
                  name="title"
                  placeholder="제목을 입력하세요"
                  value={title}
                  onChange={onChange}
                />
              </p>
              <p className="sellOriginPrice">
                <div>
                  <p className="titleBody_nameLayout">
                    <span className="titleBody_name">판매 가격</span>
                  </p>
                  <input
                    className="sellpriceInput"
                    type="text"
                    name="sellprice"
                    placeholder="판매 가격"
                    value={sellprice}
                    onChange={onChange}
                  />
                </div>
                <div>
                  <p className="titleBody_nameLayout">
                    <span className="titleBody_name">정가</span>
                  </p>
                  <input
                    className="originpriceInput"
                    type="text"
                    name="originprice"
                    placeholder="정가"
                    value={originprice}
                    onChange={onChange}
                  />
                </div>
              </p>
            </div>
            <br />
            <div className="titleBody_layout">
              <div className="Body_layout">
                <p className="titleBody_nameLayout">
                  <span className="titleBody_name">글내용</span>
                </p>
                <textarea
                  className="BodyInput"
                  name="body"
                  placeholder="내용을 입력하세요"
                  value={body}
                  onChange={onChange}
                ></textarea>
              </div>
            </div>
            <br />
            <div className="titleBody_layout">
              <div>
                <p className="titleBody_nameLayout">
                  <span className="titleBody_name">사진 업로드</span>
                </p>
                <input className="imgUp" type="file" onChange={onFileChange} />
              </div>
            </div>
            <br />
            <div className="btn_layout">
              <button className="backBtn" type="button" onClick={backToList}>
                취소
              </button>
              <input className="CreateBtn" type="submit" value="작성완료"></input>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default SellCreate;
