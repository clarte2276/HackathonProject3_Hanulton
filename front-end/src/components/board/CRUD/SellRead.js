// import React, { useState, useEffect } from 'react';
// import { Link, useParams, useNavigate } from 'react-router-dom';
// import axios from 'axios';
// // import community from '../../images/community.png';
// import './CRUD.css';

// function SellRead() {
//   const { no } = useParams();
//   const navigate = useNavigate();
//   const [post, setPost] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     // 백엔드에서 게시글과 댓글 목록을 가져옴
//     const fetchPostAndComments = async () => {
//       try {
//         const postResponse = await axios.get(`/boardsell/PostView/${no}`);
//         setPost(postResponse.data.post);

//         setLoading(false);
//       } catch (error) {
//         console.error('게시글을 불러오는 중 오류 발생:', error);
//         setError('게시글을 불러오는 중 오류 발생');
//         setLoading(false);
//       }
//     };

//     fetchPostAndComments();
//   }, [no]);

//   const handleDelete = async () => {
//     const confirmDelete = window.confirm('정말로 삭제하시겠습니까?');

//     if (confirmDelete) {
//       try {
//         await axios.delete(`/boardsell/Postview/${no}/process/delete`);
//         alert('게시글이 삭제되었습니다.');
//         navigate('/boardsell');
//       } catch (error) {
//         if (error.response && error.response.status === 403) {
//           alert('삭제 권한이 없습니다.');
//         } else {
//           console.error('게시글 삭제 중 오류 발생:', error);
//           alert('게시글 삭제 중 오류가 발생했습니다.');
//         }
//       }
//     }
//   };

//   if (loading) {
//     return <div>로딩 중...</div>;
//   }

//   if (error) {
//     return <div>{error}</div>;
//   }

//   if (!post) {
//     return <div>게시글을 찾을 수 없습니다.</div>;
//   }

//   const { title, nickname, created_date, content, sellprice, originprice } = post;
//   const discountRate = originprice && sellprice ? ((1 - sellprice / originprice) * 100).toFixed(2) : 0;

//   return (
//     <div className="Read_all">
//       <div>
//         <div className="ReadTitle">{title}</div>
//         <div className="infoUpdateDelete">
//           <div className="info">
//             <p>닉네임 : {nickname}</p>
//             <p>{created_date}</p>
//           </div>
//           <div className="updateDelete">
//             <Link className="deleteUpdate" to={`/boardsell/Postview/${no}/process/update`}>
//               수정
//             </Link>
//             <div className="deleteUpdate" onClick={handleDelete} style={{ cursor: 'pointer' }}>
//               삭제
//             </div>
//           </div>
//         </div>
//         <div>
//           <div>판매 가격 : {sellprice}</div>
//           <div>
//             <div>정가 : {originprice}</div>
//             <div>할인율 : {discountRate}%</div>
//           </div>
//         </div>
//         <div className="ReadContent">{content}</div>
//         <div>
//           <div>
//             <Link className="buyChange" to={'/'}>
//               바로구매
//             </Link>
//           </div>
//           <div>
//             <Link className="buyChange" to={'/'}>
//               교환신청
//             </Link>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default SellRead;


import React, { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CRUD.css';

function SellRead() {
  const { no } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // 백엔드에서 게시글과 댓글 목록을 가져옴
    const fetchPostAndComments = async () => {
      try {
        const postResponse = await axios.get(`/boardsell/PostView/${no}`);
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
        await axios.delete(`/boardsell/Postview/${no}/process/delete`);
        alert('게시글이 삭제되었습니다.');
        navigate('/boardsell');
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

  const { title, nickname, created_date, content, sellprice, originprice, file_path } = post;
  const discountRate = originprice && sellprice ? ((1 - sellprice / originprice) * 100).toFixed(2) : 0;

  return (
    <div className="Read_all">
      <div>
        <div className="ReadTitle">{title}</div>
        <div className="infoUpdateDelete">
          <div className="info">
            <p>닉네임 : {nickname}</p>
            <p>{created_date}</p>
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
        {file_path && (
          <div className="imageContainer">
            <img
              src={`/${file_path.replace(/\\/g, '/')}`}
              alt="Uploaded"
              style={{ maxWidth: '100%', height: 'auto' }}
            />
          </div>
        )}
        <div>
          <div>판매 가격 : {sellprice}</div>
          <div>
            <div>정가 : {originprice}</div>
            <div>할인율 : {discountRate}%</div>
          </div>
        </div>
        <div className="ReadContent">{content}</div>
        <div>
          <div>
            <Link className="buyChange" to={'/'}>
              바로구매
            </Link>
          </div>
          <div>
            <Link className="buyChange" to={'/'}>
              교환신청
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SellRead;
