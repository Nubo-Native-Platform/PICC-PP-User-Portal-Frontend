import { useEffect, useState } from "react";
import { LoaderContext } from "./context";
import { loaderController } from "@/services/loaderController";

export const LoaderProvider = ({ children }: any) => {
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        loaderController.register(setLoading);
    }, []);

    return (
        <LoaderContext.Provider value={{ loading, setLoading }}>
            {children}
        </LoaderContext.Provider>
    );
};