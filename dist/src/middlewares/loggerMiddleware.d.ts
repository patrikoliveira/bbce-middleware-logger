import { Request, Response, NextFunction } from "express";
import { LoggerService } from "../services/loggerService";
export declare class LoggerMiddleware {
    private loggerService;
    constructor(loggerService: LoggerService);
    private getPayload;
    registrarLog(req: Request, res: Response, next: NextFunction): Promise<void>;
}
export declare class LoggerMiddlewareFactory {
    static create(baseUrl: string): LoggerMiddleware;
}
