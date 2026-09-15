import { PastIssueModel } from '@/models/apimodels/issue-model';
import { ColumnDef, CustomTableModel } from '@/models/customTableModel';
import { pastIssueModelToTableModel } from '@/services/ModelTranslator.service';
import NNPModalComponent from '@/sharedComponents/NNPModalComponent';
import NNPGrid from '@/sharedComponents/Datagrid';
import { type GridColDef } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import React, { useEffect, useState } from 'react'

const PastIssuesSupportComponent = ({ id, data }: { id: string, data: { issues: PastIssueModel[] } }) => {
  const [tableViewData, setTableviewData] = useState<CustomTableModel | null>(null);
  const [modalValue, setModalValue] = useState<any | null>(null);

  useEffect(() => {
    if (data && data.issues) {
      configureTableData(data.issues);
    }
  }, [data]);

  const handleCellClick = (col: ColumnDef, row: any) => {
    if (col.type === 'link' && col.icon && col.field === 'details') {
      console.log(row)
      setModalValue(row);
    }
  }

  const configureTableData = (data: PastIssueModel[]) => {
    const tableData = pastIssueModelToTableModel(data);
    setTableviewData(tableData);
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.8 },
    { field: "reportDate", headerName: "Report Date", flex: 1.2 },
    { field: "resolveDate", headerName: "Resolve Date", flex: 1.2 },
    { field: "resolveHr", headerName: "Resolution (H)", flex: 0.8 },
    { field: "category", headerName: "Category", flex: 1.2 },
    { field: "subject", headerName: "Subject", flex: 1.5 },
    { field: "priority", headerName: "Priority", flex: 0.8 },
    { field: "status", headerName: "Status", flex: 0.8 },
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
      <div className="font-[var(--font-bold)] pb-[var(--nnp-padding-medium)]">Closed Issues for your Account</div>
      <div className="w-full" style={{ height: "400px" }}>
        {tableViewData && (
          <NNPGrid
            rows={tableViewData.rows}
            columns={columns}
            getRowId={(row: any) => row.id}
          />
        )}
      </div>
      <NNPModalComponent
        isOpen={modalValue !== null}
        onClose={() => setModalValue(null)}
        title={"Past Issue Details"}
      >
        {/* <p>{modalValue}</p> */}
        {modalValue?.description && <p>Description - {modalValue?.description}</p>}
        {modalValue?.resolution && <p>Resolution - {modalValue?.resolution}</p>}
        {modalValue?.reportDate && <p>Report Date - {modalValue?.reportDate}</p>}
        {modalValue?.resolveDate && <p>Resolution Date - {modalValue?.resolveDate}</p>}
      </NNPModalComponent>
    </div>
  )
}

export default PastIssuesSupportComponent;
