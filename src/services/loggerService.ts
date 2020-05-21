import { Service, Inject } from "typedi";
import { AxiosInstance } from "axios";
import { ILog } from "../interfaces/log";

@Service("loggerService")
// eslint-disable-next-line import/prefer-default-export
export class LoggerService {
  private loggerApi: AxiosInstance;

  constructor(@Inject("loggerAPI") loggerApi: AxiosInstance) {
    this.loggerApi = loggerApi;
  }

  private async postLogger(log: ILog): Promise<Response> {
    return this.loggerApi.post("/logger", log);
  }

  async info(log: ILog): Promise<void> {
    await this.postLogger(log);
  }
}
