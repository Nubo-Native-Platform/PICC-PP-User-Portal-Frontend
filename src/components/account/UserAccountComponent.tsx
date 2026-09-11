import { USER_ADDITION_FORM_CONFIG } from "@/configs/FormConfig";
import { UserModel } from "@/models/apimodels/user-model";
import { ColumnDef, CustomTableModel } from "@/models/customTableModel";
import { UserFormModel } from "@/models/FormModels";
import AdminAPI from "@/services/AdminAPI";
import CookieService from "@/services/cookies";
import { tableModelToUserFormModel, UserModelToTableModel } from "@/services/ModelTranslator.service";
import PublicSvc from "@/services/PublicSvc";
import { showConfirmDialog } from "@/sharedComponents/ConfirmDialog";
import EnvironmentalFeatures from "@/sharedComponents/environmentalFeatures";
import NNPFormComponent from "@/sharedComponents/NNPFormComponent";
import NNPModalComponent from "@/sharedComponents/NNPModalComponent";
import NNPGrid from "@/sharedComponents/Datagrid";
import { type GridColDef } from "@mui/x-data-grid";
import IconButton from "@mui/material/IconButton";
import EditNoteOutlinedIcon from "@mui/icons-material/EditNoteOutlined";
import KeyOutlinedIcon from "@mui/icons-material/KeyOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useEffect, useRef, useState } from "react";
import { UseFormClearErrors, UseFormSetError } from "react-hook-form";

const isExistResponse = (res: any): boolean => {
    if (res === null || res === undefined) return false;
    if (typeof res === "boolean") return res;
    if (typeof res === "string") {
        const lower = res.toLowerCase().trim();
        return lower === "true" || lower === "exists" || lower === "taken" || lower === "already_exists" || lower === "user_exists";
    }
    if (typeof res === "number") return res === 1;
    if (typeof res === "object") {
        if ("existsInAny" in res) return Boolean(res.existsInAny);
        if ("existsInKeycloak" in res && res.existsInKeycloak) return true;
        if ("existsInDb" in res && res.existsInDb) return true;
        if ("existsInGitLab" in res && res.existsInGitLab) return true;
        if ("existsInRedmine" in res && res.existsInRedmine) return true;
        if ("exists" in res) return isExistResponse(res.exists);
        if ("isExist" in res) return isExistResponse(res.isExist);
        if ("userExist" in res) return isExistResponse(res.userExist);
        if ("available" in res) return !res.available;
        if ("isAvailable" in res) return !res.isAvailable;
        if ("status" in res && typeof res.status === "string") {
            const st = res.status.toLowerCase();
            if (st === "exists" || st === "taken") return true;
        }
        if ("data" in res) return isExistResponse(res.data);
    }
    return false;
};

const UserAccountComponent = ({ data }: { id: string, data: UserModel[] }) => {
    const [tableViewData, setTableviewData] = useState<CustomTableModel | null>(null);
    const [openedModal, setOpenedModal] = useState<string | null>(null);
    const [formConfig, setFormConfig] = useState<any[]>();
    const [rowToEdit, setRowToEdit] = useState<UserFormModel | null>(null);
    const [envFeatures, setEnvFeatures] = useState<any[]>([]);
    const [selectedUser, setSelectedUser] = useState<any>(null);
    const [userRoles, setUserRoles] = useState<any[]>([]);
    const [statusOptions, setStatusOptions] = useState<any[]>([]);
    const formRef = useRef<{ setError: UseFormSetError<any>; clearErrors: UseFormClearErrors<any> }>(null);
    const envFeaturesRef = useRef<any>(null);

    useEffect(() => {
        if (data && userRoles?.length && statusOptions?.length) {
            configureTableData(data);
        }
    }, [data, userRoles, statusOptions]);

    useEffect(() => {
        getUserRoles();
        getStatus();
    }, []);

    const getUserRoles = async () => {

        const res = await AdminAPI.getUserRoles();

        if (res) {
            const roles = res.map((role) => ({ label: role.roleName, value: role.roleId }));
            setUserRoles(roles || []);
        }
    };

    const getStatus = async () => {
        const res = await PublicSvc.getStatus();
        if (res) {
            const statusOpts = res?.commonStatus?.map((status) => ({ label: status, value: status.toLowerCase() }));
            setStatusOptions(statusOpts || []);
        }
    }

    const getData = async () => {
        const res = await AdminAPI.getData("userListUrl",
            CookieService.getEnvId() || "",
            false,
            "nnpConf"
        );
        if (res && userRoles?.length && statusOptions?.length) {
            configureTableData(res);
        }
    };

    const configureTableData = (data: UserModel[]) => {
        if (userRoles?.length && statusOptions?.length) {
            const tableData = UserModelToTableModel(data, userRoles);
            setTableviewData(tableData);
        }

    }

    const handleFormSubmit = async (data: UserFormModel) => {
        const userData = {
            userId: data.registerUsername,                    // can be generated or assigned
            envId: data.environmentId,        // mapped from environmentId
            roleId: data.registerUserRole,                       // default or assigned
            accId: data.environmentId,                      // default or assigned
            firstName: data.registerFirstName,
            lastName: data.registerLastName,
            emailId: data.registerEmail,
            password: data.registerPassword,         // default or assigned
            contactNumber: data.registerContactNo,
            requestDate: new Date().toISOString(), // current date-time
            updateDate: new Date().toISOString(),  // current date-time
            updateComment: openedModal === 'edit' ? "User updated" : "Initial user creation", // default
            userType: "admin",                     // default or assigned
            userStatus: data.registerUserStatus || "active"                   // default or assigned
        };
        if (openedModal === 'edit') {
            const res = await AdminAPI.putUserData('updateUser', userData);
            if (res && res.data == "Updated") {
                showConfirmDialog({
                    type: "success",
                    message: "User updated successfully.",
                    confirmText: "OK",
                });
                getData();
            }
        }
        else {
            const currentEnvId = CookieService.getEnvId() || "";
            if (userData.userId) {
                const resUser = await PublicSvc.checkExistsAllSystems(userData.userId.trim(), currentEnvId);
                if (isExistResponse(resUser)) {
                    formRef.current?.setError('registerUsername', { type: 'error', message: 'Username is already taken' });
                    return;
                }
            }

            if (userData.emailId) {
                const resEmail = await PublicSvc.checkExistsAllSystems(userData.emailId.trim(), currentEnvId);
                if (isExistResponse(resEmail)) {
                    formRef.current?.setError('registerEmail', { type: 'error', message: 'Email is already taken' });
                    return;
                }
            }

            const res = await AdminAPI.postUserData('registerUser', userData, CookieService.getEnvId(), false);
            if (res) {
                showConfirmDialog({
                    type: "success",
                    message: "User added successfully.",
                    confirmText: "OK",
                });
                getData();
            }
        }
        setOpenedModal(null);

    }

    const editUser = (col: ColumnDef, row: any) => {
        const userFormModel = tableModelToUserFormModel(row);
        setRowToEdit(userFormModel);
        const userEditFormConfig = USER_ADDITION_FORM_CONFIG.map(input => {
            const cloned = { ...input };
            if (cloned.type === 'button' && cloned.buttonType === 'submit') {
                cloned.label = "Update User";
            }
            if (cloned.type === 'groupTextButton') {
                cloned.disabled = true;
            }
            if (cloned.name === 'registerUserRole') {
                cloned.options = userRoles ?? [];
            }
            if (cloned.name === 'registerUserStatus') {
                cloned.options = statusOptions ?? [];
            }
            return cloned;
        }).filter(input => input.type !== 'password');
        setFormConfig(userEditFormConfig ?? []);
        setOpenedModal("edit");
    }

    const addNewUser = () => {
        const newUser = new UserFormModel();
        newUser.environmentId = CookieService.getEnvId();
        setRowToEdit(newUser);
        const userAddFormConfig = USER_ADDITION_FORM_CONFIG.map(input => {
            const cloned = { ...input };
            if (cloned.type === 'button' && cloned.buttonType === 'submit') {
                cloned.label = "Add User";
            }
            if (cloned.name === 'registerUserRole') {
                cloned.options = userRoles;
            }
            if (cloned.name === 'registerUserStatus') {
                cloned.options = statusOptions;
            }
            if (cloned.type === 'groupTextButton') {
                cloned.disabled = false;
            }
            return cloned;
        });
        setFormConfig(userAddFormConfig ?? []);
        setOpenedModal("add");
    }

    const deleteUser = (row: any) => {
        showConfirmDialog({
            type: "warning",
            title: "Delete User",
            message: `Are you sure you want to delete user ${row.userId}?`,
            confirmText: "Yes, delete",
            cancelText: "Cancel",
            onConfirm: async () => {
                const userData = {
                    userId: row.userId,
                    envId: row.envId || CookieService.getEnvId(),
                    roleId: row.roleId,
                    accId: row.accId || CookieService.getEnvId(),
                    firstName: row.firstName,
                    lastName: row.lastName,
                    emailId: row.emailId,
                    contactNumber: row.contactNumber,
                    requestDate: row.requestDate || new Date().toISOString(),
                    updateDate: new Date().toISOString(),
                    updateComment: "User deleted (deactivated)",
                    userType: row.userType || "admin",
                    userStatus: "inactive"
                };
                const res = await AdminAPI.putUserData('updateUser', userData);
                if (res && res.data == "Updated") {
                    showConfirmDialog({
                        type: "success",
                        message: "User deleted successfully.",
                        confirmText: "OK",
                    });
                    getData();
                } else {
                    showConfirmDialog({
                        type: "error",
                        message: "Failed to delete user.",
                        confirmText: "OK",
                    });
                }
            }
        });
    }

    const changeUserAccess = (col: ColumnDef, row: any) => {
        getEnvFeatures(row["userId"]);
        setOpenedModal("access");
    }

    const getEnvFeatures = async (userId: string) => {
        if (!userId) return;
        const res = await AdminAPI.getEnvFeaturesByUserRole(CookieService.getEnvId(), userId);
        if (res) {
            setEnvFeatures(res.envFeatures || []);
        }
    };

    const handleCellClick = (col: ColumnDef, row: any) => {
        setSelectedUser(row);
        if (col.type === 'link' && col.icon && col.field === 'editUser') {
            editUser(col, row);
        }
        if (col.type === 'link' && col.icon && col.field === 'userAccess') {
            changeUserAccess(col, row);
        }
    }

    const formBtnTriggered = async (name: string, value: string) => {
        if (!value || !value.trim()) {
            formRef.current?.setError(name, {
                type: 'error',
                message: name === 'registerUsername' ? 'Please enter a username' : 'Please enter an email address'
            });
            return;
        }

        const trimmedVal = value.trim();

        const currentEnvId = CookieService.getEnvId() || "";

        if (name === 'registerUsername') {
            const pattern = /^[a-zA-Z0-9_]{5,15}$/;
            if (!pattern.test(trimmedVal)) {
                formRef.current?.setError(name, {
                    type: 'error',
                    message: 'Username must be 5–15 characters (letters, numbers, underscores)'
                });
                return;
            }

            const res = await PublicSvc.checkExistsAllSystems(trimmedVal, currentEnvId);
            if (!isExistResponse(res)) {
                formRef.current?.setError(name, { type: 'success', message: 'Username is available' });
            } else {
                formRef.current?.setError(name, { type: 'error', message: 'Username is already taken' });
            }
        }

        if (name === 'registerEmail') {
            const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!pattern.test(trimmedVal)) {
                formRef.current?.setError(name, {
                    type: 'error',
                    message: 'Please enter a valid email address'
                });
                return;
            }

            const res = await PublicSvc.checkExistsAllSystems(trimmedVal, currentEnvId);
            if (!isExistResponse(res)) {
                formRef.current?.setError(name, { type: 'success', message: 'Email is available' });
            } else {
                formRef.current?.setError(name, { type: 'error', message: 'Email is already taken' });
            }
        }
    };




    const getGrid = (id, seq) => {
        console.log(id, seq)
    }

    const updateAccess = () => {
        if (envFeaturesRef.current) {
            const assignedItems = envFeaturesRef.current.getEnvFeatures()
            const updatedChildItems = getChildElements(assignedItems)
            if (updatedChildItems && updatedChildItems) {
                const res = AdminAPI.updateUserAccess(CookieService.getEnvId(), selectedUser.userId, updatedChildItems)
                if (res) showConfirmDialog({
                    type: "success",
                    message: "Request submitted successfully",
                    confirmText: "OK",
                });
                else showConfirmDialog({
                    type: "error",
                    message: "Request failed",
                    confirmText: "OK",
                });
                setOpenedModal(null);
            }
        }
    }

    const getChildElements = (envFeatures) => {
        const assigned: { chElmDetailId: string, userId: string, envId: string }[] = [];
        envFeatures.forEach((feature) => {
            feature.featureElements?.forEach((el) => {
                el.elementDetails?.forEach((detail) => {
                    detail.childElementDtls?.forEach((child) => {
                        if (child.assigned) {
                            assigned.push({ chElmDetailId: child.chElementDtlId, userId: selectedUser.userId, envId: CookieService.getEnvId() });
                        }
                    });
                });
            });
        });
        return assigned;
    }

    const columns: GridColDef[] = [
        { field: "userId", headerName: "User Id", flex: 1 },
        { field: "emailId", headerName: "Email", flex: 1.2 },
        { field: "contactNumber", headerName: "Contact Number", flex: 1 },
        { field: "roleLabel", headerName: "Role", flex: 1 },
        { field: "userStatus", headerName: "Status", flex: 0.8 },
        {
            field: "editUser",
            headerName: "Edit",
            width: 80,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUser(params.row);
                        editUser({ field: "editUser" } as any, params.row);
                    }}
                >
                    <EditNoteOutlinedIcon color="primary" />
                </IconButton>
            )
        },
        {
            field: "userAccess",
            headerName: "Access",
            width: 90,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedUser(params.row);
                        changeUserAccess({ field: "userAccess" } as any, params.row);
                    }}
                >
                    <KeyOutlinedIcon style={{ color: 'var(--text-color-link)' }} />
                </IconButton>
            )
        },
        {
            field: "deleteUser",
            headerName: "Delete",
            width: 80,
            sortable: false,
            filterable: false,
            renderCell: (params) => (
                <IconButton
                    size="small"
                    onClick={(e) => {
                        e.stopPropagation();
                        deleteUser(params.row);
                    }}
                >
                    <DeleteOutlineIcon color="error" />
                </IconButton>
            )
        }
    ];

    return (
        <div className="page-padding-medium">

            <div className="font-[var(--font-bold)] pb-[var(--nnp-padding-medium)]">
                Additional User Accounts
            </div>

            {/* TABLE WRAPPER */}
            <div className="w-full" style={{ height: "400px" }}>
                {tableViewData && (
                    <NNPGrid
                        rows={tableViewData.rows}
                        columns={columns}
                        getRowId={(row: any) => row.id}
                    />
                )}
            </div>

            {/* BUTTON */}
            <div className="flex justify-end mt-4">
                <button
                    type="button"
                    onClick={() => addNewUser()}
                    className="nnp-btn nnp-btn-primary"
                >
                    Add New
                </button>
            </div>

            {/* MODAL */}
            <NNPModalComponent
                isOpen={openedModal === "edit" || openedModal === "add" || openedModal === "access"}
                onClose={() => setOpenedModal(null)}
                title={
                    openedModal === "edit"
                        ? "Edit User Account"
                        : openedModal === "add"
                            ? "Add New User Account"
                            : "User Access"
                }
            >
                {/* FORMS (edit / add) */}
                {(openedModal === "edit" || openedModal === "add") && (
                    <NNPFormComponent
                        ref={formRef}
                        inputs={formConfig ?? []}
                        layout="double"
                        onSubmit={handleFormSubmit}
                        defaultValues={rowToEdit || {}}
                        onTrigger={(name, value) => formBtnTriggered(name, value)}
                    />
                )}

                {/* ACCESS GRID */}
                {openedModal === "access" && (
                    <div className="w-full overflow-x-auto">
                        <EnvironmentalFeatures
                            ref={envFeaturesRef}
                            data={envFeatures}
                            onSelect={(id, seq) => getGrid(id, seq)}
                            showCheckboxes={true}
                            hideheader={true}
                            onUpdate={() => updateAccess()}
                        />
                    </div>
                )}
            </NNPModalComponent>

        </div>
    )
}

export default UserAccountComponent
