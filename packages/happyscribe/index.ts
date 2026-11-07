import type {
	BindEndpoints,
	BindWebhooks,
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
	RequiredPluginWebhookSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Exports,
	Glossaries,
	Intelligence,
	Meetings,
	Memberships,
	Orders,
	Organizations,
	StyleGuides,
	Transcriptions,
	Translations,
	Uploads,
} from './endpoints';
import type {
	HappyScribeEndpointInputs,
	HappyScribeEndpointOutputs,
} from './endpoints/types';
import {
	HappyScribeEndpointInputSchemas,
	HappyScribeEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { HappyScribeSchema } from './schema';
import { MeetingWebhooks, OtherWebhooks } from './webhooks';
import { matchHappyScribeTenantWebhook } from './webhooks/tenant-matcher';
import { HappyScribeWebhookPayloadSchema } from './webhooks/types';

export type HappyScribePluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/** HappyScribe webhook signing secret (`whsec_...`), shown once at endpoint creation. */
	webhookSecret?: string;
	hooks?: InternalHappyScribePlugin['hooks'];
	webhookHooks?: InternalHappyScribePlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof happyScribeEndpointsNested>;
};

export type HappyScribeContext = CorsairPluginContext<
	typeof HappyScribeSchema,
	HappyScribePluginOptions
>;

export type HappyScribeKeyBuilderContext =
	KeyBuilderContext<HappyScribePluginOptions>;

export type HappyScribeBoundEndpoints = BindEndpoints<
	typeof happyScribeEndpointsNested
>;

export type HappyScribeBoundWebhooks = BindWebhooks<
	typeof happyScribeWebhooksNested
>;

type HappyScribeEndpoint<K extends keyof HappyScribeEndpointOutputs> =
	CorsairEndpoint<
		HappyScribeContext,
		HappyScribeEndpointInputs[K],
		HappyScribeEndpointOutputs[K]
	>;

export type HappyScribeEndpoints = {
	transcriptionsList: HappyScribeEndpoint<'transcriptionsList'>;
	transcriptionsCreate: HappyScribeEndpoint<'transcriptionsCreate'>;
	transcriptionsGetDetails: HappyScribeEndpoint<'transcriptionsGetDetails'>;
	transcriptionsGetSummary: HappyScribeEndpoint<'transcriptionsGetSummary'>;
	transcriptionsUpdateDetails: HappyScribeEndpoint<'transcriptionsUpdateDetails'>;
	transcriptionsDelete: HappyScribeEndpoint<'transcriptionsDelete'>;
	exportsCreate: HappyScribeEndpoint<'exportsCreate'>;
	exportsGet: HappyScribeEndpoint<'exportsGet'>;
	translationsCreateTask: HappyScribeEndpoint<'translationsCreateTask'>;
	translationsGetTask: HappyScribeEndpoint<'translationsGetTask'>;
	meetingsCreate: HappyScribeEndpoint<'meetingsCreate'>;
	meetingsGet: HappyScribeEndpoint<'meetingsGet'>;
	uploadsGetSignedUrl: HappyScribeEndpoint<'uploadsGetSignedUrl'>;
	glossariesList: HappyScribeEndpoint<'glossariesList'>;
	styleGuidesList: HappyScribeEndpoint<'styleGuidesList'>;
	organizationsList: HappyScribeEndpoint<'organizationsList'>;
	membershipsList: HappyScribeEndpoint<'membershipsList'>;
	membershipsAdd: HappyScribeEndpoint<'membershipsAdd'>;
	membershipsUpdateRole: HappyScribeEndpoint<'membershipsUpdateRole'>;
	membershipsRemove: HappyScribeEndpoint<'membershipsRemove'>;
	ordersCreate: HappyScribeEndpoint<'ordersCreate'>;
	ordersCreateTranslation: HappyScribeEndpoint<'ordersCreateTranslation'>;
	ordersGet: HappyScribeEndpoint<'ordersGet'>;
	ordersConfirm: HappyScribeEndpoint<'ordersConfirm'>;
	companiesList: HappyScribeEndpoint<'companiesList'>;
	companiesGet: HappyScribeEndpoint<'companiesGet'>;
	peopleList: HappyScribeEndpoint<'peopleList'>;
	peopleGet: HappyScribeEndpoint<'peopleGet'>;
};

const happyScribeEndpointsNested = {
	transcriptions: {
		list: Transcriptions.list,
		create: Transcriptions.create,
		getDetails: Transcriptions.getDetails,
		getSummary: Transcriptions.getSummary,
		updateDetails: Transcriptions.updateDetails,
		delete: Transcriptions.delete,
	},
	exports: {
		create: Exports.create,
		get: Exports.get,
	},
	translations: {
		createTask: Translations.createTask,
		getTask: Translations.getTask,
	},
	meetings: {
		create: Meetings.create,
		get: Meetings.get,
	},
	uploads: {
		getSignedUrl: Uploads.getSignedUrl,
	},
	glossaries: {
		list: Glossaries.list,
	},
	styleGuides: {
		list: StyleGuides.list,
	},
	organizations: {
		list: Organizations.list,
	},
	memberships: {
		list: Memberships.list,
		add: Memberships.add,
		updateRole: Memberships.updateRole,
		remove: Memberships.remove,
	},
	orders: {
		create: Orders.create,
		createTranslation: Orders.createTranslation,
		get: Orders.get,
		confirm: Orders.confirm,
	},
	companies: {
		list: Intelligence.listCompanies,
		get: Intelligence.getCompany,
	},
	people: {
		list: Intelligence.listPeople,
		get: Intelligence.getPerson,
	},
} as const;

const happyScribeWebhooksNested = {
	meetings: {
		recordingStarted: MeetingWebhooks.recordingStarted,
		recordingCompleted: MeetingWebhooks.recordingCompleted,
		transcriptReady: MeetingWebhooks.transcriptReady,
		summaryReady: MeetingWebhooks.summaryReady,
		failed: MeetingWebhooks.failed,
		cancelled: MeetingWebhooks.cancelled,
	},
	other: {
		other: OtherWebhooks.other,
	},
} as const;

export const happyScribeEndpointSchemas = {
	'transcriptions.list': {
		input: HappyScribeEndpointInputSchemas.transcriptionsList,
		output: HappyScribeEndpointOutputSchemas.transcriptionsList,
	},
	'transcriptions.create': {
		input: HappyScribeEndpointInputSchemas.transcriptionsCreate,
		output: HappyScribeEndpointOutputSchemas.transcriptionsCreate,
	},
	'transcriptions.getDetails': {
		input: HappyScribeEndpointInputSchemas.transcriptionsGetDetails,
		output: HappyScribeEndpointOutputSchemas.transcriptionsGetDetails,
	},
	'transcriptions.getSummary': {
		input: HappyScribeEndpointInputSchemas.transcriptionsGetSummary,
		output: HappyScribeEndpointOutputSchemas.transcriptionsGetSummary,
	},
	'transcriptions.updateDetails': {
		input: HappyScribeEndpointInputSchemas.transcriptionsUpdateDetails,
		output: HappyScribeEndpointOutputSchemas.transcriptionsUpdateDetails,
	},
	'transcriptions.delete': {
		input: HappyScribeEndpointInputSchemas.transcriptionsDelete,
		output: HappyScribeEndpointOutputSchemas.transcriptionsDelete,
	},
	'exports.create': {
		input: HappyScribeEndpointInputSchemas.exportsCreate,
		output: HappyScribeEndpointOutputSchemas.exportsCreate,
	},
	'exports.get': {
		input: HappyScribeEndpointInputSchemas.exportsGet,
		output: HappyScribeEndpointOutputSchemas.exportsGet,
	},
	'translations.createTask': {
		input: HappyScribeEndpointInputSchemas.translationsCreateTask,
		output: HappyScribeEndpointOutputSchemas.translationsCreateTask,
	},
	'translations.getTask': {
		input: HappyScribeEndpointInputSchemas.translationsGetTask,
		output: HappyScribeEndpointOutputSchemas.translationsGetTask,
	},
	'meetings.create': {
		input: HappyScribeEndpointInputSchemas.meetingsCreate,
		output: HappyScribeEndpointOutputSchemas.meetingsCreate,
	},
	'meetings.get': {
		input: HappyScribeEndpointInputSchemas.meetingsGet,
		output: HappyScribeEndpointOutputSchemas.meetingsGet,
	},
	'uploads.getSignedUrl': {
		input: HappyScribeEndpointInputSchemas.uploadsGetSignedUrl,
		output: HappyScribeEndpointOutputSchemas.uploadsGetSignedUrl,
	},
	'glossaries.list': {
		input: HappyScribeEndpointInputSchemas.glossariesList,
		output: HappyScribeEndpointOutputSchemas.glossariesList,
	},
	'styleGuides.list': {
		input: HappyScribeEndpointInputSchemas.styleGuidesList,
		output: HappyScribeEndpointOutputSchemas.styleGuidesList,
	},
	'organizations.list': {
		input: HappyScribeEndpointInputSchemas.organizationsList,
		output: HappyScribeEndpointOutputSchemas.organizationsList,
	},
	'memberships.list': {
		input: HappyScribeEndpointInputSchemas.membershipsList,
		output: HappyScribeEndpointOutputSchemas.membershipsList,
	},
	'memberships.add': {
		input: HappyScribeEndpointInputSchemas.membershipsAdd,
		output: HappyScribeEndpointOutputSchemas.membershipsAdd,
	},
	'memberships.updateRole': {
		input: HappyScribeEndpointInputSchemas.membershipsUpdateRole,
		output: HappyScribeEndpointOutputSchemas.membershipsUpdateRole,
	},
	'memberships.remove': {
		input: HappyScribeEndpointInputSchemas.membershipsRemove,
		output: HappyScribeEndpointOutputSchemas.membershipsRemove,
	},
	'orders.create': {
		input: HappyScribeEndpointInputSchemas.ordersCreate,
		output: HappyScribeEndpointOutputSchemas.ordersCreate,
	},
	'orders.createTranslation': {
		input: HappyScribeEndpointInputSchemas.ordersCreateTranslation,
		output: HappyScribeEndpointOutputSchemas.ordersCreateTranslation,
	},
	'orders.get': {
		input: HappyScribeEndpointInputSchemas.ordersGet,
		output: HappyScribeEndpointOutputSchemas.ordersGet,
	},
	'orders.confirm': {
		input: HappyScribeEndpointInputSchemas.ordersConfirm,
		output: HappyScribeEndpointOutputSchemas.ordersConfirm,
	},
	'companies.list': {
		input: HappyScribeEndpointInputSchemas.companiesList,
		output: HappyScribeEndpointOutputSchemas.companiesList,
	},
	'companies.get': {
		input: HappyScribeEndpointInputSchemas.companiesGet,
		output: HappyScribeEndpointOutputSchemas.companiesGet,
	},
	'people.list': {
		input: HappyScribeEndpointInputSchemas.peopleList,
		output: HappyScribeEndpointOutputSchemas.peopleList,
	},
	'people.get': {
		input: HappyScribeEndpointInputSchemas.peopleGet,
		output: HappyScribeEndpointOutputSchemas.peopleGet,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof happyScribeEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

// Four flows run on HappyScribe after the call returns, each with its own
// field for progress: a transcription's `state` reaches automatic_done, an
// export's `state` reaches ready, a translation task's `state` reaches done,
// and a meeting's `status` (note the different field) reaches completed.
// `locked` and `failed` are terminal failures; jobs.test.ts keeps them in
// step.
const TRANSCRIPTION_JOB = {
	idPath: 'id',
	status: {
		op: 'transcriptions.getDetails',
		idArg: 'fileId',
		statusPath: 'state',
		done: ['automatic_done'],
		failed: ['failed', 'locked'],
	},
} as const;

const EXPORT_JOB = {
	idPath: 'id',
	status: {
		op: 'exports.get',
		idArg: 'exportId',
		statusPath: 'state',
		done: ['ready'],
		failed: [],
	},
} as const;

const TRANSLATION_JOB = {
	idPath: 'id',
	status: {
		op: 'translations.getTask',
		idArg: 'taskId',
		statusPath: 'state',
		done: ['done'],
		failed: ['failed'],
	},
} as const;

const MEETING_JOB = {
	idPath: 'id',
	status: {
		op: 'meetings.get',
		idArg: 'meetingId',
		statusPath: 'status',
		done: ['completed'],
		failed: ['failed'],
	},
} as const;

const happyScribeEndpointMeta = {
	'transcriptions.list': {
		riskLevel: 'read',
		description:
			'List transcriptions in an organization with paging, folder filter and, for Intelligence-enrolled organizations, person and company filters',
	},
	'transcriptions.create': {
		riskLevel: 'write',
		description:
			'Start transcribing media from a public URL; spends transcription credits. Follow with transcriptions.getDetails until state is automatic_done',
		job: TRANSCRIPTION_JOB,
	},
	'transcriptions.getDetails': {
		riskLevel: 'read',
		description:
			'Read one transcription: processing state, language, duration, cost, media URLs and download links',
	},
	'transcriptions.getSummary': {
		riskLevel: 'read',
		description:
			'Read the AI-generated meeting summary of a notetaker recording',
	},
	'transcriptions.updateDetails': {
		riskLevel: 'write',
		description:
			'Change a transcription: move it between organizations or toggle its public sharing link',
	},
	'transcriptions.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Permanently delete a transcription and its media; there is no restore',
	},
	'exports.create': {
		riskLevel: 'write',
		description:
			'Start exporting one or more transcriptions to a format (txt, srt, vtt, docx, pdf, json). Follow with exports.get until state is ready',
		job: EXPORT_JOB,
	},
	'exports.get': {
		riskLevel: 'read',
		description:
			'Where an export stands; once state is ready the answer carries its download_link',
	},
	'translations.createTask': {
		riskLevel: 'write',
		description:
			'Start machine-translating a transcript into a target language; spends credits. Follow with translations.getTask until state is done',
		job: TRANSLATION_JOB,
	},
	'translations.getTask': {
		riskLevel: 'read',
		description:
			'Where a translation task stands: progress percent, failure reason and the translated transcription id once done',
	},
	'meetings.create': {
		riskLevel: 'write',
		description:
			'Send the HappyScribe notetaker bot to a meeting URL at join_at; it records and transcribes. Follow with meetings.get until status is completed',
		job: MEETING_JOB,
	},
	'meetings.get': {
		riskLevel: 'read',
		description:
			'Read one meeting: notetaker status (queued, joining, in_call, processing, completed, failed) and settings',
	},
	'uploads.getSignedUrl': {
		riskLevel: 'read',
		description:
			'Get a pre-signed S3 URL for a filename; upload the file bytes there yourself, then create a transcription from it',
	},
	'glossaries.list': {
		riskLevel: 'read',
		description:
			'List the glossaries an organization can attach to human orders',
	},
	'styleGuides.list': {
		riskLevel: 'read',
		description:
			'List the style guides an organization can attach to human orders',
	},
	'organizations.list': {
		riskLevel: 'read',
		description:
			'List the organizations the API token belongs to, with the caller role and human-service availability',
	},
	'memberships.list': {
		riskLevel: 'read',
		description: 'List the members of an organization with their roles',
	},
	'memberships.add': {
		riskLevel: 'write',
		description: 'Add a user to an organization as admin or member, by email',
	},
	'memberships.updateRole': {
		riskLevel: 'write',
		description: "Change a member's role between admin and member",
	},
	'memberships.remove': {
		riskLevel: 'destructive',
		description:
			'Remove a user from the organization; their existing transcripts stay',
	},
	'orders.create': {
		riskLevel: 'write',
		description:
			'Create a human transcription or subtitling order for media at a URL. It stays incomplete and unpaid until orders.confirm or an explicit confirm flag',
	},
	'orders.createTranslation': {
		riskLevel: 'write',
		description:
			'Create a human translation order for an existing transcription; incomplete and unpaid until confirmed',
	},
	'orders.get': {
		riskLevel: 'read',
		description:
			'Read one human-service order: state, operations, languages and pricing',
	},
	'orders.confirm': {
		riskLevel: 'write',
		description:
			'Confirm an incomplete order, which charges the organization and starts the human work; irreversible',
	},
	'companies.list': {
		riskLevel: 'read',
		description:
			'List companies discovered from meeting transcripts (Intelligence API; 404 when the organization is not enrolled)',
	},
	'companies.get': {
		riskLevel: 'read',
		description:
			'Read one discovered company with its enriched firmographics (Intelligence API)',
	},
	'people.list': {
		riskLevel: 'read',
		description:
			'List contacts discovered from meeting transcripts (Intelligence API; 404 when not enrolled)',
	},
	'people.get': {
		riskLevel: 'read',
		description:
			'Read one discovered contact with company linkage (Intelligence API)',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof happyScribeEndpointsNested
>;

const happyScribeWebhookSchemas = {
	'meetings.recordingStarted': {
		description: 'The notetaker entered the call and recording started',
		payload: HappyScribeWebhookPayloadSchema,
		response: HappyScribeWebhookPayloadSchema,
	},
	'meetings.recordingCompleted': {
		description: 'The provider recording is available for processing',
		payload: HappyScribeWebhookPayloadSchema,
		response: HappyScribeWebhookPayloadSchema,
	},
	'meetings.transcriptReady': {
		description: 'The full JSON transcript is ready',
		payload: HappyScribeWebhookPayloadSchema,
		response: HappyScribeWebhookPayloadSchema,
	},
	'meetings.summaryReady': {
		description:
			'The plain-text meeting summary has been generated and persisted',
		payload: HappyScribeWebhookPayloadSchema,
		response: HappyScribeWebhookPayloadSchema,
	},
	'meetings.failed': {
		description:
			'The notetaker or transcription flow reached a terminal failure',
		payload: HappyScribeWebhookPayloadSchema,
		response: HappyScribeWebhookPayloadSchema,
	},
	'meetings.cancelled': {
		description: 'The Meeting was cancelled before completion',
		payload: HappyScribeWebhookPayloadSchema,
		response: HappyScribeWebhookPayloadSchema,
	},
	'other.other': {
		description:
			'HappyScribe delivery whose event type this plugin has no dedicated handler for; check `type` before acting',
		payload: HappyScribeWebhookPayloadSchema,
		response: HappyScribeWebhookPayloadSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<
	typeof happyScribeWebhooksNested
>;

export const happyScribeAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseHappyScribePlugin<T extends HappyScribePluginOptions> =
	CorsairPlugin<
		'happyscribe',
		typeof HappyScribeSchema,
		typeof happyScribeEndpointsNested,
		typeof happyScribeWebhooksNested,
		T,
		typeof defaultAuthType
	>;

export type InternalHappyScribePlugin =
	BaseHappyScribePlugin<HappyScribePluginOptions>;

export type ExternalHappyScribePlugin<T extends HappyScribePluginOptions> =
	BaseHappyScribePlugin<T>;

export function happyscribe<const T extends HappyScribePluginOptions>(
	incomingOptions: HappyScribePluginOptions &
		T = {} as HappyScribePluginOptions & T,
): ExternalHappyScribePlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'happyscribe',
		authConfig: happyScribeAuthConfig,
		schema: HappyScribeSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: happyScribeEndpointsNested,
		webhooks: happyScribeWebhooksNested,
		endpointMeta: happyScribeEndpointMeta,
		endpointSchemas: happyScribeEndpointSchemas,
		webhookSchemas: happyScribeWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			const keys = Object.keys(headers).map((key) => key.toLowerCase());
			return (
				keys.includes('x-happyscribe-signature') ||
				keys.includes('x-webhook-signature') ||
				keys.includes('x-happyscribe-event')
			);
		},
		pluginTenantWebhookMatcher: matchHappyScribeTenantWebhook,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: HappyScribeKeyBuilderContext, source) => {
			if (source === 'webhook' && options.webhookSecret) {
				return options.webhookSecret;
			}

			if (source === 'webhook') {
				const res = await ctx.keys.get_webhook_signature();
				return res ?? '';
			}

			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('happyscribe', ctx.authType ?? 'api_key');
		},
	} satisfies InternalHappyScribePlugin;
}

export { HappyScribeAPIError } from './client';

export type {
	CompaniesGetInput,
	CompaniesListInput,
	GlossariesListInput,
	HappyScribeCompany,
	HappyScribeEndpointInputs,
	HappyScribeEndpointOutputs,
	HappyScribeExport,
	HappyScribeGlossary,
	HappyScribeMeeting,
	HappyScribeMembership,
	HappyScribeOrder,
	HappyScribeOrganization,
	HappyScribePerson,
	HappyScribeTranscription,
	HappyScribeTranslationTask,
	MeetingsCreateInput,
	MeetingsGetInput,
	MembershipsAddInput,
	MembershipsListInput,
	MembershipsRemoveInput,
	MembershipsUpdateRoleInput,
	OrdersConfirmInput,
	OrdersCreateInput,
	OrdersCreateTranslationInput,
	OrdersGetInput,
	OrganizationsListInput,
	PeopleGetInput,
	PeopleListInput,
	StyleGuidesListInput,
	TranscriptionsCreateExportInput as ExportsCreateInput,
	TranscriptionsCreateInput,
	TranscriptionsDeleteInput,
	TranscriptionsGetDetailsInput,
	TranscriptionsGetExportInput as ExportsGetInput,
	TranscriptionsGetSummaryInput,
	TranscriptionsListInput,
	TranscriptionsUpdateDetailsInput,
	TranslationsCreateTaskInput,
	TranslationsGetTaskInput,
	UploadsGetSignedUrlInput,
} from './endpoints/types';
