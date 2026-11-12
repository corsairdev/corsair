import {
	aliasCreate,
	eventCreate,
	identityCreate,
	trackPage,
	trackScreen,
} from './events';
import {
	experimentsGet,
	experimentsList,
	featureFlagsGet,
	featureFlagsList,
	featureFlagsUpdate,
	surveysGet,
	surveysList,
} from './feature-management';
import {
	actionsList,
	annotationsCreate,
	annotationsList,
	cohortsList,
	dashboardsGet,
	dashboardsList,
	eventDefinitionsList,
	insightsGet,
	insightsList,
	personsGet,
	personsList,
	projectsGet,
	propertyDefinitionsList,
} from './product-analytics';
import { errorTrackingIssuesList, run } from './query';
import {
	get as sessionRecordingsGet,
	list as sessionRecordingsList,
} from './session-recordings';

export const Events = {
	aliasCreate,
	eventCreate,
	identityCreate,
	trackPage,
	trackScreen,
};

export const Query = { run };
export const Insights = { list: insightsList, get: insightsGet };
export const Dashboards = { list: dashboardsList, get: dashboardsGet };
export const Persons = { list: personsList, get: personsGet };
export const FeatureFlags = {
	list: featureFlagsList,
	get: featureFlagsGet,
	update: featureFlagsUpdate,
};
export const SessionRecordings = {
	list: sessionRecordingsList,
	get: sessionRecordingsGet,
};
export const ErrorTracking = { issuesList: errorTrackingIssuesList };
export const Experiments = { list: experimentsList, get: experimentsGet };
export const Surveys = { list: surveysList, get: surveysGet };
export const Cohorts = { list: cohortsList };
export const Actions = { list: actionsList };
export const Annotations = { list: annotationsList, create: annotationsCreate };
export const EventDefinitions = { list: eventDefinitionsList };
export const PropertyDefinitions = { list: propertyDefinitionsList };
export const Projects = { get: projectsGet };

export * from './types';
