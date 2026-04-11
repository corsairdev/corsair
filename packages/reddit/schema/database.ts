import { z } from 'zod';

export const RedditPost = z.object({
	id: z.string(),
	name: z.string().optional(),
	title: z.string().optional(),
	selftext: z.string().optional(),
	author: z.string().optional(),
	subreddit: z.string().optional(),
	score: z.number().optional(),
	ups: z.number().optional(),
	downs: z.number().optional(),
	upvote_ratio: z.number().optional(),
	num_comments: z.number().optional(),
	url: z.string().optional(),
	permalink: z.string().optional(),
	thumbnail: z.string().optional(),
	over_18: z.boolean().optional(),
	spoiler: z.boolean().optional(),
	stickied: z.boolean().optional(),
	created_utc: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const RedditComment = z.object({
	id: z.string(),
	name: z.string().optional(),
	body: z.string().optional(),
	author: z.string().optional(),
	score: z.number().optional(),
	depth: z.number().optional(),
	parent_id: z.string().optional(),
	link_id: z.string().optional(),
	created_utc: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const RedditSubreddit = z.object({
	id: z.string(),
	name: z.string().optional(),
	display_name: z.string().optional(),
	title: z.string().optional(),
	public_description: z.string().optional(),
	subscribers: z.number().optional(),
	active_user_count: z.number().optional(),
	over18: z.boolean().optional(),
	created_utc: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const RedditUser = z.object({
	id: z.string(),
	name: z.string().optional(),
	link_karma: z.number().optional(),
	comment_karma: z.number().optional(),
	total_karma: z.number().optional(),
	is_suspended: z.boolean().optional(),
	created_utc: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type RedditPost = z.infer<typeof RedditPost>;
export type RedditComment = z.infer<typeof RedditComment>;
export type RedditSubreddit = z.infer<typeof RedditSubreddit>;
export type RedditUser = z.infer<typeof RedditUser>;
