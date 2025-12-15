import type { SchemaOutput } from '@corsair-ai/core/config';
import { promptAgent } from '..';
import { promptBuilder } from '../prompts/prompt-builder';

export const testSchema: SchemaOutput = {
	users: {
		id: { type: 'uuid' },
		email: { type: 'text' },
		username: { type: 'text' },
		full_name: { type: 'text' },
		bio: { type: 'text' },
		avatar_url: { type: 'text' },
		created_at: { type: 'timestamp' },
		updated_at: { type: 'timestamp' },
	},
	posts: {
		id: { type: 'uuid' },
		title: { type: 'text' },
		content: { type: 'text' },
		author_id: { type: 'uuid' },
		published: { type: 'boolean' },
		created_at: { type: 'timestamp' },
		updated_at: { type: 'timestamp' },
	},
	comments: {
		id: { type: 'uuid' },
		content: { type: 'text' },
		post_id: { type: 'uuid' },
		author_id: { type: 'uuid' },
		created_at: { type: 'timestamp' },
		updated_at: { type: 'timestamp' },
	},
	likes: {
		id: { type: 'uuid' },
		post_id: { type: 'uuid' },
		user_id: { type: 'uuid' },
		created_at: { type: 'timestamp' },
	},
};

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

const request = 'give me all tracks by artist id';

const pwd = '';

const result = await promptAgent(pwd, {
	queriesDir: '',
	mutationsDir: '',
}).generate({
	prompt: promptBuilder({
		functionName: request,
		incomingSchema: testSchema,
		config: {
			dbType: 'postgres',
			framework: 'nextjs',
			operation: 'mutation',
			orm: 'drizzle',
		},
	}),
});

console.log(result.text);
console.log(result.steps);
