import React from 'react';

const ColumnListBoard = ({ children, isTitleColumn }) => {
  return <td className={`ListBoard-column ${isTitleColumn ? 'title-column' : ''}`}>{children}</td>;
};

export default ColumnListBoard;
