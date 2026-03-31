import { supabase } from "@/lib/supabase";

export async function saveTransaction(transaction) {
  const { data, error } = await supabase
    .from("transactions")
    .insert([transaction])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getTransactionsByDate(date, userId) {
  const { data, error } = await supabase
    .from("transactions")
    .select("*, categories(name, color)")
    .eq("user_id", userId)
    .eq("date", date)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data;
}

export async function getTransactionsByWeek(startDate, endDate, userId) {
  const { data, error } = await supabase
    .from("transactions")
    .select("*, categories(name, color)")
    .eq("user_id", userId)
    .gte("date", startDate)
    .lte("date", endDate)
    .order("date", { ascending: true });
  if (error) throw error;
  return data;
}

export async function getTransactionsByMonth(year, month, userId) {
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const end = new Date(year, month, 0).toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("transactions")
    .select("*, categories(name, color)")
    .eq("user_id", userId)
    .gte("date", start)
    .lte("date", end)
    .order("date", { ascending: false });
  if (error) throw error;
  return data;
}

export async function updateTransaction(id, updates) {
  const { data, error } = await supabase
    .from("transactions")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTransaction(id) {
  const { error } = await supabase.from("transactions").delete().eq("id", id);
  if (error) throw error;
}
