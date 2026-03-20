import { z } from 'zod';

export const FirefliesTranscript = z.object({
	id: z.string(),
	title: z.string().nullable().optional(),
	// date is Float (Unix ms timestamp) in Fireflies; coerce to Date for storage
	date: z.coerce.date().nullable().optional(),
	duration: z.number().nullable().optional(),
	host_email: z.string().nullable().optional(),
	organizer_email: z.string().nullable().optional(),
	calendar_id: z.string().nullable().optional(),
	transcript_url: z.string().nullable().optional(),
	meeting_link: z.string().nullable().optional(),
	video_url: z.string().nullable().optional(),
	audio_url: z.string().nullable().optional(),
	privacy: z.string().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const FirefliesUser = z.object({
	user_id: z.string(),
	email: z.string().nullable().optional(),
	name: z.string().nullable().optional(),
	num_transcripts: z.number().nullable().optional(),
	minutes_consumed: z.number().nullable().optional(),
	is_admin: z.boolean().nullable().optional(),
	integrations: z.array(z.string()).nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const FirefliesAskFredThread = z.object({
	id: z.string(),
	title: z.string().nullable().optional(),
	transcript_id: z.string().nullable().optional(),
	user_id: z.string().nullable().optional(),
	created_at: z.string().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type FirefliesTranscript = z.infer<typeof FirefliesTranscript>;
export type FirefliesUser = z.infer<typeof FirefliesUser>;
export type FirefliesAskFredThread = z.infer<typeof FirefliesAskFredThread>;
