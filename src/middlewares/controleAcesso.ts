/* eslint-disable max-classes-per-file */
import { Inject, Service } from "typedi";
import { Request, Response, NextFunction } from "express";
import axios from "axios";

import PermissoesApi from "../clients/permissoesApi";
import FuncionamentoBBCEApi from "../clients/funcionamentoBBCEApi";
import ControleAcessoService from "../services/controleAcessoService";
import { PermissoesNaoEncontradas, UsuarioNaoAutorizado } from "../errors/userError";
import { FuncionamentoFeriadoError, FuncionamentoHorarioError } from "../errors/funcionamentoErrors";

export interface IScoppedRequest extends Request {
  requiredScopes: string[];
  validScopes?: number[];
}

@Service("controleAcesso")
export class ControleAcesso {
  constructor(@Inject("controleAcessoService") private controleAcessoService: ControleAcessoService) {}

  async controlaPermissaoOperacoes(req: IScoppedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // TODO: pegar posteriormente o userId e escopos do JWT
      const userId = Number(req.get("user-id"));
      const escopoValidacao = req.requiredScopes.map(scope => Number(scope));

      // define match dos serviços permitidos dos usuários com o escopo permitido da operação
      const sevicosValidados = await this.controleAcessoService.validaAcessoServico(userId, escopoValidacao);

      req.validScopes = sevicosValidados;
      next();
    } catch (error) {
      if (error instanceof PermissoesNaoEncontradas || error instanceof UsuarioNaoAutorizado) {
        res.status(403).send({ message: error.message });
      } else {
        next(error);
      }
    }
  }

  async controlaPermissaoHorarios(req: IScoppedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      // TODO: pegar posteriormente o userId e escopos do JWT
      const userId = Number(req.get("user-id"));
      const escopoValidacao = req.requiredScopes.map(scope => Number(scope));
      const data = new Date();

      await this.controleAcessoService.controlaPermissaoHorarios(data, userId, escopoValidacao);
      next();
    } catch (error) {
      if (error instanceof FuncionamentoFeriadoError || error instanceof FuncionamentoHorarioError) {
        res.status(403).json({ message: error.message });
      } else {
        next(error);
      }
    }
  }
}

export class ControleAcessoFactory {
  static create(urlPermissaoService: string, urlFuncionamentoBBCEService: string): ControleAcesso {
    const apiPermissaoAxios = axios.create({
      baseURL: urlPermissaoService,
    });

    const apiFuncionamentoBBCEAxio = axios.create({
      baseURL: urlFuncionamentoBBCEService,
    });

    const permissoesApi = new PermissoesApi(apiPermissaoAxios);
    const funcionamentoBBCEApi = new FuncionamentoBBCEApi(apiFuncionamentoBBCEAxio);
    const controleAcessoService = new ControleAcessoService(permissoesApi, funcionamentoBBCEApi);

    return new ControleAcesso(controleAcessoService);
  }
}
