import { AxiosInstance } from "axios";
import { ILog } from "../interfaces/log";
export declare class LoggerService {
    private loggerApi;
    constructor(loggerApi: AxiosInstance);
    private postLogger;
    info(log: ILog): Promise<void>;
}
