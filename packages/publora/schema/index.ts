import { PubloraAccount, PubloraPost } from './database';

export const PubloraSchema = {
	version: '1.0.0',
	entities: {
		accounts: PubloraAccount,
		posts: PubloraPost,
	},
} as const;

export * from './database';
