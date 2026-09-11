import { Outlet } from "react-router-dom";
import TopHeader from "@/baseComponents/TopHeader";
import { NavigationContextProvider } from "@/contexts/navigationContext/provider";
import { useEffect, useState } from "react";
import CookieService from "@/services/cookies";
import LoginModal from "@/baseComponents/LoginModal";
import RegisterModal from "@/baseComponents/RegisterModal";
import Footer from "@/baseComponents/Footer";
import LoaderComponent from "@/sharedComponents/LoaderComponent";


const Layout = () => {
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setRegisterModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(CookieService.getLoggedIn());

  useEffect(() => {
    setIsLoggedIn(CookieService.getLoggedIn());
  }, []);

  useEffect(() => {
    if (!isLoggedIn) {
      setLoginModalOpen(true);
      setRegisterModalOpen(false);
    }
  }, [isLoggedIn]);

  const openRegisterModal = () => {
    setRegisterModalOpen(true);
    setLoginModalOpen(false);
  };
  const closeRegisterModal = () => {
    setRegisterModalOpen(false);
    setLoginModalOpen(true);
  };

  return (
    <NavigationContextProvider>
      <div className="nnp-layout-container header-font">
        <TopHeader />
        <div className="nnp-main-container">
          <div className="nnp-main-content" style={{ minHeight: "100vh" }}>

            <Outlet />

          </div>
        </div>
        <Footer />
        <LoginModal
          open={isLoginModalOpen}
          onClose={() => { setLoginModalOpen(false) }}
          onRegisterOpen={() => openRegisterModal()}
        />
      </div>
    </NavigationContextProvider>
  );
};

export default Layout;
