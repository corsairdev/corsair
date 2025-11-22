import { promptAgent } from '..'
import type { SchemaOutput } from '../../../config'
import { promptBuilder } from '../prompts/prompt-builder'

export const testSchema: SchemaOutput = {
  users: {
    id: { dataType: 'uuid' },
    email: { dataType: 'text' },
    username: { dataType: 'text' },
    full_name: { dataType: 'text' },
    bio: { dataType: 'text' },
    avatar_url: { dataType: 'text' },
    created_at: { dataType: 'timestamp' },
    updated_at: { dataType: 'timestamp' },
  },
  posts: {
    id: { dataType: 'uuid' },
    title: { dataType: 'text' },
    content: { dataType: 'text' },
    author_id: { dataType: 'uuid', references: 'users.id' },
    published: { dataType: 'boolean' },
    created_at: { dataType: 'timestamp' },
    updated_at: { dataType: 'timestamp' },
  },
  comments: {
    id: { dataType: 'uuid' },
    content: { dataType: 'text' },
    post_id: { dataType: 'uuid', references: 'posts.id' },
    author_id: { dataType: 'uuid', references: 'users.id' },
    created_at: { dataType: 'timestamp' },
    updated_at: { dataType: 'timestamp' },
  },
  likes: {
    id: { dataType: 'uuid' },
    post_id: { dataType: 'uuid', references: 'posts.id' },
    user_id: { dataType: 'uuid', references: 'users.id' },
    created_at: { dataType: 'timestamp' },
  },
}

// console.log('Generated Schema Description:')
// console.log('='.repeat(50))
// console.log(
//   promptBuilder('', testSchema, {
//     dbType: 'postgres',
//     orm: 'drizzle',
//     framework: 'nextjs',
//     operation: 'query',
//   })
// )
// console.log('='.repeat(50))

const request = 'give me all tracks by artist id'

const pwd = ''

const result = await promptAgent(pwd).generate({
  prompt: promptBuilder(request, testSchema, {
    dbType: 'postgres',
    framework: 'nextjs',
    operation: 'mutation',
    orm: 'drizzle',
  }),
})

console.log(result.text) // agent's final answer
console.log(result.steps) // steps taken by the agent
