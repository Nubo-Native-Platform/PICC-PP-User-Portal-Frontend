import { CreateIssueFormConfig } from '@/configs/FormConfig';
import { IssueModel } from '@/models/apimodels/issue-model';
import { ColumnDef, CustomTableModel } from '@/models/customTableModel';
import { IssueFormModel } from '@/models/FormModels';
import CommonAPI from '@/services/CommonAPI';
import CookieService from '@/services/cookies';
import { issueModelToTableModel, tableModelToIssueFormModel } from '@/services/ModelTranslator.service';
import SupportAPI from '@/services/SupportAPI';
import { showConfirmDialog } from '@/sharedComponents/ConfirmDialog';
import NNPFormComponent from '@/sharedComponents/NNPFormComponent';
import NNPModalComponent from '@/sharedComponents/NNPModalComponent';
import NNPGrid from '@/sharedComponents/Datagrid';
import { type GridColDef } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditNoteOutlinedIcon from '@mui/icons-material/EditNoteOutlined';
import React, { useEffect, useRef, useState } from 'react'
import { UseFormClearErrors, UseFormSetError } from 'react-hook-form';

const OpenIssuesSupportComponent = ({ id, data, onRefresh }: { id: string, data: { issues: IssueModel[] }, onRefresh: (type) => void }) => {
  const [tableViewData, setTableviewData] = useState<CustomTableModel | null>(null);
  const [openedModal, setOpenedModal] = useState<string | null>(null);
  const [baseFormConfig, setBaseFormConfig] = useState<any[]>();
  const [formConfig, setFormConfig] = useState<any[]>();
  const [rowToEdit, setRowToEdit] = useState<IssueFormModel | null>(null);
  const formRef = useRef<{ setError: UseFormSetError<any>; clearErrors: UseFormClearErrors<any> }>(null);

  useEffect(() => {
    if (data.issues) {
      configureTableData(data.issues);
    }
  }, [data]);

  useEffect(() => {
    configureIssueForm();
  }, []);

  const configureIssueForm = async () => {
    const issueFormConfig = await Promise.all(CreateIssueFormConfig.map(async input => {
      if (input.type == 'select' && input.optionUrl && input.options?.length === 0) {
        const options = await CommonAPI.getDropdownOptions(input.optionUrl || '');

        switch (input.name) {
          case 'issueCategory':
            input.options = options.parentIssue;
            break;
          case 'issueCategoryType':
            input.options = options.issueCategory;
            break;
          case 'issuePriority':
            input.options = options.priority;
            break;
          case 'issueStatus':
            input.options = options?.status?.map(option => ({ label: option, value: option, disabled: option != "Closed" && option != "Feedback" }));
            break;
          default:
            input.options = options;
            break;
        }
      }
      return { ...input }
    }));
    setBaseFormConfig(issueFormConfig);
  }

  const configureTableData = (data: IssueModel[]) => {
    const tableData = issueModelToTableModel(data);
    setTableviewData(tableData);
  }

  const handleFormSubmit = async (data) => {
    const issueData = {
      subject: data.issueName,
      category: data.issueCategory,
      priority: data.issuePriority,
      description: data.issueDescription,
      categoryType: data.issueCategoryType,
      accountName: CookieService.getEnvId(),
      ticketDate: openedModal === "add" ? new Date().toISOString() : null,
      status: openedModal === "add" ? "New" : data.issueStatus,
      ticketResolutionDate: openedModal === "edit" && data.issueStatus == "Closed" && !data.issueResolvedDate ? new Date().toISOString() : null,
      resolution: openedModal === "edit" && data.issueStatus == "Closed" && !data.issueResolutionComment ? "Closed by User" : null
    };
    if (openedModal === "edit" && rowToEdit) {
      const res = await SupportAPI.updateIssue({ id: data.issueId, ...issueData });
      if (res.status === 200)
        showConfirmDialog({
          type: "success",
          message: "Issue updated successfully.",
          confirmText: "OK",
        });
    } else {
      const res = await SupportAPI.createIssue(issueData);
      if (res.status === 200)
        showConfirmDialog({
          type: "success",
          message: "Issue added successfully.",
          confirmText: "OK",
        });
    }
    setOpenedModal(null);
    onRefresh(data.issueStatus == 'Closed' ? 'both' : 'self');
  }

  const editIssue = (col: ColumnDef, row: any) => {
    const userFormModel = tableModelToIssueFormModel(row);
    setRowToEdit(userFormModel);
    const userEditFormConfig = baseFormConfig.filter(input => {
      if (input.type === 'submit') {
        input.label = "Update Issue";
      }
      return { ...input }
    })
    setFormConfig(userEditFormConfig ?? []);
    setOpenedModal("edit");
  }

  const handleCellClick = (col: ColumnDef, row: any) => {
    if (col.type === 'link' && col.icon && col.field === 'editIssue') {
      editIssue(col, row);
    }
  }

  const formBtnTriggered = async (name: string, value: string) => {
    // if (name === 'resisterUsername') {
    //     const userExists = await PublicSvc.userExist(value);

    //     if (!userExists) {
    //         // formRef.current?.clearErrors(name);
    //         formRef.current?.setError(name, { type: 'success', message: 'Username is available' });
    //     } else {
    //         formRef.current?.setError(name, { type: 'error', message: 'Username is already taken' });
    //     }
    // }
  };


  const addNewIssue = () => {
    const newUser = new IssueFormModel();
    setRowToEdit(newUser);
    const submitField = baseFormConfig.find(input => input.type === 'submit');
    if (submitField) {
      submitField.label = "Add Issue";
    }
    const formConfig = baseFormConfig.filter(input => input.name !== 'issueStatus');
    setFormConfig(formConfig);
    setOpenedModal("add");
  }

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", flex: 0.8 },
    { field: "reportDate", headerName: "Report Date", flex: 1.2 },
    { field: "category", headerName: "Category", flex: 1.2 },
    { field: "categoryType", headerName: "Category Type", flex: 1.2 },
    { field: "subject", headerName: "Subject", flex: 1.5 },
    { field: "priority", headerName: "Priority", flex: 0.8 },
    { field: "status", headerName: "Status", flex: 0.8 },
    {
      field: "editIssue",
      headerName: "Action",
      width: 90,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <IconButton
          size="small"
          onClick={(e) => {
            e.stopPropagation();
            editIssue({ field: "editIssue" } as any, params.row);
          }}
        >
          <EditNoteOutlinedIcon color="primary" />
        </IconButton>
      )
    }
  ];

  return (
    <div className="page-padding-medium">
      <div className="font-[var(--font-bold)] pb-[var(--nnp-padding-medium)]">Open and In-Progress Issues for your Account</div>
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
          onClick={() => { addNewIssue() }}
          className="nnp-btn nnp-btn-primary"
        >
          Create New Issue
        </button>
      </div>
      <NNPModalComponent
        isOpen={openedModal === "edit" || openedModal === "add"}
        onClose={() => setOpenedModal(null)}
        title={openedModal === "edit" ? "Edit Issue" : "Add New Issue"}
      >
        <NNPFormComponent
          ref={formRef}
          inputs={formConfig ?? []} layout="double" onSubmit={handleFormSubmit} defaultValues={rowToEdit || {}} onTrigger={(name, value) => {
            formBtnTriggered(name, value);
          }} />

        {/* defaultValues={rowToEdit || {}}  */}
      </NNPModalComponent>
    </div>

  )
}

export default OpenIssuesSupportComponent
