"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioNaoAutorizado = exports.PermissoesNaoEncontradas = void 0;
/* eslint-disable max-classes-per-file */
let PermissoesNaoEncontradas = /** @class */ (() => {
    class PermissoesNaoEncontradas extends Error {
        constructor() {
            super(PermissoesNaoEncontradas.mensagemErro);
        }
    }
    PermissoesNaoEncontradas.mensagemErro = "Permissões do usuário não encontrado no banco de dados.";
    return PermissoesNaoEncontradas;
})();
exports.PermissoesNaoEncontradas = PermissoesNaoEncontradas;
let UsuarioNaoAutorizado = /** @class */ (() => {
    class UsuarioNaoAutorizado extends Error {
        constructor() {
            super(UsuarioNaoAutorizado.mensagemErro);
        }
    }
    UsuarioNaoAutorizado.mensagemErro = "Usuário não está autorizado para realizar esta operação.";
    return UsuarioNaoAutorizado;
})();
exports.UsuarioNaoAutorizado = UsuarioNaoAutorizado;
//# sourceMappingURL=userError.js.map