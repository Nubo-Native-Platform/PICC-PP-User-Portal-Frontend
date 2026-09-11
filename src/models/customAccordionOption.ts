import { ComponentType } from "react";

export const DEFAULT_ACCORDION_STYLE = {
    headerBg: '',
    headerColor: '',
};

export interface CustomAccordionConfig {
  title: string;
  options: customAccordionOption[];
}
export interface customAccordionOption<T = unknown> {
  id: string;
  link?: string;
  title: string;
  summary?: string;
  url?: string;
  additionalUrls?: string[];
  localhostUrl?: boolean;
  style?: CustomAccordionStyle;
  data?: unknown;
  additionalData?: unknown[];
  service?: string;
  additionalUrlService?: string;
  element?: ComponentType<{ id: string, data?: T, onRefresh?: (type?) => void }>;
  //  ComponentType<{ data: unknown }> | ComponentType<{ data: unknown[] }>;
  icon?: string;
}

interface CustomAccordionStyle {
  headerBg?: string;
  headerBgColor?: string;
  headerColor?: string;
  bodyBg?: string;
}
