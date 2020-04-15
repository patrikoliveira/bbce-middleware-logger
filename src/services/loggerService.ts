import { Service, Inject } from "typedi";
import { AxiosInstance } from "axios";
import { Log } from "../interfaces/log";

@Service("loggerService")
export class LoggerService {
  private loggerApi: AxiosInstance;

  constructor(@Inject("loggerAPI") loggerApi: AxiosInstance) {
    this.loggerApi = loggerApi;
  }

  private async postLogger(log: Log): Promise<Response> {
    return await this.loggerApi.post("/logger", log);
  }

  async info(log: Log): Promise<void> {
    await this.postLogger(log);
  }
}
