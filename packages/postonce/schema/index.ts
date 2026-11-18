import { PostOnceAccount, PostOncePost } from './database';

export const PostOnceSchema = {
	version: '1.0.0',
	entities: {
		accounts: PostOnceAccount,
		posts: PostOncePost,
	},
} as const;

export * from './database';
