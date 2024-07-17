<<<<<<< HEAD
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import BasicNavbar from "../../Navbar/BasicNavbar";
import "./CRUD.css";
import axios from "axios";
=======
// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import BasicNavbar from '../../Navbar/BasicNavbar';
// import './CRUD.css';
// import axios from 'axios';

// function SellUpdate() {
//   const { no } = useParams();
//   const navigate = useNavigate();
//   const [post, setPost] = useState({
//     title: '',
//     sellprice: '',
//     originprice: '',
//     body: '',
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [canEdit, setCanEdit] = useState(false);

//   useEffect(() => {
//     axios
//       .get(`/boardsell/Postview/${no}/process/update`)
//       .then((response) => {
//         const { title, sellprice, originprice, content } = response.data;
//         setPost({ title, sellprice, originprice, body: content });
//         setLoading(false);
//         setCanEdit(true);
//       })
//       .catch((error) => {
//         if (error.response && error.response.status === 403) {
//           alert('수정 권한이 없습니다.');
//           navigate(`/boardsell/PostView/${no}`);
//         } else {
//           console.error('게시글을 불러오는 중 오류가 발생했습니다!', error);
//           setError('게시글을 불러오는 중 오류가 발생했습니다!');
//           setLoading(false);
//         }
//       });
//   }, [no, navigate]);

//   const onChange = (event) => {
//     const { value, name } = event.target;
//     console.log(`name: ${name}, value: ${value}`);
//     setPost({
//       ...post,
//       [name]: value,
//     });
//   };

//   const updatePost = async (event) => {
//     event.preventDefault();
//     try {
//       await axios.post(`/boardsell/Postview/${no}/process/update`, {
//         title: post.title,
//         content: post.body,
//         sellprice: post.sellprice,
//         originprice: post.originprice,
//       });
//       alert('수정되었습니다.');
//       navigate(`/boardsell/PostView/${no}`);
//     } catch (error) {
//       if (error.response && error.response.status === 403) {
//         alert('수정 권한이 없습니다.');
//         navigate(`/boardsell/PostView/${no}`);
//       } else {
//         console.error('게시글을 수정하는 중 오류가 발생했습니다:', error);
//         alert('게시글을 수정하는 중 오류가 발생했습니다:');
//       }
//     }
//   };

//   const backToList = () => {
//     navigate(`/boardsell/PostView/${no}`);
//   };

//   if (loading) {
//     return <div>로딩 중...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }
//   if (!canEdit) {
//     return <div>수정 권한이 없습니다.</div>; // 수정 권한이 없을 때 보여줄 내용
//   }

//   return (
//     <>
//       <div>
//         <BasicNavbar title="글쓰기" />
//       </div>
//       <form onSubmit={updatePost}>
//         <div>
//           <span>제목</span>
//           <input type="text" name="title" placeholder="제목" value={post.title} onChange={onChange} />
//         </div>
//         <br />
//         <div>
//           <span>판매 가격</span>
//           <input type="text" name="sellprice" placeholder="판매 가격" value={post.sellprice} onChange={onChange} />
//         </div>
//         <div>
//           <span>정가</span>
//           <input type="text" name="originprice" placeholder="정가" value={post.originprice} onChange={onChange} />
//         </div>
//         <div>
//           <span>내용</span>
//           <textarea name="body" placeholder="내용" value={post.body} onChange={onChange}></textarea>
//         </div>
//         <br />
//         <button type="button" onClick={backToList}>
//           취소
//         </button>
//         <input type="submit" value="수정하기"></input>
//       </form>
//     </>
//   );
// }

// export default SellUpdate;

// import React, { useState, useEffect } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import BasicNavbar from '../../Navbar/BasicNavbar';
// import './CRUD.css';
// import axios from 'axios';

// function SellUpdate() {
//   const { no } = useParams();
//   const navigate = useNavigate();
//   const [post, setPost] = useState({
//     title: '',
//     sellprice: '',
//     originprice: '',
//     body: '',
//   });
//   const [file, setFile] = useState(null); // 파일 상태 추가
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [canEdit, setCanEdit] = useState(false);

//   useEffect(() => {
//     axios
//       .get(`/boardsell/Postview/${no}/process/update`)
//       .then((response) => {
//         const { title, sellprice, originprice, content, file_path } = response.data;
//         setPost({ title, sellprice, originprice, body: content });
//         setFile(file_path); // 파일 경로 설정
//         setLoading(false);
//         setCanEdit(true);
//       })
//       .catch((error) => {
//         if (error.response && error.response.status === 403) {
//           alert('수정 권한이 없습니다.');
//           navigate(`/boardsell/PostView/${no}`);
//         } else {
//           console.error('게시글을 불러오는 중 오류가 발생했습니다!', error);
//           setError('게시글을 불러오는 중 오류가 발생했습니다!');
//           setLoading(false);
//         }
//       });
//   }, [no, navigate]);

//   const onChange = (event) => {
//     const { value, name } = event.target;
//     setPost({
//       ...post,
//       [name]: value,
//     });
//   };

//   const onFileChange = (event) => {
//     setFile(event.target.files[0]); // 파일 상태 업데이트
//   };

//   const updatePost = async (event) => {
//     event.preventDefault();

//     const formData = new FormData();
//     formData.append('file', file); // 파일 추가
//     formData.append('title', post.title);
//     formData.append('content', post.body);
//     formData.append('sellprice', post.sellprice);
//     formData.append('originprice', post.originprice);

//     try {
//       await axios.post(`/boardsell/Postview/${no}/process/update`, formData, {
//         withCredentials: true,
//         headers: {
//           'Content-Type': 'multipart/form-data',
//         },
//       });
//       alert('수정되었습니다.');
//       navigate(`/boardsell/PostView/${no}`);
//     } catch (error) {
//       if (error.response && error.response.status === 403) {
//         alert('수정 권한이 없습니다.');
//         navigate(`/boardsell/PostView/${no}`);
//       } else {
//         console.error('게시글을 수정하는 중 오류가 발생했습니다:', error);
//         alert('게시글을 수정하는 중 오류가 발생했습니다:');
//       }
//     }
//   };

//   const backToList = () => {
//     navigate(`/boardsell/PostView/${no}`);
//   };

//   if (loading) {
//     return <div>로딩 중...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }
//   if (!canEdit) {
//     return <div>수정 권한이 없습니다.</div>; // 수정 권한이 없을 때 보여줄 내용
//   }

//   return (
//     <>
//       <div>
//         <BasicNavbar title="글쓰기" />
//       </div>
//       <form onSubmit={updatePost}>
//         <div>
//           <span>제목</span>
//           <input type="text" name="title" placeholder="제목" value={post.title} onChange={onChange} />
//         </div>
//         <br />
//         <div>
//           <span>판매 가격</span>
//           <input type="text" name="sellprice" placeholder="판매 가격" value={post.sellprice} onChange={onChange} />
//         </div>
//         <div>
//           <span>정가</span>
//           <input type="text" name="originprice" placeholder="정가" value={post.originprice} onChange={onChange} />
//         </div>
//         <div>
//           <span>내용</span>
//           <textarea name="body" placeholder="내용" value={post.body} onChange={onChange}></textarea>
//         </div>
//         <div>
//           <span>이미지 업로드</span>
//           <input type="file" onChange={onFileChange} />
//         </div>
//         <br />
//         <button type="button" onClick={backToList}>
//           취소
//         </button>
//         <input type="submit" value="수정하기"></input>
//       </form>
//     </>
//   );
// }

// export default SellUpdate;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import BasicNavbar from '../../Navbar/BasicNavbar';
import './CRUD.css';
import axios from 'axios';
>>>>>>> cd566c22e873537f2a6c941c651a8a44e047490d

function SellUpdate() {
  const { no } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState({
    title: "",
    sellprice: "",
    originprice: "",
    body: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    axios
      .get(`/boardsell/Postview/${no}/process/update`)
      .then((response) => {
<<<<<<< HEAD
        const { title, sellprice, originprice, content, file_path } =
          response.data;
=======
        const { title, sellprice, originprice, content } = response.data;
>>>>>>> cd566c22e873537f2a6c941c651a8a44e047490d
        setPost({ title, sellprice, originprice, body: content });
        setLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          alert("수정 권한이 없습니다.");
          navigate(`/boardsell/PostView/${no}`);
        } else {
          console.error("게시글을 불러오는 중 오류가 발생했습니다!", error);
          setError("게시글을 불러오는 중 오류가 발생했습니다!");
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
<<<<<<< HEAD
    formData.append("file", file); // 파일 추가
    formData.append("title", post.title);
    formData.append("content", post.body);
    formData.append("sellprice", post.sellprice);
    formData.append("originprice", post.originprice);
=======
    formData.append('file', file);
    formData.append('title', post.title);
    formData.append('content', post.body);
    formData.append('sellprice', post.sellprice);
    formData.append('originprice', post.originprice);
>>>>>>> cd566c22e873537f2a6c941c651a8a44e047490d

    try {
      await axios.post(`/boardsell/Postview/${no}/process/update`, formData, {
        withCredentials: true,
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      alert("수정되었습니다.");
      navigate(`/boardsell/PostView/${no}`);
    } catch (error) {
      if (error.response && error.response.status === 403) {
        alert("수정 권한이 없습니다.");
        navigate(`/boardsell/PostView/${no}`);
      } else {
        console.error("게시글을 수정하는 중 오류가 발생했습니다:", error);
        alert("게시글을 수정하는 중 오류가 발생했습니다:");
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

  return (
    <>
      <div>
        <BasicNavbar title="글쓰기" />
      </div>
      <form onSubmit={updatePost}>
        <div>
          <span>제목</span>
          <input
            type="text"
            name="title"
            placeholder="제목"
            value={post.title}
            onChange={onChange}
          />
        </div>
        <br />
        <div>
          <span>판매 가격</span>
          <input
            type="text"
            name="sellprice"
            placeholder="판매 가격"
            value={post.sellprice}
            onChange={onChange}
          />
        </div>
        <div>
          <span>정가</span>
          <input
            type="text"
            name="originprice"
            placeholder="정가"
            value={post.originprice}
            onChange={onChange}
          />
        </div>
        <div>
          <span>내용</span>
          <textarea
            name="body"
            placeholder="내용"
            value={post.body}
            onChange={onChange}
          ></textarea>
        </div>
        <br />
        <div>
          <span>이미지 업로드</span>
          <input type="file" onChange={onFileChange} />
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
