"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentDatePlusWeek = void 0;
const getCurrentDatePlusWeek = () => {
    const currentDate = new Date();
    return new Date(currentDate.getTime() + 12 * 60 * 60 * 1000);
};
exports.getCurrentDatePlusWeek = getCurrentDatePlusWeek;
