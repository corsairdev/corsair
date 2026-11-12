import {
	dashboardsCreate,
	dashboardsDelete,
	dashboardsGet,
	dashboardsList,
	dashboardsUpdate,
	insightsCreate,
	insightsDelete,
	insightsGet,
	insightsList,
	insightsUpdate,
} from './analytics';
import {
	actionsCreate,
	actionsGet,
	actionsList,
	alertsGet,
	alertsList,
	annotationsCreate,
	annotationsDelete,
	annotationsList,
	annotationsUpdate,
	eventDefinitionsList,
	notebooksCreate,
	notebooksGet,
	notebooksList,
	propertyDefinitionsList,
} from './data';
import {
	aliasCreate,
	eventCreate,
	identityCreate,
	trackPage,
	trackScreen,
} from './events';
import {
	earlyAccessFeaturesList,
	experimentsCreate,
	experimentsGet,
	experimentsList,
	experimentsUpdate,
	featureFlagsCreate,
	featureFlagsDelete,
	featureFlagsGet,
	featureFlagsList,
	featureFlagsUpdate,
	surveysCreate,
	surveysDelete,
	surveysGet,
	surveysList,
	surveysUpdate,
} from './features';
import {
	organizationsGet,
	organizationsList,
	projectsGet,
	projectsList,
} from './organization';
import {
	cohortsCreate,
	cohortsGet,
	cohortsList,
	cohortsUpdate,
	personsDeleteProperty,
	personsGet,
	personsList,
	personsUpdateProperty,
} from './people';
import {
	batchExportsList,
	hogFunctionsGet,
	hogFunctionsList,
	warehouseTablesList,
} from './pipelines';
import {
	errorTrackingIssuesList,
	eventsList,
	llmAnalyticsCosts,
	llmAnalyticsTraces,
	logsQuery,
	queryRun,
	webAnalyticsOverview,
	webAnalyticsStats,
} from './query';
import {
	sessionRecordingPlaylistsList,
	sessionRecordingsGet,
	sessionRecordingsList,
} from './recordings';

export const Events = {
	aliasCreate,
	eventCreate,
	identityCreate,
	trackPage,
	trackScreen,
	list: eventsList,
};

export const Organizations = {
	list: organizationsList,
	get: organizationsGet,
};

export const Projects = {
	list: projectsList,
	get: projectsGet,
};

export const Query = {
	run: queryRun,
};

export const ErrorTracking = {
	issuesList: errorTrackingIssuesList,
};

export const WebAnalytics = {
	overview: webAnalyticsOverview,
	stats: webAnalyticsStats,
};

export const LlmAnalytics = {
	traces: llmAnalyticsTraces,
	costs: llmAnalyticsCosts,
};

export const Logs = {
	query: logsQuery,
};

export const Insights = {
	list: insightsList,
	get: insightsGet,
	create: insightsCreate,
	update: insightsUpdate,
	delete: insightsDelete,
};

export const Dashboards = {
	list: dashboardsList,
	get: dashboardsGet,
	create: dashboardsCreate,
	update: dashboardsUpdate,
	delete: dashboardsDelete,
};

export const Persons = {
	list: personsList,
	get: personsGet,
	updateProperty: personsUpdateProperty,
	deleteProperty: personsDeleteProperty,
};

export const Cohorts = {
	list: cohortsList,
	get: cohortsGet,
	create: cohortsCreate,
	update: cohortsUpdate,
};

export const Actions = {
	list: actionsList,
	get: actionsGet,
	create: actionsCreate,
};

export const Annotations = {
	list: annotationsList,
	create: annotationsCreate,
	update: annotationsUpdate,
	delete: annotationsDelete,
};

export const EventDefinitions = {
	list: eventDefinitionsList,
};

export const PropertyDefinitions = {
	list: propertyDefinitionsList,
};

export const Notebooks = {
	list: notebooksList,
	get: notebooksGet,
	create: notebooksCreate,
};

export const Alerts = {
	list: alertsList,
	get: alertsGet,
};

export const FeatureFlags = {
	list: featureFlagsList,
	get: featureFlagsGet,
	create: featureFlagsCreate,
	update: featureFlagsUpdate,
	delete: featureFlagsDelete,
};

export const Experiments = {
	list: experimentsList,
	get: experimentsGet,
	create: experimentsCreate,
	update: experimentsUpdate,
};

export const Surveys = {
	list: surveysList,
	get: surveysGet,
	create: surveysCreate,
	update: surveysUpdate,
	delete: surveysDelete,
};

export const EarlyAccessFeatures = {
	list: earlyAccessFeaturesList,
};

export const SessionRecordings = {
	list: sessionRecordingsList,
	get: sessionRecordingsGet,
};

export const SessionRecordingPlaylists = {
	list: sessionRecordingPlaylistsList,
};

export const BatchExports = {
	list: batchExportsList,
};

export const HogFunctions = {
	list: hogFunctionsList,
	get: hogFunctionsGet,
};

export const WarehouseTables = {
	list: warehouseTablesList,
};

export * from './types';
