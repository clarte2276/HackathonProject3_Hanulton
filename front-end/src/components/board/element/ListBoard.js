import React from 'react';
import './ElementBoard.css';

const ListBoard = (props) => {
  const { headersName, children } = props;

  return (
    <table className="ListBoard">
      <thead>
        <tr>
          {headersName.map((item, index) => {
            return (
              <td className="ListBoard-header-column" key={index}>
                {item}
              </td>
            );
          })}
        </tr>
      </thead>
      <tbody>{children}</tbody>
    </table>
  );
};

export default ListBoard;
