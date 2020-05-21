import { AxiosInstance } from "axios";
import { IUsersApi, IPermissoes } from "./IUsersApi";
export default class PermissoesApi implements IUsersApi {
    private clientApi;
    constructor(clientApi: AxiosInstance);
    getPermissionsUser(userId: number): Promise<IPermissoes>;
}
export { IPermissoes };
