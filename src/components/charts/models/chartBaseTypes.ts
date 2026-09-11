export interface LineChartData {
    categories: string[];
    series: LineChartSeries[];
}
export interface LineChartSeries {
    name: string;
    data: number[];
}