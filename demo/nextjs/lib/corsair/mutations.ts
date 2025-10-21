import { createMutation } from "corsair/core";
import { z } from "corsair/core";
import type { DatabaseContext } from "./db";
import * as schema from "./schema";
import { drizzle, drizzleZod } from "corsair/db/types";

const mutation = createMutation<DatabaseContext>();

// Developer defines their mutations
export const mutations = {
  "give me the name and email based on this id": mutation({
    prompt: "give me the name and email based on this id",
    input_type: z.object({
      id: z.string(),
    }),
    response_type: z.array(drizzleZod.createSelectSchema(schema.users)),
    dependencies: {
      tables: ["users"],
      columns: ["users.name", "users.email"],
    },
    handler: async (input, ctx) => {
      //   // Their business logic
      //   const users = await fetchUsersFromDatabase(input.id);
      //   return users.map((user) => ({
      //     name: user.fullName,
      //     email_address: user.email,
      //   }));
      return [];
    },
  }),

  "summarize this text": mutation({
    prompt: "summarize this text",
    input_type: z.object({
      text: z.string(),
      maxLength: z.number().optional(),
    }),
    response_type: z.object({
      summary: z.string(),
      wordCount: z.number(),
    }),
    dependencies: {
      tables: ["posts"],
      columns: ["posts.title", "posts.content"],
    },
    handler: async (input, ctx) => {
      //   const summary = await generateSummary(input.text, input.maxLength);
      //   return {
      //     summary,
      //     wordCount: summary.split(" ").length,
      //   };
      return {
        summary: "",
        wordCount: 0,
      };
    },
  }),

  "analyze sentiment": mutation({
    prompt: "analyze sentiment",
    input_type: z.object({
      content: z.string(),
    }),
    response_type: z.object({
      sentiment: z.enum(["positive", "negative", "neutral"]),
      confidence: z.number(),
    }),
    dependencies: {
      tables: ["posts"],
      columns: ["posts.title", "posts.content"],
    },
    handler: async (input, ctx) => {
      //   const result = await analyzeSentiment(input.content);
      //   return {
      //     sentiment: result.sentiment as "positive" | "negative" | "neutral",
      //     confidence: result.confidence,
      //   };
      return {
        sentiment: "neutral" as const,
        confidence: 0.95,
      };
    },
  }),
  "create user": mutation({
    prompt: "create user",
    input_type: z.object({
      name: z.string(),
      email: z.string(),
    }),
    response_type: drizzleZod.createSelectSchema(schema.users),
    dependencies: {
      tables: ["users"],
      columns: ["users.name", "users.email"],
    },
    handler: async (input, ctx) => {
      const [user] = await ctx.db
        .insert(ctx.schema.users)
        .values({
          id: crypto.randomUUID(),
          name: input.name,
        })
        .returning();

      return user;
    },
  }),

  "create post": mutation({
    prompt: "create post",
    input_type: z.object({
      title: z.string(),
      content: z.string(),
    }),
    response_type: drizzleZod.createSelectSchema(schema.posts),
    dependencies: {
      tables: ["posts"],
      columns: ["posts.title", "posts.content"],
    },
    handler: async (input, ctx) => {
      if (!ctx.userId) {
        throw new Error("Must be logged in to create posts");
      }

      const [post] = await ctx.db
        .insert(ctx.schema.posts)
        .values({
          id: crypto.randomUUID(),
          title: input.title,
          content: input.content,
          author_id: ctx.userId,
        })
        .returning();

      return post;
    },
  }),

  "update user": mutation({
    prompt: "update user",
    input_type: z.object({
      id: z.string(),
      name: z.string().optional(),
      email: z.string().email().optional(),
    }),
    response_type: drizzleZod.createSelectSchema(schema.users),
    dependencies: {
      tables: ["users"],
      columns: ["users.name", "users.email"],
    },
    handler: async (input, ctx) => {
      const [user] = await ctx.db
        .update(ctx.schema.users)
        .set({
          ...(input.name && { name: input.name }),
          ...(input.email && { email: input.email }),
        })
        .where(drizzle.eq(ctx.schema.users.id, input.id))
        .returning();

      return user;
    },
  }),
};
