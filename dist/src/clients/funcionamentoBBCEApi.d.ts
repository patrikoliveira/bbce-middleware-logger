import { AxiosInstance } from "axios";
import { IFuncionamentoBBCEApi, IFuncionamentoBBCE } from "./IFuncionamentoBBCEApi";
export default class FuncionamentoBBCEApi implements IFuncionamentoBBCEApi {
    private clientApi;
    constructor(clientApi: AxiosInstance);
    getFuncionamentoBBCE(): Promise<IFuncionamentoBBCE>;
}
