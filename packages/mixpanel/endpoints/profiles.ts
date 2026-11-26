import { asRecord } from 'corsair/core';
import { z } from 'zod';
import type { MixpanelCredentials, MixpanelRequest } from '../client';
import { requireProjectToken } from '../client';
import { op } from './call';
import {
	checkDateRange,
	DateSchema,
	FORM,
	form,
	IngestionResultSchema,
	PropertiesSchema,
	WorkspaceIdSchema,
} from './common';

export const MIXPANEL_MAX_PROFILE_UPDATES = 2000;

// ── profiles.query ────────────────────────────────────────────────────────

const ProfilesQueryInput = z
	.object({
		where: z
			.string()
			.optional()
			.describe(
				'An expression to filter profiles by, such as properties["$email"] == "...".',
			),
		distinct_id: z
			.string()
			.optional()
			.describe('Retrieve exactly this profile.'),
		distinct_ids: z
			.array(z.string().min(1))
			.min(1)
			.optional()
			.describe('Retrieve exactly these profiles.'),
		data_group_id: z
			.string()
			.optional()
			.describe(
				'The ID of the group key, to query group profiles instead of user profiles.',
			),
		output_properties: z
			.array(z.string().min(1))
			.min(1)
			.optional()
			.describe(
				'Only return these properties, which speeds the query up considerably.',
			),
		session_id: z
			.string()
			.optional()
			.describe(
				'The session_id from the previous response, to keep paging through one query.',
			),
		page: z
			.number()
			.int()
			.nonnegative()
			.optional()
			.describe(
				"Set to the previous response's next_page; pages after 0 need its session_id.",
			),
		behaviors: z
			.number()
			.int()
			.optional()
			.describe('Needed when filtering with an event selector expression.'),
		as_of_timestamp: z
			.number()
			.int()
			.optional()
			.describe(
				'Required with `behaviors` when exporting more than 1000 profiles.',
			),
		filter_by_cohort: z
			.number()
			.int()
			.positive()
			.optional()
			.describe('Only profiles in this cohort id.'),
		include_all_users: z
			.boolean()
			.optional()
			.describe(
				'With `filter_by_cohort`: false keeps only distinct_ids that have a profile. Defaults to true.',
			),
		workspace_id: WorkspaceIdSchema,
	})
	.superRefine((value, ctx) => {
		if ((value.page ?? 0) > 0 && !value.session_id) {
			ctx.addIssue({
				code: 'custom',
				message: 'page above 0 needs the session_id from the previous response',
			});
		}
		if (value.behaviors !== undefined && value.filter_by_cohort !== undefined) {
			ctx.addIssue({
				code: 'custom',
				message: 'behaviors and filter_by_cohort are mutually exclusive',
			});
		}
	});

// results rows are `{$distinct_id, $properties}` per the spec, but a row can
// come back flat when output_properties is used, so both fields are nullish.
const ProfileRowSchema = z
	.object({
		$distinct_id: z.union([z.string(), z.number()]).nullish(),
		$properties: PropertiesSchema.nullish(),
	})
	.loose();

const ProfilesQueryOutput = z
	.object({
		page: z.number().nullish(),
		page_size: z.number().nullish(),
		results: z.array(ProfileRowSchema),
		session_id: z.string().nullish(),
		status: z.string().nullish(),
		total: z.number().nullish(),
		next_page: z
			.number()
			.nullable()
			.describe(
				'Derived: the page to request next while this one came back full, otherwise null. Pass it as `page` with the same session_id.',
			),
	})
	.loose();

// unknown: the raw engage body is an untyped JSON object until its fields are
// narrowed one at a time.
export function nextPageFromEngageResponse(raw: unknown): number | null {
	const record = asRecord(raw);
	const page = record?.page;
	const pageSize = record?.page_size;
	const count = Array.isArray(record?.results)
		? record.results.length
		: undefined;
	if (
		typeof page !== 'number' ||
		typeof pageSize !== 'number' ||
		count === undefined
	) {
		return null;
	}
	return count >= pageSize ? page + 1 : null;
}

export const query = op({
	name: 'profiles.query',
	input: ProfilesQueryInput,
	output: ProfilesQueryOutput,
	meta: {
		riskLevel: 'read',
		description:
			'Query user or group profiles with an expression, a cohort filter or exact distinct_ids, paged via session_id and next_page',
	},
	toRequest: (input, c) => ({
		service: 'query',
		method: 'POST',
		path: '/engage',
		query: { project_id: c.projectId, workspace_id: input.workspace_id },
		body: form({
			where: input.where,
			distinct_id: input.distinct_id,
			distinct_ids: input.distinct_ids,
			data_group_id: input.data_group_id,
			output_properties: input.output_properties,
			session_id: input.session_id,
			page: input.page,
			behaviors: input.behaviors,
			as_of_timestamp: input.as_of_timestamp,
			filter_by_cohort:
				input.filter_by_cohort === undefined
					? undefined
					: { id: input.filter_by_cohort },
			include_all_users: input.include_all_users,
		}),
		mediaType: FORM,
	}),
	shape: (raw) => {
		const body = asRecord(raw);
		if (!body) throw new Error('Mixpanel engage returned no JSON object');
		return { ...body, next_page: nextPageFromEngageResponse(body) };
	},
	log: (_input, result) => ({ profiles: result.results.length }),
});

// ── profiles.activity ─────────────────────────────────────────────────────

export const activity = op({
	name: 'profiles.activity',
	input: z
		.object({
			distinct_ids: z
				.array(z.string().min(1))
				.min(1)
				.describe('The users whose event stream to return.'),
			from_date: DateSchema,
			to_date: DateSchema,
			workspace_id: WorkspaceIdSchema,
		})
		.superRefine(checkDateRange),
	output: z
		.object({
			status: z.string().nullish(),
			results: z
				.object({
					events: z
						.array(
							z
								.object({
									event: z.string().nullish(),
									properties: PropertiesSchema.nullish(),
								})
								.loose(),
						)
						.nullish(),
				})
				.loose()
				.nullish(),
		})
		.loose(),
	meta: {
		riskLevel: 'read',
		description:
			"Return the event activity stream of one or more users' profiles for a date range",
	},
	toRequest: (input, c) => ({
		service: 'query',
		method: 'GET',
		path: '/stream/query',
		query: {
			project_id: c.projectId,
			workspace_id: input.workspace_id,
			distinct_ids: JSON.stringify(input.distinct_ids),
			from_date: input.from_date,
			to_date: input.to_date,
		},
	}),
});

// ── profile updates (/engage, project token) ──────────────────────────────

const DistinctId = z.string().min(1).describe('The profile to update.');

const UpdateFlags = {
	$ip: z
		.string()
		.optional()
		.describe('An IP to geolocate the profile from; omit to skip it.'),
	$ignore_time: z
		.boolean()
		.optional()
		.describe('True to leave $last_seen unchanged.'),
};

function engage(
	c: MixpanelCredentials,
	// unknown: validated update objects; the token is added here.
	updates: Record<string, unknown>[],
): MixpanelRequest {
	const token = requireProjectToken(c);
	return {
		service: 'ingestion',
		method: 'POST',
		path: '/engage',
		auth: 'none',
		query: { verbose: 1, ip: 0 },
		body: updates.map((update) => ({ ...update, $token: token })),
		mediaType: 'application/json',
	};
}

function profileUpdate<Op extends string, V extends z.ZodType>(
	name: string,
	operation: Op,
	value: V,
	description: string,
	riskLevel: 'write' | 'destructive' = 'write',
) {
	return op({
		name,
		input: z.object({
			distinct_id: DistinctId,
			[operation]: value,
			...UpdateFlags,
		} as { distinct_id: typeof DistinctId } & Record<Op, V> &
			typeof UpdateFlags),
		output: IngestionResultSchema,
		meta: { riskLevel, description },
		toRequest: (input, c) => {
			const { distinct_id, ...rest } = input as { distinct_id: string };
			return engage(c, [{ $distinct_id: distinct_id, ...rest }]);
		},
	});
}

const NumberMap = z.record(z.string(), z.number());
// unknown: list values are whatever the property holds.
const ValueMap = z.record(z.string(), z.unknown());
const ListMap = z.record(z.string(), z.array(z.unknown()));

export const set = profileUpdate(
	'profiles.set',
	'$set',
	PropertiesSchema.describe('Properties to set, overwriting current values.'),
	'Set properties on a user profile, creating the profile if needed',
);
export const setOnce = profileUpdate(
	'profiles.setOnce',
	'$set_once',
	PropertiesSchema.describe('Properties to set only where not already set.'),
	'Set properties on a user profile only where they are not set yet',
);
export const increment = profileUpdate(
	'profiles.increment',
	'$add',
	NumberMap.describe(
		'Numeric properties and the amount to add (negative to subtract).',
	),
	'Add to (or subtract from) numeric properties on a user profile',
);
export const union = profileUpdate(
	'profiles.union',
	'$union',
	ListMap.describe(
		'List properties and the values to merge in without duplicates.',
	),
	'Merge values into list properties on a user profile, skipping values already present',
);
export const append = profileUpdate(
	'profiles.append',
	'$append',
	ValueMap.describe('List properties and one value each to append.'),
	'Append a value to list properties on a user profile',
);
export const remove = profileUpdate(
	'profiles.remove',
	'$remove',
	ValueMap.describe('List properties and one value each to remove.'),
	'Remove a value from list properties on a user profile',
);
export const unset = profileUpdate(
	'profiles.unset',
	'$unset',
	z.array(z.string().min(1)).min(1).describe('Property names to delete.'),
	'Delete properties from a user profile',
	'destructive',
);

const BatchUpdateSchema = z
	.object({
		$distinct_id: z.string().min(1),
		$set: PropertiesSchema.optional(),
		$set_once: PropertiesSchema.optional(),
		$add: NumberMap.optional(),
		$union: ListMap.optional(),
		$append: ValueMap.optional(),
		$remove: ValueMap.optional(),
		$unset: z.array(z.string()).optional(),
		$delete: z.string().optional(),
		...UpdateFlags,
	})
	.loose();

export const batchUpdate = op({
	name: 'profiles.batchUpdate',
	input: z.object({
		updates: z
			.array(BatchUpdateSchema)
			.min(1)
			.max(MIXPANEL_MAX_PROFILE_UPDATES)
			.describe(
				'Up to 2000 profile updates, each with $distinct_id and one operation ($set, $set_once, $add, $union, $append, $remove, $unset or $delete).',
			),
	}),
	output: IngestionResultSchema,
	meta: {
		riskLevel: 'destructive',
		description:
			'Apply up to 2000 mixed profile updates in one request; $unset and $delete entries remove data',
	},
	toRequest: (input, c) => engage(c, input.updates),
	log: (input) => ({ updates: input.updates.length }),
});

export const deleteProfile = op({
	name: 'profiles.delete',
	input: z.object({
		distinct_id: DistinctId,
		ignore_alias: z
			.boolean()
			.optional()
			.describe('True to delete only this id, not profiles aliased to it.'),
	}),
	output: IngestionResultSchema,
	meta: {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a user profile and its properties (events stay)',
	},
	toRequest: (input, c) =>
		engage(c, [
			{
				$distinct_id: input.distinct_id,
				$delete: '',
				...(input.ignore_alias === undefined
					? {}
					: { $ignore_alias: input.ignore_alias }),
			},
		]),
});
