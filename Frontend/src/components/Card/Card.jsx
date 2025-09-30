import React from "react";
import "./Card.css";

const Card = ({ icon, title, onClick }) => {
  return (
    <div className="card" onClick={onClick}>
      <div className="card-icon">{icon}</div>
      <div className="card-title">{title}</div>
    </div>
  );
};

export default Card;