import type {
	CorsairEndpoint,
	CorsairPlugin,
	CorsairPluginContext,
	PickAuth,
	PluginAuthConfig,
} from 'corsair/core';

import { Collections } from './endpoints';

export type PostmanPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
};

export const postmanAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

export type PostmanContext = CorsairPluginContext<
	unknown,
	PostmanPluginOptions,
	undefined,
	typeof postmanAuthConfig
>;

export type PostmanCreateCollectionEndpoint = CorsairEndpoint<
	PostmanContext,
	{
		name: string;
		description?: string;
	},
	{
		collection: {
			id: string;
			name?: string;
			uid?: string;
		};
	}
>;

export type PostmanEndpoints = {
	createCollection: PostmanCreateCollectionEndpoint;
};

const postmanEndpoints = {
	createCollection: Collections.create,
} as const;

export function postman<const T extends PostmanPluginOptions>(
	incomingOptions: PostmanPluginOptions & T = {} as PostmanPluginOptions & T,
): CorsairPlugin<
	'postman',
	unknown,
	typeof postmanEndpoints,
	Record<string, never>,
	T,
	'api_key'
> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? ('api_key' as const),
	};

	return {
		id: 'postman',
		authConfig: postmanAuthConfig,
		schema: {},
		options,
		endpoints: postmanEndpoints,
		webhooks: {},
		endpointMeta: {
			createCollection: {
				riskLevel: 'write',
				description: 'Create a Postman collection',
			},
		},
		endpointSchemas: {
			createCollection: {
				input: Collections.create.inputSchema,
				output: {} as never,
			},
		},
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		keyBuilder: async (ctx, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				return (await ctx.keys.get_api_key()) ?? '';
			}
			return '';
		},
	} as never;
}

export type {
	CreateCollectionInput,
	CreateCollectionOutput,
} from './endpoints/collections';
