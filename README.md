import React, { useState, useEffect } from "react";
function Header() {
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  const headerStyle = {
    color: "white",
    backgroundColor: "#00008B",
    padding: "10px",
    height: "50px",
    display: "flex",
    alignItems: "center",
    fontSize: "40px",
    justifyContent: "space-between",
  };

  const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}.${month}.${year}`;
  };
  const formatTime = (date) => {
    return date.toLocaleTimeString("en-GB"); // en-GB locale for 24-hour format
  };
  return (
    <div style={headerStyle}>
      <div style={{ paddingLeft: "60px", paddingBottom: "5px" }}>
        Reservation, Queries and Group
      </div>
      <div style={{ paddingRight: "60px", paddingBottom: "5px" }}>
        {formatDate(currentTime)}&nbsp;&nbsp;{formatTime(currentTime)}
      </div>
    </div>
  );
}
export default Header;
