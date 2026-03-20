import z from 'zod';

// Normalizes unix timestamps (number), numeric strings, and ISO date strings to a number.
// Returns undefined for null/undefined/unparseable values so optional fields stay clean.
const timestamp = z.preprocess((val) => {
	if (val === null || val === undefined) return undefined;
	if (typeof val === 'number' && !isNaN(val)) return val;
	if (typeof val === 'string') {
		const ms = new Date(val).getTime();
		if (!isNaN(ms)) return Math.floor(ms / 1000);
	}
	return undefined;
}, z.number().optional());

export const IntercomContact = z.object({
	id: z.string(),
	type: z.string().optional(),
	external_id: z.string().nullable().optional(),
	user_id: z.string().nullable().optional(),
	email: z.string().optional(),
	name: z.string().nullable().optional(),
	phone: z.string().nullable().optional(),
	role: z.string().optional(),
	created_at: timestamp,
	updated_at: timestamp,
	last_seen_at: timestamp,
	last_replied_at: timestamp,
	signed_up_at: timestamp,
	unsubscribed_from_emails: z.boolean().optional(),
	has_hard_bounced: z.boolean().optional(),
	marked_email_as_spam: z.boolean().optional(),
	browser: z.string().optional(),
	browser_language: z.string().optional(),
	os: z.string().optional(),
	location: z
		.object({
			city: z.string().optional(),
			country: z.string().optional(),
			region: z.string().optional(),
		})
		.optional(),
	avatar: z
		.object({
			image_url: z.string().optional(),
		})
		.optional(),
	owner_id: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const IntercomConversation = z.object({
	id: z.string(),
	type: z.string().optional(),
	created_at: timestamp,
	updated_at: timestamp,
	waiting_since: timestamp,
	snoozed_until: timestamp,
	state: z.string().optional(),
	read: z.boolean().optional(),
	priority: z.string().optional(),
	admin_assignee_id: z.number().nullable().optional(),
	team_assignee_id: z.string().nullable().optional(),
	contact_id: z.string().optional(),
	source_type: z.string().optional(),
	source_subject: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const IntercomCompany = z.object({
	id: z.string(),
	type: z.string().optional(),
	company_id: z.string().optional(),
	name: z.string().optional(),
	created_at: timestamp,
	updated_at: timestamp,
	remote_created_at: timestamp,
	last_request_at: timestamp,
	monthly_spend: z.number().optional(),
	session_count: z.number().optional(),
	user_count: z.number().optional(),
	size: z.number().nullable().optional(),
	website: z.string().nullable().optional(),
	industry: z.string().nullable().optional(),
	plan: z
		.object({
			id: z.string().optional(),
			name: z.string().optional(),
		})
		.optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const IntercomArticle = z.object({
	id: z.string(),
	type: z.string().optional(),
	title: z.string().optional(),
	description: z.string().nullable().optional(),
	body: z.string().nullable().optional(),
	author_id: z.coerce.number().optional(),
	state: z.string().optional(),
	created_at: timestamp,
	updated_at: timestamp,
	url: z.string().nullable().optional(),
	parent_id: z.number().nullable().optional(),
	parent_type: z.string().nullable().optional(),
	default_locale: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const IntercomAdmin = z.object({
	id: z.string(),
	type: z.string().optional(),
	name: z.string().optional(),
	email: z.string().optional(),
	away_mode_enabled: z.boolean().optional(),
	away_mode_reassign: z.boolean().optional(),
	has_inbox_seat: z.boolean().optional(),
	team_ids: z.array(z.number()).optional(),
	avatar: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type IntercomContact = z.infer<typeof IntercomContact>;
export type IntercomConversation = z.infer<typeof IntercomConversation>;
export type IntercomCompany = z.infer<typeof IntercomCompany>;
export type IntercomArticle = z.infer<typeof IntercomArticle>;
export type IntercomAdmin = z.infer<typeof IntercomAdmin>;
