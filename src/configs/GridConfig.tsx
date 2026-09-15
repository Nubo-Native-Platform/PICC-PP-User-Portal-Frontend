import { type GridColDef } from "@mui/x-data-grid";
import { Pencil, Plus, ShieldOff, Trash, ShieldCheck } from "lucide-react";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import Swal from "sweetalert2";
import { GridActionsCellItem } from "@mui/x-data-grid";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import TerminalIcon from "@mui/icons-material/Terminal";


type PodActionHandlers = {
  onRestart: (row: any) => void;
  onDelete: (row: any) => void;
  onTerminal: (row: any) => void;
};

type GridActionHandlers<T = any> = {
  onAdd?: (row: T) => void;
  onEdit?: (row: T, gridType?: string) => void;
  onDisable?: (row: T, gridType?: string) => void;
  onDelete?: (row: T, gridType?: string) => void;
  getStatus?: (row: T) => string | undefined;
  // onDeleteConfirm?:(row: T, gridType?: string) => void;
  gridType?: string;
};

export const ProxyConfigColumnGrid: GridColDef[] = [
  { field: 'compSrvName', headerName: 'COMPANY SERVICE NAME', flex: 1, minWidth: 200 },
  { field: 'domainName', headerName: 'DOMAIN NAME', flex: 1, minWidth: 150 },
  { field: 'parentFrontend', headerName: 'PARENT FRONTEND', flex: 1, minWidth: 100 },
  { field: 'subpath', headerName: 'SUBPATH', flex: 1, minWidth: 100 },
  { field: 'lineIndex', headerName: 'LINE INDEX', flex: 1, minWidth: 200 },
]

// seperate config for KubernetesPopComp
export const getPodActionColumn = ({
  onRestart,
  onDelete,
  onTerminal,
}: PodActionHandlers): GridColDef => ({
  field: "actions",
  headerName: "Actions",
  type: "actions",
  width: 120,
  getActions: (params: any) => [
    <GridActionsCellItem
      key="restart"
      icon={
        <Tooltip title="Restart Pod">
          <RestartAltIcon color="primary" />
        </Tooltip>
      }
      label="Restart"
      onClick={() => onRestart(params.row)}
    />,
    <GridActionsCellItem
      key="delete"
      icon={
        <Tooltip title="Delete Pod">
          <DeleteOutlineIcon color="error" />
        </Tooltip>
      }
      label="Delete"
      onClick={() => onDelete(params.row)}
    />,
    <GridActionsCellItem
      key="terminal"
      icon={
        <Tooltip title="Open Terminal">
          <TerminalIcon sx={{ color: "green" }} />
        </Tooltip>
      }
      label="Terminal"
      onClick={() => onTerminal(params.row)}
    />,
  ],
});

export const getServiceEndpointColumn = (): GridColDef => ({
  field: "servicesFormatted",
  headerName: "Services",
  flex: 1.5,
  sortable: false,

  renderCell: (params) => {
    const value = params.value || "No Services";

    return (
      <Tooltip title={value} arrow placement="top">
        <div
          style={{
            display: "flex",
            alignItems: "center",
            width: "100%",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
            lineHeight: "1.4rem",
            height: '100%'
          }}
        >
          {value}
        </div>
      </Tooltip>
    );
  },
});


export const getActionColumn = <T = any>(
  handlers: GridActionHandlers<T>
): GridColDef => ({
  field: 'actions',
  headerName: 'ACTIONS',
  flex: 1,
  minWidth: 150,
  // width: 120,
  sortable: false,
  filterable: false,
  disableColumnMenu: true,
  renderCell: (params) => {
    const status = handlers.getStatus?.(params.row);
    return (
      <div className="flex space-x-10">
        {handlers.onEdit && !params.row.isAdd && (
          <Tooltip title="Edit">
            <IconButton
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                handlers.onEdit?.(params.row, handlers.gridType);
              }}
            >
              <Pencil fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {handlers.onAdd && params.row.isAdd && (
          <Tooltip title="Add">
            <IconButton
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                handlers.onAdd?.(params.row)
              }
              }
            >
              <Plus fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
        {handlers.onDisable && (
          <IconButton
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              handlers.onDisable?.(params.row, handlers.gridType)
            }
            }
          // sx={{
          //   visibility: status === 'ACTIVE' ? 'visible' : 'hidden'
          // }}
          >
            {status === 'ACTIVE' &&
              <Tooltip title="Disable">
                <ShieldOff fontSize="small" />
              </Tooltip>}

            {status != 'ACTIVE' &&
              <Tooltip title="Enable">
                <ShieldCheck fontSize="small" />
              </Tooltip>
            }
          </IconButton>
        )}
        {handlers.onDelete && (
          <IconButton
            size="small"
            onClick={() => {
              Swal.fire({
                title: "Are you sure?",
                text: "You won't be able to revert this!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonColor: "#d33",
                cancelButtonColor: "#607d8b",
                confirmButtonText: "Yes, delete it!"
              }).then((result) => {
                if (result.isConfirmed) {
                  handlers.onDelete?.(params.row, handlers.gridType)
                }
              });
            }}
          >
            <Tooltip title="Delete">
              <Trash fontSize="small" />
            </Tooltip>
          </IconButton>
        )}
      </div>
    )
  },
});

