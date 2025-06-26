"use client";
import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";
import { useMemo } from "react";

const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
    ssr: false,
});

export default function MarkdownEditor({ value, onChange }: { value: string; onChange: (val: string) => void }) {
    const options = useMemo(() => {
        return {
            spellChecker: false,
            placeholder: "请输入文章内容...",
            autofocus: true,
            minHeight: "200px",
            maxHeight: "500px",
            status: false,
        };
    }, []);

    return <SimpleMDE value={value} onChange={onChange} options={options} />;
}
