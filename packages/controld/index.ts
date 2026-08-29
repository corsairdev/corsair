import type {
	AuthTypes,
	BindEndpoints,
	CorsairEndpoint,
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
import { z } from 'zod';
import * as endpoints from './endpoints';
import type {
	ControlDEndpointInputs,
	ControlDEndpointOutputs,
} from './endpoints/types';
import {
	ControlDEndpointInputSchemas,
	ControlDEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ControlDSchema } from './schema';

export type ControlDPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalControlDPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof controlDEndpointsNested>;
};

export type ControlDContext = CorsairPluginContext<
	typeof ControlDSchema,
	ControlDPluginOptions
>;

export type ControlDKeyBuilderContext =
	KeyBuilderContext<ControlDPluginOptions>;

export type ControlDBoundEndpoints = BindEndpoints<
	typeof controlDEndpointsNested
>;

type ControlDEndpoint<K extends keyof ControlDEndpointOutputs> =
	CorsairEndpoint<
		ControlDContext,
		ControlDEndpointInputs[K],
		ControlDEndpointOutputs[K]
	>;

export type ControlDEndpoints = {};

const controlDEndpointsNested = {
	profiles: {
		list: endpoints.listProfiles,
		get: endpoints.getProfile,
		create: endpoints.createProfile,
		update: endpoints.updateProfile,
		delete: endpoints.deleteProfile,
	},
	devices: {
		list: endpoints.listDevices,
		get: endpoints.getDevice,
		create: endpoints.createDevice,
		update: endpoints.updateDevice,
		delete: endpoints.deleteDevice,
	},
	rules: {
		list: endpoints.listRules,
		create: endpoints.createRule,
		update: endpoints.updateRule,
		delete: endpoints.deleteRule,
	},
	analytics: {
		list: endpoints.listAnalytics,
		export: endpoints.exportAnalytics,
		summary: endpoints.getAnalyticsSummary,
		topDomains: endpoints.getAnalyticsTopDomains,
		status: endpoints.getAnalyticsStatus,
	},
	services: {
		list: endpoints.listServices,
		get: endpoints.getService,
		update: endpoints.updateService,
		enable: endpoints.enableService,
		disable: endpoints.disableService,
	},
	defaultRules: {
		list: endpoints.listDefaultRules,
		get: endpoints.getDefaultRule,
		create: endpoints.createDefaultRule,
		update: endpoints.updateDefaultRule,
		delete: endpoints.deleteDefaultRule,
	},
	domainOverrides: {
		list: endpoints.listDomainOverrides,
		get: endpoints.getDomainOverride,
		create: endpoints.createDomainOverride,
		update: endpoints.updateDomainOverride,
		delete: endpoints.deleteDomainOverride,
	},
	routers: {
		list: endpoints.listRouters,
		get: endpoints.getRouter,
		create: endpoints.createRouter,
		update: endpoints.updateRouter,
		delete: endpoints.deleteRouter,
	},
	organizations: {
		list: endpoints.listOrganizations,
		get: endpoints.getOrganization,
		create: endpoints.createOrganization,
		update: endpoints.updateOrganization,
		delete: endpoints.deleteOrganization,
	},
	users: {
		list: endpoints.listUsers,
		get: endpoints.getUser,
		create: endpoints.createUser,
		update: endpoints.updateUser,
		delete: endpoints.deleteUser,
	},
	resolvers: {
		list: endpoints.listResolvers,
		get: endpoints.getResolver,
		create: endpoints.createResolver,
		update: endpoints.updateResolver,
		delete: endpoints.deleteResolver,
	},
} as const;

export const controlDEndpointSchemas = {
	'profiles.list': {
		input: ControlDEndpointInputSchemas.listProfiles,
		output: ControlDEndpointOutputSchemas.listProfiles,
	},
	'profiles.get': {
		input: ControlDEndpointInputSchemas.getProfile,
		output: ControlDEndpointOutputSchemas.getProfile,
	},
	'profiles.create': {
		input: ControlDEndpointInputSchemas.createProfile,
		output: ControlDEndpointOutputSchemas.createProfile,
	},
	'profiles.update': {
		input: ControlDEndpointInputSchemas.updateProfile,
		output: ControlDEndpointOutputSchemas.updateProfile,
	},
	'profiles.delete': {
		input: ControlDEndpointInputSchemas.deleteProfile,
		output: ControlDEndpointOutputSchemas.deleteProfile,
	},
	'devices.list': {
		input: ControlDEndpointInputSchemas.listDevices,
		output: ControlDEndpointOutputSchemas.listDevices,
	},
	'devices.get': {
		input: ControlDEndpointInputSchemas.getDevice,
		output: ControlDEndpointOutputSchemas.getDevice,
	},
	'devices.create': {
		input: ControlDEndpointInputSchemas.createDevice,
		output: ControlDEndpointOutputSchemas.createDevice,
	},
	'devices.update': {
		input: ControlDEndpointInputSchemas.updateDevice,
		output: ControlDEndpointOutputSchemas.updateDevice,
	},
	'devices.delete': {
		input: ControlDEndpointInputSchemas.deleteDevice,
		output: ControlDEndpointOutputSchemas.deleteDevice,
	},
	'rules.list': {
		input: ControlDEndpointInputSchemas.listRules,
		output: ControlDEndpointOutputSchemas.listRules,
	},
	'rules.create': {
		input: ControlDEndpointInputSchemas.createRule,
		output: ControlDEndpointOutputSchemas.createRule,
	},
	'rules.update': {
		input: ControlDEndpointInputSchemas.updateRule,
		output: ControlDEndpointOutputSchemas.updateRule,
	},
	'rules.delete': {
		input: ControlDEndpointInputSchemas.deleteRule,
		output: ControlDEndpointOutputSchemas.deleteRule,
	},
	'analytics.list': {
		input: z.object({ profile_id: z.string() }),
		output: z.unknown(),
	},
	'analytics.export': {
		input: z.object({ profile_id: z.string() }),
		output: z.unknown(),
	},
	'analytics.summary': {
		input: z.object({ profile_id: z.string() }),
		output: z.unknown(),
	},
	'analytics.topDomains': {
		input: z.object({ profile_id: z.string() }),
		output: z.unknown(),
	},
	'analytics.status': {
		input: z.object({ profile_id: z.string() }),
		output: z.unknown(),
	},
	'services.list': {
		input: z.object({ profile_id: z.string() }),
		output: z.unknown(),
	},
	'services.get': {
		input: z.object({ profile_id: z.string(), id: z.string() }),
		output: z.unknown(),
	},
	'services.update': {
		input: z.object({
			profile_id: z.string(),
			id: z.string(),
			action: z.string(),
		}),
		output: z.unknown(),
	},
	'services.enable': {
		input: z.object({ profile_id: z.string(), id: z.string() }),
		output: z.unknown(),
	},
	'services.disable': {
		input: z.object({ profile_id: z.string(), id: z.string() }),
		output: z.unknown(),
	},
	'defaultRules.list': {
		input: z.object({ profile_id: z.string() }),
		output: z.unknown(),
	},
	'defaultRules.get': {
		input: z.object({ profile_id: z.string(), id: z.string() }),
		output: z.unknown(),
	},
	'defaultRules.create': {
		input: z.object({
			profile_id: z.string(),
			domain: z.string(),
			action: z.string(),
		}),
		output: z.unknown(),
	},
	'defaultRules.update': {
		input: z.object({
			profile_id: z.string(),
			id: z.string(),
			action: z.string().optional(),
		}),
		output: z.unknown(),
	},
	'defaultRules.delete': {
		input: z.object({ profile_id: z.string(), id: z.string() }),
		output: z.unknown(),
	},
	'domainOverrides.list': {
		input: z.object({ profile_id: z.string() }),
		output: z.unknown(),
	},
	'domainOverrides.get': {
		input: z.object({ profile_id: z.string(), id: z.string() }),
		output: z.unknown(),
	},
	'domainOverrides.create': {
		input: z.object({
			profile_id: z.string(),
			domain: z.string(),
			ip: z.string(),
		}),
		output: z.unknown(),
	},
	'domainOverrides.update': {
		input: z.object({
			profile_id: z.string(),
			id: z.string(),
			ip: z.string().optional(),
		}),
		output: z.unknown(),
	},
	'domainOverrides.delete': {
		input: z.object({ profile_id: z.string(), id: z.string() }),
		output: z.unknown(),
	},
	'routers.list': { input: z.object({}), output: z.unknown() },
	'routers.get': { input: z.object({ id: z.string() }), output: z.unknown() },
	'routers.create': {
		input: z.object({ name: z.string(), profile_id: z.string().optional() }),
		output: z.unknown(),
	},
	'routers.update': {
		input: z.object({
			id: z.string(),
			name: z.string().optional(),
			profile_id: z.string().optional(),
		}),
		output: z.unknown(),
	},
	'routers.delete': {
		input: z.object({ id: z.string() }),
		output: z.unknown(),
	},
	'organizations.list': { input: z.object({}), output: z.unknown() },
	'organizations.get': {
		input: z.object({ id: z.string() }),
		output: z.unknown(),
	},
	'organizations.create': {
		input: z.object({ name: z.string() }),
		output: z.unknown(),
	},
	'organizations.update': {
		input: z.object({ id: z.string(), name: z.string().optional() }),
		output: z.unknown(),
	},
	'organizations.delete': {
		input: z.object({ id: z.string() }),
		output: z.unknown(),
	},
	'users.list': { input: z.object({}), output: z.unknown() },
	'users.get': { input: z.object({ id: z.string() }), output: z.unknown() },
	'users.create': {
		input: z.object({ email: z.string(), profile_id: z.string().optional() }),
		output: z.unknown(),
	},
	'users.update': {
		input: z.object({
			id: z.string(),
			email: z.string().optional(),
			profile_id: z.string().optional(),
		}),
		output: z.unknown(),
	},
	'users.delete': { input: z.object({ id: z.string() }), output: z.unknown() },
	'resolvers.list': { input: z.object({}), output: z.unknown() },
	'resolvers.get': { input: z.object({ id: z.string() }), output: z.unknown() },
	'resolvers.create': {
		input: z.object({ name: z.string(), profile_id: z.string().optional() }),
		output: z.unknown(),
	},
	'resolvers.update': {
		input: z.object({
			id: z.string(),
			name: z.string().optional(),
			profile_id: z.string().optional(),
		}),
		output: z.unknown(),
	},
	'resolvers.delete': {
		input: z.object({ id: z.string() }),
		output: z.unknown(),
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof controlDEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const controlDEndpointMeta = {
	'profiles.list': {
		riskLevel: 'read',
		description: 'List all DNS filtering profiles',
	},
	'profiles.get': { riskLevel: 'read', description: 'Get a specific profile' },
	'profiles.create': {
		riskLevel: 'write',
		description: 'Create a new DNS filtering profile',
	},
	'profiles.update': {
		riskLevel: 'write',
		description: 'Update a DNS filtering profile',
	},
	'profiles.delete': {
		riskLevel: 'write',
		description: 'Delete a DNS filtering profile',
		irreversible: true,
	},
	'devices.list': { riskLevel: 'read', description: 'List all devices' },
	'devices.get': { riskLevel: 'read', description: 'Get a specific device' },
	'devices.create': { riskLevel: 'write', description: 'Create a new device' },
	'devices.update': { riskLevel: 'write', description: 'Update a device' },
	'devices.delete': {
		riskLevel: 'write',
		description: 'Delete a device',
		irreversible: true,
	},
	'rules.list': {
		riskLevel: 'read',
		description: 'List filtering rules for a profile',
	},
	'rules.create': {
		riskLevel: 'write',
		description: 'Create a filtering rule',
	},
	'rules.update': {
		riskLevel: 'write',
		description: 'Update a filtering rule',
	},
	'rules.delete': {
		riskLevel: 'write',
		description: 'Delete a filtering rule',
		irreversible: true,
	},
	'analytics.list': { riskLevel: 'read', description: 'List analytics data' },
	'analytics.export': {
		riskLevel: 'read',
		description: 'Export analytics data',
	},
	'analytics.summary': {
		riskLevel: 'read',
		description: 'Get analytics summary',
	},
	'analytics.topDomains': {
		riskLevel: 'read',
		description: 'Get top queried domains',
	},
	'analytics.status': {
		riskLevel: 'read',
		description: 'Get analytics status',
	},
	'services.list': {
		riskLevel: 'read',
		description: 'List available filter services for a profile',
	},
	'services.get': {
		riskLevel: 'read',
		description: 'Get a specific filter service',
	},
	'services.update': {
		riskLevel: 'write',
		description: 'Update a filter service action',
	},
	'services.enable': {
		riskLevel: 'write',
		description: 'Enable a filter service',
	},
	'services.disable': {
		riskLevel: 'write',
		description: 'Disable a filter service',
	},
	'defaultRules.list': {
		riskLevel: 'read',
		description: 'List default rules for a profile',
	},
	'defaultRules.get': { riskLevel: 'read', description: 'Get a default rule' },
	'defaultRules.create': {
		riskLevel: 'write',
		description: 'Create a default rule',
	},
	'defaultRules.update': {
		riskLevel: 'write',
		description: 'Update a default rule',
	},
	'defaultRules.delete': {
		riskLevel: 'write',
		description: 'Delete a default rule',
		irreversible: true,
	},
	'domainOverrides.list': {
		riskLevel: 'read',
		description: 'List domain overrides for a profile',
	},
	'domainOverrides.get': {
		riskLevel: 'read',
		description: 'Get a domain override',
	},
	'domainOverrides.create': {
		riskLevel: 'write',
		description: 'Create a domain override',
	},
	'domainOverrides.update': {
		riskLevel: 'write',
		description: 'Update a domain override',
	},
	'domainOverrides.delete': {
		riskLevel: 'write',
		description: 'Delete a domain override',
		irreversible: true,
	},
	'routers.list': { riskLevel: 'read', description: 'List all routers' },
	'routers.get': { riskLevel: 'read', description: 'Get a specific router' },
	'routers.create': { riskLevel: 'write', description: 'Create a new router' },
	'routers.update': { riskLevel: 'write', description: 'Update a router' },
	'routers.delete': {
		riskLevel: 'write',
		description: 'Delete a router',
		irreversible: true,
	},
	'organizations.list': {
		riskLevel: 'read',
		description: 'List organizations',
	},
	'organizations.get': {
		riskLevel: 'read',
		description: 'Get an organization',
	},
	'organizations.create': {
		riskLevel: 'write',
		description: 'Create an organization',
	},
	'organizations.update': {
		riskLevel: 'write',
		description: 'Update an organization',
	},
	'organizations.delete': {
		riskLevel: 'write',
		description: 'Delete an organization',
		irreversible: true,
	},
	'users.list': { riskLevel: 'read', description: 'List users' },
	'users.get': { riskLevel: 'read', description: 'Get a user' },
	'users.create': { riskLevel: 'write', description: 'Create a user' },
	'users.update': { riskLevel: 'write', description: 'Update a user' },
	'users.delete': {
		riskLevel: 'write',
		description: 'Delete a user',
		irreversible: true,
	},
	'resolvers.list': { riskLevel: 'read', description: 'List DNS resolvers' },
	'resolvers.get': { riskLevel: 'read', description: 'Get a DNS resolver' },
	'resolvers.create': {
		riskLevel: 'write',
		description: 'Create a DNS resolver',
	},
	'resolvers.update': {
		riskLevel: 'write',
		description: 'Update a DNS resolver',
	},
	'resolvers.delete': {
		riskLevel: 'write',
		description: 'Delete a DNS resolver',
		irreversible: true,
	},
} as const satisfies RequiredPluginEndpointMeta<typeof controlDEndpointsNested>;

export const controlDAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseControlDPlugin<T extends ControlDPluginOptions> = CorsairPlugin<
	'controld',
	typeof ControlDSchema,
	typeof controlDEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalControlDPlugin = BaseControlDPlugin<ControlDPluginOptions>;

export type ExternalControlDPlugin<T extends ControlDPluginOptions> =
	BaseControlDPlugin<T>;

export function controld<const T extends ControlDPluginOptions>(
	incomingOptions: ControlDPluginOptions & T = {} as ControlDPluginOptions & T,
): ExternalControlDPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'controld',
		authConfig: controlDAuthConfig,
		schema: ControlDSchema,
		options: options,
		hooks: options.hooks,
		endpoints: controlDEndpointsNested,
		webhooks: {},
		endpointMeta: controlDEndpointMeta,
		endpointSchemas: controlDEndpointSchemas,
		webhookSchemas: {},
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: ControlDKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalControlDPlugin;
}

export type {
	ControlDEndpointInputs,
	ControlDEndpointOutputs,
} from './endpoints/types';
