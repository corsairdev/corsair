import fs from "fs-extra";
import path from "path";
import type { ProjectConfig } from "../../cli/create-project.js";

export async function generateDatabaseFiles(
	projectPath: string,
	config: ProjectConfig,
): Promise<void> {
	if (config.orm === "prisma") {
		await generatePrismaFiles(projectPath);
	} else {
		await generateDrizzleFiles(projectPath);
	}
}

async function generatePrismaFiles(projectPath: string): Promise<void> {
	const templates = getPrismaTemplates();
	await fs.writeFile(
		path.join(projectPath, "prisma", "schema.prisma"),
		templates.schema,
	);
	await fs.writeFile(
		path.join(projectPath, "db", "index.ts"),
		templates.dbIndex,
	);
}

async function generateDrizzleFiles(projectPath: string): Promise<void> {
	const templates = getDrizzleTemplates();
	await fs.writeFile(
		path.join(projectPath, "db", "schema.ts"),
		templates.schema,
	);
	await fs.writeFile(
		path.join(projectPath, "db", "index.ts"),
		templates.dbIndex,
	);
	await fs.writeFile(
		path.join(projectPath, "drizzle.config.ts"),
		templates.config,
	);
}

function getPrismaTemplates() {
	return {
		schema: `// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  name      String?
  email     String   @unique
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  posts     Post[]
  comments  Comment[]

  @@map("users")
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId String

  comments Comment[]

  @@map("posts")
}

model Comment {
  id        String   @id @default(cuid())
  content   String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId String
  post     Post   @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId   String

  @@map("comments")
}
`,
		dbIndex: `import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const db = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

export type DB = typeof db;
`,
	};
}

function getDrizzleTemplates() {
	return {
		schema: `import { relations } from "drizzle-orm";
import {
  boolean,
  pgTable,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: text("id").primaryKey().notNull(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const posts = pgTable("posts", {
  id: text("id").primaryKey().notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  content: text("content"),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  authorId: text("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
});

export const comments = pgTable("comments", {
  id: text("id").primaryKey().notNull(),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  authorId: text("author_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  postId: text("post_id").notNull().references(() => posts.id, { onDelete: "cascade" }),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  posts: many(posts),
  comments: many(comments),
}));

export const postsRelations = relations(posts, ({ one, many }) => ({
  author: one(users, {
    fields: [posts.authorId],
    references: [users.id],
  }),
  comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
  author: one(users, {
    fields: [comments.authorId],
    references: [users.id],
  }),
  post: one(posts, {
    fields: [comments.postId],
    references: [posts.id],
  }),
}));
`,
		dbIndex: `import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export const db = drizzle(pool, { schema });

export type DB = typeof db;
`,
		config: `import type { Config } from "drizzle-kit";
import { config } from 'dotenv'
config({ path: ".env.local" });


export default {
  schema: "./db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
`,
	};
}
