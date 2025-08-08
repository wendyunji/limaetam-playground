import { NextRequest, NextResponse } from "next/server";
import { getOctokit } from "@/lib/github";

function toBase64(str: string) {
  return Buffer.from(str, "utf8").toString("base64");
}

export async function POST(req: NextRequest) {
  const secretHeader = req.headers.get("x-post-secret");
  const requiredSecret = process.env.POST_API_SECRET;
  if (requiredSecret && secretHeader !== requiredSecret) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

  const { title, slug, tags = [], description = "", content = "" } = await req.json();
  if (!title || !slug) return NextResponse.json({ error: "title and slug are required" }, { status: 400 });

  const owner = process.env.GITHUB_OWNER!;
  const repo = process.env.GITHUB_REPO!;
  const branch = process.env.GITHUB_DEFAULT_BRANCH || "main";
  const path = `posts/${slug}.md`;

  const fm = [
    `---`,
    `title: ${title.replace(/"/g, '\\"')}`,
    `date: ${new Date().toISOString()}`,
    Array.isArray(tags) ? (tags.length ? `tags: [${tags.map((t: string) => `'${t}'`).join(", ")}]` : "tags: []") : "tags: []",
    description ? `description: ${JSON.stringify(description)}` : undefined,
    `---`,
    "",
  ].filter(Boolean).join("\n");

  const finalMd = `${fm}${content}\n`;

  const octokit = getOctokit();

  // Check if file exists to decide create/update
  let sha: string | undefined;
  try {
    const existing = await octokit.repos.getContent({ owner, repo, path, ref: branch });
    if (!Array.isArray(existing.data) && "sha" in existing.data) {
      // @ts-ignore
      sha = existing.data.sha;
    }
  } catch (e) {
    // 404 → new file
  }

  const res = await octokit.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    branch,
    message: sha ? `chore: update post ${slug}` : `feat: add post ${slug}`,
    content: toBase64(finalMd),
    committer: { name: process.env.GIT_COMMITTER_NAME || "Blog Bot", email: process.env.GIT_COMMITTER_EMAIL || "bot@example.com" },
    author: { name: process.env.GIT_COMMITTER_NAME || "Blog Bot", email: process.env.GIT_COMMITTER_EMAIL || "bot@example.com" },
    sha
  });

  return NextResponse.json({ ok: true, path, commitSha: res.data.commit.sha });
}
