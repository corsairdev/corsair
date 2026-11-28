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
import { Documents, Ips } from './endpoints';
import type {
	DocRaptorEndpointInputs,
	DocRaptorEndpointOutputs,
} from './endpoints/types';
import {
	DocRaptorEndpointInputSchemas,
	DocRaptorEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { DocRaptorSchema } from './schema';

export type DocRaptorPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDocRaptorPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof docRaptorEndpointsNested>;
};

export type DocRaptorContext = CorsairPluginContext<
	typeof DocRaptorSchema,
	DocRaptorPluginOptions
>;

export type DocRaptorKeyBuilderContext =
	KeyBuilderContext<DocRaptorPluginOptions>;

export type DocRaptorBoundEndpoints = BindEndpoints<
	typeof docRaptorEndpointsNested
>;

type DocRaptorEndpoint<K extends keyof DocRaptorEndpointOutputs> =
	CorsairEndpoint<
		DocRaptorContext,
		DocRaptorEndpointInputs[K],
		DocRaptorEndpointOutputs[K]
	>;

export type DocRaptorEndpoints = {
	documentsCreate: DocRaptorEndpoint<'documentsCreate'>;
	documentsDownload: DocRaptorEndpoint<'documentsDownload'>;
	documentsCreateAsync: DocRaptorEndpoint<'documentsCreateAsync'>;
	documentsCreateHosted: DocRaptorEndpoint<'documentsCreateHosted'>;
	documentsCreateHostedAsync: DocRaptorEndpoint<'documentsCreateHostedAsync'>;
	documentsStatus: DocRaptorEndpoint<'documentsStatus'>;
	documentsList: DocRaptorEndpoint<'documentsList'>;
	documentsExpire: DocRaptorEndpoint<'documentsExpire'>;
	ipsList: DocRaptorEndpoint<'ipsList'>;
};

const docRaptorEndpointsNested = {
	documents: {
		create: Documents.create,
		createAsync: Documents.createAsync,
		createHosted: Documents.createHosted,
		createHostedAsync: Documents.createHostedAsync,
		status: Documents.status,
		download: Documents.download,
		list: Documents.list,
		expire: Documents.expire,
	},
	ips: {
		list: Ips.list,
	},
} as const;

export const docRaptorEndpointSchemas = {
	'documents.create': {
		input: DocRaptorEndpointInputSchemas.documentsCreate,
		output: DocRaptorEndpointOutputSchemas.documentsCreate,
	},
	'documents.download': {
		input: DocRaptorEndpointInputSchemas.documentsDownload,
		output: DocRaptorEndpointOutputSchemas.documentsDownload,
	},
	'documents.createAsync': {
		input: DocRaptorEndpointInputSchemas.documentsCreateAsync,
		output: DocRaptorEndpointOutputSchemas.documentsCreateAsync,
	},
	'documents.createHosted': {
		input: DocRaptorEndpointInputSchemas.documentsCreateHosted,
		output: DocRaptorEndpointOutputSchemas.documentsCreateHosted,
	},
	'documents.createHostedAsync': {
		input: DocRaptorEndpointInputSchemas.documentsCreateHostedAsync,
		output: DocRaptorEndpointOutputSchemas.documentsCreateHostedAsync,
	},
	'documents.status': {
		input: DocRaptorEndpointInputSchemas.documentsStatus,
		output: DocRaptorEndpointOutputSchemas.documentsStatus,
	},
	'documents.list': {
		input: DocRaptorEndpointInputSchemas.documentsList,
		output: DocRaptorEndpointOutputSchemas.documentsList,
	},
	'documents.expire': {
		input: DocRaptorEndpointInputSchemas.documentsExpire,
		output: DocRaptorEndpointOutputSchemas.documentsExpire,
	},
	'ips.list': {
		input: DocRaptorEndpointInputSchemas.ipsList,
		output: DocRaptorEndpointOutputSchemas.ipsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof docRaptorEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

// An async creation returns status_id and finishes on DocRaptor's side;
// documents.status reads it back. queued and working are the in-progress
// values and belong to neither list; jobs.test.ts keeps this in step.
const ASYNC_DOC_JOB = {
	idPath: 'status_id',
	status: {
		op: 'documents.status',
		idArg: 'statusId',
		statusPath: 'status',
		done: ['completed'],
		failed: ['failed'],
	},
} as const;

// Every create starts a generation DocRaptor bills against the plan unless
// `test` is true (the plugin's default), so creates are destructive: the
// permission check runs before a billed document can be made.
const docRaptorEndpointMeta = {
	'documents.create': {
		riskLevel: 'destructive',
		description:
			'Convert HTML or a URL to a PDF or Excel file and return the file itself (synchronous, up to 60 seconds); billed unless test is true',
	},
	'documents.createAsync': {
		riskLevel: 'destructive',
		job: ASYNC_DOC_JOB,
		description:
			'Queue an HTML-to-PDF or XML-to-Excel conversion and return its status_id; poll documents.status for the download_url',
	},
	'documents.createHosted': {
		riskLevel: 'destructive',
		description:
			'Generate a document and host it at a public DocRaptor URL, a paid add-on; the URL is billed per download',
	},
	'documents.createHostedAsync': {
		riskLevel: 'destructive',
		job: ASYNC_DOC_JOB,
		description:
			'Queue a hosted document (paid add-on) and return its status_id; poll documents.status for the public download_url',
	},
	'documents.status': {
		riskLevel: 'read',
		description:
			'Read where an asynchronous document stands: queued or working, completed with its download_url, or failed with validation errors',
	},
	'documents.download': {
		riskLevel: 'read',
		description:
			'Download a finished asynchronous document by its download_id and return the file (each download_url allows only a few fetches)',
	},
	'documents.list': {
		riskLevel: 'read',
		description:
			'List generated documents with paging; test-mode keys are denied this listing',
	},
	'documents.expire': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently remove a hosted document so its public URL stops working; this cannot be undone',
	},
	'ips.list': {
		riskLevel: 'read',
		description:
			'List the IP addresses DocRaptor downloads document assets from (document_url, images, stylesheets), for allowlisting on your servers',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof docRaptorEndpointsNested
>;

export type BaseDocRaptorPlugin<T extends DocRaptorPluginOptions> =
	CorsairPlugin<
		'docraptor',
		typeof DocRaptorSchema,
		typeof docRaptorEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalDocRaptorPlugin =
	BaseDocRaptorPlugin<DocRaptorPluginOptions>;

export type ExternalDocRaptorPlugin<T extends DocRaptorPluginOptions> =
	BaseDocRaptorPlugin<T>;

export function docraptor<const T extends DocRaptorPluginOptions>(
	incomingOptions: DocRaptorPluginOptions & T = {} as DocRaptorPluginOptions &
		T,
): ExternalDocRaptorPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'docraptor',
		schema: DocRaptorSchema,
		options: options,
		hooks: options.hooks,
		endpoints: docRaptorEndpointsNested,
		webhooks: {},
		endpointMeta: docRaptorEndpointMeta,
		endpointSchemas: docRaptorEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: DocRaptorKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('docraptor', ctx.authType ?? 'api_key');
		},
	} satisfies InternalDocRaptorPlugin;
}

export { describeDocRaptorErrorBody, isDocRaptorThrottle } from './client';

export type {
	AsyncDocResponse,
	DocCreateInput,
	DocRaptorEndpointInputs,
	DocRaptorEndpointOutputs,
	DocStatus,
	DocumentsListInput,
	DocumentsListResponse,
	ExpireInput,
	ExpireResponse,
	HostedDocCreateInput,
	HostedDocResponse,
	IpsListInput,
	IpsListResponse,
	StatusInput,
} from './endpoints/types';
