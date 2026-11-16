import { z } from 'zod';
import { optNum, optStr, teamIdInput } from './common';

const edgeConfigId = z
	.string()
	.min(1)
	.describe('Edge Config id (ecfg_…), as listed by getEdgeConfigs.');

const itemKey = z
	.string()
	.min(1)
	.max(256)
	.regex(/^[\w-]+$/, 'Keys use letters, digits, _ and - only.')
	.describe('Item key: letters, digits, _ and -, up to 256 characters.');

// Edge Config item values are arbitrary JSON by Vercel's definition.
const itemValue = z
	.unknown()
	.describe('Any JSON value: string, number, boolean, object, array or null.');

const itemDescription = z
	.string()
	.max(512)
	.nullable()
	.optional()
	.describe('Note on the item (up to 512 characters). null clears it.');

// Only presence is checked; value is arbitrary JSON.
const hasValueOrDescription = (
	item: { value?: unknown; description?: unknown },
	ctx: z.RefinementCtx,
) => {
	if (item.value === undefined && item.description === undefined) {
		ctx.addIssue({
			code: 'custom',
			message: 'Give value, description or both.',
			path: ['value'],
		});
	}
};

const EdgeConfigItemChange = z.discriminatedUnion('operation', [
	z
		.object({
			operation: z.literal('create'),
			key: itemKey,
			value: itemValue,
			description: itemDescription,
		})
		// z.unknown() lets a missing key through on some Zod 4 releases, so
		// check presence explicitly. null is a valid JSON value; undefined isn't.
		.superRefine((item, ctx) => {
			if (item.value === undefined) {
				ctx.addIssue({
					code: 'custom',
					message: 'create needs a value.',
					path: ['value'],
				});
			}
		}),
	z
		.object({
			operation: z.enum(['update', 'upsert']),
			key: itemKey,
			value: itemValue.optional(),
			description: itemDescription,
		})
		.superRefine(hasValueOrDescription),
	z.object({
		operation: z.literal('delete'),
		key: itemKey,
	}),
]);

export const EdgeConfigSchema = z
	.object({
		id: z.string(),
		slug: optStr(),
		ownerId: optStr(),
		digest: optStr(),
		itemCount: optNum(),
		sizeInBytes: optNum(),
		createdAt: optNum(),
		updatedAt: optNum(),
		createdBy: optStr(),
	})
	.passthrough();

export const EdgeConfigItemSchema = z
	.object({
		key: z.string(),
		// Item values are arbitrary JSON by Vercel's definition.
		value: z.unknown().optional(),
		description: optStr(),
		edgeConfigId: optStr(),
		createdAt: optNum(),
		updatedAt: optNum(),
	})
	.passthrough();

export const VercelEdgeConfigInputSchemas = {
	getEdgeConfigs: z.object({
		teamId: teamIdInput,
	}),
	getEdgeConfig: z.object({
		teamId: teamIdInput,
		edgeConfigId,
	}),
	getEdgeConfigItems: z.object({
		teamId: teamIdInput,
		edgeConfigId,
	}),
	getEdgeConfigItem: z.object({
		teamId: teamIdInput,
		edgeConfigId,
		key: z.string().min(1).describe('Key of the item to read.'),
	}),
	updateEdgeConfigItems: z.object({
		teamId: teamIdInput,
		edgeConfigId,
		items: z
			.array(EdgeConfigItemChange)
			.min(1)
			.describe(
				'Changes applied together: create (fails if the key exists), update (fails if it doesn’t), upsert, or delete.',
			),
	}),
} as const;

export const VercelEdgeConfigOutputSchemas = {
	getEdgeConfigs: z.array(EdgeConfigSchema),
	getEdgeConfig: EdgeConfigSchema,
	getEdgeConfigItems: z.array(EdgeConfigItemSchema),
	getEdgeConfigItem: z.object({
		found: z
			.boolean()
			.describe('false when the Edge Config has no item with this key.'),
		item: EdgeConfigItemSchema.nullable(),
	}),
	updateEdgeConfigItems: z.object({ status: optStr() }).passthrough(),
} as const;

export type VercelEdgeConfigInputs = {
	[K in keyof typeof VercelEdgeConfigInputSchemas]: z.input<
		(typeof VercelEdgeConfigInputSchemas)[K]
	>;
};
export type VercelEdgeConfigOutputs = {
	[K in keyof typeof VercelEdgeConfigOutputSchemas]: z.infer<
		(typeof VercelEdgeConfigOutputSchemas)[K]
	>;
};
