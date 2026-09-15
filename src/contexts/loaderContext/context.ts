import { createContext, useContext, useState } from "react";

export const LoaderContext = createContext<any>(null);

export const useLoader = () => useContext(LoaderContext);