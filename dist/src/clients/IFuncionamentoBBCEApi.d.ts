export interface IFeriado {
    id?: number;
    nome: string;
    data: string;
    horarioAbertura: string;
    horarioFechamento: string;
}
export declare enum DiaSemanaEnum {
    Domingo,
    Segunda,
    Terca,
    Quarta,
    Quinta,
    Sexta,
    Sabado
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
