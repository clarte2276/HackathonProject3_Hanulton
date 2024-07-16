import React from 'react';
import './ElementBoard.css';

function TitleBodyBoard(props) {
  return (
    <>
      <h1>{props.title} 게시판</h1>
      <div>
        <div className="TitleBodyBoard_body">이곳은 {props.title} 게시판입니다.</div>
        <div>{props.body}</div>
      </div>
    </>
  );
}

export default TitleBodyBoard;
