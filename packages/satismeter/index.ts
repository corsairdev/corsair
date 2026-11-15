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
import { Projects, Responses, Surveys, Users } from './endpoints';
import type {
	SatisMeterEndpointInputs,
	SatisMeterEndpointOutputs,
} from './endpoints/types';
import {
	SatisMeterEndpointInputSchemas,
	SatisMeterEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { SatisMeterSchema } from './schema';

export type SatisMeterPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalSatisMeterPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof satisMeterEndpointsNested>;
};

export type SatisMeterContext = CorsairPluginContext<
	typeof SatisMeterSchema,
	SatisMeterPluginOptions
>;

export type SatisMeterKeyBuilderContext =
	KeyBuilderContext<SatisMeterPluginOptions>;

export type SatisMeterBoundEndpoints = BindEndpoints<
	typeof satisMeterEndpointsNested
>;

type SatisMeterEndpoint<K extends keyof SatisMeterEndpointOutputs> =
	CorsairEndpoint<
		SatisMeterContext,
		SatisMeterEndpointInputs[K],
		SatisMeterEndpointOutputs[K]
	>;

export type SatisMeterEndpoints = {
	projectsGet: SatisMeterEndpoint<'projectsGet'>;
	surveysList: SatisMeterEndpoint<'surveysList'>;
	surveysGet: SatisMeterEndpoint<'surveysGet'>;
	responsesList: SatisMeterEndpoint<'responsesList'>;
	surveyResponsesList: SatisMeterEndpoint<'surveyResponsesList'>;
	statisticsGet: SatisMeterEndpoint<'statisticsGet'>;
	usersUpsert: SatisMeterEndpoint<'usersUpsert'>;
	usersTrack: SatisMeterEndpoint<'usersTrack'>;
	usersList: SatisMeterEndpoint<'usersList'>;
	usersRemove: SatisMeterEndpoint<'usersRemove'>;
};

const satisMeterEndpointsNested = {
	projects: {
		get: Projects.getProject,
	},
	surveys: {
		list: Surveys.list,
		get: Surveys.get,
		statistics: Surveys.statistics,
	},
	responses: {
		list: Responses.list,
		listForSurvey: Responses.listForSurvey,
	},
	users: {
		upsert: Users.upsert,
		track: Users.track,
		list: Users.list,
		remove: Users.remove,
	},
} as const;

export const satisMeterEndpointSchemas = {
	'projects.get': {
		input: SatisMeterEndpointInputSchemas.projectsGet,
		output: SatisMeterEndpointOutputSchemas.projectsGet,
	},
	'surveys.list': {
		input: SatisMeterEndpointInputSchemas.surveysList,
		output: SatisMeterEndpointOutputSchemas.surveysList,
	},
	'surveys.get': {
		input: SatisMeterEndpointInputSchemas.surveysGet,
		output: SatisMeterEndpointOutputSchemas.surveysGet,
	},
	'surveys.statistics': {
		input: SatisMeterEndpointInputSchemas.statisticsGet,
		output: SatisMeterEndpointOutputSchemas.statisticsGet,
	},
	'responses.list': {
		input: SatisMeterEndpointInputSchemas.responsesList,
		output: SatisMeterEndpointOutputSchemas.responsesList,
	},
	'responses.listForSurvey': {
		input: SatisMeterEndpointInputSchemas.surveyResponsesList,
		output: SatisMeterEndpointOutputSchemas.surveyResponsesList,
	},
	'users.upsert': {
		input: SatisMeterEndpointInputSchemas.usersUpsert,
		output: SatisMeterEndpointOutputSchemas.usersUpsert,
	},
	'users.track': {
		input: SatisMeterEndpointInputSchemas.usersTrack,
		output: SatisMeterEndpointOutputSchemas.usersTrack,
	},
	'users.list': {
		input: SatisMeterEndpointInputSchemas.usersList,
		output: SatisMeterEndpointOutputSchemas.usersList,
	},
	'users.remove': {
		input: SatisMeterEndpointInputSchemas.usersRemove,
		output: SatisMeterEndpointOutputSchemas.usersRemove,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof satisMeterEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

/**
 * The six reads change nothing at SatisMeter. The four users operations do:
 * `upsert` writes user traits, `track` records an event, and `remove` deletes a
 * user's personal data and anonymises their responses. `remove` is marked
 * irreversible because the provider keeps no way back from it — the responses
 * survive but are no longer tied to a person.
 */
const satisMeterEndpointMeta = {
	'projects.get': {
		riskLevel: 'read',
		description: 'Read one project by ID',
	},
	'surveys.list': {
		riskLevel: 'read',
		description: 'List the surveys in a project with their template and state',
	},
	'surveys.get': {
		riskLevel: 'read',
		description: 'Read one survey by ID',
	},
	'surveys.statistics': {
		riskLevel: 'read',
		description:
			'Read response counts, display counts and the metric per question for one survey',
	},
	'responses.list': {
		riskLevel: 'read',
		description:
			'List responses from every survey in a project, paged by cursor',
	},
	'responses.listForSurvey': {
		riskLevel: 'read',
		description: 'List one survey\u2019s responses, paged by cursor',
	},
	'users.upsert': {
		riskLevel: 'write',
		description:
			'Create or update a user and their traits, and optionally set the date they next see a survey',
	},
	'users.track': {
		riskLevel: 'write',
		description:
			'Record a user event that survey targeting can match on; each call counts once',
	},
	'users.list': {
		riskLevel: 'read',
		description: 'List the users in a project, or look one up by userId',
	},
	'users.remove': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a user\u2019s personal data by internal id; their responses are anonymised, not deleted',
	},
} as const satisfies RequiredPluginEndpointMeta<
	typeof satisMeterEndpointsNested
>;

export type BaseSatisMeterPlugin<T extends SatisMeterPluginOptions> =
	CorsairPlugin<
		'satismeter',
		typeof SatisMeterSchema,
		typeof satisMeterEndpointsNested,
		{},
		T,
		typeof defaultAuthType
	>;

export type InternalSatisMeterPlugin =
	BaseSatisMeterPlugin<SatisMeterPluginOptions>;

export type ExternalSatisMeterPlugin<T extends SatisMeterPluginOptions> =
	BaseSatisMeterPlugin<T>;

export function satismeter<const T extends SatisMeterPluginOptions>(
	incomingOptions: SatisMeterPluginOptions & T = {} as SatisMeterPluginOptions &
		T,
): ExternalSatisMeterPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'satismeter',
		schema: SatisMeterSchema,
		options: options,
		hooks: options.hooks,
		endpoints: satisMeterEndpointsNested,
		webhooks: {},
		endpointMeta: satisMeterEndpointMeta,
		endpointSchemas: satisMeterEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: SatisMeterKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('satismeter', ctx.authType ?? 'api_key');
		},
	} satisfies InternalSatisMeterPlugin;
}

export { SatisMeterAPIError } from './client';

export type {
	ProjectsGetInput,
	ProjectsGetResponse,
	ResponsesListInput,
	ResponsesPageResponse,
	SatisMeterAnswer,
	SatisMeterEndpointInputs,
	SatisMeterEndpointOutputs,
	SatisMeterProject,
	SatisMeterResponse,
	SatisMeterSurvey,
	SatisMeterUser,
	StatisticsGetInput,
	StatisticsGetResponse,
	SurveyResponsesListInput,
	SurveysGetInput,
	SurveysGetResponse,
	SurveysListInput,
	SurveysListResponse,
	UsersListInput,
	UsersListResponse,
	UsersRemoveInput,
	UsersRemoveResponse,
	UsersTrackInput,
	UsersTrackResponse,
	UsersUpsertInput,
	UsersUpsertResponse,
} from './endpoints/types';
