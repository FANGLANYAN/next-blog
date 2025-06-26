import { getAllCategories } from "@/lib/service/categoryService";
import CategoryManager from "@/components/business/CategoryManager";

export default async function AllCategoriesPage() {
    const categories = await getAllCategories(); // 服务端调用
    return <CategoryManager initialCategories={categories} />;
}
