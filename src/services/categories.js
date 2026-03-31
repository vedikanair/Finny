import { supabase } from "@/lib/supabase";

export async function getCategories(userId) {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("user_id", userId)
    .order("name");
  if (error) throw error;
  return data;
}

export async function createCategory(category) {
  const { data, error } = await supabase
    .from("categories")
    .insert([category])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id, updates) {
  const { data, error } = await supabase
    .from("categories")
    .update(updates)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id) {
  const { error } = await supabase.from("categories").delete().eq("id", id);
  if (error) throw error;
}
