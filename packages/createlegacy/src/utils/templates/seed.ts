import fs from "fs-extra";
import path from "path";
import type { ProjectConfig } from "../../cli/create-project.js";

export async function generateSeedData(
	projectPath: string,
	config: ProjectConfig,
): Promise<void> {
	if (config.orm === "prisma") {
		const template = getPrismaSeedTemplate();
		await fs.writeFile(path.join(projectPath, "db", "seed.ts"), template);
	} else {
		const template = getDrizzleSeedTemplate();
		await fs.writeFile(path.join(projectPath, "db", "seed.ts"), template);
	}
}

function getPrismaSeedTemplate() {
	return `import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Create sample users
  const user1 = await prisma.user.create({
    data: {
      email: "alice@example.com",
      name: "Alice",
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "bob@example.com",
      name: "Bob",
    },
  });

  // Create sample posts
  const post1 = await prisma.post.create({
    data: {
      title: "Getting Started with Corsair",
      content: "This is a sample post about getting started with Corsair.",
      published: true,
      authorId: user1.id,
    },
  });

  const post2 = await prisma.post.create({
    data: {
      title: "Building with Next.js",
      content: "Learn how to build modern web applications with Next.js.",
      published: true,
      authorId: user2.id,
    },
  });

  // Create sample comments
  await prisma.comment.create({
    data: {
      content: "Great post! Thanks for sharing.",
      authorId: user2.id,
      postId: post1.id,
    },
  });

  await prisma.comment.create({
    data: {
      content: "Very helpful tutorial!",
      authorId: user1.id,
      postId: post2.id,
    },
  });

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
`;
}

function getDrizzleSeedTemplate() {
	return `import { db } from "./index";
import { users, posts, comments } from "./schema";

async function main() {
  console.log("🌱 Seeding database...");

  // Create sample users
  const [user1] = await db.insert(users).values({
    id: "user_1",
    email: "alice@example.com",
    name: "Alice",
  }).returning();

  const [user2] = await db.insert(users).values({
    id: "user_2",
    email: "bob@example.com",
    name: "Bob",
  }).returning();

  // Create sample posts
  const [post1] = await db.insert(posts).values({
    id: "post_1",
    title: "Getting Started with Corsair",
    content: "This is a sample post about getting started with Corsair.",
    published: true,
    authorId: user1!.id,
  }).returning();

  const [post2] = await db.insert(posts).values({
    id: "post_2",
    title: "Building with Next.js",
    content: "Learn how to build modern web applications with Next.js.",
    published: true,
    authorId: user2!.id,
  }).returning();

  // Create sample comments
  await db.insert(comments).values([
    {
      id: "comment_1",
      content: "Great post! Thanks for sharing.",
      authorId: user2!.id,
      postId: post1!.id,
    },
    {
      id: "comment_2",
      content: "Very helpful tutorial!",
      authorId: user1!.id,
      postId: post2!.id,
    },
  ]);

  console.log("✅ Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
`;
}
