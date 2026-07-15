import { LinkedInUser } from './database';

export const LinkedInSchema = {
	version: '1.0.0',
	entities: {
		users: LinkedInUser,
	},
} as const;
