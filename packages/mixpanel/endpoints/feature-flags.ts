import { z } from 'zod';
import { segment } from '../client';
import { op } from './call';
import {
	LooseObject,
	okEnvelope,
	PropertiesSchema,
	RequiredWorkspaceIdSchema,
} from './common';

// Management routes live on the app API (service account); evaluation routes
// on the ingestion host take the project token or the service account plus
// project_id. Both answered on a free project (live, 11-24).

const FlagSchema = z
	.object({
		id: z.string().nullish(),
		name: z.string().nullish(),
		key: z.string().nullish(),
		description: z.string().nullish(),
		status: z.string().nullish(),
		tags: z.array(z.string()).nullish(),
		context: z.string().nullish(),
		serving_method: z.string().nullish(),
		ruleset: LooseObject.nullish(),
	})
	.loose();

const FlagBody = z
	.object({
		name: z.string().min(1),
		key: z.string().min(1).describe('The key code evaluates the flag by.'),
		description: z.string().nullable().optional(),
		tags: z.array(z.string()).describe('Tags; [] for none.'),
		status: z.enum(['enabled', 'disabled', 'archived']).optional(),
		context: z
			.string()
			.min(1)
			.describe('The identity the flag is evaluated on, usually distinct_id.'),
		serving_method: z.enum([
			'client',
			'server',
			'remote_or_local',
			'remote_only',
		]),
		ruleset: z
			.object({
				variants: z
					.array(LooseObject)
					.describe('Variants with key, value and split.'),
				rollout: z
					.array(LooseObject)
					.describe('Rollout rules with percentages and cohorts.'),
				test: LooseObject.optional(),
			})
			.loose(),
		experiment_id: z.string().nullable().optional(),
		data_group_id: z.union([z.string(), z.number()]).nullable().optional(),
		is_experiment_active: z.boolean().nullable().optional(),
		hash_salt: z.string().nullable().optional(),
		reset_hash_salt: z.boolean().optional(),
	})
	.loose();

const base = (projectId: number, workspaceId: number) =>
	`/projects/${projectId}/workspaces/${workspaceId}/feature-flags`;

const FlagId = z.string().min(1).describe('The feature flag id.');

export const list = op({
	name: 'featureFlags.list',
	input: z.object({
		workspace_id: RequiredWorkspaceIdSchema,
		include_archived: z.boolean().optional(),
	}),
	output: okEnvelope(z.array(FlagSchema)),
	meta: {
		riskLevel: 'read',
		description: 'List the feature flags of a workspace',
	},
	toRequest: (input, c) => ({
		service: 'app',
		method: 'GET',
		path: base(c.projectId, input.workspace_id),
		query: {
			include_archived:
				input.include_archived === undefined
					? undefined
					: String(input.include_archived),
		},
	}),
});

export const get = op({
	name: 'featureFlags.get',
	input: z.object({ workspace_id: RequiredWorkspaceIdSchema, flag_id: FlagId }),
	output: okEnvelope(FlagSchema),
	meta: {
		riskLevel: 'read',
		description: 'Get one feature flag with its ruleset',
	},
	toRequest: (input, c) => ({
		service: 'app',
		method: 'GET',
		path: `${base(c.projectId, input.workspace_id)}/${segment(input.flag_id)}`,
	}),
});

export const create = op({
	name: 'featureFlags.create',
	input: FlagBody.extend({ workspace_id: RequiredWorkspaceIdSchema }),
	output: okEnvelope(FlagSchema),
	meta: {
		riskLevel: 'write',
		description: 'Create a feature flag with variants and rollout rules',
	},
	toRequest: ({ workspace_id, ...body }, c) => ({
		service: 'app',
		method: 'POST',
		path: base(c.projectId, workspace_id),
		body,
		mediaType: 'application/json',
	}),
});

export const update = op({
	name: 'featureFlags.update',
	input: FlagBody.extend({
		workspace_id: RequiredWorkspaceIdSchema,
		flag_id: FlagId,
	}),
	output: okEnvelope(FlagSchema),
	meta: {
		riskLevel: 'write',
		description:
			'Replace a feature flag (full PUT: send every field); changes what live users are served',
	},
	toRequest: ({ workspace_id, flag_id, ...body }, c) => ({
		service: 'app',
		method: 'PUT',
		path: `${base(c.projectId, workspace_id)}/${segment(flag_id)}`,
		body,
		mediaType: 'application/json',
	}),
});

export const remove = op({
	name: 'featureFlags.delete',
	input: z.object({ workspace_id: RequiredWorkspaceIdSchema, flag_id: FlagId }),
	output: okEnvelope(LooseObject),
	meta: {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a feature flag',
	},
	toRequest: (input, c) => ({
		service: 'app',
		method: 'DELETE',
		path: `${base(c.projectId, input.workspace_id)}/${segment(input.flag_id)}`,
	}),
});

export const evaluate = op({
	name: 'featureFlags.evaluate',
	input: z.object({
		distinct_id: z.string().min(1).describe('The user to evaluate flags for.'),
		device_id: z.string().optional(),
		custom_properties: PropertiesSchema.optional().describe(
			'Properties the rollout rules can target.',
		),
	}),
	output: z
		.object({
			flags: z.record(z.string(), LooseObject).nullish(),
			code: z.number().nullish(),
			status: z.string().nullish(),
		})
		.loose(),
	meta: {
		riskLevel: 'read',
		description:
			'Evaluate every enabled feature flag for one user and return the assigned variants',
	},
	toRequest: (input, c) => ({
		service: 'ingestion',
		method: 'GET',
		path: '/flags',
		query: { project_id: c.projectId, context: JSON.stringify(input) },
	}),
});

export const definitions = op({
	name: 'featureFlags.definitions',
	input: z.object({}),
	output: z
		.object({
			flags: z.array(LooseObject).nullish(),
			code: z.number().nullish(),
			status: z.string().nullish(),
		})
		.loose(),
	meta: {
		riskLevel: 'read',
		description:
			'Get the definitions of every flag, for local evaluation in server SDKs',
	},
	toRequest: (_input, c) => ({
		service: 'ingestion',
		method: 'GET',
		path: '/flags/definitions',
		query: { project_id: c.projectId },
	}),
});
