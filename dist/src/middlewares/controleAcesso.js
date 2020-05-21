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
exports.ControleAcessoFactory = exports.ControleAcesso = void 0;
/* eslint-disable max-classes-per-file */
const typedi_1 = require("typedi");
const axios_1 = __importDefault(require("axios"));
const permissoesApi_1 = __importDefault(require("../clients/permissoesApi"));
const funcionamentoBBCEApi_1 = __importDefault(require("../clients/funcionamentoBBCEApi"));
const controleAcessoService_1 = __importDefault(require("../services/controleAcessoService"));
const userError_1 = require("../errors/userError");
const funcionamentoErrors_1 = require("../errors/funcionamentoErrors");
let ControleAcesso = /** @class */ (() => {
    let ControleAcesso = class ControleAcesso {
        constructor(controleAcessoService) {
            this.controleAcessoService = controleAcessoService;
        }
        controlaPermissaoOperacoes(req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // TODO: pegar posteriormente o userId e escopos do JWT
                    const userId = Number(req.get("user-id"));
                    const escopoValidacao = req.requiredScopes.map(scope => Number(scope));
                    // define match dos serviços permitidos dos usuários com o escopo permitido da operação
                    const sevicosValidados = yield this.controleAcessoService.validaAcessoServico(userId, escopoValidacao);
                    req.validScopes = sevicosValidados;
                    next();
                }
                catch (error) {
                    if (error instanceof userError_1.PermissoesNaoEncontradas || error instanceof userError_1.UsuarioNaoAutorizado) {
                        res.status(403).send({ message: error.message });
                    }
                    else {
                        next(error);
                    }
                }
            });
        }
        controlaPermissaoHorarios(req, res, next) {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // TODO: pegar posteriormente o userId e escopos do JWT
                    const userId = Number(req.get("user-id"));
                    const escopoValidacao = req.requiredScopes.map(scope => Number(scope));
                    const data = new Date();
                    yield this.controleAcessoService.controlaPermissaoHorarios(data, userId, escopoValidacao);
                    next();
                }
                catch (error) {
                    if (error instanceof funcionamentoErrors_1.FuncionamentoFeriadoError || error instanceof funcionamentoErrors_1.FuncionamentoHorarioError) {
                        res.status(403).json({ message: error.message });
                    }
                    else {
                        next(error);
                    }
                }
            });
        }
    };
    ControleAcesso = __decorate([
        typedi_1.Service("controleAcesso"),
        __param(0, typedi_1.Inject("controleAcessoService")),
        __metadata("design:paramtypes", [controleAcessoService_1.default])
    ], ControleAcesso);
    return ControleAcesso;
})();
exports.ControleAcesso = ControleAcesso;
class ControleAcessoFactory {
    static create(urlPermissaoService, urlFuncionamentoBBCEService) {
        const apiPermissaoAxios = axios_1.default.create({
            baseURL: urlPermissaoService,
        });
        const apiFuncionamentoBBCEAxio = axios_1.default.create({
            baseURL: urlFuncionamentoBBCEService,
        });
        const permissoesApi = new permissoesApi_1.default(apiPermissaoAxios);
        const funcionamentoBBCEApi = new funcionamentoBBCEApi_1.default(apiFuncionamentoBBCEAxio);
        const controleAcessoService = new controleAcessoService_1.default(permissoesApi, funcionamentoBBCEApi);
        return new ControleAcesso(controleAcessoService);
    }
}
exports.ControleAcessoFactory = ControleAcessoFactory;
//# sourceMappingURL=controleAcesso.js.map