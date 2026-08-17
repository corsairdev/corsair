import type {
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
	Catalog,
	HeartbeatGroups,
	Heartbeats,
	IncidentComments,
	Incidents,
	Integrations,
	Metadata,
	MonitorGroups,
	Monitors,
	OnCalls,
	OutgoingWebhooks,
	Policies,
	PolicyGroups,
	SourceGroups,
	StatusPageGroups,
	StatusPageReports,
	StatusPageResources,
	StatusPageSections,
	StatusPages,
	StatusUpdates,
	Token,
	Urgencies,
	UrgencyGroups,
} from './endpoints';
import type {
	BetterstackEndpointInputs,
	BetterstackEndpointOutputs,
} from './endpoints/types';
import {
	BetterstackEndpointInputSchemas,
	BetterstackEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { BetterstackSchema } from './schema';

export type BetterstackEndpoints = {
	monitorsCreate: BetterstackEndpoint<
		'monitorsCreate',
		BetterstackEndpointInputs['monitorsCreate']
	>;
	monitorsGet: BetterstackEndpoint<
		'monitorsGet',
		BetterstackEndpointInputs['monitorsGet']
	>;
	monitorsList: BetterstackEndpoint<
		'monitorsList',
		BetterstackEndpointInputs['monitorsList']
	>;
	monitorsUpdate: BetterstackEndpoint<
		'monitorsUpdate',
		BetterstackEndpointInputs['monitorsUpdate']
	>;
	monitorsRemove: BetterstackEndpoint<
		'monitorsRemove',
		BetterstackEndpointInputs['monitorsRemove']
	>;
	monitorsAvailability: BetterstackEndpoint<
		'monitorsAvailability',
		BetterstackEndpointInputs['monitorsAvailability']
	>;
	monitorsResponseTimes: BetterstackEndpoint<
		'monitorsResponseTimes',
		BetterstackEndpointInputs['monitorsResponseTimes']
	>;
	monitorGroupsCreate: BetterstackEndpoint<
		'monitorGroupsCreate',
		BetterstackEndpointInputs['monitorGroupsCreate']
	>;
	monitorGroupsGet: BetterstackEndpoint<
		'monitorGroupsGet',
		BetterstackEndpointInputs['monitorGroupsGet']
	>;
	monitorGroupsList: BetterstackEndpoint<
		'monitorGroupsList',
		BetterstackEndpointInputs['monitorGroupsList']
	>;
	monitorGroupsUpdate: BetterstackEndpoint<
		'monitorGroupsUpdate',
		BetterstackEndpointInputs['monitorGroupsUpdate']
	>;
	monitorGroupsRemove: BetterstackEndpoint<
		'monitorGroupsRemove',
		BetterstackEndpointInputs['monitorGroupsRemove']
	>;
	monitorGroupsMonitors: BetterstackEndpoint<
		'monitorGroupsMonitors',
		BetterstackEndpointInputs['monitorGroupsMonitors']
	>;
	heartbeatsCreate: BetterstackEndpoint<
		'heartbeatsCreate',
		BetterstackEndpointInputs['heartbeatsCreate']
	>;
	heartbeatsGet: BetterstackEndpoint<
		'heartbeatsGet',
		BetterstackEndpointInputs['heartbeatsGet']
	>;
	heartbeatsList: BetterstackEndpoint<
		'heartbeatsList',
		BetterstackEndpointInputs['heartbeatsList']
	>;
	heartbeatsUpdate: BetterstackEndpoint<
		'heartbeatsUpdate',
		BetterstackEndpointInputs['heartbeatsUpdate']
	>;
	heartbeatsRemove: BetterstackEndpoint<
		'heartbeatsRemove',
		BetterstackEndpointInputs['heartbeatsRemove']
	>;
	heartbeatsAvailability: BetterstackEndpoint<
		'heartbeatsAvailability',
		BetterstackEndpointInputs['heartbeatsAvailability']
	>;
	heartbeatGroupsCreate: BetterstackEndpoint<
		'heartbeatGroupsCreate',
		BetterstackEndpointInputs['heartbeatGroupsCreate']
	>;
	heartbeatGroupsGet: BetterstackEndpoint<
		'heartbeatGroupsGet',
		BetterstackEndpointInputs['heartbeatGroupsGet']
	>;
	heartbeatGroupsList: BetterstackEndpoint<
		'heartbeatGroupsList',
		BetterstackEndpointInputs['heartbeatGroupsList']
	>;
	heartbeatGroupsUpdate: BetterstackEndpoint<
		'heartbeatGroupsUpdate',
		BetterstackEndpointInputs['heartbeatGroupsUpdate']
	>;
	heartbeatGroupsRemove: BetterstackEndpoint<
		'heartbeatGroupsRemove',
		BetterstackEndpointInputs['heartbeatGroupsRemove']
	>;
	incidentsCreate: BetterstackEndpoint<
		'incidentsCreate',
		BetterstackEndpointInputs['incidentsCreate']
	>;
	incidentsGet: BetterstackEndpoint<
		'incidentsGet',
		BetterstackEndpointInputs['incidentsGet']
	>;
	incidentsList: BetterstackEndpoint<
		'incidentsList',
		BetterstackEndpointInputs['incidentsList']
	>;
	incidentsRemove: BetterstackEndpoint<
		'incidentsRemove',
		BetterstackEndpointInputs['incidentsRemove']
	>;
	incidentsAcknowledge: BetterstackEndpoint<
		'incidentsAcknowledge',
		BetterstackEndpointInputs['incidentsAcknowledge']
	>;
	incidentsResolve: BetterstackEndpoint<
		'incidentsResolve',
		BetterstackEndpointInputs['incidentsResolve']
	>;
	incidentsEscalate: BetterstackEndpoint<
		'incidentsEscalate',
		BetterstackEndpointInputs['incidentsEscalate']
	>;
	incidentsTimeline: BetterstackEndpoint<
		'incidentsTimeline',
		BetterstackEndpointInputs['incidentsTimeline']
	>;
	incidentCommentsCreate: BetterstackEndpoint<
		'incidentCommentsCreate',
		BetterstackEndpointInputs['incidentCommentsCreate']
	>;
	incidentCommentsGet: BetterstackEndpoint<
		'incidentCommentsGet',
		BetterstackEndpointInputs['incidentCommentsGet']
	>;
	incidentCommentsList: BetterstackEndpoint<
		'incidentCommentsList',
		BetterstackEndpointInputs['incidentCommentsList']
	>;
	incidentCommentsUpdate: BetterstackEndpoint<
		'incidentCommentsUpdate',
		BetterstackEndpointInputs['incidentCommentsUpdate']
	>;
	incidentCommentsRemove: BetterstackEndpoint<
		'incidentCommentsRemove',
		BetterstackEndpointInputs['incidentCommentsRemove']
	>;
	policiesCreate: BetterstackEndpoint<
		'policiesCreate',
		BetterstackEndpointInputs['policiesCreate']
	>;
	policiesGet: BetterstackEndpoint<
		'policiesGet',
		BetterstackEndpointInputs['policiesGet']
	>;
	policiesList: BetterstackEndpoint<
		'policiesList',
		BetterstackEndpointInputs['policiesList']
	>;
	policiesUpdate: BetterstackEndpoint<
		'policiesUpdate',
		BetterstackEndpointInputs['policiesUpdate']
	>;
	policiesRemove: BetterstackEndpoint<
		'policiesRemove',
		BetterstackEndpointInputs['policiesRemove']
	>;
	policyGroupsCreate: BetterstackEndpoint<
		'policyGroupsCreate',
		BetterstackEndpointInputs['policyGroupsCreate']
	>;
	policyGroupsGet: BetterstackEndpoint<
		'policyGroupsGet',
		BetterstackEndpointInputs['policyGroupsGet']
	>;
	policyGroupsList: BetterstackEndpoint<
		'policyGroupsList',
		BetterstackEndpointInputs['policyGroupsList']
	>;
	policyGroupsUpdate: BetterstackEndpoint<
		'policyGroupsUpdate',
		BetterstackEndpointInputs['policyGroupsUpdate']
	>;
	policyGroupsRemove: BetterstackEndpoint<
		'policyGroupsRemove',
		BetterstackEndpointInputs['policyGroupsRemove']
	>;
	onCallsCreate: BetterstackEndpoint<
		'onCallsCreate',
		BetterstackEndpointInputs['onCallsCreate']
	>;
	onCallsGet: BetterstackEndpoint<
		'onCallsGet',
		BetterstackEndpointInputs['onCallsGet']
	>;
	onCallsList: BetterstackEndpoint<
		'onCallsList',
		BetterstackEndpointInputs['onCallsList']
	>;
	onCallsUpdate: BetterstackEndpoint<
		'onCallsUpdate',
		BetterstackEndpointInputs['onCallsUpdate']
	>;
	onCallsRemove: BetterstackEndpoint<
		'onCallsRemove',
		BetterstackEndpointInputs['onCallsRemove']
	>;
	onCallsEvents: BetterstackEndpoint<
		'onCallsEvents',
		BetterstackEndpointInputs['onCallsEvents']
	>;
	urgenciesCreate: BetterstackEndpoint<
		'urgenciesCreate',
		BetterstackEndpointInputs['urgenciesCreate']
	>;
	urgenciesGet: BetterstackEndpoint<
		'urgenciesGet',
		BetterstackEndpointInputs['urgenciesGet']
	>;
	urgenciesList: BetterstackEndpoint<
		'urgenciesList',
		BetterstackEndpointInputs['urgenciesList']
	>;
	urgenciesUpdate: BetterstackEndpoint<
		'urgenciesUpdate',
		BetterstackEndpointInputs['urgenciesUpdate']
	>;
	urgenciesRemove: BetterstackEndpoint<
		'urgenciesRemove',
		BetterstackEndpointInputs['urgenciesRemove']
	>;
	urgencyGroupsCreate: BetterstackEndpoint<
		'urgencyGroupsCreate',
		BetterstackEndpointInputs['urgencyGroupsCreate']
	>;
	urgencyGroupsGet: BetterstackEndpoint<
		'urgencyGroupsGet',
		BetterstackEndpointInputs['urgencyGroupsGet']
	>;
	urgencyGroupsList: BetterstackEndpoint<
		'urgencyGroupsList',
		BetterstackEndpointInputs['urgencyGroupsList']
	>;
	urgencyGroupsUpdate: BetterstackEndpoint<
		'urgencyGroupsUpdate',
		BetterstackEndpointInputs['urgencyGroupsUpdate']
	>;
	urgencyGroupsRemove: BetterstackEndpoint<
		'urgencyGroupsRemove',
		BetterstackEndpointInputs['urgencyGroupsRemove']
	>;
	statusPagesGet: BetterstackEndpoint<
		'statusPagesGet',
		BetterstackEndpointInputs['statusPagesGet']
	>;
	statusPagesList: BetterstackEndpoint<
		'statusPagesList',
		BetterstackEndpointInputs['statusPagesList']
	>;
	statusPagesUpdate: BetterstackEndpoint<
		'statusPagesUpdate',
		BetterstackEndpointInputs['statusPagesUpdate']
	>;
	statusPageSectionsCreate: BetterstackEndpoint<
		'statusPageSectionsCreate',
		BetterstackEndpointInputs['statusPageSectionsCreate']
	>;
	statusPageSectionsGet: BetterstackEndpoint<
		'statusPageSectionsGet',
		BetterstackEndpointInputs['statusPageSectionsGet']
	>;
	statusPageSectionsList: BetterstackEndpoint<
		'statusPageSectionsList',
		BetterstackEndpointInputs['statusPageSectionsList']
	>;
	statusPageSectionsUpdate: BetterstackEndpoint<
		'statusPageSectionsUpdate',
		BetterstackEndpointInputs['statusPageSectionsUpdate']
	>;
	statusPageSectionsRemove: BetterstackEndpoint<
		'statusPageSectionsRemove',
		BetterstackEndpointInputs['statusPageSectionsRemove']
	>;
	statusPageResourcesCreate: BetterstackEndpoint<
		'statusPageResourcesCreate',
		BetterstackEndpointInputs['statusPageResourcesCreate']
	>;
	statusPageResourcesGet: BetterstackEndpoint<
		'statusPageResourcesGet',
		BetterstackEndpointInputs['statusPageResourcesGet']
	>;
	statusPageResourcesList: BetterstackEndpoint<
		'statusPageResourcesList',
		BetterstackEndpointInputs['statusPageResourcesList']
	>;
	statusPageResourcesUpdate: BetterstackEndpoint<
		'statusPageResourcesUpdate',
		BetterstackEndpointInputs['statusPageResourcesUpdate']
	>;
	statusPageResourcesRemove: BetterstackEndpoint<
		'statusPageResourcesRemove',
		BetterstackEndpointInputs['statusPageResourcesRemove']
	>;
	statusPageReportsCreate: BetterstackEndpoint<
		'statusPageReportsCreate',
		BetterstackEndpointInputs['statusPageReportsCreate']
	>;
	statusPageReportsGet: BetterstackEndpoint<
		'statusPageReportsGet',
		BetterstackEndpointInputs['statusPageReportsGet']
	>;
	statusPageReportsList: BetterstackEndpoint<
		'statusPageReportsList',
		BetterstackEndpointInputs['statusPageReportsList']
	>;
	statusPageReportsUpdate: BetterstackEndpoint<
		'statusPageReportsUpdate',
		BetterstackEndpointInputs['statusPageReportsUpdate']
	>;
	statusPageReportsRemove: BetterstackEndpoint<
		'statusPageReportsRemove',
		BetterstackEndpointInputs['statusPageReportsRemove']
	>;
	statusUpdatesCreate: BetterstackEndpoint<
		'statusUpdatesCreate',
		BetterstackEndpointInputs['statusUpdatesCreate']
	>;
	statusUpdatesGet: BetterstackEndpoint<
		'statusUpdatesGet',
		BetterstackEndpointInputs['statusUpdatesGet']
	>;
	statusUpdatesList: BetterstackEndpoint<
		'statusUpdatesList',
		BetterstackEndpointInputs['statusUpdatesList']
	>;
	statusUpdatesUpdate: BetterstackEndpoint<
		'statusUpdatesUpdate',
		BetterstackEndpointInputs['statusUpdatesUpdate']
	>;
	statusUpdatesRemove: BetterstackEndpoint<
		'statusUpdatesRemove',
		BetterstackEndpointInputs['statusUpdatesRemove']
	>;
	statusPageGroupsCreate: BetterstackEndpoint<
		'statusPageGroupsCreate',
		BetterstackEndpointInputs['statusPageGroupsCreate']
	>;
	statusPageGroupsGet: BetterstackEndpoint<
		'statusPageGroupsGet',
		BetterstackEndpointInputs['statusPageGroupsGet']
	>;
	statusPageGroupsList: BetterstackEndpoint<
		'statusPageGroupsList',
		BetterstackEndpointInputs['statusPageGroupsList']
	>;
	statusPageGroupsUpdate: BetterstackEndpoint<
		'statusPageGroupsUpdate',
		BetterstackEndpointInputs['statusPageGroupsUpdate']
	>;
	statusPageGroupsRemove: BetterstackEndpoint<
		'statusPageGroupsRemove',
		BetterstackEndpointInputs['statusPageGroupsRemove']
	>;
	statusPageGroupsStatusPages: BetterstackEndpoint<
		'statusPageGroupsStatusPages',
		BetterstackEndpointInputs['statusPageGroupsStatusPages']
	>;
	metadataCreate: BetterstackEndpoint<
		'metadataCreate',
		BetterstackEndpointInputs['metadataCreate']
	>;
	metadataList: BetterstackEndpoint<
		'metadataList',
		BetterstackEndpointInputs['metadataList']
	>;
	outgoingWebhooksCreate: BetterstackEndpoint<
		'outgoingWebhooksCreate',
		BetterstackEndpointInputs['outgoingWebhooksCreate']
	>;
	outgoingWebhooksGet: BetterstackEndpoint<
		'outgoingWebhooksGet',
		BetterstackEndpointInputs['outgoingWebhooksGet']
	>;
	outgoingWebhooksList: BetterstackEndpoint<
		'outgoingWebhooksList',
		BetterstackEndpointInputs['outgoingWebhooksList']
	>;
	outgoingWebhooksUpdate: BetterstackEndpoint<
		'outgoingWebhooksUpdate',
		BetterstackEndpointInputs['outgoingWebhooksUpdate']
	>;
	outgoingWebhooksRemove: BetterstackEndpoint<
		'outgoingWebhooksRemove',
		BetterstackEndpointInputs['outgoingWebhooksRemove']
	>;
	sourceGroupsCreate: BetterstackEndpoint<
		'sourceGroupsCreate',
		BetterstackEndpointInputs['sourceGroupsCreate']
	>;
	sourceGroupsUpdate: BetterstackEndpoint<
		'sourceGroupsUpdate',
		BetterstackEndpointInputs['sourceGroupsUpdate']
	>;
	sourceGroupsRemove: BetterstackEndpoint<
		'sourceGroupsRemove',
		BetterstackEndpointInputs['sourceGroupsRemove']
	>;
	integrationsAwsCloudWatch: BetterstackEndpoint<
		'integrationsAwsCloudWatch',
		BetterstackEndpointInputs['integrationsAwsCloudWatch']
	>;
	integrationsAzure: BetterstackEndpoint<
		'integrationsAzure',
		BetterstackEndpointInputs['integrationsAzure']
	>;
	integrationsDatadog: BetterstackEndpoint<
		'integrationsDatadog',
		BetterstackEndpointInputs['integrationsDatadog']
	>;
	integrationsElastic: BetterstackEndpoint<
		'integrationsElastic',
		BetterstackEndpointInputs['integrationsElastic']
	>;
	integrationsEmail: BetterstackEndpoint<
		'integrationsEmail',
		BetterstackEndpointInputs['integrationsEmail']
	>;
	integrationsGoogleMonitoring: BetterstackEndpoint<
		'integrationsGoogleMonitoring',
		BetterstackEndpointInputs['integrationsGoogleMonitoring']
	>;
	integrationsGrafana: BetterstackEndpoint<
		'integrationsGrafana',
		BetterstackEndpointInputs['integrationsGrafana']
	>;
	integrationsJira: BetterstackEndpoint<
		'integrationsJira',
		BetterstackEndpointInputs['integrationsJira']
	>;
	integrationsNewRelic: BetterstackEndpoint<
		'integrationsNewRelic',
		BetterstackEndpointInputs['integrationsNewRelic']
	>;
	integrationsPagerDuty: BetterstackEndpoint<
		'integrationsPagerDuty',
		BetterstackEndpointInputs['integrationsPagerDuty']
	>;
	integrationsPrometheus: BetterstackEndpoint<
		'integrationsPrometheus',
		BetterstackEndpointInputs['integrationsPrometheus']
	>;
	integrationsSlack: BetterstackEndpoint<
		'integrationsSlack',
		BetterstackEndpointInputs['integrationsSlack']
	>;
	integrationsSplunkOnCall: BetterstackEndpoint<
		'integrationsSplunkOnCall',
		BetterstackEndpointInputs['integrationsSplunkOnCall']
	>;
	catalogRelations: BetterstackEndpoint<
		'catalogRelations',
		BetterstackEndpointInputs['catalogRelations']
	>;
	tokenDescribe: BetterstackEndpoint<
		'tokenDescribe',
		BetterstackEndpointInputs['tokenDescribe']
	>;
};

const betterstackEndpointsNested = {
	monitors: {
		create: Monitors.create,
		get: Monitors.get,
		list: Monitors.list,
		update: Monitors.update,
		remove: Monitors.remove,
		availability: Monitors.availability,
		responseTimes: Monitors.responseTimes,
	},
	monitorGroups: {
		create: MonitorGroups.create,
		get: MonitorGroups.get,
		list: MonitorGroups.list,
		update: MonitorGroups.update,
		remove: MonitorGroups.remove,
		monitors: MonitorGroups.monitors,
	},
	heartbeats: {
		create: Heartbeats.create,
		get: Heartbeats.get,
		list: Heartbeats.list,
		update: Heartbeats.update,
		remove: Heartbeats.remove,
		availability: Heartbeats.availability,
	},
	heartbeatGroups: {
		create: HeartbeatGroups.create,
		get: HeartbeatGroups.get,
		list: HeartbeatGroups.list,
		update: HeartbeatGroups.update,
		remove: HeartbeatGroups.remove,
	},
	incidents: {
		create: Incidents.create,
		get: Incidents.get,
		list: Incidents.list,
		remove: Incidents.remove,
		acknowledge: Incidents.acknowledge,
		resolve: Incidents.resolve,
		escalate: Incidents.escalate,
		timeline: Incidents.timeline,
	},
	incidentComments: {
		create: IncidentComments.create,
		get: IncidentComments.get,
		list: IncidentComments.list,
		update: IncidentComments.update,
		remove: IncidentComments.remove,
	},
	policies: {
		create: Policies.create,
		get: Policies.get,
		list: Policies.list,
		update: Policies.update,
		remove: Policies.remove,
	},
	policyGroups: {
		create: PolicyGroups.create,
		get: PolicyGroups.get,
		list: PolicyGroups.list,
		update: PolicyGroups.update,
		remove: PolicyGroups.remove,
	},
	onCalls: {
		create: OnCalls.create,
		get: OnCalls.get,
		list: OnCalls.list,
		update: OnCalls.update,
		remove: OnCalls.remove,
		events: OnCalls.events,
	},
	urgencies: {
		create: Urgencies.create,
		get: Urgencies.get,
		list: Urgencies.list,
		update: Urgencies.update,
		remove: Urgencies.remove,
	},
	urgencyGroups: {
		create: UrgencyGroups.create,
		get: UrgencyGroups.get,
		list: UrgencyGroups.list,
		update: UrgencyGroups.update,
		remove: UrgencyGroups.remove,
	},
	statusPages: {
		get: StatusPages.get,
		list: StatusPages.list,
		update: StatusPages.update,
	},
	statusPageSections: {
		create: StatusPageSections.create,
		get: StatusPageSections.get,
		list: StatusPageSections.list,
		update: StatusPageSections.update,
		remove: StatusPageSections.remove,
	},
	statusPageResources: {
		create: StatusPageResources.create,
		get: StatusPageResources.get,
		list: StatusPageResources.list,
		update: StatusPageResources.update,
		remove: StatusPageResources.remove,
	},
	statusPageReports: {
		create: StatusPageReports.create,
		get: StatusPageReports.get,
		list: StatusPageReports.list,
		update: StatusPageReports.update,
		remove: StatusPageReports.remove,
	},
	statusUpdates: {
		create: StatusUpdates.create,
		get: StatusUpdates.get,
		list: StatusUpdates.list,
		update: StatusUpdates.update,
		remove: StatusUpdates.remove,
	},
	statusPageGroups: {
		create: StatusPageGroups.create,
		get: StatusPageGroups.get,
		list: StatusPageGroups.list,
		update: StatusPageGroups.update,
		remove: StatusPageGroups.remove,
		statusPages: StatusPageGroups.statusPages,
	},
	metadata: {
		create: Metadata.create,
		list: Metadata.list,
	},
	outgoingWebhooks: {
		create: OutgoingWebhooks.create,
		get: OutgoingWebhooks.get,
		list: OutgoingWebhooks.list,
		update: OutgoingWebhooks.update,
		remove: OutgoingWebhooks.remove,
	},
	sourceGroups: {
		create: SourceGroups.create,
		update: SourceGroups.update,
		remove: SourceGroups.remove,
	},
	integrations: {
		awsCloudWatch: Integrations.awsCloudWatch,
		azure: Integrations.azure,
		datadog: Integrations.datadog,
		elastic: Integrations.elastic,
		email: Integrations.email,
		googleMonitoring: Integrations.googleMonitoring,
		grafana: Integrations.grafana,
		jira: Integrations.jira,
		newRelic: Integrations.newRelic,
		pagerDuty: Integrations.pagerDuty,
		prometheus: Integrations.prometheus,
		slack: Integrations.slack,
		splunkOnCall: Integrations.splunkOnCall,
	},
	catalog: {
		relations: Catalog.relations,
	},
	token: {
		describe: Token.describe,
	},
} as const;

export const betterstackEndpointSchemas = {
	'monitors.create': {
		input: BetterstackEndpointInputSchemas.monitorsCreate,
		output: BetterstackEndpointOutputSchemas.monitorsCreate,
	},
	'monitors.get': {
		input: BetterstackEndpointInputSchemas.monitorsGet,
		output: BetterstackEndpointOutputSchemas.monitorsGet,
	},
	'monitors.list': {
		input: BetterstackEndpointInputSchemas.monitorsList,
		output: BetterstackEndpointOutputSchemas.monitorsList,
	},
	'monitors.update': {
		input: BetterstackEndpointInputSchemas.monitorsUpdate,
		output: BetterstackEndpointOutputSchemas.monitorsUpdate,
	},
	'monitors.remove': {
		input: BetterstackEndpointInputSchemas.monitorsRemove,
		output: BetterstackEndpointOutputSchemas.monitorsRemove,
	},
	'monitors.availability': {
		input: BetterstackEndpointInputSchemas.monitorsAvailability,
		output: BetterstackEndpointOutputSchemas.monitorsAvailability,
	},
	'monitors.responseTimes': {
		input: BetterstackEndpointInputSchemas.monitorsResponseTimes,
		output: BetterstackEndpointOutputSchemas.monitorsResponseTimes,
	},
	'monitorGroups.create': {
		input: BetterstackEndpointInputSchemas.monitorGroupsCreate,
		output: BetterstackEndpointOutputSchemas.monitorGroupsCreate,
	},
	'monitorGroups.get': {
		input: BetterstackEndpointInputSchemas.monitorGroupsGet,
		output: BetterstackEndpointOutputSchemas.monitorGroupsGet,
	},
	'monitorGroups.list': {
		input: BetterstackEndpointInputSchemas.monitorGroupsList,
		output: BetterstackEndpointOutputSchemas.monitorGroupsList,
	},
	'monitorGroups.update': {
		input: BetterstackEndpointInputSchemas.monitorGroupsUpdate,
		output: BetterstackEndpointOutputSchemas.monitorGroupsUpdate,
	},
	'monitorGroups.remove': {
		input: BetterstackEndpointInputSchemas.monitorGroupsRemove,
		output: BetterstackEndpointOutputSchemas.monitorGroupsRemove,
	},
	'monitorGroups.monitors': {
		input: BetterstackEndpointInputSchemas.monitorGroupsMonitors,
		output: BetterstackEndpointOutputSchemas.monitorGroupsMonitors,
	},
	'heartbeats.create': {
		input: BetterstackEndpointInputSchemas.heartbeatsCreate,
		output: BetterstackEndpointOutputSchemas.heartbeatsCreate,
	},
	'heartbeats.get': {
		input: BetterstackEndpointInputSchemas.heartbeatsGet,
		output: BetterstackEndpointOutputSchemas.heartbeatsGet,
	},
	'heartbeats.list': {
		input: BetterstackEndpointInputSchemas.heartbeatsList,
		output: BetterstackEndpointOutputSchemas.heartbeatsList,
	},
	'heartbeats.update': {
		input: BetterstackEndpointInputSchemas.heartbeatsUpdate,
		output: BetterstackEndpointOutputSchemas.heartbeatsUpdate,
	},
	'heartbeats.remove': {
		input: BetterstackEndpointInputSchemas.heartbeatsRemove,
		output: BetterstackEndpointOutputSchemas.heartbeatsRemove,
	},
	'heartbeats.availability': {
		input: BetterstackEndpointInputSchemas.heartbeatsAvailability,
		output: BetterstackEndpointOutputSchemas.heartbeatsAvailability,
	},
	'heartbeatGroups.create': {
		input: BetterstackEndpointInputSchemas.heartbeatGroupsCreate,
		output: BetterstackEndpointOutputSchemas.heartbeatGroupsCreate,
	},
	'heartbeatGroups.get': {
		input: BetterstackEndpointInputSchemas.heartbeatGroupsGet,
		output: BetterstackEndpointOutputSchemas.heartbeatGroupsGet,
	},
	'heartbeatGroups.list': {
		input: BetterstackEndpointInputSchemas.heartbeatGroupsList,
		output: BetterstackEndpointOutputSchemas.heartbeatGroupsList,
	},
	'heartbeatGroups.update': {
		input: BetterstackEndpointInputSchemas.heartbeatGroupsUpdate,
		output: BetterstackEndpointOutputSchemas.heartbeatGroupsUpdate,
	},
	'heartbeatGroups.remove': {
		input: BetterstackEndpointInputSchemas.heartbeatGroupsRemove,
		output: BetterstackEndpointOutputSchemas.heartbeatGroupsRemove,
	},
	'incidents.create': {
		input: BetterstackEndpointInputSchemas.incidentsCreate,
		output: BetterstackEndpointOutputSchemas.incidentsCreate,
	},
	'incidents.get': {
		input: BetterstackEndpointInputSchemas.incidentsGet,
		output: BetterstackEndpointOutputSchemas.incidentsGet,
	},
	'incidents.list': {
		input: BetterstackEndpointInputSchemas.incidentsList,
		output: BetterstackEndpointOutputSchemas.incidentsList,
	},
	'incidents.remove': {
		input: BetterstackEndpointInputSchemas.incidentsRemove,
		output: BetterstackEndpointOutputSchemas.incidentsRemove,
	},
	'incidents.acknowledge': {
		input: BetterstackEndpointInputSchemas.incidentsAcknowledge,
		output: BetterstackEndpointOutputSchemas.incidentsAcknowledge,
	},
	'incidents.resolve': {
		input: BetterstackEndpointInputSchemas.incidentsResolve,
		output: BetterstackEndpointOutputSchemas.incidentsResolve,
	},
	'incidents.escalate': {
		input: BetterstackEndpointInputSchemas.incidentsEscalate,
		output: BetterstackEndpointOutputSchemas.incidentsEscalate,
	},
	'incidents.timeline': {
		input: BetterstackEndpointInputSchemas.incidentsTimeline,
		output: BetterstackEndpointOutputSchemas.incidentsTimeline,
	},
	'incidentComments.create': {
		input: BetterstackEndpointInputSchemas.incidentCommentsCreate,
		output: BetterstackEndpointOutputSchemas.incidentCommentsCreate,
	},
	'incidentComments.get': {
		input: BetterstackEndpointInputSchemas.incidentCommentsGet,
		output: BetterstackEndpointOutputSchemas.incidentCommentsGet,
	},
	'incidentComments.list': {
		input: BetterstackEndpointInputSchemas.incidentCommentsList,
		output: BetterstackEndpointOutputSchemas.incidentCommentsList,
	},
	'incidentComments.update': {
		input: BetterstackEndpointInputSchemas.incidentCommentsUpdate,
		output: BetterstackEndpointOutputSchemas.incidentCommentsUpdate,
	},
	'incidentComments.remove': {
		input: BetterstackEndpointInputSchemas.incidentCommentsRemove,
		output: BetterstackEndpointOutputSchemas.incidentCommentsRemove,
	},
	'policies.create': {
		input: BetterstackEndpointInputSchemas.policiesCreate,
		output: BetterstackEndpointOutputSchemas.policiesCreate,
	},
	'policies.get': {
		input: BetterstackEndpointInputSchemas.policiesGet,
		output: BetterstackEndpointOutputSchemas.policiesGet,
	},
	'policies.list': {
		input: BetterstackEndpointInputSchemas.policiesList,
		output: BetterstackEndpointOutputSchemas.policiesList,
	},
	'policies.update': {
		input: BetterstackEndpointInputSchemas.policiesUpdate,
		output: BetterstackEndpointOutputSchemas.policiesUpdate,
	},
	'policies.remove': {
		input: BetterstackEndpointInputSchemas.policiesRemove,
		output: BetterstackEndpointOutputSchemas.policiesRemove,
	},
	'policyGroups.create': {
		input: BetterstackEndpointInputSchemas.policyGroupsCreate,
		output: BetterstackEndpointOutputSchemas.policyGroupsCreate,
	},
	'policyGroups.get': {
		input: BetterstackEndpointInputSchemas.policyGroupsGet,
		output: BetterstackEndpointOutputSchemas.policyGroupsGet,
	},
	'policyGroups.list': {
		input: BetterstackEndpointInputSchemas.policyGroupsList,
		output: BetterstackEndpointOutputSchemas.policyGroupsList,
	},
	'policyGroups.update': {
		input: BetterstackEndpointInputSchemas.policyGroupsUpdate,
		output: BetterstackEndpointOutputSchemas.policyGroupsUpdate,
	},
	'policyGroups.remove': {
		input: BetterstackEndpointInputSchemas.policyGroupsRemove,
		output: BetterstackEndpointOutputSchemas.policyGroupsRemove,
	},
	'onCalls.create': {
		input: BetterstackEndpointInputSchemas.onCallsCreate,
		output: BetterstackEndpointOutputSchemas.onCallsCreate,
	},
	'onCalls.get': {
		input: BetterstackEndpointInputSchemas.onCallsGet,
		output: BetterstackEndpointOutputSchemas.onCallsGet,
	},
	'onCalls.list': {
		input: BetterstackEndpointInputSchemas.onCallsList,
		output: BetterstackEndpointOutputSchemas.onCallsList,
	},
	'onCalls.update': {
		input: BetterstackEndpointInputSchemas.onCallsUpdate,
		output: BetterstackEndpointOutputSchemas.onCallsUpdate,
	},
	'onCalls.remove': {
		input: BetterstackEndpointInputSchemas.onCallsRemove,
		output: BetterstackEndpointOutputSchemas.onCallsRemove,
	},
	'onCalls.events': {
		input: BetterstackEndpointInputSchemas.onCallsEvents,
		output: BetterstackEndpointOutputSchemas.onCallsEvents,
	},
	'urgencies.create': {
		input: BetterstackEndpointInputSchemas.urgenciesCreate,
		output: BetterstackEndpointOutputSchemas.urgenciesCreate,
	},
	'urgencies.get': {
		input: BetterstackEndpointInputSchemas.urgenciesGet,
		output: BetterstackEndpointOutputSchemas.urgenciesGet,
	},
	'urgencies.list': {
		input: BetterstackEndpointInputSchemas.urgenciesList,
		output: BetterstackEndpointOutputSchemas.urgenciesList,
	},
	'urgencies.update': {
		input: BetterstackEndpointInputSchemas.urgenciesUpdate,
		output: BetterstackEndpointOutputSchemas.urgenciesUpdate,
	},
	'urgencies.remove': {
		input: BetterstackEndpointInputSchemas.urgenciesRemove,
		output: BetterstackEndpointOutputSchemas.urgenciesRemove,
	},
	'urgencyGroups.create': {
		input: BetterstackEndpointInputSchemas.urgencyGroupsCreate,
		output: BetterstackEndpointOutputSchemas.urgencyGroupsCreate,
	},
	'urgencyGroups.get': {
		input: BetterstackEndpointInputSchemas.urgencyGroupsGet,
		output: BetterstackEndpointOutputSchemas.urgencyGroupsGet,
	},
	'urgencyGroups.list': {
		input: BetterstackEndpointInputSchemas.urgencyGroupsList,
		output: BetterstackEndpointOutputSchemas.urgencyGroupsList,
	},
	'urgencyGroups.update': {
		input: BetterstackEndpointInputSchemas.urgencyGroupsUpdate,
		output: BetterstackEndpointOutputSchemas.urgencyGroupsUpdate,
	},
	'urgencyGroups.remove': {
		input: BetterstackEndpointInputSchemas.urgencyGroupsRemove,
		output: BetterstackEndpointOutputSchemas.urgencyGroupsRemove,
	},
	'statusPages.get': {
		input: BetterstackEndpointInputSchemas.statusPagesGet,
		output: BetterstackEndpointOutputSchemas.statusPagesGet,
	},
	'statusPages.list': {
		input: BetterstackEndpointInputSchemas.statusPagesList,
		output: BetterstackEndpointOutputSchemas.statusPagesList,
	},
	'statusPages.update': {
		input: BetterstackEndpointInputSchemas.statusPagesUpdate,
		output: BetterstackEndpointOutputSchemas.statusPagesUpdate,
	},
	'statusPageSections.create': {
		input: BetterstackEndpointInputSchemas.statusPageSectionsCreate,
		output: BetterstackEndpointOutputSchemas.statusPageSectionsCreate,
	},
	'statusPageSections.get': {
		input: BetterstackEndpointInputSchemas.statusPageSectionsGet,
		output: BetterstackEndpointOutputSchemas.statusPageSectionsGet,
	},
	'statusPageSections.list': {
		input: BetterstackEndpointInputSchemas.statusPageSectionsList,
		output: BetterstackEndpointOutputSchemas.statusPageSectionsList,
	},
	'statusPageSections.update': {
		input: BetterstackEndpointInputSchemas.statusPageSectionsUpdate,
		output: BetterstackEndpointOutputSchemas.statusPageSectionsUpdate,
	},
	'statusPageSections.remove': {
		input: BetterstackEndpointInputSchemas.statusPageSectionsRemove,
		output: BetterstackEndpointOutputSchemas.statusPageSectionsRemove,
	},
	'statusPageResources.create': {
		input: BetterstackEndpointInputSchemas.statusPageResourcesCreate,
		output: BetterstackEndpointOutputSchemas.statusPageResourcesCreate,
	},
	'statusPageResources.get': {
		input: BetterstackEndpointInputSchemas.statusPageResourcesGet,
		output: BetterstackEndpointOutputSchemas.statusPageResourcesGet,
	},
	'statusPageResources.list': {
		input: BetterstackEndpointInputSchemas.statusPageResourcesList,
		output: BetterstackEndpointOutputSchemas.statusPageResourcesList,
	},
	'statusPageResources.update': {
		input: BetterstackEndpointInputSchemas.statusPageResourcesUpdate,
		output: BetterstackEndpointOutputSchemas.statusPageResourcesUpdate,
	},
	'statusPageResources.remove': {
		input: BetterstackEndpointInputSchemas.statusPageResourcesRemove,
		output: BetterstackEndpointOutputSchemas.statusPageResourcesRemove,
	},
	'statusPageReports.create': {
		input: BetterstackEndpointInputSchemas.statusPageReportsCreate,
		output: BetterstackEndpointOutputSchemas.statusPageReportsCreate,
	},
	'statusPageReports.get': {
		input: BetterstackEndpointInputSchemas.statusPageReportsGet,
		output: BetterstackEndpointOutputSchemas.statusPageReportsGet,
	},
	'statusPageReports.list': {
		input: BetterstackEndpointInputSchemas.statusPageReportsList,
		output: BetterstackEndpointOutputSchemas.statusPageReportsList,
	},
	'statusPageReports.update': {
		input: BetterstackEndpointInputSchemas.statusPageReportsUpdate,
		output: BetterstackEndpointOutputSchemas.statusPageReportsUpdate,
	},
	'statusPageReports.remove': {
		input: BetterstackEndpointInputSchemas.statusPageReportsRemove,
		output: BetterstackEndpointOutputSchemas.statusPageReportsRemove,
	},
	'statusUpdates.create': {
		input: BetterstackEndpointInputSchemas.statusUpdatesCreate,
		output: BetterstackEndpointOutputSchemas.statusUpdatesCreate,
	},
	'statusUpdates.get': {
		input: BetterstackEndpointInputSchemas.statusUpdatesGet,
		output: BetterstackEndpointOutputSchemas.statusUpdatesGet,
	},
	'statusUpdates.list': {
		input: BetterstackEndpointInputSchemas.statusUpdatesList,
		output: BetterstackEndpointOutputSchemas.statusUpdatesList,
	},
	'statusUpdates.update': {
		input: BetterstackEndpointInputSchemas.statusUpdatesUpdate,
		output: BetterstackEndpointOutputSchemas.statusUpdatesUpdate,
	},
	'statusUpdates.remove': {
		input: BetterstackEndpointInputSchemas.statusUpdatesRemove,
		output: BetterstackEndpointOutputSchemas.statusUpdatesRemove,
	},
	'statusPageGroups.create': {
		input: BetterstackEndpointInputSchemas.statusPageGroupsCreate,
		output: BetterstackEndpointOutputSchemas.statusPageGroupsCreate,
	},
	'statusPageGroups.get': {
		input: BetterstackEndpointInputSchemas.statusPageGroupsGet,
		output: BetterstackEndpointOutputSchemas.statusPageGroupsGet,
	},
	'statusPageGroups.list': {
		input: BetterstackEndpointInputSchemas.statusPageGroupsList,
		output: BetterstackEndpointOutputSchemas.statusPageGroupsList,
	},
	'statusPageGroups.update': {
		input: BetterstackEndpointInputSchemas.statusPageGroupsUpdate,
		output: BetterstackEndpointOutputSchemas.statusPageGroupsUpdate,
	},
	'statusPageGroups.remove': {
		input: BetterstackEndpointInputSchemas.statusPageGroupsRemove,
		output: BetterstackEndpointOutputSchemas.statusPageGroupsRemove,
	},
	'statusPageGroups.statusPages': {
		input: BetterstackEndpointInputSchemas.statusPageGroupsStatusPages,
		output: BetterstackEndpointOutputSchemas.statusPageGroupsStatusPages,
	},
	'metadata.create': {
		input: BetterstackEndpointInputSchemas.metadataCreate,
		output: BetterstackEndpointOutputSchemas.metadataCreate,
	},
	'metadata.list': {
		input: BetterstackEndpointInputSchemas.metadataList,
		output: BetterstackEndpointOutputSchemas.metadataList,
	},
	'outgoingWebhooks.create': {
		input: BetterstackEndpointInputSchemas.outgoingWebhooksCreate,
		output: BetterstackEndpointOutputSchemas.outgoingWebhooksCreate,
	},
	'outgoingWebhooks.get': {
		input: BetterstackEndpointInputSchemas.outgoingWebhooksGet,
		output: BetterstackEndpointOutputSchemas.outgoingWebhooksGet,
	},
	'outgoingWebhooks.list': {
		input: BetterstackEndpointInputSchemas.outgoingWebhooksList,
		output: BetterstackEndpointOutputSchemas.outgoingWebhooksList,
	},
	'outgoingWebhooks.update': {
		input: BetterstackEndpointInputSchemas.outgoingWebhooksUpdate,
		output: BetterstackEndpointOutputSchemas.outgoingWebhooksUpdate,
	},
	'outgoingWebhooks.remove': {
		input: BetterstackEndpointInputSchemas.outgoingWebhooksRemove,
		output: BetterstackEndpointOutputSchemas.outgoingWebhooksRemove,
	},
	'sourceGroups.create': {
		input: BetterstackEndpointInputSchemas.sourceGroupsCreate,
		output: BetterstackEndpointOutputSchemas.sourceGroupsCreate,
	},
	'sourceGroups.update': {
		input: BetterstackEndpointInputSchemas.sourceGroupsUpdate,
		output: BetterstackEndpointOutputSchemas.sourceGroupsUpdate,
	},
	'sourceGroups.remove': {
		input: BetterstackEndpointInputSchemas.sourceGroupsRemove,
		output: BetterstackEndpointOutputSchemas.sourceGroupsRemove,
	},
	'integrations.awsCloudWatch': {
		input: BetterstackEndpointInputSchemas.integrationsAwsCloudWatch,
		output: BetterstackEndpointOutputSchemas.integrationsAwsCloudWatch,
	},
	'integrations.azure': {
		input: BetterstackEndpointInputSchemas.integrationsAzure,
		output: BetterstackEndpointOutputSchemas.integrationsAzure,
	},
	'integrations.datadog': {
		input: BetterstackEndpointInputSchemas.integrationsDatadog,
		output: BetterstackEndpointOutputSchemas.integrationsDatadog,
	},
	'integrations.elastic': {
		input: BetterstackEndpointInputSchemas.integrationsElastic,
		output: BetterstackEndpointOutputSchemas.integrationsElastic,
	},
	'integrations.email': {
		input: BetterstackEndpointInputSchemas.integrationsEmail,
		output: BetterstackEndpointOutputSchemas.integrationsEmail,
	},
	'integrations.googleMonitoring': {
		input: BetterstackEndpointInputSchemas.integrationsGoogleMonitoring,
		output: BetterstackEndpointOutputSchemas.integrationsGoogleMonitoring,
	},
	'integrations.grafana': {
		input: BetterstackEndpointInputSchemas.integrationsGrafana,
		output: BetterstackEndpointOutputSchemas.integrationsGrafana,
	},
	'integrations.jira': {
		input: BetterstackEndpointInputSchemas.integrationsJira,
		output: BetterstackEndpointOutputSchemas.integrationsJira,
	},
	'integrations.newRelic': {
		input: BetterstackEndpointInputSchemas.integrationsNewRelic,
		output: BetterstackEndpointOutputSchemas.integrationsNewRelic,
	},
	'integrations.pagerDuty': {
		input: BetterstackEndpointInputSchemas.integrationsPagerDuty,
		output: BetterstackEndpointOutputSchemas.integrationsPagerDuty,
	},
	'integrations.prometheus': {
		input: BetterstackEndpointInputSchemas.integrationsPrometheus,
		output: BetterstackEndpointOutputSchemas.integrationsPrometheus,
	},
	'integrations.slack': {
		input: BetterstackEndpointInputSchemas.integrationsSlack,
		output: BetterstackEndpointOutputSchemas.integrationsSlack,
	},
	'integrations.splunkOnCall': {
		input: BetterstackEndpointInputSchemas.integrationsSplunkOnCall,
		output: BetterstackEndpointOutputSchemas.integrationsSplunkOnCall,
	},
	'catalog.relations': {
		input: BetterstackEndpointInputSchemas.catalogRelations,
		output: BetterstackEndpointOutputSchemas.catalogRelations,
	},
	'token.describe': {
		input: BetterstackEndpointInputSchemas.tokenDescribe,
		output: BetterstackEndpointOutputSchemas.tokenDescribe,
	},
} as const satisfies RequiredPluginEndpointSchemas<
	typeof betterstackEndpointsNested
>;

const defaultAuthType = 'api_key' as const;

const betterstackEndpointMeta = {
	'monitors.create': {
		riskLevel: 'write',
		description: 'Create a new uptime monitor for a URL or service',
	},
	'monitors.get': {
		riskLevel: 'read',
		description: 'Get a single monitor',
	},
	'monitors.list': {
		riskLevel: 'read',
		description: 'List all monitors',
	},
	'monitors.update': {
		riskLevel: 'write',
		description: 'Update an existing uptime monitor configuration',
	},
	'monitors.remove': {
		riskLevel: 'destructive',
		description: 'Permanently delete a monitor by ID from Better Stack Uptime',
	},
	'monitors.availability': {
		riskLevel: 'read',
		description: 'Return an availability summary for a specific monitor',
	},
	'monitors.responseTimes': {
		riskLevel: 'read',
		description:
			'Retrieves response time performance metrics for a specific uptime monitor',
	},
	'monitorGroups.create': {
		riskLevel: 'write',
		description: 'Create a new monitor group',
	},
	'monitorGroups.get': {
		riskLevel: 'read',
		description: 'Get a single monitor group by ID',
	},
	'monitorGroups.list': {
		riskLevel: 'read',
		description: 'List all monitor groups',
	},
	'monitorGroups.update': {
		riskLevel: 'write',
		description: "Updates an existing monitor group's properties",
	},
	'monitorGroups.remove': {
		riskLevel: 'destructive',
		description:
			'Permanently delete a monitor group by ID from Better Stack Uptime',
	},
	'monitorGroups.monitors': {
		riskLevel: 'read',
		description: 'Get all monitors belonging to a monitor group',
	},
	'heartbeats.create': {
		riskLevel: 'write',
		description:
			'Create a new heartbeat monitor for cron jobs and scheduled tasks',
	},
	'heartbeats.get': {
		riskLevel: 'read',
		description: 'Get a single heartbeat by ID',
	},
	'heartbeats.list': {
		riskLevel: 'read',
		description: 'List all heartbeats',
	},
	'heartbeats.update': {
		riskLevel: 'write',
		description: 'Update an existing heartbeat configuration',
	},
	'heartbeats.remove': {
		riskLevel: 'destructive',
		description: 'Permanently delete a heartbeat by ID',
	},
	'heartbeats.availability': {
		riskLevel: 'read',
		description: 'Retrieve availability summary for a specific heartbeat',
	},
	'heartbeatGroups.create': {
		riskLevel: 'write',
		description: 'Create a new heartbeat group',
	},
	'heartbeatGroups.get': {
		riskLevel: 'read',
		description: 'Get a single heartbeat group by ID',
	},
	'heartbeatGroups.list': {
		riskLevel: 'read',
		description: 'List all heartbeat groups',
	},
	'heartbeatGroups.update': {
		riskLevel: 'write',
		description: "Updates an existing heartbeat group's properties",
	},
	'heartbeatGroups.remove': {
		riskLevel: 'destructive',
		description: 'Permanently delete a heartbeat group by ID',
	},
	'incidents.create': {
		riskLevel: 'write',
		description: 'Create a new incident and alert the on-call person',
	},
	'incidents.get': {
		riskLevel: 'read',
		description:
			'Retrieve detailed information about a single incident by its ID',
	},
	'incidents.list': {
		riskLevel: 'read',
		description:
			'List all incidents with optional filtering by monitor, heartbeat, date range, or resolution status',
	},
	'incidents.remove': {
		riskLevel: 'destructive',
		description: 'Permanently delete an existing incident by ID',
	},
	'incidents.acknowledge': {
		riskLevel: 'write',
		description: 'Acknowledge an ongoing incident',
	},
	'incidents.resolve': {
		riskLevel: 'write',
		description: 'Resolve an ongoing incident',
	},
	'incidents.escalate': {
		riskLevel: 'write',
		description:
			'Escalate an ongoing incident to a user, team, schedule, policy, or organization',
	},
	'incidents.timeline': {
		riskLevel: 'read',
		description: 'Retrieve all timeline events for an incident',
	},
	'incidentComments.create': {
		riskLevel: 'write',
		description: 'Create a new comment on an incident',
	},
	'incidentComments.get': {
		riskLevel: 'read',
		description: 'Get a single comment from an incident',
	},
	'incidentComments.list': {
		riskLevel: 'read',
		description: 'List all comments on an incident',
	},
	'incidentComments.update': {
		riskLevel: 'write',
		description: 'Update an existing comment on an incident',
	},
	'incidentComments.remove': {
		riskLevel: 'destructive',
		description: 'Delete an existing comment from an incident',
	},
	'policies.create': {
		riskLevel: 'write',
		description: 'Creates a new escalation policy for incident management',
	},
	'policies.get': {
		riskLevel: 'read',
		description: 'Get a single escalation policy by its ID',
	},
	'policies.list': {
		riskLevel: 'read',
		description: 'List all escalation policies',
	},
	'policies.update': {
		riskLevel: 'write',
		description: 'Update an existing escalation policy',
	},
	'policies.remove': {
		riskLevel: 'destructive',
		description: 'Delete an escalation policy by ID',
	},
	'policyGroups.create': {
		riskLevel: 'write',
		description: 'Create a new escalation policy group',
	},
	'policyGroups.get': {
		riskLevel: 'read',
		description: 'Get a single escalation policy group',
	},
	'policyGroups.list': {
		riskLevel: 'read',
		description: 'List all escalation policy groups',
	},
	'policyGroups.update': {
		riskLevel: 'write',
		description: "Updates an existing escalation policy group's properties",
	},
	'policyGroups.remove': {
		riskLevel: 'destructive',
		description: 'Delete an escalation policy group by ID',
	},
	'onCalls.create': {
		riskLevel: 'write',
		description: 'Create a new on-call schedule',
	},
	'onCalls.get': {
		riskLevel: 'read',
		description: 'Get a single on-call schedule by ID',
	},
	'onCalls.list': {
		riskLevel: 'read',
		description: 'List all on-call schedules',
	},
	'onCalls.update': {
		riskLevel: 'write',
		description: "Update an on-call schedule's name",
	},
	'onCalls.remove': {
		riskLevel: 'destructive',
		description: 'Permanently delete an on-call schedule by ID',
	},
	'onCalls.events': {
		riskLevel: 'read',
		description: 'List all events for a specific on-call schedule',
	},
	'urgencies.create': {
		riskLevel: 'write',
		description:
			'Create a new severity level (urgency) for incident management',
	},
	'urgencies.get': {
		riskLevel: 'read',
		description: 'Get a single severity level (urgency) by ID',
	},
	'urgencies.list': {
		riskLevel: 'read',
		description: 'List all severity levels (urgencies)',
	},
	'urgencies.update': {
		riskLevel: 'write',
		description: 'Update an existing severity level (urgency) configuration',
	},
	'urgencies.remove': {
		riskLevel: 'destructive',
		description: 'Delete a severity (urgency) by ID',
	},
	'urgencyGroups.create': {
		riskLevel: 'write',
		description:
			'Create a new urgency group (severity group) for incident categorization',
	},
	'urgencyGroups.get': {
		riskLevel: 'read',
		description: 'Get a single urgency group (severity group) by ID',
	},
	'urgencyGroups.list': {
		riskLevel: 'read',
		description: 'List all urgency groups (severity groups)',
	},
	'urgencyGroups.update': {
		riskLevel: 'write',
		description: 'Update an existing urgency group (severity group)',
	},
	'urgencyGroups.remove': {
		riskLevel: 'destructive',
		description: 'Permanently delete an urgency group (severity group) by ID',
	},
	'statusPages.get': {
		riskLevel: 'read',
		description: 'Get a single status page by ID',
	},
	'statusPages.list': {
		riskLevel: 'read',
		description: 'List all your status pages',
	},
	'statusPages.update': {
		riskLevel: 'write',
		description: 'Update an existing status page configuration',
	},
	'statusPageSections.create': {
		riskLevel: 'write',
		description: 'Create a new section on a status page',
	},
	'statusPageSections.get': {
		riskLevel: 'read',
		description: 'Get a single status page section',
	},
	'statusPageSections.list': {
		riskLevel: 'read',
		description: 'List all sections of a specific status page',
	},
	'statusPageSections.update': {
		riskLevel: 'write',
		description: 'Update an existing status page section',
	},
	'statusPageSections.remove': {
		riskLevel: 'destructive',
		description: 'Permanently delete a status page section by ID',
	},
	'statusPageResources.create': {
		riskLevel: 'write',
		description: 'Create a new status page resource',
	},
	'statusPageResources.get': {
		riskLevel: 'read',
		description: 'Get a single status page resource by ID',
	},
	'statusPageResources.list': {
		riskLevel: 'read',
		description: 'List all resources on a status page',
	},
	'statusPageResources.update': {
		riskLevel: 'write',
		description: 'Update an existing status page resource',
	},
	'statusPageResources.remove': {
		riskLevel: 'destructive',
		description: 'Delete an existing resource from a status page',
	},
	'statusPageReports.create': {
		riskLevel: 'write',
		description: 'Create a new status page report (incident or maintenance)',
	},
	'statusPageReports.get': {
		riskLevel: 'read',
		description: 'Get a single status page report by ID',
	},
	'statusPageReports.list': {
		riskLevel: 'read',
		description: 'List all reports on a status page',
	},
	'statusPageReports.update': {
		riskLevel: 'write',
		description: 'Update an existing status page report',
	},
	'statusPageReports.remove': {
		riskLevel: 'destructive',
		description:
			'Permanently delete a status page report by ID from Better Stack Uptime',
	},
	'statusUpdates.create': {
		riskLevel: 'write',
		description: 'Create a new status update for an existing status report',
	},
	'statusUpdates.get': {
		riskLevel: 'read',
		description: 'Get a single status update by its ID',
	},
	'statusUpdates.list': {
		riskLevel: 'read',
		description: 'List all status updates for a status page report',
	},
	'statusUpdates.update': {
		riskLevel: 'write',
		description: 'Update an existing status update for a status report',
	},
	'statusUpdates.remove': {
		riskLevel: 'destructive',
		description: 'Delete an existing status update from a status report',
	},
	'statusPageGroups.create': {
		riskLevel: 'write',
		description: 'Create a new status page group',
	},
	'statusPageGroups.get': {
		riskLevel: 'read',
		description: 'Get a single status page group by ID',
	},
	'statusPageGroups.list': {
		riskLevel: 'read',
		description: 'List all status page groups',
	},
	'statusPageGroups.update': {
		riskLevel: 'write',
		description: 'Update an existing status page group',
	},
	'statusPageGroups.remove': {
		riskLevel: 'destructive',
		description: 'Delete a status page group by ID',
	},
	'statusPageGroups.statusPages': {
		riskLevel: 'read',
		description: 'List status pages within a specific status page group',
	},
	'metadata.create': {
		riskLevel: 'write',
		description: 'Create or update a metadata record for a resource',
	},
	'metadata.list': {
		riskLevel: 'read',
		description: 'List all existing metadata',
	},
	'outgoingWebhooks.create': {
		riskLevel: 'write',
		description: 'Create a new outgoing webhook integration',
	},
	'outgoingWebhooks.get': {
		riskLevel: 'read',
		description: 'Get a single outgoing webhook integration by ID',
	},
	'outgoingWebhooks.list': {
		riskLevel: 'read',
		description: 'List all outgoing webhook integrations',
	},
	'outgoingWebhooks.update': {
		riskLevel: 'write',
		description: 'Update an existing outgoing webhook integration',
	},
	'outgoingWebhooks.remove': {
		riskLevel: 'destructive',
		description: 'Delete an outgoing webhook integration by ID',
	},
	'sourceGroups.create': {
		riskLevel: 'write',
		description: 'Create a new source group',
	},
	'sourceGroups.update': {
		riskLevel: 'write',
		description:
			'Update an existing source group in Better Stack Logs/Telemetry',
	},
	'sourceGroups.remove': {
		riskLevel: 'destructive',
		description:
			'Permanently delete a source group by ID from Better Stack Telemetry (Logs)',
	},
	'integrations.awsCloudWatch': {
		riskLevel: 'read',
		description: 'List all AWS CloudWatch integrations',
	},
	'integrations.azure': {
		riskLevel: 'read',
		description: 'List all Azure integrations',
	},
	'integrations.datadog': {
		riskLevel: 'read',
		description: 'List all Datadog integrations',
	},
	'integrations.elastic': {
		riskLevel: 'read',
		description: 'List Elastic integrations',
	},
	'integrations.email': {
		riskLevel: 'read',
		description: 'List email integrations',
	},
	'integrations.googleMonitoring': {
		riskLevel: 'read',
		description: 'List all Google Monitoring integrations',
	},
	'integrations.grafana': {
		riskLevel: 'read',
		description: 'List all Grafana integrations',
	},
	'integrations.jira': {
		riskLevel: 'read',
		description: 'List all Jira integrations',
	},
	'integrations.newRelic': {
		riskLevel: 'read',
		description: 'List New Relic integrations',
	},
	'integrations.pagerDuty': {
		riskLevel: 'read',
		description: 'List PagerDuty integrations',
	},
	'integrations.prometheus': {
		riskLevel: 'read',
		description: 'List all Prometheus integrations',
	},
	'integrations.slack': {
		riskLevel: 'read',
		description: 'List all Slack integrations',
	},
	'integrations.splunkOnCall': {
		riskLevel: 'read',
		description: 'List all Splunk On-Call integrations',
	},
	'catalog.relations': {
		riskLevel: 'read',
		description: 'List all catalog relations',
	},
	'token.describe': {
		riskLevel: 'read',
		description: 'Retrieve the configured Uptime API token',
	},
} satisfies RequiredPluginEndpointMeta<typeof betterstackEndpointsNested>;

/**
 * One bearer token covers both hosts. The catalog claims the source-group
 * operations need a separate Telemetry token, but the Uptime token
 * authenticated `telemetry.betterstack.com` in the live probe on 2026-08-16,
 * so a single `api_key` is declared.
 */
export const betterstackAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;

/**
 * Operations that must never be retried after a network error. Corsair replays
 * the entire endpoint call on retry (packages/corsair/core/endpoints/bind.ts),
 * so replaying a create would duplicate the record. Listed explicitly rather
 * than matched by name pattern, and asserted against the registry in
 * endpoints.test.ts.
 */
export const BETTERSTACK_NON_IDEMPOTENT_OPERATIONS = [
	'monitors.create',
	'monitorGroups.create',
	'heartbeats.create',
	'heartbeatGroups.create',
	'incidents.create',
	'incidents.acknowledge',
	'incidents.resolve',
	'incidents.escalate',
	'incidentComments.create',
	'policies.create',
	'policyGroups.create',
	'onCalls.create',
	'urgencies.create',
	'urgencyGroups.create',
	'statusPageSections.create',
	'statusPageResources.create',
	'statusPageReports.create',
	'statusUpdates.create',
	'statusPageGroups.create',
	'metadata.create',
	'outgoingWebhooks.create',
	'sourceGroups.create',
] as const;

type BetterstackEndpoint<
	K extends keyof BetterstackEndpointOutputs,
	Input,
> = CorsairEndpoint<BetterstackContext, Input, BetterstackEndpointOutputs[K]>;

export type BetterstackBoundEndpoints = BindEndpoints<
	typeof betterstackEndpointsNested
>;

export type BetterstackPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalBetterstackPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof betterstackEndpointsNested>;
};

export type BetterstackContext = CorsairPluginContext<
	typeof BetterstackSchema,
	BetterstackPluginOptions
>;

export type BetterstackKeyBuilderContext =
	KeyBuilderContext<BetterstackPluginOptions>;

export type BaseBetterstackPlugin<T extends BetterstackPluginOptions> =
	CorsairPlugin<
		'betterstack',
		typeof BetterstackSchema,
		typeof betterstackEndpointsNested,
		Record<string, never>,
		T,
		typeof defaultAuthType
	>;

export type InternalBetterstackPlugin =
	BaseBetterstackPlugin<BetterstackPluginOptions>;

export type ExternalBetterstackPlugin<T extends BetterstackPluginOptions> =
	BaseBetterstackPlugin<T>;

export function betterstack<const T extends BetterstackPluginOptions>(
	incomingOptions: BetterstackPluginOptions &
		T = {} as BetterstackPluginOptions & T,
): ExternalBetterstackPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'betterstack',
		authConfig: betterstackAuthConfig,
		schema: BetterstackSchema,
		options: options,
		hooks: options.hooks,
		endpoints: betterstackEndpointsNested,
		webhooks: {},
		endpointMeta: betterstackEndpointMeta,
		endpointSchemas: betterstackEndpointSchemas,
		errorHandlers: {
			...errorHandlers,
			...options.errorHandlers,
		},
		keyBuilder: async (ctx: BetterstackKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}

			if (ctx.authType === 'api_key') {
				const res = await ctx.keys.get_api_key();

				if (!res) {
					throw new AuthMissingError('betterstack', 'api_key');
				}

				return res;
			}

			throw new AuthMissingError('betterstack', 'api_key');
		},
	} satisfies InternalBetterstackPlugin;
}

export {
	BETTERSTACK_TELEMETRY_BASE,
	BETTERSTACK_UPTIME_BASE,
} from './client';
export type {
	BetterstackEndpointInputs,
	BetterstackEndpointOutputs,
} from './endpoints/types';
export { formatBetterstackError } from './error-handlers';
export { BetterstackSchema } from './schema';
