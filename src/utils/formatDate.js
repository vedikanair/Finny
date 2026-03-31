export function toDateString(date = new Date()) {
  return date.toISOString().split("T")[0];
}

export function getTodayString() {
  return toDateString(new Date());
}

export function getWeekRange() {
  const end = new Date();
  const start = new Date();
  start.setDate(end.getDate() - 6);
  return { startDate: toDateString(start), endDate: toDateString(end) };
}

export function getMonthRange(year, month) {
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const end = new Date(year, month, 0).toISOString().split("T")[0];
  return { start, end };
}

export function formatDisplayDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
