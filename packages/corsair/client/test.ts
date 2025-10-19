import { field, Schema } from "./";

export const schema = {
  users: {
    fields: {
      createdAt: field.datetime({ default: "now" }),
      name: field.string(),
      email: field.string({ unique: true }),
      bio: field.string({ nullable: true }),
    },
    access: {
      read: "anyone",
      update: "themselves",
      delete: "themselves",
    },
  },
  post_likes: {
    fields: {
      post: field.relation("post"),
      user: field.relation("user"),
    },
    access: {
      read: "anyone",
      create: "logged in users",
      delete: "author",
    },
  },
  posts: {
    fields: {
      title: field.string(),
      content: field.markdown(),
      excerpt: field.string({ nullable: true }),
      status: field.enum(["draft", "published", "archived"], {
        default: "draft",
      }),
      publishedAt: field.datetime({ nullable: true }),

      author: field.relation("user"),
      likes: field.relation("post_likes"),

      likeCount: field.computed({
        description: "count of users who liked this post",
      }),
      isPublished: field.computed({
        description: "true if status is published",
      }),
    },
    constraints: {
      "published posts must have publishedAt":
        "if status is published then publishedAt is not null",
    },

    access: {
      read: "anyone if published, otherwise author",
      create: "logged in users",
      update: "author",
      delete: "author",
    },
  },
  comments: {
    fields: {
      content: field.string(),
      post: field.relation("post"),
      author: field.relation("user"),
    },
    access: {
      read: "anyone if post is published",
      create: "logged in users",
      update: "author",
      delete: "author or post author",
    },
  },
  tags: {
    fields: {
      name: field.string({ unique: true }),
      description: field.string({ nullable: true }),
      posts: field.relationMany("post"),
    },
    access: {
      read: "anyone",
      create: "admin users",
      update: "admin users",
      delete: "admin users",
    },
  },
} satisfies Schema;
