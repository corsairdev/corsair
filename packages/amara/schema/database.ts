import { z } from 'zod';

export const AmaraVideo = z.object({
	id: z.string(),
	title: z.string().optional(),
	description: z.string().nullable().optional(),
	duration: z.number().nullable().optional(),
	thumbnail: z.string().nullable().optional(),
	team: z.string().nullable().optional(),
	project: z.string().nullable().optional(),
	primary_audio_language_code: z.string().nullable().optional(),
	video_type: z.string().nullable().optional(),
	all_urls: z.array(z.string()).optional(),
	resource_uri: z.string().optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

export const AmaraUser = z.object({
	id: z.string(),
	username: z.string().optional(),
	full_name: z.string().nullable().optional(),
	first_name: z.string().nullable().optional(),
	last_name: z.string().nullable().optional(),
	biography: z.string().nullable().optional(),
	homepage: z.string().nullable().optional(),
	avatar: z.string().nullable().optional(),
	languages: z.array(z.string()).optional(),
	num_videos: z.number().optional(),
	resource_uri: z.string().optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

export const AmaraTeam = z.object({
	slug: z.string(),
	name: z.string().optional(),
	type: z.string().nullable().optional(),
	description: z.string().nullable().optional(),
	membership_policy: z.string().nullable().optional(),
	video_policy: z.string().nullable().optional(),
	is_visible: z.boolean().optional(),
	resource_uri: z.string().optional(),
	fetchedAt: z.coerce.date().nullable().optional(),
});

export type AmaraVideo = z.infer<typeof AmaraVideo>;
export type AmaraUser = z.infer<typeof AmaraUser>;
export type AmaraTeam = z.infer<typeof AmaraTeam>;
