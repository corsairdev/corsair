import { CannyBoard, CannyComment, CannyPost, CannyVote } from './database';

export const CannySchema = {
	version: '1.0.0',
	entities: {
		boards: CannyBoard,
		posts: CannyPost,
		comments: CannyComment,
		votes: CannyVote,
	},
} as const;

export * from './database';
