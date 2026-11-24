import { z } from 'zod';
import type { MixpanelCredentials, MixpanelRequest } from '../client';
import { requireProjectToken } from '../client';
import { op } from './call';
import { IngestionResultSchema, PropertiesSchema } from './common';

// Group profile updates (/groups) authenticate with the project token in the
// payload, like /engage. Each update names the group key (e.g. "company")
// and the group id (e.g. "Acme").

const GroupKey = z
	.string()
	.min(1)
	.describe('The group key, the property groups are keyed on (e.g. company).');
const GroupId = z.string().min(1).describe('The id of the group to update.');

function groups(
	c: MixpanelCredentials,
	// unknown: validated update objects; the token is added here.
	updates: Record<string, unknown>[],
): MixpanelRequest {
	const token = requireProjectToken(c);
	return {
		service: 'ingestion',
		method: 'POST',
		path: '/groups',
		auth: 'none',
		query: { verbose: 1 },
		body: updates.map((update) => ({ ...update, $token: token })),
		mediaType: 'application/json',
	};
}

function groupUpdate<Op extends string, V extends z.ZodType>(
	name: string,
	operation: Op,
	value: V,
	description: string,
	riskLevel: 'write' | 'destructive' = 'write',
) {
	return op({
		name,
		input: z.object({
			group_key: GroupKey,
			group_id: GroupId,
			[operation]: value,
		} as { group_key: typeof GroupKey; group_id: typeof GroupId } & Record<
			Op,
			V
		>),
		output: IngestionResultSchema,
		meta: { riskLevel, description },
		toRequest: (input, c) => {
			const { group_key, group_id, ...rest } = input as {
				group_key: string;
				group_id: string;
			};
			return groups(c, [
				{ $group_key: group_key, $group_id: group_id, ...rest },
			]);
		},
	});
}

// unknown: list values are whatever the property holds.
const ValueMap = z.record(z.string(), z.unknown());
const ListMap = z.record(z.string(), z.array(z.unknown()));

export const set = groupUpdate(
	'groups.set',
	'$set',
	PropertiesSchema.describe('Properties to set, overwriting current values.'),
	'Set properties on a group profile, creating it if needed',
);
export const setOnce = groupUpdate(
	'groups.setOnce',
	'$set_once',
	PropertiesSchema.describe('Properties to set only where not already set.'),
	'Set properties on a group profile only where they are not set yet',
);
export const union = groupUpdate(
	'groups.union',
	'$union',
	ListMap.describe('List properties and the values to merge in.'),
	'Merge values into list properties on a group profile, skipping duplicates',
);
export const remove = groupUpdate(
	'groups.remove',
	'$remove',
	ValueMap.describe('List properties and one value each to remove.'),
	'Remove a value from list properties on a group profile',
);
export const unset = groupUpdate(
	'groups.unset',
	'$unset',
	z.array(z.string().min(1)).min(1).describe('Property names to delete.'),
	'Delete properties from a group profile',
	'destructive',
);

export const batchUpdate = op({
	name: 'groups.batchUpdate',
	input: z.object({
		updates: z
			.array(
				z
					.object({
						$group_key: z.string().min(1),
						$group_id: z.string().min(1),
						$set: PropertiesSchema.optional(),
						$set_once: PropertiesSchema.optional(),
						$union: ListMap.optional(),
						$remove: ValueMap.optional(),
						$unset: z.array(z.string()).optional(),
						$delete: z.string().optional(),
					})
					.loose(),
			)
			.min(1)
			.max(200)
			.describe(
				'Up to 200 group updates, each with $group_key, $group_id and one operation.',
			),
	}),
	output: IngestionResultSchema,
	meta: {
		riskLevel: 'destructive',
		description:
			'Apply up to 200 mixed group profile updates in one request; $unset and $delete entries remove data',
	},
	toRequest: (input, c) => groups(c, input.updates),
	log: (input) => ({ updates: input.updates.length }),
});

export const deleteGroup = op({
	name: 'groups.delete',
	input: z.object({ group_key: GroupKey, group_id: GroupId }),
	output: IngestionResultSchema,
	meta: {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a group profile and its properties',
	},
	toRequest: (input, c) =>
		groups(c, [
			{ $group_key: input.group_key, $group_id: input.group_id, $delete: '' },
		]),
});
