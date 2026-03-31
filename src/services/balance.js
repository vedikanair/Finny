import { supabase } from "@/lib/supabase";

export async function getBalance(userId) {
  const { data, error } = await supabase
    .from("balances")
    .select("*")
    .eq("user_id", userId)
    .single();
  if (error && error.code !== "PGRST116") throw error;
  return data;
}

export async function setBalance(userId, amount) {
  const { data, error } = await supabase
    .from("balances")
    .upsert({
      user_id: userId,
      current_balance: amount,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function adjustBalance(userId, amount, type) {
  const current = await getBalance(userId);
  const currentAmount = current?.current_balance || 0;
  const newAmount =
    type === "income" ? currentAmount + amount : currentAmount - amount;
  return setBalance(userId, newAmount);
}
