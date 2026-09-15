import { navData } from "@/configs/navConfig";
import { NavItem } from "@/models/navItem";
import { useState } from "react";
import { NavigationContext } from "./context";

export const NavigationContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [navHistory, setNavHistory] = useState([navData[0]]);
    const [currentPage, setCurrentPage] = useState(navData[0]);

    const setNavigationHistory = (nav: NavItem) => {
        setNavHistory([nav, ...navHistory]);
    };

    return (
        <NavigationContext.Provider
            value={{ navHistory, setNavigationHistory, currentPage, setCurrentPage }}
        >
            {children}
        </NavigationContext.Provider>
    );
};