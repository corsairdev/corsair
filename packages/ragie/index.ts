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
import {
	Connections,
	Documents,
	Responses,
	Retrievals,
	WebhookEndpoints,
} from './endpoints';
import type {
	RagieEndpointInputs,
	RagieEndpointOutputs,
} from './endpoints/types';
import {
	RagieEndpointInputSchemas,
	RagieEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { RagieSchema } from './schema';

export type RagiePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalRagiePlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ragieEndpointsNested>;
};

export type RagieContext = CorsairPluginContext<
	typeof RagieSchema,
	RagiePluginOptions
>;

export type RagieKeyBuilderContext = KeyBuilderContext<RagiePluginOptions>;

export type RagieBoundEndpoints = BindEndpoints<typeof ragieEndpointsNested>;

type RagieEndpoint<K extends keyof RagieEndpointOutputs> = CorsairEndpoint<
	RagieContext,
	RagieEndpointInputs[K],
	RagieEndpointOutputs[K]
>;

export type RagieEndpoints = {
	documentsList: RagieEndpoint<'documentsList'>;
	documentsCreate: RagieEndpoint<'documentsCreate'>;
	documentsCreateRaw: RagieEndpoint<'documentsCreateRaw'>;
	documentsCreateFromUrl: RagieEndpoint<'documentsCreateFromUrl'>;
	documentsGet: RagieEndpoint<'documentsGet'>;
	documentsDelete: RagieEndpoint<'documentsDelete'>;
	documentsUpdateFile: RagieEndpoint<'documentsUpdateFile'>;
	documentsUpdateRaw: RagieEndpoint<'documentsUpdateRaw'>;
	documentsUpdateFromUrl: RagieEndpoint<'documentsUpdateFromUrl'>;
	documentsPatchMetadata: RagieEndpoint<'documentsPatchMetadata'>;
	documentsGetChunks: RagieEndpoint<'documentsGetChunks'>;
	documentsGetContent: RagieEndpoint<'documentsGetContent'>;
	documentsGetSummary: RagieEndpoint<'documentsGetSummary'>;
	retrievalsRetrieve: RagieEndpoint<'retrievalsRetrieve'>;
	connectionsList: RagieEndpoint<'connectionsList'>;
	connectionsGet: RagieEndpoint<'connectionsGet'>;
	connectionsListSourceTypes: RagieEndpoint<'connectionsListSourceTypes'>;
	connectionsCreate: RagieEndpoint<'connectionsCreate'>;
	connectionsCreateOAuthRedirectUrl: RagieEndpoint<'connectionsCreateOAuthRedirectUrl'>;
	connectionsUpdate: RagieEndpoint<'connectionsUpdate'>;
	connectionsSync: RagieEndpoint<'connectionsSync'>;
	connectionsDelete: RagieEndpoint<'connectionsDelete'>;
	connectionsSetEnabled: RagieEndpoint<'connectionsSetEnabled'>;
	connectionsSetLimits: RagieEndpoint<'connectionsSetLimits'>;
	responsesCreate: RagieEndpoint<'responsesCreate'>;
	responsesGet: RagieEndpoint<'responsesGet'>;
	webhookEndpointsList: RagieEndpoint<'webhookEndpointsList'>;
	webhookEndpointsCreate: RagieEndpoint<'webhookEndpointsCreate'>;
	webhookEndpointsGet: RagieEndpoint<'webhookEndpointsGet'>;
	webhookEndpointsUpdate: RagieEndpoint<'webhookEndpointsUpdate'>;
	webhookEndpointsDelete: RagieEndpoint<'webhookEndpointsDelete'>;
};

const ragieEndpointsNested = {
	documents: {
		list: Documents.list,
		create: Documents.create,
		createRaw: Documents.createRaw,
		createFromUrl: Documents.createFromUrl,
		get: Documents.get,
		delete: Documents.remove,
		updateFile: Documents.updateFile,
		updateRaw: Documents.updateRaw,
		updateFromUrl: Documents.updateFromUrl,
		patchMetadata: Documents.patchMetadata,
		getChunks: Documents.getChunks,
		getContent: Documents.getContent,
		getSummary: Documents.getSummary,
	},
	retrievals: {
		retrieve: Retrievals.retrieve,
	},
	connections: {
		list: Connections.list,
		get: Connections.get,
		listSourceTypes: Connections.listSourceTypes,
		create: Connections.create,
		createOAuthRedirectUrl: Connections.createOAuthRedirectUrl,
		update: Connections.update,
		sync: Connections.sync,
		delete: Connections.remove,
		setEnabled: Connections.setEnabled,
		setLimits: Connections.setLimits,
	},
	responses: {
		create: Responses.create,
		get: Responses.get,
	},
	webhookEndpoints: {
		list: WebhookEndpoints.list,
		create: WebhookEndpoints.create,
		get: WebhookEndpoints.get,
		update: WebhookEndpoints.update,
		delete: WebhookEndpoints.remove,
	},
} as const;

// documents.create, createRaw, createFromUrl and the three updates all start
// the same processing pipeline; the status read is documents.get. The
// intermediate values are the pipeline steps, not jobs to follow.
const DOCUMENT_JOB = {
	idPath: 'id',
	status: {
		op: 'documents.get',
		idArg: 'document_id',
		statusPath: 'status',
		done: ['ready'],
		failed: ['failed'],
	},
} as const;

// deep-search generation; `cancelled` comes from the SDK's status enum, so
// polling stops on it too.
const RESPONSE_JOB = {
	idPath: 'id',
	status: {
		op: 'responses.get',
		idArg: 'response_id',
		statusPath: 'status',
		done: ['completed'],
		failed: ['failed', 'cancelled'],
	},
} as const;

export const ragieEndpointSchemas = {
	'documents.list': {
		input: RagieEndpointInputSchemas.documentsList,
		output: RagieEndpointOutputSchemas.documentsList,
	},
	'documents.create': {
		input: RagieEndpointInputSchemas.documentsCreate,
		output: RagieEndpointOutputSchemas.documentsCreate,
	},
	'documents.createRaw': {
		input: RagieEndpointInputSchemas.documentsCreateRaw,
		output: RagieEndpointOutputSchemas.documentsCreateRaw,
	},
	'documents.createFromUrl': {
		input: RagieEndpointInputSchemas.documentsCreateFromUrl,
		output: RagieEndpointOutputSchemas.documentsCreateFromUrl,
	},
	'documents.get': {
		input: RagieEndpointInputSchemas.documentsGet,
		output: RagieEndpointOutputSchemas.documentsGet,
	},
	'documents.delete': {
		input: RagieEndpointInputSchemas.documentsDelete,
		output: RagieEndpointOutputSchemas.documentsDelete,
	},
	'documents.updateFile': {
		input: RagieEndpointInputSchemas.documentsUpdateFile,
		output: RagieEndpointOutputSchemas.documentsUpdateFile,
	},
	'documents.updateRaw': {
		input: RagieEndpointInputSchemas.documentsUpdateRaw,
		output: RagieEndpointOutputSchemas.documentsUpdateRaw,
	},
	'documents.updateFromUrl': {
		input: RagieEndpointInputSchemas.documentsUpdateFromUrl,
		output: RagieEndpointOutputSchemas.documentsUpdateFromUrl,
	},
	'documents.patchMetadata': {
		input: RagieEndpointInputSchemas.documentsPatchMetadata,
		output: RagieEndpointOutputSchemas.documentsPatchMetadata,
	},
	'documents.getChunks': {
		input: RagieEndpointInputSchemas.documentsGetChunks,
		output: RagieEndpointOutputSchemas.documentsGetChunks,
	},
	'documents.getContent': {
		input: RagieEndpointInputSchemas.documentsGetContent,
		output: RagieEndpointOutputSchemas.documentsGetContent,
	},
	'documents.getSummary': {
		input: RagieEndpointInputSchemas.documentsGetSummary,
		output: RagieEndpointOutputSchemas.documentsGetSummary,
	},
	'retrievals.retrieve': {
		input: RagieEndpointInputSchemas.retrievalsRetrieve,
		output: RagieEndpointOutputSchemas.retrievalsRetrieve,
	},
	'connections.list': {
		input: RagieEndpointInputSchemas.connectionsList,
		output: RagieEndpointOutputSchemas.connectionsList,
	},
	'connections.get': {
		input: RagieEndpointInputSchemas.connectionsGet,
		output: RagieEndpointOutputSchemas.connectionsGet,
	},
	'connections.listSourceTypes': {
		input: RagieEndpointInputSchemas.connectionsListSourceTypes,
		output: RagieEndpointOutputSchemas.connectionsListSourceTypes,
	},
	'connections.create': {
		input: RagieEndpointInputSchemas.connectionsCreate,
		output: RagieEndpointOutputSchemas.connectionsCreate,
	},
	'connections.createOAuthRedirectUrl': {
		input: RagieEndpointInputSchemas.connectionsCreateOAuthRedirectUrl,
		output: RagieEndpointOutputSchemas.connectionsCreateOAuthRedirectUrl,
	},
	'connections.update': {
		input: RagieEndpointInputSchemas.connectionsUpdate,
		output: RagieEndpointOutputSchemas.connectionsUpdate,
	},
	'connections.sync': {
		input: RagieEndpointInputSchemas.connectionsSync,
		output: RagieEndpointOutputSchemas.connectionsSync,
	},
	'connections.delete': {
		input: RagieEndpointInputSchemas.connectionsDelete,
		output: RagieEndpointOutputSchemas.connectionsDelete,
	},
	'connections.setEnabled': {
		input: RagieEndpointInputSchemas.connectionsSetEnabled,
		output: RagieEndpointOutputSchemas.connectionsSetEnabled,
	},
	'connections.setLimits': {
		input: RagieEndpointInputSchemas.connectionsSetLimits,
		output: RagieEndpointOutputSchemas.connectionsSetLimits,
	},
	'responses.create': {
		input: RagieEndpointInputSchemas.responsesCreate,
		output: RagieEndpointOutputSchemas.responsesCreate,
	},
	'responses.get': {
		input: RagieEndpointInputSchemas.responsesGet,
		output: RagieEndpointOutputSchemas.responsesGet,
	},
	'webhookEndpoints.list': {
		input: RagieEndpointInputSchemas.webhookEndpointsList,
		output: RagieEndpointOutputSchemas.webhookEndpointsList,
	},
	'webhookEndpoints.create': {
		input: RagieEndpointInputSchemas.webhookEndpointsCreate,
		output: RagieEndpointOutputSchemas.webhookEndpointsCreate,
	},
	'webhookEndpoints.get': {
		input: RagieEndpointInputSchemas.webhookEndpointsGet,
		output: RagieEndpointOutputSchemas.webhookEndpointsGet,
	},
	'webhookEndpoints.update': {
		input: RagieEndpointInputSchemas.webhookEndpointsUpdate,
		output: RagieEndpointOutputSchemas.webhookEndpointsUpdate,
	},
	'webhookEndpoints.delete': {
		input: RagieEndpointInputSchemas.webhookEndpointsDelete,
		output: RagieEndpointOutputSchemas.webhookEndpointsDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof ragieEndpointsNested>;

const defaultAuthType = 'api_key' as const;

const ragieEndpointMeta = {
	'documents.list': {
		riskLevel: 'read',
		description:
			'List documents with their processing status, paged by cursor; filter by a JSON metadata filter or partition',
	},
	'documents.create': {
		riskLevel: 'write',
		description:
			'Upload a file for ingestion. Processing runs in the background: poll documents.get until status is ready or failed',
		job: DOCUMENT_JOB,
	},
	'documents.createRaw': {
		riskLevel: 'write',
		description:
			'Ingest raw text. Processing runs in the background: poll documents.get until status is ready or failed',
		job: DOCUMENT_JOB,
	},
	'documents.createFromUrl': {
		riskLevel: 'write',
		description:
			'Fetch a URL and ingest its content. Processing runs in the background: poll documents.get until status is ready or failed',
		job: DOCUMENT_JOB,
	},
	'documents.get': {
		riskLevel: 'read',
		description:
			'Read one document, including its processing status: pending, partitioning, partitioned, refined, chunked, indexed, summary_indexed, keyword_indexed, ready or failed',
	},
	'documents.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a document and its chunks. There is no restore call',
	},
	'documents.updateFile': {
		riskLevel: 'write',
		description:
			'Replace a document with a new file. Reprocessing runs in the background: poll documents.get until status is ready or failed',
		job: DOCUMENT_JOB,
	},
	'documents.updateRaw': {
		riskLevel: 'write',
		description:
			'Replace a document with new raw text. Reprocessing runs in the background: poll documents.get until status is ready or failed',
		job: DOCUMENT_JOB,
	},
	'documents.updateFromUrl': {
		riskLevel: 'write',
		description:
			'Replace a document with content fetched from a URL. Reprocessing runs in the background: poll documents.get until status is ready or failed',
		job: DOCUMENT_JOB,
	},
	'documents.patchMetadata': {
		riskLevel: 'write',
		description:
			'Merge metadata onto a document; a null value deletes that key',
	},
	'documents.getChunks': {
		riskLevel: 'read',
		description: 'List the chunks a document was split into, paged by cursor',
	},
	'documents.getContent': {
		riskLevel: 'read',
		description:
			'Read a document processed content as JSON. Audio and video media-type streaming is not wrapped',
	},
	'documents.getSummary': {
		riskLevel: 'read',
		description:
			'Read the LLM summary of a document; unavailable for spreadsheets, JSON and documents over a million tokens',
	},
	'retrievals.retrieve': {
		riskLevel: 'read',
		description:
			'Search ingested documents and return scored chunks, optionally reranked and filtered by metadata operators',
	},
	'connections.list': {
		riskLevel: 'read',
		description: 'List managed data connectors, paged by cursor',
	},
	'connections.get': {
		riskLevel: 'read',
		description: 'Read one connection, including its sync state and limits',
	},
	'connections.listSourceTypes': {
		riskLevel: 'read',
		description:
			'List the connector types Ragie supports, with the metadata each needs',
	},
	'connections.create': {
		riskLevel: 'write',
		description:
			'Create a non-OAuth connector such as S3, GCS, Freshdesk, Zendesk, Intercom or a web crawler, with its settings and credentials',
	},
	'connections.createOAuthRedirectUrl': {
		riskLevel: 'write',
		description:
			'Start an OAuth connector flow (Google Drive, Notion and the like) and get the short-lived redirect URL to send the user to',
	},
	'connections.update': {
		riskLevel: 'write',
		description:
			'Update a connection metadata, mode, partition strategy or page limit',
	},
	'connections.sync': {
		riskLevel: 'write',
		description:
			'Schedule a connector to sync as soon as possible; the sync itself runs in the background',
	},
	'connections.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a connection. With keep_files false its documents are deleted too and cannot be recovered; with true the documents survive unlinked',
	},
	'connections.setEnabled': {
		riskLevel: 'write',
		description: 'Enable or disable a connection syncing',
	},
	'connections.setLimits': {
		riskLevel: 'write',
		description:
			'Set the monthly page limit on a connection; null removes the limit',
	},
	'responses.create': {
		riskLevel: 'write',
		description:
			'Generate a grounded answer with the deep-search model. Bills LLM usage; poll responses.get until status is completed, failed or cancelled',
		job: RESPONSE_JOB,
	},
	'responses.get': {
		riskLevel: 'read',
		description:
			'Read a generated response, including its status and the final answer',
	},
	'webhookEndpoints.list': {
		riskLevel: 'read',
		description:
			'List the webhook endpoints registered to receive tenant events, paged by cursor. Deliveries are not handled by this plugin',
	},
	'webhookEndpoints.create': {
		riskLevel: 'write',
		description:
			'Register a webhook endpoint. The answer carries its signing secret, which is shown only once per endpoint',
	},
	'webhookEndpoints.get': {
		riskLevel: 'read',
		description: 'Read one webhook endpoint registration',
	},
	'webhookEndpoints.update': {
		riskLevel: 'write',
		description:
			'Update a webhook endpoint name, URL, partition pattern or active flag',
	},
	'webhookEndpoints.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a webhook endpoint registration; its signing secret stops working',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof ragieEndpointsNested>;

export type BaseRagiePlugin<T extends RagiePluginOptions> = CorsairPlugin<
	'ragie',
	typeof RagieSchema,
	typeof ragieEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalRagiePlugin = BaseRagiePlugin<RagiePluginOptions>;

export type ExternalRagiePlugin<T extends RagiePluginOptions> =
	BaseRagiePlugin<T>;

// Scope cut, per the research: partitions, authenticators, entities and
// elements are beta or tenant-admin surfaces and are not wrapped. Partition
// scoping still works through the `partition` parameters the wrapped
// operations accept.
export function ragie<const T extends RagiePluginOptions>(
	incomingOptions: RagiePluginOptions & T = {} as RagiePluginOptions & T,
): ExternalRagiePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'ragie',
		schema: RagieSchema,
		options: options,
		hooks: options.hooks,
		endpoints: ragieEndpointsNested,
		webhooks: {},
		endpointMeta: ragieEndpointMeta,
		endpointSchemas: ragieEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: RagieKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('ragie', ctx.authType ?? 'api_key');
		},
	} satisfies InternalRagiePlugin;
}

export { RagieAPIError } from './client';

export type {
	RagieEndpointInputs,
	RagieEndpointOutputs,
} from './endpoints/types';
export {
	DOCUMENT_STATUSES,
	RESPONSE_STATUSES,
} from './endpoints/types';
