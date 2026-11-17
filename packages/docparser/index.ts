import type {
	AuthTypes,
	CorsairErrorHandler,
	CorsairPlugin,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import type { DocparserContext } from './context';
import { listModels, listParsers, listResults, ping } from './endpoints';
import {
	EmptyInputSchema,
	ModelListResponseSchema,
	ParserIdInputSchema,
	ParserListResponseSchema,
	PingResponseSchema,
	ResultListResponseSchema,
	ResultsInputSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DocparserSchema } from './schema';

export type { DocparserContext };

export type DocparserPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDocparserPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof docparserEndpointsNested>;
};

export type DocparserKeyBuilderContext =
	KeyBuilderContext<DocparserPluginOptions>;

const docparserEndpointsNested = {
	ping,
	parsers: { list: listParsers },
	models: { list: listModels },
	results: { list: listResults },
} as const;

const docparserWebhooksNested = {} as const;

export const docparserEndpointSchemas = {
	ping: { input: EmptyInputSchema, output: PingResponseSchema },
	'parsers.list': { input: EmptyInputSchema, output: ParserListResponseSchema },
	'models.list': {
		input: ParserIdInputSchema,
		output: ModelListResponseSchema,
	},
	'results.list': {
		input: ResultsInputSchema,
		output: ResultListResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof docparserEndpointsNested
>;

const read = (description: string) =>
	({ riskLevel: 'read', description }) as const;

const docparserEndpointMeta = {
	ping: read('Check that the API key is accepted.'),
	'parsers.list': read('List document parsers.'),
	'models.list': read('List model layouts for one parser.'),
	'results.list': read(
		'List parsed documents. Parsed field values are not stored.',
	),
} as const satisfies RequiredPluginEndpointMeta<
	typeof docparserEndpointsNested
>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const docparserAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BaseDocparserPlugin<T extends DocparserPluginOptions> =
	CorsairPlugin<
		'docparser',
		typeof DocparserSchema,
		typeof docparserEndpointsNested,
		typeof docparserWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalDocparserPlugin =
	BaseDocparserPlugin<DocparserPluginOptions>;
export type ExternalDocparserPlugin<T extends DocparserPluginOptions> =
	BaseDocparserPlugin<T>;

export function docparser<const T extends DocparserPluginOptions>(
	incomingOptions: DocparserPluginOptions & T = {} as DocparserPluginOptions &
		T,
): ExternalDocparserPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'docparser',
		authConfig: docparserAuthConfig,
		schema: DocparserSchema,
		options,
		hooks: options.hooks,
		endpoints: docparserEndpointsNested,
		webhooks: docparserWebhooksNested,
		endpointMeta: docparserEndpointMeta,
		endpointSchemas: docparserEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: DocparserKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}
			return '';
		},
	} satisfies InternalDocparserPlugin;
}
