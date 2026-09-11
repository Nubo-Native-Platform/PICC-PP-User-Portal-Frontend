import { useState } from "react";
import { navData } from "@/configs/navConfig";
import { NavItem } from "@/models/navItem";
import { SidenavContext } from "./context";

export const SidenavContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [isOpen, setIsOpen] = useState(true);
    const [currentPage, setCurrentPage] = useState<NavItem>(navData[0]);

    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <SidenavContext.Provider
            value={{ isOpen, currentPage, toggleSidebar, setCurrentPage }}
        >
            {children}
        </SidenavContext.Provider>
    );
};