import type {
	BindEndpoints,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	EndpointMetaEntry,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import type { z } from 'zod';
import { operations } from './endpoints/operations';
import { errorHandlers } from './error-handlers';
import { FlySchema } from './schema';

export type FlyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalFlyPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof flyEndpoints>;
};
export type FlyContext = CorsairPluginContext<
	typeof FlySchema,
	FlyPluginOptions
>;
export type FlyKeyBuilderContext = KeyBuilderContext<FlyPluginOptions>;

const flyEndpoints = {
	apps: {
		list: operations.apps.list.endpoint,
		create: operations.apps.create.endpoint,
		get: operations.apps.get.endpoint,
		delete: operations.apps.delete.endpoint,
	},
	machines: {
		list: operations.machines.list.endpoint,
		listForOrg: operations.machines.listForOrg.endpoint,
		create: operations.machines.create.endpoint,
		get: operations.machines.get.endpoint,
		update: operations.machines.update.endpoint,
		delete: operations.machines.delete.endpoint,
		start: operations.machines.start.endpoint,
		stop: operations.machines.stop.endpoint,
		restart: operations.machines.restart.endpoint,
		suspend: operations.machines.suspend.endpoint,
		signal: operations.machines.signal.endpoint,
		wait: operations.machines.wait.endpoint,
		cordon: operations.machines.cordon.endpoint,
		uncordon: operations.machines.uncordon.endpoint,
		exec: operations.machines.exec.endpoint,
		getLease: operations.machines.getLease.endpoint,
		createLease: operations.machines.createLease.endpoint,
		releaseLease: operations.machines.releaseLease.endpoint,
		getMetadata: operations.machines.getMetadata.endpoint,
		getMetadataKey: operations.machines.getMetadataKey.endpoint,
		updateMetadata: operations.machines.updateMetadata.endpoint,
		setMetadataKey: operations.machines.setMetadataKey.endpoint,
		deleteMetadataKey: operations.machines.deleteMetadataKey.endpoint,
		listEvents: operations.machines.listEvents.endpoint,
		listProcesses: operations.machines.listProcesses.endpoint,
		listVersions: operations.machines.listVersions.endpoint,
	},
	volumes: {
		list: operations.volumes.list.endpoint,
		listForOrg: operations.volumes.listForOrg.endpoint,
		create: operations.volumes.create.endpoint,
		get: operations.volumes.get.endpoint,
		update: operations.volumes.update.endpoint,
		delete: operations.volumes.delete.endpoint,
		extend: operations.volumes.extend.endpoint,
		listSnapshots: operations.volumes.listSnapshots.endpoint,
		createSnapshot: operations.volumes.createSnapshot.endpoint,
	},
	secrets: {
		list: operations.secrets.list.endpoint,
		get: operations.secrets.get.endpoint,
		set: operations.secrets.set.endpoint,
		update: operations.secrets.update.endpoint,
		delete: operations.secrets.delete.endpoint,
	},
	certificates: {
		list: operations.certificates.list.endpoint,
		get: operations.certificates.get.endpoint,
		request: operations.certificates.request.endpoint,
		check: operations.certificates.check.endpoint,
		delete: operations.certificates.delete.endpoint,
	},
	ipAssignments: {
		list: operations.ipAssignments.list.endpoint,
		create: operations.ipAssignments.create.endpoint,
		delete: operations.ipAssignments.delete.endpoint,
	},
	tokens: {
		current: operations.tokens.current.endpoint,
	},
	platform: {
		regions: operations.platform.regions.endpoint,
	},
} as const;

type OperationMeta = {
	riskLevel: EndpointMetaEntry['riskLevel'];
	description: string;
	irreversible?: boolean;
};
// Approval prompts read riskLevel, description and the irreversible flag.
const entry = ({ riskLevel, description, irreversible }: OperationMeta) => ({
	riskLevel,
	description,
	...(irreversible ? { irreversible: true } : {}),
});
const flyEndpointMeta = {
	'apps.list': entry(operations.apps.list),
	'apps.create': entry(operations.apps.create),
	'apps.get': entry(operations.apps.get),
	'apps.delete': entry(operations.apps.delete),
	'machines.list': entry(operations.machines.list),
	'machines.listForOrg': entry(operations.machines.listForOrg),
	'machines.create': entry(operations.machines.create),
	'machines.get': entry(operations.machines.get),
	'machines.update': entry(operations.machines.update),
	'machines.delete': entry(operations.machines.delete),
	'machines.start': entry(operations.machines.start),
	'machines.stop': entry(operations.machines.stop),
	'machines.restart': entry(operations.machines.restart),
	'machines.suspend': entry(operations.machines.suspend),
	'machines.signal': entry(operations.machines.signal),
	'machines.wait': entry(operations.machines.wait),
	'machines.cordon': entry(operations.machines.cordon),
	'machines.uncordon': entry(operations.machines.uncordon),
	'machines.exec': entry(operations.machines.exec),
	'machines.getLease': entry(operations.machines.getLease),
	'machines.createLease': entry(operations.machines.createLease),
	'machines.releaseLease': entry(operations.machines.releaseLease),
	'machines.getMetadata': entry(operations.machines.getMetadata),
	'machines.getMetadataKey': entry(operations.machines.getMetadataKey),
	'machines.updateMetadata': entry(operations.machines.updateMetadata),
	'machines.setMetadataKey': entry(operations.machines.setMetadataKey),
	'machines.deleteMetadataKey': entry(operations.machines.deleteMetadataKey),
	'machines.listEvents': entry(operations.machines.listEvents),
	'machines.listProcesses': entry(operations.machines.listProcesses),
	'machines.listVersions': entry(operations.machines.listVersions),
	'volumes.list': entry(operations.volumes.list),
	'volumes.listForOrg': entry(operations.volumes.listForOrg),
	'volumes.create': entry(operations.volumes.create),
	'volumes.get': entry(operations.volumes.get),
	'volumes.update': entry(operations.volumes.update),
	'volumes.delete': entry(operations.volumes.delete),
	'volumes.extend': entry(operations.volumes.extend),
	'volumes.listSnapshots': entry(operations.volumes.listSnapshots),
	'volumes.createSnapshot': entry(operations.volumes.createSnapshot),
	'secrets.list': entry(operations.secrets.list),
	'secrets.get': entry(operations.secrets.get),
	'secrets.set': entry(operations.secrets.set),
	'secrets.update': entry(operations.secrets.update),
	'secrets.delete': entry(operations.secrets.delete),
	'certificates.list': entry(operations.certificates.list),
	'certificates.get': entry(operations.certificates.get),
	'certificates.request': entry(operations.certificates.request),
	'certificates.check': entry(operations.certificates.check),
	'certificates.delete': entry(operations.certificates.delete),
	'ipAssignments.list': entry(operations.ipAssignments.list),
	'ipAssignments.create': entry(operations.ipAssignments.create),
	'ipAssignments.delete': entry(operations.ipAssignments.delete),
	'tokens.current': entry(operations.tokens.current),
	'platform.regions': entry(operations.platform.regions),
} satisfies RequiredPluginEndpointMeta<typeof flyEndpoints>;

export const flyEndpointSchemas = Object.fromEntries(
	Object.entries(operations).flatMap(([group, entries]) =>
		Object.entries(entries).map(([name, definition]) => [
			`${group}.${name}`,
			{ input: definition.input, output: definition.output },
		]),
	),
) satisfies Record<string, { input: z.ZodType; output: z.ZodType }>;
export const flyAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;
const defaultAuthType = 'api_key' as const;
export type FlyBoundEndpoints = BindEndpoints<typeof flyEndpoints>;
export type BaseFlyPlugin<T extends FlyPluginOptions> = CorsairPlugin<
	'fly',
	typeof FlySchema,
	typeof flyEndpoints,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;
export type InternalFlyPlugin = BaseFlyPlugin<FlyPluginOptions>;
export type ExternalFlyPlugin<T extends FlyPluginOptions> = BaseFlyPlugin<T>;

export function fly(): ExternalFlyPlugin<{}>;
export function fly<const T extends FlyPluginOptions>(
	incomingOptions: FlyPluginOptions & T,
): ExternalFlyPlugin<T>;
export function fly(incomingOptions: FlyPluginOptions = {}): InternalFlyPlugin {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'fly',
		authConfig: flyAuthConfig,
		schema: FlySchema,
		options,
		hooks: options.hooks,
		endpoints: flyEndpoints,
		webhooks: {},
		endpointMeta: flyEndpointMeta,
		endpointSchemas: flyEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: FlyKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key?.trim()) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key?.trim()) return key;
			}
			throw new AuthMissingError('fly', 'api_key');
		},
	} satisfies InternalFlyPlugin;
}

export { flyAuthorization } from './client';
