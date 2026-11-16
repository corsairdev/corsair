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
import { Applications, Query } from './endpoints';
import type {
	NewrelicEndpointInputs,
	NewrelicEndpointOutputs,
} from './endpoints/types';
import {
	NewrelicEndpointInputSchemas,
	NewrelicEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { NewrelicSchema } from './schema';

export type NewrelicPluginOptions = {
	authType?: PickAuth<'api_key'>;
	/** A New Relic user key, from one.newrelic.com/api-keys. */
	key?: string;
	hooks?: InternalNewrelicPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof newrelicEndpointsNested>;
};

export type NewrelicContext = CorsairPluginContext<
	typeof NewrelicSchema,
	NewrelicPluginOptions
>;

export type NewrelicKeyBuilderContext =
	KeyBuilderContext<NewrelicPluginOptions>;

export type NewrelicBoundEndpoints = BindEndpoints<
	typeof newrelicEndpointsNested
>;

type NewrelicEndpoint<K extends keyof NewrelicEndpointOutputs> =
	CorsairEndpoint<
		NewrelicContext,
		NewrelicEndpointInputs[K],
		NewrelicEndpointOutputs[K]
	>;

export type NewrelicEndpoints = {
	applicationsList: NewrelicEndpoint<'applicationsList'>;
	applicationsGet: NewrelicEndpoint<'applicationsGet'>;
	metricsData: NewrelicEndpoint<'metricsData'>;
	policiesList: NewrelicEndpoint<'policiesList'>;
	policiesCreate: NewrelicEndpoint<'policiesCreate'>;
	policiesDelete: NewrelicEndpoint<'policiesDelete'>;
	conditionsList: NewrelicEndpoint<'conditionsList'>;
	queryNrql: NewrelicEndpoint<'queryNrql'>;
};

export const newrelicEndpointsNested = {
	applications: {
		list: Applications.list,
		get: Applications.get,
	},
	metrics: {
		get: Applications.data,
	},
	alerts: {
		policies: Applications.policies,
		createPolicy: Applications.createPolicy,
		deletePolicy: Applications.deletePolicy,
		conditions: Applications.conditions,
	},
	query: {
		nrql: Query.nrql,
	},
} as const;

export const newrelicEndpointSchemas = {
	'applications.list': {
		input: NewrelicEndpointInputSchemas.applicationsList,
		output: NewrelicEndpointOutputSchemas.applicationsList,
	},
	'applications.get': {
		input: NewrelicEndpointInputSchemas.applicationsGet,
		output: NewrelicEndpointOutputSchemas.applicationsGet,
	},
	'metrics.get': {
		input: NewrelicEndpointInputSchemas.metricsData,
		output: NewrelicEndpointOutputSchemas.metricsData,
	},
	'alerts.policies': {
		input: NewrelicEndpointInputSchemas.policiesList,
		output: NewrelicEndpointOutputSchemas.policiesList,
	},
	'alerts.createPolicy': {
		input: NewrelicEndpointInputSchemas.policiesCreate,
		output: NewrelicEndpointOutputSchemas.policiesCreate,
	},
	'alerts.deletePolicy': {
		input: NewrelicEndpointInputSchemas.policiesDelete,
		output: NewrelicEndpointOutputSchemas.policiesDelete,
	},
	'alerts.conditions': {
		input: NewrelicEndpointInputSchemas.conditionsList,
		output: NewrelicEndpointOutputSchemas.conditionsList,
	},
	'query.nrql': {
		input: NewrelicEndpointInputSchemas.queryNrql,
		output: NewrelicEndpointOutputSchemas.queryNrql,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof newrelicEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const newrelicEndpointMeta = {
	'applications.list': {
		riskLevel: 'read',
		description:
			'List applications with their health colour, whether they are reporting, and the summary metrics the UI shows',
	},
	'applications.get': {
		riskLevel: 'read',
		description:
			'Read one application by id with the same health, reporting and summary block',
	},
	'metrics.get': {
		riskLevel: 'read',
		description:
			'Read metric timeslices for an application over a time window, or one averaged value per metric with summarize',
	},
	'alerts.policies': {
		riskLevel: 'read',
		description: 'List alert policies with their incident rollup preference',
	},
	'alerts.createPolicy': {
		riskLevel: 'write',
		description:
			'Create an alert policy and choose whether incidents roll up per policy, per condition, or per condition and signal',
	},
	'alerts.deletePolicy': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an alert policy and the conditions attached to it; New Relic has no restore call',
	},
	'alerts.conditions': {
		riskLevel: 'read',
		description:
			'List the APM, browser and mobile conditions in one policy; external service, synthetic and NRQL conditions are separate endpoints and are not covered',
	},
	'query.nrql': {
		riskLevel: 'read',
		description:
			'Run a NRQL query against one account through NerdGraph and return its rows and the time window New Relic actually ran over',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof newrelicEndpointsNested>;

export type BaseNewrelicPlugin<T extends NewrelicPluginOptions> = CorsairPlugin<
	'newrelic',
	typeof NewrelicSchema,
	typeof newrelicEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalNewrelicPlugin = BaseNewrelicPlugin<NewrelicPluginOptions>;

export type ExternalNewrelicPlugin<T extends NewrelicPluginOptions> =
	BaseNewrelicPlugin<T>;

export function newrelic<const T extends NewrelicPluginOptions>(
	incomingOptions: NewrelicPluginOptions & T = {} as NewrelicPluginOptions & T,
): ExternalNewrelicPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'newrelic',
		schema: NewrelicSchema,
		options: options,
		hooks: options.hooks,
		endpoints: newrelicEndpointsNested,
		webhooks: {},
		endpointMeta: newrelicEndpointMeta,
		endpointSchemas: newrelicEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: NewrelicKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('newrelic', ctx.authType ?? 'api_key');
		},
	} satisfies InternalNewrelicPlugin;
}

export { NewrelicAPIError } from './client';

export type {
	ApplicationsGetInput,
	ApplicationsGetResponse,
	ApplicationsListInput,
	ApplicationsListResponse,
	ConditionsListInput,
	ConditionsListResponse,
	MetricsDataInput,
	MetricsDataResponse,
	NewrelicAlertCondition,
	NewrelicAlertPolicy,
	NewrelicApplication,
	NewrelicEndpointInputs,
	NewrelicEndpointOutputs,
	NrqlInput,
	NrqlResponse,
	PoliciesCreateInput,
	PoliciesCreateResponse,
	PoliciesDeleteInput,
	PoliciesDeleteResponse,
	PoliciesListInput,
	PoliciesListResponse,
} from './endpoints/types';
