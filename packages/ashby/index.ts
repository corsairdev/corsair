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
import {
	ApiKey,
	Application,
	Candidate,
	CustomField,
	Department,
	Interview,
	Job,
	JobPosting,
	Location,
	Offer,
	User,
	Webhook,
} from './endpoints';
import type {
	AshbyEndpointInputs,
	AshbyEndpointOutputs,
} from './endpoints/types';
import {
	AshbyEndpointInputSchemas,
	AshbyEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { AshbySchema } from './schema';
import {
	ApplicationWebhooks,
	CandidateWebhooks,
	InterviewWebhooks,
	OfferWebhooks,
} from './webhooks';
import { matchAshbyTenantWebhook } from './webhooks/tenant-matcher';
import type {
	ApplicationSubmitEvent,
	ApplicationUpdateEvent,
	AshbyWebhookOutputs,
	CandidateHireEvent,
	CandidateStageChangeEvent,
	InterviewPlanTransitionEvent,
	InterviewScheduleCreateEvent,
	InterviewScheduleUpdateEvent,
	OfferCreateEvent,
	OfferDeleteEvent,
	OfferUpdateEvent,
} from './webhooks/types';
import {
	ApplicationSubmitEventSchema,
	ApplicationUpdateEventSchema,
	CandidateHireEventSchema,
	CandidateStageChangeEventSchema,
	InterviewPlanTransitionEventSchema,
	InterviewScheduleCreateEventSchema,
	InterviewScheduleUpdateEventSchema,
	OfferCreateEventSchema,
	OfferDeleteEventSchema,
	OfferUpdateEventSchema,
} from './webhooks/types';

export type AshbyPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalAshbyPlugin['hooks'];
	webhookHooks?: InternalAshbyPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof ashbyEndpointsNested>;
};

export type AshbyContext = CorsairPluginContext<
	typeof AshbySchema,
	AshbyPluginOptions
>;

export type AshbyKeyBuilderContext = KeyBuilderContext<AshbyPluginOptions>;

export type AshbyBoundEndpoints = BindEndpoints<typeof ashbyEndpointsNested>;

type AshbyEndpoint<K extends keyof AshbyEndpointOutputs> = CorsairEndpoint<
	AshbyContext,
	AshbyEndpointInputs[K],
	AshbyEndpointOutputs[K]
>;

export type AshbyEndpoints = {
	// Candidates
	'candidate.info': AshbyEndpoint<'candidate.info'>;
	'candidate.list': AshbyEndpoint<'candidate.list'>;
	'candidate.search': AshbyEndpoint<'candidate.search'>;
	'candidate.create': AshbyEndpoint<'candidate.create'>;
	'candidate.update': AshbyEndpoint<'candidate.update'>;
	'candidate.addTag': AshbyEndpoint<'candidate.addTag'>;
	'candidate.removeTag': AshbyEndpoint<'candidate.removeTag'>;
	'candidate.createNote': AshbyEndpoint<'candidate.createNote'>;
	'candidate.listNotes': AshbyEndpoint<'candidate.listNotes'>;
	'candidate.anonymize': AshbyEndpoint<'candidate.anonymize'>;
	// Applications
	'application.info': AshbyEndpoint<'application.info'>;
	'application.list': AshbyEndpoint<'application.list'>;
	'application.create': AshbyEndpoint<'application.create'>;
	'application.changeStage': AshbyEndpoint<'application.changeStage'>;
	'application.update': AshbyEndpoint<'application.update'>;
	'application.transfer': AshbyEndpoint<'application.transfer'>;
	// Jobs
	'job.info': AshbyEndpoint<'job.info'>;
	'job.list': AshbyEndpoint<'job.list'>;
	'job.create': AshbyEndpoint<'job.create'>;
	'job.update': AshbyEndpoint<'job.update'>;
	'job.search': AshbyEndpoint<'job.search'>;
	// Job Postings
	'jobPosting.info': AshbyEndpoint<'jobPosting.info'>;
	'jobPosting.list': AshbyEndpoint<'jobPosting.list'>;
	// Interviews
	'interview.info': AshbyEndpoint<'interview.info'>;
	'interview.list': AshbyEndpoint<'interview.list'>;
	'interview.scheduleInfo': AshbyEndpoint<'interview.scheduleInfo'>;
	'interview.scheduleList': AshbyEndpoint<'interview.scheduleList'>;
	'interview.stageList': AshbyEndpoint<'interview.stageList'>;
	// Offers
	'offer.info': AshbyEndpoint<'offer.info'>;
	'offer.list': AshbyEndpoint<'offer.list'>;
	'offer.create': AshbyEndpoint<'offer.create'>;
	'offer.update': AshbyEndpoint<'offer.update'>;
	// Departments
	'department.info': AshbyEndpoint<'department.info'>;
	'department.list': AshbyEndpoint<'department.list'>;
	'department.create': AshbyEndpoint<'department.create'>;
	'department.update': AshbyEndpoint<'department.update'>;
	'department.archive': AshbyEndpoint<'department.archive'>;
	// Locations
	'location.info': AshbyEndpoint<'location.info'>;
	'location.list': AshbyEndpoint<'location.list'>;
	'location.create': AshbyEndpoint<'location.create'>;
	'location.update': AshbyEndpoint<'location.update'>;
	'location.archive': AshbyEndpoint<'location.archive'>;
	// Users
	'user.info': AshbyEndpoint<'user.info'>;
	'user.list': AshbyEndpoint<'user.list'>;
	'user.search': AshbyEndpoint<'user.search'>;
	// Custom Fields
	'customField.info': AshbyEndpoint<'customField.info'>;
	'customField.list': AshbyEndpoint<'customField.list'>;
	'customField.setValue': AshbyEndpoint<'customField.setValue'>;
	// API Keys
	'apiKey.info': AshbyEndpoint<'apiKey.info'>;
	// Webhooks
	'webhook.info': AshbyEndpoint<'webhook.info'>;
	'webhook.create': AshbyEndpoint<'webhook.create'>;
	'webhook.delete': AshbyEndpoint<'webhook.delete'>;
};

type AshbyWebhook<K extends keyof AshbyWebhookOutputs, TEvent> = CorsairWebhook<
	AshbyContext,
	TEvent,
	AshbyWebhookOutputs[K]
>;

export type AshbyWebhooks = {
	'candidate.stageChange': AshbyWebhook<
		'candidate.stageChange',
		CandidateStageChangeEvent
	>;
	'candidate.hire': AshbyWebhook<'candidate.hire', CandidateHireEvent>;
	'application.submit': AshbyWebhook<
		'application.submit',
		ApplicationSubmitEvent
	>;
	'application.update': AshbyWebhook<
		'application.update',
		ApplicationUpdateEvent
	>;
	'offer.create': AshbyWebhook<'offer.create', OfferCreateEvent>;
	'offer.update': AshbyWebhook<'offer.update', OfferUpdateEvent>;
	'offer.delete': AshbyWebhook<'offer.delete', OfferDeleteEvent>;
	'interview.scheduleCreate': AshbyWebhook<
		'interview.scheduleCreate',
		InterviewScheduleCreateEvent
	>;
	'interview.scheduleUpdate': AshbyWebhook<
		'interview.scheduleUpdate',
		InterviewScheduleUpdateEvent
	>;
	'interview.planTransition': AshbyWebhook<
		'interview.planTransition',
		InterviewPlanTransitionEvent
	>;
};

export type AshbyBoundWebhooks = BindWebhooks<AshbyWebhooks>;

const ashbyEndpointsNested = {
	candidate: {
		info: Candidate.info,
		list: Candidate.list,
		search: Candidate.search,
		create: Candidate.create,
		update: Candidate.update,
		addTag: Candidate.addTag,
		removeTag: Candidate.removeTag,
		createNote: Candidate.createNote,
		listNotes: Candidate.listNotes,
		anonymize: Candidate.anonymize,
	},
	application: {
		info: Application.info,
		list: Application.list,
		create: Application.create,
		changeStage: Application.changeStage,
		update: Application.update,
		transfer: Application.transfer,
	},
	job: {
		info: Job.info,
		list: Job.list,
		create: Job.create,
		update: Job.update,
		search: Job.search,
	},
	jobPosting: {
		info: JobPosting.info,
		list: JobPosting.list,
	},
	interview: {
		info: Interview.info,
		list: Interview.list,
		scheduleInfo: Interview.scheduleInfo,
		scheduleList: Interview.scheduleList,
		stageList: Interview.stageList,
	},
	offer: {
		info: Offer.info,
		list: Offer.list,
		create: Offer.create,
		update: Offer.update,
	},
	department: {
		info: Department.info,
		list: Department.list,
		create: Department.create,
		update: Department.update,
		archive: Department.archive,
	},
	location: {
		info: Location.info,
		list: Location.list,
		create: Location.create,
		update: Location.update,
		archive: Location.archive,
	},
	user: {
		info: User.info,
		list: User.list,
		search: User.search,
	},
	customField: {
		info: CustomField.info,
		list: CustomField.list,
		setValue: CustomField.setValue,
	},
	apiKey: {
		info: ApiKey.info,
	},
	webhook: {
		info: Webhook.info,
		create: Webhook.create,
		delete: Webhook.delete,
	},
} as const;

const ashbyWebhooksNested = {
	candidate: {
		stageChange: CandidateWebhooks.stageChange,
		hire: CandidateWebhooks.hire,
	},
	application: {
		submit: ApplicationWebhooks.submit,
		update: ApplicationWebhooks.update,
	},
	offer: {
		create: OfferWebhooks.create,
		update: OfferWebhooks.update,
		delete: OfferWebhooks.delete,
	},
	interview: {
		scheduleCreate: InterviewWebhooks.scheduleCreate,
		scheduleUpdate: InterviewWebhooks.scheduleUpdate,
		planTransition: InterviewWebhooks.planTransition,
	},
} as const;

export const ashbyEndpointSchemas = {
	'candidate.info': {
		input: AshbyEndpointInputSchemas['candidate.info'],
		output: AshbyEndpointOutputSchemas['candidate.info'],
	},
	'candidate.list': {
		input: AshbyEndpointInputSchemas['candidate.list'],
		output: AshbyEndpointOutputSchemas['candidate.list'],
	},
	'candidate.search': {
		input: AshbyEndpointInputSchemas['candidate.search'],
		output: AshbyEndpointOutputSchemas['candidate.search'],
	},
	'candidate.create': {
		input: AshbyEndpointInputSchemas['candidate.create'],
		output: AshbyEndpointOutputSchemas['candidate.create'],
	},
	'candidate.update': {
		input: AshbyEndpointInputSchemas['candidate.update'],
		output: AshbyEndpointOutputSchemas['candidate.update'],
	},
	'candidate.addTag': {
		input: AshbyEndpointInputSchemas['candidate.addTag'],
		output: AshbyEndpointOutputSchemas['candidate.addTag'],
	},
	'candidate.removeTag': {
		input: AshbyEndpointInputSchemas['candidate.removeTag'],
		output: AshbyEndpointOutputSchemas['candidate.removeTag'],
	},
	'candidate.createNote': {
		input: AshbyEndpointInputSchemas['candidate.createNote'],
		output: AshbyEndpointOutputSchemas['candidate.createNote'],
	},
	'candidate.listNotes': {
		input: AshbyEndpointInputSchemas['candidate.listNotes'],
		output: AshbyEndpointOutputSchemas['candidate.listNotes'],
	},
	'candidate.anonymize': {
		input: AshbyEndpointInputSchemas['candidate.anonymize'],
		output: AshbyEndpointOutputSchemas['candidate.anonymize'],
	},
	'application.info': {
		input: AshbyEndpointInputSchemas['application.info'],
		output: AshbyEndpointOutputSchemas['application.info'],
	},
	'application.list': {
		input: AshbyEndpointInputSchemas['application.list'],
		output: AshbyEndpointOutputSchemas['application.list'],
	},
	'application.create': {
		input: AshbyEndpointInputSchemas['application.create'],
		output: AshbyEndpointOutputSchemas['application.create'],
	},
	'application.changeStage': {
		input: AshbyEndpointInputSchemas['application.changeStage'],
		output: AshbyEndpointOutputSchemas['application.changeStage'],
	},
	'application.update': {
		input: AshbyEndpointInputSchemas['application.update'],
		output: AshbyEndpointOutputSchemas['application.update'],
	},
	'application.transfer': {
		input: AshbyEndpointInputSchemas['application.transfer'],
		output: AshbyEndpointOutputSchemas['application.transfer'],
	},
	'job.info': {
		input: AshbyEndpointInputSchemas['job.info'],
		output: AshbyEndpointOutputSchemas['job.info'],
	},
	'job.list': {
		input: AshbyEndpointInputSchemas['job.list'],
		output: AshbyEndpointOutputSchemas['job.list'],
	},
	'job.create': {
		input: AshbyEndpointInputSchemas['job.create'],
		output: AshbyEndpointOutputSchemas['job.create'],
	},
	'job.update': {
		input: AshbyEndpointInputSchemas['job.update'],
		output: AshbyEndpointOutputSchemas['job.update'],
	},
	'job.search': {
		input: AshbyEndpointInputSchemas['job.search'],
		output: AshbyEndpointOutputSchemas['job.search'],
	},
	'jobPosting.info': {
		input: AshbyEndpointInputSchemas['jobPosting.info'],
		output: AshbyEndpointOutputSchemas['jobPosting.info'],
	},
	'jobPosting.list': {
		input: AshbyEndpointInputSchemas['jobPosting.list'],
		output: AshbyEndpointOutputSchemas['jobPosting.list'],
	},
	'interview.info': {
		input: AshbyEndpointInputSchemas['interview.info'],
		output: AshbyEndpointOutputSchemas['interview.info'],
	},
	'interview.list': {
		input: AshbyEndpointInputSchemas['interview.list'],
		output: AshbyEndpointOutputSchemas['interview.list'],
	},
	'interview.scheduleInfo': {
		input: AshbyEndpointInputSchemas['interview.scheduleInfo'],
		output: AshbyEndpointOutputSchemas['interview.scheduleInfo'],
	},
	'interview.scheduleList': {
		input: AshbyEndpointInputSchemas['interview.scheduleList'],
		output: AshbyEndpointOutputSchemas['interview.scheduleList'],
	},
	'interview.stageList': {
		input: AshbyEndpointInputSchemas['interview.stageList'],
		output: AshbyEndpointOutputSchemas['interview.stageList'],
	},
	'offer.info': {
		input: AshbyEndpointInputSchemas['offer.info'],
		output: AshbyEndpointOutputSchemas['offer.info'],
	},
	'offer.list': {
		input: AshbyEndpointInputSchemas['offer.list'],
		output: AshbyEndpointOutputSchemas['offer.list'],
	},
	'offer.create': {
		input: AshbyEndpointInputSchemas['offer.create'],
		output: AshbyEndpointOutputSchemas['offer.create'],
	},
	'offer.update': {
		input: AshbyEndpointInputSchemas['offer.update'],
		output: AshbyEndpointOutputSchemas['offer.update'],
	},
	'department.info': {
		input: AshbyEndpointInputSchemas['department.info'],
		output: AshbyEndpointOutputSchemas['department.info'],
	},
	'department.list': {
		input: AshbyEndpointInputSchemas['department.list'],
		output: AshbyEndpointOutputSchemas['department.list'],
	},
	'department.create': {
		input: AshbyEndpointInputSchemas['department.create'],
		output: AshbyEndpointOutputSchemas['department.create'],
	},
	'department.update': {
		input: AshbyEndpointInputSchemas['department.update'],
		output: AshbyEndpointOutputSchemas['department.update'],
	},
	'department.archive': {
		input: AshbyEndpointInputSchemas['department.archive'],
		output: AshbyEndpointOutputSchemas['department.archive'],
	},
	'location.info': {
		input: AshbyEndpointInputSchemas['location.info'],
		output: AshbyEndpointOutputSchemas['location.info'],
	},
	'location.list': {
		input: AshbyEndpointInputSchemas['location.list'],
		output: AshbyEndpointOutputSchemas['location.list'],
	},
	'location.create': {
		input: AshbyEndpointInputSchemas['location.create'],
		output: AshbyEndpointOutputSchemas['location.create'],
	},
	'location.update': {
		input: AshbyEndpointInputSchemas['location.update'],
		output: AshbyEndpointOutputSchemas['location.update'],
	},
	'location.archive': {
		input: AshbyEndpointInputSchemas['location.archive'],
		output: AshbyEndpointOutputSchemas['location.archive'],
	},
	'user.info': {
		input: AshbyEndpointInputSchemas['user.info'],
		output: AshbyEndpointOutputSchemas['user.info'],
	},
	'user.list': {
		input: AshbyEndpointInputSchemas['user.list'],
		output: AshbyEndpointOutputSchemas['user.list'],
	},
	'user.search': {
		input: AshbyEndpointInputSchemas['user.search'],
		output: AshbyEndpointOutputSchemas['user.search'],
	},
	'customField.info': {
		input: AshbyEndpointInputSchemas['customField.info'],
		output: AshbyEndpointOutputSchemas['customField.info'],
	},
	'customField.list': {
		input: AshbyEndpointInputSchemas['customField.list'],
		output: AshbyEndpointOutputSchemas['customField.list'],
	},
	'customField.setValue': {
		input: AshbyEndpointInputSchemas['customField.setValue'],
		output: AshbyEndpointOutputSchemas['customField.setValue'],
	},
	'apiKey.info': {
		input: AshbyEndpointInputSchemas['apiKey.info'],
		output: AshbyEndpointOutputSchemas['apiKey.info'],
	},
	'webhook.info': {
		input: AshbyEndpointInputSchemas['webhook.info'],
		output: AshbyEndpointOutputSchemas['webhook.info'],
	},
	'webhook.create': {
		input: AshbyEndpointInputSchemas['webhook.create'],
		output: AshbyEndpointOutputSchemas['webhook.create'],
	},
	'webhook.delete': {
		input: AshbyEndpointInputSchemas['webhook.delete'],
		output: AshbyEndpointOutputSchemas['webhook.delete'],
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof ashbyEndpointsNested>;

const ashbyWebhookSchemas = {
	'candidate.stageChange': {
		description:
			'Triggered when a candidate moves to a different interview stage',
		payload: CandidateStageChangeEventSchema,
		response: CandidateStageChangeEventSchema,
	},
	'candidate.hire': {
		description: 'Triggered when a candidate is hired',
		payload: CandidateHireEventSchema,
		response: CandidateHireEventSchema,
	},
	'application.submit': {
		description: 'Triggered when a candidate application is submitted',
		payload: ApplicationSubmitEventSchema,
		response: ApplicationSubmitEventSchema,
	},
	'application.update': {
		description: 'Triggered when an application is updated',
		payload: ApplicationUpdateEventSchema,
		response: ApplicationUpdateEventSchema,
	},
	'offer.create': {
		description: 'Triggered when a job offer is created',
		payload: OfferCreateEventSchema,
		response: OfferCreateEventSchema,
	},
	'offer.update': {
		description: 'Triggered when a job offer is updated',
		payload: OfferUpdateEventSchema,
		response: OfferUpdateEventSchema,
	},
	'offer.delete': {
		description: 'Triggered when a job offer is deleted',
		payload: OfferDeleteEventSchema,
		response: OfferDeleteEventSchema,
	},
	'interview.scheduleCreate': {
		description: 'Triggered when an interview schedule is created',
		payload: InterviewScheduleCreateEventSchema,
		response: InterviewScheduleCreateEventSchema,
	},
	'interview.scheduleUpdate': {
		description: 'Triggered when an interview schedule is updated',
		payload: InterviewScheduleUpdateEventSchema,
		response: InterviewScheduleUpdateEventSchema,
	},
	'interview.planTransition': {
		description: 'Triggered during interview plan transitions',
		payload: InterviewPlanTransitionEventSchema,
		response: InterviewPlanTransitionEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof ashbyWebhooksNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

const ashbyEndpointMeta = {
	'candidate.info': {
		riskLevel: 'read',
		description: 'Retrieve detailed candidate information by ID',
	},
	'candidate.list': {
		riskLevel: 'read',
		description:
			'List candidates with cursor-based pagination and time filters',
	},
	'candidate.search': {
		riskLevel: 'read',
		description: 'Search candidates by name, email address, or phone number',
	},
	'candidate.create': {
		riskLevel: 'write',
		description: 'Create a new candidate in Ashby',
	},
	'candidate.update': {
		riskLevel: 'write',
		description: 'Update candidate profile information and custom fields',
	},
	'candidate.addTag': {
		riskLevel: 'write',
		description: 'Add a tag to a candidate',
	},
	'candidate.removeTag': {
		riskLevel: 'write',
		description: 'Remove a tag from a candidate',
	},
	'candidate.createNote': {
		riskLevel: 'write',
		description: 'Create a note on a candidate record',
	},
	'candidate.listNotes': {
		riskLevel: 'read',
		description: 'List all notes for a specific candidate',
	},
	'candidate.anonymize': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Anonymize candidate personally identifiable data for GDPR compliance',
	},
	'application.info': {
		riskLevel: 'read',
		description: 'Retrieve details for a specific application',
	},
	'application.list': {
		riskLevel: 'read',
		description: 'List applications filtered by candidate, job, or status',
	},
	'application.create': {
		riskLevel: 'write',
		description: 'Create an application linking a candidate to a job',
	},
	'application.changeStage': {
		riskLevel: 'write',
		description: 'Move an application to a different interview stage',
	},
	'application.update': {
		riskLevel: 'write',
		description: 'Update application metadata or archive status',
	},
	'application.transfer': {
		riskLevel: 'write',
		description: 'Transfer an application to another job',
	},
	'job.info': {
		riskLevel: 'read',
		description: 'Retrieve job details by job ID',
	},
	'job.list': {
		riskLevel: 'read',
		description: 'List jobs with status, department, and location filters',
	},
	'job.create': {
		riskLevel: 'write',
		description: 'Create a new job in Ashby',
	},
	'job.update': {
		riskLevel: 'write',
		description: 'Update job details, department, or status',
	},
	'job.search': {
		riskLevel: 'read',
		description: 'Search jobs by title or status',
	},
	'jobPosting.info': {
		riskLevel: 'read',
		description: 'Retrieve job posting information by ID',
	},
	'jobPosting.list': {
		riskLevel: 'read',
		description: 'List published and unpublished job postings',
	},
	'interview.info': {
		riskLevel: 'read',
		description: 'Retrieve interview details by ID',
	},
	'interview.list': {
		riskLevel: 'read',
		description: 'List interviews for an interview plan',
	},
	'interview.scheduleInfo': {
		riskLevel: 'read',
		description: 'Retrieve details of an interview schedule',
	},
	'interview.scheduleList': {
		riskLevel: 'read',
		description: 'List scheduled interviews for an application',
	},
	'interview.stageList': {
		riskLevel: 'read',
		description: 'List interview stages for a job or interview plan',
	},
	'offer.info': {
		riskLevel: 'read',
		description: 'Retrieve details for a specific offer',
	},
	'offer.list': {
		riskLevel: 'read',
		description: 'List offers filtered by application or status',
	},
	'offer.create': {
		riskLevel: 'write',
		description: 'Create a new job offer for an application',
	},
	'offer.update': {
		riskLevel: 'write',
		description: 'Update job offer details or status',
	},
	'department.info': {
		riskLevel: 'read',
		description: 'Retrieve department details by ID',
	},
	'department.list': {
		riskLevel: 'read',
		description: 'List all departments in the organization',
	},
	'department.create': {
		riskLevel: 'write',
		description: 'Create a new department',
	},
	'department.update': {
		riskLevel: 'write',
		description: 'Update department name or parent department',
	},
	'department.archive': {
		riskLevel: 'destructive',
		description: 'Archive a department',
	},
	'location.info': {
		riskLevel: 'read',
		description: 'Retrieve location details by ID',
	},
	'location.list': {
		riskLevel: 'read',
		description: 'List all locations in the organization',
	},
	'location.create': {
		riskLevel: 'write',
		description: 'Create a new location',
	},
	'location.update': {
		riskLevel: 'write',
		description: 'Update location name or hierarchy',
	},
	'location.archive': {
		riskLevel: 'destructive',
		description: 'Archive a location',
	},
	'user.info': {
		riskLevel: 'read',
		description: 'Retrieve organization user details by ID',
	},
	'user.list': {
		riskLevel: 'read',
		description: 'List users in the organization',
	},
	'user.search': {
		riskLevel: 'read',
		description: 'Search users by name or email address',
	},
	'customField.info': {
		riskLevel: 'read',
		description: 'Retrieve custom field definition details',
	},
	'customField.list': {
		riskLevel: 'read',
		description: 'List custom field definitions filtered by object type',
	},
	'customField.setValue': {
		riskLevel: 'write',
		description:
			'Set a custom field value on a candidate, application, job, or offer',
	},
	'apiKey.info': {
		riskLevel: 'read',
		description:
			'Retrieve information and permission scopes for the current API key',
	},
	'webhook.info': {
		riskLevel: 'read',
		description: 'Retrieve webhook configuration details by ID',
	},
	'webhook.create': {
		riskLevel: 'write',
		description: 'Register a new webhook subscription in Ashby',
	},
	'webhook.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a webhook subscription',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof ashbyEndpointsNested>;

export const ashbyAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseAshbyPlugin<T extends AshbyPluginOptions> = CorsairPlugin<
	'ashby',
	typeof AshbySchema,
	typeof ashbyEndpointsNested,
	typeof ashbyWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalAshbyPlugin = BaseAshbyPlugin<AshbyPluginOptions>;

export type ExternalAshbyPlugin<T extends AshbyPluginOptions> =
	BaseAshbyPlugin<T>;

export function ashby<const T extends AshbyPluginOptions>(
	incomingOptions: AshbyPluginOptions & T = {} as AshbyPluginOptions & T,
): ExternalAshbyPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'ashby',
		authConfig: ashbyAuthConfig,
		schema: AshbySchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: ashbyEndpointsNested,
		webhooks: ashbyWebhooksNested,
		endpointMeta: ashbyEndpointMeta,
		endpointSchemas: ashbyEndpointSchemas,
		webhookSchemas: ashbyWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			for (const key of Object.keys(headers)) {
				if (key.toLowerCase() === 'ashby-signature') {
					return true;
				}
			}
			return false;
		},
		pluginTenantWebhookMatcher: matchAshbyTenantWebhook,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: AshbyKeyBuilderContext, source) => {
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
				if (!res) {
					throw new AuthMissingError('ashby', 'api_key');
				}
				return res;
			}

			throw new AuthMissingError('ashby', 'api_key');
		},
	} satisfies InternalAshbyPlugin;
}

export * from './endpoints/types';
export * from './schema';
export * from './webhooks/types';
export {
	createAshbyEventMatch,
	createAshbyMatch,
	verifyAshbyWebhookSignature,
} from './webhooks/types';
