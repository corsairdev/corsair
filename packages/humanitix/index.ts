import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
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
import { Events, Tags } from './endpoints';
import type {
	HumanitixEndpointInputs,
	HumanitixEndpointOutputs,
} from './endpoints/types';
import {
	HumanitixEndpointInputSchemas,
	HumanitixEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { HumanitixSchema } from './schema';

export type HumanitixPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalHumanitixPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof humanitixEndpointsNested>;
};

export type HumanitixContext = CorsairPluginContext<
	typeof HumanitixSchema,
	HumanitixPluginOptions
>;

export type HumanitixKeyBuilderContext =
	KeyBuilderContext<HumanitixPluginOptions>;

export type HumanitixBoundEndpoints = BindEndpoints<
	typeof humanitixEndpointsNested
>;

type HumanitixEndpoint<K extends keyof HumanitixEndpointOutputs> =
	CorsairEndpoint<
		HumanitixContext,
		HumanitixEndpointInputs[K],
		HumanitixEndpointOutputs[K]
	>;

export type HumanitixEndpoints = {
	getEvent: HumanitixEndpoint<'getEvent'>;
	getEvents: HumanitixEndpoint<'getEvents'>;
	getTags: HumanitixEndpoint<'getTags'>;
};

export type HumanitixWebhooks = Record<string, never>;
export type HumanitixBoundWebhooks = BindWebhooks<HumanitixWebhooks>;

const humanitixEndpointsNested = {
	events: {
		get: Events.get,
		list: Events.list,
	},
	tags: {
		list: Tags.list,
	},
} as const;

const humanitixWebhooksNested = {} as const;

export const humanitixEndpointSchemas = {
	'events.get': {
		input: HumanitixEndpointInputSchemas.getEvent,
		output: HumanitixEndpointOutputSchemas.getEvent,
	},
	'events.list': {
		input: HumanitixEndpointInputSchemas.getEvents,
		output: HumanitixEndpointOutputSchemas.getEvents,
	},
	'tags.list': {
		input: HumanitixEndpointInputSchemas.getTags,
		output: HumanitixEndpointOutputSchemas.getTags,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof humanitixEndpointsNested
>;

const humanitixWebhookSchemas = {} as const;

const defaultAuthType: AuthTypes = 'api_key' as const;

const humanitixEndpointMeta = {
	'events.get': {
		riskLevel: 'read',
		description:
			'Retrieve detailed information about a specific Humanitix event by eventId.',
	},
	'events.list': {
		riskLevel: 'read',
		description:
			'Retrieve a paginated list of Humanitix events (page, pageSize, inFutureOnly, since, overrideLocation).',
	},
	'tags.list': {
		riskLevel: 'read',
		description:
			'Retrieve a paginated list of Humanitix tags (page, pageSize).',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof humanitixEndpointsNested
>;

export const humanitixAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseHumanitixPlugin<T extends HumanitixPluginOptions> =
	CorsairPlugin<
		'humanitix',
		typeof HumanitixSchema,
		typeof humanitixEndpointsNested,
		typeof humanitixWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalHumanitixPlugin =
	BaseHumanitixPlugin<HumanitixPluginOptions>;

export type ExternalHumanitixPlugin<T extends HumanitixPluginOptions> =
	BaseHumanitixPlugin<T>;

export function humanitix<const T extends HumanitixPluginOptions>(
	incomingOptions: HumanitixPluginOptions & T = {} as HumanitixPluginOptions &
		T,
): ExternalHumanitixPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'humanitix',
		authConfig: humanitixAuthConfig,
		schema: HumanitixSchema,
		options: options,
		hooks: options.hooks,
		endpoints: humanitixEndpointsNested,
		webhooks: humanitixWebhooksNested,
		endpointMeta: humanitixEndpointMeta,
		endpointSchemas: humanitixEndpointSchemas,
		webhookSchemas: humanitixWebhookSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: HumanitixKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('humanitix', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('humanitix', 'api_key');
		},
	} satisfies InternalHumanitixPlugin;
}

export type {
	HumanitixEndpointInputs,
	HumanitixEndpointOutputs,
} from './endpoints/types';
