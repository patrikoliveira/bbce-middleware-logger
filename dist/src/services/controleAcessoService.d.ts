import PermissoesApi from "../clients/permissoesApi";
import FuncionamentoBBCEApi from "../clients/funcionamentoBBCEApi";
export default class ControleAcessoService {
    private permissoesApi;
    private funcionamentoBBCEAPI;
    constructor(permissoesApi: PermissoesApi, funcionamentoBBCEAPI: FuncionamentoBBCEApi);
    buscaServicosPermitidos(userId: number): Promise<number[]>;
    validaAcessoServico(userId: number, escopoValidacao: number[]): Promise<number[]>;
    private validaFucionamentoFeriado;
    private validaFuncionamentoHorario;
    controlaPermissaoHorarios(data: Date, userId: number, escopoValidacao: number[]): Promise<void>;
}
