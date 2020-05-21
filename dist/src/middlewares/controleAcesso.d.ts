import { Request, Response, NextFunction } from "express";
import ControleAcessoService from "../services/controleAcessoService";
export interface IScoppedRequest extends Request {
    requiredScopes: string[];
    validScopes?: number[];
}
export declare class ControleAcesso {
    private controleAcessoService;
    constructor(controleAcessoService: ControleAcessoService);
    controlaPermissaoOperacoes(req: IScoppedRequest, res: Response, next: NextFunction): Promise<void>;
    controlaPermissaoHorarios(req: IScoppedRequest, res: Response, next: NextFunction): Promise<void>;
}
export declare class ControleAcessoFactory {
    static create(urlPermissaoService: string, urlFuncionamentoBBCEService: string): ControleAcesso;
}
