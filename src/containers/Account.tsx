import { useEffect, useState } from "react";
import { LogoPanelLayoutBuilder } from "./LogoPanelLayoutBuilder";
import { CustomAccordionConfig, customAccordionOption } from "../models/customAccordionOption";
import {
  ACCOUNT_DETAILS,
  ACCOUNT_MANAGEMENT,
  MARKETPLACE_DETAILS,
} from "../configs/AccountConfig";
import AccordionComponent from "../sharedComponents/AccordionComponent";
import AccordionItem from "../sharedComponents/AccordionItem";
import AccordionDataComponent from "@/sharedComponents/AccordionDataComponent";
import AdminAPI from "@/services/AdminAPI";
import CookieService from "@/services/cookies";
import { Typography } from "@mui/material";

const Account = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(CookieService.getLoggedIn());
  const [accountDetails, setAccountDetails] = useState<CustomAccordionConfig>();
  const [marketplaceDetails, setMarketplaceDetails] = useState<CustomAccordionConfig>();
  const [accountManagement, setAccountManagement] = useState<CustomAccordionConfig>();

  useEffect(() => {
    const handleStorageChange = () => {
      setLoggedIn(CookieService.getLoggedIn());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);


  useEffect(() => {
    if (loggedIn)
      getAccountConfigs();
  }, [loggedIn]);


  const getAccountConfigs = () => {
    setAccountDetails(ACCOUNT_DETAILS);
    // setMarketplaceDetails(MARKETPLACE_DETAILS);
    setAccountManagement(ACCOUNT_MANAGEMENT);
  };

  const setAccountDetailsData = async () => {
    setAccountDetails({ ...accountDetails, options: [...accountDetails?.options ?? []] });
  }

  const setMarketplaceDetailsData = async () => {
    setMarketplaceDetails({ ...marketplaceDetails, options: [...marketplaceDetails?.options ?? []] });
  }

  const setAccountManagementData = async () => {
    setAccountManagement({ ...accountManagement, options: [...accountManagement?.options ?? []] });
  }

  const AdminDashboardDataMap = {
    'accountDetailsData': setAccountDetailsData,
    'marketplaceDetailsData': setMarketplaceDetailsData,
    'accountManagementData': setAccountManagementData,
  }

  const getDetails = async (id: string, option: customAccordionOption) => {
    const baseData = await AdminAPI.getData(
      option.url || "",
      CookieService.getEnvId() || "",
      option.localhostUrl || false,
      option.service
    );

    let additionalData: any[] = [];

    if (option.additionalUrls && option.additionalUrls.length > 0) {
      // Fetch all additional URLs in parallel
      additionalData = await Promise.all(
        option.additionalUrls.map((url) =>
          AdminAPI.getData(url, CookieService.getEnvId() || "", option.localhostUrl || false, option.additionalUrlService)
        )
      );

      option.data = {
        baseData,
        additionalData,
      };
    } else {
      option.data = baseData;
    }

    // Final callback
    if (AdminDashboardDataMap[id]) {
      AdminDashboardDataMap[id]();
    }
  };


  return (
    <LogoPanelLayoutBuilder>
      <div className="h-full w-full page-padding-medium">
        <div className="nnp-title">
          <b>Welcome to Nubo Native Platform</b>
        </div>


        {accountDetails && <div className="w-full page-padding-medium">
          <AccordionDataComponent
            id='accountDetailsData'
            title={accountDetails?.title}
            data={accountDetails.options}
            styles={{}}
            getDetails={getDetails}
          ></AccordionDataComponent>
        </div>}

        {/* {marketplaceDetails && marketplaceDetails.options && ( */}
        {marketplaceDetails && <div className="w-full page-padding-medium">
          <AccordionDataComponent
            id='marketplaceDetailsData'
            title={marketplaceDetails?.title}
            data={marketplaceDetails.options}
            styles={{}}
            getDetails={getDetails}
          ></AccordionDataComponent>
        </div>}
        {/* )} */}

        {/* {accountManagement && accountManagement.options && ( */}
        {accountManagement && <div className="w-full page-padding-medium">
          {/* <AccordionDataComponent
            id='accountManagementData'
            title={accountManagement?.title}
            data={accountManagement.options}
            styles={{}}
            getDetails={getDetails}
          ></AccordionDataComponent> */}
          <div className="nnp-title pb-[var(--nnp-padding-medium)]">{accountManagement.title}</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {accountManagement.options.map((option, index) => (
              <div key={index}>
                <AccordionComponent
                  isExpanded={true}
                  accordionOption={option}
                >
                  {option.element ? <option.element id={option.id} /> : <Typography>{option.summary}</Typography>}
                </AccordionComponent>
              </div>
            ))}
          </div>
        </div>}
        {/* )} */}
      </div>
    </LogoPanelLayoutBuilder>

  );
};

export default Account;
