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
import { Agent, Extractor, Scrapers } from './endpoints';
import type {
	ParseraEndpointInputs,
	ParseraEndpointOutputs,
} from './endpoints/types';
import {
	ParseraEndpointInputSchemas,
	ParseraEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { ParseraSchema } from './schema';

export type ParseraPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalParseraPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof parseraEndpointsNested>;
};

export type ParseraContext = CorsairPluginContext<
	typeof ParseraSchema,
	ParseraPluginOptions,
	undefined,
	typeof parseraAuthConfig
>;

export type ParseraKeyBuilderContext = KeyBuilderContext<
	ParseraPluginOptions,
	typeof parseraAuthConfig
>;

export type ParseraBoundEndpoints = BindEndpoints<
	typeof parseraEndpointsNested
>;

type ParseraEndpoint<K extends keyof ParseraEndpointOutputs> = CorsairEndpoint<
	ParseraContext,
	ParseraEndpointInputs[K],
	ParseraEndpointOutputs[K]
>;

export type ParseraEndpoints = {
	[K in keyof ParseraEndpointOutputs]: ParseraEndpoint<K>;
};

const parseraEndpointsNested = {
	extractor: {
		extract: Extractor.extract,
		parse: Extractor.parse,
		createScraper: Extractor.createScraper,
		getScraper: Extractor.getScraper,
		deleteScraper: Extractor.deleteScraper,
	},
	agent: {
		extract: Agent.extract,
		getTask: Agent.getTask,
		stopTask: Agent.stopTask,
		generateScraper: Agent.generateScraper,
		createScraper: Agent.createScraper,
		getScraper: Agent.getScraper,
		deleteScraper: Agent.deleteScraper,
	},
	scrapers: {
		run: Scrapers.run,
		runAsync: Scrapers.runAsync,
		getRun: Scrapers.getRun,
	},
} as const;

export const parseraEndpointSchemas = {
	'extractor.extract': {
		input: ParseraEndpointInputSchemas.extractorExtract,
		output: ParseraEndpointOutputSchemas.extractorExtract,
	},
	'extractor.parse': {
		input: ParseraEndpointInputSchemas.extractorParse,
		output: ParseraEndpointOutputSchemas.extractorParse,
	},
	'extractor.createScraper': {
		input: ParseraEndpointInputSchemas.extractorCreateScraper,
		output: ParseraEndpointOutputSchemas.extractorCreateScraper,
	},
	'extractor.getScraper': {
		input: ParseraEndpointInputSchemas.extractorGetScraper,
		output: ParseraEndpointOutputSchemas.extractorGetScraper,
	},
	'extractor.deleteScraper': {
		input: ParseraEndpointInputSchemas.extractorDeleteScraper,
		output: ParseraEndpointOutputSchemas.extractorDeleteScraper,
	},
	'agent.extract': {
		input: ParseraEndpointInputSchemas.agentExtract,
		output: ParseraEndpointOutputSchemas.agentExtract,
	},
	'agent.getTask': {
		input: ParseraEndpointInputSchemas.agentGetTask,
		output: ParseraEndpointOutputSchemas.agentGetTask,
	},
	'agent.stopTask': {
		input: ParseraEndpointInputSchemas.agentStopTask,
		output: ParseraEndpointOutputSchemas.agentStopTask,
	},
	'agent.generateScraper': {
		input: ParseraEndpointInputSchemas.agentGenerateScraper,
		output: ParseraEndpointOutputSchemas.agentGenerateScraper,
	},
	'agent.createScraper': {
		input: ParseraEndpointInputSchemas.agentCreateScraper,
		output: ParseraEndpointOutputSchemas.agentCreateScraper,
	},
	'agent.getScraper': {
		input: ParseraEndpointInputSchemas.agentGetScraper,
		output: ParseraEndpointOutputSchemas.agentGetScraper,
	},
	'agent.deleteScraper': {
		input: ParseraEndpointInputSchemas.agentDeleteScraper,
		output: ParseraEndpointOutputSchemas.agentDeleteScraper,
	},
	'scrapers.run': {
		input: ParseraEndpointInputSchemas.scrapersRun,
		output: ParseraEndpointOutputSchemas.scrapersRun,
	},
	'scrapers.runAsync': {
		input: ParseraEndpointInputSchemas.scrapersRunAsync,
		output: ParseraEndpointOutputSchemas.scrapersRunAsync,
	},
	'scrapers.getRun': {
		input: ParseraEndpointInputSchemas.scrapersGetRun,
		output: ParseraEndpointOutputSchemas.scrapersGetRun,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof parseraEndpointsNested
>;

// An agent extraction runs in the background after the 202; the task_id is
// both the poll id and the cancel id.
const AGENT_EXTRACT_JOB = {
	idPath: 'task_id',
	status: {
		op: 'agent.getTask',
		idArg: 'taskId',
		statusPath: 'status',
		done: ['completed'],
		failed: ['failed', 'stopped'],
	},
	cancel: { op: 'agent.stopTask', idArg: 'taskId' },
} as const;

// A scraper build runs in the background after the 202; the scraper detail
// read reports generating, ready or failed.
const AGENT_GENERATE_JOB = {
	idPath: 'template_id',
	status: {
		op: 'agent.getScraper',
		idArg: 'scraperId',
		statusPath: 'status',
		done: ['ready'],
		failed: ['failed'],
	},
} as const;

// An async scraper run aggregates results across its URLs; completed_partial
// is terminal with the results that did land.
const SCRAPER_RUN_JOB = {
	idPath: 'run_id',
	status: {
		op: 'scrapers.getRun',
		idArg: 'runId',
		statusPath: 'status',
		done: ['completed', 'completed_partial'],
		failed: ['failed'],
	},
} as const;

const parseraEndpointMeta = {
	'extractor.extract': {
		riskLevel: 'write',
		description:
			'Extract structured data from a URL with the LLM extractor; each call charges credits',
	},
	'extractor.parse': {
		riskLevel: 'write',
		description:
			'Parse data from HTML or text content you already have; each call charges credits',
	},
	'extractor.createScraper': {
		riskLevel: 'write',
		description: 'Create an empty extractor scraper',
	},
	'extractor.getScraper': {
		riskLevel: 'read',
		description: 'Read one extractor scraper',
	},
	'extractor.deleteScraper': {
		riskLevel: 'destructive',
		description: 'Delete an extractor scraper',
		irreversible: true,
	},
	'agent.extract': {
		riskLevel: 'write',
		description:
			'Start a one-shot agentic extraction; answers a task_id to poll, stop or wait on',
		job: AGENT_EXTRACT_JOB,
	},
	'agent.getTask': {
		riskLevel: 'read',
		description: 'Read one agentic extraction task with its status and results',
	},
	'agent.stopTask': {
		riskLevel: 'write',
		description: 'Cancel a running agentic extraction',
	},
	'agent.generateScraper': {
		riskLevel: 'write',
		description:
			'Build or regenerate an agentic scraper from a page and an instruction',
		job: AGENT_GENERATE_JOB,
	},
	'agent.createScraper': {
		riskLevel: 'write',
		description: 'Create an empty agentic scraper',
	},
	'agent.getScraper': {
		riskLevel: 'read',
		description:
			'Read one agentic scraper with its build status and parameters schema',
	},
	'agent.deleteScraper': {
		riskLevel: 'destructive',
		description: 'Delete an agentic scraper',
		irreversible: true,
	},
	'scrapers.run': {
		riskLevel: 'write',
		description:
			'Run a scraper and wait for results; the API defers past five minutes to a pollable run',
	},
	'scrapers.runAsync': {
		riskLevel: 'write',
		description: 'Run a scraper asynchronously; answers a run_id to poll',
		job: SCRAPER_RUN_JOB,
	},
	'scrapers.getRun': {
		riskLevel: 'read',
		description: 'Read one async scraper run with its progress and results',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof parseraEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const parseraAuthConfig = {
	api_key: {
		// Parsera issues one key per account on the app; no account-level
		// field is needed beside it.
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseParseraPlugin<T extends ParseraPluginOptions> = CorsairPlugin<
	'parsera',
	typeof ParseraSchema,
	typeof parseraEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof parseraAuthConfig
>;

export type InternalParseraPlugin = BaseParseraPlugin<ParseraPluginOptions>;

export type ExternalParseraPlugin<T extends ParseraPluginOptions> =
	BaseParseraPlugin<T>;

export function parsera<const T extends ParseraPluginOptions>(
	incomingOptions: ParseraPluginOptions & T = {} as ParseraPluginOptions & T,
): ExternalParseraPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'parsera',
		authConfig: parseraAuthConfig,
		schema: ParseraSchema,
		options: options,
		hooks: options.hooks,
		endpoints: parseraEndpointsNested,
		webhooks: {},
		endpointMeta: parseraEndpointMeta,
		endpointSchemas: parseraEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: ParseraKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('parsera', ctx.authType ?? 'api_key');
		},
	} satisfies InternalParseraPlugin;
}

export { ParseraAPIError } from './client';

export type {
	AgentTask,
	Attribute,
	CreatedScraper,
	ExtractionResult,
	ParseraEndpointInputs,
	ParseraEndpointOutputs,
	ScraperRunOutput,
} from './endpoints/types';
