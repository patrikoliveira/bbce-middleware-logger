/* eslint-disable max-classes-per-file */
export class FuncionamentoFeriadoError extends Error {
  static mensagemErro = "Operação não disponível para data atual (feriado).";

  public constructor() {
    super(FuncionamentoFeriadoError.mensagemErro);
  }
}

export class FuncionamentoHorarioError extends Error {
  static mensagemErro = "Operação não permitida para o horário atual.";

  public constructor() {
    super(FuncionamentoHorarioError.mensagemErro);
  }
}
