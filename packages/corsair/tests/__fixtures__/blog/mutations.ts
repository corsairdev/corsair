import { createMutation, z } from "../../../core";
import { BlogContext } from "./context";

const mutation = createMutation<BlogContext>();

export const mutations = {
  // Author mutations
  "create author": mutation({
    prompt: "create author",
    input_type: z.object({
      username: z.string().min(3).max(50),
      email: z.string().email(),
      bio: z.string().max(500).optional(),
      avatar_url: z.string().url().optional(),
      social_links: z.record(z.string(), z.string()).optional(),
    }),
    response_type: z.object({
      id: z.string(),
      username: z.string(),
      email: z.string(),
      bio: z.string().nullable(),
      avatar_url: z.string().nullable(),
      is_active: z.boolean(),
      created_at: z.date(),
    }),
    dependencies: {
      tables: ["authors"],
      columns: ["authors.*"],
    },
    handler: async (input, ctx) => {
      const [author] = await ctx.db
        .insert(ctx.schema.authors)
        .values({
          username: input.username,
          email: input.email,
          bio: input.bio || null,
          avatar_url: input.avatar_url || null,
          is_active: true,
          social_links: input.social_links || {},
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning()
        .execute();

      return {
        ...author,
        created_at: new Date(author.created_at),
      };
    },
  }),

  "update author": mutation({
    prompt: "update author",
    input_type: z.object({
      id: z.string(),
      username: z.string().min(3).max(50).optional(),
      bio: z.string().max(500).optional(),
      avatar_url: z.string().url().optional(),
      social_links: z.record(z.string(), z.string()).optional(),
      is_active: z.boolean().optional(),
    }),
    response_type: z
      .object({
        id: z.string(),
        username: z.string(),
        bio: z.string().nullable(),
        avatar_url: z.string().nullable(),
        is_active: z.boolean(),
        updated_at: z.date(),
      })
      .nullable(),
    dependencies: {
      tables: ["authors"],
      columns: ["authors.*"],
    },
    handler: async (input, ctx) => {
      const updateData: any = { updated_at: new Date() };

      if (input.username) updateData.username = input.username;
      if (input.bio !== undefined) updateData.bio = input.bio;
      if (input.avatar_url !== undefined)
        updateData.avatar_url = input.avatar_url;
      if (input.social_links) updateData.social_links = input.social_links;
      if (input.is_active !== undefined) updateData.is_active = input.is_active;

      const [author] = await ctx.db
        .update(ctx.schema.authors)
        .set(updateData)
        .where(ctx.conditions.eq(ctx.schema.authors.columns.id, input.id))
        .returning()
        .execute();

      return author
        ? {
            ...author,
            updated_at: new Date(author.updated_at),
          }
        : null;
    },
  }),

  // Post mutations
  "create post": mutation({
    prompt: "create post",
    input_type: z.object({
      title: z.string().min(1).max(200),
      slug: z.string().min(1).max(200),
      content: z.string().min(1),
      excerpt: z.string().max(500).optional(),
      author_id: z.string(),
      published: z.boolean().default(false),
      featured_image: z.string().url().optional(),
      seo_title: z.string().max(60).optional(),
      seo_description: z.string().max(160).optional(),
      reading_time: z.number().int().positive().optional(),
      metadata: z.record(z.string(), z.unknown()).optional(),
      tags: z.array(z.string()).optional(),
      categories: z.array(z.string()).optional(),
    }),
    response_type: z.object({
      id: z.string(),
      title: z.string(),
      slug: z.string(),
      content: z.string(),
      author_id: z.string(),
      published: z.boolean(),
      published_at: z.date().nullable(),
      created_at: z.date(),
    }),
    dependencies: {
      tables: ["posts", "post_tags", "post_categories"],
      columns: ["posts.*"],
    },
    handler: async (input, ctx) => {
      const now = new Date();
      const [post] = await ctx.db
        .insert(ctx.schema.posts)
        .values({
          title: input.title,
          slug: input.slug,
          content: input.content,
          excerpt: input.excerpt || null,
          author_id: input.author_id,
          published: input.published,
          published_at: input.published ? now : null,
          featured_image: input.featured_image || null,
          seo_title: input.seo_title || null,
          seo_description: input.seo_description || null,
          view_count: 0,
          reading_time: input.reading_time || null,
          metadata: input.metadata || {},
          created_at: now,
          updated_at: now,
        })
        .returning()
        .execute();

      // Add tags if provided
      if (input.tags && input.tags.length > 0) {
        for (const tagId of input.tags) {
          await ctx.db
            .insert(ctx.schema.post_tags)
            .values({
              post_id: post.id,
              tag_id: tagId,
              created_at: now,
            })
            .execute();
        }
      }

      // Add categories if provided
      if (input.categories && input.categories.length > 0) {
        for (const categoryId of input.categories) {
          await ctx.db
            .insert(ctx.schema.post_categories)
            .values({
              post_id: post.id,
              category_id: categoryId,
              created_at: now,
            })
            .execute();
        }
      }

      return {
        ...post,
        published_at: post.published_at ? new Date(post.published_at) : null,
        created_at: new Date(post.created_at),
      };
    },
  }),

  "update post": mutation({
    prompt: "update post",
    input_type: z.object({
      id: z.string(),
      title: z.string().min(1).max(200).optional(),
      slug: z.string().min(1).max(200).optional(),
      content: z.string().min(1).optional(),
      excerpt: z.string().max(500).optional(),
      published: z.boolean().optional(),
      featured_image: z.string().url().optional(),
      seo_title: z.string().max(60).optional(),
      seo_description: z.string().max(160).optional(),
      reading_time: z.number().int().positive().optional(),
      metadata: z.record(z.string(), z.unknown()).optional(),
    }),
    response_type: z
      .object({
        id: z.string(),
        title: z.string(),
        slug: z.string(),
        published: z.boolean(),
        published_at: z.date().nullable(),
        updated_at: z.date(),
      })
      .nullable(),
    dependencies: {
      tables: ["posts"],
      columns: ["posts.*"],
    },
    handler: async (input, ctx) => {
      const updateData: any = { updated_at: new Date() };

      if (input.title) updateData.title = input.title;
      if (input.slug) updateData.slug = input.slug;
      if (input.content) updateData.content = input.content;
      if (input.excerpt !== undefined) updateData.excerpt = input.excerpt;
      if (input.featured_image !== undefined)
        updateData.featured_image = input.featured_image;
      if (input.seo_title !== undefined) updateData.seo_title = input.seo_title;
      if (input.seo_description !== undefined)
        updateData.seo_description = input.seo_description;
      if (input.reading_time !== undefined)
        updateData.reading_time = input.reading_time;
      if (input.metadata) updateData.metadata = input.metadata;

      // Handle publishing
      if (input.published !== undefined) {
        updateData.published = input.published;
        if (input.published) {
          updateData.published_at = new Date();
        }
      }

      const [post] = await ctx.db
        .update(ctx.schema.posts)
        .set(updateData)
        .where(ctx.conditions.eq(ctx.schema.posts.columns.id, input.id))
        .returning()
        .execute();

      return post
        ? {
            ...post,
            published_at: post.published_at
              ? new Date(post.published_at)
              : null,
            updated_at: new Date(post.updated_at),
          }
        : null;
    },
  }),

  "delete post": mutation({
    prompt: "delete post",
    input_type: z.object({
      id: z.string(),
    }),
    response_type: z.object({
      id: z.string(),
      deleted: z.boolean(),
    }),
    dependencies: {
      tables: ["posts", "post_tags", "post_categories", "comments"],
      columns: ["posts.id"],
    },
    handler: async (input, ctx) => {
      // Delete related data first
      await ctx.db
        .delete(ctx.schema.post_tags)
        .where(
          ctx.conditions.eq(ctx.schema.post_tags.columns.post_id, input.id)
        )
        .execute();

      await ctx.db
        .delete(ctx.schema.post_categories)
        .where(
          ctx.conditions.eq(
            ctx.schema.post_categories.columns.post_id,
            input.id
          )
        )
        .execute();

      await ctx.db
        .delete(ctx.schema.comments)
        .where(ctx.conditions.eq(ctx.schema.comments.columns.post_id, input.id))
        .execute();

      // Delete the post
      const [deletedPost] = await ctx.db
        .delete(ctx.schema.posts)
        .where(ctx.conditions.eq(ctx.schema.posts.columns.id, input.id))
        .returning()
        .execute();

      return {
        id: input.id,
        deleted: !!deletedPost,
      };
    },
  }),

  "publish post": mutation({
    prompt: "publish post",
    input_type: z.object({
      id: z.string(),
    }),
    response_type: z
      .object({
        id: z.string(),
        published: z.boolean(),
        published_at: z.date(),
      })
      .nullable(),
    dependencies: {
      tables: ["posts"],
      columns: ["posts.id", "posts.published", "posts.published_at"],
    },
    handler: async (input, ctx) => {
      const [post] = await ctx.db
        .update(ctx.schema.posts)
        .set({
          published: true,
          published_at: new Date(),
          updated_at: new Date(),
        })
        .where(ctx.conditions.eq(ctx.schema.posts.columns.id, input.id))
        .returning()
        .execute();

      return post
        ? {
            id: post.id,
            published: true,
            published_at: new Date(),
          }
        : null;
    },
  }),

  // Tag mutations
  "create tag": mutation({
    prompt: "create tag",
    input_type: z.object({
      name: z.string().min(1).max(50),
      slug: z.string().min(1).max(50),
      description: z.string().max(200).optional(),
      color: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i)
        .optional(),
    }),
    response_type: z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
      description: z.string().nullable(),
      color: z.string().nullable(),
      post_count: z.number(),
      created_at: z.date(),
    }),
    dependencies: {
      tables: ["tags"],
      columns: ["tags.*"],
    },
    handler: async (input, ctx) => {
      const [tag] = await ctx.db
        .insert(ctx.schema.tags)
        .values({
          name: input.name,
          slug: input.slug,
          description: input.description || null,
          color: input.color || null,
          post_count: 0,
          created_at: new Date(),
        })
        .returning()
        .execute();

      return {
        ...tag,
        created_at: new Date(tag.created_at),
      };
    },
  }),

  "update tag": mutation({
    prompt: "update tag",
    input_type: z.object({
      id: z.string(),
      name: z.string().min(1).max(50).optional(),
      slug: z.string().min(1).max(50).optional(),
      description: z.string().max(200).optional(),
      color: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i)
        .optional(),
    }),
    response_type: z
      .object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        description: z.string().nullable(),
        color: z.string().nullable(),
      })
      .nullable(),
    dependencies: {
      tables: ["tags"],
      columns: ["tags.*"],
    },
    handler: async (input, ctx) => {
      const updateData: any = {};

      if (input.name) updateData.name = input.name;
      if (input.slug) updateData.slug = input.slug;
      if (input.description !== undefined)
        updateData.description = input.description;
      if (input.color !== undefined) updateData.color = input.color;

      const [tag] = await ctx.db
        .update(ctx.schema.tags)
        .set(updateData)
        .where(ctx.conditions.eq(ctx.schema.tags.columns.id, input.id))
        .returning()
        .execute();

      return tag || null;
    },
  }),

  // Comment mutations
  "create comment": mutation({
    prompt: "create comment",
    input_type: z.object({
      post_id: z.string(),
      content: z.string().min(1).max(1000),
      author_id: z.string().optional(),
      author_name: z.string().optional(),
      author_email: z.string().email().optional(),
      parent_id: z.string().optional(),
    }),
    response_type: z.object({
      id: z.string(),
      post_id: z.string(),
      content: z.string(),
      author_name: z.string().nullable(),
      is_approved: z.boolean(),
      parent_id: z.string().nullable(),
      created_at: z.date(),
    }),
    dependencies: {
      tables: ["comments"],
      columns: ["comments.*"],
    },
    handler: async (input, ctx) => {
      const [comment] = await ctx.db
        .insert(ctx.schema.comments)
        .values({
          post_id: input.post_id,
          content: input.content,
          author_id: input.author_id || null,
          author_name: input.author_name || null,
          author_email: input.author_email || null,
          parent_id: input.parent_id || null,
          is_approved: ctx.userRole === "admin", // Auto-approve admin comments
          created_at: new Date(),
          updated_at: new Date(),
        })
        .returning()
        .execute();

      return {
        ...comment,
        created_at: new Date(comment.created_at),
      };
    },
  }),

  "approve comment": mutation({
    prompt: "approve comment",
    input_type: z.object({
      id: z.string(),
      approved: z.boolean(),
    }),
    response_type: z
      .object({
        id: z.string(),
        is_approved: z.boolean(),
        updated_at: z.date(),
      })
      .nullable(),
    dependencies: {
      tables: ["comments"],
      columns: ["comments.id", "comments.is_approved", "comments.updated_at"],
    },
    handler: async (input, ctx) => {
      const [comment] = await ctx.db
        .update(ctx.schema.comments)
        .set({
          is_approved: input.approved,
          updated_at: new Date(),
        })
        .where(ctx.conditions.eq(ctx.schema.comments.columns.id, input.id))
        .returning()
        .execute();

      return comment
        ? {
            id: comment.id,
            is_approved: comment.is_approved,
            updated_at: new Date(comment.updated_at),
          }
        : null;
    },
  }),

  "delete comment": mutation({
    prompt: "delete comment",
    input_type: z.object({
      id: z.string(),
    }),
    response_type: z.object({
      id: z.string(),
      deleted: z.boolean(),
    }),
    dependencies: {
      tables: ["comments"],
      columns: ["comments.id"],
    },
    handler: async (input, ctx) => {
      // Delete replies first
      await ctx.db
        .delete(ctx.schema.comments)
        .where(
          ctx.conditions.eq(ctx.schema.comments.columns.parent_id, input.id)
        )
        .execute();

      // Delete the comment
      const [deletedComment] = await ctx.db
        .delete(ctx.schema.comments)
        .where(ctx.conditions.eq(ctx.schema.comments.columns.id, input.id))
        .returning()
        .execute();

      return {
        id: input.id,
        deleted: !!deletedComment,
      };
    },
  }),

  "increment view count": mutation({
    prompt: "increment view count",
    input_type: z.object({
      post_id: z.string(),
    }),
    response_type: z
      .object({
        post_id: z.string(),
        new_view_count: z.number(),
      })
      .nullable(),
    dependencies: {
      tables: ["posts"],
      columns: ["posts.id", "posts.view_count"],
    },
    handler: async (input, ctx) => {
      const [post] = await ctx.db
        .select()
        .from(ctx.schema.posts)
        .where(ctx.conditions.eq(ctx.schema.posts.columns.id, input.post_id))
        .execute();

      if (!post) return null;

      const newViewCount = post.view_count + 1;

      await ctx.db
        .update(ctx.schema.posts)
        .set({ view_count: newViewCount })
        .where(ctx.conditions.eq(ctx.schema.posts.columns.id, input.post_id))
        .execute();

      return {
        post_id: input.post_id,
        new_view_count: newViewCount,
      };
    },
  }),
};
