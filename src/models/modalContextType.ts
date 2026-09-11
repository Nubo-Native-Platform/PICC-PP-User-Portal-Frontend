import { TabItem } from "./modalTabModel";

export interface ModalContextType {
  modalComponent: JSX.Element | null;
  modalClose: () => void;
  setModalToOpen: (component: JSX.Element) => void;
  selectedModalTab?: TabItem | null;
  setSelectedModalTab?: (tab: TabItem | null) => void;
}
