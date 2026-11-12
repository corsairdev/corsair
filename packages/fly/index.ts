import type {
	BindEndpoints,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
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
		get: operations.apps.get.endpoint,
		nameAvailable: operations.apps.nameAvailable.endpoint,
	},
	organizations: {
		list: operations.organizations.list.endpoint,
		get: operations.organizations.get.endpoint,
		personal: operations.organizations.personal.endpoint,
		delete: operations.organizations.delete.endpoint,
	},
	checks: {
		jobs: operations.checks.jobs.endpoint,
		locations: operations.checks.locations.endpoint,
		createJob: operations.checks.createJob.endpoint,
		runJob: operations.checks.runJob.endpoint,
	},
	wireguard: {
		listPeers: operations.wireguard.listPeers.endpoint,
		getPeer: operations.wireguard.getPeer.endpoint,
		listTokens: operations.wireguard.listTokens.endpoint,
		addPeer: operations.wireguard.addPeer.endpoint,
		removePeer: operations.wireguard.removePeer.endpoint,
		validatePeers: operations.wireguard.validatePeers.endpoint,
		createToken: operations.wireguard.createToken.endpoint,
		deleteToken: operations.wireguard.deleteToken.endpoint,
	},
	addOns: {
		list: operations.addOns.list.endpoint,
		get: operations.addOns.get.endpoint,
		plans: operations.addOns.plans.endpoint,
		provider: operations.addOns.provider.endpoint,
		create: operations.addOns.create.endpoint,
		update: operations.addOns.update.endpoint,
		delete: operations.addOns.delete.endpoint,
		resetPassword: operations.addOns.resetPassword.endpoint,
	},
	thirdParty: {
		list: operations.thirdParty.list.endpoint,
		create: operations.thirdParty.create.endpoint,
		update: operations.thirdParty.update.endpoint,
		delete: operations.thirdParty.delete.endpoint,
	},
	account: {
		userOnlyToken: operations.account.userOnlyToken.endpoint,
		viewer: operations.account.viewer.endpoint,
	},
	platform: { nearestRegion: operations.platform.nearestRegion.endpoint },
} as const;

// Build metadata from the same definitions that perform runtime validation.
function metadata() {
	const schemas: Record<string, { input: z.ZodType; output: z.ZodType }> = {};
	for (const [group, entries] of Object.entries(operations)) {
		for (const [name, definition] of Object.entries(entries)) {
			const key = `${group}.${name}`;
			schemas[key] = { input: definition.input, output: definition.output };
		}
	}
	return { schemas };
}
const meta = metadata();
const flyMetadataDefinitions = {
	'apps.list': operations.apps.list,
	'apps.get': operations.apps.get,
	'apps.nameAvailable': operations.apps.nameAvailable,
	'organizations.list': operations.organizations.list,
	'organizations.get': operations.organizations.get,
	'organizations.personal': operations.organizations.personal,
	'organizations.delete': operations.organizations.delete,
	'checks.jobs': operations.checks.jobs,
	'checks.locations': operations.checks.locations,
	'checks.createJob': operations.checks.createJob,
	'checks.runJob': operations.checks.runJob,
	'wireguard.listPeers': operations.wireguard.listPeers,
	'wireguard.getPeer': operations.wireguard.getPeer,
	'wireguard.listTokens': operations.wireguard.listTokens,
	'wireguard.addPeer': operations.wireguard.addPeer,
	'wireguard.removePeer': operations.wireguard.removePeer,
	'wireguard.validatePeers': operations.wireguard.validatePeers,
	'wireguard.createToken': operations.wireguard.createToken,
	'wireguard.deleteToken': operations.wireguard.deleteToken,
	'addOns.list': operations.addOns.list,
	'addOns.get': operations.addOns.get,
	'addOns.plans': operations.addOns.plans,
	'addOns.provider': operations.addOns.provider,
	'addOns.create': operations.addOns.create,
	'addOns.update': operations.addOns.update,
	'addOns.delete': operations.addOns.delete,
	'addOns.resetPassword': operations.addOns.resetPassword,
	'thirdParty.list': operations.thirdParty.list,
	'thirdParty.create': operations.thirdParty.create,
	'thirdParty.update': operations.thirdParty.update,
	'thirdParty.delete': operations.thirdParty.delete,
	'account.userOnlyToken': operations.account.userOnlyToken,
	'account.viewer': operations.account.viewer,
	'platform.nearestRegion': operations.platform.nearestRegion,
} satisfies RequiredPluginEndpointMeta<typeof flyEndpoints>;
const flyEndpointMeta = Object.fromEntries(
	Object.entries(flyMetadataDefinitions).map(([path, definition]) => [
		path,
		{ riskLevel: definition.riskLevel, description: definition.description },
	]),
);
export const flyEndpointSchemas = meta.schemas;
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

export function fly<const T extends FlyPluginOptions>(
	incomingOptions: FlyPluginOptions & T = {} as FlyPluginOptions & T,
): ExternalFlyPlugin<T> {
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

export { FlyGraphQLError } from './client';
