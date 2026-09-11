import { useEffect, useState } from "react";
import CustomModal from "../sharedComponents/CustomModal";
import { REGISTER_USER_FORM_CONFIG } from "@/configs/RegisterConfig";

interface TabItem {
  id: string;
  label: string;
  element?: React.ComponentType<any>;
}
const RegisterModal = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const [tabData, setTabData] = useState<TabItem[]>([]);
  const [selectedTab, setSelectedTab] = useState<TabItem | null>(null);

  useEffect(() => {
    setTabData(REGISTER_USER_FORM_CONFIG);
    setSelectedTab(REGISTER_USER_FORM_CONFIG[0] || null);
  }, []);

  if (!open) return null;
  return (
    <CustomModal
      headerText="Register Yourself"
      footerText="Register to experience NNP"
    >
      <div>
        <div className="nnp-top-header flex-start-center">
          <div className="h-full">
            <div className="flex-start-center h-full">
              {tabData.map((item: TabItem) => (
                <div
                  key={item.id}
                  className={`nnp-menu-item ${selectedTab && selectedTab.id === item.id
                    ? `bg-[var(--component-color-highlight)]`
                    : ""
                    }`}
                  onClick={() => setSelectedTab(item)}
                >
                  <span className="ml-2 uppercase">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {selectedTab ? <div className="nnp-body-content">{selectedTab.element && <selectedTab.element />}</div> : null}

        {open}
      </div>
    </CustomModal>
  );
};

export default RegisterModal;
