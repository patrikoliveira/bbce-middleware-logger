import { Request, Response, NextFunction } from "express";
import onFinished from "on-finished";
import { Service, Inject } from "typedi";
import { uuid } from "uuidv4";
import { LoggerService } from "../services/loggerService";
import { Log } from "../interfaces/log";

@Service("loggerMiddleware")
export class LoggerMiddleware {
  private loggerService: LoggerService;

  constructor(@Inject("loggerService") loggerService: LoggerService) {
    this.loggerService = loggerService;
  }

  private getPayload(req: Request): Log {
    const body = req.body;
    const { method } = req;

    return {
      timestamp: new Date().getTime(),
      userId: Number(req.get("user-id")),
      httpMethod: method,
      httpUrl: req.path,
      requestBody: JSON.stringify(body),
      statusCode: 102,
      requestId: uuid(),
    };
  }

  async registrarLog(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { method } = req;

    if (method !== "GET") {
      const log = this.getPayload(req);

      await this.loggerService.info(log);

      onFinished(res, (err, response: Response) => {
        log.statusCode = response.statusCode;
        log.timestamp = new Date().getTime();

        this.loggerService.info(log);
      });
    }
    next();
  }
}
