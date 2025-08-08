export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body style={{ maxWidth: 840, margin: "0 auto", padding: 24, fontFamily: "ui-sans-serif, system-ui" }}>
        <header style={{ display: "flex", gap: 16, alignItems: "center", marginBottom: 24 }}>
          <a href="/">홈</a>
          <a href="/editor">글쓰기</a>
        </header>
        {children}
      </body>
    </html>
  );
}
