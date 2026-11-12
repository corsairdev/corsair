import type {
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
import * as handlers from './endpoints';
import type {
	ShortioEndpointInputs,
	ShortioEndpointOutputs,
} from './endpoints/types';
import {
	ShortioEndpointInputSchemas as inputs,
	ShortioEndpointOutputSchemas as outputs,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { ShortioSchema } from './schema';

export type ShortioPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalShortioPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof endpoints>;
};
export type ShortioContext = CorsairPluginContext<
	typeof ShortioSchema,
	ShortioPluginOptions
>;
export type ShortioKeyBuilderContext = KeyBuilderContext<ShortioPluginOptions>;
export type ShortioBoundEndpoints = BindEndpoints<typeof endpoints>;
export type ShortioEndpoints = {
	[K in keyof ShortioEndpointInputs]: CorsairEndpoint<
		ShortioContext,
		ShortioEndpointInputs[K],
		ShortioEndpointOutputs[K]
	>;
};

const endpoints = {
	links: {
		list: handlers.linksList,
		get: handlers.linksGet,
		expand: handlers.linksExpand,
		create: handlers.linksCreate,
		update: handlers.linksUpdate,
		delete: handlers.linksDelete,
		archive: handlers.linksArchive,
		unarchive: handlers.linksUnarchive,
		archiveBulk: handlers.linksArchiveBulk,
		unarchiveBulk: handlers.linksUnarchiveBulk,
		deleteBulk: handlers.linksDeleteBulk,
	},
	domains: { list: handlers.domainsList, get: handlers.domainsGet },
} as const;
export const shortioEndpointSchemas = {
	'links.list': { input: inputs.linksList, output: outputs.linksList },
	'links.get': { input: inputs.linksGet, output: outputs.linksGet },
	'links.expand': { input: inputs.linksExpand, output: outputs.linksExpand },
	'links.create': { input: inputs.linksCreate, output: outputs.linksCreate },
	'links.update': { input: inputs.linksUpdate, output: outputs.linksUpdate },
	'links.delete': { input: inputs.linksDelete, output: outputs.linksDelete },
	'links.archive': { input: inputs.linksArchive, output: outputs.linksArchive },
	'links.unarchive': {
		input: inputs.linksUnarchive,
		output: outputs.linksUnarchive,
	},
	'links.archiveBulk': {
		input: inputs.linksArchiveBulk,
		output: outputs.linksArchiveBulk,
	},
	'links.unarchiveBulk': {
		input: inputs.linksUnarchiveBulk,
		output: outputs.linksUnarchiveBulk,
	},
	'links.deleteBulk': {
		input: inputs.linksDeleteBulk,
		output: outputs.linksDeleteBulk,
	},
	'domains.list': { input: inputs.domainsList, output: outputs.domainsList },
	'domains.get': { input: inputs.domainsGet, output: outputs.domainsGet },
} as const satisfies RequiredPluginEndpointSchemas<typeof endpoints>;
export const shortioEndpointMeta = {
	'links.list': {
		riskLevel: 'read',
		description: 'List links for a domain with cursor pagination.',
	},
	'links.get': { riskLevel: 'read', description: 'Get a link by its ID.' },
	'links.expand': {
		riskLevel: 'read',
		description: 'Expand a short link by domain and path.',
	},
	'links.create': {
		riskLevel: 'write',
		description: 'Create a branded short link.',
	},
	'links.update': {
		riskLevel: 'write',
		description: 'Update a link by its ID.',
	},
	'links.delete': {
		riskLevel: 'destructive',
		description: 'Delete a link by its ID.',
	},
	'links.archive': { riskLevel: 'write', description: 'Archive a link.' },
	'links.unarchive': { riskLevel: 'write', description: 'Unarchive a link.' },
	'links.archiveBulk': {
		riskLevel: 'write',
		description: 'Archive up to 150 links.',
	},
	'links.unarchiveBulk': {
		riskLevel: 'write',
		description: 'Unarchive up to 150 links.',
	},
	'links.deleteBulk': {
		riskLevel: 'destructive',
		description: 'Delete up to 150 links.',
	},
	'domains.list': {
		riskLevel: 'read',
		description: 'List domains with limit and offset.',
	},
	'domains.get': { riskLevel: 'read', description: 'Get a domain by its ID.' },
} as const satisfies RequiredPluginEndpointMeta<typeof endpoints>;
export const shortioAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;
const defaultAuthType = 'api_key' as const;
export type BaseShortioPlugin<T extends ShortioPluginOptions> = CorsairPlugin<
	'shortio',
	typeof ShortioSchema,
	typeof endpoints,
	{},
	T,
	typeof defaultAuthType,
	typeof shortioAuthConfig
>;
export type InternalShortioPlugin = BaseShortioPlugin<ShortioPluginOptions>;
export type ExternalShortioPlugin<T extends ShortioPluginOptions> =
	BaseShortioPlugin<T>;

export function shortio<const T extends ShortioPluginOptions>(
	incomingOptions: ShortioPluginOptions & T = {} as ShortioPluginOptions & T,
): ExternalShortioPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'shortio',
		schema: ShortioSchema,
		options,
		hooks: options.hooks,
		endpoints,
		webhooks: {},
		endpointMeta: shortioEndpointMeta,
		endpointSchemas: shortioEndpointSchemas,
		authConfig: shortioAuthConfig,
		pluginWebhookMatcher: undefined,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: ShortioKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key?.trim()) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (key?.trim()) return key;
			}
			throw new AuthMissingError('shortio', 'api_key');
		},
	} satisfies InternalShortioPlugin;
}
export { ShortioAPIError } from './client';
export type {
	ShortioEndpointInputs,
	ShortioEndpointOutputs,
} from './endpoints/types';
export {
	ShortioDomainListItemSchema,
	ShortioDomainSchema,
	ShortioEndpointInputSchemas,
	ShortioEndpointOutputSchemas,
	ShortioLinkSchema,
} from './endpoints/types';
export { ShortioSchema } from './schema';
