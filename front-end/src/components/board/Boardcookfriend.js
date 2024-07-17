import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";

// import TitleBodyBoard from './element/TitleBodyBoard';
import ListBoard from "./element/ListBoard";
import ColumnListBoard from "./element/ColumnListBoard";
import RowListBoard from "./element/RowListBoard";
import CreateButtonBoard from "./element/CreateButtonBoard";
import PaginationCustom from "./element/PaginationCustom";
import NavbarTop from "../Navbar/NavbarTop";
import search from "../images/search.png";
import "./Board.css";

const Boardcookfriend = () => {
  const [dataList, setDataList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const postsPerPage = 10;
  const location = useLocation();

  const fetchData = async (keyword = "") => {
    try {
      // 백엔드에서 게시글 목록을 가져옴
      const endpoint = keyword
        ? `/boardcookfriend/search?keyword=${encodeURIComponent(keyword)}`
        : "/boardcookfriend";

      const response = await axios.get(endpoint);
      console.log("응답 데이터:", response.data); // 응답 데이터 출력
      setDataList(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("There was an error fetching the posts!", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (location.state && location.state.newPost) {
      console.log("새 게시글 추가:", location.state.newPost);
      setDataList((prevDataList) => [location.state.newPost, ...prevDataList]);
    }
  }, [location.state]);

  const getNextNo = () => {
    return dataList.length > 0
      ? Math.max(...dataList.map((post) => post.no)) + 1
      : 1;
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat("ko-KR").format(price) + "원";
  };

  return (
    <>
      <NavbarTop />
      <div className="BoardAll_layout">
        <form onSubmit={handleSearch} className="SearchForm">
          <input
            className="searchInput"
            type="text"
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
            placeholder="검색어를 입력하세요"
          />
          <button className="searchBtn" type="submit">
            <img src={search} alt="검색" width={20} />
          </button>
        </form>
        <ListBoard headersName={["", ""]}>
          {currentPosts.length > 0 ? (
            currentPosts.map((item, index) => (
              <RowListBoard key={index}>
                <Link
                  to={`/boardcookfriend/PostView/${item.no}`}
                  style={{ textDecoration: "none" }}
                >
                  <ColumnListBoard>
                    <div className="maybeimg"></div>
                  </ColumnListBoard>
                  <ColumnListBoard>
                    <div className="titlePrice">
                      <div className="List_title">{item.title}</div>
                      <div className="List_price">
                        {formatPrice(item.sellprice)}
                      </div>
                      {/* <div className="List_date">{item.created_date}</div> */}
                    </div>
                  </ColumnListBoard>
                </Link>
              </RowListBoard>
            ))
          ) : (
            <div>게시글이 없습니다.</div>
          )}
        </ListBoard>
        <CreateButtonBoard emotion="boardcookfriend" nextNo={getNextNo()} />
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

export default Boardcookfriend;
