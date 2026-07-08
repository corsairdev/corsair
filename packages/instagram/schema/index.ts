import { z } from 'zod';

import { CommentsOutputSchema } from '../endpoints/types';

import {
	InstagramConversation,
	InstagramMedia,
	InstagramMessage,
	InstagramUser,
} from './database';

export const InstagramCredentials = z.object({
	clientId: z.string(),
	clientSecret: z.string(),
	accessToken: z.string(),
});

export type InstagramCredentials = z.infer<typeof InstagramCredentials>;

export const InstagramSchema = {
	version: '1.0.0',
	entities: {
		users: InstagramUser,
		conversations: InstagramConversation,
		messages: InstagramMessage,
		media: InstagramMedia,
		comments: CommentsOutputSchema,
	},
} as const;
