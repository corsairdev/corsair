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
	Alerting,
	Checks,
	Maintenance,
	Occurrences,
	Results,
	Summaries,
	Tools,
} from './endpoints';
import type {
	PingdomEndpointInputs,
	PingdomEndpointOutputs,
} from './endpoints/types';
import {
	PingdomEndpointInputSchemas,
	PingdomEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers, mergeErrorHandlers } from './error-handlers';
import { PingdomSchema } from './schema';

export type PingdomPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalPingdomPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof pingdomEndpointsNested>;
};

export type PingdomContext = CorsairPluginContext<
	typeof PingdomSchema,
	PingdomPluginOptions,
	undefined,
	typeof pingdomAuthConfig
>;

export type PingdomKeyBuilderContext = KeyBuilderContext<
	PingdomPluginOptions,
	typeof pingdomAuthConfig
>;

export type PingdomBoundEndpoints = BindEndpoints<
	typeof pingdomEndpointsNested
>;

type PingdomEndpoint<K extends keyof PingdomEndpointOutputs> = CorsairEndpoint<
	PingdomContext,
	PingdomEndpointInputs[K],
	PingdomEndpointOutputs[K]
>;

export type PingdomEndpoints = {
	[K in keyof PingdomEndpointOutputs]: PingdomEndpoint<K>;
};

const pingdomEndpointsNested = {
	checks: {
		list: Checks.list,
		create: Checks.create,
		get: Checks.get,
		update: Checks.update,
		delete: Checks.deleteCheck,
		updateMulti: Checks.updateMulti,
		deleteMulti: Checks.deleteMulti,
	},
	analysis: {
		list: Results.listAnalysis,
		get: Results.getAnalysis,
	},
	results: {
		list: Results.listResults,
	},
	summaries: {
		average: Summaries.average,
		hoursOfDay: Summaries.hoursOfDay,
		outage: Summaries.outage,
		performance: Summaries.performance,
		probes: Summaries.probes,
	},
	tools: {
		listActions: Tools.listActions,
		getCredits: Tools.getCredits,
		listProbes: Tools.listProbes,
		getReference: Tools.getReference,
		runSingle: Tools.runSingle,
	},
	maintenance: {
		list: Maintenance.list,
		create: Maintenance.create,
		get: Maintenance.get,
		update: Maintenance.update,
		delete: Maintenance.deleteWindow,
		deleteMulti: Maintenance.deleteMulti,
	},
	occurrences: {
		list: Occurrences.list,
		get: Occurrences.get,
		update: Occurrences.update,
		delete: Occurrences.deleteOccurrence,
	},
	alerting: {
		teams: {
			list: Alerting.listTeams,
			create: Alerting.createTeam,
			get: Alerting.getTeam,
			update: Alerting.updateTeam,
			delete: Alerting.deleteTeam,
		},
		contacts: {
			list: Alerting.listContacts,
			create: Alerting.createContact,
			get: Alerting.getContact,
			update: Alerting.updateContact,
			delete: Alerting.deleteContact,
		},
	},
} as const;

export const pingdomEndpointSchemas = {
	'checks.list': {
		input: PingdomEndpointInputSchemas.checksList,
		output: PingdomEndpointOutputSchemas.checksList,
	},
	'checks.create': {
		input: PingdomEndpointInputSchemas.checksCreate,
		output: PingdomEndpointOutputSchemas.checksCreate,
	},
	'checks.get': {
		input: PingdomEndpointInputSchemas.checksGet,
		output: PingdomEndpointOutputSchemas.checksGet,
	},
	'checks.update': {
		input: PingdomEndpointInputSchemas.checksUpdate,
		output: PingdomEndpointOutputSchemas.checksUpdate,
	},
	'checks.delete': {
		input: PingdomEndpointInputSchemas.checksDelete,
		output: PingdomEndpointOutputSchemas.checksDelete,
	},
	'checks.updateMulti': {
		input: PingdomEndpointInputSchemas.checksUpdateMulti,
		output: PingdomEndpointOutputSchemas.checksUpdateMulti,
	},
	'checks.deleteMulti': {
		input: PingdomEndpointInputSchemas.checksDeleteMulti,
		output: PingdomEndpointOutputSchemas.checksDeleteMulti,
	},
	'analysis.list': {
		input: PingdomEndpointInputSchemas.analysisList,
		output: PingdomEndpointOutputSchemas.analysisList,
	},
	'analysis.get': {
		input: PingdomEndpointInputSchemas.analysisGet,
		output: PingdomEndpointOutputSchemas.analysisGet,
	},
	'results.list': {
		input: PingdomEndpointInputSchemas.resultsList,
		output: PingdomEndpointOutputSchemas.resultsList,
	},
	'summaries.average': {
		input: PingdomEndpointInputSchemas.summariesAverage,
		output: PingdomEndpointOutputSchemas.summariesAverage,
	},
	'summaries.hoursOfDay': {
		input: PingdomEndpointInputSchemas.summariesHoursOfDay,
		output: PingdomEndpointOutputSchemas.summariesHoursOfDay,
	},
	'summaries.outage': {
		input: PingdomEndpointInputSchemas.summariesOutage,
		output: PingdomEndpointOutputSchemas.summariesOutage,
	},
	'summaries.performance': {
		input: PingdomEndpointInputSchemas.summariesPerformance,
		output: PingdomEndpointOutputSchemas.summariesPerformance,
	},
	'summaries.probes': {
		input: PingdomEndpointInputSchemas.summariesProbes,
		output: PingdomEndpointOutputSchemas.summariesProbes,
	},
	'tools.listActions': {
		input: PingdomEndpointInputSchemas.actionsList,
		output: PingdomEndpointOutputSchemas.actionsList,
	},
	'tools.getCredits': {
		input: PingdomEndpointInputSchemas.creditsGet,
		output: PingdomEndpointOutputSchemas.creditsGet,
	},
	'tools.listProbes': {
		input: PingdomEndpointInputSchemas.probesList,
		output: PingdomEndpointOutputSchemas.probesList,
	},
	'tools.getReference': {
		input: PingdomEndpointInputSchemas.referenceGet,
		output: PingdomEndpointOutputSchemas.referenceGet,
	},
	'tools.runSingle': {
		input: PingdomEndpointInputSchemas.singleRun,
		output: PingdomEndpointOutputSchemas.singleRun,
	},
	'maintenance.list': {
		input: PingdomEndpointInputSchemas.maintenanceList,
		output: PingdomEndpointOutputSchemas.maintenanceList,
	},
	'maintenance.create': {
		input: PingdomEndpointInputSchemas.maintenanceCreate,
		output: PingdomEndpointOutputSchemas.maintenanceCreate,
	},
	'maintenance.get': {
		input: PingdomEndpointInputSchemas.maintenanceGet,
		output: PingdomEndpointOutputSchemas.maintenanceGet,
	},
	'maintenance.update': {
		input: PingdomEndpointInputSchemas.maintenanceUpdate,
		output: PingdomEndpointOutputSchemas.maintenanceUpdate,
	},
	'maintenance.delete': {
		input: PingdomEndpointInputSchemas.maintenanceDelete,
		output: PingdomEndpointOutputSchemas.maintenanceDelete,
	},
	'maintenance.deleteMulti': {
		input: PingdomEndpointInputSchemas.maintenanceDeleteMulti,
		output: PingdomEndpointOutputSchemas.maintenanceDeleteMulti,
	},
	'occurrences.list': {
		input: PingdomEndpointInputSchemas.occurrencesList,
		output: PingdomEndpointOutputSchemas.occurrencesList,
	},
	'occurrences.get': {
		input: PingdomEndpointInputSchemas.occurrencesGet,
		output: PingdomEndpointOutputSchemas.occurrencesGet,
	},
	'occurrences.update': {
		input: PingdomEndpointInputSchemas.occurrencesUpdate,
		output: PingdomEndpointOutputSchemas.occurrencesUpdate,
	},
	'occurrences.delete': {
		input: PingdomEndpointInputSchemas.occurrencesDelete,
		output: PingdomEndpointOutputSchemas.occurrencesDelete,
	},
	'alerting.teams.list': {
		input: PingdomEndpointInputSchemas.teamsList,
		output: PingdomEndpointOutputSchemas.teamsList,
	},
	'alerting.teams.create': {
		input: PingdomEndpointInputSchemas.teamsCreate,
		output: PingdomEndpointOutputSchemas.teamsCreate,
	},
	'alerting.teams.get': {
		input: PingdomEndpointInputSchemas.teamsGet,
		output: PingdomEndpointOutputSchemas.teamsGet,
	},
	'alerting.teams.update': {
		input: PingdomEndpointInputSchemas.teamsUpdate,
		output: PingdomEndpointOutputSchemas.teamsUpdate,
	},
	'alerting.teams.delete': {
		input: PingdomEndpointInputSchemas.teamsDelete,
		output: PingdomEndpointOutputSchemas.teamsDelete,
	},
	'alerting.contacts.list': {
		input: PingdomEndpointInputSchemas.contactsList,
		output: PingdomEndpointOutputSchemas.contactsList,
	},
	'alerting.contacts.create': {
		input: PingdomEndpointInputSchemas.contactsCreate,
		output: PingdomEndpointOutputSchemas.contactsCreate,
	},
	'alerting.contacts.get': {
		input: PingdomEndpointInputSchemas.contactsGet,
		output: PingdomEndpointOutputSchemas.contactsGet,
	},
	'alerting.contacts.update': {
		input: PingdomEndpointInputSchemas.contactsUpdate,
		output: PingdomEndpointOutputSchemas.contactsUpdate,
	},
	'alerting.contacts.delete': {
		input: PingdomEndpointInputSchemas.contactsDelete,
		output: PingdomEndpointOutputSchemas.contactsDelete,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof pingdomEndpointsNested
>;

export const pingdomEndpointMeta = {
	'checks.list': {
		riskLevel: 'read',
		description: 'List the checks with paging and tag filters',
	},
	'checks.create': {
		riskLevel: 'write',
		description: 'Create an uptime check of any documented type',
	},
	'checks.get': {
		riskLevel: 'read',
		description: 'Read one check with its type settings',
	},
	'checks.update': {
		riskLevel: 'write',
		description: 'Modify the settings of one check',
	},
	'checks.delete': {
		riskLevel: 'destructive',
		description: 'Delete a check',
	},
	'checks.updateMulti': {
		riskLevel: 'write',
		description: 'Pause, unpause or re-time the listed checks at once',
	},
	'checks.deleteMulti': {
		riskLevel: 'destructive',
		description: 'Delete several checks at once',
	},
	'analysis.list': {
		riskLevel: 'read',
		description: 'List the latest root cause analyses of a check',
	},
	'analysis.get': {
		riskLevel: 'read',
		description: 'Read one raw root cause analysis',
	},
	'results.list': {
		riskLevel: 'read',
		description: 'List the raw test results of a check',
	},
	'summaries.average': {
		riskLevel: 'read',
		description: 'Read the average time and uptime summary of a check',
	},
	'summaries.hoursOfDay': {
		riskLevel: 'read',
		description: 'Read the per-hour response time summary',
	},
	'summaries.outage': {
		riskLevel: 'read',
		description: 'Read the status change history of a check',
	},
	'summaries.performance': {
		riskLevel: 'read',
		description: 'Read the per-interval performance summary',
	},
	'summaries.probes': {
		riskLevel: 'read',
		description: 'Read the per-probe test counts of a check',
	},
	'tools.listActions': {
		riskLevel: 'read',
		description: 'List the alert actions across checks',
	},
	'tools.getCredits': {
		riskLevel: 'read',
		description: 'Read the account check slots and SMS credits',
	},
	'tools.listProbes': {
		riskLevel: 'read',
		description: 'List the Pingdom probe servers',
	},
	'tools.getReference': {
		riskLevel: 'read',
		description: 'Read region, timezone and format references',
	},
	'tools.runSingle': {
		riskLevel: 'write',
		description: 'Run a one-off check against a host',
	},
	'maintenance.list': {
		riskLevel: 'read',
		description: 'List the maintenance windows',
	},
	'maintenance.create': {
		riskLevel: 'write',
		description: 'Create a maintenance window',
	},
	'maintenance.get': {
		riskLevel: 'read',
		description: 'Read one maintenance window',
	},
	'maintenance.update': {
		riskLevel: 'write',
		description: 'Modify a maintenance window',
	},
	'maintenance.delete': {
		riskLevel: 'destructive',
		description: 'Delete a maintenance window',
	},
	'maintenance.deleteMulti': {
		riskLevel: 'destructive',
		description: 'Delete several maintenance windows at once',
	},
	'occurrences.list': {
		riskLevel: 'read',
		description: 'List maintenance occurrences',
	},
	'occurrences.get': {
		riskLevel: 'read',
		description: 'Read one maintenance occurrence',
	},
	'occurrences.update': {
		riskLevel: 'write',
		description: 'Move a maintenance occurrence',
	},
	'occurrences.delete': {
		riskLevel: 'destructive',
		description: 'Delete a maintenance occurrence',
	},
	'alerting.teams.list': {
		riskLevel: 'read',
		description: 'List the alerting teams',
	},
	'alerting.teams.create': {
		riskLevel: 'write',
		description: 'Create an alerting team',
	},
	'alerting.teams.get': {
		riskLevel: 'read',
		description: 'Read one alerting team',
	},
	'alerting.teams.update': {
		riskLevel: 'write',
		description: 'Modify an alerting team',
	},
	'alerting.teams.delete': {
		riskLevel: 'destructive',
		description: 'Delete an alerting team',
	},
	'alerting.contacts.list': {
		riskLevel: 'read',
		description: 'List the alerting contacts',
	},
	'alerting.contacts.create': {
		riskLevel: 'write',
		description: 'Create an alerting contact with notification targets',
	},
	'alerting.contacts.get': {
		riskLevel: 'read',
		description: 'Read one alerting contact',
	},
	'alerting.contacts.update': {
		riskLevel: 'write',
		description: 'Modify an alerting contact',
	},
	'alerting.contacts.delete': {
		riskLevel: 'destructive',
		description: 'Delete an alerting contact',
	},
} as const satisfies RequiredPluginEndpointMeta<typeof pingdomEndpointsNested>;

const defaultAuthType: AuthTypes = 'api_key' as const;

export const pingdomAuthConfig = {
	api_key: {
		// Pingdom issues one API key per key record in the dashboard; no
		// account-level field is needed beside it.
		account: [] as const,
	},
} as const satisfies PluginAuthConfig;

export type BasePingdomPlugin<T extends PingdomPluginOptions> = CorsairPlugin<
	'pingdom',
	typeof PingdomSchema,
	typeof pingdomEndpointsNested,
	{},
	T,
	typeof defaultAuthType,
	typeof pingdomAuthConfig
>;

export type InternalPingdomPlugin = BasePingdomPlugin<PingdomPluginOptions>;

export type ExternalPingdomPlugin<T extends PingdomPluginOptions> =
	BasePingdomPlugin<T>;

export function pingdom<const T extends PingdomPluginOptions>(
	incomingOptions: PingdomPluginOptions & T = {} as PingdomPluginOptions & T,
): ExternalPingdomPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'pingdom',
		authConfig: pingdomAuthConfig,
		schema: PingdomSchema,
		options: options,
		hooks: options.hooks,
		endpoints: pingdomEndpointsNested,
		webhooks: {},
		endpointMeta: pingdomEndpointMeta,
		endpointSchemas: pingdomEndpointSchemas,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: PingdomKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();
				if (res) return res;
			}

			throw new AuthMissingError('pingdom', ctx.authType ?? 'api_key');
		},
	} satisfies InternalPingdomPlugin;
}

export { buildPingdomApiError } from './client';

export type {
	Action,
	CheckDetail,
	CheckSummary,
	Contact,
	Maintenance,
	NotificationTarget,
	PingdomEndpointInputs,
	PingdomEndpointOutputs,
	Probe,
	Result,
	Team,
} from './endpoints/types';
