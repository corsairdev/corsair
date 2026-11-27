import { z } from 'zod';
import type { ModalRuntime } from '../client';
import {
	appNameField,
	collect,
	defineOperation,
	environmentField,
	isoDate,
	limitField,
	OkSchema,
} from './shared';

const LifecycleSchema = z.object({
	state: z.string(),
	version: z.number().optional(),
	createdAt: z.string().optional(),
	createdBy: z.string().optional(),
	deployedAt: z.string().optional(),
	deployedBy: z.string().optional(),
	stoppedAt: z.string().optional(),
	stoppedBy: z.string().optional(),
});

const AppSchema = z.object({
	appId: z.string(),
	name: z.string().optional(),
	environmentName: z.string().optional(),
});

const AppInfoSchema = z.object({
	appId: z.string(),
	description: z.string(),
	lifecycle: LifecycleSchema,
	functions: z
		.record(z.string(), z.string())
		.describe('Function names mapped to function ids.'),
	servers: z
		.record(z.string(), z.string())
		.describe('Server names mapped to function ids.'),
});

type AppLifecycleLike = {
	state: string;
	version?: number;
	createdAt?: Date;
	createdBy?: string;
	deployedAt?: Date;
	deployedBy?: string;
	stoppedAt?: Date;
	stoppedBy?: string;
};

function lifecycleToJson(lifecycle: AppLifecycleLike) {
	return {
		state: lifecycle.state,
		version: lifecycle.version,
		createdAt: isoDate(lifecycle.createdAt),
		createdBy: lifecycle.createdBy || undefined,
		deployedAt: isoDate(lifecycle.deployedAt),
		deployedBy: lifecycle.deployedBy || undefined,
		stoppedAt: isoDate(lifecycle.stoppedAt),
		stoppedBy: lifecycle.stoppedBy || undefined,
	};
}

type AppLike = { appId: string; name?: string; environmentName?: string };

function appToJson(app: AppLike) {
	return {
		appId: app.appId,
		name: app.name,
		environmentName: app.environmentName || undefined,
	};
}

/** The environment of this call, or the workspace default when none is set. */
export function currentEnvironment(runtime: ModalRuntime) {
	return runtime.environment
		? runtime.client.environments.fromName(runtime.environment)
		: runtime.client.environments.fromContext();
}

export function lookupApp(runtime: ModalRuntime, name: string, create = false) {
	return runtime.client.apps.fromName(name, { createIfMissing: create });
}

const NamedAppInput = z.object({
	name: appNameField,
	environment: environmentField,
});

export const getApp = defineOperation({
	group: 'apps',
	name: 'get',
	description:
		'Look up a Modal App by name and return its id. Fails with 404 if the App does not exist.',
	riskLevel: 'read',
	input: NamedAppInput,
	output: AppSchema,
	run: async (runtime, input) =>
		appToJson(await lookupApp(runtime, input.name)),
});

export const createApp = defineOperation({
	group: 'apps',
	name: 'create',
	description:
		'Get a Modal App by name, creating an empty one if it does not exist. Sandboxes and image builds run inside an App.',
	riskLevel: 'write',
	input: NamedAppInput,
	output: AppSchema,
	run: async (runtime, input) =>
		appToJson(await lookupApp(runtime, input.name, true)),
});

export const listApps = defineOperation({
	group: 'apps',
	name: 'list',
	description:
		'List the live Apps in an environment (stopped and disabled Apps are left out).',
	riskLevel: 'read',
	input: z.object({
		environment: environmentField,
		limit: limitField(1000, 200),
	}),
	output: z.object({ apps: z.array(AppSchema), truncated: z.boolean() }),
	run: async (runtime, input) => {
		const environment = await currentEnvironment(runtime);
		const { items, truncated } = await collect(
			environment.apps.list(),
			input.limit,
		);
		return { apps: items.map(appToJson), truncated };
	},
});

export const getAppInfo = defineOperation({
	group: 'apps',
	name: 'info',
	description:
		"An App's description, lifecycle (state, deploys, who and when) and the ids of its functions and servers.",
	riskLevel: 'read',
	input: NamedAppInput,
	output: AppInfoSchema,
	run: async (runtime, input) => {
		const app = await lookupApp(runtime, input.name);
		const info = await app.info({ refresh: true });
		return {
			appId: info.appId,
			description: info.description,
			lifecycle: lifecycleToJson(info.lifecycle),
			functions: info.functions,
			servers: info.servers,
		};
	},
});

const CountsSchema = z.record(z.string(), z.unknown());

export const getAppStats = defineOperation({
	group: 'apps',
	name: 'stats',
	description:
		'Call, request, container and sandbox counts for an App over a time window (default the last hour; at most 7 days, starting within the last 30 days).',
	riskLevel: 'read',
	input: NamedAppInput.extend({
		since: z.iso.datetime().optional().describe('Window start (ISO 8601).'),
		until: z.iso.datetime().optional().describe('Window end (ISO 8601).'),
	}),
	output: z.object({
		since: z.string(),
		until: z.string(),
		functions: CountsSchema,
		servers: CountsSchema,
		sandboxes: z.object({
			total: z.number(),
			finished: z.number(),
			live: z.number(),
		}),
		lifecycle: LifecycleSchema,
		deploymentCount: z.number().optional(),
	}),
	run: async (runtime, input) => {
		const app = await lookupApp(runtime, input.name);
		const stats = await app.stats({
			since: input.since ? new Date(input.since) : undefined,
			until: input.until ? new Date(input.until) : undefined,
		});
		return {
			since: stats.since.toISOString(),
			until: stats.until.toISOString(),
			functions: stats.functions as unknown as Record<string, unknown>,
			servers: stats.servers as unknown as Record<string, unknown>,
			sandboxes: stats.sandboxes,
			lifecycle: lifecycleToJson(stats.lifecycle),
			deploymentCount: stats.deploymentCount,
		};
	},
});

export const getAppSandboxStats = defineOperation({
	group: 'apps',
	name: 'sandboxStats',
	description:
		"Cost in USD of an App's sandboxes over a time range (at most 7 days, on UTC hour boundaries), optionally grouped by tag values.",
	riskLevel: 'read',
	input: NamedAppInput.extend({
		since: z.iso
			.datetime()
			.describe('Range start (ISO 8601, on a UTC hour boundary).'),
		until: z.iso
			.datetime()
			.optional()
			.describe(
				'Range end (ISO 8601, on a UTC hour boundary). Defaults to now.',
			),
		groupByTags: z
			.array(z.string())
			.optional()
			.describe('Tag names to group by.'),
		tags: z
			.record(z.string(), z.string())
			.optional()
			.describe('Only sandboxes with all of these tags.'),
	}),
	output: z.object({
		groups: z.array(
			z.object({
				tags: z.record(z.string(), z.string().nullable()),
				cost: z.string().describe('Total cost in USD as a decimal string.'),
				costByResource: z.record(z.string(), z.string()),
			}),
		),
	}),
	run: async (runtime, input) => {
		const app = await lookupApp(runtime, input.name);
		const { items } = await collect(
			app.sandboxes.stats({
				since: new Date(input.since),
				until: input.until ? new Date(input.until) : undefined,
				groupByTags: input.groupByTags,
				tags: input.tags,
			}),
			10_000,
		);
		return { groups: items };
	},
});

export const stopApp = defineOperation({
	group: 'apps',
	name: 'stop',
	description:
		'Stop an App: terminates all its running containers and sandboxes and stops it taking new inputs. A deployed App has to be deployed again to come back.',
	riskLevel: 'destructive',
	irreversible: true,
	input: NamedAppInput,
	output: OkSchema,
	run: async (runtime, input) => {
		const app = await lookupApp(runtime, input.name);
		await app.stop();
		return { ok: true as const };
	},
});

export const appsOperations = [
	getApp,
	createApp,
	listApps,
	getAppInfo,
	getAppStats,
	getAppSandboxStats,
	stopApp,
] as const;
