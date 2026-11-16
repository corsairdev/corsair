import { z } from 'zod';
import {
	optBool,
	optNum,
	optStr,
	PaginationSchema,
	teamIdInput,
} from './common';

const idOrName = z
	.string()
	.min(1)
	.describe('Project id (prj_…) or project name.');
const envId = z
	.string()
	.min(1)
	.describe('Environment variable id, as listed by getEnvVariables.');

const envTarget = z.enum(['production', 'preview', 'development']);
const envType = z
	.enum(['encrypted', 'sensitive', 'plain', 'system'])
	.describe(
		'encrypted: stored encrypted, readable later with getEnvVariable. sensitive: write-only, its value can never be read back. plain: stored and shown in plain text. system: reserved for Vercel system variables.',
	);

const envFields = {
	key: z.string().min(1).describe('Variable name, e.g. DATABASE_URL.'),
	value: z
		.string()
		.describe('Variable value. Kept out of event logs and the local store.'),
	type: envType,
	target: z
		.array(envTarget)
		.min(1)
		.optional()
		.describe(
			'Environments the variable applies to. Required unless customEnvironmentIds is given.',
		),
	gitBranch: z
		.string()
		.max(250)
		.nullable()
		.optional()
		.describe(
			'Limit the variable to one Git branch (target must be ["preview"]).',
		),
	comment: z
		.string()
		.max(500)
		.optional()
		.describe('Note on what the variable is for.'),
	customEnvironmentIds: z
		.array(z.string().min(1))
		.min(1)
		.optional()
		.describe('Custom environment ids (env_…) the variable applies to.'),
};

const singleVariableKeys = Object.keys(envFields) as (keyof typeof envFields)[];

const needsTarget = (v: { target?: unknown; customEnvironmentIds?: unknown }) =>
	v.target !== undefined || v.customEnvironmentIds !== undefined;

const EnvVariableInput = z.object(envFields).refine(needsTarget, {
	message: 'Give target or customEnvironmentIds.',
	path: ['target'],
});

// Responses: Vercel's env object in its several documented variants (value
// present, absent, encrypted or decrypted; target as a list or one string).
export const EnvVariableSchema = z
	.object({
		// Vercel's model marks id optional; requests still require it.
		id: optStr(),
		key: z.string(),
		type: optStr(),
		value: optStr(),
		target: z
			.union([z.array(z.string()), z.string()])
			.nullable()
			.optional(),
		gitBranch: optStr(),
		comment: optStr(),
		customEnvironmentIds: z.array(z.string()).nullable().optional(),
		decrypted: optBool(),
		system: optBool(),
		visibility: optStr(),
		configurationId: optStr(),
		edgeConfigId: optStr(),
		edgeConfigTokenId: optStr(),
		contentHint: z.record(z.string(), z.unknown()).nullable().optional(),
		createdAt: optNum(),
		updatedAt: optNum(),
		createdBy: optStr(),
		updatedBy: optStr(),
	})
	.passthrough();

const EnvCreateFailureSchema = z
	.object({
		error: z
			.object({
				code: optStr(),
				message: optStr(),
				key: optStr(),
				envVarKey: optStr(),
				envVarId: optStr(),
				gitBranch: optStr(),
				action: optStr(),
				link: optStr(),
				project: optStr(),
				target: z
					.union([z.array(z.string()), z.string()])
					.nullable()
					.optional(),
			})
			.passthrough(),
	})
	.passthrough();

export const VercelEnvsInputSchemas = {
	getEnvVariables: z.object({
		teamId: teamIdInput,
		idOrName,
		gitBranch: z
			.string()
			.optional()
			.describe('Only variables for this Git branch (preview target).'),
		customEnvironmentId: z
			.string()
			.optional()
			.describe('Only variables of this custom environment (env_…).'),
		customEnvironmentSlug: z
			.string()
			.optional()
			.describe('Only variables of the custom environment with this slug.'),
		source: z
			.string()
			.optional()
			.describe(
				'The source that is calling the endpoint (Vercel’s `source` parameter).',
			),
	}),
	getEnvVariable: z.object({
		teamId: teamIdInput,
		idOrName,
		id: envId,
	}),
	createEnvVariable: z
		.object({
			teamId: teamIdInput,
			idOrName,
			key: envFields.key.optional(),
			value: envFields.value.optional(),
			type: envType.optional(),
			target: envFields.target,
			gitBranch: envFields.gitBranch,
			comment: envFields.comment,
			customEnvironmentIds: envFields.customEnvironmentIds,
			variables: z
				.array(EnvVariableInput)
				.min(1)
				.optional()
				.describe(
					'Several variables in one call, each with key, value, type and target. Use instead of the single-variable fields.',
				),
			upsert: z
				.boolean()
				.optional()
				.describe(
					'Overwrite a variable that already exists with the same key and target instead of reporting it under failed.',
				),
		})
		.superRefine((input, ctx) => {
			const single = singleVariableKeys.filter((k) => input[k] !== undefined);
			if (input.variables) {
				if (single.length > 0) {
					ctx.addIssue({
						code: 'custom',
						message: `Pass either variables or one variable's fields, not both (got ${single.join(', ')}).`,
						path: ['variables'],
					});
				}
				return;
			}
			for (const k of ['key', 'value', 'type'] as const) {
				if (input[k] === undefined) {
					ctx.addIssue({
						code: 'custom',
						message: `${k} is required (or pass variables).`,
						path: [k],
					});
				}
			}
			if (!needsTarget(input)) {
				ctx.addIssue({
					code: 'custom',
					message: 'Give target or customEnvironmentIds.',
					path: ['target'],
				});
			}
		}),
	updateEnvVariable: z
		.object({
			teamId: teamIdInput,
			idOrName,
			id: envId,
			key: envFields.key.optional(),
			value: envFields.value.optional(),
			type: envType.optional(),
			target: z
				.array(envTarget)
				.optional()
				.describe(
					'Environments the variable applies to. An empty list removes all of them (e.g. to keep only customEnvironmentIds).',
				),
			gitBranch: z
				.string()
				.max(250)
				.nullable()
				.optional()
				.describe(
					'Git branch to limit the variable to. null removes the limit.',
				),
			comment: envFields.comment,
			customEnvironmentIds: z
				.array(z.string().min(1))
				.optional()
				.describe(
					'Custom environment ids (env_…). An empty list removes the variable from all of them.',
				),
		})
		.superRefine((input, ctx) => {
			const { teamId: _t, idOrName: _p, id: _i, ...changes } = input;
			if (Object.values(changes).every((v) => v === undefined)) {
				ctx.addIssue({
					code: 'custom',
					message: 'Give at least one field to change.',
				});
			}
		}),
	deleteEnvVariable: z.object({
		teamId: teamIdInput,
		idOrName,
		id: envId,
		customEnvironmentId: z
			.string()
			.optional()
			.describe('Custom environment (env_…) the variable belongs to, if any.'),
	}),
} as const;

export const VercelEnvsOutputSchemas = {
	getEnvVariables: z
		.object({
			envs: z.array(EnvVariableSchema).optional(),
			pagination: PaginationSchema.nullable().optional(),
			hiddenProductionEnvCount: optNum(),
		})
		.passthrough(),
	getEnvVariable: EnvVariableSchema,
	createEnvVariable: z
		.object({
			created: z
				.union([EnvVariableSchema, z.array(EnvVariableSchema)])
				.nullable()
				.optional(),
			failed: z.array(EnvCreateFailureSchema).nullable().optional(),
		})
		.passthrough(),
	updateEnvVariable: EnvVariableSchema,
	deleteEnvVariable: z.object({
		deleted: z.boolean(),
		idOrName: z.string(),
		id: z.string(),
		removed: z.array(EnvVariableSchema),
	}),
} as const;

export type VercelEnvsInputs = {
	[K in keyof typeof VercelEnvsInputSchemas]: z.input<
		(typeof VercelEnvsInputSchemas)[K]
	>;
};
export type VercelEnvsOutputs = {
	[K in keyof typeof VercelEnvsOutputSchemas]: z.infer<
		(typeof VercelEnvsOutputSchemas)[K]
	>;
};
