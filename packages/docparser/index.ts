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
import type { DocparserContext } from './context';
import {
	fetchDocument,
	getDocumentStatus,
	getResult,
	listModels,
	listParsers,
	listResults,
	ping,
	reintegrateDocuments,
	reparseDocuments,
	uploadDocument,
} from './endpoints';
import {
	DocumentIdsInputSchema,
	DocumentInputSchema,
	DocumentStatusResponseSchema,
	EmptyInputSchema,
	FetchDocumentInputSchema,
	ImportResponseSchema,
	ModelListResponseSchema,
	ParserIdInputSchema,
	ParserListResponseSchema,
	PingResponseSchema,
	ResultInputSchema,
	ResultListResponseSchema,
	ResultsInputSchema,
	ScheduledResponseSchema,
	UploadDocumentInputSchema,
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
	results: { list: listResults, get: getResult },
	documents: {
		fetch: fetchDocument,
		upload: uploadDocument,
		status: getDocumentStatus,
		reparse: reparseDocuments,
		reintegrate: reintegrateDocuments,
	},
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
	'results.get': { input: ResultInputSchema, output: ResultListResponseSchema },
	'documents.fetch': {
		input: FetchDocumentInputSchema,
		output: ImportResponseSchema,
	},
	'documents.upload': {
		input: UploadDocumentInputSchema,
		output: ImportResponseSchema,
	},
	'documents.status': {
		input: DocumentInputSchema,
		output: DocumentStatusResponseSchema,
	},
	'documents.reparse': {
		input: DocumentIdsInputSchema,
		output: ScheduledResponseSchema,
	},
	'documents.reintegrate': {
		input: DocumentIdsInputSchema,
		output: ScheduledResponseSchema,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof docparserEndpointsNested
>;

const read = (description: string) =>
	({ riskLevel: 'read', description }) as const;
// Each imported or re-parsed document uses one of the account's parsing
// credits, and re-integrating sends the data to the parser's integrations
// again, so these are destructive (R8: credit spending and sends).
const destructive = (description: string) =>
	({ riskLevel: 'destructive', description }) as const;

const docparserEndpointMeta = {
	ping: read('Check that the API key is accepted.'),
	'parsers.list': read('List document parsers (id and label).'),
	'models.list': read('List the model layouts of one parser.'),
	'results.list': read(
		"Get the parsed data of a parser's documents, newest first (100 by default). Filter by upload or processing date or remote id. Each row holds the fields the parser extracted.",
	),
	'results.get': read('Get the parsed data of one document.'),
	'documents.fetch': destructive(
		'Import a document from a public URL into a parser. Uses one parsing credit. Parsing takes a few minutes; check documents.status, then read results.get.',
	),
	'documents.upload': destructive(
		'Upload a base64-encoded document into a parser. Uses one parsing credit. Parsing takes a few minutes; check documents.status, then read results.get.',
	),
	'documents.status': read(
		'Check whether a document has been imported and parsed (done), and list any failed jobs.',
	),
	'documents.reparse': destructive(
		"Parse documents again with the parser's current rules. Uses parsing credits.",
	),
	'documents.reintegrate': destructive(
		"Send documents' parsed data to the parser's integrations and webhooks again.",
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
				if (!key) throw new AuthMissingError('docparser', 'api_key');
				return key;
			}
			// No stored key and no key manager: ask for a connection instead of
			// sending an unauthenticated request.
			if (source === 'endpoint')
				throw new AuthMissingError('docparser', 'api_key');
			return '';
		},
	} satisfies InternalDocparserPlugin;
}
