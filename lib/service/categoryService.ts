import { createClient } from "../supabase/client";
// import { supabase } from "../supabase/server";
import { Category } from "../supabase/constant";

// 获取全部分类
export async function getAllCategories(): Promise<Category[]> {
    const supabase = createClient();
    const { data, error } = await supabase.from("categories").select("*").order("created_at", { ascending: false });

    if (error) throw error;
    return data as Category[];
}

// 获取指定分类
export async function getCategoryById(id: number): Promise<Category | null> {
    const supabase = createClient();
    const { data, error } = await supabase.from("categories").select("*").eq("id", id).single();

    if (error) throw error;
    return data;
}

// 创建分类
export async function createCategory(category: Omit<Category, "id" | "created_at">) {
    const supabase = createClient();
    const { data, error } = await supabase.from("categories").insert([category]).select().single();

    if (error) throw error;
    return data;
}

// 更新分类
export async function updateCategory(id: number, updates: Partial<Category>) {
    const supabase = createClient();
    const { data, error } = await supabase.from("categories").update(updates).eq("id", id).select().single();

    if (error) throw error;
    return data;
}

// 删除分类
export async function deleteCategory(id: number) {
    const supabase = createClient();
    const { error } = await supabase.from("categories").delete().eq("id", id);

    if (error) throw error;
    return true;
}
