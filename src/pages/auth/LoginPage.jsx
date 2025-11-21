import React, { useState } from "react";
import { useUserStore } from "../../app/store/auth";
import UserInfo from "../../components/UserInfo/UserInfo";
import GoogleLoginButton from "../../components/common/GoogleLoginButton";

const LoginPage = () => {
  const { setUserInfo, setIsLoggedIn, isLoggedIn, userInfo, setUserName } =
    useUserStore();

  const [isShowInfo, setIsShowInfo] = useState(false);

  const handleLoginS = (user) => {
    // user from Google UserInfo API
    setUserInfo(user);
    setIsLoggedIn(true);
    setUserName(user?.name || "");
  };

  const handleLoginF = (error) => {
    console.error("로그인 실패:", error);
  };

  const toggleInfo = () => {
    setIsShowInfo(prevState => !prevState);
  };

  return (
    <div className="d-flex align-items-center">
      {!isLoggedIn ? (
        <div>
          <GoogleLoginButton onSuccess={handleLoginS} onError={handleLoginF} />
        </div>
      ) : (
        <div>
          <img
            src={userInfo.picture}
            alt="Profile"
            width="35"
            style={{ borderRadius: "50%", cursor: "pointer" }}
            onClick={toggleInfo}
          />
          {isShowInfo && <UserInfo onClick={toggleInfo} />}
        </div>
      )}
    </div>
  );
};

export default LoginPage;
