import {
  removeUndefinedKey,
  getDateFormatFromDate,
  isDateInIntervalTime,
  getDayOfTheWeekFromDate,
} from "../../src/utils/utils";

describe("Util Functions", () => {
  describe("Function: removeUndefinedKey", () => {
    const object: { [k: string]: any } = {};

    it("Should return an object empty when object empty was passed", () => {
      expect(removeUndefinedKey(object)).toEqual({});
    });

    it("Should return an object without undefined properties", () => {
      object.a = 1;
      object.b = 2;
      object.c = undefined;

      const newObject = { ...object };
      delete newObject.c;
      expect(removeUndefinedKey(object)).toStrictEqual(newObject);
    });
  });

  describe("Function: getDateFormatFromDate", () => {
    it("Should return formated date string when Date object is passed", () => {
      const date = new Date();
      const day = 1;
      const month = 0;
      const year = 2000;

      date.setDate(day);
      date.setMonth(month);
      date.setFullYear(year);

      expect(getDateFormatFromDate(date)).toEqual("2000-01-01");
    });
  });

  describe("Function: isDateInIntervalTime", () => {
    it("Should return true when the past date is in the time range", () => {
      const date = new Date();
      const hour = 12;
      const minutes = 0;
      const startTime = "12:00";
      const endTime = "12:01";

      date.setHours(hour, minutes);

      expect(isDateInIntervalTime(date, startTime, endTime)).toBeTruthy();
    });

    it("Should return false when the past date isn't in the time range", () => {
      const date = new Date();
      const hour = 12;
      const minutes = 2;
      const startTime = "20:00";
      const endTime = "20:01";

      date.setHours(hour, minutes);

      expect(isDateInIntervalTime(date, startTime, endTime)).toBeFalsy();
    });
  });

  describe("Function: getDayOfTheWeekFromDate", () => {
    it("Should return DiaSemanaEnum value from Date passed", () => {
      // 04/04/2000 === sábado
      const date = new Date();
      const day = 4;
      const month = 3;
      const year = 2020;

      date.setDate(day);
      date.setMonth(month);
      date.setFullYear(year);
      expect(getDayOfTheWeekFromDate(date)).toBe("sabado");
    });
  });
});
