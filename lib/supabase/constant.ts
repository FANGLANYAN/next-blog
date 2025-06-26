export interface Article {
    id: number;
    created_at: string;
    title: string;
    content: string;
    updated_at: string | null;
    view_count: number;
    file_url: string | null;
    cat_id: number;
}

export interface Category {
    id: number;
    created_at: string;
    cat_name: string;
    introduction: string;
    icon_path: string;
}

export type ArticleWithCategory = Article & {
    category: {
        cat_name: string;
    };
};
