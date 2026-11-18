import type {
	AuthTypes,
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
import type { CraftmypdfRegion } from './client';
import { Account, Editor, Pdf, Templates } from './endpoints';
import type {
	CraftmypdfEndpointInputs,
	CraftmypdfEndpointOutputs,
} from './endpoints/types';
import {
	CraftmypdfEndpointInputSchemas,
	CraftmypdfEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { CraftmypdfSchema } from './schema';

export type CraftmypdfPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * Which regional API to call. CraftMyPDF recommends the one nearest the
	 * caller; the default `sg` host is https://api.craftmypdf.com/v1.
	 */
	region?: CraftmypdfRegion;
	hooks?: InternalCraftmypdfPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof craftmypdfEndpointsNested>;
};

export type CraftmypdfContext = CorsairPluginContext<
	typeof CraftmypdfSchema,
	CraftmypdfPluginOptions
>;

export type CraftmypdfKeyBuilderContext =
	KeyBuilderContext<CraftmypdfPluginOptions>;

export type CraftmypdfBoundEndpoints = BindEndpoints<
	typeof craftmypdfEndpointsNested
>;

type CraftmypdfEndpoint<K extends keyof CraftmypdfEndpointOutputs> =
	CorsairEndpoint<
		CraftmypdfContext,
		CraftmypdfEndpointInputs[K],
		CraftmypdfEndpointOutputs[K]
	>;

export type CraftmypdfEndpoints = {
	pdfCreate: CraftmypdfEndpoint<'pdfCreate'>;
	pdfCreateAsync: CraftmypdfEndpoint<'pdfCreateAsync'>;
	pdfCreateImage: CraftmypdfEndpoint<'pdfCreateImage'>;
	pdfCreateMerge: CraftmypdfEndpoint<'pdfCreateMerge'>;
	pdfCreateParallel: CraftmypdfEndpoint<'pdfCreateParallel'>;
	pdfAddWatermark: CraftmypdfEndpoint<'pdfAddWatermark'>;
	pdfAddText: CraftmypdfEndpoint<'pdfAddText'>;
	pdfUpdateFields: CraftmypdfEndpoint<'pdfUpdateFields'>;
	pdfMerge: CraftmypdfEndpoint<'pdfMerge'>;
	pdfGetInfo: CraftmypdfEndpoint<'pdfGetInfo'>;
	templatesList: CraftmypdfEndpoint<'templatesList'>;
	templatesGet: CraftmypdfEndpoint<'templatesGet'>;
	templatesUpdate: CraftmypdfEndpoint<'templatesUpdate'>;
	templatesDelete: CraftmypdfEndpoint<'templatesDelete'>;
	templatesCreateFrom: CraftmypdfEndpoint<'templatesCreateFrom'>;
	templatesTransfer: CraftmypdfEndpoint<'templatesTransfer'>;
	templatesListVersions: CraftmypdfEndpoint<'templatesListVersions'>;
	templatesRetainVersions: CraftmypdfEndpoint<'templatesRetainVersions'>;
	templatesQueryUsage: CraftmypdfEndpoint<'templatesQueryUsage'>;
	editorCreateSession: CraftmypdfEndpoint<'editorCreateSession'>;
	editorDeactivateSession: CraftmypdfEndpoint<'editorDeactivateSession'>;
	accountGetInfo: CraftmypdfEndpoint<'accountGetInfo'>;
	transactionsList: CraftmypdfEndpoint<'transactionsList'>;
};

const craftmypdfEndpointsNested = {
	pdf: {
		create: Pdf.create,
		createAsync: Pdf.createAsync,
		createImage: Pdf.createImage,
		createMerge: Pdf.createMerge,
		createParallel: Pdf.createParallel,
		addWatermark: Pdf.addWatermark,
		addText: Pdf.addText,
		updateFields: Pdf.updateFields,
		merge: Pdf.merge,
		getInfo: Pdf.getInfo,
	},
	templates: {
		list: Templates.list,
		get: Templates.get,
		update: Templates.update,
		delete: Templates.remove,
		createFrom: Templates.createFrom,
		transfer: Templates.transfer,
		listVersions: Templates.listVersions,
		retainVersions: Templates.retainVersions,
		queryUsage: Templates.queryUsage,
	},
	editor: {
		createSession: Editor.createSession,
		deactivateSession: Editor.deactivateSession,
	},
	account: {
		getInfo: Account.getInfo,
	},
	transactions: {
		list: Account.list,
	},
} as const;

export const craftmypdfEndpointSchemas = {
	'pdf.create': {
		input: CraftmypdfEndpointInputSchemas.pdfCreate,
		output: CraftmypdfEndpointOutputSchemas.pdfCreate,
	},
	'pdf.createAsync': {
		input: CraftmypdfEndpointInputSchemas.pdfCreateAsync,
		output: CraftmypdfEndpointOutputSchemas.pdfCreateAsync,
	},
	'pdf.createImage': {
		input: CraftmypdfEndpointInputSchemas.pdfCreateImage,
		output: CraftmypdfEndpointOutputSchemas.pdfCreateImage,
	},
	'pdf.createMerge': {
		input: CraftmypdfEndpointInputSchemas.pdfCreateMerge,
		output: CraftmypdfEndpointOutputSchemas.pdfCreateMerge,
	},
	'pdf.createParallel': {
		input: CraftmypdfEndpointInputSchemas.pdfCreateParallel,
		output: CraftmypdfEndpointOutputSchemas.pdfCreateParallel,
	},
	'pdf.addWatermark': {
		input: CraftmypdfEndpointInputSchemas.pdfAddWatermark,
		output: CraftmypdfEndpointOutputSchemas.pdfAddWatermark,
	},
	'pdf.addText': {
		input: CraftmypdfEndpointInputSchemas.pdfAddText,
		output: CraftmypdfEndpointOutputSchemas.pdfAddText,
	},
	'pdf.updateFields': {
		input: CraftmypdfEndpointInputSchemas.pdfUpdateFields,
		output: CraftmypdfEndpointOutputSchemas.pdfUpdateFields,
	},
	'pdf.merge': {
		input: CraftmypdfEndpointInputSchemas.pdfMerge,
		output: CraftmypdfEndpointOutputSchemas.pdfMerge,
	},
	'pdf.getInfo': {
		input: CraftmypdfEndpointInputSchemas.pdfGetInfo,
		output: CraftmypdfEndpointOutputSchemas.pdfGetInfo,
	},
	'templates.list': {
		input: CraftmypdfEndpointInputSchemas.templatesList,
		output: CraftmypdfEndpointOutputSchemas.templatesList,
	},
	'templates.get': {
		input: CraftmypdfEndpointInputSchemas.templatesGet,
		output: CraftmypdfEndpointOutputSchemas.templatesGet,
	},
	'templates.update': {
		input: CraftmypdfEndpointInputSchemas.templatesUpdate,
		output: CraftmypdfEndpointOutputSchemas.templatesUpdate,
	},
	'templates.delete': {
		input: CraftmypdfEndpointInputSchemas.templatesDelete,
		output: CraftmypdfEndpointOutputSchemas.templatesDelete,
	},
	'templates.createFrom': {
		input: CraftmypdfEndpointInputSchemas.templatesCreateFrom,
		output: CraftmypdfEndpointOutputSchemas.templatesCreateFrom,
	},
	'templates.transfer': {
		input: CraftmypdfEndpointInputSchemas.templatesTransfer,
		output: CraftmypdfEndpointOutputSchemas.templatesTransfer,
	},
	'templates.listVersions': {
		input: CraftmypdfEndpointInputSchemas.templatesListVersions,
		output: CraftmypdfEndpointOutputSchemas.templatesListVersions,
	},
	'templates.retainVersions': {
		input: CraftmypdfEndpointInputSchemas.templatesRetainVersions,
		output: CraftmypdfEndpointOutputSchemas.templatesRetainVersions,
	},
	'templates.queryUsage': {
		input: CraftmypdfEndpointInputSchemas.templatesQueryUsage,
		output: CraftmypdfEndpointOutputSchemas.templatesQueryUsage,
	},
	'editor.createSession': {
		input: CraftmypdfEndpointInputSchemas.editorCreateSession,
		output: CraftmypdfEndpointOutputSchemas.editorCreateSession,
	},
	'editor.deactivateSession': {
		input: CraftmypdfEndpointInputSchemas.editorDeactivateSession,
		output: CraftmypdfEndpointOutputSchemas.editorDeactivateSession,
	},
	'account.getInfo': {
		input: CraftmypdfEndpointInputSchemas.accountGetInfo,
		output: CraftmypdfEndpointOutputSchemas.accountGetInfo,
	},
	'transactions.list': {
		input: CraftmypdfEndpointInputSchemas.transactionsList,
		output: CraftmypdfEndpointOutputSchemas.transactionsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof craftmypdfEndpointsNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const craftmypdfEndpointMeta = {
	'pdf.create': {
		riskLevel: 'write',
		description:
			'Generate a PDF from a template and JSON data, synchronously; consumes one credit per PDF',
	},
	'pdf.createAsync': {
		riskLevel: 'write',
		description:
			'Queue a PDF generation and return at once with a transaction reference, delivering the file to a webhook URL; consumes one credit per PDF',
	},
	'pdf.createImage': {
		riskLevel: 'write',
		description:
			'Render a template to a JPEG or PNG image instead of a PDF; consumes one credit per image',
	},
	'pdf.createMerge': {
		riskLevel: 'write',
		description:
			'Render several templates, each with its own data, into one combined PDF; consumes one credit per template',
	},
	'pdf.createParallel': {
		riskLevel: 'write',
		description:
			'Generate a batch of PDFs in one request, each from its own template data, optionally merging them into a single file; consumes one credit per PDF',
	},
	'pdf.addWatermark': {
		riskLevel: 'write',
		description:
			'Stamp a text watermark on every page of a PDF and return a new file',
	},
	'pdf.addText': {
		riskLevel: 'write',
		description:
			'Draw text such as page numbers or headers on chosen pages of a PDF and return a new file',
	},
	'pdf.updateFields': {
		riskLevel: 'write',
		description:
			'Fill the form fields of a PDF and optionally make them read-only, returning a new file',
	},
	'pdf.merge': {
		riskLevel: 'write',
		description: 'Merge several PDFs fetched by URL into one file',
	},
	'pdf.getInfo': {
		riskLevel: 'read',
		description:
			'Read the page count and document properties of a PDF at a URL',
	},
	'templates.list': {
		riskLevel: 'read',
		description:
			'List the templates on the account with the ids generation calls need',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Read one template, including its body and sample JSON data',
	},
	'templates.update': {
		riskLevel: 'write',
		description:
			"Change a template's name, sample JSON data or body; the body is what the template renders",
	},
	'templates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Permanently delete a template',
	},
	'templates.createFrom': {
		riskLevel: 'write',
		description: 'Create a new template by copying an existing one',
	},
	'templates.transfer': {
		riskLevel: 'write',
		description:
			'Move a template to another team, after which this account no longer owns it',
	},
	'templates.listVersions': {
		riskLevel: 'read',
		description: 'List the saved versions of a template',
	},
	'templates.retainVersions': {
		riskLevel: 'write',
		description:
			'Mark template versions to protect from automatic cleanup, or release the ones already kept; a released version can be cleaned up later',
	},
	'templates.queryUsage': {
		riskLevel: 'read',
		description:
			'Report how many PDFs and credits the given templates used in a date range',
	},
	'editor.createSession': {
		riskLevel: 'write',
		description:
			'Create a signed URL that lets its bearer edit a template in the embedded designer; the URL is a credential',
	},
	'editor.deactivateSession': {
		riskLevel: 'write',
		description: 'Revoke an editor session so its URL stops working',
	},
	'account.getInfo': {
		riskLevel: 'read',
		description:
			'Read the account name, credit usage and template count against their limits',
	},
	'transactions.list': {
		riskLevel: 'read',
		description:
			'List past generations with their status, credit cost and file size',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof craftmypdfEndpointsNested
>;

export type BaseCraftmypdfPlugin<T extends CraftmypdfPluginOptions> =
	CorsairPlugin<
		'craftmypdf',
		typeof CraftmypdfSchema,
		typeof craftmypdfEndpointsNested,
		// CraftMyPDF calls a webhook URL it is given; it sends no signed
		// deliveries this plugin could verify.
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalCraftmypdfPlugin =
	BaseCraftmypdfPlugin<CraftmypdfPluginOptions>;

export type ExternalCraftmypdfPlugin<T extends CraftmypdfPluginOptions> =
	BaseCraftmypdfPlugin<T>;

export function craftmypdf<const T extends CraftmypdfPluginOptions>(
	incomingOptions: CraftmypdfPluginOptions & T = {} as CraftmypdfPluginOptions &
		T,
): ExternalCraftmypdfPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'craftmypdf',
		schema: CraftmypdfSchema,
		options: options,
		hooks: options.hooks,
		endpoints: craftmypdfEndpointsNested,
		webhooks: {},
		endpointMeta: craftmypdfEndpointMeta,
		endpointSchemas: craftmypdfEndpointSchemas,
		webhookSchemas: {},
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: CraftmypdfKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('craftmypdf', ctx.authType ?? 'api_key');
		},
	} satisfies InternalCraftmypdfPlugin;
}

export type {
	CraftmypdfRegion,
	CraftmypdfRequest,
} from './client';
export { CraftmypdfAPIError } from './client';

export type {
	AccountGetInfoInput,
	AccountGetInfoResponse,
	CraftmypdfAnchor,
	CraftmypdfEndpointInputs,
	CraftmypdfEndpointOutputs,
	CraftmypdfTemplate,
	CraftmypdfTemplateVersion,
	CraftmypdfTransaction,
	EditorCreateSessionInput,
	EditorCreateSessionResponse,
	EditorDeactivateSessionInput,
	EditorDeactivateSessionResponse,
	GeneratedFile,
	PdfAddTextInput,
	PdfAddTextResponse,
	PdfAddWatermarkInput,
	PdfAddWatermarkResponse,
	PdfCreateAsyncInput,
	PdfCreateAsyncResponse,
	PdfCreateImageInput,
	PdfCreateImageResponse,
	PdfCreateInput,
	PdfCreateMergeInput,
	PdfCreateMergeResponse,
	PdfCreateParallelInput,
	PdfCreateParallelResponse,
	PdfCreateResponse,
	PdfGetInfoInput,
	PdfGetInfoResponse,
	PdfMergeInput,
	PdfMergeResponse,
	PdfUpdateFieldsInput,
	PdfUpdateFieldsResponse,
	TemplatesCreateFromInput,
	TemplatesCreateFromResponse,
	TemplatesDeleteInput,
	TemplatesDeleteResponse,
	TemplatesGetInput,
	TemplatesGetResponse,
	TemplatesListInput,
	TemplatesListResponse,
	TemplatesListVersionsInput,
	TemplatesListVersionsResponse,
	TemplatesQueryUsageInput,
	TemplatesQueryUsageResponse,
	TemplatesRetainVersionsInput,
	TemplatesRetainVersionsResponse,
	TemplatesTransferInput,
	TemplatesTransferResponse,
	TemplatesUpdateInput,
	TemplatesUpdateResponse,
	TransactionsListInput,
	TransactionsListResponse,
} from './endpoints/types';
