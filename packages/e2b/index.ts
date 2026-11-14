import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Envd,
	Events,
	Filesystem,
	Process,
	Sandboxes,
	Secrets,
	Tags,
	Teams,
	Templates,
	Volumes,
} from './endpoints';
import { e2bOperationRoutes } from './endpoints/routes';
import type { E2bEndpointInputs, E2bEndpointOutputs } from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { E2bSchema } from './schema';

export type E2bPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalE2bPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof e2bEndpointsNested>;
};

export type E2bContext = CorsairPluginContext<
	typeof E2bSchema,
	E2bPluginOptions
>;
export type E2bKeyBuilderContext = KeyBuilderContext<E2bPluginOptions>;

const e2bEndpointsNested = {
	sandboxes: Sandboxes,
	templates: Templates,
	tags: Tags,
	volumes: Volumes,
	envd: Envd,
	filesystem: Filesystem,
	process: Process,
	teams: Teams,
	secrets: Secrets,
	events: Events,
} as const;

export type E2bBoundEndpoints = BindEndpoints<typeof e2bEndpointsNested>;
export type E2bEndpointInputsByOperation = E2bEndpointInputs;
export type E2bEndpointOutputsByOperation = E2bEndpointOutputs;
export type E2bBoundWebhooks = BindWebhooks<Record<string, never>>;

const e2bWebhooksNested = {} as const;

export const e2bEndpointSchemas = {
	'sandboxes.create': {
		input: e2bOperationRoutes['sandboxes.create'].input,
		output: e2bOperationRoutes['sandboxes.create'].output,
	},
	'sandboxes.list': {
		input: e2bOperationRoutes['sandboxes.list'].input,
		output: e2bOperationRoutes['sandboxes.list'].output,
	},
	'sandboxes.listMetrics': {
		input: e2bOperationRoutes['sandboxes.listMetrics'].input,
		output: e2bOperationRoutes['sandboxes.listMetrics'].output,
	},
	'sandboxes.getLogs': {
		input: e2bOperationRoutes['sandboxes.getLogs'].input,
		output: e2bOperationRoutes['sandboxes.getLogs'].output,
	},
	'sandboxes.get': {
		input: e2bOperationRoutes['sandboxes.get'].input,
		output: e2bOperationRoutes['sandboxes.get'].output,
	},
	'sandboxes.kill': {
		input: e2bOperationRoutes['sandboxes.kill'].input,
		output: e2bOperationRoutes['sandboxes.kill'].output,
	},
	'sandboxes.getMetrics': {
		input: e2bOperationRoutes['sandboxes.getMetrics'].input,
		output: e2bOperationRoutes['sandboxes.getMetrics'].output,
	},
	'sandboxes.pause': {
		input: e2bOperationRoutes['sandboxes.pause'].input,
		output: e2bOperationRoutes['sandboxes.pause'].output,
	},
	'sandboxes.fork': {
		input: e2bOperationRoutes['sandboxes.fork'].input,
		output: e2bOperationRoutes['sandboxes.fork'].output,
	},
	'sandboxes.connect': {
		input: e2bOperationRoutes['sandboxes.connect'].input,
		output: e2bOperationRoutes['sandboxes.connect'].output,
	},
	'sandboxes.setTimeout': {
		input: e2bOperationRoutes['sandboxes.setTimeout'].input,
		output: e2bOperationRoutes['sandboxes.setTimeout'].output,
	},
	'sandboxes.updateNetwork': {
		input: e2bOperationRoutes['sandboxes.updateNetwork'].input,
		output: e2bOperationRoutes['sandboxes.updateNetwork'].output,
	},
	'sandboxes.refresh': {
		input: e2bOperationRoutes['sandboxes.refresh'].input,
		output: e2bOperationRoutes['sandboxes.refresh'].output,
	},
	'sandboxes.createSnapshot': {
		input: e2bOperationRoutes['sandboxes.createSnapshot'].input,
		output: e2bOperationRoutes['sandboxes.createSnapshot'].output,
	},
	'sandboxes.listSnapshots': {
		input: e2bOperationRoutes['sandboxes.listSnapshots'].input,
		output: e2bOperationRoutes['sandboxes.listSnapshots'].output,
	},
	'templates.create': {
		input: e2bOperationRoutes['templates.create'].input,
		output: e2bOperationRoutes['templates.create'].output,
	},
	'templates.list': {
		input: e2bOperationRoutes['templates.list'].input,
		output: e2bOperationRoutes['templates.list'].output,
	},
	'templates.getBuildUploadLink': {
		input: e2bOperationRoutes['templates.getBuildUploadLink'].input,
		output: e2bOperationRoutes['templates.getBuildUploadLink'].output,
	},
	'templates.listDefault': {
		input: e2bOperationRoutes['templates.listDefault'].input,
		output: e2bOperationRoutes['templates.listDefault'].output,
	},
	'templates.get': {
		input: e2bOperationRoutes['templates.get'].input,
		output: e2bOperationRoutes['templates.get'].output,
	},
	'templates.delete': {
		input: e2bOperationRoutes['templates.delete'].input,
		output: e2bOperationRoutes['templates.delete'].output,
	},
	'templates.startBuild': {
		input: e2bOperationRoutes['templates.startBuild'].input,
		output: e2bOperationRoutes['templates.startBuild'].output,
	},
	'templates.update': {
		input: e2bOperationRoutes['templates.update'].input,
		output: e2bOperationRoutes['templates.update'].output,
	},
	'templates.getBuildStatus': {
		input: e2bOperationRoutes['templates.getBuildStatus'].input,
		output: e2bOperationRoutes['templates.getBuildStatus'].output,
	},
	'templates.getBuildLogs': {
		input: e2bOperationRoutes['templates.getBuildLogs'].input,
		output: e2bOperationRoutes['templates.getBuildLogs'].output,
	},
	'templates.getByAlias': {
		input: e2bOperationRoutes['templates.getByAlias'].input,
		output: e2bOperationRoutes['templates.getByAlias'].output,
	},
	'tags.assign': {
		input: e2bOperationRoutes['tags.assign'].input,
		output: e2bOperationRoutes['tags.assign'].output,
	},
	'tags.delete': {
		input: e2bOperationRoutes['tags.delete'].input,
		output: e2bOperationRoutes['tags.delete'].output,
	},
	'tags.list': {
		input: e2bOperationRoutes['tags.list'].input,
		output: e2bOperationRoutes['tags.list'].output,
	},
	'tags.listGroups': {
		input: e2bOperationRoutes['tags.listGroups'].input,
		output: e2bOperationRoutes['tags.listGroups'].output,
	},
	'tags.count': {
		input: e2bOperationRoutes['tags.count'].input,
		output: e2bOperationRoutes['tags.count'].output,
	},
	'tags.exists': {
		input: e2bOperationRoutes['tags.exists'].input,
		output: e2bOperationRoutes['tags.exists'].output,
	},
	'tags.listAssignments': {
		input: e2bOperationRoutes['tags.listAssignments'].input,
		output: e2bOperationRoutes['tags.listAssignments'].output,
	},
	'volumes.list': {
		input: e2bOperationRoutes['volumes.list'].input,
		output: e2bOperationRoutes['volumes.list'].output,
	},
	'volumes.create': {
		input: e2bOperationRoutes['volumes.create'].input,
		output: e2bOperationRoutes['volumes.create'].output,
	},
	'volumes.get': {
		input: e2bOperationRoutes['volumes.get'].input,
		output: e2bOperationRoutes['volumes.get'].output,
	},
	'volumes.delete': {
		input: e2bOperationRoutes['volumes.delete'].input,
		output: e2bOperationRoutes['volumes.delete'].output,
	},
	'envd.health': {
		input: e2bOperationRoutes['envd.health'].input,
		output: e2bOperationRoutes['envd.health'].output,
	},
	'envd.metrics': {
		input: e2bOperationRoutes['envd.metrics'].input,
		output: e2bOperationRoutes['envd.metrics'].output,
	},
	'envd.getEnvironmentVariables': {
		input: e2bOperationRoutes['envd.getEnvironmentVariables'].input,
		output: e2bOperationRoutes['envd.getEnvironmentVariables'].output,
	},
	'filesystem.createWatcher': {
		input: e2bOperationRoutes['filesystem.createWatcher'].input,
		output: e2bOperationRoutes['filesystem.createWatcher'].output,
	},
	'filesystem.getWatcherEvents': {
		input: e2bOperationRoutes['filesystem.getWatcherEvents'].input,
		output: e2bOperationRoutes['filesystem.getWatcherEvents'].output,
	},
	'filesystem.listDir': {
		input: e2bOperationRoutes['filesystem.listDir'].input,
		output: e2bOperationRoutes['filesystem.listDir'].output,
	},
	'filesystem.createDir': {
		input: e2bOperationRoutes['filesystem.createDir'].input,
		output: e2bOperationRoutes['filesystem.createDir'].output,
	},
	'filesystem.move': {
		input: e2bOperationRoutes['filesystem.move'].input,
		output: e2bOperationRoutes['filesystem.move'].output,
	},
	'filesystem.remove': {
		input: e2bOperationRoutes['filesystem.remove'].input,
		output: e2bOperationRoutes['filesystem.remove'].output,
	},
	'filesystem.removeWatcher': {
		input: e2bOperationRoutes['filesystem.removeWatcher'].input,
		output: e2bOperationRoutes['filesystem.removeWatcher'].output,
	},
	'filesystem.stat': {
		input: e2bOperationRoutes['filesystem.stat'].input,
		output: e2bOperationRoutes['filesystem.stat'].output,
	},
	'process.closeStdin': {
		input: e2bOperationRoutes['process.closeStdin'].input,
		output: e2bOperationRoutes['process.closeStdin'].output,
	},
	'process.list': {
		input: e2bOperationRoutes['process.list'].input,
		output: e2bOperationRoutes['process.list'].output,
	},
	'process.sendInput': {
		input: e2bOperationRoutes['process.sendInput'].input,
		output: e2bOperationRoutes['process.sendInput'].output,
	},
	'process.sendSignal': {
		input: e2bOperationRoutes['process.sendSignal'].input,
		output: e2bOperationRoutes['process.sendSignal'].output,
	},
	'process.update': {
		input: e2bOperationRoutes['process.update'].input,
		output: e2bOperationRoutes['process.update'].output,
	},
	'teams.getMetrics': {
		input: e2bOperationRoutes['teams.getMetrics'].input,
		output: e2bOperationRoutes['teams.getMetrics'].output,
	},
	'teams.getMaxMetrics': {
		input: e2bOperationRoutes['teams.getMaxMetrics'].input,
		output: e2bOperationRoutes['teams.getMaxMetrics'].output,
	},
	'secrets.list': {
		input: e2bOperationRoutes['secrets.list'].input,
		output: e2bOperationRoutes['secrets.list'].output,
	},
	'secrets.create': {
		input: e2bOperationRoutes['secrets.create'].input,
		output: e2bOperationRoutes['secrets.create'].output,
	},
	'secrets.get': {
		input: e2bOperationRoutes['secrets.get'].input,
		output: e2bOperationRoutes['secrets.get'].output,
	},
	'secrets.update': {
		input: e2bOperationRoutes['secrets.update'].input,
		output: e2bOperationRoutes['secrets.update'].output,
	},
	'secrets.delete': {
		input: e2bOperationRoutes['secrets.delete'].input,
		output: e2bOperationRoutes['secrets.delete'].output,
	},
	'events.listBySandbox': {
		input: e2bOperationRoutes['events.listBySandbox'].input,
		output: e2bOperationRoutes['events.listBySandbox'].output,
	},
	'events.list': {
		input: e2bOperationRoutes['events.list'].input,
		output: e2bOperationRoutes['events.list'].output,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof e2bEndpointsNested>;

export const e2bEndpointMeta = {
	'sandboxes.create': {
		riskLevel: 'destructive',
		description: e2bOperationRoutes['sandboxes.create'].description,
	},
	'sandboxes.list': {
		riskLevel: 'read',
		description: e2bOperationRoutes['sandboxes.list'].description,
	},
	'sandboxes.listMetrics': {
		riskLevel: 'read',
		description: e2bOperationRoutes['sandboxes.listMetrics'].description,
	},
	'sandboxes.getLogs': {
		riskLevel: 'read',
		description: e2bOperationRoutes['sandboxes.getLogs'].description,
	},
	'sandboxes.get': {
		riskLevel: 'read',
		description: e2bOperationRoutes['sandboxes.get'].description,
	},
	'sandboxes.kill': {
		riskLevel: 'destructive',
		description: e2bOperationRoutes['sandboxes.kill'].description,
	},
	'sandboxes.getMetrics': {
		riskLevel: 'read',
		description: e2bOperationRoutes['sandboxes.getMetrics'].description,
	},
	'sandboxes.pause': {
		riskLevel: 'write',
		description: e2bOperationRoutes['sandboxes.pause'].description,
	},
	'sandboxes.fork': {
		riskLevel: 'destructive',
		description: e2bOperationRoutes['sandboxes.fork'].description,
	},
	'sandboxes.connect': {
		riskLevel: 'destructive',
		description: e2bOperationRoutes['sandboxes.connect'].description,
	},
	'sandboxes.setTimeout': {
		riskLevel: 'destructive',
		description: e2bOperationRoutes['sandboxes.setTimeout'].description,
	},
	'sandboxes.updateNetwork': {
		riskLevel: 'write',
		description: e2bOperationRoutes['sandboxes.updateNetwork'].description,
	},
	'sandboxes.refresh': {
		riskLevel: 'destructive',
		description: e2bOperationRoutes['sandboxes.refresh'].description,
	},
	'sandboxes.createSnapshot': {
		riskLevel: 'write',
		description: e2bOperationRoutes['sandboxes.createSnapshot'].description,
	},
	'sandboxes.listSnapshots': {
		riskLevel: 'read',
		description: e2bOperationRoutes['sandboxes.listSnapshots'].description,
	},
	'templates.create': {
		riskLevel: 'write',
		description: e2bOperationRoutes['templates.create'].description,
	},
	'templates.list': {
		riskLevel: 'read',
		description: e2bOperationRoutes['templates.list'].description,
	},
	'templates.getBuildUploadLink': {
		riskLevel: 'read',
		description: e2bOperationRoutes['templates.getBuildUploadLink'].description,
	},
	'templates.listDefault': {
		riskLevel: 'read',
		description: e2bOperationRoutes['templates.listDefault'].description,
	},
	'templates.get': {
		riskLevel: 'read',
		description: e2bOperationRoutes['templates.get'].description,
	},
	'templates.delete': {
		riskLevel: 'destructive',
		description: e2bOperationRoutes['templates.delete'].description,
	},
	'templates.startBuild': {
		riskLevel: 'write',
		description: e2bOperationRoutes['templates.startBuild'].description,
	},
	'templates.update': {
		riskLevel: 'write',
		description: e2bOperationRoutes['templates.update'].description,
	},
	'templates.getBuildStatus': {
		riskLevel: 'read',
		description: e2bOperationRoutes['templates.getBuildStatus'].description,
	},
	'templates.getBuildLogs': {
		riskLevel: 'read',
		description: e2bOperationRoutes['templates.getBuildLogs'].description,
	},
	'templates.getByAlias': {
		riskLevel: 'read',
		description: e2bOperationRoutes['templates.getByAlias'].description,
	},
	'tags.assign': {
		riskLevel: 'write',
		description: e2bOperationRoutes['tags.assign'].description,
	},
	'tags.delete': {
		riskLevel: 'destructive',
		description: e2bOperationRoutes['tags.delete'].description,
	},
	'tags.list': {
		riskLevel: 'read',
		description: e2bOperationRoutes['tags.list'].description,
	},
	'tags.listGroups': {
		riskLevel: 'read',
		description: e2bOperationRoutes['tags.listGroups'].description,
	},
	'tags.count': {
		riskLevel: 'read',
		description: e2bOperationRoutes['tags.count'].description,
	},
	'tags.exists': {
		riskLevel: 'read',
		description: e2bOperationRoutes['tags.exists'].description,
	},
	'tags.listAssignments': {
		riskLevel: 'read',
		description: e2bOperationRoutes['tags.listAssignments'].description,
	},
	'volumes.list': {
		riskLevel: 'read',
		description: e2bOperationRoutes['volumes.list'].description,
	},
	'volumes.create': {
		riskLevel: 'write',
		description: e2bOperationRoutes['volumes.create'].description,
	},
	'volumes.get': {
		riskLevel: 'read',
		description: e2bOperationRoutes['volumes.get'].description,
	},
	'volumes.delete': {
		riskLevel: 'destructive',
		description: e2bOperationRoutes['volumes.delete'].description,
	},
	'envd.health': {
		riskLevel: 'read',
		description: e2bOperationRoutes['envd.health'].description,
	},
	'envd.metrics': {
		riskLevel: 'read',
		description: e2bOperationRoutes['envd.metrics'].description,
	},
	'envd.getEnvironmentVariables': {
		riskLevel: 'read',
		description: e2bOperationRoutes['envd.getEnvironmentVariables'].description,
	},
	'filesystem.createWatcher': {
		riskLevel: 'write',
		description: e2bOperationRoutes['filesystem.createWatcher'].description,
	},
	'filesystem.getWatcherEvents': {
		riskLevel: 'read',
		description: e2bOperationRoutes['filesystem.getWatcherEvents'].description,
	},
	'filesystem.listDir': {
		riskLevel: 'read',
		description: e2bOperationRoutes['filesystem.listDir'].description,
	},
	'filesystem.createDir': {
		riskLevel: 'write',
		description: e2bOperationRoutes['filesystem.createDir'].description,
	},
	'filesystem.move': {
		riskLevel: 'write',
		description: e2bOperationRoutes['filesystem.move'].description,
	},
	'filesystem.remove': {
		riskLevel: 'destructive',
		description: e2bOperationRoutes['filesystem.remove'].description,
	},
	'filesystem.removeWatcher': {
		riskLevel: 'write',
		description: e2bOperationRoutes['filesystem.removeWatcher'].description,
	},
	'filesystem.stat': {
		riskLevel: 'read',
		description: e2bOperationRoutes['filesystem.stat'].description,
	},
	'process.closeStdin': {
		riskLevel: 'write',
		description: e2bOperationRoutes['process.closeStdin'].description,
	},
	'process.list': {
		riskLevel: 'read',
		description: e2bOperationRoutes['process.list'].description,
	},
	'process.sendInput': {
		riskLevel: 'write',
		description: e2bOperationRoutes['process.sendInput'].description,
	},
	'process.sendSignal': {
		riskLevel: 'destructive',
		description: e2bOperationRoutes['process.sendSignal'].description,
	},
	'process.update': {
		riskLevel: 'write',
		description: e2bOperationRoutes['process.update'].description,
	},
	'teams.getMetrics': {
		riskLevel: 'read',
		description: e2bOperationRoutes['teams.getMetrics'].description,
	},
	'teams.getMaxMetrics': {
		riskLevel: 'read',
		description: e2bOperationRoutes['teams.getMaxMetrics'].description,
	},
	'secrets.list': {
		riskLevel: 'read',
		description: e2bOperationRoutes['secrets.list'].description,
	},
	'secrets.create': {
		riskLevel: 'write',
		description: e2bOperationRoutes['secrets.create'].description,
	},
	'secrets.get': {
		riskLevel: 'read',
		description: e2bOperationRoutes['secrets.get'].description,
	},
	'secrets.update': {
		riskLevel: 'write',
		description: e2bOperationRoutes['secrets.update'].description,
	},
	'secrets.delete': {
		riskLevel: 'destructive',
		description: e2bOperationRoutes['secrets.delete'].description,
	},
	'events.listBySandbox': {
		riskLevel: 'read',
		description: e2bOperationRoutes['events.listBySandbox'].description,
	},
	'events.list': {
		riskLevel: 'read',
		description: e2bOperationRoutes['events.list'].description,
	},
} satisfies RequiredPluginEndpointMeta<typeof e2bEndpointsNested>;

export const e2bAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

const defaultAuthType: AuthTypes = 'api_key' as const;
const apiKeyOperationIds: Set<string> = new Set(
	Object.values(e2bOperationRoutes)
		.filter((route) => route.auth === 'apiKey')
		.map((route) => route.id),
);

export type BaseE2bPlugin<T extends E2bPluginOptions> = CorsairPlugin<
	'e2b',
	typeof E2bSchema,
	typeof e2bEndpointsNested,
	typeof e2bWebhooksNested,
	T,
	typeof defaultAuthType
>;
export type InternalE2bPlugin = BaseE2bPlugin<E2bPluginOptions>;
export type ExternalE2bPlugin<T extends E2bPluginOptions> = BaseE2bPlugin<T>;

export function e2b<const T extends E2bPluginOptions>(
	incomingOptions: E2bPluginOptions & T = {} as E2bPluginOptions & T,
): ExternalE2bPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	const { DEFAULT: builtInDefault, ...builtInHandlers } = errorHandlers;
	const { DEFAULT: callerDefault, ...callerHandlers } =
		options.errorHandlers ?? {};
	return {
		id: 'e2b',
		authConfig: e2bAuthConfig,
		schema: E2bSchema,
		options,
		hooks: options.hooks,
		endpoints: e2bEndpointsNested,
		webhooks: e2bWebhooksNested,
		endpointMeta: e2bEndpointMeta,
		endpointSchemas: e2bEndpointSchemas,
		errorHandlers: {
			...callerHandlers,
			...builtInHandlers,
			...callerHandlers,
			DEFAULT: callerDefault ?? builtInDefault,
		},
		keyBuilder: async (ctx: E2bKeyBuilderContext, source) => {
			if (source !== 'endpoint') return '';
			if (!apiKeyOperationIds.has(ctx.meteredOperationId ?? '')) return '';
			if (options.key !== undefined) {
				if (options.key.length === 0)
					throw new AuthMissingError('e2b', 'api_key');
				return options.key;
			}
			if (!ctx.keys) throw new AuthMissingError('e2b', 'api_key');
			const key = await ctx.keys.get_api_key();
			if (!key) throw new AuthMissingError('e2b', 'api_key');
			return key;
		},
	} satisfies InternalE2bPlugin;
}

export type { E2bEndpointInputs, E2bEndpointOutputs } from './endpoints/types';
