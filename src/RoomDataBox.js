import React from 'react';
import './boq.css';

const RoomDataBox = ({ roomData }) => {
  return (
    <div className="room-data-box-container">
      {Object.entries(roomData).map(([key, value]) => (
        <div key={key} className="room-data-box-tooltip">
          <div className="room-data-box">
            <p className="room-data-key">{key}</p>
            <p className="room-data-value">{value}</p>
          </div>
          <div className="tooltip-text">Additional info about {key}</div>
        </div>
      ))}
    </div>
  );
};

export default RoomDataBox;