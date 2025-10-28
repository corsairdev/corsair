import { MockDB } from "../ecommerce/schema";

// Blog/CMS Schema
export const authors = MockDB.table(
  "authors",
  {
    id: MockDB.uuid("id").primaryKey().defaultRandom(),
    username: MockDB.text("username").notNull(),
    email: MockDB.text("email").notNull(),
    bio: MockDB.text("bio"),
    avatar_url: MockDB.text("avatar_url"),
    is_active: MockDB.boolean("is_active").default(true).notNull(),
    social_links: MockDB.jsonb("social_links")(),
    created_at: MockDB.timestamp("created_at").defaultNow().notNull(),
    updated_at: MockDB.timestamp("updated_at").defaultNow().notNull(),
  },
  {
    access: {
      create: "authenticated",
      update: "own_record",
      delete: "admin_only",
    },
  }
);

export const posts = MockDB.table(
  "posts",
  {
    id: MockDB.uuid("id").primaryKey().defaultRandom(),
    title: MockDB.text("title").notNull(),
    slug: MockDB.text("slug").notNull(),
    content: MockDB.text("content").notNull(),
    excerpt: MockDB.text("excerpt"),
    author_id: MockDB.uuid("author_id").references(() => authors.columns.id).notNull(),
    published: MockDB.boolean("published").default(false).notNull(),
    published_at: MockDB.timestamp("published_at"),
    featured_image: MockDB.text("featured_image"),
    seo_title: MockDB.text("seo_title"),
    seo_description: MockDB.text("seo_description"),
    view_count: MockDB.integer("view_count").default(0).notNull(),
    reading_time: MockDB.integer("reading_time"), // in minutes
    metadata: MockDB.jsonb("metadata")(),
    created_at: MockDB.timestamp("created_at").defaultNow().notNull(),
    updated_at: MockDB.timestamp("updated_at").defaultNow().notNull(),
  },
  {
    access: {
      create: "author",
      update: "author_own",
      delete: "author_own",
    },
  }
);

export const tags = MockDB.table(
  "tags",
  {
    id: MockDB.uuid("id").primaryKey().defaultRandom(),
    name: MockDB.text("name").notNull(),
    slug: MockDB.text("slug").notNull(),
    description: MockDB.text("description"),
    color: MockDB.text("color"), // hex color code
    post_count: MockDB.integer("post_count").default(0).notNull(),
    created_at: MockDB.timestamp("created_at").defaultNow().notNull(),
  },
  {
    access: {
      create: "admin",
      update: "admin",
      delete: "admin",
    },
  }
);

export const post_tags = MockDB.table(
  "post_tags",
  {
    id: MockDB.uuid("id").primaryKey().defaultRandom(),
    post_id: MockDB.uuid("post_id").references(() => posts.columns.id).notNull(),
    tag_id: MockDB.uuid("tag_id").references(() => tags.columns.id).notNull(),
    created_at: MockDB.timestamp("created_at").defaultNow().notNull(),
  },
  {
    access: {
      create: "author",
      update: "author",
      delete: "author",
    },
  }
);

export const comments = MockDB.table(
  "comments",
  {
    id: MockDB.uuid("id").primaryKey().defaultRandom(),
    post_id: MockDB.uuid("post_id").references(() => posts.columns.id).notNull(),
    author_id: MockDB.uuid("author_id").references(() => authors.columns.id),
    author_name: MockDB.text("author_name"), // for guest comments
    author_email: MockDB.text("author_email"), // for guest comments
    content: MockDB.text("content").notNull(),
    is_approved: MockDB.boolean("is_approved").default(false).notNull(),
    parent_id: MockDB.uuid("parent_id").references(() => comments.columns.id), // for replies
    created_at: MockDB.timestamp("created_at").defaultNow().notNull(),
    updated_at: MockDB.timestamp("updated_at").defaultNow().notNull(),
  },
  {
    access: {
      create: "public",
      update: "author_own",
      delete: "admin_or_author_own",
    },
  }
);

export const categories = MockDB.table(
  "categories",
  {
    id: MockDB.uuid("id").primaryKey().defaultRandom(),
    name: MockDB.text("name").notNull(),
    slug: MockDB.text("slug").notNull(),
    description: MockDB.text("description"),
    parent_id: MockDB.uuid("parent_id").references(() => categories.columns.id),
    post_count: MockDB.integer("post_count").default(0).notNull(),
    sort_order: MockDB.integer("sort_order").default(0).notNull(),
    is_featured: MockDB.boolean("is_featured").default(false).notNull(),
    created_at: MockDB.timestamp("created_at").defaultNow().notNull(),
  },
  {
    access: {
      create: "admin",
      update: "admin",
      delete: "admin",
    },
  }
);

export const post_categories = MockDB.table(
  "post_categories",
  {
    id: MockDB.uuid("id").primaryKey().defaultRandom(),
    post_id: MockDB.uuid("post_id").references(() => posts.columns.id).notNull(),
    category_id: MockDB.uuid("category_id").references(() => categories.columns.id).notNull(),
    created_at: MockDB.timestamp("created_at").defaultNow().notNull(),
  },
  {
    access: {
      create: "author",
      update: "author",
      delete: "author",
    },
  }
);

// Schema export for easy access
export const schema = {
  authors,
  posts,
  tags,
  post_tags,
  comments,
  categories,
  post_categories,
};

// Type definitions for testing
export type Author = {
  id: string;
  username: string;
  email: string;
  bio: string | null;
  avatar_url: string | null;
  is_active: boolean;
  social_links: any;
  created_at: Date;
  updated_at: Date;
};

export type Post = {
  id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string | null;
  author_id: string;
  published: boolean;
  published_at: Date | null;
  featured_image: string | null;
  seo_title: string | null;
  seo_description: string | null;
  view_count: number;
  reading_time: number | null;
  metadata: any;
  created_at: Date;
  updated_at: Date;
};

export type Tag = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  color: string | null;
  post_count: number;
  created_at: Date;
};

export type PostTag = {
  id: string;
  post_id: string;
  tag_id: string;
  created_at: Date;
};

export type Comment = {
  id: string;
  post_id: string;
  author_id: string | null;
  author_name: string | null;
  author_email: string | null;
  content: string;
  is_approved: boolean;
  parent_id: string | null;
  created_at: Date;
  updated_at: Date;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parent_id: string | null;
  post_count: number;
  sort_order: number;
  is_featured: boolean;
  created_at: Date;
};

export type PostCategory = {
  id: string;
  post_id: string;
  category_id: string;
  created_at: Date;
};