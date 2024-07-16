import React from 'react';
import { Link } from 'react-router-dom';

function CreateButtonBoard({ emotion, nextNo }) {
  return (
    <div className="CreateButton">
      <Link className="CreateButtonBoard" to={`/${emotion}/process/new_Post`} state={{ nextNo }}>
        새 글 작성
      </Link>
    </div>
  );
}

export default CreateButtonBoard;
