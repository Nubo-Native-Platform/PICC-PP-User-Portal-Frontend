export interface ChildElementDtl {
  chElementDtlId: string;
  elementDtlName: string;
  elementDtlURL?: string;
  elementDtlDesc?: string;
  elementDtlSeq?: string;
  assigned: boolean;
};

export interface ElementDetail {
  elementDtlId: string;
  elementDtlName: string;
  elementDtlSeq?: string;
  childElementDtls?: ChildElementDtl[];
};

export interface FeatureElement {
  elementId: string;
  elementName: string;
  feaSeq?: string;
  elementDetails?: ElementDetail[];
};

export interface EnvFeature {
  feaId: string;
  feaName: string;
  featureElements?: FeatureElement[];
  feaSeq:string,
  id: string | number, 
};