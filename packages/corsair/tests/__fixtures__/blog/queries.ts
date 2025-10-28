import { createQuery, z } from "../../../core";
import { BlogContext } from "./context";

const query = createQuery<BlogContext>();

export const queries = {
  // Author queries
  "get all authors": query({
    prompt: "get all authors",
    input_type: z.object({
      is_active: z.boolean().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    }),
    response_type: z.array(z.object({
      id: z.string(),
      username: z.string(),
      email: z.string(),
      bio: z.string().nullable(),
      avatar_url: z.string().nullable(),
      is_active: z.boolean(),
      created_at: z.date(),
    })),
    dependencies: {
      tables: ["authors"],
      columns: ["authors.*"],
    },
    handler: async (input, ctx) => {
      let query = ctx.db.select().from(ctx.schema.authors);

      if (input.is_active !== undefined) {
        query = query.where(ctx.conditions.eq(ctx.schema.authors.columns.is_active, input.is_active));
      }

      if (input.limit) {
        query = query.limit(input.limit);
      }

      if (input.offset) {
        query = query.offset(input.offset);
      }

      const authors = await query.execute();
      return authors.map(author => ({
        ...author,
        created_at: new Date(author.created_at),
      }));
    },
  }),

  "get author by id": query({
    prompt: "get author by id",
    input_type: z.object({
      id: z.string(),
    }),
    response_type: z.object({
      id: z.string(),
      username: z.string(),
      email: z.string(),
      bio: z.string().nullable(),
      avatar_url: z.string().nullable(),
      is_active: z.boolean(),
      social_links: z.any(),
      created_at: z.date(),
      updated_at: z.date(),
    }).nullable(),
    dependencies: {
      tables: ["authors"],
      columns: ["authors.*"],
    },
    handler: async (input, ctx) => {
      const [author] = await ctx.db
        .select()
        .from(ctx.schema.authors)
        .where(ctx.conditions.eq(ctx.schema.authors.columns.id, input.id))
        .execute();

      return author ? {
        ...author,
        created_at: new Date(author.created_at),
        updated_at: new Date(author.updated_at),
      } : null;
    },
  }),

  // Post queries
  "get all posts": query({
    prompt: "get all posts",
    input_type: z.object({
      published: z.boolean().optional(),
      author_id: z.string().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
      sort_by: z.enum(['created_at', 'published_at', 'view_count']).optional(),
      sort_order: z.enum(['asc', 'desc']).optional(),
    }),
    response_type: z.array(z.object({
      id: z.string(),
      title: z.string(),
      slug: z.string(),
      excerpt: z.string().nullable(),
      author_id: z.string(),
      published: z.boolean(),
      published_at: z.date().nullable(),
      featured_image: z.string().nullable(),
      view_count: z.number(),
      reading_time: z.number().nullable(),
      created_at: z.date(),
      updated_at: z.date(),
    })),
    dependencies: {
      tables: ["posts"],
      columns: ["posts.*"],
    },
    handler: async (input, ctx) => {
      let query = ctx.db.select().from(ctx.schema.posts);

      if (input.published !== undefined) {
        query = query.where(ctx.conditions.eq(ctx.schema.posts.columns.published, input.published));
      }

      if (input.author_id) {
        query = query.where(ctx.conditions.eq(ctx.schema.posts.columns.author_id, input.author_id));
      }

      const sortBy = input.sort_by || 'created_at';
      const sortOrder = input.sort_order || 'desc';
      query = query.orderBy(ctx.schema.posts.columns[sortBy], sortOrder);

      if (input.limit) {
        query = query.limit(input.limit);
      }

      if (input.offset) {
        query = query.offset(input.offset);
      }

      const posts = await query.execute();
      return posts.map(post => ({
        ...post,
        published_at: post.published_at ? new Date(post.published_at) : null,
        created_at: new Date(post.created_at),
        updated_at: new Date(post.updated_at),
      }));
    },
  }),

  "get post by slug": query({
    prompt: "get post by slug",
    input_type: z.object({
      slug: z.string(),
      increment_views: z.boolean().optional(),
    }),
    response_type: z.object({
      id: z.string(),
      title: z.string(),
      slug: z.string(),
      content: z.string(),
      excerpt: z.string().nullable(),
      author: z.object({
        id: z.string(),
        username: z.string(),
        avatar_url: z.string().nullable(),
      }),
      published: z.boolean(),
      published_at: z.date().nullable(),
      featured_image: z.string().nullable(),
      seo_title: z.string().nullable(),
      seo_description: z.string().nullable(),
      view_count: z.number(),
      reading_time: z.number().nullable(),
      created_at: z.date(),
      updated_at: z.date(),
    }).nullable(),
    dependencies: {
      tables: ["posts", "authors"],
      columns: ["posts.*", "authors.id", "authors.username", "authors.avatar_url"],
    },
    handler: async (input, ctx) => {
      const [result] = await ctx.db
        .select()
        .from(ctx.schema.posts)
        .innerJoin(
          ctx.schema.authors,
          ctx.conditions.eq(ctx.schema.posts.columns.author_id, ctx.schema.authors.columns.id)
        )
        .where(ctx.conditions.eq(ctx.schema.posts.columns.slug, input.slug))
        .execute();

      if (!result) return null;

      // Increment view count if requested
      if (input.increment_views) {
        await ctx.db
          .update(ctx.schema.posts)
          .set({ view_count: result.view_count + 1 })
          .where(ctx.conditions.eq(ctx.schema.posts.columns.id, result.id))
          .execute();
      }

      return {
        id: result.id,
        title: result.title,
        slug: result.slug,
        content: result.content,
        excerpt: result.excerpt,
        author: {
          id: result.author_id,
          username: result.author_username,
          avatar_url: result.author_avatar_url,
        },
        published: result.published,
        published_at: result.published_at ? new Date(result.published_at) : null,
        featured_image: result.featured_image,
        seo_title: result.seo_title,
        seo_description: result.seo_description,
        view_count: input.increment_views ? result.view_count + 1 : result.view_count,
        reading_time: result.reading_time,
        created_at: new Date(result.created_at),
        updated_at: new Date(result.updated_at),
      };
    },
  }),

  "get posts with tags": query({
    prompt: "get posts with tags",
    input_type: z.object({
      published: z.boolean().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    }),
    response_type: z.array(z.object({
      id: z.string(),
      title: z.string(),
      slug: z.string(),
      excerpt: z.string().nullable(),
      published: z.boolean(),
      tags: z.array(z.object({
        id: z.string(),
        name: z.string(),
        slug: z.string(),
        color: z.string().nullable(),
      })),
      created_at: z.date(),
    })),
    dependencies: {
      tables: ["posts", "post_tags", "tags"],
      columns: ["posts.*", "tags.*"],
    },
    handler: async (input, ctx) => {
      let query = ctx.db
        .select()
        .from(ctx.schema.posts)
        .leftJoin(
          ctx.schema.post_tags,
          ctx.conditions.eq(ctx.schema.posts.columns.id, ctx.schema.post_tags.columns.post_id)
        )
        .leftJoin(
          ctx.schema.tags,
          ctx.conditions.eq(ctx.schema.post_tags.columns.tag_id, ctx.schema.tags.columns.id)
        );

      if (input.published !== undefined) {
        query = query.where(ctx.conditions.eq(ctx.schema.posts.columns.published, input.published));
      }

      if (input.limit) {
        query = query.limit(input.limit);
      }

      if (input.offset) {
        query = query.offset(input.offset);
      }

      const results = await query.execute();

      // Group posts with their tags
      const postsMap = new Map();
      results.forEach(result => {
        if (!postsMap.has(result.id)) {
          postsMap.set(result.id, {
            id: result.id,
            title: result.title,
            slug: result.slug,
            excerpt: result.excerpt,
            published: result.published,
            tags: [],
            created_at: new Date(result.created_at),
          });
        }

        if (result.tag_id) {
          postsMap.get(result.id).tags.push({
            id: result.tag_id,
            name: result.tag_name,
            slug: result.tag_slug,
            color: result.tag_color,
          });
        }
      });

      return Array.from(postsMap.values());
    },
  }),

  // Tag queries
  "get all tags": query({
    prompt: "get all tags",
    input_type: z.object({
      sort_by: z.enum(['name', 'post_count', 'created_at']).optional(),
      limit: z.number().optional(),
    }),
    response_type: z.array(z.object({
      id: z.string(),
      name: z.string(),
      slug: z.string(),
      description: z.string().nullable(),
      color: z.string().nullable(),
      post_count: z.number(),
      created_at: z.date(),
    })),
    dependencies: {
      tables: ["tags"],
      columns: ["tags.*"],
    },
    handler: async (input, ctx) => {
      let query = ctx.db.select().from(ctx.schema.tags);

      const sortBy = input.sort_by || 'name';
      query = query.orderBy(ctx.schema.tags.columns[sortBy], 'asc');

      if (input.limit) {
        query = query.limit(input.limit);
      }

      const tags = await query.execute();
      return tags.map(tag => ({
        ...tag,
        created_at: new Date(tag.created_at),
      }));
    },
  }),

  "get posts by tag": query({
    prompt: "get posts by tag",
    input_type: z.object({
      tag_slug: z.string(),
      published: z.boolean().optional(),
      limit: z.number().optional(),
      offset: z.number().optional(),
    }),
    response_type: z.array(z.object({
      id: z.string(),
      title: z.string(),
      slug: z.string(),
      excerpt: z.string().nullable(),
      published: z.boolean(),
      author: z.object({
        id: z.string(),
        username: z.string(),
      }),
      created_at: z.date(),
    })),
    dependencies: {
      tables: ["posts", "post_tags", "tags", "authors"],
      columns: ["posts.*", "authors.id", "authors.username"],
    },
    handler: async (input, ctx) => {
      let query = ctx.db
        .select()
        .from(ctx.schema.posts)
        .innerJoin(
          ctx.schema.post_tags,
          ctx.conditions.eq(ctx.schema.posts.columns.id, ctx.schema.post_tags.columns.post_id)
        )
        .innerJoin(
          ctx.schema.tags,
          ctx.conditions.eq(ctx.schema.post_tags.columns.tag_id, ctx.schema.tags.columns.id)
        )
        .innerJoin(
          ctx.schema.authors,
          ctx.conditions.eq(ctx.schema.posts.columns.author_id, ctx.schema.authors.columns.id)
        )
        .where(ctx.conditions.eq(ctx.schema.tags.columns.slug, input.tag_slug));

      if (input.published !== undefined) {
        query = query.where(ctx.conditions.eq(ctx.schema.posts.columns.published, input.published));
      }

      if (input.limit) {
        query = query.limit(input.limit);
      }

      if (input.offset) {
        query = query.offset(input.offset);
      }

      const results = await query.execute();
      return results.map(result => ({
        id: result.id,
        title: result.title,
        slug: result.slug,
        excerpt: result.excerpt,
        published: result.published,
        author: {
          id: result.author_id,
          username: result.author_username,
        },
        created_at: new Date(result.created_at),
      }));
    },
  }),

  // Comment queries
  "get post comments": query({
    prompt: "get post comments",
    input_type: z.object({
      post_id: z.string(),
      is_approved: z.boolean().optional(),
      parent_id: z.string().optional().nullable(),
      limit: z.number().optional(),
    }),
    response_type: z.array(z.object({
      id: z.string(),
      content: z.string(),
      author_name: z.string().nullable(),
      is_approved: z.boolean(),
      parent_id: z.string().nullable(),
      created_at: z.date(),
      replies: z.array(z.object({
        id: z.string(),
        content: z.string(),
        author_name: z.string().nullable(),
        created_at: z.date(),
      })),
    })),
    dependencies: {
      tables: ["comments"],
      columns: ["comments.*"],
    },
    handler: async (input, ctx) => {
      let query = ctx.db
        .select()
        .from(ctx.schema.comments)
        .where(ctx.conditions.eq(ctx.schema.comments.columns.post_id, input.post_id));

      if (input.is_approved !== undefined) {
        query = query.where(ctx.conditions.eq(ctx.schema.comments.columns.is_approved, input.is_approved));
      }

      if (input.parent_id !== undefined) {
        if (input.parent_id === null) {
          query = query.where(ctx.conditions.isNull(ctx.schema.comments.columns.parent_id));
        } else {
          query = query.where(ctx.conditions.eq(ctx.schema.comments.columns.parent_id, input.parent_id));
        }
      }

      query = query.orderBy(ctx.schema.comments.columns.created_at, 'asc');

      if (input.limit) {
        query = query.limit(input.limit);
      }

      const comments = await query.execute();

      // Group comments with replies
      const topLevelComments = comments
        .filter(comment => !comment.parent_id)
        .map(comment => ({
          ...comment,
          created_at: new Date(comment.created_at),
          replies: comments
            .filter(reply => reply.parent_id === comment.id)
            .map(reply => ({
              id: reply.id,
              content: reply.content,
              author_name: reply.author_name,
              created_at: new Date(reply.created_at),
            })),
        }));

      return topLevelComments;
    },
  }),

  "search posts": query({
    prompt: "search posts",
    input_type: z.object({
      query: z.string(),
      published: z.boolean().optional(),
      limit: z.number().optional(),
    }),
    dependencies: {
      tables: ["posts", "authors"],
      columns: ["posts.*", "authors.username"],
    },
    handler: async (input, ctx) => {
      let query = ctx.db
        .select()
        .from(ctx.schema.posts)
        .innerJoin(
          ctx.schema.authors,
          ctx.conditions.eq(ctx.schema.posts.columns.author_id, ctx.schema.authors.columns.id)
        )
        .where(ctx.conditions.or(
          ctx.conditions.ilike(ctx.schema.posts.columns.title, `%${input.query}%`),
          ctx.conditions.ilike(ctx.schema.posts.columns.content, `%${input.query}%`),
          ctx.conditions.ilike(ctx.schema.posts.columns.excerpt, `%${input.query}%`)
        ));

      if (input.published !== undefined) {
        query = query.where(ctx.conditions.eq(ctx.schema.posts.columns.published, input.published));
      }

      if (input.limit) {
        query = query.limit(input.limit);
      }

      const results = await query.execute();
      return results.map(result => ({
        id: result.id,
        title: result.title,
        slug: result.slug,
        excerpt: result.excerpt,
        author_username: result.author_username,
        published: result.published,
        created_at: new Date(result.created_at),
      }));
    },
  }),
};