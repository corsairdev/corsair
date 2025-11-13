import type { SchemaDefinition } from '../../cli/watch/types/state.js'

export const operationGeneratorPrompt = ({
  type,
  name,
  schema,
}: {
  type: 'query' | 'mutation'
  name: string
  schema: SchemaDefinition
}): string => {
  const schemaDescription = generateSchemaDescription(schema)

  return `# ${type === 'query' ? 'Query' : 'Mutation'} Generation Request

## Operation Details
- **Type**: ${type}
- **Name**: "${name}"
- **Description**: Generate a ${type} handler that implements the functionality described by the operation name

## Database Schema
${schemaDescription}

## Requirements
1. **Input Type**: Create a Zod schema that validates the input parameters needed for this ${type}
2. **Handler Function**: Implement the complete async handler that:
   - Uses the provided database context (ctx.db, ctx.schema)
   - Follows Drizzle ORM patterns
   - Handles the specific requirements implied by the operation name "${name}"
   - Includes proper error handling and validation
   - Returns appropriate data types

## Operation Name Analysis
Based on the operation name "${name}", determine:
- What database tables are involved
- What input parameters are needed
- What operations should be performed (select, insert, update, delete, joins)
- What relationships need to be handled
- What the expected return type should be

## Implementation Guidelines
- For queries: Focus on data retrieval, filtering, searching, and joining
- For mutations: Focus on data modification (create, update, delete)
- Use appropriate Drizzle ORM methods and patterns
- Include proper TypeScript types and error handling
- Optimize for performance and security

## Few-Shot Examples (adapt names to your schema)

### Query: get-posts-by-user-id
Input:
\`\`\`typescript
z.object({ userId: z.string() })
\`\`\`
Handler outline:
\`\`\`typescript
const results = await ctx.db
  .select({
    postId: ctx.schema.posts.columns.id,
    title: ctx.schema.posts.columns.title,
    authorId: ctx.schema.users.columns.id,
    authorName: ctx.schema.users.columns.name,
  })
  .from(ctx.db._.fullSchema.posts)
  .innerJoin(
    ctx.db._.fullSchema.users,
    eq(ctx.schema.posts.columns.user_id, ctx.schema.users.columns.id)
  )
  .where(eq(ctx.schema.posts.columns.user_id, input.userId));
return results;
\`\`\`

### Query: get-comments-for-post-id
Input:
\`\`\`typescript
z.object({ postId: z.string() })
\`\`\`
Handler outline:
\`\`\`typescript
const comments = await ctx.db
  .select({
    commentId: ctx.schema.comments.columns.id,
    body: ctx.schema.comments.columns.body,
    postId: ctx.schema.comments.columns.post_id,
    author: {
      id: ctx.schema.users.columns.id,
      name: ctx.schema.users.columns.name,
    },
  })
  .from(ctx.db._.fullSchema.comments)
  .innerJoin(
    ctx.db._.fullSchema.users,
    eq(ctx.schema.comments.columns.user_id, ctx.schema.users.columns.id)
  )
  .where(eq(ctx.schema.comments.columns.post_id, input.postId));
return comments;
\`\`\`

### Mutation: create-post
Input:
\`\`\`typescript
z.object({
  userId: z.string(),
  title: z.string().min(1),
  body: z.string().min(1),
})
\`\`\`
Handler outline:
\`\`\`typescript
const [post] = await ctx.db
  .insert(ctx.db._.fullSchema.posts)
  .values({
    user_id: input.userId,
    title: input.title,
    body: input.body,
  })
  .returning();
return post;
\`\`\`

Guidance: Use your actual table and column names from the schema above.

Additionally, include:
- A brief but thorough pseudocode section (inputs, steps, outputs)
- A unique, concise function name suggestion for naming a file

Generate the input_type Zod schema and handler function for this ${type} operation.`
}

function generateSchemaDescription(schema: SchemaDefinition): string {
  if (!schema || !schema.tables || schema.tables.length === 0) {
    return 'No schema information available.'
  }

  let description = '### Database Tables and Schema\n\n'

  schema.tables.forEach(table => {
    description += `#### Table: \`${table.name}\`\n`

    if (table.columns && table.columns.length > 0) {
      description += '**Columns:**\n'
      table.columns.forEach(column => {
        const references = column.references
          ? ` [REFERENCES ${column.references.table}.${column.references.column}]`
          : ''
        description += `- \`${column.name}\`: ${column.type}${references}\n`
      })
    }

    description += '\n'
  })

  // Add relationship information based on references
  const relationships: string[] = []
  schema.tables.forEach(table => {
    table.columns.forEach(column => {
      if (column.references) {
        relationships.push(
          `- \`${table.name}\` belongs to \`${column.references.table}\` (via \`${column.name}\` → \`${column.references.column}\`)`
        )
      }
    })
  })

  if (relationships.length > 0) {
    description += '### Relationships\n\n'
    description +=
      'Based on the foreign key references, these tables are related:\n'
    relationships.forEach(rel => {
      description += rel + '\n'
    })
    description += '\n'
  }

  // Add usage examples for common patterns
  description += '### Common Usage Patterns\n\n'
  description += 'Use these table references in your handler:\n'
  schema.tables.forEach(table => {
    description += `- \`ctx.schema.${table.name}\` for the ${table.name} table\n`
  })

  return description
}
