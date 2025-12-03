import { z } from 'zod'
import { procedure } from '@/corsair/procedure'

/**
 * INPUT: { title: string, content: string, excerpt?: string, coverImageUrl?: string, authorId: string }
 * OUTPUT: {
 *   id: string,
 *   title: string,
 *   slug: string,
 *   content: string,
 *   excerpt: string,
 *   coverImageUrl: string | null,
 *   published: boolean,
 *   viewCount: number,
 *   authorId: string,
 *   createdAt: Date,
 *   updatedAt: Date,
 *   publishedAt: Date
 * }
 * 
 * PSEUDO CODE:
 * 1. Accept title, content, excerpt (optional), coverImageUrl (optional), and authorId as input parameters
 * 2. Generate a URL-friendly slug from the title
 * 3. Insert a new post with the given input, the generated slug, published set to true, publishedAt set to the current date, viewCount set to 0
 * 4. Return the created post
 * 
 * USER INSTRUCTIONS: create a new blog post with title, content, excerpt (optional), coverImageUrl (optional), and authorId. Generate a slug from the title. Set published to true and publishedAt to current date.
 */
export const createPost = procedure
  .input(
    z.object({
      title: z.string(),
      content: z.string(),
      excerpt: z.string().optional(),
      coverImageUrl: z.string().optional(),
      authorId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    // Helper function for slug generation
    function slugify(str: string): string {
      return str
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-');
    }
    const slug = slugify(input.title);
    const now = new Date();

    const post = await ctx.db.post.create({
      data: {
        title: input.title,
        slug,
        content: input.content,
        excerpt: input.excerpt ?? '',
        coverImageUrl: input.coverImageUrl ?? null,
        published: true,
        viewCount: 0,
        authorId: input.authorId,
        createdAt: now,
        updatedAt: now,
        publishedAt: now,
      }
    });

    return post;
  })
