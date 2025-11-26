import { z } from 'zod'
import { procedure } from '@/corsair/procedure'
import { eq } from 'drizzle-orm'

/**
 * INPUT: { slug: string }
 * OUTPUT: {
 *   id: string,
 *   title: string,
 *   slug: string,
 *   content: string,
 *   excerpt: string,
 *   cover_image_url: string,
 *   published: boolean,
 *   view_count: number,
 *   author: {
 *     id: string,
 *     name: string,
 *     email: string,
 *     avatar_url: string,
 *     bio: string
 *   },
 *   categories: Array<{ id: string, name: string, slug: string, description: string }>,
 *   tags: Array<{ id: string, name: string, slug: string }>,
 *   created_at: Date,
 *   updated_at: Date,
 *   published_at: Date
 * }
 * 
 * PSEUDO CODE:
 * 1. Accept slug as input parameter
 * 2. Query the posts table filtering by slug
 * 3. If not found, return null or throw error
 * 4. Join author, categories, tags for this post
 * 5. Return full post info with nested author, categories, tags
 * 
 * USER INSTRUCTIONS: fetch a single post by slug with author details, categories, and tags
 */
export const getPostBySlug = procedure
  .input(z.object({ slug: z.string() }))
  .query(async ({ input, ctx }) => {
    const db = ctx.db._.fullSchema
    // 1. Fetch post + author
    const postData = await ctx.db
      .select({
        id: db.posts.id,
        title: db.posts.title,
        slug: db.posts.slug,
        content: db.posts.content,
        excerpt: db.posts.excerpt,
        cover_image_url: db.posts.cover_image_url,
        published: db.posts.published,
        view_count: db.posts.view_count,
        created_at: db.posts.created_at,
        updated_at: db.posts.updated_at,
        published_at: db.posts.published_at,
        author_id: db.posts.author_id,
        author_name: db.users.name,
        author_email: db.users.email,
        author_avatar_url: db.users.avatar_url,
        author_bio: db.users.bio,
        author_id_full: db.users.id,
      })
      .from(db.posts)
      .leftJoin(db.users, eq(db.posts.author_id, db.users.id))
      .where(eq(db.posts.slug, input.slug))
      .limit(1)

    if (!postData || postData.length === 0) {
      return null
    }
    const post = postData[0]

    // 2. Fetch categories
    const categoryRows = await ctx.db
      .select({
        id: db.categories.id,
        name: db.categories.name,
        slug: db.categories.slug,
        description: db.categories.description,
      })
      .from(db.categories)
      .leftJoin(db.post_categories, eq(db.categories.id, db.post_categories.category_id))
      .where(eq(db.post_categories.post_id, post.id))
    
    // 3. Fetch tags
    const tagRows = await ctx.db
      .select({
        id: db.tags.id,
        name: db.tags.name,
        slug: db.tags.slug,
      })
      .from(db.tags)
      .leftJoin(db.post_tags, eq(db.tags.id, db.post_tags.tag_id))
      .where(eq(db.post_tags.post_id, post.id))

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      cover_image_url: post.cover_image_url,
      published: post.published,
      view_count: post.view_count,
      author: {
        id: post.author_id_full,
        name: post.author_name,
        email: post.author_email,
        avatar_url: post.author_avatar_url,
        bio: post.author_bio,
      },
      categories: categoryRows,
      tags: tagRows,
      created_at: post.created_at,
      updated_at: post.updated_at,
      published_at: post.published_at,
    }
  })
