import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	CorsairWebhook,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Account,
	ApiApplications,
	BulkSends,
	Documents,
	Me,
	Templates,
	Webhooks,
} from './endpoints';
import type {
	SignwellEndpointInputs,
	SignwellEndpointOutputs,
} from './endpoints/types';
import {
	SignwellEndpointInputSchemas,
	SignwellEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import type { JsonObject, UnknownJson } from './json';
import { isJsonObject } from './json';
import { SignwellSchema } from './schema';
import { DocumentWebhooks } from './webhooks';
import { resolveWebhookId } from './webhooks/secret';
import type { SignwellWebhookPayload } from './webhooks/types';
import { SignwellWebhookPayloadSchema } from './webhooks/types';

export type SignwellPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * The SignWell webhook id, which is the HMAC key for delivery hashes. Read
	 * from the account when omitted.
	 */
	webhookSecret?: string;
	hooks?: InternalSignwellPlugin['hooks'];
	webhookHooks?: InternalSignwellPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof signwellEndpointsNested>;
};

export type SignwellContext = CorsairPluginContext<
	typeof SignwellSchema,
	SignwellPluginOptions,
	// The endpoints are not passed here: they reference this context through
	// SignwellEndpoint, and passing them back would make the type circular.
	undefined
>;

export type SignwellKeyBuilderContext =
	KeyBuilderContext<SignwellPluginOptions>;

export type SignwellBoundEndpoints = BindEndpoints<
	typeof signwellEndpointsNested
>;

type SignwellEndpoint<K extends keyof SignwellEndpointOutputs> =
	CorsairEndpoint<
		SignwellContext,
		SignwellEndpointInputs[K],
		SignwellEndpointOutputs[K]
	>;

export type SignwellEndpoints = {
	meGet: SignwellEndpoint<'meGet'>;
	accountGet: SignwellEndpoint<'accountGet'>;
	accountUpdate: SignwellEndpoint<'accountUpdate'>;
	documentsGet: SignwellEndpoint<'documentsGet'>;
	documentsCreate: SignwellEndpoint<'documentsCreate'>;
	documentsCreateFromTemplate: SignwellEndpoint<'documentsCreateFromTemplate'>;
	documentsSend: SignwellEndpoint<'documentsSend'>;
	documentsUpdateRecipients: SignwellEndpoint<'documentsUpdateRecipients'>;
	documentsUpdateAuthentication: SignwellEndpoint<'documentsUpdateAuthentication'>;
	documentsSendReminder: SignwellEndpoint<'documentsSendReminder'>;
	documentsDelete: SignwellEndpoint<'documentsDelete'>;
	documentsGetCompletedPdf: SignwellEndpoint<'documentsGetCompletedPdf'>;
	documentsGetNom151Certificate: SignwellEndpoint<'documentsGetNom151Certificate'>;
	templatesGet: SignwellEndpoint<'templatesGet'>;
	templatesCreate: SignwellEndpoint<'templatesCreate'>;
	templatesUpdate: SignwellEndpoint<'templatesUpdate'>;
	templatesDelete: SignwellEndpoint<'templatesDelete'>;
	webhooksList: SignwellEndpoint<'webhooksList'>;
	webhooksCreate: SignwellEndpoint<'webhooksCreate'>;
	webhooksDelete: SignwellEndpoint<'webhooksDelete'>;
	apiApplicationsGet: SignwellEndpoint<'apiApplicationsGet'>;
	apiApplicationsDelete: SignwellEndpoint<'apiApplicationsDelete'>;
	bulkSendsList: SignwellEndpoint<'bulkSendsList'>;
	bulkSendsGet: SignwellEndpoint<'bulkSendsGet'>;
	bulkSendsGetDocuments: SignwellEndpoint<'bulkSendsGetDocuments'>;
	bulkSendsCreate: SignwellEndpoint<'bulkSendsCreate'>;
	bulkSendsGetCsvTemplate: SignwellEndpoint<'bulkSendsGetCsvTemplate'>;
	bulkSendsValidateCsv: SignwellEndpoint<'bulkSendsValidateCsv'>;
};

export type SignwellWebhookOutputs = {
	documentCreated: SignwellWebhookPayload;
	documentSent: SignwellWebhookPayload;
	documentViewed: SignwellWebhookPayload;
	documentInProgress: SignwellWebhookPayload;
	documentRecipientsUpdated: SignwellWebhookPayload;
	documentSigned: SignwellWebhookPayload;
	documentCompleted: SignwellWebhookPayload;
	documentExpired: SignwellWebhookPayload;
	documentDeclined: SignwellWebhookPayload;
	documentCanceled: SignwellWebhookPayload;
};

type SignwellWebhookK<
	K extends keyof SignwellWebhookOutputs,
	TEvent,
> = CorsairWebhook<SignwellContext, TEvent, SignwellWebhookOutputs[K]>;

export type SignwellWebhooks = {
	document: {
		created: SignwellWebhookK<'documentCreated', SignwellWebhookPayload>;
		sent: SignwellWebhookK<'documentSent', SignwellWebhookPayload>;
		viewed: SignwellWebhookK<'documentViewed', SignwellWebhookPayload>;
		inProgress: SignwellWebhookK<'documentInProgress', SignwellWebhookPayload>;
		recipientsUpdated: SignwellWebhookK<
			'documentRecipientsUpdated',
			SignwellWebhookPayload
		>;
		signed: SignwellWebhookK<'documentSigned', SignwellWebhookPayload>;
		completed: SignwellWebhookK<'documentCompleted', SignwellWebhookPayload>;
		expired: SignwellWebhookK<'documentExpired', SignwellWebhookPayload>;
		declined: SignwellWebhookK<'documentDeclined', SignwellWebhookPayload>;
		canceled: SignwellWebhookK<'documentCanceled', SignwellWebhookPayload>;
	};
};

export type SignwellBoundWebhooks = BindWebhooks<SignwellWebhooks>;

const signwellEndpointsNested = {
	me: {
		get: Me.get,
	},
	account: {
		get: Account.get,
		update: Account.update,
	},
	documents: {
		get: Documents.get,
		create: Documents.create,
		createFromTemplate: Documents.createFromTemplate,
		send: Documents.send,
		updateRecipients: Documents.updateRecipients,
		updateAuthentication: Documents.updateAuthentication,
		sendReminder: Documents.sendReminder,
		delete: Documents.remove,
		getCompletedPdf: Documents.getCompletedPdf,
		getNom151Certificate: Documents.getNom151Certificate,
	},
	templates: {
		get: Templates.get,
		create: Templates.create,
		update: Templates.update,
		delete: Templates.remove,
	},
	webhooks: {
		list: Webhooks.list,
		create: Webhooks.create,
		delete: Webhooks.remove,
	},
	apiApplications: {
		get: ApiApplications.get,
		delete: ApiApplications.remove,
	},
	bulkSends: {
		list: BulkSends.list,
		get: BulkSends.get,
		getDocuments: BulkSends.getDocuments,
		create: BulkSends.create,
		getCsvTemplate: BulkSends.getCsvTemplate,
		validateCsv: BulkSends.validateCsv,
	},
} as const;

const signwellWebhooksNested = {
	document: {
		created: DocumentWebhooks.created,
		sent: DocumentWebhooks.sent,
		viewed: DocumentWebhooks.viewed,
		inProgress: DocumentWebhooks.inProgress,
		recipientsUpdated: DocumentWebhooks.recipientsUpdated,
		signed: DocumentWebhooks.signed,
		completed: DocumentWebhooks.completed,
		expired: DocumentWebhooks.expired,
		declined: DocumentWebhooks.declined,
		canceled: DocumentWebhooks.canceled,
	},
} as const;

export const signwellEndpointSchemas = {
	'me.get': {
		input: SignwellEndpointInputSchemas.meGet,
		output: SignwellEndpointOutputSchemas.meGet,
	},
	'account.get': {
		input: SignwellEndpointInputSchemas.accountGet,
		output: SignwellEndpointOutputSchemas.accountGet,
	},
	'account.update': {
		input: SignwellEndpointInputSchemas.accountUpdate,
		output: SignwellEndpointOutputSchemas.accountUpdate,
	},
	'documents.get': {
		input: SignwellEndpointInputSchemas.documentsGet,
		output: SignwellEndpointOutputSchemas.documentsGet,
	},
	'documents.create': {
		input: SignwellEndpointInputSchemas.documentsCreate,
		output: SignwellEndpointOutputSchemas.documentsCreate,
	},
	'documents.createFromTemplate': {
		input: SignwellEndpointInputSchemas.documentsCreateFromTemplate,
		output: SignwellEndpointOutputSchemas.documentsCreateFromTemplate,
	},
	'documents.send': {
		input: SignwellEndpointInputSchemas.documentsSend,
		output: SignwellEndpointOutputSchemas.documentsSend,
	},
	'documents.updateRecipients': {
		input: SignwellEndpointInputSchemas.documentsUpdateRecipients,
		output: SignwellEndpointOutputSchemas.documentsUpdateRecipients,
	},
	'documents.updateAuthentication': {
		input: SignwellEndpointInputSchemas.documentsUpdateAuthentication,
		output: SignwellEndpointOutputSchemas.documentsUpdateAuthentication,
	},
	'documents.sendReminder': {
		input: SignwellEndpointInputSchemas.documentsSendReminder,
		output: SignwellEndpointOutputSchemas.documentsSendReminder,
	},
	'documents.delete': {
		input: SignwellEndpointInputSchemas.documentsDelete,
		output: SignwellEndpointOutputSchemas.documentsDelete,
	},
	'documents.getCompletedPdf': {
		input: SignwellEndpointInputSchemas.documentsGetCompletedPdf,
		output: SignwellEndpointOutputSchemas.documentsGetCompletedPdf,
	},
	'documents.getNom151Certificate': {
		input: SignwellEndpointInputSchemas.documentsGetNom151Certificate,
		output: SignwellEndpointOutputSchemas.documentsGetNom151Certificate,
	},
	'templates.get': {
		input: SignwellEndpointInputSchemas.templatesGet,
		output: SignwellEndpointOutputSchemas.templatesGet,
	},
	'templates.create': {
		input: SignwellEndpointInputSchemas.templatesCreate,
		output: SignwellEndpointOutputSchemas.templatesCreate,
	},
	'templates.update': {
		input: SignwellEndpointInputSchemas.templatesUpdate,
		output: SignwellEndpointOutputSchemas.templatesUpdate,
	},
	'templates.delete': {
		input: SignwellEndpointInputSchemas.templatesDelete,
		output: SignwellEndpointOutputSchemas.templatesDelete,
	},
	'webhooks.list': {
		input: SignwellEndpointInputSchemas.webhooksList,
		output: SignwellEndpointOutputSchemas.webhooksList,
	},
	'webhooks.create': {
		input: SignwellEndpointInputSchemas.webhooksCreate,
		output: SignwellEndpointOutputSchemas.webhooksCreate,
	},
	'webhooks.delete': {
		input: SignwellEndpointInputSchemas.webhooksDelete,
		output: SignwellEndpointOutputSchemas.webhooksDelete,
	},
	'apiApplications.get': {
		input: SignwellEndpointInputSchemas.apiApplicationsGet,
		output: SignwellEndpointOutputSchemas.apiApplicationsGet,
	},
	'apiApplications.delete': {
		input: SignwellEndpointInputSchemas.apiApplicationsDelete,
		output: SignwellEndpointOutputSchemas.apiApplicationsDelete,
	},
	'bulkSends.list': {
		input: SignwellEndpointInputSchemas.bulkSendsList,
		output: SignwellEndpointOutputSchemas.bulkSendsList,
	},
	'bulkSends.get': {
		input: SignwellEndpointInputSchemas.bulkSendsGet,
		output: SignwellEndpointOutputSchemas.bulkSendsGet,
	},
	'bulkSends.getDocuments': {
		input: SignwellEndpointInputSchemas.bulkSendsGetDocuments,
		output: SignwellEndpointOutputSchemas.bulkSendsGetDocuments,
	},
	'bulkSends.create': {
		input: SignwellEndpointInputSchemas.bulkSendsCreate,
		output: SignwellEndpointOutputSchemas.bulkSendsCreate,
	},
	'bulkSends.getCsvTemplate': {
		input: SignwellEndpointInputSchemas.bulkSendsGetCsvTemplate,
		output: SignwellEndpointOutputSchemas.bulkSendsGetCsvTemplate,
	},
	'bulkSends.validateCsv': {
		input: SignwellEndpointInputSchemas.bulkSendsValidateCsv,
		output: SignwellEndpointOutputSchemas.bulkSendsValidateCsv,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof signwellEndpointsNested
>;

export const signwellWebhookSchemas = {
	'document.created': {
		description: 'A document was created.',
		payload: SignwellWebhookPayloadSchema,
		response: SignwellWebhookPayloadSchema,
	},
	'document.sent': {
		description: 'A document was sent to its recipients.',
		payload: SignwellWebhookPayloadSchema,
		response: SignwellWebhookPayloadSchema,
	},
	'document.viewed': {
		description:
			'A signer opened the document. SignWell sends this once per view.',
		payload: SignwellWebhookPayloadSchema,
		response: SignwellWebhookPayloadSchema,
	},
	'document.inProgress': {
		description:
			'The first signer started filling the document; SignWell sends this once.',
		payload: SignwellWebhookPayloadSchema,
		response: SignwellWebhookPayloadSchema,
	},
	'document.recipientsUpdated': {
		description: "A sent document's recipients were changed.",
		payload: SignwellWebhookPayloadSchema,
		response: SignwellWebhookPayloadSchema,
	},
	'document.signed': {
		description:
			'One recipient signed. A document with several signers sends this once per signer.',
		payload: SignwellWebhookPayloadSchema,
		response: SignwellWebhookPayloadSchema,
	},
	'document.completed': {
		description: 'Every recipient signed and the document is complete.',
		payload: SignwellWebhookPayloadSchema,
		response: SignwellWebhookPayloadSchema,
	},
	'document.expired': {
		description: 'The document passed its expiry date without being completed.',
		payload: SignwellWebhookPayloadSchema,
		response: SignwellWebhookPayloadSchema,
	},
	'document.declined': {
		description: 'A recipient declined to sign.',
		payload: SignwellWebhookPayloadSchema,
		response: SignwellWebhookPayloadSchema,
	},
	'document.canceled': {
		description: 'The sender canceled the document.',
		payload: SignwellWebhookPayloadSchema,
		response: SignwellWebhookPayloadSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof signwellWebhooksNested
>;

const defaultAuthType = 'api_key' as const;

export const signwellEndpointMeta = {
	'me.get': {
		riskLevel: 'read',
		description:
			'Read the authenticated user, their role and the account and workspace the API token belongs to',
	},
	'account.get': {
		riskLevel: 'read',
		description:
			'Read the account name, logo, plan tier and default sending preferences',
	},
	'account.update': {
		riskLevel: 'write',
		description:
			'Change the account name, logo, time zone, date format or recipient language; only the fields you send are changed',
	},
	'documents.get': {
		riskLevel: 'read',
		description:
			'Read one document with its recipients, status, embedded links and metadata',
	},
	'documents.create': {
		riskLevel: 'write',
		description:
			'Create a document from one or more files and send it for signature unless draft is true; this notifies real recipients',
	},
	'documents.createFromTemplate': {
		riskLevel: 'write',
		description:
			'Create a document from one or several templates, filling each placeholder with a recipient, and send it unless draft is true',
	},
	'documents.send': {
		riskLevel: 'write',
		description:
			'Send a draft document to its recipients, optionally changing its subject, message and reminders first',
	},
	'documents.updateRecipients': {
		riskLevel: 'write',
		description:
			'Change the name or email of recipients on a document that has been sent; only recipients who have not started signing',
	},
	'documents.updateAuthentication': {
		riskLevel: 'write',
		description:
			'Change or add passcodes for recipients on a sent document; only recipients who have not started signing',
	},
	'documents.sendReminder': {
		riskLevel: 'write',
		description:
			'Remind recipients who have not signed yet, either everyone or a named list, through their own delivery method',
	},
	'documents.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a document and cancel any signing in progress; the document, its signatures and its audit trail are gone',
	},
	'documents.getCompletedPdf': {
		riskLevel: 'read',
		description:
			'Get a temporary download URL for a completed document as a PDF or a ZIP; the file itself is not returned',
	},
	'documents.getNom151Certificate': {
		riskLevel: 'read',
		description:
			'Get a temporary download URL for the NOM-151 certificate of a completed document, where NOM-151 is enabled',
	},
	'templates.get': {
		riskLevel: 'read',
		description: 'Read one template with its placeholders, files and settings',
	},
	'templates.create': {
		riskLevel: 'write',
		description:
			'Create a reusable template from files and named placeholders that recipients are filled into later',
	},
	'templates.update': {
		riskLevel: 'write',
		description:
			"Change a template's name, message, placeholders, labels or sending settings",
	},
	'templates.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a template; documents already created from it are unaffected, but it cannot be used again',
	},
	'webhooks.list': {
		riskLevel: 'read',
		description:
			'List the webhooks registered on the account with their ids and callback URLs',
	},
	'webhooks.create': {
		riskLevel: 'write',
		description:
			'Register a callback URL that SignWell posts document events to; the returned id is the HMAC key for verifying deliveries',
	},
	'webhooks.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a registered webhook; SignWell stops posting to its URL immediately',
	},
	'apiApplications.get': {
		riskLevel: 'read',
		description:
			"Read one API application's name, callback URLs, owner and branding preferences",
	},
	'apiApplications.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an API application; documents and templates that reference it keep their data but lose its branding and settings',
	},
	'bulkSends.list': {
		riskLevel: 'read',
		description:
			'List bulk sends page by page, optionally filtered to one user or API application',
	},
	'bulkSends.get': {
		riskLevel: 'read',
		description:
			'Read one bulk send with its status and counts of completed and outstanding documents',
	},
	'bulkSends.getDocuments': {
		riskLevel: 'read',
		description:
			"List the documents a bulk send created, page by page, with each document's recipients and status",
	},
	'bulkSends.create': {
		riskLevel: 'write',
		description:
			'Create a bulk send from a CSV of recipient rows against one or more templates; each row becomes a document and is sent',
	},
	'bulkSends.getCsvTemplate': {
		riskLevel: 'read',
		description:
			'Get the blank CSV, base64 encoded, whose columns match the given templates',
	},
	'bulkSends.validateCsv': {
		riskLevel: 'read',
		description:
			'Check a bulk send CSV against its templates without creating anything, and report what SignWell would change',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof signwellEndpointsNested>;

export type BaseSignwellPlugin<T extends SignwellPluginOptions> = CorsairPlugin<
	'signwell',
	typeof SignwellSchema,
	typeof signwellEndpointsNested,
	typeof signwellWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalSignwellPlugin = BaseSignwellPlugin<SignwellPluginOptions>;

export type ExternalSignwellPlugin<T extends SignwellPluginOptions> =
	BaseSignwellPlugin<T>;

export function signwell<const T extends SignwellPluginOptions>(
	incomingOptions: SignwellPluginOptions & T = {} as SignwellPluginOptions & T,
): ExternalSignwellPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'signwell',
		schema: SignwellSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: signwellEndpointsNested,
		webhooks: signwellWebhooksNested,
		endpointMeta: signwellEndpointMeta,
		endpointSchemas: signwellEndpointSchemas,
		webhookSchemas: signwellWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			// SignWell posts one envelope for every event, so any delivery that
			// carries an `event.type` belongs to this plugin.
			const body =
				typeof request.body === 'string'
					? safeParseJson(request.body)
					: request.body;
			if (!isJsonObject(body)) return false;
			const event = body.event;
			return isJsonObject(event) && typeof event.type === 'string';
		},
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: SignwellKeyBuilderContext, source) => {
			if (source === 'webhook') {
				// The webhook id is the HMAC key for a delivery's hash.
				const id = await resolveWebhookId(options, ctx.keys);
				if (id) return id;
				throw new AuthMissingError('signwell', 'api_key');
			}

			if (options.key) return options.key;

			if (ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('signwell', ctx.authType ?? 'api_key');
		},
	} satisfies InternalSignwellPlugin;
}

/**
 * The matcher runs on every delivery before the body is parsed, so a malformed
 * body must return null rather than throw.
 */
function safeParseJson(text: string): JsonObject | null {
	try {
		const parsed: UnknownJson = JSON.parse(text);
		return isJsonObject(parsed) ? parsed : null;
	} catch {
		return null;
	}
}

export { SignwellAPIError } from './client';

export type {
	AccountGetResponse,
	AccountUpdateInput,
	BulkSendsListResponse,
	DocumentsCreateFromTemplateInput,
	DocumentsCreateInput,
	DocumentsGetCompletedPdfInput,
	DocumentsGetCompletedPdfResponse,
	SignwellBulkSend,
	SignwellBulkSendListItem,
	SignwellDocument,
	SignwellDocumentRecipient,
	SignwellEndpointInputs,
	SignwellEndpointOutputs,
	SignwellTemplate,
	SignwellWebhook,
} from './endpoints/types';

export type {
	SignwellEventType,
	SignwellWebhookPayload,
} from './webhooks/types';
export {
	expectedSignature,
	SIGNWELL_EVENT_TYPES,
	verifySignwellWebhook,
} from './webhooks/types';
