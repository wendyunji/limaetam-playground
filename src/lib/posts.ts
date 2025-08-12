import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { marked } from 'marked';
import { Post, PostMetadata } from '@/types/post';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export function getPostSlugs() {
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }
  return fs.readdirSync(postsDirectory);
}

export function getPostBySlug(slug: string): Post {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = path.join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug: realSlug,
    title: data.title,
    date: data.date,
    excerpt: data.excerpt,
    content: marked(content) as string,
    tags: data.tags,
    author: data.author,
    coverImage: data.coverImage,
  };
}

export function getAllPosts(): Post[] {
  const slugs = getPostSlugs();
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

export function createPost(metadata: PostMetadata, content: string): string {
  const slug = metadata.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  
  const frontMatter = `---
title: "${metadata.title}"
date: "${metadata.date}"
excerpt: "${metadata.excerpt}"
${metadata.tags ? `tags: [${metadata.tags.map(tag => `"${tag}"`).join(', ')}]` : ''}
${metadata.author ? `author: "${metadata.author}"` : ''}
${metadata.coverImage ? `coverImage: "${metadata.coverImage}"` : ''}
---

${content}`;

  if (!fs.existsSync(postsDirectory)) {
    fs.mkdirSync(postsDirectory, { recursive: true });
  }

  const filePath = path.join(postsDirectory, `${slug}.md`);
  fs.writeFileSync(filePath, frontMatter);
  
  return slug;
}