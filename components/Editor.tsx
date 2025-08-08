"use client";
import dynamic from "next/dynamic";
import { useRef } from "react";
// dynamic import to avoid SSR issues
const ToastEditor = dynamic(() => import("@toast-ui/react-editor").then(m => m.Editor), { ssr: false });

export default function Editor({ initialValue = "" }: { initialValue?: string }) {
  const ref = useRef<any>(null);
  return <ToastEditor ref={ref} initialValue={initialValue} height="600px" initialEditType="markdown" useCommandShortcut={true} />;
}
