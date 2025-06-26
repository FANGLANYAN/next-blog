import ArticleManager from "@/components/business/ArticleManager";

interface Props {
    params: { cat_id: string }; // 参数名必须和文件夹名一致
}

export default function CategoryDetailPage({ params }: Props) {
    const catId = Number(params.cat_id); // string → number

    return (
        <main className="max-w-4xl mx-auto p-6">
            {/* <h1 className="text-3xl font-bold mb-4">分类 #{catId} 的文章管理</h1> */}
            <ArticleManager catId={catId} />
        </main>
    );
}
