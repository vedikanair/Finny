import { supabase } from "@/lib/supabase";

export async function savePushSubscription(userId, subscription) {
  const { error } = await supabase
    .from("push_subscriptions")
    .upsert({ user_id: userId, subscription: JSON.stringify(subscription) });
  if (error) throw error;
}

export async function checkTodayLogged(userId) {
  const today = new Date().toISOString().split("T")[0];
  const { count, error } = await supabase
    .from("transactions")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("date", today);
  if (error) throw error;
  return count > 0;
}
