import React from 'react';
import './BasicNavbar.css';

function BasicNavbar(props) {
  return (
    <div className="navbar">
      <h1>{props.title}</h1>
      <div className="underline"></div>
    </div>
  );
}

export default BasicNavbar;
