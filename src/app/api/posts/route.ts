import { NextRequest, NextResponse } from 'next/server';
import { createPost } from '@/lib/posts';
import { GitManager } from '@/lib/git';
import { PostMetadata } from '@/types/post';

export async function POST(request: NextRequest) {
  try {
    const { metadata, content }: { metadata: PostMetadata; content: string } = await request.json();

    if (!metadata.title || !content) {
      return NextResponse.json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    // Create the post file
    const slug = createPost(metadata, content);

    // Initialize Git manager if environment variables are provided
    const owner = process.env.GITHUB_OWNER;
    const repo = process.env.GITHUB_REPO;
    const token = process.env.GITHUB_TOKEN;

    if (owner && repo && token) {
      const gitManager = new GitManager({ owner, repo, token });
      const result = await gitManager.commitPost(slug, metadata.title);
      
      if (!result.success) {
        console.error('Git commit failed:', result.error);
        // Continue anyway - the post is still created locally
      }
    } else {
      console.log('GitHub configuration not found, skipping auto-commit');
    }

    return NextResponse.json({ slug, success: true });
  } catch (error) {
    console.error('Error creating post:', error);
    return NextResponse.json(
      { error: 'Failed to create post' },
      { status: 500 }
    );
  }
}