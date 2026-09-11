// components/NnpTableComponent.tsx

import React from "react";
import { ColumnDef, customTableConfig, CustomTableModel } from "@/models/customTableModel";

interface Props {
    tableData: CustomTableModel;
    tableConfig?: customTableConfig;
    cellClicked?: (col: ColumnDef, nextRow: any) => void;
}

export const TableView: React.FC<Props> = ({ tableData, tableConfig, cellClicked }) => {



    return (
        <div className="nnp-border h-full w-full overflow-x-auto">
            <table className="w-full body-font border-collapse">
                <thead className="bg-[var(--component-color-highlight)] text-[var(--text-color-secondary)]" style={{ height: "var(--component-height-medium)", flex: "0 0 var(--component-height-medium)" }}>
                    <tr>
                        {tableData.colDef.map((col) => (
                            <th key={col.field} className="p-[var(--nnp-padding-small)] font-light text-center">
                                {col.headerName}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody style={{ maxHeight: `calc(100% - var(--component-height-medium))`, overflowY: "auto" }}>
                    {(() => {
                        const groupedRows: JSX.Element[] = [];
                        let i = 0;

                        while (i < tableData.rows.length) {
                            const row = tableData.rows[i];
                            const nextRow = tableData.rows[i + 1];

                            groupedRows.push(
                                <tr key={row.id} className="bg-[var(--base-color-primary)]">
                                    {tableData.colDef.map((col, index) => {
                                        if (tableConfig && col.field === tableConfig.groupByField) {
                                            return (
                                                <td
                                                    key={col.field}
                                                    rowSpan={2}
                                                    className="p-2 border border-[var(--border-color)] text-center"
                                                >
                                                    {typeof row[col.field] === "string" && col.maxLength && row[col.field].toString().length > col.maxLength ? row[col.field].toString().slice(0, col.maxLength) + "…" : (row[col.field] ?? "-")}
                                                </td>
                                            );
                                        }
                                        return (
                                            <td key={col.field} className="p-2 text-center cursor-pointer" onClick={() => { cellClicked(col, row) }}>
                                                {col.type === 'link' && col.icon ? (
                                                    <col.icon className={`${col?.style?.cellColor ? 'text-[${col.style.cellColor}]' : ''}`} style={{ fontSize: 'var(--font-size-md)' }} />
                                                ) : (
                                                    typeof row[col.field] === "string" && col.maxLength && row[col.field].toString().length > col.maxLength ? row[col.field].toString().slice(0, col.maxLength) + "…" : (row[col.field] ?? "-")
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );

                            if (nextRow) {
                                groupedRows.push(
                                    <tr key={nextRow.id} className="bg-[var(--component-color-secondary)]">
                                        {tableData.colDef.map((col) => {
                                            if (tableConfig && col.field === tableConfig.groupByField) {
                                                return null;
                                            }
                                            return (
                                                <td key={col.field} className={`p-2 text-center ${col.type == 'link' ? 'cursor-pointer' : ''}`} onClick={() => { cellClicked(col, nextRow) }}>
                                                    {col.type === 'link' && col.icon ? (
                                                        <col.icon className={`${col?.style?.cellColor ? 'text-[${col.style.cellColor}]' : ''}`} style={{ fontSize: 'var(--font-size-md)' }} />
                                                    ) : (
                                                        typeof nextRow[col.field] === "string" && col.maxLength && nextRow[col.field].toString().length > col.maxLength ? nextRow[col.field].toString().slice(0, col.maxLength) + "…" : (nextRow[col.field] ?? "-")
                                                    )}

                                                </td>
                                            );
                                        })}
                                        {/* <td className="p-2 text-center align-middle">
                                            <ArrowForwardIosIcon fontSize="small" />
                                        </td> */}

                                    </tr>
                                );
                            }

                            i += 2;
                        }

                        return groupedRows;
                    })()}
                </tbody>
            </table>
        </div>
    );
};
