export const getCurrentDatePlusWeek = () => {
  const currentDate = new Date();
  return new Date(currentDate.getTime() + 12 * 60 * 60 * 1000);
};
