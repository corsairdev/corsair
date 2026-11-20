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
import { AuthMissingError } from 'corsair/core';
import type { LinkupContext } from './context';
import {
	createResearch,
	createResponse,
	createTasks,
	fetchPage,
	getAnswer,
	getCredits,
	getResearch,
	getTask,
	listResearch,
	listTasks,
	search,
	searchStructured,
} from './endpoints';
import {
	AnswerInputSchema,
	AnswerResponseSchema,
	CreditResponseSchema,
	EmptyInputSchema,
	FetchInputSchema,
	FetchResponseSchema,
	QueryInputSchema,
	ResearchCreateInputSchema,
	ResearchListInputSchema,
	ResponseInputSchema,
	ResponsesResponseSchema,
	SearchResponseSchema,
	StructuredInputSchema,
	StructuredResponseSchema,
	TaskIdInputSchema,
	TaskListInputSchema,
	TaskListResponseSchema,
	TaskResponseSchema,
	TasksCreateInputSchema,
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
	search: { run: search, structured: searchStructured },
	answers: { get: getAnswer },
	pages: { fetch: fetchPage },
	responses: { create: createResponse },
	research: { create: createResearch, get: getResearch, list: listResearch },
	tasks: { create: createTasks, get: getTask, list: listTasks },
} as const;

const linkupWebhooksNested = {} as const;

export const linkupEndpointSchemas = {
	'credits.get': { input: EmptyInputSchema, output: CreditResponseSchema },
	'search.run': { input: QueryInputSchema, output: SearchResponseSchema },
	'search.structured': {
		input: StructuredInputSchema,
		output: StructuredResponseSchema,
	},
	'answers.get': { input: AnswerInputSchema, output: AnswerResponseSchema },
	'pages.fetch': { input: FetchInputSchema, output: FetchResponseSchema },
	'responses.create': {
		input: ResponseInputSchema,
		output: ResponsesResponseSchema,
	},
	'research.create': {
		input: ResearchCreateInputSchema,
		output: TaskResponseSchema,
	},
	'research.get': { input: TaskIdInputSchema, output: TaskResponseSchema },
	'research.list': {
		input: ResearchListInputSchema,
		output: TaskListResponseSchema,
	},
	'tasks.create': {
		input: TasksCreateInputSchema,
		output: TaskListResponseSchema,
	},
	'tasks.get': { input: TaskIdInputSchema, output: TaskResponseSchema },
	'tasks.list': { input: TaskListInputSchema, output: TaskListResponseSchema },
} as const satisfies RequiredPluginEndpointSchemas<
	typeof linkupEndpointsNested
>;

// Search, answers and page fetches are metered lookups and stay read (R8, as
// Exa's answer.get). Generated responses, research tasks and batches are paid
// generation jobs (R8: destructive), as Parallel's responses.create.
const read = (description: string) =>
	({ riskLevel: 'read', description }) as const;
const destructive = (description: string) =>
	({ riskLevel: 'destructive', description }) as const;

const linkupEndpointMeta = {
	'credits.get': read("Get the account's remaining credit balance in dollars."),
	'search.run': read(
		'Search the web and return results with their text content ($0.005 a call; deep $0.05). Filter by date and domain.',
	),
	'search.structured': read(
		'Search the web and return JSON shaped by your JSON Schema, optionally with sources ($0.006; deep $0.055).',
	),
	'answers.get': read(
		'Search the web and return a written answer with its sources ($0.006; deep $0.055).',
	),
	'pages.fetch': read(
		'Fetch one web page or PDF as markdown, optionally with typed data from a schema ($0.001 to $0.011).',
	),
	'responses.create': destructive(
		'Generate an answer grounded in live web results (OpenAI Responses format). Paid generation.',
	),
	'research.create': destructive(
		'Start a multi-step research task ($0.25 to $2.50 by reasoningDepth). Poll research.get for the result.',
	),
	'research.get': read(
		'Get a research task: status, and the answer or structured data once completed.',
	),
	'research.list': read('List research tasks, newest or oldest first, paged.'),
	'tasks.create': destructive(
		'Queue up to 100 search, fetch or research calls to run in the background, each billed like the direct call. Poll tasks.get.',
	),
	'tasks.get': read('Get one background task with its status and output.'),
	'tasks.list': read(
		'List background tasks, filtered by type and status, paged, with the in-flight quota.',
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
				if (!key) throw new AuthMissingError('linkup', 'api_key');
				return key;
			}
			// No stored key and no key manager: ask for a connection instead of
			// sending an unauthenticated request.
			if (source === 'endpoint')
				throw new AuthMissingError('linkup', 'api_key');
			return '';
		},
	} satisfies InternalLinkupPlugin;
}
