export interface KubernetesDeploymentModel {
    deploymentName: string,
    pods: KubernetesResource[],
    replicaSets: KubernetesResource[],
    services: KubernetesResource[],
    configMaps: KubernetesResource[],
    secrets: KubernetesResource[],
    pvcs: KubernetesResource[];
}


export interface KubernetesResource {
    resourceName: string;
    resourceKind: string;
    willBeForceDeleted: boolean;
}

export interface KubernetesResourceNamesModel {
    envName: string,
    deploymentNames: string[],
    serviceNames: string[],
    configMapNames: string[],
    secretsNames: string[],
    PVCNames: string[],
    podNames: string[],
    replicaSetNames: string[]
}
