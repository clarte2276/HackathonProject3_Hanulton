import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import NavbarTop from '../../Navbar/NavbarTop';
import axios from 'axios';
import './CRUD.css';

function Cook_friendRead() {
  const { no } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 백엔드에서 게시글과 댓글 목록을 가져옴
    const fetchPostAndComments = async () => {
      try {
        const postResponse = await axios.get(`/boardcookfriend/PostView/${no}`);
        setPost(postResponse.data.post);
        setLoading(false);
      } catch (error) {
        console.error('게시글을 불러오는 중 오류 발생:', error);
        setError('게시글을 불러오는 중 오류 발생');
        setLoading(false);
      }
    };

    fetchPostAndComments();
  }, [no]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');

    if (confirmDelete) {
      try {
        await axios.delete(`/boardcookfriend/Postview/${no}/process/delete`);
        alert('게시글이 삭제되었습니다.');
        navigate('/boardcookfriend');
      } catch (error) {
        if (error.response && error.response.status === 403) {
          alert('삭제 권한이 없습니다.');
        } else {
          console.error('게시글 삭제 중 오류 발생:', error);
          alert('게시글 삭제 중 오류가 발생했습니다.');
        }
      }
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!post) {
    return <div>게시글을 찾을 수 없습니다.</div>;
  }

  const { title, nickname, created_date, content, place } = post;

  return (
    <>
      <NavbarTop />
      <div className="Read_alltwo">
        <div className="Read_allone">
          <div className="imageContainer">
            <img src={`/boardsell/image/${no}`} alt="Uploaded" style={{ maxWidth: '80%', height: 'auto' }} />
          </div>
          <div className="nicknamePlace_layout">
            <p className="sellRead_location">{place}</p>
            <p className="sellRead_nickname">닉네임 : {nickname}</p>
          </div>
          <div className="sellRead_underline"></div>
          <div className="Readboard_info">
            <div className="ReadTitleDate">
              <div className="ReadTitle">{title}</div>
              <div className="info">
                <p className="Read_date_">{created_date}</p>
              </div>
            </div>
            <div className="updateDelete">
              <Link className="deleteUpdate" to={`/boardsell/Postview/${no}/process/update`}>
                수정
              </Link>
              <div className="deleteUpdate" onClick={handleDelete} style={{ cursor: 'pointer' }}>
                삭제
              </div>
            </div>
          </div>
          <div className="Readcontent_layout">
            <div className="ReadContent">{content}</div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Cook_friendRead;
