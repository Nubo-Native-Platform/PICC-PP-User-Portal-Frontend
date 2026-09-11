import { MarketplaceContributionModel, SolutionModel } from "@/models/apimodels/marketplace-contribution-model";
import { CustomTableModel } from "@/models/customTableModel";
import { marketPlaceContributionModelToTableModel } from "@/services/ModelTranslator.service";
import NNPGrid from "@/sharedComponents/Datagrid";
import { type GridColDef } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import { useEffect, useState } from "react";

const ContributedSolutionComponent = ({ data }: { id: string, data: MarketplaceContributionModel }) => {
    const [tableViewData, setTableviewData] = useState<CustomTableModel | null>(null);

    useEffect(() => {
        if (data && data.solutions) {
            configureTableData(data.solutions);
        }
    }, [data]);


    const configureTableData = (data: SolutionModel[]) => {
        const tableData = marketPlaceContributionModelToTableModel(data);
        setTableviewData(tableData);
    }

    const columns: GridColDef[] = [
        { field: "solution", headerName: "Solution", flex: 1 },
        { field: "domain", headerName: "Domain", flex: 1 },
        { field: "subDomain", headerName: "Sub Domain", flex: 1 },
        { field: "certified", headerName: "Certified", flex: 0.8 },
        { field: "activeFrom", headerName: "Active From", flex: 1 },
        { field: "availableTill", headerName: "Available Till", flex: 1 },
        { field: "status", headerName: "Status", flex: 0.8 },
        {
            field: "manage",
            headerName: "Manage",
            width: 90,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        console.log("Manage clicked", params.row);
                    }}
                >
                    <EditNoteOutlinedIcon color="primary" />
                </IconButton>
            )
        }
    ];

    return (
        <div className="page-padding-medium">
            <div className="font-[var(--font-bold)] pb-[var(--nnp-padding-medium)]">Communications and Account Activities</div>
            <div className="w-full" style={{ height: "400px" }}>
                {tableViewData && (
                    <NNPGrid
                        rows={tableViewData.rows}
                        columns={columns}
                        getRowId={(row: any) => row.id}
                    />
                )}
            </div>
            <div className="flex justify-end mt-4">
                <button
                    type="button"
                    onClick={() => { console.log("Add New clicked"); }}
                    className="nnp-btn nnp-btn-tertiary"
                >
                    Add New
                </button>
            </div>
        </div>
    )
}

export default ContributedSolutionComponent
