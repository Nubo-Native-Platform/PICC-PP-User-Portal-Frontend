import { ProxyFormConfig } from '@/configs/FormConfig';
import { getActionColumn, ProxyConfigColumnGrid } from '@/configs/GridConfig';
import { ProxyConfigModel } from '@/models/apimodels/proxy-config-model';
import CookieService from '@/services/cookies';
import HomeAPI from '@/services/HomeAPI';
import { showConfirmDialog } from '@/sharedComponents/ConfirmDialog';
import NNPGrid from '@/sharedComponents/Datagrid';
import NNPFormComponent from '@/sharedComponents/NNPFormComponent';
import NNPModalComponent from '@/sharedComponents/NNPModalComponent';
import React, { useEffect, useRef, useState } from 'react'
import { UseFormClearErrors, UseFormSetError } from 'react-hook-form';

const ProxyConfigComponent = (props: any) => {

    const [data, setData] = useState<any>(null);
    const [columDef, setColumDef] = useState<any>(ProxyConfigColumnGrid);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [rowToEdit, setRowToEdit] = useState<ProxyConfigModel | null>()
    // const [APICreationFormCongif, setAPICreationForm] = useState<InputConfig>(APICreationForm)
    const [title, setTitle] = useState<string>('')
    const formRef = useRef<{ setError: UseFormSetError<any>; clearErrors: UseFormClearErrors<any> }>(null);
    const [formConfig, setFormConfig] = useState<any>();

    //   const [openedModal, setOpenedModal] = useState<string | null>(null);


    const createNewAPI = () => {
        setTitle('Create New API')
        setRowToEdit(null)
        setIsModalOpen(true)
        setFormConfig(ProxyFormConfig)
    }
    const handleRowEdit = (row: any, gridType?: string) => {
        setIsModalOpen(true)
        setTitle('Edit API')
        setFormConfig(ProxyFormConfig)
        setRowToEdit(row)

    }
    const handleDelete = async (row: any, gridType?: string) => {
          try {
            const proxySubmission = await HomeAPI.deleteProxyConfig(row.envConfigId)
            if (proxySubmission) {
                showConfirmDialog({
                    type: "success",
                    message: "Proxy Config deleted successfully.",
                    confirmText: "OK",
                })
                Initialize();
            }
        }
        catch (err) {
            // alertAction('error', typeof err === 'object' && err !== null && 'message' in err ? (err as { message: string }).message : String(err))();
        }
    }
    const handleFormSubmit = async (data: any) => {
        data.envId = CookieService.getEnvId()
        setIsModalOpen(false)
        try {
            const proxySubmission = data.envConfigId ? await HomeAPI.updateProxyConfig(data, data.envConfigId) : await HomeAPI.addProxyConfig(data);
            if (proxySubmission) {
                if (data.conOrgId) {
                    showConfirmDialog({
                        type: "success",
                        message: "Proxy Config updated successfully.",
                        confirmText: "OK",
                    });
                } else {
                    showConfirmDialog({
                        type: "success",
                        message: "Proxy Config created successfully.",
                        confirmText: "OK",
                    });
                }
                Initialize();
            }
        }
        catch (err) {
            // alertAction('error', typeof err === 'object' && err !== null && 'message' in err ? (err as { message: string }).message : String(err))();
        }
    }
    const Initialize = async () => {
        const proxyConfigData = await HomeAPI.getAllProxyConfig();
        setData(proxyConfigData);
    }
    useEffect(() => {
        if (props && props.data) {
            setColumDef([...ProxyConfigColumnGrid
                , getActionColumn({ onEdit: handleRowEdit, onDelete: handleDelete, gridType: 'USER' })
            ]);
            setData(props.data);
        }
    }, [props]);
    return (
        <div className="h-full flex flex-col page-padding-medium">
            <div className="flex justify-between items-center mb-[10px]">
                <div className="font-[var(--font-bold)] pb-[var(--nnp-padding-medium)]">Manage Proxy Configuration</div>
                <button className="flex p-2 bg-[var(--component-color-blue)] text-white rounded-md cursor-pointer" onClick={createNewAPI}>Create new Proxy</button>
            </div>
            <div className="flex-1">
                {columDef && <NNPGrid rows={data} columns={columDef} getRowId={(row: ProxyConfigModel) => `${row.lineIndex}`}
                />}
            </div>
            <NNPModalComponent
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={title}
            >
                <NNPFormComponent
                    ref={formRef}
                    inputs={formConfig ?? []} layout="double" onSubmit={handleFormSubmit} defaultValues={rowToEdit || {}} onTrigger={(name, value) => {
                    }} />

            </NNPModalComponent>
            {/* <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={title}
            >
                <DynamicForm inputs={APICreationFormCongif ?? []} layout="double" onSubmit={handleFormSubmit} defaultValues={rowToEdit || new ApiRegistryModel()} />
            </Modal> */}
        </div>
    )
}

export default ProxyConfigComponent