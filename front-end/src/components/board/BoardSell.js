import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

import TitleBodyBoard from './element/TitleBodyBoard';
import ListBoard from './element/ListBoard';
import ColumnListBoard from './element/ColumnListBoard';
import RowListBoard from './element/RowListBoard';
import CreateButtonBoard from './element/CreateButtonBoard';
import PaginationCustom from './element/PaginationCustom';
import NavbarTop from '../Navbar/NavbarTop';
import './Board.css';

const BoardSell = () => {
  const [dataList, setDataList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState('');
  const postsPerPage = 10;
  const location = useLocation();

  const fetchData = async (keyword = '') => {
    try {
      // 백엔드에서 게시글 목록을 가져옴
      const endpoint = keyword ? `/boardsell/search?keyword=${encodeURIComponent(keyword)}` : '/boardsell';

      const response = await axios.get(endpoint);
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

  const handleSearch = (e) => {
    e.preventDefault();
    fetchData(searchKeyword);
  };

  return (
    <>
      <NavbarTop />
      <div className="BoardAll_layout">
        <div className="BoardTop_layout">
          <TitleBodyBoard title="팝니다" body="팔아보세요" />
        </div>
        <form onSubmit={handleSearch} className="SearchForm">
          <input
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="검색어를 입력하세요"
          />
          <button type="submit">검색</button>
        </form>

        <ListBoard headersName={['제목', '작성자', '작성일']}>
          {currentPosts.length > 0 ? (
            currentPosts.map((item, index) => (
              <RowListBoard key={index}>
                <ColumnListBoard>
                  <Link to={`/boardsell/PostView/${item.no}`} style={{ textDecoration: 'none' }}>
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
        <CreateButtonBoard emotion="boardsell" nextNo={getNextNo()} />
        <div className="PaginationCustom">
          <PaginationCustom
            currentPage={currentPage}
            totalPages={Math.ceil(dataList.length / postsPerPage)}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </>
  );
};

export default BoardSell;
