import { z } from 'zod'
import { procedure } from '@/corsair/procedure'

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
    const post = await ctx.db.post.findUnique({
      where: {
        slug: input.slug,
      },
      include: {
        author: true,
        postCategories: {
          include: {
            category: true,
          },
        },
        postTags: {
          include: {
            tag: true,
          },
        },
      },
    })

    if (!post) {
      return null
    }

    return {
      id: post.id,
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      cover_image_url: post.coverImageUrl,
      published: post.published,
      view_count: post.viewCount,
      author: {
        id: post.author.id,
        name: post.author.name,
        email: post.author.email,
        avatar_url: post.author.avatarUrl,
        bio: post.author.bio,
      },
      categories: post.postCategories.map(pc => ({
        id: pc.category.id,
        name: pc.category.name,
        slug: pc.category.slug,
        description: pc.category.description,
      })),
      tags: post.postTags.map(pt => ({
        id: pt.tag.id,
        name: pt.tag.name,
        slug: pt.tag.slug,
      })),
      created_at: post.createdAt,
      updated_at: post.updatedAt,
      published_at: post.publishedAt,
    }
  })
