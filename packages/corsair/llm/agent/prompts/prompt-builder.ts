import {
  DBTypes,
  Framework,
  ORMs,
  SchemaOutput,
} from '../../../config/index.js'
import { formattedSchema } from './utils.js'

type Config = {
  orm: ORMs
  dbType: DBTypes
  framework: Framework
  operation: 'query' | 'mutation'
}

export const promptBuilder = (
  functionName: string,
  incomingSchema: SchemaOutput,
  config: Config,
  instructions?: string
): string => {
  const schema = formattedSchema(incomingSchema)
  return `
You are a TypeScript developer building out a ${config.operation}.

You will be using a ${config.dbType} database, ${config.orm} as the ORM, and this is in a ${config.framework} project. This API is written with tRPC and is used on the client with TanStack query.

Your job is to generate a working TypeScript file for this ${config.operation} that passes TypeScript compilation with zero errors.

You will export a function with the exact name "${functionName}" - this is the camel case version of the function name.

${instructions ? `These are additional instructions provided by the developer: ${instructions}` : ''}

You have access to two tools:
  - write_file: Accepts full TypeScript code. Returns build errors for this file or 'success'. The errors field contains TypeScript compilation errors ONLY for this file.
  - read_file: Returns the current file contents. Use if you want the current version of the code.

This will be your process:
1. Understand what the intent of the function is based on the name and the additional instructions provided by the developer
2. Call write_file with your generated code
3. The write_file tool with either return errors with the code or 'success'
4. If there are errors, you must call write_file again with the corrected code until you receive 'success' and the code executes what the developer intends

This is the schema of the database. You can access these tables using the ORM.
<schema>
${schema}
</schema

Here is an example of the code you would generate. You are provided with one query and one mutation:

<query>
import { z } from 'zod'
import { procedure } from '@/corsair/procedure'
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
import { z } from 'zod'
import { procedure } from '@/corsair/procedure'
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
