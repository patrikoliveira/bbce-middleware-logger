import { FindConditions } from "typeorm";
import { DiaSemanaEnum } from "../clients/IFuncionamentoBBCEApi";
export declare function removeUndefinedKey<T>(filter?: FindConditions<T>): FindConditions<T>;
export declare function getDateFormatFromDate(date: Date): string;
export declare function isDateInIntervalTime(date: Date, startTime: string, endTime: string): boolean;
export declare function getDayOfTheWeekFromDate(date: Date): DiaSemanaEnum;
