import { z } from 'zod';

export const BlueskyPost = z.object({
	uri: z.string().describe('The AT Protocol URI of the post'),
	cid: z.string().describe('The content identifier (CID) of the post'),
	text: z.string().describe('The text content of the post'),
	createdAt: z.string().describe('The creation timestamp of the post'),
	authorDid: z.string().optional().describe('The DID of the author'),
});

export type BlueskyPost = z.infer<typeof BlueskyPost>;
