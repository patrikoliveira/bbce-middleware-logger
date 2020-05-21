"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const typedi_1 = require("typedi");
const permissoesApi_1 = __importDefault(require("../clients/permissoesApi"));
const funcionamentoBBCEApi_1 = __importDefault(require("../clients/funcionamentoBBCEApi"));
const utils_1 = require("../utils/utils");
const userError_1 = require("../errors/userError");
const funcionamentoErrors_1 = require("../errors/funcionamentoErrors");
let ControleAcessoService = /** @class */ (() => {
    let ControleAcessoService = class ControleAcessoService {
        constructor(permissoesApi, funcionamentoBBCEAPI) {
            this.permissoesApi = permissoesApi;
            this.funcionamentoBBCEAPI = funcionamentoBBCEAPI;
        }
        buscaServicosPermitidos(userId) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const permissoesUsuario = yield this.permissoesApi.getPermissionsUser(userId);
                    // filtra os serviços permitidos do usuário
                    const servicosPermitidos = permissoesUsuario.servicos.reduce((userServices, servico) => {
                        if (servico.permitido) {
                            userServices.push(servico.id);
                        }
                        return userServices;
                    }, []);
                    return servicosPermitidos;
                }
                catch (error) {
                    // para qualquer erro desconhecido relacionado à busca de permissões
                    // por usuário, a exceção UserPermissionNotFound será levantada
                    throw new userError_1.PermissoesNaoEncontradas();
                }
            });
        }
        validaAcessoServico(userId, escopoValidacao) {
            return __awaiter(this, void 0, void 0, function* () {
                // busca os serviços permitidos do usuário
                const servicosPermitidos = yield this.buscaServicosPermitidos(userId);
                // filtra os serviços permitidos pelo escopo de serviços da função
                const sevicosValidados = escopoValidacao.filter((escopo) => servicosPermitidos.includes(escopo));
                if (!sevicosValidados.length) {
                    throw new userError_1.UsuarioNaoAutorizado();
                }
                return sevicosValidados;
            });
        }
        // -----------------------------------------------------------
        // Valida acesso do usuário pelos dias/horários parametrizados
        // -----------------------------------------------------------
        validaFucionamentoFeriado(feriados, data) {
            const diaAtual = utils_1.getDateFormatFromDate(data);
            const feriadoAtual = feriados.find(feriado => feriado.data === diaAtual);
            if (feriadoAtual && !utils_1.isDateInIntervalTime(data, feriadoAtual.horarioAbertura, feriadoAtual.horarioFechamento)) {
                throw new funcionamentoErrors_1.FuncionamentoFeriadoError();
            }
            return feriadoAtual;
        }
        validaFuncionamentoHorario(horariosFuncionamento, data) {
            const diaAtual = utils_1.getDayOfTheWeekFromDate(data);
            const horarioFuncionamentoDiaAtual = horariosFuncionamento.find(horarioFuncionamento => horarioFuncionamento.diaSemana === diaAtual);
            if (horarioFuncionamentoDiaAtual &&
                utils_1.isDateInIntervalTime(data, horarioFuncionamentoDiaAtual.horarioAbertura, horarioFuncionamentoDiaAtual.horarioFechamento)) {
            }
            else {
                throw new funcionamentoErrors_1.FuncionamentoHorarioError();
            }
        }
        controlaPermissaoHorarios(data, userId, escopoValidacao) {
            return __awaiter(this, void 0, void 0, function* () {
                let sevicosValidados = [];
                try {
                    sevicosValidados = yield this.validaAcessoServico(userId, escopoValidacao);
                }
                catch (error) {
                    // ignora exceção e segue validação por data/horário
                }
                // caso seja validado o usuário com permissões elevadas, não é validado data/horário para a operação
                if (!sevicosValidados.length) {
                    const funcionamentoBBCE = yield this.funcionamentoBBCEAPI.getFuncionamentoBBCE();
                    const feriado = this.validaFucionamentoFeriado(funcionamentoBBCE.feriados, data);
                    if (!feriado) {
                        // caso nenhum feriado for validado, os dias úteis da semana devem ser validadas
                        this.validaFuncionamentoHorario(funcionamentoBBCE.horariosFuncionamento, data);
                    }
                }
            });
        }
    };
    ControleAcessoService = __decorate([
        typedi_1.Service("controleAcessoService"),
        __param(0, typedi_1.Inject("permissaoAPI")),
        __param(1, typedi_1.Inject("funcionamentoBBCEAPI")),
        __metadata("design:paramtypes", [permissoesApi_1.default,
            funcionamentoBBCEApi_1.default])
    ], ControleAcessoService);
    return ControleAcessoService;
})();
exports.default = ControleAcessoService;
//# sourceMappingURL=controleAcessoService.js.map