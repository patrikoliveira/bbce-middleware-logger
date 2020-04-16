import { Request, Response, NextFunction } from "express";
import onFinished from "on-finished";
import { Service, Inject } from "typedi";
import { uuid } from "uuidv4";
import axios, { AxiosInstance } from "axios";
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

  async registrarLog(req: Request, res: Response, next: NextFunction): Promise<Response> {
    const { method } = req;
    console.log(this.getPayload(req));
    if (method !== "GET") {
      const log = this.getPayload(req);

      try {
        await this.loggerService.info(log);

        onFinished(res, (err, response: Response) => {
          log.statusCode = response.statusCode;
          log.timestamp = new Date().getTime();

          this.loggerService.info(log);
        });
        next();
      } catch (error) {
        return res.status(504).json({ error: { message: error.message, name: error.name, code: error.code } });
      }
    }
  }
}

@Service()
export class LoggerMiddlewareFactory {
  static create(baseUrl: string): LoggerMiddleware {
    const loggerApi = axios.create({
      baseURL: baseUrl,
    });
    const loggerService = new LoggerService(loggerApi);

    return new LoggerMiddleware(loggerService);
  }

  static createWithAPI(@Inject("loggerAPI") loggerApi: AxiosInstance): LoggerMiddleware {
    const _loggerApi: AxiosInstance = loggerApi;

    const loggerService = new LoggerService(_loggerApi);

    return new LoggerMiddleware(loggerService);
  }
}
