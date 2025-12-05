import { relations, sql } from "drizzle-orm";
import {
	boolean,
	integer,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
	id: uuid("id").primaryKey().default(sql`uuid_generate_v4()`),
	email: text("email").notNull().unique(),
	name: text("name").notNull(),
	avatar_url: text("avatar_url"),
	bio: text("bio"),
	created_at: timestamp("created_at").notNull().defaultNow(),
	updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const posts = pgTable("posts", {
	id: uuid("id").primaryKey().default(sql`uuid_generate_v4()`),
	title: text("title").notNull(),
	slug: text("slug").notNull().unique(),
	content: text("content").notNull(),
	excerpt: text("excerpt"),
	cover_image_url: text("cover_image_url"),
	published: boolean("published").notNull().default(false),
	view_count: integer("view_count").notNull().default(0),
	author_id: uuid("author_id")
		.notNull()
		.references(() => users.id),
	created_at: timestamp("created_at").notNull().defaultNow(),
	updated_at: timestamp("updated_at").notNull().defaultNow(),
	published_at: timestamp("published_at"),
});

export const categories = pgTable("categories", {
	id: uuid("id").primaryKey().default(sql`uuid_generate_v4()`),
	name: text("name").notNull().unique(),
	slug: text("slug").notNull().unique(),
	description: text("description"),
	created_at: timestamp("created_at").notNull().defaultNow(),
});

export const tags = pgTable("tags", {
	id: uuid("id").primaryKey().default(sql`uuid_generate_v4()`),
	name: text("name").notNull().unique(),
	slug: text("slug").notNull().unique(),
	created_at: timestamp("created_at").notNull().defaultNow(),
});

export const post_categories = pgTable("post_categories", {
	id: uuid("id").primaryKey().default(sql`uuid_generate_v4()`),
	post_id: uuid("post_id")
		.notNull()
		.references(() => posts.id),
	category_id: uuid("category_id")
		.notNull()
		.references(() => categories.id),
});

export const post_tags = pgTable("post_tags", {
	id: uuid("id").primaryKey().default(sql`uuid_generate_v4()`),
	post_id: uuid("post_id")
		.notNull()
		.references(() => posts.id),
	tag_id: uuid("tag_id")
		.notNull()
		.references(() => tags.id),
});

export const comments = pgTable("comments", {
	id: uuid("id").primaryKey().default(sql`uuid_generate_v4()`),
	content: text("content").notNull(),
	post_id: uuid("post_id")
		.notNull()
		.references(() => posts.id),
	author_id: uuid("author_id")
		.notNull()
		.references(() => users.id),
	parent_id: uuid("parent_id"),
	created_at: timestamp("created_at").notNull().defaultNow(),
	updated_at: timestamp("updated_at").notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many }) => ({
	posts: many(posts),
	comments: many(comments),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
	author: one(users, {
		fields: [posts.author_id],
		references: [users.id],
	}),
	postCategories: many(post_categories),
	postTags: many(post_tags),
	comments: many(comments),
}));

export const categoriesRelations = relations(categories, ({ many }) => ({
	postCategories: many(post_categories),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
	postTags: many(post_tags),
}));

export const postCategoriesRelations = relations(
	post_categories,
	({ one }) => ({
		post: one(posts, {
			fields: [post_categories.post_id],
			references: [posts.id],
		}),
		category: one(categories, {
			fields: [post_categories.category_id],
			references: [categories.id],
		}),
	}),
);

export const postTagsRelations = relations(post_tags, ({ one }) => ({
	post: one(posts, {
		fields: [post_tags.post_id],
		references: [posts.id],
	}),
	tag: one(tags, {
		fields: [post_tags.tag_id],
		references: [tags.id],
	}),
}));

export const commentsRelations = relations(comments, ({ one, many }) => ({
	post: one(posts, {
		fields: [comments.post_id],
		references: [posts.id],
	}),
	author: one(users, {
		fields: [comments.author_id],
		references: [users.id],
	}),
	parent: one(comments, {
		fields: [comments.parent_id],
		references: [comments.id],
	}),
	replies: many(comments),
}));
