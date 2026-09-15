import { Link } from "react-router-dom";
import styled from "styled-components";
import { useSideNavDetails } from "@/contexts/sidenavContext/context";
import { navData } from "../configs/navConfig";
import { NavItem } from "../models/navItem";

const Sidebar = styled.nav<{ $isOpen: boolean }>`
  position: absolute;
  left: 12px;
  top: 6vw;
  border-radius: 0 0 20px 20px;
  color: white;
  padding: ${({ $isOpen }) => ($isOpen ? "20px 0" : "0")};
  background-image: linear-gradient(135deg, #2e3b4e, 80%, #04a1b4);
  bottom: ${({ $isOpen }) => ($isOpen ? "12px" : "calc(100vh - 6vw)")};
  transition: bottom 0.3s ease;
  z-index: 10000;
`;

const SidebarItem = styled(Link)`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  color: white;
  text-decoration: none;
  font-size: 18px;
  border-radius: 8px;
  transition: all 0.3s;

  &:hover {
    background-color: #1e2a35;
  }

  svg {
    margin-right: 8px;
  }
`;

const SideNav = () => {
  const { isOpen, setCurrentPage } = useSideNavDetails();

  const handlePageChange = (page: NavItem) => {
    setCurrentPage(page);
  };

  return (
    <Sidebar className="w-panel" $isOpen={isOpen}>
      {navData &&
        isOpen &&
        navData.map((item: NavItem, index: number) => (
          <SidebarItem
            to={item.path}
            key={index}
            onClick={() => handlePageChange(item)}
          >
            <span className="ml-5">{item.icon && <item.icon />}</span>
            {item.title}
          </SidebarItem>
        ))}
    </Sidebar>
  );
};

export default SideNav;
