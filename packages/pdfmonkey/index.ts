import type {
	AuthTypes,
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Document, Template } from './endpoints';
import type {
	PDFMonkeyEndpointInputs,
	PDFMonkeyEndpointOutputs,
} from './endpoints/types';
import {
	PDFMonkeyEndpointInputSchemas,
	PDFMonkeyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { PDFMonkeySchema } from './schema';
import { DocumentWebhooks } from './webhooks';
import { matchPDFMonkeyTenantWebhook } from './webhooks/tenant-matcher';
import type {
	DocumentGenerationFailureEvent,
	DocumentGenerationSuccessEvent,
	PDFMonkeyWebhookOutputs,
} from './webhooks/types';
import {
	DocumentGenerationFailureEventSchema,
	DocumentGenerationSuccessEventSchema,
	matchPDFMonkeyPluginWebhook,
} from './webhooks/types';

export type PDFMonkeyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalPDFMonkeyPlugin['hooks'];
	webhookHooks?: InternalPDFMonkeyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof pDFMonkeyEndpointsNested>;
};

export type PDFMonkeyContext = CorsairPluginContext<
	typeof PDFMonkeySchema,
	PDFMonkeyPluginOptions
>;

export type PDFMonkeyKeyBuilderContext =
	KeyBuilderContext<PDFMonkeyPluginOptions>;

export type PDFMonkeyBoundEndpoints = BindEndpoints<
	typeof pDFMonkeyEndpointsNested
>;

type PDFMonkeyEndpoint<K extends keyof PDFMonkeyEndpointOutputs> =
	CorsairEndpoint<
		PDFMonkeyContext,
		PDFMonkeyEndpointInputs[K],
		PDFMonkeyEndpointOutputs[K]
	>;

export type PDFMonkeyEndpoints = {
	listTemplateCards: PDFMonkeyEndpoint<'listTemplateCards'>;
	getTemplate: PDFMonkeyEndpoint<'getTemplate'>;
	createTemplate: PDFMonkeyEndpoint<'createTemplate'>;
	updateTemplate: PDFMonkeyEndpoint<'updateTemplate'>;
	deleteTemplate: PDFMonkeyEndpoint<'deleteTemplate'>;
	createDocument: PDFMonkeyEndpoint<'createDocument'>;
	createDocumentSync: PDFMonkeyEndpoint<'createDocumentSync'>;
	getDocumentCard: PDFMonkeyEndpoint<'getDocumentCard'>;
	listDocumentCards: PDFMonkeyEndpoint<'listDocumentCards'>;
	getDocument: PDFMonkeyEndpoint<'getDocument'>;
	updateDocument: PDFMonkeyEndpoint<'updateDocument'>;
	deleteDocument: PDFMonkeyEndpoint<'deleteDocument'>;
};

type PDFMonkeyWebhook<
	K extends keyof PDFMonkeyWebhookOutputs,
	TEvent,
> = CorsairWebhook<PDFMonkeyContext, TEvent, PDFMonkeyWebhookOutputs[K]>;

export type PDFMonkeyWebhooks = {
	generationSuccess: PDFMonkeyWebhook<
		'generationSuccess',
		DocumentGenerationSuccessEvent
	>;
	generationFailure: PDFMonkeyWebhook<
		'generationFailure',
		DocumentGenerationFailureEvent
	>;
};

export type PDFMonkeyBoundWebhooks = BindWebhooks<PDFMonkeyWebhooks>;

const pDFMonkeyEndpointsNested = {
	templates: {
		listTemplateCards: Template.listTemplateCards,
		getTemplate: Template.getTemplate,
		createTemplate: Template.createTemplate,
		updateTemplate: Template.updateTemplate,
		deleteTemplate: Template.deleteTemplate,
	},
	documents: {
		createDocument: Document.createDocument,
		createDocumentSync: Document.createDocumentSync,
		getDocumentCard: Document.getDocumentCard,
		listDocumentCards: Document.listDocumentCards,
		getDocument: Document.getDocument,
		updateDocument: Document.updateDocument,
		deleteDocument: Document.deleteDocument,
	},
} as const;

export const pDFMonkeyEndpointSchemas = {
	'templates.listTemplateCards': {
		input: PDFMonkeyEndpointInputSchemas.listTemplateCards,
		output: PDFMonkeyEndpointOutputSchemas.listTemplateCards,
	},
	'templates.getTemplate': {
		input: PDFMonkeyEndpointInputSchemas.getTemplate,
		output: PDFMonkeyEndpointOutputSchemas.getTemplate,
	},
	'templates.createTemplate': {
		input: PDFMonkeyEndpointInputSchemas.createTemplate,
		output: PDFMonkeyEndpointOutputSchemas.createTemplate,
	},
	'templates.updateTemplate': {
		input: PDFMonkeyEndpointInputSchemas.updateTemplate,
		output: PDFMonkeyEndpointOutputSchemas.updateTemplate,
	},
	'templates.deleteTemplate': {
		input: PDFMonkeyEndpointInputSchemas.deleteTemplate,
		output: PDFMonkeyEndpointOutputSchemas.deleteTemplate,
	},
	'documents.createDocument': {
		input: PDFMonkeyEndpointInputSchemas.createDocument,
		output: PDFMonkeyEndpointOutputSchemas.createDocument,
	},
	'documents.createDocumentSync': {
		input: PDFMonkeyEndpointInputSchemas.createDocumentSync,
		output: PDFMonkeyEndpointOutputSchemas.createDocumentSync,
	},
	'documents.getDocumentCard': {
		input: PDFMonkeyEndpointInputSchemas.getDocumentCard,
		output: PDFMonkeyEndpointOutputSchemas.getDocumentCard,
	},
	'documents.listDocumentCards': {
		input: PDFMonkeyEndpointInputSchemas.listDocumentCards,
		output: PDFMonkeyEndpointOutputSchemas.listDocumentCards,
	},
	'documents.getDocument': {
		input: PDFMonkeyEndpointInputSchemas.getDocument,
		output: PDFMonkeyEndpointOutputSchemas.getDocument,
	},
	'documents.updateDocument': {
		input: PDFMonkeyEndpointInputSchemas.updateDocument,
		output: PDFMonkeyEndpointOutputSchemas.updateDocument,
	},
	'documents.deleteDocument': {
		input: PDFMonkeyEndpointInputSchemas.deleteDocument,
		output: PDFMonkeyEndpointOutputSchemas.deleteDocument,
	},
} satisfies RequiredPluginEndpointSchemas<typeof pDFMonkeyEndpointsNested>;

const pDFMonkeyWebhooksNested = {
	documents: {
		generationSuccess: DocumentWebhooks.generationSuccess,
		generationFailure: DocumentWebhooks.generationFailure,
	},
} as const;

export const pDFMonkeyWebhookSchemas = {
	'documents.generationSuccess': {
		description: 'A document finished generating successfully',
		payload: DocumentGenerationSuccessEventSchema,
		response: DocumentGenerationSuccessEventSchema,
	},
	'documents.generationFailure': {
		description: 'A document failed to generate',
		payload: DocumentGenerationFailureEventSchema,
		response: DocumentGenerationFailureEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof pDFMonkeyWebhooksNested
>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const pDFMonkeyEndpointMeta = {
	'templates.listTemplateCards': {
		riskLevel: 'read',
		description: 'List template cards for a workspace',
	},
	'templates.getTemplate': {
		riskLevel: 'read',
		description: 'Get a template by ID',
	},
	'templates.createTemplate': {
		riskLevel: 'write',
		description: 'Create a new document template',
	},
	'templates.updateTemplate': {
		riskLevel: 'write',
		description: 'Update an existing template',
	},
	'templates.deleteTemplate': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a template [DESTRUCTIVE · IRREVERSIBLE]',
	},
	'documents.createDocument': {
		riskLevel: 'write',
		description: 'Create a document and queue it for PDF generation',
	},
	'documents.createDocumentSync': {
		riskLevel: 'write',
		description: 'Create a document and wait for generation to complete',
	},
	'documents.getDocumentCard': {
		riskLevel: 'read',
		description: 'Get a document card with status and download URL',
	},
	'documents.listDocumentCards': {
		riskLevel: 'read',
		description: 'List document cards with pagination and filters',
	},
	'documents.getDocument': {
		riskLevel: 'read',
		description: 'Get a full document including payload and generation logs',
	},
	'documents.updateDocument': {
		riskLevel: 'write',
		description: "Update a document's payload, metadata, or template",
	},
	'documents.deleteDocument': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a document [DESTRUCTIVE · IRREVERSIBLE]',
	},
} satisfies RequiredPluginEndpointMeta<typeof pDFMonkeyEndpointsNested>;

export const pDFMonkeyAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePDFMonkeyPlugin<T extends PDFMonkeyPluginOptions> =
	CorsairPlugin<
		'pdfmonkey',
		typeof PDFMonkeySchema,
		typeof pDFMonkeyEndpointsNested,
		typeof pDFMonkeyWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalPDFMonkeyPlugin =
	BasePDFMonkeyPlugin<PDFMonkeyPluginOptions>;

export type ExternalPDFMonkeyPlugin<T extends PDFMonkeyPluginOptions> =
	BasePDFMonkeyPlugin<T>;

export function pdfmonkey<const T extends PDFMonkeyPluginOptions>(
	incomingOptions: PDFMonkeyPluginOptions & T = {} as PDFMonkeyPluginOptions &
		T,
): ExternalPDFMonkeyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'pdfmonkey',
		authConfig: pDFMonkeyAuthConfig,
		schema: PDFMonkeySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: pDFMonkeyEndpointsNested,
		webhooks: pDFMonkeyWebhooksNested,
		endpointMeta: pDFMonkeyEndpointMeta,
		endpointSchemas: pDFMonkeyEndpointSchemas,
		webhookSchemas: pDFMonkeyWebhookSchemas,
		pluginWebhookMatcher: matchPDFMonkeyPluginWebhook,
		pluginTenantWebhookMatcher: matchPDFMonkeyTenantWebhook,
		errorHandlers: (() => {
			const { DEFAULT: defaultHandler, ...specificDefaults } = errorHandlers;
			return {
				...specificDefaults,
				...(options.errorHandlers || {}),
				DEFAULT: options.errorHandlers?.DEFAULT || defaultHandler,
			};
		})(),
		keyBuilder: async (ctx: PDFMonkeyKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				if (!res) {
					throw new AuthMissingError('pdfmonkey', 'webhook_signature');
				}
				return res;
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (!res) {
					throw new AuthMissingError('pdfmonkey', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('pdfmonkey', 'api_key');
		},
	} satisfies InternalPDFMonkeyPlugin;
}

export type {
	PDFMonkeyEndpointInputs,
	PDFMonkeyEndpointOutputs,
} from './endpoints/types';
export type {
	DocumentGenerationFailureEvent,
	DocumentGenerationSuccessEvent,
	PDFMonkeyWebhookOutputs,
} from './webhooks/types';
