import { Suspense, useEffect, useMemo, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import Layout from "@/containers/Layout";
import { navData } from "./navConfig";
import RegisterComponent from "@/components/register/Register";
import SearchAi from "@/containers/SearchAiLayout";
import { LoaderProvider } from "@/contexts/loaderContext/provider";
import LoaderComponent from "@/sharedComponents/LoaderComponent";
import CookieService from "@/services/cookies";

const basename = import.meta.env.VITE_BASE_URL || "/";

// Define allowed user types
const allowedTypes = ["user", "admin", "superadmin"] as const;
type UserType = (typeof allowedTypes)[number];

/**
 * Filter nav items based on user type
 */
const filterNavByUserType = (userType: string): typeof navData => {
  const safeType: UserType = allowedTypes.includes(userType as UserType)
    ? (userType as UserType)
    : "user"; // fallback

  return navData.filter(
    (item) =>
      !item.restrictedUserTypes?.includes(safeType)
  );
};

const AppRoutes = () => {
  const [userType, setUserType] = useState<string>(CookieService.getUserType() || "");

  // ✅ Only rebuild filtered nav list when userType changes
  const filteredNavData = useMemo(() => filterNavByUserType(userType), [userType]);

  // ✅ Build router just once per `filteredNavData`
  const router = useMemo(
    () =>
      createBrowserRouter(
        [
          {
            path: "nnp",
            element: <Layout />,
            children: filteredNavData,
          },
          {
            path: "register",
            element: <RegisterComponent />,
          },
          {
            path: "searchai",
            element: <SearchAi />,
          },
          { path: "*", element: <Navigate to="/nnp/home" /> },
        ],
        { basename }
      ),
    [filteredNavData]
  );

  // ✅ Listen for login/logout user type change
  useEffect(() => {
    const updateUserType = () => {
      const newType = CookieService.getUserType() || "";
      setUserType((prev) => (prev !== newType ? newType : prev));
    };

    // Trigger on mount
    updateUserType();

    // Listen for login/logout events
    window.addEventListener("storage", updateUserType);
    return () => window.removeEventListener("storage", updateUserType);
  }, []);

  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
      <LoaderProvider>
        <RouterProvider router={router} />
        <LoaderComponent />
      </LoaderProvider>
    </Suspense>
  );
};

export default AppRoutes;
