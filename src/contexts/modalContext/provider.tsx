import { useState } from "react";
import { modalContext } from "./context";


export const ModalContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [modalOpen, setModalOpen] = useState(false);
    const [modalComponent, setModalComponent] = useState<JSX.Element | null>(
        null
    );
    const [selectedModalTab, setSelectedModalTab] = useState<string | null>(null);

    const setModalToOpen = (modal: JSX.Element) => {
        setModalComponent(modal);
        setModalOpen(true);
    };

    const modalClose = () => {
        setModalOpen(false);
    };

    return (
        <modalContext.Provider
            value={{ modalComponent, modalClose, setModalToOpen }}
        >
            {children}
        </modalContext.Provider>
    );
};