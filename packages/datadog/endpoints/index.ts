import * as Dashboards from './dashboards';
import * as EventsAlerts from './events-alerts';
import * as Infrastructure from './infrastructure';
import * as Monitors from './monitors';
import * as Observability from './observability';
import * as Organization from './organization';
import * as SlosSynthetics from './slos-synthetics';

export const DashboardsEndpoints = {
	list: Dashboards.list,
	get: Dashboards.get,
	create: Dashboards.create,
	update: Dashboards.update,
	delete: Dashboards.remove,
};

export const MonitorsEndpoints = {
	list: Monitors.list,
	search: Monitors.search,
	get: Monitors.get,
	create: Monitors.create,
	update: Monitors.update,
	delete: Monitors.remove,
	mute: Monitors.mute,
	unmute: Monitors.unmute,
};

export const SlosEndpoints = {
	list: SlosSynthetics.slosList,
	create: SlosSynthetics.slosCreate,
};

export const SyntheticsEndpoints = {
	listTests: SlosSynthetics.syntheticsListTests,
	getApiTest: SlosSynthetics.syntheticsGetApiTest,
	createApiTest: SlosSynthetics.syntheticsCreateApiTest,
	listLocations: SlosSynthetics.syntheticsListLocations,
};

export const EventsEndpoints = {
	list: EventsAlerts.eventsList,
	create: EventsAlerts.eventsCreate,
};

export const DowntimesEndpoints = {
	list: EventsAlerts.downtimesList,
	create: EventsAlerts.downtimesCreate,
};

export const WebhooksEndpoints = {
	get: EventsAlerts.webhooksGet,
	create: EventsAlerts.webhooksCreate,
};

export const HostsEndpoints = {
	list: Infrastructure.hostsList,
	totals: Infrastructure.hostsTotals,
};

export const TagsEndpoints = {
	list: Infrastructure.tagsList,
	getHost: Infrastructure.tagsGetHost,
	updateHost: Infrastructure.tagsUpdateHost,
};

export const ServicesEndpoints = {
	listDefinitions: Observability.servicesListDefinitions,
};

export const SpansEndpoints = {
	search: Observability.spansSearch,
	aggregate: Observability.spansAggregate,
};

export const LogsEndpoints = {
	search: Observability.logsSearch,
	aggregate: Observability.logsAggregate,
	listIndexes: Observability.logsListIndexes,
};

export const MetricsEndpoints = {
	listActive: Observability.metricsListActive,
	query: Observability.metricsQuery,
	submit: Observability.metricsSubmit,
};

export const UsersEndpoints = {
	list: Organization.usersList,
};

export const RolesEndpoints = {
	list: Organization.rolesList,
};

export const ApiKeysEndpoints = {
	list: Organization.apiKeysList,
};

export const IncidentsEndpoints = {
	list: Organization.incidentsList,
};

export const AwsEndpoints = {
	list: Organization.awsList,
};

export const UsageEndpoints = {
	getSummary: Organization.usageGetSummary,
};

export * from './types';
