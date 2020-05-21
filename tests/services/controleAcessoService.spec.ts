import ControleAcessoService from "../../src/services/controleAcessoService";

import PermissoesApi from "../../src/clients/permissoesApi";
import { IPermissoes as Permissoes, IServicos as Servicos } from "../../src/clients/IUsersApi";
import FuncionamentoBBCEApi from "../../src/clients/funcionamentoBBCEApi";

import { UsuarioNaoAutorizado, PermissoesNaoEncontradas } from "../../src/errors/userError";
import { FuncionamentoFeriadoError, FuncionamentoHorarioError } from "../../src/errors/funcionamentoErrors";

describe("controleAcessoService", () => {
  const permissoesApi = {} as PermissoesApi;
  const funcionamentoBBCEApi = {} as FuncionamentoBBCEApi;
  const controleAcessoService = new ControleAcessoService(permissoesApi, funcionamentoBBCEApi);
  const userId = 1;
  const escopoValidacao = [1, 7, 9, 43];
  const permissoesUsuario = {} as Permissoes;
  beforeEach(() => {
    permissoesUsuario.grupos = [];
    permissoesUsuario.servicos = [] as Servicos[];
  });
  describe("validaAcessoServico", () => {
    it("Should be returns number array when everything is fine", async () => {
      permissoesUsuario.servicos = [
        {
          id: 1,
          permitido: true,
        } as Servicos,
        {
          id: 7,
          permitido: false,
        } as Servicos,
        {
          id: 9,
          permitido: true,
        } as Servicos,
      ];
      permissoesApi.getPermissionsUser = jest.fn().mockResolvedValue(permissoesUsuario);
      const validatedServices = await controleAcessoService.validaAcessoServico(userId, escopoValidacao);
      expect(permissoesApi.getPermissionsUser).toBeCalledWith(userId);
      expect(validatedServices).toStrictEqual([1, 9]);
    });
    it("Should be able to call exception UsuarioNaoAutorizado when no match happens", async () => {
      permissoesUsuario.servicos = [
        {
          id: 2,
          permitido: false,
        } as Servicos,
        {
          id: 3,
          permitido: false,
        } as Servicos,
      ];
      permissoesApi.getPermissionsUser = jest.fn().mockResolvedValue(permissoesUsuario);
      await expect(controleAcessoService.validaAcessoServico(userId, escopoValidacao)).rejects.toStrictEqual(
        new UsuarioNaoAutorizado(),
      );
      expect(permissoesApi.getPermissionsUser).toBeCalledWith(userId);
    });
    it("Should be able to call exception PermissoesNaoEncontradas when errors occur when fetching user permissions", async () => {
      permissoesApi.getPermissionsUser = jest.fn().mockRejectedValue(new Error("Qualquer que seja"));
      await expect(controleAcessoService.validaAcessoServico(userId, escopoValidacao)).rejects.toStrictEqual(
        new PermissoesNaoEncontradas(),
      );
      expect(permissoesApi.getPermissionsUser).toBeCalledWith(userId);
    });
  });
  describe("controlaPermissaoHorarios", () => {
    const funcionamentoBBCE = {
      feriados: [
        {
          id: 1,
          nome: "Dia dos trabalhadores",
          data: "2020-05-01",
          horarioAbertura: "08:00",
          horarioFechamento: "10:00",
        },
        {
          id: 2,
          nome: "Exceção do domingo",
          data: "2020-04-05",
          horarioAbertura: "18:00",
          horarioFechamento: "20:00",
        },
      ],
      horariosFuncionamento: [
        {
          id: 1,
          diaSemana: "segunda",
          horarioAbertura: "08:00",
          horarioFechamento: "17:00",
        },
        {
          id: 2,
          diaSemana: "terca",
          horarioAbertura: "08:00",
          horarioFechamento: "17:00",
        },
        {
          id: 3,
          diaSemana: "quarta",
          horarioAbertura: "08:00",
          horarioFechamento: "17:00",
        },
        {
          id: 4,
          diaSemana: "quinta",
          horarioAbertura: "08:00",
          horarioFechamento: "17:00",
        },
        {
          id: 5,
          diaSemana: "sexta",
          horarioAbertura: "08:00",
          horarioFechamento: "17:00",
        },
      ],
    };
    funcionamentoBBCEApi.getFuncionamentoBBCE = jest.fn().mockResolvedValue(funcionamentoBBCE);
    it("Should be return undefined when validation passes", async () => {
      // 03/04/2000 === sexta
      const date = new Date();
      const day = 3;
      const month = 3;
      const year = 2020;
      const hour = 12;
      const minutes = 0;
      date.setDate(day);
      date.setMonth(month);
      date.setFullYear(year);
      date.setHours(hour, minutes);
      controleAcessoService.validaAcessoServico = jest.fn().mockResolvedValue([]);
      const result = await controleAcessoService.controlaPermissaoHorarios(date, userId, escopoValidacao);
      expect(result).toBe(undefined);
    });
    it("Should be return undefined when validation passes with holiday on the day", async () => {
      // 05/04/2000 === domingo
      const date = new Date();
      const day = 5;
      const month = 3;
      const year = 2020;
      const hour = 19;
      const minutes = 0;
      date.setDate(day);
      date.setMonth(month);
      date.setFullYear(year);
      date.setHours(hour, minutes);
      controleAcessoService.validaAcessoServico = jest.fn().mockResolvedValue([]);
      const result = await controleAcessoService.controlaPermissaoHorarios(date, userId, escopoValidacao);
      expect(result).toBe(undefined);
    });
    it("Should be return undefined when administrator validation passes", async () => {
      // 05/04/2000 === domingo
      const date = new Date();
      controleAcessoService.validaAcessoServico = jest.fn().mockResolvedValue([43]);
      const result = await controleAcessoService.controlaPermissaoHorarios(date, userId, escopoValidacao);
      expect(result).toBe(undefined);
    });
    it("Should throw FuncionamentoFeriadoError when today is a holiday", async () => {
      const date = new Date();
      const day = 1;
      const month = 4;
      const year = 2020;
      const hour = 12;
      const minutes = 0;
      date.setDate(day);
      date.setMonth(month);
      date.setFullYear(year);
      date.setHours(hour, minutes);
      controleAcessoService.validaAcessoServico = jest.fn().mockResolvedValue([]);
      await expect(
        controleAcessoService.controlaPermissaoHorarios(date, userId, escopoValidacao),
      ).rejects.toStrictEqual(new FuncionamentoFeriadoError());
    });
    it("Should throw FuncionamentoHorarioError when the time does not correspond to the opening hours", async () => {
      // 03/04/2000 === sexta
      const date = new Date();
      const day = 3;
      const month = 3;
      const year = 2020;
      const hour = 20;
      const minutes = 0;
      date.setDate(day);
      date.setMonth(month);
      date.setFullYear(year);
      date.setHours(hour, minutes);
      controleAcessoService.validaAcessoServico = jest.fn().mockResolvedValue([]);
      await expect(
        controleAcessoService.controlaPermissaoHorarios(date, userId, escopoValidacao),
      ).rejects.toStrictEqual(new FuncionamentoHorarioError());
    });
    it("Should throw FuncionamentoHorarioError when no day is set", async () => {
      // 04/04/2000 === sábado
      const date = new Date();
      const day = 4;
      const month = 3;
      const year = 2020;
      const hour = 20;
      const minutes = 0;
      date.setDate(day);
      date.setMonth(month);
      date.setFullYear(year);
      date.setHours(hour, minutes);
      controleAcessoService.validaAcessoServico = jest.fn().mockResolvedValue([]);
      await expect(
        controleAcessoService.controlaPermissaoHorarios(date, userId, escopoValidacao),
      ).rejects.toStrictEqual(new FuncionamentoHorarioError());
    });
  });
});
