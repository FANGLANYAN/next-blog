import { createClient } from "../supabase/client";
import { Article, ArticleWithCategory } from "../supabase/constant";

// 获取全部文章
export async function getAllArticles(): Promise<Article[]> {
    const supabase = createClient();
    const { data, error } = await supabase.from("article").select("*").order("created_at", { ascending: false });

    if (error) throw error;
    return data as Article[];
}

// export async function getArticlesByCategory(catId: number): Promise<{
//     cat_name: string;
//     articles: Article[];
// }> {
//     const [catRes, articleRes] = await Promise.all([
//         supabase.from("categories").select("cat_name").eq("id", catId).single(),
//         supabase.from("article").select("*").eq("cat_id", catId).order("created_at", { ascending: false }),
//     ]);
//     if (catRes.error) throw catRes.error;
//     if (articleRes.error) throw articleRes.error;

//     return {
//         cat_name: catRes.data.cat_name,
//         articles: articleRes.data,
//     };
// }
// 获取指定分类下的文章
export async function getArticlesByCategory(catId: number): Promise<Article[]> {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("article")
        .select("*")
        .eq("cat_id", catId) // 按分类 ID 查询文章
        .order("created_at", { ascending: false }); // 按创建时间排序

    if (error) throw error;

    return data as Article[];
}

// 获取指定文章
export async function getArticleById(id: number): Promise<ArticleWithCategory | null> {
    const supabase = createClient();
    const { data, error } = await supabase
        .from("article")
        .select(
            `
      *,
      category:categories (
        cat_name
      )
    `
        )
        .eq("id", id)
        .single();

    if (error) throw error;
    return data;
}

// 创建文章
export async function createArticle(article: Omit<Article, "id" | "created_at">) {
    const supabase = createClient();
    const { data, error } = await supabase.from("article").insert([article]).select().single();

    if (error) throw error;
    return data;
}

// 删除文章
export async function deleteArticle(id: number) {
    const supabase = createClient();
    const { error } = await supabase.from("article").delete().eq("id", id);

    if (error) throw error;
    return true;
}

// 更新文章
export async function updateArticle(id: number, updates: Partial<Article>) {
    const supabase = createClient();
    const { data, error } = await supabase.from("article").update(updates).eq("id", id).select().single();

    if (error) throw error;
    return data;
}
