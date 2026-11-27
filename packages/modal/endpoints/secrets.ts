import { z } from 'zod';
import {
	createdBeforeField,
	defineOperation,
	environmentField,
	isoFromSeconds,
	limitField,
	OkSchema,
	pagedList,
} from './shared';

const secretNameField = z.string().min(1).describe('Secret name.');

export const getSecret = defineOperation({
	group: 'secrets',
	name: 'get',
	description:
		'Look up a Secret by name and return its id (values are never returned). With requiredKeys, fails if any key is missing.',
	riskLevel: 'read',
	input: z.object({
		environment: environmentField,
		name: secretNameField,
		requiredKeys: z.array(z.string()).optional(),
	}),
	output: z.object({ secretId: z.string(), name: z.string().optional() }),
	run: async (runtime, input) => {
		const secret = await runtime.client.secrets.fromName(input.name, {
			requiredKeys: input.requiredKeys,
		});
		return { secretId: secret.secretId, name: secret.name ?? input.name };
	},
});

export const listSecrets = defineOperation({
	group: 'secrets',
	name: 'list',
	description:
		'List the Secrets in an environment with their key names and last use (values are never returned).',
	riskLevel: 'read',
	input: z.object({
		environment: environmentField,
		limit: limitField(1000, 100),
		createdBefore: createdBeforeField,
	}),
	output: z.object({
		secrets: z.array(
			z.object({
				secretId: z.string(),
				name: z.string(),
				keys: z.array(z.string()).optional(),
				createdAt: z.string().optional(),
				createdBy: z.string().optional(),
				lastUsedAt: z.string().optional(),
			}),
		),
		nextCreatedBefore: z.number().optional(),
	}),
	run: async (runtime, input) => {
		const environmentName = runtime.client.environmentName();
		const { items, nextCreatedBefore } = await pagedList(
			async (pagination) =>
				(
					await runtime.client.cpClient.secretList({
						environmentName,
						pagination,
					})
				).items,
			input.limit,
			input.createdBefore,
		);
		return {
			secrets: items.map((item) => ({
				secretId: item.secretId,
				name: item.label,
				keys: item.metadata?.keys?.length ? item.metadata.keys : undefined,
				createdAt: isoFromSeconds(item.createdAt),
				createdBy: item.metadata?.creationInfo?.createdBy || undefined,
				lastUsedAt: isoFromSeconds(item.lastUsedAt),
			})),
			nextCreatedBefore,
		};
	},
});

export const createSecret = defineOperation({
	group: 'secrets',
	name: 'create',
	description:
		'Create a named Secret from key/value pairs (injected into sandboxes and functions as environment variables). Fails if it exists unless overwrite is set.',
	riskLevel: 'write',
	input: z.object({
		environment: environmentField,
		name: secretNameField,
		values: z
			.record(z.string(), z.string())
			.refine((values) => Object.keys(values).length > 0, {
				message: 'Give at least one key.',
			})
			.describe('Environment variable names mapped to their values.'),
		overwrite: z
			.boolean()
			.optional()
			.describe('Replace an existing Secret of the same name.'),
	}),
	output: z.object({ secretId: z.string(), name: z.string() }),
	run: async (runtime, input) => {
		const response = await runtime.client.cpClient.secretGetOrCreate({
			deploymentName: input.name,
			environmentName: runtime.client.environmentName(),
			// CREATE_OVERWRITE_IF_EXISTS : CREATE_FAIL_IF_EXISTS
			objectCreationType: input.overwrite ? 3 : 2,
			envDict: input.values,
		});
		return { secretId: response.secretId, name: input.name };
	},
});

export const deleteSecret = defineOperation({
	group: 'secrets',
	name: 'delete',
	description:
		'Delete a Secret. Apps that use it fail on their next start. Cannot be undone.',
	riskLevel: 'destructive',
	irreversible: true,
	input: z.object({
		environment: environmentField,
		name: secretNameField,
		allowMissing: z.boolean().optional(),
	}),
	output: OkSchema,
	run: async (runtime, input) => {
		await runtime.client.secrets.delete(input.name, {
			allowMissing: input.allowMissing,
		});
		return { ok: true as const };
	},
});

export const secretsOperations = [
	getSecret,
	listSecrets,
	createSecret,
	deleteSecret,
] as const;
