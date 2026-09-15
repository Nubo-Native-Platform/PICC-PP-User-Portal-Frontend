import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavContext } from "@/contexts/navigationContext/context";
import { NavItem } from "../models/navItem";
import { findNavItemByPath } from "../utils/navigationUtils";
import CookieService from "@/services/cookies";
import defaultLogo from "/logo/logonnp1.png";

export const LogoPanelLayoutBuilder = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const { currentPage, setCurrentPage } = useNavContext();
  const [logoSrc, setLogoSrc] = useState<string>(defaultLogo);

  const getLogoPath = (username: string, isExactCase: boolean = false) => {
    const base = import.meta.env.BASE_URL || "/";
    const cleanBase = base.endsWith("/") ? base : `${base}/`;
    const name = isExactCase ? username : username.toLowerCase();
    return `${cleanBase}logo/${name}.png`;
  };

  const updateLogo = () => {
    const username = CookieService.getUsername();
    if (username) {
      setLogoSrc(getLogoPath(username));
    } else {
      setLogoSrc(defaultLogo);
    }
  };

  useEffect(() => {
    const currentPath = location.pathname.split("/").pop();
    const currentNavItem: NavItem = findNavItemByPath(`${currentPath}`);
    if (currentPage) {
      setCurrentPage(currentNavItem);
    }
  }, []);

  useEffect(() => {
    updateLogo();

    const handleStorageChange = () => {
      updateLogo();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return (
    <>
      <div className="h-full w-full flex-column">
        <div className="nnp-logo-panel">
          <img
            src={logoSrc}
            alt="Responsive Image"
            onError={() => {
              const username = CookieService.getUsername();
              if (!username) {
                setLogoSrc(defaultLogo);
                return;
              }

              const cleanUser = username.toLowerCase();
              const path1 = getLogoPath(cleanUser);
              const path2 = (cleanUser.endsWith("admin") && cleanUser.length > 5) ? getLogoPath(cleanUser.slice(0, -5)) : "";
              const path3 = username.toLowerCase() !== username ? getLogoPath(username, true) : "";

              if (logoSrc === path1) {
                if (path2) {
                  setLogoSrc(path2);
                } else if (path3) {
                  setLogoSrc(path3);
                } else {
                  setLogoSrc(defaultLogo);
                }
              } else if (path2 && logoSrc === path2) {
                if (path3) {
                  setLogoSrc(path3);
                } else {
                  setLogoSrc(defaultLogo);
                }
              } else if (logoSrc !== defaultLogo) {
                setLogoSrc(defaultLogo);
              }
            }}
          />
        </div>
        {children}
      </div>
    </>
  );
};
