import { DBTypes, Framework, ORMs, SchemaOutput } from '../../../config'
import { formattedSchema } from './utils'

type Config = {
  orm: ORMs
  dbType: DBTypes
  framework: Framework
  operation: 'query' | 'mutation'
}

export const agentPrompt = (
  request: string,
  incomingSchema: SchemaOutput,
  config: Config
): string => {
  const schema = formattedSchema(incomingSchema)
  return `
You are a TypeScript developer building out a ${config.operation}.

Your job is to generate the TypeScript file for this ${config.operation}.

You will be using a ${config.dbType} database, ${config.orm} as the ORM, and this is in a ${config.framework} project. This API is written with tRPC and is used on the client with TanStack query.

You have access to two tools:
  - write_file: This tool accepts TypeScript code (with imports at the top of the file). The code you give this tool is all of the code that is in the file. This tool will return any build errors found with your code.
  - read_file: This tool will return the current code in the file. You can use it at your discretion if you want to read the most recent state of a file. 

Here is an example of the code you would generate. You are provided with one query and one mutation:

<query>
import { z } from 'corsair'
import { procedure } from '../procedure'
import { eq } from 'drizzle-orm'

export const getAllPostsByAuthorId = procedure
  .input(
    z.object({
      authorId: z.string(),
    })
  )
  .query(async ({ input, ctx }) => {
    const postsByAuthor = await ctx.db
      .select()
      .from(ctx.db._.fullSchema.posts)
      .where(eq(ctx.db._.fullSchema.posts.author_id, input.authorId))

    return postsByAuthor
  })
</query>


<mutation>
import { z } from 'corsair'
import { procedure } from '../procedure'
import { eq, and } from 'drizzle-orm'

export const likePost = procedure
  .input(
    z.object({
      postId: z.string(),
      userId: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    // Check if the post is already liked by this user
    const existingLike = await ctx.db
      .select()
      .from(ctx.db._.fullSchema.likes)
      .where(
        and(
          eq(ctx.db._.fullSchema.likes.post_id, input.postId),
          eq(ctx.db._.fullSchema.likes.user_id, input.userId)
        )
      )
      .limit(1)

    // If already liked, return true without creating a duplicate
    if (existingLike.length > 0) {
      return { success: true, alreadyLiked: true }
    }

    // Create the new like
    const [newLike] = await ctx.db
      .insert(ctx.db._.fullSchema.likes)
      .values({
        post_id: input.postId,
        user_id: input.userId,
      })
      .returning()

    return { success: true, alreadyLiked: false, like: newLike }
  })
</mutation>


`
}
