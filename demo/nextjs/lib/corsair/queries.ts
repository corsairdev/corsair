import { createQuery } from "../../../../packages/corsair/client";
import { z } from "../../../../packages/corsair/client";
import { DatabaseContext, schema } from "./db";
import { drizzle, drizzleZod } from "../../../../packages/corsair/db";

const query = createQuery<DatabaseContext>();

export const queries = {
  "get user by id": query({
    prompt: "get user by id",
    input_type: z.object({
      id: z.string(),
    }),
    response_type: drizzleZod.createSelectSchema(schema.users),
    dependencies: {
      tables: ["users"],
      columns: ["users.name", "users.email"],
    },
    handler: async (input, ctx) => {
      const [user] = await ctx.db
        .select()
        .from(ctx.schema.users)
        .where(drizzle.eq(ctx.schema.users.id, input.id))
        .limit(1);

      return user || null;
    },
  }),

  "get user posts": query({
    prompt: "get user posts",
    input_type: z.object({
      userId: z.string(),
    }),
    response_type: z.array(drizzleZod.createSelectSchema(schema.posts)),
    dependencies: {
      tables: ["posts"],
      columns: ["posts.title", "posts.content"],
    },
    handler: async (input, ctx) => {
      const posts = await ctx.db
        .select()
        .from(ctx.schema.posts)
        .where(drizzle.eq(ctx.schema.posts.author_id, input.userId));

      return posts;
    },
  }),

  "list all users": query({
    prompt: "list all users",
    input_type: z.object({}), // No input needed
    response_type: z.array(drizzleZod.createSelectSchema(schema.users)),
    dependencies: {
      tables: ["users"],
      columns: ["users.name", "users.email"],
    },
    handler: async (input, ctx) => {
      const users = await ctx.db.select().from(ctx.schema.users);
      return users;
    },
  }),
};
