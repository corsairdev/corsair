"use client";

import { useState } from "react";
import { useCorsairQuery, useCorsairMutation } from "@/corsair/client";
import { useQueryClient } from "@tanstack/react-query";

interface LatestPostProps {
  userId: string;
}

export function LatestPost({ userId }: LatestPostProps) {
  const queryClient = useQueryClient();
  const { data: latestPost } = useCorsairQuery(
    "get latest post",
    { userId },
    { enabled: !!userId },
  );

  const [name, setName] = useState("");
  const createPost = useCorsairMutation("create post");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await createPost.mutateAsync({
      name,
      createdById: userId,
    });
    await queryClient.invalidateQueries({ queryKey: ["get latest post"] });
    setName("");
  };

  return (
    <div className="w-full max-w-xs">
      {latestPost ? (
        <p className="truncate">Your most recent post: {latestPost.name}</p>
      ) : (
        <p>You have no posts yet.</p>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Title"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-full bg-white/10 px-4 py-2 text-white"
        />
        <button
          type="submit"
          className="rounded-full bg-white/10 px-10 py-3 font-semibold transition hover:bg-white/20"
          disabled={createPost.isPending}
        >
          {createPost.isPending ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
