import { Button, Container, Nav, Navbar } from "react-bootstrap";
import "react-datepicker/dist/react-datepicker.css";
import { Link, Outlet, useLocation } from "react-router-dom";
import useMoodFillNavigation from "../app/hooks/useMoodFillNavigation";
import logoText from "../asset/logo-text.png";
import logLogo from "../asset/emotion-log-logo.png";
import Footer from "../components/Footer/Footer";
import LoginPage from "../pages/auth/LoginPage";
import { useUserStore } from "../app/store/auth";
import SearchBar from "../components/common/SearchBar/SearchBar";
export default function RootLayout() {
  const location = useLocation().pathname;
  const { isLoggedIn, userInfo } = useUserStore();

  useMoodFillNavigation();
  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar
        bg="light"
        expand="lg"
        className="app-navbar shadow-sm sticky-top p-0"
      >
        <Container className="app-content">
          <Navbar.Brand as={Link} to="/" className="app-navbar-brand">
            <img src={logLogo} style={{ width: "150px" }} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="justify-content-center d-flex gap-3 align-items-center ms-auto">
              {location === "/" ? (
                <SearchBar />
              ) : (
                <Button
                  as={Link}
                  to="/"
                  className="me-md-4 "
                  variant="outline-primary"
                >
                  📚다이어리 목록
                </Button>
              )}
              {isLoggedIn && (
                <Button
                  as={Link}
                  to="/my"
                  variant="outline-secondary"
                  className="d-flex align-items-center gap-2"
                >
                  {userInfo?.picture ? (
                    <img
                      src={userInfo.picture}
                      alt="me"
                      width="22"
                      height="22"
                      style={{ borderRadius: "50%" }}
                    />
                  ) : (
                    <span>👤</span>
                  )}
                  <span>My</span>
                </Button>
              )}
              <LoginPage />
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="py-4 app-content flex-grow-1">
        <Outlet />
      </Container>
      <Footer />
    </div>
  );
}
