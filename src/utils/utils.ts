import { FindConditions } from "typeorm";
import { DiaSemanaEnum } from "../clients/IFuncionamentoBBCEApi";

export function removeUndefinedKey<T>(filter?: FindConditions<T>): FindConditions<T> {
  filter = filter || {};
  Object.keys(filter).forEach((key: string) => {
    /* eslint-disable */
    // @ts-ignore
    if (filter[key] === undefined) {
      // @ts-ignore
      delete filter[key];
    }
    /* eslint-enable */
  });
  return filter;
}

export function getDateFormatFromDate(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();

  return `${year}-${month}-${day}`;
}

export function isDateInIntervalTime(date: Date, startTime: string, endTime: string): boolean {
  const newStartDate = new Date(date);
  const newEndDate = new Date(date);

  let splittedTime = startTime.split(":");
  newStartDate.setHours(Number(splittedTime[0]), Number(splittedTime[1]));

  splittedTime = endTime.split(":");
  newEndDate.setHours(Number(splittedTime[0]), Number(splittedTime[1]));

  return newStartDate <= date && date <= newEndDate;
}

export function getDayOfTheWeekFromDate(date: Date): DiaSemanaEnum {
  const numberDayRelationship: { [index: number]: DiaSemanaEnum } = {
    0: DiaSemanaEnum.Domingo,
    1: DiaSemanaEnum.Segunda,
    2: DiaSemanaEnum.Terca,
    3: DiaSemanaEnum.Quarta,
    4: DiaSemanaEnum.Quinta,
    5: DiaSemanaEnum.Sexta,
    6: DiaSemanaEnum.Sabado,
  };

  return numberDayRelationship[date.getDay()];
}
