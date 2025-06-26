// app/categories/[cat_id]/page.tsx
import { getArticlesByCategory } from "@/lib/service/articleService"; // 获取文章服务
import ArticleManager from "@/components/business/ArticleManager";

interface Props {
    params: { cat_id: string }; // 从 params 中获取 cat_id
}

export default async function ArticleByCategoryPage({ params }: Props) {
    const catId = Number(params.cat_id); // 转换为数字
    // 异步获取数据
    // const { cat_name, articles } = await getArticlesByCategory(catId); // 服务端获取数据
    const articles = await getArticlesByCategory(catId);
    return (
        <main className="max-w-4xl mx-auto p-6">
            <ArticleManager catId={catId} initialArticles={articles} /> {/* 传递初始数据 */}
        </main>
    );
}
