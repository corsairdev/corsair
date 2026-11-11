import type {
	BindEndpoints,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { composeU301Key, U301_KEY_SEPARATOR } from './client';
import * as Links from './endpoints';
import type {
	U301EndpointInputs,
	U301EndpointOutputs,
} from './endpoints/types';
import {
	U301EndpointInputSchemas,
	U301EndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { U301Schema } from './schema';

/**
 * U301 needs an API key **and** a workspace ID on every call, and Corsair's key
 * slot holds one string, so the key is
 * `"<api key>\n<workspace id>"`.
 *
 * `key` in the options accepts the same two-line form. The `apiKey` and
 * `workspaceId` options are the clearer alternative, and either one alone is not
 * enough.
 */
export type U301PluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/** The API key on its own, instead of packed into `key`. */
	apiKey?: string;
	/** The workspace ID on its own, instead of packed into `key`. */
	workspaceId?: string;
	hooks?: InternalU301Plugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof u301EndpointsNested>;
};

export type U301Context = CorsairPluginContext<
	typeof U301Schema,
	U301PluginOptions
>;

export type U301KeyBuilderContext = KeyBuilderContext<U301PluginOptions>;

export type U301BoundEndpoints = BindEndpoints<typeof u301EndpointsNested>;

type U301Endpoint<K extends keyof U301EndpointOutputs> = CorsairEndpoint<
	U301Context,
	U301EndpointInputs[K],
	U301EndpointOutputs[K]
>;

export type U301Endpoints = {
	linkCreate: U301Endpoint<'linkCreate'>;
	linkList: U301Endpoint<'linkList'>;
	linkGet: U301Endpoint<'linkGet'>;
	linkDelete: U301Endpoint<'linkDelete'>;
	domainList: U301Endpoint<'domainList'>;
	domainCreate: U301Endpoint<'domainCreate'>;
	domainGet: U301Endpoint<'domainGet'>;
	domainActive: U301Endpoint<'domainActive'>;
	domainDelete: U301Endpoint<'domainDelete'>;
	domainPathLength: U301Endpoint<'domainPathLength'>;
	domainHomeRedirect: U301Endpoint<'domainHomeRedirect'>;
	domainNotFoundRedirect: U301Endpoint<'domainNotFoundRedirect'>;
	clicks: U301Endpoint<'clicks'>;
	audience: U301Endpoint<'audience'>;
};

const u301EndpointsNested = {
	links: {
		create: Links.create,
		list: Links.list,
		get: Links.get,
		delete: Links.remove,
	},
	domains: {
		list: Links.domainList,
		create: Links.domainCreate,
		get: Links.domainGet,
		active: Links.domainActive,
		delete: Links.domainDelete,
		pathLength: Links.domainPathLength,
		homeRedirect: Links.domainHomeRedirect,
		notFoundRedirect: Links.domainNotFoundRedirect,
	},
	analytics: {
		clicks: Links.clicks,
		audience: Links.audience,
	},
} as const;

export const u301EndpointSchemas = {
	'links.create': {
		input: U301EndpointInputSchemas.linkCreate,
		output: U301EndpointOutputSchemas.linkCreate,
	},
	'links.list': {
		input: U301EndpointInputSchemas.linkList,
		output: U301EndpointOutputSchemas.linkList,
	},
	'links.get': {
		input: U301EndpointInputSchemas.linkGet,
		output: U301EndpointOutputSchemas.linkGet,
	},
	'links.delete': {
		input: U301EndpointInputSchemas.linkDelete,
		output: U301EndpointOutputSchemas.linkDelete,
	},
	'domains.list': {
		input: U301EndpointInputSchemas.domainList,
		output: U301EndpointOutputSchemas.domainList,
	},
	'domains.create': {
		input: U301EndpointInputSchemas.domainCreate,
		output: U301EndpointOutputSchemas.domainCreate,
	},
	'domains.get': {
		input: U301EndpointInputSchemas.domainGet,
		output: U301EndpointOutputSchemas.domainGet,
	},
	'domains.active': {
		input: U301EndpointInputSchemas.domainActive,
		output: U301EndpointOutputSchemas.domainActive,
	},
	'domains.delete': {
		input: U301EndpointInputSchemas.domainDelete,
		output: U301EndpointOutputSchemas.domainDelete,
	},
	'domains.pathLength': {
		input: U301EndpointInputSchemas.domainPathLength,
		output: U301EndpointOutputSchemas.domainPathLength,
	},
	'domains.homeRedirect': {
		input: U301EndpointInputSchemas.domainHomeRedirect,
		output: U301EndpointOutputSchemas.domainHomeRedirect,
	},
	'domains.notFoundRedirect': {
		input: U301EndpointInputSchemas.domainNotFoundRedirect,
		output: U301EndpointOutputSchemas.domainNotFoundRedirect,
	},
	'analytics.clicks': {
		input: U301EndpointInputSchemas.clicks,
		output: U301EndpointOutputSchemas.clicks,
	},
	'analytics.audience': {
		input: U301EndpointInputSchemas.audience,
		output: U301EndpointOutputSchemas.audience,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof u301EndpointsNested>;

const defaultAuthType = 'api_key' as const;

const u301EndpointMeta = {
	'links.create': {
		riskLevel: 'write',
		description:
			'Shorten a URL on u301.co or one of your domains, with an optional custom slug, password and comment; a new link spends one monthly allowance slot',
	},
	'links.list': {
		riskLevel: 'read',
		description:
			"List the workspace's short links with their click counts, archive and suspend state",
	},
	'links.get': {
		riskLevel: 'read',
		description:
			'Read one short link by its short form, such as u301.co/abc123',
	},
	'links.delete': {
		riskLevel: 'destructive',
		description:
			'Delete a short link; the destination is no longer reachable through it',
	},
	'domains.list': {
		riskLevel: 'read',
		description:
			"List the workspace's domains, including the shared u301.co and any of your own",
	},
	'domains.create': {
		riskLevel: 'write',
		description:
			'Add a custom domain; the DNS CNAME still has to be created and verified before it serves links',
	},
	'domains.get': {
		riskLevel: 'read',
		description:
			"Read one domain's validity, archive state, slug length and redirect settings",
	},
	'domains.active': {
		riskLevel: 'read',
		description:
			"Check whether a domain's DNS verification has completed, which is the step to poll after adding the CNAME",
	},
	'domains.delete': {
		riskLevel: 'destructive',
		description: 'Remove a custom domain from the workspace',
	},
	'domains.pathLength': {
		riskLevel: 'write',
		description: 'Set the random slug length a domain uses, 3 to 10',
	},
	'domains.homeRedirect': {
		riskLevel: 'write',
		description: "Set where a domain's root redirects to",
	},
	'domains.notFoundRedirect': {
		riskLevel: 'write',
		description: 'Set where an unknown slug on a domain redirects to',
	},
	'analytics.clicks': {
		riskLevel: 'read',
		description:
			'Read click counts over a time range at a chosen granularity, in a chosen timezone',
	},
	'analytics.audience': {
		riskLevel: 'read',
		description:
			'Read a top-N click breakdown by country, city, referrer, browser, OS or device',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof u301EndpointsNested>;

export type BaseU301Plugin<T extends U301PluginOptions> = CorsairPlugin<
	'u301',
	typeof U301Schema,
	typeof u301EndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalU301Plugin = BaseU301Plugin<U301PluginOptions>;

export type ExternalU301Plugin<T extends U301PluginOptions> = BaseU301Plugin<T>;

export function u301<const T extends U301PluginOptions>(
	incomingOptions: U301PluginOptions & T = {} as U301PluginOptions & T,
): ExternalU301Plugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'u301',
		schema: U301Schema,
		options: options,
		hooks: options.hooks,
		endpoints: u301EndpointsNested,
		webhooks: {},
		endpointMeta: u301EndpointMeta,
		endpointSchemas: u301EndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: U301KeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			// Building from the separate options is the clearer setup, and a caller who
			// sets both does not have to know the packed layout.
			if (source === 'endpoint' && options.apiKey && options.workspaceId) {
				return composeU301Key(options.apiKey, options.workspaceId);
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				// A stored key may be a bare key when the workspace came from the
				// plugin options, so it is composed here. A stored composite key
				// already carries its own workspace and passes through untouched.
				if (res) {
					return res.includes(U301_KEY_SEPARATOR) || !options.workspaceId
						? res
						: composeU301Key(res, options.workspaceId);
				}
			}

			throw new AuthMissingError('u301', ctx.authType ?? 'api_key');
		},
	} satisfies InternalU301Plugin;
}

export {
	composeU301Key,
	parseU301Key,
	U301APIError,
	type U301Credentials,
} from './client';

export type {
	AudienceInput,
	AudienceResponse,
	ClicksInput,
	ClicksResponse,
	DomainActiveResponse,
	DomainCreateInput,
	DomainCreateResponse,
	DomainDeleteResponse,
	DomainGetResponse,
	DomainHomeRedirectInput,
	DomainListResponse,
	DomainNotFoundRedirectInput,
	DomainPathLengthInput,
	DomainRefInput,
	DomainSettingsResponse,
	LinkCreateInput,
	LinkCreateResponse,
	LinkDeleteResponse,
	LinkGetResponse,
	LinkListInput,
	LinkListResponse,
	LinkRefInput,
	U301EndpointInputs,
	U301EndpointOutputs,
	U301Link,
	U301LinkCreated,
} from './endpoints/types';
