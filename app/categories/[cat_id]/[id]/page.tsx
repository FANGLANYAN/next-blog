import { getArticleById } from "@/lib/service/articleService";
import ArticleDetail from "@/components/business/ArticleDetail";

interface Props {
    params: { cat_id: string; id: string };
}

export default async function ArticleByIdPage({ params }: Props) {
    const articleId = Number(params.id);
    const catId = Number(params.cat_id);

    const article = await getArticleById(articleId);

    return <ArticleDetail article={article} catId={catId} />;
}
