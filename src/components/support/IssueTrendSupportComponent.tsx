import { baseBarChartConfig, issueTimeBarChartConfig } from '@/configs/chartBaseConfig';
import { IssueTrendModel } from '@/models/apimodels/issue-trend-model'
import { generateChartData } from '@/services/helper';
import { issueTrendToBarChartData } from '@/services/ModelTranslator.service';
import { EChartsOption } from 'echarts';
import React, { useEffect, useState } from 'react'
import ReactECharts from "echarts-for-react";

interface IssueTrendSupportDisplay {
    issueReported: IssueTrendModel;
    issueResolved: IssueTrendModel;
}

const IssueTrendSupportComponent = ({ id, data }: { id: string, data: IssueTrendModel[] }) => {
    // const [issueReportedChartConfig, setIssueReportedChartConfig] = useState<EChartsOption>({});
    const [issueResolvedChartConfig, setIssueResolvedChartConfig] = useState<EChartsOption>({});
    const [issueResolvedTimeChartConfig, setIssueResolvedTimeChartConfig] = useState<EChartsOption>({});

    useEffect(() => {
        if (data && data.length > 0) {
            // Reported Issues
            const { categories: reportedCategories, series: reportedSeries } = issueTrendToBarChartData(data, "averageResolveTime");
            const resolvedTimeConfig = generateChartData(issueTimeBarChartConfig, reportedCategories, reportedSeries, "bar");
            setIssueResolvedTimeChartConfig(resolvedTimeConfig);

            // Resolved Issues
            const { categories: resolvedCategories, series: resolvedSeries } = issueTrendToBarChartData(data, "resolvedIssue");
            const resolvedConfig = generateChartData(baseBarChartConfig, resolvedCategories, resolvedSeries, "bar");
            setIssueResolvedChartConfig(resolvedConfig);
        }
    }, [data]);

    return (
        <div className="flex flex-col gap-[var(--nnp-padding-large)] md:flex-row md:justify-between ">
            <div className="md:w-1/2 h-[50vh]">
                <p className="page-padding-medium"><b>Monthly Resolved Issue Time</b></p>
                <ReactECharts
                    option={issueResolvedTimeChartConfig}
                    style={{ width: "100%", height: "80%" }}
                    opts={{ renderer: "canvas" }}
                />
            </div>
            <div className="md:w-1/2 h-[50vh]">
                <p className="page-padding-medium"><b>Monthly Resolved Issues</b></p>
                <ReactECharts
                    option={issueResolvedChartConfig}
                    style={{ width: "100%", height: "80%" }}
                    opts={{ renderer: "canvas" }}
                />
            </div>
        </div>
    )
}

export default IssueTrendSupportComponent
