export interface K8sResourceModel {
    resourceKind: string;
    resourceName: string;
    willBeForceDeleted: boolean;
}