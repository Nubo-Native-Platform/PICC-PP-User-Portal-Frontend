import { LogoPanelLayoutBuilder } from "./LogoPanelLayoutBuilder";
import HomeAPI from "../services/HomeAPI";
import { useEffect, useState } from "react";
import { UserModel } from "../models/apimodels/user-model";
import {
  DASHBOARD_ACCOUNT_OPTIONS,
  DASHBOARD_PLATFORM_OPTIONS,
  getDashboardAdminOptions,
} from "../configs/HomeConfig";
import CookieService from "../services/cookies";
import { Feature } from "../models/apimodels/feature";
import { FeatureElement } from "../models/apimodels/feature-element";
import { DashboardOptions } from "../models/dashboardOptions";
import DashboardFeatures from "../components/home/DashboardFeatures";
import AdminDashboard from "../components/home/AdminDashboard";
import { CustomAccordionConfig, customAccordionOption } from "../models/customAccordionOption";
import { createAccordionData } from "@/services/helper";

const Home = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(CookieService.getLoggedIn());
  const [dashboardOptions, setDashboardOptions] = useState<DashboardOptions[]>(
    []
  );
  const [adminOptions, setadminOptions] = useState<DashboardOptions>();
  const [dashboardPlatformOptions, setDashboardPlatformOptions] =
    useState<CustomAccordionConfig>();
  const [dashboardAccountOptions, setDashboardAccountOptions] =
    useState<CustomAccordionConfig>();

  useEffect(() => {
    const handleStorageChange = () => {
      setLoggedIn(CookieService.getLoggedIn());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);


  useEffect(() => {
    setDashboardMenu();
  }, [loggedIn]);

  const setDashboardMenu = () => {
    if (loggedIn === true) {
      generateMenu();
    }
    getAdminDashboardDetails();
  }

  const generateMenu = async () => {
    try {
      const username = CookieService.getUsername();
      const envId = CookieService.getEnvId();
      // const currentUser: User = await HomeAPI.getUserDetails(username || "");
      if (username && envId) {
        const currentUser = null;
        // const adminOptions = getDashboardAdminOptions();
        // setadminOptions(adminOptions);
        const instanceMenuData: Feature[] = await HomeAPI.getFeatures(envId || "");

        if (!instanceMenuData || instanceMenuData.length === 0) {
          return;
        }
        instanceMenuData.sort((a, b) => parseInt(a.feaSeq || '0') - parseInt(b.feaSeq || '0'));

        const formattedInstanceOptions: DashboardOptions[] =
          instanceMenuData.map((row) => ({
            id: row.feaId,
            title: row.feaName,
            link: "/nnp/",
            children: [],
          }));

        const featureElementsData: FeatureElement[][] =
          await HomeAPI.getFeatureElementDataForkJoin(instanceMenuData);

        const formattedData = createAccordionData(formattedInstanceOptions, featureElementsData, { idField: 'elementId', titleField: 'elementName', sequenceField: 'feaSeq' });
        setDashboardOptions([...formattedData]);
        console.log(`Menu loaded successfully : ${dashboardOptions}`);
      }
    } catch (error) {
      console.error("Menu loading error:", error);
      if (adminOptions) {
        setDashboardOptions([adminOptions]);
      }
    }
  };

  const getAdminDashboardDetails = () => {
    setDashboardPlatformOptions(DASHBOARD_PLATFORM_OPTIONS);
    setDashboardAccountOptions(DASHBOARD_ACCOUNT_OPTIONS);
  };

  return (
    <LogoPanelLayoutBuilder>
      <div className="home-page h-full w-full page-padding-medium bg-[var(--base-color-primary)] text-[var(--text-color-primary)]">
        <div className="home-welcome nnp-title">
          <b>Welcome to Nubo Native Platform</b>
        </div>
        {dashboardOptions && dashboardOptions.length > 0 && (
          <section className="home-section home-utilities-section">
            <DashboardFeatures options={dashboardOptions} />
          </section>
        )}
        {(dashboardPlatformOptions || dashboardAccountOptions) && (
          <section className="home-section home-overview-section">
            <AdminDashboard
              platformConfig={dashboardPlatformOptions}
              accountConfig={dashboardAccountOptions}
            />
          </section>
        )}
      </div>
    </LogoPanelLayoutBuilder>
  );
};

export default Home;
