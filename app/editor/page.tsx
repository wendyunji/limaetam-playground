"use client";
import { useRef, useState } from "react";
import dynamic from "next/dynamic";

const ToastEditor = dynamic(() => import("@toast-ui/react-editor").then(m => m.Editor), { ssr: false });

export default function EditorPage() {
  const editorRef = useRef<any>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [tags, setTags] = useState("");
  const [description, setDescription] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  const onSubmit = async () => {
    setBusy(true);
    try {
      const content = editorRef.current?.getInstance().getMarkdown() || "";
      const res = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(process.env.NEXT_PUBLIC_POST_API_SECRET ? { "x-post-secret": process.env.NEXT_PUBLIC_POST_API_SECRET } : {})
        },
        body: JSON.stringify({ title, slug, tags: tags.split(",").map(t => t.trim()).filter(Boolean), description, content })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      setMsg(`Committed: ${data.path}`);
    } catch (e: any) {
      setMsg(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <main>
      <h1>글 작성</h1>
      <div style={{ display: "grid", gap: 8 }}>
        <input placeholder="제목" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input placeholder="슬러그 (예: my-first-post)" value={slug} onChange={(e) => setSlug(e.target.value)} />
        <input placeholder="태그 (쉼표로 구분)" value={tags} onChange={(e) => setTags(e.target.value)} />
        <input placeholder="설명 (선택)" value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div style={{ marginTop: 12 }}>
        <ToastEditor ref={editorRef} initialValue="" height="600px" initialEditType="markdown" useCommandShortcut={true} />
      </div>
      <button onClick={onSubmit} disabled={busy} style={{ marginTop: 12 }}>{busy ? "저장 중..." : "저장 & 커밋"}</button>
      <div style={{ marginTop: 8, color: msg.startsWith("Committed") ? "green" : "crimson" }}>{msg}</div>
    </main>
  );
}
