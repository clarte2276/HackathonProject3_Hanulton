import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

import TitleBodyBoard from './element/TitleBodyBoard';
import ListBoard from './element/ListBoard';
import ColumnListBoard from './element/ColumnListBoard';
import RowListBoard from './element/RowListBoard';
import CreateButtonBoard from './element/CreateButtonBoard';
import PaginationCustom from './element/PaginationCustom';
import './Board.css';

const BoardBuy = () => {
  const [dataList, setDataList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;
  const location = useLocation();

  const fetchData = async () => {
    try {
      // 백엔드에서 게시글 목록을 가져옴
      const response = await axios.post(`/buy`);
      console.log('응답 데이터:', response.data); // 응답 데이터 출력
      setDataList(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error('There was an error fetching the posts!', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (location.state && location.state.newPost) {
      console.log('새 게시글 추가:', location.state.newPost);
      setDataList((prevDataList) => [location.state.newPost, ...prevDataList]);
    }
  }, [location.state]);

  const getNextNo = () => {
    return dataList.length > 0 ? Math.max(...dataList.map((post) => post.no)) + 1 : 1;
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = dataList.slice(indexOfFirstPost, indexOfLastPost);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="BoardAll_layout">
      <div className="BoardTop_layout">
        <TitleBodyBoard title="삽니다" body="본인의 챌린지 및 치료 후기를 적어주세요!" />
      </div>
      <ListBoard headersName={['제목', '작성자', '작성일']}>
        {currentPosts.length > 0 ? (
          currentPosts.map((item, index) => (
            <RowListBoard key={index}>
              <ColumnListBoard>
                <Link to={`/buy/PostView/${item.no}`} style={{ textDecoration: 'none' }}>
                  <div className="List_title">{item.title}</div>
                </Link>
              </ColumnListBoard>
              <ColumnListBoard>{item.nickname}</ColumnListBoard>
              <ColumnListBoard>{item.created_date}</ColumnListBoard>
            </RowListBoard>
          ))
        ) : (
          <div>게시글이 없습니다.</div>
        )}
      </ListBoard>
      <CreateButtonBoard emotion="buy" nextNo={getNextNo()} />
      <div className="PaginationCustom">
        <PaginationCustom
          currentPage={currentPage}
          totalPages={Math.ceil(dataList.length / postsPerPage)}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default BoardBuy;
