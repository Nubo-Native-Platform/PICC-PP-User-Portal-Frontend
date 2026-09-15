import { useEffect, useState } from "react";
import { LogoPanelLayoutBuilder } from "./LogoPanelLayoutBuilder";
import { CustomAccordionConfig, customAccordionOption } from "@/models/customAccordionOption";
import { SUPPORT_CONFIG } from "@/configs/SupportConfig";
import CookieService from "@/services/cookies";
import AdminAPI from "@/services/AdminAPI";
import AccordionComponent from "@/sharedComponents/AccordionComponent";
import { Typography } from "@mui/material";
import SupportAPI from "@/services/SupportAPI";
import { set } from "react-hook-form";

const Support = () => {
  const [loggedIn, setLoggedIn] = useState<boolean>(CookieService.getLoggedIn());
  const [supportConfig, setSupportConfig] = useState<CustomAccordionConfig>(null);
  // const [envId, setEnvId] = useState<string | null>(CookieService.getEnvId());

  useEffect(() => {
    const handleStorageChange = () => {
      setLoggedIn(CookieService.getLoggedIn());
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    if (loggedIn) {
      getSupportConfigs();
    }
  }, [loggedIn]);

  const getSupportConfigs = async () => {
    // Deep clone to avoid mutating SUPPORT_CONFIG directly
    const config = {
      ...SUPPORT_CONFIG,
      options: SUPPORT_CONFIG.options.map(opt => ({ ...opt }))
    };

    await Promise.all(
      config.options.map(option => getDetails(option.id, option))
    );

    setSupportConfig(config);
  };

  const getDetails = async (id: string, option: customAccordionOption) => {
    if (option.id == "issue-trend") {
      option.data = await SupportAPI.getData(
        option.url || "",
        CookieService.getEnvId() || ""
      );
    }
    else {
      option.data = await SupportAPI.getPaginatedData(
        option.url || "",
        CookieService.getEnvId() || "",
        option.localhostUrl || false
      );
    }
  };


  const createAccordionOptions = (
    item: customAccordionOption, index: number
  ): customAccordionOption => {
    return {
      id: item.id,
      title: item.title,
      summary: item.summary ? item.summary : "",
      url: item.url,
      style: {
        headerBg: "!bg-[#888888]",
        headerColor: "!text-[#ffffcc]"
      },
    };
  };

  // const onRefresh = (option: customAccordionOption) => {
  //   return async () => {
  //     const updatedData = await SupportAPI.getPaginatedData(
  //       option.url || "",
  //       envId || "",
  //       option.localhostUrl || false
  //     );

  //     setSupportConfig(prev => {
  //       if (!prev) return prev;

  //       // create a deep copy with the updated option
  //       const updatedOptions = prev.options.map(opt =>
  //         opt.id === option.id ? { ...opt, data: updatedData } : opt
  //       );

  //       return { ...prev, options: updatedOptions };
  //     });
  //   };
  // };

  const onRefresh = (option: customAccordionOption) => {
    return async (type: 'self' | 'both' = 'self') => {
      const updatedData = await SupportAPI.getPaginatedData(
        option.url || "",
        CookieService.getEnvId() || "",
        option.localhostUrl || false
      );

      setSupportConfig(prev => {
        if (!prev) return prev;

        // update current option data
        const updatedOptions = prev.options.map(opt => {
          if (opt.id === option.id) {
            return { ...opt, data: updatedData };
          }

          // 🔹 if the current option is "open-issues" and we want to also refresh "past-issues"
          if (option.id === "open-issues" && opt.id === "past-issues" && type === 'both') {
            // schedule refresh for past issues
            SupportAPI.getPaginatedData(opt.url || "", CookieService.getEnvId() || "", opt.localhostUrl || false)
              .then((pastData) => {
                setSupportConfig(prevConfig => {
                  if (!prevConfig) return prevConfig;
                  const finalOptions = prevConfig.options.map(o =>
                    o.id === "past-issues" ? { ...o, data: pastData } : o
                  );
                  return { ...prevConfig, options: finalOptions };
                });
              });
          }

          return opt;
        });

        return { ...prev, options: updatedOptions };
      });
    };
  };

  return (
    <LogoPanelLayoutBuilder>
      <div className="h-full w-full page-padding-medium">
        <div className="nnp-title">
          <b>Welcome to Nubo Native Platform</b>
        </div>
        {supportConfig && supportConfig.options && <div className="page-padding-medium">
          {supportConfig.options.map((option, index) => (
            <div key={index} className={`pb-[var(--nnp-padding-large)] text-white`}>
              <AccordionComponent
                isExpanded={true}
                accordionOption={createAccordionOptions(option, index)}
              >
                {option.element && option.data ? <option.element id={option.id} data={option.data as []} onRefresh={onRefresh(option)} /> : <Typography>{option.summary}</Typography>}
              </AccordionComponent>
            </div>
          ))}
        </div>}
      </div>
    </LogoPanelLayoutBuilder>
  );
};

export default Support;
