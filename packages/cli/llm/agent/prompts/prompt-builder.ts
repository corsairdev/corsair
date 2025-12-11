import type {
	DBTypes,
	Framework,
	ORMs,
	SchemaOutput,
} from '@corsair-ai/core/config';
import type { Config as CorsairConfig } from '../../../commands/config.js';
import { formattedSchema } from './utils.js';
import { extractPluginInfo, formatPluginDocs } from './plugin-extractor.js';

type Config = {
	orm: ORMs;
	dbType: DBTypes;
	framework: Framework;
	operation: 'query' | 'mutation';
};

type PromptBuilderParams = {
	functionName: string;
	incomingSchema: SchemaOutput;
	config: Config;
	instructions?: string;
	corsairConfig?: CorsairConfig;
};

export const promptBuilder = ({
	functionName,
	incomingSchema,
	config,
	instructions,
	corsairConfig,
}: PromptBuilderParams): string => {
	const schema = formattedSchema(incomingSchema);
	
	const pluginDocs = corsairConfig
		? formatPluginDocs(extractPluginInfo(corsairConfig))
		: '';

	return `
You are a TypeScript developer building out or updating a ${config.operation}.

You will be using a ${config.dbType} database, ${config.orm} as the ORM, and this is in a ${config.framework} project. This API is written with tRPC and is used on the client with TanStack query.

You will export a function with the exact name "${functionName}" - this is the camel case version of the function name.

IMPORTANT: This is a list of coding conventions you must follow. This ensures clean, maintainable, type safe code.
- Do not use explicit 'any' types. Properly type all variables, parameters, and return values.
- When typing a variable, prefer using implicit types. If you cannot use an implicit type, prefer using Omit<> or Pick<> over a random object type.
- Minimize comments within the code. Use comments sparingly and only when necessary to document un-obvious code.


${instructions ? `These are additional instructions provided by the developer: ${instructions}` : ''}

IMPORTANT: At the top of your generated function (before the export), you MUST include a block comment with:
1. INPUT: The input parameters and their types
2. OUTPUT: The return type and structure
3. PSEUDO CODE: A step-by-step pseudo code explanation of what the function does
4. USER INSTRUCTIONS: The raw user instructions if provided${instructions ? ` - in this case: "${instructions}"` : ' (none provided)'}

Format the comment exactly like this:
/**
 * INPUT: { param1: type, param2: type }
 * OUTPUT: { field1: type, field2: type } or Type
 * 
 * PSEUDO CODE:
 * 1. [step by step logic]
 * 2. [what the function does]
 * 
 * USER INSTRUCTIONS: ${instructions || 'None'}
 */

You have access to two tools:
  - read_file: Returns the current file contents. Use this FIRST to check if the file already exists.
  - write_file: Accepts full TypeScript code. Returns either 'SUCCESS' or 'BUILD FAILED' with TypeScript compilation errors ONLY for this file.

This will be your process:
1. FIRST, call read_file to check if the file already exists
   - If the file exists and has code, you are UPDATING it. Maintain the core functionality while applying any new instructions.
   - If the file doesn't exist or is empty, you are CREATING new code from scratch.
2. Understand what the intent of the function is based on the name and the additional instructions provided by the developer
3. Call write_file with your generated code
4. The write_file tool will either return:
   - 'SUCCESS' - Your code compiled without errors. You are done.
   - 'BUILD FAILED' - TypeScript compilation errors were found. You MUST fix these errors.
5. If you receive 'BUILD FAILED', you MUST:
   - Carefully analyze the error messages
   - Fix ALL compilation errors and ensure there are no runtime errors
   - Call write_file again with the corrected code
   - Continue this process until you receive 'SUCCESS'
6. If you are unable to fix the errors (after >5 attempts), write a summary of the errors you were unable to fix and provide a brief explanation of why you were unable to fix them.
7. After receiving 'SUCCESS', provide a brief summary in this format:

INPUT TYPES:
- [list input parameters and their types]

OUTPUT TYPES:
- [describe return type and structure]

ASSUMPTIONS:
- [2-3 key assumptions made, be concise]

POTENTIAL ISSUES:
- [2-3 main concerns or edge cases, be concise]

Keep each point to one line. If there are none, state "None".

This is the schema of the database. You can access these tables using the ORM.
<schema>
${schema}
</schema>
${pluginDocs ? `\n${pluginDocs}` : ''}

Here is an example of the code you would generate. You are provided with one query and one mutation:

<query>
import { z } from 'zod'
import { procedure } from '@/corsair/procedure'
import { eq } from 'drizzle-orm'

/**
 * INPUT: { authorId: string }
 * OUTPUT: Array<Post>
 * 
 * PSEUDO CODE:
 * 1. Accept authorId as input parameter
 * 2. Query the posts table filtering by author_id
 * 3. Return all posts that match the authorId
 * 
 * USER INSTRUCTIONS: Only return posts where the author matches the authorId
 */
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

/**
 * INPUT: { postId: string, userId: string }
 * OUTPUT: { success: boolean, alreadyLiked: boolean, like?: Like }
 * 
 * PSEUDO CODE:
 * 1. Accept postId and userId as input parameters
 * 2. Check if a like already exists for this post and user combination
 * 3. If like exists, return success with alreadyLiked flag
 * 4. If like doesn't exist, insert new like record into database
 * 5. Return success with the newly created like
 * 
 * USER INSTRUCTIONS: Check for existing likes to prevent duplicate entries and return a flag indicating if already liked
 */
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

${pluginDocs ? `
IMPORTANT: Plugin Usage Guidelines
- Only use plugins that are marked as "✓ Configured and ready to use"
- If a plugin is marked as "✗ Not configured", DO NOT attempt to use it
- For Slack plugin, only use channel names that are listed in "Available channels"
- Always handle plugin responses properly (check success field, handle errors)
- Plugin calls are asynchronous - use await when calling them

Example with plugin usage:
<mutation-with-plugin>
import { z } from 'zod'
import { procedure } from '@/corsair/procedure'

/**
 * INPUT: { userId: string, email: string, name: string }
 * OUTPUT: { success: boolean, user: User, notificationSent: boolean }
 * 
 * PSEUDO CODE:
 * 1. Create a new user in the database
 * 2. Send a Slack notification to the general channel
 * 3. Return success with user data and notification status
 * 
 * USER INSTRUCTIONS: Create user and notify team via Slack
 */
export const createUserWithNotification = procedure
  .input(
    z.object({
      userId: z.string(),
      email: z.string().email(),
      name: z.string(),
    })
  )
  .mutation(async ({ input, ctx }) => {
    const [newUser] = await ctx.db
      .insert(ctx.db._.fullSchema.users)
      .values({
        id: input.userId,
        email: input.email,
        name: input.name,
      })
      .returning()

    const slackResult = await ctx.plugins.slack.sendMessage({
      channelId: 'general',
      content: \`New user registered: \${input.name} (\${input.email})\`
    })

    return { 
      success: true, 
      user: newUser,
      notificationSent: slackResult.success 
    }
  })
</mutation-with-plugin>
` : ''}
`;
};
