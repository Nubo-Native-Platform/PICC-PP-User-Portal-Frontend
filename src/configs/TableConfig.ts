import { ColumnDef } from "@/models/customTableModel";
import RestartAltOutlinedIcon from '@mui/icons-material/RestartAltOutlined';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import TerminalIcon from '@mui/icons-material/Terminal';

export const marketPlaceTableConfig = {
    groupByRows: true,
    groupByField: "solution",
    typeField: "type",
    types: ["usage", "revenue"],

    staticColumns: [
        { field: "solution", headerName: "SOLUTION" },
        { field: "type", headerName: "TYPE" },
    ],
};

export const KubernetesPodsTableConfig: ColumnDef[] = [
    {
        field: "podName",
        type: "string",
        headerName: "Pod Name",
    },
    {
        field: "deploymentName",
        type: "string",
        headerName: "Deployment Name",
    },
    {
        field: "podStatus",
        type: "string",
        headerName: "Status",
    },
    {
        field: "memory",
        type: "string",
        headerName: "Memory Usage",
    },
    {
        field: "cpu",
        type: "string",
        headerName: "CPU Usage",
    },
    {
        field: "restart",
        type: "link",
        headerName: "Restart",
        icon: RestartAltOutlinedIcon
    },
    {
        field: "deletePod",
        type: "link",
        headerName: "Delete",
        icon: DeleteOutlineIcon
    },
    {
        field: "terminal",
        type: "link",
        headerName: "Terminal",
        icon: TerminalIcon
    }
];

