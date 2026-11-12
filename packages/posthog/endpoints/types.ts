import { z } from 'zod';
import {
	ActionsListInputSchema,
	ActionsListResponseSchema,
	AnnotationSchema,
	AnnotationsCreateInputSchema,
	AnnotationsListInputSchema,
	AnnotationsListResponseSchema,
	CohortsListInputSchema,
	CohortsListResponseSchema,
	DashboardSchema,
	DashboardsGetInputSchema,
	DashboardsListInputSchema,
	DashboardsListResponseSchema,
	ErrorTrackingIssuesListInputSchema,
	ErrorTrackingIssuesListResponseSchema,
	EventDefinitionsListInputSchema,
	EventDefinitionsListResponseSchema,
	ExperimentSchema,
	ExperimentsGetInputSchema,
	ExperimentsListInputSchema,
	ExperimentsListResponseSchema,
	FeatureFlagSchema,
	FeatureFlagsGetInputSchema,
	FeatureFlagsListInputSchema,
	FeatureFlagsListResponseSchema,
	FeatureFlagsUpdateInputSchema,
	InsightSchema,
	InsightsGetInputSchema,
	InsightsListInputSchema,
	InsightsListResponseSchema,
	PersonSchema,
	PersonsGetInputSchema,
	PersonsListInputSchema,
	PersonsListResponseSchema,
	ProjectSchema,
	ProjectsGetInputSchema,
	PropertyDefinitionsListInputSchema,
	PropertyDefinitionsListResponseSchema,
	QueryRunInputSchema,
	QueryRunResponseSchema,
	SessionRecordingSchema,
	SessionRecordingsGetInputSchema,
	SessionRecordingsListInputSchema,
	SessionRecordingsListResponseSchema,
	SurveySchema,
	SurveysGetInputSchema,
	SurveysListInputSchema,
	SurveysListResponseSchema,
} from './read-types';

const AliasCreateInputSchema = z.object({
	distinct_id: z.string(),
	alias: z.string(),
});

const EventCreateInputSchema = z.object({
	distinct_id: z.string(),
	event: z.string(),
	properties: z.record(z.string(), z.unknown()).optional(),
	timestamp: z.string().optional(),
	uuid: z.string().optional(),
});

const IdentityCreateInputSchema = z.object({
	distinct_id: z.string(),
	properties: z.record(z.string(), z.unknown()).optional(),
});

const TrackPageInputSchema = z.object({
	distinct_id: z.string(),
	url: z.string(),
	properties: z.record(z.string(), z.unknown()).optional(),
	timestamp: z.string().optional(),
	uuid: z.string().optional(),
});

const TrackScreenInputSchema = z.object({
	distinct_id: z.string(),
	screen_name: z.string(),
	properties: z.record(z.string(), z.unknown()).optional(),
	timestamp: z.string().optional(),
	uuid: z.string().optional(),
});

export const PostHogEndpointInputSchemas = {
	aliasCreate: AliasCreateInputSchema,
	eventCreate: EventCreateInputSchema,
	identityCreate: IdentityCreateInputSchema,
	trackPage: TrackPageInputSchema,
	trackScreen: TrackScreenInputSchema,
	queryRun: QueryRunInputSchema,
	insightsList: InsightsListInputSchema,
	insightsGet: InsightsGetInputSchema,
	dashboardsList: DashboardsListInputSchema,
	dashboardsGet: DashboardsGetInputSchema,
	personsList: PersonsListInputSchema,
	personsGet: PersonsGetInputSchema,
	featureFlagsList: FeatureFlagsListInputSchema,
	featureFlagsGet: FeatureFlagsGetInputSchema,
	featureFlagsUpdate: FeatureFlagsUpdateInputSchema,
	sessionRecordingsList: SessionRecordingsListInputSchema,
	sessionRecordingsGet: SessionRecordingsGetInputSchema,
	errorTrackingIssuesList: ErrorTrackingIssuesListInputSchema,
	experimentsList: ExperimentsListInputSchema,
	experimentsGet: ExperimentsGetInputSchema,
	surveysList: SurveysListInputSchema,
	surveysGet: SurveysGetInputSchema,
	cohortsList: CohortsListInputSchema,
	actionsList: ActionsListInputSchema,
	annotationsList: AnnotationsListInputSchema,
	annotationsCreate: AnnotationsCreateInputSchema,
	eventDefinitionsList: EventDefinitionsListInputSchema,
	propertyDefinitionsList: PropertyDefinitionsListInputSchema,
	projectsGet: ProjectsGetInputSchema,
} as const;

export type PostHogEndpointInputs = {
	[K in keyof typeof PostHogEndpointInputSchemas]: z.infer<
		(typeof PostHogEndpointInputSchemas)[K]
	>;
};

const PostHogSuccessResponseSchema = z.union([
	z.number(),
	z.string(),
	z
		.object({
			status: z.union([z.number(), z.string()]).optional(),
			message: z.string().optional(),
		})
		.loose(),
	z.any(),
]);

export const PostHogEndpointOutputSchemas = {
	aliasCreate: PostHogSuccessResponseSchema,
	eventCreate: PostHogSuccessResponseSchema,
	identityCreate: PostHogSuccessResponseSchema,
	trackPage: PostHogSuccessResponseSchema,
	trackScreen: PostHogSuccessResponseSchema,
	queryRun: QueryRunResponseSchema,
	insightsList: InsightsListResponseSchema,
	insightsGet: InsightSchema,
	dashboardsList: DashboardsListResponseSchema,
	dashboardsGet: DashboardSchema,
	personsList: PersonsListResponseSchema,
	personsGet: PersonSchema,
	featureFlagsList: FeatureFlagsListResponseSchema,
	featureFlagsGet: FeatureFlagSchema,
	featureFlagsUpdate: FeatureFlagSchema,
	sessionRecordingsList: SessionRecordingsListResponseSchema,
	sessionRecordingsGet: SessionRecordingSchema,
	errorTrackingIssuesList: ErrorTrackingIssuesListResponseSchema,
	experimentsList: ExperimentsListResponseSchema,
	experimentsGet: ExperimentSchema,
	surveysList: SurveysListResponseSchema,
	surveysGet: SurveySchema,
	cohortsList: CohortsListResponseSchema,
	actionsList: ActionsListResponseSchema,
	annotationsList: AnnotationsListResponseSchema,
	annotationsCreate: AnnotationSchema,
	eventDefinitionsList: EventDefinitionsListResponseSchema,
	propertyDefinitionsList: PropertyDefinitionsListResponseSchema,
	projectsGet: ProjectSchema,
} as const;

export type PostHogEndpointOutputs = {
	[K in keyof typeof PostHogEndpointOutputSchemas]: z.infer<
		(typeof PostHogEndpointOutputSchemas)[K]
	>;
};

export type CreateAliasResponse = z.infer<
	typeof PostHogEndpointOutputSchemas.aliasCreate
>;
export type CreateEventResponse = z.infer<
	typeof PostHogEndpointOutputSchemas.eventCreate
>;
export type CreateIdentityResponse = z.infer<
	typeof PostHogEndpointOutputSchemas.identityCreate
>;
export type TrackPageResponse = z.infer<
	typeof PostHogEndpointOutputSchemas.trackPage
>;
export type TrackScreenResponse = z.infer<
	typeof PostHogEndpointOutputSchemas.trackScreen
>;

export type QueryRunResponse = PostHogEndpointOutputs['queryRun'];
export type Insight = PostHogEndpointOutputs['insightsGet'];
export type Dashboard = PostHogEndpointOutputs['dashboardsGet'];
export type Person = PostHogEndpointOutputs['personsGet'];
export type FeatureFlag = PostHogEndpointOutputs['featureFlagsGet'];
export type SessionRecording = PostHogEndpointOutputs['sessionRecordingsGet'];
export type ErrorTrackingIssuesListResponse =
	PostHogEndpointOutputs['errorTrackingIssuesList'];
export type Experiment = PostHogEndpointOutputs['experimentsGet'];
export type Survey = PostHogEndpointOutputs['surveysGet'];
export type Annotation = PostHogEndpointOutputs['annotationsCreate'];
export type Project = PostHogEndpointOutputs['projectsGet'];
