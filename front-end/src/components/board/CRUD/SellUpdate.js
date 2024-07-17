// export default SellUpdate;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import BasicNavbar from '../../Navbar/BasicNavbar';
import './CRUD.css';
import axios from 'axios';

function SellUpdate() {
  const { no } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [post, setPost] = useState({
    title: '',
    body: '',
    place: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    axios
      .get(`/boardsell/Postview/${no}/process/update`)
      .then((response) => {
        const { title, content, place, file_data } = response.data;

        setPost({ title, body: content, place });
        setLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          alert('수정 권한이 없습니다.');
          navigate(`/boardsell/PostView/${no}`);
        } else {
          console.error('게시글을 불러오는 중 오류가 발생했습니다!', error);
          setError('게시글을 불러오는 중 오류가 발생했습니다!');
          setLoading(false);
        }
      });
  }, [no, navigate]);

  const onChange = (event) => {
    const { value, name } = event.target;
    console.log(`name: ${name}, value: ${value}`);
    setPost({
      ...post,
      [name]: value,
    });
  };

  const onFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const updatePost = async (event) => {
    event.preventDefault();

    const formData = new FormData();

    formData.append('file', file);
    formData.append('title', post.title);
    formData.append('content', post.body);
    formData.append('place', post.place);

    try {
      await axios.post(`/boardsell/Postview/${no}/process/update`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('수정되었습니다.');
      navigate(`/boardsell/PostView/${no}`);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert('수정 권한이 없습니다.');
        navigate(`/boardsell/PostView/${no}`);
      } else {
        console.error('게시글을 수정하는 중 오류가 발생했습니다:', error);
        alert('게시글을 수정하는 중 오류가 발생했습니다:');
      }
    }
  };

  const backToList = () => {
    navigate(`/boardsell/PostView/${no}`);
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

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
    <>
      <BasicNavbar title="글수정" />
      <div className="Create_all">
        <div className="boardName_layout">
          <div className="boardTitle">게시판</div>
          <div className="boardName">{getBoard()}</div>
        </div>
        <form onSubmit={updatePost}>
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
                  placeholder="제목"
                  value={post.title}
                  onChange={onChange}
                />
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
                  placeholder="내용"
                  value={post.body}
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
                <input type="file" onChange={onFileChange} />
              </div>
            </div>
            <br />

            <div className="titleBody_layout">
              <p>
                <p className="titleBody_nameLayout">
                  <span className="titleBody_name">요리 희망 장소</span>
                </p>
                <input
                  className="titleInput"
                  type="text"
                  name="place"
                  placeholder="장소"
                  value={post.place}
                  onChange={onChange}
                />
              </p>
            </div>
            <br />
            <div className="btn_layout">
              <button className="backBtn" type="button" onClick={backToList}>
                취소
              </button>
              <input className="CreateBtn" type="submit" value="수정하기"></input>
            </div>
          </div>
        </form>
      </div>
    </>
  );
}

export default SellUpdate;
