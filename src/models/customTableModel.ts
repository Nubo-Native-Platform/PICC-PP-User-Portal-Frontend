import { SvgIconProps } from "@mui/material";
import { ComponentType } from "react";

export interface CustomTableModel {
    colDef: ColumnDef[];
    rows: RowData[];

}

export interface ColumnDef {
    field: string;
    headerName: string;
    type?: "string" | "number" | "link" | "date";
    maxLength?: number;
    icon?: ComponentType<SvgIconProps>;
    style?: {
        headerColor?: string;
        cellColor?: string;
        rowHeight?: number;
    };
}

export interface RowData {
    id: string;
    [month: string]: string | number;
}

export interface customTableConfig {
    groupByField?: string;
    typeField?: string;
    isGrouped?: boolean;
}