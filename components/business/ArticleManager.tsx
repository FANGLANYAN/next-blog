"use client";
import { useEffect, useState, MouseEvent } from "react";
import Link from "next/link";
import { getArticlesByCategory, createArticle, updateArticle, deleteArticle } from "@/lib/service/articleService";
import type { Article } from "@/lib/supabase/constant";

interface Props {
    catId: number;
}

export default function ArticleManager({ catId }: Props) {
    const [articles, setArticles] = useState<Article[]>([]);
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

    useEffect(() => {
        fetchArticles();
    }, [catId]);

    async function fetchArticles() {
        const { cat_name, articles } = await getArticlesByCategory(catId);
        setCatName(cat_name);
        setArticles(articles);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (editId) {
            await updateArticle(editId, form);
        } else {
            await createArticle(form);
        }
        resetForm();
        fetchArticles();
        setShowForm(false);
    }

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

    function handleEdit(article: Article) {
        setEditId(article.id);
        setForm({ ...article });
        setShowForm(true);
    }

    async function handleDelete(id: number) {
        if (confirm("Are you sure you want to delete this article?")) {
            await deleteArticle(id);
            fetchArticles();
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
                            {/* <textarea
                                className="border border-gray-300 rounded-lg px-4 py-2"
                                placeholder="Content"
                                rows={4}
                                value={form.content}
                                onChange={(e) => setForm((f) => ({ ...f, content: e.target.value }))}
                            /> */}
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
                    <Link key={article.id} href={`/categories/${catId}/${article.id}`} className="bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition flex flex-col justify-between">
                        <div className="flex-1">
                            <h4 className="text-lg font-bold text-gray-900 mb-2 truncate">{article.title}</h4>
                            {/* <p className="text-sm text-gray-600 line-clamp-3 mb-3">{article.content}</p> */}
                        </div>
                        <div className="w-full justify-end flex flex-wrap gap-3 mt-4">
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
                    </Link>
                ))}
            </div>
        </div>
    );
}
