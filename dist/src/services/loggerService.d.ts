import { AxiosInstance } from "axios";
import { Log } from "../interfaces/log";
export declare class LoggerService {
    private loggerApi;
    constructor(loggerApi: AxiosInstance);
    private postLogger;
    info(log: Log): Promise<void>;
}
