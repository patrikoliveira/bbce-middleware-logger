export interface IServicos {
    id: number;
    permitido: boolean;
}
export interface IGrupos {
    id: number;
    permitido: boolean;
}
export interface IPermissoes {
    servicos: Array<IServicos>;
    grupos: Array<IGrupos>;
}
export interface IUsersApi {
    getPermissionsUser(userId: number): Promise<IPermissoes>;
}
