import { Service, Inject } from "typedi";
import PermissoesApi from "../clients/permissoesApi";
import FuncionamentoBBCEApi from "../clients/funcionamentoBBCEApi";
import { IServicos as Servicos } from "../clients/IUsersApi";
import { IFeriado as Feriado, IDiaSemana as DiaSemana } from "../clients/IFuncionamentoBBCEApi";
import { getDateFormatFromDate, isDateInIntervalTime, getDayOfTheWeekFromDate } from "../utils/utils";

import { PermissoesNaoEncontradas, UsuarioNaoAutorizado } from "../errors/userError";
import { FuncionamentoFeriadoError, FuncionamentoHorarioError } from "../errors/funcionamentoErrors";

@Service("controleAcessoService")
export default class ControleAcessoService {
  constructor(
    @Inject("permissaoAPI")
    private permissoesApi: PermissoesApi,
    @Inject("funcionamentoBBCEAPI")
    private funcionamentoBBCEAPI: FuncionamentoBBCEApi,
  ) {}

  public async buscaServicosPermitidos(userId: number): Promise<number[]> {
    try {
      const permissoesUsuario = await this.permissoesApi.getPermissionsUser(userId);
      // filtra os serviços permitidos do usuário
      const servicosPermitidos: number[] = permissoesUsuario.servicos.reduce(
        (userServices: number[], servico: Servicos): number[] => {
          if (servico.permitido) {
            userServices.push(servico.id);
          }
          return userServices;
        },
        [] as number[],
      );

      return servicosPermitidos;
    } catch (error) {
      // para qualquer erro desconhecido relacionado à busca de permissões
      // por usuário, a exceção UserPermissionNotFound será levantada
      throw new PermissoesNaoEncontradas();
    }
  }

  async validaAcessoServico(userId: number, escopoValidacao: number[]): Promise<number[]> {
    // busca os serviços permitidos do usuário
    const servicosPermitidos: number[] = await this.buscaServicosPermitidos(userId);
    // filtra os serviços permitidos pelo escopo de serviços da função
    const sevicosValidados: number[] = escopoValidacao.filter((escopo: number) => servicosPermitidos.includes(escopo));

    if (!sevicosValidados.length) {
      throw new UsuarioNaoAutorizado();
    }

    return sevicosValidados;
  }

  // -----------------------------------------------------------
  // Valida acesso do usuário pelos dias/horários parametrizados
  // -----------------------------------------------------------

  private validaFucionamentoFeriado(feriados: Feriado[], data: Date): Feriado | undefined {
    const diaAtual = getDateFormatFromDate(data);
    const feriadoAtual = feriados.find(feriado => feriado.data === diaAtual);

    if (feriadoAtual && !isDateInIntervalTime(data, feriadoAtual.horarioAbertura, feriadoAtual.horarioFechamento)) {
      throw new FuncionamentoFeriadoError();
    }

    return feriadoAtual;
  }

  private validaFuncionamentoHorario(horariosFuncionamento: DiaSemana[], data: Date): void {
    const diaAtual = getDayOfTheWeekFromDate(data);

    const horarioFuncionamentoDiaAtual = horariosFuncionamento.find(
      horarioFuncionamento => horarioFuncionamento.diaSemana === diaAtual,
    );

    if (
      horarioFuncionamentoDiaAtual &&
      isDateInIntervalTime(
        data,
        horarioFuncionamentoDiaAtual.horarioAbertura,
        horarioFuncionamentoDiaAtual.horarioFechamento,
      )
    ) {
    } else {
      throw new FuncionamentoHorarioError();
    }
  }

  async controlaPermissaoHorarios(data: Date, userId: number, escopoValidacao: number[]): Promise<void> {
    let sevicosValidados: number[] = [];
    try {
      sevicosValidados = await this.validaAcessoServico(userId, escopoValidacao);
    } catch (error) {
      // ignora exceção e segue validação por data/horário
    }

    // caso seja validado o usuário com permissões elevadas, não é validado data/horário para a operação
    if (!sevicosValidados.length) {
      const funcionamentoBBCE = await this.funcionamentoBBCEAPI.getFuncionamentoBBCE();
      const feriado = this.validaFucionamentoFeriado(funcionamentoBBCE.feriados, data);
      if (!feriado) {
        // caso nenhum feriado for validado, os dias úteis da semana devem ser validadas
        this.validaFuncionamentoHorario(funcionamentoBBCE.horariosFuncionamento, data);
      }
    }
  }
}
