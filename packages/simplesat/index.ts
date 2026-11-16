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
import {
	Answers,
	Customers,
	Questions,
	Responses,
	Surveys,
	TeamMembers,
} from './endpoints';
import type {
	SimplesatEndpointInputs,
	SimplesatEndpointOutputs,
} from './endpoints/types';
import {
	SimplesatEndpointInputSchemas,
	SimplesatEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { SimplesatSchema } from './schema';

export type SimplesatPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSimplesatPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof simplesatEndpointsNested>;
};

export type SimplesatContext = CorsairPluginContext<
	typeof SimplesatSchema,
	SimplesatPluginOptions,
	// The endpoints are not passed here: they reference this context through
	// SimplesatEndpoint, and passing them back would make the type circular.
	undefined
>;

export type SimplesatKeyBuilderContext =
	KeyBuilderContext<SimplesatPluginOptions>;

export type SimplesatBoundEndpoints = BindEndpoints<
	typeof simplesatEndpointsNested
>;

type SimplesatEndpoint<K extends keyof SimplesatEndpointOutputs> =
	CorsairEndpoint<
		SimplesatContext,
		SimplesatEndpointInputs[K],
		SimplesatEndpointOutputs[K]
	>;

export type SimplesatEndpoints = {
	customersList: SimplesatEndpoint<'customersList'>;
	customersGet: SimplesatEndpoint<'customersGet'>;
	customersCreate: SimplesatEndpoint<'customersCreate'>;
	customersUpdate: SimplesatEndpoint<'customersUpdate'>;
	customersBulk: SimplesatEndpoint<'customersBulk'>;
	teamMembersGet: SimplesatEndpoint<'teamMembersGet'>;
	teamMembersCreate: SimplesatEndpoint<'teamMembersCreate'>;
	surveysList: SimplesatEndpoint<'surveysList'>;
	surveysEmail: SimplesatEndpoint<'surveysEmail'>;
	questionsList: SimplesatEndpoint<'questionsList'>;
	answersSearch: SimplesatEndpoint<'answersSearch'>;
	answersGet: SimplesatEndpoint<'answersGet'>;
	answersUpdate: SimplesatEndpoint<'answersUpdate'>;
	responsesSearch: SimplesatEndpoint<'responsesSearch'>;
	responsesCreate: SimplesatEndpoint<'responsesCreate'>;
	responsesGet: SimplesatEndpoint<'responsesGet'>;
	responsesUpdate: SimplesatEndpoint<'responsesUpdate'>;
};

const simplesatEndpointsNested = {
	customers: {
		list: Customers.list,
		get: Customers.get,
		create: Customers.create,
		update: Customers.update,
		bulk: Customers.bulk,
	},
	teamMembers: {
		get: TeamMembers.get,
		create: TeamMembers.create,
	},
	surveys: {
		list: Surveys.list,
		email: Surveys.email,
	},
	questions: {
		list: Questions.list,
	},
	answers: {
		search: Answers.search,
		get: Answers.get,
		update: Answers.update,
	},
	responses: {
		search: Responses.search,
		create: Responses.create,
		get: Responses.get,
		update: Responses.update,
	},
} as const;

export const simplesatEndpointSchemas = {
	'customers.list': {
		input: SimplesatEndpointInputSchemas.customersList,
		output: SimplesatEndpointOutputSchemas.customersList,
	},
	'customers.get': {
		input: SimplesatEndpointInputSchemas.customersGet,
		output: SimplesatEndpointOutputSchemas.customersGet,
	},
	'customers.create': {
		input: SimplesatEndpointInputSchemas.customersCreate,
		output: SimplesatEndpointOutputSchemas.customersCreate,
	},
	'customers.update': {
		input: SimplesatEndpointInputSchemas.customersUpdate,
		output: SimplesatEndpointOutputSchemas.customersUpdate,
	},
	'customers.bulk': {
		input: SimplesatEndpointInputSchemas.customersBulk,
		output: SimplesatEndpointOutputSchemas.customersBulk,
	},
	'teamMembers.get': {
		input: SimplesatEndpointInputSchemas.teamMembersGet,
		output: SimplesatEndpointOutputSchemas.teamMembersGet,
	},
	'teamMembers.create': {
		input: SimplesatEndpointInputSchemas.teamMembersCreate,
		output: SimplesatEndpointOutputSchemas.teamMembersCreate,
	},
	'surveys.list': {
		input: SimplesatEndpointInputSchemas.surveysList,
		output: SimplesatEndpointOutputSchemas.surveysList,
	},
	'surveys.email': {
		input: SimplesatEndpointInputSchemas.surveysEmail,
		output: SimplesatEndpointOutputSchemas.surveysEmail,
	},
	'questions.list': {
		input: SimplesatEndpointInputSchemas.questionsList,
		output: SimplesatEndpointOutputSchemas.questionsList,
	},
	'answers.search': {
		input: SimplesatEndpointInputSchemas.answersSearch,
		output: SimplesatEndpointOutputSchemas.answersSearch,
	},
	'answers.get': {
		input: SimplesatEndpointInputSchemas.answersGet,
		output: SimplesatEndpointOutputSchemas.answersGet,
	},
	'answers.update': {
		input: SimplesatEndpointInputSchemas.answersUpdate,
		output: SimplesatEndpointOutputSchemas.answersUpdate,
	},
	'responses.search': {
		input: SimplesatEndpointInputSchemas.responsesSearch,
		output: SimplesatEndpointOutputSchemas.responsesSearch,
	},
	'responses.create': {
		input: SimplesatEndpointInputSchemas.responsesCreate,
		output: SimplesatEndpointOutputSchemas.responsesCreate,
	},
	'responses.get': {
		input: SimplesatEndpointInputSchemas.responsesGet,
		output: SimplesatEndpointOutputSchemas.responsesGet,
	},
	'responses.update': {
		input: SimplesatEndpointInputSchemas.responsesUpdate,
		output: SimplesatEndpointOutputSchemas.responsesUpdate,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof simplesatEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

export const simplesatEndpointMeta = {
	'customers.list': {
		riskLevel: 'read',
		description:
			'List customers with filters for when they were created or modified and whether they are subscribed; follow `next` for the following page',
	},
	'customers.get': {
		riskLevel: 'read',
		description:
			'Read one customer by their Simplesat id or external id, with their tags and custom attributes',
	},
	'customers.create': {
		riskLevel: 'write',
		description:
			'Create or update a customer. Simplesat matches on external_id or email, so it is an upsert rather than a plain create',
	},
	'customers.update': {
		riskLevel: 'write',
		description:
			'Update one customer by their Simplesat id or external id, replacing the fields sent',
	},
	'customers.bulk': {
		riskLevel: 'write',
		description:
			'Queue many customer upserts in one request. The answer carries a request_id rather than the stored records, because the write is queued',
	},
	'teamMembers.get': {
		riskLevel: 'read',
		description: 'Read one team member with their groups and custom attributes',
	},
	'teamMembers.create': {
		riskLevel: 'write',
		description:
			'Create or update a team member, which is how a response is attributed to the person who handled it',
	},
	'surveys.list': {
		riskLevel: 'read',
		description:
			'List the surveys on the account with their metric, type and survey_token',
	},
	'surveys.email': {
		riskLevel: 'destructive',
		description:
			'Send a survey to one customer by email. This notifies a real person, and the survey is identified by its token',
	},
	'questions.list': {
		riskLevel: 'read',
		description:
			'List the questions behind the surveys, filtered by survey or metric, with their types and choices',
	},
	'answers.search': {
		riskLevel: 'read',
		description:
			'Search answers by date range and filters such as sentiment, across every survey',
	},
	'answers.get': {
		riskLevel: 'read',
		description:
			'Read one answer with its question, chosen option, sentiment and comment',
	},
	'answers.update': {
		riskLevel: 'write',
		description:
			"Change an answer's chosen option, comment or sentiment. The question and survey it belongs to are fixed",
	},
	'responses.search': {
		riskLevel: 'read',
		description:
			"Search responses by date range and filters such as customer email, with each response's answers and team members",
	},
	'responses.create': {
		riskLevel: 'write',
		description:
			'Create a response, or update the one that already matches it. `created` backdates it, which is how a survey answered elsewhere is imported',
	},
	'responses.get': {
		riskLevel: 'read',
		description:
			'Read one response with its survey, customer, answers and team members',
	},
	'responses.update': {
		riskLevel: 'write',
		description:
			'Update one response by id. The body takes the same shape as a create, so the whole response is sent back',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof simplesatEndpointsNested
>;

export type BaseSimplesatPlugin<T extends SimplesatPluginOptions> =
	CorsairPlugin<
		'simplesat',
		typeof SimplesatSchema,
		typeof simplesatEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalSimplesatPlugin =
	BaseSimplesatPlugin<SimplesatPluginOptions>;

export type ExternalSimplesatPlugin<T extends SimplesatPluginOptions> =
	BaseSimplesatPlugin<T>;

export function simplesat<const T extends SimplesatPluginOptions>(
	incomingOptions: SimplesatPluginOptions & T = {} as SimplesatPluginOptions &
		T,
): ExternalSimplesatPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'simplesat',
		schema: SimplesatSchema,
		options: options,
		hooks: options.hooks,
		endpoints: simplesatEndpointsNested,
		webhooks: {},
		endpointMeta: simplesatEndpointMeta,
		endpointSchemas: simplesatEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: SimplesatKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('simplesat', ctx.authType ?? 'api_key');
		},
	} satisfies InternalSimplesatPlugin;
}

export type {
	AnswersSearchInput,
	CustomersBulkInput,
	CustomersCreateInput,
	ResponsesCreateInput,
	ResponsesSearchInput,
	SimplesatAnswer,
	SimplesatCustomer,
	SimplesatEndpointInputs,
	SimplesatEndpointOutputs,
	SimplesatPage,
	SimplesatQuestion,
	SimplesatResponse,
	SimplesatSurvey,
	SimplesatTeamMember,
} from './endpoints/types';
