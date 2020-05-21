import { Request, Response } from "express";

import { ControleAcesso as ControleAcessoController } from "../../src/middlewares/controleAcesso";
import ControleAcessoService from "../../src/services/controleAcessoService";

import { UsuarioNaoAutorizado, PermissoesNaoEncontradas } from "../../src/errors/userError";
import { FuncionamentoFeriadoError, FuncionamentoHorarioError } from "../../src/errors/funcionamentoErrors";

describe("controleAcessoController", () => {
  const controleAcessoService = {} as ControleAcessoService;
  const controleAcessoController = new ControleAcessoController(controleAcessoService);

  // eslint-disable-next-line @typescript-eslint/interface-name-prefix
  interface SwaggerRequestType extends Request {
    requiredScopes: string[];
  }

  const req = {} as SwaggerRequestType;
  const res = {} as Response;
  const nextFunction = {
    next: (value: any) => {},
  };

  beforeEach(() => {
    jest.resetAllMocks();
    req.requiredScopes = ["1", "7", "9"];
    req.get = jest.fn().mockReturnValue("1");
    res.status = jest.fn().mockReturnThis();
    res.send = jest.fn().mockReturnThis();
    res.json = jest.fn().mockReturnThis();
    res.setHeader = jest.fn().mockReturnThis();
    nextFunction.next = jest.fn().mockReturnThis();
  });

  describe("controlaPermissaoOperacoes", () => {
    it("Should be continue the flow with 'next()' function", async () => {
      controleAcessoService.validaAcessoServico = jest.fn().mockResolvedValue([7, 9]);
      await controleAcessoController.controlaPermissaoOperacoes(req, res, nextFunction.next);

      expect(controleAcessoService.validaAcessoServico).toBeCalledWith(1, [1, 7, 9]);
      // expect(res.setHeader).toBeCalledWith("scope", "7, 9");
      expect(nextFunction.next).toBeCalledWith();
    });

    it("Should be able to call exception when validaAcessoServico fails whith PermissoesNaoEncontradas", async () => {
      controleAcessoService.validaAcessoServico = jest.fn().mockRejectedValue(new PermissoesNaoEncontradas());
      await controleAcessoController.controlaPermissaoOperacoes(req, res, nextFunction.next);

      expect(controleAcessoService.validaAcessoServico).toBeCalledWith(1, [1, 7, 9]);
      expect(res.status).toBeCalledWith(403);
      expect(res.send).toBeCalledWith({ message: PermissoesNaoEncontradas.mensagemErro });
    });

    it("Should be able to call exception when validaAcessoServico fails whith PermissoesNaoEncontradas", async () => {
      controleAcessoService.validaAcessoServico = jest.fn().mockRejectedValue(new UsuarioNaoAutorizado());
      await controleAcessoController.controlaPermissaoOperacoes(req, res, nextFunction.next);

      expect(controleAcessoService.validaAcessoServico).toBeCalledWith(1, [1, 7, 9]);
      expect(res.status).toBeCalledWith(403);
      expect(res.send).toBeCalledWith({ message: UsuarioNaoAutorizado.mensagemErro });
    });

    it("Should be able to call exception when not able to map the error", async () => {
      const error = new Error("Qualquer que seja");
      controleAcessoService.validaAcessoServico = jest.fn().mockRejectedValue(error);
      await controleAcessoController.controlaPermissaoOperacoes(req, res, nextFunction.next);

      expect(controleAcessoService.validaAcessoServico).toBeCalledWith(1, [1, 7, 9]);
      expect(nextFunction.next).toBeCalledWith(error);
    });
  });

  describe("controlaPermissaoHorarios", () => {
    it("Should be call next function when exceptions are not thrown", async () => {
      controleAcessoService.controlaPermissaoHorarios = jest.fn().mockResolvedValue(undefined);
      await controleAcessoController.controlaPermissaoHorarios(req, res, nextFunction.next);

      expect(nextFunction.next).toBeCalledWith();
    });

    it("Should be able to call exception 'FuncionamentoFeriadoError' when the day is not valid", async () => {
      controleAcessoService.controlaPermissaoHorarios = jest.fn().mockRejectedValue(new FuncionamentoFeriadoError());
      await controleAcessoController.controlaPermissaoHorarios(req, res, nextFunction.next);

      expect(res.status).toBeCalledWith(403);
      expect(res.json).toBeCalledWith({ message: FuncionamentoFeriadoError.mensagemErro });
    });

    it("Should be able to call exception 'FuncionamentoHorarioError' when the time is not valid", async () => {
      const error = new FuncionamentoHorarioError();
      controleAcessoService.controlaPermissaoHorarios = jest.fn().mockRejectedValue(error);
      await controleAcessoController.controlaPermissaoHorarios(req, res, nextFunction.next);

      expect(res.status).toBeCalledWith(403);
      expect(res.json).toBeCalledWith({ message: FuncionamentoHorarioError.mensagemErro });
    });

    it("Should be able to call next function with Error when the exception is not mapped", async () => {
      const error = new Error("Qualquer que seja");
      controleAcessoService.controlaPermissaoHorarios = jest.fn().mockRejectedValue(error);
      await controleAcessoController.controlaPermissaoHorarios(req, res, nextFunction.next);

      expect(nextFunction.next).toBeCalledWith(error);
    });
  });
});
