//never import any service into this file
// this file can be imported in other component and service files

import { ChartData } from "@/models/chartDataModel";
import { EChartsOption, SeriesOption } from "echarts";
import { BehaviorSubject } from "rxjs";
const loaderSubject = new BehaviorSubject(false);
const statusSubject = new BehaviorSubject<unknown>({});

export const MessageService = {
  setLoading: (f: boolean) => {
    loaderSubject.next(f);
  },
  setStatus: (f: { type: string; text: string; subtext?: string } | null) => {
    statusSubject.next(f);
    setInterval(() => statusSubject.next(null), 6000);
  },
};

export const createUrl = (
  basePath: string,
  pathTemplate: string,
  ...params: string[]
): string => {
  // Replace each parameter placeholder like ':envId' with the corresponding param value
  let url = pathTemplate;

  // Dynamically replace placeholders
  params.forEach((param, index) => {
    const placeholder = pathTemplate.match(/:\w+/g)?.[index]; // Get the placeholder directly by index
    if (placeholder) {
      url = url.replace(placeholder, param);
    }
  });

  return `${basePath}${url}`;
};


export const createAccordionData = (parentData, childrenData, fields?: { idField: string, titleField: string, sequenceField?: string, linkField?: string }) => {
  childrenData.forEach((childData, index) => {
    if (fields?.sequenceField) {
      childData.sort((a, b) => parseInt(a[fields.sequenceField] || '0') - parseInt(b[fields.sequenceField] || '0'));
    }
    childData.forEach((elementRow) => {
      const childElement = {
        id: elementRow[fields.idField],
        title: elementRow[fields.titleField],
        link: elementRow[fields.linkField] || (fields.idField == 'elementId' ? `/elementdtl/v2/${elementRow[fields.idField]}` : ""),
        fragment: elementRow[fields.idField],
      };
      if (!parentData[index].children) {
        parentData[index].children = [];
      }

      parentData[index].children.push(childElement);
    });
  });
  return parentData;
}

export const createAccordionDataDevFrameWorks = (
  parentData: any[],
  childrenData: any[][],
  fields?: { idField: string; titleField: string; sequenceField?: string; linkField?: string; demoUrlField?: string }
) => {
  childrenData.forEach((childData, index) => {
    if (fields?.sequenceField) {
      childData.sort((a, b) => parseInt(a[fields.sequenceField] || '0') - parseInt(b[fields.sequenceField] || '0'));
    }

    childData.forEach((elementRow) => {
      const childElement = {
        id: elementRow[fields.idField],
        title: elementRow[fields.titleField],
        link: elementRow[fields.linkField] || (fields.idField === "elementId" ? `/elementdtl/v2/${elementRow[fields.idField]}` : ""),
        fragment: elementRow[fields.idField],
        demoUrl: fields?.demoUrlField ? elementRow[fields.demoUrlField] : "", // NEW
      };

      if (!parentData[index].children) {
        parentData[index].children = [];
      }

      parentData[index].children.push(childElement);
    });
  });

  return parentData;
};


export const formatAccordionData = (
  baseData: any[],
  fields: { idField: string; titleField: string; linkField: string; summaryField: string; sequenceField?: string }
) => {
  let sortedData = baseData;
  if (fields?.sequenceField) {
    sortedData = [...baseData].sort(
      (a, b) => parseInt(a[fields.sequenceField!] || '0') - parseInt(b[fields.sequenceField!] || '0')
    );
  }
  const formatedData = sortedData.map((data) => ({
    id: data[fields.idField] ? data[fields.idField] : "",
    title: data[fields.titleField] ? data[fields.titleField] : "",
    link: data[fields.linkField] ? data[fields.linkField] : "",
    summary: data[fields.summaryField] ? data[fields.summaryField] : "",
    children: [],
  }));
  return formatedData;
};

// export const configureChartData = (config, categories, seriesData: { name: string; data: number[] }[]): EChartsOption => {

//   const configData: EChartsOption = {
//     ...config,
//     xAxis: {
//       type: "category",
//       data: categories,
//       axisTick: { alignWithLabel: true },
//     },
//     series: Array.isArray(config.series)
//       ? config.series.map((seriesItem, index) => ({
//         ...seriesItem,
//         data: index === 0 ? data1 : data2,
//       })) as EChartsOption["series"]
//       : [],
//   };

//   return configData
// }


type ChartSeriesType = 'line' | 'bar' | 'area' | 'pie';

export const generateChartData = (
  config: EChartsOption,
  categories: string[],
  seriesData: { name: string; data: number[] }[],
  chartType: ChartSeriesType
): EChartsOption => {
  const existingSeries = config.series ?? [];

  const updatedSeries: SeriesOption[] = seriesData.map((item, index) => {
    const existing = Array.isArray(existingSeries) ? existingSeries[index] : null;

    if (existing && typeof existing === "object") {
      return {
        ...existing,
        name: item.name,
        type: chartType ?? existing.type ?? "line",
        data: item.data,
        smooth: chartType === "line",
        barWidth: chartType === "bar" ? 40 : (existing as any).barWidth, // 👈 force fixed width
      } as SeriesOption;
    }

    // Fallback if no existing series at that index
    return {
      name: item.name,
      type: chartType ?? "line",
      data: item.data,
      smooth: chartType === "line",
      barWidth: chartType === "bar" ? 40 : undefined, // 👈 force fixed width
    } as SeriesOption;
  });

  return {
    ...config,
    xAxis: {
      ...(config.xAxis || {}),
      type: "category",
      data: categories,
      axisTick: { alignWithLabel: true },
    },
    series: updatedSeries,
  };
};
