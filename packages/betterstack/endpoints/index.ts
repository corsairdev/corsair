import { relations as catalogRelations } from './catalog';
import {
	create as heartbeatGroupsCreate,
	get as heartbeatGroupsGet,
	list as heartbeatGroupsList,
	remove as heartbeatGroupsRemove,
	update as heartbeatGroupsUpdate,
} from './heartbeat-groups';
import {
	availability as heartbeatsAvailability,
	create as heartbeatsCreate,
	get as heartbeatsGet,
	list as heartbeatsList,
	remove as heartbeatsRemove,
	update as heartbeatsUpdate,
} from './heartbeats';
import {
	create as incidentCommentsCreate,
	get as incidentCommentsGet,
	list as incidentCommentsList,
	remove as incidentCommentsRemove,
	update as incidentCommentsUpdate,
} from './incident-comments';
import {
	acknowledge as incidentsAcknowledge,
	create as incidentsCreate,
	escalate as incidentsEscalate,
	get as incidentsGet,
	list as incidentsList,
	remove as incidentsRemove,
	resolve as incidentsResolve,
	timeline as incidentsTimeline,
} from './incidents';
import {
	awsCloudWatch as integrationsAwsCloudWatch,
	azure as integrationsAzure,
	datadog as integrationsDatadog,
	elastic as integrationsElastic,
	email as integrationsEmail,
	googleMonitoring as integrationsGoogleMonitoring,
	grafana as integrationsGrafana,
	jira as integrationsJira,
	newRelic as integrationsNewRelic,
	pagerDuty as integrationsPagerDuty,
	prometheus as integrationsPrometheus,
	slack as integrationsSlack,
	splunkOnCall as integrationsSplunkOnCall,
} from './integrations';
import { create as metadataCreate, list as metadataList } from './metadata';
import {
	create as monitorGroupsCreate,
	get as monitorGroupsGet,
	list as monitorGroupsList,
	monitors as monitorGroupsMonitors,
	remove as monitorGroupsRemove,
	update as monitorGroupsUpdate,
} from './monitor-groups';
import {
	availability as monitorsAvailability,
	create as monitorsCreate,
	get as monitorsGet,
	list as monitorsList,
	remove as monitorsRemove,
	responseTimes as monitorsResponseTimes,
	update as monitorsUpdate,
} from './monitors';
import {
	create as onCallsCreate,
	events as onCallsEvents,
	get as onCallsGet,
	list as onCallsList,
	remove as onCallsRemove,
	update as onCallsUpdate,
} from './on-calls';
import {
	create as outgoingWebhooksCreate,
	get as outgoingWebhooksGet,
	list as outgoingWebhooksList,
	remove as outgoingWebhooksRemove,
	update as outgoingWebhooksUpdate,
} from './outgoing-webhooks';
import {
	create as policiesCreate,
	get as policiesGet,
	list as policiesList,
	remove as policiesRemove,
	update as policiesUpdate,
} from './policies';
import {
	create as policyGroupsCreate,
	get as policyGroupsGet,
	list as policyGroupsList,
	remove as policyGroupsRemove,
	update as policyGroupsUpdate,
} from './policy-groups';
import {
	create as sourceGroupsCreate,
	remove as sourceGroupsRemove,
	update as sourceGroupsUpdate,
} from './source-groups';
import {
	create as statusPageGroupsCreate,
	get as statusPageGroupsGet,
	list as statusPageGroupsList,
	remove as statusPageGroupsRemove,
	statusPages as statusPageGroupsStatusPages,
	update as statusPageGroupsUpdate,
} from './status-page-groups';
import {
	create as statusPageReportsCreate,
	get as statusPageReportsGet,
	list as statusPageReportsList,
	remove as statusPageReportsRemove,
	update as statusPageReportsUpdate,
} from './status-page-reports';
import {
	create as statusPageResourcesCreate,
	get as statusPageResourcesGet,
	list as statusPageResourcesList,
	remove as statusPageResourcesRemove,
	update as statusPageResourcesUpdate,
} from './status-page-resources';
import {
	create as statusPageSectionsCreate,
	get as statusPageSectionsGet,
	list as statusPageSectionsList,
	remove as statusPageSectionsRemove,
	update as statusPageSectionsUpdate,
} from './status-page-sections';
import {
	get as statusPagesGet,
	list as statusPagesList,
	update as statusPagesUpdate,
} from './status-pages';
import {
	create as statusUpdatesCreate,
	get as statusUpdatesGet,
	list as statusUpdatesList,
	remove as statusUpdatesRemove,
	update as statusUpdatesUpdate,
} from './status-updates';
import { describe_ as tokenDescribe } from './token';
import {
	create as urgenciesCreate,
	get as urgenciesGet,
	list as urgenciesList,
	remove as urgenciesRemove,
	update as urgenciesUpdate,
} from './urgencies';
import {
	create as urgencyGroupsCreate,
	get as urgencyGroupsGet,
	list as urgencyGroupsList,
	remove as urgencyGroupsRemove,
	update as urgencyGroupsUpdate,
} from './urgency-groups';

export const Monitors = {
	create: monitorsCreate,
	get: monitorsGet,
	list: monitorsList,
	update: monitorsUpdate,
	remove: monitorsRemove,
	availability: monitorsAvailability,
	responseTimes: monitorsResponseTimes,
};

export const MonitorGroups = {
	create: monitorGroupsCreate,
	get: monitorGroupsGet,
	list: monitorGroupsList,
	update: monitorGroupsUpdate,
	remove: monitorGroupsRemove,
	monitors: monitorGroupsMonitors,
};

export const Heartbeats = {
	create: heartbeatsCreate,
	get: heartbeatsGet,
	list: heartbeatsList,
	update: heartbeatsUpdate,
	remove: heartbeatsRemove,
	availability: heartbeatsAvailability,
};

export const HeartbeatGroups = {
	create: heartbeatGroupsCreate,
	get: heartbeatGroupsGet,
	list: heartbeatGroupsList,
	update: heartbeatGroupsUpdate,
	remove: heartbeatGroupsRemove,
};

export const Incidents = {
	create: incidentsCreate,
	get: incidentsGet,
	list: incidentsList,
	remove: incidentsRemove,
	acknowledge: incidentsAcknowledge,
	resolve: incidentsResolve,
	escalate: incidentsEscalate,
	timeline: incidentsTimeline,
};

export const IncidentComments = {
	create: incidentCommentsCreate,
	get: incidentCommentsGet,
	list: incidentCommentsList,
	update: incidentCommentsUpdate,
	remove: incidentCommentsRemove,
};

export const Policies = {
	create: policiesCreate,
	get: policiesGet,
	list: policiesList,
	update: policiesUpdate,
	remove: policiesRemove,
};

export const PolicyGroups = {
	create: policyGroupsCreate,
	get: policyGroupsGet,
	list: policyGroupsList,
	update: policyGroupsUpdate,
	remove: policyGroupsRemove,
};

export const OnCalls = {
	create: onCallsCreate,
	get: onCallsGet,
	list: onCallsList,
	update: onCallsUpdate,
	remove: onCallsRemove,
	events: onCallsEvents,
};

export const Urgencies = {
	create: urgenciesCreate,
	get: urgenciesGet,
	list: urgenciesList,
	update: urgenciesUpdate,
	remove: urgenciesRemove,
};

export const UrgencyGroups = {
	create: urgencyGroupsCreate,
	get: urgencyGroupsGet,
	list: urgencyGroupsList,
	update: urgencyGroupsUpdate,
	remove: urgencyGroupsRemove,
};

export const StatusPages = {
	get: statusPagesGet,
	list: statusPagesList,
	update: statusPagesUpdate,
};

export const StatusPageSections = {
	create: statusPageSectionsCreate,
	get: statusPageSectionsGet,
	list: statusPageSectionsList,
	update: statusPageSectionsUpdate,
	remove: statusPageSectionsRemove,
};

export const StatusPageResources = {
	create: statusPageResourcesCreate,
	get: statusPageResourcesGet,
	list: statusPageResourcesList,
	update: statusPageResourcesUpdate,
	remove: statusPageResourcesRemove,
};

export const StatusPageReports = {
	create: statusPageReportsCreate,
	get: statusPageReportsGet,
	list: statusPageReportsList,
	update: statusPageReportsUpdate,
	remove: statusPageReportsRemove,
};

export const StatusUpdates = {
	create: statusUpdatesCreate,
	get: statusUpdatesGet,
	list: statusUpdatesList,
	update: statusUpdatesUpdate,
	remove: statusUpdatesRemove,
};

export const StatusPageGroups = {
	create: statusPageGroupsCreate,
	get: statusPageGroupsGet,
	list: statusPageGroupsList,
	update: statusPageGroupsUpdate,
	remove: statusPageGroupsRemove,
	statusPages: statusPageGroupsStatusPages,
};

export const Metadata = {
	create: metadataCreate,
	list: metadataList,
};

export const OutgoingWebhooks = {
	create: outgoingWebhooksCreate,
	get: outgoingWebhooksGet,
	list: outgoingWebhooksList,
	update: outgoingWebhooksUpdate,
	remove: outgoingWebhooksRemove,
};

export const SourceGroups = {
	create: sourceGroupsCreate,
	update: sourceGroupsUpdate,
	remove: sourceGroupsRemove,
};

export const Integrations = {
	awsCloudWatch: integrationsAwsCloudWatch,
	azure: integrationsAzure,
	datadog: integrationsDatadog,
	elastic: integrationsElastic,
	email: integrationsEmail,
	googleMonitoring: integrationsGoogleMonitoring,
	grafana: integrationsGrafana,
	jira: integrationsJira,
	newRelic: integrationsNewRelic,
	pagerDuty: integrationsPagerDuty,
	prometheus: integrationsPrometheus,
	slack: integrationsSlack,
	splunkOnCall: integrationsSplunkOnCall,
};

export const Catalog = {
	relations: catalogRelations,
};

export const Token = {
	describe: tokenDescribe,
};

export * from './types';
