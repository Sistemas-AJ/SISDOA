import React from "react";
import "./Card.css";

const Card = ({ icon, title, onClick, onContextMenu }) => {
  return (
    <div 
      className="card" 
      onClick={onClick}
      onContextMenu={onContextMenu}
    >
      <div className="card-icon">{icon}</div>
      <div className="card-title">{title}</div>
    </div>
  );
};

export default Card;