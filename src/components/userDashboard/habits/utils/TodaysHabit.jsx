import dayjs from "dayjs";

export const isTodayMatchingFrequency = (habit) => {
  const today = dayjs().startOf("day");
  const start = dayjs(habit.startDate).startOf("day");
  const end = dayjs(habit.endDate).startOf("day");

  if (today.isBefore(start) || today.isAfter(end)) return false;

  switch (habit.frequency) {
    case "Daily":
      return true;
    case "Weekly":
      return today.day() === start.day(); // same weekday
    case "Monthly":
      return today.date() === start.date(); // same day of month
    default:
      return false;
  }
};
export const getHabitProgress = (habit) => {
  const today = dayjs().startOf("day"); 
  const startDate = dayjs(habit.startDate).startOf("day");
  const endDate = dayjs(habit.endDate).startOf("day");

  if (today.isBefore(startDate) || today.isAfter(endDate)) {
    return 0; // Not in the range of the habit  

  }
  const totalDays = endDate.diff(startDate, "day") + 1; // Include both start and end dates
  const completedDays = habit.completedDates?.length || 0;
  const progress = (completedDays / totalDays) * 100;
  return Math.min(progress); // Ensure progress does not exceed 100%
}