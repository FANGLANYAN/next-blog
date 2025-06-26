"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getArticleById, deleteArticle, updateArticle } from "@/lib/service/articleService";
import type { Article } from "@/lib/supabase/constant";
import SimpleMDE from "@/components/business/SimpleIMDE";

export default function ArticleDetailPage() {
    const router = useRouter();
    const params = useParams();
    const articleId = Number(params.id);
    const catId = Number(params.cat_id);

    const [article, setArticle] = useState<Article | null>(null);
    const [isEditing, setIsEditing] = useState(false);

    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [fileUrl, setFileUrl] = useState("");

    useEffect(() => {
        if (!articleId) return;
        getArticleById(articleId).then((data) => {
            setArticle(data);
            setTitle(data?.title || "");
            setContent(data?.content || "");
            setFileUrl(data?.file_url || "");
        });
    }, [articleId]);

    const handleDelete = async () => {
        if (!article) return;
        if (confirm("Are you sure you want to delete this article?")) {
            await deleteArticle(article.id);
            router.push(`/categories/${catId}`);
        }
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!article) return;

        const updated: Omit<Article, "id" | "created_at"> = {
            title,
            content,
            file_url: fileUrl,
            updated_at: new Date().toISOString(),
            view_count: article.view_count,
            cat_id: article.cat_id,
        };

        await updateArticle(article.id, updated);
        setIsEditing(false);
        setArticle({ ...article, ...updated });
    };

    if (!article) return <div className="p-6">Loading...</div>;

    return (
        <div className="max-w-3xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">文章详情</h1>
                <div className="flex gap-4">
                    <button onClick={() => setIsEditing((prev) => !prev)} className="text-blue-600 hover:underline">
                        {isEditing ? "取消编辑" : "编辑文章"}
                    </button>
                    {/* <button onClick={handleDelete} className="text-red-600 hover:underline">
                        删除文章
                    </button> */}
                </div>
            </div>

            {!isEditing && (
                <div className="bg-white p-5 rounded-lg shadow">
                    <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                    <div className="prose text-gray-700 mb-4 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: article.content }}></div>
                    {article.file_url && <img src={article.file_url} alt="attachment" className="max-w-full rounded" />}
                    <p className="text-sm text-gray-400 mt-4">更新日期：{article.updated_at}</p>
                </div>
            )}

            {isEditing && (
                <form onSubmit={handleUpdate} className="grid gap-4 mt-4 bg-white p-5 rounded-lg shadow">
                    <input className="border px-3 py-2 rounded" placeholder="标题" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <SimpleMDE value={content} onChange={setContent} />
                    <input className="border px-3 py-2 rounded" placeholder="文件 URL" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} />
                    <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700 mt-2">
                        保存修改
                    </button>
                </form>
            )}
        </div>
    );
}
