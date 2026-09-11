import { AccountCommunicationModel } from "@/models/apimodels/account-communication-model"
import { CustomTableModel } from "@/models/customTableModel";
import { AccountCommunicationToTableModel } from "@/services/ModelTranslator.service";
import NNPModalComponent from "@/sharedComponents/NNPModalComponent";
import NNPGrid from "@/sharedComponents/Datagrid";
import { type GridColDef } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

import { useEffect, useState } from "react";

const AccountCommunicationComponent = ({ id, data }: { id: string, data: AccountCommunicationModel[] }) => {
    const [tableViewData, setTableviewData] = useState<CustomTableModel | null>(null);
    const [modalValue, setModalValue] = useState<any | null>(null);

    // helper to make a date object, different approach would be if backend directly returns the UTC date.
    const parseDate = (dateStr: string) => {
        const [datePart, timePart, meridian] = dateStr.split(" ");
        const [day, month, year] = datePart.split("-").map(Number);
        const [parsedHours, minutes] = timePart.split(":").map(Number);
        let hours = parsedHours;

        if (meridian.toLowerCase() === "pm" && hours < 12) hours += 12;
        if (meridian.toLowerCase() === "am" && hours === 12) hours = 0;

        return new Date(year, month - 1, day, hours, minutes);
    };

    // sort by latest time first
    const sortByLatest = (data: any[]) => {
        return [...data].sort(
            (a, b) => parseDate(b.date).getTime() - parseDate(a.date).getTime()
        );
    };

    useEffect(() => {
        if (data?.length) {
            const sortedData = sortByLatest(data);
            const latestTen = sortedData.slice(0, 10);
            configureTableData(latestTen);
        }
    }, [data]);

    const configureTableData = (data: AccountCommunicationModel[]) => {
        const tableData = AccountCommunicationToTableModel(data);
        setTableviewData(tableData);
    }

    const columns: GridColDef[] = [
        { field: "date", headerName: "Date", flex: 1.2 },
        { field: "type", headerName: "Type", flex: 1 },
        { field: "category", headerName: "Category", flex: 1 },
        {
            field: "message",
            headerName: "Message",
            flex: 1.8,
            renderCell: (params) => {
                const message = params.value || "";
                return message.length > 50 ? `${message.slice(0, 50)}...` : message;
            }
        },
        {
            field: "details",
            headerName: "Details",
            width: 90,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        setModalValue(params.row);
                    }}
                >
                    <InfoOutlinedIcon color="primary" style={{ color: 'var(--text-color-link)' }} />
                </IconButton>
            )
        }
    ];

    return (
        <div className="page-padding-medium">
            <div className="font-[var(--font-bold)] pb-[var(--nnp-padding-medium)]">
                Communications and Account Activities
            </div>

            {/* RESPONSIVE TABLE WRAPPER */}
            <div className="w-full" style={{ height: "400px" }}>
                {tableViewData && (
                    <NNPGrid
                        rows={tableViewData.rows}
                        columns={columns}
                        getRowId={(row: any) => row.id}
                    />
                )}
            </div>

            {/* MODAL */}
            <NNPModalComponent
                isOpen={modalValue !== null}
                onClose={() => setModalValue(null)}
                title={"Account Communication Details"}
            >
                {/* <p>{JSON.stringify(modalValue)}</p> */}
                <p>Description - {modalValue?.details}</p>
                <p>Comments - {!modalValue?.action ? 'No comments' : modalValue?.action}</p>
                <p>Link - {!modalValue?.link ? 'No link found.' : modalValue?.link}</p>
            </NNPModalComponent>
        </div>
    )
}

export default AccountCommunicationComponent
