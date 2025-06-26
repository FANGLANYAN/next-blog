"use client";

import { useState } from "react";
import Link from "next/link";
import { createCategory, deleteCategory, updateCategory, getAllCategories } from "@/lib/service/categoryService";
import type { Category } from "@/lib/supabase/constant";

export default function CategoryManager({ initialCategories }: { initialCategories: Category[] }) {
    console.log(initialCategories, "initialCategories");
    const [categories, setCategories] = useState(initialCategories);
    const [form, setForm] = useState<Omit<Category, "id" | "created_at">>({
        cat_name: "",
        introduction: "",
        icon_path: "",
    });
    const [editId, setEditId] = useState<number | null>(null);
    const [showForm, setShowForm] = useState(false);

    async function fetchCategories() {
        const data = await getAllCategories();
        setCategories(data);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (editId) {
            await updateCategory(editId, form);
        } else {
            await createCategory(form);
        }
        resetForm();
        fetchCategories();
        setShowForm(false);
    }

    function resetForm() {
        setEditId(null);
        setForm({ cat_name: "", introduction: "", icon_path: "" });
    }

    function handleEdit(cat: Category) {
        setEditId(cat.id);
        setForm({
            cat_name: cat.cat_name,
            introduction: cat.introduction,
            icon_path: cat.icon_path,
        });
        setShowForm(true);
    }

    async function handleDelete(id: number) {
        if (confirm("Are you sure you want to delete this category?")) {
            await deleteCategory(id);
            fetchCategories();
        }
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Category Manager</h2>
                <button onClick={() => setShowForm(true)} className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-lg">
                    + Add Category
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
                        <h3 className="text-2xl font-semibold mb-4 text-gray-800">{editId ? "Edit Category" : "Add Category"}</h3>
                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                            <input
                                className="border border-gray-300 rounded-lg px-4 py-2"
                                placeholder="Category Name"
                                value={form.cat_name}
                                onChange={(e) => setForm((f) => ({ ...f, cat_name: e.target.value }))}
                            />
                            <input
                                className="border border-gray-300 rounded-lg px-4 py-2"
                                placeholder="Icon URL"
                                value={form.icon_path}
                                onChange={(e) => setForm((f) => ({ ...f, icon_path: e.target.value }))}
                            />
                            <textarea
                                className="border border-gray-300 rounded-lg px-4 py-2"
                                placeholder="Introduction"
                                rows={3}
                                value={form.introduction}
                                onChange={(e) => setForm((f) => ({ ...f, introduction: e.target.value }))}
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

            <h3 className="text-2xl font-semibold mb-4 text-gray-800">Category List</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-white shadow-sm p-5 rounded-xl hover:shadow-md transition flex flex-col justify-between">
                        <Link href={`/categories/${cat.id}`} className="text-green-600 hover:underline flex-1">
                            <p className="text-xs text-gray-400">ID: {cat.id}</p>
                            <p className="text-lg font-bold text-gray-900 mb-1">{cat.cat_name}</p>
                            <p className="text-sm text-gray-600 mb-2">{cat.introduction}</p>
                        </Link>
                        <div className="w-full flex flex-wrap justify-end gap-3 mt-4">
                            <button className="text-blue-500 hover:underline" onClick={() => handleEdit(cat)}>
                                Edit
                            </button>
                            <button className="text-red-500 hover:underline" onClick={() => handleDelete(cat.id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
