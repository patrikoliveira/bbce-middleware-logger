import { Service, Inject } from "typedi";
import { AxiosInstance } from "axios";

import { IFuncionamentoBBCEApi, IFuncionamentoBBCE } from "./IFuncionamentoBBCEApi";

@Service("funcionamentoBBCEApi")
export default class FuncionamentoBBCEApi implements IFuncionamentoBBCEApi {
  constructor(
    @Inject("clientApi")
    private clientApi: AxiosInstance,
  ) {}

  public async getFuncionamentoBBCE(): Promise<IFuncionamentoBBCE> {
    return (await this.clientApi.get(`funcionamento-BBCE`)).data;
  }
}
