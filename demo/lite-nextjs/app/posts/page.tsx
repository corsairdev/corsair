"use client";

import { trpc } from "@/lib/trpc/client";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";

export default function PostsPage() {
  const { data: session } = useSession();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const utils = trpc.useUtils();
  const { data: posts, isLoading } = trpc.posts.list.useQuery();

  const createPost = trpc.posts.create.useMutation({
    onSuccess: () => {
      utils.posts.list.invalidate();
      setTitle("");
      setContent("");
    },
  });

  const toggleLike = trpc.posts.toggleLike.useMutation({
    onSuccess: () => {
      utils.posts.list.invalidate();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    createPost.mutate({ title, content, published: true });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="border-b bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              Next.js Lite
            </Link>
            {session && (
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {session.user.email}
              </span>
            )}
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Posts</h1>

        {session && (
          <div className="mt-8 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Create a Post</h2>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Title
                </label>
                <input
                  id="title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label htmlFor="content" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Content
                </label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  required
                  rows={4}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <button
                type="submit"
                disabled={createPost.isPending}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
              >
                {createPost.isPending ? "Creating..." : "Create Post"}
              </button>
            </form>
          </div>
        )}

        <div className="mt-8 space-y-6">
          {posts?.map((post) => (
            <div key={post.id} className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{post.title}</h3>
              <p className="mt-2 text-gray-600 dark:text-gray-300">{post.content}</p>
              <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                <span>By {post.author.name}</span>
                <span>•</span>
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span>•</span>
                <span>{post.comments.length} comments</span>
                <span>•</span>
                <button
                  onClick={() => session && toggleLike.mutate({ postId: post.id })}
                  disabled={!session || toggleLike.isPending}
                  className="flex items-center gap-1 hover:text-red-500 disabled:opacity-50"
                >
                  <span>{post.likes.length} likes</span>
                  {session && post.likes.some(like => like.userId === session.user.id) && " ❤️"}
                </button>
              </div>
              <Link
                href={`/posts/${post.id}`}
                className="mt-4 inline-block text-blue-600 hover:text-blue-500"
              >
                View details →
              </Link>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
