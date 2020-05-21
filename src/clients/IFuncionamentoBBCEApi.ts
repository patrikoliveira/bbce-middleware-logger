/* eslint-disable @typescript-eslint/consistent-type-assertions */
export interface IFeriado {
  id?: number;
  nome: string;
  data: string;
  horarioAbertura: string;
  horarioFechamento: string;
}
export enum DiaSemanaEnum {
  Domingo = <any>"domingo",
  Segunda = <any>"segunda",
  Terca = <any>"terca",
  Quarta = <any>"quarta",
  Quinta = <any>"quinta",
  Sexta = <any>"sexta",
  Sabado = <any>"sabado",
}

export interface IDiaSemana {
  id: number;
  diaSemana: DiaSemanaEnum;
  horarioAbertura: string;
  horarioFechamento: string;
}

export interface IFuncionamentoBBCE {
  feriados: Array<IFeriado>;
  horariosFuncionamento: Array<IDiaSemana>;
}

export interface IFuncionamentoBBCEApi {
  getFuncionamentoBBCE(): Promise<IFuncionamentoBBCE>;
}
