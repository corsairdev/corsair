import type {
	CorsairDBPlugin,
	CorsairPluginDBSchema,
} from '@corsair-ai/core/db';
import * as z from 'zod';

/**
 * Slack member record shape (runtime validation / type inference).
 */
export const slackMemberSchema = z.object({
	id: z.string(),
	createdAt: z.date().default(() => new Date()),
	updatedAt: z.date().default(() => new Date()),
	teamId: z.string(),
	slackId: z.string(),
	name: z.string().nullish(),
	realName: z.string().nullish(),
	email: z.string().email().nullish(),
	image: z.string().url().nullish(),
	isBot: z.boolean().default(false),
	deleted: z.boolean().default(false),
});

export type SlackMember = z.infer<typeof slackMemberSchema>;

/**
 * Slack plugin DB schema fragment.
 *
 * This is designed to be merged into core tables via `getCorsairTables({ plugins })`.
 */
export const slackDbSchema = {
	slackMember: {
		modelName: 'slackMember',
		fields: {
			teamId: {
				type: 'string',
				required: true,
				fieldName: 'teamId',
				sortable: true,
			},
			slackId: {
				type: 'string',
				required: true,
				fieldName: 'slackId',
				unique: true,
				sortable: true,
			},
			name: { type: 'string', required: false, fieldName: 'name' },
			realName: { type: 'string', required: false, fieldName: 'realName' },
			email: { type: 'string', required: false, fieldName: 'email' },
			image: { type: 'string', required: false, fieldName: 'image' },
			isBot: {
				type: 'boolean',
				required: true,
				defaultValue: false,
				fieldName: 'isBot',
			},
			deleted: {
				type: 'boolean',
				required: true,
				defaultValue: false,
				fieldName: 'deleted',
			},
			createdAt: {
				type: 'date',
				required: true,
				defaultValue: () => new Date(),
				fieldName: 'createdAt',
			},
			updatedAt: {
				type: 'date',
				required: true,
				defaultValue: () => new Date(),
				onUpdate: () => new Date(),
				fieldName: 'updatedAt',
			},
		},
	},
} satisfies CorsairPluginDBSchema;

export const slackDbPlugin = {
	id: 'slack',
	schema: slackDbSchema,
	$Infer: {
		SlackMember: {} as SlackMember,
	},
} satisfies CorsairDBPlugin;
