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
import type { LinkupContext } from './context';
import {
	createResponse,
	fetchPage,
	getAnswer,
	getCredits,
	search,
} from './endpoints';
import {
	AnswerResponseSchema,
	CreditResponseSchema,
	EmptyInputSchema,
	FetchInputSchema,
	FetchResponseSchema,
	QueryInputSchema,
	ResponseInputSchema,
	ResponsesResponseSchema,
	SearchResponseSchema,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { LinkupSchema } from './schema';

export type { LinkupContext };

export type LinkupPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalLinkupPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof linkupEndpointsNested>;
};

export type LinkupKeyBuilderContext = KeyBuilderContext<LinkupPluginOptions>;

const linkupEndpointsNested = {
	credits: { get: getCredits },
	search: { run: search },
	answers: { get: getAnswer },
	pages: { fetch: fetchPage },
	responses: { create: createResponse },
} as const;

const linkupWebhooksNested = {} as const;

export const linkupEndpointSchemas = {
	'credits.get': { input: EmptyInputSchema, output: CreditResponseSchema },
	'search.run': { input: QueryInputSchema, output: SearchResponseSchema },
	'answers.get': { input: QueryInputSchema, output: AnswerResponseSchema },
	'pages.fetch': { input: FetchInputSchema, output: FetchResponseSchema },
	'responses.create': {
		input: ResponseInputSchema,
		output: ResponsesResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof linkupEndpointsNested
>;

const read = (description: string) =>
	({ riskLevel: 'read', description }) as const;
const write = (description: string) =>
	({ riskLevel: 'write', description }) as const;

const linkupEndpointMeta = {
	'credits.get': read('Read the remaining credit balance.'),
	'search.run': write(
		'Search the web. This spends credits. Page text is not stored.',
	),
	'answers.get': write(
		'Ask for a sourced answer. This spends credits. Source text is not stored.',
	),
	'pages.fetch': write(
		'Fetch one page as markdown. This spends credits. The page is not stored.',
	),
	'responses.create': write(
		'Create a response. This spends credits. The generated text is not stored.',
	),
} as const satisfies RequiredPluginEndpointMeta<typeof linkupEndpointsNested>;

const defaultAuthType = 'api_key' as const satisfies AuthTypes;

export const linkupAuthConfig = {
	api_key: { account: [] as const },
} as const satisfies PluginAuthConfig;

export type BaseLinkupPlugin<T extends LinkupPluginOptions> = CorsairPlugin<
	'linkup',
	typeof LinkupSchema,
	typeof linkupEndpointsNested,
	typeof linkupWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalLinkupPlugin = BaseLinkupPlugin<LinkupPluginOptions>;
export type ExternalLinkupPlugin<T extends LinkupPluginOptions> =
	BaseLinkupPlugin<T>;

export function linkup<const T extends LinkupPluginOptions>(
	incomingOptions: LinkupPluginOptions & T = {} as LinkupPluginOptions & T,
): ExternalLinkupPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'linkup',
		authConfig: linkupAuthConfig,
		schema: LinkupSchema,
		options,
		hooks: options.hooks,
		endpoints: linkupEndpointsNested,
		webhooks: linkupWebhooksNested,
		endpointMeta: linkupEndpointMeta,
		endpointSchemas: linkupEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: LinkupKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				return key ?? '';
			}
			return '';
		},
	} satisfies InternalLinkupPlugin;
}
