import { getTransactionsByWeek, getTransactionsByMonth } from "./transactions";

export async function getWeeklyTotals(userId) {
  const today = new Date();
  const start = new Date(today);
  start.setDate(today.getDate() - 6);

  const startDate = start.toISOString().split("T")[0];
  const endDate = today.toISOString().split("T")[0];

  const transactions = await getTransactionsByWeek(startDate, endDate, userId);

  const dailyMap = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    dailyMap[key] = { date: key, expense: 0, income: 0 };
  }

  transactions.forEach((t) => {
    if (dailyMap[t.date]) {
      dailyMap[t.date][t.type] += t.amount;
    }
  });

  return Object.values(dailyMap);
}

export async function getMonthlyTotals(year, month, userId) {
  const transactions = await getTransactionsByMonth(year, month, userId);

  const totals = { income: 0, expense: 0, byCategory: {} };

  transactions.forEach((t) => {
    totals[t.type] += t.amount;
    const catName = t.categories?.name || "Other";
    const catColor = t.categories?.color || "#888";
    if (!totals.byCategory[catName]) {
      totals.byCategory[catName] = { total: 0, color: catColor, count: 0 };
    }
    totals.byCategory[catName].total += t.amount;
    totals.byCategory[catName].count += 1;
  });

  totals.net = totals.income - totals.expense;
  return totals;
}
