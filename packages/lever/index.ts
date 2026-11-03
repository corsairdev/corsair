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
import {
	addOpportunityLinks,
	addOpportunitySources,
	addOpportunityTags,
	applyToPosting,
	createInterview,
	createNote,
	createOpportunity,
	createPosting,
	deleteInterview,
	deleteNote,
	listApplications,
	listArchiveReasons,
	listDeletedApplications,
	listDeletedOpportunities,
	listDeletedPostings,
	listInterviews,
	listNotes,
	listOpportunities,
	listOpportunityFileActions,
	listPostings,
	listPostingUsers,
	listStages,
	removeOpportunityLinks,
	removeOpportunitySources,
	removeOpportunityTags,
	retrieveApplication,
	retrieveArchiveReason,
	retrieveInterview,
	retrieveNote,
	retrieveOpportunity,
	retrievePosting,
	retrievePostingApplicationQuestions,
	retrieveStage,
	updateInterview,
	updateNote,
	updateOpportunityArchivedState,
	updateOpportunityStage,
	updatePosting,
} from './endpoints';
import type {
	LeverEndpointInputs,
	LeverEndpointOutputs,
} from './endpoints/types';
import {
	LeverEndpointInputSchemas,
	LeverEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { LeverSchema } from './schema';
import { ExampleWebhooks } from './webhooks';
import { resolveLeverOAuthWebhookTenantLink } from './webhooks/oauth-tenant-link';
import { matchLeverTenantWebhook } from './webhooks/tenant-matcher';
import type { ExampleEvent, LeverWebhookOutputs } from './webhooks/types';
import { ExampleEventSchema } from './webhooks/types';

export type LeverPluginOptions = {
	authType?: PickAuth<'api_key' | 'oauth_2'>;
	key?: string;
	webhookSecret?: string;
	hooks?: InternalLeverPlugin['hooks'];
	webhookHooks?: InternalLeverPlugin['webhookHooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof leverEndpointsNested>;
};

export type LeverContext = CorsairPluginContext<
	typeof LeverSchema,
	LeverPluginOptions
>;

export type LeverKeyBuilderContext = KeyBuilderContext<LeverPluginOptions>;

export type LeverBoundEndpoints = BindEndpoints<typeof leverEndpointsNested>;

type LeverEndpoint<K extends keyof LeverEndpointOutputs> = CorsairEndpoint<
	LeverContext,
	LeverEndpointInputs[K],
	LeverEndpointOutputs[K]
>;

export type LeverEndpoints = {
	listOpportunities: LeverEndpoint<'listOpportunities'>;
	retrieveOpportunity: LeverEndpoint<'retrieveOpportunity'>;
	listDeletedOpportunities: LeverEndpoint<'listDeletedOpportunities'>;
	listOpportunityFileActions: LeverEndpoint<'listOpportunityFileActions'>;
	createOpportunity: LeverEndpoint<'createOpportunity'>;
	updateOpportunityStage: LeverEndpoint<'updateOpportunityStage'>;
	updateOpportunityArchivedState: LeverEndpoint<'updateOpportunityArchivedState'>;
	addOpportunityLinks: LeverEndpoint<'addOpportunityLinks'>;
	removeOpportunityLinks: LeverEndpoint<'removeOpportunityLinks'>;
	addOpportunityTags: LeverEndpoint<'addOpportunityTags'>;
	removeOpportunityTags: LeverEndpoint<'removeOpportunityTags'>;
	addOpportunitySources: LeverEndpoint<'addOpportunitySources'>;
	removeOpportunitySources: LeverEndpoint<'removeOpportunitySources'>;
	listApplications: LeverEndpoint<'listApplications'>;
	retrieveApplication: LeverEndpoint<'retrieveApplication'>;
	listDeletedApplications: LeverEndpoint<'listDeletedApplications'>;
	listPostings: LeverEndpoint<'listPostings'>;
	retrievePosting: LeverEndpoint<'retrievePosting'>;
	listDeletedPostings: LeverEndpoint<'listDeletedPostings'>;
	createPosting: LeverEndpoint<'createPosting'>;
	updatePosting: LeverEndpoint<'updatePosting'>;
	retrievePostingApplicationQuestions: LeverEndpoint<'retrievePostingApplicationQuestions'>;
	listPostingUsers: LeverEndpoint<'listPostingUsers'>;
	applyToPosting: LeverEndpoint<'applyToPosting'>;
	listInterviews: LeverEndpoint<'listInterviews'>;
	retrieveInterview: LeverEndpoint<'retrieveInterview'>;
	createInterview: LeverEndpoint<'createInterview'>;
	updateInterview: LeverEndpoint<'updateInterview'>;
	deleteInterview: LeverEndpoint<'deleteInterview'>;
	listNotes: LeverEndpoint<'listNotes'>;
	retrieveNote: LeverEndpoint<'retrieveNote'>;
	createNote: LeverEndpoint<'createNote'>;
	updateNote: LeverEndpoint<'updateNote'>;
	deleteNote: LeverEndpoint<'deleteNote'>;
	listArchiveReasons: LeverEndpoint<'listArchiveReasons'>;
	retrieveArchiveReason: LeverEndpoint<'retrieveArchiveReason'>;
	listStages: LeverEndpoint<'listStages'>;
	retrieveStage: LeverEndpoint<'retrieveStage'>;
};

type LeverWebhook<K extends keyof LeverWebhookOutputs, TEvent> = CorsairWebhook<
	LeverContext,
	TEvent,
	LeverWebhookOutputs[K]
>;

export type LeverWebhooks = {
	example: LeverWebhook<'example', ExampleEvent>;
};

export type LeverBoundWebhooks = BindWebhooks<LeverWebhooks>;

const leverEndpointsNested = {
	opportunities: {
		list: listOpportunities,
		retrieve: retrieveOpportunity,
		listDeleted: listDeletedOpportunities,
		listFileActions: listOpportunityFileActions,
		create: createOpportunity,
		updateStage: updateOpportunityStage,
		updateArchivedState: updateOpportunityArchivedState,
		addLinks: addOpportunityLinks,
		removeLinks: removeOpportunityLinks,
		addTags: addOpportunityTags,
		removeTags: removeOpportunityTags,
		addSources: addOpportunitySources,
		removeSources: removeOpportunitySources,
	},
	applications: {
		list: listApplications,
		retrieve: retrieveApplication,
		listDeleted: listDeletedApplications,
	},
	postings: {
		list: listPostings,
		retrieve: retrievePosting,
		listDeleted: listDeletedPostings,
		create: createPosting,
		update: updatePosting,
		retrieveApplicationQuestions: retrievePostingApplicationQuestions,
		listUsers: listPostingUsers,
		apply: applyToPosting,
	},
	interviews: {
		list: listInterviews,
		retrieve: retrieveInterview,
		create: createInterview,
		update: updateInterview,
		delete: deleteInterview,
	},
	notes: {
		list: listNotes,
		retrieve: retrieveNote,
		create: createNote,
		update: updateNote,
		delete: deleteNote,
	},
	archiveReasons: {
		list: listArchiveReasons,
		retrieve: retrieveArchiveReason,
	},
	stages: {
		list: listStages,
		retrieve: retrieveStage,
	},
} as const;

const leverWebhooksNested = {
	example: {
		example: ExampleWebhooks.example,
	},
} as const;

export const leverEndpointSchemas: RequiredPluginEndpointSchemas<
	typeof leverEndpointsNested
> = {
	'opportunities.list': {
		input: LeverEndpointInputSchemas.listOpportunities,
		output: LeverEndpointOutputSchemas.listOpportunities,
	},
	'opportunities.retrieve': {
		input: LeverEndpointInputSchemas.retrieveOpportunity,
		output: LeverEndpointOutputSchemas.retrieveOpportunity,
	},
	'opportunities.listDeleted': {
		input: LeverEndpointInputSchemas.listDeletedOpportunities,
		output: LeverEndpointOutputSchemas.listDeletedOpportunities,
	},
	'opportunities.listFileActions': {
		input: LeverEndpointInputSchemas.listOpportunityFileActions,
		output: LeverEndpointOutputSchemas.listOpportunityFileActions,
	},
	'opportunities.create': {
		input: LeverEndpointInputSchemas.createOpportunity,
		output: LeverEndpointOutputSchemas.createOpportunity,
	},
	'opportunities.updateStage': {
		input: LeverEndpointInputSchemas.updateOpportunityStage,
		output: LeverEndpointOutputSchemas.updateOpportunityStage,
	},
	'opportunities.updateArchivedState': {
		input: LeverEndpointInputSchemas.updateOpportunityArchivedState,
		output: LeverEndpointOutputSchemas.updateOpportunityArchivedState,
	},
	'opportunities.addLinks': {
		input: LeverEndpointInputSchemas.addOpportunityLinks,
		output: LeverEndpointOutputSchemas.addOpportunityLinks,
	},
	'opportunities.removeLinks': {
		input: LeverEndpointInputSchemas.removeOpportunityLinks,
		output: LeverEndpointOutputSchemas.removeOpportunityLinks,
	},
	'opportunities.addTags': {
		input: LeverEndpointInputSchemas.addOpportunityTags,
		output: LeverEndpointOutputSchemas.addOpportunityTags,
	},
	'opportunities.removeTags': {
		input: LeverEndpointInputSchemas.removeOpportunityTags,
		output: LeverEndpointOutputSchemas.removeOpportunityTags,
	},
	'opportunities.addSources': {
		input: LeverEndpointInputSchemas.addOpportunitySources,
		output: LeverEndpointOutputSchemas.addOpportunitySources,
	},
	'opportunities.removeSources': {
		input: LeverEndpointInputSchemas.removeOpportunitySources,
		output: LeverEndpointOutputSchemas.removeOpportunitySources,
	},
	'applications.list': {
		input: LeverEndpointInputSchemas.listApplications,
		output: LeverEndpointOutputSchemas.listApplications,
	},
	'applications.retrieve': {
		input: LeverEndpointInputSchemas.retrieveApplication,
		output: LeverEndpointOutputSchemas.retrieveApplication,
	},
	'applications.listDeleted': {
		input: LeverEndpointInputSchemas.listDeletedApplications,
		output: LeverEndpointOutputSchemas.listDeletedApplications,
	},
	'postings.list': {
		input: LeverEndpointInputSchemas.listPostings,
		output: LeverEndpointOutputSchemas.listPostings,
	},
	'postings.retrieve': {
		input: LeverEndpointInputSchemas.retrievePosting,
		output: LeverEndpointOutputSchemas.retrievePosting,
	},
	'postings.listDeleted': {
		input: LeverEndpointInputSchemas.listDeletedPostings,
		output: LeverEndpointOutputSchemas.listDeletedPostings,
	},
	'postings.create': {
		input: LeverEndpointInputSchemas.createPosting,
		output: LeverEndpointOutputSchemas.createPosting,
	},
	'postings.update': {
		input: LeverEndpointInputSchemas.updatePosting,
		output: LeverEndpointOutputSchemas.updatePosting,
	},
	'postings.retrieveApplicationQuestions': {
		input: LeverEndpointInputSchemas.retrievePostingApplicationQuestions,
		output: LeverEndpointOutputSchemas.retrievePostingApplicationQuestions,
	},
	'postings.listUsers': {
		input: LeverEndpointInputSchemas.listPostingUsers,
		output: LeverEndpointOutputSchemas.listPostingUsers,
	},
	'postings.apply': {
		input: LeverEndpointInputSchemas.applyToPosting,
		output: LeverEndpointOutputSchemas.applyToPosting,
	},
	'interviews.list': {
		input: LeverEndpointInputSchemas.listInterviews,
		output: LeverEndpointOutputSchemas.listInterviews,
	},
	'interviews.retrieve': {
		input: LeverEndpointInputSchemas.retrieveInterview,
		output: LeverEndpointOutputSchemas.retrieveInterview,
	},
	'interviews.create': {
		input: LeverEndpointInputSchemas.createInterview,
		output: LeverEndpointOutputSchemas.createInterview,
	},
	'interviews.update': {
		input: LeverEndpointInputSchemas.updateInterview,
		output: LeverEndpointOutputSchemas.updateInterview,
	},
	'interviews.delete': {
		input: LeverEndpointInputSchemas.deleteInterview,
		output: LeverEndpointOutputSchemas.deleteInterview,
	},
	'notes.list': {
		input: LeverEndpointInputSchemas.listNotes,
		output: LeverEndpointOutputSchemas.listNotes,
	},
	'notes.retrieve': {
		input: LeverEndpointInputSchemas.retrieveNote,
		output: LeverEndpointOutputSchemas.retrieveNote,
	},
	'notes.create': {
		input: LeverEndpointInputSchemas.createNote,
		output: LeverEndpointOutputSchemas.createNote,
	},
	'notes.update': {
		input: LeverEndpointInputSchemas.updateNote,
		output: LeverEndpointOutputSchemas.updateNote,
	},
	'notes.delete': {
		input: LeverEndpointInputSchemas.deleteNote,
		output: LeverEndpointOutputSchemas.deleteNote,
	},
	'archiveReasons.list': {
		input: LeverEndpointInputSchemas.listArchiveReasons,
		output: LeverEndpointOutputSchemas.listArchiveReasons,
	},
	'archiveReasons.retrieve': {
		input: LeverEndpointInputSchemas.retrieveArchiveReason,
		output: LeverEndpointOutputSchemas.retrieveArchiveReason,
	},
	'stages.list': {
		input: LeverEndpointInputSchemas.listStages,
		output: LeverEndpointOutputSchemas.listStages,
	},
	'stages.retrieve': {
		input: LeverEndpointInputSchemas.retrieveStage,
		output: LeverEndpointOutputSchemas.retrieveStage,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof leverEndpointsNested>;

const leverWebhookSchemas = {
	'example.example': {
		description: 'An example webhook event',
		payload: ExampleEventSchema,
		response: ExampleEventSchema,
	},
} as const satisfies RequiredPluginWebhookSchemas<typeof leverWebhooksNested>;

type LeverEndpointTree = Record<string, unknown>;
// unknown: wrappers receive core context/input before Zod parsing and re-parse output.
type LeverEndpointHandler = (ctx: unknown, input: unknown) => Promise<unknown>;

/**
 * Binds every Lever endpoint to its declared input and output schemas. Calls
 * use this validated tree at runtime; the schemas registry stays as
 * introspection metadata.
 */
function withLeverSchemas<T extends LeverEndpointTree>(
	tree: T,
	prefix = '',
): T {
	const validatedEntries = Object.entries(tree).map(([key, value]) => {
		const operation = prefix ? `${prefix}.${key}` : key;
		if (typeof value === 'function') {
			const schema =
				leverEndpointSchemas[operation as keyof typeof leverEndpointSchemas];
			if (!schema) {
				throw new Error(`Missing Lever endpoint schema for ${operation}`);
			}
			const endpoint = value as LeverEndpointHandler;
			const validated: LeverEndpointHandler = async (ctx, input) => {
				const parsedInput = schema.input.parse(input ?? {});
				const result = await endpoint(ctx, parsedInput);
				return schema.output.parse(result);
			};
			return [key, validated];
		}
		if (value && typeof value === 'object') {
			return [key, withLeverSchemas(value as LeverEndpointTree, operation)];
		}
		return [key, value];
	});
	return Object.fromEntries(validatedEntries) as T;
}

const validatedLeverEndpointsNested = withLeverSchemas(leverEndpointsNested);

const defaultAuthType: AuthTypes = 'api_key' as const;

const leverEndpointMeta = {
	'opportunities.list': {
		riskLevel: 'read',
		description: 'List pipeline opportunities with filters and pagination',
	},
	'opportunities.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single pipeline opportunity by ID',
	},
	'opportunities.listDeleted': {
		riskLevel: 'read',
		description: 'List deleted pipeline opportunities',
	},
	'opportunities.listFileActions': {
		riskLevel: 'read',
		description: 'List file actions recorded for a pipeline opportunity',
	},
	'opportunities.create': {
		riskLevel: 'write',
		description: 'Create a pipeline opportunity for a candidate profile',
	},
	'opportunities.updateStage': {
		riskLevel: 'write',
		description: 'Move a pipeline opportunity to a different hiring stage',
	},
	'opportunities.updateArchivedState': {
		riskLevel: 'write',
		description: 'Archive or unarchive a pipeline opportunity',
	},
	'opportunities.addLinks': {
		riskLevel: 'write',
		description: 'Link contacts to a pipeline opportunity',
	},
	'opportunities.removeLinks': {
		riskLevel: 'write',
		description: 'Remove contact links from a pipeline opportunity',
	},
	'opportunities.addTags': {
		riskLevel: 'write',
		description: 'Add tags to a pipeline opportunity',
	},
	'opportunities.removeTags': {
		riskLevel: 'write',
		description: 'Remove tags from a pipeline opportunity',
	},
	'opportunities.addSources': {
		riskLevel: 'write',
		description: 'Add sourcing sources to a pipeline opportunity',
	},
	'opportunities.removeSources': {
		riskLevel: 'write',
		description: 'Remove sourcing sources from a pipeline opportunity',
	},
	'applications.list': {
		riskLevel: 'read',
		description: 'List applications belonging to a pipeline opportunity',
	},
	'applications.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single application of a pipeline opportunity',
	},
	'applications.listDeleted': {
		riskLevel: 'read',
		description: 'List deleted applications',
	},
	'postings.list': {
		riskLevel: 'read',
		description: 'List job postings',
	},
	'postings.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single job posting by ID',
	},
	'postings.listDeleted': {
		riskLevel: 'read',
		description: 'List deleted job postings',
	},
	'postings.create': {
		riskLevel: 'write',
		description: 'Create a job posting',
	},
	'postings.update': {
		riskLevel: 'write',
		description: 'Update an existing job posting',
	},
	'postings.retrieveApplicationQuestions': {
		riskLevel: 'read',
		description: 'Retrieve the application questions configured for a posting',
	},
	'postings.listUsers': {
		riskLevel: 'read',
		description: 'List users with access to a job posting',
	},
	'postings.apply': {
		riskLevel: 'write',
		description: 'Submit an application to a job posting',
	},
	'interviews.list': {
		riskLevel: 'read',
		description: 'List interviews scheduled for a pipeline opportunity',
	},
	'interviews.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single interview by ID',
	},
	'interviews.create': {
		riskLevel: 'write',
		description: 'Schedule an interview for a pipeline opportunity',
	},
	'interviews.update': {
		riskLevel: 'write',
		description: 'Update a scheduled interview',
	},
	'interviews.delete': {
		riskLevel: 'destructive',
		description: 'Delete a scheduled interview',
	},
	'notes.list': {
		riskLevel: 'read',
		description: 'List notes on a pipeline opportunity',
	},
	'notes.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single note on a pipeline opportunity',
	},
	'notes.create': {
		riskLevel: 'write',
		description: 'Add a note to a pipeline opportunity',
	},
	'notes.update': {
		riskLevel: 'write',
		description: 'Update a note on a pipeline opportunity',
	},
	'notes.delete': {
		riskLevel: 'destructive',
		description: 'Delete a note from a pipeline opportunity',
	},
	'archiveReasons.list': {
		riskLevel: 'read',
		description: 'List archive reasons configured for the workspace',
	},
	'archiveReasons.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single archive reason by ID',
	},
	'stages.list': {
		riskLevel: 'read',
		description: 'List hiring stages configured for the workspace',
	},
	'stages.retrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single hiring stage by ID',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof leverEndpointsNested>;

export const leverAuthConfig = {
	api_key: {
		account: ['tenant_external_id'] as const,
	},
	oauth_2: {
		account: ['tenant_external_id'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseLeverPlugin<T extends LeverPluginOptions> = CorsairPlugin<
	'lever',
	typeof LeverSchema,
	typeof leverEndpointsNested,
	typeof leverWebhooksNested,
	T,
	typeof defaultAuthType
>;

export type InternalLeverPlugin = BaseLeverPlugin<LeverPluginOptions>;

export type ExternalLeverPlugin<T extends LeverPluginOptions> =
	BaseLeverPlugin<T>;

export function lever<const T extends LeverPluginOptions>(
	incomingOptions: LeverPluginOptions & T = {} as LeverPluginOptions & T,
): ExternalLeverPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'lever',
		authConfig: leverAuthConfig,
		schema: LeverSchema,
		options: options,
		hooks: options.hooks,
		webhookHooks: options.webhookHooks,
		endpoints: validatedLeverEndpointsNested,
		webhooks: leverWebhooksNested,
		endpointMeta: leverEndpointMeta,
		endpointSchemas: leverEndpointSchemas,
		webhookSchemas: leverWebhookSchemas,
		pluginWebhookMatcher: (request) => {
			const headers = request.headers;
			// Lever signs webhook payloads with a signature header; refined with
			// the webhook family in a later part.
			return 'x-lever-signature' in headers;
		},
		pluginTenantWebhookMatcher: matchLeverTenantWebhook,
		oauthWebhookTenantLinkResolver: resolveLeverOAuthWebhookTenantLink,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: LeverKeyBuilderContext, source) => {
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
				return res ?? '';
			}

			if (source === 'endpoint' && ctx.authType === 'oauth_2') {
				const res = await ctx.keys.get_access_token();
				return res ?? '';
			}

			return '';
		},
	} satisfies InternalLeverPlugin;
}

export type {
	LeverEndpointInputs,
	LeverEndpointOutputs,
} from './endpoints/types';
export type {
	ExampleEvent,
	LeverWebhookOutputs,
} from './webhooks/types';
