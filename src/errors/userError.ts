/* eslint-disable max-classes-per-file */
export class PermissoesNaoEncontradas extends Error {
  static mensagemErro = "Permissões do usuário não encontrado no banco de dados.";

  public constructor() {
    super(PermissoesNaoEncontradas.mensagemErro);
  }
}

export class UsuarioNaoAutorizado extends Error {
  static mensagemErro = "Usuário não está autorizado para realizar esta operação.";

  public constructor() {
    super(UsuarioNaoAutorizado.mensagemErro);
  }
}
