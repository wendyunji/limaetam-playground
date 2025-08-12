import PostList from '@/components/PostList';
import { getAllPosts } from '@/lib/posts';

export default function Home() {
  const posts = getAllPosts();

  return <PostList posts={posts} />;
}
