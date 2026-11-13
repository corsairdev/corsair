import type {
	AuthTypes,
	BindEndpoints,
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
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Boards,
	Companies,
	Feedback,
	Messages,
	Sessions,
	Teams,
	Tickets,
	Users,
} from './endpoints';
import type {
	GleapEndpointInputs,
	GleapEndpointOutputs,
} from './endpoints/types';
import {
	GleapEndpointInputSchemas,
	GleapEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { GleapSchema } from './schema';

export const gleapAuthConfig = {
	api_key: {
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type GleapPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	projectId?: string;
	baseUrl?: string;
	hooks?: InternalGleapPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof gleapEndpointsNested>;
};

export type GleapContext = CorsairPluginContext<
	typeof GleapSchema,
	GleapPluginOptions,
	undefined,
	typeof gleapAuthConfig
>;

export type GleapKeyBuilderContext = KeyBuilderContext<
	GleapPluginOptions,
	typeof gleapAuthConfig
>;

export type GleapBoundEndpoints = BindEndpoints<typeof gleapEndpointsNested>;

type GleapEndpoint<K extends keyof GleapEndpointOutputs> = CorsairEndpoint<
	GleapContext,
	GleapEndpointInputs[K],
	GleapEndpointOutputs[K]
>;

export type GleapEndpoints = {
	[K in keyof GleapEndpointOutputs]: GleapEndpoint<K>;
};

const gleapEndpointsNested = {
	tickets: {
		list: Tickets.list,
		get: Tickets.get,
		create: Tickets.create,
		update: Tickets.update,
		delete: Tickets.del,
		search: Tickets.search,
		counts: Tickets.counts,
	},
	messages: {
		list: Messages.list,
		create: Messages.create,
		update: Messages.update,
		delete: Messages.del,
		getThread: Messages.getThread,
		createThread: Messages.createThread,
	},
	sessions: {
		list: Sessions.list,
		get: Sessions.get,
		getByUserId: Sessions.getByUserId,
		create: Sessions.create,
		update: Sessions.update,
		delete: Sessions.del,
		search: Sessions.search,
		activities: Sessions.activities,
	},
	users: {
		getMe: Users.getMe,
		list: Users.list,
		update: Users.update,
	},
	feedback: {
		rateConversation: Feedback.rateConversation,
		rateMessage: Feedback.rateMessage,
		surveysList: Feedback.surveysList,
		surveysGet: Feedback.surveysGet,
		surveysResponses: Feedback.surveysResponses,
		surveysStats: Feedback.surveysStats,
	},
	teams: {
		list: Teams.list,
		create: Teams.create,
		update: Teams.update,
		delete: Teams.del,
	},
	boards: {
		list: Boards.list,
		create: Boards.create,
		update: Boards.update,
		delete: Boards.del,
	},
	companies: {
		list: Companies.list,
		get: Companies.get,
		createOrUpdate: Companies.createOrUpdate,
		delete: Companies.del,
	},
} as const;

const schema = <K extends keyof typeof GleapEndpointInputSchemas>(key: K) => ({
	input: GleapEndpointInputSchemas[key],
	output: GleapEndpointOutputSchemas[key],
});

export const gleapEndpointSchemas = {
	'tickets.list': schema('ticketsList'),
	'tickets.get': schema('ticketsGet'),
	'tickets.create': schema('ticketsCreate'),
	'tickets.update': schema('ticketsUpdate'),
	'tickets.delete': schema('ticketsDelete'),
	'tickets.search': schema('ticketsSearch'),
	'tickets.counts': schema('ticketsCounts'),

	'messages.list': schema('messagesList'),
	'messages.create': schema('messagesCreate'),
	'messages.update': schema('messagesUpdate'),
	'messages.delete': schema('messagesDelete'),
	'messages.getThread': schema('messagesGetThread'),
	'messages.createThread': schema('messagesCreateThread'),

	'sessions.list': schema('sessionsList'),
	'sessions.get': schema('sessionsGet'),
	'sessions.getByUserId': schema('sessionsGetByUserId'),
	'sessions.create': schema('sessionsCreate'),
	'sessions.update': schema('sessionsUpdate'),
	'sessions.delete': schema('sessionsDelete'),
	'sessions.search': schema('sessionsSearch'),
	'sessions.activities': schema('sessionsActivities'),

	'users.getMe': schema('usersGetMe'),
	'users.list': schema('usersList'),
	'users.update': schema('usersUpdate'),

	'feedback.rateConversation': schema('feedbackRateConversation'),
	'feedback.rateMessage': schema('feedbackRateMessage'),
	'feedback.surveysList': schema('feedbackSurveysList'),
	'feedback.surveysGet': schema('feedbackSurveysGet'),
	'feedback.surveysResponses': schema('feedbackSurveysResponses'),
	'feedback.surveysStats': schema('feedbackSurveysStats'),

	'teams.list': schema('teamsList'),
	'teams.create': schema('teamsCreate'),
	'teams.update': schema('teamsUpdate'),
	'teams.delete': schema('teamsDelete'),

	'boards.list': schema('boardsList'),
	'boards.create': schema('boardsCreate'),
	'boards.update': schema('boardsUpdate'),
	'boards.delete': schema('boardsDelete'),

	'companies.list': schema('companiesList'),
	'companies.get': schema('companiesGet'),
	'companies.createOrUpdate': schema('companiesCreateOrUpdate'),
	'companies.delete': schema('companiesDelete'),
} as const satisfies RequiredPluginEndpointSchemas<typeof gleapEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const gleapEndpointMeta = {
	'tickets.list': {
		riskLevel: 'read',
		description:
			'Get all tickets in a project with support for filtering, sorting, and pagination',
	},
	'tickets.get': {
		riskLevel: 'read',
		description: 'Get a ticket in a project by its ID',
	},
	'tickets.create': {
		riskLevel: 'write',
		description: 'Create a new ticket in a project',
	},
	'tickets.update': {
		riskLevel: 'write',
		description: 'Update an existing ticket in a project',
	},
	'tickets.delete': {
		riskLevel: 'destructive',
		description:
			'Permanently delete a ticket and its associated data and replies',
	},
	'tickets.search': {
		riskLevel: 'read',
		description: 'Full-text search over project tickets and comments',
	},
	'tickets.counts': {
		riskLevel: 'read',
		description: 'Get ticket counts grouped by board and status lane',
	},

	'messages.list': {
		riskLevel: 'read',
		description: 'Find messages in a ticket with filtering and pagination',
	},
	'messages.create': {
		riskLevel: 'write',
		description: 'Create a new message or internal note in a ticket',
	},
	'messages.update': {
		riskLevel: 'write',
		description: 'Update an existing message',
	},
	'messages.delete': {
		riskLevel: 'destructive',
		description: 'Delete a message from a ticket',
	},
	'messages.getThread': {
		riskLevel: 'read',
		description: 'Get thread messages for a specific parent message',
	},
	'messages.createThread': {
		riskLevel: 'write',
		description: 'Create a thread reply for a specific message',
	},

	'sessions.list': {
		riskLevel: 'read',
		description: 'List contact sessions in a project',
	},
	'sessions.get': {
		riskLevel: 'read',
		description: 'Get contact session details by session ID',
	},
	'sessions.getByUserId': {
		riskLevel: 'read',
		description: 'Get a contact session by end-user ID',
	},
	'sessions.create': {
		riskLevel: 'write',
		description: 'Create a new contact session in a project',
	},
	'sessions.update': {
		riskLevel: 'write',
		description: 'Update a contact session',
	},
	'sessions.delete': {
		riskLevel: 'destructive',
		description: 'Delete a contact session and associated history',
	},
	'sessions.search': {
		riskLevel: 'read',
		description: 'Search for contact sessions by query attributes',
	},
	'sessions.activities': {
		riskLevel: 'read',
		description: 'Get timeline activities and events for a session',
	},

	'users.getMe': {
		riskLevel: 'read',
		description: 'Get the currently authenticated user profile',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'Get all team members who can access the project',
	},
	'users.update': {
		riskLevel: 'write',
		description: 'Update an existing team member profile',
	},

	'feedback.rateConversation': {
		riskLevel: 'write',
		description: 'Rate a support conversation with CSAT score 0 to 10',
	},
	'feedback.rateMessage': {
		riskLevel: 'write',
		description: 'Rate an AI or agent message thumbs up or thumbs down',
	},
	'feedback.surveysList': {
		riskLevel: 'read',
		description: 'Get all engagement surveys for a project',
	},
	'feedback.surveysGet': {
		riskLevel: 'read',
		description: 'Get details and schema of an engagement survey',
	},
	'feedback.surveysResponses': {
		riskLevel: 'read',
		description: 'Get submitted responses for a survey',
	},
	'feedback.surveysStats': {
		riskLevel: 'read',
		description: 'Get aggregate survey result statistics and daily counters',
	},

	'teams.list': {
		riskLevel: 'read',
		description: 'Get all teams associated with a project',
	},
	'teams.create': {
		riskLevel: 'write',
		description: 'Create a new team in a project',
	},
	'teams.update': {
		riskLevel: 'write',
		description: 'Update team configuration and assignment method',
	},
	'teams.delete': {
		riskLevel: 'destructive',
		description: 'Delete a team from a project',
	},

	'boards.list': {
		riskLevel: 'read',
		description: 'List all ticket boards (ticket types) for a project',
	},
	'boards.create': {
		riskLevel: 'write',
		description: 'Create a new ticket board with custom lanes',
	},
	'boards.update': {
		riskLevel: 'write',
		description: 'Update a board configuration',
	},
	'boards.delete': {
		riskLevel: 'destructive',
		description: 'Delete an empty ticket board',
	},

	'companies.list': {
		riskLevel: 'read',
		description: 'List tracked customer companies in a project',
	},
	'companies.get': {
		riskLevel: 'read',
		description: 'Get company details by company ID',
	},
	'companies.createOrUpdate': {
		riskLevel: 'write',
		description: 'Create or update a customer company record',
	},
	'companies.delete': {
		riskLevel: 'destructive',
		description: 'Delete a customer company record',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof gleapEndpointsNested>;

export type BaseGleapPlugin<T extends GleapPluginOptions> = CorsairPlugin<
	'gleap',
	typeof GleapSchema,
	typeof gleapEndpointsNested,
	Record<string, never>,
	T,
	typeof defaultAuthType
>;

export type InternalGleapPlugin = BaseGleapPlugin<GleapPluginOptions>;

export type ExternalGleapPlugin<T extends GleapPluginOptions> =
	BaseGleapPlugin<T>;

export function gleap<const T extends GleapPluginOptions>(
	incomingOptions: GleapPluginOptions & T = {} as GleapPluginOptions & T,
): ExternalGleapPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};

	const { DEFAULT: builtInDefault, ...builtIns } = errorHandlers;
	const { DEFAULT: callerDefault, ...callers } = options.errorHandlers ?? {};
	const ordered = {
		...callers,
		...builtIns,
		...callers,
		DEFAULT: callerDefault ?? builtInDefault,
	};

	return {
		id: 'gleap',
		authConfig: gleapAuthConfig,
		schema: GleapSchema,
		options,
		hooks: options.hooks,
		endpoints: gleapEndpointsNested,
		webhooks: {},
		endpointMeta: gleapEndpointMeta,
		endpointSchemas: gleapEndpointSchemas,
		errorHandlers: ordered,
		keyBuilder: async (
			ctx: GleapKeyBuilderContext,
			source: 'endpoint' | 'webhook',
		) => {
			if (source !== 'endpoint') return '';
			if (options.key) return options.key;
			if (!ctx.keys) throw new AuthMissingError('gleap', 'api_key');
			const apiKey = await ctx.keys.get_api_key();
			if (!apiKey) throw new AuthMissingError('gleap', 'api_key');
			return apiKey;
		},
	} satisfies InternalGleapPlugin;
}

export default gleap;

export type {
	GleapEndpointInputs,
	GleapEndpointOutputs,
	Board,
	Company,
	Message,
	Session,
	Survey,
	Team,
	Ticket,
	User,
} from './endpoints/types';
