import React from "react";
import "./Footer.style.css";
const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <h6 className="brand">Emotion Diary</h6>
        <small>당신의 솔직한 오늘을 기록하세요</small>
        <div className="copyright">
          <p>© 2025 Team Emotion. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
