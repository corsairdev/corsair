import type {
	BindEndpoints,
	BindWebhooks,
	CorsairEndpoint,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import { Account, Submissions, Submitters, Templates } from './endpoints';
import type {
	DocuSealEndpointInputs,
	DocuSealEndpointOutputs,
} from './endpoints/types';
import {
	DocuSealEndpointInputSchemas,
	DocuSealEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { DocuSealSchema } from './schema';
import {
	docuSealWebhookSchemas,
	docuSealWebhooksNested,
	isDocuSealDelivery,
} from './webhooks';

export type DocuSealPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/**
	 * The DocuSeal server: `https://api.docuseal.com` (default, global cloud),
	 * `https://api.docuseal.eu` (EU cloud), or a self-hosted site
	 * (`https://sign.example.com`, `/api` is added).
	 */
	baseUrl?: string;
	/**
	 * The webhook's signing secret (`whsec_...`) from DocuSeal's webhook
	 * settings. Overrides the account's stored webhook_signature.
	 */
	webhookSecret?: string;
	hooks?: InternalDocuSealPlugin['hooks'];
	webhookHooks?: InternalDocuSealPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof docuSealEndpointsNested>;
};

export type DocuSealContext = CorsairPluginContext<
	typeof DocuSealSchema,
	DocuSealPluginOptions
>;

export type DocuSealKeyBuilderContext =
	KeyBuilderContext<DocuSealPluginOptions>;

export type DocuSealBoundEndpoints = BindEndpoints<
	typeof docuSealEndpointsNested
>;

export type DocuSealBoundWebhooks = BindWebhooks<typeof docuSealWebhooksNested>;

type DocuSealEndpoint<K extends keyof DocuSealEndpointOutputs> =
	CorsairEndpoint<
		DocuSealContext,
		DocuSealEndpointInputs[K],
		DocuSealEndpointOutputs[K]
	>;

export type DocuSealEndpoints = {
	templatesList: DocuSealEndpoint<'templatesList'>;
	templatesGet: DocuSealEndpoint<'templatesGet'>;
	templatesUpdate: DocuSealEndpoint<'templatesUpdate'>;
	templatesArchive: DocuSealEndpoint<'templatesArchive'>;
	templatesCreateFromHtml: DocuSealEndpoint<'templatesCreateFromHtml'>;
	templatesCreateFromPdf: DocuSealEndpoint<'templatesCreateFromPdf'>;
	templatesCreateFromDocx: DocuSealEndpoint<'templatesCreateFromDocx'>;
	templatesClone: DocuSealEndpoint<'templatesClone'>;
	templatesMerge: DocuSealEndpoint<'templatesMerge'>;
	templatesUpdateDocuments: DocuSealEndpoint<'templatesUpdateDocuments'>;
	submissionsList: DocuSealEndpoint<'submissionsList'>;
	submissionsGet: DocuSealEndpoint<'submissionsGet'>;
	submissionsCreate: DocuSealEndpoint<'submissionsCreate'>;
	submissionsCreateFromPdf: DocuSealEndpoint<'submissionsCreateFromPdf'>;
	submissionsCreateFromHtml: DocuSealEndpoint<'submissionsCreateFromHtml'>;
	submissionsCreateFromDocx: DocuSealEndpoint<'submissionsCreateFromDocx'>;
	submissionsCreateFromEmails: DocuSealEndpoint<'submissionsCreateFromEmails'>;
	submissionsUpdate: DocuSealEndpoint<'submissionsUpdate'>;
	submissionsArchive: DocuSealEndpoint<'submissionsArchive'>;
	submissionsGetDocuments: DocuSealEndpoint<'submissionsGetDocuments'>;
	submittersList: DocuSealEndpoint<'submittersList'>;
	submittersGet: DocuSealEndpoint<'submittersGet'>;
	submittersUpdate: DocuSealEndpoint<'submittersUpdate'>;
	usersMe: DocuSealEndpoint<'usersMe'>;
	eventsListFormCompleted: DocuSealEndpoint<'eventsListFormCompleted'>;
	eventsListSubmissionCompleted: DocuSealEndpoint<'eventsListSubmissionCompleted'>;
	toolsMergePdfs: DocuSealEndpoint<'toolsMergePdfs'>;
	toolsVerifyPdf: DocuSealEndpoint<'toolsVerifyPdf'>;
};

const docuSealEndpointsNested = {
	templates: {
		list: Templates.list,
		get: Templates.get,
		update: Templates.update,
		archive: Templates.archive,
		createFromHtml: Templates.createFromHtml,
		createFromPdf: Templates.createFromPdf,
		createFromDocx: Templates.createFromDocx,
		clone: Templates.clone,
		merge: Templates.merge,
		updateDocuments: Templates.updateDocuments,
	},
	submissions: {
		list: Submissions.list,
		get: Submissions.get,
		create: Submissions.create,
		createFromPdf: Submissions.createFromPdf,
		createFromHtml: Submissions.createFromHtml,
		createFromDocx: Submissions.createFromDocx,
		createFromEmails: Submissions.createFromEmails,
		update: Submissions.update,
		archive: Submissions.archive,
		getDocuments: Submissions.getDocuments,
	},
	submitters: {
		list: Submitters.list,
		get: Submitters.get,
		update: Submitters.update,
	},
	users: {
		me: Account.me,
	},
	events: {
		listFormCompleted: Account.listFormCompleted,
		listSubmissionCompleted: Account.listSubmissionCompleted,
	},
	tools: {
		mergePdfs: Account.mergePdfs,
		verifyPdf: Account.verifyPdf,
	},
} as const;

const operationNames = [
	'templates.list',
	'templates.get',
	'templates.update',
	'templates.archive',
	'templates.createFromHtml',
	'templates.createFromPdf',
	'templates.createFromDocx',
	'templates.clone',
	'templates.merge',
	'templates.updateDocuments',
	'submissions.list',
	'submissions.get',
	'submissions.create',
	'submissions.createFromPdf',
	'submissions.createFromHtml',
	'submissions.createFromDocx',
	'submissions.createFromEmails',
	'submissions.update',
	'submissions.archive',
	'submissions.getDocuments',
	'submitters.list',
	'submitters.get',
	'submitters.update',
	'users.me',
	'events.listFormCompleted',
	'events.listSubmissionCompleted',
	'tools.mergePdfs',
	'tools.verifyPdf',
] as const;

export const docuSealEndpointSchemas = {
	'templates.list': {
		input: DocuSealEndpointInputSchemas.templatesList,
		output: DocuSealEndpointOutputSchemas.templatesList,
	},
	'templates.get': {
		input: DocuSealEndpointInputSchemas.templatesGet,
		output: DocuSealEndpointOutputSchemas.templatesGet,
	},
	'templates.update': {
		input: DocuSealEndpointInputSchemas.templatesUpdate,
		output: DocuSealEndpointOutputSchemas.templatesUpdate,
	},
	'templates.archive': {
		input: DocuSealEndpointInputSchemas.templatesArchive,
		output: DocuSealEndpointOutputSchemas.templatesArchive,
	},
	'templates.createFromHtml': {
		input: DocuSealEndpointInputSchemas.templatesCreateFromHtml,
		output: DocuSealEndpointOutputSchemas.templatesCreateFromHtml,
	},
	'templates.createFromPdf': {
		input: DocuSealEndpointInputSchemas.templatesCreateFromPdf,
		output: DocuSealEndpointOutputSchemas.templatesCreateFromPdf,
	},
	'templates.createFromDocx': {
		input: DocuSealEndpointInputSchemas.templatesCreateFromDocx,
		output: DocuSealEndpointOutputSchemas.templatesCreateFromDocx,
	},
	'templates.clone': {
		input: DocuSealEndpointInputSchemas.templatesClone,
		output: DocuSealEndpointOutputSchemas.templatesClone,
	},
	'templates.merge': {
		input: DocuSealEndpointInputSchemas.templatesMerge,
		output: DocuSealEndpointOutputSchemas.templatesMerge,
	},
	'templates.updateDocuments': {
		input: DocuSealEndpointInputSchemas.templatesUpdateDocuments,
		output: DocuSealEndpointOutputSchemas.templatesUpdateDocuments,
	},
	'submissions.list': {
		input: DocuSealEndpointInputSchemas.submissionsList,
		output: DocuSealEndpointOutputSchemas.submissionsList,
	},
	'submissions.get': {
		input: DocuSealEndpointInputSchemas.submissionsGet,
		output: DocuSealEndpointOutputSchemas.submissionsGet,
	},
	'submissions.create': {
		input: DocuSealEndpointInputSchemas.submissionsCreate,
		output: DocuSealEndpointOutputSchemas.submissionsCreate,
	},
	'submissions.createFromPdf': {
		input: DocuSealEndpointInputSchemas.submissionsCreateFromPdf,
		output: DocuSealEndpointOutputSchemas.submissionsCreateFromPdf,
	},
	'submissions.createFromHtml': {
		input: DocuSealEndpointInputSchemas.submissionsCreateFromHtml,
		output: DocuSealEndpointOutputSchemas.submissionsCreateFromHtml,
	},
	'submissions.createFromDocx': {
		input: DocuSealEndpointInputSchemas.submissionsCreateFromDocx,
		output: DocuSealEndpointOutputSchemas.submissionsCreateFromDocx,
	},
	'submissions.createFromEmails': {
		input: DocuSealEndpointInputSchemas.submissionsCreateFromEmails,
		output: DocuSealEndpointOutputSchemas.submissionsCreateFromEmails,
	},
	'submissions.update': {
		input: DocuSealEndpointInputSchemas.submissionsUpdate,
		output: DocuSealEndpointOutputSchemas.submissionsUpdate,
	},
	'submissions.archive': {
		input: DocuSealEndpointInputSchemas.submissionsArchive,
		output: DocuSealEndpointOutputSchemas.submissionsArchive,
	},
	'submissions.getDocuments': {
		input: DocuSealEndpointInputSchemas.submissionsGetDocuments,
		output: DocuSealEndpointOutputSchemas.submissionsGetDocuments,
	},
	'submitters.list': {
		input: DocuSealEndpointInputSchemas.submittersList,
		output: DocuSealEndpointOutputSchemas.submittersList,
	},
	'submitters.get': {
		input: DocuSealEndpointInputSchemas.submittersGet,
		output: DocuSealEndpointOutputSchemas.submittersGet,
	},
	'submitters.update': {
		input: DocuSealEndpointInputSchemas.submittersUpdate,
		output: DocuSealEndpointOutputSchemas.submittersUpdate,
	},
	'users.me': {
		input: DocuSealEndpointInputSchemas.usersMe,
		output: DocuSealEndpointOutputSchemas.usersMe,
	},
	'events.listFormCompleted': {
		input: DocuSealEndpointInputSchemas.eventsListFormCompleted,
		output: DocuSealEndpointOutputSchemas.eventsListFormCompleted,
	},
	'events.listSubmissionCompleted': {
		input: DocuSealEndpointInputSchemas.eventsListSubmissionCompleted,
		output: DocuSealEndpointOutputSchemas.eventsListSubmissionCompleted,
	},
	'tools.mergePdfs': {
		input: DocuSealEndpointInputSchemas.toolsMergePdfs,
		output: DocuSealEndpointOutputSchemas.toolsMergePdfs,
	},
	'tools.verifyPdf': {
		input: DocuSealEndpointInputSchemas.toolsVerifyPdf,
		output: DocuSealEndpointOutputSchemas.toolsVerifyPdf,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof docuSealEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const docuSealEndpointMeta = {
	'templates.list': {
		riskLevel: 'read',
		description:
			'List templates with search and folder filters, newest id first, one page at a time',
	},
	'templates.get': {
		riskLevel: 'read',
		description:
			'Read one template with its documents, field schema and signing roles',
	},
	'templates.update': {
		riskLevel: 'write',
		description:
			'Rename a template, move it to a folder, rename its roles, or archive and restore it with the archived flag',
	},
	'templates.archive': {
		riskLevel: 'write',
		description:
			'Archive a template; DocuSeal has no hard delete, so it can be restored with templates.update and archived: false',
	},
	'templates.createFromHtml': {
		riskLevel: 'write',
		description:
			'Build a template from an HTML document with fillable field tags',
	},
	'templates.createFromPdf': {
		riskLevel: 'write',
		description:
			'Build a template from base64-encoded PDF files, optionally placing signature fields up front; may require a paid (Pro) plan',
	},
	'templates.createFromDocx': {
		riskLevel: 'write',
		description:
			'Build a template from base64-encoded DOCX files with {{...}} tags; may require a paid (Pro) plan',
	},
	'templates.clone': {
		riskLevel: 'write',
		description: 'Copy an existing template into a new one',
	},
	'templates.merge': {
		riskLevel: 'write',
		description:
			'Combine several templates into one new template; the sources are kept; may require a paid (Pro) plan',
	},
	'templates.updateDocuments': {
		riskLevel: 'destructive',
		description:
			'Add, replace or remove the documents attached to a template, or merge them into one PDF; a removed document can only come back by uploading it again; may require a paid (Pro) plan',
	},
	'submissions.list': {
		riskLevel: 'read',
		description:
			'List submissions with template, status and folder filters, newest id first, one page at a time',
	},
	'submissions.get': {
		riskLevel: 'read',
		description:
			'Read one submission with its submitters, documents and event history',
	},
	'submissions.create': {
		riskLevel: 'destructive',
		description:
			'Create a submission from a template, one submitter per signing role; sends the signature-request emails unless send_email is false',
	},
	'submissions.createFromPdf': {
		riskLevel: 'destructive',
		description:
			'Create a one-off submission from base64-encoded PDF files without saving a template; sends signature-request emails unless send_email is false',
	},
	'submissions.createFromHtml': {
		riskLevel: 'destructive',
		description:
			'Create a one-off submission from HTML documents without saving a template; sends signature-request emails unless send_email is false',
	},
	'submissions.createFromDocx': {
		riskLevel: 'destructive',
		description:
			'Create a one-off submission from base64-encoded DOCX files with {{...}} tags; sends signature-request emails unless send_email is false; may require a paid (Pro) plan',
	},
	'submissions.createFromEmails': {
		riskLevel: 'destructive',
		description:
			'Create one submission per address in a comma-separated list, all from one template; sends a signature-request email to each address unless send_email is false. On DocuSeal Cloud without Pro only the first address gets a submission',
	},
	'submissions.update': {
		riskLevel: 'write',
		description:
			'Rename a submission, change or clear its expiry, or archive and restore it with the archived flag',
	},
	'submissions.archive': {
		riskLevel: 'write',
		description:
			'Archive a submission; DocuSeal has no hard delete, so it can be restored with submissions.update and archived: false',
	},
	'submissions.getDocuments': {
		riskLevel: 'read',
		description:
			"Read the URLs of a submission's documents, which are signed and final once the submission is completed; the URLs act as bearer credentials, so treat the result as sensitive",
	},
	'submitters.list': {
		riskLevel: 'read',
		description:
			'List submitters with completion-date and external-id filters, newest id first, one page at a time',
	},
	'submitters.get': {
		riskLevel: 'read',
		description:
			'Read one submitter with the values they filled in and their documents',
	},
	'submitters.update': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Edit a submitter, resend their invitation, or fill their fields; passing completed: true counter-signs the document as this submitter and cannot be undone',
	},
	'users.me': {
		riskLevel: 'read',
		description:
			'Read the user the API key belongs to: id, first and last name, and email',
	},
	'events.listFormCompleted': {
		riskLevel: 'read',
		description:
			'List form.completed events (one per signer who finished), oldest first by completion time in Unix seconds; a polling alternative to webhooks',
	},
	'events.listSubmissionCompleted': {
		riskLevel: 'read',
		description:
			'List submission.completed events (one per fully signed submission), paged by completion time in Unix seconds; a polling alternative to webhooks',
	},
	'tools.mergePdfs': {
		riskLevel: 'read',
		description:
			'Merge two or more base64-encoded PDFs into one and return it base64-encoded; stores nothing',
	},
	'tools.verifyPdf': {
		riskLevel: 'read',
		description:
			"Check a base64-encoded signed PDF's digital signatures and whether it matches a document this account completed",
	},
} as const satisfies RequiredPluginEndpointMeta<typeof docuSealEndpointsNested>;

const docuSealWebhookSchemaMap =
	docuSealWebhookSchemas satisfies RequiredPluginWebhookSchemas<
		typeof docuSealWebhooksNested
	>;

export type BaseDocuSealPlugin<T extends DocuSealPluginOptions> = CorsairPlugin<
	'docuseal',
	typeof DocuSealSchema,
	typeof docuSealEndpointsNested,
	typeof docuSealWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalDocuSealPlugin = BaseDocuSealPlugin<DocuSealPluginOptions>;

export type ExternalDocuSealPlugin<T extends DocuSealPluginOptions> =
	BaseDocuSealPlugin<T>;

export function docuseal<const T extends DocuSealPluginOptions>(
	incomingOptions: DocuSealPluginOptions & T = {} as DocuSealPluginOptions & T,
): ExternalDocuSealPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'docuseal',
		schema: DocuSealSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: docuSealEndpointsNested,
		webhooks: docuSealWebhooksNested,
		endpointMeta: docuSealEndpointMeta,
		endpointSchemas: docuSealEndpointSchemas,
		webhookSchemas: docuSealWebhookSchemaMap,
		pluginWebhookMatcher: isDocuSealDelivery,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: DocuSealKeyBuilderContext, source) => {
			if (source === 'webhook') {
				if (options.webhookSecret) return options.webhookSecret;
				// Without a key store (no database) the verifier reports the
				// missing secret as a 401 instead of a 500 here.
				return (await ctx.keys?.get_webhook_signature?.()) ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('docuseal', ctx.authType ?? 'api_key');
		},
	} satisfies InternalDocuSealPlugin;
}

export {
	DOCUSEAL_API_BASE,
	DOCUSEAL_EU_API_BASE,
	DocuSealTransportError,
	describeDocuSealError,
	normalizeDocuSealBaseUrl,
	withoutRequestData,
} from './client';
export type {
	DocuSealEndpointInputs,
	DocuSealEndpointOutputs,
	DocuSealSubmission,
	DocuSealSubmitter,
	DocuSealTemplate,
	SubmissionsListInput,
	SubmissionsListResponse,
	SubmittersListInput,
	SubmittersListResponse,
	TemplatesListInput,
	TemplatesListResponse,
} from './endpoints/types';
export type {
	DocuSealWebhookId,
	DocuSealWebhookPayloads,
} from './webhooks';
export { verifyDocuSealWebhook } from './webhooks';
