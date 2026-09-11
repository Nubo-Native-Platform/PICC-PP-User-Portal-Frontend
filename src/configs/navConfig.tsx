// import {lazy } from 'react';
import { NavItem } from "../models/navItem";
import { Home as HomeIcon } from "@mui/icons-material";
import Home from "@/containers/Home";
import Account from "@/containers/Account";
import Support from "@/containers/Support";
import Docs from "@/containers/Docs";

// const Games = lazy(() => import('../containers/Games'));
// const Maps = lazy(() => import('../containers/Maps'));

export const navData: NavItem[] = [
  { id: "home", icon: HomeIcon, path: "home", title: "NNP", element: <Home />, restrictedUserTypes: [] },
  { id: "account", path: "account", title: "Account", element: <Account />, restrictedUserTypes: ['user'] },
  { id: "support", path: "support", title: "Support", element: <Support />, restrictedUserTypes: [] },
  { id: "docs", path: "docs", title: "Docs", restrictedUserTypes: [] },
];
