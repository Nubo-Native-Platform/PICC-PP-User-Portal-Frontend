import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
const CustomModal = ({
  headerText,
  footerText,
  children,
  modalClassName,
}: {
  headerText: string;
  footerText: string | JSX.Element;
  children: React.ReactNode;
  modalClassName?: string;
}) => {
  // useEffect(() => {
  //   document.body.style.overflow = "hidden";
  //   return () => {
  //     document.body.style.overflow = "";
  //   };
  // }, []);

  const navigateToWebsite = () => {
    location.reload();
  };
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 px-4 overflow-hidden">
      <div className={`nnp-modal-content w-[95%] max-h-[80vh] lg:w-[60%] ${modalClassName ?? ""}`}>
        <div className="nnp-header nnp-header-highlight flex-space-center">
          <span>{headerText}</span>
          <span>
            <CloseIcon className="cursor-pointer hover:opacity-80 transition-opacity" onClick={navigateToWebsite} />
          </span>
        </div>
        {children}

        {/* Footer */}
        <div className="nnp-header nnp-header-primary flex-center-center">
          <div className="flex-center-center text-center font-xs">{footerText}</div>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
