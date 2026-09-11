// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
import { navData } from "../configs/navConfig";
import { NavItem } from "../models/navItem";
import { useNavContext } from "@/contexts/navigationContext/context";
import PersonIcon from "@mui/icons-material/Person";
import CookieService from "../services/cookies";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import AuthAPI from "@/services/AuthAPI";
import MenuIcon from "@mui/icons-material/Menu"; // hamburger / breadcrumb icon
import { IconButton, Menu, MenuItem, Tooltip } from "@mui/material";
import ThemeToggle from "../widgets/themetoggle";

const TopHeader = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(CookieService.getLoggedIn() || false);
  const username = CookieService.getUsername() || "User";
  const { currentPage, setCurrentPage } = useNavContext();
  const [selectedNav, setSelectedNav] = useState<NavItem>(currentPage);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [userMenuAnchor, setUserMenuAnchor] = useState<null | HTMLElement>(null);
  const [visibleNavData, setVisibleNavData] = useState<NavItem[]>([]);

  const navigate = useNavigate();
  const loggedIn = CookieService.getLoggedIn();

  useEffect(() => {
    setIsLoggedIn(loggedIn || false);
    constructVisibleNavData();
  }, [loggedIn]);

  useEffect(() => {
    setSelectedNav(currentPage);
  }, [currentPage]);

  const handleLogout = async () => {
    const res = await AuthAPI.logout();
    if (res && res.code) {
      CookieService.clearCookies();
      window.location.reload();
    }
  };

  const navigateToPage = (item: NavItem) => {
    if (item.id === "docs") {
      window.open(import.meta.env.VITE_DOCS_URL, "_blank", "noopener,noreferrer");
    } else {
      navigate(item.path);
    }
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const handleManageAccount = () => {
    const accountUrl =
      import.meta.env.VITE_KEYCLOAK_ACCOUNT_URL ||
      "https://keycloak.example.com/comm/auth/realms/devops/account";
    window.open(accountUrl, "_blank", "noopener,noreferrer");
    setUserMenuAnchor(null);
  };

  const constructVisibleNavData = () => {
    const userType = CookieService.getUserType() as "user" | "admin" | "superadmin";
    const visibleNavItems = navData.filter(
      (item) =>
        !item.restrictedUserTypes ||
        item.restrictedUserTypes.length === 0 ||
        !item.restrictedUserTypes.includes(userType)
    );
    setVisibleNavData(visibleNavItems);
  };

  return (
    <div className="nnp-top-header fixed-top z-30">
      <div className="px-[var(--nnp-padding-medium)] h-full">
        <div className="hidden sm:flex items-center h-full">
          {visibleNavData.map((item: NavItem) => (
            <div
              key={item.id}
              className={`nnp-menu-item ${selectedNav && selectedNav.id === item.id
                ? `bg-[var(--component-color-highlight)]`
                : ""
                }`}
              onClick={() => navigateToPage(item)}
            >
              {/* Conditionally render icon if it exists */}
              {item.icon && <item.icon />}
              <span className="ml-2 uppercase">{item.title}</span>
            </div>
          ))}
        </div>
        <div className="flex sm:hidden items-center h-full">
          <IconButton
            onClick={(e) => setAnchorEl(e.currentTarget)}
            size="small"
            sx={{
              color: "var(--text-color-tertiary)",
              "&:hover": {
                color: "var(--text-color-secondary)",
                backgroundColor: "transparent",
              },
            }}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
            sx={{
              "& .MuiPaper-root": {
                borderRadius: 0,
                minWidth: "150px",
                paddingX: "var(--nnp-padding-small)",
              },
            }}
          >
            {navData.map((item: NavItem) => (
              <MenuItem
                key={item.id}
                onClick={() => {
                  navigateToPage(item);
                  setAnchorEl(null);
                }}
                sx={{
                  fontSize: "var(--font-size-nm)",
                  paddingX: "var(--nnp-padding-small)",
                  lineHeight: 1.2,
                  minHeight: "30px",
                  paddingY: "var(--nnp-padding-small)",
                }}
              >
                {item.icon && <item.icon />}
                <span className="ml-2">{item.title}</span>
              </MenuItem>
            ))}
          </Menu>
        </div>
      </div>

      <div className="px-[var(--nnp-padding-medium)] text-[var(--text-color-tertiary)] flex items-center">
        <div className="flex items-center gap-2 ml-auto">
          <ThemeToggle />
          {isLoggedIn && (
            <div className="flex items-center">
              <span className="ml-2 cursor-pointer" onClick={handleUserMenuOpen}>
                <PersonIcon />
                <span className="special-font ml-1">{username}</span>
              </span>
              <Menu
                anchorEl={userMenuAnchor}
                open={Boolean(userMenuAnchor)}
                onClose={handleUserMenuClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                sx={{
                  "& .MuiPaper-root": {
                    borderRadius: 0,
                    minWidth: "150px",
                    paddingX: "var(--nnp-padding-small)",
                  },
                }}
              >
                <MenuItem
                  onClick={handleManageAccount}
                  sx={{
                    fontSize: "var(--font-size-nm)",
                    paddingX: "var(--nnp-padding-small)",
                    lineHeight: 1.2,
                    minHeight: "30px",
                    paddingY: "var(--nnp-padding-small)",
                  }}
                >
                  Manage Account
                </MenuItem>
              </Menu>
              <span className="mx-2">|</span>
            </div>
          )}
          <Tooltip title="Logout" arrow>
            <IconButton
              sx={{
                color: "var(--text-color-tertiary)",
                "&:hover": {
                  color: "var(--text-color-secondary)",
                  backgroundColor: "transparent",
                },
              }}
              onClick={() => handleLogout()}
            >
              <LogoutIcon />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default TopHeader;
