export interface hourlyPipelineExecution {
  avgPlTime: number;
  envId: string;
  failurePercentage: number;
  hour: number;
  plDate: string;
  plFail: number;
  plId: number;
  plSuccess: number;
  successPercentage: number;
}


export interface HourlyApiGateway {
  apiDate: string;
  apiFail: number;
  apiSuccess: number;
  apigwId: number;
  avgRespTime: number;
  envId: string;
  failurePercentage: number;
  hour: number;
  successPercentage: number;
  totTranVol: number;
}

export interface MultiPieChartDataType {
  '24HBasisPerformence': unknown[],
  'hourlyBasisPerformence': unknown[]
}

export interface LogGenerationChartDataType {
  appName: string,
  hour: number,
  logDate: string,
  logId: number,
  totErr: number,
  totMsg: number
}

export interface PortalStatistics {
  avgCpu: number,
  avgMem: number,
  avgPod: number,
  avgStorage: number,
  envId: string,
  hour: number,
  maxCpu: number,
  maxMem: number,
  maxPod: number,
  maxStorage: number,
  usageDate: string,
  usageId: number,
}
