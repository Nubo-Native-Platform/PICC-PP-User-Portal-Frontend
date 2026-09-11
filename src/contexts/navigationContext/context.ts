import { createContext, useContext } from "react";
import { navigationContextType } from "@/models/navigationDetails";

export const NavigationContext = createContext<navigationContextType>({
    navHistory: [],
    setNavigationHistory: () => { },
    currentPage: null,
    setCurrentPage: () => { },
});

export const useNavContext = () => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error(
            "useNavHistory must be used within a NavigationContextProvider"
        );
    }
    return context;
};
