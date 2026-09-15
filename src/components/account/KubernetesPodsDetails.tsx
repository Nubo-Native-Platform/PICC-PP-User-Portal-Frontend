import React, { useEffect, useState } from "react";
import NNPGrid from "@/sharedComponents/Datagrid";
import AdminAPI from "@/services/AdminAPI";
import CookieService from "@/services/cookies";
import {
    kubernetesDetailsToTableRows,
    resourcesModelToFormConfig,
} from "@/services/ModelTranslator.service";
import NNPModalComponent from "@/sharedComponents/NNPModalComponent";
import FormComponent from "@/sharedComponents/FormComponent";
import { getPodActionColumn, getServiceEndpointColumn } from "@/configs/GridConfig";
import { KubernetesResourceNamesModel } from "@/models/apimodels/kubernetes-resource-model";

const KubernetesPodsDetails = () => {
    const [rows, setRows] = useState<any[]>([]);
    const [columns, setColumns] = useState<any[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formFields, setFormFields] = useState<any[]>([]);
    const [deploymentName, setDeploymentName] = useState<string>("");

    useEffect(() => {
        initialize();
    }, []);

    const initialize = async () => {
        const kubernetesDetails = await AdminAPI.getKubernetesDetails(
            CookieService.getEnvId() || ""
        );
        const podRows = kubernetesDetailsToTableRows(
            kubernetesDetails?.podMetric || []
        );

        const colDef = [
            { field: "podName", headerName: "Pod Name", flex: 1 },
            { field: "deploymentName", headerName: "Deployment Name", flex: 1 },
            { field: "podStatus", headerName: "Status", flex: 1 },
            { field: "memory", headerName: "Memory Usage", flex: 1 },
            { field: "cpu", headerName: "CPU Usage", flex: 1 },
            getServiceEndpointColumn(),
            getPodActionColumn({
                onRestart: handleRestart,
                onDelete: handleDeleteModal,
                onTerminal: handleTerminal,
            }),
        ];

        setRows(podRows);
        setColumns(colDef);
    };

    const handleRestart = async (row: any) => {
        const response = await AdminAPI.restartPod(CookieService.getEnvId() || "", row.podName);
        if (response) {
            setTimeout(() => initialize(), 500);
        }
    };

    const handleDeleteModal = async (row: any) => {
        const resources = await AdminAPI.getK8sIntgResources(
            CookieService.getEnvId() || "",
            row.deploymentName
        );

        const formConfig = resourcesModelToFormConfig(resources);
        const currentDeploymentName = row.deploymentName;

        formConfig.find(f => f.name === "deleteBtn")!.value = (fields: any[]) =>
            handleDelete(fields, currentDeploymentName);

        const filteredConfig = formConfig.filter(
            (f) =>
                (f.type === "checkbox" && f.options && f.options.length > 0) ||
                f.type !== "checkbox"
        );

        setDeploymentName(currentDeploymentName);
        setFormFields(filteredConfig);
        setIsModalOpen(true);
    };

    const handleDelete = async (fields: any[], deploymentName: string) => {
        const formData = Object.fromEntries(fields.map(f => [f.name, f.value]));

        const resourceNamesToDelete: KubernetesResourceNamesModel = {
            envName: CookieService.getEnvId() || "",
            deploymentNames: [deploymentName],
            serviceNames: formData.services,
            configMapNames: formData.configMaps,
            secretsNames: formData.secrets,
            PVCNames: formData.pvcs,
            podNames: formData.pods,
            replicaSetNames: formData.replicaSets,
        };

        await AdminAPI.deletePod(resourceNamesToDelete);

        setIsModalOpen(false);
        initialize();
    };

    const handleTerminal = async (row: any) => {
        const res = await AdminAPI.openKubernetesTerminal({
            envName: CookieService.getEnvId() || "",
            pod: row.podName,
        });
        if (res.data) {
            const html = res.data.replace(/\$\{window\.location\.host\}/g, window.location.host);
            const blob = new Blob([html], { type: "text/html" });
            window.open(URL.createObjectURL(blob), "_blank");
        }
    };

    return (
        <div className="page-padding-medium max-w-full overflow-x-hidden">
            <div className="font-[var(--font-bold)] pb-[var(--nnp-padding-medium)] text-lg sm:text-xl">
                Kubernetes Pods
            </div>

            <NNPGrid
                rows={rows}
                columns={columns}
                getRowId={(row: any) => `${row.podName}-${row.namespace}`}
                getRowHeight={() => 'auto'}
            />

            <NNPModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Select Resources to Delete"
                width="35vw"
            >
                <div className="w-full sm:w-auto">
                    <div className="mb-4 font-sm sm:text-base">
                        Deployment Name:
                        <span className="font-bold block sm:inline mt-1">
                            {deploymentName}
                        </span>
                    </div>

                    <div className="max-h-[70vh] overflow-y-auto">
                        <FormComponent fields={formFields} onChange={() => { }} />
                    </div>
                </div>
            </NNPModalComponent>
        </div>
    );
};

export default KubernetesPodsDetails;
