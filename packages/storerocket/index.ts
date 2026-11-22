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
import { AuthMissingError } from 'corsair/core';
import { Locations, Projects, SpecialHours, Users } from './endpoints';
import type {
	StorerocketEndpointInputs,
	StorerocketEndpointOutputs,
} from './endpoints/types';
import {
	StorerocketEndpointInputSchemas,
	StorerocketEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { StorerocketSchema } from './schema';

export type StorerocketPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** Storerocket API token (storerocket.io/app/api-tokens). */
	key?: string;
	hooks?: InternalStorerocketPlugin['hooks'];
	webhookHooks?: InternalStorerocketPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof storerocketEndpointsNested>;
};

export type StorerocketContext = CorsairPluginContext<
	typeof StorerocketSchema,
	StorerocketPluginOptions
>;

export type StorerocketKeyBuilderContext =
	KeyBuilderContext<StorerocketPluginOptions>;

export type StorerocketBoundEndpoints = BindEndpoints<
	typeof storerocketEndpointsNested
>;

type StorerocketEndpoint<K extends keyof StorerocketEndpointOutputs> =
	CorsairEndpoint<
		StorerocketContext,
		StorerocketEndpointInputs[K],
		StorerocketEndpointOutputs[K]
	>;

export type StorerocketEndpoints = {
	[K in keyof StorerocketEndpointOutputs]: StorerocketEndpoint<K>;
};

const storerocketEndpointsNested = {
	users: {
		get: Users.get,
	},
	projects: {
		list: Projects.list,
	},
	locations: {
		list: Locations.list,
		get: Locations.get,
		create: Locations.create,
		update: Locations.update,
		replace: Locations.replace,
		delete: Locations.remove,
	},
	specialHours: {
		list: SpecialHours.list,
		get: SpecialHours.get,
		create: SpecialHours.create,
		update: SpecialHours.update,
		delete: SpecialHours.remove,
	},
} as const;

export const storerocketEndpointSchemas = {
	'users.get': {
		input: StorerocketEndpointInputSchemas.usersGet,
		output: StorerocketEndpointOutputSchemas.usersGet,
	},
	'projects.list': {
		input: StorerocketEndpointInputSchemas.projectsList,
		output: StorerocketEndpointOutputSchemas.projectsList,
	},
	'locations.list': {
		input: StorerocketEndpointInputSchemas.locationsList,
		output: StorerocketEndpointOutputSchemas.locationsList,
	},
	'locations.get': {
		input: StorerocketEndpointInputSchemas.locationsGet,
		output: StorerocketEndpointOutputSchemas.locationsGet,
	},
	'locations.create': {
		input: StorerocketEndpointInputSchemas.locationsCreate,
		output: StorerocketEndpointOutputSchemas.locationsCreate,
	},
	'locations.update': {
		input: StorerocketEndpointInputSchemas.locationsUpdate,
		output: StorerocketEndpointOutputSchemas.locationsUpdate,
	},
	'locations.replace': {
		input: StorerocketEndpointInputSchemas.locationsReplace,
		output: StorerocketEndpointOutputSchemas.locationsReplace,
	},
	'locations.delete': {
		input: StorerocketEndpointInputSchemas.locationsDelete,
		output: StorerocketEndpointOutputSchemas.locationsDelete,
	},
	'specialHours.list': {
		input: StorerocketEndpointInputSchemas.specialHoursList,
		output: StorerocketEndpointOutputSchemas.specialHoursList,
	},
	'specialHours.get': {
		input: StorerocketEndpointInputSchemas.specialHoursGet,
		output: StorerocketEndpointOutputSchemas.specialHoursGet,
	},
	'specialHours.create': {
		input: StorerocketEndpointInputSchemas.specialHoursCreate,
		output: StorerocketEndpointOutputSchemas.specialHoursCreate,
	},
	'specialHours.update': {
		input: StorerocketEndpointInputSchemas.specialHoursUpdate,
		output: StorerocketEndpointOutputSchemas.specialHoursUpdate,
	},
	'specialHours.delete': {
		input: StorerocketEndpointInputSchemas.specialHoursDelete,
		output: StorerocketEndpointOutputSchemas.specialHoursDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof storerocketEndpointsNested
>;

const storerocketEndpointMeta = {
	'users.get': {
		riskLevel: 'read',
		description: 'Read the profile associated with the token',
	},
	'projects.list': {
		riskLevel: 'read',
		description: 'List the projects the token can access',
	},
	'locations.list': {
		riskLevel: 'read',
		description: 'List locations with filters, include flags and pagination',
	},
	'locations.get': {
		riskLevel: 'read',
		description: 'Read one location and its optional attached information',
	},
	'locations.create': {
		riskLevel: 'write',
		description: 'Create a location; name and city are required',
	},
	'locations.update': {
		riskLevel: 'write',
		description:
			'Update selected location fields; omissions keep their saved values',
	},
	'locations.replace': {
		riskLevel: 'write',
		description:
			'Replace a location with the PUT contract; omitted markers and types reset to defaults',
	},
	'locations.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a location from a project',
	},
	'specialHours.list': {
		riskLevel: 'read',
		description: 'List the holiday and special-hours rules of a project',
	},
	'specialHours.get': {
		riskLevel: 'read',
		description: 'Read one special-hours rule',
	},
	'specialHours.create': {
		riskLevel: 'write',
		description:
			'Create a special-hours rule, with an optional idempotency key',
	},
	'specialHours.update': {
		riskLevel: 'write',
		description: 'Change selected fields of a special-hours rule',
	},
	'specialHours.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a special-hours rule; locations fall back to weekly hours',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof storerocketEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const storerocketAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BaseStorerocketPlugin<T extends StorerocketPluginOptions> =
	CorsairPlugin<
		'storerocket',
		typeof StorerocketSchema,
		typeof storerocketEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType,
		typeof storerocketAuthConfig
	>;

export type InternalStorerocketPlugin =
	BaseStorerocketPlugin<StorerocketPluginOptions>;

export type ExternalStorerocketPlugin<T extends StorerocketPluginOptions> =
	BaseStorerocketPlugin<T>;

export function storerocket<const T extends StorerocketPluginOptions>(
	incomingOptions: StorerocketPluginOptions &
		T = {} as StorerocketPluginOptions & T,
): ExternalStorerocketPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'storerocket',
		authConfig: storerocketAuthConfig,
		schema: StorerocketSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: storerocketEndpointsNested,
		// StoreRocket documents no outgoing webhooks.
		webhooks: {},
		endpointMeta: storerocketEndpointMeta,
		endpointSchemas: storerocketEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: StorerocketKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('storerocket', ctx.authType ?? 'api_key');
		},
	} satisfies InternalStorerocketPlugin;
}

export { StorerocketAPIError } from './client';
export type {
	StorerocketEndpointInputs,
	StorerocketEndpointOutputs,
	StorerocketHours,
	StorerocketLocation,
	StorerocketProject,
	StorerocketSpecialHoursRule,
	StorerocketUser,
} from './endpoints/types';
