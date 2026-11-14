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
	Changes,
	Locations,
	Schemas,
	Triggers,
	Variables,
	Workflows,
} from './endpoints';
import type {
	KadoaEndpointInputs,
	KadoaEndpointOutputs,
} from './endpoints/types';
import {
	KadoaEndpointInputSchemas,
	KadoaEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { KadoaSchema } from './schema';

export type KadoaPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalKadoaPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof kadoaEndpointsNested>;
};

export type KadoaContext = CorsairPluginContext<
	typeof KadoaSchema,
	KadoaPluginOptions
>;

export type KadoaKeyBuilderContext = KeyBuilderContext<KadoaPluginOptions>;

export type KadoaBoundEndpoints = BindEndpoints<typeof kadoaEndpointsNested>;

type KadoaEndpoint<K extends keyof KadoaEndpointOutputs> = CorsairEndpoint<
	KadoaContext,
	KadoaEndpointInputs[K],
	KadoaEndpointOutputs[K]
>;

export type KadoaEndpoints = {
	workflowsList: KadoaEndpoint<'workflowsList'>;
	workflowsGet: KadoaEndpoint<'workflowsGet'>;
	workflowsCreate: KadoaEndpoint<'workflowsCreate'>;
	workflowsUpdateMetadata: KadoaEndpoint<'workflowsUpdateMetadata'>;
	workflowsRemove: KadoaEndpoint<'workflowsRemove'>;
	workflowsRun: KadoaEndpoint<'workflowsRun'>;
	workflowsPause: KadoaEndpoint<'workflowsPause'>;
	workflowsResume: KadoaEndpoint<'workflowsResume'>;
	workflowsStop: KadoaEndpoint<'workflowsStop'>;
	workflowsSchedule: KadoaEndpoint<'workflowsSchedule'>;
	workflowsHistory: KadoaEndpoint<'workflowsHistory'>;
	workflowsData: KadoaEndpoint<'workflowsData'>;
	workflowsJobStatus: KadoaEndpoint<'workflowsJobStatus'>;
	workflowsConnectors: KadoaEndpoint<'workflowsConnectors'>;
	schemasList: KadoaEndpoint<'schemasList'>;
	schemasGet: KadoaEndpoint<'schemasGet'>;
	schemasCreate: KadoaEndpoint<'schemasCreate'>;
	schemasUpdate: KadoaEndpoint<'schemasUpdate'>;
	schemasRemove: KadoaEndpoint<'schemasRemove'>;
	changesList: KadoaEndpoint<'changesList'>;
	changesGet: KadoaEndpoint<'changesGet'>;
	variablesList: KadoaEndpoint<'variablesList'>;
	variablesGet: KadoaEndpoint<'variablesGet'>;
	variablesCreate: KadoaEndpoint<'variablesCreate'>;
	variablesUpdate: KadoaEndpoint<'variablesUpdate'>;
	variablesRemove: KadoaEndpoint<'variablesRemove'>;
	triggersList: KadoaEndpoint<'triggersList'>;
	locationsList: KadoaEndpoint<'locationsList'>;
};

const kadoaEndpointsNested = {
	workflows: {
		list: Workflows.list,
		get: Workflows.get,
		create: Workflows.create,
		updateMetadata: Workflows.updateMetadata,
		delete: Workflows.remove,
		run: Workflows.run,
		pause: Workflows.pause,
		resume: Workflows.resume,
		stop: Workflows.stop,
		schedule: Workflows.schedule,
		history: Workflows.history,
		data: Workflows.data,
		jobStatus: Workflows.jobStatus,
		connectors: Workflows.connectors,
	},
	schemas: {
		list: Schemas.list,
		get: Schemas.get,
		create: Schemas.create,
		update: Schemas.update,
		delete: Schemas.remove,
	},
	changes: {
		list: Changes.list,
		get: Changes.get,
	},
	variables: {
		list: Variables.list,
		get: Variables.get,
		create: Variables.create,
		update: Variables.update,
		delete: Variables.remove,
	},
	triggers: {
		list: Triggers.list,
	},
	locations: {
		list: Locations.list,
	},
} as const;

export const kadoaEndpointSchemas = {
	'workflows.list': {
		input: KadoaEndpointInputSchemas.workflowsList,
		output: KadoaEndpointOutputSchemas.workflowsList,
	},
	'workflows.get': {
		input: KadoaEndpointInputSchemas.workflowsGet,
		output: KadoaEndpointOutputSchemas.workflowsGet,
	},
	'workflows.create': {
		input: KadoaEndpointInputSchemas.workflowsCreate,
		output: KadoaEndpointOutputSchemas.workflowsCreate,
	},
	'workflows.updateMetadata': {
		input: KadoaEndpointInputSchemas.workflowsUpdateMetadata,
		output: KadoaEndpointOutputSchemas.workflowsUpdateMetadata,
	},
	'workflows.delete': {
		input: KadoaEndpointInputSchemas.workflowsRemove,
		output: KadoaEndpointOutputSchemas.workflowsRemove,
	},
	'workflows.run': {
		input: KadoaEndpointInputSchemas.workflowsRun,
		output: KadoaEndpointOutputSchemas.workflowsRun,
	},
	'workflows.pause': {
		input: KadoaEndpointInputSchemas.workflowsPause,
		output: KadoaEndpointOutputSchemas.workflowsPause,
	},
	'workflows.resume': {
		input: KadoaEndpointInputSchemas.workflowsResume,
		output: KadoaEndpointOutputSchemas.workflowsResume,
	},
	'workflows.stop': {
		input: KadoaEndpointInputSchemas.workflowsStop,
		output: KadoaEndpointOutputSchemas.workflowsStop,
	},
	'workflows.schedule': {
		input: KadoaEndpointInputSchemas.workflowsSchedule,
		output: KadoaEndpointOutputSchemas.workflowsSchedule,
	},
	'workflows.history': {
		input: KadoaEndpointInputSchemas.workflowsHistory,
		output: KadoaEndpointOutputSchemas.workflowsHistory,
	},
	'workflows.data': {
		input: KadoaEndpointInputSchemas.workflowsData,
		output: KadoaEndpointOutputSchemas.workflowsData,
	},
	'workflows.jobStatus': {
		input: KadoaEndpointInputSchemas.workflowsJobStatus,
		output: KadoaEndpointOutputSchemas.workflowsJobStatus,
	},
	'workflows.connectors': {
		input: KadoaEndpointInputSchemas.workflowsConnectors,
		output: KadoaEndpointOutputSchemas.workflowsConnectors,
	},
	'schemas.list': {
		input: KadoaEndpointInputSchemas.schemasList,
		output: KadoaEndpointOutputSchemas.schemasList,
	},
	'schemas.get': {
		input: KadoaEndpointInputSchemas.schemasGet,
		output: KadoaEndpointOutputSchemas.schemasGet,
	},
	'schemas.create': {
		input: KadoaEndpointInputSchemas.schemasCreate,
		output: KadoaEndpointOutputSchemas.schemasCreate,
	},
	'schemas.update': {
		input: KadoaEndpointInputSchemas.schemasUpdate,
		output: KadoaEndpointOutputSchemas.schemasUpdate,
	},
	'schemas.delete': {
		input: KadoaEndpointInputSchemas.schemasRemove,
		output: KadoaEndpointOutputSchemas.schemasRemove,
	},
	'changes.list': {
		input: KadoaEndpointInputSchemas.changesList,
		output: KadoaEndpointOutputSchemas.changesList,
	},
	'changes.get': {
		input: KadoaEndpointInputSchemas.changesGet,
		output: KadoaEndpointOutputSchemas.changesGet,
	},
	'variables.list': {
		input: KadoaEndpointInputSchemas.variablesList,
		output: KadoaEndpointOutputSchemas.variablesList,
	},
	'variables.get': {
		input: KadoaEndpointInputSchemas.variablesGet,
		output: KadoaEndpointOutputSchemas.variablesGet,
	},
	'variables.create': {
		input: KadoaEndpointInputSchemas.variablesCreate,
		output: KadoaEndpointOutputSchemas.variablesCreate,
	},
	'variables.update': {
		input: KadoaEndpointInputSchemas.variablesUpdate,
		output: KadoaEndpointOutputSchemas.variablesUpdate,
	},
	'variables.delete': {
		input: KadoaEndpointInputSchemas.variablesRemove,
		output: KadoaEndpointOutputSchemas.variablesRemove,
	},
	'triggers.list': {
		input: KadoaEndpointInputSchemas.triggersList,
		output: KadoaEndpointOutputSchemas.triggersList,
	},
	'locations.list': {
		input: KadoaEndpointInputSchemas.locationsList,
		output: KadoaEndpointOutputSchemas.locationsList,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof kadoaEndpointsNested>;

const defaultAuthType = 'api_key' as const;

// A run's `jobId` is read back by `workflows.jobStatus`, which needs the
// workflow ID as well, so no `job` entry is declared: EndpointJob carries a
// single argument. The run description says where to poll instead.
const kadoaEndpointMeta = {
	'workflows.list': {
		riskLevel: 'read',
		description:
			'List workflows by name, ID, state or tag, with paging by skip; `statusFilters: ["group:attention"]` returns the ones waiting on you',
	},
	'workflows.get': {
		riskLevel: 'read',
		description:
			'One workflow with its sources, schema, schedule, latest run state and pending fields',
	},
	// create, run and resume spend Kadoa credits, which R8 marks destructive.
	'workflows.create': {
		riskLevel: 'destructive',
		description:
			'Create a workflow from a prompt, an existing schema, inline entity and fields, or a template; every URL must belong to one website. Spends Kadoa credits once it runs',
	},
	'workflows.updateMetadata': {
		riskLevel: 'write',
		description:
			'Change a workflow’s name, description, tags, sources, record limit, schedule, location or monitored fields',
	},
	'workflows.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a workflow along with its run history and stored data; it cannot be restored',
	},
	'workflows.run': {
		riskLevel: 'destructive',
		description:
			'Start a run and get a jobId back at once; spends Kadoa credits. Follow it with workflows.jobStatus({ workflowId, jobId }), or read the result with workflows.data',
	},
	'workflows.pause': {
		riskLevel: 'write',
		description:
			'Pause a workflow so its schedule stops starting runs; workflows.resume turns it back on',
	},
	'workflows.resume': {
		riskLevel: 'destructive',
		description:
			'Unpause a paused workflow, or resume a preview or error workflow; a 202 means a fresh preview run was started and returned a jobId',
	},
	'workflows.stop': {
		riskLevel: 'write',
		description:
			'Stop the workflow’s active run; queued steps are dropped and the step already running may finish',
	},
	'workflows.schedule': {
		riskLevel: 'write',
		description:
			'Set when a workflow’s next run starts, as a UTC time; the workflow needs a schedule for this to work',
	},
	'workflows.history': {
		riskLevel: 'read',
		description:
			'Past runs of a workflow with their state, record count and errors, paged or by run ID',
	},
	'workflows.data': {
		riskLevel: 'read',
		description:
			'Extracted rows of a workflow’s latest published run, with filters, sorting and paging; `limit: 0` streams every row at once',
	},
	'workflows.jobStatus': {
		riskLevel: 'read',
		description:
			'Where a run stands: IN_PROGRESS, FINISHED, FAILED, NOT_SUPPORTED or FAILED_INSUFFICIENT_FUNDS, with any errors',
	},
	'workflows.connectors': {
		riskLevel: 'read',
		description:
			'Destinations that receive this workflow’s results after each run, with the format each takes',
	},
	'schemas.list': {
		riskLevel: 'read',
		description: 'Every extraction schema the caller can see',
	},
	'schemas.get': {
		riskLevel: 'read',
		description: 'One extraction schema with its fields and entity',
	},
	'schemas.create': {
		riskLevel: 'write',
		description:
			'Create an extraction schema from typed data fields or classification fields, for workflows to reuse',
	},
	'schemas.update': {
		riskLevel: 'write',
		description:
			'Rename a schema, change its entity, or publish a new revision from replacement fields; workflows on the old revision keep it',
	},
	'schemas.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a schema and every revision of it; it cannot be restored',
	},
	'changes.list': {
		riskLevel: 'read',
		description:
			'Data changes detected across workflows in a date window, with the changed fields and counts; `exclude` drops the large arrays',
	},
	'changes.get': {
		riskLevel: 'read',
		description:
			'One detected data change with its differences and current data',
	},
	'variables.list': {
		riskLevel: 'read',
		description:
			'Team variables with their keys and values, optionally limited to one workflow’s; a secret’s value is never returned',
	},
	'variables.get': {
		riskLevel: 'read',
		description: 'One variable by ID; a secret comes back without its value',
	},
	'variables.create': {
		riskLevel: 'write',
		description:
			'Create a string, number, object or array variable, or a secret held by Kadoa or read from your Google Secret Manager',
	},
	'variables.update': {
		riskLevel: 'write',
		description:
			'Change a variable’s key or value; a stored value cannot change type, and a secret’s new value is written only',
	},
	'variables.delete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a variable; a secret still bound to a connection is refused with a 409',
	},
	'triggers.list': {
		riskLevel: 'read',
		description:
			'Triggers where this workflow is the source, plus the incoming ones that start it',
	},
	'locations.list': {
		riskLevel: 'read',
		description: 'Countries a workflow can scrape from, with their ISO codes',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof kadoaEndpointsNested>;

export type BaseKadoaPlugin<T extends KadoaPluginOptions> = CorsairPlugin<
	'kadoa',
	typeof KadoaSchema,
	typeof kadoaEndpointsNested,
	{},
	T,
	typeof defaultAuthType
>;

export type InternalKadoaPlugin = BaseKadoaPlugin<KadoaPluginOptions>;

export type ExternalKadoaPlugin<T extends KadoaPluginOptions> =
	BaseKadoaPlugin<T>;

export function kadoa<const T extends KadoaPluginOptions>(
	incomingOptions: KadoaPluginOptions & T = {} as KadoaPluginOptions & T,
): ExternalKadoaPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'kadoa',
		schema: KadoaSchema,
		options,
		hooks: options.hooks,
		endpoints: kadoaEndpointsNested,
		webhooks: {},
		endpointMeta: kadoaEndpointMeta,
		endpointSchemas: kadoaEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: KadoaKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('kadoa', ctx.authType ?? 'api_key');
		},
	} satisfies InternalKadoaPlugin;
}

export { KadoaAPIError, kadoaErrorCode } from './client';

export type {
	ChangeGetInput,
	ChangeGetResponse,
	ChangesListInput,
	ChangesListResponse,
	CreateWorkflowResponse,
	KadoaChange,
	KadoaFieldInput,
	KadoaLocation,
	KadoaPagination,
	KadoaSchemaDefinition,
	KadoaTrigger,
	KadoaVariable,
	KadoaWorkflow,
	KadoaWorkflowError,
	KadoaWorkflowRun,
	KadoaWorkflowSchemaField,
	LocationsListInput,
	LocationsListResponse,
	MessageResponse,
	SchemaCreateInput,
	SchemaCreateResponse,
	SchemaGetInput,
	SchemaGetResponse,
	SchemaRemoveInput,
	SchemaRemoveResponse,
	SchemasListInput,
	SchemasListResponse,
	SchemaUpdateInput,
	SchemaUpdateResponse,
	SuccessMessageResponse,
	TriggersListInput,
	TriggersListResponse,
	VariableCreateInput,
	VariableGetInput,
	VariableGetResponse,
	VariableRemoveInput,
	VariablesListInput,
	VariablesListResponse,
	VariableUpdateInput,
	WorkflowControlInput,
	WorkflowDetailResponse,
	WorkflowGetInput,
	WorkflowRemoveInput,
	WorkflowsCreateInput,
	WorkflowsDataInput,
	WorkflowsDataResponse,
	WorkflowsHistoryInput,
	WorkflowsHistoryResponse,
	WorkflowsJobStatusInput,
	WorkflowsJobStatusResponse,
	WorkflowsListInput,
	WorkflowsListResponse,
	WorkflowsResumeResponse,
	WorkflowsRunInput,
	WorkflowsRunResponse,
	WorkflowsScheduleInput,
	WorkflowsUpdateMetadataInput,
} from './endpoints/types';
