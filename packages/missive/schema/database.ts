import { z } from 'zod';

// Stored entities follow the shipped Part 1 operations: contacts sync and
// conversation tracking are the workflows the read/write endpoints serve.

// Missive contact responses vary by infos kind and membership; keep the
// fields used across sync workflows typed and retain provider-specific
// additions for persistence.
export const MissiveContactEntitySchema = z
	.object({
		id: z.string().optional(),
		first_name: z.string().nullish(),
		last_name: z.string().nullish(),
		notes: z.string().nullish(),
		starred: z.boolean().nullish(),
		contact_book: z.string().optional(),
		deleted: z.boolean().optional(),
		modified_at: z.number().int().optional(),
	})
	.catchall(z.unknown()); // Contact infos/memberships vary per kind; preserve provider additions.

export const MissiveConversationEntitySchema = z
	.object({
		id: z.string().optional(),
		created_at: z.number().int().optional(),
		subject: z.string().nullish(),
		latest_message_subject: z.string().nullish(),
		color: z.string().nullish(),
		messages_count: z.number().int().optional(),
		last_activity_at: z.number().int().optional(),
		web_url: z.string().optional(),
	})
	.catchall(z.unknown()); // Conversation users/team/labels vary; preserve provider additions.
