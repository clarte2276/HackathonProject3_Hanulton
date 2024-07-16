import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BasicNavbar from '../../Navbar/BasicNavbar';
import './CRUD.css';
import axios from 'axios';

function SellUpdate() {
  const { no } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: '',
    sellprice: '',
    originprice: '',
    body: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [canEdit, setCanEdit] = useState(false);

  useEffect(() => {
    axios
      .get(`/boardsell/Postview/${no}/process/update`)
      .then((response) => {
        const { title, sellprice, originprice, content } = response.data;
        setPost({ title, sellprice, originprice, body: content });
        setLoading(false);
        setCanEdit(true);
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

  const updatePost = async (event) => {
    event.preventDefault();
    try {
      await axios.post(`/boardsell/Postview/${no}/process/update`, {
        title: post.title,
        content: post.body,
        sellprice: post.sellprice,
        originprice: post.originprice,
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
  if (!canEdit) {
    return <div>수정 권한이 없습니다.</div>; // 수정 권한이 없을 때 보여줄 내용
  }

  return (
    <>
      <div>
        <BasicNavbar title="글쓰기" />
      </div>
      <form onSubmit={updatePost}>
        <div>
          <span>제목</span>
          <input type="text" name="title" placeholder="제목" value={post.title} onChange={onChange} />
        </div>
        <br />
        <div>
          <span>판매 가격</span>
          <input type="text" name="sellprice" placeholder="판매 가격" value={post.sellprice} onChange={onChange} />
        </div>
        <div>
          <span>정가</span>
          <input type="text" name="originprice" placeholder="정가" value={post.originprice} onChange={onChange} />
        </div>
        <div>
          <span>내용</span>
          <textarea name="body" placeholder="내용" value={post.body} onChange={onChange}></textarea>
        </div>
        <br />
        <button type="button" onClick={backToList}>
          취소
        </button>
        <input type="submit" value="수정하기"></input>
      </form>
    </>
  );
}

export default SellUpdate;
