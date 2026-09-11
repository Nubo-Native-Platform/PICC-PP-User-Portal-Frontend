import React from "react";
import { useLoader } from "@/contexts/loaderContext/context";

const LoaderComponent = () => {
    const { loading } = useLoader();

    return (
        <div
            className={`
        fixed inset-0 z-[9999] flex items-center justify-center 
        bg-black/40 backdrop-blur-sm
        transition-opacity duration-300
        ${loading ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}
      `}
        >
            <div className="flex flex-col items-center gap-4">
                {/* Spinner */}
                <div className="w-12 h-12 border-4 border-white/40 border-t-white rounded-full animate-spin"></div>

                {/* Optional Text */}
                <div className="text-white text-sm tracking-wide">
                    Loading...
                </div>
            </div>
        </div>
    );
};

export default LoaderComponent;
