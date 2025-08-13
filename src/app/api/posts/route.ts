import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import GitHubProvider from 'next-auth/providers/github';
import { createPost } from '@/lib/posts';
import { GitManager } from '@/lib/git';
import { PostMetadata } from '@/types/post';

const authOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: 'read:user user:email repo'
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, account }: { token: any; account: any }) {
      if (account) {
        token.accessToken = account.access_token
      }
      return token
    },
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken as string
      return session
    }
  },
  pages: {
    signIn: '/auth/signin',
  }
};

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { metadata, content, repository }: { 
      metadata: PostMetadata; 
      content: string;
      repository?: string;
    } = await request.json();

    if (!metadata.title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    if (!repository) {
      return NextResponse.json(
        { error: 'Repository selection required' },
        { status: 400 }
      );
    }

    // Create the post file locally
    const slug = createPost(metadata, content);

    // Parse repository (format: "owner/repo")
    const [owner, repo] = repository.split('/');
    
    if (!owner || !repo) {
      return NextResponse.json(
        { error: 'Invalid repository format' },
        { status: 400 }
      );
    }

    // Initialize Git manager with user's token
    const gitManager = new GitManager({ 
      owner, 
      repo, 
      token: session.accessToken 
    });

    // Create the full markdown content
    const frontMatter = `---
title: "${metadata.title}"
date: "${metadata.date}"
excerpt: "${metadata.excerpt}"
${metadata.tags ? `tags: [${metadata.tags.map(tag => `"${tag}"`).join(', ')}]` : ''}
${metadata.author ? `author: "${metadata.author}"` : ''}
${metadata.coverImage ? `coverImage: "${metadata.coverImage}"` : ''}
---

${content}`;

    // Commit to user's repository
    const result = await gitManager.commitPost(
      slug, 
      metadata.title, 
      frontMatter,
      session.user?.name || undefined
    );

    if (!result.success) {
      return NextResponse.json(
        { error: `Git commit failed: ${result.error}` },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      slug, 
      success: true, 
      commitUrl: result.commitUrl,
      repository: repository
    });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}