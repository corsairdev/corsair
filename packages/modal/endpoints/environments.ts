import { z } from 'zod';
import { currentEnvironment } from './apps';
import { collect, defineOperation, limitField, OkSchema } from './shared';

const EnvironmentSchema = z.object({
	environmentId: z.string(),
	name: z.string(),
});

type EnvironmentLike = { environmentId: string; name: string };

function environmentToJson(environment: EnvironmentLike) {
	return { environmentId: environment.environmentId, name: environment.name };
}

const environmentNameField = z
	.string()
	.min(1)
	.describe('Environment name, e.g. "main" or "dev".');

export const getEnvironment = defineOperation({
	group: 'environments',
	name: 'get',
	description: 'Look up a Modal environment by name and return its id.',
	riskLevel: 'read',
	input: z.object({ name: environmentNameField }),
	output: EnvironmentSchema,
	run: async (runtime, input) =>
		environmentToJson(await runtime.client.environments.fromName(input.name)),
});

export const getDefaultEnvironment = defineOperation({
	group: 'environments',
	name: 'getDefault',
	description:
		"The environment calls run in: the account's configured environment, else the workspace default.",
	riskLevel: 'read',
	input: z.object({}),
	output: EnvironmentSchema,
	run: async (runtime) => environmentToJson(await currentEnvironment(runtime)),
});

export const listEnvironments = defineOperation({
	group: 'environments',
	name: 'list',
	description: 'List the environments in the workspace.',
	riskLevel: 'read',
	input: z.object({ limit: limitField(1000, 200) }),
	output: z.object({
		environments: z.array(EnvironmentSchema),
		truncated: z.boolean(),
	}),
	run: async (runtime, input) => {
		const { items, truncated } = await collect(
			runtime.client.environments.objects.list(),
			input.limit,
		);
		return { environments: items.map(environmentToJson), truncated };
	},
});

export const createEnvironment = defineOperation({
	group: 'environments',
	name: 'create',
	description: 'Create an environment in the workspace.',
	riskLevel: 'write',
	input: z.object({
		name: environmentNameField,
		restricted: z
			.boolean()
			.optional()
			.describe(
				'Only users with an explicit role in the environment can access it.',
			),
		defaultRole: z
			.string()
			.optional()
			.describe('Default environment role for workspace members.'),
	}),
	output: OkSchema,
	run: async (runtime, input) => {
		await runtime.client.environments.objects.create(input.name, {
			restricted: input.restricted,
			defaultRole: input.defaultRole,
		});
		return { ok: true as const };
	},
});

export const deleteEnvironment = defineOperation({
	group: 'environments',
	name: 'delete',
	description:
		'Delete an environment and every App, Volume, Secret, Queue and Dict in it. Cannot be undone.',
	riskLevel: 'destructive',
	irreversible: true,
	input: z.object({ name: environmentNameField }),
	output: OkSchema,
	run: async (runtime, input) => {
		await runtime.client.environments.objects.delete(input.name);
		return { ok: true as const };
	},
});

export const environmentsOperations = [
	getEnvironment,
	getDefaultEnvironment,
	listEnvironments,
	createEnvironment,
	deleteEnvironment,
] as const;
