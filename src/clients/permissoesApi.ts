import { Service, Inject } from "typedi";
import { AxiosInstance } from "axios";

import { IUsersApi, IPermissoes } from "./IUsersApi";

@Service("permissoesApi")
export default class PermissoesApi implements IUsersApi {
  constructor(
    @Inject("clientApi")
    private clientApi: AxiosInstance,
  ) {}

  public async getPermissionsUser(userId: number): Promise<IPermissoes> {
    return (await this.clientApi.get(`/usuarios/${userId}/permissoes`)).data;
  }
}

export { IPermissoes };
