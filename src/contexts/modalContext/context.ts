import { createContext, useContext } from "react";
import { ModalContextType } from "../../models/modalContextType";

export const modalContext = createContext<ModalContextType>({
    modalComponent: null,
    modalClose: () => { },
    setModalToOpen: () => { },
    selectedModalTab: null,

    setSelectedModalTab: () => { }
});

export const useModalContext = () => {
    const context = useContext(modalContext);
    if (!context) {
        throw new Error(
            "useNavHistory must be used within a NavigationContextProvider"
        );
    }
    return context;
};


