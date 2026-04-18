import {
	RedditComment,
	RedditPost,
	RedditSubreddit,
	RedditUser,
} from './database';

export const RedditSchema = {
	version: '1.0.0',
	entities: {
		posts: RedditPost,
		comments: RedditComment,
		subreddits: RedditSubreddit,
		users: RedditUser,
	},
} as const;
