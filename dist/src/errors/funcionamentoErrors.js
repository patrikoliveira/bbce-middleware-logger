"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuncionamentoHorarioError = exports.FuncionamentoFeriadoError = void 0;
/* eslint-disable max-classes-per-file */
let FuncionamentoFeriadoError = /** @class */ (() => {
    class FuncionamentoFeriadoError extends Error {
        constructor() {
            super(FuncionamentoFeriadoError.mensagemErro);
        }
    }
    FuncionamentoFeriadoError.mensagemErro = "Operação não disponível para data atual (feriado).";
    return FuncionamentoFeriadoError;
})();
exports.FuncionamentoFeriadoError = FuncionamentoFeriadoError;
let FuncionamentoHorarioError = /** @class */ (() => {
    class FuncionamentoHorarioError extends Error {
        constructor() {
            super(FuncionamentoHorarioError.mensagemErro);
        }
    }
    FuncionamentoHorarioError.mensagemErro = "Operação não permitida para o horário atual.";
    return FuncionamentoHorarioError;
})();
exports.FuncionamentoHorarioError = FuncionamentoHorarioError;
//# sourceMappingURL=funcionamentoErrors.js.map