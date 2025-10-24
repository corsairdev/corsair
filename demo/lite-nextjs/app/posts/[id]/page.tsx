"use client";

import { trpc } from "@/lib/trpc/client";
import { useSession } from "@/lib/auth-client";
import Link from "next/link";
import { useState } from "react";
import { useParams } from "next/navigation";

export default function PostDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { data: session } = useSession();
  const [comment, setComment] = useState("");

  const utils = trpc.useUtils();
  const { data: post, isLoading } = trpc.posts.getById.useQuery({ id });

  const addComment = trpc.posts.addComment.useMutation({
    onSuccess: () => {
      utils.posts.getById.invalidate({ id });
      setComment("");
    },
  });

  const toggleLike = trpc.posts.toggleLike.useMutation({
    onSuccess: () => {
      utils.posts.getById.invalidate({ id });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;
    addComment.mutate({ postId: id, content: comment });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading post...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Post not found</p>
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
            <Link href="/posts" className="text-sm text-blue-600 hover:text-blue-500">
              ← Back to Posts
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <article className="rounded-lg bg-white p-8 shadow dark:bg-gray-800">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{post.title}</h1>
          <div className="mt-4 flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
            <span>By {post.author.name}</span>
            <span>•</span>
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
          <p className="mt-6 text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{post.content}</p>
          <div className="mt-6 flex items-center gap-4">
            <button
              onClick={() => session && toggleLike.mutate({ postId: id })}
              disabled={!session || toggleLike.isPending}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {session && post.likes.some(like => like.userId === session.user.id) ? "Unlike" : "Like"} ({post.likes.length})
            </button>
          </div>
        </article>

        <div className="mt-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Comments ({post.comments.length})
          </h2>

          {session && (
            <div className="mt-6 rounded-lg bg-white p-6 shadow dark:bg-gray-800">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Add a Comment</h3>
              <form onSubmit={handleSubmit} className="mt-4">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  required
                  rows={3}
                  placeholder="Write your comment..."
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
                />
                <button
                  type="submit"
                  disabled={addComment.isPending}
                  className="mt-4 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                >
                  {addComment.isPending ? "Posting..." : "Post Comment"}
                </button>
              </form>
            </div>
          )}

          <div className="mt-6 space-y-4">
            {post.comments.map((comment) => (
              <div key={comment.id} className="rounded-lg bg-white p-6 shadow dark:bg-gray-800">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {comment.author.name}
                  </span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="mt-2 text-gray-700 dark:text-gray-300">{comment.content}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
