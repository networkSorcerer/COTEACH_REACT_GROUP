import React from "react";
import "./userInfo.style.css";
import { useUserStore } from "../../app/store/auth";
import { Button } from "bootstrap";

const UserInfo = () => {
  const { userInfo, setUserInfo, setIsLoggedIn, setUserName } = useUserStore();

  const handleLogout = ({ onclose }) => {
    setUserInfo(null);
    setIsLoggedIn(false);
    setUserName("");
    if (onclose) onclose();
  };

  return (
    <div className="position-relative">
      <div className="user-info-box">
        <div className="user-profile  py-2">
          <img
            src={userInfo.picture}
            alt="Profile"
            style={{ borderRadius: "59%" }}
            className="profile-img"
          />
          <p className="mt-2">{userInfo.name}</p>
          <p>{userInfo.email}</p>
        </div>
        <div className="mt-3 profileManage px-2">
          <p>비밀번호 및 자동 완성</p>
          <p>Google 계정 관리</p>
          <p>프로필 맞춤설정</p>
          <p>동기화 사용 중</p>
        </div>
        <div className="mt-3 profileAdd px-2">
          <p>Chrome 프로필 추가</p>
          <p>게스트 프로필 열기</p>
          <p>Chrome 프로필 관리</p>
        </div>
        <button className="btn btn-secondary profile-btn" onClick={handleLogout}>로그아웃</button>
      </div>
    </div>
  );
};

export default UserInfo;
