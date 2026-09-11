import { CustomAccordionConfig, customAccordionOption } from "../../models/customAccordionOption";
import AdminAPI from "../../services/AdminAPI";
import CookieService from "../../services/cookies";
import { useState } from "react";
import AccordionDataComponent from "@/sharedComponents/AccordionDataComponent";

const AdminDashboard = ({
  platformConfig,
  accountConfig,
}: {
  platformConfig?: CustomAccordionConfig;
  accountConfig?: CustomAccordionConfig;
}) => {
  const [allPlatformConfig, setAllPlatformConfig] = useState<CustomAccordionConfig | undefined>(platformConfig);
  const [allAccountConfig, setAllAccountConfig] = useState<CustomAccordionConfig | undefined>(accountConfig);

  const setPlatformUsage = async () => {
    setAllPlatformConfig({ ...allPlatformConfig, options: [...allPlatformConfig?.options ?? []] });
  }

  const setAccountDetails = async () => {
    setAllAccountConfig({ ...allAccountConfig, options: [...allAccountConfig?.options ?? []] });
  }

  const AdminDashboardDataMap = {
    'platformUsage': setPlatformUsage,
    'accountDetails': setAccountDetails,
  }
  const getDetails = async (id: string, option: customAccordionOption,) => {
    option.data = await AdminAPI.getData(
      option.url || "",
      CookieService.getEnvId() || "",
      option.localhostUrl || false
    );
    if (AdminDashboardDataMap[id]) {
      AdminDashboardDataMap[id]();
    }
  };

  return (
    <div className="home-overview-grid grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <div className="home-overview-panel">
        <AccordionDataComponent
          id='platformUsage'
          title={allPlatformConfig.title}
          data={allPlatformConfig.options}
          styles={{}}
          getDetails={getDetails}
        ></AccordionDataComponent>

      </div>
      <div className="home-overview-panel">
        <AccordionDataComponent
          id='accountDetails'
          title={allAccountConfig.title}
          data={allAccountConfig.options}
          styles={{}}
          getDetails={getDetails}
        ></AccordionDataComponent>
      </div>
    </div>
  );
};

export default AdminDashboard;
