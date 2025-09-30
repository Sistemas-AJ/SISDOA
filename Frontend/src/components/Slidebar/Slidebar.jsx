import React from "react";
import "./Slidebar.css";
import Card from "../Card/Card";

const Slidebar = ({ items = [], icon: IconComponent, onItemClick, extraTop }) => {
  return (
    <div className="slidebar">
      {extraTop && <div style={{ width: "100%", display: "flex", justifyContent: "center" }}>{extraTop}</div>}
      <div className="slidebar-cards">
        {items.map((item) => (
          <Card
            key={item.id}
            icon={IconComponent ? <IconComponent /> : null}
            title={item.nombre}
            onClick={() => onItemClick && onItemClick(item)}
          />
        ))}
      </div>
    </div>
  );
};

export default Slidebar;