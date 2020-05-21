// eslint-disable-next-line max-classes-per-file
import { Request, Response, NextFunction } from "express";
import onFinished from "on-finished";
import { Service, Inject } from "typedi";
import { uuid } from "uuidv4";
import axios, { AxiosInstance } from "axios";
import { LoggerService } from "../services/loggerService";
import { ILog } from "../interfaces/log";

@Service("loggerMiddleware")
export class LoggerMiddleware {
  private loggerService: LoggerService;

  constructor(loggerService: LoggerService) {
    this.loggerService = loggerService;
  }

  private getPayload(req: Request): ILog {
    const { body } = req;
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

  public async registrarLog(req: Request, res: Response, next: NextFunction): Promise<void> {
    const { method } = req;

    if (method !== "GET") {
      const log = this.getPayload(req);

      try {
        await this.loggerService.info(log);

        onFinished(res, (err, response: Response) => {
          log.statusCode = response.statusCode;
          log.timestamp = new Date().getTime();

          this.loggerService.info(log);
        });
      } catch (error) {
        res.status(504).json({ error: { message: error.message, name: error.name, code: error.code } });
      }
    }
    next();
  }
}

export class LoggerMiddlewareFactory {
  static create(baseUrl: string): LoggerMiddleware {
    const loggerApi = axios.create({
      baseURL: baseUrl,
    });
    const loggerService = new LoggerService(loggerApi);

    return new LoggerMiddleware(loggerService);
  }

  static createWithAPI(@Inject("loggerAPI") loggerApi: AxiosInstance): LoggerMiddleware {
    // eslint-disable-next-line no-underscore-dangle
    const _loggerApi: AxiosInstance = loggerApi;

    const loggerService = new LoggerService(_loggerApi);

    return new LoggerMiddleware(loggerService);
  }
}
