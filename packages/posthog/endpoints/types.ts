import { z } from 'zod';
import {
	ActionSchema,
	ActionsListInputSchema,
	ActionsListResponseSchema,
	AlertSchema,
	AlertsGetInputSchema,
	AlertsListInputSchema,
	AlertsListResponseSchema,
	AnnotationSchema,
	AnnotationsCreateInputSchema,
	AnnotationsListInputSchema,
	AnnotationsListResponseSchema,
	BatchExportsListInputSchema,
	BatchExportsListResponseSchema,
	CohortSchema,
	CohortsListInputSchema,
	CohortsListResponseSchema,
	DashboardSchema,
	DashboardsGetInputSchema,
	DashboardsListInputSchema,
	DashboardsListResponseSchema,
	EarlyAccessFeaturesListInputSchema,
	EarlyAccessFeaturesListResponseSchema,
	ErrorTrackingIssuesListInputSchema,
	ErrorTrackingIssuesListResponseSchema,
	EventDefinitionsListInputSchema,
	EventDefinitionsListResponseSchema,
	EventsListInputSchema,
	ExperimentSchema,
	ExperimentsGetInputSchema,
	ExperimentsListInputSchema,
	ExperimentsListResponseSchema,
	FeatureFlagSchema,
	FeatureFlagsGetInputSchema,
	FeatureFlagsListInputSchema,
	FeatureFlagsListResponseSchema,
	FeatureFlagsUpdateInputSchema,
	HogFunctionSchema,
	HogFunctionsGetInputSchema,
	HogFunctionsListInputSchema,
	HogFunctionsListResponseSchema,
	InsightSchema,
	InsightsGetInputSchema,
	InsightsListInputSchema,
	InsightsListResponseSchema,
	LlmAnalyticsCostsInputSchema,
	LlmAnalyticsTracesInputSchema,
	LogsQueryInputSchema,
	LogsQueryResponseSchema,
	NotebookSchema,
	NotebooksGetInputSchema,
	NotebooksListInputSchema,
	NotebooksListResponseSchema,
	OrganizationSchema,
	OrganizationsGetInputSchema,
	OrganizationsListInputSchema,
	OrganizationsListResponseSchema,
	PersonSchema,
	PersonsGetInputSchema,
	PersonsListInputSchema,
	PersonsListResponseSchema,
	ProjectSchema,
	ProjectsGetInputSchema,
	ProjectsListInputSchema,
	ProjectsListResponseSchema,
	PropertyDefinitionsListInputSchema,
	PropertyDefinitionsListResponseSchema,
	QueryRunInputSchema,
	QueryRunResponseSchema,
	SessionRecordingPlaylistsListInputSchema,
	SessionRecordingPlaylistsListResponseSchema,
	SessionRecordingSchema,
	SessionRecordingsGetInputSchema,
	SessionRecordingsListInputSchema,
	SessionRecordingsListResponseSchema,
	SurveySchema,
	SurveysGetInputSchema,
	SurveysListInputSchema,
	SurveysListResponseSchema,
	WarehouseTablesListInputSchema,
	WarehouseTablesListResponseSchema,
	WebAnalyticsOverviewInputSchema,
	WebAnalyticsOverviewResponseSchema,
	WebAnalyticsStatsInputSchema,
} from './read-types';
import {
	ActionsCreateInputSchema,
	ActionsGetInputSchema,
	AnnotationsDeleteInputSchema,
	AnnotationsUpdateInputSchema,
	CohortsCreateInputSchema,
	CohortsGetInputSchema,
	CohortsUpdateInputSchema,
	DashboardsCreateInputSchema,
	DashboardsDeleteInputSchema,
	DashboardsUpdateInputSchema,
	DeletedResponseSchema,
	ExperimentsCreateInputSchema,
	ExperimentsUpdateInputSchema,
	FeatureFlagsCreateInputSchema,
	FeatureFlagsDeleteInputSchema,
	InsightsCreateInputSchema,
	InsightsDeleteInputSchema,
	InsightsUpdateInputSchema,
	NotebooksCreateInputSchema,
	PersonPropertyResponseSchema,
	PersonsDeletePropertyInputSchema,
	PersonsUpdatePropertyInputSchema,
	SurveysCreateInputSchema,
	SurveysDeleteInputSchema,
	SurveysUpdateInputSchema,
} from './write-types';

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
	organizationsList: OrganizationsListInputSchema,
	organizationsGet: OrganizationsGetInputSchema,
	projectsList: ProjectsListInputSchema,
	projectsGet: ProjectsGetInputSchema,
	queryRun: QueryRunInputSchema,
	eventsList: EventsListInputSchema,
	errorTrackingIssuesList: ErrorTrackingIssuesListInputSchema,
	webAnalyticsOverview: WebAnalyticsOverviewInputSchema,
	webAnalyticsStats: WebAnalyticsStatsInputSchema,
	llmAnalyticsTraces: LlmAnalyticsTracesInputSchema,
	llmAnalyticsCosts: LlmAnalyticsCostsInputSchema,
	logsQuery: LogsQueryInputSchema,
	insightsList: InsightsListInputSchema,
	insightsGet: InsightsGetInputSchema,
	insightsCreate: InsightsCreateInputSchema,
	insightsUpdate: InsightsUpdateInputSchema,
	insightsDelete: InsightsDeleteInputSchema,
	dashboardsList: DashboardsListInputSchema,
	dashboardsGet: DashboardsGetInputSchema,
	dashboardsCreate: DashboardsCreateInputSchema,
	dashboardsUpdate: DashboardsUpdateInputSchema,
	dashboardsDelete: DashboardsDeleteInputSchema,
	personsList: PersonsListInputSchema,
	personsGet: PersonsGetInputSchema,
	personsUpdateProperty: PersonsUpdatePropertyInputSchema,
	personsDeleteProperty: PersonsDeletePropertyInputSchema,
	cohortsList: CohortsListInputSchema,
	cohortsGet: CohortsGetInputSchema,
	cohortsCreate: CohortsCreateInputSchema,
	cohortsUpdate: CohortsUpdateInputSchema,
	actionsList: ActionsListInputSchema,
	actionsGet: ActionsGetInputSchema,
	actionsCreate: ActionsCreateInputSchema,
	annotationsList: AnnotationsListInputSchema,
	annotationsCreate: AnnotationsCreateInputSchema,
	annotationsUpdate: AnnotationsUpdateInputSchema,
	annotationsDelete: AnnotationsDeleteInputSchema,
	eventDefinitionsList: EventDefinitionsListInputSchema,
	propertyDefinitionsList: PropertyDefinitionsListInputSchema,
	notebooksList: NotebooksListInputSchema,
	notebooksGet: NotebooksGetInputSchema,
	notebooksCreate: NotebooksCreateInputSchema,
	alertsList: AlertsListInputSchema,
	alertsGet: AlertsGetInputSchema,
	featureFlagsList: FeatureFlagsListInputSchema,
	featureFlagsGet: FeatureFlagsGetInputSchema,
	featureFlagsCreate: FeatureFlagsCreateInputSchema,
	featureFlagsUpdate: FeatureFlagsUpdateInputSchema,
	featureFlagsDelete: FeatureFlagsDeleteInputSchema,
	experimentsList: ExperimentsListInputSchema,
	experimentsGet: ExperimentsGetInputSchema,
	experimentsCreate: ExperimentsCreateInputSchema,
	experimentsUpdate: ExperimentsUpdateInputSchema,
	surveysList: SurveysListInputSchema,
	surveysGet: SurveysGetInputSchema,
	surveysCreate: SurveysCreateInputSchema,
	surveysUpdate: SurveysUpdateInputSchema,
	surveysDelete: SurveysDeleteInputSchema,
	earlyAccessFeaturesList: EarlyAccessFeaturesListInputSchema,
	sessionRecordingsList: SessionRecordingsListInputSchema,
	sessionRecordingsGet: SessionRecordingsGetInputSchema,
	sessionRecordingPlaylistsList: SessionRecordingPlaylistsListInputSchema,
	batchExportsList: BatchExportsListInputSchema,
	hogFunctionsList: HogFunctionsListInputSchema,
	hogFunctionsGet: HogFunctionsGetInputSchema,
	warehouseTablesList: WarehouseTablesListInputSchema,
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
	organizationsList: OrganizationsListResponseSchema,
	organizationsGet: OrganizationSchema,
	projectsList: ProjectsListResponseSchema,
	projectsGet: ProjectSchema,
	queryRun: QueryRunResponseSchema,
	eventsList: QueryRunResponseSchema,
	errorTrackingIssuesList: ErrorTrackingIssuesListResponseSchema,
	webAnalyticsOverview: WebAnalyticsOverviewResponseSchema,
	webAnalyticsStats: QueryRunResponseSchema,
	llmAnalyticsTraces: QueryRunResponseSchema,
	llmAnalyticsCosts: QueryRunResponseSchema,
	logsQuery: LogsQueryResponseSchema,
	insightsList: InsightsListResponseSchema,
	insightsGet: InsightSchema,
	insightsCreate: InsightSchema,
	insightsUpdate: InsightSchema,
	insightsDelete: InsightSchema,
	dashboardsList: DashboardsListResponseSchema,
	dashboardsGet: DashboardSchema,
	dashboardsCreate: DashboardSchema,
	dashboardsUpdate: DashboardSchema,
	dashboardsDelete: DashboardSchema,
	personsList: PersonsListResponseSchema,
	personsGet: PersonSchema,
	personsUpdateProperty: PersonPropertyResponseSchema,
	personsDeleteProperty: PersonPropertyResponseSchema,
	cohortsList: CohortsListResponseSchema,
	cohortsGet: CohortSchema,
	cohortsCreate: CohortSchema,
	cohortsUpdate: CohortSchema,
	actionsList: ActionsListResponseSchema,
	actionsGet: ActionSchema,
	actionsCreate: ActionSchema,
	annotationsList: AnnotationsListResponseSchema,
	annotationsCreate: AnnotationSchema,
	annotationsUpdate: AnnotationSchema,
	annotationsDelete: AnnotationSchema,
	eventDefinitionsList: EventDefinitionsListResponseSchema,
	propertyDefinitionsList: PropertyDefinitionsListResponseSchema,
	notebooksList: NotebooksListResponseSchema,
	notebooksGet: NotebookSchema,
	notebooksCreate: NotebookSchema,
	alertsList: AlertsListResponseSchema,
	alertsGet: AlertSchema,
	featureFlagsList: FeatureFlagsListResponseSchema,
	featureFlagsGet: FeatureFlagSchema,
	featureFlagsCreate: FeatureFlagSchema,
	featureFlagsUpdate: FeatureFlagSchema,
	featureFlagsDelete: FeatureFlagSchema,
	experimentsList: ExperimentsListResponseSchema,
	experimentsGet: ExperimentSchema,
	experimentsCreate: ExperimentSchema,
	experimentsUpdate: ExperimentSchema,
	surveysList: SurveysListResponseSchema,
	surveysGet: SurveySchema,
	surveysCreate: SurveySchema,
	surveysUpdate: SurveySchema,
	surveysDelete: DeletedResponseSchema,
	earlyAccessFeaturesList: EarlyAccessFeaturesListResponseSchema,
	sessionRecordingsList: SessionRecordingsListResponseSchema,
	sessionRecordingsGet: SessionRecordingSchema,
	sessionRecordingPlaylistsList: SessionRecordingPlaylistsListResponseSchema,
	batchExportsList: BatchExportsListResponseSchema,
	hogFunctionsList: HogFunctionsListResponseSchema,
	hogFunctionsGet: HogFunctionSchema,
	warehouseTablesList: WarehouseTablesListResponseSchema,
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
export type Notebook = PostHogEndpointOutputs['notebooksGet'];
export type Organization = PostHogEndpointOutputs['organizationsGet'];
export type HogFunction = PostHogEndpointOutputs['hogFunctionsGet'];
export type LogsQueryResponse = PostHogEndpointOutputs['logsQuery'];
