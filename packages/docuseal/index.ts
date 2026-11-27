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
import { Submissions, Submitters, Templates } from './endpoints';
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

export type DocuSealPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDocuSealPlugin['hooks'];
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
		riskLevel: 'write',
		description:
			'Add, replace or remove the documents attached to a template; may require a paid (Pro) plan',
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
		riskLevel: 'write',
		description:
			'Create a submission from a template, one submitter per signing role; sends the signature-request emails unless send_email is false',
	},
	'submissions.createFromPdf': {
		riskLevel: 'write',
		description:
			'Create a one-off submission from base64-encoded PDF files without saving a template; sends signature-request emails unless send_email is false',
	},
	'submissions.createFromHtml': {
		riskLevel: 'write',
		description:
			'Create a one-off submission from HTML documents without saving a template; sends signature-request emails unless send_email is false',
	},
	'submissions.createFromDocx': {
		riskLevel: 'write',
		description:
			'Create a one-off submission from base64-encoded DOCX files with {{...}} tags; may require a paid (Pro) plan',
	},
	'submissions.createFromEmails': {
		riskLevel: 'write',
		description:
			'Create one submission per address in a comma-separated list, all from one template',
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
		riskLevel: 'write',
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
		riskLevel: 'write',
		irreversible: true,
		description:
			'Edit a submitter, resend their invitation, or fill their fields; passing completed: true counter-signs the document as this submitter and cannot be undone',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof docuSealEndpointsNested>;

export type BaseDocuSealPlugin<T extends DocuSealPluginOptions> = CorsairPlugin<
	'docuseal',
	typeof DocuSealSchema,
	typeof docuSealEndpointsNested,
	{},
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
		endpoints: docuSealEndpointsNested,
		webhooks: {},
		endpointMeta: docuSealEndpointMeta,
		endpointSchemas: docuSealEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: DocuSealKeyBuilderContext, source) => {
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

export { DocuSealAPIError, describeDocuSealError } from './client';

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
