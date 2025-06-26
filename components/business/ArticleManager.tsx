"use client";
import { useEffect, useState, MouseEvent } from "react";
import Link from "next/link";
import { createArticle, updateArticle, deleteArticle } from "@/lib/service/articleService";
import type { Article } from "@/lib/supabase/constant";

interface Props {
    catId: number;
    initialArticles: Article[]; // 接收父组件传递的初始数据
}

export default function ArticleManager({ catId, initialArticles }: Props) {
    const [articles, setArticles] = useState<Article[]>(initialArticles); // 使用传递过来的初始数据
    const [catName, setCatName] = useState<string>("");
    const [form, setForm] = useState<Omit<Article, "id" | "created_at">>({
        title: "",
        content: "",
        updated_at: new Date().toISOString().split("T")[0],
        view_count: 0,
        file_url: "",
        cat_id: catId,
    });
    const [editId, setEditId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);

    // 只在初始化时设置分类名称
    useEffect(() => {
        // 这里只需要设置分类名称一次，如果传递了cat_name的话
        // 如果你是想在父组件中处理分类数据并传递到这里，确保已传递数据正确
        setCatName(`Category ${catId}`);
    }, [catId]);

    // 提交表单（创建或更新文章）
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (editId) {
            await updateArticle(editId, form);
        } else {
            await createArticle(form);
        }
        resetForm();
        setShowForm(false);
    }

    // 重置表单
    function resetForm() {
        setEditId(null);
        setForm({
            title: "",
            content: "",
            updated_at: new Date().toISOString().split("T")[0],
            view_count: 0,
            file_url: "",
            cat_id: catId,
        });
    }

    // 编辑文章
    function handleEdit(article: Article) {
        setEditId(article.id);
        setForm({ ...article });
        setShowForm(true);
    }

    // 删除文章
    async function handleDelete(id: number) {
        if (confirm("Are you sure you want to delete this article?")) {
            await deleteArticle(id);
            setArticles((prev) => prev.filter((article) => article.id !== id)); // 删除本地数据
        }
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">分类名称：{catName}</h2>
                <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg">
                    + Add Article
                </button>
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
                    <div className="bg-white w-full max-w-2xl p-6 rounded-xl shadow-lg relative">
                        <button
                            onClick={() => {
                                setShowForm(false);
                                resetForm();
                            }}
                            className="absolute top-3 right-4 text-gray-500 hover:text-black text-xl"
                        >
                            ×
                        </button>
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800">{editId ? "Edit Article" : "Add Article"}</h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                            <input className="border border-gray-300 rounded-lg px-4 py-2" placeholder="Title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
                            <input
                                className="border border-gray-300 rounded-lg px-4 py-2"
                                placeholder="File URL"
                                value={form.file_url || ""}
                                onChange={(e) => setForm((f) => ({ ...f, file_url: e.target.value }))}
                            />
                            <div className="flex gap-4 mt-2">
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg">
                                    {editId ? "Update" : "Create"}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        resetForm();
                                    }}
                                    className="text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {articles.map((article) => (
                    <div key={article.id} className="bg-white shadow-sm p-5 rounded-xl hover:shadow-md transition flex flex-col justify-between">
                        <Link href={`/categories/${catId}/${article.id}`} className="text-green-600 hover:underline flex-1">
                            <p className="text-xs text-gray-400">ID: {article.id}</p>
                            <p className="text-lg font-bold text-gray-900 mb-1">{article.title}</p>
                        </Link>
                        <div className="w-full flex flex-wrap justify-end gap-3 mt-4">
                            <button
                                onClick={(e: MouseEvent) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleEdit(article);
                                }}
                                className="text-blue-500 hover:underline"
                            >
                                Edit
                            </button>
                            <button
                                onClick={(e: MouseEvent) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    handleDelete(article.id);
                                }}
                                className="text-red-500 hover:underline"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
