"use client";

import { useCorsairQuery, useCorsairMutation } from "@/lib/corsair/client";

export function UserProfile({ userId }: { userId: string }) {
  // QUERY: Automatically cached, refetches on window focus, etc.
  const {
    data: user,
    isLoading,
    error,
  } = useCorsairQuery("get user by id", { id: userId });

  // // QUERY: Get user's posts
  // const { data: posts } = useCorsairQuery(
  //   "get user posts",
  //   { userId },
  //   { enabled: !!user } // Only fetch if user exists
  // );

  // // MUTATION: Update user
  // const updateUserMutation = useCorsairMutation("update user");

  // // MUTATION: Create post
  // const createPostMutation = useCorsairMutation("create post");

  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;
  if (!user) return <div>User not found</div>;

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.id}</p>

      {/* <button
        onClick={() =>
          updateUserMutation.mutateAsync({
            id: userId,
            name: "Updated Name",
          })
        }
      >
        Update Name
      </button> */}

      {/* <h2>Posts</h2>
      {posts?.map((post) => (
        <div key={post.id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
        </div>
      ))}

      <button
        onClick={async () => {
          const res = await createPostMutation.mutateAsync({
            title: "New Post",
            content: "This is my new post!",
          });
        }}
      >
        Create Post
      </button> */}
    </div>
  );
}
