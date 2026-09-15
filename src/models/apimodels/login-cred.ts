export interface LoginCred {
  username: string,
  password: string,
  envId: string | undefined,
  env?: Env,
}

export interface Env {
  envId: string;
  envName?: string;
  envTenantId: string;
}
