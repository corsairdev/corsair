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
	AccessRoles,
	Account,
	Applications,
	ApplicationTemplates,
	ApprovalPolicies,
	AutomatedDocuments,
	BatchJobs,
	BatchMonitoring,
	BatchPredictions,
	Calendars,
	CatalogItems,
	ChangeRequests,
	CodeSnippets,
	Comments,
	ComplianceDocTemplates,
	Credentials,
	CustomApplicationSources,
	CustomApplications,
	CustomJobs,
	CustomModels,
	CustomTasks,
	DataEngineWorkspaceStates,
	DataSlices,
	DataStages,
	DatasetDefinitions,
	Datasets,
	DeletedCustomJobs,
	DeletedDeployments,
	DeletedProjects,
	Deployments,
	Entitlements,
	EntityNotificationChannels,
	EntityNotificationPolicies,
	EntityNotificationPolicyTemplates,
	EntityTags,
	EventLogs,
	ExecutionEnvironments,
	ExternalDataDrivers,
	ExternalDataSources,
	ExternalDataStores,
	ExternalOAuth,
	Files,
	Genai,
	Groups,
	GuardConfigurations,
	GuardTemplates,
	ImageAugmentationLists,
	Insights,
	Mlops,
	ModelPackages,
	NotebookCodeSnippets,
	NotebookEnvironmentVariables,
	NotebookExecutionEnvironments,
	NotebookJobs,
	NotebookRevisions,
	Notebooks,
	NotificationChannelTemplates,
	NotificationEvents,
	OcrJobResources,
	Organizations,
	Otel,
	PinnedUsecases,
	PredictionServers,
	Projects,
	Quotas,
	QuotaTemplates,
	Recipes,
	RegisteredModels,
	RelationshipsConfigurations,
	RemoteEvents,
	ScheduledJobs,
	SeatLicenseAllocations,
	SecureConfigs,
	SparkSessions,
	Status,
	StringEncryptions,
	Tenants,
	TenantUsageResources,
	UsageDataExports,
	UseCases,
	UseCasesWithShortenedInfo,
	UserBlueprints,
	UserNotifications,
	Users,
	ValueTrackers,
	Version,
} from './endpoints';
import type {
	DatarobotEndpointInputs,
	DatarobotEndpointOutputs,
} from './endpoints/types';
import {
	DatarobotEndpointInputSchemas,
	DatarobotEndpointOutputSchemas,
} from './endpoints/types';
import { errorHandlers } from './error-handlers';
import { DatarobotSchema } from './schema';

export type DatarobotPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	/** Regional or self-managed host, e.g. https://app.eu.datarobot.com */
	baseUrl?: string;
	hooks?: InternalDatarobotPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof datarobotEndpointsNested>;
};

export type DatarobotContext = CorsairPluginContext<
	typeof DatarobotSchema,
	DatarobotPluginOptions
>;

export type DatarobotKeyBuilderContext =
	KeyBuilderContext<DatarobotPluginOptions>;

export type DatarobotBoundEndpoints = BindEndpoints<
	typeof datarobotEndpointsNested
>;

type DatarobotEndpoint<K extends keyof DatarobotEndpointOutputs> =
	CorsairEndpoint<
		DatarobotContext,
		DatarobotEndpointInputs[K],
		DatarobotEndpointOutputs[K]
	>;

export type DatarobotEndpoints = {
	accessRolesCreate: DatarobotEndpoint<'accessRolesCreate'>;
	accessRolesDelete: DatarobotEndpoint<'accessRolesDelete'>;
	accessRolesList: DatarobotEndpoint<'accessRolesList'>;
	accessRolesPatch: DatarobotEndpoint<'accessRolesPatch'>;
	accessRolesRetrieve: DatarobotEndpoint<'accessRolesRetrieve'>;
	accessRolesUsersList: DatarobotEndpoint<'accessRolesUsersList'>;
	accountRateLimitUsageList: DatarobotEndpoint<'accountRateLimitUsageList'>;
	applicationTemplatesCloneCreate: DatarobotEndpoint<'applicationTemplatesCloneCreate'>;
	applicationTemplatesCreate: DatarobotEndpoint<'applicationTemplatesCreate'>;
	applicationTemplatesDelete: DatarobotEndpoint<'applicationTemplatesDelete'>;
	applicationTemplatesList: DatarobotEndpoint<'applicationTemplatesList'>;
	applicationTemplatesMediaCreate: DatarobotEndpoint<'applicationTemplatesMediaCreate'>;
	applicationTemplatesMediaDeleteMany: DatarobotEndpoint<'applicationTemplatesMediaDeleteMany'>;
	applicationTemplatesMediaList: DatarobotEndpoint<'applicationTemplatesMediaList'>;
	applicationTemplatesPatch: DatarobotEndpoint<'applicationTemplatesPatch'>;
	applicationTemplatesRepositoryUrlsList: DatarobotEndpoint<'applicationTemplatesRepositoryUrlsList'>;
	applicationUserRoleRetrieve: DatarobotEndpoint<'applicationUserRoleRetrieve'>;
	applicationsAccessControlList: DatarobotEndpoint<'applicationsAccessControlList'>;
	applicationsAccessControlPatchMany: DatarobotEndpoint<'applicationsAccessControlPatchMany'>;
	applicationsCreate: DatarobotEndpoint<'applicationsCreate'>;
	applicationsDelete: DatarobotEndpoint<'applicationsDelete'>;
	applicationsDeploymentsCreate: DatarobotEndpoint<'applicationsDeploymentsCreate'>;
	applicationsDeploymentsDelete: DatarobotEndpoint<'applicationsDeploymentsDelete'>;
	applicationsDuplicateCreate: DatarobotEndpoint<'applicationsDuplicateCreate'>;
	applicationsList: DatarobotEndpoint<'applicationsList'>;
	applicationsPatch: DatarobotEndpoint<'applicationsPatch'>;
	applicationsRetrieve: DatarobotEndpoint<'applicationsRetrieve'>;
	applicationsSharedRolesList: DatarobotEndpoint<'applicationsSharedRolesList'>;
	applicationsSharedRolesPatchMany: DatarobotEndpoint<'applicationsSharedRolesPatchMany'>;
	applicationsVerifyCreate: DatarobotEndpoint<'applicationsVerifyCreate'>;
	approvalPoliciesCreate: DatarobotEndpoint<'approvalPoliciesCreate'>;
	approvalPoliciesDelete: DatarobotEndpoint<'approvalPoliciesDelete'>;
	approvalPoliciesList: DatarobotEndpoint<'approvalPoliciesList'>;
	approvalPoliciesPut: DatarobotEndpoint<'approvalPoliciesPut'>;
	approvalPoliciesRetrieve: DatarobotEndpoint<'approvalPoliciesRetrieve'>;
	approvalPoliciesShareableChangeRequestsList: DatarobotEndpoint<'approvalPoliciesShareableChangeRequestsList'>;
	automatedDocumentsCreate: DatarobotEndpoint<'automatedDocumentsCreate'>;
	automatedDocumentsDelete: DatarobotEndpoint<'automatedDocumentsDelete'>;
	automatedDocumentsList: DatarobotEndpoint<'automatedDocumentsList'>;
	automatedDocumentsRetrieve: DatarobotEndpoint<'automatedDocumentsRetrieve'>;
	batchJobsCsvUploadPutMany: DatarobotEndpoint<'batchJobsCsvUploadPutMany'>;
	batchJobsDelete: DatarobotEndpoint<'batchJobsDelete'>;
	batchJobsDownloadList: DatarobotEndpoint<'batchJobsDownloadList'>;
	batchJobsFromJobDefinitionCreate: DatarobotEndpoint<'batchJobsFromJobDefinitionCreate'>;
	batchJobsList: DatarobotEndpoint<'batchJobsList'>;
	batchJobsRetrieve: DatarobotEndpoint<'batchJobsRetrieve'>;
	batchMonitoringCreate: DatarobotEndpoint<'batchMonitoringCreate'>;
	batchPredictionsCreate: DatarobotEndpoint<'batchPredictionsCreate'>;
	batchPredictionsCsvUploadFinalizeMultipartCreate: DatarobotEndpoint<'batchPredictionsCsvUploadFinalizeMultipartCreate'>;
	batchPredictionsCsvUploadPartPut: DatarobotEndpoint<'batchPredictionsCsvUploadPartPut'>;
	batchPredictionsCsvUploadPutMany: DatarobotEndpoint<'batchPredictionsCsvUploadPutMany'>;
	batchPredictionsDelete: DatarobotEndpoint<'batchPredictionsDelete'>;
	batchPredictionsDownloadList: DatarobotEndpoint<'batchPredictionsDownloadList'>;
	batchPredictionsFromExistingCreate: DatarobotEndpoint<'batchPredictionsFromExistingCreate'>;
	batchPredictionsFromJobDefinitionCreate: DatarobotEndpoint<'batchPredictionsFromJobDefinitionCreate'>;
	batchPredictionsList: DatarobotEndpoint<'batchPredictionsList'>;
	batchPredictionsPatch: DatarobotEndpoint<'batchPredictionsPatch'>;
	batchPredictionsRetrieve: DatarobotEndpoint<'batchPredictionsRetrieve'>;
	calendarsAccessControlList: DatarobotEndpoint<'calendarsAccessControlList'>;
	calendarsAccessControlPatchMany: DatarobotEndpoint<'calendarsAccessControlPatchMany'>;
	calendarsDelete: DatarobotEndpoint<'calendarsDelete'>;
	calendarsFileUploadCreate: DatarobotEndpoint<'calendarsFileUploadCreate'>;
	calendarsFromCountryCodeCreate: DatarobotEndpoint<'calendarsFromCountryCodeCreate'>;
	calendarsFromDatasetCreate: DatarobotEndpoint<'calendarsFromDatasetCreate'>;
	calendarsList: DatarobotEndpoint<'calendarsList'>;
	calendarsPatch: DatarobotEndpoint<'calendarsPatch'>;
	calendarsRetrieve: DatarobotEndpoint<'calendarsRetrieve'>;
	catalogItemsList: DatarobotEndpoint<'catalogItemsList'>;
	catalogItemsPatch: DatarobotEndpoint<'catalogItemsPatch'>;
	catalogItemsRetrieve: DatarobotEndpoint<'catalogItemsRetrieve'>;
	changeRequestsCreate: DatarobotEndpoint<'changeRequestsCreate'>;
	changeRequestsList: DatarobotEndpoint<'changeRequestsList'>;
	changeRequestsPatch: DatarobotEndpoint<'changeRequestsPatch'>;
	changeRequestsRequestReviewCreate: DatarobotEndpoint<'changeRequestsRequestReviewCreate'>;
	changeRequestsRetrieve: DatarobotEndpoint<'changeRequestsRetrieve'>;
	changeRequestsReviewsCreate: DatarobotEndpoint<'changeRequestsReviewsCreate'>;
	changeRequestsReviewsList: DatarobotEndpoint<'changeRequestsReviewsList'>;
	changeRequestsReviewsRetrieve: DatarobotEndpoint<'changeRequestsReviewsRetrieve'>;
	changeRequestsStatusPatchMany: DatarobotEndpoint<'changeRequestsStatusPatchMany'>;
	changeRequestsSuggestedReviewersList: DatarobotEndpoint<'changeRequestsSuggestedReviewersList'>;
	codeSnippetsCreate: DatarobotEndpoint<'codeSnippetsCreate'>;
	codeSnippetsDownloadCreate: DatarobotEndpoint<'codeSnippetsDownloadCreate'>;
	codeSnippetsList: DatarobotEndpoint<'codeSnippetsList'>;
	commentsCreate: DatarobotEndpoint<'commentsCreate'>;
	commentsDelete: DatarobotEndpoint<'commentsDelete'>;
	commentsList: DatarobotEndpoint<'commentsList'>;
	commentsPatch: DatarobotEndpoint<'commentsPatch'>;
	commentsRetrieve: DatarobotEndpoint<'commentsRetrieve'>;
	complianceDocTemplatesCreate: DatarobotEndpoint<'complianceDocTemplatesCreate'>;
	complianceDocTemplatesDefaultList: DatarobotEndpoint<'complianceDocTemplatesDefaultList'>;
	complianceDocTemplatesDelete: DatarobotEndpoint<'complianceDocTemplatesDelete'>;
	complianceDocTemplatesList: DatarobotEndpoint<'complianceDocTemplatesList'>;
	complianceDocTemplatesPatch: DatarobotEndpoint<'complianceDocTemplatesPatch'>;
	complianceDocTemplatesRetrieve: DatarobotEndpoint<'complianceDocTemplatesRetrieve'>;
	complianceDocTemplatesSharedRolesList: DatarobotEndpoint<'complianceDocTemplatesSharedRolesList'>;
	complianceDocTemplatesSharedRolesPatchMany: DatarobotEndpoint<'complianceDocTemplatesSharedRolesPatchMany'>;
	credentialsAssociationsListForCredential: DatarobotEndpoint<'credentialsAssociationsListForCredential'>;
	credentialsAssociationsListForObject: DatarobotEndpoint<'credentialsAssociationsListForObject'>;
	credentialsAssociationsPatchMany: DatarobotEndpoint<'credentialsAssociationsPatchMany'>;
	credentialsAssociationsPut: DatarobotEndpoint<'credentialsAssociationsPut'>;
	credentialsCreate: DatarobotEndpoint<'credentialsCreate'>;
	credentialsDelete: DatarobotEndpoint<'credentialsDelete'>;
	credentialsList: DatarobotEndpoint<'credentialsList'>;
	credentialsPatch: DatarobotEndpoint<'credentialsPatch'>;
	credentialsRetrieve: DatarobotEndpoint<'credentialsRetrieve'>;
	customApplicationSourcesCreate: DatarobotEndpoint<'customApplicationSourcesCreate'>;
	customApplicationSourcesDelete: DatarobotEndpoint<'customApplicationSourcesDelete'>;
	customApplicationSourcesFromCustomTemplateCreate: DatarobotEndpoint<'customApplicationSourcesFromCustomTemplateCreate'>;
	customApplicationSourcesList: DatarobotEndpoint<'customApplicationSourcesList'>;
	customApplicationSourcesPatch: DatarobotEndpoint<'customApplicationSourcesPatch'>;
	customApplicationSourcesRetrieve: DatarobotEndpoint<'customApplicationSourcesRetrieve'>;
	customApplicationSourcesSharedRolesList: DatarobotEndpoint<'customApplicationSourcesSharedRolesList'>;
	customApplicationSourcesSharedRolesPatchMany: DatarobotEndpoint<'customApplicationSourcesSharedRolesPatchMany'>;
	customApplicationSourcesVersionsArchiveList: DatarobotEndpoint<'customApplicationSourcesVersionsArchiveList'>;
	customApplicationSourcesVersionsCreate: DatarobotEndpoint<'customApplicationSourcesVersionsCreate'>;
	customApplicationSourcesVersionsDelete: DatarobotEndpoint<'customApplicationSourcesVersionsDelete'>;
	customApplicationSourcesVersionsFromCodespaceCreate: DatarobotEndpoint<'customApplicationSourcesVersionsFromCodespaceCreate'>;
	customApplicationSourcesVersionsItemsRetrieve: DatarobotEndpoint<'customApplicationSourcesVersionsItemsRetrieve'>;
	customApplicationSourcesVersionsList: DatarobotEndpoint<'customApplicationSourcesVersionsList'>;
	customApplicationSourcesVersionsPatch: DatarobotEndpoint<'customApplicationSourcesVersionsPatch'>;
	customApplicationSourcesVersionsRetrieve: DatarobotEndpoint<'customApplicationSourcesVersionsRetrieve'>;
	customApplicationSourcesVersionsToCodespaceCreate: DatarobotEndpoint<'customApplicationSourcesVersionsToCodespaceCreate'>;
	customApplicationsCreate: DatarobotEndpoint<'customApplicationsCreate'>;
	customApplicationsDelete: DatarobotEndpoint<'customApplicationsDelete'>;
	customApplicationsHistoryList: DatarobotEndpoint<'customApplicationsHistoryList'>;
	customApplicationsList: DatarobotEndpoint<'customApplicationsList'>;
	customApplicationsLogsList: DatarobotEndpoint<'customApplicationsLogsList'>;
	customApplicationsMigrateToWorkloadCreate: DatarobotEndpoint<'customApplicationsMigrateToWorkloadCreate'>;
	customApplicationsPatch: DatarobotEndpoint<'customApplicationsPatch'>;
	customApplicationsRetrieve: DatarobotEndpoint<'customApplicationsRetrieve'>;
	customApplicationsSharedRolesList: DatarobotEndpoint<'customApplicationsSharedRolesList'>;
	customApplicationsSharedRolesPatchMany: DatarobotEndpoint<'customApplicationsSharedRolesPatchMany'>;
	customApplicationsUsagesDownloadList: DatarobotEndpoint<'customApplicationsUsagesDownloadList'>;
	customApplicationsUsagesList: DatarobotEndpoint<'customApplicationsUsagesList'>;
	customJobsCreate: DatarobotEndpoint<'customJobsCreate'>;
	customJobsCustomMetricsDelete: DatarobotEndpoint<'customJobsCustomMetricsDelete'>;
	customJobsCustomMetricsList: DatarobotEndpoint<'customJobsCustomMetricsList'>;
	customJobsCustomMetricsPatch: DatarobotEndpoint<'customJobsCustomMetricsPatch'>;
	customJobsDelete: DatarobotEndpoint<'customJobsDelete'>;
	customJobsFromGalleryTemplateCreate: DatarobotEndpoint<'customJobsFromGalleryTemplateCreate'>;
	customJobsFromHostedCustomMetricGalleryTemplateCreate: DatarobotEndpoint<'customJobsFromHostedCustomMetricGalleryTemplateCreate'>;
	customJobsHostedCustomMetricTemplateCreate: DatarobotEndpoint<'customJobsHostedCustomMetricTemplateCreate'>;
	customJobsHostedCustomMetricTemplateList: DatarobotEndpoint<'customJobsHostedCustomMetricTemplateList'>;
	customJobsHostedCustomMetricTemplatePatchMany: DatarobotEndpoint<'customJobsHostedCustomMetricTemplatePatchMany'>;
	customJobsItemsRetrieve: DatarobotEndpoint<'customJobsItemsRetrieve'>;
	customJobsList: DatarobotEndpoint<'customJobsList'>;
	customJobsPatch: DatarobotEndpoint<'customJobsPatch'>;
	customJobsRetrieve: DatarobotEndpoint<'customJobsRetrieve'>;
	customJobsRunsCreate: DatarobotEndpoint<'customJobsRunsCreate'>;
	customJobsRunsDelete: DatarobotEndpoint<'customJobsRunsDelete'>;
	customJobsRunsItemsRetrieve: DatarobotEndpoint<'customJobsRunsItemsRetrieve'>;
	customJobsRunsList: DatarobotEndpoint<'customJobsRunsList'>;
	customJobsRunsLogsDeleteMany: DatarobotEndpoint<'customJobsRunsLogsDeleteMany'>;
	customJobsRunsLogsList: DatarobotEndpoint<'customJobsRunsLogsList'>;
	customJobsRunsPatch: DatarobotEndpoint<'customJobsRunsPatch'>;
	customJobsRunsRetrieve: DatarobotEndpoint<'customJobsRunsRetrieve'>;
	customJobsSharedRolesList: DatarobotEndpoint<'customJobsSharedRolesList'>;
	customJobsSharedRolesPatchMany: DatarobotEndpoint<'customJobsSharedRolesPatchMany'>;
	customModelsAccessControlList: DatarobotEndpoint<'customModelsAccessControlList'>;
	customModelsAccessControlPatchMany: DatarobotEndpoint<'customModelsAccessControlPatchMany'>;
	customModelsCreate: DatarobotEndpoint<'customModelsCreate'>;
	customModelsDelete: DatarobotEndpoint<'customModelsDelete'>;
	customModelsDownloadList: DatarobotEndpoint<'customModelsDownloadList'>;
	customModelsFromCustomModelCreate: DatarobotEndpoint<'customModelsFromCustomModelCreate'>;
	customModelsFromModelTemplateCreate: DatarobotEndpoint<'customModelsFromModelTemplateCreate'>;
	customModelsList: DatarobotEndpoint<'customModelsList'>;
	customModelsPatch: DatarobotEndpoint<'customModelsPatch'>;
	customModelsPredictionExplanationsInitializationCreate: DatarobotEndpoint<'customModelsPredictionExplanationsInitializationCreate'>;
	customModelsRetrieve: DatarobotEndpoint<'customModelsRetrieve'>;
	customModelsTrainingDataPatchMany: DatarobotEndpoint<'customModelsTrainingDataPatchMany'>;
	customModelsVersionCreateFromLatest: DatarobotEndpoint<'customModelsVersionCreateFromLatest'>;
	customModelsVersionsConversionsCreate: DatarobotEndpoint<'customModelsVersionsConversionsCreate'>;
	customModelsVersionsConversionsDelete: DatarobotEndpoint<'customModelsVersionsConversionsDelete'>;
	customModelsVersionsConversionsList: DatarobotEndpoint<'customModelsVersionsConversionsList'>;
	customModelsVersionsConversionsRetrieve: DatarobotEndpoint<'customModelsVersionsConversionsRetrieve'>;
	customModelsVersionsCreate: DatarobotEndpoint<'customModelsVersionsCreate'>;
	customModelsVersionsDependencyBuildCreate: DatarobotEndpoint<'customModelsVersionsDependencyBuildCreate'>;
	customModelsVersionsDependencyBuildDeleteMany: DatarobotEndpoint<'customModelsVersionsDependencyBuildDeleteMany'>;
	customModelsVersionsDependencyBuildList: DatarobotEndpoint<'customModelsVersionsDependencyBuildList'>;
	customModelsVersionsDependencyBuildLogList: DatarobotEndpoint<'customModelsVersionsDependencyBuildLogList'>;
	customModelsVersionsDownloadList: DatarobotEndpoint<'customModelsVersionsDownloadList'>;
	customModelsVersionsFeatureImpactCreate: DatarobotEndpoint<'customModelsVersionsFeatureImpactCreate'>;
	customModelsVersionsFeatureImpactList: DatarobotEndpoint<'customModelsVersionsFeatureImpactList'>;
	customModelsVersionsFromCodespaceCreate: DatarobotEndpoint<'customModelsVersionsFromCodespaceCreate'>;
	customModelsVersionsFromRepositoryCreate: DatarobotEndpoint<'customModelsVersionsFromRepositoryCreate'>;
	customModelsVersionsFromRepositoryPatchMany: DatarobotEndpoint<'customModelsVersionsFromRepositoryPatchMany'>;
	customModelsVersionsList: DatarobotEndpoint<'customModelsVersionsList'>;
	customModelsVersionsPatch: DatarobotEndpoint<'customModelsVersionsPatch'>;
	customModelsVersionsPredictionExplanationsInitializationCreate: DatarobotEndpoint<'customModelsVersionsPredictionExplanationsInitializationCreate'>;
	customModelsVersionsRetrieve: DatarobotEndpoint<'customModelsVersionsRetrieve'>;
	customModelsVersionsToCodespaceCreate: DatarobotEndpoint<'customModelsVersionsToCodespaceCreate'>;
	customModelsVersionsWithTrainingDataPatchMany: DatarobotEndpoint<'customModelsVersionsWithTrainingDataPatchMany'>;
	customTaskVersionCreateFromLatest: DatarobotEndpoint<'customTaskVersionCreateFromLatest'>;
	customTasksAccessControlList: DatarobotEndpoint<'customTasksAccessControlList'>;
	customTasksAccessControlPatchMany: DatarobotEndpoint<'customTasksAccessControlPatchMany'>;
	customTasksCreate: DatarobotEndpoint<'customTasksCreate'>;
	customTasksDelete: DatarobotEndpoint<'customTasksDelete'>;
	customTasksDownloadList: DatarobotEndpoint<'customTasksDownloadList'>;
	customTasksFromCustomTaskCreate: DatarobotEndpoint<'customTasksFromCustomTaskCreate'>;
	customTasksList: DatarobotEndpoint<'customTasksList'>;
	customTasksPatch: DatarobotEndpoint<'customTasksPatch'>;
	customTasksRetrieve: DatarobotEndpoint<'customTasksRetrieve'>;
	customTasksVersionsCreate: DatarobotEndpoint<'customTasksVersionsCreate'>;
	customTasksVersionsDependencyBuildCreate: DatarobotEndpoint<'customTasksVersionsDependencyBuildCreate'>;
	customTasksVersionsDependencyBuildDeleteMany: DatarobotEndpoint<'customTasksVersionsDependencyBuildDeleteMany'>;
	customTasksVersionsDependencyBuildList: DatarobotEndpoint<'customTasksVersionsDependencyBuildList'>;
	customTasksVersionsDependencyBuildLogList: DatarobotEndpoint<'customTasksVersionsDependencyBuildLogList'>;
	customTasksVersionsDownloadList: DatarobotEndpoint<'customTasksVersionsDownloadList'>;
	customTasksVersionsFromRepositoryCreate: DatarobotEndpoint<'customTasksVersionsFromRepositoryCreate'>;
	customTasksVersionsFromRepositoryPatchMany: DatarobotEndpoint<'customTasksVersionsFromRepositoryPatchMany'>;
	customTasksVersionsList: DatarobotEndpoint<'customTasksVersionsList'>;
	customTasksVersionsPatch: DatarobotEndpoint<'customTasksVersionsPatch'>;
	customTasksVersionsRetrieve: DatarobotEndpoint<'customTasksVersionsRetrieve'>;
	dataEngineWorkspaceStatesCreate: DatarobotEndpoint<'dataEngineWorkspaceStatesCreate'>;
	dataEngineWorkspaceStatesFromDataEngineQueryGeneratorCreate: DatarobotEndpoint<'dataEngineWorkspaceStatesFromDataEngineQueryGeneratorCreate'>;
	dataEngineWorkspaceStatesRetrieve: DatarobotEndpoint<'dataEngineWorkspaceStatesRetrieve'>;
	dataSlicesCreate: DatarobotEndpoint<'dataSlicesCreate'>;
	dataSlicesDelete: DatarobotEndpoint<'dataSlicesDelete'>;
	dataSlicesDeleteMany: DatarobotEndpoint<'dataSlicesDeleteMany'>;
	dataSlicesRetrieve: DatarobotEndpoint<'dataSlicesRetrieve'>;
	dataSlicesSliceSizesCreate: DatarobotEndpoint<'dataSlicesSliceSizesCreate'>;
	dataSlicesSliceSizesList: DatarobotEndpoint<'dataSlicesSliceSizesList'>;
	dataStagesCreate: DatarobotEndpoint<'dataStagesCreate'>;
	dataStagesFinalizeCreate: DatarobotEndpoint<'dataStagesFinalizeCreate'>;
	dataStagesPartsPut: DatarobotEndpoint<'dataStagesPartsPut'>;
	datasetDefinitionsAnalyzeCreate: DatarobotEndpoint<'datasetDefinitionsAnalyzeCreate'>;
	datasetDefinitionsChunkDefinitionsAnalyzeCreate: DatarobotEndpoint<'datasetDefinitionsChunkDefinitionsAnalyzeCreate'>;
	datasetDefinitionsChunkDefinitionsCreate: DatarobotEndpoint<'datasetDefinitionsChunkDefinitionsCreate'>;
	datasetDefinitionsChunkDefinitionsDelete: DatarobotEndpoint<'datasetDefinitionsChunkDefinitionsDelete'>;
	datasetDefinitionsChunkDefinitionsList: DatarobotEndpoint<'datasetDefinitionsChunkDefinitionsList'>;
	datasetDefinitionsChunkDefinitionsPatch: DatarobotEndpoint<'datasetDefinitionsChunkDefinitionsPatch'>;
	datasetDefinitionsChunkDefinitionsRetrieve: DatarobotEndpoint<'datasetDefinitionsChunkDefinitionsRetrieve'>;
	datasetDefinitionsCreate: DatarobotEndpoint<'datasetDefinitionsCreate'>;
	datasetDefinitionsDelete: DatarobotEndpoint<'datasetDefinitionsDelete'>;
	datasetDefinitionsList: DatarobotEndpoint<'datasetDefinitionsList'>;
	datasetDefinitionsRetrieve: DatarobotEndpoint<'datasetDefinitionsRetrieve'>;
	datasetDefinitionsVersionsList: DatarobotEndpoint<'datasetDefinitionsVersionsList'>;
	datasetsAccessControlList: DatarobotEndpoint<'datasetsAccessControlList'>;
	datasetsAccessControlPatchMany: DatarobotEndpoint<'datasetsAccessControlPatchMany'>;
	datasetsAllFeaturesDetailsList: DatarobotEndpoint<'datasetsAllFeaturesDetailsList'>;
	datasetsDelete: DatarobotEndpoint<'datasetsDelete'>;
	datasetsDeletedPatchMany: DatarobotEndpoint<'datasetsDeletedPatchMany'>;
	datasetsDocumentsDataQualityLogFileList: DatarobotEndpoint<'datasetsDocumentsDataQualityLogFileList'>;
	datasetsDocumentsDataQualityLogList: DatarobotEndpoint<'datasetsDocumentsDataQualityLogList'>;
	datasetsFeatureHistogramsRetrieve: DatarobotEndpoint<'datasetsFeatureHistogramsRetrieve'>;
	datasetsFeatureTransformsCreate: DatarobotEndpoint<'datasetsFeatureTransformsCreate'>;
	datasetsFeatureTransformsList: DatarobotEndpoint<'datasetsFeatureTransformsList'>;
	datasetsFeatureTransformsRetrieve: DatarobotEndpoint<'datasetsFeatureTransformsRetrieve'>;
	datasetsFeaturelistsCreate: DatarobotEndpoint<'datasetsFeaturelistsCreate'>;
	datasetsFeaturelistsDelete: DatarobotEndpoint<'datasetsFeaturelistsDelete'>;
	datasetsFeaturelistsList: DatarobotEndpoint<'datasetsFeaturelistsList'>;
	datasetsFeaturelistsPatch: DatarobotEndpoint<'datasetsFeaturelistsPatch'>;
	datasetsFeaturelistsRetrieve: DatarobotEndpoint<'datasetsFeaturelistsRetrieve'>;
	datasetsFileList: DatarobotEndpoint<'datasetsFileList'>;
	datasetsFromDataEngineWorkspaceStateCreate: DatarobotEndpoint<'datasetsFromDataEngineWorkspaceStateCreate'>;
	datasetsFromDataSourceCreate: DatarobotEndpoint<'datasetsFromDataSourceCreate'>;
	datasetsFromFileCreate: DatarobotEndpoint<'datasetsFromFileCreate'>;
	datasetsFromHDFSCreate: DatarobotEndpoint<'datasetsFromHDFSCreate'>;
	datasetsFromRecipeCreate: DatarobotEndpoint<'datasetsFromRecipeCreate'>;
	datasetsFromStageCreate: DatarobotEndpoint<'datasetsFromStageCreate'>;
	datasetsFromURLCreate: DatarobotEndpoint<'datasetsFromURLCreate'>;
	datasetsImagesDataQualityLogFileList: DatarobotEndpoint<'datasetsImagesDataQualityLogFileList'>;
	datasetsImagesDataQualityLogList: DatarobotEndpoint<'datasetsImagesDataQualityLogList'>;
	datasetsList: DatarobotEndpoint<'datasetsList'>;
	datasetsPatch: DatarobotEndpoint<'datasetsPatch'>;
	datasetsPatchMany: DatarobotEndpoint<'datasetsPatchMany'>;
	datasetsPermissionsList: DatarobotEndpoint<'datasetsPermissionsList'>;
	datasetsProjectsList: DatarobotEndpoint<'datasetsProjectsList'>;
	datasetsRefreshJobsCreate: DatarobotEndpoint<'datasetsRefreshJobsCreate'>;
	datasetsRefreshJobsDelete: DatarobotEndpoint<'datasetsRefreshJobsDelete'>;
	datasetsRefreshJobsExecutionResultsList: DatarobotEndpoint<'datasetsRefreshJobsExecutionResultsList'>;
	datasetsRefreshJobsList: DatarobotEndpoint<'datasetsRefreshJobsList'>;
	datasetsRefreshJobsPatch: DatarobotEndpoint<'datasetsRefreshJobsPatch'>;
	datasetsRefreshJobsRetrieve: DatarobotEndpoint<'datasetsRefreshJobsRetrieve'>;
	datasetsRelationshipsCreate: DatarobotEndpoint<'datasetsRelationshipsCreate'>;
	datasetsRelationshipsDelete: DatarobotEndpoint<'datasetsRelationshipsDelete'>;
	datasetsRelationshipsList: DatarobotEndpoint<'datasetsRelationshipsList'>;
	datasetsRelationshipsPatch: DatarobotEndpoint<'datasetsRelationshipsPatch'>;
	datasetsRetrieve: DatarobotEndpoint<'datasetsRetrieve'>;
	datasetsSharedRolesList: DatarobotEndpoint<'datasetsSharedRolesList'>;
	datasetsSharedRolesPatchMany: DatarobotEndpoint<'datasetsSharedRolesPatchMany'>;
	datasetsVersionsAllFeaturesDetailsList: DatarobotEndpoint<'datasetsVersionsAllFeaturesDetailsList'>;
	datasetsVersionsDelete: DatarobotEndpoint<'datasetsVersionsDelete'>;
	datasetsVersionsDeletedPatchMany: DatarobotEndpoint<'datasetsVersionsDeletedPatchMany'>;
	datasetsVersionsDocumentsDataQualityLogFileList: DatarobotEndpoint<'datasetsVersionsDocumentsDataQualityLogFileList'>;
	datasetsVersionsDocumentsDataQualityLogList: DatarobotEndpoint<'datasetsVersionsDocumentsDataQualityLogList'>;
	datasetsVersionsFeatureHistogramsRetrieve: DatarobotEndpoint<'datasetsVersionsFeatureHistogramsRetrieve'>;
	datasetsVersionsFeaturelistsList: DatarobotEndpoint<'datasetsVersionsFeaturelistsList'>;
	datasetsVersionsFeaturelistsRetrieve: DatarobotEndpoint<'datasetsVersionsFeaturelistsRetrieve'>;
	datasetsVersionsFileList: DatarobotEndpoint<'datasetsVersionsFileList'>;
	datasetsVersionsFromDataEngineWorkspaceStateCreate: DatarobotEndpoint<'datasetsVersionsFromDataEngineWorkspaceStateCreate'>;
	datasetsVersionsFromDataSourceCreate: DatarobotEndpoint<'datasetsVersionsFromDataSourceCreate'>;
	datasetsVersionsFromFileCreate: DatarobotEndpoint<'datasetsVersionsFromFileCreate'>;
	datasetsVersionsFromHDFSCreate: DatarobotEndpoint<'datasetsVersionsFromHDFSCreate'>;
	datasetsVersionsFromLatestVersionCreate: DatarobotEndpoint<'datasetsVersionsFromLatestVersionCreate'>;
	datasetsVersionsFromRecipeCreate: DatarobotEndpoint<'datasetsVersionsFromRecipeCreate'>;
	datasetsVersionsFromStageCreate: DatarobotEndpoint<'datasetsVersionsFromStageCreate'>;
	datasetsVersionsFromURLCreate: DatarobotEndpoint<'datasetsVersionsFromURLCreate'>;
	datasetsVersionsFromVersionCreate: DatarobotEndpoint<'datasetsVersionsFromVersionCreate'>;
	datasetsVersionsList: DatarobotEndpoint<'datasetsVersionsList'>;
	datasetsVersionsProjectsList: DatarobotEndpoint<'datasetsVersionsProjectsList'>;
	datasetsVersionsRetrieve: DatarobotEndpoint<'datasetsVersionsRetrieve'>;
	deletedCustomJobsList: DatarobotEndpoint<'deletedCustomJobsList'>;
	deletedDeploymentsList: DatarobotEndpoint<'deletedDeploymentsList'>;
	deletedDeploymentsPatchMany: DatarobotEndpoint<'deletedDeploymentsPatchMany'>;
	deletedProjectsList: DatarobotEndpoint<'deletedProjectsList'>;
	deletedProjectsPatch: DatarobotEndpoint<'deletedProjectsPatch'>;
	deploymentsAccuracyList: DatarobotEndpoint<'deploymentsAccuracyList'>;
	deploymentsAccuracyMetricsList: DatarobotEndpoint<'deploymentsAccuracyMetricsList'>;
	deploymentsAccuracyMetricsPutMany: DatarobotEndpoint<'deploymentsAccuracyMetricsPutMany'>;
	deploymentsAccuracyOverBatchList: DatarobotEndpoint<'deploymentsAccuracyOverBatchList'>;
	deploymentsAccuracyOverSpaceList: DatarobotEndpoint<'deploymentsAccuracyOverSpaceList'>;
	deploymentsAccuracyOverTimeList: DatarobotEndpoint<'deploymentsAccuracyOverTimeList'>;
	deploymentsActualsDataExportsCreate: DatarobotEndpoint<'deploymentsActualsDataExportsCreate'>;
	deploymentsActualsDataExportsDelete: DatarobotEndpoint<'deploymentsActualsDataExportsDelete'>;
	deploymentsActualsDataExportsList: DatarobotEndpoint<'deploymentsActualsDataExportsList'>;
	deploymentsActualsDataExportsPatch: DatarobotEndpoint<'deploymentsActualsDataExportsPatch'>;
	deploymentsActualsDataExportsRetrieve: DatarobotEndpoint<'deploymentsActualsDataExportsRetrieve'>;
	deploymentsActualsFromDatasetCreate: DatarobotEndpoint<'deploymentsActualsFromDatasetCreate'>;
	deploymentsActualsFromJSONCreate: DatarobotEndpoint<'deploymentsActualsFromJSONCreate'>;
	deploymentsAgentCardDeleteMany: DatarobotEndpoint<'deploymentsAgentCardDeleteMany'>;
	deploymentsAgentCardList: DatarobotEndpoint<'deploymentsAgentCardList'>;
	deploymentsAgentCardPutMany: DatarobotEndpoint<'deploymentsAgentCardPutMany'>;
	deploymentsBatchServiceStatsList: DatarobotEndpoint<'deploymentsBatchServiceStatsList'>;
	deploymentsCapabilitiesList: DatarobotEndpoint<'deploymentsCapabilitiesList'>;
	deploymentsChallengerPredictionsCreate: DatarobotEndpoint<'deploymentsChallengerPredictionsCreate'>;
	deploymentsChallengerReplaySettingsList: DatarobotEndpoint<'deploymentsChallengerReplaySettingsList'>;
	deploymentsChallengerReplaySettingsPatchMany: DatarobotEndpoint<'deploymentsChallengerReplaySettingsPatchMany'>;
	deploymentsChallengersCreate: DatarobotEndpoint<'deploymentsChallengersCreate'>;
	deploymentsChallengersDelete: DatarobotEndpoint<'deploymentsChallengersDelete'>;
	deploymentsChallengersList: DatarobotEndpoint<'deploymentsChallengersList'>;
	deploymentsChallengersPatch: DatarobotEndpoint<'deploymentsChallengersPatch'>;
	deploymentsChallengersRetrieve: DatarobotEndpoint<'deploymentsChallengersRetrieve'>;
	deploymentsChampionModelPackageList: DatarobotEndpoint<'deploymentsChampionModelPackageList'>;
	deploymentsCustomMetricsBatchSummaryRetrieve: DatarobotEndpoint<'deploymentsCustomMetricsBatchSummaryRetrieve'>;
	deploymentsCustomMetricsBulkBatchSummaryRetrieve: DatarobotEndpoint<'deploymentsCustomMetricsBulkBatchSummaryRetrieve'>;
	deploymentsCustomMetricsBulkSummaryRetrieve: DatarobotEndpoint<'deploymentsCustomMetricsBulkSummaryRetrieve'>;
	deploymentsCustomMetricsBulkUploadCreate: DatarobotEndpoint<'deploymentsCustomMetricsBulkUploadCreate'>;
	deploymentsCustomMetricsCreate: DatarobotEndpoint<'deploymentsCustomMetricsCreate'>;
	deploymentsCustomMetricsDelete: DatarobotEndpoint<'deploymentsCustomMetricsDelete'>;
	deploymentsCustomMetricsFromCustomJobCreate: DatarobotEndpoint<'deploymentsCustomMetricsFromCustomJobCreate'>;
	deploymentsCustomMetricsFromDatasetCreate: DatarobotEndpoint<'deploymentsCustomMetricsFromDatasetCreate'>;
	deploymentsCustomMetricsFromJSONCreate: DatarobotEndpoint<'deploymentsCustomMetricsFromJSONCreate'>;
	deploymentsCustomMetricsList: DatarobotEndpoint<'deploymentsCustomMetricsList'>;
	deploymentsCustomMetricsPatch: DatarobotEndpoint<'deploymentsCustomMetricsPatch'>;
	deploymentsCustomMetricsRetrieve: DatarobotEndpoint<'deploymentsCustomMetricsRetrieve'>;
	deploymentsCustomMetricsSummaryRetrieve: DatarobotEndpoint<'deploymentsCustomMetricsSummaryRetrieve'>;
	deploymentsCustomMetricsValuesOverBatchList: DatarobotEndpoint<'deploymentsCustomMetricsValuesOverBatchList'>;
	deploymentsCustomMetricsValuesOverSpaceList: DatarobotEndpoint<'deploymentsCustomMetricsValuesOverSpaceList'>;
	deploymentsCustomMetricsValuesOverTimeList: DatarobotEndpoint<'deploymentsCustomMetricsValuesOverTimeList'>;
	deploymentsDataQualityViewList: DatarobotEndpoint<'deploymentsDataQualityViewList'>;
	deploymentsDelete: DatarobotEndpoint<'deploymentsDelete'>;
	deploymentsFairnessScoresOverTimeList: DatarobotEndpoint<'deploymentsFairnessScoresOverTimeList'>;
	deploymentsFeatureDriftList: DatarobotEndpoint<'deploymentsFeatureDriftList'>;
	deploymentsFeatureDriftOverBatchList: DatarobotEndpoint<'deploymentsFeatureDriftOverBatchList'>;
	deploymentsFeatureDriftOverSpaceList: DatarobotEndpoint<'deploymentsFeatureDriftOverSpaceList'>;
	deploymentsFeatureDriftOverTimeList: DatarobotEndpoint<'deploymentsFeatureDriftOverTimeList'>;
	deploymentsFeaturesList: DatarobotEndpoint<'deploymentsFeaturesList'>;
	deploymentsFromLearningModelCreate: DatarobotEndpoint<'deploymentsFromLearningModelCreate'>;
	deploymentsFromModelPackageCreate: DatarobotEndpoint<'deploymentsFromModelPackageCreate'>;
	deploymentsHealthSettingsDefaultsList: DatarobotEndpoint<'deploymentsHealthSettingsDefaultsList'>;
	deploymentsHealthSettingsList: DatarobotEndpoint<'deploymentsHealthSettingsList'>;
	deploymentsHealthSettingsPatchMany: DatarobotEndpoint<'deploymentsHealthSettingsPatchMany'>;
	deploymentsHumilityStatsList: DatarobotEndpoint<'deploymentsHumilityStatsList'>;
	deploymentsHumilityStatsOverTimeList: DatarobotEndpoint<'deploymentsHumilityStatsOverTimeList'>;
	deploymentsLimitsList: DatarobotEndpoint<'deploymentsLimitsList'>;
	deploymentsList: DatarobotEndpoint<'deploymentsList'>;
	deploymentsMigrateDPStoServerlessCreate: DatarobotEndpoint<'deploymentsMigrateDPStoServerlessCreate'>;
	deploymentsModelHistoryList: DatarobotEndpoint<'deploymentsModelHistoryList'>;
	deploymentsModelPatchMany: DatarobotEndpoint<'deploymentsModelPatchMany'>;
	deploymentsModelSecondaryDatasetConfigurationHistoryList: DatarobotEndpoint<'deploymentsModelSecondaryDatasetConfigurationHistoryList'>;
	deploymentsModelSecondaryDatasetConfigurationList: DatarobotEndpoint<'deploymentsModelSecondaryDatasetConfigurationList'>;
	deploymentsModelSecondaryDatasetConfigurationPatchMany: DatarobotEndpoint<'deploymentsModelSecondaryDatasetConfigurationPatchMany'>;
	deploymentsModelValidationCreate: DatarobotEndpoint<'deploymentsModelValidationCreate'>;
	deploymentsMonitoringBatchLimitsList: DatarobotEndpoint<'deploymentsMonitoringBatchLimitsList'>;
	deploymentsMonitoringBatchesCreate: DatarobotEndpoint<'deploymentsMonitoringBatchesCreate'>;
	deploymentsMonitoringBatchesDelete: DatarobotEndpoint<'deploymentsMonitoringBatchesDelete'>;
	deploymentsMonitoringBatchesList: DatarobotEndpoint<'deploymentsMonitoringBatchesList'>;
	deploymentsMonitoringBatchesModelsList: DatarobotEndpoint<'deploymentsMonitoringBatchesModelsList'>;
	deploymentsMonitoringBatchesModelsPatch: DatarobotEndpoint<'deploymentsMonitoringBatchesModelsPatch'>;
	deploymentsMonitoringBatchesModelsRetrieve: DatarobotEndpoint<'deploymentsMonitoringBatchesModelsRetrieve'>;
	deploymentsMonitoringBatchesPatch: DatarobotEndpoint<'deploymentsMonitoringBatchesPatch'>;
	deploymentsMonitoringBatchesRetrieve: DatarobotEndpoint<'deploymentsMonitoringBatchesRetrieve'>;
	deploymentsMonitoringDataDeletionsCreate: DatarobotEndpoint<'deploymentsMonitoringDataDeletionsCreate'>;
	deploymentsOnDemandReportsCreate: DatarobotEndpoint<'deploymentsOnDemandReportsCreate'>;
	deploymentsPatch: DatarobotEndpoint<'deploymentsPatch'>;
	deploymentsPredictionDataExportsCreate: DatarobotEndpoint<'deploymentsPredictionDataExportsCreate'>;
	deploymentsPredictionDataExportsList: DatarobotEndpoint<'deploymentsPredictionDataExportsList'>;
	deploymentsPredictionDataExportsPatch: DatarobotEndpoint<'deploymentsPredictionDataExportsPatch'>;
	deploymentsPredictionDataExportsRetrieve: DatarobotEndpoint<'deploymentsPredictionDataExportsRetrieve'>;
	deploymentsPredictionInputsFromDatasetCreate: DatarobotEndpoint<'deploymentsPredictionInputsFromDatasetCreate'>;
	deploymentsPredictionResultsList: DatarobotEndpoint<'deploymentsPredictionResultsList'>;
	deploymentsPredictionsOverBatchList: DatarobotEndpoint<'deploymentsPredictionsOverBatchList'>;
	deploymentsPredictionsOverSpaceList: DatarobotEndpoint<'deploymentsPredictionsOverSpaceList'>;
	deploymentsPredictionsOverTimeList: DatarobotEndpoint<'deploymentsPredictionsOverTimeList'>;
	deploymentsPredictionsVsActualsOverBatchList: DatarobotEndpoint<'deploymentsPredictionsVsActualsOverBatchList'>;
	deploymentsPredictionsVsActualsOverSpaceList: DatarobotEndpoint<'deploymentsPredictionsVsActualsOverSpaceList'>;
	deploymentsPredictionsVsActualsOverTimeList: DatarobotEndpoint<'deploymentsPredictionsVsActualsOverTimeList'>;
	deploymentsQuotaConsumersList: DatarobotEndpoint<'deploymentsQuotaConsumersList'>;
	deploymentsRetrainingPoliciesCreate: DatarobotEndpoint<'deploymentsRetrainingPoliciesCreate'>;
	deploymentsRetrainingPoliciesDelete: DatarobotEndpoint<'deploymentsRetrainingPoliciesDelete'>;
	deploymentsRetrainingPoliciesList: DatarobotEndpoint<'deploymentsRetrainingPoliciesList'>;
	deploymentsRetrainingPoliciesPatch: DatarobotEndpoint<'deploymentsRetrainingPoliciesPatch'>;
	deploymentsRetrainingPoliciesRetrieve: DatarobotEndpoint<'deploymentsRetrainingPoliciesRetrieve'>;
	deploymentsRetrainingPoliciesRunsCreate: DatarobotEndpoint<'deploymentsRetrainingPoliciesRunsCreate'>;
	deploymentsRetrainingPoliciesRunsList: DatarobotEndpoint<'deploymentsRetrainingPoliciesRunsList'>;
	deploymentsRetrainingPoliciesRunsPatch: DatarobotEndpoint<'deploymentsRetrainingPoliciesRunsPatch'>;
	deploymentsRetrainingPoliciesRunsRetrieve: DatarobotEndpoint<'deploymentsRetrainingPoliciesRunsRetrieve'>;
	deploymentsRetrainingSettingsList: DatarobotEndpoint<'deploymentsRetrainingSettingsList'>;
	deploymentsRetrainingSettingsPatchMany: DatarobotEndpoint<'deploymentsRetrainingSettingsPatchMany'>;
	deploymentsRetrieve: DatarobotEndpoint<'deploymentsRetrieve'>;
	deploymentsRuntimeParametersList: DatarobotEndpoint<'deploymentsRuntimeParametersList'>;
	deploymentsRuntimeParametersPutMany: DatarobotEndpoint<'deploymentsRuntimeParametersPutMany'>;
	deploymentsScoringCodeBuildsCreate: DatarobotEndpoint<'deploymentsScoringCodeBuildsCreate'>;
	deploymentsScoringCodeList: DatarobotEndpoint<'deploymentsScoringCodeList'>;
	deploymentsSegmentAttributesList: DatarobotEndpoint<'deploymentsSegmentAttributesList'>;
	deploymentsSegmentValuesList: DatarobotEndpoint<'deploymentsSegmentValuesList'>;
	deploymentsServiceStatsList: DatarobotEndpoint<'deploymentsServiceStatsList'>;
	deploymentsServiceStatsOverBatchList: DatarobotEndpoint<'deploymentsServiceStatsOverBatchList'>;
	deploymentsServiceStatsOverTimeList: DatarobotEndpoint<'deploymentsServiceStatsOverTimeList'>;
	deploymentsSettingsChecklistList: DatarobotEndpoint<'deploymentsSettingsChecklistList'>;
	deploymentsSettingsList: DatarobotEndpoint<'deploymentsSettingsList'>;
	deploymentsSettingsPatchMany: DatarobotEndpoint<'deploymentsSettingsPatchMany'>;
	deploymentsSharedRolesList: DatarobotEndpoint<'deploymentsSharedRolesList'>;
	deploymentsSharedRolesPatchMany: DatarobotEndpoint<'deploymentsSharedRolesPatchMany'>;
	deploymentsStatusPatchMany: DatarobotEndpoint<'deploymentsStatusPatchMany'>;
	deploymentsTargetDriftList: DatarobotEndpoint<'deploymentsTargetDriftList'>;
	deploymentsTrainingDataExportsCreate: DatarobotEndpoint<'deploymentsTrainingDataExportsCreate'>;
	deploymentsTrainingDataExportsList: DatarobotEndpoint<'deploymentsTrainingDataExportsList'>;
	deploymentsTrainingDataExportsRetrieve: DatarobotEndpoint<'deploymentsTrainingDataExportsRetrieve'>;
	entitlementsApplyEntitlementSetsCreate: DatarobotEndpoint<'entitlementsApplyEntitlementSetsCreate'>;
	entitlementsEntitlementSetLeasesList: DatarobotEndpoint<'entitlementsEntitlementSetLeasesList'>;
	entitlementsEvaluateCreate: DatarobotEndpoint<'entitlementsEvaluateCreate'>;
	entityNotificationChannelsCreate: DatarobotEndpoint<'entityNotificationChannelsCreate'>;
	entityNotificationChannelsDelete: DatarobotEndpoint<'entityNotificationChannelsDelete'>;
	entityNotificationChannelsList: DatarobotEndpoint<'entityNotificationChannelsList'>;
	entityNotificationChannelsPut: DatarobotEndpoint<'entityNotificationChannelsPut'>;
	entityNotificationChannelsRetrieve: DatarobotEndpoint<'entityNotificationChannelsRetrieve'>;
	entityNotificationPoliciesCreate: DatarobotEndpoint<'entityNotificationPoliciesCreate'>;
	entityNotificationPoliciesDelete: DatarobotEndpoint<'entityNotificationPoliciesDelete'>;
	entityNotificationPoliciesList: DatarobotEndpoint<'entityNotificationPoliciesList'>;
	entityNotificationPoliciesPut: DatarobotEndpoint<'entityNotificationPoliciesPut'>;
	entityNotificationPoliciesRetrieve: DatarobotEndpoint<'entityNotificationPoliciesRetrieve'>;
	entityNotificationPolicyTemplatesCreate: DatarobotEndpoint<'entityNotificationPolicyTemplatesCreate'>;
	entityNotificationPolicyTemplatesDelete: DatarobotEndpoint<'entityNotificationPolicyTemplatesDelete'>;
	entityNotificationPolicyTemplatesList: DatarobotEndpoint<'entityNotificationPolicyTemplatesList'>;
	entityNotificationPolicyTemplatesPut: DatarobotEndpoint<'entityNotificationPolicyTemplatesPut'>;
	entityNotificationPolicyTemplatesRelatedPoliciesList: DatarobotEndpoint<'entityNotificationPolicyTemplatesRelatedPoliciesList'>;
	entityNotificationPolicyTemplatesRetrieve: DatarobotEndpoint<'entityNotificationPolicyTemplatesRetrieve'>;
	entityNotificationPolicyTemplatesSharedRolesList: DatarobotEndpoint<'entityNotificationPolicyTemplatesSharedRolesList'>;
	entityNotificationPolicyTemplatesSharedRolesPatchMany: DatarobotEndpoint<'entityNotificationPolicyTemplatesSharedRolesPatchMany'>;
	entityTagsCreate: DatarobotEndpoint<'entityTagsCreate'>;
	entityTagsDelete: DatarobotEndpoint<'entityTagsDelete'>;
	entityTagsList: DatarobotEndpoint<'entityTagsList'>;
	entityTagsPatch: DatarobotEndpoint<'entityTagsPatch'>;
	eventLogsEventsList: DatarobotEndpoint<'eventLogsEventsList'>;
	eventLogsList: DatarobotEndpoint<'eventLogsList'>;
	eventLogsPredictionUsageList: DatarobotEndpoint<'eventLogsPredictionUsageList'>;
	eventLogsRetrieve: DatarobotEndpoint<'eventLogsRetrieve'>;
	executionEnvironmentsAccessControlList: DatarobotEndpoint<'executionEnvironmentsAccessControlList'>;
	executionEnvironmentsAccessControlPatchMany: DatarobotEndpoint<'executionEnvironmentsAccessControlPatchMany'>;
	executionEnvironmentsCreate: DatarobotEndpoint<'executionEnvironmentsCreate'>;
	executionEnvironmentsDelete: DatarobotEndpoint<'executionEnvironmentsDelete'>;
	executionEnvironmentsList: DatarobotEndpoint<'executionEnvironmentsList'>;
	executionEnvironmentsPatch: DatarobotEndpoint<'executionEnvironmentsPatch'>;
	executionEnvironmentsRetrieve: DatarobotEndpoint<'executionEnvironmentsRetrieve'>;
	executionEnvironmentsVersionsBuildLogList: DatarobotEndpoint<'executionEnvironmentsVersionsBuildLogList'>;
	executionEnvironmentsVersionsCancelBuildPatchMany: DatarobotEndpoint<'executionEnvironmentsVersionsCancelBuildPatchMany'>;
	executionEnvironmentsVersionsCreate: DatarobotEndpoint<'executionEnvironmentsVersionsCreate'>;
	executionEnvironmentsVersionsDownloadCreate: DatarobotEndpoint<'executionEnvironmentsVersionsDownloadCreate'>;
	executionEnvironmentsVersionsDownloadList: DatarobotEndpoint<'executionEnvironmentsVersionsDownloadList'>;
	executionEnvironmentsVersionsList: DatarobotEndpoint<'executionEnvironmentsVersionsList'>;
	executionEnvironmentsVersionsRetrieve: DatarobotEndpoint<'executionEnvironmentsVersionsRetrieve'>;
	externalDataDriversConfigurationList: DatarobotEndpoint<'externalDataDriversConfigurationList'>;
	externalDataDriversCreate: DatarobotEndpoint<'externalDataDriversCreate'>;
	externalDataDriversDelete: DatarobotEndpoint<'externalDataDriversDelete'>;
	externalDataDriversList: DatarobotEndpoint<'externalDataDriversList'>;
	externalDataDriversPatch: DatarobotEndpoint<'externalDataDriversPatch'>;
	externalDataDriversRetrieve: DatarobotEndpoint<'externalDataDriversRetrieve'>;
	externalDataSourcesAccessControlList: DatarobotEndpoint<'externalDataSourcesAccessControlList'>;
	externalDataSourcesAccessControlPatchMany: DatarobotEndpoint<'externalDataSourcesAccessControlPatchMany'>;
	externalDataSourcesCreate: DatarobotEndpoint<'externalDataSourcesCreate'>;
	externalDataSourcesDelete: DatarobotEndpoint<'externalDataSourcesDelete'>;
	externalDataSourcesList: DatarobotEndpoint<'externalDataSourcesList'>;
	externalDataSourcesPatch: DatarobotEndpoint<'externalDataSourcesPatch'>;
	externalDataSourcesPermissionsList: DatarobotEndpoint<'externalDataSourcesPermissionsList'>;
	externalDataSourcesRetrieve: DatarobotEndpoint<'externalDataSourcesRetrieve'>;
	externalDataSourcesSharedRolesList: DatarobotEndpoint<'externalDataSourcesSharedRolesList'>;
	externalDataSourcesSharedRolesPatchMany: DatarobotEndpoint<'externalDataSourcesSharedRolesPatchMany'>;
	externalDataStoresAccessControlPatchMany: DatarobotEndpoint<'externalDataStoresAccessControlPatchMany'>;
	externalDataStoresColumnsCreate: DatarobotEndpoint<'externalDataStoresColumnsCreate'>;
	externalDataStoresColumnsInfoCreate: DatarobotEndpoint<'externalDataStoresColumnsInfoCreate'>;
	externalDataStoresCreate: DatarobotEndpoint<'externalDataStoresCreate'>;
	externalDataStoresCredentialsList: DatarobotEndpoint<'externalDataStoresCredentialsList'>;
	externalDataStoresDelete: DatarobotEndpoint<'externalDataStoresDelete'>;
	externalDataStoresList: DatarobotEndpoint<'externalDataStoresList'>;
	externalDataStoresPatch: DatarobotEndpoint<'externalDataStoresPatch'>;
	externalDataStoresPermissionsList: DatarobotEndpoint<'externalDataStoresPermissionsList'>;
	externalDataStoresRetrieve: DatarobotEndpoint<'externalDataStoresRetrieve'>;
	externalDataStoresSchemasCreate: DatarobotEndpoint<'externalDataStoresSchemasCreate'>;
	externalDataStoresSharedRolesList: DatarobotEndpoint<'externalDataStoresSharedRolesList'>;
	externalDataStoresSharedRolesPatchMany: DatarobotEndpoint<'externalDataStoresSharedRolesPatchMany'>;
	externalDataStoresStandardUserDefinedFunctionsCreate: DatarobotEndpoint<'externalDataStoresStandardUserDefinedFunctionsCreate'>;
	externalDataStoresStandardUserDefinedFunctionsDetectCreate: DatarobotEndpoint<'externalDataStoresStandardUserDefinedFunctionsDetectCreate'>;
	externalDataStoresStandardUserDefinedFunctionsList: DatarobotEndpoint<'externalDataStoresStandardUserDefinedFunctionsList'>;
	externalDataStoresTablesCreate: DatarobotEndpoint<'externalDataStoresTablesCreate'>;
	externalDataStoresTestCreate: DatarobotEndpoint<'externalDataStoresTestCreate'>;
	externalDataStoresVerifySQLCreate: DatarobotEndpoint<'externalDataStoresVerifySQLCreate'>;
	externalOAuthAuthorizedProvidersDelete: DatarobotEndpoint<'externalOAuthAuthorizedProvidersDelete'>;
	externalOAuthAuthorizedProvidersList: DatarobotEndpoint<'externalOAuthAuthorizedProvidersList'>;
	externalOAuthAuthorizedProvidersTokenCreate: DatarobotEndpoint<'externalOAuthAuthorizedProvidersTokenCreate'>;
	externalOAuthAuthorizedProvidersUserinfoList: DatarobotEndpoint<'externalOAuthAuthorizedProvidersUserinfoList'>;
	externalOAuthJobsRetrieve: DatarobotEndpoint<'externalOAuthJobsRetrieve'>;
	externalOAuthProvidersAuthorizeCreate: DatarobotEndpoint<'externalOAuthProvidersAuthorizeCreate'>;
	externalOAuthProvidersCallbackCreate: DatarobotEndpoint<'externalOAuthProvidersCallbackCreate'>;
	externalOAuthProvidersCreate: DatarobotEndpoint<'externalOAuthProvidersCreate'>;
	externalOAuthProvidersDelete: DatarobotEndpoint<'externalOAuthProvidersDelete'>;
	externalOAuthProvidersList: DatarobotEndpoint<'externalOAuthProvidersList'>;
	externalOAuthProvidersPatch: DatarobotEndpoint<'externalOAuthProvidersPatch'>;
	externalOAuthProvidersRetrieve: DatarobotEndpoint<'externalOAuthProvidersRetrieve'>;
	filesAddFromDataSourceCreate: DatarobotEndpoint<'filesAddFromDataSourceCreate'>;
	filesAddFromFileCreate: DatarobotEndpoint<'filesAddFromFileCreate'>;
	filesAddFromURLCreate: DatarobotEndpoint<'filesAddFromURLCreate'>;
	filesAllFilesDeleteMany: DatarobotEndpoint<'filesAllFilesDeleteMany'>;
	filesAllFilesList: DatarobotEndpoint<'filesAllFilesList'>;
	filesAllFilesPatchMany: DatarobotEndpoint<'filesAllFilesPatchMany'>;
	filesCloneCreate: DatarobotEndpoint<'filesCloneCreate'>;
	filesCopyBatchCreate: DatarobotEndpoint<'filesCopyBatchCreate'>;
	filesCopyCreate: DatarobotEndpoint<'filesCopyCreate'>;
	filesCreate: DatarobotEndpoint<'filesCreate'>;
	filesDelete: DatarobotEndpoint<'filesDelete'>;
	filesDeletedPatchMany: DatarobotEndpoint<'filesDeletedPatchMany'>;
	filesDownloadsCreate: DatarobotEndpoint<'filesDownloadsCreate'>;
	filesFileList: DatarobotEndpoint<'filesFileList'>;
	filesFromDataSourceCreate: DatarobotEndpoint<'filesFromDataSourceCreate'>;
	filesFromFileCreate: DatarobotEndpoint<'filesFromFileCreate'>;
	filesFromStageCreate: DatarobotEndpoint<'filesFromStageCreate'>;
	filesFromURLCreate: DatarobotEndpoint<'filesFromURLCreate'>;
	filesLinksCreate: DatarobotEndpoint<'filesLinksCreate'>;
	filesPatchMany: DatarobotEndpoint<'filesPatchMany'>;
	filesSharedRolesList: DatarobotEndpoint<'filesSharedRolesList'>;
	filesSharedRolesPatchMany: DatarobotEndpoint<'filesSharedRolesPatchMany'>;
	filesStagesCreate: DatarobotEndpoint<'filesStagesCreate'>;
	filesStagesUploadCreate: DatarobotEndpoint<'filesStagesUploadCreate'>;
	filesVersionsAllFilesList: DatarobotEndpoint<'filesVersionsAllFilesList'>;
	filesVersionsDelete: DatarobotEndpoint<'filesVersionsDelete'>;
	filesVersionsDeletedPatchMany: DatarobotEndpoint<'filesVersionsDeletedPatchMany'>;
	filesVersionsDownloadsCreate: DatarobotEndpoint<'filesVersionsDownloadsCreate'>;
	filesVersionsFileList: DatarobotEndpoint<'filesVersionsFileList'>;
	filesVersionsLinksCreate: DatarobotEndpoint<'filesVersionsLinksCreate'>;
	filesVersionsList: DatarobotEndpoint<'filesVersionsList'>;
	copySupportedInsightsPlaygroundsTargetPlaygroundIdSupportedInsightsSourcePlaygroundIdPut: DatarobotEndpoint<'copySupportedInsightsPlaygroundsTargetPlaygroundIdSupportedInsightsSourcePlaygroundIdPut'>;
	createChatChatsPost: DatarobotEndpoint<'createChatChatsPost'>;
	createChatExportJobPlaygroundsPlaygroundIdTraceDatasetsPost: DatarobotEndpoint<'createChatExportJobPlaygroundsPlaygroundIdTraceDatasetsPost'>;
	createChatPromptChatPromptsPost: DatarobotEndpoint<'createChatPromptChatPromptsPost'>;
	createComparisonChatComparisonChatsPost: DatarobotEndpoint<'createComparisonChatComparisonChatsPost'>;
	createComparisonPromptComparisonPromptsPost: DatarobotEndpoint<'createComparisonPromptComparisonPromptsPost'>;
	createCostMetricConfigurationCostMetricConfigurationsPost: DatarobotEndpoint<'createCostMetricConfigurationCostMetricConfigurationsPost'>;
	createCustomModelEmbeddingValidationCustomModelEmbeddingValidationsPost: DatarobotEndpoint<'createCustomModelEmbeddingValidationCustomModelEmbeddingValidationsPost'>;
	createCustomModelLlmValidationCustomModelLLMValidationsPost: DatarobotEndpoint<'createCustomModelLlmValidationCustomModelLLMValidationsPost'>;
	createCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsPost: DatarobotEndpoint<'createCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsPost'>;
	createCustomModelVectorDatabaseVectorDatabasesFromCustomModelDeploymentPost: DatarobotEndpoint<'createCustomModelVectorDatabaseVectorDatabasesFromCustomModelDeploymentPost'>;
	createCustomModelVersionCustomModelVersionsPost: DatarobotEndpoint<'createCustomModelVersionCustomModelVersionsPost'>;
	createEvaluationDatasetConfigurationEvaluationDatasetConfigurationsPost: DatarobotEndpoint<'createEvaluationDatasetConfigurationEvaluationDatasetConfigurationsPost'>;
	createEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsPost: DatarobotEndpoint<'createEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsPost'>;
	createFromChatPromptLlmBlueprintsFromChatPromptPost: DatarobotEndpoint<'createFromChatPromptLlmBlueprintsFromChatPromptPost'>;
	createFromLlmBlueprintLlmBlueprintsFromLLMBlueprintPost: DatarobotEndpoint<'createFromLlmBlueprintLlmBlueprintsFromLLMBlueprintPost'>;
	createLlmBlueprintLlmBlueprintsPost: DatarobotEndpoint<'createLlmBlueprintLlmBlueprintsPost'>;
	createLlmTestConfigurationLlmTestConfigurationsPost: DatarobotEndpoint<'createLlmTestConfigurationLlmTestConfigurationsPost'>;
	createLlmTestResultLlmTestResultsPost: DatarobotEndpoint<'createLlmTestResultLlmTestResultsPost'>;
	createLlmTestSuiteLlmTestSuitesPost: DatarobotEndpoint<'createLlmTestSuiteLlmTestSuitesPost'>;
	createOotbMetricConfigurationPlaygroundsPlaygroundIdOotbMetricConfigurationsPost: DatarobotEndpoint<'createOotbMetricConfigurationPlaygroundsPlaygroundIdOotbMetricConfigurationsPost'>;
	createPlaygroundPlaygroundsPost: DatarobotEndpoint<'createPlaygroundPlaygroundsPost'>;
	createPromptTemplatePromptTemplatesPost: DatarobotEndpoint<'createPromptTemplatePromptTemplatesPost'>;
	createPromptTemplateVersionPromptTemplatesPromptTemplateIdVersionsPost: DatarobotEndpoint<'createPromptTemplateVersionPromptTemplatesPromptTemplateIdVersionsPost'>;
	createSidecarModelMetricValidationSidecarModelMetricValidationsPost: DatarobotEndpoint<'createSidecarModelMetricValidationSidecarModelMetricValidationsPost'>;
	createVectorDatabaseCustomModelVersionVectorDatabasesVectorDatabaseIdCustomModelVersionsPost: DatarobotEndpoint<'createVectorDatabaseCustomModelVersionVectorDatabasesVectorDatabaseIdCustomModelVersionsPost'>;
	createVectorDatabaseDeploymentVectorDatabasesVectorDatabaseIdDeploymentsPost: DatarobotEndpoint<'createVectorDatabaseDeploymentVectorDatabasesVectorDatabaseIdDeploymentsPost'>;
	createVectorDatabaseVectorDatabasesPost: DatarobotEndpoint<'createVectorDatabaseVectorDatabasesPost'>;
	deleteChatChatsChatIdDelete: DatarobotEndpoint<'deleteChatChatsChatIdDelete'>;
	deleteChatPromptChatPromptsChatPromptIdDelete: DatarobotEndpoint<'deleteChatPromptChatPromptsChatPromptIdDelete'>;
	deleteComparisonChatComparisonChatsComparisonChatIdDelete: DatarobotEndpoint<'deleteComparisonChatComparisonChatsComparisonChatIdDelete'>;
	deleteComparisonPromptComparisonPromptsComparisonPromptIdDelete: DatarobotEndpoint<'deleteComparisonPromptComparisonPromptsComparisonPromptIdDelete'>;
	deleteCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdDelete: DatarobotEndpoint<'deleteCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdDelete'>;
	deleteCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdDelete: DatarobotEndpoint<'deleteCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdDelete'>;
	deleteCustomModelLlmValidationCustomModelLLMValidationsValidationIdDelete: DatarobotEndpoint<'deleteCustomModelLlmValidationCustomModelLLMValidationsValidationIdDelete'>;
	deleteCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdDelete: DatarobotEndpoint<'deleteCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdDelete'>;
	deleteEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdDelete: DatarobotEndpoint<'deleteEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdDelete'>;
	deleteEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsDelete: DatarobotEndpoint<'deleteEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsDelete'>;
	deleteLlmBlueprintLlmBlueprintsLlmBlueprintIdDelete: DatarobotEndpoint<'deleteLlmBlueprintLlmBlueprintsLlmBlueprintIdDelete'>;
	deleteLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdDelete: DatarobotEndpoint<'deleteLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdDelete'>;
	deleteLlmTestResultLlmTestResultsLlmTestResultIdDelete: DatarobotEndpoint<'deleteLlmTestResultLlmTestResultsLlmTestResultIdDelete'>;
	deleteLlmTestSuiteLlmTestSuitesLlmTestSuiteIdDelete: DatarobotEndpoint<'deleteLlmTestSuiteLlmTestSuitesLlmTestSuiteIdDelete'>;
	deleteNemoMetricPlaygroundsPlaygroundIdNemoConfigurationMetricIdDelete: DatarobotEndpoint<'deleteNemoMetricPlaygroundsPlaygroundIdNemoConfigurationMetricIdDelete'>;
	deleteOotbMetricConfigurationOotbMetricConfigurationsOotbMetricConfigurationIdDelete: DatarobotEndpoint<'deleteOotbMetricConfigurationOotbMetricConfigurationsOotbMetricConfigurationIdDelete'>;
	deletePlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationDelete: DatarobotEndpoint<'deletePlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationDelete'>;
	deletePlaygroundPlaygroundsPlaygroundIdDelete: DatarobotEndpoint<'deletePlaygroundPlaygroundsPlaygroundIdDelete'>;
	deleteSearchStudySyftrSearchSearchStudyIdDelete: DatarobotEndpoint<'deleteSearchStudySyftrSearchSearchStudyIdDelete'>;
	deleteSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdDelete: DatarobotEndpoint<'deleteSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdDelete'>;
	deleteVectorDatabaseVectorDatabasesVectorDatabaseIdDelete: DatarobotEndpoint<'deleteVectorDatabaseVectorDatabasesVectorDatabaseIdDelete'>;
	downloadTextAndEmbeddingsAssetVectorDatabasesVectorDatabaseIdTextAndEmbeddingsGet: DatarobotEndpoint<'downloadTextAndEmbeddingsAssetVectorDatabasesVectorDatabaseIdTextAndEmbeddingsGet'>;
	editChatChatsChatIdPatch: DatarobotEndpoint<'editChatChatsChatIdPatch'>;
	editComparisonChatComparisonChatsComparisonChatIdPatch: DatarobotEndpoint<'editComparisonChatComparisonChatsComparisonChatIdPatch'>;
	editLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdPatch: DatarobotEndpoint<'editLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdPatch'>;
	editLlmTestSuiteLlmTestSuitesLlmTestSuiteIdPatch: DatarobotEndpoint<'editLlmTestSuiteLlmTestSuitesLlmTestSuiteIdPatch'>;
	editSearchStudySyftrSearchSearchStudyIdPatch: DatarobotEndpoint<'editSearchStudySyftrSearchSearchStudyIdPatch'>;
	exportVectorDatabaseDatasetVectorDatabasesVectorDatabaseIdDatasetExportJobsPost: DatarobotEndpoint<'exportVectorDatabaseDatasetVectorDatabasesVectorDatabaseIdDatasetExportJobsPost'>;
	fromCustomModelChatAgentsFromCustomModelCustomModelIdChatPost: DatarobotEndpoint<'fromCustomModelChatAgentsFromCustomModelCustomModelIdChatPost'>;
	generateSyntheticDatasetSyntheticEvaluationDatasetGenerationsPost: DatarobotEndpoint<'generateSyntheticDatasetSyntheticEvaluationDatasetGenerationsPost'>;
	getChatChatsChatIdGet: DatarobotEndpoint<'getChatChatsChatIdGet'>;
	getChatPromptChatPromptsChatPromptIdGet: DatarobotEndpoint<'getChatPromptChatPromptsChatPromptIdGet'>;
	getChatResponseAgentsFromCustomModelCustomModelIdChatChatCompletionIdGet: DatarobotEndpoint<'getChatResponseAgentsFromCustomModelCustomModelIdChatChatCompletionIdGet'>;
	getComparisonChatComparisonChatsComparisonChatIdGet: DatarobotEndpoint<'getComparisonChatComparisonChatsComparisonChatIdGet'>;
	getComparisonPromptComparisonPromptsComparisonPromptIdGet: DatarobotEndpoint<'getComparisonPromptComparisonPromptsComparisonPromptIdGet'>;
	getCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdGet: DatarobotEndpoint<'getCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdGet'>;
	getCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdGet: DatarobotEndpoint<'getCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdGet'>;
	getCustomModelLlmValidationCustomModelLLMValidationsValidationIdGet: DatarobotEndpoint<'getCustomModelLlmValidationCustomModelLLMValidationsValidationIdGet'>;
	getCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdGet: DatarobotEndpoint<'getCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdGet'>;
	getEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdGet: DatarobotEndpoint<'getEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdGet'>;
	getLlmBlueprintLlmBlueprintsLlmBlueprintIdGet: DatarobotEndpoint<'getLlmBlueprintLlmBlueprintsLlmBlueprintIdGet'>;
	getLlmLlmsLlmIdGet: DatarobotEndpoint<'getLlmLlmsLlmIdGet'>;
	getLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdGet: DatarobotEndpoint<'getLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdGet'>;
	getLlmTestResultLlmTestResultsLlmTestResultIdGet: DatarobotEndpoint<'getLlmTestResultLlmTestResultsLlmTestResultIdGet'>;
	getLlmTestSuiteLlmTestSuitesLlmTestSuiteIdGet: DatarobotEndpoint<'getLlmTestSuiteLlmTestSuitesLlmTestSuiteIdGet'>;
	getOotbMetricConfigurationOotbMetricConfigurationsOotbMetricConfigurationIdGet: DatarobotEndpoint<'getOotbMetricConfigurationOotbMetricConfigurationsOotbMetricConfigurationIdGet'>;
	getPlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationGet: DatarobotEndpoint<'getPlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationGet'>;
	getPlaygroundPlaygroundsPlaygroundIdGet: DatarobotEndpoint<'getPlaygroundPlaygroundsPlaygroundIdGet'>;
	getPromptTemplatePromptTemplatesPromptTemplateIdGet: DatarobotEndpoint<'getPromptTemplatePromptTemplatesPromptTemplateIdGet'>;
	getPromptTemplateVersionPromptTemplatesPromptTemplateIdVersionsPromptTemplateVersionIdGet: DatarobotEndpoint<'getPromptTemplateVersionPromptTemplatesPromptTemplateIdVersionsPromptTemplateVersionIdGet'>;
	getSearchStudySyftrSearchSearchStudyIdGet: DatarobotEndpoint<'getSearchStudySyftrSearchSearchStudyIdGet'>;
	getSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdGet: DatarobotEndpoint<'getSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdGet'>;
	getStatusStatusStatusIdGet: DatarobotEndpoint<'getStatusStatusStatusIdGet'>;
	getSupportedEmbeddingsVectorDatabasesSupportedEmbeddingsGet: DatarobotEndpoint<'getSupportedEmbeddingsVectorDatabasesSupportedEmbeddingsGet'>;
	getSupportedInsightsPlaygroundsPlaygroundIdSupportedInsightsGet: DatarobotEndpoint<'getSupportedInsightsPlaygroundsPlaygroundIdSupportedInsightsGet'>;
	getSupportedLanguagesVectorDatabasesVectorDatabaseIdSupportedSyntheticDatasetGenerationLanguagesGet: DatarobotEndpoint<'getSupportedLanguagesVectorDatabasesVectorDatabaseIdSupportedSyntheticDatasetGenerationLanguagesGet'>;
	getSupportedRetrievalSettingsVectorDatabasesSupportedRetrievalSettingsGet: DatarobotEndpoint<'getSupportedRetrievalSettingsVectorDatabasesSupportedRetrievalSettingsGet'>;
	getSupportedTextChunkingConfigsVectorDatabasesSupportedTextChunkingsGet: DatarobotEndpoint<'getSupportedTextChunkingConfigsVectorDatabasesSupportedTextChunkingsGet'>;
	getUserLimitCounterForVectorDatabasesUserLimitsVectorDatabasesGet: DatarobotEndpoint<'getUserLimitCounterForVectorDatabasesUserLimitsVectorDatabasesGet'>;
	getVectorDatabaseLatestVersionVectorDatabasesVectorDatabaseIdLatestVersionGet: DatarobotEndpoint<'getVectorDatabaseLatestVersionVectorDatabasesVectorDatabaseIdLatestVersionGet'>;
	getVectorDatabaseVectorDatabasesVectorDatabaseIdGet: DatarobotEndpoint<'getVectorDatabaseVectorDatabasesVectorDatabaseIdGet'>;
	listChatPromptsChatPromptsGet: DatarobotEndpoint<'listChatPromptsChatPromptsGet'>;
	listChatsChatsGet: DatarobotEndpoint<'listChatsChatsGet'>;
	listComparisonChatsComparisonChatsGet: DatarobotEndpoint<'listComparisonChatsComparisonChatsGet'>;
	listComparisonPromptsComparisonPromptsGet: DatarobotEndpoint<'listComparisonPromptsComparisonPromptsGet'>;
	listCustomModelEmbeddingsCustomModelEmbeddingValidationsGet: DatarobotEndpoint<'listCustomModelEmbeddingsCustomModelEmbeddingValidationsGet'>;
	listCustomModelLlmValidationsCustomModelLLMValidationsGet: DatarobotEndpoint<'listCustomModelLlmValidationsCustomModelLLMValidationsGet'>;
	listCustomModelVectorDatabaseValidationsCustomModelVectorDatabaseValidationsGet: DatarobotEndpoint<'listCustomModelVectorDatabaseValidationsCustomModelVectorDatabaseValidationsGet'>;
	listEvaluationDatasetConfigurationEvaluationDatasetConfigurationsGet: DatarobotEndpoint<'listEvaluationDatasetConfigurationEvaluationDatasetConfigurationsGet'>;
	listEvaluationDatasetMetricAggregationAggregatedByLlmBlueprintEvaluationDatasetMetricAggregationsAggregateByLLMBlueprintGet: DatarobotEndpoint<'listEvaluationDatasetMetricAggregationAggregatedByLlmBlueprintEvaluationDatasetMetricAggregationsAggregateByLLMBlueprintGet'>;
	listEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsGet: DatarobotEndpoint<'listEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsGet'>;
	listEvaluationDatasetMetricAggregationUniqueFieldValuesEvaluationDatasetMetricAggregationsUniqueFieldValuesUniqueFieldGet: DatarobotEndpoint<'listEvaluationDatasetMetricAggregationUniqueFieldValuesEvaluationDatasetMetricAggregationsUniqueFieldValuesUniqueFieldGet'>;
	listLlmBlueprintsLlmBlueprintsGet: DatarobotEndpoint<'listLlmBlueprintsLlmBlueprintsGet'>;
	listLlmTestConfigurationNonOotbDatasetsLlmTestConfigurationsNonOotbDatasetsGet: DatarobotEndpoint<'listLlmTestConfigurationNonOotbDatasetsLlmTestConfigurationsNonOotbDatasetsGet'>;
	listLlmTestConfigurationOotbDatasetsLlmTestConfigurationsOotbDatasetsGet: DatarobotEndpoint<'listLlmTestConfigurationOotbDatasetsLlmTestConfigurationsOotbDatasetsGet'>;
	listLlmTestConfigurationSupportedInsightsLlmTestConfigurationsSupportedInsightsGet: DatarobotEndpoint<'listLlmTestConfigurationSupportedInsightsLlmTestConfigurationsSupportedInsightsGet'>;
	listLlmTestConfigurationsLlmTestConfigurationsGet: DatarobotEndpoint<'listLlmTestConfigurationsLlmTestConfigurationsGet'>;
	listLlmTestResultsLlmTestResultsGet: DatarobotEndpoint<'listLlmTestResultsLlmTestResultsGet'>;
	listLlmTestSuitesLlmTestSuitesGet: DatarobotEndpoint<'listLlmTestSuitesLlmTestSuitesGet'>;
	listLlmsLlmsGet: DatarobotEndpoint<'listLlmsLlmsGet'>;
	listOotbMetricConfigurationsPlaygroundsPlaygroundIdOotbMetricConfigurationsGet: DatarobotEndpoint<'listOotbMetricConfigurationsPlaygroundsPlaygroundIdOotbMetricConfigurationsGet'>;
	listPlaygroundsPlaygroundsGet: DatarobotEndpoint<'listPlaygroundsPlaygroundsGet'>;
	listPromptTemplateVersionsPromptTemplatesPromptTemplateIdVersionsGet: DatarobotEndpoint<'listPromptTemplateVersionsPromptTemplatesPromptTemplateIdVersionsGet'>;
	listPromptTemplatesPromptTemplatesGet: DatarobotEndpoint<'listPromptTemplatesPromptTemplatesGet'>;
	listPromptTemplatesVersionsPromptTemplatesVersionsGet: DatarobotEndpoint<'listPromptTemplatesVersionsPromptTemplatesVersionsGet'>;
	listSearchStudySyftrSearchGet: DatarobotEndpoint<'listSearchStudySyftrSearchGet'>;
	listSidecarModelValidationsSidecarModelMetricValidationsGet: DatarobotEndpoint<'listSidecarModelValidationsSidecarModelMetricValidationsGet'>;
	listVectorDatabasesVectorDatabasesGet: DatarobotEndpoint<'listVectorDatabasesVectorDatabasesGet'>;
	playgroundTraceMetadataPlaygroundsPlaygroundIdTraceMetadataGet: DatarobotEndpoint<'playgroundTraceMetadataPlaygroundsPlaygroundIdTraceMetadataGet'>;
	playgroundTracePlaygroundsPlaygroundIdTraceGet: DatarobotEndpoint<'playgroundTracePlaygroundsPlaygroundIdTraceGet'>;
	revalidateCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdRevalidatePost: DatarobotEndpoint<'revalidateCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdRevalidatePost'>;
	revalidateCustomModelLlmValidationCustomModelLLMValidationsValidationIdRevalidatePost: DatarobotEndpoint<'revalidateCustomModelLlmValidationCustomModelLLMValidationsValidationIdRevalidatePost'>;
	revalidateCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdRevalidatePost: DatarobotEndpoint<'revalidateCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdRevalidatePost'>;
	revalidateSidecarModelValidationSidecarModelMetricValidationsValidationIdRevalidatePost: DatarobotEndpoint<'revalidateSidecarModelValidationSidecarModelMetricValidationsValidationIdRevalidatePost'>;
	runAgenticSearchSyftrSearchPost: DatarobotEndpoint<'runAgenticSearchSyftrSearchPost'>;
	updateChatPromptDataChatPromptsChatPromptIdPatch: DatarobotEndpoint<'updateChatPromptDataChatPromptsChatPromptIdPatch'>;
	updateComparisonPromptComparisonPromptsComparisonPromptIdPatch: DatarobotEndpoint<'updateComparisonPromptComparisonPromptsComparisonPromptIdPatch'>;
	updateConnectedVectorDatabaseVectorDatabasesVectorDatabaseIdExternalVectorDatabaseDocumentsPatch: DatarobotEndpoint<'updateConnectedVectorDatabaseVectorDatabasesVectorDatabaseIdExternalVectorDatabaseDocumentsPatch'>;
	updateCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdPatch: DatarobotEndpoint<'updateCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdPatch'>;
	updateCustomModelLlmValidationCustomModelLLMValidationsValidationIdPatch: DatarobotEndpoint<'updateCustomModelLlmValidationCustomModelLLMValidationsValidationIdPatch'>;
	updateCustomModelValidationCustomModelEmbeddingValidationsValidationIdPatch: DatarobotEndpoint<'updateCustomModelValidationCustomModelEmbeddingValidationsValidationIdPatch'>;
	updateCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdPatch: DatarobotEndpoint<'updateCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdPatch'>;
	updateEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdPatch: DatarobotEndpoint<'updateEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdPatch'>;
	updateLlmBlueprintLlmBlueprintsLlmBlueprintIdPatch: DatarobotEndpoint<'updateLlmBlueprintLlmBlueprintsLlmBlueprintIdPatch'>;
	updatePlaygroundPlaygroundsPlaygroundIdPatch: DatarobotEndpoint<'updatePlaygroundPlaygroundsPlaygroundIdPatch'>;
	updateSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdPatch: DatarobotEndpoint<'updateSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdPatch'>;
	updateVectorDatabaseVectorDatabasesVectorDatabaseIdPatch: DatarobotEndpoint<'updateVectorDatabaseVectorDatabasesVectorDatabaseIdPatch'>;
	upsertPlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationPost: DatarobotEndpoint<'upsertPlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationPost'>;
	groupsCreate: DatarobotEndpoint<'groupsCreate'>;
	groupsDelete: DatarobotEndpoint<'groupsDelete'>;
	groupsDeleteMany: DatarobotEndpoint<'groupsDeleteMany'>;
	groupsList: DatarobotEndpoint<'groupsList'>;
	groupsPatch: DatarobotEndpoint<'groupsPatch'>;
	groupsRetrieve: DatarobotEndpoint<'groupsRetrieve'>;
	groupsUsersCreate: DatarobotEndpoint<'groupsUsersCreate'>;
	groupsUsersDeleteMany: DatarobotEndpoint<'groupsUsersDeleteMany'>;
	groupsUsersList: DatarobotEndpoint<'groupsUsersList'>;
	guardConfigurationsCreate: DatarobotEndpoint<'guardConfigurationsCreate'>;
	guardConfigurationsDelete: DatarobotEndpoint<'guardConfigurationsDelete'>;
	guardConfigurationsList: DatarobotEndpoint<'guardConfigurationsList'>;
	guardConfigurationsPatch: DatarobotEndpoint<'guardConfigurationsPatch'>;
	guardConfigurationsPredictionEnvironmentsInUseList: DatarobotEndpoint<'guardConfigurationsPredictionEnvironmentsInUseList'>;
	guardConfigurationsRetrieve: DatarobotEndpoint<'guardConfigurationsRetrieve'>;
	guardConfigurationsToNewCustomModelVersionCreate: DatarobotEndpoint<'guardConfigurationsToNewCustomModelVersionCreate'>;
	guardTemplatesList: DatarobotEndpoint<'guardTemplatesList'>;
	guardTemplatesRetrieve: DatarobotEndpoint<'guardTemplatesRetrieve'>;
	imageAugmentationListsCreate: DatarobotEndpoint<'imageAugmentationListsCreate'>;
	imageAugmentationListsDelete: DatarobotEndpoint<'imageAugmentationListsDelete'>;
	imageAugmentationListsList: DatarobotEndpoint<'imageAugmentationListsList'>;
	imageAugmentationListsPatch: DatarobotEndpoint<'imageAugmentationListsPatch'>;
	imageAugmentationListsRetrieve: DatarobotEndpoint<'imageAugmentationListsRetrieve'>;
	imageAugmentationListsSamplesCreate: DatarobotEndpoint<'imageAugmentationListsSamplesCreate'>;
	imageAugmentationListsSamplesList: DatarobotEndpoint<'imageAugmentationListsSamplesList'>;
	insightsConfusionMatrixCreate: DatarobotEndpoint<'insightsConfusionMatrixCreate'>;
	insightsConfusionMatrixModelsList: DatarobotEndpoint<'insightsConfusionMatrixModelsList'>;
	insightsFeatureEffectsCreate: DatarobotEndpoint<'insightsFeatureEffectsCreate'>;
	insightsFeatureEffectsModelsList: DatarobotEndpoint<'insightsFeatureEffectsModelsList'>;
	insightsFeatureImpactCreate: DatarobotEndpoint<'insightsFeatureImpactCreate'>;
	insightsFeatureImpactModelsList: DatarobotEndpoint<'insightsFeatureImpactModelsList'>;
	insightsLiftChartCreate: DatarobotEndpoint<'insightsLiftChartCreate'>;
	insightsLiftChartModelsList: DatarobotEndpoint<'insightsLiftChartModelsList'>;
	insightsModelsDelete: DatarobotEndpoint<'insightsModelsDelete'>;
	insightsResidualsCreate: DatarobotEndpoint<'insightsResidualsCreate'>;
	insightsResidualsModelsList: DatarobotEndpoint<'insightsResidualsModelsList'>;
	insightsRocCurveCreate: DatarobotEndpoint<'insightsRocCurveCreate'>;
	insightsRocCurveModelsList: DatarobotEndpoint<'insightsRocCurveModelsList'>;
	insightsShapDistributionsCreate: DatarobotEndpoint<'insightsShapDistributionsCreate'>;
	insightsShapDistributionsModelsList: DatarobotEndpoint<'insightsShapDistributionsModelsList'>;
	insightsShapImpactCreate: DatarobotEndpoint<'insightsShapImpactCreate'>;
	insightsShapImpactModelsList: DatarobotEndpoint<'insightsShapImpactModelsList'>;
	insightsShapMatrixCreate: DatarobotEndpoint<'insightsShapMatrixCreate'>;
	insightsShapMatrixModelsList: DatarobotEndpoint<'insightsShapMatrixModelsList'>;
	insightsShapPreviewCreate: DatarobotEndpoint<'insightsShapPreviewCreate'>;
	insightsShapPreviewModelsList: DatarobotEndpoint<'insightsShapPreviewModelsList'>;
	mlopsComputeBundlesList: DatarobotEndpoint<'mlopsComputeBundlesList'>;
	mlopsComputeBundlesRetrieve: DatarobotEndpoint<'mlopsComputeBundlesRetrieve'>;
	mlopsPortablePredictionServerImageList: DatarobotEndpoint<'mlopsPortablePredictionServerImageList'>;
	mlopsPortablePredictionServerImageMetadataList: DatarobotEndpoint<'mlopsPortablePredictionServerImageMetadataList'>;
	modelPackagesArchiveCreate: DatarobotEndpoint<'modelPackagesArchiveCreate'>;
	modelPackagesCapabilitiesList: DatarobotEndpoint<'modelPackagesCapabilitiesList'>;
	modelPackagesFeaturesList: DatarobotEndpoint<'modelPackagesFeaturesList'>;
	modelPackagesFromJSONCreate: DatarobotEndpoint<'modelPackagesFromJSONCreate'>;
	modelPackagesFromLeaderboardCreate: DatarobotEndpoint<'modelPackagesFromLeaderboardCreate'>;
	modelPackagesFromLearningModelCreate: DatarobotEndpoint<'modelPackagesFromLearningModelCreate'>;
	modelPackagesList: DatarobotEndpoint<'modelPackagesList'>;
	modelPackagesModelLogsList: DatarobotEndpoint<'modelPackagesModelLogsList'>;
	modelPackagesRetrieve: DatarobotEndpoint<'modelPackagesRetrieve'>;
	modelPackagesSharedRolesList: DatarobotEndpoint<'modelPackagesSharedRolesList'>;
	notebookCodeSnippetsList: DatarobotEndpoint<'notebookCodeSnippetsList'>;
	notebookCodeSnippetsRetrieve: DatarobotEndpoint<'notebookCodeSnippetsRetrieve'>;
	notebookCodeSnippetsTagsList: DatarobotEndpoint<'notebookCodeSnippetsTagsList'>;
	notebookEnvironmentVariablesCreate: DatarobotEndpoint<'notebookEnvironmentVariablesCreate'>;
	notebookEnvironmentVariablesDelete: DatarobotEndpoint<'notebookEnvironmentVariablesDelete'>;
	notebookEnvironmentVariablesDelete2: DatarobotEndpoint<'notebookEnvironmentVariablesDelete2'>;
	notebookEnvironmentVariablesPatch: DatarobotEndpoint<'notebookEnvironmentVariablesPatch'>;
	notebookEnvironmentVariablesRetrieve: DatarobotEndpoint<'notebookEnvironmentVariablesRetrieve'>;
	notebookExecutionEnvironmentsList: DatarobotEndpoint<'notebookExecutionEnvironmentsList'>;
	notebookExecutionEnvironmentsMachinesList: DatarobotEndpoint<'notebookExecutionEnvironmentsMachinesList'>;
	notebookExecutionEnvironmentsNotebooksList: DatarobotEndpoint<'notebookExecutionEnvironmentsNotebooksList'>;
	notebookExecutionEnvironmentsPatch: DatarobotEndpoint<'notebookExecutionEnvironmentsPatch'>;
	notebookExecutionEnvironmentsPortsCreate: DatarobotEndpoint<'notebookExecutionEnvironmentsPortsCreate'>;
	notebookExecutionEnvironmentsPortsDelete: DatarobotEndpoint<'notebookExecutionEnvironmentsPortsDelete'>;
	notebookExecutionEnvironmentsPortsDelete2: DatarobotEndpoint<'notebookExecutionEnvironmentsPortsDelete2'>;
	notebookExecutionEnvironmentsPortsList: DatarobotEndpoint<'notebookExecutionEnvironmentsPortsList'>;
	notebookExecutionEnvironmentsPortsPatch: DatarobotEndpoint<'notebookExecutionEnvironmentsPortsPatch'>;
	notebookExecutionEnvironmentsRetrieve: DatarobotEndpoint<'notebookExecutionEnvironmentsRetrieve'>;
	notebookExecutionEnvironmentsVersionsList: DatarobotEndpoint<'notebookExecutionEnvironmentsVersionsList'>;
	notebookJobsCancelCreate: DatarobotEndpoint<'notebookJobsCancelCreate'>;
	notebookJobsCreate: DatarobotEndpoint<'notebookJobsCreate'>;
	notebookJobsDelete: DatarobotEndpoint<'notebookJobsDelete'>;
	notebookJobsList: DatarobotEndpoint<'notebookJobsList'>;
	notebookJobsManualRunCreate: DatarobotEndpoint<'notebookJobsManualRunCreate'>;
	notebookJobsPatch: DatarobotEndpoint<'notebookJobsPatch'>;
	notebookJobsRetrieve: DatarobotEndpoint<'notebookJobsRetrieve'>;
	notebookJobsRunHistoryList: DatarobotEndpoint<'notebookJobsRunHistoryList'>;
	notebookRevisionsCellsList: DatarobotEndpoint<'notebookRevisionsCellsList'>;
	notebookRevisionsCreate: DatarobotEndpoint<'notebookRevisionsCreate'>;
	notebookRevisionsDelete: DatarobotEndpoint<'notebookRevisionsDelete'>;
	notebookRevisionsDelete2: DatarobotEndpoint<'notebookRevisionsDelete2'>;
	notebookRevisionsFromRevisionCloneCreate: DatarobotEndpoint<'notebookRevisionsFromRevisionCloneCreate'>;
	notebookRevisionsFromRevisionRestoreCreate: DatarobotEndpoint<'notebookRevisionsFromRevisionRestoreCreate'>;
	notebookRevisionsPatch: DatarobotEndpoint<'notebookRevisionsPatch'>;
	notebookRevisionsRetrieve: DatarobotEndpoint<'notebookRevisionsRetrieve'>;
	notebookRevisionsRetrieve2: DatarobotEndpoint<'notebookRevisionsRetrieve2'>;
	notebookRevisionsToFileList: DatarobotEndpoint<'notebookRevisionsToFileList'>;
	notebookSharedRolesList: DatarobotEndpoint<'notebookSharedRolesList'>;
	notebooksBatchClearCellsExecutionCountPatch: DatarobotEndpoint<'notebooksBatchClearCellsExecutionCountPatch'>;
	notebooksBulkLinkUseCaseCreate: DatarobotEndpoint<'notebooksBulkLinkUseCaseCreate'>;
	notebooksCellsBatchClearOutputPatch: DatarobotEndpoint<'notebooksCellsBatchClearOutputPatch'>;
	notebooksCellsBatchCreateCreate: DatarobotEndpoint<'notebooksCellsBatchCreateCreate'>;
	notebooksCellsBatchDeleteCreate: DatarobotEndpoint<'notebooksCellsBatchDeleteCreate'>;
	notebooksCellsBatchUpdateMetadataPatch: DatarobotEndpoint<'notebooksCellsBatchUpdateMetadataPatch'>;
	notebooksCellsBatchUpdateSourcesPatch: DatarobotEndpoint<'notebooksCellsBatchUpdateSourcesPatch'>;
	notebooksCellsCreate: DatarobotEndpoint<'notebooksCellsCreate'>;
	notebooksCellsDelete: DatarobotEndpoint<'notebooksCellsDelete'>;
	notebooksCellsList: DatarobotEndpoint<'notebooksCellsList'>;
	notebooksCellsOutputPatch: DatarobotEndpoint<'notebooksCellsOutputPatch'>;
	notebooksCellsPatch: DatarobotEndpoint<'notebooksCellsPatch'>;
	notebooksCreate: DatarobotEndpoint<'notebooksCreate'>;
	notebooksDelete: DatarobotEndpoint<'notebooksDelete'>;
	notebooksFilterOptionsList: DatarobotEndpoint<'notebooksFilterOptionsList'>;
	notebooksFromFileCreate: DatarobotEndpoint<'notebooksFromFileCreate'>;
	notebooksFromUrlCreate: DatarobotEndpoint<'notebooksFromUrlCreate'>;
	notebooksList: DatarobotEndpoint<'notebooksList'>;
	notebooksPatch: DatarobotEndpoint<'notebooksPatch'>;
	notebooksReorderCellsPatch: DatarobotEndpoint<'notebooksReorderCellsPatch'>;
	notebooksRetrieve: DatarobotEndpoint<'notebooksRetrieve'>;
	notebooksSharedRolesList: DatarobotEndpoint<'notebooksSharedRolesList'>;
	notebooksStatePatch: DatarobotEndpoint<'notebooksStatePatch'>;
	notebooksToCodespaceCreate: DatarobotEndpoint<'notebooksToCodespaceCreate'>;
	notebooksToFileList: DatarobotEndpoint<'notebooksToFileList'>;
	notificationChannelTemplatesCreate: DatarobotEndpoint<'notificationChannelTemplatesCreate'>;
	notificationChannelTemplatesDelete: DatarobotEndpoint<'notificationChannelTemplatesDelete'>;
	notificationChannelTemplatesList: DatarobotEndpoint<'notificationChannelTemplatesList'>;
	notificationChannelTemplatesPolicyTemplatesList: DatarobotEndpoint<'notificationChannelTemplatesPolicyTemplatesList'>;
	notificationChannelTemplatesPut: DatarobotEndpoint<'notificationChannelTemplatesPut'>;
	notificationChannelTemplatesRelatedPoliciesList: DatarobotEndpoint<'notificationChannelTemplatesRelatedPoliciesList'>;
	notificationChannelTemplatesRetrieve: DatarobotEndpoint<'notificationChannelTemplatesRetrieve'>;
	notificationChannelTemplatesSharedRolesList: DatarobotEndpoint<'notificationChannelTemplatesSharedRolesList'>;
	notificationChannelTemplatesSharedRolesPatchMany: DatarobotEndpoint<'notificationChannelTemplatesSharedRolesPatchMany'>;
	notificationEventsList: DatarobotEndpoint<'notificationEventsList'>;
	ocrJobResourcesCreate: DatarobotEndpoint<'ocrJobResourcesCreate'>;
	ocrJobResourcesErrorReportList: DatarobotEndpoint<'ocrJobResourcesErrorReportList'>;
	ocrJobResourcesErrorReportPutMany: DatarobotEndpoint<'ocrJobResourcesErrorReportPutMany'>;
	ocrJobResourcesJobProgressList: DatarobotEndpoint<'ocrJobResourcesJobProgressList'>;
	ocrJobResourcesJobStatusList: DatarobotEndpoint<'ocrJobResourcesJobStatusList'>;
	ocrJobResourcesList: DatarobotEndpoint<'ocrJobResourcesList'>;
	ocrJobResourcesRetrieve: DatarobotEndpoint<'ocrJobResourcesRetrieve'>;
	ocrJobResourcesStartCreate: DatarobotEndpoint<'ocrJobResourcesStartCreate'>;
	organizationsJobsList: DatarobotEndpoint<'organizationsJobsList'>;
	organizationsList: DatarobotEndpoint<'organizationsList'>;
	organizationsRetrieve: DatarobotEndpoint<'organizationsRetrieve'>;
	organizationsUsersCreate: DatarobotEndpoint<'organizationsUsersCreate'>;
	organizationsUsersList: DatarobotEndpoint<'organizationsUsersList'>;
	organizationsUsersPatch: DatarobotEndpoint<'organizationsUsersPatch'>;
	organizationsUsersRetrieve: DatarobotEndpoint<'organizationsUsersRetrieve'>;
	otelLogsDeleteMany: DatarobotEndpoint<'otelLogsDeleteMany'>;
	otelLogsList: DatarobotEndpoint<'otelLogsList'>;
	otelLogsPodInfoList: DatarobotEndpoint<'otelLogsPodInfoList'>;
	otelMetricsAutocollectedValuesList: DatarobotEndpoint<'otelMetricsAutocollectedValuesList'>;
	otelMetricsConfigsCreate: DatarobotEndpoint<'otelMetricsConfigsCreate'>;
	otelMetricsConfigsDelete: DatarobotEndpoint<'otelMetricsConfigsDelete'>;
	otelMetricsConfigsList: DatarobotEndpoint<'otelMetricsConfigsList'>;
	otelMetricsConfigsPatch: DatarobotEndpoint<'otelMetricsConfigsPatch'>;
	otelMetricsConfigsPutMany: DatarobotEndpoint<'otelMetricsConfigsPutMany'>;
	otelMetricsConfigsRetrieve: DatarobotEndpoint<'otelMetricsConfigsRetrieve'>;
	otelMetricsConsumersList: DatarobotEndpoint<'otelMetricsConsumersList'>;
	otelMetricsDeleteMany: DatarobotEndpoint<'otelMetricsDeleteMany'>;
	otelMetricsPodInfoList: DatarobotEndpoint<'otelMetricsPodInfoList'>;
	otelMetricsSummaryList: DatarobotEndpoint<'otelMetricsSummaryList'>;
	otelMetricsValueOverTimeList: DatarobotEndpoint<'otelMetricsValueOverTimeList'>;
	otelMetricsValuesList: DatarobotEndpoint<'otelMetricsValuesList'>;
	otelMetricsValuesOverTimeList: DatarobotEndpoint<'otelMetricsValuesOverTimeList'>;
	otelMetricsValuesOverTimeSegmentsCreate: DatarobotEndpoint<'otelMetricsValuesOverTimeSegmentsCreate'>;
	otelMetricsValuesOverTimeSegmentsRetrieve: DatarobotEndpoint<'otelMetricsValuesOverTimeSegmentsRetrieve'>;
	otelMetricsValuesSegmentsRetrieve: DatarobotEndpoint<'otelMetricsValuesSegmentsRetrieve'>;
	otelStatsList: DatarobotEndpoint<'otelStatsList'>;
	otelTracesDeleteMany: DatarobotEndpoint<'otelTracesDeleteMany'>;
	tracingList: DatarobotEndpoint<'tracingList'>;
	tracingRetrieve: DatarobotEndpoint<'tracingRetrieve'>;
	pinnedUsecasesList: DatarobotEndpoint<'pinnedUsecasesList'>;
	pinnedUsecasesPatchMany: DatarobotEndpoint<'pinnedUsecasesPatchMany'>;
	predictionServersList: DatarobotEndpoint<'predictionServersList'>;
	computedTrainingPredictionsList: DatarobotEndpoint<'computedTrainingPredictionsList'>;
	configureAndStartAutopilot: DatarobotEndpoint<'configureAndStartAutopilot'>;
	projectsAccessControlList: DatarobotEndpoint<'projectsAccessControlList'>;
	projectsAccessControlPatchMany: DatarobotEndpoint<'projectsAccessControlPatchMany'>;
	projectsAnomalyAssessmentRecordsDelete: DatarobotEndpoint<'projectsAnomalyAssessmentRecordsDelete'>;
	projectsAnomalyAssessmentRecordsExplanationsList: DatarobotEndpoint<'projectsAnomalyAssessmentRecordsExplanationsList'>;
	projectsAnomalyAssessmentRecordsList: DatarobotEndpoint<'projectsAnomalyAssessmentRecordsList'>;
	projectsAnomalyAssessmentRecordsPredictionsPreviewList: DatarobotEndpoint<'projectsAnomalyAssessmentRecordsPredictionsPreviewList'>;
	projectsAutopilotCreate: DatarobotEndpoint<'projectsAutopilotCreate'>;
	projectsAutopilotsCreate: DatarobotEndpoint<'projectsAutopilotsCreate'>;
	projectsBatchTypeTransformFeaturesCreate: DatarobotEndpoint<'projectsBatchTypeTransformFeaturesCreate'>;
	projectsBatchTypeTransformFeaturesResultRetrieve: DatarobotEndpoint<'projectsBatchTypeTransformFeaturesResultRetrieve'>;
	projectsBiasMitigatedModelsCreate: DatarobotEndpoint<'projectsBiasMitigatedModelsCreate'>;
	projectsBiasMitigatedModelsList: DatarobotEndpoint<'projectsBiasMitigatedModelsList'>;
	projectsBiasMitigationFeatureInfoCreateOne: DatarobotEndpoint<'projectsBiasMitigationFeatureInfoCreateOne'>;
	projectsBiasMitigationFeatureInfoList: DatarobotEndpoint<'projectsBiasMitigationFeatureInfoList'>;
	projectsBiasVsAccuracyInsightsList: DatarobotEndpoint<'projectsBiasVsAccuracyInsightsList'>;
	projectsBlenderModelsBlendCheckCreate: DatarobotEndpoint<'projectsBlenderModelsBlendCheckCreate'>;
	projectsBlenderModelsCreate: DatarobotEndpoint<'projectsBlenderModelsCreate'>;
	projectsBlenderModelsList: DatarobotEndpoint<'projectsBlenderModelsList'>;
	projectsBlenderModelsRetrieve: DatarobotEndpoint<'projectsBlenderModelsRetrieve'>;
	projectsBlueprintsBlueprintChartList: DatarobotEndpoint<'projectsBlueprintsBlueprintChartList'>;
	projectsBlueprintsBlueprintDocsList: DatarobotEndpoint<'projectsBlueprintsBlueprintDocsList'>;
	projectsBlueprintsJsonList: DatarobotEndpoint<'projectsBlueprintsJsonList'>;
	projectsBlueprintsList: DatarobotEndpoint<'projectsBlueprintsList'>;
	projectsBlueprintsRetrieve: DatarobotEndpoint<'projectsBlueprintsRetrieve'>;
	projectsCalendarEventsList: DatarobotEndpoint<'projectsCalendarEventsList'>;
	projectsCombinedModelsList: DatarobotEndpoint<'projectsCombinedModelsList'>;
	projectsCombinedModelsRetrieve: DatarobotEndpoint<'projectsCombinedModelsRetrieve'>;
	projectsCombinedModelsSegmentsDownloadList: DatarobotEndpoint<'projectsCombinedModelsSegmentsDownloadList'>;
	projectsCombinedModelsSegmentsList: DatarobotEndpoint<'projectsCombinedModelsSegmentsList'>;
	projectsCreate: DatarobotEndpoint<'projectsCreate'>;
	projectsCrossSeriesPropertiesCreate: DatarobotEndpoint<'projectsCrossSeriesPropertiesCreate'>;
	projectsDataSlicesList: DatarobotEndpoint<'projectsDataSlicesList'>;
	projectsDatetimeModelsAccuracyOverTimePlotsList: DatarobotEndpoint<'projectsDatetimeModelsAccuracyOverTimePlotsList'>;
	projectsDatetimeModelsAccuracyOverTimePlotsMetadataList: DatarobotEndpoint<'projectsDatetimeModelsAccuracyOverTimePlotsMetadataList'>;
	projectsDatetimeModelsAccuracyOverTimePlotsPreviewList: DatarobotEndpoint<'projectsDatetimeModelsAccuracyOverTimePlotsPreviewList'>;
	projectsDatetimeModelsAnomalyOverTimePlotsList: DatarobotEndpoint<'projectsDatetimeModelsAnomalyOverTimePlotsList'>;
	projectsDatetimeModelsAnomalyOverTimePlotsMetadataList: DatarobotEndpoint<'projectsDatetimeModelsAnomalyOverTimePlotsMetadataList'>;
	projectsDatetimeModelsAnomalyOverTimePlotsPreviewList: DatarobotEndpoint<'projectsDatetimeModelsAnomalyOverTimePlotsPreviewList'>;
	projectsDatetimeModelsBacktestStabilityPlotList: DatarobotEndpoint<'projectsDatetimeModelsBacktestStabilityPlotList'>;
	projectsDatetimeModelsBacktestsCreate: DatarobotEndpoint<'projectsDatetimeModelsBacktestsCreate'>;
	projectsDatetimeModelsCreate: DatarobotEndpoint<'projectsDatetimeModelsCreate'>;
	projectsDatetimeModelsDatasetAccuracyOverTimePlotsMetadataList: DatarobotEndpoint<'projectsDatetimeModelsDatasetAccuracyOverTimePlotsMetadataList'>;
	projectsDatetimeModelsDatasetAccuracyOverTimePlotsPreviewList: DatarobotEndpoint<'projectsDatetimeModelsDatasetAccuracyOverTimePlotsPreviewList'>;
	projectsDatetimeModelsDatasetAccuracyOverTimePlotsRetrieve: DatarobotEndpoint<'projectsDatetimeModelsDatasetAccuracyOverTimePlotsRetrieve'>;
	projectsDatetimeModelsDatetimeTrendPlotsCreate: DatarobotEndpoint<'projectsDatetimeModelsDatetimeTrendPlotsCreate'>;
	projectsDatetimeModelsFeatureEffectsCreate: DatarobotEndpoint<'projectsDatetimeModelsFeatureEffectsCreate'>;
	projectsDatetimeModelsFeatureEffectsList: DatarobotEndpoint<'projectsDatetimeModelsFeatureEffectsList'>;
	projectsDatetimeModelsFeatureEffectsMetadataList: DatarobotEndpoint<'projectsDatetimeModelsFeatureEffectsMetadataList'>;
	projectsDatetimeModelsForecastDistanceStabilityPlotList: DatarobotEndpoint<'projectsDatetimeModelsForecastDistanceStabilityPlotList'>;
	projectsDatetimeModelsForecastVsActualPlotsList: DatarobotEndpoint<'projectsDatetimeModelsForecastVsActualPlotsList'>;
	projectsDatetimeModelsForecastVsActualPlotsMetadataList: DatarobotEndpoint<'projectsDatetimeModelsForecastVsActualPlotsMetadataList'>;
	projectsDatetimeModelsForecastVsActualPlotsPreviewList: DatarobotEndpoint<'projectsDatetimeModelsForecastVsActualPlotsPreviewList'>;
	projectsDatetimeModelsFromModelCreate: DatarobotEndpoint<'projectsDatetimeModelsFromModelCreate'>;
	projectsDatetimeModelsList: DatarobotEndpoint<'projectsDatetimeModelsList'>;
	projectsDatetimeModelsMulticlassFeatureEffectsCreate: DatarobotEndpoint<'projectsDatetimeModelsMulticlassFeatureEffectsCreate'>;
	projectsDatetimeModelsMulticlassFeatureEffectsList: DatarobotEndpoint<'projectsDatetimeModelsMulticlassFeatureEffectsList'>;
	projectsDatetimeModelsMultiseriesHistogramsList: DatarobotEndpoint<'projectsDatetimeModelsMultiseriesHistogramsList'>;
	projectsDatetimeModelsMultiseriesScoresCreate: DatarobotEndpoint<'projectsDatetimeModelsMultiseriesScoresCreate'>;
	projectsDatetimeModelsMultiseriesScoresFileList: DatarobotEndpoint<'projectsDatetimeModelsMultiseriesScoresFileList'>;
	projectsDatetimeModelsMultiseriesScoresList: DatarobotEndpoint<'projectsDatetimeModelsMultiseriesScoresList'>;
	projectsDatetimeModelsRetrieve: DatarobotEndpoint<'projectsDatetimeModelsRetrieve'>;
	projectsDatetimePartitioningCreate: DatarobotEndpoint<'projectsDatetimePartitioningCreate'>;
	projectsDatetimePartitioningList: DatarobotEndpoint<'projectsDatetimePartitioningList'>;
	projectsDelete: DatarobotEndpoint<'projectsDelete'>;
	projectsDeploymentReadyModelsCreate: DatarobotEndpoint<'projectsDeploymentReadyModelsCreate'>;
	projectsDiscardedFeaturesList: DatarobotEndpoint<'projectsDiscardedFeaturesList'>;
	projectsDocumentPagesFileList: DatarobotEndpoint<'projectsDocumentPagesFileList'>;
	projectsDocumentTextExtractionSamplesList: DatarobotEndpoint<'projectsDocumentTextExtractionSamplesList'>;
	projectsDocumentThumbnailBinsList: DatarobotEndpoint<'projectsDocumentThumbnailBinsList'>;
	projectsDocumentThumbnailSamplesList: DatarobotEndpoint<'projectsDocumentThumbnailSamplesList'>;
	projectsDocumentThumbnailsList: DatarobotEndpoint<'projectsDocumentThumbnailsList'>;
	projectsDocumentsDataQualityLogFileList: DatarobotEndpoint<'projectsDocumentsDataQualityLogFileList'>;
	projectsDocumentsDataQualityLogList: DatarobotEndpoint<'projectsDocumentsDataQualityLogList'>;
	projectsDuplicateImagesList: DatarobotEndpoint<'projectsDuplicateImagesList'>;
	projectsEureqaDistributionPlotRetrieve: DatarobotEndpoint<'projectsEureqaDistributionPlotRetrieve'>;
	projectsEureqaModelDetailRetrieve: DatarobotEndpoint<'projectsEureqaModelDetailRetrieve'>;
	projectsEureqaModelsCreate: DatarobotEndpoint<'projectsEureqaModelsCreate'>;
	projectsEureqaModelsRetrieve: DatarobotEndpoint<'projectsEureqaModelsRetrieve'>;
	projectsExternalScoresCreate: DatarobotEndpoint<'projectsExternalScoresCreate'>;
	projectsExternalScoresList: DatarobotEndpoint<'projectsExternalScoresList'>;
	projectsExternalTimeSeriesBaselineDataValidationJobsCreate: DatarobotEndpoint<'projectsExternalTimeSeriesBaselineDataValidationJobsCreate'>;
	projectsExternalTimeSeriesBaselineDataValidationJobsRetrieve: DatarobotEndpoint<'projectsExternalTimeSeriesBaselineDataValidationJobsRetrieve'>;
	projectsFeatureAssociationFeaturelistsList: DatarobotEndpoint<'projectsFeatureAssociationFeaturelistsList'>;
	projectsFeatureAssociationMatrixCreate: DatarobotEndpoint<'projectsFeatureAssociationMatrixCreate'>;
	projectsFeatureAssociationMatrixDetailsList: DatarobotEndpoint<'projectsFeatureAssociationMatrixDetailsList'>;
	projectsFeatureAssociationMatrixList: DatarobotEndpoint<'projectsFeatureAssociationMatrixList'>;
	projectsFeatureDiscoveryDatasetDownloadList: DatarobotEndpoint<'projectsFeatureDiscoveryDatasetDownloadList'>;
	projectsFeatureDiscoveryLogsDownloadList: DatarobotEndpoint<'projectsFeatureDiscoveryLogsDownloadList'>;
	projectsFeatureDiscoveryLogsList: DatarobotEndpoint<'projectsFeatureDiscoveryLogsList'>;
	projectsFeatureDiscoveryRecipeSQLsDownloadList: DatarobotEndpoint<'projectsFeatureDiscoveryRecipeSQLsDownloadList'>;
	projectsFeatureDiscoveryRecipeSqlExportsCreate: DatarobotEndpoint<'projectsFeatureDiscoveryRecipeSqlExportsCreate'>;
	projectsFeatureHistogramsRetrieve: DatarobotEndpoint<'projectsFeatureHistogramsRetrieve'>;
	projectsFeatureLineagesRetrieve: DatarobotEndpoint<'projectsFeatureLineagesRetrieve'>;
	projectsFeaturelistsCreate: DatarobotEndpoint<'projectsFeaturelistsCreate'>;
	projectsFeaturelistsDelete: DatarobotEndpoint<'projectsFeaturelistsDelete'>;
	projectsFeaturelistsList: DatarobotEndpoint<'projectsFeaturelistsList'>;
	projectsFeaturelistsPatch: DatarobotEndpoint<'projectsFeaturelistsPatch'>;
	projectsFeaturelistsRetrieve: DatarobotEndpoint<'projectsFeaturelistsRetrieve'>;
	projectsFeaturesFrequentValuesList: DatarobotEndpoint<'projectsFeaturesFrequentValuesList'>;
	projectsFeaturesList: DatarobotEndpoint<'projectsFeaturesList'>;
	projectsFeaturesMetricsList: DatarobotEndpoint<'projectsFeaturesMetricsList'>;
	projectsFeaturesMultiseriesPropertiesList: DatarobotEndpoint<'projectsFeaturesMultiseriesPropertiesList'>;
	projectsFeaturesRetrieve: DatarobotEndpoint<'projectsFeaturesRetrieve'>;
	projectsFrozenDatetimeModelsCreate: DatarobotEndpoint<'projectsFrozenDatetimeModelsCreate'>;
	projectsFrozenModelsCreate: DatarobotEndpoint<'projectsFrozenModelsCreate'>;
	projectsFrozenModelsList: DatarobotEndpoint<'projectsFrozenModelsList'>;
	projectsFrozenModelsRetrieve: DatarobotEndpoint<'projectsFrozenModelsRetrieve'>;
	projectsGeometryFeaturePlotsCreate: DatarobotEndpoint<'projectsGeometryFeaturePlotsCreate'>;
	projectsGeometryFeaturePlotsRetrieve: DatarobotEndpoint<'projectsGeometryFeaturePlotsRetrieve'>;
	projectsImageActivationMapsList: DatarobotEndpoint<'projectsImageActivationMapsList'>;
	projectsImageBinsList: DatarobotEndpoint<'projectsImageBinsList'>;
	projectsImageEmbeddingsList: DatarobotEndpoint<'projectsImageEmbeddingsList'>;
	projectsImageSamplesList: DatarobotEndpoint<'projectsImageSamplesList'>;
	projectsImagesDataQualityLogFileList: DatarobotEndpoint<'projectsImagesDataQualityLogFileList'>;
	projectsImagesDataQualityLogList: DatarobotEndpoint<'projectsImagesDataQualityLogList'>;
	projectsImagesFileList: DatarobotEndpoint<'projectsImagesFileList'>;
	projectsImagesList: DatarobotEndpoint<'projectsImagesList'>;
	projectsImagesRetrieve: DatarobotEndpoint<'projectsImagesRetrieve'>;
	projectsIncrementalLearningModelsFromModelCreate: DatarobotEndpoint<'projectsIncrementalLearningModelsFromModelCreate'>;
	projectsJobsDelete: DatarobotEndpoint<'projectsJobsDelete'>;
	projectsJobsList: DatarobotEndpoint<'projectsJobsList'>;
	projectsJobsRetrieve: DatarobotEndpoint<'projectsJobsRetrieve'>;
	projectsList: DatarobotEndpoint<'projectsList'>;
	projectsModelJobsDelete: DatarobotEndpoint<'projectsModelJobsDelete'>;
	projectsModelJobsList: DatarobotEndpoint<'projectsModelJobsList'>;
	projectsModelJobsRetrieve: DatarobotEndpoint<'projectsModelJobsRetrieve'>;
	projectsModelRecordsList: DatarobotEndpoint<'projectsModelRecordsList'>;
	projectsModelingFeaturelistsCreate: DatarobotEndpoint<'projectsModelingFeaturelistsCreate'>;
	projectsModelingFeaturelistsDelete: DatarobotEndpoint<'projectsModelingFeaturelistsDelete'>;
	projectsModelingFeaturelistsList: DatarobotEndpoint<'projectsModelingFeaturelistsList'>;
	projectsModelingFeaturelistsPatch: DatarobotEndpoint<'projectsModelingFeaturelistsPatch'>;
	projectsModelingFeaturelistsRetrieve: DatarobotEndpoint<'projectsModelingFeaturelistsRetrieve'>;
	projectsModelingFeaturesFromDiscardedFeaturesCreate: DatarobotEndpoint<'projectsModelingFeaturesFromDiscardedFeaturesCreate'>;
	projectsModelingFeaturesList: DatarobotEndpoint<'projectsModelingFeaturesList'>;
	projectsModelingFeaturesRetrieve: DatarobotEndpoint<'projectsModelingFeaturesRetrieve'>;
	projectsModelsAdvancedTuningCreate: DatarobotEndpoint<'projectsModelsAdvancedTuningCreate'>;
	projectsModelsAdvancedTuningParametersList: DatarobotEndpoint<'projectsModelsAdvancedTuningParametersList'>;
	projectsModelsAnomalyAssessmentInitializationCreate: DatarobotEndpoint<'projectsModelsAnomalyAssessmentInitializationCreate'>;
	projectsModelsAnomalyInsightsFileList: DatarobotEndpoint<'projectsModelsAnomalyInsightsFileList'>;
	projectsModelsAnomalyInsightsTableList: DatarobotEndpoint<'projectsModelsAnomalyInsightsTableList'>;
	projectsModelsBlueprintChartList: DatarobotEndpoint<'projectsModelsBlueprintChartList'>;
	projectsModelsBlueprintDocsList: DatarobotEndpoint<'projectsModelsBlueprintDocsList'>;
	projectsModelsClusterInsightsCreate: DatarobotEndpoint<'projectsModelsClusterInsightsCreate'>;
	projectsModelsClusterInsightsDownloadList: DatarobotEndpoint<'projectsModelsClusterInsightsDownloadList'>;
	projectsModelsClusterInsightsList: DatarobotEndpoint<'projectsModelsClusterInsightsList'>;
	projectsModelsClusterNamesList: DatarobotEndpoint<'projectsModelsClusterNamesList'>;
	projectsModelsClusterNamesPatchMany: DatarobotEndpoint<'projectsModelsClusterNamesPatchMany'>;
	projectsModelsConfusionChartsClassDetailsList: DatarobotEndpoint<'projectsModelsConfusionChartsClassDetailsList'>;
	projectsModelsConfusionChartsList: DatarobotEndpoint<'projectsModelsConfusionChartsList'>;
	projectsModelsConfusionChartsMetadataList: DatarobotEndpoint<'projectsModelsConfusionChartsMetadataList'>;
	projectsModelsConfusionChartsRetrieve: DatarobotEndpoint<'projectsModelsConfusionChartsRetrieve'>;
	projectsModelsCreate: DatarobotEndpoint<'projectsModelsCreate'>;
	projectsModelsCrossClassAccuracyScoresCreate: DatarobotEndpoint<'projectsModelsCrossClassAccuracyScoresCreate'>;
	projectsModelsCrossClassAccuracyScoresList: DatarobotEndpoint<'projectsModelsCrossClassAccuracyScoresList'>;
	projectsModelsCrossValidationCreate: DatarobotEndpoint<'projectsModelsCrossValidationCreate'>;
	projectsModelsCrossValidationScoresList: DatarobotEndpoint<'projectsModelsCrossValidationScoresList'>;
	projectsModelsDataDisparityInsightsCreate: DatarobotEndpoint<'projectsModelsDataDisparityInsightsCreate'>;
	projectsModelsDataDisparityInsightsList: DatarobotEndpoint<'projectsModelsDataDisparityInsightsList'>;
	projectsModelsDatasetConfusionChartsClassDetailsList: DatarobotEndpoint<'projectsModelsDatasetConfusionChartsClassDetailsList'>;
	projectsModelsDatasetConfusionChartsList: DatarobotEndpoint<'projectsModelsDatasetConfusionChartsList'>;
	projectsModelsDatasetConfusionChartsMetadataList: DatarobotEndpoint<'projectsModelsDatasetConfusionChartsMetadataList'>;
	projectsModelsDatasetConfusionChartsRetrieve: DatarobotEndpoint<'projectsModelsDatasetConfusionChartsRetrieve'>;
	projectsModelsDatasetLiftChartsList: DatarobotEndpoint<'projectsModelsDatasetLiftChartsList'>;
	projectsModelsDatasetMulticlassLiftChartsList: DatarobotEndpoint<'projectsModelsDatasetMulticlassLiftChartsList'>;
	projectsModelsDatasetResidualsChartsList: DatarobotEndpoint<'projectsModelsDatasetResidualsChartsList'>;
	projectsModelsDatasetRocCurvesList: DatarobotEndpoint<'projectsModelsDatasetRocCurvesList'>;
	projectsModelsDelete: DatarobotEndpoint<'projectsModelsDelete'>;
	projectsModelsFairnessInsightsCreate: DatarobotEndpoint<'projectsModelsFairnessInsightsCreate'>;
	projectsModelsFairnessInsightsList: DatarobotEndpoint<'projectsModelsFairnessInsightsList'>;
	projectsModelsFeatureEffectsCreate: DatarobotEndpoint<'projectsModelsFeatureEffectsCreate'>;
	projectsModelsFeatureEffectsList: DatarobotEndpoint<'projectsModelsFeatureEffectsList'>;
	projectsModelsFeatureEffectsMetadataList: DatarobotEndpoint<'projectsModelsFeatureEffectsMetadataList'>;
	projectsModelsFeatureImpactCreate: DatarobotEndpoint<'projectsModelsFeatureImpactCreate'>;
	projectsModelsFeatureImpactList: DatarobotEndpoint<'projectsModelsFeatureImpactList'>;
	projectsModelsFeatureListsClusterInsightsList: DatarobotEndpoint<'projectsModelsFeatureListsClusterInsightsList'>;
	projectsModelsFeaturesList: DatarobotEndpoint<'projectsModelsFeaturesList'>;
	projectsModelsFromModelCreate: DatarobotEndpoint<'projectsModelsFromModelCreate'>;
	projectsModelsGridSearchScoresList: DatarobotEndpoint<'projectsModelsGridSearchScoresList'>;
	projectsModelsImageActivationMapsCreate: DatarobotEndpoint<'projectsModelsImageActivationMapsCreate'>;
	projectsModelsImageActivationMapsList: DatarobotEndpoint<'projectsModelsImageActivationMapsList'>;
	projectsModelsImageEmbeddingsCreate: DatarobotEndpoint<'projectsModelsImageEmbeddingsCreate'>;
	projectsModelsImageEmbeddingsList: DatarobotEndpoint<'projectsModelsImageEmbeddingsList'>;
	projectsModelsLabelwiseRocCurvesList: DatarobotEndpoint<'projectsModelsLabelwiseRocCurvesList'>;
	projectsModelsLiftChartList: DatarobotEndpoint<'projectsModelsLiftChartList'>;
	projectsModelsLiftChartRetrieve: DatarobotEndpoint<'projectsModelsLiftChartRetrieve'>;
	projectsModelsList: DatarobotEndpoint<'projectsModelsList'>;
	projectsModelsLogsList: DatarobotEndpoint<'projectsModelsLogsList'>;
	projectsModelsMissingReportList: DatarobotEndpoint<'projectsModelsMissingReportList'>;
	projectsModelsMulticlassFeatureEffectsCreate: DatarobotEndpoint<'projectsModelsMulticlassFeatureEffectsCreate'>;
	projectsModelsMulticlassFeatureEffectsList: DatarobotEndpoint<'projectsModelsMulticlassFeatureEffectsList'>;
	projectsModelsMulticlassFeatureImpactList: DatarobotEndpoint<'projectsModelsMulticlassFeatureImpactList'>;
	projectsModelsMulticlassLiftChartList: DatarobotEndpoint<'projectsModelsMulticlassLiftChartList'>;
	projectsModelsMulticlassLiftChartRetrieve: DatarobotEndpoint<'projectsModelsMulticlassLiftChartRetrieve'>;
	projectsModelsMultilabelLiftChartsRetrieve: DatarobotEndpoint<'projectsModelsMultilabelLiftChartsRetrieve'>;
	projectsModelsNumIterationsTrainedList: DatarobotEndpoint<'projectsModelsNumIterationsTrainedList'>;
	projectsModelsParametersList: DatarobotEndpoint<'projectsModelsParametersList'>;
	projectsModelsPatch: DatarobotEndpoint<'projectsModelsPatch'>;
	projectsModelsPredictionExplanationsInitializationCreate: DatarobotEndpoint<'projectsModelsPredictionExplanationsInitializationCreate'>;
	projectsModelsPredictionExplanationsInitializationDeleteMany: DatarobotEndpoint<'projectsModelsPredictionExplanationsInitializationDeleteMany'>;
	projectsModelsPredictionExplanationsInitializationList: DatarobotEndpoint<'projectsModelsPredictionExplanationsInitializationList'>;
	projectsModelsPredictionIntervalsCreate: DatarobotEndpoint<'projectsModelsPredictionIntervalsCreate'>;
	projectsModelsPredictionIntervalsList: DatarobotEndpoint<'projectsModelsPredictionIntervalsList'>;
	projectsModelsPrimeInfoList: DatarobotEndpoint<'projectsModelsPrimeInfoList'>;
	projectsModelsPrimeRulesetsCreate: DatarobotEndpoint<'projectsModelsPrimeRulesetsCreate'>;
	projectsModelsPrimeRulesetsList: DatarobotEndpoint<'projectsModelsPrimeRulesetsList'>;
	projectsModelsResidualsList: DatarobotEndpoint<'projectsModelsResidualsList'>;
	projectsModelsResidualsRetrieve: DatarobotEndpoint<'projectsModelsResidualsRetrieve'>;
	projectsModelsRetrieve: DatarobotEndpoint<'projectsModelsRetrieve'>;
	projectsModelsRocCurveList: DatarobotEndpoint<'projectsModelsRocCurveList'>;
	projectsModelsRocCurveRetrieve: DatarobotEndpoint<'projectsModelsRocCurveRetrieve'>;
	projectsModelsScoringCodeList: DatarobotEndpoint<'projectsModelsScoringCodeList'>;
	projectsModelsShapImpactCreate: DatarobotEndpoint<'projectsModelsShapImpactCreate'>;
	projectsModelsShapImpactList: DatarobotEndpoint<'projectsModelsShapImpactList'>;
	projectsModelsSupportedCapabilitiesList: DatarobotEndpoint<'projectsModelsSupportedCapabilitiesList'>;
	projectsModelsTrainingArtifactList: DatarobotEndpoint<'projectsModelsTrainingArtifactList'>;
	projectsModelsWordCloudList: DatarobotEndpoint<'projectsModelsWordCloudList'>;
	projectsMulticategoricalInvalidFormatFileList: DatarobotEndpoint<'projectsMulticategoricalInvalidFormatFileList'>;
	projectsMulticategoricalInvalidFormatList: DatarobotEndpoint<'projectsMulticategoricalInvalidFormatList'>;
	projectsMultiseriesIdsCrossSeriesPropertiesList: DatarobotEndpoint<'projectsMultiseriesIdsCrossSeriesPropertiesList'>;
	projectsMultiseriesNamesList: DatarobotEndpoint<'projectsMultiseriesNamesList'>;
	projectsMultiseriesPropertiesCreate: DatarobotEndpoint<'projectsMultiseriesPropertiesCreate'>;
	projectsOptimizedDatetimePartitioningsCreate: DatarobotEndpoint<'projectsOptimizedDatetimePartitioningsCreate'>;
	projectsOptimizedDatetimePartitioningsDatetimePartitioningInputList: DatarobotEndpoint<'projectsOptimizedDatetimePartitioningsDatetimePartitioningInputList'>;
	projectsOptimizedDatetimePartitioningsDatetimePartitioningLogFileList: DatarobotEndpoint<'projectsOptimizedDatetimePartitioningsDatetimePartitioningLogFileList'>;
	projectsOptimizedDatetimePartitioningsDatetimePartitioningLogList: DatarobotEndpoint<'projectsOptimizedDatetimePartitioningsDatetimePartitioningLogList'>;
	projectsOptimizedDatetimePartitioningsList: DatarobotEndpoint<'projectsOptimizedDatetimePartitioningsList'>;
	projectsOptimizedDatetimePartitioningsRetrieve: DatarobotEndpoint<'projectsOptimizedDatetimePartitioningsRetrieve'>;
	projectsPatch: DatarobotEndpoint<'projectsPatch'>;
	projectsPayoffMatricesCreate: DatarobotEndpoint<'projectsPayoffMatricesCreate'>;
	projectsPayoffMatricesDelete: DatarobotEndpoint<'projectsPayoffMatricesDelete'>;
	projectsPayoffMatricesList: DatarobotEndpoint<'projectsPayoffMatricesList'>;
	projectsPayoffMatricesPut: DatarobotEndpoint<'projectsPayoffMatricesPut'>;
	projectsPredictJobsDelete: DatarobotEndpoint<'projectsPredictJobsDelete'>;
	projectsPredictJobsList: DatarobotEndpoint<'projectsPredictJobsList'>;
	projectsPredictJobsRetrieve: DatarobotEndpoint<'projectsPredictJobsRetrieve'>;
	projectsPredictionDatasetsDataSourceUploadsCreate: DatarobotEndpoint<'projectsPredictionDatasetsDataSourceUploadsCreate'>;
	projectsPredictionDatasetsDatasetUploadsCreate: DatarobotEndpoint<'projectsPredictionDatasetsDatasetUploadsCreate'>;
	projectsPredictionDatasetsDelete: DatarobotEndpoint<'projectsPredictionDatasetsDelete'>;
	projectsPredictionDatasetsFileUploadsCreate: DatarobotEndpoint<'projectsPredictionDatasetsFileUploadsCreate'>;
	projectsPredictionDatasetsList: DatarobotEndpoint<'projectsPredictionDatasetsList'>;
	projectsPredictionDatasetsRetrieve: DatarobotEndpoint<'projectsPredictionDatasetsRetrieve'>;
	projectsPredictionDatasetsUrlUploadsCreate: DatarobotEndpoint<'projectsPredictionDatasetsUrlUploadsCreate'>;
	projectsPredictionExplanationsCreate: DatarobotEndpoint<'projectsPredictionExplanationsCreate'>;
	projectsPredictionExplanationsList: DatarobotEndpoint<'projectsPredictionExplanationsList'>;
	projectsPredictionExplanationsRecordsDelete: DatarobotEndpoint<'projectsPredictionExplanationsRecordsDelete'>;
	projectsPredictionExplanationsRecordsList: DatarobotEndpoint<'projectsPredictionExplanationsRecordsList'>;
	projectsPredictionExplanationsRecordsRetrieve: DatarobotEndpoint<'projectsPredictionExplanationsRecordsRetrieve'>;
	projectsPredictionsCreate: DatarobotEndpoint<'projectsPredictionsCreate'>;
	projectsPredictionsList: DatarobotEndpoint<'projectsPredictionsList'>;
	projectsPredictionsMetadataList: DatarobotEndpoint<'projectsPredictionsMetadataList'>;
	projectsPredictionsMetadataRetrieve: DatarobotEndpoint<'projectsPredictionsMetadataRetrieve'>;
	projectsPredictionsRetrieve: DatarobotEndpoint<'projectsPredictionsRetrieve'>;
	projectsPrimeFilesCreate: DatarobotEndpoint<'projectsPrimeFilesCreate'>;
	projectsPrimeFilesDownloadList: DatarobotEndpoint<'projectsPrimeFilesDownloadList'>;
	projectsPrimeFilesList: DatarobotEndpoint<'projectsPrimeFilesList'>;
	projectsPrimeFilesRetrieve: DatarobotEndpoint<'projectsPrimeFilesRetrieve'>;
	projectsPrimeModelsCreate: DatarobotEndpoint<'projectsPrimeModelsCreate'>;
	projectsPrimeModelsList: DatarobotEndpoint<'projectsPrimeModelsList'>;
	projectsPrimeModelsRetrieve: DatarobotEndpoint<'projectsPrimeModelsRetrieve'>;
	projectsRatingTableModelsCreate: DatarobotEndpoint<'projectsRatingTableModelsCreate'>;
	projectsRatingTableModelsList: DatarobotEndpoint<'projectsRatingTableModelsList'>;
	projectsRatingTableModelsRetrieve: DatarobotEndpoint<'projectsRatingTableModelsRetrieve'>;
	projectsRatingTablesCreate: DatarobotEndpoint<'projectsRatingTablesCreate'>;
	projectsRatingTablesFileList: DatarobotEndpoint<'projectsRatingTablesFileList'>;
	projectsRatingTablesList: DatarobotEndpoint<'projectsRatingTablesList'>;
	projectsRatingTablesPatch: DatarobotEndpoint<'projectsRatingTablesPatch'>;
	projectsRatingTablesRetrieve: DatarobotEndpoint<'projectsRatingTablesRetrieve'>;
	projectsRecommendedModelsList: DatarobotEndpoint<'projectsRecommendedModelsList'>;
	projectsRecommendedModelsRecommendedModelList: DatarobotEndpoint<'projectsRecommendedModelsRecommendedModelList'>;
	projectsRelationshipQualityAssessmentsCreate: DatarobotEndpoint<'projectsRelationshipQualityAssessmentsCreate'>;
	projectsRelationshipsConfigurationList: DatarobotEndpoint<'projectsRelationshipsConfigurationList'>;
	projectsRetrieve: DatarobotEndpoint<'projectsRetrieve'>;
	projectsRuleFitFilesCreate: DatarobotEndpoint<'projectsRuleFitFilesCreate'>;
	projectsRuleFitFilesDownloadList: DatarobotEndpoint<'projectsRuleFitFilesDownloadList'>;
	projectsRuleFitFilesList: DatarobotEndpoint<'projectsRuleFitFilesList'>;
	projectsRuleFitFilesRetrieve: DatarobotEndpoint<'projectsRuleFitFilesRetrieve'>;
	projectsSecondaryDatasetsConfigurationsCreate: DatarobotEndpoint<'projectsSecondaryDatasetsConfigurationsCreate'>;
	projectsSecondaryDatasetsConfigurationsDelete: DatarobotEndpoint<'projectsSecondaryDatasetsConfigurationsDelete'>;
	projectsSecondaryDatasetsConfigurationsList: DatarobotEndpoint<'projectsSecondaryDatasetsConfigurationsList'>;
	projectsSecondaryDatasetsConfigurationsRetrieve: DatarobotEndpoint<'projectsSecondaryDatasetsConfigurationsRetrieve'>;
	projectsSegmentChampionPutMany: DatarobotEndpoint<'projectsSegmentChampionPutMany'>;
	projectsSegmentationTaskJobResultsRetrieve: DatarobotEndpoint<'projectsSegmentationTaskJobResultsRetrieve'>;
	projectsSegmentationTasksCreate: DatarobotEndpoint<'projectsSegmentationTasksCreate'>;
	projectsSegmentationTasksList: DatarobotEndpoint<'projectsSegmentationTasksList'>;
	projectsSegmentationTasksMappingsList: DatarobotEndpoint<'projectsSegmentationTasksMappingsList'>;
	projectsSegmentationTasksRetrieve: DatarobotEndpoint<'projectsSegmentationTasksRetrieve'>;
	projectsSegmentsPatch: DatarobotEndpoint<'projectsSegmentsPatch'>;
	projectsShapMatricesCreate: DatarobotEndpoint<'projectsShapMatricesCreate'>;
	projectsShapMatricesList: DatarobotEndpoint<'projectsShapMatricesList'>;
	projectsShapMatricesRetrieve: DatarobotEndpoint<'projectsShapMatricesRetrieve'>;
	projectsStatusList: DatarobotEndpoint<'projectsStatusList'>;
	projectsTimeSeriesFeatureLogFileList: DatarobotEndpoint<'projectsTimeSeriesFeatureLogFileList'>;
	projectsTimeSeriesFeatureLogList: DatarobotEndpoint<'projectsTimeSeriesFeatureLogList'>;
	projectsTrainingPredictionsCreate: DatarobotEndpoint<'projectsTrainingPredictionsCreate'>;
	projectsTypeTransformFeaturesCreate: DatarobotEndpoint<'projectsTypeTransformFeaturesCreate'>;
	trainingPredictionsList: DatarobotEndpoint<'trainingPredictionsList'>;
	quotaTemplatesList: DatarobotEndpoint<'quotaTemplatesList'>;
	quotaTemplatesRetrieve: DatarobotEndpoint<'quotaTemplatesRetrieve'>;
	quotasCreate: DatarobotEndpoint<'quotasCreate'>;
	quotasDelete: DatarobotEndpoint<'quotasDelete'>;
	quotasList: DatarobotEndpoint<'quotasList'>;
	quotasPatch: DatarobotEndpoint<'quotasPatch'>;
	quotasRetrieve: DatarobotEndpoint<'quotasRetrieve'>;
	recipesDelete: DatarobotEndpoint<'recipesDelete'>;
	recipesDownsamplingPutMany: DatarobotEndpoint<'recipesDownsamplingPutMany'>;
	recipesFromDataStoreCreate: DatarobotEndpoint<'recipesFromDataStoreCreate'>;
	recipesFromDatasetCreate: DatarobotEndpoint<'recipesFromDatasetCreate'>;
	recipesFromRecipeCreate: DatarobotEndpoint<'recipesFromRecipeCreate'>;
	recipesInputsList: DatarobotEndpoint<'recipesInputsList'>;
	recipesInputsPutMany: DatarobotEndpoint<'recipesInputsPutMany'>;
	recipesInsightsList: DatarobotEndpoint<'recipesInsightsList'>;
	recipesList: DatarobotEndpoint<'recipesList'>;
	recipesOperationsPutMany: DatarobotEndpoint<'recipesOperationsPutMany'>;
	recipesOperationsRetrieve: DatarobotEndpoint<'recipesOperationsRetrieve'>;
	recipesPatch: DatarobotEndpoint<'recipesPatch'>;
	recipesPreviewCreate: DatarobotEndpoint<'recipesPreviewCreate'>;
	recipesPreviewList: DatarobotEndpoint<'recipesPreviewList'>;
	recipesRelationshipQualityAssessmentsCreate: DatarobotEndpoint<'recipesRelationshipQualityAssessmentsCreate'>;
	recipesRetrieve: DatarobotEndpoint<'recipesRetrieve'>;
	recipesSettingsPatchMany: DatarobotEndpoint<'recipesSettingsPatchMany'>;
	recipesSqlCreate: DatarobotEndpoint<'recipesSqlCreate'>;
	recipesTimeseriesTransformationPlansCreate: DatarobotEndpoint<'recipesTimeseriesTransformationPlansCreate'>;
	recipesTimeseriesTransformationPlansRetrieve: DatarobotEndpoint<'recipesTimeseriesTransformationPlansRetrieve'>;
	registeredModelsDelete: DatarobotEndpoint<'registeredModelsDelete'>;
	registeredModelsDeploymentsList: DatarobotEndpoint<'registeredModelsDeploymentsList'>;
	registeredModelsList: DatarobotEndpoint<'registeredModelsList'>;
	registeredModelsPatch: DatarobotEndpoint<'registeredModelsPatch'>;
	registeredModelsRetrieve: DatarobotEndpoint<'registeredModelsRetrieve'>;
	registeredModelsSharedRolesList: DatarobotEndpoint<'registeredModelsSharedRolesList'>;
	registeredModelsSharedRolesPatchMany: DatarobotEndpoint<'registeredModelsSharedRolesPatchMany'>;
	registeredModelsVersionsDeploymentsList: DatarobotEndpoint<'registeredModelsVersionsDeploymentsList'>;
	registeredModelsVersionsList: DatarobotEndpoint<'registeredModelsVersionsList'>;
	registeredModelsVersionsRetrieve: DatarobotEndpoint<'registeredModelsVersionsRetrieve'>;
	relationshipsConfigurationsCreate: DatarobotEndpoint<'relationshipsConfigurationsCreate'>;
	relationshipsConfigurationsDelete: DatarobotEndpoint<'relationshipsConfigurationsDelete'>;
	relationshipsConfigurationsPut: DatarobotEndpoint<'relationshipsConfigurationsPut'>;
	relationshipsConfigurationsRetrieve: DatarobotEndpoint<'relationshipsConfigurationsRetrieve'>;
	relationshipsConfigurationsRetrieveExtended: DatarobotEndpoint<'relationshipsConfigurationsRetrieveExtended'>;
	remoteEventsCreate: DatarobotEndpoint<'remoteEventsCreate'>;
	scheduledJobsList: DatarobotEndpoint<'scheduledJobsList'>;
	seatLicenseAllocationsCreate: DatarobotEndpoint<'seatLicenseAllocationsCreate'>;
	seatLicenseAllocationsDelete: DatarobotEndpoint<'seatLicenseAllocationsDelete'>;
	seatLicenseAllocationsEvaluateCreate: DatarobotEndpoint<'seatLicenseAllocationsEvaluateCreate'>;
	seatLicenseAllocationsList: DatarobotEndpoint<'seatLicenseAllocationsList'>;
	seatLicenseAllocationsPatch: DatarobotEndpoint<'seatLicenseAllocationsPatch'>;
	seatLicenseAllocationsRetrieve: DatarobotEndpoint<'seatLicenseAllocationsRetrieve'>;
	secureConfigsCreate: DatarobotEndpoint<'secureConfigsCreate'>;
	secureConfigsDelete: DatarobotEndpoint<'secureConfigsDelete'>;
	secureConfigsList: DatarobotEndpoint<'secureConfigsList'>;
	secureConfigsPatch: DatarobotEndpoint<'secureConfigsPatch'>;
	secureConfigsRetrieve: DatarobotEndpoint<'secureConfigsRetrieve'>;
	secureConfigsSharedRolesList: DatarobotEndpoint<'secureConfigsSharedRolesList'>;
	secureConfigsSharedRolesPatchMany: DatarobotEndpoint<'secureConfigsSharedRolesPatchMany'>;
	secureConfigsValuesList: DatarobotEndpoint<'secureConfigsValuesList'>;
	sparkSessionsDeleteMany: DatarobotEndpoint<'sparkSessionsDeleteMany'>;
	statusDelete: DatarobotEndpoint<'statusDelete'>;
	statusList: DatarobotEndpoint<'statusList'>;
	statusRetrieve: DatarobotEndpoint<'statusRetrieve'>;
	stringEncryptionsCreate: DatarobotEndpoint<'stringEncryptionsCreate'>;
	tenantUsageResourcesActiveTenantsList: DatarobotEndpoint<'tenantUsageResourcesActiveTenantsList'>;
	tenantUsageResourcesActiveUsersList: DatarobotEndpoint<'tenantUsageResourcesActiveUsersList'>;
	tenantUsageResourcesCategoriesList: DatarobotEndpoint<'tenantUsageResourcesCategoriesList'>;
	tenantUsageResourcesDeploymentsList: DatarobotEndpoint<'tenantUsageResourcesDeploymentsList'>;
	tenantUsageResourcesExportList: DatarobotEndpoint<'tenantUsageResourcesExportList'>;
	tenantUsageResourcesList: DatarobotEndpoint<'tenantUsageResourcesList'>;
	tenantUsageResourcesUsageOverTimeList: DatarobotEndpoint<'tenantUsageResourcesUsageOverTimeList'>;
	tenantsActiveUsersList: DatarobotEndpoint<'tenantsActiveUsersList'>;
	tenantsResourceCategoriesList: DatarobotEndpoint<'tenantsResourceCategoriesList'>;
	tenantsUsageExportList: DatarobotEndpoint<'tenantsUsageExportList'>;
	tenantsUsageList: DatarobotEndpoint<'tenantsUsageList'>;
	tenantsUtilizationResourcesExportList: DatarobotEndpoint<'tenantsUtilizationResourcesExportList'>;
	tenantsUtilizationResourcesList: DatarobotEndpoint<'tenantsUtilizationResourcesList'>;
	tenantsUtilizationResourcesRetrieve: DatarobotEndpoint<'tenantsUtilizationResourcesRetrieve'>;
	usageDataExportsCreate: DatarobotEndpoint<'usageDataExportsCreate'>;
	usageDataExportsRetrieve: DatarobotEndpoint<'usageDataExportsRetrieve'>;
	usageDataExportsSupportedEventsList: DatarobotEndpoint<'usageDataExportsSupportedEventsList'>;
	useCasesAllNotebooks: DatarobotEndpoint<'useCasesAllNotebooks'>;
	useCasesAllResourcesList: DatarobotEndpoint<'useCasesAllResourcesList'>;
	useCasesApplicationsList: DatarobotEndpoint<'useCasesApplicationsList'>;
	useCasesCreate: DatarobotEndpoint<'useCasesCreate'>;
	useCasesCreateOne: DatarobotEndpoint<'useCasesCreateOne'>;
	useCasesCustomApplicationsList: DatarobotEndpoint<'useCasesCustomApplicationsList'>;
	useCasesDataList: DatarobotEndpoint<'useCasesDataList'>;
	useCasesDatasetsList: DatarobotEndpoint<'useCasesDatasetsList'>;
	useCasesDatasetsRetrieve: DatarobotEndpoint<'useCasesDatasetsRetrieve'>;
	useCasesDelete: DatarobotEndpoint<'useCasesDelete'>;
	useCasesDeploymentsList: DatarobotEndpoint<'useCasesDeploymentsList'>;
	useCasesFilesList: DatarobotEndpoint<'useCasesFilesList'>;
	useCasesFilesRetrieve: DatarobotEndpoint<'useCasesFilesRetrieve'>;
	useCasesFilterMetadataList: DatarobotEndpoint<'useCasesFilterMetadataList'>;
	useCasesList: DatarobotEndpoint<'useCasesList'>;
	useCasesModelsForComparisonList: DatarobotEndpoint<'useCasesModelsForComparisonList'>;
	useCasesMultilinkCreate: DatarobotEndpoint<'useCasesMultilinkCreate'>;
	useCasesNotebooksList: DatarobotEndpoint<'useCasesNotebooksList'>;
	useCasesPatch: DatarobotEndpoint<'useCasesPatch'>;
	useCasesPlaygroundsList: DatarobotEndpoint<'useCasesPlaygroundsList'>;
	useCasesProjectsList: DatarobotEndpoint<'useCasesProjectsList'>;
	useCasesReferenceDelete: DatarobotEndpoint<'useCasesReferenceDelete'>;
	useCasesReferenceMove: DatarobotEndpoint<'useCasesReferenceMove'>;
	useCasesRegisteredModelsList: DatarobotEndpoint<'useCasesRegisteredModelsList'>;
	useCasesResourcesList: DatarobotEndpoint<'useCasesResourcesList'>;
	useCasesRetrieve: DatarobotEndpoint<'useCasesRetrieve'>;
	useCasesSharedRolesList: DatarobotEndpoint<'useCasesSharedRolesList'>;
	useCasesSharedRolesPatchMany: DatarobotEndpoint<'useCasesSharedRolesPatchMany'>;
	useCasesVectorDatabasesList: DatarobotEndpoint<'useCasesVectorDatabasesList'>;
	useCasesVectorDatabasesRelatedCustomModelsList: DatarobotEndpoint<'useCasesVectorDatabasesRelatedCustomModelsList'>;
	useCasesVectorDatabasesRelatedDeploymentsList: DatarobotEndpoint<'useCasesVectorDatabasesRelatedDeploymentsList'>;
	useCasesVectorDatabasesRelatedRegisteredModelsList: DatarobotEndpoint<'useCasesVectorDatabasesRelatedRegisteredModelsList'>;
	useCasesWithShortenedInfoList: DatarobotEndpoint<'useCasesWithShortenedInfoList'>;
	userBlueprintsCreate: DatarobotEndpoint<'userBlueprintsCreate'>;
	userBlueprintsDelete: DatarobotEndpoint<'userBlueprintsDelete'>;
	userBlueprintsDeleteMany: DatarobotEndpoint<'userBlueprintsDeleteMany'>;
	userBlueprintsFromBlueprintIdCreate: DatarobotEndpoint<'userBlueprintsFromBlueprintIdCreate'>;
	userBlueprintsFromCustomTaskVersionIdCreate: DatarobotEndpoint<'userBlueprintsFromCustomTaskVersionIdCreate'>;
	userBlueprintsFromUserBlueprintIdCreate: DatarobotEndpoint<'userBlueprintsFromUserBlueprintIdCreate'>;
	userBlueprintsList: DatarobotEndpoint<'userBlueprintsList'>;
	userBlueprintsPatch: DatarobotEndpoint<'userBlueprintsPatch'>;
	userBlueprintsRetrieve: DatarobotEndpoint<'userBlueprintsRetrieve'>;
	userBlueprintsSharedRolesList: DatarobotEndpoint<'userBlueprintsSharedRolesList'>;
	userBlueprintsSharedRolesPatchMany: DatarobotEndpoint<'userBlueprintsSharedRolesPatchMany'>;
	userNotificationsDelete: DatarobotEndpoint<'userNotificationsDelete'>;
	userNotificationsDeleteMany: DatarobotEndpoint<'userNotificationsDeleteMany'>;
	userNotificationsList: DatarobotEndpoint<'userNotificationsList'>;
	userNotificationsPatch: DatarobotEndpoint<'userNotificationsPatch'>;
	userNotificationsPatchMany: DatarobotEndpoint<'userNotificationsPatchMany'>;
	usersCreate: DatarobotEndpoint<'usersCreate'>;
	usersInviteCreate: DatarobotEndpoint<'usersInviteCreate'>;
	usersList: DatarobotEndpoint<'usersList'>;
	usersRateLimitUsageDelete: DatarobotEndpoint<'usersRateLimitUsageDelete'>;
	usersRateLimitUsageDeleteMany: DatarobotEndpoint<'usersRateLimitUsageDeleteMany'>;
	usersRateLimitUsageList: DatarobotEndpoint<'usersRateLimitUsageList'>;
	usersRetrieve: DatarobotEndpoint<'usersRetrieve'>;
	valueTrackersActivitiesList: DatarobotEndpoint<'valueTrackersActivitiesList'>;
	valueTrackersAttachmentsCreate: DatarobotEndpoint<'valueTrackersAttachmentsCreate'>;
	valueTrackersAttachmentsDelete: DatarobotEndpoint<'valueTrackersAttachmentsDelete'>;
	valueTrackersAttachmentsList: DatarobotEndpoint<'valueTrackersAttachmentsList'>;
	valueTrackersAttachmentsRetrieve: DatarobotEndpoint<'valueTrackersAttachmentsRetrieve'>;
	valueTrackersCreate: DatarobotEndpoint<'valueTrackersCreate'>;
	valueTrackersDelete: DatarobotEndpoint<'valueTrackersDelete'>;
	valueTrackersList: DatarobotEndpoint<'valueTrackersList'>;
	valueTrackersPatch: DatarobotEndpoint<'valueTrackersPatch'>;
	valueTrackersRealizedValueOverTimeList: DatarobotEndpoint<'valueTrackersRealizedValueOverTimeList'>;
	valueTrackersRetrieve: DatarobotEndpoint<'valueTrackersRetrieve'>;
	valueTrackersSharedRolesList: DatarobotEndpoint<'valueTrackersSharedRolesList'>;
	valueTrackersSharedRolesPatchMany: DatarobotEndpoint<'valueTrackersSharedRolesPatchMany'>;
	versionList: DatarobotEndpoint<'versionList'>;
};

const datarobotEndpointsNested = {
	accessRoles: {
		accessRolesCreate: AccessRoles.accessRolesCreate,
		accessRolesDelete: AccessRoles.accessRolesDelete,
		accessRolesList: AccessRoles.accessRolesList,
		accessRolesPatch: AccessRoles.accessRolesPatch,
		accessRolesRetrieve: AccessRoles.accessRolesRetrieve,
		accessRolesUsersList: AccessRoles.accessRolesUsersList,
	},
	account: {
		accountRateLimitUsageList: Account.accountRateLimitUsageList,
	},
	applicationTemplates: {
		applicationTemplatesCloneCreate:
			ApplicationTemplates.applicationTemplatesCloneCreate,
		applicationTemplatesCreate: ApplicationTemplates.applicationTemplatesCreate,
		applicationTemplatesDelete: ApplicationTemplates.applicationTemplatesDelete,
		applicationTemplatesList: ApplicationTemplates.applicationTemplatesList,
		applicationTemplatesMediaCreate:
			ApplicationTemplates.applicationTemplatesMediaCreate,
		applicationTemplatesMediaDeleteMany:
			ApplicationTemplates.applicationTemplatesMediaDeleteMany,
		applicationTemplatesMediaList:
			ApplicationTemplates.applicationTemplatesMediaList,
		applicationTemplatesPatch: ApplicationTemplates.applicationTemplatesPatch,
		applicationTemplatesRepositoryUrlsList:
			ApplicationTemplates.applicationTemplatesRepositoryUrlsList,
	},
	applications: {
		applicationUserRoleRetrieve: Applications.applicationUserRoleRetrieve,
		applicationsAccessControlList: Applications.applicationsAccessControlList,
		applicationsAccessControlPatchMany:
			Applications.applicationsAccessControlPatchMany,
		applicationsCreate: Applications.applicationsCreate,
		applicationsDelete: Applications.applicationsDelete,
		applicationsDeploymentsCreate: Applications.applicationsDeploymentsCreate,
		applicationsDeploymentsDelete: Applications.applicationsDeploymentsDelete,
		applicationsDuplicateCreate: Applications.applicationsDuplicateCreate,
		applicationsList: Applications.applicationsList,
		applicationsPatch: Applications.applicationsPatch,
		applicationsRetrieve: Applications.applicationsRetrieve,
		applicationsSharedRolesList: Applications.applicationsSharedRolesList,
		applicationsSharedRolesPatchMany:
			Applications.applicationsSharedRolesPatchMany,
		applicationsVerifyCreate: Applications.applicationsVerifyCreate,
	},
	approvalPolicies: {
		approvalPoliciesCreate: ApprovalPolicies.approvalPoliciesCreate,
		approvalPoliciesDelete: ApprovalPolicies.approvalPoliciesDelete,
		approvalPoliciesList: ApprovalPolicies.approvalPoliciesList,
		approvalPoliciesPut: ApprovalPolicies.approvalPoliciesPut,
		approvalPoliciesRetrieve: ApprovalPolicies.approvalPoliciesRetrieve,
		approvalPoliciesShareableChangeRequestsList:
			ApprovalPolicies.approvalPoliciesShareableChangeRequestsList,
	},
	automatedDocuments: {
		automatedDocumentsCreate: AutomatedDocuments.automatedDocumentsCreate,
		automatedDocumentsDelete: AutomatedDocuments.automatedDocumentsDelete,
		automatedDocumentsList: AutomatedDocuments.automatedDocumentsList,
		automatedDocumentsRetrieve: AutomatedDocuments.automatedDocumentsRetrieve,
	},
	batchJobs: {
		batchJobsCsvUploadPutMany: BatchJobs.batchJobsCsvUploadPutMany,
		batchJobsDelete: BatchJobs.batchJobsDelete,
		batchJobsDownloadList: BatchJobs.batchJobsDownloadList,
		batchJobsFromJobDefinitionCreate:
			BatchJobs.batchJobsFromJobDefinitionCreate,
		batchJobsList: BatchJobs.batchJobsList,
		batchJobsRetrieve: BatchJobs.batchJobsRetrieve,
	},
	batchMonitoring: {
		batchMonitoringCreate: BatchMonitoring.batchMonitoringCreate,
	},
	batchPredictions: {
		batchPredictionsCreate: BatchPredictions.batchPredictionsCreate,
		batchPredictionsCsvUploadFinalizeMultipartCreate:
			BatchPredictions.batchPredictionsCsvUploadFinalizeMultipartCreate,
		batchPredictionsCsvUploadPartPut:
			BatchPredictions.batchPredictionsCsvUploadPartPut,
		batchPredictionsCsvUploadPutMany:
			BatchPredictions.batchPredictionsCsvUploadPutMany,
		batchPredictionsDelete: BatchPredictions.batchPredictionsDelete,
		batchPredictionsDownloadList: BatchPredictions.batchPredictionsDownloadList,
		batchPredictionsFromExistingCreate:
			BatchPredictions.batchPredictionsFromExistingCreate,
		batchPredictionsFromJobDefinitionCreate:
			BatchPredictions.batchPredictionsFromJobDefinitionCreate,
		batchPredictionsList: BatchPredictions.batchPredictionsList,
		batchPredictionsPatch: BatchPredictions.batchPredictionsPatch,
		batchPredictionsRetrieve: BatchPredictions.batchPredictionsRetrieve,
	},
	calendars: {
		calendarsAccessControlList: Calendars.calendarsAccessControlList,
		calendarsAccessControlPatchMany: Calendars.calendarsAccessControlPatchMany,
		calendarsDelete: Calendars.calendarsDelete,
		calendarsFileUploadCreate: Calendars.calendarsFileUploadCreate,
		calendarsFromCountryCodeCreate: Calendars.calendarsFromCountryCodeCreate,
		calendarsFromDatasetCreate: Calendars.calendarsFromDatasetCreate,
		calendarsList: Calendars.calendarsList,
		calendarsPatch: Calendars.calendarsPatch,
		calendarsRetrieve: Calendars.calendarsRetrieve,
	},
	catalogItems: {
		catalogItemsList: CatalogItems.catalogItemsList,
		catalogItemsPatch: CatalogItems.catalogItemsPatch,
		catalogItemsRetrieve: CatalogItems.catalogItemsRetrieve,
	},
	changeRequests: {
		changeRequestsCreate: ChangeRequests.changeRequestsCreate,
		changeRequestsList: ChangeRequests.changeRequestsList,
		changeRequestsPatch: ChangeRequests.changeRequestsPatch,
		changeRequestsRequestReviewCreate:
			ChangeRequests.changeRequestsRequestReviewCreate,
		changeRequestsRetrieve: ChangeRequests.changeRequestsRetrieve,
		changeRequestsReviewsCreate: ChangeRequests.changeRequestsReviewsCreate,
		changeRequestsReviewsList: ChangeRequests.changeRequestsReviewsList,
		changeRequestsReviewsRetrieve: ChangeRequests.changeRequestsReviewsRetrieve,
		changeRequestsStatusPatchMany: ChangeRequests.changeRequestsStatusPatchMany,
		changeRequestsSuggestedReviewersList:
			ChangeRequests.changeRequestsSuggestedReviewersList,
	},
	codeSnippets: {
		codeSnippetsCreate: CodeSnippets.codeSnippetsCreate,
		codeSnippetsDownloadCreate: CodeSnippets.codeSnippetsDownloadCreate,
		codeSnippetsList: CodeSnippets.codeSnippetsList,
	},
	comments: {
		commentsCreate: Comments.commentsCreate,
		commentsDelete: Comments.commentsDelete,
		commentsList: Comments.commentsList,
		commentsPatch: Comments.commentsPatch,
		commentsRetrieve: Comments.commentsRetrieve,
	},
	complianceDocTemplates: {
		complianceDocTemplatesCreate:
			ComplianceDocTemplates.complianceDocTemplatesCreate,
		complianceDocTemplatesDefaultList:
			ComplianceDocTemplates.complianceDocTemplatesDefaultList,
		complianceDocTemplatesDelete:
			ComplianceDocTemplates.complianceDocTemplatesDelete,
		complianceDocTemplatesList:
			ComplianceDocTemplates.complianceDocTemplatesList,
		complianceDocTemplatesPatch:
			ComplianceDocTemplates.complianceDocTemplatesPatch,
		complianceDocTemplatesRetrieve:
			ComplianceDocTemplates.complianceDocTemplatesRetrieve,
		complianceDocTemplatesSharedRolesList:
			ComplianceDocTemplates.complianceDocTemplatesSharedRolesList,
		complianceDocTemplatesSharedRolesPatchMany:
			ComplianceDocTemplates.complianceDocTemplatesSharedRolesPatchMany,
	},
	credentials: {
		credentialsAssociationsListForCredential:
			Credentials.credentialsAssociationsListForCredential,
		credentialsAssociationsListForObject:
			Credentials.credentialsAssociationsListForObject,
		credentialsAssociationsPatchMany:
			Credentials.credentialsAssociationsPatchMany,
		credentialsAssociationsPut: Credentials.credentialsAssociationsPut,
		credentialsCreate: Credentials.credentialsCreate,
		credentialsDelete: Credentials.credentialsDelete,
		credentialsList: Credentials.credentialsList,
		credentialsPatch: Credentials.credentialsPatch,
		credentialsRetrieve: Credentials.credentialsRetrieve,
	},
	customApplicationSources: {
		customApplicationSourcesCreate:
			CustomApplicationSources.customApplicationSourcesCreate,
		customApplicationSourcesDelete:
			CustomApplicationSources.customApplicationSourcesDelete,
		customApplicationSourcesFromCustomTemplateCreate:
			CustomApplicationSources.customApplicationSourcesFromCustomTemplateCreate,
		customApplicationSourcesList:
			CustomApplicationSources.customApplicationSourcesList,
		customApplicationSourcesPatch:
			CustomApplicationSources.customApplicationSourcesPatch,
		customApplicationSourcesRetrieve:
			CustomApplicationSources.customApplicationSourcesRetrieve,
		customApplicationSourcesSharedRolesList:
			CustomApplicationSources.customApplicationSourcesSharedRolesList,
		customApplicationSourcesSharedRolesPatchMany:
			CustomApplicationSources.customApplicationSourcesSharedRolesPatchMany,
		customApplicationSourcesVersionsArchiveList:
			CustomApplicationSources.customApplicationSourcesVersionsArchiveList,
		customApplicationSourcesVersionsCreate:
			CustomApplicationSources.customApplicationSourcesVersionsCreate,
		customApplicationSourcesVersionsDelete:
			CustomApplicationSources.customApplicationSourcesVersionsDelete,
		customApplicationSourcesVersionsFromCodespaceCreate:
			CustomApplicationSources.customApplicationSourcesVersionsFromCodespaceCreate,
		customApplicationSourcesVersionsItemsRetrieve:
			CustomApplicationSources.customApplicationSourcesVersionsItemsRetrieve,
		customApplicationSourcesVersionsList:
			CustomApplicationSources.customApplicationSourcesVersionsList,
		customApplicationSourcesVersionsPatch:
			CustomApplicationSources.customApplicationSourcesVersionsPatch,
		customApplicationSourcesVersionsRetrieve:
			CustomApplicationSources.customApplicationSourcesVersionsRetrieve,
		customApplicationSourcesVersionsToCodespaceCreate:
			CustomApplicationSources.customApplicationSourcesVersionsToCodespaceCreate,
	},
	customApplications: {
		customApplicationsCreate: CustomApplications.customApplicationsCreate,
		customApplicationsDelete: CustomApplications.customApplicationsDelete,
		customApplicationsHistoryList:
			CustomApplications.customApplicationsHistoryList,
		customApplicationsList: CustomApplications.customApplicationsList,
		customApplicationsLogsList: CustomApplications.customApplicationsLogsList,
		customApplicationsMigrateToWorkloadCreate:
			CustomApplications.customApplicationsMigrateToWorkloadCreate,
		customApplicationsPatch: CustomApplications.customApplicationsPatch,
		customApplicationsRetrieve: CustomApplications.customApplicationsRetrieve,
		customApplicationsSharedRolesList:
			CustomApplications.customApplicationsSharedRolesList,
		customApplicationsSharedRolesPatchMany:
			CustomApplications.customApplicationsSharedRolesPatchMany,
		customApplicationsUsagesDownloadList:
			CustomApplications.customApplicationsUsagesDownloadList,
		customApplicationsUsagesList:
			CustomApplications.customApplicationsUsagesList,
	},
	customJobs: {
		customJobsCreate: CustomJobs.customJobsCreate,
		customJobsCustomMetricsDelete: CustomJobs.customJobsCustomMetricsDelete,
		customJobsCustomMetricsList: CustomJobs.customJobsCustomMetricsList,
		customJobsCustomMetricsPatch: CustomJobs.customJobsCustomMetricsPatch,
		customJobsDelete: CustomJobs.customJobsDelete,
		customJobsFromGalleryTemplateCreate:
			CustomJobs.customJobsFromGalleryTemplateCreate,
		customJobsFromHostedCustomMetricGalleryTemplateCreate:
			CustomJobs.customJobsFromHostedCustomMetricGalleryTemplateCreate,
		customJobsHostedCustomMetricTemplateCreate:
			CustomJobs.customJobsHostedCustomMetricTemplateCreate,
		customJobsHostedCustomMetricTemplateList:
			CustomJobs.customJobsHostedCustomMetricTemplateList,
		customJobsHostedCustomMetricTemplatePatchMany:
			CustomJobs.customJobsHostedCustomMetricTemplatePatchMany,
		customJobsItemsRetrieve: CustomJobs.customJobsItemsRetrieve,
		customJobsList: CustomJobs.customJobsList,
		customJobsPatch: CustomJobs.customJobsPatch,
		customJobsRetrieve: CustomJobs.customJobsRetrieve,
		customJobsRunsCreate: CustomJobs.customJobsRunsCreate,
		customJobsRunsDelete: CustomJobs.customJobsRunsDelete,
		customJobsRunsItemsRetrieve: CustomJobs.customJobsRunsItemsRetrieve,
		customJobsRunsList: CustomJobs.customJobsRunsList,
		customJobsRunsLogsDeleteMany: CustomJobs.customJobsRunsLogsDeleteMany,
		customJobsRunsLogsList: CustomJobs.customJobsRunsLogsList,
		customJobsRunsPatch: CustomJobs.customJobsRunsPatch,
		customJobsRunsRetrieve: CustomJobs.customJobsRunsRetrieve,
		customJobsSharedRolesList: CustomJobs.customJobsSharedRolesList,
		customJobsSharedRolesPatchMany: CustomJobs.customJobsSharedRolesPatchMany,
	},
	customModels: {
		customModelsAccessControlList: CustomModels.customModelsAccessControlList,
		customModelsAccessControlPatchMany:
			CustomModels.customModelsAccessControlPatchMany,
		customModelsCreate: CustomModels.customModelsCreate,
		customModelsDelete: CustomModels.customModelsDelete,
		customModelsDownloadList: CustomModels.customModelsDownloadList,
		customModelsFromCustomModelCreate:
			CustomModels.customModelsFromCustomModelCreate,
		customModelsFromModelTemplateCreate:
			CustomModels.customModelsFromModelTemplateCreate,
		customModelsList: CustomModels.customModelsList,
		customModelsPatch: CustomModels.customModelsPatch,
		customModelsPredictionExplanationsInitializationCreate:
			CustomModels.customModelsPredictionExplanationsInitializationCreate,
		customModelsRetrieve: CustomModels.customModelsRetrieve,
		customModelsTrainingDataPatchMany:
			CustomModels.customModelsTrainingDataPatchMany,
		customModelsVersionCreateFromLatest:
			CustomModels.customModelsVersionCreateFromLatest,
		customModelsVersionsConversionsCreate:
			CustomModels.customModelsVersionsConversionsCreate,
		customModelsVersionsConversionsDelete:
			CustomModels.customModelsVersionsConversionsDelete,
		customModelsVersionsConversionsList:
			CustomModels.customModelsVersionsConversionsList,
		customModelsVersionsConversionsRetrieve:
			CustomModels.customModelsVersionsConversionsRetrieve,
		customModelsVersionsCreate: CustomModels.customModelsVersionsCreate,
		customModelsVersionsDependencyBuildCreate:
			CustomModels.customModelsVersionsDependencyBuildCreate,
		customModelsVersionsDependencyBuildDeleteMany:
			CustomModels.customModelsVersionsDependencyBuildDeleteMany,
		customModelsVersionsDependencyBuildList:
			CustomModels.customModelsVersionsDependencyBuildList,
		customModelsVersionsDependencyBuildLogList:
			CustomModels.customModelsVersionsDependencyBuildLogList,
		customModelsVersionsDownloadList:
			CustomModels.customModelsVersionsDownloadList,
		customModelsVersionsFeatureImpactCreate:
			CustomModels.customModelsVersionsFeatureImpactCreate,
		customModelsVersionsFeatureImpactList:
			CustomModels.customModelsVersionsFeatureImpactList,
		customModelsVersionsFromCodespaceCreate:
			CustomModels.customModelsVersionsFromCodespaceCreate,
		customModelsVersionsFromRepositoryCreate:
			CustomModels.customModelsVersionsFromRepositoryCreate,
		customModelsVersionsFromRepositoryPatchMany:
			CustomModels.customModelsVersionsFromRepositoryPatchMany,
		customModelsVersionsList: CustomModels.customModelsVersionsList,
		customModelsVersionsPatch: CustomModels.customModelsVersionsPatch,
		customModelsVersionsPredictionExplanationsInitializationCreate:
			CustomModels.customModelsVersionsPredictionExplanationsInitializationCreate,
		customModelsVersionsRetrieve: CustomModels.customModelsVersionsRetrieve,
		customModelsVersionsToCodespaceCreate:
			CustomModels.customModelsVersionsToCodespaceCreate,
		customModelsVersionsWithTrainingDataPatchMany:
			CustomModels.customModelsVersionsWithTrainingDataPatchMany,
	},
	customTasks: {
		customTaskVersionCreateFromLatest:
			CustomTasks.customTaskVersionCreateFromLatest,
		customTasksAccessControlList: CustomTasks.customTasksAccessControlList,
		customTasksAccessControlPatchMany:
			CustomTasks.customTasksAccessControlPatchMany,
		customTasksCreate: CustomTasks.customTasksCreate,
		customTasksDelete: CustomTasks.customTasksDelete,
		customTasksDownloadList: CustomTasks.customTasksDownloadList,
		customTasksFromCustomTaskCreate:
			CustomTasks.customTasksFromCustomTaskCreate,
		customTasksList: CustomTasks.customTasksList,
		customTasksPatch: CustomTasks.customTasksPatch,
		customTasksRetrieve: CustomTasks.customTasksRetrieve,
		customTasksVersionsCreate: CustomTasks.customTasksVersionsCreate,
		customTasksVersionsDependencyBuildCreate:
			CustomTasks.customTasksVersionsDependencyBuildCreate,
		customTasksVersionsDependencyBuildDeleteMany:
			CustomTasks.customTasksVersionsDependencyBuildDeleteMany,
		customTasksVersionsDependencyBuildList:
			CustomTasks.customTasksVersionsDependencyBuildList,
		customTasksVersionsDependencyBuildLogList:
			CustomTasks.customTasksVersionsDependencyBuildLogList,
		customTasksVersionsDownloadList:
			CustomTasks.customTasksVersionsDownloadList,
		customTasksVersionsFromRepositoryCreate:
			CustomTasks.customTasksVersionsFromRepositoryCreate,
		customTasksVersionsFromRepositoryPatchMany:
			CustomTasks.customTasksVersionsFromRepositoryPatchMany,
		customTasksVersionsList: CustomTasks.customTasksVersionsList,
		customTasksVersionsPatch: CustomTasks.customTasksVersionsPatch,
		customTasksVersionsRetrieve: CustomTasks.customTasksVersionsRetrieve,
	},
	dataEngineWorkspaceStates: {
		dataEngineWorkspaceStatesCreate:
			DataEngineWorkspaceStates.dataEngineWorkspaceStatesCreate,
		dataEngineWorkspaceStatesFromDataEngineQueryGeneratorCreate:
			DataEngineWorkspaceStates.dataEngineWorkspaceStatesFromDataEngineQueryGeneratorCreate,
		dataEngineWorkspaceStatesRetrieve:
			DataEngineWorkspaceStates.dataEngineWorkspaceStatesRetrieve,
	},
	dataSlices: {
		dataSlicesCreate: DataSlices.dataSlicesCreate,
		dataSlicesDelete: DataSlices.dataSlicesDelete,
		dataSlicesDeleteMany: DataSlices.dataSlicesDeleteMany,
		dataSlicesRetrieve: DataSlices.dataSlicesRetrieve,
		dataSlicesSliceSizesCreate: DataSlices.dataSlicesSliceSizesCreate,
		dataSlicesSliceSizesList: DataSlices.dataSlicesSliceSizesList,
	},
	dataStages: {
		dataStagesCreate: DataStages.dataStagesCreate,
		dataStagesFinalizeCreate: DataStages.dataStagesFinalizeCreate,
		dataStagesPartsPut: DataStages.dataStagesPartsPut,
	},
	datasetDefinitions: {
		datasetDefinitionsAnalyzeCreate:
			DatasetDefinitions.datasetDefinitionsAnalyzeCreate,
		datasetDefinitionsChunkDefinitionsAnalyzeCreate:
			DatasetDefinitions.datasetDefinitionsChunkDefinitionsAnalyzeCreate,
		datasetDefinitionsChunkDefinitionsCreate:
			DatasetDefinitions.datasetDefinitionsChunkDefinitionsCreate,
		datasetDefinitionsChunkDefinitionsDelete:
			DatasetDefinitions.datasetDefinitionsChunkDefinitionsDelete,
		datasetDefinitionsChunkDefinitionsList:
			DatasetDefinitions.datasetDefinitionsChunkDefinitionsList,
		datasetDefinitionsChunkDefinitionsPatch:
			DatasetDefinitions.datasetDefinitionsChunkDefinitionsPatch,
		datasetDefinitionsChunkDefinitionsRetrieve:
			DatasetDefinitions.datasetDefinitionsChunkDefinitionsRetrieve,
		datasetDefinitionsCreate: DatasetDefinitions.datasetDefinitionsCreate,
		datasetDefinitionsDelete: DatasetDefinitions.datasetDefinitionsDelete,
		datasetDefinitionsList: DatasetDefinitions.datasetDefinitionsList,
		datasetDefinitionsRetrieve: DatasetDefinitions.datasetDefinitionsRetrieve,
		datasetDefinitionsVersionsList:
			DatasetDefinitions.datasetDefinitionsVersionsList,
	},
	datasets: {
		datasetsAccessControlList: Datasets.datasetsAccessControlList,
		datasetsAccessControlPatchMany: Datasets.datasetsAccessControlPatchMany,
		datasetsAllFeaturesDetailsList: Datasets.datasetsAllFeaturesDetailsList,
		datasetsDelete: Datasets.datasetsDelete,
		datasetsDeletedPatchMany: Datasets.datasetsDeletedPatchMany,
		datasetsDocumentsDataQualityLogFileList:
			Datasets.datasetsDocumentsDataQualityLogFileList,
		datasetsDocumentsDataQualityLogList:
			Datasets.datasetsDocumentsDataQualityLogList,
		datasetsFeatureHistogramsRetrieve:
			Datasets.datasetsFeatureHistogramsRetrieve,
		datasetsFeatureTransformsCreate: Datasets.datasetsFeatureTransformsCreate,
		datasetsFeatureTransformsList: Datasets.datasetsFeatureTransformsList,
		datasetsFeatureTransformsRetrieve:
			Datasets.datasetsFeatureTransformsRetrieve,
		datasetsFeaturelistsCreate: Datasets.datasetsFeaturelistsCreate,
		datasetsFeaturelistsDelete: Datasets.datasetsFeaturelistsDelete,
		datasetsFeaturelistsList: Datasets.datasetsFeaturelistsList,
		datasetsFeaturelistsPatch: Datasets.datasetsFeaturelistsPatch,
		datasetsFeaturelistsRetrieve: Datasets.datasetsFeaturelistsRetrieve,
		datasetsFileList: Datasets.datasetsFileList,
		datasetsFromDataEngineWorkspaceStateCreate:
			Datasets.datasetsFromDataEngineWorkspaceStateCreate,
		datasetsFromDataSourceCreate: Datasets.datasetsFromDataSourceCreate,
		datasetsFromFileCreate: Datasets.datasetsFromFileCreate,
		datasetsFromHDFSCreate: Datasets.datasetsFromHDFSCreate,
		datasetsFromRecipeCreate: Datasets.datasetsFromRecipeCreate,
		datasetsFromStageCreate: Datasets.datasetsFromStageCreate,
		datasetsFromURLCreate: Datasets.datasetsFromURLCreate,
		datasetsImagesDataQualityLogFileList:
			Datasets.datasetsImagesDataQualityLogFileList,
		datasetsImagesDataQualityLogList: Datasets.datasetsImagesDataQualityLogList,
		datasetsList: Datasets.datasetsList,
		datasetsPatch: Datasets.datasetsPatch,
		datasetsPatchMany: Datasets.datasetsPatchMany,
		datasetsPermissionsList: Datasets.datasetsPermissionsList,
		datasetsProjectsList: Datasets.datasetsProjectsList,
		datasetsRefreshJobsCreate: Datasets.datasetsRefreshJobsCreate,
		datasetsRefreshJobsDelete: Datasets.datasetsRefreshJobsDelete,
		datasetsRefreshJobsExecutionResultsList:
			Datasets.datasetsRefreshJobsExecutionResultsList,
		datasetsRefreshJobsList: Datasets.datasetsRefreshJobsList,
		datasetsRefreshJobsPatch: Datasets.datasetsRefreshJobsPatch,
		datasetsRefreshJobsRetrieve: Datasets.datasetsRefreshJobsRetrieve,
		datasetsRelationshipsCreate: Datasets.datasetsRelationshipsCreate,
		datasetsRelationshipsDelete: Datasets.datasetsRelationshipsDelete,
		datasetsRelationshipsList: Datasets.datasetsRelationshipsList,
		datasetsRelationshipsPatch: Datasets.datasetsRelationshipsPatch,
		datasetsRetrieve: Datasets.datasetsRetrieve,
		datasetsSharedRolesList: Datasets.datasetsSharedRolesList,
		datasetsSharedRolesPatchMany: Datasets.datasetsSharedRolesPatchMany,
		datasetsVersionsAllFeaturesDetailsList:
			Datasets.datasetsVersionsAllFeaturesDetailsList,
		datasetsVersionsDelete: Datasets.datasetsVersionsDelete,
		datasetsVersionsDeletedPatchMany: Datasets.datasetsVersionsDeletedPatchMany,
		datasetsVersionsDocumentsDataQualityLogFileList:
			Datasets.datasetsVersionsDocumentsDataQualityLogFileList,
		datasetsVersionsDocumentsDataQualityLogList:
			Datasets.datasetsVersionsDocumentsDataQualityLogList,
		datasetsVersionsFeatureHistogramsRetrieve:
			Datasets.datasetsVersionsFeatureHistogramsRetrieve,
		datasetsVersionsFeaturelistsList: Datasets.datasetsVersionsFeaturelistsList,
		datasetsVersionsFeaturelistsRetrieve:
			Datasets.datasetsVersionsFeaturelistsRetrieve,
		datasetsVersionsFileList: Datasets.datasetsVersionsFileList,
		datasetsVersionsFromDataEngineWorkspaceStateCreate:
			Datasets.datasetsVersionsFromDataEngineWorkspaceStateCreate,
		datasetsVersionsFromDataSourceCreate:
			Datasets.datasetsVersionsFromDataSourceCreate,
		datasetsVersionsFromFileCreate: Datasets.datasetsVersionsFromFileCreate,
		datasetsVersionsFromHDFSCreate: Datasets.datasetsVersionsFromHDFSCreate,
		datasetsVersionsFromLatestVersionCreate:
			Datasets.datasetsVersionsFromLatestVersionCreate,
		datasetsVersionsFromRecipeCreate: Datasets.datasetsVersionsFromRecipeCreate,
		datasetsVersionsFromStageCreate: Datasets.datasetsVersionsFromStageCreate,
		datasetsVersionsFromURLCreate: Datasets.datasetsVersionsFromURLCreate,
		datasetsVersionsFromVersionCreate:
			Datasets.datasetsVersionsFromVersionCreate,
		datasetsVersionsList: Datasets.datasetsVersionsList,
		datasetsVersionsProjectsList: Datasets.datasetsVersionsProjectsList,
		datasetsVersionsRetrieve: Datasets.datasetsVersionsRetrieve,
	},
	deletedCustomJobs: {
		deletedCustomJobsList: DeletedCustomJobs.deletedCustomJobsList,
	},
	deletedDeployments: {
		deletedDeploymentsList: DeletedDeployments.deletedDeploymentsList,
		deletedDeploymentsPatchMany: DeletedDeployments.deletedDeploymentsPatchMany,
	},
	deletedProjects: {
		deletedProjectsList: DeletedProjects.deletedProjectsList,
		deletedProjectsPatch: DeletedProjects.deletedProjectsPatch,
	},
	deployments: {
		deploymentsAccuracyList: Deployments.deploymentsAccuracyList,
		deploymentsAccuracyMetricsList: Deployments.deploymentsAccuracyMetricsList,
		deploymentsAccuracyMetricsPutMany:
			Deployments.deploymentsAccuracyMetricsPutMany,
		deploymentsAccuracyOverBatchList:
			Deployments.deploymentsAccuracyOverBatchList,
		deploymentsAccuracyOverSpaceList:
			Deployments.deploymentsAccuracyOverSpaceList,
		deploymentsAccuracyOverTimeList:
			Deployments.deploymentsAccuracyOverTimeList,
		deploymentsActualsDataExportsCreate:
			Deployments.deploymentsActualsDataExportsCreate,
		deploymentsActualsDataExportsDelete:
			Deployments.deploymentsActualsDataExportsDelete,
		deploymentsActualsDataExportsList:
			Deployments.deploymentsActualsDataExportsList,
		deploymentsActualsDataExportsPatch:
			Deployments.deploymentsActualsDataExportsPatch,
		deploymentsActualsDataExportsRetrieve:
			Deployments.deploymentsActualsDataExportsRetrieve,
		deploymentsActualsFromDatasetCreate:
			Deployments.deploymentsActualsFromDatasetCreate,
		deploymentsActualsFromJSONCreate:
			Deployments.deploymentsActualsFromJSONCreate,
		deploymentsAgentCardDeleteMany: Deployments.deploymentsAgentCardDeleteMany,
		deploymentsAgentCardList: Deployments.deploymentsAgentCardList,
		deploymentsAgentCardPutMany: Deployments.deploymentsAgentCardPutMany,
		deploymentsBatchServiceStatsList:
			Deployments.deploymentsBatchServiceStatsList,
		deploymentsCapabilitiesList: Deployments.deploymentsCapabilitiesList,
		deploymentsChallengerPredictionsCreate:
			Deployments.deploymentsChallengerPredictionsCreate,
		deploymentsChallengerReplaySettingsList:
			Deployments.deploymentsChallengerReplaySettingsList,
		deploymentsChallengerReplaySettingsPatchMany:
			Deployments.deploymentsChallengerReplaySettingsPatchMany,
		deploymentsChallengersCreate: Deployments.deploymentsChallengersCreate,
		deploymentsChallengersDelete: Deployments.deploymentsChallengersDelete,
		deploymentsChallengersList: Deployments.deploymentsChallengersList,
		deploymentsChallengersPatch: Deployments.deploymentsChallengersPatch,
		deploymentsChallengersRetrieve: Deployments.deploymentsChallengersRetrieve,
		deploymentsChampionModelPackageList:
			Deployments.deploymentsChampionModelPackageList,
		deploymentsCustomMetricsBatchSummaryRetrieve:
			Deployments.deploymentsCustomMetricsBatchSummaryRetrieve,
		deploymentsCustomMetricsBulkBatchSummaryRetrieve:
			Deployments.deploymentsCustomMetricsBulkBatchSummaryRetrieve,
		deploymentsCustomMetricsBulkSummaryRetrieve:
			Deployments.deploymentsCustomMetricsBulkSummaryRetrieve,
		deploymentsCustomMetricsBulkUploadCreate:
			Deployments.deploymentsCustomMetricsBulkUploadCreate,
		deploymentsCustomMetricsCreate: Deployments.deploymentsCustomMetricsCreate,
		deploymentsCustomMetricsDelete: Deployments.deploymentsCustomMetricsDelete,
		deploymentsCustomMetricsFromCustomJobCreate:
			Deployments.deploymentsCustomMetricsFromCustomJobCreate,
		deploymentsCustomMetricsFromDatasetCreate:
			Deployments.deploymentsCustomMetricsFromDatasetCreate,
		deploymentsCustomMetricsFromJSONCreate:
			Deployments.deploymentsCustomMetricsFromJSONCreate,
		deploymentsCustomMetricsList: Deployments.deploymentsCustomMetricsList,
		deploymentsCustomMetricsPatch: Deployments.deploymentsCustomMetricsPatch,
		deploymentsCustomMetricsRetrieve:
			Deployments.deploymentsCustomMetricsRetrieve,
		deploymentsCustomMetricsSummaryRetrieve:
			Deployments.deploymentsCustomMetricsSummaryRetrieve,
		deploymentsCustomMetricsValuesOverBatchList:
			Deployments.deploymentsCustomMetricsValuesOverBatchList,
		deploymentsCustomMetricsValuesOverSpaceList:
			Deployments.deploymentsCustomMetricsValuesOverSpaceList,
		deploymentsCustomMetricsValuesOverTimeList:
			Deployments.deploymentsCustomMetricsValuesOverTimeList,
		deploymentsDataQualityViewList: Deployments.deploymentsDataQualityViewList,
		deploymentsDelete: Deployments.deploymentsDelete,
		deploymentsFairnessScoresOverTimeList:
			Deployments.deploymentsFairnessScoresOverTimeList,
		deploymentsFeatureDriftList: Deployments.deploymentsFeatureDriftList,
		deploymentsFeatureDriftOverBatchList:
			Deployments.deploymentsFeatureDriftOverBatchList,
		deploymentsFeatureDriftOverSpaceList:
			Deployments.deploymentsFeatureDriftOverSpaceList,
		deploymentsFeatureDriftOverTimeList:
			Deployments.deploymentsFeatureDriftOverTimeList,
		deploymentsFeaturesList: Deployments.deploymentsFeaturesList,
		deploymentsFromLearningModelCreate:
			Deployments.deploymentsFromLearningModelCreate,
		deploymentsFromModelPackageCreate:
			Deployments.deploymentsFromModelPackageCreate,
		deploymentsHealthSettingsDefaultsList:
			Deployments.deploymentsHealthSettingsDefaultsList,
		deploymentsHealthSettingsList: Deployments.deploymentsHealthSettingsList,
		deploymentsHealthSettingsPatchMany:
			Deployments.deploymentsHealthSettingsPatchMany,
		deploymentsHumilityStatsList: Deployments.deploymentsHumilityStatsList,
		deploymentsHumilityStatsOverTimeList:
			Deployments.deploymentsHumilityStatsOverTimeList,
		deploymentsLimitsList: Deployments.deploymentsLimitsList,
		deploymentsList: Deployments.deploymentsList,
		deploymentsMigrateDPStoServerlessCreate:
			Deployments.deploymentsMigrateDPStoServerlessCreate,
		deploymentsModelHistoryList: Deployments.deploymentsModelHistoryList,
		deploymentsModelPatchMany: Deployments.deploymentsModelPatchMany,
		deploymentsModelSecondaryDatasetConfigurationHistoryList:
			Deployments.deploymentsModelSecondaryDatasetConfigurationHistoryList,
		deploymentsModelSecondaryDatasetConfigurationList:
			Deployments.deploymentsModelSecondaryDatasetConfigurationList,
		deploymentsModelSecondaryDatasetConfigurationPatchMany:
			Deployments.deploymentsModelSecondaryDatasetConfigurationPatchMany,
		deploymentsModelValidationCreate:
			Deployments.deploymentsModelValidationCreate,
		deploymentsMonitoringBatchLimitsList:
			Deployments.deploymentsMonitoringBatchLimitsList,
		deploymentsMonitoringBatchesCreate:
			Deployments.deploymentsMonitoringBatchesCreate,
		deploymentsMonitoringBatchesDelete:
			Deployments.deploymentsMonitoringBatchesDelete,
		deploymentsMonitoringBatchesList:
			Deployments.deploymentsMonitoringBatchesList,
		deploymentsMonitoringBatchesModelsList:
			Deployments.deploymentsMonitoringBatchesModelsList,
		deploymentsMonitoringBatchesModelsPatch:
			Deployments.deploymentsMonitoringBatchesModelsPatch,
		deploymentsMonitoringBatchesModelsRetrieve:
			Deployments.deploymentsMonitoringBatchesModelsRetrieve,
		deploymentsMonitoringBatchesPatch:
			Deployments.deploymentsMonitoringBatchesPatch,
		deploymentsMonitoringBatchesRetrieve:
			Deployments.deploymentsMonitoringBatchesRetrieve,
		deploymentsMonitoringDataDeletionsCreate:
			Deployments.deploymentsMonitoringDataDeletionsCreate,
		deploymentsOnDemandReportsCreate:
			Deployments.deploymentsOnDemandReportsCreate,
		deploymentsPatch: Deployments.deploymentsPatch,
		deploymentsPredictionDataExportsCreate:
			Deployments.deploymentsPredictionDataExportsCreate,
		deploymentsPredictionDataExportsList:
			Deployments.deploymentsPredictionDataExportsList,
		deploymentsPredictionDataExportsPatch:
			Deployments.deploymentsPredictionDataExportsPatch,
		deploymentsPredictionDataExportsRetrieve:
			Deployments.deploymentsPredictionDataExportsRetrieve,
		deploymentsPredictionInputsFromDatasetCreate:
			Deployments.deploymentsPredictionInputsFromDatasetCreate,
		deploymentsPredictionResultsList:
			Deployments.deploymentsPredictionResultsList,
		deploymentsPredictionsOverBatchList:
			Deployments.deploymentsPredictionsOverBatchList,
		deploymentsPredictionsOverSpaceList:
			Deployments.deploymentsPredictionsOverSpaceList,
		deploymentsPredictionsOverTimeList:
			Deployments.deploymentsPredictionsOverTimeList,
		deploymentsPredictionsVsActualsOverBatchList:
			Deployments.deploymentsPredictionsVsActualsOverBatchList,
		deploymentsPredictionsVsActualsOverSpaceList:
			Deployments.deploymentsPredictionsVsActualsOverSpaceList,
		deploymentsPredictionsVsActualsOverTimeList:
			Deployments.deploymentsPredictionsVsActualsOverTimeList,
		deploymentsQuotaConsumersList: Deployments.deploymentsQuotaConsumersList,
		deploymentsRetrainingPoliciesCreate:
			Deployments.deploymentsRetrainingPoliciesCreate,
		deploymentsRetrainingPoliciesDelete:
			Deployments.deploymentsRetrainingPoliciesDelete,
		deploymentsRetrainingPoliciesList:
			Deployments.deploymentsRetrainingPoliciesList,
		deploymentsRetrainingPoliciesPatch:
			Deployments.deploymentsRetrainingPoliciesPatch,
		deploymentsRetrainingPoliciesRetrieve:
			Deployments.deploymentsRetrainingPoliciesRetrieve,
		deploymentsRetrainingPoliciesRunsCreate:
			Deployments.deploymentsRetrainingPoliciesRunsCreate,
		deploymentsRetrainingPoliciesRunsList:
			Deployments.deploymentsRetrainingPoliciesRunsList,
		deploymentsRetrainingPoliciesRunsPatch:
			Deployments.deploymentsRetrainingPoliciesRunsPatch,
		deploymentsRetrainingPoliciesRunsRetrieve:
			Deployments.deploymentsRetrainingPoliciesRunsRetrieve,
		deploymentsRetrainingSettingsList:
			Deployments.deploymentsRetrainingSettingsList,
		deploymentsRetrainingSettingsPatchMany:
			Deployments.deploymentsRetrainingSettingsPatchMany,
		deploymentsRetrieve: Deployments.deploymentsRetrieve,
		deploymentsRuntimeParametersList:
			Deployments.deploymentsRuntimeParametersList,
		deploymentsRuntimeParametersPutMany:
			Deployments.deploymentsRuntimeParametersPutMany,
		deploymentsScoringCodeBuildsCreate:
			Deployments.deploymentsScoringCodeBuildsCreate,
		deploymentsScoringCodeList: Deployments.deploymentsScoringCodeList,
		deploymentsSegmentAttributesList:
			Deployments.deploymentsSegmentAttributesList,
		deploymentsSegmentValuesList: Deployments.deploymentsSegmentValuesList,
		deploymentsServiceStatsList: Deployments.deploymentsServiceStatsList,
		deploymentsServiceStatsOverBatchList:
			Deployments.deploymentsServiceStatsOverBatchList,
		deploymentsServiceStatsOverTimeList:
			Deployments.deploymentsServiceStatsOverTimeList,
		deploymentsSettingsChecklistList:
			Deployments.deploymentsSettingsChecklistList,
		deploymentsSettingsList: Deployments.deploymentsSettingsList,
		deploymentsSettingsPatchMany: Deployments.deploymentsSettingsPatchMany,
		deploymentsSharedRolesList: Deployments.deploymentsSharedRolesList,
		deploymentsSharedRolesPatchMany:
			Deployments.deploymentsSharedRolesPatchMany,
		deploymentsStatusPatchMany: Deployments.deploymentsStatusPatchMany,
		deploymentsTargetDriftList: Deployments.deploymentsTargetDriftList,
		deploymentsTrainingDataExportsCreate:
			Deployments.deploymentsTrainingDataExportsCreate,
		deploymentsTrainingDataExportsList:
			Deployments.deploymentsTrainingDataExportsList,
		deploymentsTrainingDataExportsRetrieve:
			Deployments.deploymentsTrainingDataExportsRetrieve,
	},
	entitlements: {
		entitlementsApplyEntitlementSetsCreate:
			Entitlements.entitlementsApplyEntitlementSetsCreate,
		entitlementsEntitlementSetLeasesList:
			Entitlements.entitlementsEntitlementSetLeasesList,
		entitlementsEvaluateCreate: Entitlements.entitlementsEvaluateCreate,
	},
	entityNotificationChannels: {
		entityNotificationChannelsCreate:
			EntityNotificationChannels.entityNotificationChannelsCreate,
		entityNotificationChannelsDelete:
			EntityNotificationChannels.entityNotificationChannelsDelete,
		entityNotificationChannelsList:
			EntityNotificationChannels.entityNotificationChannelsList,
		entityNotificationChannelsPut:
			EntityNotificationChannels.entityNotificationChannelsPut,
		entityNotificationChannelsRetrieve:
			EntityNotificationChannels.entityNotificationChannelsRetrieve,
	},
	entityNotificationPolicies: {
		entityNotificationPoliciesCreate:
			EntityNotificationPolicies.entityNotificationPoliciesCreate,
		entityNotificationPoliciesDelete:
			EntityNotificationPolicies.entityNotificationPoliciesDelete,
		entityNotificationPoliciesList:
			EntityNotificationPolicies.entityNotificationPoliciesList,
		entityNotificationPoliciesPut:
			EntityNotificationPolicies.entityNotificationPoliciesPut,
		entityNotificationPoliciesRetrieve:
			EntityNotificationPolicies.entityNotificationPoliciesRetrieve,
	},
	entityNotificationPolicyTemplates: {
		entityNotificationPolicyTemplatesCreate:
			EntityNotificationPolicyTemplates.entityNotificationPolicyTemplatesCreate,
		entityNotificationPolicyTemplatesDelete:
			EntityNotificationPolicyTemplates.entityNotificationPolicyTemplatesDelete,
		entityNotificationPolicyTemplatesList:
			EntityNotificationPolicyTemplates.entityNotificationPolicyTemplatesList,
		entityNotificationPolicyTemplatesPut:
			EntityNotificationPolicyTemplates.entityNotificationPolicyTemplatesPut,
		entityNotificationPolicyTemplatesRelatedPoliciesList:
			EntityNotificationPolicyTemplates.entityNotificationPolicyTemplatesRelatedPoliciesList,
		entityNotificationPolicyTemplatesRetrieve:
			EntityNotificationPolicyTemplates.entityNotificationPolicyTemplatesRetrieve,
		entityNotificationPolicyTemplatesSharedRolesList:
			EntityNotificationPolicyTemplates.entityNotificationPolicyTemplatesSharedRolesList,
		entityNotificationPolicyTemplatesSharedRolesPatchMany:
			EntityNotificationPolicyTemplates.entityNotificationPolicyTemplatesSharedRolesPatchMany,
	},
	entityTags: {
		entityTagsCreate: EntityTags.entityTagsCreate,
		entityTagsDelete: EntityTags.entityTagsDelete,
		entityTagsList: EntityTags.entityTagsList,
		entityTagsPatch: EntityTags.entityTagsPatch,
	},
	eventLogs: {
		eventLogsEventsList: EventLogs.eventLogsEventsList,
		eventLogsList: EventLogs.eventLogsList,
		eventLogsPredictionUsageList: EventLogs.eventLogsPredictionUsageList,
		eventLogsRetrieve: EventLogs.eventLogsRetrieve,
	},
	executionEnvironments: {
		executionEnvironmentsAccessControlList:
			ExecutionEnvironments.executionEnvironmentsAccessControlList,
		executionEnvironmentsAccessControlPatchMany:
			ExecutionEnvironments.executionEnvironmentsAccessControlPatchMany,
		executionEnvironmentsCreate:
			ExecutionEnvironments.executionEnvironmentsCreate,
		executionEnvironmentsDelete:
			ExecutionEnvironments.executionEnvironmentsDelete,
		executionEnvironmentsList: ExecutionEnvironments.executionEnvironmentsList,
		executionEnvironmentsPatch:
			ExecutionEnvironments.executionEnvironmentsPatch,
		executionEnvironmentsRetrieve:
			ExecutionEnvironments.executionEnvironmentsRetrieve,
		executionEnvironmentsVersionsBuildLogList:
			ExecutionEnvironments.executionEnvironmentsVersionsBuildLogList,
		executionEnvironmentsVersionsCancelBuildPatchMany:
			ExecutionEnvironments.executionEnvironmentsVersionsCancelBuildPatchMany,
		executionEnvironmentsVersionsCreate:
			ExecutionEnvironments.executionEnvironmentsVersionsCreate,
		executionEnvironmentsVersionsDownloadCreate:
			ExecutionEnvironments.executionEnvironmentsVersionsDownloadCreate,
		executionEnvironmentsVersionsDownloadList:
			ExecutionEnvironments.executionEnvironmentsVersionsDownloadList,
		executionEnvironmentsVersionsList:
			ExecutionEnvironments.executionEnvironmentsVersionsList,
		executionEnvironmentsVersionsRetrieve:
			ExecutionEnvironments.executionEnvironmentsVersionsRetrieve,
	},
	externalDataDrivers: {
		externalDataDriversConfigurationList:
			ExternalDataDrivers.externalDataDriversConfigurationList,
		externalDataDriversCreate: ExternalDataDrivers.externalDataDriversCreate,
		externalDataDriversDelete: ExternalDataDrivers.externalDataDriversDelete,
		externalDataDriversList: ExternalDataDrivers.externalDataDriversList,
		externalDataDriversPatch: ExternalDataDrivers.externalDataDriversPatch,
		externalDataDriversRetrieve:
			ExternalDataDrivers.externalDataDriversRetrieve,
	},
	externalDataSources: {
		externalDataSourcesAccessControlList:
			ExternalDataSources.externalDataSourcesAccessControlList,
		externalDataSourcesAccessControlPatchMany:
			ExternalDataSources.externalDataSourcesAccessControlPatchMany,
		externalDataSourcesCreate: ExternalDataSources.externalDataSourcesCreate,
		externalDataSourcesDelete: ExternalDataSources.externalDataSourcesDelete,
		externalDataSourcesList: ExternalDataSources.externalDataSourcesList,
		externalDataSourcesPatch: ExternalDataSources.externalDataSourcesPatch,
		externalDataSourcesPermissionsList:
			ExternalDataSources.externalDataSourcesPermissionsList,
		externalDataSourcesRetrieve:
			ExternalDataSources.externalDataSourcesRetrieve,
		externalDataSourcesSharedRolesList:
			ExternalDataSources.externalDataSourcesSharedRolesList,
		externalDataSourcesSharedRolesPatchMany:
			ExternalDataSources.externalDataSourcesSharedRolesPatchMany,
	},
	externalDataStores: {
		externalDataStoresAccessControlPatchMany:
			ExternalDataStores.externalDataStoresAccessControlPatchMany,
		externalDataStoresColumnsCreate:
			ExternalDataStores.externalDataStoresColumnsCreate,
		externalDataStoresColumnsInfoCreate:
			ExternalDataStores.externalDataStoresColumnsInfoCreate,
		externalDataStoresCreate: ExternalDataStores.externalDataStoresCreate,
		externalDataStoresCredentialsList:
			ExternalDataStores.externalDataStoresCredentialsList,
		externalDataStoresDelete: ExternalDataStores.externalDataStoresDelete,
		externalDataStoresList: ExternalDataStores.externalDataStoresList,
		externalDataStoresPatch: ExternalDataStores.externalDataStoresPatch,
		externalDataStoresPermissionsList:
			ExternalDataStores.externalDataStoresPermissionsList,
		externalDataStoresRetrieve: ExternalDataStores.externalDataStoresRetrieve,
		externalDataStoresSchemasCreate:
			ExternalDataStores.externalDataStoresSchemasCreate,
		externalDataStoresSharedRolesList:
			ExternalDataStores.externalDataStoresSharedRolesList,
		externalDataStoresSharedRolesPatchMany:
			ExternalDataStores.externalDataStoresSharedRolesPatchMany,
		externalDataStoresStandardUserDefinedFunctionsCreate:
			ExternalDataStores.externalDataStoresStandardUserDefinedFunctionsCreate,
		externalDataStoresStandardUserDefinedFunctionsDetectCreate:
			ExternalDataStores.externalDataStoresStandardUserDefinedFunctionsDetectCreate,
		externalDataStoresStandardUserDefinedFunctionsList:
			ExternalDataStores.externalDataStoresStandardUserDefinedFunctionsList,
		externalDataStoresTablesCreate:
			ExternalDataStores.externalDataStoresTablesCreate,
		externalDataStoresTestCreate:
			ExternalDataStores.externalDataStoresTestCreate,
		externalDataStoresVerifySQLCreate:
			ExternalDataStores.externalDataStoresVerifySQLCreate,
	},
	externalOAuth: {
		externalOAuthAuthorizedProvidersDelete:
			ExternalOAuth.externalOAuthAuthorizedProvidersDelete,
		externalOAuthAuthorizedProvidersList:
			ExternalOAuth.externalOAuthAuthorizedProvidersList,
		externalOAuthAuthorizedProvidersTokenCreate:
			ExternalOAuth.externalOAuthAuthorizedProvidersTokenCreate,
		externalOAuthAuthorizedProvidersUserinfoList:
			ExternalOAuth.externalOAuthAuthorizedProvidersUserinfoList,
		externalOAuthJobsRetrieve: ExternalOAuth.externalOAuthJobsRetrieve,
		externalOAuthProvidersAuthorizeCreate:
			ExternalOAuth.externalOAuthProvidersAuthorizeCreate,
		externalOAuthProvidersCallbackCreate:
			ExternalOAuth.externalOAuthProvidersCallbackCreate,
		externalOAuthProvidersCreate: ExternalOAuth.externalOAuthProvidersCreate,
		externalOAuthProvidersDelete: ExternalOAuth.externalOAuthProvidersDelete,
		externalOAuthProvidersList: ExternalOAuth.externalOAuthProvidersList,
		externalOAuthProvidersPatch: ExternalOAuth.externalOAuthProvidersPatch,
		externalOAuthProvidersRetrieve:
			ExternalOAuth.externalOAuthProvidersRetrieve,
	},
	files: {
		filesAddFromDataSourceCreate: Files.filesAddFromDataSourceCreate,
		filesAddFromFileCreate: Files.filesAddFromFileCreate,
		filesAddFromURLCreate: Files.filesAddFromURLCreate,
		filesAllFilesDeleteMany: Files.filesAllFilesDeleteMany,
		filesAllFilesList: Files.filesAllFilesList,
		filesAllFilesPatchMany: Files.filesAllFilesPatchMany,
		filesCloneCreate: Files.filesCloneCreate,
		filesCopyBatchCreate: Files.filesCopyBatchCreate,
		filesCopyCreate: Files.filesCopyCreate,
		filesCreate: Files.filesCreate,
		filesDelete: Files.filesDelete,
		filesDeletedPatchMany: Files.filesDeletedPatchMany,
		filesDownloadsCreate: Files.filesDownloadsCreate,
		filesFileList: Files.filesFileList,
		filesFromDataSourceCreate: Files.filesFromDataSourceCreate,
		filesFromFileCreate: Files.filesFromFileCreate,
		filesFromStageCreate: Files.filesFromStageCreate,
		filesFromURLCreate: Files.filesFromURLCreate,
		filesLinksCreate: Files.filesLinksCreate,
		filesPatchMany: Files.filesPatchMany,
		filesSharedRolesList: Files.filesSharedRolesList,
		filesSharedRolesPatchMany: Files.filesSharedRolesPatchMany,
		filesStagesCreate: Files.filesStagesCreate,
		filesStagesUploadCreate: Files.filesStagesUploadCreate,
		filesVersionsAllFilesList: Files.filesVersionsAllFilesList,
		filesVersionsDelete: Files.filesVersionsDelete,
		filesVersionsDeletedPatchMany: Files.filesVersionsDeletedPatchMany,
		filesVersionsDownloadsCreate: Files.filesVersionsDownloadsCreate,
		filesVersionsFileList: Files.filesVersionsFileList,
		filesVersionsLinksCreate: Files.filesVersionsLinksCreate,
		filesVersionsList: Files.filesVersionsList,
	},
	genai: {
		copySupportedInsightsPlaygroundsTargetPlaygroundIdSupportedInsightsSourcePlaygroundIdPut:
			Genai.copySupportedInsightsPlaygroundsTargetPlaygroundIdSupportedInsightsSourcePlaygroundIdPut,
		createChatChatsPost: Genai.createChatChatsPost,
		createChatExportJobPlaygroundsPlaygroundIdTraceDatasetsPost:
			Genai.createChatExportJobPlaygroundsPlaygroundIdTraceDatasetsPost,
		createChatPromptChatPromptsPost: Genai.createChatPromptChatPromptsPost,
		createComparisonChatComparisonChatsPost:
			Genai.createComparisonChatComparisonChatsPost,
		createComparisonPromptComparisonPromptsPost:
			Genai.createComparisonPromptComparisonPromptsPost,
		createCostMetricConfigurationCostMetricConfigurationsPost:
			Genai.createCostMetricConfigurationCostMetricConfigurationsPost,
		createCustomModelEmbeddingValidationCustomModelEmbeddingValidationsPost:
			Genai.createCustomModelEmbeddingValidationCustomModelEmbeddingValidationsPost,
		createCustomModelLlmValidationCustomModelLLMValidationsPost:
			Genai.createCustomModelLlmValidationCustomModelLLMValidationsPost,
		createCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsPost:
			Genai.createCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsPost,
		createCustomModelVectorDatabaseVectorDatabasesFromCustomModelDeploymentPost:
			Genai.createCustomModelVectorDatabaseVectorDatabasesFromCustomModelDeploymentPost,
		createCustomModelVersionCustomModelVersionsPost:
			Genai.createCustomModelVersionCustomModelVersionsPost,
		createEvaluationDatasetConfigurationEvaluationDatasetConfigurationsPost:
			Genai.createEvaluationDatasetConfigurationEvaluationDatasetConfigurationsPost,
		createEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsPost:
			Genai.createEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsPost,
		createFromChatPromptLlmBlueprintsFromChatPromptPost:
			Genai.createFromChatPromptLlmBlueprintsFromChatPromptPost,
		createFromLlmBlueprintLlmBlueprintsFromLLMBlueprintPost:
			Genai.createFromLlmBlueprintLlmBlueprintsFromLLMBlueprintPost,
		createLlmBlueprintLlmBlueprintsPost:
			Genai.createLlmBlueprintLlmBlueprintsPost,
		createLlmTestConfigurationLlmTestConfigurationsPost:
			Genai.createLlmTestConfigurationLlmTestConfigurationsPost,
		createLlmTestResultLlmTestResultsPost:
			Genai.createLlmTestResultLlmTestResultsPost,
		createLlmTestSuiteLlmTestSuitesPost:
			Genai.createLlmTestSuiteLlmTestSuitesPost,
		createOotbMetricConfigurationPlaygroundsPlaygroundIdOotbMetricConfigurationsPost:
			Genai.createOotbMetricConfigurationPlaygroundsPlaygroundIdOotbMetricConfigurationsPost,
		createPlaygroundPlaygroundsPost: Genai.createPlaygroundPlaygroundsPost,
		createPromptTemplatePromptTemplatesPost:
			Genai.createPromptTemplatePromptTemplatesPost,
		createPromptTemplateVersionPromptTemplatesPromptTemplateIdVersionsPost:
			Genai.createPromptTemplateVersionPromptTemplatesPromptTemplateIdVersionsPost,
		createSidecarModelMetricValidationSidecarModelMetricValidationsPost:
			Genai.createSidecarModelMetricValidationSidecarModelMetricValidationsPost,
		createVectorDatabaseCustomModelVersionVectorDatabasesVectorDatabaseIdCustomModelVersionsPost:
			Genai.createVectorDatabaseCustomModelVersionVectorDatabasesVectorDatabaseIdCustomModelVersionsPost,
		createVectorDatabaseDeploymentVectorDatabasesVectorDatabaseIdDeploymentsPost:
			Genai.createVectorDatabaseDeploymentVectorDatabasesVectorDatabaseIdDeploymentsPost,
		createVectorDatabaseVectorDatabasesPost:
			Genai.createVectorDatabaseVectorDatabasesPost,
		deleteChatChatsChatIdDelete: Genai.deleteChatChatsChatIdDelete,
		deleteChatPromptChatPromptsChatPromptIdDelete:
			Genai.deleteChatPromptChatPromptsChatPromptIdDelete,
		deleteComparisonChatComparisonChatsComparisonChatIdDelete:
			Genai.deleteComparisonChatComparisonChatsComparisonChatIdDelete,
		deleteComparisonPromptComparisonPromptsComparisonPromptIdDelete:
			Genai.deleteComparisonPromptComparisonPromptsComparisonPromptIdDelete,
		deleteCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdDelete:
			Genai.deleteCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdDelete,
		deleteCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdDelete:
			Genai.deleteCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdDelete,
		deleteCustomModelLlmValidationCustomModelLLMValidationsValidationIdDelete:
			Genai.deleteCustomModelLlmValidationCustomModelLLMValidationsValidationIdDelete,
		deleteCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdDelete:
			Genai.deleteCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdDelete,
		deleteEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdDelete:
			Genai.deleteEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdDelete,
		deleteEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsDelete:
			Genai.deleteEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsDelete,
		deleteLlmBlueprintLlmBlueprintsLlmBlueprintIdDelete:
			Genai.deleteLlmBlueprintLlmBlueprintsLlmBlueprintIdDelete,
		deleteLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdDelete:
			Genai.deleteLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdDelete,
		deleteLlmTestResultLlmTestResultsLlmTestResultIdDelete:
			Genai.deleteLlmTestResultLlmTestResultsLlmTestResultIdDelete,
		deleteLlmTestSuiteLlmTestSuitesLlmTestSuiteIdDelete:
			Genai.deleteLlmTestSuiteLlmTestSuitesLlmTestSuiteIdDelete,
		deleteNemoMetricPlaygroundsPlaygroundIdNemoConfigurationMetricIdDelete:
			Genai.deleteNemoMetricPlaygroundsPlaygroundIdNemoConfigurationMetricIdDelete,
		deleteOotbMetricConfigurationOotbMetricConfigurationsOotbMetricConfigurationIdDelete:
			Genai.deleteOotbMetricConfigurationOotbMetricConfigurationsOotbMetricConfigurationIdDelete,
		deletePlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationDelete:
			Genai.deletePlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationDelete,
		deletePlaygroundPlaygroundsPlaygroundIdDelete:
			Genai.deletePlaygroundPlaygroundsPlaygroundIdDelete,
		deleteSearchStudySyftrSearchSearchStudyIdDelete:
			Genai.deleteSearchStudySyftrSearchSearchStudyIdDelete,
		deleteSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdDelete:
			Genai.deleteSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdDelete,
		deleteVectorDatabaseVectorDatabasesVectorDatabaseIdDelete:
			Genai.deleteVectorDatabaseVectorDatabasesVectorDatabaseIdDelete,
		downloadTextAndEmbeddingsAssetVectorDatabasesVectorDatabaseIdTextAndEmbeddingsGet:
			Genai.downloadTextAndEmbeddingsAssetVectorDatabasesVectorDatabaseIdTextAndEmbeddingsGet,
		editChatChatsChatIdPatch: Genai.editChatChatsChatIdPatch,
		editComparisonChatComparisonChatsComparisonChatIdPatch:
			Genai.editComparisonChatComparisonChatsComparisonChatIdPatch,
		editLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdPatch:
			Genai.editLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdPatch,
		editLlmTestSuiteLlmTestSuitesLlmTestSuiteIdPatch:
			Genai.editLlmTestSuiteLlmTestSuitesLlmTestSuiteIdPatch,
		editSearchStudySyftrSearchSearchStudyIdPatch:
			Genai.editSearchStudySyftrSearchSearchStudyIdPatch,
		exportVectorDatabaseDatasetVectorDatabasesVectorDatabaseIdDatasetExportJobsPost:
			Genai.exportVectorDatabaseDatasetVectorDatabasesVectorDatabaseIdDatasetExportJobsPost,
		fromCustomModelChatAgentsFromCustomModelCustomModelIdChatPost:
			Genai.fromCustomModelChatAgentsFromCustomModelCustomModelIdChatPost,
		generateSyntheticDatasetSyntheticEvaluationDatasetGenerationsPost:
			Genai.generateSyntheticDatasetSyntheticEvaluationDatasetGenerationsPost,
		getChatChatsChatIdGet: Genai.getChatChatsChatIdGet,
		getChatPromptChatPromptsChatPromptIdGet:
			Genai.getChatPromptChatPromptsChatPromptIdGet,
		getChatResponseAgentsFromCustomModelCustomModelIdChatChatCompletionIdGet:
			Genai.getChatResponseAgentsFromCustomModelCustomModelIdChatChatCompletionIdGet,
		getComparisonChatComparisonChatsComparisonChatIdGet:
			Genai.getComparisonChatComparisonChatsComparisonChatIdGet,
		getComparisonPromptComparisonPromptsComparisonPromptIdGet:
			Genai.getComparisonPromptComparisonPromptsComparisonPromptIdGet,
		getCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdGet:
			Genai.getCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdGet,
		getCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdGet:
			Genai.getCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdGet,
		getCustomModelLlmValidationCustomModelLLMValidationsValidationIdGet:
			Genai.getCustomModelLlmValidationCustomModelLLMValidationsValidationIdGet,
		getCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdGet:
			Genai.getCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdGet,
		getEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdGet:
			Genai.getEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdGet,
		getLlmBlueprintLlmBlueprintsLlmBlueprintIdGet:
			Genai.getLlmBlueprintLlmBlueprintsLlmBlueprintIdGet,
		getLlmLlmsLlmIdGet: Genai.getLlmLlmsLlmIdGet,
		getLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdGet:
			Genai.getLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdGet,
		getLlmTestResultLlmTestResultsLlmTestResultIdGet:
			Genai.getLlmTestResultLlmTestResultsLlmTestResultIdGet,
		getLlmTestSuiteLlmTestSuitesLlmTestSuiteIdGet:
			Genai.getLlmTestSuiteLlmTestSuitesLlmTestSuiteIdGet,
		getOotbMetricConfigurationOotbMetricConfigurationsOotbMetricConfigurationIdGet:
			Genai.getOotbMetricConfigurationOotbMetricConfigurationsOotbMetricConfigurationIdGet,
		getPlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationGet:
			Genai.getPlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationGet,
		getPlaygroundPlaygroundsPlaygroundIdGet:
			Genai.getPlaygroundPlaygroundsPlaygroundIdGet,
		getPromptTemplatePromptTemplatesPromptTemplateIdGet:
			Genai.getPromptTemplatePromptTemplatesPromptTemplateIdGet,
		getPromptTemplateVersionPromptTemplatesPromptTemplateIdVersionsPromptTemplateVersionIdGet:
			Genai.getPromptTemplateVersionPromptTemplatesPromptTemplateIdVersionsPromptTemplateVersionIdGet,
		getSearchStudySyftrSearchSearchStudyIdGet:
			Genai.getSearchStudySyftrSearchSearchStudyIdGet,
		getSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdGet:
			Genai.getSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdGet,
		getStatusStatusStatusIdGet: Genai.getStatusStatusStatusIdGet,
		getSupportedEmbeddingsVectorDatabasesSupportedEmbeddingsGet:
			Genai.getSupportedEmbeddingsVectorDatabasesSupportedEmbeddingsGet,
		getSupportedInsightsPlaygroundsPlaygroundIdSupportedInsightsGet:
			Genai.getSupportedInsightsPlaygroundsPlaygroundIdSupportedInsightsGet,
		getSupportedLanguagesVectorDatabasesVectorDatabaseIdSupportedSyntheticDatasetGenerationLanguagesGet:
			Genai.getSupportedLanguagesVectorDatabasesVectorDatabaseIdSupportedSyntheticDatasetGenerationLanguagesGet,
		getSupportedRetrievalSettingsVectorDatabasesSupportedRetrievalSettingsGet:
			Genai.getSupportedRetrievalSettingsVectorDatabasesSupportedRetrievalSettingsGet,
		getSupportedTextChunkingConfigsVectorDatabasesSupportedTextChunkingsGet:
			Genai.getSupportedTextChunkingConfigsVectorDatabasesSupportedTextChunkingsGet,
		getUserLimitCounterForVectorDatabasesUserLimitsVectorDatabasesGet:
			Genai.getUserLimitCounterForVectorDatabasesUserLimitsVectorDatabasesGet,
		getVectorDatabaseLatestVersionVectorDatabasesVectorDatabaseIdLatestVersionGet:
			Genai.getVectorDatabaseLatestVersionVectorDatabasesVectorDatabaseIdLatestVersionGet,
		getVectorDatabaseVectorDatabasesVectorDatabaseIdGet:
			Genai.getVectorDatabaseVectorDatabasesVectorDatabaseIdGet,
		listChatPromptsChatPromptsGet: Genai.listChatPromptsChatPromptsGet,
		listChatsChatsGet: Genai.listChatsChatsGet,
		listComparisonChatsComparisonChatsGet:
			Genai.listComparisonChatsComparisonChatsGet,
		listComparisonPromptsComparisonPromptsGet:
			Genai.listComparisonPromptsComparisonPromptsGet,
		listCustomModelEmbeddingsCustomModelEmbeddingValidationsGet:
			Genai.listCustomModelEmbeddingsCustomModelEmbeddingValidationsGet,
		listCustomModelLlmValidationsCustomModelLLMValidationsGet:
			Genai.listCustomModelLlmValidationsCustomModelLLMValidationsGet,
		listCustomModelVectorDatabaseValidationsCustomModelVectorDatabaseValidationsGet:
			Genai.listCustomModelVectorDatabaseValidationsCustomModelVectorDatabaseValidationsGet,
		listEvaluationDatasetConfigurationEvaluationDatasetConfigurationsGet:
			Genai.listEvaluationDatasetConfigurationEvaluationDatasetConfigurationsGet,
		listEvaluationDatasetMetricAggregationAggregatedByLlmBlueprintEvaluationDatasetMetricAggregationsAggregateByLLMBlueprintGet:
			Genai.listEvaluationDatasetMetricAggregationAggregatedByLlmBlueprintEvaluationDatasetMetricAggregationsAggregateByLLMBlueprintGet,
		listEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsGet:
			Genai.listEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsGet,
		listEvaluationDatasetMetricAggregationUniqueFieldValuesEvaluationDatasetMetricAggregationsUniqueFieldValuesUniqueFieldGet:
			Genai.listEvaluationDatasetMetricAggregationUniqueFieldValuesEvaluationDatasetMetricAggregationsUniqueFieldValuesUniqueFieldGet,
		listLlmBlueprintsLlmBlueprintsGet: Genai.listLlmBlueprintsLlmBlueprintsGet,
		listLlmTestConfigurationNonOotbDatasetsLlmTestConfigurationsNonOotbDatasetsGet:
			Genai.listLlmTestConfigurationNonOotbDatasetsLlmTestConfigurationsNonOotbDatasetsGet,
		listLlmTestConfigurationOotbDatasetsLlmTestConfigurationsOotbDatasetsGet:
			Genai.listLlmTestConfigurationOotbDatasetsLlmTestConfigurationsOotbDatasetsGet,
		listLlmTestConfigurationSupportedInsightsLlmTestConfigurationsSupportedInsightsGet:
			Genai.listLlmTestConfigurationSupportedInsightsLlmTestConfigurationsSupportedInsightsGet,
		listLlmTestConfigurationsLlmTestConfigurationsGet:
			Genai.listLlmTestConfigurationsLlmTestConfigurationsGet,
		listLlmTestResultsLlmTestResultsGet:
			Genai.listLlmTestResultsLlmTestResultsGet,
		listLlmTestSuitesLlmTestSuitesGet: Genai.listLlmTestSuitesLlmTestSuitesGet,
		listLlmsLlmsGet: Genai.listLlmsLlmsGet,
		listOotbMetricConfigurationsPlaygroundsPlaygroundIdOotbMetricConfigurationsGet:
			Genai.listOotbMetricConfigurationsPlaygroundsPlaygroundIdOotbMetricConfigurationsGet,
		listPlaygroundsPlaygroundsGet: Genai.listPlaygroundsPlaygroundsGet,
		listPromptTemplateVersionsPromptTemplatesPromptTemplateIdVersionsGet:
			Genai.listPromptTemplateVersionsPromptTemplatesPromptTemplateIdVersionsGet,
		listPromptTemplatesPromptTemplatesGet:
			Genai.listPromptTemplatesPromptTemplatesGet,
		listPromptTemplatesVersionsPromptTemplatesVersionsGet:
			Genai.listPromptTemplatesVersionsPromptTemplatesVersionsGet,
		listSearchStudySyftrSearchGet: Genai.listSearchStudySyftrSearchGet,
		listSidecarModelValidationsSidecarModelMetricValidationsGet:
			Genai.listSidecarModelValidationsSidecarModelMetricValidationsGet,
		listVectorDatabasesVectorDatabasesGet:
			Genai.listVectorDatabasesVectorDatabasesGet,
		playgroundTraceMetadataPlaygroundsPlaygroundIdTraceMetadataGet:
			Genai.playgroundTraceMetadataPlaygroundsPlaygroundIdTraceMetadataGet,
		playgroundTracePlaygroundsPlaygroundIdTraceGet:
			Genai.playgroundTracePlaygroundsPlaygroundIdTraceGet,
		revalidateCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdRevalidatePost:
			Genai.revalidateCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdRevalidatePost,
		revalidateCustomModelLlmValidationCustomModelLLMValidationsValidationIdRevalidatePost:
			Genai.revalidateCustomModelLlmValidationCustomModelLLMValidationsValidationIdRevalidatePost,
		revalidateCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdRevalidatePost:
			Genai.revalidateCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdRevalidatePost,
		revalidateSidecarModelValidationSidecarModelMetricValidationsValidationIdRevalidatePost:
			Genai.revalidateSidecarModelValidationSidecarModelMetricValidationsValidationIdRevalidatePost,
		runAgenticSearchSyftrSearchPost: Genai.runAgenticSearchSyftrSearchPost,
		updateChatPromptDataChatPromptsChatPromptIdPatch:
			Genai.updateChatPromptDataChatPromptsChatPromptIdPatch,
		updateComparisonPromptComparisonPromptsComparisonPromptIdPatch:
			Genai.updateComparisonPromptComparisonPromptsComparisonPromptIdPatch,
		updateConnectedVectorDatabaseVectorDatabasesVectorDatabaseIdExternalVectorDatabaseDocumentsPatch:
			Genai.updateConnectedVectorDatabaseVectorDatabasesVectorDatabaseIdExternalVectorDatabaseDocumentsPatch,
		updateCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdPatch:
			Genai.updateCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdPatch,
		updateCustomModelLlmValidationCustomModelLLMValidationsValidationIdPatch:
			Genai.updateCustomModelLlmValidationCustomModelLLMValidationsValidationIdPatch,
		updateCustomModelValidationCustomModelEmbeddingValidationsValidationIdPatch:
			Genai.updateCustomModelValidationCustomModelEmbeddingValidationsValidationIdPatch,
		updateCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdPatch:
			Genai.updateCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdPatch,
		updateEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdPatch:
			Genai.updateEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdPatch,
		updateLlmBlueprintLlmBlueprintsLlmBlueprintIdPatch:
			Genai.updateLlmBlueprintLlmBlueprintsLlmBlueprintIdPatch,
		updatePlaygroundPlaygroundsPlaygroundIdPatch:
			Genai.updatePlaygroundPlaygroundsPlaygroundIdPatch,
		updateSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdPatch:
			Genai.updateSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdPatch,
		updateVectorDatabaseVectorDatabasesVectorDatabaseIdPatch:
			Genai.updateVectorDatabaseVectorDatabasesVectorDatabaseIdPatch,
		upsertPlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationPost:
			Genai.upsertPlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationPost,
	},
	groups: {
		groupsCreate: Groups.groupsCreate,
		groupsDelete: Groups.groupsDelete,
		groupsDeleteMany: Groups.groupsDeleteMany,
		groupsList: Groups.groupsList,
		groupsPatch: Groups.groupsPatch,
		groupsRetrieve: Groups.groupsRetrieve,
		groupsUsersCreate: Groups.groupsUsersCreate,
		groupsUsersDeleteMany: Groups.groupsUsersDeleteMany,
		groupsUsersList: Groups.groupsUsersList,
	},
	guardConfigurations: {
		guardConfigurationsCreate: GuardConfigurations.guardConfigurationsCreate,
		guardConfigurationsDelete: GuardConfigurations.guardConfigurationsDelete,
		guardConfigurationsList: GuardConfigurations.guardConfigurationsList,
		guardConfigurationsPatch: GuardConfigurations.guardConfigurationsPatch,
		guardConfigurationsPredictionEnvironmentsInUseList:
			GuardConfigurations.guardConfigurationsPredictionEnvironmentsInUseList,
		guardConfigurationsRetrieve:
			GuardConfigurations.guardConfigurationsRetrieve,
		guardConfigurationsToNewCustomModelVersionCreate:
			GuardConfigurations.guardConfigurationsToNewCustomModelVersionCreate,
	},
	guardTemplates: {
		guardTemplatesList: GuardTemplates.guardTemplatesList,
		guardTemplatesRetrieve: GuardTemplates.guardTemplatesRetrieve,
	},
	imageAugmentationLists: {
		imageAugmentationListsCreate:
			ImageAugmentationLists.imageAugmentationListsCreate,
		imageAugmentationListsDelete:
			ImageAugmentationLists.imageAugmentationListsDelete,
		imageAugmentationListsList:
			ImageAugmentationLists.imageAugmentationListsList,
		imageAugmentationListsPatch:
			ImageAugmentationLists.imageAugmentationListsPatch,
		imageAugmentationListsRetrieve:
			ImageAugmentationLists.imageAugmentationListsRetrieve,
		imageAugmentationListsSamplesCreate:
			ImageAugmentationLists.imageAugmentationListsSamplesCreate,
		imageAugmentationListsSamplesList:
			ImageAugmentationLists.imageAugmentationListsSamplesList,
	},
	insights: {
		insightsConfusionMatrixCreate: Insights.insightsConfusionMatrixCreate,
		insightsConfusionMatrixModelsList:
			Insights.insightsConfusionMatrixModelsList,
		insightsFeatureEffectsCreate: Insights.insightsFeatureEffectsCreate,
		insightsFeatureEffectsModelsList: Insights.insightsFeatureEffectsModelsList,
		insightsFeatureImpactCreate: Insights.insightsFeatureImpactCreate,
		insightsFeatureImpactModelsList: Insights.insightsFeatureImpactModelsList,
		insightsLiftChartCreate: Insights.insightsLiftChartCreate,
		insightsLiftChartModelsList: Insights.insightsLiftChartModelsList,
		insightsModelsDelete: Insights.insightsModelsDelete,
		insightsResidualsCreate: Insights.insightsResidualsCreate,
		insightsResidualsModelsList: Insights.insightsResidualsModelsList,
		insightsRocCurveCreate: Insights.insightsRocCurveCreate,
		insightsRocCurveModelsList: Insights.insightsRocCurveModelsList,
		insightsShapDistributionsCreate: Insights.insightsShapDistributionsCreate,
		insightsShapDistributionsModelsList:
			Insights.insightsShapDistributionsModelsList,
		insightsShapImpactCreate: Insights.insightsShapImpactCreate,
		insightsShapImpactModelsList: Insights.insightsShapImpactModelsList,
		insightsShapMatrixCreate: Insights.insightsShapMatrixCreate,
		insightsShapMatrixModelsList: Insights.insightsShapMatrixModelsList,
		insightsShapPreviewCreate: Insights.insightsShapPreviewCreate,
		insightsShapPreviewModelsList: Insights.insightsShapPreviewModelsList,
	},
	mlops: {
		mlopsComputeBundlesList: Mlops.mlopsComputeBundlesList,
		mlopsComputeBundlesRetrieve: Mlops.mlopsComputeBundlesRetrieve,
		mlopsPortablePredictionServerImageList:
			Mlops.mlopsPortablePredictionServerImageList,
		mlopsPortablePredictionServerImageMetadataList:
			Mlops.mlopsPortablePredictionServerImageMetadataList,
	},
	modelPackages: {
		modelPackagesArchiveCreate: ModelPackages.modelPackagesArchiveCreate,
		modelPackagesCapabilitiesList: ModelPackages.modelPackagesCapabilitiesList,
		modelPackagesFeaturesList: ModelPackages.modelPackagesFeaturesList,
		modelPackagesFromJSONCreate: ModelPackages.modelPackagesFromJSONCreate,
		modelPackagesFromLeaderboardCreate:
			ModelPackages.modelPackagesFromLeaderboardCreate,
		modelPackagesFromLearningModelCreate:
			ModelPackages.modelPackagesFromLearningModelCreate,
		modelPackagesList: ModelPackages.modelPackagesList,
		modelPackagesModelLogsList: ModelPackages.modelPackagesModelLogsList,
		modelPackagesRetrieve: ModelPackages.modelPackagesRetrieve,
		modelPackagesSharedRolesList: ModelPackages.modelPackagesSharedRolesList,
	},
	notebookCodeSnippets: {
		notebookCodeSnippetsList: NotebookCodeSnippets.notebookCodeSnippetsList,
		notebookCodeSnippetsRetrieve:
			NotebookCodeSnippets.notebookCodeSnippetsRetrieve,
		notebookCodeSnippetsTagsList:
			NotebookCodeSnippets.notebookCodeSnippetsTagsList,
	},
	notebookEnvironmentVariables: {
		notebookEnvironmentVariablesCreate:
			NotebookEnvironmentVariables.notebookEnvironmentVariablesCreate,
		notebookEnvironmentVariablesDelete:
			NotebookEnvironmentVariables.notebookEnvironmentVariablesDelete,
		notebookEnvironmentVariablesDelete2:
			NotebookEnvironmentVariables.notebookEnvironmentVariablesDelete2,
		notebookEnvironmentVariablesPatch:
			NotebookEnvironmentVariables.notebookEnvironmentVariablesPatch,
		notebookEnvironmentVariablesRetrieve:
			NotebookEnvironmentVariables.notebookEnvironmentVariablesRetrieve,
	},
	notebookExecutionEnvironments: {
		notebookExecutionEnvironmentsList:
			NotebookExecutionEnvironments.notebookExecutionEnvironmentsList,
		notebookExecutionEnvironmentsMachinesList:
			NotebookExecutionEnvironments.notebookExecutionEnvironmentsMachinesList,
		notebookExecutionEnvironmentsNotebooksList:
			NotebookExecutionEnvironments.notebookExecutionEnvironmentsNotebooksList,
		notebookExecutionEnvironmentsPatch:
			NotebookExecutionEnvironments.notebookExecutionEnvironmentsPatch,
		notebookExecutionEnvironmentsPortsCreate:
			NotebookExecutionEnvironments.notebookExecutionEnvironmentsPortsCreate,
		notebookExecutionEnvironmentsPortsDelete:
			NotebookExecutionEnvironments.notebookExecutionEnvironmentsPortsDelete,
		notebookExecutionEnvironmentsPortsDelete2:
			NotebookExecutionEnvironments.notebookExecutionEnvironmentsPortsDelete2,
		notebookExecutionEnvironmentsPortsList:
			NotebookExecutionEnvironments.notebookExecutionEnvironmentsPortsList,
		notebookExecutionEnvironmentsPortsPatch:
			NotebookExecutionEnvironments.notebookExecutionEnvironmentsPortsPatch,
		notebookExecutionEnvironmentsRetrieve:
			NotebookExecutionEnvironments.notebookExecutionEnvironmentsRetrieve,
		notebookExecutionEnvironmentsVersionsList:
			NotebookExecutionEnvironments.notebookExecutionEnvironmentsVersionsList,
	},
	notebookJobs: {
		notebookJobsCancelCreate: NotebookJobs.notebookJobsCancelCreate,
		notebookJobsCreate: NotebookJobs.notebookJobsCreate,
		notebookJobsDelete: NotebookJobs.notebookJobsDelete,
		notebookJobsList: NotebookJobs.notebookJobsList,
		notebookJobsManualRunCreate: NotebookJobs.notebookJobsManualRunCreate,
		notebookJobsPatch: NotebookJobs.notebookJobsPatch,
		notebookJobsRetrieve: NotebookJobs.notebookJobsRetrieve,
		notebookJobsRunHistoryList: NotebookJobs.notebookJobsRunHistoryList,
	},
	notebookRevisions: {
		notebookRevisionsCellsList: NotebookRevisions.notebookRevisionsCellsList,
		notebookRevisionsCreate: NotebookRevisions.notebookRevisionsCreate,
		notebookRevisionsDelete: NotebookRevisions.notebookRevisionsDelete,
		notebookRevisionsDelete2: NotebookRevisions.notebookRevisionsDelete2,
		notebookRevisionsFromRevisionCloneCreate:
			NotebookRevisions.notebookRevisionsFromRevisionCloneCreate,
		notebookRevisionsFromRevisionRestoreCreate:
			NotebookRevisions.notebookRevisionsFromRevisionRestoreCreate,
		notebookRevisionsPatch: NotebookRevisions.notebookRevisionsPatch,
		notebookRevisionsRetrieve: NotebookRevisions.notebookRevisionsRetrieve,
		notebookRevisionsRetrieve2: NotebookRevisions.notebookRevisionsRetrieve2,
		notebookRevisionsToFileList: NotebookRevisions.notebookRevisionsToFileList,
	},
	notebooks: {
		notebookSharedRolesList: Notebooks.notebookSharedRolesList,
		notebooksBatchClearCellsExecutionCountPatch:
			Notebooks.notebooksBatchClearCellsExecutionCountPatch,
		notebooksBulkLinkUseCaseCreate: Notebooks.notebooksBulkLinkUseCaseCreate,
		notebooksCellsBatchClearOutputPatch:
			Notebooks.notebooksCellsBatchClearOutputPatch,
		notebooksCellsBatchCreateCreate: Notebooks.notebooksCellsBatchCreateCreate,
		notebooksCellsBatchDeleteCreate: Notebooks.notebooksCellsBatchDeleteCreate,
		notebooksCellsBatchUpdateMetadataPatch:
			Notebooks.notebooksCellsBatchUpdateMetadataPatch,
		notebooksCellsBatchUpdateSourcesPatch:
			Notebooks.notebooksCellsBatchUpdateSourcesPatch,
		notebooksCellsCreate: Notebooks.notebooksCellsCreate,
		notebooksCellsDelete: Notebooks.notebooksCellsDelete,
		notebooksCellsList: Notebooks.notebooksCellsList,
		notebooksCellsOutputPatch: Notebooks.notebooksCellsOutputPatch,
		notebooksCellsPatch: Notebooks.notebooksCellsPatch,
		notebooksCreate: Notebooks.notebooksCreate,
		notebooksDelete: Notebooks.notebooksDelete,
		notebooksFilterOptionsList: Notebooks.notebooksFilterOptionsList,
		notebooksFromFileCreate: Notebooks.notebooksFromFileCreate,
		notebooksFromUrlCreate: Notebooks.notebooksFromUrlCreate,
		notebooksList: Notebooks.notebooksList,
		notebooksPatch: Notebooks.notebooksPatch,
		notebooksReorderCellsPatch: Notebooks.notebooksReorderCellsPatch,
		notebooksRetrieve: Notebooks.notebooksRetrieve,
		notebooksSharedRolesList: Notebooks.notebooksSharedRolesList,
		notebooksStatePatch: Notebooks.notebooksStatePatch,
		notebooksToCodespaceCreate: Notebooks.notebooksToCodespaceCreate,
		notebooksToFileList: Notebooks.notebooksToFileList,
	},
	notificationChannelTemplates: {
		notificationChannelTemplatesCreate:
			NotificationChannelTemplates.notificationChannelTemplatesCreate,
		notificationChannelTemplatesDelete:
			NotificationChannelTemplates.notificationChannelTemplatesDelete,
		notificationChannelTemplatesList:
			NotificationChannelTemplates.notificationChannelTemplatesList,
		notificationChannelTemplatesPolicyTemplatesList:
			NotificationChannelTemplates.notificationChannelTemplatesPolicyTemplatesList,
		notificationChannelTemplatesPut:
			NotificationChannelTemplates.notificationChannelTemplatesPut,
		notificationChannelTemplatesRelatedPoliciesList:
			NotificationChannelTemplates.notificationChannelTemplatesRelatedPoliciesList,
		notificationChannelTemplatesRetrieve:
			NotificationChannelTemplates.notificationChannelTemplatesRetrieve,
		notificationChannelTemplatesSharedRolesList:
			NotificationChannelTemplates.notificationChannelTemplatesSharedRolesList,
		notificationChannelTemplatesSharedRolesPatchMany:
			NotificationChannelTemplates.notificationChannelTemplatesSharedRolesPatchMany,
	},
	notificationEvents: {
		notificationEventsList: NotificationEvents.notificationEventsList,
	},
	ocrJobResources: {
		ocrJobResourcesCreate: OcrJobResources.ocrJobResourcesCreate,
		ocrJobResourcesErrorReportList:
			OcrJobResources.ocrJobResourcesErrorReportList,
		ocrJobResourcesErrorReportPutMany:
			OcrJobResources.ocrJobResourcesErrorReportPutMany,
		ocrJobResourcesJobProgressList:
			OcrJobResources.ocrJobResourcesJobProgressList,
		ocrJobResourcesJobStatusList: OcrJobResources.ocrJobResourcesJobStatusList,
		ocrJobResourcesList: OcrJobResources.ocrJobResourcesList,
		ocrJobResourcesRetrieve: OcrJobResources.ocrJobResourcesRetrieve,
		ocrJobResourcesStartCreate: OcrJobResources.ocrJobResourcesStartCreate,
	},
	organizations: {
		organizationsJobsList: Organizations.organizationsJobsList,
		organizationsList: Organizations.organizationsList,
		organizationsRetrieve: Organizations.organizationsRetrieve,
		organizationsUsersCreate: Organizations.organizationsUsersCreate,
		organizationsUsersList: Organizations.organizationsUsersList,
		organizationsUsersPatch: Organizations.organizationsUsersPatch,
		organizationsUsersRetrieve: Organizations.organizationsUsersRetrieve,
	},
	otel: {
		otelLogsDeleteMany: Otel.otelLogsDeleteMany,
		otelLogsList: Otel.otelLogsList,
		otelLogsPodInfoList: Otel.otelLogsPodInfoList,
		otelMetricsAutocollectedValuesList: Otel.otelMetricsAutocollectedValuesList,
		otelMetricsConfigsCreate: Otel.otelMetricsConfigsCreate,
		otelMetricsConfigsDelete: Otel.otelMetricsConfigsDelete,
		otelMetricsConfigsList: Otel.otelMetricsConfigsList,
		otelMetricsConfigsPatch: Otel.otelMetricsConfigsPatch,
		otelMetricsConfigsPutMany: Otel.otelMetricsConfigsPutMany,
		otelMetricsConfigsRetrieve: Otel.otelMetricsConfigsRetrieve,
		otelMetricsConsumersList: Otel.otelMetricsConsumersList,
		otelMetricsDeleteMany: Otel.otelMetricsDeleteMany,
		otelMetricsPodInfoList: Otel.otelMetricsPodInfoList,
		otelMetricsSummaryList: Otel.otelMetricsSummaryList,
		otelMetricsValueOverTimeList: Otel.otelMetricsValueOverTimeList,
		otelMetricsValuesList: Otel.otelMetricsValuesList,
		otelMetricsValuesOverTimeList: Otel.otelMetricsValuesOverTimeList,
		otelMetricsValuesOverTimeSegmentsCreate:
			Otel.otelMetricsValuesOverTimeSegmentsCreate,
		otelMetricsValuesOverTimeSegmentsRetrieve:
			Otel.otelMetricsValuesOverTimeSegmentsRetrieve,
		otelMetricsValuesSegmentsRetrieve: Otel.otelMetricsValuesSegmentsRetrieve,
		otelStatsList: Otel.otelStatsList,
		otelTracesDeleteMany: Otel.otelTracesDeleteMany,
		tracingList: Otel.tracingList,
		tracingRetrieve: Otel.tracingRetrieve,
	},
	pinnedUsecases: {
		pinnedUsecasesList: PinnedUsecases.pinnedUsecasesList,
		pinnedUsecasesPatchMany: PinnedUsecases.pinnedUsecasesPatchMany,
	},
	predictionServers: {
		predictionServersList: PredictionServers.predictionServersList,
	},
	projects: {
		computedTrainingPredictionsList: Projects.computedTrainingPredictionsList,
		configureAndStartAutopilot: Projects.configureAndStartAutopilot,
		projectsAccessControlList: Projects.projectsAccessControlList,
		projectsAccessControlPatchMany: Projects.projectsAccessControlPatchMany,
		projectsAnomalyAssessmentRecordsDelete:
			Projects.projectsAnomalyAssessmentRecordsDelete,
		projectsAnomalyAssessmentRecordsExplanationsList:
			Projects.projectsAnomalyAssessmentRecordsExplanationsList,
		projectsAnomalyAssessmentRecordsList:
			Projects.projectsAnomalyAssessmentRecordsList,
		projectsAnomalyAssessmentRecordsPredictionsPreviewList:
			Projects.projectsAnomalyAssessmentRecordsPredictionsPreviewList,
		projectsAutopilotCreate: Projects.projectsAutopilotCreate,
		projectsAutopilotsCreate: Projects.projectsAutopilotsCreate,
		projectsBatchTypeTransformFeaturesCreate:
			Projects.projectsBatchTypeTransformFeaturesCreate,
		projectsBatchTypeTransformFeaturesResultRetrieve:
			Projects.projectsBatchTypeTransformFeaturesResultRetrieve,
		projectsBiasMitigatedModelsCreate:
			Projects.projectsBiasMitigatedModelsCreate,
		projectsBiasMitigatedModelsList: Projects.projectsBiasMitigatedModelsList,
		projectsBiasMitigationFeatureInfoCreateOne:
			Projects.projectsBiasMitigationFeatureInfoCreateOne,
		projectsBiasMitigationFeatureInfoList:
			Projects.projectsBiasMitigationFeatureInfoList,
		projectsBiasVsAccuracyInsightsList:
			Projects.projectsBiasVsAccuracyInsightsList,
		projectsBlenderModelsBlendCheckCreate:
			Projects.projectsBlenderModelsBlendCheckCreate,
		projectsBlenderModelsCreate: Projects.projectsBlenderModelsCreate,
		projectsBlenderModelsList: Projects.projectsBlenderModelsList,
		projectsBlenderModelsRetrieve: Projects.projectsBlenderModelsRetrieve,
		projectsBlueprintsBlueprintChartList:
			Projects.projectsBlueprintsBlueprintChartList,
		projectsBlueprintsBlueprintDocsList:
			Projects.projectsBlueprintsBlueprintDocsList,
		projectsBlueprintsJsonList: Projects.projectsBlueprintsJsonList,
		projectsBlueprintsList: Projects.projectsBlueprintsList,
		projectsBlueprintsRetrieve: Projects.projectsBlueprintsRetrieve,
		projectsCalendarEventsList: Projects.projectsCalendarEventsList,
		projectsCombinedModelsList: Projects.projectsCombinedModelsList,
		projectsCombinedModelsRetrieve: Projects.projectsCombinedModelsRetrieve,
		projectsCombinedModelsSegmentsDownloadList:
			Projects.projectsCombinedModelsSegmentsDownloadList,
		projectsCombinedModelsSegmentsList:
			Projects.projectsCombinedModelsSegmentsList,
		projectsCreate: Projects.projectsCreate,
		projectsCrossSeriesPropertiesCreate:
			Projects.projectsCrossSeriesPropertiesCreate,
		projectsDataSlicesList: Projects.projectsDataSlicesList,
		projectsDatetimeModelsAccuracyOverTimePlotsList:
			Projects.projectsDatetimeModelsAccuracyOverTimePlotsList,
		projectsDatetimeModelsAccuracyOverTimePlotsMetadataList:
			Projects.projectsDatetimeModelsAccuracyOverTimePlotsMetadataList,
		projectsDatetimeModelsAccuracyOverTimePlotsPreviewList:
			Projects.projectsDatetimeModelsAccuracyOverTimePlotsPreviewList,
		projectsDatetimeModelsAnomalyOverTimePlotsList:
			Projects.projectsDatetimeModelsAnomalyOverTimePlotsList,
		projectsDatetimeModelsAnomalyOverTimePlotsMetadataList:
			Projects.projectsDatetimeModelsAnomalyOverTimePlotsMetadataList,
		projectsDatetimeModelsAnomalyOverTimePlotsPreviewList:
			Projects.projectsDatetimeModelsAnomalyOverTimePlotsPreviewList,
		projectsDatetimeModelsBacktestStabilityPlotList:
			Projects.projectsDatetimeModelsBacktestStabilityPlotList,
		projectsDatetimeModelsBacktestsCreate:
			Projects.projectsDatetimeModelsBacktestsCreate,
		projectsDatetimeModelsCreate: Projects.projectsDatetimeModelsCreate,
		projectsDatetimeModelsDatasetAccuracyOverTimePlotsMetadataList:
			Projects.projectsDatetimeModelsDatasetAccuracyOverTimePlotsMetadataList,
		projectsDatetimeModelsDatasetAccuracyOverTimePlotsPreviewList:
			Projects.projectsDatetimeModelsDatasetAccuracyOverTimePlotsPreviewList,
		projectsDatetimeModelsDatasetAccuracyOverTimePlotsRetrieve:
			Projects.projectsDatetimeModelsDatasetAccuracyOverTimePlotsRetrieve,
		projectsDatetimeModelsDatetimeTrendPlotsCreate:
			Projects.projectsDatetimeModelsDatetimeTrendPlotsCreate,
		projectsDatetimeModelsFeatureEffectsCreate:
			Projects.projectsDatetimeModelsFeatureEffectsCreate,
		projectsDatetimeModelsFeatureEffectsList:
			Projects.projectsDatetimeModelsFeatureEffectsList,
		projectsDatetimeModelsFeatureEffectsMetadataList:
			Projects.projectsDatetimeModelsFeatureEffectsMetadataList,
		projectsDatetimeModelsForecastDistanceStabilityPlotList:
			Projects.projectsDatetimeModelsForecastDistanceStabilityPlotList,
		projectsDatetimeModelsForecastVsActualPlotsList:
			Projects.projectsDatetimeModelsForecastVsActualPlotsList,
		projectsDatetimeModelsForecastVsActualPlotsMetadataList:
			Projects.projectsDatetimeModelsForecastVsActualPlotsMetadataList,
		projectsDatetimeModelsForecastVsActualPlotsPreviewList:
			Projects.projectsDatetimeModelsForecastVsActualPlotsPreviewList,
		projectsDatetimeModelsFromModelCreate:
			Projects.projectsDatetimeModelsFromModelCreate,
		projectsDatetimeModelsList: Projects.projectsDatetimeModelsList,
		projectsDatetimeModelsMulticlassFeatureEffectsCreate:
			Projects.projectsDatetimeModelsMulticlassFeatureEffectsCreate,
		projectsDatetimeModelsMulticlassFeatureEffectsList:
			Projects.projectsDatetimeModelsMulticlassFeatureEffectsList,
		projectsDatetimeModelsMultiseriesHistogramsList:
			Projects.projectsDatetimeModelsMultiseriesHistogramsList,
		projectsDatetimeModelsMultiseriesScoresCreate:
			Projects.projectsDatetimeModelsMultiseriesScoresCreate,
		projectsDatetimeModelsMultiseriesScoresFileList:
			Projects.projectsDatetimeModelsMultiseriesScoresFileList,
		projectsDatetimeModelsMultiseriesScoresList:
			Projects.projectsDatetimeModelsMultiseriesScoresList,
		projectsDatetimeModelsRetrieve: Projects.projectsDatetimeModelsRetrieve,
		projectsDatetimePartitioningCreate:
			Projects.projectsDatetimePartitioningCreate,
		projectsDatetimePartitioningList: Projects.projectsDatetimePartitioningList,
		projectsDelete: Projects.projectsDelete,
		projectsDeploymentReadyModelsCreate:
			Projects.projectsDeploymentReadyModelsCreate,
		projectsDiscardedFeaturesList: Projects.projectsDiscardedFeaturesList,
		projectsDocumentPagesFileList: Projects.projectsDocumentPagesFileList,
		projectsDocumentTextExtractionSamplesList:
			Projects.projectsDocumentTextExtractionSamplesList,
		projectsDocumentThumbnailBinsList:
			Projects.projectsDocumentThumbnailBinsList,
		projectsDocumentThumbnailSamplesList:
			Projects.projectsDocumentThumbnailSamplesList,
		projectsDocumentThumbnailsList: Projects.projectsDocumentThumbnailsList,
		projectsDocumentsDataQualityLogFileList:
			Projects.projectsDocumentsDataQualityLogFileList,
		projectsDocumentsDataQualityLogList:
			Projects.projectsDocumentsDataQualityLogList,
		projectsDuplicateImagesList: Projects.projectsDuplicateImagesList,
		projectsEureqaDistributionPlotRetrieve:
			Projects.projectsEureqaDistributionPlotRetrieve,
		projectsEureqaModelDetailRetrieve:
			Projects.projectsEureqaModelDetailRetrieve,
		projectsEureqaModelsCreate: Projects.projectsEureqaModelsCreate,
		projectsEureqaModelsRetrieve: Projects.projectsEureqaModelsRetrieve,
		projectsExternalScoresCreate: Projects.projectsExternalScoresCreate,
		projectsExternalScoresList: Projects.projectsExternalScoresList,
		projectsExternalTimeSeriesBaselineDataValidationJobsCreate:
			Projects.projectsExternalTimeSeriesBaselineDataValidationJobsCreate,
		projectsExternalTimeSeriesBaselineDataValidationJobsRetrieve:
			Projects.projectsExternalTimeSeriesBaselineDataValidationJobsRetrieve,
		projectsFeatureAssociationFeaturelistsList:
			Projects.projectsFeatureAssociationFeaturelistsList,
		projectsFeatureAssociationMatrixCreate:
			Projects.projectsFeatureAssociationMatrixCreate,
		projectsFeatureAssociationMatrixDetailsList:
			Projects.projectsFeatureAssociationMatrixDetailsList,
		projectsFeatureAssociationMatrixList:
			Projects.projectsFeatureAssociationMatrixList,
		projectsFeatureDiscoveryDatasetDownloadList:
			Projects.projectsFeatureDiscoveryDatasetDownloadList,
		projectsFeatureDiscoveryLogsDownloadList:
			Projects.projectsFeatureDiscoveryLogsDownloadList,
		projectsFeatureDiscoveryLogsList: Projects.projectsFeatureDiscoveryLogsList,
		projectsFeatureDiscoveryRecipeSQLsDownloadList:
			Projects.projectsFeatureDiscoveryRecipeSQLsDownloadList,
		projectsFeatureDiscoveryRecipeSqlExportsCreate:
			Projects.projectsFeatureDiscoveryRecipeSqlExportsCreate,
		projectsFeatureHistogramsRetrieve:
			Projects.projectsFeatureHistogramsRetrieve,
		projectsFeatureLineagesRetrieve: Projects.projectsFeatureLineagesRetrieve,
		projectsFeaturelistsCreate: Projects.projectsFeaturelistsCreate,
		projectsFeaturelistsDelete: Projects.projectsFeaturelistsDelete,
		projectsFeaturelistsList: Projects.projectsFeaturelistsList,
		projectsFeaturelistsPatch: Projects.projectsFeaturelistsPatch,
		projectsFeaturelistsRetrieve: Projects.projectsFeaturelistsRetrieve,
		projectsFeaturesFrequentValuesList:
			Projects.projectsFeaturesFrequentValuesList,
		projectsFeaturesList: Projects.projectsFeaturesList,
		projectsFeaturesMetricsList: Projects.projectsFeaturesMetricsList,
		projectsFeaturesMultiseriesPropertiesList:
			Projects.projectsFeaturesMultiseriesPropertiesList,
		projectsFeaturesRetrieve: Projects.projectsFeaturesRetrieve,
		projectsFrozenDatetimeModelsCreate:
			Projects.projectsFrozenDatetimeModelsCreate,
		projectsFrozenModelsCreate: Projects.projectsFrozenModelsCreate,
		projectsFrozenModelsList: Projects.projectsFrozenModelsList,
		projectsFrozenModelsRetrieve: Projects.projectsFrozenModelsRetrieve,
		projectsGeometryFeaturePlotsCreate:
			Projects.projectsGeometryFeaturePlotsCreate,
		projectsGeometryFeaturePlotsRetrieve:
			Projects.projectsGeometryFeaturePlotsRetrieve,
		projectsImageActivationMapsList: Projects.projectsImageActivationMapsList,
		projectsImageBinsList: Projects.projectsImageBinsList,
		projectsImageEmbeddingsList: Projects.projectsImageEmbeddingsList,
		projectsImageSamplesList: Projects.projectsImageSamplesList,
		projectsImagesDataQualityLogFileList:
			Projects.projectsImagesDataQualityLogFileList,
		projectsImagesDataQualityLogList: Projects.projectsImagesDataQualityLogList,
		projectsImagesFileList: Projects.projectsImagesFileList,
		projectsImagesList: Projects.projectsImagesList,
		projectsImagesRetrieve: Projects.projectsImagesRetrieve,
		projectsIncrementalLearningModelsFromModelCreate:
			Projects.projectsIncrementalLearningModelsFromModelCreate,
		projectsJobsDelete: Projects.projectsJobsDelete,
		projectsJobsList: Projects.projectsJobsList,
		projectsJobsRetrieve: Projects.projectsJobsRetrieve,
		projectsList: Projects.projectsList,
		projectsModelJobsDelete: Projects.projectsModelJobsDelete,
		projectsModelJobsList: Projects.projectsModelJobsList,
		projectsModelJobsRetrieve: Projects.projectsModelJobsRetrieve,
		projectsModelRecordsList: Projects.projectsModelRecordsList,
		projectsModelingFeaturelistsCreate:
			Projects.projectsModelingFeaturelistsCreate,
		projectsModelingFeaturelistsDelete:
			Projects.projectsModelingFeaturelistsDelete,
		projectsModelingFeaturelistsList: Projects.projectsModelingFeaturelistsList,
		projectsModelingFeaturelistsPatch:
			Projects.projectsModelingFeaturelistsPatch,
		projectsModelingFeaturelistsRetrieve:
			Projects.projectsModelingFeaturelistsRetrieve,
		projectsModelingFeaturesFromDiscardedFeaturesCreate:
			Projects.projectsModelingFeaturesFromDiscardedFeaturesCreate,
		projectsModelingFeaturesList: Projects.projectsModelingFeaturesList,
		projectsModelingFeaturesRetrieve: Projects.projectsModelingFeaturesRetrieve,
		projectsModelsAdvancedTuningCreate:
			Projects.projectsModelsAdvancedTuningCreate,
		projectsModelsAdvancedTuningParametersList:
			Projects.projectsModelsAdvancedTuningParametersList,
		projectsModelsAnomalyAssessmentInitializationCreate:
			Projects.projectsModelsAnomalyAssessmentInitializationCreate,
		projectsModelsAnomalyInsightsFileList:
			Projects.projectsModelsAnomalyInsightsFileList,
		projectsModelsAnomalyInsightsTableList:
			Projects.projectsModelsAnomalyInsightsTableList,
		projectsModelsBlueprintChartList: Projects.projectsModelsBlueprintChartList,
		projectsModelsBlueprintDocsList: Projects.projectsModelsBlueprintDocsList,
		projectsModelsClusterInsightsCreate:
			Projects.projectsModelsClusterInsightsCreate,
		projectsModelsClusterInsightsDownloadList:
			Projects.projectsModelsClusterInsightsDownloadList,
		projectsModelsClusterInsightsList:
			Projects.projectsModelsClusterInsightsList,
		projectsModelsClusterNamesList: Projects.projectsModelsClusterNamesList,
		projectsModelsClusterNamesPatchMany:
			Projects.projectsModelsClusterNamesPatchMany,
		projectsModelsConfusionChartsClassDetailsList:
			Projects.projectsModelsConfusionChartsClassDetailsList,
		projectsModelsConfusionChartsList:
			Projects.projectsModelsConfusionChartsList,
		projectsModelsConfusionChartsMetadataList:
			Projects.projectsModelsConfusionChartsMetadataList,
		projectsModelsConfusionChartsRetrieve:
			Projects.projectsModelsConfusionChartsRetrieve,
		projectsModelsCreate: Projects.projectsModelsCreate,
		projectsModelsCrossClassAccuracyScoresCreate:
			Projects.projectsModelsCrossClassAccuracyScoresCreate,
		projectsModelsCrossClassAccuracyScoresList:
			Projects.projectsModelsCrossClassAccuracyScoresList,
		projectsModelsCrossValidationCreate:
			Projects.projectsModelsCrossValidationCreate,
		projectsModelsCrossValidationScoresList:
			Projects.projectsModelsCrossValidationScoresList,
		projectsModelsDataDisparityInsightsCreate:
			Projects.projectsModelsDataDisparityInsightsCreate,
		projectsModelsDataDisparityInsightsList:
			Projects.projectsModelsDataDisparityInsightsList,
		projectsModelsDatasetConfusionChartsClassDetailsList:
			Projects.projectsModelsDatasetConfusionChartsClassDetailsList,
		projectsModelsDatasetConfusionChartsList:
			Projects.projectsModelsDatasetConfusionChartsList,
		projectsModelsDatasetConfusionChartsMetadataList:
			Projects.projectsModelsDatasetConfusionChartsMetadataList,
		projectsModelsDatasetConfusionChartsRetrieve:
			Projects.projectsModelsDatasetConfusionChartsRetrieve,
		projectsModelsDatasetLiftChartsList:
			Projects.projectsModelsDatasetLiftChartsList,
		projectsModelsDatasetMulticlassLiftChartsList:
			Projects.projectsModelsDatasetMulticlassLiftChartsList,
		projectsModelsDatasetResidualsChartsList:
			Projects.projectsModelsDatasetResidualsChartsList,
		projectsModelsDatasetRocCurvesList:
			Projects.projectsModelsDatasetRocCurvesList,
		projectsModelsDelete: Projects.projectsModelsDelete,
		projectsModelsFairnessInsightsCreate:
			Projects.projectsModelsFairnessInsightsCreate,
		projectsModelsFairnessInsightsList:
			Projects.projectsModelsFairnessInsightsList,
		projectsModelsFeatureEffectsCreate:
			Projects.projectsModelsFeatureEffectsCreate,
		projectsModelsFeatureEffectsList: Projects.projectsModelsFeatureEffectsList,
		projectsModelsFeatureEffectsMetadataList:
			Projects.projectsModelsFeatureEffectsMetadataList,
		projectsModelsFeatureImpactCreate:
			Projects.projectsModelsFeatureImpactCreate,
		projectsModelsFeatureImpactList: Projects.projectsModelsFeatureImpactList,
		projectsModelsFeatureListsClusterInsightsList:
			Projects.projectsModelsFeatureListsClusterInsightsList,
		projectsModelsFeaturesList: Projects.projectsModelsFeaturesList,
		projectsModelsFromModelCreate: Projects.projectsModelsFromModelCreate,
		projectsModelsGridSearchScoresList:
			Projects.projectsModelsGridSearchScoresList,
		projectsModelsImageActivationMapsCreate:
			Projects.projectsModelsImageActivationMapsCreate,
		projectsModelsImageActivationMapsList:
			Projects.projectsModelsImageActivationMapsList,
		projectsModelsImageEmbeddingsCreate:
			Projects.projectsModelsImageEmbeddingsCreate,
		projectsModelsImageEmbeddingsList:
			Projects.projectsModelsImageEmbeddingsList,
		projectsModelsLabelwiseRocCurvesList:
			Projects.projectsModelsLabelwiseRocCurvesList,
		projectsModelsLiftChartList: Projects.projectsModelsLiftChartList,
		projectsModelsLiftChartRetrieve: Projects.projectsModelsLiftChartRetrieve,
		projectsModelsList: Projects.projectsModelsList,
		projectsModelsLogsList: Projects.projectsModelsLogsList,
		projectsModelsMissingReportList: Projects.projectsModelsMissingReportList,
		projectsModelsMulticlassFeatureEffectsCreate:
			Projects.projectsModelsMulticlassFeatureEffectsCreate,
		projectsModelsMulticlassFeatureEffectsList:
			Projects.projectsModelsMulticlassFeatureEffectsList,
		projectsModelsMulticlassFeatureImpactList:
			Projects.projectsModelsMulticlassFeatureImpactList,
		projectsModelsMulticlassLiftChartList:
			Projects.projectsModelsMulticlassLiftChartList,
		projectsModelsMulticlassLiftChartRetrieve:
			Projects.projectsModelsMulticlassLiftChartRetrieve,
		projectsModelsMultilabelLiftChartsRetrieve:
			Projects.projectsModelsMultilabelLiftChartsRetrieve,
		projectsModelsNumIterationsTrainedList:
			Projects.projectsModelsNumIterationsTrainedList,
		projectsModelsParametersList: Projects.projectsModelsParametersList,
		projectsModelsPatch: Projects.projectsModelsPatch,
		projectsModelsPredictionExplanationsInitializationCreate:
			Projects.projectsModelsPredictionExplanationsInitializationCreate,
		projectsModelsPredictionExplanationsInitializationDeleteMany:
			Projects.projectsModelsPredictionExplanationsInitializationDeleteMany,
		projectsModelsPredictionExplanationsInitializationList:
			Projects.projectsModelsPredictionExplanationsInitializationList,
		projectsModelsPredictionIntervalsCreate:
			Projects.projectsModelsPredictionIntervalsCreate,
		projectsModelsPredictionIntervalsList:
			Projects.projectsModelsPredictionIntervalsList,
		projectsModelsPrimeInfoList: Projects.projectsModelsPrimeInfoList,
		projectsModelsPrimeRulesetsCreate:
			Projects.projectsModelsPrimeRulesetsCreate,
		projectsModelsPrimeRulesetsList: Projects.projectsModelsPrimeRulesetsList,
		projectsModelsResidualsList: Projects.projectsModelsResidualsList,
		projectsModelsResidualsRetrieve: Projects.projectsModelsResidualsRetrieve,
		projectsModelsRetrieve: Projects.projectsModelsRetrieve,
		projectsModelsRocCurveList: Projects.projectsModelsRocCurveList,
		projectsModelsRocCurveRetrieve: Projects.projectsModelsRocCurveRetrieve,
		projectsModelsScoringCodeList: Projects.projectsModelsScoringCodeList,
		projectsModelsShapImpactCreate: Projects.projectsModelsShapImpactCreate,
		projectsModelsShapImpactList: Projects.projectsModelsShapImpactList,
		projectsModelsSupportedCapabilitiesList:
			Projects.projectsModelsSupportedCapabilitiesList,
		projectsModelsTrainingArtifactList:
			Projects.projectsModelsTrainingArtifactList,
		projectsModelsWordCloudList: Projects.projectsModelsWordCloudList,
		projectsMulticategoricalInvalidFormatFileList:
			Projects.projectsMulticategoricalInvalidFormatFileList,
		projectsMulticategoricalInvalidFormatList:
			Projects.projectsMulticategoricalInvalidFormatList,
		projectsMultiseriesIdsCrossSeriesPropertiesList:
			Projects.projectsMultiseriesIdsCrossSeriesPropertiesList,
		projectsMultiseriesNamesList: Projects.projectsMultiseriesNamesList,
		projectsMultiseriesPropertiesCreate:
			Projects.projectsMultiseriesPropertiesCreate,
		projectsOptimizedDatetimePartitioningsCreate:
			Projects.projectsOptimizedDatetimePartitioningsCreate,
		projectsOptimizedDatetimePartitioningsDatetimePartitioningInputList:
			Projects.projectsOptimizedDatetimePartitioningsDatetimePartitioningInputList,
		projectsOptimizedDatetimePartitioningsDatetimePartitioningLogFileList:
			Projects.projectsOptimizedDatetimePartitioningsDatetimePartitioningLogFileList,
		projectsOptimizedDatetimePartitioningsDatetimePartitioningLogList:
			Projects.projectsOptimizedDatetimePartitioningsDatetimePartitioningLogList,
		projectsOptimizedDatetimePartitioningsList:
			Projects.projectsOptimizedDatetimePartitioningsList,
		projectsOptimizedDatetimePartitioningsRetrieve:
			Projects.projectsOptimizedDatetimePartitioningsRetrieve,
		projectsPatch: Projects.projectsPatch,
		projectsPayoffMatricesCreate: Projects.projectsPayoffMatricesCreate,
		projectsPayoffMatricesDelete: Projects.projectsPayoffMatricesDelete,
		projectsPayoffMatricesList: Projects.projectsPayoffMatricesList,
		projectsPayoffMatricesPut: Projects.projectsPayoffMatricesPut,
		projectsPredictJobsDelete: Projects.projectsPredictJobsDelete,
		projectsPredictJobsList: Projects.projectsPredictJobsList,
		projectsPredictJobsRetrieve: Projects.projectsPredictJobsRetrieve,
		projectsPredictionDatasetsDataSourceUploadsCreate:
			Projects.projectsPredictionDatasetsDataSourceUploadsCreate,
		projectsPredictionDatasetsDatasetUploadsCreate:
			Projects.projectsPredictionDatasetsDatasetUploadsCreate,
		projectsPredictionDatasetsDelete: Projects.projectsPredictionDatasetsDelete,
		projectsPredictionDatasetsFileUploadsCreate:
			Projects.projectsPredictionDatasetsFileUploadsCreate,
		projectsPredictionDatasetsList: Projects.projectsPredictionDatasetsList,
		projectsPredictionDatasetsRetrieve:
			Projects.projectsPredictionDatasetsRetrieve,
		projectsPredictionDatasetsUrlUploadsCreate:
			Projects.projectsPredictionDatasetsUrlUploadsCreate,
		projectsPredictionExplanationsCreate:
			Projects.projectsPredictionExplanationsCreate,
		projectsPredictionExplanationsList:
			Projects.projectsPredictionExplanationsList,
		projectsPredictionExplanationsRecordsDelete:
			Projects.projectsPredictionExplanationsRecordsDelete,
		projectsPredictionExplanationsRecordsList:
			Projects.projectsPredictionExplanationsRecordsList,
		projectsPredictionExplanationsRecordsRetrieve:
			Projects.projectsPredictionExplanationsRecordsRetrieve,
		projectsPredictionsCreate: Projects.projectsPredictionsCreate,
		projectsPredictionsList: Projects.projectsPredictionsList,
		projectsPredictionsMetadataList: Projects.projectsPredictionsMetadataList,
		projectsPredictionsMetadataRetrieve:
			Projects.projectsPredictionsMetadataRetrieve,
		projectsPredictionsRetrieve: Projects.projectsPredictionsRetrieve,
		projectsPrimeFilesCreate: Projects.projectsPrimeFilesCreate,
		projectsPrimeFilesDownloadList: Projects.projectsPrimeFilesDownloadList,
		projectsPrimeFilesList: Projects.projectsPrimeFilesList,
		projectsPrimeFilesRetrieve: Projects.projectsPrimeFilesRetrieve,
		projectsPrimeModelsCreate: Projects.projectsPrimeModelsCreate,
		projectsPrimeModelsList: Projects.projectsPrimeModelsList,
		projectsPrimeModelsRetrieve: Projects.projectsPrimeModelsRetrieve,
		projectsRatingTableModelsCreate: Projects.projectsRatingTableModelsCreate,
		projectsRatingTableModelsList: Projects.projectsRatingTableModelsList,
		projectsRatingTableModelsRetrieve:
			Projects.projectsRatingTableModelsRetrieve,
		projectsRatingTablesCreate: Projects.projectsRatingTablesCreate,
		projectsRatingTablesFileList: Projects.projectsRatingTablesFileList,
		projectsRatingTablesList: Projects.projectsRatingTablesList,
		projectsRatingTablesPatch: Projects.projectsRatingTablesPatch,
		projectsRatingTablesRetrieve: Projects.projectsRatingTablesRetrieve,
		projectsRecommendedModelsList: Projects.projectsRecommendedModelsList,
		projectsRecommendedModelsRecommendedModelList:
			Projects.projectsRecommendedModelsRecommendedModelList,
		projectsRelationshipQualityAssessmentsCreate:
			Projects.projectsRelationshipQualityAssessmentsCreate,
		projectsRelationshipsConfigurationList:
			Projects.projectsRelationshipsConfigurationList,
		projectsRetrieve: Projects.projectsRetrieve,
		projectsRuleFitFilesCreate: Projects.projectsRuleFitFilesCreate,
		projectsRuleFitFilesDownloadList: Projects.projectsRuleFitFilesDownloadList,
		projectsRuleFitFilesList: Projects.projectsRuleFitFilesList,
		projectsRuleFitFilesRetrieve: Projects.projectsRuleFitFilesRetrieve,
		projectsSecondaryDatasetsConfigurationsCreate:
			Projects.projectsSecondaryDatasetsConfigurationsCreate,
		projectsSecondaryDatasetsConfigurationsDelete:
			Projects.projectsSecondaryDatasetsConfigurationsDelete,
		projectsSecondaryDatasetsConfigurationsList:
			Projects.projectsSecondaryDatasetsConfigurationsList,
		projectsSecondaryDatasetsConfigurationsRetrieve:
			Projects.projectsSecondaryDatasetsConfigurationsRetrieve,
		projectsSegmentChampionPutMany: Projects.projectsSegmentChampionPutMany,
		projectsSegmentationTaskJobResultsRetrieve:
			Projects.projectsSegmentationTaskJobResultsRetrieve,
		projectsSegmentationTasksCreate: Projects.projectsSegmentationTasksCreate,
		projectsSegmentationTasksList: Projects.projectsSegmentationTasksList,
		projectsSegmentationTasksMappingsList:
			Projects.projectsSegmentationTasksMappingsList,
		projectsSegmentationTasksRetrieve:
			Projects.projectsSegmentationTasksRetrieve,
		projectsSegmentsPatch: Projects.projectsSegmentsPatch,
		projectsShapMatricesCreate: Projects.projectsShapMatricesCreate,
		projectsShapMatricesList: Projects.projectsShapMatricesList,
		projectsShapMatricesRetrieve: Projects.projectsShapMatricesRetrieve,
		projectsStatusList: Projects.projectsStatusList,
		projectsTimeSeriesFeatureLogFileList:
			Projects.projectsTimeSeriesFeatureLogFileList,
		projectsTimeSeriesFeatureLogList: Projects.projectsTimeSeriesFeatureLogList,
		projectsTrainingPredictionsCreate:
			Projects.projectsTrainingPredictionsCreate,
		projectsTypeTransformFeaturesCreate:
			Projects.projectsTypeTransformFeaturesCreate,
		trainingPredictionsList: Projects.trainingPredictionsList,
	},
	quotaTemplates: {
		quotaTemplatesList: QuotaTemplates.quotaTemplatesList,
		quotaTemplatesRetrieve: QuotaTemplates.quotaTemplatesRetrieve,
	},
	quotas: {
		quotasCreate: Quotas.quotasCreate,
		quotasDelete: Quotas.quotasDelete,
		quotasList: Quotas.quotasList,
		quotasPatch: Quotas.quotasPatch,
		quotasRetrieve: Quotas.quotasRetrieve,
	},
	recipes: {
		recipesDelete: Recipes.recipesDelete,
		recipesDownsamplingPutMany: Recipes.recipesDownsamplingPutMany,
		recipesFromDataStoreCreate: Recipes.recipesFromDataStoreCreate,
		recipesFromDatasetCreate: Recipes.recipesFromDatasetCreate,
		recipesFromRecipeCreate: Recipes.recipesFromRecipeCreate,
		recipesInputsList: Recipes.recipesInputsList,
		recipesInputsPutMany: Recipes.recipesInputsPutMany,
		recipesInsightsList: Recipes.recipesInsightsList,
		recipesList: Recipes.recipesList,
		recipesOperationsPutMany: Recipes.recipesOperationsPutMany,
		recipesOperationsRetrieve: Recipes.recipesOperationsRetrieve,
		recipesPatch: Recipes.recipesPatch,
		recipesPreviewCreate: Recipes.recipesPreviewCreate,
		recipesPreviewList: Recipes.recipesPreviewList,
		recipesRelationshipQualityAssessmentsCreate:
			Recipes.recipesRelationshipQualityAssessmentsCreate,
		recipesRetrieve: Recipes.recipesRetrieve,
		recipesSettingsPatchMany: Recipes.recipesSettingsPatchMany,
		recipesSqlCreate: Recipes.recipesSqlCreate,
		recipesTimeseriesTransformationPlansCreate:
			Recipes.recipesTimeseriesTransformationPlansCreate,
		recipesTimeseriesTransformationPlansRetrieve:
			Recipes.recipesTimeseriesTransformationPlansRetrieve,
	},
	registeredModels: {
		registeredModelsDelete: RegisteredModels.registeredModelsDelete,
		registeredModelsDeploymentsList:
			RegisteredModels.registeredModelsDeploymentsList,
		registeredModelsList: RegisteredModels.registeredModelsList,
		registeredModelsPatch: RegisteredModels.registeredModelsPatch,
		registeredModelsRetrieve: RegisteredModels.registeredModelsRetrieve,
		registeredModelsSharedRolesList:
			RegisteredModels.registeredModelsSharedRolesList,
		registeredModelsSharedRolesPatchMany:
			RegisteredModels.registeredModelsSharedRolesPatchMany,
		registeredModelsVersionsDeploymentsList:
			RegisteredModels.registeredModelsVersionsDeploymentsList,
		registeredModelsVersionsList: RegisteredModels.registeredModelsVersionsList,
		registeredModelsVersionsRetrieve:
			RegisteredModels.registeredModelsVersionsRetrieve,
	},
	relationshipsConfigurations: {
		relationshipsConfigurationsCreate:
			RelationshipsConfigurations.relationshipsConfigurationsCreate,
		relationshipsConfigurationsDelete:
			RelationshipsConfigurations.relationshipsConfigurationsDelete,
		relationshipsConfigurationsPut:
			RelationshipsConfigurations.relationshipsConfigurationsPut,
		relationshipsConfigurationsRetrieve:
			RelationshipsConfigurations.relationshipsConfigurationsRetrieve,
		relationshipsConfigurationsRetrieveExtended:
			RelationshipsConfigurations.relationshipsConfigurationsRetrieveExtended,
	},
	remoteEvents: {
		remoteEventsCreate: RemoteEvents.remoteEventsCreate,
	},
	scheduledJobs: {
		scheduledJobsList: ScheduledJobs.scheduledJobsList,
	},
	seatLicenseAllocations: {
		seatLicenseAllocationsCreate:
			SeatLicenseAllocations.seatLicenseAllocationsCreate,
		seatLicenseAllocationsDelete:
			SeatLicenseAllocations.seatLicenseAllocationsDelete,
		seatLicenseAllocationsEvaluateCreate:
			SeatLicenseAllocations.seatLicenseAllocationsEvaluateCreate,
		seatLicenseAllocationsList:
			SeatLicenseAllocations.seatLicenseAllocationsList,
		seatLicenseAllocationsPatch:
			SeatLicenseAllocations.seatLicenseAllocationsPatch,
		seatLicenseAllocationsRetrieve:
			SeatLicenseAllocations.seatLicenseAllocationsRetrieve,
	},
	secureConfigs: {
		secureConfigsCreate: SecureConfigs.secureConfigsCreate,
		secureConfigsDelete: SecureConfigs.secureConfigsDelete,
		secureConfigsList: SecureConfigs.secureConfigsList,
		secureConfigsPatch: SecureConfigs.secureConfigsPatch,
		secureConfigsRetrieve: SecureConfigs.secureConfigsRetrieve,
		secureConfigsSharedRolesList: SecureConfigs.secureConfigsSharedRolesList,
		secureConfigsSharedRolesPatchMany:
			SecureConfigs.secureConfigsSharedRolesPatchMany,
		secureConfigsValuesList: SecureConfigs.secureConfigsValuesList,
	},
	sparkSessions: {
		sparkSessionsDeleteMany: SparkSessions.sparkSessionsDeleteMany,
	},
	status: {
		statusDelete: Status.statusDelete,
		statusList: Status.statusList,
		statusRetrieve: Status.statusRetrieve,
	},
	stringEncryptions: {
		stringEncryptionsCreate: StringEncryptions.stringEncryptionsCreate,
	},
	tenantUsageResources: {
		tenantUsageResourcesActiveTenantsList:
			TenantUsageResources.tenantUsageResourcesActiveTenantsList,
		tenantUsageResourcesActiveUsersList:
			TenantUsageResources.tenantUsageResourcesActiveUsersList,
		tenantUsageResourcesCategoriesList:
			TenantUsageResources.tenantUsageResourcesCategoriesList,
		tenantUsageResourcesDeploymentsList:
			TenantUsageResources.tenantUsageResourcesDeploymentsList,
		tenantUsageResourcesExportList:
			TenantUsageResources.tenantUsageResourcesExportList,
		tenantUsageResourcesList: TenantUsageResources.tenantUsageResourcesList,
		tenantUsageResourcesUsageOverTimeList:
			TenantUsageResources.tenantUsageResourcesUsageOverTimeList,
	},
	tenants: {
		tenantsActiveUsersList: Tenants.tenantsActiveUsersList,
		tenantsResourceCategoriesList: Tenants.tenantsResourceCategoriesList,
		tenantsUsageExportList: Tenants.tenantsUsageExportList,
		tenantsUsageList: Tenants.tenantsUsageList,
		tenantsUtilizationResourcesExportList:
			Tenants.tenantsUtilizationResourcesExportList,
		tenantsUtilizationResourcesList: Tenants.tenantsUtilizationResourcesList,
		tenantsUtilizationResourcesRetrieve:
			Tenants.tenantsUtilizationResourcesRetrieve,
	},
	usageDataExports: {
		usageDataExportsCreate: UsageDataExports.usageDataExportsCreate,
		usageDataExportsRetrieve: UsageDataExports.usageDataExportsRetrieve,
		usageDataExportsSupportedEventsList:
			UsageDataExports.usageDataExportsSupportedEventsList,
	},
	useCases: {
		useCasesAllNotebooks: UseCases.useCasesAllNotebooks,
		useCasesAllResourcesList: UseCases.useCasesAllResourcesList,
		useCasesApplicationsList: UseCases.useCasesApplicationsList,
		useCasesCreate: UseCases.useCasesCreate,
		useCasesCreateOne: UseCases.useCasesCreateOne,
		useCasesCustomApplicationsList: UseCases.useCasesCustomApplicationsList,
		useCasesDataList: UseCases.useCasesDataList,
		useCasesDatasetsList: UseCases.useCasesDatasetsList,
		useCasesDatasetsRetrieve: UseCases.useCasesDatasetsRetrieve,
		useCasesDelete: UseCases.useCasesDelete,
		useCasesDeploymentsList: UseCases.useCasesDeploymentsList,
		useCasesFilesList: UseCases.useCasesFilesList,
		useCasesFilesRetrieve: UseCases.useCasesFilesRetrieve,
		useCasesFilterMetadataList: UseCases.useCasesFilterMetadataList,
		useCasesList: UseCases.useCasesList,
		useCasesModelsForComparisonList: UseCases.useCasesModelsForComparisonList,
		useCasesMultilinkCreate: UseCases.useCasesMultilinkCreate,
		useCasesNotebooksList: UseCases.useCasesNotebooksList,
		useCasesPatch: UseCases.useCasesPatch,
		useCasesPlaygroundsList: UseCases.useCasesPlaygroundsList,
		useCasesProjectsList: UseCases.useCasesProjectsList,
		useCasesReferenceDelete: UseCases.useCasesReferenceDelete,
		useCasesReferenceMove: UseCases.useCasesReferenceMove,
		useCasesRegisteredModelsList: UseCases.useCasesRegisteredModelsList,
		useCasesResourcesList: UseCases.useCasesResourcesList,
		useCasesRetrieve: UseCases.useCasesRetrieve,
		useCasesSharedRolesList: UseCases.useCasesSharedRolesList,
		useCasesSharedRolesPatchMany: UseCases.useCasesSharedRolesPatchMany,
		useCasesVectorDatabasesList: UseCases.useCasesVectorDatabasesList,
		useCasesVectorDatabasesRelatedCustomModelsList:
			UseCases.useCasesVectorDatabasesRelatedCustomModelsList,
		useCasesVectorDatabasesRelatedDeploymentsList:
			UseCases.useCasesVectorDatabasesRelatedDeploymentsList,
		useCasesVectorDatabasesRelatedRegisteredModelsList:
			UseCases.useCasesVectorDatabasesRelatedRegisteredModelsList,
	},
	useCasesWithShortenedInfo: {
		useCasesWithShortenedInfoList:
			UseCasesWithShortenedInfo.useCasesWithShortenedInfoList,
	},
	userBlueprints: {
		userBlueprintsCreate: UserBlueprints.userBlueprintsCreate,
		userBlueprintsDelete: UserBlueprints.userBlueprintsDelete,
		userBlueprintsDeleteMany: UserBlueprints.userBlueprintsDeleteMany,
		userBlueprintsFromBlueprintIdCreate:
			UserBlueprints.userBlueprintsFromBlueprintIdCreate,
		userBlueprintsFromCustomTaskVersionIdCreate:
			UserBlueprints.userBlueprintsFromCustomTaskVersionIdCreate,
		userBlueprintsFromUserBlueprintIdCreate:
			UserBlueprints.userBlueprintsFromUserBlueprintIdCreate,
		userBlueprintsList: UserBlueprints.userBlueprintsList,
		userBlueprintsPatch: UserBlueprints.userBlueprintsPatch,
		userBlueprintsRetrieve: UserBlueprints.userBlueprintsRetrieve,
		userBlueprintsSharedRolesList: UserBlueprints.userBlueprintsSharedRolesList,
		userBlueprintsSharedRolesPatchMany:
			UserBlueprints.userBlueprintsSharedRolesPatchMany,
	},
	userNotifications: {
		userNotificationsDelete: UserNotifications.userNotificationsDelete,
		userNotificationsDeleteMany: UserNotifications.userNotificationsDeleteMany,
		userNotificationsList: UserNotifications.userNotificationsList,
		userNotificationsPatch: UserNotifications.userNotificationsPatch,
		userNotificationsPatchMany: UserNotifications.userNotificationsPatchMany,
	},
	users: {
		usersCreate: Users.usersCreate,
		usersInviteCreate: Users.usersInviteCreate,
		usersList: Users.usersList,
		usersRateLimitUsageDelete: Users.usersRateLimitUsageDelete,
		usersRateLimitUsageDeleteMany: Users.usersRateLimitUsageDeleteMany,
		usersRateLimitUsageList: Users.usersRateLimitUsageList,
		usersRetrieve: Users.usersRetrieve,
	},
	valueTrackers: {
		valueTrackersActivitiesList: ValueTrackers.valueTrackersActivitiesList,
		valueTrackersAttachmentsCreate:
			ValueTrackers.valueTrackersAttachmentsCreate,
		valueTrackersAttachmentsDelete:
			ValueTrackers.valueTrackersAttachmentsDelete,
		valueTrackersAttachmentsList: ValueTrackers.valueTrackersAttachmentsList,
		valueTrackersAttachmentsRetrieve:
			ValueTrackers.valueTrackersAttachmentsRetrieve,
		valueTrackersCreate: ValueTrackers.valueTrackersCreate,
		valueTrackersDelete: ValueTrackers.valueTrackersDelete,
		valueTrackersList: ValueTrackers.valueTrackersList,
		valueTrackersPatch: ValueTrackers.valueTrackersPatch,
		valueTrackersRealizedValueOverTimeList:
			ValueTrackers.valueTrackersRealizedValueOverTimeList,
		valueTrackersRetrieve: ValueTrackers.valueTrackersRetrieve,
		valueTrackersSharedRolesList: ValueTrackers.valueTrackersSharedRolesList,
		valueTrackersSharedRolesPatchMany:
			ValueTrackers.valueTrackersSharedRolesPatchMany,
	},
	version: {
		versionList: Version.versionList,
	},
} as const;

export const datarobotEndpointSchemas = {
	'accessRoles.accessRolesCreate': {
		input: DatarobotEndpointInputSchemas.accessRolesCreate,
		output: DatarobotEndpointOutputSchemas.accessRolesCreate,
	},
	'accessRoles.accessRolesDelete': {
		input: DatarobotEndpointInputSchemas.accessRolesDelete,
		output: DatarobotEndpointOutputSchemas.accessRolesDelete,
	},
	'accessRoles.accessRolesList': {
		input: DatarobotEndpointInputSchemas.accessRolesList,
		output: DatarobotEndpointOutputSchemas.accessRolesList,
	},
	'accessRoles.accessRolesPatch': {
		input: DatarobotEndpointInputSchemas.accessRolesPatch,
		output: DatarobotEndpointOutputSchemas.accessRolesPatch,
	},
	'accessRoles.accessRolesRetrieve': {
		input: DatarobotEndpointInputSchemas.accessRolesRetrieve,
		output: DatarobotEndpointOutputSchemas.accessRolesRetrieve,
	},
	'accessRoles.accessRolesUsersList': {
		input: DatarobotEndpointInputSchemas.accessRolesUsersList,
		output: DatarobotEndpointOutputSchemas.accessRolesUsersList,
	},
	'account.accountRateLimitUsageList': {
		input: DatarobotEndpointInputSchemas.accountRateLimitUsageList,
		output: DatarobotEndpointOutputSchemas.accountRateLimitUsageList,
	},
	'applicationTemplates.applicationTemplatesCloneCreate': {
		input: DatarobotEndpointInputSchemas.applicationTemplatesCloneCreate,
		output: DatarobotEndpointOutputSchemas.applicationTemplatesCloneCreate,
	},
	'applicationTemplates.applicationTemplatesCreate': {
		input: DatarobotEndpointInputSchemas.applicationTemplatesCreate,
		output: DatarobotEndpointOutputSchemas.applicationTemplatesCreate,
	},
	'applicationTemplates.applicationTemplatesDelete': {
		input: DatarobotEndpointInputSchemas.applicationTemplatesDelete,
		output: DatarobotEndpointOutputSchemas.applicationTemplatesDelete,
	},
	'applicationTemplates.applicationTemplatesList': {
		input: DatarobotEndpointInputSchemas.applicationTemplatesList,
		output: DatarobotEndpointOutputSchemas.applicationTemplatesList,
	},
	'applicationTemplates.applicationTemplatesMediaCreate': {
		input: DatarobotEndpointInputSchemas.applicationTemplatesMediaCreate,
		output: DatarobotEndpointOutputSchemas.applicationTemplatesMediaCreate,
	},
	'applicationTemplates.applicationTemplatesMediaDeleteMany': {
		input: DatarobotEndpointInputSchemas.applicationTemplatesMediaDeleteMany,
		output: DatarobotEndpointOutputSchemas.applicationTemplatesMediaDeleteMany,
	},
	'applicationTemplates.applicationTemplatesMediaList': {
		input: DatarobotEndpointInputSchemas.applicationTemplatesMediaList,
		output: DatarobotEndpointOutputSchemas.applicationTemplatesMediaList,
	},
	'applicationTemplates.applicationTemplatesPatch': {
		input: DatarobotEndpointInputSchemas.applicationTemplatesPatch,
		output: DatarobotEndpointOutputSchemas.applicationTemplatesPatch,
	},
	'applicationTemplates.applicationTemplatesRepositoryUrlsList': {
		input: DatarobotEndpointInputSchemas.applicationTemplatesRepositoryUrlsList,
		output:
			DatarobotEndpointOutputSchemas.applicationTemplatesRepositoryUrlsList,
	},
	'applications.applicationUserRoleRetrieve': {
		input: DatarobotEndpointInputSchemas.applicationUserRoleRetrieve,
		output: DatarobotEndpointOutputSchemas.applicationUserRoleRetrieve,
	},
	'applications.applicationsAccessControlList': {
		input: DatarobotEndpointInputSchemas.applicationsAccessControlList,
		output: DatarobotEndpointOutputSchemas.applicationsAccessControlList,
	},
	'applications.applicationsAccessControlPatchMany': {
		input: DatarobotEndpointInputSchemas.applicationsAccessControlPatchMany,
		output: DatarobotEndpointOutputSchemas.applicationsAccessControlPatchMany,
	},
	'applications.applicationsCreate': {
		input: DatarobotEndpointInputSchemas.applicationsCreate,
		output: DatarobotEndpointOutputSchemas.applicationsCreate,
	},
	'applications.applicationsDelete': {
		input: DatarobotEndpointInputSchemas.applicationsDelete,
		output: DatarobotEndpointOutputSchemas.applicationsDelete,
	},
	'applications.applicationsDeploymentsCreate': {
		input: DatarobotEndpointInputSchemas.applicationsDeploymentsCreate,
		output: DatarobotEndpointOutputSchemas.applicationsDeploymentsCreate,
	},
	'applications.applicationsDeploymentsDelete': {
		input: DatarobotEndpointInputSchemas.applicationsDeploymentsDelete,
		output: DatarobotEndpointOutputSchemas.applicationsDeploymentsDelete,
	},
	'applications.applicationsDuplicateCreate': {
		input: DatarobotEndpointInputSchemas.applicationsDuplicateCreate,
		output: DatarobotEndpointOutputSchemas.applicationsDuplicateCreate,
	},
	'applications.applicationsList': {
		input: DatarobotEndpointInputSchemas.applicationsList,
		output: DatarobotEndpointOutputSchemas.applicationsList,
	},
	'applications.applicationsPatch': {
		input: DatarobotEndpointInputSchemas.applicationsPatch,
		output: DatarobotEndpointOutputSchemas.applicationsPatch,
	},
	'applications.applicationsRetrieve': {
		input: DatarobotEndpointInputSchemas.applicationsRetrieve,
		output: DatarobotEndpointOutputSchemas.applicationsRetrieve,
	},
	'applications.applicationsSharedRolesList': {
		input: DatarobotEndpointInputSchemas.applicationsSharedRolesList,
		output: DatarobotEndpointOutputSchemas.applicationsSharedRolesList,
	},
	'applications.applicationsSharedRolesPatchMany': {
		input: DatarobotEndpointInputSchemas.applicationsSharedRolesPatchMany,
		output: DatarobotEndpointOutputSchemas.applicationsSharedRolesPatchMany,
	},
	'applications.applicationsVerifyCreate': {
		input: DatarobotEndpointInputSchemas.applicationsVerifyCreate,
		output: DatarobotEndpointOutputSchemas.applicationsVerifyCreate,
	},
	'approvalPolicies.approvalPoliciesCreate': {
		input: DatarobotEndpointInputSchemas.approvalPoliciesCreate,
		output: DatarobotEndpointOutputSchemas.approvalPoliciesCreate,
	},
	'approvalPolicies.approvalPoliciesDelete': {
		input: DatarobotEndpointInputSchemas.approvalPoliciesDelete,
		output: DatarobotEndpointOutputSchemas.approvalPoliciesDelete,
	},
	'approvalPolicies.approvalPoliciesList': {
		input: DatarobotEndpointInputSchemas.approvalPoliciesList,
		output: DatarobotEndpointOutputSchemas.approvalPoliciesList,
	},
	'approvalPolicies.approvalPoliciesPut': {
		input: DatarobotEndpointInputSchemas.approvalPoliciesPut,
		output: DatarobotEndpointOutputSchemas.approvalPoliciesPut,
	},
	'approvalPolicies.approvalPoliciesRetrieve': {
		input: DatarobotEndpointInputSchemas.approvalPoliciesRetrieve,
		output: DatarobotEndpointOutputSchemas.approvalPoliciesRetrieve,
	},
	'approvalPolicies.approvalPoliciesShareableChangeRequestsList': {
		input:
			DatarobotEndpointInputSchemas.approvalPoliciesShareableChangeRequestsList,
		output:
			DatarobotEndpointOutputSchemas.approvalPoliciesShareableChangeRequestsList,
	},
	'automatedDocuments.automatedDocumentsCreate': {
		input: DatarobotEndpointInputSchemas.automatedDocumentsCreate,
		output: DatarobotEndpointOutputSchemas.automatedDocumentsCreate,
	},
	'automatedDocuments.automatedDocumentsDelete': {
		input: DatarobotEndpointInputSchemas.automatedDocumentsDelete,
		output: DatarobotEndpointOutputSchemas.automatedDocumentsDelete,
	},
	'automatedDocuments.automatedDocumentsList': {
		input: DatarobotEndpointInputSchemas.automatedDocumentsList,
		output: DatarobotEndpointOutputSchemas.automatedDocumentsList,
	},
	'automatedDocuments.automatedDocumentsRetrieve': {
		input: DatarobotEndpointInputSchemas.automatedDocumentsRetrieve,
		output: DatarobotEndpointOutputSchemas.automatedDocumentsRetrieve,
	},
	'batchJobs.batchJobsCsvUploadPutMany': {
		input: DatarobotEndpointInputSchemas.batchJobsCsvUploadPutMany,
		output: DatarobotEndpointOutputSchemas.batchJobsCsvUploadPutMany,
	},
	'batchJobs.batchJobsDelete': {
		input: DatarobotEndpointInputSchemas.batchJobsDelete,
		output: DatarobotEndpointOutputSchemas.batchJobsDelete,
	},
	'batchJobs.batchJobsDownloadList': {
		input: DatarobotEndpointInputSchemas.batchJobsDownloadList,
		output: DatarobotEndpointOutputSchemas.batchJobsDownloadList,
	},
	'batchJobs.batchJobsFromJobDefinitionCreate': {
		input: DatarobotEndpointInputSchemas.batchJobsFromJobDefinitionCreate,
		output: DatarobotEndpointOutputSchemas.batchJobsFromJobDefinitionCreate,
	},
	'batchJobs.batchJobsList': {
		input: DatarobotEndpointInputSchemas.batchJobsList,
		output: DatarobotEndpointOutputSchemas.batchJobsList,
	},
	'batchJobs.batchJobsRetrieve': {
		input: DatarobotEndpointInputSchemas.batchJobsRetrieve,
		output: DatarobotEndpointOutputSchemas.batchJobsRetrieve,
	},
	'batchMonitoring.batchMonitoringCreate': {
		input: DatarobotEndpointInputSchemas.batchMonitoringCreate,
		output: DatarobotEndpointOutputSchemas.batchMonitoringCreate,
	},
	'batchPredictions.batchPredictionsCreate': {
		input: DatarobotEndpointInputSchemas.batchPredictionsCreate,
		output: DatarobotEndpointOutputSchemas.batchPredictionsCreate,
	},
	'batchPredictions.batchPredictionsCsvUploadFinalizeMultipartCreate': {
		input:
			DatarobotEndpointInputSchemas.batchPredictionsCsvUploadFinalizeMultipartCreate,
		output:
			DatarobotEndpointOutputSchemas.batchPredictionsCsvUploadFinalizeMultipartCreate,
	},
	'batchPredictions.batchPredictionsCsvUploadPartPut': {
		input: DatarobotEndpointInputSchemas.batchPredictionsCsvUploadPartPut,
		output: DatarobotEndpointOutputSchemas.batchPredictionsCsvUploadPartPut,
	},
	'batchPredictions.batchPredictionsCsvUploadPutMany': {
		input: DatarobotEndpointInputSchemas.batchPredictionsCsvUploadPutMany,
		output: DatarobotEndpointOutputSchemas.batchPredictionsCsvUploadPutMany,
	},
	'batchPredictions.batchPredictionsDelete': {
		input: DatarobotEndpointInputSchemas.batchPredictionsDelete,
		output: DatarobotEndpointOutputSchemas.batchPredictionsDelete,
	},
	'batchPredictions.batchPredictionsDownloadList': {
		input: DatarobotEndpointInputSchemas.batchPredictionsDownloadList,
		output: DatarobotEndpointOutputSchemas.batchPredictionsDownloadList,
	},
	'batchPredictions.batchPredictionsFromExistingCreate': {
		input: DatarobotEndpointInputSchemas.batchPredictionsFromExistingCreate,
		output: DatarobotEndpointOutputSchemas.batchPredictionsFromExistingCreate,
	},
	'batchPredictions.batchPredictionsFromJobDefinitionCreate': {
		input:
			DatarobotEndpointInputSchemas.batchPredictionsFromJobDefinitionCreate,
		output:
			DatarobotEndpointOutputSchemas.batchPredictionsFromJobDefinitionCreate,
	},
	'batchPredictions.batchPredictionsList': {
		input: DatarobotEndpointInputSchemas.batchPredictionsList,
		output: DatarobotEndpointOutputSchemas.batchPredictionsList,
	},
	'batchPredictions.batchPredictionsPatch': {
		input: DatarobotEndpointInputSchemas.batchPredictionsPatch,
		output: DatarobotEndpointOutputSchemas.batchPredictionsPatch,
	},
	'batchPredictions.batchPredictionsRetrieve': {
		input: DatarobotEndpointInputSchemas.batchPredictionsRetrieve,
		output: DatarobotEndpointOutputSchemas.batchPredictionsRetrieve,
	},
	'calendars.calendarsAccessControlList': {
		input: DatarobotEndpointInputSchemas.calendarsAccessControlList,
		output: DatarobotEndpointOutputSchemas.calendarsAccessControlList,
	},
	'calendars.calendarsAccessControlPatchMany': {
		input: DatarobotEndpointInputSchemas.calendarsAccessControlPatchMany,
		output: DatarobotEndpointOutputSchemas.calendarsAccessControlPatchMany,
	},
	'calendars.calendarsDelete': {
		input: DatarobotEndpointInputSchemas.calendarsDelete,
		output: DatarobotEndpointOutputSchemas.calendarsDelete,
	},
	'calendars.calendarsFileUploadCreate': {
		input: DatarobotEndpointInputSchemas.calendarsFileUploadCreate,
		output: DatarobotEndpointOutputSchemas.calendarsFileUploadCreate,
	},
	'calendars.calendarsFromCountryCodeCreate': {
		input: DatarobotEndpointInputSchemas.calendarsFromCountryCodeCreate,
		output: DatarobotEndpointOutputSchemas.calendarsFromCountryCodeCreate,
	},
	'calendars.calendarsFromDatasetCreate': {
		input: DatarobotEndpointInputSchemas.calendarsFromDatasetCreate,
		output: DatarobotEndpointOutputSchemas.calendarsFromDatasetCreate,
	},
	'calendars.calendarsList': {
		input: DatarobotEndpointInputSchemas.calendarsList,
		output: DatarobotEndpointOutputSchemas.calendarsList,
	},
	'calendars.calendarsPatch': {
		input: DatarobotEndpointInputSchemas.calendarsPatch,
		output: DatarobotEndpointOutputSchemas.calendarsPatch,
	},
	'calendars.calendarsRetrieve': {
		input: DatarobotEndpointInputSchemas.calendarsRetrieve,
		output: DatarobotEndpointOutputSchemas.calendarsRetrieve,
	},
	'catalogItems.catalogItemsList': {
		input: DatarobotEndpointInputSchemas.catalogItemsList,
		output: DatarobotEndpointOutputSchemas.catalogItemsList,
	},
	'catalogItems.catalogItemsPatch': {
		input: DatarobotEndpointInputSchemas.catalogItemsPatch,
		output: DatarobotEndpointOutputSchemas.catalogItemsPatch,
	},
	'catalogItems.catalogItemsRetrieve': {
		input: DatarobotEndpointInputSchemas.catalogItemsRetrieve,
		output: DatarobotEndpointOutputSchemas.catalogItemsRetrieve,
	},
	'changeRequests.changeRequestsCreate': {
		input: DatarobotEndpointInputSchemas.changeRequestsCreate,
		output: DatarobotEndpointOutputSchemas.changeRequestsCreate,
	},
	'changeRequests.changeRequestsList': {
		input: DatarobotEndpointInputSchemas.changeRequestsList,
		output: DatarobotEndpointOutputSchemas.changeRequestsList,
	},
	'changeRequests.changeRequestsPatch': {
		input: DatarobotEndpointInputSchemas.changeRequestsPatch,
		output: DatarobotEndpointOutputSchemas.changeRequestsPatch,
	},
	'changeRequests.changeRequestsRequestReviewCreate': {
		input: DatarobotEndpointInputSchemas.changeRequestsRequestReviewCreate,
		output: DatarobotEndpointOutputSchemas.changeRequestsRequestReviewCreate,
	},
	'changeRequests.changeRequestsRetrieve': {
		input: DatarobotEndpointInputSchemas.changeRequestsRetrieve,
		output: DatarobotEndpointOutputSchemas.changeRequestsRetrieve,
	},
	'changeRequests.changeRequestsReviewsCreate': {
		input: DatarobotEndpointInputSchemas.changeRequestsReviewsCreate,
		output: DatarobotEndpointOutputSchemas.changeRequestsReviewsCreate,
	},
	'changeRequests.changeRequestsReviewsList': {
		input: DatarobotEndpointInputSchemas.changeRequestsReviewsList,
		output: DatarobotEndpointOutputSchemas.changeRequestsReviewsList,
	},
	'changeRequests.changeRequestsReviewsRetrieve': {
		input: DatarobotEndpointInputSchemas.changeRequestsReviewsRetrieve,
		output: DatarobotEndpointOutputSchemas.changeRequestsReviewsRetrieve,
	},
	'changeRequests.changeRequestsStatusPatchMany': {
		input: DatarobotEndpointInputSchemas.changeRequestsStatusPatchMany,
		output: DatarobotEndpointOutputSchemas.changeRequestsStatusPatchMany,
	},
	'changeRequests.changeRequestsSuggestedReviewersList': {
		input: DatarobotEndpointInputSchemas.changeRequestsSuggestedReviewersList,
		output: DatarobotEndpointOutputSchemas.changeRequestsSuggestedReviewersList,
	},
	'codeSnippets.codeSnippetsCreate': {
		input: DatarobotEndpointInputSchemas.codeSnippetsCreate,
		output: DatarobotEndpointOutputSchemas.codeSnippetsCreate,
	},
	'codeSnippets.codeSnippetsDownloadCreate': {
		input: DatarobotEndpointInputSchemas.codeSnippetsDownloadCreate,
		output: DatarobotEndpointOutputSchemas.codeSnippetsDownloadCreate,
	},
	'codeSnippets.codeSnippetsList': {
		input: DatarobotEndpointInputSchemas.codeSnippetsList,
		output: DatarobotEndpointOutputSchemas.codeSnippetsList,
	},
	'comments.commentsCreate': {
		input: DatarobotEndpointInputSchemas.commentsCreate,
		output: DatarobotEndpointOutputSchemas.commentsCreate,
	},
	'comments.commentsDelete': {
		input: DatarobotEndpointInputSchemas.commentsDelete,
		output: DatarobotEndpointOutputSchemas.commentsDelete,
	},
	'comments.commentsList': {
		input: DatarobotEndpointInputSchemas.commentsList,
		output: DatarobotEndpointOutputSchemas.commentsList,
	},
	'comments.commentsPatch': {
		input: DatarobotEndpointInputSchemas.commentsPatch,
		output: DatarobotEndpointOutputSchemas.commentsPatch,
	},
	'comments.commentsRetrieve': {
		input: DatarobotEndpointInputSchemas.commentsRetrieve,
		output: DatarobotEndpointOutputSchemas.commentsRetrieve,
	},
	'complianceDocTemplates.complianceDocTemplatesCreate': {
		input: DatarobotEndpointInputSchemas.complianceDocTemplatesCreate,
		output: DatarobotEndpointOutputSchemas.complianceDocTemplatesCreate,
	},
	'complianceDocTemplates.complianceDocTemplatesDefaultList': {
		input: DatarobotEndpointInputSchemas.complianceDocTemplatesDefaultList,
		output: DatarobotEndpointOutputSchemas.complianceDocTemplatesDefaultList,
	},
	'complianceDocTemplates.complianceDocTemplatesDelete': {
		input: DatarobotEndpointInputSchemas.complianceDocTemplatesDelete,
		output: DatarobotEndpointOutputSchemas.complianceDocTemplatesDelete,
	},
	'complianceDocTemplates.complianceDocTemplatesList': {
		input: DatarobotEndpointInputSchemas.complianceDocTemplatesList,
		output: DatarobotEndpointOutputSchemas.complianceDocTemplatesList,
	},
	'complianceDocTemplates.complianceDocTemplatesPatch': {
		input: DatarobotEndpointInputSchemas.complianceDocTemplatesPatch,
		output: DatarobotEndpointOutputSchemas.complianceDocTemplatesPatch,
	},
	'complianceDocTemplates.complianceDocTemplatesRetrieve': {
		input: DatarobotEndpointInputSchemas.complianceDocTemplatesRetrieve,
		output: DatarobotEndpointOutputSchemas.complianceDocTemplatesRetrieve,
	},
	'complianceDocTemplates.complianceDocTemplatesSharedRolesList': {
		input: DatarobotEndpointInputSchemas.complianceDocTemplatesSharedRolesList,
		output:
			DatarobotEndpointOutputSchemas.complianceDocTemplatesSharedRolesList,
	},
	'complianceDocTemplates.complianceDocTemplatesSharedRolesPatchMany': {
		input:
			DatarobotEndpointInputSchemas.complianceDocTemplatesSharedRolesPatchMany,
		output:
			DatarobotEndpointOutputSchemas.complianceDocTemplatesSharedRolesPatchMany,
	},
	'credentials.credentialsAssociationsListForCredential': {
		input:
			DatarobotEndpointInputSchemas.credentialsAssociationsListForCredential,
		output:
			DatarobotEndpointOutputSchemas.credentialsAssociationsListForCredential,
	},
	'credentials.credentialsAssociationsListForObject': {
		input: DatarobotEndpointInputSchemas.credentialsAssociationsListForObject,
		output: DatarobotEndpointOutputSchemas.credentialsAssociationsListForObject,
	},
	'credentials.credentialsAssociationsPatchMany': {
		input: DatarobotEndpointInputSchemas.credentialsAssociationsPatchMany,
		output: DatarobotEndpointOutputSchemas.credentialsAssociationsPatchMany,
	},
	'credentials.credentialsAssociationsPut': {
		input: DatarobotEndpointInputSchemas.credentialsAssociationsPut,
		output: DatarobotEndpointOutputSchemas.credentialsAssociationsPut,
	},
	'credentials.credentialsCreate': {
		input: DatarobotEndpointInputSchemas.credentialsCreate,
		output: DatarobotEndpointOutputSchemas.credentialsCreate,
	},
	'credentials.credentialsDelete': {
		input: DatarobotEndpointInputSchemas.credentialsDelete,
		output: DatarobotEndpointOutputSchemas.credentialsDelete,
	},
	'credentials.credentialsList': {
		input: DatarobotEndpointInputSchemas.credentialsList,
		output: DatarobotEndpointOutputSchemas.credentialsList,
	},
	'credentials.credentialsPatch': {
		input: DatarobotEndpointInputSchemas.credentialsPatch,
		output: DatarobotEndpointOutputSchemas.credentialsPatch,
	},
	'credentials.credentialsRetrieve': {
		input: DatarobotEndpointInputSchemas.credentialsRetrieve,
		output: DatarobotEndpointOutputSchemas.credentialsRetrieve,
	},
	'customApplicationSources.customApplicationSourcesCreate': {
		input: DatarobotEndpointInputSchemas.customApplicationSourcesCreate,
		output: DatarobotEndpointOutputSchemas.customApplicationSourcesCreate,
	},
	'customApplicationSources.customApplicationSourcesDelete': {
		input: DatarobotEndpointInputSchemas.customApplicationSourcesDelete,
		output: DatarobotEndpointOutputSchemas.customApplicationSourcesDelete,
	},
	'customApplicationSources.customApplicationSourcesFromCustomTemplateCreate': {
		input:
			DatarobotEndpointInputSchemas.customApplicationSourcesFromCustomTemplateCreate,
		output:
			DatarobotEndpointOutputSchemas.customApplicationSourcesFromCustomTemplateCreate,
	},
	'customApplicationSources.customApplicationSourcesList': {
		input: DatarobotEndpointInputSchemas.customApplicationSourcesList,
		output: DatarobotEndpointOutputSchemas.customApplicationSourcesList,
	},
	'customApplicationSources.customApplicationSourcesPatch': {
		input: DatarobotEndpointInputSchemas.customApplicationSourcesPatch,
		output: DatarobotEndpointOutputSchemas.customApplicationSourcesPatch,
	},
	'customApplicationSources.customApplicationSourcesRetrieve': {
		input: DatarobotEndpointInputSchemas.customApplicationSourcesRetrieve,
		output: DatarobotEndpointOutputSchemas.customApplicationSourcesRetrieve,
	},
	'customApplicationSources.customApplicationSourcesSharedRolesList': {
		input:
			DatarobotEndpointInputSchemas.customApplicationSourcesSharedRolesList,
		output:
			DatarobotEndpointOutputSchemas.customApplicationSourcesSharedRolesList,
	},
	'customApplicationSources.customApplicationSourcesSharedRolesPatchMany': {
		input:
			DatarobotEndpointInputSchemas.customApplicationSourcesSharedRolesPatchMany,
		output:
			DatarobotEndpointOutputSchemas.customApplicationSourcesSharedRolesPatchMany,
	},
	'customApplicationSources.customApplicationSourcesVersionsArchiveList': {
		input:
			DatarobotEndpointInputSchemas.customApplicationSourcesVersionsArchiveList,
		output:
			DatarobotEndpointOutputSchemas.customApplicationSourcesVersionsArchiveList,
	},
	'customApplicationSources.customApplicationSourcesVersionsCreate': {
		input: DatarobotEndpointInputSchemas.customApplicationSourcesVersionsCreate,
		output:
			DatarobotEndpointOutputSchemas.customApplicationSourcesVersionsCreate,
	},
	'customApplicationSources.customApplicationSourcesVersionsDelete': {
		input: DatarobotEndpointInputSchemas.customApplicationSourcesVersionsDelete,
		output:
			DatarobotEndpointOutputSchemas.customApplicationSourcesVersionsDelete,
	},
	'customApplicationSources.customApplicationSourcesVersionsFromCodespaceCreate':
		{
			input:
				DatarobotEndpointInputSchemas.customApplicationSourcesVersionsFromCodespaceCreate,
			output:
				DatarobotEndpointOutputSchemas.customApplicationSourcesVersionsFromCodespaceCreate,
		},
	'customApplicationSources.customApplicationSourcesVersionsItemsRetrieve': {
		input:
			DatarobotEndpointInputSchemas.customApplicationSourcesVersionsItemsRetrieve,
		output:
			DatarobotEndpointOutputSchemas.customApplicationSourcesVersionsItemsRetrieve,
	},
	'customApplicationSources.customApplicationSourcesVersionsList': {
		input: DatarobotEndpointInputSchemas.customApplicationSourcesVersionsList,
		output: DatarobotEndpointOutputSchemas.customApplicationSourcesVersionsList,
	},
	'customApplicationSources.customApplicationSourcesVersionsPatch': {
		input: DatarobotEndpointInputSchemas.customApplicationSourcesVersionsPatch,
		output:
			DatarobotEndpointOutputSchemas.customApplicationSourcesVersionsPatch,
	},
	'customApplicationSources.customApplicationSourcesVersionsRetrieve': {
		input:
			DatarobotEndpointInputSchemas.customApplicationSourcesVersionsRetrieve,
		output:
			DatarobotEndpointOutputSchemas.customApplicationSourcesVersionsRetrieve,
	},
	'customApplicationSources.customApplicationSourcesVersionsToCodespaceCreate':
		{
			input:
				DatarobotEndpointInputSchemas.customApplicationSourcesVersionsToCodespaceCreate,
			output:
				DatarobotEndpointOutputSchemas.customApplicationSourcesVersionsToCodespaceCreate,
		},
	'customApplications.customApplicationsCreate': {
		input: DatarobotEndpointInputSchemas.customApplicationsCreate,
		output: DatarobotEndpointOutputSchemas.customApplicationsCreate,
	},
	'customApplications.customApplicationsDelete': {
		input: DatarobotEndpointInputSchemas.customApplicationsDelete,
		output: DatarobotEndpointOutputSchemas.customApplicationsDelete,
	},
	'customApplications.customApplicationsHistoryList': {
		input: DatarobotEndpointInputSchemas.customApplicationsHistoryList,
		output: DatarobotEndpointOutputSchemas.customApplicationsHistoryList,
	},
	'customApplications.customApplicationsList': {
		input: DatarobotEndpointInputSchemas.customApplicationsList,
		output: DatarobotEndpointOutputSchemas.customApplicationsList,
	},
	'customApplications.customApplicationsLogsList': {
		input: DatarobotEndpointInputSchemas.customApplicationsLogsList,
		output: DatarobotEndpointOutputSchemas.customApplicationsLogsList,
	},
	'customApplications.customApplicationsMigrateToWorkloadCreate': {
		input:
			DatarobotEndpointInputSchemas.customApplicationsMigrateToWorkloadCreate,
		output:
			DatarobotEndpointOutputSchemas.customApplicationsMigrateToWorkloadCreate,
	},
	'customApplications.customApplicationsPatch': {
		input: DatarobotEndpointInputSchemas.customApplicationsPatch,
		output: DatarobotEndpointOutputSchemas.customApplicationsPatch,
	},
	'customApplications.customApplicationsRetrieve': {
		input: DatarobotEndpointInputSchemas.customApplicationsRetrieve,
		output: DatarobotEndpointOutputSchemas.customApplicationsRetrieve,
	},
	'customApplications.customApplicationsSharedRolesList': {
		input: DatarobotEndpointInputSchemas.customApplicationsSharedRolesList,
		output: DatarobotEndpointOutputSchemas.customApplicationsSharedRolesList,
	},
	'customApplications.customApplicationsSharedRolesPatchMany': {
		input: DatarobotEndpointInputSchemas.customApplicationsSharedRolesPatchMany,
		output:
			DatarobotEndpointOutputSchemas.customApplicationsSharedRolesPatchMany,
	},
	'customApplications.customApplicationsUsagesDownloadList': {
		input: DatarobotEndpointInputSchemas.customApplicationsUsagesDownloadList,
		output: DatarobotEndpointOutputSchemas.customApplicationsUsagesDownloadList,
	},
	'customApplications.customApplicationsUsagesList': {
		input: DatarobotEndpointInputSchemas.customApplicationsUsagesList,
		output: DatarobotEndpointOutputSchemas.customApplicationsUsagesList,
	},
	'customJobs.customJobsCreate': {
		input: DatarobotEndpointInputSchemas.customJobsCreate,
		output: DatarobotEndpointOutputSchemas.customJobsCreate,
	},
	'customJobs.customJobsCustomMetricsDelete': {
		input: DatarobotEndpointInputSchemas.customJobsCustomMetricsDelete,
		output: DatarobotEndpointOutputSchemas.customJobsCustomMetricsDelete,
	},
	'customJobs.customJobsCustomMetricsList': {
		input: DatarobotEndpointInputSchemas.customJobsCustomMetricsList,
		output: DatarobotEndpointOutputSchemas.customJobsCustomMetricsList,
	},
	'customJobs.customJobsCustomMetricsPatch': {
		input: DatarobotEndpointInputSchemas.customJobsCustomMetricsPatch,
		output: DatarobotEndpointOutputSchemas.customJobsCustomMetricsPatch,
	},
	'customJobs.customJobsDelete': {
		input: DatarobotEndpointInputSchemas.customJobsDelete,
		output: DatarobotEndpointOutputSchemas.customJobsDelete,
	},
	'customJobs.customJobsFromGalleryTemplateCreate': {
		input: DatarobotEndpointInputSchemas.customJobsFromGalleryTemplateCreate,
		output: DatarobotEndpointOutputSchemas.customJobsFromGalleryTemplateCreate,
	},
	'customJobs.customJobsFromHostedCustomMetricGalleryTemplateCreate': {
		input:
			DatarobotEndpointInputSchemas.customJobsFromHostedCustomMetricGalleryTemplateCreate,
		output:
			DatarobotEndpointOutputSchemas.customJobsFromHostedCustomMetricGalleryTemplateCreate,
	},
	'customJobs.customJobsHostedCustomMetricTemplateCreate': {
		input:
			DatarobotEndpointInputSchemas.customJobsHostedCustomMetricTemplateCreate,
		output:
			DatarobotEndpointOutputSchemas.customJobsHostedCustomMetricTemplateCreate,
	},
	'customJobs.customJobsHostedCustomMetricTemplateList': {
		input:
			DatarobotEndpointInputSchemas.customJobsHostedCustomMetricTemplateList,
		output:
			DatarobotEndpointOutputSchemas.customJobsHostedCustomMetricTemplateList,
	},
	'customJobs.customJobsHostedCustomMetricTemplatePatchMany': {
		input:
			DatarobotEndpointInputSchemas.customJobsHostedCustomMetricTemplatePatchMany,
		output:
			DatarobotEndpointOutputSchemas.customJobsHostedCustomMetricTemplatePatchMany,
	},
	'customJobs.customJobsItemsRetrieve': {
		input: DatarobotEndpointInputSchemas.customJobsItemsRetrieve,
		output: DatarobotEndpointOutputSchemas.customJobsItemsRetrieve,
	},
	'customJobs.customJobsList': {
		input: DatarobotEndpointInputSchemas.customJobsList,
		output: DatarobotEndpointOutputSchemas.customJobsList,
	},
	'customJobs.customJobsPatch': {
		input: DatarobotEndpointInputSchemas.customJobsPatch,
		output: DatarobotEndpointOutputSchemas.customJobsPatch,
	},
	'customJobs.customJobsRetrieve': {
		input: DatarobotEndpointInputSchemas.customJobsRetrieve,
		output: DatarobotEndpointOutputSchemas.customJobsRetrieve,
	},
	'customJobs.customJobsRunsCreate': {
		input: DatarobotEndpointInputSchemas.customJobsRunsCreate,
		output: DatarobotEndpointOutputSchemas.customJobsRunsCreate,
	},
	'customJobs.customJobsRunsDelete': {
		input: DatarobotEndpointInputSchemas.customJobsRunsDelete,
		output: DatarobotEndpointOutputSchemas.customJobsRunsDelete,
	},
	'customJobs.customJobsRunsItemsRetrieve': {
		input: DatarobotEndpointInputSchemas.customJobsRunsItemsRetrieve,
		output: DatarobotEndpointOutputSchemas.customJobsRunsItemsRetrieve,
	},
	'customJobs.customJobsRunsList': {
		input: DatarobotEndpointInputSchemas.customJobsRunsList,
		output: DatarobotEndpointOutputSchemas.customJobsRunsList,
	},
	'customJobs.customJobsRunsLogsDeleteMany': {
		input: DatarobotEndpointInputSchemas.customJobsRunsLogsDeleteMany,
		output: DatarobotEndpointOutputSchemas.customJobsRunsLogsDeleteMany,
	},
	'customJobs.customJobsRunsLogsList': {
		input: DatarobotEndpointInputSchemas.customJobsRunsLogsList,
		output: DatarobotEndpointOutputSchemas.customJobsRunsLogsList,
	},
	'customJobs.customJobsRunsPatch': {
		input: DatarobotEndpointInputSchemas.customJobsRunsPatch,
		output: DatarobotEndpointOutputSchemas.customJobsRunsPatch,
	},
	'customJobs.customJobsRunsRetrieve': {
		input: DatarobotEndpointInputSchemas.customJobsRunsRetrieve,
		output: DatarobotEndpointOutputSchemas.customJobsRunsRetrieve,
	},
	'customJobs.customJobsSharedRolesList': {
		input: DatarobotEndpointInputSchemas.customJobsSharedRolesList,
		output: DatarobotEndpointOutputSchemas.customJobsSharedRolesList,
	},
	'customJobs.customJobsSharedRolesPatchMany': {
		input: DatarobotEndpointInputSchemas.customJobsSharedRolesPatchMany,
		output: DatarobotEndpointOutputSchemas.customJobsSharedRolesPatchMany,
	},
	'customModels.customModelsAccessControlList': {
		input: DatarobotEndpointInputSchemas.customModelsAccessControlList,
		output: DatarobotEndpointOutputSchemas.customModelsAccessControlList,
	},
	'customModels.customModelsAccessControlPatchMany': {
		input: DatarobotEndpointInputSchemas.customModelsAccessControlPatchMany,
		output: DatarobotEndpointOutputSchemas.customModelsAccessControlPatchMany,
	},
	'customModels.customModelsCreate': {
		input: DatarobotEndpointInputSchemas.customModelsCreate,
		output: DatarobotEndpointOutputSchemas.customModelsCreate,
	},
	'customModels.customModelsDelete': {
		input: DatarobotEndpointInputSchemas.customModelsDelete,
		output: DatarobotEndpointOutputSchemas.customModelsDelete,
	},
	'customModels.customModelsDownloadList': {
		input: DatarobotEndpointInputSchemas.customModelsDownloadList,
		output: DatarobotEndpointOutputSchemas.customModelsDownloadList,
	},
	'customModels.customModelsFromCustomModelCreate': {
		input: DatarobotEndpointInputSchemas.customModelsFromCustomModelCreate,
		output: DatarobotEndpointOutputSchemas.customModelsFromCustomModelCreate,
	},
	'customModels.customModelsFromModelTemplateCreate': {
		input: DatarobotEndpointInputSchemas.customModelsFromModelTemplateCreate,
		output: DatarobotEndpointOutputSchemas.customModelsFromModelTemplateCreate,
	},
	'customModels.customModelsList': {
		input: DatarobotEndpointInputSchemas.customModelsList,
		output: DatarobotEndpointOutputSchemas.customModelsList,
	},
	'customModels.customModelsPatch': {
		input: DatarobotEndpointInputSchemas.customModelsPatch,
		output: DatarobotEndpointOutputSchemas.customModelsPatch,
	},
	'customModels.customModelsPredictionExplanationsInitializationCreate': {
		input:
			DatarobotEndpointInputSchemas.customModelsPredictionExplanationsInitializationCreate,
		output:
			DatarobotEndpointOutputSchemas.customModelsPredictionExplanationsInitializationCreate,
	},
	'customModels.customModelsRetrieve': {
		input: DatarobotEndpointInputSchemas.customModelsRetrieve,
		output: DatarobotEndpointOutputSchemas.customModelsRetrieve,
	},
	'customModels.customModelsTrainingDataPatchMany': {
		input: DatarobotEndpointInputSchemas.customModelsTrainingDataPatchMany,
		output: DatarobotEndpointOutputSchemas.customModelsTrainingDataPatchMany,
	},
	'customModels.customModelsVersionCreateFromLatest': {
		input: DatarobotEndpointInputSchemas.customModelsVersionCreateFromLatest,
		output: DatarobotEndpointOutputSchemas.customModelsVersionCreateFromLatest,
	},
	'customModels.customModelsVersionsConversionsCreate': {
		input: DatarobotEndpointInputSchemas.customModelsVersionsConversionsCreate,
		output:
			DatarobotEndpointOutputSchemas.customModelsVersionsConversionsCreate,
	},
	'customModels.customModelsVersionsConversionsDelete': {
		input: DatarobotEndpointInputSchemas.customModelsVersionsConversionsDelete,
		output:
			DatarobotEndpointOutputSchemas.customModelsVersionsConversionsDelete,
	},
	'customModels.customModelsVersionsConversionsList': {
		input: DatarobotEndpointInputSchemas.customModelsVersionsConversionsList,
		output: DatarobotEndpointOutputSchemas.customModelsVersionsConversionsList,
	},
	'customModels.customModelsVersionsConversionsRetrieve': {
		input:
			DatarobotEndpointInputSchemas.customModelsVersionsConversionsRetrieve,
		output:
			DatarobotEndpointOutputSchemas.customModelsVersionsConversionsRetrieve,
	},
	'customModels.customModelsVersionsCreate': {
		input: DatarobotEndpointInputSchemas.customModelsVersionsCreate,
		output: DatarobotEndpointOutputSchemas.customModelsVersionsCreate,
	},
	'customModels.customModelsVersionsDependencyBuildCreate': {
		input:
			DatarobotEndpointInputSchemas.customModelsVersionsDependencyBuildCreate,
		output:
			DatarobotEndpointOutputSchemas.customModelsVersionsDependencyBuildCreate,
	},
	'customModels.customModelsVersionsDependencyBuildDeleteMany': {
		input:
			DatarobotEndpointInputSchemas.customModelsVersionsDependencyBuildDeleteMany,
		output:
			DatarobotEndpointOutputSchemas.customModelsVersionsDependencyBuildDeleteMany,
	},
	'customModels.customModelsVersionsDependencyBuildList': {
		input:
			DatarobotEndpointInputSchemas.customModelsVersionsDependencyBuildList,
		output:
			DatarobotEndpointOutputSchemas.customModelsVersionsDependencyBuildList,
	},
	'customModels.customModelsVersionsDependencyBuildLogList': {
		input:
			DatarobotEndpointInputSchemas.customModelsVersionsDependencyBuildLogList,
		output:
			DatarobotEndpointOutputSchemas.customModelsVersionsDependencyBuildLogList,
	},
	'customModels.customModelsVersionsDownloadList': {
		input: DatarobotEndpointInputSchemas.customModelsVersionsDownloadList,
		output: DatarobotEndpointOutputSchemas.customModelsVersionsDownloadList,
	},
	'customModels.customModelsVersionsFeatureImpactCreate': {
		input:
			DatarobotEndpointInputSchemas.customModelsVersionsFeatureImpactCreate,
		output:
			DatarobotEndpointOutputSchemas.customModelsVersionsFeatureImpactCreate,
	},
	'customModels.customModelsVersionsFeatureImpactList': {
		input: DatarobotEndpointInputSchemas.customModelsVersionsFeatureImpactList,
		output:
			DatarobotEndpointOutputSchemas.customModelsVersionsFeatureImpactList,
	},
	'customModels.customModelsVersionsFromCodespaceCreate': {
		input:
			DatarobotEndpointInputSchemas.customModelsVersionsFromCodespaceCreate,
		output:
			DatarobotEndpointOutputSchemas.customModelsVersionsFromCodespaceCreate,
	},
	'customModels.customModelsVersionsFromRepositoryCreate': {
		input:
			DatarobotEndpointInputSchemas.customModelsVersionsFromRepositoryCreate,
		output:
			DatarobotEndpointOutputSchemas.customModelsVersionsFromRepositoryCreate,
	},
	'customModels.customModelsVersionsFromRepositoryPatchMany': {
		input:
			DatarobotEndpointInputSchemas.customModelsVersionsFromRepositoryPatchMany,
		output:
			DatarobotEndpointOutputSchemas.customModelsVersionsFromRepositoryPatchMany,
	},
	'customModels.customModelsVersionsList': {
		input: DatarobotEndpointInputSchemas.customModelsVersionsList,
		output: DatarobotEndpointOutputSchemas.customModelsVersionsList,
	},
	'customModels.customModelsVersionsPatch': {
		input: DatarobotEndpointInputSchemas.customModelsVersionsPatch,
		output: DatarobotEndpointOutputSchemas.customModelsVersionsPatch,
	},
	'customModels.customModelsVersionsPredictionExplanationsInitializationCreate':
		{
			input:
				DatarobotEndpointInputSchemas.customModelsVersionsPredictionExplanationsInitializationCreate,
			output:
				DatarobotEndpointOutputSchemas.customModelsVersionsPredictionExplanationsInitializationCreate,
		},
	'customModels.customModelsVersionsRetrieve': {
		input: DatarobotEndpointInputSchemas.customModelsVersionsRetrieve,
		output: DatarobotEndpointOutputSchemas.customModelsVersionsRetrieve,
	},
	'customModels.customModelsVersionsToCodespaceCreate': {
		input: DatarobotEndpointInputSchemas.customModelsVersionsToCodespaceCreate,
		output:
			DatarobotEndpointOutputSchemas.customModelsVersionsToCodespaceCreate,
	},
	'customModels.customModelsVersionsWithTrainingDataPatchMany': {
		input:
			DatarobotEndpointInputSchemas.customModelsVersionsWithTrainingDataPatchMany,
		output:
			DatarobotEndpointOutputSchemas.customModelsVersionsWithTrainingDataPatchMany,
	},
	'customTasks.customTaskVersionCreateFromLatest': {
		input: DatarobotEndpointInputSchemas.customTaskVersionCreateFromLatest,
		output: DatarobotEndpointOutputSchemas.customTaskVersionCreateFromLatest,
	},
	'customTasks.customTasksAccessControlList': {
		input: DatarobotEndpointInputSchemas.customTasksAccessControlList,
		output: DatarobotEndpointOutputSchemas.customTasksAccessControlList,
	},
	'customTasks.customTasksAccessControlPatchMany': {
		input: DatarobotEndpointInputSchemas.customTasksAccessControlPatchMany,
		output: DatarobotEndpointOutputSchemas.customTasksAccessControlPatchMany,
	},
	'customTasks.customTasksCreate': {
		input: DatarobotEndpointInputSchemas.customTasksCreate,
		output: DatarobotEndpointOutputSchemas.customTasksCreate,
	},
	'customTasks.customTasksDelete': {
		input: DatarobotEndpointInputSchemas.customTasksDelete,
		output: DatarobotEndpointOutputSchemas.customTasksDelete,
	},
	'customTasks.customTasksDownloadList': {
		input: DatarobotEndpointInputSchemas.customTasksDownloadList,
		output: DatarobotEndpointOutputSchemas.customTasksDownloadList,
	},
	'customTasks.customTasksFromCustomTaskCreate': {
		input: DatarobotEndpointInputSchemas.customTasksFromCustomTaskCreate,
		output: DatarobotEndpointOutputSchemas.customTasksFromCustomTaskCreate,
	},
	'customTasks.customTasksList': {
		input: DatarobotEndpointInputSchemas.customTasksList,
		output: DatarobotEndpointOutputSchemas.customTasksList,
	},
	'customTasks.customTasksPatch': {
		input: DatarobotEndpointInputSchemas.customTasksPatch,
		output: DatarobotEndpointOutputSchemas.customTasksPatch,
	},
	'customTasks.customTasksRetrieve': {
		input: DatarobotEndpointInputSchemas.customTasksRetrieve,
		output: DatarobotEndpointOutputSchemas.customTasksRetrieve,
	},
	'customTasks.customTasksVersionsCreate': {
		input: DatarobotEndpointInputSchemas.customTasksVersionsCreate,
		output: DatarobotEndpointOutputSchemas.customTasksVersionsCreate,
	},
	'customTasks.customTasksVersionsDependencyBuildCreate': {
		input:
			DatarobotEndpointInputSchemas.customTasksVersionsDependencyBuildCreate,
		output:
			DatarobotEndpointOutputSchemas.customTasksVersionsDependencyBuildCreate,
	},
	'customTasks.customTasksVersionsDependencyBuildDeleteMany': {
		input:
			DatarobotEndpointInputSchemas.customTasksVersionsDependencyBuildDeleteMany,
		output:
			DatarobotEndpointOutputSchemas.customTasksVersionsDependencyBuildDeleteMany,
	},
	'customTasks.customTasksVersionsDependencyBuildList': {
		input: DatarobotEndpointInputSchemas.customTasksVersionsDependencyBuildList,
		output:
			DatarobotEndpointOutputSchemas.customTasksVersionsDependencyBuildList,
	},
	'customTasks.customTasksVersionsDependencyBuildLogList': {
		input:
			DatarobotEndpointInputSchemas.customTasksVersionsDependencyBuildLogList,
		output:
			DatarobotEndpointOutputSchemas.customTasksVersionsDependencyBuildLogList,
	},
	'customTasks.customTasksVersionsDownloadList': {
		input: DatarobotEndpointInputSchemas.customTasksVersionsDownloadList,
		output: DatarobotEndpointOutputSchemas.customTasksVersionsDownloadList,
	},
	'customTasks.customTasksVersionsFromRepositoryCreate': {
		input:
			DatarobotEndpointInputSchemas.customTasksVersionsFromRepositoryCreate,
		output:
			DatarobotEndpointOutputSchemas.customTasksVersionsFromRepositoryCreate,
	},
	'customTasks.customTasksVersionsFromRepositoryPatchMany': {
		input:
			DatarobotEndpointInputSchemas.customTasksVersionsFromRepositoryPatchMany,
		output:
			DatarobotEndpointOutputSchemas.customTasksVersionsFromRepositoryPatchMany,
	},
	'customTasks.customTasksVersionsList': {
		input: DatarobotEndpointInputSchemas.customTasksVersionsList,
		output: DatarobotEndpointOutputSchemas.customTasksVersionsList,
	},
	'customTasks.customTasksVersionsPatch': {
		input: DatarobotEndpointInputSchemas.customTasksVersionsPatch,
		output: DatarobotEndpointOutputSchemas.customTasksVersionsPatch,
	},
	'customTasks.customTasksVersionsRetrieve': {
		input: DatarobotEndpointInputSchemas.customTasksVersionsRetrieve,
		output: DatarobotEndpointOutputSchemas.customTasksVersionsRetrieve,
	},
	'dataEngineWorkspaceStates.dataEngineWorkspaceStatesCreate': {
		input: DatarobotEndpointInputSchemas.dataEngineWorkspaceStatesCreate,
		output: DatarobotEndpointOutputSchemas.dataEngineWorkspaceStatesCreate,
	},
	'dataEngineWorkspaceStates.dataEngineWorkspaceStatesFromDataEngineQueryGeneratorCreate':
		{
			input:
				DatarobotEndpointInputSchemas.dataEngineWorkspaceStatesFromDataEngineQueryGeneratorCreate,
			output:
				DatarobotEndpointOutputSchemas.dataEngineWorkspaceStatesFromDataEngineQueryGeneratorCreate,
		},
	'dataEngineWorkspaceStates.dataEngineWorkspaceStatesRetrieve': {
		input: DatarobotEndpointInputSchemas.dataEngineWorkspaceStatesRetrieve,
		output: DatarobotEndpointOutputSchemas.dataEngineWorkspaceStatesRetrieve,
	},
	'dataSlices.dataSlicesCreate': {
		input: DatarobotEndpointInputSchemas.dataSlicesCreate,
		output: DatarobotEndpointOutputSchemas.dataSlicesCreate,
	},
	'dataSlices.dataSlicesDelete': {
		input: DatarobotEndpointInputSchemas.dataSlicesDelete,
		output: DatarobotEndpointOutputSchemas.dataSlicesDelete,
	},
	'dataSlices.dataSlicesDeleteMany': {
		input: DatarobotEndpointInputSchemas.dataSlicesDeleteMany,
		output: DatarobotEndpointOutputSchemas.dataSlicesDeleteMany,
	},
	'dataSlices.dataSlicesRetrieve': {
		input: DatarobotEndpointInputSchemas.dataSlicesRetrieve,
		output: DatarobotEndpointOutputSchemas.dataSlicesRetrieve,
	},
	'dataSlices.dataSlicesSliceSizesCreate': {
		input: DatarobotEndpointInputSchemas.dataSlicesSliceSizesCreate,
		output: DatarobotEndpointOutputSchemas.dataSlicesSliceSizesCreate,
	},
	'dataSlices.dataSlicesSliceSizesList': {
		input: DatarobotEndpointInputSchemas.dataSlicesSliceSizesList,
		output: DatarobotEndpointOutputSchemas.dataSlicesSliceSizesList,
	},
	'dataStages.dataStagesCreate': {
		input: DatarobotEndpointInputSchemas.dataStagesCreate,
		output: DatarobotEndpointOutputSchemas.dataStagesCreate,
	},
	'dataStages.dataStagesFinalizeCreate': {
		input: DatarobotEndpointInputSchemas.dataStagesFinalizeCreate,
		output: DatarobotEndpointOutputSchemas.dataStagesFinalizeCreate,
	},
	'dataStages.dataStagesPartsPut': {
		input: DatarobotEndpointInputSchemas.dataStagesPartsPut,
		output: DatarobotEndpointOutputSchemas.dataStagesPartsPut,
	},
	'datasetDefinitions.datasetDefinitionsAnalyzeCreate': {
		input: DatarobotEndpointInputSchemas.datasetDefinitionsAnalyzeCreate,
		output: DatarobotEndpointOutputSchemas.datasetDefinitionsAnalyzeCreate,
	},
	'datasetDefinitions.datasetDefinitionsChunkDefinitionsAnalyzeCreate': {
		input:
			DatarobotEndpointInputSchemas.datasetDefinitionsChunkDefinitionsAnalyzeCreate,
		output:
			DatarobotEndpointOutputSchemas.datasetDefinitionsChunkDefinitionsAnalyzeCreate,
	},
	'datasetDefinitions.datasetDefinitionsChunkDefinitionsCreate': {
		input:
			DatarobotEndpointInputSchemas.datasetDefinitionsChunkDefinitionsCreate,
		output:
			DatarobotEndpointOutputSchemas.datasetDefinitionsChunkDefinitionsCreate,
	},
	'datasetDefinitions.datasetDefinitionsChunkDefinitionsDelete': {
		input:
			DatarobotEndpointInputSchemas.datasetDefinitionsChunkDefinitionsDelete,
		output:
			DatarobotEndpointOutputSchemas.datasetDefinitionsChunkDefinitionsDelete,
	},
	'datasetDefinitions.datasetDefinitionsChunkDefinitionsList': {
		input: DatarobotEndpointInputSchemas.datasetDefinitionsChunkDefinitionsList,
		output:
			DatarobotEndpointOutputSchemas.datasetDefinitionsChunkDefinitionsList,
	},
	'datasetDefinitions.datasetDefinitionsChunkDefinitionsPatch': {
		input:
			DatarobotEndpointInputSchemas.datasetDefinitionsChunkDefinitionsPatch,
		output:
			DatarobotEndpointOutputSchemas.datasetDefinitionsChunkDefinitionsPatch,
	},
	'datasetDefinitions.datasetDefinitionsChunkDefinitionsRetrieve': {
		input:
			DatarobotEndpointInputSchemas.datasetDefinitionsChunkDefinitionsRetrieve,
		output:
			DatarobotEndpointOutputSchemas.datasetDefinitionsChunkDefinitionsRetrieve,
	},
	'datasetDefinitions.datasetDefinitionsCreate': {
		input: DatarobotEndpointInputSchemas.datasetDefinitionsCreate,
		output: DatarobotEndpointOutputSchemas.datasetDefinitionsCreate,
	},
	'datasetDefinitions.datasetDefinitionsDelete': {
		input: DatarobotEndpointInputSchemas.datasetDefinitionsDelete,
		output: DatarobotEndpointOutputSchemas.datasetDefinitionsDelete,
	},
	'datasetDefinitions.datasetDefinitionsList': {
		input: DatarobotEndpointInputSchemas.datasetDefinitionsList,
		output: DatarobotEndpointOutputSchemas.datasetDefinitionsList,
	},
	'datasetDefinitions.datasetDefinitionsRetrieve': {
		input: DatarobotEndpointInputSchemas.datasetDefinitionsRetrieve,
		output: DatarobotEndpointOutputSchemas.datasetDefinitionsRetrieve,
	},
	'datasetDefinitions.datasetDefinitionsVersionsList': {
		input: DatarobotEndpointInputSchemas.datasetDefinitionsVersionsList,
		output: DatarobotEndpointOutputSchemas.datasetDefinitionsVersionsList,
	},
	'datasets.datasetsAccessControlList': {
		input: DatarobotEndpointInputSchemas.datasetsAccessControlList,
		output: DatarobotEndpointOutputSchemas.datasetsAccessControlList,
	},
	'datasets.datasetsAccessControlPatchMany': {
		input: DatarobotEndpointInputSchemas.datasetsAccessControlPatchMany,
		output: DatarobotEndpointOutputSchemas.datasetsAccessControlPatchMany,
	},
	'datasets.datasetsAllFeaturesDetailsList': {
		input: DatarobotEndpointInputSchemas.datasetsAllFeaturesDetailsList,
		output: DatarobotEndpointOutputSchemas.datasetsAllFeaturesDetailsList,
	},
	'datasets.datasetsDelete': {
		input: DatarobotEndpointInputSchemas.datasetsDelete,
		output: DatarobotEndpointOutputSchemas.datasetsDelete,
	},
	'datasets.datasetsDeletedPatchMany': {
		input: DatarobotEndpointInputSchemas.datasetsDeletedPatchMany,
		output: DatarobotEndpointOutputSchemas.datasetsDeletedPatchMany,
	},
	'datasets.datasetsDocumentsDataQualityLogFileList': {
		input:
			DatarobotEndpointInputSchemas.datasetsDocumentsDataQualityLogFileList,
		output:
			DatarobotEndpointOutputSchemas.datasetsDocumentsDataQualityLogFileList,
	},
	'datasets.datasetsDocumentsDataQualityLogList': {
		input: DatarobotEndpointInputSchemas.datasetsDocumentsDataQualityLogList,
		output: DatarobotEndpointOutputSchemas.datasetsDocumentsDataQualityLogList,
	},
	'datasets.datasetsFeatureHistogramsRetrieve': {
		input: DatarobotEndpointInputSchemas.datasetsFeatureHistogramsRetrieve,
		output: DatarobotEndpointOutputSchemas.datasetsFeatureHistogramsRetrieve,
	},
	'datasets.datasetsFeatureTransformsCreate': {
		input: DatarobotEndpointInputSchemas.datasetsFeatureTransformsCreate,
		output: DatarobotEndpointOutputSchemas.datasetsFeatureTransformsCreate,
	},
	'datasets.datasetsFeatureTransformsList': {
		input: DatarobotEndpointInputSchemas.datasetsFeatureTransformsList,
		output: DatarobotEndpointOutputSchemas.datasetsFeatureTransformsList,
	},
	'datasets.datasetsFeatureTransformsRetrieve': {
		input: DatarobotEndpointInputSchemas.datasetsFeatureTransformsRetrieve,
		output: DatarobotEndpointOutputSchemas.datasetsFeatureTransformsRetrieve,
	},
	'datasets.datasetsFeaturelistsCreate': {
		input: DatarobotEndpointInputSchemas.datasetsFeaturelistsCreate,
		output: DatarobotEndpointOutputSchemas.datasetsFeaturelistsCreate,
	},
	'datasets.datasetsFeaturelistsDelete': {
		input: DatarobotEndpointInputSchemas.datasetsFeaturelistsDelete,
		output: DatarobotEndpointOutputSchemas.datasetsFeaturelistsDelete,
	},
	'datasets.datasetsFeaturelistsList': {
		input: DatarobotEndpointInputSchemas.datasetsFeaturelistsList,
		output: DatarobotEndpointOutputSchemas.datasetsFeaturelistsList,
	},
	'datasets.datasetsFeaturelistsPatch': {
		input: DatarobotEndpointInputSchemas.datasetsFeaturelistsPatch,
		output: DatarobotEndpointOutputSchemas.datasetsFeaturelistsPatch,
	},
	'datasets.datasetsFeaturelistsRetrieve': {
		input: DatarobotEndpointInputSchemas.datasetsFeaturelistsRetrieve,
		output: DatarobotEndpointOutputSchemas.datasetsFeaturelistsRetrieve,
	},
	'datasets.datasetsFileList': {
		input: DatarobotEndpointInputSchemas.datasetsFileList,
		output: DatarobotEndpointOutputSchemas.datasetsFileList,
	},
	'datasets.datasetsFromDataEngineWorkspaceStateCreate': {
		input:
			DatarobotEndpointInputSchemas.datasetsFromDataEngineWorkspaceStateCreate,
		output:
			DatarobotEndpointOutputSchemas.datasetsFromDataEngineWorkspaceStateCreate,
	},
	'datasets.datasetsFromDataSourceCreate': {
		input: DatarobotEndpointInputSchemas.datasetsFromDataSourceCreate,
		output: DatarobotEndpointOutputSchemas.datasetsFromDataSourceCreate,
	},
	'datasets.datasetsFromFileCreate': {
		input: DatarobotEndpointInputSchemas.datasetsFromFileCreate,
		output: DatarobotEndpointOutputSchemas.datasetsFromFileCreate,
	},
	'datasets.datasetsFromHDFSCreate': {
		input: DatarobotEndpointInputSchemas.datasetsFromHDFSCreate,
		output: DatarobotEndpointOutputSchemas.datasetsFromHDFSCreate,
	},
	'datasets.datasetsFromRecipeCreate': {
		input: DatarobotEndpointInputSchemas.datasetsFromRecipeCreate,
		output: DatarobotEndpointOutputSchemas.datasetsFromRecipeCreate,
	},
	'datasets.datasetsFromStageCreate': {
		input: DatarobotEndpointInputSchemas.datasetsFromStageCreate,
		output: DatarobotEndpointOutputSchemas.datasetsFromStageCreate,
	},
	'datasets.datasetsFromURLCreate': {
		input: DatarobotEndpointInputSchemas.datasetsFromURLCreate,
		output: DatarobotEndpointOutputSchemas.datasetsFromURLCreate,
	},
	'datasets.datasetsImagesDataQualityLogFileList': {
		input: DatarobotEndpointInputSchemas.datasetsImagesDataQualityLogFileList,
		output: DatarobotEndpointOutputSchemas.datasetsImagesDataQualityLogFileList,
	},
	'datasets.datasetsImagesDataQualityLogList': {
		input: DatarobotEndpointInputSchemas.datasetsImagesDataQualityLogList,
		output: DatarobotEndpointOutputSchemas.datasetsImagesDataQualityLogList,
	},
	'datasets.datasetsList': {
		input: DatarobotEndpointInputSchemas.datasetsList,
		output: DatarobotEndpointOutputSchemas.datasetsList,
	},
	'datasets.datasetsPatch': {
		input: DatarobotEndpointInputSchemas.datasetsPatch,
		output: DatarobotEndpointOutputSchemas.datasetsPatch,
	},
	'datasets.datasetsPatchMany': {
		input: DatarobotEndpointInputSchemas.datasetsPatchMany,
		output: DatarobotEndpointOutputSchemas.datasetsPatchMany,
	},
	'datasets.datasetsPermissionsList': {
		input: DatarobotEndpointInputSchemas.datasetsPermissionsList,
		output: DatarobotEndpointOutputSchemas.datasetsPermissionsList,
	},
	'datasets.datasetsProjectsList': {
		input: DatarobotEndpointInputSchemas.datasetsProjectsList,
		output: DatarobotEndpointOutputSchemas.datasetsProjectsList,
	},
	'datasets.datasetsRefreshJobsCreate': {
		input: DatarobotEndpointInputSchemas.datasetsRefreshJobsCreate,
		output: DatarobotEndpointOutputSchemas.datasetsRefreshJobsCreate,
	},
	'datasets.datasetsRefreshJobsDelete': {
		input: DatarobotEndpointInputSchemas.datasetsRefreshJobsDelete,
		output: DatarobotEndpointOutputSchemas.datasetsRefreshJobsDelete,
	},
	'datasets.datasetsRefreshJobsExecutionResultsList': {
		input:
			DatarobotEndpointInputSchemas.datasetsRefreshJobsExecutionResultsList,
		output:
			DatarobotEndpointOutputSchemas.datasetsRefreshJobsExecutionResultsList,
	},
	'datasets.datasetsRefreshJobsList': {
		input: DatarobotEndpointInputSchemas.datasetsRefreshJobsList,
		output: DatarobotEndpointOutputSchemas.datasetsRefreshJobsList,
	},
	'datasets.datasetsRefreshJobsPatch': {
		input: DatarobotEndpointInputSchemas.datasetsRefreshJobsPatch,
		output: DatarobotEndpointOutputSchemas.datasetsRefreshJobsPatch,
	},
	'datasets.datasetsRefreshJobsRetrieve': {
		input: DatarobotEndpointInputSchemas.datasetsRefreshJobsRetrieve,
		output: DatarobotEndpointOutputSchemas.datasetsRefreshJobsRetrieve,
	},
	'datasets.datasetsRelationshipsCreate': {
		input: DatarobotEndpointInputSchemas.datasetsRelationshipsCreate,
		output: DatarobotEndpointOutputSchemas.datasetsRelationshipsCreate,
	},
	'datasets.datasetsRelationshipsDelete': {
		input: DatarobotEndpointInputSchemas.datasetsRelationshipsDelete,
		output: DatarobotEndpointOutputSchemas.datasetsRelationshipsDelete,
	},
	'datasets.datasetsRelationshipsList': {
		input: DatarobotEndpointInputSchemas.datasetsRelationshipsList,
		output: DatarobotEndpointOutputSchemas.datasetsRelationshipsList,
	},
	'datasets.datasetsRelationshipsPatch': {
		input: DatarobotEndpointInputSchemas.datasetsRelationshipsPatch,
		output: DatarobotEndpointOutputSchemas.datasetsRelationshipsPatch,
	},
	'datasets.datasetsRetrieve': {
		input: DatarobotEndpointInputSchemas.datasetsRetrieve,
		output: DatarobotEndpointOutputSchemas.datasetsRetrieve,
	},
	'datasets.datasetsSharedRolesList': {
		input: DatarobotEndpointInputSchemas.datasetsSharedRolesList,
		output: DatarobotEndpointOutputSchemas.datasetsSharedRolesList,
	},
	'datasets.datasetsSharedRolesPatchMany': {
		input: DatarobotEndpointInputSchemas.datasetsSharedRolesPatchMany,
		output: DatarobotEndpointOutputSchemas.datasetsSharedRolesPatchMany,
	},
	'datasets.datasetsVersionsAllFeaturesDetailsList': {
		input: DatarobotEndpointInputSchemas.datasetsVersionsAllFeaturesDetailsList,
		output:
			DatarobotEndpointOutputSchemas.datasetsVersionsAllFeaturesDetailsList,
	},
	'datasets.datasetsVersionsDelete': {
		input: DatarobotEndpointInputSchemas.datasetsVersionsDelete,
		output: DatarobotEndpointOutputSchemas.datasetsVersionsDelete,
	},
	'datasets.datasetsVersionsDeletedPatchMany': {
		input: DatarobotEndpointInputSchemas.datasetsVersionsDeletedPatchMany,
		output: DatarobotEndpointOutputSchemas.datasetsVersionsDeletedPatchMany,
	},
	'datasets.datasetsVersionsDocumentsDataQualityLogFileList': {
		input:
			DatarobotEndpointInputSchemas.datasetsVersionsDocumentsDataQualityLogFileList,
		output:
			DatarobotEndpointOutputSchemas.datasetsVersionsDocumentsDataQualityLogFileList,
	},
	'datasets.datasetsVersionsDocumentsDataQualityLogList': {
		input:
			DatarobotEndpointInputSchemas.datasetsVersionsDocumentsDataQualityLogList,
		output:
			DatarobotEndpointOutputSchemas.datasetsVersionsDocumentsDataQualityLogList,
	},
	'datasets.datasetsVersionsFeatureHistogramsRetrieve': {
		input:
			DatarobotEndpointInputSchemas.datasetsVersionsFeatureHistogramsRetrieve,
		output:
			DatarobotEndpointOutputSchemas.datasetsVersionsFeatureHistogramsRetrieve,
	},
	'datasets.datasetsVersionsFeaturelistsList': {
		input: DatarobotEndpointInputSchemas.datasetsVersionsFeaturelistsList,
		output: DatarobotEndpointOutputSchemas.datasetsVersionsFeaturelistsList,
	},
	'datasets.datasetsVersionsFeaturelistsRetrieve': {
		input: DatarobotEndpointInputSchemas.datasetsVersionsFeaturelistsRetrieve,
		output: DatarobotEndpointOutputSchemas.datasetsVersionsFeaturelistsRetrieve,
	},
	'datasets.datasetsVersionsFileList': {
		input: DatarobotEndpointInputSchemas.datasetsVersionsFileList,
		output: DatarobotEndpointOutputSchemas.datasetsVersionsFileList,
	},
	'datasets.datasetsVersionsFromDataEngineWorkspaceStateCreate': {
		input:
			DatarobotEndpointInputSchemas.datasetsVersionsFromDataEngineWorkspaceStateCreate,
		output:
			DatarobotEndpointOutputSchemas.datasetsVersionsFromDataEngineWorkspaceStateCreate,
	},
	'datasets.datasetsVersionsFromDataSourceCreate': {
		input: DatarobotEndpointInputSchemas.datasetsVersionsFromDataSourceCreate,
		output: DatarobotEndpointOutputSchemas.datasetsVersionsFromDataSourceCreate,
	},
	'datasets.datasetsVersionsFromFileCreate': {
		input: DatarobotEndpointInputSchemas.datasetsVersionsFromFileCreate,
		output: DatarobotEndpointOutputSchemas.datasetsVersionsFromFileCreate,
	},
	'datasets.datasetsVersionsFromHDFSCreate': {
		input: DatarobotEndpointInputSchemas.datasetsVersionsFromHDFSCreate,
		output: DatarobotEndpointOutputSchemas.datasetsVersionsFromHDFSCreate,
	},
	'datasets.datasetsVersionsFromLatestVersionCreate': {
		input:
			DatarobotEndpointInputSchemas.datasetsVersionsFromLatestVersionCreate,
		output:
			DatarobotEndpointOutputSchemas.datasetsVersionsFromLatestVersionCreate,
	},
	'datasets.datasetsVersionsFromRecipeCreate': {
		input: DatarobotEndpointInputSchemas.datasetsVersionsFromRecipeCreate,
		output: DatarobotEndpointOutputSchemas.datasetsVersionsFromRecipeCreate,
	},
	'datasets.datasetsVersionsFromStageCreate': {
		input: DatarobotEndpointInputSchemas.datasetsVersionsFromStageCreate,
		output: DatarobotEndpointOutputSchemas.datasetsVersionsFromStageCreate,
	},
	'datasets.datasetsVersionsFromURLCreate': {
		input: DatarobotEndpointInputSchemas.datasetsVersionsFromURLCreate,
		output: DatarobotEndpointOutputSchemas.datasetsVersionsFromURLCreate,
	},
	'datasets.datasetsVersionsFromVersionCreate': {
		input: DatarobotEndpointInputSchemas.datasetsVersionsFromVersionCreate,
		output: DatarobotEndpointOutputSchemas.datasetsVersionsFromVersionCreate,
	},
	'datasets.datasetsVersionsList': {
		input: DatarobotEndpointInputSchemas.datasetsVersionsList,
		output: DatarobotEndpointOutputSchemas.datasetsVersionsList,
	},
	'datasets.datasetsVersionsProjectsList': {
		input: DatarobotEndpointInputSchemas.datasetsVersionsProjectsList,
		output: DatarobotEndpointOutputSchemas.datasetsVersionsProjectsList,
	},
	'datasets.datasetsVersionsRetrieve': {
		input: DatarobotEndpointInputSchemas.datasetsVersionsRetrieve,
		output: DatarobotEndpointOutputSchemas.datasetsVersionsRetrieve,
	},
	'deletedCustomJobs.deletedCustomJobsList': {
		input: DatarobotEndpointInputSchemas.deletedCustomJobsList,
		output: DatarobotEndpointOutputSchemas.deletedCustomJobsList,
	},
	'deletedDeployments.deletedDeploymentsList': {
		input: DatarobotEndpointInputSchemas.deletedDeploymentsList,
		output: DatarobotEndpointOutputSchemas.deletedDeploymentsList,
	},
	'deletedDeployments.deletedDeploymentsPatchMany': {
		input: DatarobotEndpointInputSchemas.deletedDeploymentsPatchMany,
		output: DatarobotEndpointOutputSchemas.deletedDeploymentsPatchMany,
	},
	'deletedProjects.deletedProjectsList': {
		input: DatarobotEndpointInputSchemas.deletedProjectsList,
		output: DatarobotEndpointOutputSchemas.deletedProjectsList,
	},
	'deletedProjects.deletedProjectsPatch': {
		input: DatarobotEndpointInputSchemas.deletedProjectsPatch,
		output: DatarobotEndpointOutputSchemas.deletedProjectsPatch,
	},
	'deployments.deploymentsAccuracyList': {
		input: DatarobotEndpointInputSchemas.deploymentsAccuracyList,
		output: DatarobotEndpointOutputSchemas.deploymentsAccuracyList,
	},
	'deployments.deploymentsAccuracyMetricsList': {
		input: DatarobotEndpointInputSchemas.deploymentsAccuracyMetricsList,
		output: DatarobotEndpointOutputSchemas.deploymentsAccuracyMetricsList,
	},
	'deployments.deploymentsAccuracyMetricsPutMany': {
		input: DatarobotEndpointInputSchemas.deploymentsAccuracyMetricsPutMany,
		output: DatarobotEndpointOutputSchemas.deploymentsAccuracyMetricsPutMany,
	},
	'deployments.deploymentsAccuracyOverBatchList': {
		input: DatarobotEndpointInputSchemas.deploymentsAccuracyOverBatchList,
		output: DatarobotEndpointOutputSchemas.deploymentsAccuracyOverBatchList,
	},
	'deployments.deploymentsAccuracyOverSpaceList': {
		input: DatarobotEndpointInputSchemas.deploymentsAccuracyOverSpaceList,
		output: DatarobotEndpointOutputSchemas.deploymentsAccuracyOverSpaceList,
	},
	'deployments.deploymentsAccuracyOverTimeList': {
		input: DatarobotEndpointInputSchemas.deploymentsAccuracyOverTimeList,
		output: DatarobotEndpointOutputSchemas.deploymentsAccuracyOverTimeList,
	},
	'deployments.deploymentsActualsDataExportsCreate': {
		input: DatarobotEndpointInputSchemas.deploymentsActualsDataExportsCreate,
		output: DatarobotEndpointOutputSchemas.deploymentsActualsDataExportsCreate,
	},
	'deployments.deploymentsActualsDataExportsDelete': {
		input: DatarobotEndpointInputSchemas.deploymentsActualsDataExportsDelete,
		output: DatarobotEndpointOutputSchemas.deploymentsActualsDataExportsDelete,
	},
	'deployments.deploymentsActualsDataExportsList': {
		input: DatarobotEndpointInputSchemas.deploymentsActualsDataExportsList,
		output: DatarobotEndpointOutputSchemas.deploymentsActualsDataExportsList,
	},
	'deployments.deploymentsActualsDataExportsPatch': {
		input: DatarobotEndpointInputSchemas.deploymentsActualsDataExportsPatch,
		output: DatarobotEndpointOutputSchemas.deploymentsActualsDataExportsPatch,
	},
	'deployments.deploymentsActualsDataExportsRetrieve': {
		input: DatarobotEndpointInputSchemas.deploymentsActualsDataExportsRetrieve,
		output:
			DatarobotEndpointOutputSchemas.deploymentsActualsDataExportsRetrieve,
	},
	'deployments.deploymentsActualsFromDatasetCreate': {
		input: DatarobotEndpointInputSchemas.deploymentsActualsFromDatasetCreate,
		output: DatarobotEndpointOutputSchemas.deploymentsActualsFromDatasetCreate,
	},
	'deployments.deploymentsActualsFromJSONCreate': {
		input: DatarobotEndpointInputSchemas.deploymentsActualsFromJSONCreate,
		output: DatarobotEndpointOutputSchemas.deploymentsActualsFromJSONCreate,
	},
	'deployments.deploymentsAgentCardDeleteMany': {
		input: DatarobotEndpointInputSchemas.deploymentsAgentCardDeleteMany,
		output: DatarobotEndpointOutputSchemas.deploymentsAgentCardDeleteMany,
	},
	'deployments.deploymentsAgentCardList': {
		input: DatarobotEndpointInputSchemas.deploymentsAgentCardList,
		output: DatarobotEndpointOutputSchemas.deploymentsAgentCardList,
	},
	'deployments.deploymentsAgentCardPutMany': {
		input: DatarobotEndpointInputSchemas.deploymentsAgentCardPutMany,
		output: DatarobotEndpointOutputSchemas.deploymentsAgentCardPutMany,
	},
	'deployments.deploymentsBatchServiceStatsList': {
		input: DatarobotEndpointInputSchemas.deploymentsBatchServiceStatsList,
		output: DatarobotEndpointOutputSchemas.deploymentsBatchServiceStatsList,
	},
	'deployments.deploymentsCapabilitiesList': {
		input: DatarobotEndpointInputSchemas.deploymentsCapabilitiesList,
		output: DatarobotEndpointOutputSchemas.deploymentsCapabilitiesList,
	},
	'deployments.deploymentsChallengerPredictionsCreate': {
		input: DatarobotEndpointInputSchemas.deploymentsChallengerPredictionsCreate,
		output:
			DatarobotEndpointOutputSchemas.deploymentsChallengerPredictionsCreate,
	},
	'deployments.deploymentsChallengerReplaySettingsList': {
		input:
			DatarobotEndpointInputSchemas.deploymentsChallengerReplaySettingsList,
		output:
			DatarobotEndpointOutputSchemas.deploymentsChallengerReplaySettingsList,
	},
	'deployments.deploymentsChallengerReplaySettingsPatchMany': {
		input:
			DatarobotEndpointInputSchemas.deploymentsChallengerReplaySettingsPatchMany,
		output:
			DatarobotEndpointOutputSchemas.deploymentsChallengerReplaySettingsPatchMany,
	},
	'deployments.deploymentsChallengersCreate': {
		input: DatarobotEndpointInputSchemas.deploymentsChallengersCreate,
		output: DatarobotEndpointOutputSchemas.deploymentsChallengersCreate,
	},
	'deployments.deploymentsChallengersDelete': {
		input: DatarobotEndpointInputSchemas.deploymentsChallengersDelete,
		output: DatarobotEndpointOutputSchemas.deploymentsChallengersDelete,
	},
	'deployments.deploymentsChallengersList': {
		input: DatarobotEndpointInputSchemas.deploymentsChallengersList,
		output: DatarobotEndpointOutputSchemas.deploymentsChallengersList,
	},
	'deployments.deploymentsChallengersPatch': {
		input: DatarobotEndpointInputSchemas.deploymentsChallengersPatch,
		output: DatarobotEndpointOutputSchemas.deploymentsChallengersPatch,
	},
	'deployments.deploymentsChallengersRetrieve': {
		input: DatarobotEndpointInputSchemas.deploymentsChallengersRetrieve,
		output: DatarobotEndpointOutputSchemas.deploymentsChallengersRetrieve,
	},
	'deployments.deploymentsChampionModelPackageList': {
		input: DatarobotEndpointInputSchemas.deploymentsChampionModelPackageList,
		output: DatarobotEndpointOutputSchemas.deploymentsChampionModelPackageList,
	},
	'deployments.deploymentsCustomMetricsBatchSummaryRetrieve': {
		input:
			DatarobotEndpointInputSchemas.deploymentsCustomMetricsBatchSummaryRetrieve,
		output:
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsBatchSummaryRetrieve,
	},
	'deployments.deploymentsCustomMetricsBulkBatchSummaryRetrieve': {
		input:
			DatarobotEndpointInputSchemas.deploymentsCustomMetricsBulkBatchSummaryRetrieve,
		output:
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsBulkBatchSummaryRetrieve,
	},
	'deployments.deploymentsCustomMetricsBulkSummaryRetrieve': {
		input:
			DatarobotEndpointInputSchemas.deploymentsCustomMetricsBulkSummaryRetrieve,
		output:
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsBulkSummaryRetrieve,
	},
	'deployments.deploymentsCustomMetricsBulkUploadCreate': {
		input:
			DatarobotEndpointInputSchemas.deploymentsCustomMetricsBulkUploadCreate,
		output:
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsBulkUploadCreate,
	},
	'deployments.deploymentsCustomMetricsCreate': {
		input: DatarobotEndpointInputSchemas.deploymentsCustomMetricsCreate,
		output: DatarobotEndpointOutputSchemas.deploymentsCustomMetricsCreate,
	},
	'deployments.deploymentsCustomMetricsDelete': {
		input: DatarobotEndpointInputSchemas.deploymentsCustomMetricsDelete,
		output: DatarobotEndpointOutputSchemas.deploymentsCustomMetricsDelete,
	},
	'deployments.deploymentsCustomMetricsFromCustomJobCreate': {
		input:
			DatarobotEndpointInputSchemas.deploymentsCustomMetricsFromCustomJobCreate,
		output:
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsFromCustomJobCreate,
	},
	'deployments.deploymentsCustomMetricsFromDatasetCreate': {
		input:
			DatarobotEndpointInputSchemas.deploymentsCustomMetricsFromDatasetCreate,
		output:
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsFromDatasetCreate,
	},
	'deployments.deploymentsCustomMetricsFromJSONCreate': {
		input: DatarobotEndpointInputSchemas.deploymentsCustomMetricsFromJSONCreate,
		output:
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsFromJSONCreate,
	},
	'deployments.deploymentsCustomMetricsList': {
		input: DatarobotEndpointInputSchemas.deploymentsCustomMetricsList,
		output: DatarobotEndpointOutputSchemas.deploymentsCustomMetricsList,
	},
	'deployments.deploymentsCustomMetricsPatch': {
		input: DatarobotEndpointInputSchemas.deploymentsCustomMetricsPatch,
		output: DatarobotEndpointOutputSchemas.deploymentsCustomMetricsPatch,
	},
	'deployments.deploymentsCustomMetricsRetrieve': {
		input: DatarobotEndpointInputSchemas.deploymentsCustomMetricsRetrieve,
		output: DatarobotEndpointOutputSchemas.deploymentsCustomMetricsRetrieve,
	},
	'deployments.deploymentsCustomMetricsSummaryRetrieve': {
		input:
			DatarobotEndpointInputSchemas.deploymentsCustomMetricsSummaryRetrieve,
		output:
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsSummaryRetrieve,
	},
	'deployments.deploymentsCustomMetricsValuesOverBatchList': {
		input:
			DatarobotEndpointInputSchemas.deploymentsCustomMetricsValuesOverBatchList,
		output:
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsValuesOverBatchList,
	},
	'deployments.deploymentsCustomMetricsValuesOverSpaceList': {
		input:
			DatarobotEndpointInputSchemas.deploymentsCustomMetricsValuesOverSpaceList,
		output:
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsValuesOverSpaceList,
	},
	'deployments.deploymentsCustomMetricsValuesOverTimeList': {
		input:
			DatarobotEndpointInputSchemas.deploymentsCustomMetricsValuesOverTimeList,
		output:
			DatarobotEndpointOutputSchemas.deploymentsCustomMetricsValuesOverTimeList,
	},
	'deployments.deploymentsDataQualityViewList': {
		input: DatarobotEndpointInputSchemas.deploymentsDataQualityViewList,
		output: DatarobotEndpointOutputSchemas.deploymentsDataQualityViewList,
	},
	'deployments.deploymentsDelete': {
		input: DatarobotEndpointInputSchemas.deploymentsDelete,
		output: DatarobotEndpointOutputSchemas.deploymentsDelete,
	},
	'deployments.deploymentsFairnessScoresOverTimeList': {
		input: DatarobotEndpointInputSchemas.deploymentsFairnessScoresOverTimeList,
		output:
			DatarobotEndpointOutputSchemas.deploymentsFairnessScoresOverTimeList,
	},
	'deployments.deploymentsFeatureDriftList': {
		input: DatarobotEndpointInputSchemas.deploymentsFeatureDriftList,
		output: DatarobotEndpointOutputSchemas.deploymentsFeatureDriftList,
	},
	'deployments.deploymentsFeatureDriftOverBatchList': {
		input: DatarobotEndpointInputSchemas.deploymentsFeatureDriftOverBatchList,
		output: DatarobotEndpointOutputSchemas.deploymentsFeatureDriftOverBatchList,
	},
	'deployments.deploymentsFeatureDriftOverSpaceList': {
		input: DatarobotEndpointInputSchemas.deploymentsFeatureDriftOverSpaceList,
		output: DatarobotEndpointOutputSchemas.deploymentsFeatureDriftOverSpaceList,
	},
	'deployments.deploymentsFeatureDriftOverTimeList': {
		input: DatarobotEndpointInputSchemas.deploymentsFeatureDriftOverTimeList,
		output: DatarobotEndpointOutputSchemas.deploymentsFeatureDriftOverTimeList,
	},
	'deployments.deploymentsFeaturesList': {
		input: DatarobotEndpointInputSchemas.deploymentsFeaturesList,
		output: DatarobotEndpointOutputSchemas.deploymentsFeaturesList,
	},
	'deployments.deploymentsFromLearningModelCreate': {
		input: DatarobotEndpointInputSchemas.deploymentsFromLearningModelCreate,
		output: DatarobotEndpointOutputSchemas.deploymentsFromLearningModelCreate,
	},
	'deployments.deploymentsFromModelPackageCreate': {
		input: DatarobotEndpointInputSchemas.deploymentsFromModelPackageCreate,
		output: DatarobotEndpointOutputSchemas.deploymentsFromModelPackageCreate,
	},
	'deployments.deploymentsHealthSettingsDefaultsList': {
		input: DatarobotEndpointInputSchemas.deploymentsHealthSettingsDefaultsList,
		output:
			DatarobotEndpointOutputSchemas.deploymentsHealthSettingsDefaultsList,
	},
	'deployments.deploymentsHealthSettingsList': {
		input: DatarobotEndpointInputSchemas.deploymentsHealthSettingsList,
		output: DatarobotEndpointOutputSchemas.deploymentsHealthSettingsList,
	},
	'deployments.deploymentsHealthSettingsPatchMany': {
		input: DatarobotEndpointInputSchemas.deploymentsHealthSettingsPatchMany,
		output: DatarobotEndpointOutputSchemas.deploymentsHealthSettingsPatchMany,
	},
	'deployments.deploymentsHumilityStatsList': {
		input: DatarobotEndpointInputSchemas.deploymentsHumilityStatsList,
		output: DatarobotEndpointOutputSchemas.deploymentsHumilityStatsList,
	},
	'deployments.deploymentsHumilityStatsOverTimeList': {
		input: DatarobotEndpointInputSchemas.deploymentsHumilityStatsOverTimeList,
		output: DatarobotEndpointOutputSchemas.deploymentsHumilityStatsOverTimeList,
	},
	'deployments.deploymentsLimitsList': {
		input: DatarobotEndpointInputSchemas.deploymentsLimitsList,
		output: DatarobotEndpointOutputSchemas.deploymentsLimitsList,
	},
	'deployments.deploymentsList': {
		input: DatarobotEndpointInputSchemas.deploymentsList,
		output: DatarobotEndpointOutputSchemas.deploymentsList,
	},
	'deployments.deploymentsMigrateDPStoServerlessCreate': {
		input:
			DatarobotEndpointInputSchemas.deploymentsMigrateDPStoServerlessCreate,
		output:
			DatarobotEndpointOutputSchemas.deploymentsMigrateDPStoServerlessCreate,
	},
	'deployments.deploymentsModelHistoryList': {
		input: DatarobotEndpointInputSchemas.deploymentsModelHistoryList,
		output: DatarobotEndpointOutputSchemas.deploymentsModelHistoryList,
	},
	'deployments.deploymentsModelPatchMany': {
		input: DatarobotEndpointInputSchemas.deploymentsModelPatchMany,
		output: DatarobotEndpointOutputSchemas.deploymentsModelPatchMany,
	},
	'deployments.deploymentsModelSecondaryDatasetConfigurationHistoryList': {
		input:
			DatarobotEndpointInputSchemas.deploymentsModelSecondaryDatasetConfigurationHistoryList,
		output:
			DatarobotEndpointOutputSchemas.deploymentsModelSecondaryDatasetConfigurationHistoryList,
	},
	'deployments.deploymentsModelSecondaryDatasetConfigurationList': {
		input:
			DatarobotEndpointInputSchemas.deploymentsModelSecondaryDatasetConfigurationList,
		output:
			DatarobotEndpointOutputSchemas.deploymentsModelSecondaryDatasetConfigurationList,
	},
	'deployments.deploymentsModelSecondaryDatasetConfigurationPatchMany': {
		input:
			DatarobotEndpointInputSchemas.deploymentsModelSecondaryDatasetConfigurationPatchMany,
		output:
			DatarobotEndpointOutputSchemas.deploymentsModelSecondaryDatasetConfigurationPatchMany,
	},
	'deployments.deploymentsModelValidationCreate': {
		input: DatarobotEndpointInputSchemas.deploymentsModelValidationCreate,
		output: DatarobotEndpointOutputSchemas.deploymentsModelValidationCreate,
	},
	'deployments.deploymentsMonitoringBatchLimitsList': {
		input: DatarobotEndpointInputSchemas.deploymentsMonitoringBatchLimitsList,
		output: DatarobotEndpointOutputSchemas.deploymentsMonitoringBatchLimitsList,
	},
	'deployments.deploymentsMonitoringBatchesCreate': {
		input: DatarobotEndpointInputSchemas.deploymentsMonitoringBatchesCreate,
		output: DatarobotEndpointOutputSchemas.deploymentsMonitoringBatchesCreate,
	},
	'deployments.deploymentsMonitoringBatchesDelete': {
		input: DatarobotEndpointInputSchemas.deploymentsMonitoringBatchesDelete,
		output: DatarobotEndpointOutputSchemas.deploymentsMonitoringBatchesDelete,
	},
	'deployments.deploymentsMonitoringBatchesList': {
		input: DatarobotEndpointInputSchemas.deploymentsMonitoringBatchesList,
		output: DatarobotEndpointOutputSchemas.deploymentsMonitoringBatchesList,
	},
	'deployments.deploymentsMonitoringBatchesModelsList': {
		input: DatarobotEndpointInputSchemas.deploymentsMonitoringBatchesModelsList,
		output:
			DatarobotEndpointOutputSchemas.deploymentsMonitoringBatchesModelsList,
	},
	'deployments.deploymentsMonitoringBatchesModelsPatch': {
		input:
			DatarobotEndpointInputSchemas.deploymentsMonitoringBatchesModelsPatch,
		output:
			DatarobotEndpointOutputSchemas.deploymentsMonitoringBatchesModelsPatch,
	},
	'deployments.deploymentsMonitoringBatchesModelsRetrieve': {
		input:
			DatarobotEndpointInputSchemas.deploymentsMonitoringBatchesModelsRetrieve,
		output:
			DatarobotEndpointOutputSchemas.deploymentsMonitoringBatchesModelsRetrieve,
	},
	'deployments.deploymentsMonitoringBatchesPatch': {
		input: DatarobotEndpointInputSchemas.deploymentsMonitoringBatchesPatch,
		output: DatarobotEndpointOutputSchemas.deploymentsMonitoringBatchesPatch,
	},
	'deployments.deploymentsMonitoringBatchesRetrieve': {
		input: DatarobotEndpointInputSchemas.deploymentsMonitoringBatchesRetrieve,
		output: DatarobotEndpointOutputSchemas.deploymentsMonitoringBatchesRetrieve,
	},
	'deployments.deploymentsMonitoringDataDeletionsCreate': {
		input:
			DatarobotEndpointInputSchemas.deploymentsMonitoringDataDeletionsCreate,
		output:
			DatarobotEndpointOutputSchemas.deploymentsMonitoringDataDeletionsCreate,
	},
	'deployments.deploymentsOnDemandReportsCreate': {
		input: DatarobotEndpointInputSchemas.deploymentsOnDemandReportsCreate,
		output: DatarobotEndpointOutputSchemas.deploymentsOnDemandReportsCreate,
	},
	'deployments.deploymentsPatch': {
		input: DatarobotEndpointInputSchemas.deploymentsPatch,
		output: DatarobotEndpointOutputSchemas.deploymentsPatch,
	},
	'deployments.deploymentsPredictionDataExportsCreate': {
		input: DatarobotEndpointInputSchemas.deploymentsPredictionDataExportsCreate,
		output:
			DatarobotEndpointOutputSchemas.deploymentsPredictionDataExportsCreate,
	},
	'deployments.deploymentsPredictionDataExportsList': {
		input: DatarobotEndpointInputSchemas.deploymentsPredictionDataExportsList,
		output: DatarobotEndpointOutputSchemas.deploymentsPredictionDataExportsList,
	},
	'deployments.deploymentsPredictionDataExportsPatch': {
		input: DatarobotEndpointInputSchemas.deploymentsPredictionDataExportsPatch,
		output:
			DatarobotEndpointOutputSchemas.deploymentsPredictionDataExportsPatch,
	},
	'deployments.deploymentsPredictionDataExportsRetrieve': {
		input:
			DatarobotEndpointInputSchemas.deploymentsPredictionDataExportsRetrieve,
		output:
			DatarobotEndpointOutputSchemas.deploymentsPredictionDataExportsRetrieve,
	},
	'deployments.deploymentsPredictionInputsFromDatasetCreate': {
		input:
			DatarobotEndpointInputSchemas.deploymentsPredictionInputsFromDatasetCreate,
		output:
			DatarobotEndpointOutputSchemas.deploymentsPredictionInputsFromDatasetCreate,
	},
	'deployments.deploymentsPredictionResultsList': {
		input: DatarobotEndpointInputSchemas.deploymentsPredictionResultsList,
		output: DatarobotEndpointOutputSchemas.deploymentsPredictionResultsList,
	},
	'deployments.deploymentsPredictionsOverBatchList': {
		input: DatarobotEndpointInputSchemas.deploymentsPredictionsOverBatchList,
		output: DatarobotEndpointOutputSchemas.deploymentsPredictionsOverBatchList,
	},
	'deployments.deploymentsPredictionsOverSpaceList': {
		input: DatarobotEndpointInputSchemas.deploymentsPredictionsOverSpaceList,
		output: DatarobotEndpointOutputSchemas.deploymentsPredictionsOverSpaceList,
	},
	'deployments.deploymentsPredictionsOverTimeList': {
		input: DatarobotEndpointInputSchemas.deploymentsPredictionsOverTimeList,
		output: DatarobotEndpointOutputSchemas.deploymentsPredictionsOverTimeList,
	},
	'deployments.deploymentsPredictionsVsActualsOverBatchList': {
		input:
			DatarobotEndpointInputSchemas.deploymentsPredictionsVsActualsOverBatchList,
		output:
			DatarobotEndpointOutputSchemas.deploymentsPredictionsVsActualsOverBatchList,
	},
	'deployments.deploymentsPredictionsVsActualsOverSpaceList': {
		input:
			DatarobotEndpointInputSchemas.deploymentsPredictionsVsActualsOverSpaceList,
		output:
			DatarobotEndpointOutputSchemas.deploymentsPredictionsVsActualsOverSpaceList,
	},
	'deployments.deploymentsPredictionsVsActualsOverTimeList': {
		input:
			DatarobotEndpointInputSchemas.deploymentsPredictionsVsActualsOverTimeList,
		output:
			DatarobotEndpointOutputSchemas.deploymentsPredictionsVsActualsOverTimeList,
	},
	'deployments.deploymentsQuotaConsumersList': {
		input: DatarobotEndpointInputSchemas.deploymentsQuotaConsumersList,
		output: DatarobotEndpointOutputSchemas.deploymentsQuotaConsumersList,
	},
	'deployments.deploymentsRetrainingPoliciesCreate': {
		input: DatarobotEndpointInputSchemas.deploymentsRetrainingPoliciesCreate,
		output: DatarobotEndpointOutputSchemas.deploymentsRetrainingPoliciesCreate,
	},
	'deployments.deploymentsRetrainingPoliciesDelete': {
		input: DatarobotEndpointInputSchemas.deploymentsRetrainingPoliciesDelete,
		output: DatarobotEndpointOutputSchemas.deploymentsRetrainingPoliciesDelete,
	},
	'deployments.deploymentsRetrainingPoliciesList': {
		input: DatarobotEndpointInputSchemas.deploymentsRetrainingPoliciesList,
		output: DatarobotEndpointOutputSchemas.deploymentsRetrainingPoliciesList,
	},
	'deployments.deploymentsRetrainingPoliciesPatch': {
		input: DatarobotEndpointInputSchemas.deploymentsRetrainingPoliciesPatch,
		output: DatarobotEndpointOutputSchemas.deploymentsRetrainingPoliciesPatch,
	},
	'deployments.deploymentsRetrainingPoliciesRetrieve': {
		input: DatarobotEndpointInputSchemas.deploymentsRetrainingPoliciesRetrieve,
		output:
			DatarobotEndpointOutputSchemas.deploymentsRetrainingPoliciesRetrieve,
	},
	'deployments.deploymentsRetrainingPoliciesRunsCreate': {
		input:
			DatarobotEndpointInputSchemas.deploymentsRetrainingPoliciesRunsCreate,
		output:
			DatarobotEndpointOutputSchemas.deploymentsRetrainingPoliciesRunsCreate,
	},
	'deployments.deploymentsRetrainingPoliciesRunsList': {
		input: DatarobotEndpointInputSchemas.deploymentsRetrainingPoliciesRunsList,
		output:
			DatarobotEndpointOutputSchemas.deploymentsRetrainingPoliciesRunsList,
	},
	'deployments.deploymentsRetrainingPoliciesRunsPatch': {
		input: DatarobotEndpointInputSchemas.deploymentsRetrainingPoliciesRunsPatch,
		output:
			DatarobotEndpointOutputSchemas.deploymentsRetrainingPoliciesRunsPatch,
	},
	'deployments.deploymentsRetrainingPoliciesRunsRetrieve': {
		input:
			DatarobotEndpointInputSchemas.deploymentsRetrainingPoliciesRunsRetrieve,
		output:
			DatarobotEndpointOutputSchemas.deploymentsRetrainingPoliciesRunsRetrieve,
	},
	'deployments.deploymentsRetrainingSettingsList': {
		input: DatarobotEndpointInputSchemas.deploymentsRetrainingSettingsList,
		output: DatarobotEndpointOutputSchemas.deploymentsRetrainingSettingsList,
	},
	'deployments.deploymentsRetrainingSettingsPatchMany': {
		input: DatarobotEndpointInputSchemas.deploymentsRetrainingSettingsPatchMany,
		output:
			DatarobotEndpointOutputSchemas.deploymentsRetrainingSettingsPatchMany,
	},
	'deployments.deploymentsRetrieve': {
		input: DatarobotEndpointInputSchemas.deploymentsRetrieve,
		output: DatarobotEndpointOutputSchemas.deploymentsRetrieve,
	},
	'deployments.deploymentsRuntimeParametersList': {
		input: DatarobotEndpointInputSchemas.deploymentsRuntimeParametersList,
		output: DatarobotEndpointOutputSchemas.deploymentsRuntimeParametersList,
	},
	'deployments.deploymentsRuntimeParametersPutMany': {
		input: DatarobotEndpointInputSchemas.deploymentsRuntimeParametersPutMany,
		output: DatarobotEndpointOutputSchemas.deploymentsRuntimeParametersPutMany,
	},
	'deployments.deploymentsScoringCodeBuildsCreate': {
		input: DatarobotEndpointInputSchemas.deploymentsScoringCodeBuildsCreate,
		output: DatarobotEndpointOutputSchemas.deploymentsScoringCodeBuildsCreate,
	},
	'deployments.deploymentsScoringCodeList': {
		input: DatarobotEndpointInputSchemas.deploymentsScoringCodeList,
		output: DatarobotEndpointOutputSchemas.deploymentsScoringCodeList,
	},
	'deployments.deploymentsSegmentAttributesList': {
		input: DatarobotEndpointInputSchemas.deploymentsSegmentAttributesList,
		output: DatarobotEndpointOutputSchemas.deploymentsSegmentAttributesList,
	},
	'deployments.deploymentsSegmentValuesList': {
		input: DatarobotEndpointInputSchemas.deploymentsSegmentValuesList,
		output: DatarobotEndpointOutputSchemas.deploymentsSegmentValuesList,
	},
	'deployments.deploymentsServiceStatsList': {
		input: DatarobotEndpointInputSchemas.deploymentsServiceStatsList,
		output: DatarobotEndpointOutputSchemas.deploymentsServiceStatsList,
	},
	'deployments.deploymentsServiceStatsOverBatchList': {
		input: DatarobotEndpointInputSchemas.deploymentsServiceStatsOverBatchList,
		output: DatarobotEndpointOutputSchemas.deploymentsServiceStatsOverBatchList,
	},
	'deployments.deploymentsServiceStatsOverTimeList': {
		input: DatarobotEndpointInputSchemas.deploymentsServiceStatsOverTimeList,
		output: DatarobotEndpointOutputSchemas.deploymentsServiceStatsOverTimeList,
	},
	'deployments.deploymentsSettingsChecklistList': {
		input: DatarobotEndpointInputSchemas.deploymentsSettingsChecklistList,
		output: DatarobotEndpointOutputSchemas.deploymentsSettingsChecklistList,
	},
	'deployments.deploymentsSettingsList': {
		input: DatarobotEndpointInputSchemas.deploymentsSettingsList,
		output: DatarobotEndpointOutputSchemas.deploymentsSettingsList,
	},
	'deployments.deploymentsSettingsPatchMany': {
		input: DatarobotEndpointInputSchemas.deploymentsSettingsPatchMany,
		output: DatarobotEndpointOutputSchemas.deploymentsSettingsPatchMany,
	},
	'deployments.deploymentsSharedRolesList': {
		input: DatarobotEndpointInputSchemas.deploymentsSharedRolesList,
		output: DatarobotEndpointOutputSchemas.deploymentsSharedRolesList,
	},
	'deployments.deploymentsSharedRolesPatchMany': {
		input: DatarobotEndpointInputSchemas.deploymentsSharedRolesPatchMany,
		output: DatarobotEndpointOutputSchemas.deploymentsSharedRolesPatchMany,
	},
	'deployments.deploymentsStatusPatchMany': {
		input: DatarobotEndpointInputSchemas.deploymentsStatusPatchMany,
		output: DatarobotEndpointOutputSchemas.deploymentsStatusPatchMany,
	},
	'deployments.deploymentsTargetDriftList': {
		input: DatarobotEndpointInputSchemas.deploymentsTargetDriftList,
		output: DatarobotEndpointOutputSchemas.deploymentsTargetDriftList,
	},
	'deployments.deploymentsTrainingDataExportsCreate': {
		input: DatarobotEndpointInputSchemas.deploymentsTrainingDataExportsCreate,
		output: DatarobotEndpointOutputSchemas.deploymentsTrainingDataExportsCreate,
	},
	'deployments.deploymentsTrainingDataExportsList': {
		input: DatarobotEndpointInputSchemas.deploymentsTrainingDataExportsList,
		output: DatarobotEndpointOutputSchemas.deploymentsTrainingDataExportsList,
	},
	'deployments.deploymentsTrainingDataExportsRetrieve': {
		input: DatarobotEndpointInputSchemas.deploymentsTrainingDataExportsRetrieve,
		output:
			DatarobotEndpointOutputSchemas.deploymentsTrainingDataExportsRetrieve,
	},
	'entitlements.entitlementsApplyEntitlementSetsCreate': {
		input: DatarobotEndpointInputSchemas.entitlementsApplyEntitlementSetsCreate,
		output:
			DatarobotEndpointOutputSchemas.entitlementsApplyEntitlementSetsCreate,
	},
	'entitlements.entitlementsEntitlementSetLeasesList': {
		input: DatarobotEndpointInputSchemas.entitlementsEntitlementSetLeasesList,
		output: DatarobotEndpointOutputSchemas.entitlementsEntitlementSetLeasesList,
	},
	'entitlements.entitlementsEvaluateCreate': {
		input: DatarobotEndpointInputSchemas.entitlementsEvaluateCreate,
		output: DatarobotEndpointOutputSchemas.entitlementsEvaluateCreate,
	},
	'entityNotificationChannels.entityNotificationChannelsCreate': {
		input: DatarobotEndpointInputSchemas.entityNotificationChannelsCreate,
		output: DatarobotEndpointOutputSchemas.entityNotificationChannelsCreate,
	},
	'entityNotificationChannels.entityNotificationChannelsDelete': {
		input: DatarobotEndpointInputSchemas.entityNotificationChannelsDelete,
		output: DatarobotEndpointOutputSchemas.entityNotificationChannelsDelete,
	},
	'entityNotificationChannels.entityNotificationChannelsList': {
		input: DatarobotEndpointInputSchemas.entityNotificationChannelsList,
		output: DatarobotEndpointOutputSchemas.entityNotificationChannelsList,
	},
	'entityNotificationChannels.entityNotificationChannelsPut': {
		input: DatarobotEndpointInputSchemas.entityNotificationChannelsPut,
		output: DatarobotEndpointOutputSchemas.entityNotificationChannelsPut,
	},
	'entityNotificationChannels.entityNotificationChannelsRetrieve': {
		input: DatarobotEndpointInputSchemas.entityNotificationChannelsRetrieve,
		output: DatarobotEndpointOutputSchemas.entityNotificationChannelsRetrieve,
	},
	'entityNotificationPolicies.entityNotificationPoliciesCreate': {
		input: DatarobotEndpointInputSchemas.entityNotificationPoliciesCreate,
		output: DatarobotEndpointOutputSchemas.entityNotificationPoliciesCreate,
	},
	'entityNotificationPolicies.entityNotificationPoliciesDelete': {
		input: DatarobotEndpointInputSchemas.entityNotificationPoliciesDelete,
		output: DatarobotEndpointOutputSchemas.entityNotificationPoliciesDelete,
	},
	'entityNotificationPolicies.entityNotificationPoliciesList': {
		input: DatarobotEndpointInputSchemas.entityNotificationPoliciesList,
		output: DatarobotEndpointOutputSchemas.entityNotificationPoliciesList,
	},
	'entityNotificationPolicies.entityNotificationPoliciesPut': {
		input: DatarobotEndpointInputSchemas.entityNotificationPoliciesPut,
		output: DatarobotEndpointOutputSchemas.entityNotificationPoliciesPut,
	},
	'entityNotificationPolicies.entityNotificationPoliciesRetrieve': {
		input: DatarobotEndpointInputSchemas.entityNotificationPoliciesRetrieve,
		output: DatarobotEndpointOutputSchemas.entityNotificationPoliciesRetrieve,
	},
	'entityNotificationPolicyTemplates.entityNotificationPolicyTemplatesCreate': {
		input:
			DatarobotEndpointInputSchemas.entityNotificationPolicyTemplatesCreate,
		output:
			DatarobotEndpointOutputSchemas.entityNotificationPolicyTemplatesCreate,
	},
	'entityNotificationPolicyTemplates.entityNotificationPolicyTemplatesDelete': {
		input:
			DatarobotEndpointInputSchemas.entityNotificationPolicyTemplatesDelete,
		output:
			DatarobotEndpointOutputSchemas.entityNotificationPolicyTemplatesDelete,
	},
	'entityNotificationPolicyTemplates.entityNotificationPolicyTemplatesList': {
		input: DatarobotEndpointInputSchemas.entityNotificationPolicyTemplatesList,
		output:
			DatarobotEndpointOutputSchemas.entityNotificationPolicyTemplatesList,
	},
	'entityNotificationPolicyTemplates.entityNotificationPolicyTemplatesPut': {
		input: DatarobotEndpointInputSchemas.entityNotificationPolicyTemplatesPut,
		output: DatarobotEndpointOutputSchemas.entityNotificationPolicyTemplatesPut,
	},
	'entityNotificationPolicyTemplates.entityNotificationPolicyTemplatesRelatedPoliciesList':
		{
			input:
				DatarobotEndpointInputSchemas.entityNotificationPolicyTemplatesRelatedPoliciesList,
			output:
				DatarobotEndpointOutputSchemas.entityNotificationPolicyTemplatesRelatedPoliciesList,
		},
	'entityNotificationPolicyTemplates.entityNotificationPolicyTemplatesRetrieve':
		{
			input:
				DatarobotEndpointInputSchemas.entityNotificationPolicyTemplatesRetrieve,
			output:
				DatarobotEndpointOutputSchemas.entityNotificationPolicyTemplatesRetrieve,
		},
	'entityNotificationPolicyTemplates.entityNotificationPolicyTemplatesSharedRolesList':
		{
			input:
				DatarobotEndpointInputSchemas.entityNotificationPolicyTemplatesSharedRolesList,
			output:
				DatarobotEndpointOutputSchemas.entityNotificationPolicyTemplatesSharedRolesList,
		},
	'entityNotificationPolicyTemplates.entityNotificationPolicyTemplatesSharedRolesPatchMany':
		{
			input:
				DatarobotEndpointInputSchemas.entityNotificationPolicyTemplatesSharedRolesPatchMany,
			output:
				DatarobotEndpointOutputSchemas.entityNotificationPolicyTemplatesSharedRolesPatchMany,
		},
	'entityTags.entityTagsCreate': {
		input: DatarobotEndpointInputSchemas.entityTagsCreate,
		output: DatarobotEndpointOutputSchemas.entityTagsCreate,
	},
	'entityTags.entityTagsDelete': {
		input: DatarobotEndpointInputSchemas.entityTagsDelete,
		output: DatarobotEndpointOutputSchemas.entityTagsDelete,
	},
	'entityTags.entityTagsList': {
		input: DatarobotEndpointInputSchemas.entityTagsList,
		output: DatarobotEndpointOutputSchemas.entityTagsList,
	},
	'entityTags.entityTagsPatch': {
		input: DatarobotEndpointInputSchemas.entityTagsPatch,
		output: DatarobotEndpointOutputSchemas.entityTagsPatch,
	},
	'eventLogs.eventLogsEventsList': {
		input: DatarobotEndpointInputSchemas.eventLogsEventsList,
		output: DatarobotEndpointOutputSchemas.eventLogsEventsList,
	},
	'eventLogs.eventLogsList': {
		input: DatarobotEndpointInputSchemas.eventLogsList,
		output: DatarobotEndpointOutputSchemas.eventLogsList,
	},
	'eventLogs.eventLogsPredictionUsageList': {
		input: DatarobotEndpointInputSchemas.eventLogsPredictionUsageList,
		output: DatarobotEndpointOutputSchemas.eventLogsPredictionUsageList,
	},
	'eventLogs.eventLogsRetrieve': {
		input: DatarobotEndpointInputSchemas.eventLogsRetrieve,
		output: DatarobotEndpointOutputSchemas.eventLogsRetrieve,
	},
	'executionEnvironments.executionEnvironmentsAccessControlList': {
		input: DatarobotEndpointInputSchemas.executionEnvironmentsAccessControlList,
		output:
			DatarobotEndpointOutputSchemas.executionEnvironmentsAccessControlList,
	},
	'executionEnvironments.executionEnvironmentsAccessControlPatchMany': {
		input:
			DatarobotEndpointInputSchemas.executionEnvironmentsAccessControlPatchMany,
		output:
			DatarobotEndpointOutputSchemas.executionEnvironmentsAccessControlPatchMany,
	},
	'executionEnvironments.executionEnvironmentsCreate': {
		input: DatarobotEndpointInputSchemas.executionEnvironmentsCreate,
		output: DatarobotEndpointOutputSchemas.executionEnvironmentsCreate,
	},
	'executionEnvironments.executionEnvironmentsDelete': {
		input: DatarobotEndpointInputSchemas.executionEnvironmentsDelete,
		output: DatarobotEndpointOutputSchemas.executionEnvironmentsDelete,
	},
	'executionEnvironments.executionEnvironmentsList': {
		input: DatarobotEndpointInputSchemas.executionEnvironmentsList,
		output: DatarobotEndpointOutputSchemas.executionEnvironmentsList,
	},
	'executionEnvironments.executionEnvironmentsPatch': {
		input: DatarobotEndpointInputSchemas.executionEnvironmentsPatch,
		output: DatarobotEndpointOutputSchemas.executionEnvironmentsPatch,
	},
	'executionEnvironments.executionEnvironmentsRetrieve': {
		input: DatarobotEndpointInputSchemas.executionEnvironmentsRetrieve,
		output: DatarobotEndpointOutputSchemas.executionEnvironmentsRetrieve,
	},
	'executionEnvironments.executionEnvironmentsVersionsBuildLogList': {
		input:
			DatarobotEndpointInputSchemas.executionEnvironmentsVersionsBuildLogList,
		output:
			DatarobotEndpointOutputSchemas.executionEnvironmentsVersionsBuildLogList,
	},
	'executionEnvironments.executionEnvironmentsVersionsCancelBuildPatchMany': {
		input:
			DatarobotEndpointInputSchemas.executionEnvironmentsVersionsCancelBuildPatchMany,
		output:
			DatarobotEndpointOutputSchemas.executionEnvironmentsVersionsCancelBuildPatchMany,
	},
	'executionEnvironments.executionEnvironmentsVersionsCreate': {
		input: DatarobotEndpointInputSchemas.executionEnvironmentsVersionsCreate,
		output: DatarobotEndpointOutputSchemas.executionEnvironmentsVersionsCreate,
	},
	'executionEnvironments.executionEnvironmentsVersionsDownloadCreate': {
		input:
			DatarobotEndpointInputSchemas.executionEnvironmentsVersionsDownloadCreate,
		output:
			DatarobotEndpointOutputSchemas.executionEnvironmentsVersionsDownloadCreate,
	},
	'executionEnvironments.executionEnvironmentsVersionsDownloadList': {
		input:
			DatarobotEndpointInputSchemas.executionEnvironmentsVersionsDownloadList,
		output:
			DatarobotEndpointOutputSchemas.executionEnvironmentsVersionsDownloadList,
	},
	'executionEnvironments.executionEnvironmentsVersionsList': {
		input: DatarobotEndpointInputSchemas.executionEnvironmentsVersionsList,
		output: DatarobotEndpointOutputSchemas.executionEnvironmentsVersionsList,
	},
	'executionEnvironments.executionEnvironmentsVersionsRetrieve': {
		input: DatarobotEndpointInputSchemas.executionEnvironmentsVersionsRetrieve,
		output:
			DatarobotEndpointOutputSchemas.executionEnvironmentsVersionsRetrieve,
	},
	'externalDataDrivers.externalDataDriversConfigurationList': {
		input: DatarobotEndpointInputSchemas.externalDataDriversConfigurationList,
		output: DatarobotEndpointOutputSchemas.externalDataDriversConfigurationList,
	},
	'externalDataDrivers.externalDataDriversCreate': {
		input: DatarobotEndpointInputSchemas.externalDataDriversCreate,
		output: DatarobotEndpointOutputSchemas.externalDataDriversCreate,
	},
	'externalDataDrivers.externalDataDriversDelete': {
		input: DatarobotEndpointInputSchemas.externalDataDriversDelete,
		output: DatarobotEndpointOutputSchemas.externalDataDriversDelete,
	},
	'externalDataDrivers.externalDataDriversList': {
		input: DatarobotEndpointInputSchemas.externalDataDriversList,
		output: DatarobotEndpointOutputSchemas.externalDataDriversList,
	},
	'externalDataDrivers.externalDataDriversPatch': {
		input: DatarobotEndpointInputSchemas.externalDataDriversPatch,
		output: DatarobotEndpointOutputSchemas.externalDataDriversPatch,
	},
	'externalDataDrivers.externalDataDriversRetrieve': {
		input: DatarobotEndpointInputSchemas.externalDataDriversRetrieve,
		output: DatarobotEndpointOutputSchemas.externalDataDriversRetrieve,
	},
	'externalDataSources.externalDataSourcesAccessControlList': {
		input: DatarobotEndpointInputSchemas.externalDataSourcesAccessControlList,
		output: DatarobotEndpointOutputSchemas.externalDataSourcesAccessControlList,
	},
	'externalDataSources.externalDataSourcesAccessControlPatchMany': {
		input:
			DatarobotEndpointInputSchemas.externalDataSourcesAccessControlPatchMany,
		output:
			DatarobotEndpointOutputSchemas.externalDataSourcesAccessControlPatchMany,
	},
	'externalDataSources.externalDataSourcesCreate': {
		input: DatarobotEndpointInputSchemas.externalDataSourcesCreate,
		output: DatarobotEndpointOutputSchemas.externalDataSourcesCreate,
	},
	'externalDataSources.externalDataSourcesDelete': {
		input: DatarobotEndpointInputSchemas.externalDataSourcesDelete,
		output: DatarobotEndpointOutputSchemas.externalDataSourcesDelete,
	},
	'externalDataSources.externalDataSourcesList': {
		input: DatarobotEndpointInputSchemas.externalDataSourcesList,
		output: DatarobotEndpointOutputSchemas.externalDataSourcesList,
	},
	'externalDataSources.externalDataSourcesPatch': {
		input: DatarobotEndpointInputSchemas.externalDataSourcesPatch,
		output: DatarobotEndpointOutputSchemas.externalDataSourcesPatch,
	},
	'externalDataSources.externalDataSourcesPermissionsList': {
		input: DatarobotEndpointInputSchemas.externalDataSourcesPermissionsList,
		output: DatarobotEndpointOutputSchemas.externalDataSourcesPermissionsList,
	},
	'externalDataSources.externalDataSourcesRetrieve': {
		input: DatarobotEndpointInputSchemas.externalDataSourcesRetrieve,
		output: DatarobotEndpointOutputSchemas.externalDataSourcesRetrieve,
	},
	'externalDataSources.externalDataSourcesSharedRolesList': {
		input: DatarobotEndpointInputSchemas.externalDataSourcesSharedRolesList,
		output: DatarobotEndpointOutputSchemas.externalDataSourcesSharedRolesList,
	},
	'externalDataSources.externalDataSourcesSharedRolesPatchMany': {
		input:
			DatarobotEndpointInputSchemas.externalDataSourcesSharedRolesPatchMany,
		output:
			DatarobotEndpointOutputSchemas.externalDataSourcesSharedRolesPatchMany,
	},
	'externalDataStores.externalDataStoresAccessControlPatchMany': {
		input:
			DatarobotEndpointInputSchemas.externalDataStoresAccessControlPatchMany,
		output:
			DatarobotEndpointOutputSchemas.externalDataStoresAccessControlPatchMany,
	},
	'externalDataStores.externalDataStoresColumnsCreate': {
		input: DatarobotEndpointInputSchemas.externalDataStoresColumnsCreate,
		output: DatarobotEndpointOutputSchemas.externalDataStoresColumnsCreate,
	},
	'externalDataStores.externalDataStoresColumnsInfoCreate': {
		input: DatarobotEndpointInputSchemas.externalDataStoresColumnsInfoCreate,
		output: DatarobotEndpointOutputSchemas.externalDataStoresColumnsInfoCreate,
	},
	'externalDataStores.externalDataStoresCreate': {
		input: DatarobotEndpointInputSchemas.externalDataStoresCreate,
		output: DatarobotEndpointOutputSchemas.externalDataStoresCreate,
	},
	'externalDataStores.externalDataStoresCredentialsList': {
		input: DatarobotEndpointInputSchemas.externalDataStoresCredentialsList,
		output: DatarobotEndpointOutputSchemas.externalDataStoresCredentialsList,
	},
	'externalDataStores.externalDataStoresDelete': {
		input: DatarobotEndpointInputSchemas.externalDataStoresDelete,
		output: DatarobotEndpointOutputSchemas.externalDataStoresDelete,
	},
	'externalDataStores.externalDataStoresList': {
		input: DatarobotEndpointInputSchemas.externalDataStoresList,
		output: DatarobotEndpointOutputSchemas.externalDataStoresList,
	},
	'externalDataStores.externalDataStoresPatch': {
		input: DatarobotEndpointInputSchemas.externalDataStoresPatch,
		output: DatarobotEndpointOutputSchemas.externalDataStoresPatch,
	},
	'externalDataStores.externalDataStoresPermissionsList': {
		input: DatarobotEndpointInputSchemas.externalDataStoresPermissionsList,
		output: DatarobotEndpointOutputSchemas.externalDataStoresPermissionsList,
	},
	'externalDataStores.externalDataStoresRetrieve': {
		input: DatarobotEndpointInputSchemas.externalDataStoresRetrieve,
		output: DatarobotEndpointOutputSchemas.externalDataStoresRetrieve,
	},
	'externalDataStores.externalDataStoresSchemasCreate': {
		input: DatarobotEndpointInputSchemas.externalDataStoresSchemasCreate,
		output: DatarobotEndpointOutputSchemas.externalDataStoresSchemasCreate,
	},
	'externalDataStores.externalDataStoresSharedRolesList': {
		input: DatarobotEndpointInputSchemas.externalDataStoresSharedRolesList,
		output: DatarobotEndpointOutputSchemas.externalDataStoresSharedRolesList,
	},
	'externalDataStores.externalDataStoresSharedRolesPatchMany': {
		input: DatarobotEndpointInputSchemas.externalDataStoresSharedRolesPatchMany,
		output:
			DatarobotEndpointOutputSchemas.externalDataStoresSharedRolesPatchMany,
	},
	'externalDataStores.externalDataStoresStandardUserDefinedFunctionsCreate': {
		input:
			DatarobotEndpointInputSchemas.externalDataStoresStandardUserDefinedFunctionsCreate,
		output:
			DatarobotEndpointOutputSchemas.externalDataStoresStandardUserDefinedFunctionsCreate,
	},
	'externalDataStores.externalDataStoresStandardUserDefinedFunctionsDetectCreate':
		{
			input:
				DatarobotEndpointInputSchemas.externalDataStoresStandardUserDefinedFunctionsDetectCreate,
			output:
				DatarobotEndpointOutputSchemas.externalDataStoresStandardUserDefinedFunctionsDetectCreate,
		},
	'externalDataStores.externalDataStoresStandardUserDefinedFunctionsList': {
		input:
			DatarobotEndpointInputSchemas.externalDataStoresStandardUserDefinedFunctionsList,
		output:
			DatarobotEndpointOutputSchemas.externalDataStoresStandardUserDefinedFunctionsList,
	},
	'externalDataStores.externalDataStoresTablesCreate': {
		input: DatarobotEndpointInputSchemas.externalDataStoresTablesCreate,
		output: DatarobotEndpointOutputSchemas.externalDataStoresTablesCreate,
	},
	'externalDataStores.externalDataStoresTestCreate': {
		input: DatarobotEndpointInputSchemas.externalDataStoresTestCreate,
		output: DatarobotEndpointOutputSchemas.externalDataStoresTestCreate,
	},
	'externalDataStores.externalDataStoresVerifySQLCreate': {
		input: DatarobotEndpointInputSchemas.externalDataStoresVerifySQLCreate,
		output: DatarobotEndpointOutputSchemas.externalDataStoresVerifySQLCreate,
	},
	'externalOAuth.externalOAuthAuthorizedProvidersDelete': {
		input: DatarobotEndpointInputSchemas.externalOAuthAuthorizedProvidersDelete,
		output:
			DatarobotEndpointOutputSchemas.externalOAuthAuthorizedProvidersDelete,
	},
	'externalOAuth.externalOAuthAuthorizedProvidersList': {
		input: DatarobotEndpointInputSchemas.externalOAuthAuthorizedProvidersList,
		output: DatarobotEndpointOutputSchemas.externalOAuthAuthorizedProvidersList,
	},
	'externalOAuth.externalOAuthAuthorizedProvidersTokenCreate': {
		input:
			DatarobotEndpointInputSchemas.externalOAuthAuthorizedProvidersTokenCreate,
		output:
			DatarobotEndpointOutputSchemas.externalOAuthAuthorizedProvidersTokenCreate,
	},
	'externalOAuth.externalOAuthAuthorizedProvidersUserinfoList': {
		input:
			DatarobotEndpointInputSchemas.externalOAuthAuthorizedProvidersUserinfoList,
		output:
			DatarobotEndpointOutputSchemas.externalOAuthAuthorizedProvidersUserinfoList,
	},
	'externalOAuth.externalOAuthJobsRetrieve': {
		input: DatarobotEndpointInputSchemas.externalOAuthJobsRetrieve,
		output: DatarobotEndpointOutputSchemas.externalOAuthJobsRetrieve,
	},
	'externalOAuth.externalOAuthProvidersAuthorizeCreate': {
		input: DatarobotEndpointInputSchemas.externalOAuthProvidersAuthorizeCreate,
		output:
			DatarobotEndpointOutputSchemas.externalOAuthProvidersAuthorizeCreate,
	},
	'externalOAuth.externalOAuthProvidersCallbackCreate': {
		input: DatarobotEndpointInputSchemas.externalOAuthProvidersCallbackCreate,
		output: DatarobotEndpointOutputSchemas.externalOAuthProvidersCallbackCreate,
	},
	'externalOAuth.externalOAuthProvidersCreate': {
		input: DatarobotEndpointInputSchemas.externalOAuthProvidersCreate,
		output: DatarobotEndpointOutputSchemas.externalOAuthProvidersCreate,
	},
	'externalOAuth.externalOAuthProvidersDelete': {
		input: DatarobotEndpointInputSchemas.externalOAuthProvidersDelete,
		output: DatarobotEndpointOutputSchemas.externalOAuthProvidersDelete,
	},
	'externalOAuth.externalOAuthProvidersList': {
		input: DatarobotEndpointInputSchemas.externalOAuthProvidersList,
		output: DatarobotEndpointOutputSchemas.externalOAuthProvidersList,
	},
	'externalOAuth.externalOAuthProvidersPatch': {
		input: DatarobotEndpointInputSchemas.externalOAuthProvidersPatch,
		output: DatarobotEndpointOutputSchemas.externalOAuthProvidersPatch,
	},
	'externalOAuth.externalOAuthProvidersRetrieve': {
		input: DatarobotEndpointInputSchemas.externalOAuthProvidersRetrieve,
		output: DatarobotEndpointOutputSchemas.externalOAuthProvidersRetrieve,
	},
	'files.filesAddFromDataSourceCreate': {
		input: DatarobotEndpointInputSchemas.filesAddFromDataSourceCreate,
		output: DatarobotEndpointOutputSchemas.filesAddFromDataSourceCreate,
	},
	'files.filesAddFromFileCreate': {
		input: DatarobotEndpointInputSchemas.filesAddFromFileCreate,
		output: DatarobotEndpointOutputSchemas.filesAddFromFileCreate,
	},
	'files.filesAddFromURLCreate': {
		input: DatarobotEndpointInputSchemas.filesAddFromURLCreate,
		output: DatarobotEndpointOutputSchemas.filesAddFromURLCreate,
	},
	'files.filesAllFilesDeleteMany': {
		input: DatarobotEndpointInputSchemas.filesAllFilesDeleteMany,
		output: DatarobotEndpointOutputSchemas.filesAllFilesDeleteMany,
	},
	'files.filesAllFilesList': {
		input: DatarobotEndpointInputSchemas.filesAllFilesList,
		output: DatarobotEndpointOutputSchemas.filesAllFilesList,
	},
	'files.filesAllFilesPatchMany': {
		input: DatarobotEndpointInputSchemas.filesAllFilesPatchMany,
		output: DatarobotEndpointOutputSchemas.filesAllFilesPatchMany,
	},
	'files.filesCloneCreate': {
		input: DatarobotEndpointInputSchemas.filesCloneCreate,
		output: DatarobotEndpointOutputSchemas.filesCloneCreate,
	},
	'files.filesCopyBatchCreate': {
		input: DatarobotEndpointInputSchemas.filesCopyBatchCreate,
		output: DatarobotEndpointOutputSchemas.filesCopyBatchCreate,
	},
	'files.filesCopyCreate': {
		input: DatarobotEndpointInputSchemas.filesCopyCreate,
		output: DatarobotEndpointOutputSchemas.filesCopyCreate,
	},
	'files.filesCreate': {
		input: DatarobotEndpointInputSchemas.filesCreate,
		output: DatarobotEndpointOutputSchemas.filesCreate,
	},
	'files.filesDelete': {
		input: DatarobotEndpointInputSchemas.filesDelete,
		output: DatarobotEndpointOutputSchemas.filesDelete,
	},
	'files.filesDeletedPatchMany': {
		input: DatarobotEndpointInputSchemas.filesDeletedPatchMany,
		output: DatarobotEndpointOutputSchemas.filesDeletedPatchMany,
	},
	'files.filesDownloadsCreate': {
		input: DatarobotEndpointInputSchemas.filesDownloadsCreate,
		output: DatarobotEndpointOutputSchemas.filesDownloadsCreate,
	},
	'files.filesFileList': {
		input: DatarobotEndpointInputSchemas.filesFileList,
		output: DatarobotEndpointOutputSchemas.filesFileList,
	},
	'files.filesFromDataSourceCreate': {
		input: DatarobotEndpointInputSchemas.filesFromDataSourceCreate,
		output: DatarobotEndpointOutputSchemas.filesFromDataSourceCreate,
	},
	'files.filesFromFileCreate': {
		input: DatarobotEndpointInputSchemas.filesFromFileCreate,
		output: DatarobotEndpointOutputSchemas.filesFromFileCreate,
	},
	'files.filesFromStageCreate': {
		input: DatarobotEndpointInputSchemas.filesFromStageCreate,
		output: DatarobotEndpointOutputSchemas.filesFromStageCreate,
	},
	'files.filesFromURLCreate': {
		input: DatarobotEndpointInputSchemas.filesFromURLCreate,
		output: DatarobotEndpointOutputSchemas.filesFromURLCreate,
	},
	'files.filesLinksCreate': {
		input: DatarobotEndpointInputSchemas.filesLinksCreate,
		output: DatarobotEndpointOutputSchemas.filesLinksCreate,
	},
	'files.filesPatchMany': {
		input: DatarobotEndpointInputSchemas.filesPatchMany,
		output: DatarobotEndpointOutputSchemas.filesPatchMany,
	},
	'files.filesSharedRolesList': {
		input: DatarobotEndpointInputSchemas.filesSharedRolesList,
		output: DatarobotEndpointOutputSchemas.filesSharedRolesList,
	},
	'files.filesSharedRolesPatchMany': {
		input: DatarobotEndpointInputSchemas.filesSharedRolesPatchMany,
		output: DatarobotEndpointOutputSchemas.filesSharedRolesPatchMany,
	},
	'files.filesStagesCreate': {
		input: DatarobotEndpointInputSchemas.filesStagesCreate,
		output: DatarobotEndpointOutputSchemas.filesStagesCreate,
	},
	'files.filesStagesUploadCreate': {
		input: DatarobotEndpointInputSchemas.filesStagesUploadCreate,
		output: DatarobotEndpointOutputSchemas.filesStagesUploadCreate,
	},
	'files.filesVersionsAllFilesList': {
		input: DatarobotEndpointInputSchemas.filesVersionsAllFilesList,
		output: DatarobotEndpointOutputSchemas.filesVersionsAllFilesList,
	},
	'files.filesVersionsDelete': {
		input: DatarobotEndpointInputSchemas.filesVersionsDelete,
		output: DatarobotEndpointOutputSchemas.filesVersionsDelete,
	},
	'files.filesVersionsDeletedPatchMany': {
		input: DatarobotEndpointInputSchemas.filesVersionsDeletedPatchMany,
		output: DatarobotEndpointOutputSchemas.filesVersionsDeletedPatchMany,
	},
	'files.filesVersionsDownloadsCreate': {
		input: DatarobotEndpointInputSchemas.filesVersionsDownloadsCreate,
		output: DatarobotEndpointOutputSchemas.filesVersionsDownloadsCreate,
	},
	'files.filesVersionsFileList': {
		input: DatarobotEndpointInputSchemas.filesVersionsFileList,
		output: DatarobotEndpointOutputSchemas.filesVersionsFileList,
	},
	'files.filesVersionsLinksCreate': {
		input: DatarobotEndpointInputSchemas.filesVersionsLinksCreate,
		output: DatarobotEndpointOutputSchemas.filesVersionsLinksCreate,
	},
	'files.filesVersionsList': {
		input: DatarobotEndpointInputSchemas.filesVersionsList,
		output: DatarobotEndpointOutputSchemas.filesVersionsList,
	},
	'genai.copySupportedInsightsPlaygroundsTargetPlaygroundIdSupportedInsightsSourcePlaygroundIdPut':
		{
			input:
				DatarobotEndpointInputSchemas.copySupportedInsightsPlaygroundsTargetPlaygroundIdSupportedInsightsSourcePlaygroundIdPut,
			output:
				DatarobotEndpointOutputSchemas.copySupportedInsightsPlaygroundsTargetPlaygroundIdSupportedInsightsSourcePlaygroundIdPut,
		},
	'genai.createChatChatsPost': {
		input: DatarobotEndpointInputSchemas.createChatChatsPost,
		output: DatarobotEndpointOutputSchemas.createChatChatsPost,
	},
	'genai.createChatExportJobPlaygroundsPlaygroundIdTraceDatasetsPost': {
		input:
			DatarobotEndpointInputSchemas.createChatExportJobPlaygroundsPlaygroundIdTraceDatasetsPost,
		output:
			DatarobotEndpointOutputSchemas.createChatExportJobPlaygroundsPlaygroundIdTraceDatasetsPost,
	},
	'genai.createChatPromptChatPromptsPost': {
		input: DatarobotEndpointInputSchemas.createChatPromptChatPromptsPost,
		output: DatarobotEndpointOutputSchemas.createChatPromptChatPromptsPost,
	},
	'genai.createComparisonChatComparisonChatsPost': {
		input:
			DatarobotEndpointInputSchemas.createComparisonChatComparisonChatsPost,
		output:
			DatarobotEndpointOutputSchemas.createComparisonChatComparisonChatsPost,
	},
	'genai.createComparisonPromptComparisonPromptsPost': {
		input:
			DatarobotEndpointInputSchemas.createComparisonPromptComparisonPromptsPost,
		output:
			DatarobotEndpointOutputSchemas.createComparisonPromptComparisonPromptsPost,
	},
	'genai.createCostMetricConfigurationCostMetricConfigurationsPost': {
		input:
			DatarobotEndpointInputSchemas.createCostMetricConfigurationCostMetricConfigurationsPost,
		output:
			DatarobotEndpointOutputSchemas.createCostMetricConfigurationCostMetricConfigurationsPost,
	},
	'genai.createCustomModelEmbeddingValidationCustomModelEmbeddingValidationsPost':
		{
			input:
				DatarobotEndpointInputSchemas.createCustomModelEmbeddingValidationCustomModelEmbeddingValidationsPost,
			output:
				DatarobotEndpointOutputSchemas.createCustomModelEmbeddingValidationCustomModelEmbeddingValidationsPost,
		},
	'genai.createCustomModelLlmValidationCustomModelLLMValidationsPost': {
		input:
			DatarobotEndpointInputSchemas.createCustomModelLlmValidationCustomModelLLMValidationsPost,
		output:
			DatarobotEndpointOutputSchemas.createCustomModelLlmValidationCustomModelLLMValidationsPost,
	},
	'genai.createCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsPost':
		{
			input:
				DatarobotEndpointInputSchemas.createCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsPost,
			output:
				DatarobotEndpointOutputSchemas.createCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsPost,
		},
	'genai.createCustomModelVectorDatabaseVectorDatabasesFromCustomModelDeploymentPost':
		{
			input:
				DatarobotEndpointInputSchemas.createCustomModelVectorDatabaseVectorDatabasesFromCustomModelDeploymentPost,
			output:
				DatarobotEndpointOutputSchemas.createCustomModelVectorDatabaseVectorDatabasesFromCustomModelDeploymentPost,
		},
	'genai.createCustomModelVersionCustomModelVersionsPost': {
		input:
			DatarobotEndpointInputSchemas.createCustomModelVersionCustomModelVersionsPost,
		output:
			DatarobotEndpointOutputSchemas.createCustomModelVersionCustomModelVersionsPost,
	},
	'genai.createEvaluationDatasetConfigurationEvaluationDatasetConfigurationsPost':
		{
			input:
				DatarobotEndpointInputSchemas.createEvaluationDatasetConfigurationEvaluationDatasetConfigurationsPost,
			output:
				DatarobotEndpointOutputSchemas.createEvaluationDatasetConfigurationEvaluationDatasetConfigurationsPost,
		},
	'genai.createEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsPost':
		{
			input:
				DatarobotEndpointInputSchemas.createEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsPost,
			output:
				DatarobotEndpointOutputSchemas.createEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsPost,
		},
	'genai.createFromChatPromptLlmBlueprintsFromChatPromptPost': {
		input:
			DatarobotEndpointInputSchemas.createFromChatPromptLlmBlueprintsFromChatPromptPost,
		output:
			DatarobotEndpointOutputSchemas.createFromChatPromptLlmBlueprintsFromChatPromptPost,
	},
	'genai.createFromLlmBlueprintLlmBlueprintsFromLLMBlueprintPost': {
		input:
			DatarobotEndpointInputSchemas.createFromLlmBlueprintLlmBlueprintsFromLLMBlueprintPost,
		output:
			DatarobotEndpointOutputSchemas.createFromLlmBlueprintLlmBlueprintsFromLLMBlueprintPost,
	},
	'genai.createLlmBlueprintLlmBlueprintsPost': {
		input: DatarobotEndpointInputSchemas.createLlmBlueprintLlmBlueprintsPost,
		output: DatarobotEndpointOutputSchemas.createLlmBlueprintLlmBlueprintsPost,
	},
	'genai.createLlmTestConfigurationLlmTestConfigurationsPost': {
		input:
			DatarobotEndpointInputSchemas.createLlmTestConfigurationLlmTestConfigurationsPost,
		output:
			DatarobotEndpointOutputSchemas.createLlmTestConfigurationLlmTestConfigurationsPost,
	},
	'genai.createLlmTestResultLlmTestResultsPost': {
		input: DatarobotEndpointInputSchemas.createLlmTestResultLlmTestResultsPost,
		output:
			DatarobotEndpointOutputSchemas.createLlmTestResultLlmTestResultsPost,
	},
	'genai.createLlmTestSuiteLlmTestSuitesPost': {
		input: DatarobotEndpointInputSchemas.createLlmTestSuiteLlmTestSuitesPost,
		output: DatarobotEndpointOutputSchemas.createLlmTestSuiteLlmTestSuitesPost,
	},
	'genai.createOotbMetricConfigurationPlaygroundsPlaygroundIdOotbMetricConfigurationsPost':
		{
			input:
				DatarobotEndpointInputSchemas.createOotbMetricConfigurationPlaygroundsPlaygroundIdOotbMetricConfigurationsPost,
			output:
				DatarobotEndpointOutputSchemas.createOotbMetricConfigurationPlaygroundsPlaygroundIdOotbMetricConfigurationsPost,
		},
	'genai.createPlaygroundPlaygroundsPost': {
		input: DatarobotEndpointInputSchemas.createPlaygroundPlaygroundsPost,
		output: DatarobotEndpointOutputSchemas.createPlaygroundPlaygroundsPost,
	},
	'genai.createPromptTemplatePromptTemplatesPost': {
		input:
			DatarobotEndpointInputSchemas.createPromptTemplatePromptTemplatesPost,
		output:
			DatarobotEndpointOutputSchemas.createPromptTemplatePromptTemplatesPost,
	},
	'genai.createPromptTemplateVersionPromptTemplatesPromptTemplateIdVersionsPost':
		{
			input:
				DatarobotEndpointInputSchemas.createPromptTemplateVersionPromptTemplatesPromptTemplateIdVersionsPost,
			output:
				DatarobotEndpointOutputSchemas.createPromptTemplateVersionPromptTemplatesPromptTemplateIdVersionsPost,
		},
	'genai.createSidecarModelMetricValidationSidecarModelMetricValidationsPost': {
		input:
			DatarobotEndpointInputSchemas.createSidecarModelMetricValidationSidecarModelMetricValidationsPost,
		output:
			DatarobotEndpointOutputSchemas.createSidecarModelMetricValidationSidecarModelMetricValidationsPost,
	},
	'genai.createVectorDatabaseCustomModelVersionVectorDatabasesVectorDatabaseIdCustomModelVersionsPost':
		{
			input:
				DatarobotEndpointInputSchemas.createVectorDatabaseCustomModelVersionVectorDatabasesVectorDatabaseIdCustomModelVersionsPost,
			output:
				DatarobotEndpointOutputSchemas.createVectorDatabaseCustomModelVersionVectorDatabasesVectorDatabaseIdCustomModelVersionsPost,
		},
	'genai.createVectorDatabaseDeploymentVectorDatabasesVectorDatabaseIdDeploymentsPost':
		{
			input:
				DatarobotEndpointInputSchemas.createVectorDatabaseDeploymentVectorDatabasesVectorDatabaseIdDeploymentsPost,
			output:
				DatarobotEndpointOutputSchemas.createVectorDatabaseDeploymentVectorDatabasesVectorDatabaseIdDeploymentsPost,
		},
	'genai.createVectorDatabaseVectorDatabasesPost': {
		input:
			DatarobotEndpointInputSchemas.createVectorDatabaseVectorDatabasesPost,
		output:
			DatarobotEndpointOutputSchemas.createVectorDatabaseVectorDatabasesPost,
	},
	'genai.deleteChatChatsChatIdDelete': {
		input: DatarobotEndpointInputSchemas.deleteChatChatsChatIdDelete,
		output: DatarobotEndpointOutputSchemas.deleteChatChatsChatIdDelete,
	},
	'genai.deleteChatPromptChatPromptsChatPromptIdDelete': {
		input:
			DatarobotEndpointInputSchemas.deleteChatPromptChatPromptsChatPromptIdDelete,
		output:
			DatarobotEndpointOutputSchemas.deleteChatPromptChatPromptsChatPromptIdDelete,
	},
	'genai.deleteComparisonChatComparisonChatsComparisonChatIdDelete': {
		input:
			DatarobotEndpointInputSchemas.deleteComparisonChatComparisonChatsComparisonChatIdDelete,
		output:
			DatarobotEndpointOutputSchemas.deleteComparisonChatComparisonChatsComparisonChatIdDelete,
	},
	'genai.deleteComparisonPromptComparisonPromptsComparisonPromptIdDelete': {
		input:
			DatarobotEndpointInputSchemas.deleteComparisonPromptComparisonPromptsComparisonPromptIdDelete,
		output:
			DatarobotEndpointOutputSchemas.deleteComparisonPromptComparisonPromptsComparisonPromptIdDelete,
	},
	'genai.deleteCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdDelete':
		{
			input:
				DatarobotEndpointInputSchemas.deleteCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdDelete,
			output:
				DatarobotEndpointOutputSchemas.deleteCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdDelete,
		},
	'genai.deleteCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdDelete':
		{
			input:
				DatarobotEndpointInputSchemas.deleteCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdDelete,
			output:
				DatarobotEndpointOutputSchemas.deleteCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdDelete,
		},
	'genai.deleteCustomModelLlmValidationCustomModelLLMValidationsValidationIdDelete':
		{
			input:
				DatarobotEndpointInputSchemas.deleteCustomModelLlmValidationCustomModelLLMValidationsValidationIdDelete,
			output:
				DatarobotEndpointOutputSchemas.deleteCustomModelLlmValidationCustomModelLLMValidationsValidationIdDelete,
		},
	'genai.deleteCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdDelete':
		{
			input:
				DatarobotEndpointInputSchemas.deleteCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdDelete,
			output:
				DatarobotEndpointOutputSchemas.deleteCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdDelete,
		},
	'genai.deleteEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdDelete':
		{
			input:
				DatarobotEndpointInputSchemas.deleteEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdDelete,
			output:
				DatarobotEndpointOutputSchemas.deleteEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdDelete,
		},
	'genai.deleteEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsDelete':
		{
			input:
				DatarobotEndpointInputSchemas.deleteEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsDelete,
			output:
				DatarobotEndpointOutputSchemas.deleteEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsDelete,
		},
	'genai.deleteLlmBlueprintLlmBlueprintsLlmBlueprintIdDelete': {
		input:
			DatarobotEndpointInputSchemas.deleteLlmBlueprintLlmBlueprintsLlmBlueprintIdDelete,
		output:
			DatarobotEndpointOutputSchemas.deleteLlmBlueprintLlmBlueprintsLlmBlueprintIdDelete,
	},
	'genai.deleteLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdDelete':
		{
			input:
				DatarobotEndpointInputSchemas.deleteLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdDelete,
			output:
				DatarobotEndpointOutputSchemas.deleteLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdDelete,
		},
	'genai.deleteLlmTestResultLlmTestResultsLlmTestResultIdDelete': {
		input:
			DatarobotEndpointInputSchemas.deleteLlmTestResultLlmTestResultsLlmTestResultIdDelete,
		output:
			DatarobotEndpointOutputSchemas.deleteLlmTestResultLlmTestResultsLlmTestResultIdDelete,
	},
	'genai.deleteLlmTestSuiteLlmTestSuitesLlmTestSuiteIdDelete': {
		input:
			DatarobotEndpointInputSchemas.deleteLlmTestSuiteLlmTestSuitesLlmTestSuiteIdDelete,
		output:
			DatarobotEndpointOutputSchemas.deleteLlmTestSuiteLlmTestSuitesLlmTestSuiteIdDelete,
	},
	'genai.deleteNemoMetricPlaygroundsPlaygroundIdNemoConfigurationMetricIdDelete':
		{
			input:
				DatarobotEndpointInputSchemas.deleteNemoMetricPlaygroundsPlaygroundIdNemoConfigurationMetricIdDelete,
			output:
				DatarobotEndpointOutputSchemas.deleteNemoMetricPlaygroundsPlaygroundIdNemoConfigurationMetricIdDelete,
		},
	'genai.deleteOotbMetricConfigurationOotbMetricConfigurationsOotbMetricConfigurationIdDelete':
		{
			input:
				DatarobotEndpointInputSchemas.deleteOotbMetricConfigurationOotbMetricConfigurationsOotbMetricConfigurationIdDelete,
			output:
				DatarobotEndpointOutputSchemas.deleteOotbMetricConfigurationOotbMetricConfigurationsOotbMetricConfigurationIdDelete,
		},
	'genai.deletePlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationDelete':
		{
			input:
				DatarobotEndpointInputSchemas.deletePlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationDelete,
			output:
				DatarobotEndpointOutputSchemas.deletePlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationDelete,
		},
	'genai.deletePlaygroundPlaygroundsPlaygroundIdDelete': {
		input:
			DatarobotEndpointInputSchemas.deletePlaygroundPlaygroundsPlaygroundIdDelete,
		output:
			DatarobotEndpointOutputSchemas.deletePlaygroundPlaygroundsPlaygroundIdDelete,
	},
	'genai.deleteSearchStudySyftrSearchSearchStudyIdDelete': {
		input:
			DatarobotEndpointInputSchemas.deleteSearchStudySyftrSearchSearchStudyIdDelete,
		output:
			DatarobotEndpointOutputSchemas.deleteSearchStudySyftrSearchSearchStudyIdDelete,
	},
	'genai.deleteSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdDelete':
		{
			input:
				DatarobotEndpointInputSchemas.deleteSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdDelete,
			output:
				DatarobotEndpointOutputSchemas.deleteSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdDelete,
		},
	'genai.deleteVectorDatabaseVectorDatabasesVectorDatabaseIdDelete': {
		input:
			DatarobotEndpointInputSchemas.deleteVectorDatabaseVectorDatabasesVectorDatabaseIdDelete,
		output:
			DatarobotEndpointOutputSchemas.deleteVectorDatabaseVectorDatabasesVectorDatabaseIdDelete,
	},
	'genai.downloadTextAndEmbeddingsAssetVectorDatabasesVectorDatabaseIdTextAndEmbeddingsGet':
		{
			input:
				DatarobotEndpointInputSchemas.downloadTextAndEmbeddingsAssetVectorDatabasesVectorDatabaseIdTextAndEmbeddingsGet,
			output:
				DatarobotEndpointOutputSchemas.downloadTextAndEmbeddingsAssetVectorDatabasesVectorDatabaseIdTextAndEmbeddingsGet,
		},
	'genai.editChatChatsChatIdPatch': {
		input: DatarobotEndpointInputSchemas.editChatChatsChatIdPatch,
		output: DatarobotEndpointOutputSchemas.editChatChatsChatIdPatch,
	},
	'genai.editComparisonChatComparisonChatsComparisonChatIdPatch': {
		input:
			DatarobotEndpointInputSchemas.editComparisonChatComparisonChatsComparisonChatIdPatch,
		output:
			DatarobotEndpointOutputSchemas.editComparisonChatComparisonChatsComparisonChatIdPatch,
	},
	'genai.editLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdPatch':
		{
			input:
				DatarobotEndpointInputSchemas.editLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdPatch,
			output:
				DatarobotEndpointOutputSchemas.editLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdPatch,
		},
	'genai.editLlmTestSuiteLlmTestSuitesLlmTestSuiteIdPatch': {
		input:
			DatarobotEndpointInputSchemas.editLlmTestSuiteLlmTestSuitesLlmTestSuiteIdPatch,
		output:
			DatarobotEndpointOutputSchemas.editLlmTestSuiteLlmTestSuitesLlmTestSuiteIdPatch,
	},
	'genai.editSearchStudySyftrSearchSearchStudyIdPatch': {
		input:
			DatarobotEndpointInputSchemas.editSearchStudySyftrSearchSearchStudyIdPatch,
		output:
			DatarobotEndpointOutputSchemas.editSearchStudySyftrSearchSearchStudyIdPatch,
	},
	'genai.exportVectorDatabaseDatasetVectorDatabasesVectorDatabaseIdDatasetExportJobsPost':
		{
			input:
				DatarobotEndpointInputSchemas.exportVectorDatabaseDatasetVectorDatabasesVectorDatabaseIdDatasetExportJobsPost,
			output:
				DatarobotEndpointOutputSchemas.exportVectorDatabaseDatasetVectorDatabasesVectorDatabaseIdDatasetExportJobsPost,
		},
	'genai.fromCustomModelChatAgentsFromCustomModelCustomModelIdChatPost': {
		input:
			DatarobotEndpointInputSchemas.fromCustomModelChatAgentsFromCustomModelCustomModelIdChatPost,
		output:
			DatarobotEndpointOutputSchemas.fromCustomModelChatAgentsFromCustomModelCustomModelIdChatPost,
	},
	'genai.generateSyntheticDatasetSyntheticEvaluationDatasetGenerationsPost': {
		input:
			DatarobotEndpointInputSchemas.generateSyntheticDatasetSyntheticEvaluationDatasetGenerationsPost,
		output:
			DatarobotEndpointOutputSchemas.generateSyntheticDatasetSyntheticEvaluationDatasetGenerationsPost,
	},
	'genai.getChatChatsChatIdGet': {
		input: DatarobotEndpointInputSchemas.getChatChatsChatIdGet,
		output: DatarobotEndpointOutputSchemas.getChatChatsChatIdGet,
	},
	'genai.getChatPromptChatPromptsChatPromptIdGet': {
		input:
			DatarobotEndpointInputSchemas.getChatPromptChatPromptsChatPromptIdGet,
		output:
			DatarobotEndpointOutputSchemas.getChatPromptChatPromptsChatPromptIdGet,
	},
	'genai.getChatResponseAgentsFromCustomModelCustomModelIdChatChatCompletionIdGet':
		{
			input:
				DatarobotEndpointInputSchemas.getChatResponseAgentsFromCustomModelCustomModelIdChatChatCompletionIdGet,
			output:
				DatarobotEndpointOutputSchemas.getChatResponseAgentsFromCustomModelCustomModelIdChatChatCompletionIdGet,
		},
	'genai.getComparisonChatComparisonChatsComparisonChatIdGet': {
		input:
			DatarobotEndpointInputSchemas.getComparisonChatComparisonChatsComparisonChatIdGet,
		output:
			DatarobotEndpointOutputSchemas.getComparisonChatComparisonChatsComparisonChatIdGet,
	},
	'genai.getComparisonPromptComparisonPromptsComparisonPromptIdGet': {
		input:
			DatarobotEndpointInputSchemas.getComparisonPromptComparisonPromptsComparisonPromptIdGet,
		output:
			DatarobotEndpointOutputSchemas.getComparisonPromptComparisonPromptsComparisonPromptIdGet,
	},
	'genai.getCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdGet':
		{
			input:
				DatarobotEndpointInputSchemas.getCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdGet,
			output:
				DatarobotEndpointOutputSchemas.getCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdGet,
		},
	'genai.getCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdGet':
		{
			input:
				DatarobotEndpointInputSchemas.getCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdGet,
			output:
				DatarobotEndpointOutputSchemas.getCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdGet,
		},
	'genai.getCustomModelLlmValidationCustomModelLLMValidationsValidationIdGet': {
		input:
			DatarobotEndpointInputSchemas.getCustomModelLlmValidationCustomModelLLMValidationsValidationIdGet,
		output:
			DatarobotEndpointOutputSchemas.getCustomModelLlmValidationCustomModelLLMValidationsValidationIdGet,
	},
	'genai.getCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdGet':
		{
			input:
				DatarobotEndpointInputSchemas.getCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdGet,
			output:
				DatarobotEndpointOutputSchemas.getCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdGet,
		},
	'genai.getEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdGet':
		{
			input:
				DatarobotEndpointInputSchemas.getEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdGet,
			output:
				DatarobotEndpointOutputSchemas.getEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdGet,
		},
	'genai.getLlmBlueprintLlmBlueprintsLlmBlueprintIdGet': {
		input:
			DatarobotEndpointInputSchemas.getLlmBlueprintLlmBlueprintsLlmBlueprintIdGet,
		output:
			DatarobotEndpointOutputSchemas.getLlmBlueprintLlmBlueprintsLlmBlueprintIdGet,
	},
	'genai.getLlmLlmsLlmIdGet': {
		input: DatarobotEndpointInputSchemas.getLlmLlmsLlmIdGet,
		output: DatarobotEndpointOutputSchemas.getLlmLlmsLlmIdGet,
	},
	'genai.getLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdGet':
		{
			input:
				DatarobotEndpointInputSchemas.getLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdGet,
			output:
				DatarobotEndpointOutputSchemas.getLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdGet,
		},
	'genai.getLlmTestResultLlmTestResultsLlmTestResultIdGet': {
		input:
			DatarobotEndpointInputSchemas.getLlmTestResultLlmTestResultsLlmTestResultIdGet,
		output:
			DatarobotEndpointOutputSchemas.getLlmTestResultLlmTestResultsLlmTestResultIdGet,
	},
	'genai.getLlmTestSuiteLlmTestSuitesLlmTestSuiteIdGet': {
		input:
			DatarobotEndpointInputSchemas.getLlmTestSuiteLlmTestSuitesLlmTestSuiteIdGet,
		output:
			DatarobotEndpointOutputSchemas.getLlmTestSuiteLlmTestSuitesLlmTestSuiteIdGet,
	},
	'genai.getOotbMetricConfigurationOotbMetricConfigurationsOotbMetricConfigurationIdGet':
		{
			input:
				DatarobotEndpointInputSchemas.getOotbMetricConfigurationOotbMetricConfigurationsOotbMetricConfigurationIdGet,
			output:
				DatarobotEndpointOutputSchemas.getOotbMetricConfigurationOotbMetricConfigurationsOotbMetricConfigurationIdGet,
		},
	'genai.getPlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationGet':
		{
			input:
				DatarobotEndpointInputSchemas.getPlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationGet,
			output:
				DatarobotEndpointOutputSchemas.getPlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationGet,
		},
	'genai.getPlaygroundPlaygroundsPlaygroundIdGet': {
		input:
			DatarobotEndpointInputSchemas.getPlaygroundPlaygroundsPlaygroundIdGet,
		output:
			DatarobotEndpointOutputSchemas.getPlaygroundPlaygroundsPlaygroundIdGet,
	},
	'genai.getPromptTemplatePromptTemplatesPromptTemplateIdGet': {
		input:
			DatarobotEndpointInputSchemas.getPromptTemplatePromptTemplatesPromptTemplateIdGet,
		output:
			DatarobotEndpointOutputSchemas.getPromptTemplatePromptTemplatesPromptTemplateIdGet,
	},
	'genai.getPromptTemplateVersionPromptTemplatesPromptTemplateIdVersionsPromptTemplateVersionIdGet':
		{
			input:
				DatarobotEndpointInputSchemas.getPromptTemplateVersionPromptTemplatesPromptTemplateIdVersionsPromptTemplateVersionIdGet,
			output:
				DatarobotEndpointOutputSchemas.getPromptTemplateVersionPromptTemplatesPromptTemplateIdVersionsPromptTemplateVersionIdGet,
		},
	'genai.getSearchStudySyftrSearchSearchStudyIdGet': {
		input:
			DatarobotEndpointInputSchemas.getSearchStudySyftrSearchSearchStudyIdGet,
		output:
			DatarobotEndpointOutputSchemas.getSearchStudySyftrSearchSearchStudyIdGet,
	},
	'genai.getSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdGet':
		{
			input:
				DatarobotEndpointInputSchemas.getSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdGet,
			output:
				DatarobotEndpointOutputSchemas.getSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdGet,
		},
	'genai.getStatusStatusStatusIdGet': {
		input: DatarobotEndpointInputSchemas.getStatusStatusStatusIdGet,
		output: DatarobotEndpointOutputSchemas.getStatusStatusStatusIdGet,
	},
	'genai.getSupportedEmbeddingsVectorDatabasesSupportedEmbeddingsGet': {
		input:
			DatarobotEndpointInputSchemas.getSupportedEmbeddingsVectorDatabasesSupportedEmbeddingsGet,
		output:
			DatarobotEndpointOutputSchemas.getSupportedEmbeddingsVectorDatabasesSupportedEmbeddingsGet,
	},
	'genai.getSupportedInsightsPlaygroundsPlaygroundIdSupportedInsightsGet': {
		input:
			DatarobotEndpointInputSchemas.getSupportedInsightsPlaygroundsPlaygroundIdSupportedInsightsGet,
		output:
			DatarobotEndpointOutputSchemas.getSupportedInsightsPlaygroundsPlaygroundIdSupportedInsightsGet,
	},
	'genai.getSupportedLanguagesVectorDatabasesVectorDatabaseIdSupportedSyntheticDatasetGenerationLanguagesGet':
		{
			input:
				DatarobotEndpointInputSchemas.getSupportedLanguagesVectorDatabasesVectorDatabaseIdSupportedSyntheticDatasetGenerationLanguagesGet,
			output:
				DatarobotEndpointOutputSchemas.getSupportedLanguagesVectorDatabasesVectorDatabaseIdSupportedSyntheticDatasetGenerationLanguagesGet,
		},
	'genai.getSupportedRetrievalSettingsVectorDatabasesSupportedRetrievalSettingsGet':
		{
			input:
				DatarobotEndpointInputSchemas.getSupportedRetrievalSettingsVectorDatabasesSupportedRetrievalSettingsGet,
			output:
				DatarobotEndpointOutputSchemas.getSupportedRetrievalSettingsVectorDatabasesSupportedRetrievalSettingsGet,
		},
	'genai.getSupportedTextChunkingConfigsVectorDatabasesSupportedTextChunkingsGet':
		{
			input:
				DatarobotEndpointInputSchemas.getSupportedTextChunkingConfigsVectorDatabasesSupportedTextChunkingsGet,
			output:
				DatarobotEndpointOutputSchemas.getSupportedTextChunkingConfigsVectorDatabasesSupportedTextChunkingsGet,
		},
	'genai.getUserLimitCounterForVectorDatabasesUserLimitsVectorDatabasesGet': {
		input:
			DatarobotEndpointInputSchemas.getUserLimitCounterForVectorDatabasesUserLimitsVectorDatabasesGet,
		output:
			DatarobotEndpointOutputSchemas.getUserLimitCounterForVectorDatabasesUserLimitsVectorDatabasesGet,
	},
	'genai.getVectorDatabaseLatestVersionVectorDatabasesVectorDatabaseIdLatestVersionGet':
		{
			input:
				DatarobotEndpointInputSchemas.getVectorDatabaseLatestVersionVectorDatabasesVectorDatabaseIdLatestVersionGet,
			output:
				DatarobotEndpointOutputSchemas.getVectorDatabaseLatestVersionVectorDatabasesVectorDatabaseIdLatestVersionGet,
		},
	'genai.getVectorDatabaseVectorDatabasesVectorDatabaseIdGet': {
		input:
			DatarobotEndpointInputSchemas.getVectorDatabaseVectorDatabasesVectorDatabaseIdGet,
		output:
			DatarobotEndpointOutputSchemas.getVectorDatabaseVectorDatabasesVectorDatabaseIdGet,
	},
	'genai.listChatPromptsChatPromptsGet': {
		input: DatarobotEndpointInputSchemas.listChatPromptsChatPromptsGet,
		output: DatarobotEndpointOutputSchemas.listChatPromptsChatPromptsGet,
	},
	'genai.listChatsChatsGet': {
		input: DatarobotEndpointInputSchemas.listChatsChatsGet,
		output: DatarobotEndpointOutputSchemas.listChatsChatsGet,
	},
	'genai.listComparisonChatsComparisonChatsGet': {
		input: DatarobotEndpointInputSchemas.listComparisonChatsComparisonChatsGet,
		output:
			DatarobotEndpointOutputSchemas.listComparisonChatsComparisonChatsGet,
	},
	'genai.listComparisonPromptsComparisonPromptsGet': {
		input:
			DatarobotEndpointInputSchemas.listComparisonPromptsComparisonPromptsGet,
		output:
			DatarobotEndpointOutputSchemas.listComparisonPromptsComparisonPromptsGet,
	},
	'genai.listCustomModelEmbeddingsCustomModelEmbeddingValidationsGet': {
		input:
			DatarobotEndpointInputSchemas.listCustomModelEmbeddingsCustomModelEmbeddingValidationsGet,
		output:
			DatarobotEndpointOutputSchemas.listCustomModelEmbeddingsCustomModelEmbeddingValidationsGet,
	},
	'genai.listCustomModelLlmValidationsCustomModelLLMValidationsGet': {
		input:
			DatarobotEndpointInputSchemas.listCustomModelLlmValidationsCustomModelLLMValidationsGet,
		output:
			DatarobotEndpointOutputSchemas.listCustomModelLlmValidationsCustomModelLLMValidationsGet,
	},
	'genai.listCustomModelVectorDatabaseValidationsCustomModelVectorDatabaseValidationsGet':
		{
			input:
				DatarobotEndpointInputSchemas.listCustomModelVectorDatabaseValidationsCustomModelVectorDatabaseValidationsGet,
			output:
				DatarobotEndpointOutputSchemas.listCustomModelVectorDatabaseValidationsCustomModelVectorDatabaseValidationsGet,
		},
	'genai.listEvaluationDatasetConfigurationEvaluationDatasetConfigurationsGet':
		{
			input:
				DatarobotEndpointInputSchemas.listEvaluationDatasetConfigurationEvaluationDatasetConfigurationsGet,
			output:
				DatarobotEndpointOutputSchemas.listEvaluationDatasetConfigurationEvaluationDatasetConfigurationsGet,
		},
	'genai.listEvaluationDatasetMetricAggregationAggregatedByLlmBlueprintEvaluationDatasetMetricAggregationsAggregateByLLMBlueprintGet':
		{
			input:
				DatarobotEndpointInputSchemas.listEvaluationDatasetMetricAggregationAggregatedByLlmBlueprintEvaluationDatasetMetricAggregationsAggregateByLLMBlueprintGet,
			output:
				DatarobotEndpointOutputSchemas.listEvaluationDatasetMetricAggregationAggregatedByLlmBlueprintEvaluationDatasetMetricAggregationsAggregateByLLMBlueprintGet,
		},
	'genai.listEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsGet':
		{
			input:
				DatarobotEndpointInputSchemas.listEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsGet,
			output:
				DatarobotEndpointOutputSchemas.listEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsGet,
		},
	'genai.listEvaluationDatasetMetricAggregationUniqueFieldValuesEvaluationDatasetMetricAggregationsUniqueFieldValuesUniqueFieldGet':
		{
			input:
				DatarobotEndpointInputSchemas.listEvaluationDatasetMetricAggregationUniqueFieldValuesEvaluationDatasetMetricAggregationsUniqueFieldValuesUniqueFieldGet,
			output:
				DatarobotEndpointOutputSchemas.listEvaluationDatasetMetricAggregationUniqueFieldValuesEvaluationDatasetMetricAggregationsUniqueFieldValuesUniqueFieldGet,
		},
	'genai.listLlmBlueprintsLlmBlueprintsGet': {
		input: DatarobotEndpointInputSchemas.listLlmBlueprintsLlmBlueprintsGet,
		output: DatarobotEndpointOutputSchemas.listLlmBlueprintsLlmBlueprintsGet,
	},
	'genai.listLlmTestConfigurationNonOotbDatasetsLlmTestConfigurationsNonOotbDatasetsGet':
		{
			input:
				DatarobotEndpointInputSchemas.listLlmTestConfigurationNonOotbDatasetsLlmTestConfigurationsNonOotbDatasetsGet,
			output:
				DatarobotEndpointOutputSchemas.listLlmTestConfigurationNonOotbDatasetsLlmTestConfigurationsNonOotbDatasetsGet,
		},
	'genai.listLlmTestConfigurationOotbDatasetsLlmTestConfigurationsOotbDatasetsGet':
		{
			input:
				DatarobotEndpointInputSchemas.listLlmTestConfigurationOotbDatasetsLlmTestConfigurationsOotbDatasetsGet,
			output:
				DatarobotEndpointOutputSchemas.listLlmTestConfigurationOotbDatasetsLlmTestConfigurationsOotbDatasetsGet,
		},
	'genai.listLlmTestConfigurationSupportedInsightsLlmTestConfigurationsSupportedInsightsGet':
		{
			input:
				DatarobotEndpointInputSchemas.listLlmTestConfigurationSupportedInsightsLlmTestConfigurationsSupportedInsightsGet,
			output:
				DatarobotEndpointOutputSchemas.listLlmTestConfigurationSupportedInsightsLlmTestConfigurationsSupportedInsightsGet,
		},
	'genai.listLlmTestConfigurationsLlmTestConfigurationsGet': {
		input:
			DatarobotEndpointInputSchemas.listLlmTestConfigurationsLlmTestConfigurationsGet,
		output:
			DatarobotEndpointOutputSchemas.listLlmTestConfigurationsLlmTestConfigurationsGet,
	},
	'genai.listLlmTestResultsLlmTestResultsGet': {
		input: DatarobotEndpointInputSchemas.listLlmTestResultsLlmTestResultsGet,
		output: DatarobotEndpointOutputSchemas.listLlmTestResultsLlmTestResultsGet,
	},
	'genai.listLlmTestSuitesLlmTestSuitesGet': {
		input: DatarobotEndpointInputSchemas.listLlmTestSuitesLlmTestSuitesGet,
		output: DatarobotEndpointOutputSchemas.listLlmTestSuitesLlmTestSuitesGet,
	},
	'genai.listLlmsLlmsGet': {
		input: DatarobotEndpointInputSchemas.listLlmsLlmsGet,
		output: DatarobotEndpointOutputSchemas.listLlmsLlmsGet,
	},
	'genai.listOotbMetricConfigurationsPlaygroundsPlaygroundIdOotbMetricConfigurationsGet':
		{
			input:
				DatarobotEndpointInputSchemas.listOotbMetricConfigurationsPlaygroundsPlaygroundIdOotbMetricConfigurationsGet,
			output:
				DatarobotEndpointOutputSchemas.listOotbMetricConfigurationsPlaygroundsPlaygroundIdOotbMetricConfigurationsGet,
		},
	'genai.listPlaygroundsPlaygroundsGet': {
		input: DatarobotEndpointInputSchemas.listPlaygroundsPlaygroundsGet,
		output: DatarobotEndpointOutputSchemas.listPlaygroundsPlaygroundsGet,
	},
	'genai.listPromptTemplateVersionsPromptTemplatesPromptTemplateIdVersionsGet':
		{
			input:
				DatarobotEndpointInputSchemas.listPromptTemplateVersionsPromptTemplatesPromptTemplateIdVersionsGet,
			output:
				DatarobotEndpointOutputSchemas.listPromptTemplateVersionsPromptTemplatesPromptTemplateIdVersionsGet,
		},
	'genai.listPromptTemplatesPromptTemplatesGet': {
		input: DatarobotEndpointInputSchemas.listPromptTemplatesPromptTemplatesGet,
		output:
			DatarobotEndpointOutputSchemas.listPromptTemplatesPromptTemplatesGet,
	},
	'genai.listPromptTemplatesVersionsPromptTemplatesVersionsGet': {
		input:
			DatarobotEndpointInputSchemas.listPromptTemplatesVersionsPromptTemplatesVersionsGet,
		output:
			DatarobotEndpointOutputSchemas.listPromptTemplatesVersionsPromptTemplatesVersionsGet,
	},
	'genai.listSearchStudySyftrSearchGet': {
		input: DatarobotEndpointInputSchemas.listSearchStudySyftrSearchGet,
		output: DatarobotEndpointOutputSchemas.listSearchStudySyftrSearchGet,
	},
	'genai.listSidecarModelValidationsSidecarModelMetricValidationsGet': {
		input:
			DatarobotEndpointInputSchemas.listSidecarModelValidationsSidecarModelMetricValidationsGet,
		output:
			DatarobotEndpointOutputSchemas.listSidecarModelValidationsSidecarModelMetricValidationsGet,
	},
	'genai.listVectorDatabasesVectorDatabasesGet': {
		input: DatarobotEndpointInputSchemas.listVectorDatabasesVectorDatabasesGet,
		output:
			DatarobotEndpointOutputSchemas.listVectorDatabasesVectorDatabasesGet,
	},
	'genai.playgroundTraceMetadataPlaygroundsPlaygroundIdTraceMetadataGet': {
		input:
			DatarobotEndpointInputSchemas.playgroundTraceMetadataPlaygroundsPlaygroundIdTraceMetadataGet,
		output:
			DatarobotEndpointOutputSchemas.playgroundTraceMetadataPlaygroundsPlaygroundIdTraceMetadataGet,
	},
	'genai.playgroundTracePlaygroundsPlaygroundIdTraceGet': {
		input:
			DatarobotEndpointInputSchemas.playgroundTracePlaygroundsPlaygroundIdTraceGet,
		output:
			DatarobotEndpointOutputSchemas.playgroundTracePlaygroundsPlaygroundIdTraceGet,
	},
	'genai.revalidateCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdRevalidatePost':
		{
			input:
				DatarobotEndpointInputSchemas.revalidateCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdRevalidatePost,
			output:
				DatarobotEndpointOutputSchemas.revalidateCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdRevalidatePost,
		},
	'genai.revalidateCustomModelLlmValidationCustomModelLLMValidationsValidationIdRevalidatePost':
		{
			input:
				DatarobotEndpointInputSchemas.revalidateCustomModelLlmValidationCustomModelLLMValidationsValidationIdRevalidatePost,
			output:
				DatarobotEndpointOutputSchemas.revalidateCustomModelLlmValidationCustomModelLLMValidationsValidationIdRevalidatePost,
		},
	'genai.revalidateCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdRevalidatePost':
		{
			input:
				DatarobotEndpointInputSchemas.revalidateCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdRevalidatePost,
			output:
				DatarobotEndpointOutputSchemas.revalidateCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdRevalidatePost,
		},
	'genai.revalidateSidecarModelValidationSidecarModelMetricValidationsValidationIdRevalidatePost':
		{
			input:
				DatarobotEndpointInputSchemas.revalidateSidecarModelValidationSidecarModelMetricValidationsValidationIdRevalidatePost,
			output:
				DatarobotEndpointOutputSchemas.revalidateSidecarModelValidationSidecarModelMetricValidationsValidationIdRevalidatePost,
		},
	'genai.runAgenticSearchSyftrSearchPost': {
		input: DatarobotEndpointInputSchemas.runAgenticSearchSyftrSearchPost,
		output: DatarobotEndpointOutputSchemas.runAgenticSearchSyftrSearchPost,
	},
	'genai.updateChatPromptDataChatPromptsChatPromptIdPatch': {
		input:
			DatarobotEndpointInputSchemas.updateChatPromptDataChatPromptsChatPromptIdPatch,
		output:
			DatarobotEndpointOutputSchemas.updateChatPromptDataChatPromptsChatPromptIdPatch,
	},
	'genai.updateComparisonPromptComparisonPromptsComparisonPromptIdPatch': {
		input:
			DatarobotEndpointInputSchemas.updateComparisonPromptComparisonPromptsComparisonPromptIdPatch,
		output:
			DatarobotEndpointOutputSchemas.updateComparisonPromptComparisonPromptsComparisonPromptIdPatch,
	},
	'genai.updateConnectedVectorDatabaseVectorDatabasesVectorDatabaseIdExternalVectorDatabaseDocumentsPatch':
		{
			input:
				DatarobotEndpointInputSchemas.updateConnectedVectorDatabaseVectorDatabasesVectorDatabaseIdExternalVectorDatabaseDocumentsPatch,
			output:
				DatarobotEndpointOutputSchemas.updateConnectedVectorDatabaseVectorDatabasesVectorDatabaseIdExternalVectorDatabaseDocumentsPatch,
		},
	'genai.updateCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdPatch':
		{
			input:
				DatarobotEndpointInputSchemas.updateCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdPatch,
			output:
				DatarobotEndpointOutputSchemas.updateCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdPatch,
		},
	'genai.updateCustomModelLlmValidationCustomModelLLMValidationsValidationIdPatch':
		{
			input:
				DatarobotEndpointInputSchemas.updateCustomModelLlmValidationCustomModelLLMValidationsValidationIdPatch,
			output:
				DatarobotEndpointOutputSchemas.updateCustomModelLlmValidationCustomModelLLMValidationsValidationIdPatch,
		},
	'genai.updateCustomModelValidationCustomModelEmbeddingValidationsValidationIdPatch':
		{
			input:
				DatarobotEndpointInputSchemas.updateCustomModelValidationCustomModelEmbeddingValidationsValidationIdPatch,
			output:
				DatarobotEndpointOutputSchemas.updateCustomModelValidationCustomModelEmbeddingValidationsValidationIdPatch,
		},
	'genai.updateCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdPatch':
		{
			input:
				DatarobotEndpointInputSchemas.updateCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdPatch,
			output:
				DatarobotEndpointOutputSchemas.updateCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdPatch,
		},
	'genai.updateEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdPatch':
		{
			input:
				DatarobotEndpointInputSchemas.updateEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdPatch,
			output:
				DatarobotEndpointOutputSchemas.updateEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdPatch,
		},
	'genai.updateLlmBlueprintLlmBlueprintsLlmBlueprintIdPatch': {
		input:
			DatarobotEndpointInputSchemas.updateLlmBlueprintLlmBlueprintsLlmBlueprintIdPatch,
		output:
			DatarobotEndpointOutputSchemas.updateLlmBlueprintLlmBlueprintsLlmBlueprintIdPatch,
	},
	'genai.updatePlaygroundPlaygroundsPlaygroundIdPatch': {
		input:
			DatarobotEndpointInputSchemas.updatePlaygroundPlaygroundsPlaygroundIdPatch,
		output:
			DatarobotEndpointOutputSchemas.updatePlaygroundPlaygroundsPlaygroundIdPatch,
	},
	'genai.updateSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdPatch':
		{
			input:
				DatarobotEndpointInputSchemas.updateSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdPatch,
			output:
				DatarobotEndpointOutputSchemas.updateSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdPatch,
		},
	'genai.updateVectorDatabaseVectorDatabasesVectorDatabaseIdPatch': {
		input:
			DatarobotEndpointInputSchemas.updateVectorDatabaseVectorDatabasesVectorDatabaseIdPatch,
		output:
			DatarobotEndpointOutputSchemas.updateVectorDatabaseVectorDatabasesVectorDatabaseIdPatch,
	},
	'genai.upsertPlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationPost':
		{
			input:
				DatarobotEndpointInputSchemas.upsertPlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationPost,
			output:
				DatarobotEndpointOutputSchemas.upsertPlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationPost,
		},
	'groups.groupsCreate': {
		input: DatarobotEndpointInputSchemas.groupsCreate,
		output: DatarobotEndpointOutputSchemas.groupsCreate,
	},
	'groups.groupsDelete': {
		input: DatarobotEndpointInputSchemas.groupsDelete,
		output: DatarobotEndpointOutputSchemas.groupsDelete,
	},
	'groups.groupsDeleteMany': {
		input: DatarobotEndpointInputSchemas.groupsDeleteMany,
		output: DatarobotEndpointOutputSchemas.groupsDeleteMany,
	},
	'groups.groupsList': {
		input: DatarobotEndpointInputSchemas.groupsList,
		output: DatarobotEndpointOutputSchemas.groupsList,
	},
	'groups.groupsPatch': {
		input: DatarobotEndpointInputSchemas.groupsPatch,
		output: DatarobotEndpointOutputSchemas.groupsPatch,
	},
	'groups.groupsRetrieve': {
		input: DatarobotEndpointInputSchemas.groupsRetrieve,
		output: DatarobotEndpointOutputSchemas.groupsRetrieve,
	},
	'groups.groupsUsersCreate': {
		input: DatarobotEndpointInputSchemas.groupsUsersCreate,
		output: DatarobotEndpointOutputSchemas.groupsUsersCreate,
	},
	'groups.groupsUsersDeleteMany': {
		input: DatarobotEndpointInputSchemas.groupsUsersDeleteMany,
		output: DatarobotEndpointOutputSchemas.groupsUsersDeleteMany,
	},
	'groups.groupsUsersList': {
		input: DatarobotEndpointInputSchemas.groupsUsersList,
		output: DatarobotEndpointOutputSchemas.groupsUsersList,
	},
	'guardConfigurations.guardConfigurationsCreate': {
		input: DatarobotEndpointInputSchemas.guardConfigurationsCreate,
		output: DatarobotEndpointOutputSchemas.guardConfigurationsCreate,
	},
	'guardConfigurations.guardConfigurationsDelete': {
		input: DatarobotEndpointInputSchemas.guardConfigurationsDelete,
		output: DatarobotEndpointOutputSchemas.guardConfigurationsDelete,
	},
	'guardConfigurations.guardConfigurationsList': {
		input: DatarobotEndpointInputSchemas.guardConfigurationsList,
		output: DatarobotEndpointOutputSchemas.guardConfigurationsList,
	},
	'guardConfigurations.guardConfigurationsPatch': {
		input: DatarobotEndpointInputSchemas.guardConfigurationsPatch,
		output: DatarobotEndpointOutputSchemas.guardConfigurationsPatch,
	},
	'guardConfigurations.guardConfigurationsPredictionEnvironmentsInUseList': {
		input:
			DatarobotEndpointInputSchemas.guardConfigurationsPredictionEnvironmentsInUseList,
		output:
			DatarobotEndpointOutputSchemas.guardConfigurationsPredictionEnvironmentsInUseList,
	},
	'guardConfigurations.guardConfigurationsRetrieve': {
		input: DatarobotEndpointInputSchemas.guardConfigurationsRetrieve,
		output: DatarobotEndpointOutputSchemas.guardConfigurationsRetrieve,
	},
	'guardConfigurations.guardConfigurationsToNewCustomModelVersionCreate': {
		input:
			DatarobotEndpointInputSchemas.guardConfigurationsToNewCustomModelVersionCreate,
		output:
			DatarobotEndpointOutputSchemas.guardConfigurationsToNewCustomModelVersionCreate,
	},
	'guardTemplates.guardTemplatesList': {
		input: DatarobotEndpointInputSchemas.guardTemplatesList,
		output: DatarobotEndpointOutputSchemas.guardTemplatesList,
	},
	'guardTemplates.guardTemplatesRetrieve': {
		input: DatarobotEndpointInputSchemas.guardTemplatesRetrieve,
		output: DatarobotEndpointOutputSchemas.guardTemplatesRetrieve,
	},
	'imageAugmentationLists.imageAugmentationListsCreate': {
		input: DatarobotEndpointInputSchemas.imageAugmentationListsCreate,
		output: DatarobotEndpointOutputSchemas.imageAugmentationListsCreate,
	},
	'imageAugmentationLists.imageAugmentationListsDelete': {
		input: DatarobotEndpointInputSchemas.imageAugmentationListsDelete,
		output: DatarobotEndpointOutputSchemas.imageAugmentationListsDelete,
	},
	'imageAugmentationLists.imageAugmentationListsList': {
		input: DatarobotEndpointInputSchemas.imageAugmentationListsList,
		output: DatarobotEndpointOutputSchemas.imageAugmentationListsList,
	},
	'imageAugmentationLists.imageAugmentationListsPatch': {
		input: DatarobotEndpointInputSchemas.imageAugmentationListsPatch,
		output: DatarobotEndpointOutputSchemas.imageAugmentationListsPatch,
	},
	'imageAugmentationLists.imageAugmentationListsRetrieve': {
		input: DatarobotEndpointInputSchemas.imageAugmentationListsRetrieve,
		output: DatarobotEndpointOutputSchemas.imageAugmentationListsRetrieve,
	},
	'imageAugmentationLists.imageAugmentationListsSamplesCreate': {
		input: DatarobotEndpointInputSchemas.imageAugmentationListsSamplesCreate,
		output: DatarobotEndpointOutputSchemas.imageAugmentationListsSamplesCreate,
	},
	'imageAugmentationLists.imageAugmentationListsSamplesList': {
		input: DatarobotEndpointInputSchemas.imageAugmentationListsSamplesList,
		output: DatarobotEndpointOutputSchemas.imageAugmentationListsSamplesList,
	},
	'insights.insightsConfusionMatrixCreate': {
		input: DatarobotEndpointInputSchemas.insightsConfusionMatrixCreate,
		output: DatarobotEndpointOutputSchemas.insightsConfusionMatrixCreate,
	},
	'insights.insightsConfusionMatrixModelsList': {
		input: DatarobotEndpointInputSchemas.insightsConfusionMatrixModelsList,
		output: DatarobotEndpointOutputSchemas.insightsConfusionMatrixModelsList,
	},
	'insights.insightsFeatureEffectsCreate': {
		input: DatarobotEndpointInputSchemas.insightsFeatureEffectsCreate,
		output: DatarobotEndpointOutputSchemas.insightsFeatureEffectsCreate,
	},
	'insights.insightsFeatureEffectsModelsList': {
		input: DatarobotEndpointInputSchemas.insightsFeatureEffectsModelsList,
		output: DatarobotEndpointOutputSchemas.insightsFeatureEffectsModelsList,
	},
	'insights.insightsFeatureImpactCreate': {
		input: DatarobotEndpointInputSchemas.insightsFeatureImpactCreate,
		output: DatarobotEndpointOutputSchemas.insightsFeatureImpactCreate,
	},
	'insights.insightsFeatureImpactModelsList': {
		input: DatarobotEndpointInputSchemas.insightsFeatureImpactModelsList,
		output: DatarobotEndpointOutputSchemas.insightsFeatureImpactModelsList,
	},
	'insights.insightsLiftChartCreate': {
		input: DatarobotEndpointInputSchemas.insightsLiftChartCreate,
		output: DatarobotEndpointOutputSchemas.insightsLiftChartCreate,
	},
	'insights.insightsLiftChartModelsList': {
		input: DatarobotEndpointInputSchemas.insightsLiftChartModelsList,
		output: DatarobotEndpointOutputSchemas.insightsLiftChartModelsList,
	},
	'insights.insightsModelsDelete': {
		input: DatarobotEndpointInputSchemas.insightsModelsDelete,
		output: DatarobotEndpointOutputSchemas.insightsModelsDelete,
	},
	'insights.insightsResidualsCreate': {
		input: DatarobotEndpointInputSchemas.insightsResidualsCreate,
		output: DatarobotEndpointOutputSchemas.insightsResidualsCreate,
	},
	'insights.insightsResidualsModelsList': {
		input: DatarobotEndpointInputSchemas.insightsResidualsModelsList,
		output: DatarobotEndpointOutputSchemas.insightsResidualsModelsList,
	},
	'insights.insightsRocCurveCreate': {
		input: DatarobotEndpointInputSchemas.insightsRocCurveCreate,
		output: DatarobotEndpointOutputSchemas.insightsRocCurveCreate,
	},
	'insights.insightsRocCurveModelsList': {
		input: DatarobotEndpointInputSchemas.insightsRocCurveModelsList,
		output: DatarobotEndpointOutputSchemas.insightsRocCurveModelsList,
	},
	'insights.insightsShapDistributionsCreate': {
		input: DatarobotEndpointInputSchemas.insightsShapDistributionsCreate,
		output: DatarobotEndpointOutputSchemas.insightsShapDistributionsCreate,
	},
	'insights.insightsShapDistributionsModelsList': {
		input: DatarobotEndpointInputSchemas.insightsShapDistributionsModelsList,
		output: DatarobotEndpointOutputSchemas.insightsShapDistributionsModelsList,
	},
	'insights.insightsShapImpactCreate': {
		input: DatarobotEndpointInputSchemas.insightsShapImpactCreate,
		output: DatarobotEndpointOutputSchemas.insightsShapImpactCreate,
	},
	'insights.insightsShapImpactModelsList': {
		input: DatarobotEndpointInputSchemas.insightsShapImpactModelsList,
		output: DatarobotEndpointOutputSchemas.insightsShapImpactModelsList,
	},
	'insights.insightsShapMatrixCreate': {
		input: DatarobotEndpointInputSchemas.insightsShapMatrixCreate,
		output: DatarobotEndpointOutputSchemas.insightsShapMatrixCreate,
	},
	'insights.insightsShapMatrixModelsList': {
		input: DatarobotEndpointInputSchemas.insightsShapMatrixModelsList,
		output: DatarobotEndpointOutputSchemas.insightsShapMatrixModelsList,
	},
	'insights.insightsShapPreviewCreate': {
		input: DatarobotEndpointInputSchemas.insightsShapPreviewCreate,
		output: DatarobotEndpointOutputSchemas.insightsShapPreviewCreate,
	},
	'insights.insightsShapPreviewModelsList': {
		input: DatarobotEndpointInputSchemas.insightsShapPreviewModelsList,
		output: DatarobotEndpointOutputSchemas.insightsShapPreviewModelsList,
	},
	'mlops.mlopsComputeBundlesList': {
		input: DatarobotEndpointInputSchemas.mlopsComputeBundlesList,
		output: DatarobotEndpointOutputSchemas.mlopsComputeBundlesList,
	},
	'mlops.mlopsComputeBundlesRetrieve': {
		input: DatarobotEndpointInputSchemas.mlopsComputeBundlesRetrieve,
		output: DatarobotEndpointOutputSchemas.mlopsComputeBundlesRetrieve,
	},
	'mlops.mlopsPortablePredictionServerImageList': {
		input: DatarobotEndpointInputSchemas.mlopsPortablePredictionServerImageList,
		output:
			DatarobotEndpointOutputSchemas.mlopsPortablePredictionServerImageList,
	},
	'mlops.mlopsPortablePredictionServerImageMetadataList': {
		input:
			DatarobotEndpointInputSchemas.mlopsPortablePredictionServerImageMetadataList,
		output:
			DatarobotEndpointOutputSchemas.mlopsPortablePredictionServerImageMetadataList,
	},
	'modelPackages.modelPackagesArchiveCreate': {
		input: DatarobotEndpointInputSchemas.modelPackagesArchiveCreate,
		output: DatarobotEndpointOutputSchemas.modelPackagesArchiveCreate,
	},
	'modelPackages.modelPackagesCapabilitiesList': {
		input: DatarobotEndpointInputSchemas.modelPackagesCapabilitiesList,
		output: DatarobotEndpointOutputSchemas.modelPackagesCapabilitiesList,
	},
	'modelPackages.modelPackagesFeaturesList': {
		input: DatarobotEndpointInputSchemas.modelPackagesFeaturesList,
		output: DatarobotEndpointOutputSchemas.modelPackagesFeaturesList,
	},
	'modelPackages.modelPackagesFromJSONCreate': {
		input: DatarobotEndpointInputSchemas.modelPackagesFromJSONCreate,
		output: DatarobotEndpointOutputSchemas.modelPackagesFromJSONCreate,
	},
	'modelPackages.modelPackagesFromLeaderboardCreate': {
		input: DatarobotEndpointInputSchemas.modelPackagesFromLeaderboardCreate,
		output: DatarobotEndpointOutputSchemas.modelPackagesFromLeaderboardCreate,
	},
	'modelPackages.modelPackagesFromLearningModelCreate': {
		input: DatarobotEndpointInputSchemas.modelPackagesFromLearningModelCreate,
		output: DatarobotEndpointOutputSchemas.modelPackagesFromLearningModelCreate,
	},
	'modelPackages.modelPackagesList': {
		input: DatarobotEndpointInputSchemas.modelPackagesList,
		output: DatarobotEndpointOutputSchemas.modelPackagesList,
	},
	'modelPackages.modelPackagesModelLogsList': {
		input: DatarobotEndpointInputSchemas.modelPackagesModelLogsList,
		output: DatarobotEndpointOutputSchemas.modelPackagesModelLogsList,
	},
	'modelPackages.modelPackagesRetrieve': {
		input: DatarobotEndpointInputSchemas.modelPackagesRetrieve,
		output: DatarobotEndpointOutputSchemas.modelPackagesRetrieve,
	},
	'modelPackages.modelPackagesSharedRolesList': {
		input: DatarobotEndpointInputSchemas.modelPackagesSharedRolesList,
		output: DatarobotEndpointOutputSchemas.modelPackagesSharedRolesList,
	},
	'notebookCodeSnippets.notebookCodeSnippetsList': {
		input: DatarobotEndpointInputSchemas.notebookCodeSnippetsList,
		output: DatarobotEndpointOutputSchemas.notebookCodeSnippetsList,
	},
	'notebookCodeSnippets.notebookCodeSnippetsRetrieve': {
		input: DatarobotEndpointInputSchemas.notebookCodeSnippetsRetrieve,
		output: DatarobotEndpointOutputSchemas.notebookCodeSnippetsRetrieve,
	},
	'notebookCodeSnippets.notebookCodeSnippetsTagsList': {
		input: DatarobotEndpointInputSchemas.notebookCodeSnippetsTagsList,
		output: DatarobotEndpointOutputSchemas.notebookCodeSnippetsTagsList,
	},
	'notebookEnvironmentVariables.notebookEnvironmentVariablesCreate': {
		input: DatarobotEndpointInputSchemas.notebookEnvironmentVariablesCreate,
		output: DatarobotEndpointOutputSchemas.notebookEnvironmentVariablesCreate,
	},
	'notebookEnvironmentVariables.notebookEnvironmentVariablesDelete': {
		input: DatarobotEndpointInputSchemas.notebookEnvironmentVariablesDelete,
		output: DatarobotEndpointOutputSchemas.notebookEnvironmentVariablesDelete,
	},
	'notebookEnvironmentVariables.notebookEnvironmentVariablesDelete2': {
		input: DatarobotEndpointInputSchemas.notebookEnvironmentVariablesDelete2,
		output: DatarobotEndpointOutputSchemas.notebookEnvironmentVariablesDelete2,
	},
	'notebookEnvironmentVariables.notebookEnvironmentVariablesPatch': {
		input: DatarobotEndpointInputSchemas.notebookEnvironmentVariablesPatch,
		output: DatarobotEndpointOutputSchemas.notebookEnvironmentVariablesPatch,
	},
	'notebookEnvironmentVariables.notebookEnvironmentVariablesRetrieve': {
		input: DatarobotEndpointInputSchemas.notebookEnvironmentVariablesRetrieve,
		output: DatarobotEndpointOutputSchemas.notebookEnvironmentVariablesRetrieve,
	},
	'notebookExecutionEnvironments.notebookExecutionEnvironmentsList': {
		input: DatarobotEndpointInputSchemas.notebookExecutionEnvironmentsList,
		output: DatarobotEndpointOutputSchemas.notebookExecutionEnvironmentsList,
	},
	'notebookExecutionEnvironments.notebookExecutionEnvironmentsMachinesList': {
		input:
			DatarobotEndpointInputSchemas.notebookExecutionEnvironmentsMachinesList,
		output:
			DatarobotEndpointOutputSchemas.notebookExecutionEnvironmentsMachinesList,
	},
	'notebookExecutionEnvironments.notebookExecutionEnvironmentsNotebooksList': {
		input:
			DatarobotEndpointInputSchemas.notebookExecutionEnvironmentsNotebooksList,
		output:
			DatarobotEndpointOutputSchemas.notebookExecutionEnvironmentsNotebooksList,
	},
	'notebookExecutionEnvironments.notebookExecutionEnvironmentsPatch': {
		input: DatarobotEndpointInputSchemas.notebookExecutionEnvironmentsPatch,
		output: DatarobotEndpointOutputSchemas.notebookExecutionEnvironmentsPatch,
	},
	'notebookExecutionEnvironments.notebookExecutionEnvironmentsPortsCreate': {
		input:
			DatarobotEndpointInputSchemas.notebookExecutionEnvironmentsPortsCreate,
		output:
			DatarobotEndpointOutputSchemas.notebookExecutionEnvironmentsPortsCreate,
	},
	'notebookExecutionEnvironments.notebookExecutionEnvironmentsPortsDelete': {
		input:
			DatarobotEndpointInputSchemas.notebookExecutionEnvironmentsPortsDelete,
		output:
			DatarobotEndpointOutputSchemas.notebookExecutionEnvironmentsPortsDelete,
	},
	'notebookExecutionEnvironments.notebookExecutionEnvironmentsPortsDelete2': {
		input:
			DatarobotEndpointInputSchemas.notebookExecutionEnvironmentsPortsDelete2,
		output:
			DatarobotEndpointOutputSchemas.notebookExecutionEnvironmentsPortsDelete2,
	},
	'notebookExecutionEnvironments.notebookExecutionEnvironmentsPortsList': {
		input: DatarobotEndpointInputSchemas.notebookExecutionEnvironmentsPortsList,
		output:
			DatarobotEndpointOutputSchemas.notebookExecutionEnvironmentsPortsList,
	},
	'notebookExecutionEnvironments.notebookExecutionEnvironmentsPortsPatch': {
		input:
			DatarobotEndpointInputSchemas.notebookExecutionEnvironmentsPortsPatch,
		output:
			DatarobotEndpointOutputSchemas.notebookExecutionEnvironmentsPortsPatch,
	},
	'notebookExecutionEnvironments.notebookExecutionEnvironmentsRetrieve': {
		input: DatarobotEndpointInputSchemas.notebookExecutionEnvironmentsRetrieve,
		output:
			DatarobotEndpointOutputSchemas.notebookExecutionEnvironmentsRetrieve,
	},
	'notebookExecutionEnvironments.notebookExecutionEnvironmentsVersionsList': {
		input:
			DatarobotEndpointInputSchemas.notebookExecutionEnvironmentsVersionsList,
		output:
			DatarobotEndpointOutputSchemas.notebookExecutionEnvironmentsVersionsList,
	},
	'notebookJobs.notebookJobsCancelCreate': {
		input: DatarobotEndpointInputSchemas.notebookJobsCancelCreate,
		output: DatarobotEndpointOutputSchemas.notebookJobsCancelCreate,
	},
	'notebookJobs.notebookJobsCreate': {
		input: DatarobotEndpointInputSchemas.notebookJobsCreate,
		output: DatarobotEndpointOutputSchemas.notebookJobsCreate,
	},
	'notebookJobs.notebookJobsDelete': {
		input: DatarobotEndpointInputSchemas.notebookJobsDelete,
		output: DatarobotEndpointOutputSchemas.notebookJobsDelete,
	},
	'notebookJobs.notebookJobsList': {
		input: DatarobotEndpointInputSchemas.notebookJobsList,
		output: DatarobotEndpointOutputSchemas.notebookJobsList,
	},
	'notebookJobs.notebookJobsManualRunCreate': {
		input: DatarobotEndpointInputSchemas.notebookJobsManualRunCreate,
		output: DatarobotEndpointOutputSchemas.notebookJobsManualRunCreate,
	},
	'notebookJobs.notebookJobsPatch': {
		input: DatarobotEndpointInputSchemas.notebookJobsPatch,
		output: DatarobotEndpointOutputSchemas.notebookJobsPatch,
	},
	'notebookJobs.notebookJobsRetrieve': {
		input: DatarobotEndpointInputSchemas.notebookJobsRetrieve,
		output: DatarobotEndpointOutputSchemas.notebookJobsRetrieve,
	},
	'notebookJobs.notebookJobsRunHistoryList': {
		input: DatarobotEndpointInputSchemas.notebookJobsRunHistoryList,
		output: DatarobotEndpointOutputSchemas.notebookJobsRunHistoryList,
	},
	'notebookRevisions.notebookRevisionsCellsList': {
		input: DatarobotEndpointInputSchemas.notebookRevisionsCellsList,
		output: DatarobotEndpointOutputSchemas.notebookRevisionsCellsList,
	},
	'notebookRevisions.notebookRevisionsCreate': {
		input: DatarobotEndpointInputSchemas.notebookRevisionsCreate,
		output: DatarobotEndpointOutputSchemas.notebookRevisionsCreate,
	},
	'notebookRevisions.notebookRevisionsDelete': {
		input: DatarobotEndpointInputSchemas.notebookRevisionsDelete,
		output: DatarobotEndpointOutputSchemas.notebookRevisionsDelete,
	},
	'notebookRevisions.notebookRevisionsDelete2': {
		input: DatarobotEndpointInputSchemas.notebookRevisionsDelete2,
		output: DatarobotEndpointOutputSchemas.notebookRevisionsDelete2,
	},
	'notebookRevisions.notebookRevisionsFromRevisionCloneCreate': {
		input:
			DatarobotEndpointInputSchemas.notebookRevisionsFromRevisionCloneCreate,
		output:
			DatarobotEndpointOutputSchemas.notebookRevisionsFromRevisionCloneCreate,
	},
	'notebookRevisions.notebookRevisionsFromRevisionRestoreCreate': {
		input:
			DatarobotEndpointInputSchemas.notebookRevisionsFromRevisionRestoreCreate,
		output:
			DatarobotEndpointOutputSchemas.notebookRevisionsFromRevisionRestoreCreate,
	},
	'notebookRevisions.notebookRevisionsPatch': {
		input: DatarobotEndpointInputSchemas.notebookRevisionsPatch,
		output: DatarobotEndpointOutputSchemas.notebookRevisionsPatch,
	},
	'notebookRevisions.notebookRevisionsRetrieve': {
		input: DatarobotEndpointInputSchemas.notebookRevisionsRetrieve,
		output: DatarobotEndpointOutputSchemas.notebookRevisionsRetrieve,
	},
	'notebookRevisions.notebookRevisionsRetrieve2': {
		input: DatarobotEndpointInputSchemas.notebookRevisionsRetrieve2,
		output: DatarobotEndpointOutputSchemas.notebookRevisionsRetrieve2,
	},
	'notebookRevisions.notebookRevisionsToFileList': {
		input: DatarobotEndpointInputSchemas.notebookRevisionsToFileList,
		output: DatarobotEndpointOutputSchemas.notebookRevisionsToFileList,
	},
	'notebooks.notebookSharedRolesList': {
		input: DatarobotEndpointInputSchemas.notebookSharedRolesList,
		output: DatarobotEndpointOutputSchemas.notebookSharedRolesList,
	},
	'notebooks.notebooksBatchClearCellsExecutionCountPatch': {
		input:
			DatarobotEndpointInputSchemas.notebooksBatchClearCellsExecutionCountPatch,
		output:
			DatarobotEndpointOutputSchemas.notebooksBatchClearCellsExecutionCountPatch,
	},
	'notebooks.notebooksBulkLinkUseCaseCreate': {
		input: DatarobotEndpointInputSchemas.notebooksBulkLinkUseCaseCreate,
		output: DatarobotEndpointOutputSchemas.notebooksBulkLinkUseCaseCreate,
	},
	'notebooks.notebooksCellsBatchClearOutputPatch': {
		input: DatarobotEndpointInputSchemas.notebooksCellsBatchClearOutputPatch,
		output: DatarobotEndpointOutputSchemas.notebooksCellsBatchClearOutputPatch,
	},
	'notebooks.notebooksCellsBatchCreateCreate': {
		input: DatarobotEndpointInputSchemas.notebooksCellsBatchCreateCreate,
		output: DatarobotEndpointOutputSchemas.notebooksCellsBatchCreateCreate,
	},
	'notebooks.notebooksCellsBatchDeleteCreate': {
		input: DatarobotEndpointInputSchemas.notebooksCellsBatchDeleteCreate,
		output: DatarobotEndpointOutputSchemas.notebooksCellsBatchDeleteCreate,
	},
	'notebooks.notebooksCellsBatchUpdateMetadataPatch': {
		input: DatarobotEndpointInputSchemas.notebooksCellsBatchUpdateMetadataPatch,
		output:
			DatarobotEndpointOutputSchemas.notebooksCellsBatchUpdateMetadataPatch,
	},
	'notebooks.notebooksCellsBatchUpdateSourcesPatch': {
		input: DatarobotEndpointInputSchemas.notebooksCellsBatchUpdateSourcesPatch,
		output:
			DatarobotEndpointOutputSchemas.notebooksCellsBatchUpdateSourcesPatch,
	},
	'notebooks.notebooksCellsCreate': {
		input: DatarobotEndpointInputSchemas.notebooksCellsCreate,
		output: DatarobotEndpointOutputSchemas.notebooksCellsCreate,
	},
	'notebooks.notebooksCellsDelete': {
		input: DatarobotEndpointInputSchemas.notebooksCellsDelete,
		output: DatarobotEndpointOutputSchemas.notebooksCellsDelete,
	},
	'notebooks.notebooksCellsList': {
		input: DatarobotEndpointInputSchemas.notebooksCellsList,
		output: DatarobotEndpointOutputSchemas.notebooksCellsList,
	},
	'notebooks.notebooksCellsOutputPatch': {
		input: DatarobotEndpointInputSchemas.notebooksCellsOutputPatch,
		output: DatarobotEndpointOutputSchemas.notebooksCellsOutputPatch,
	},
	'notebooks.notebooksCellsPatch': {
		input: DatarobotEndpointInputSchemas.notebooksCellsPatch,
		output: DatarobotEndpointOutputSchemas.notebooksCellsPatch,
	},
	'notebooks.notebooksCreate': {
		input: DatarobotEndpointInputSchemas.notebooksCreate,
		output: DatarobotEndpointOutputSchemas.notebooksCreate,
	},
	'notebooks.notebooksDelete': {
		input: DatarobotEndpointInputSchemas.notebooksDelete,
		output: DatarobotEndpointOutputSchemas.notebooksDelete,
	},
	'notebooks.notebooksFilterOptionsList': {
		input: DatarobotEndpointInputSchemas.notebooksFilterOptionsList,
		output: DatarobotEndpointOutputSchemas.notebooksFilterOptionsList,
	},
	'notebooks.notebooksFromFileCreate': {
		input: DatarobotEndpointInputSchemas.notebooksFromFileCreate,
		output: DatarobotEndpointOutputSchemas.notebooksFromFileCreate,
	},
	'notebooks.notebooksFromUrlCreate': {
		input: DatarobotEndpointInputSchemas.notebooksFromUrlCreate,
		output: DatarobotEndpointOutputSchemas.notebooksFromUrlCreate,
	},
	'notebooks.notebooksList': {
		input: DatarobotEndpointInputSchemas.notebooksList,
		output: DatarobotEndpointOutputSchemas.notebooksList,
	},
	'notebooks.notebooksPatch': {
		input: DatarobotEndpointInputSchemas.notebooksPatch,
		output: DatarobotEndpointOutputSchemas.notebooksPatch,
	},
	'notebooks.notebooksReorderCellsPatch': {
		input: DatarobotEndpointInputSchemas.notebooksReorderCellsPatch,
		output: DatarobotEndpointOutputSchemas.notebooksReorderCellsPatch,
	},
	'notebooks.notebooksRetrieve': {
		input: DatarobotEndpointInputSchemas.notebooksRetrieve,
		output: DatarobotEndpointOutputSchemas.notebooksRetrieve,
	},
	'notebooks.notebooksSharedRolesList': {
		input: DatarobotEndpointInputSchemas.notebooksSharedRolesList,
		output: DatarobotEndpointOutputSchemas.notebooksSharedRolesList,
	},
	'notebooks.notebooksStatePatch': {
		input: DatarobotEndpointInputSchemas.notebooksStatePatch,
		output: DatarobotEndpointOutputSchemas.notebooksStatePatch,
	},
	'notebooks.notebooksToCodespaceCreate': {
		input: DatarobotEndpointInputSchemas.notebooksToCodespaceCreate,
		output: DatarobotEndpointOutputSchemas.notebooksToCodespaceCreate,
	},
	'notebooks.notebooksToFileList': {
		input: DatarobotEndpointInputSchemas.notebooksToFileList,
		output: DatarobotEndpointOutputSchemas.notebooksToFileList,
	},
	'notificationChannelTemplates.notificationChannelTemplatesCreate': {
		input: DatarobotEndpointInputSchemas.notificationChannelTemplatesCreate,
		output: DatarobotEndpointOutputSchemas.notificationChannelTemplatesCreate,
	},
	'notificationChannelTemplates.notificationChannelTemplatesDelete': {
		input: DatarobotEndpointInputSchemas.notificationChannelTemplatesDelete,
		output: DatarobotEndpointOutputSchemas.notificationChannelTemplatesDelete,
	},
	'notificationChannelTemplates.notificationChannelTemplatesList': {
		input: DatarobotEndpointInputSchemas.notificationChannelTemplatesList,
		output: DatarobotEndpointOutputSchemas.notificationChannelTemplatesList,
	},
	'notificationChannelTemplates.notificationChannelTemplatesPolicyTemplatesList':
		{
			input:
				DatarobotEndpointInputSchemas.notificationChannelTemplatesPolicyTemplatesList,
			output:
				DatarobotEndpointOutputSchemas.notificationChannelTemplatesPolicyTemplatesList,
		},
	'notificationChannelTemplates.notificationChannelTemplatesPut': {
		input: DatarobotEndpointInputSchemas.notificationChannelTemplatesPut,
		output: DatarobotEndpointOutputSchemas.notificationChannelTemplatesPut,
	},
	'notificationChannelTemplates.notificationChannelTemplatesRelatedPoliciesList':
		{
			input:
				DatarobotEndpointInputSchemas.notificationChannelTemplatesRelatedPoliciesList,
			output:
				DatarobotEndpointOutputSchemas.notificationChannelTemplatesRelatedPoliciesList,
		},
	'notificationChannelTemplates.notificationChannelTemplatesRetrieve': {
		input: DatarobotEndpointInputSchemas.notificationChannelTemplatesRetrieve,
		output: DatarobotEndpointOutputSchemas.notificationChannelTemplatesRetrieve,
	},
	'notificationChannelTemplates.notificationChannelTemplatesSharedRolesList': {
		input:
			DatarobotEndpointInputSchemas.notificationChannelTemplatesSharedRolesList,
		output:
			DatarobotEndpointOutputSchemas.notificationChannelTemplatesSharedRolesList,
	},
	'notificationChannelTemplates.notificationChannelTemplatesSharedRolesPatchMany':
		{
			input:
				DatarobotEndpointInputSchemas.notificationChannelTemplatesSharedRolesPatchMany,
			output:
				DatarobotEndpointOutputSchemas.notificationChannelTemplatesSharedRolesPatchMany,
		},
	'notificationEvents.notificationEventsList': {
		input: DatarobotEndpointInputSchemas.notificationEventsList,
		output: DatarobotEndpointOutputSchemas.notificationEventsList,
	},
	'ocrJobResources.ocrJobResourcesCreate': {
		input: DatarobotEndpointInputSchemas.ocrJobResourcesCreate,
		output: DatarobotEndpointOutputSchemas.ocrJobResourcesCreate,
	},
	'ocrJobResources.ocrJobResourcesErrorReportList': {
		input: DatarobotEndpointInputSchemas.ocrJobResourcesErrorReportList,
		output: DatarobotEndpointOutputSchemas.ocrJobResourcesErrorReportList,
	},
	'ocrJobResources.ocrJobResourcesErrorReportPutMany': {
		input: DatarobotEndpointInputSchemas.ocrJobResourcesErrorReportPutMany,
		output: DatarobotEndpointOutputSchemas.ocrJobResourcesErrorReportPutMany,
	},
	'ocrJobResources.ocrJobResourcesJobProgressList': {
		input: DatarobotEndpointInputSchemas.ocrJobResourcesJobProgressList,
		output: DatarobotEndpointOutputSchemas.ocrJobResourcesJobProgressList,
	},
	'ocrJobResources.ocrJobResourcesJobStatusList': {
		input: DatarobotEndpointInputSchemas.ocrJobResourcesJobStatusList,
		output: DatarobotEndpointOutputSchemas.ocrJobResourcesJobStatusList,
	},
	'ocrJobResources.ocrJobResourcesList': {
		input: DatarobotEndpointInputSchemas.ocrJobResourcesList,
		output: DatarobotEndpointOutputSchemas.ocrJobResourcesList,
	},
	'ocrJobResources.ocrJobResourcesRetrieve': {
		input: DatarobotEndpointInputSchemas.ocrJobResourcesRetrieve,
		output: DatarobotEndpointOutputSchemas.ocrJobResourcesRetrieve,
	},
	'ocrJobResources.ocrJobResourcesStartCreate': {
		input: DatarobotEndpointInputSchemas.ocrJobResourcesStartCreate,
		output: DatarobotEndpointOutputSchemas.ocrJobResourcesStartCreate,
	},
	'organizations.organizationsJobsList': {
		input: DatarobotEndpointInputSchemas.organizationsJobsList,
		output: DatarobotEndpointOutputSchemas.organizationsJobsList,
	},
	'organizations.organizationsList': {
		input: DatarobotEndpointInputSchemas.organizationsList,
		output: DatarobotEndpointOutputSchemas.organizationsList,
	},
	'organizations.organizationsRetrieve': {
		input: DatarobotEndpointInputSchemas.organizationsRetrieve,
		output: DatarobotEndpointOutputSchemas.organizationsRetrieve,
	},
	'organizations.organizationsUsersCreate': {
		input: DatarobotEndpointInputSchemas.organizationsUsersCreate,
		output: DatarobotEndpointOutputSchemas.organizationsUsersCreate,
	},
	'organizations.organizationsUsersList': {
		input: DatarobotEndpointInputSchemas.organizationsUsersList,
		output: DatarobotEndpointOutputSchemas.organizationsUsersList,
	},
	'organizations.organizationsUsersPatch': {
		input: DatarobotEndpointInputSchemas.organizationsUsersPatch,
		output: DatarobotEndpointOutputSchemas.organizationsUsersPatch,
	},
	'organizations.organizationsUsersRetrieve': {
		input: DatarobotEndpointInputSchemas.organizationsUsersRetrieve,
		output: DatarobotEndpointOutputSchemas.organizationsUsersRetrieve,
	},
	'otel.otelLogsDeleteMany': {
		input: DatarobotEndpointInputSchemas.otelLogsDeleteMany,
		output: DatarobotEndpointOutputSchemas.otelLogsDeleteMany,
	},
	'otel.otelLogsList': {
		input: DatarobotEndpointInputSchemas.otelLogsList,
		output: DatarobotEndpointOutputSchemas.otelLogsList,
	},
	'otel.otelLogsPodInfoList': {
		input: DatarobotEndpointInputSchemas.otelLogsPodInfoList,
		output: DatarobotEndpointOutputSchemas.otelLogsPodInfoList,
	},
	'otel.otelMetricsAutocollectedValuesList': {
		input: DatarobotEndpointInputSchemas.otelMetricsAutocollectedValuesList,
		output: DatarobotEndpointOutputSchemas.otelMetricsAutocollectedValuesList,
	},
	'otel.otelMetricsConfigsCreate': {
		input: DatarobotEndpointInputSchemas.otelMetricsConfigsCreate,
		output: DatarobotEndpointOutputSchemas.otelMetricsConfigsCreate,
	},
	'otel.otelMetricsConfigsDelete': {
		input: DatarobotEndpointInputSchemas.otelMetricsConfigsDelete,
		output: DatarobotEndpointOutputSchemas.otelMetricsConfigsDelete,
	},
	'otel.otelMetricsConfigsList': {
		input: DatarobotEndpointInputSchemas.otelMetricsConfigsList,
		output: DatarobotEndpointOutputSchemas.otelMetricsConfigsList,
	},
	'otel.otelMetricsConfigsPatch': {
		input: DatarobotEndpointInputSchemas.otelMetricsConfigsPatch,
		output: DatarobotEndpointOutputSchemas.otelMetricsConfigsPatch,
	},
	'otel.otelMetricsConfigsPutMany': {
		input: DatarobotEndpointInputSchemas.otelMetricsConfigsPutMany,
		output: DatarobotEndpointOutputSchemas.otelMetricsConfigsPutMany,
	},
	'otel.otelMetricsConfigsRetrieve': {
		input: DatarobotEndpointInputSchemas.otelMetricsConfigsRetrieve,
		output: DatarobotEndpointOutputSchemas.otelMetricsConfigsRetrieve,
	},
	'otel.otelMetricsConsumersList': {
		input: DatarobotEndpointInputSchemas.otelMetricsConsumersList,
		output: DatarobotEndpointOutputSchemas.otelMetricsConsumersList,
	},
	'otel.otelMetricsDeleteMany': {
		input: DatarobotEndpointInputSchemas.otelMetricsDeleteMany,
		output: DatarobotEndpointOutputSchemas.otelMetricsDeleteMany,
	},
	'otel.otelMetricsPodInfoList': {
		input: DatarobotEndpointInputSchemas.otelMetricsPodInfoList,
		output: DatarobotEndpointOutputSchemas.otelMetricsPodInfoList,
	},
	'otel.otelMetricsSummaryList': {
		input: DatarobotEndpointInputSchemas.otelMetricsSummaryList,
		output: DatarobotEndpointOutputSchemas.otelMetricsSummaryList,
	},
	'otel.otelMetricsValueOverTimeList': {
		input: DatarobotEndpointInputSchemas.otelMetricsValueOverTimeList,
		output: DatarobotEndpointOutputSchemas.otelMetricsValueOverTimeList,
	},
	'otel.otelMetricsValuesList': {
		input: DatarobotEndpointInputSchemas.otelMetricsValuesList,
		output: DatarobotEndpointOutputSchemas.otelMetricsValuesList,
	},
	'otel.otelMetricsValuesOverTimeList': {
		input: DatarobotEndpointInputSchemas.otelMetricsValuesOverTimeList,
		output: DatarobotEndpointOutputSchemas.otelMetricsValuesOverTimeList,
	},
	'otel.otelMetricsValuesOverTimeSegmentsCreate': {
		input:
			DatarobotEndpointInputSchemas.otelMetricsValuesOverTimeSegmentsCreate,
		output:
			DatarobotEndpointOutputSchemas.otelMetricsValuesOverTimeSegmentsCreate,
	},
	'otel.otelMetricsValuesOverTimeSegmentsRetrieve': {
		input:
			DatarobotEndpointInputSchemas.otelMetricsValuesOverTimeSegmentsRetrieve,
		output:
			DatarobotEndpointOutputSchemas.otelMetricsValuesOverTimeSegmentsRetrieve,
	},
	'otel.otelMetricsValuesSegmentsRetrieve': {
		input: DatarobotEndpointInputSchemas.otelMetricsValuesSegmentsRetrieve,
		output: DatarobotEndpointOutputSchemas.otelMetricsValuesSegmentsRetrieve,
	},
	'otel.otelStatsList': {
		input: DatarobotEndpointInputSchemas.otelStatsList,
		output: DatarobotEndpointOutputSchemas.otelStatsList,
	},
	'otel.otelTracesDeleteMany': {
		input: DatarobotEndpointInputSchemas.otelTracesDeleteMany,
		output: DatarobotEndpointOutputSchemas.otelTracesDeleteMany,
	},
	'otel.tracingList': {
		input: DatarobotEndpointInputSchemas.tracingList,
		output: DatarobotEndpointOutputSchemas.tracingList,
	},
	'otel.tracingRetrieve': {
		input: DatarobotEndpointInputSchemas.tracingRetrieve,
		output: DatarobotEndpointOutputSchemas.tracingRetrieve,
	},
	'pinnedUsecases.pinnedUsecasesList': {
		input: DatarobotEndpointInputSchemas.pinnedUsecasesList,
		output: DatarobotEndpointOutputSchemas.pinnedUsecasesList,
	},
	'pinnedUsecases.pinnedUsecasesPatchMany': {
		input: DatarobotEndpointInputSchemas.pinnedUsecasesPatchMany,
		output: DatarobotEndpointOutputSchemas.pinnedUsecasesPatchMany,
	},
	'predictionServers.predictionServersList': {
		input: DatarobotEndpointInputSchemas.predictionServersList,
		output: DatarobotEndpointOutputSchemas.predictionServersList,
	},
	'projects.computedTrainingPredictionsList': {
		input: DatarobotEndpointInputSchemas.computedTrainingPredictionsList,
		output: DatarobotEndpointOutputSchemas.computedTrainingPredictionsList,
	},
	'projects.configureAndStartAutopilot': {
		input: DatarobotEndpointInputSchemas.configureAndStartAutopilot,
		output: DatarobotEndpointOutputSchemas.configureAndStartAutopilot,
	},
	'projects.projectsAccessControlList': {
		input: DatarobotEndpointInputSchemas.projectsAccessControlList,
		output: DatarobotEndpointOutputSchemas.projectsAccessControlList,
	},
	'projects.projectsAccessControlPatchMany': {
		input: DatarobotEndpointInputSchemas.projectsAccessControlPatchMany,
		output: DatarobotEndpointOutputSchemas.projectsAccessControlPatchMany,
	},
	'projects.projectsAnomalyAssessmentRecordsDelete': {
		input: DatarobotEndpointInputSchemas.projectsAnomalyAssessmentRecordsDelete,
		output:
			DatarobotEndpointOutputSchemas.projectsAnomalyAssessmentRecordsDelete,
	},
	'projects.projectsAnomalyAssessmentRecordsExplanationsList': {
		input:
			DatarobotEndpointInputSchemas.projectsAnomalyAssessmentRecordsExplanationsList,
		output:
			DatarobotEndpointOutputSchemas.projectsAnomalyAssessmentRecordsExplanationsList,
	},
	'projects.projectsAnomalyAssessmentRecordsList': {
		input: DatarobotEndpointInputSchemas.projectsAnomalyAssessmentRecordsList,
		output: DatarobotEndpointOutputSchemas.projectsAnomalyAssessmentRecordsList,
	},
	'projects.projectsAnomalyAssessmentRecordsPredictionsPreviewList': {
		input:
			DatarobotEndpointInputSchemas.projectsAnomalyAssessmentRecordsPredictionsPreviewList,
		output:
			DatarobotEndpointOutputSchemas.projectsAnomalyAssessmentRecordsPredictionsPreviewList,
	},
	'projects.projectsAutopilotCreate': {
		input: DatarobotEndpointInputSchemas.projectsAutopilotCreate,
		output: DatarobotEndpointOutputSchemas.projectsAutopilotCreate,
	},
	'projects.projectsAutopilotsCreate': {
		input: DatarobotEndpointInputSchemas.projectsAutopilotsCreate,
		output: DatarobotEndpointOutputSchemas.projectsAutopilotsCreate,
	},
	'projects.projectsBatchTypeTransformFeaturesCreate': {
		input:
			DatarobotEndpointInputSchemas.projectsBatchTypeTransformFeaturesCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsBatchTypeTransformFeaturesCreate,
	},
	'projects.projectsBatchTypeTransformFeaturesResultRetrieve': {
		input:
			DatarobotEndpointInputSchemas.projectsBatchTypeTransformFeaturesResultRetrieve,
		output:
			DatarobotEndpointOutputSchemas.projectsBatchTypeTransformFeaturesResultRetrieve,
	},
	'projects.projectsBiasMitigatedModelsCreate': {
		input: DatarobotEndpointInputSchemas.projectsBiasMitigatedModelsCreate,
		output: DatarobotEndpointOutputSchemas.projectsBiasMitigatedModelsCreate,
	},
	'projects.projectsBiasMitigatedModelsList': {
		input: DatarobotEndpointInputSchemas.projectsBiasMitigatedModelsList,
		output: DatarobotEndpointOutputSchemas.projectsBiasMitigatedModelsList,
	},
	'projects.projectsBiasMitigationFeatureInfoCreateOne': {
		input:
			DatarobotEndpointInputSchemas.projectsBiasMitigationFeatureInfoCreateOne,
		output:
			DatarobotEndpointOutputSchemas.projectsBiasMitigationFeatureInfoCreateOne,
	},
	'projects.projectsBiasMitigationFeatureInfoList': {
		input: DatarobotEndpointInputSchemas.projectsBiasMitigationFeatureInfoList,
		output:
			DatarobotEndpointOutputSchemas.projectsBiasMitigationFeatureInfoList,
	},
	'projects.projectsBiasVsAccuracyInsightsList': {
		input: DatarobotEndpointInputSchemas.projectsBiasVsAccuracyInsightsList,
		output: DatarobotEndpointOutputSchemas.projectsBiasVsAccuracyInsightsList,
	},
	'projects.projectsBlenderModelsBlendCheckCreate': {
		input: DatarobotEndpointInputSchemas.projectsBlenderModelsBlendCheckCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsBlenderModelsBlendCheckCreate,
	},
	'projects.projectsBlenderModelsCreate': {
		input: DatarobotEndpointInputSchemas.projectsBlenderModelsCreate,
		output: DatarobotEndpointOutputSchemas.projectsBlenderModelsCreate,
	},
	'projects.projectsBlenderModelsList': {
		input: DatarobotEndpointInputSchemas.projectsBlenderModelsList,
		output: DatarobotEndpointOutputSchemas.projectsBlenderModelsList,
	},
	'projects.projectsBlenderModelsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsBlenderModelsRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsBlenderModelsRetrieve,
	},
	'projects.projectsBlueprintsBlueprintChartList': {
		input: DatarobotEndpointInputSchemas.projectsBlueprintsBlueprintChartList,
		output: DatarobotEndpointOutputSchemas.projectsBlueprintsBlueprintChartList,
	},
	'projects.projectsBlueprintsBlueprintDocsList': {
		input: DatarobotEndpointInputSchemas.projectsBlueprintsBlueprintDocsList,
		output: DatarobotEndpointOutputSchemas.projectsBlueprintsBlueprintDocsList,
	},
	'projects.projectsBlueprintsJsonList': {
		input: DatarobotEndpointInputSchemas.projectsBlueprintsJsonList,
		output: DatarobotEndpointOutputSchemas.projectsBlueprintsJsonList,
	},
	'projects.projectsBlueprintsList': {
		input: DatarobotEndpointInputSchemas.projectsBlueprintsList,
		output: DatarobotEndpointOutputSchemas.projectsBlueprintsList,
	},
	'projects.projectsBlueprintsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsBlueprintsRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsBlueprintsRetrieve,
	},
	'projects.projectsCalendarEventsList': {
		input: DatarobotEndpointInputSchemas.projectsCalendarEventsList,
		output: DatarobotEndpointOutputSchemas.projectsCalendarEventsList,
	},
	'projects.projectsCombinedModelsList': {
		input: DatarobotEndpointInputSchemas.projectsCombinedModelsList,
		output: DatarobotEndpointOutputSchemas.projectsCombinedModelsList,
	},
	'projects.projectsCombinedModelsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsCombinedModelsRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsCombinedModelsRetrieve,
	},
	'projects.projectsCombinedModelsSegmentsDownloadList': {
		input:
			DatarobotEndpointInputSchemas.projectsCombinedModelsSegmentsDownloadList,
		output:
			DatarobotEndpointOutputSchemas.projectsCombinedModelsSegmentsDownloadList,
	},
	'projects.projectsCombinedModelsSegmentsList': {
		input: DatarobotEndpointInputSchemas.projectsCombinedModelsSegmentsList,
		output: DatarobotEndpointOutputSchemas.projectsCombinedModelsSegmentsList,
	},
	'projects.projectsCreate': {
		input: DatarobotEndpointInputSchemas.projectsCreate,
		output: DatarobotEndpointOutputSchemas.projectsCreate,
	},
	'projects.projectsCrossSeriesPropertiesCreate': {
		input: DatarobotEndpointInputSchemas.projectsCrossSeriesPropertiesCreate,
		output: DatarobotEndpointOutputSchemas.projectsCrossSeriesPropertiesCreate,
	},
	'projects.projectsDataSlicesList': {
		input: DatarobotEndpointInputSchemas.projectsDataSlicesList,
		output: DatarobotEndpointOutputSchemas.projectsDataSlicesList,
	},
	'projects.projectsDatetimeModelsAccuracyOverTimePlotsList': {
		input:
			DatarobotEndpointInputSchemas.projectsDatetimeModelsAccuracyOverTimePlotsList,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsAccuracyOverTimePlotsList,
	},
	'projects.projectsDatetimeModelsAccuracyOverTimePlotsMetadataList': {
		input:
			DatarobotEndpointInputSchemas.projectsDatetimeModelsAccuracyOverTimePlotsMetadataList,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsAccuracyOverTimePlotsMetadataList,
	},
	'projects.projectsDatetimeModelsAccuracyOverTimePlotsPreviewList': {
		input:
			DatarobotEndpointInputSchemas.projectsDatetimeModelsAccuracyOverTimePlotsPreviewList,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsAccuracyOverTimePlotsPreviewList,
	},
	'projects.projectsDatetimeModelsAnomalyOverTimePlotsList': {
		input:
			DatarobotEndpointInputSchemas.projectsDatetimeModelsAnomalyOverTimePlotsList,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsAnomalyOverTimePlotsList,
	},
	'projects.projectsDatetimeModelsAnomalyOverTimePlotsMetadataList': {
		input:
			DatarobotEndpointInputSchemas.projectsDatetimeModelsAnomalyOverTimePlotsMetadataList,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsAnomalyOverTimePlotsMetadataList,
	},
	'projects.projectsDatetimeModelsAnomalyOverTimePlotsPreviewList': {
		input:
			DatarobotEndpointInputSchemas.projectsDatetimeModelsAnomalyOverTimePlotsPreviewList,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsAnomalyOverTimePlotsPreviewList,
	},
	'projects.projectsDatetimeModelsBacktestStabilityPlotList': {
		input:
			DatarobotEndpointInputSchemas.projectsDatetimeModelsBacktestStabilityPlotList,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsBacktestStabilityPlotList,
	},
	'projects.projectsDatetimeModelsBacktestsCreate': {
		input: DatarobotEndpointInputSchemas.projectsDatetimeModelsBacktestsCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsBacktestsCreate,
	},
	'projects.projectsDatetimeModelsCreate': {
		input: DatarobotEndpointInputSchemas.projectsDatetimeModelsCreate,
		output: DatarobotEndpointOutputSchemas.projectsDatetimeModelsCreate,
	},
	'projects.projectsDatetimeModelsDatasetAccuracyOverTimePlotsMetadataList': {
		input:
			DatarobotEndpointInputSchemas.projectsDatetimeModelsDatasetAccuracyOverTimePlotsMetadataList,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsDatasetAccuracyOverTimePlotsMetadataList,
	},
	'projects.projectsDatetimeModelsDatasetAccuracyOverTimePlotsPreviewList': {
		input:
			DatarobotEndpointInputSchemas.projectsDatetimeModelsDatasetAccuracyOverTimePlotsPreviewList,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsDatasetAccuracyOverTimePlotsPreviewList,
	},
	'projects.projectsDatetimeModelsDatasetAccuracyOverTimePlotsRetrieve': {
		input:
			DatarobotEndpointInputSchemas.projectsDatetimeModelsDatasetAccuracyOverTimePlotsRetrieve,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsDatasetAccuracyOverTimePlotsRetrieve,
	},
	'projects.projectsDatetimeModelsDatetimeTrendPlotsCreate': {
		input:
			DatarobotEndpointInputSchemas.projectsDatetimeModelsDatetimeTrendPlotsCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsDatetimeTrendPlotsCreate,
	},
	'projects.projectsDatetimeModelsFeatureEffectsCreate': {
		input:
			DatarobotEndpointInputSchemas.projectsDatetimeModelsFeatureEffectsCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsFeatureEffectsCreate,
	},
	'projects.projectsDatetimeModelsFeatureEffectsList': {
		input:
			DatarobotEndpointInputSchemas.projectsDatetimeModelsFeatureEffectsList,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsFeatureEffectsList,
	},
	'projects.projectsDatetimeModelsFeatureEffectsMetadataList': {
		input:
			DatarobotEndpointInputSchemas.projectsDatetimeModelsFeatureEffectsMetadataList,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsFeatureEffectsMetadataList,
	},
	'projects.projectsDatetimeModelsForecastDistanceStabilityPlotList': {
		input:
			DatarobotEndpointInputSchemas.projectsDatetimeModelsForecastDistanceStabilityPlotList,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsForecastDistanceStabilityPlotList,
	},
	'projects.projectsDatetimeModelsForecastVsActualPlotsList': {
		input:
			DatarobotEndpointInputSchemas.projectsDatetimeModelsForecastVsActualPlotsList,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsForecastVsActualPlotsList,
	},
	'projects.projectsDatetimeModelsForecastVsActualPlotsMetadataList': {
		input:
			DatarobotEndpointInputSchemas.projectsDatetimeModelsForecastVsActualPlotsMetadataList,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsForecastVsActualPlotsMetadataList,
	},
	'projects.projectsDatetimeModelsForecastVsActualPlotsPreviewList': {
		input:
			DatarobotEndpointInputSchemas.projectsDatetimeModelsForecastVsActualPlotsPreviewList,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsForecastVsActualPlotsPreviewList,
	},
	'projects.projectsDatetimeModelsFromModelCreate': {
		input: DatarobotEndpointInputSchemas.projectsDatetimeModelsFromModelCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsFromModelCreate,
	},
	'projects.projectsDatetimeModelsList': {
		input: DatarobotEndpointInputSchemas.projectsDatetimeModelsList,
		output: DatarobotEndpointOutputSchemas.projectsDatetimeModelsList,
	},
	'projects.projectsDatetimeModelsMulticlassFeatureEffectsCreate': {
		input:
			DatarobotEndpointInputSchemas.projectsDatetimeModelsMulticlassFeatureEffectsCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsMulticlassFeatureEffectsCreate,
	},
	'projects.projectsDatetimeModelsMulticlassFeatureEffectsList': {
		input:
			DatarobotEndpointInputSchemas.projectsDatetimeModelsMulticlassFeatureEffectsList,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsMulticlassFeatureEffectsList,
	},
	'projects.projectsDatetimeModelsMultiseriesHistogramsList': {
		input:
			DatarobotEndpointInputSchemas.projectsDatetimeModelsMultiseriesHistogramsList,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsMultiseriesHistogramsList,
	},
	'projects.projectsDatetimeModelsMultiseriesScoresCreate': {
		input:
			DatarobotEndpointInputSchemas.projectsDatetimeModelsMultiseriesScoresCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsMultiseriesScoresCreate,
	},
	'projects.projectsDatetimeModelsMultiseriesScoresFileList': {
		input:
			DatarobotEndpointInputSchemas.projectsDatetimeModelsMultiseriesScoresFileList,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsMultiseriesScoresFileList,
	},
	'projects.projectsDatetimeModelsMultiseriesScoresList': {
		input:
			DatarobotEndpointInputSchemas.projectsDatetimeModelsMultiseriesScoresList,
		output:
			DatarobotEndpointOutputSchemas.projectsDatetimeModelsMultiseriesScoresList,
	},
	'projects.projectsDatetimeModelsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsDatetimeModelsRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsDatetimeModelsRetrieve,
	},
	'projects.projectsDatetimePartitioningCreate': {
		input: DatarobotEndpointInputSchemas.projectsDatetimePartitioningCreate,
		output: DatarobotEndpointOutputSchemas.projectsDatetimePartitioningCreate,
	},
	'projects.projectsDatetimePartitioningList': {
		input: DatarobotEndpointInputSchemas.projectsDatetimePartitioningList,
		output: DatarobotEndpointOutputSchemas.projectsDatetimePartitioningList,
	},
	'projects.projectsDelete': {
		input: DatarobotEndpointInputSchemas.projectsDelete,
		output: DatarobotEndpointOutputSchemas.projectsDelete,
	},
	'projects.projectsDeploymentReadyModelsCreate': {
		input: DatarobotEndpointInputSchemas.projectsDeploymentReadyModelsCreate,
		output: DatarobotEndpointOutputSchemas.projectsDeploymentReadyModelsCreate,
	},
	'projects.projectsDiscardedFeaturesList': {
		input: DatarobotEndpointInputSchemas.projectsDiscardedFeaturesList,
		output: DatarobotEndpointOutputSchemas.projectsDiscardedFeaturesList,
	},
	'projects.projectsDocumentPagesFileList': {
		input: DatarobotEndpointInputSchemas.projectsDocumentPagesFileList,
		output: DatarobotEndpointOutputSchemas.projectsDocumentPagesFileList,
	},
	'projects.projectsDocumentTextExtractionSamplesList': {
		input:
			DatarobotEndpointInputSchemas.projectsDocumentTextExtractionSamplesList,
		output:
			DatarobotEndpointOutputSchemas.projectsDocumentTextExtractionSamplesList,
	},
	'projects.projectsDocumentThumbnailBinsList': {
		input: DatarobotEndpointInputSchemas.projectsDocumentThumbnailBinsList,
		output: DatarobotEndpointOutputSchemas.projectsDocumentThumbnailBinsList,
	},
	'projects.projectsDocumentThumbnailSamplesList': {
		input: DatarobotEndpointInputSchemas.projectsDocumentThumbnailSamplesList,
		output: DatarobotEndpointOutputSchemas.projectsDocumentThumbnailSamplesList,
	},
	'projects.projectsDocumentThumbnailsList': {
		input: DatarobotEndpointInputSchemas.projectsDocumentThumbnailsList,
		output: DatarobotEndpointOutputSchemas.projectsDocumentThumbnailsList,
	},
	'projects.projectsDocumentsDataQualityLogFileList': {
		input:
			DatarobotEndpointInputSchemas.projectsDocumentsDataQualityLogFileList,
		output:
			DatarobotEndpointOutputSchemas.projectsDocumentsDataQualityLogFileList,
	},
	'projects.projectsDocumentsDataQualityLogList': {
		input: DatarobotEndpointInputSchemas.projectsDocumentsDataQualityLogList,
		output: DatarobotEndpointOutputSchemas.projectsDocumentsDataQualityLogList,
	},
	'projects.projectsDuplicateImagesList': {
		input: DatarobotEndpointInputSchemas.projectsDuplicateImagesList,
		output: DatarobotEndpointOutputSchemas.projectsDuplicateImagesList,
	},
	'projects.projectsEureqaDistributionPlotRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsEureqaDistributionPlotRetrieve,
		output:
			DatarobotEndpointOutputSchemas.projectsEureqaDistributionPlotRetrieve,
	},
	'projects.projectsEureqaModelDetailRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsEureqaModelDetailRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsEureqaModelDetailRetrieve,
	},
	'projects.projectsEureqaModelsCreate': {
		input: DatarobotEndpointInputSchemas.projectsEureqaModelsCreate,
		output: DatarobotEndpointOutputSchemas.projectsEureqaModelsCreate,
	},
	'projects.projectsEureqaModelsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsEureqaModelsRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsEureqaModelsRetrieve,
	},
	'projects.projectsExternalScoresCreate': {
		input: DatarobotEndpointInputSchemas.projectsExternalScoresCreate,
		output: DatarobotEndpointOutputSchemas.projectsExternalScoresCreate,
	},
	'projects.projectsExternalScoresList': {
		input: DatarobotEndpointInputSchemas.projectsExternalScoresList,
		output: DatarobotEndpointOutputSchemas.projectsExternalScoresList,
	},
	'projects.projectsExternalTimeSeriesBaselineDataValidationJobsCreate': {
		input:
			DatarobotEndpointInputSchemas.projectsExternalTimeSeriesBaselineDataValidationJobsCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsExternalTimeSeriesBaselineDataValidationJobsCreate,
	},
	'projects.projectsExternalTimeSeriesBaselineDataValidationJobsRetrieve': {
		input:
			DatarobotEndpointInputSchemas.projectsExternalTimeSeriesBaselineDataValidationJobsRetrieve,
		output:
			DatarobotEndpointOutputSchemas.projectsExternalTimeSeriesBaselineDataValidationJobsRetrieve,
	},
	'projects.projectsFeatureAssociationFeaturelistsList': {
		input:
			DatarobotEndpointInputSchemas.projectsFeatureAssociationFeaturelistsList,
		output:
			DatarobotEndpointOutputSchemas.projectsFeatureAssociationFeaturelistsList,
	},
	'projects.projectsFeatureAssociationMatrixCreate': {
		input: DatarobotEndpointInputSchemas.projectsFeatureAssociationMatrixCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsFeatureAssociationMatrixCreate,
	},
	'projects.projectsFeatureAssociationMatrixDetailsList': {
		input:
			DatarobotEndpointInputSchemas.projectsFeatureAssociationMatrixDetailsList,
		output:
			DatarobotEndpointOutputSchemas.projectsFeatureAssociationMatrixDetailsList,
	},
	'projects.projectsFeatureAssociationMatrixList': {
		input: DatarobotEndpointInputSchemas.projectsFeatureAssociationMatrixList,
		output: DatarobotEndpointOutputSchemas.projectsFeatureAssociationMatrixList,
	},
	'projects.projectsFeatureDiscoveryDatasetDownloadList': {
		input:
			DatarobotEndpointInputSchemas.projectsFeatureDiscoveryDatasetDownloadList,
		output:
			DatarobotEndpointOutputSchemas.projectsFeatureDiscoveryDatasetDownloadList,
	},
	'projects.projectsFeatureDiscoveryLogsDownloadList': {
		input:
			DatarobotEndpointInputSchemas.projectsFeatureDiscoveryLogsDownloadList,
		output:
			DatarobotEndpointOutputSchemas.projectsFeatureDiscoveryLogsDownloadList,
	},
	'projects.projectsFeatureDiscoveryLogsList': {
		input: DatarobotEndpointInputSchemas.projectsFeatureDiscoveryLogsList,
		output: DatarobotEndpointOutputSchemas.projectsFeatureDiscoveryLogsList,
	},
	'projects.projectsFeatureDiscoveryRecipeSQLsDownloadList': {
		input:
			DatarobotEndpointInputSchemas.projectsFeatureDiscoveryRecipeSQLsDownloadList,
		output:
			DatarobotEndpointOutputSchemas.projectsFeatureDiscoveryRecipeSQLsDownloadList,
	},
	'projects.projectsFeatureDiscoveryRecipeSqlExportsCreate': {
		input:
			DatarobotEndpointInputSchemas.projectsFeatureDiscoveryRecipeSqlExportsCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsFeatureDiscoveryRecipeSqlExportsCreate,
	},
	'projects.projectsFeatureHistogramsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsFeatureHistogramsRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsFeatureHistogramsRetrieve,
	},
	'projects.projectsFeatureLineagesRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsFeatureLineagesRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsFeatureLineagesRetrieve,
	},
	'projects.projectsFeaturelistsCreate': {
		input: DatarobotEndpointInputSchemas.projectsFeaturelistsCreate,
		output: DatarobotEndpointOutputSchemas.projectsFeaturelistsCreate,
	},
	'projects.projectsFeaturelistsDelete': {
		input: DatarobotEndpointInputSchemas.projectsFeaturelistsDelete,
		output: DatarobotEndpointOutputSchemas.projectsFeaturelistsDelete,
	},
	'projects.projectsFeaturelistsList': {
		input: DatarobotEndpointInputSchemas.projectsFeaturelistsList,
		output: DatarobotEndpointOutputSchemas.projectsFeaturelistsList,
	},
	'projects.projectsFeaturelistsPatch': {
		input: DatarobotEndpointInputSchemas.projectsFeaturelistsPatch,
		output: DatarobotEndpointOutputSchemas.projectsFeaturelistsPatch,
	},
	'projects.projectsFeaturelistsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsFeaturelistsRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsFeaturelistsRetrieve,
	},
	'projects.projectsFeaturesFrequentValuesList': {
		input: DatarobotEndpointInputSchemas.projectsFeaturesFrequentValuesList,
		output: DatarobotEndpointOutputSchemas.projectsFeaturesFrequentValuesList,
	},
	'projects.projectsFeaturesList': {
		input: DatarobotEndpointInputSchemas.projectsFeaturesList,
		output: DatarobotEndpointOutputSchemas.projectsFeaturesList,
	},
	'projects.projectsFeaturesMetricsList': {
		input: DatarobotEndpointInputSchemas.projectsFeaturesMetricsList,
		output: DatarobotEndpointOutputSchemas.projectsFeaturesMetricsList,
	},
	'projects.projectsFeaturesMultiseriesPropertiesList': {
		input:
			DatarobotEndpointInputSchemas.projectsFeaturesMultiseriesPropertiesList,
		output:
			DatarobotEndpointOutputSchemas.projectsFeaturesMultiseriesPropertiesList,
	},
	'projects.projectsFeaturesRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsFeaturesRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsFeaturesRetrieve,
	},
	'projects.projectsFrozenDatetimeModelsCreate': {
		input: DatarobotEndpointInputSchemas.projectsFrozenDatetimeModelsCreate,
		output: DatarobotEndpointOutputSchemas.projectsFrozenDatetimeModelsCreate,
	},
	'projects.projectsFrozenModelsCreate': {
		input: DatarobotEndpointInputSchemas.projectsFrozenModelsCreate,
		output: DatarobotEndpointOutputSchemas.projectsFrozenModelsCreate,
	},
	'projects.projectsFrozenModelsList': {
		input: DatarobotEndpointInputSchemas.projectsFrozenModelsList,
		output: DatarobotEndpointOutputSchemas.projectsFrozenModelsList,
	},
	'projects.projectsFrozenModelsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsFrozenModelsRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsFrozenModelsRetrieve,
	},
	'projects.projectsGeometryFeaturePlotsCreate': {
		input: DatarobotEndpointInputSchemas.projectsGeometryFeaturePlotsCreate,
		output: DatarobotEndpointOutputSchemas.projectsGeometryFeaturePlotsCreate,
	},
	'projects.projectsGeometryFeaturePlotsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsGeometryFeaturePlotsRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsGeometryFeaturePlotsRetrieve,
	},
	'projects.projectsImageActivationMapsList': {
		input: DatarobotEndpointInputSchemas.projectsImageActivationMapsList,
		output: DatarobotEndpointOutputSchemas.projectsImageActivationMapsList,
	},
	'projects.projectsImageBinsList': {
		input: DatarobotEndpointInputSchemas.projectsImageBinsList,
		output: DatarobotEndpointOutputSchemas.projectsImageBinsList,
	},
	'projects.projectsImageEmbeddingsList': {
		input: DatarobotEndpointInputSchemas.projectsImageEmbeddingsList,
		output: DatarobotEndpointOutputSchemas.projectsImageEmbeddingsList,
	},
	'projects.projectsImageSamplesList': {
		input: DatarobotEndpointInputSchemas.projectsImageSamplesList,
		output: DatarobotEndpointOutputSchemas.projectsImageSamplesList,
	},
	'projects.projectsImagesDataQualityLogFileList': {
		input: DatarobotEndpointInputSchemas.projectsImagesDataQualityLogFileList,
		output: DatarobotEndpointOutputSchemas.projectsImagesDataQualityLogFileList,
	},
	'projects.projectsImagesDataQualityLogList': {
		input: DatarobotEndpointInputSchemas.projectsImagesDataQualityLogList,
		output: DatarobotEndpointOutputSchemas.projectsImagesDataQualityLogList,
	},
	'projects.projectsImagesFileList': {
		input: DatarobotEndpointInputSchemas.projectsImagesFileList,
		output: DatarobotEndpointOutputSchemas.projectsImagesFileList,
	},
	'projects.projectsImagesList': {
		input: DatarobotEndpointInputSchemas.projectsImagesList,
		output: DatarobotEndpointOutputSchemas.projectsImagesList,
	},
	'projects.projectsImagesRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsImagesRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsImagesRetrieve,
	},
	'projects.projectsIncrementalLearningModelsFromModelCreate': {
		input:
			DatarobotEndpointInputSchemas.projectsIncrementalLearningModelsFromModelCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsIncrementalLearningModelsFromModelCreate,
	},
	'projects.projectsJobsDelete': {
		input: DatarobotEndpointInputSchemas.projectsJobsDelete,
		output: DatarobotEndpointOutputSchemas.projectsJobsDelete,
	},
	'projects.projectsJobsList': {
		input: DatarobotEndpointInputSchemas.projectsJobsList,
		output: DatarobotEndpointOutputSchemas.projectsJobsList,
	},
	'projects.projectsJobsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsJobsRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsJobsRetrieve,
	},
	'projects.projectsList': {
		input: DatarobotEndpointInputSchemas.projectsList,
		output: DatarobotEndpointOutputSchemas.projectsList,
	},
	'projects.projectsModelJobsDelete': {
		input: DatarobotEndpointInputSchemas.projectsModelJobsDelete,
		output: DatarobotEndpointOutputSchemas.projectsModelJobsDelete,
	},
	'projects.projectsModelJobsList': {
		input: DatarobotEndpointInputSchemas.projectsModelJobsList,
		output: DatarobotEndpointOutputSchemas.projectsModelJobsList,
	},
	'projects.projectsModelJobsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsModelJobsRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsModelJobsRetrieve,
	},
	'projects.projectsModelRecordsList': {
		input: DatarobotEndpointInputSchemas.projectsModelRecordsList,
		output: DatarobotEndpointOutputSchemas.projectsModelRecordsList,
	},
	'projects.projectsModelingFeaturelistsCreate': {
		input: DatarobotEndpointInputSchemas.projectsModelingFeaturelistsCreate,
		output: DatarobotEndpointOutputSchemas.projectsModelingFeaturelistsCreate,
	},
	'projects.projectsModelingFeaturelistsDelete': {
		input: DatarobotEndpointInputSchemas.projectsModelingFeaturelistsDelete,
		output: DatarobotEndpointOutputSchemas.projectsModelingFeaturelistsDelete,
	},
	'projects.projectsModelingFeaturelistsList': {
		input: DatarobotEndpointInputSchemas.projectsModelingFeaturelistsList,
		output: DatarobotEndpointOutputSchemas.projectsModelingFeaturelistsList,
	},
	'projects.projectsModelingFeaturelistsPatch': {
		input: DatarobotEndpointInputSchemas.projectsModelingFeaturelistsPatch,
		output: DatarobotEndpointOutputSchemas.projectsModelingFeaturelistsPatch,
	},
	'projects.projectsModelingFeaturelistsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsModelingFeaturelistsRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsModelingFeaturelistsRetrieve,
	},
	'projects.projectsModelingFeaturesFromDiscardedFeaturesCreate': {
		input:
			DatarobotEndpointInputSchemas.projectsModelingFeaturesFromDiscardedFeaturesCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsModelingFeaturesFromDiscardedFeaturesCreate,
	},
	'projects.projectsModelingFeaturesList': {
		input: DatarobotEndpointInputSchemas.projectsModelingFeaturesList,
		output: DatarobotEndpointOutputSchemas.projectsModelingFeaturesList,
	},
	'projects.projectsModelingFeaturesRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsModelingFeaturesRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsModelingFeaturesRetrieve,
	},
	'projects.projectsModelsAdvancedTuningCreate': {
		input: DatarobotEndpointInputSchemas.projectsModelsAdvancedTuningCreate,
		output: DatarobotEndpointOutputSchemas.projectsModelsAdvancedTuningCreate,
	},
	'projects.projectsModelsAdvancedTuningParametersList': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsAdvancedTuningParametersList,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsAdvancedTuningParametersList,
	},
	'projects.projectsModelsAnomalyAssessmentInitializationCreate': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsAnomalyAssessmentInitializationCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsAnomalyAssessmentInitializationCreate,
	},
	'projects.projectsModelsAnomalyInsightsFileList': {
		input: DatarobotEndpointInputSchemas.projectsModelsAnomalyInsightsFileList,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsAnomalyInsightsFileList,
	},
	'projects.projectsModelsAnomalyInsightsTableList': {
		input: DatarobotEndpointInputSchemas.projectsModelsAnomalyInsightsTableList,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsAnomalyInsightsTableList,
	},
	'projects.projectsModelsBlueprintChartList': {
		input: DatarobotEndpointInputSchemas.projectsModelsBlueprintChartList,
		output: DatarobotEndpointOutputSchemas.projectsModelsBlueprintChartList,
	},
	'projects.projectsModelsBlueprintDocsList': {
		input: DatarobotEndpointInputSchemas.projectsModelsBlueprintDocsList,
		output: DatarobotEndpointOutputSchemas.projectsModelsBlueprintDocsList,
	},
	'projects.projectsModelsClusterInsightsCreate': {
		input: DatarobotEndpointInputSchemas.projectsModelsClusterInsightsCreate,
		output: DatarobotEndpointOutputSchemas.projectsModelsClusterInsightsCreate,
	},
	'projects.projectsModelsClusterInsightsDownloadList': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsClusterInsightsDownloadList,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsClusterInsightsDownloadList,
	},
	'projects.projectsModelsClusterInsightsList': {
		input: DatarobotEndpointInputSchemas.projectsModelsClusterInsightsList,
		output: DatarobotEndpointOutputSchemas.projectsModelsClusterInsightsList,
	},
	'projects.projectsModelsClusterNamesList': {
		input: DatarobotEndpointInputSchemas.projectsModelsClusterNamesList,
		output: DatarobotEndpointOutputSchemas.projectsModelsClusterNamesList,
	},
	'projects.projectsModelsClusterNamesPatchMany': {
		input: DatarobotEndpointInputSchemas.projectsModelsClusterNamesPatchMany,
		output: DatarobotEndpointOutputSchemas.projectsModelsClusterNamesPatchMany,
	},
	'projects.projectsModelsConfusionChartsClassDetailsList': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsConfusionChartsClassDetailsList,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsConfusionChartsClassDetailsList,
	},
	'projects.projectsModelsConfusionChartsList': {
		input: DatarobotEndpointInputSchemas.projectsModelsConfusionChartsList,
		output: DatarobotEndpointOutputSchemas.projectsModelsConfusionChartsList,
	},
	'projects.projectsModelsConfusionChartsMetadataList': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsConfusionChartsMetadataList,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsConfusionChartsMetadataList,
	},
	'projects.projectsModelsConfusionChartsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsModelsConfusionChartsRetrieve,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsConfusionChartsRetrieve,
	},
	'projects.projectsModelsCreate': {
		input: DatarobotEndpointInputSchemas.projectsModelsCreate,
		output: DatarobotEndpointOutputSchemas.projectsModelsCreate,
	},
	'projects.projectsModelsCrossClassAccuracyScoresCreate': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsCrossClassAccuracyScoresCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsCrossClassAccuracyScoresCreate,
	},
	'projects.projectsModelsCrossClassAccuracyScoresList': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsCrossClassAccuracyScoresList,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsCrossClassAccuracyScoresList,
	},
	'projects.projectsModelsCrossValidationCreate': {
		input: DatarobotEndpointInputSchemas.projectsModelsCrossValidationCreate,
		output: DatarobotEndpointOutputSchemas.projectsModelsCrossValidationCreate,
	},
	'projects.projectsModelsCrossValidationScoresList': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsCrossValidationScoresList,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsCrossValidationScoresList,
	},
	'projects.projectsModelsDataDisparityInsightsCreate': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsDataDisparityInsightsCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsDataDisparityInsightsCreate,
	},
	'projects.projectsModelsDataDisparityInsightsList': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsDataDisparityInsightsList,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsDataDisparityInsightsList,
	},
	'projects.projectsModelsDatasetConfusionChartsClassDetailsList': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsDatasetConfusionChartsClassDetailsList,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsDatasetConfusionChartsClassDetailsList,
	},
	'projects.projectsModelsDatasetConfusionChartsList': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsDatasetConfusionChartsList,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsDatasetConfusionChartsList,
	},
	'projects.projectsModelsDatasetConfusionChartsMetadataList': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsDatasetConfusionChartsMetadataList,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsDatasetConfusionChartsMetadataList,
	},
	'projects.projectsModelsDatasetConfusionChartsRetrieve': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsDatasetConfusionChartsRetrieve,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsDatasetConfusionChartsRetrieve,
	},
	'projects.projectsModelsDatasetLiftChartsList': {
		input: DatarobotEndpointInputSchemas.projectsModelsDatasetLiftChartsList,
		output: DatarobotEndpointOutputSchemas.projectsModelsDatasetLiftChartsList,
	},
	'projects.projectsModelsDatasetMulticlassLiftChartsList': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsDatasetMulticlassLiftChartsList,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsDatasetMulticlassLiftChartsList,
	},
	'projects.projectsModelsDatasetResidualsChartsList': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsDatasetResidualsChartsList,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsDatasetResidualsChartsList,
	},
	'projects.projectsModelsDatasetRocCurvesList': {
		input: DatarobotEndpointInputSchemas.projectsModelsDatasetRocCurvesList,
		output: DatarobotEndpointOutputSchemas.projectsModelsDatasetRocCurvesList,
	},
	'projects.projectsModelsDelete': {
		input: DatarobotEndpointInputSchemas.projectsModelsDelete,
		output: DatarobotEndpointOutputSchemas.projectsModelsDelete,
	},
	'projects.projectsModelsFairnessInsightsCreate': {
		input: DatarobotEndpointInputSchemas.projectsModelsFairnessInsightsCreate,
		output: DatarobotEndpointOutputSchemas.projectsModelsFairnessInsightsCreate,
	},
	'projects.projectsModelsFairnessInsightsList': {
		input: DatarobotEndpointInputSchemas.projectsModelsFairnessInsightsList,
		output: DatarobotEndpointOutputSchemas.projectsModelsFairnessInsightsList,
	},
	'projects.projectsModelsFeatureEffectsCreate': {
		input: DatarobotEndpointInputSchemas.projectsModelsFeatureEffectsCreate,
		output: DatarobotEndpointOutputSchemas.projectsModelsFeatureEffectsCreate,
	},
	'projects.projectsModelsFeatureEffectsList': {
		input: DatarobotEndpointInputSchemas.projectsModelsFeatureEffectsList,
		output: DatarobotEndpointOutputSchemas.projectsModelsFeatureEffectsList,
	},
	'projects.projectsModelsFeatureEffectsMetadataList': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsFeatureEffectsMetadataList,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsFeatureEffectsMetadataList,
	},
	'projects.projectsModelsFeatureImpactCreate': {
		input: DatarobotEndpointInputSchemas.projectsModelsFeatureImpactCreate,
		output: DatarobotEndpointOutputSchemas.projectsModelsFeatureImpactCreate,
	},
	'projects.projectsModelsFeatureImpactList': {
		input: DatarobotEndpointInputSchemas.projectsModelsFeatureImpactList,
		output: DatarobotEndpointOutputSchemas.projectsModelsFeatureImpactList,
	},
	'projects.projectsModelsFeatureListsClusterInsightsList': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsFeatureListsClusterInsightsList,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsFeatureListsClusterInsightsList,
	},
	'projects.projectsModelsFeaturesList': {
		input: DatarobotEndpointInputSchemas.projectsModelsFeaturesList,
		output: DatarobotEndpointOutputSchemas.projectsModelsFeaturesList,
	},
	'projects.projectsModelsFromModelCreate': {
		input: DatarobotEndpointInputSchemas.projectsModelsFromModelCreate,
		output: DatarobotEndpointOutputSchemas.projectsModelsFromModelCreate,
	},
	'projects.projectsModelsGridSearchScoresList': {
		input: DatarobotEndpointInputSchemas.projectsModelsGridSearchScoresList,
		output: DatarobotEndpointOutputSchemas.projectsModelsGridSearchScoresList,
	},
	'projects.projectsModelsImageActivationMapsCreate': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsImageActivationMapsCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsImageActivationMapsCreate,
	},
	'projects.projectsModelsImageActivationMapsList': {
		input: DatarobotEndpointInputSchemas.projectsModelsImageActivationMapsList,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsImageActivationMapsList,
	},
	'projects.projectsModelsImageEmbeddingsCreate': {
		input: DatarobotEndpointInputSchemas.projectsModelsImageEmbeddingsCreate,
		output: DatarobotEndpointOutputSchemas.projectsModelsImageEmbeddingsCreate,
	},
	'projects.projectsModelsImageEmbeddingsList': {
		input: DatarobotEndpointInputSchemas.projectsModelsImageEmbeddingsList,
		output: DatarobotEndpointOutputSchemas.projectsModelsImageEmbeddingsList,
	},
	'projects.projectsModelsLabelwiseRocCurvesList': {
		input: DatarobotEndpointInputSchemas.projectsModelsLabelwiseRocCurvesList,
		output: DatarobotEndpointOutputSchemas.projectsModelsLabelwiseRocCurvesList,
	},
	'projects.projectsModelsLiftChartList': {
		input: DatarobotEndpointInputSchemas.projectsModelsLiftChartList,
		output: DatarobotEndpointOutputSchemas.projectsModelsLiftChartList,
	},
	'projects.projectsModelsLiftChartRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsModelsLiftChartRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsModelsLiftChartRetrieve,
	},
	'projects.projectsModelsList': {
		input: DatarobotEndpointInputSchemas.projectsModelsList,
		output: DatarobotEndpointOutputSchemas.projectsModelsList,
	},
	'projects.projectsModelsLogsList': {
		input: DatarobotEndpointInputSchemas.projectsModelsLogsList,
		output: DatarobotEndpointOutputSchemas.projectsModelsLogsList,
	},
	'projects.projectsModelsMissingReportList': {
		input: DatarobotEndpointInputSchemas.projectsModelsMissingReportList,
		output: DatarobotEndpointOutputSchemas.projectsModelsMissingReportList,
	},
	'projects.projectsModelsMulticlassFeatureEffectsCreate': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsMulticlassFeatureEffectsCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsMulticlassFeatureEffectsCreate,
	},
	'projects.projectsModelsMulticlassFeatureEffectsList': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsMulticlassFeatureEffectsList,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsMulticlassFeatureEffectsList,
	},
	'projects.projectsModelsMulticlassFeatureImpactList': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsMulticlassFeatureImpactList,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsMulticlassFeatureImpactList,
	},
	'projects.projectsModelsMulticlassLiftChartList': {
		input: DatarobotEndpointInputSchemas.projectsModelsMulticlassLiftChartList,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsMulticlassLiftChartList,
	},
	'projects.projectsModelsMulticlassLiftChartRetrieve': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsMulticlassLiftChartRetrieve,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsMulticlassLiftChartRetrieve,
	},
	'projects.projectsModelsMultilabelLiftChartsRetrieve': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsMultilabelLiftChartsRetrieve,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsMultilabelLiftChartsRetrieve,
	},
	'projects.projectsModelsNumIterationsTrainedList': {
		input: DatarobotEndpointInputSchemas.projectsModelsNumIterationsTrainedList,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsNumIterationsTrainedList,
	},
	'projects.projectsModelsParametersList': {
		input: DatarobotEndpointInputSchemas.projectsModelsParametersList,
		output: DatarobotEndpointOutputSchemas.projectsModelsParametersList,
	},
	'projects.projectsModelsPatch': {
		input: DatarobotEndpointInputSchemas.projectsModelsPatch,
		output: DatarobotEndpointOutputSchemas.projectsModelsPatch,
	},
	'projects.projectsModelsPredictionExplanationsInitializationCreate': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsPredictionExplanationsInitializationCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsPredictionExplanationsInitializationCreate,
	},
	'projects.projectsModelsPredictionExplanationsInitializationDeleteMany': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsPredictionExplanationsInitializationDeleteMany,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsPredictionExplanationsInitializationDeleteMany,
	},
	'projects.projectsModelsPredictionExplanationsInitializationList': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsPredictionExplanationsInitializationList,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsPredictionExplanationsInitializationList,
	},
	'projects.projectsModelsPredictionIntervalsCreate': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsPredictionIntervalsCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsPredictionIntervalsCreate,
	},
	'projects.projectsModelsPredictionIntervalsList': {
		input: DatarobotEndpointInputSchemas.projectsModelsPredictionIntervalsList,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsPredictionIntervalsList,
	},
	'projects.projectsModelsPrimeInfoList': {
		input: DatarobotEndpointInputSchemas.projectsModelsPrimeInfoList,
		output: DatarobotEndpointOutputSchemas.projectsModelsPrimeInfoList,
	},
	'projects.projectsModelsPrimeRulesetsCreate': {
		input: DatarobotEndpointInputSchemas.projectsModelsPrimeRulesetsCreate,
		output: DatarobotEndpointOutputSchemas.projectsModelsPrimeRulesetsCreate,
	},
	'projects.projectsModelsPrimeRulesetsList': {
		input: DatarobotEndpointInputSchemas.projectsModelsPrimeRulesetsList,
		output: DatarobotEndpointOutputSchemas.projectsModelsPrimeRulesetsList,
	},
	'projects.projectsModelsResidualsList': {
		input: DatarobotEndpointInputSchemas.projectsModelsResidualsList,
		output: DatarobotEndpointOutputSchemas.projectsModelsResidualsList,
	},
	'projects.projectsModelsResidualsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsModelsResidualsRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsModelsResidualsRetrieve,
	},
	'projects.projectsModelsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsModelsRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsModelsRetrieve,
	},
	'projects.projectsModelsRocCurveList': {
		input: DatarobotEndpointInputSchemas.projectsModelsRocCurveList,
		output: DatarobotEndpointOutputSchemas.projectsModelsRocCurveList,
	},
	'projects.projectsModelsRocCurveRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsModelsRocCurveRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsModelsRocCurveRetrieve,
	},
	'projects.projectsModelsScoringCodeList': {
		input: DatarobotEndpointInputSchemas.projectsModelsScoringCodeList,
		output: DatarobotEndpointOutputSchemas.projectsModelsScoringCodeList,
	},
	'projects.projectsModelsShapImpactCreate': {
		input: DatarobotEndpointInputSchemas.projectsModelsShapImpactCreate,
		output: DatarobotEndpointOutputSchemas.projectsModelsShapImpactCreate,
	},
	'projects.projectsModelsShapImpactList': {
		input: DatarobotEndpointInputSchemas.projectsModelsShapImpactList,
		output: DatarobotEndpointOutputSchemas.projectsModelsShapImpactList,
	},
	'projects.projectsModelsSupportedCapabilitiesList': {
		input:
			DatarobotEndpointInputSchemas.projectsModelsSupportedCapabilitiesList,
		output:
			DatarobotEndpointOutputSchemas.projectsModelsSupportedCapabilitiesList,
	},
	'projects.projectsModelsTrainingArtifactList': {
		input: DatarobotEndpointInputSchemas.projectsModelsTrainingArtifactList,
		output: DatarobotEndpointOutputSchemas.projectsModelsTrainingArtifactList,
	},
	'projects.projectsModelsWordCloudList': {
		input: DatarobotEndpointInputSchemas.projectsModelsWordCloudList,
		output: DatarobotEndpointOutputSchemas.projectsModelsWordCloudList,
	},
	'projects.projectsMulticategoricalInvalidFormatFileList': {
		input:
			DatarobotEndpointInputSchemas.projectsMulticategoricalInvalidFormatFileList,
		output:
			DatarobotEndpointOutputSchemas.projectsMulticategoricalInvalidFormatFileList,
	},
	'projects.projectsMulticategoricalInvalidFormatList': {
		input:
			DatarobotEndpointInputSchemas.projectsMulticategoricalInvalidFormatList,
		output:
			DatarobotEndpointOutputSchemas.projectsMulticategoricalInvalidFormatList,
	},
	'projects.projectsMultiseriesIdsCrossSeriesPropertiesList': {
		input:
			DatarobotEndpointInputSchemas.projectsMultiseriesIdsCrossSeriesPropertiesList,
		output:
			DatarobotEndpointOutputSchemas.projectsMultiseriesIdsCrossSeriesPropertiesList,
	},
	'projects.projectsMultiseriesNamesList': {
		input: DatarobotEndpointInputSchemas.projectsMultiseriesNamesList,
		output: DatarobotEndpointOutputSchemas.projectsMultiseriesNamesList,
	},
	'projects.projectsMultiseriesPropertiesCreate': {
		input: DatarobotEndpointInputSchemas.projectsMultiseriesPropertiesCreate,
		output: DatarobotEndpointOutputSchemas.projectsMultiseriesPropertiesCreate,
	},
	'projects.projectsOptimizedDatetimePartitioningsCreate': {
		input:
			DatarobotEndpointInputSchemas.projectsOptimizedDatetimePartitioningsCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsOptimizedDatetimePartitioningsCreate,
	},
	'projects.projectsOptimizedDatetimePartitioningsDatetimePartitioningInputList':
		{
			input:
				DatarobotEndpointInputSchemas.projectsOptimizedDatetimePartitioningsDatetimePartitioningInputList,
			output:
				DatarobotEndpointOutputSchemas.projectsOptimizedDatetimePartitioningsDatetimePartitioningInputList,
		},
	'projects.projectsOptimizedDatetimePartitioningsDatetimePartitioningLogFileList':
		{
			input:
				DatarobotEndpointInputSchemas.projectsOptimizedDatetimePartitioningsDatetimePartitioningLogFileList,
			output:
				DatarobotEndpointOutputSchemas.projectsOptimizedDatetimePartitioningsDatetimePartitioningLogFileList,
		},
	'projects.projectsOptimizedDatetimePartitioningsDatetimePartitioningLogList':
		{
			input:
				DatarobotEndpointInputSchemas.projectsOptimizedDatetimePartitioningsDatetimePartitioningLogList,
			output:
				DatarobotEndpointOutputSchemas.projectsOptimizedDatetimePartitioningsDatetimePartitioningLogList,
		},
	'projects.projectsOptimizedDatetimePartitioningsList': {
		input:
			DatarobotEndpointInputSchemas.projectsOptimizedDatetimePartitioningsList,
		output:
			DatarobotEndpointOutputSchemas.projectsOptimizedDatetimePartitioningsList,
	},
	'projects.projectsOptimizedDatetimePartitioningsRetrieve': {
		input:
			DatarobotEndpointInputSchemas.projectsOptimizedDatetimePartitioningsRetrieve,
		output:
			DatarobotEndpointOutputSchemas.projectsOptimizedDatetimePartitioningsRetrieve,
	},
	'projects.projectsPatch': {
		input: DatarobotEndpointInputSchemas.projectsPatch,
		output: DatarobotEndpointOutputSchemas.projectsPatch,
	},
	'projects.projectsPayoffMatricesCreate': {
		input: DatarobotEndpointInputSchemas.projectsPayoffMatricesCreate,
		output: DatarobotEndpointOutputSchemas.projectsPayoffMatricesCreate,
	},
	'projects.projectsPayoffMatricesDelete': {
		input: DatarobotEndpointInputSchemas.projectsPayoffMatricesDelete,
		output: DatarobotEndpointOutputSchemas.projectsPayoffMatricesDelete,
	},
	'projects.projectsPayoffMatricesList': {
		input: DatarobotEndpointInputSchemas.projectsPayoffMatricesList,
		output: DatarobotEndpointOutputSchemas.projectsPayoffMatricesList,
	},
	'projects.projectsPayoffMatricesPut': {
		input: DatarobotEndpointInputSchemas.projectsPayoffMatricesPut,
		output: DatarobotEndpointOutputSchemas.projectsPayoffMatricesPut,
	},
	'projects.projectsPredictJobsDelete': {
		input: DatarobotEndpointInputSchemas.projectsPredictJobsDelete,
		output: DatarobotEndpointOutputSchemas.projectsPredictJobsDelete,
	},
	'projects.projectsPredictJobsList': {
		input: DatarobotEndpointInputSchemas.projectsPredictJobsList,
		output: DatarobotEndpointOutputSchemas.projectsPredictJobsList,
	},
	'projects.projectsPredictJobsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsPredictJobsRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsPredictJobsRetrieve,
	},
	'projects.projectsPredictionDatasetsDataSourceUploadsCreate': {
		input:
			DatarobotEndpointInputSchemas.projectsPredictionDatasetsDataSourceUploadsCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsPredictionDatasetsDataSourceUploadsCreate,
	},
	'projects.projectsPredictionDatasetsDatasetUploadsCreate': {
		input:
			DatarobotEndpointInputSchemas.projectsPredictionDatasetsDatasetUploadsCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsPredictionDatasetsDatasetUploadsCreate,
	},
	'projects.projectsPredictionDatasetsDelete': {
		input: DatarobotEndpointInputSchemas.projectsPredictionDatasetsDelete,
		output: DatarobotEndpointOutputSchemas.projectsPredictionDatasetsDelete,
	},
	'projects.projectsPredictionDatasetsFileUploadsCreate': {
		input:
			DatarobotEndpointInputSchemas.projectsPredictionDatasetsFileUploadsCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsPredictionDatasetsFileUploadsCreate,
	},
	'projects.projectsPredictionDatasetsList': {
		input: DatarobotEndpointInputSchemas.projectsPredictionDatasetsList,
		output: DatarobotEndpointOutputSchemas.projectsPredictionDatasetsList,
	},
	'projects.projectsPredictionDatasetsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsPredictionDatasetsRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsPredictionDatasetsRetrieve,
	},
	'projects.projectsPredictionDatasetsUrlUploadsCreate': {
		input:
			DatarobotEndpointInputSchemas.projectsPredictionDatasetsUrlUploadsCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsPredictionDatasetsUrlUploadsCreate,
	},
	'projects.projectsPredictionExplanationsCreate': {
		input: DatarobotEndpointInputSchemas.projectsPredictionExplanationsCreate,
		output: DatarobotEndpointOutputSchemas.projectsPredictionExplanationsCreate,
	},
	'projects.projectsPredictionExplanationsList': {
		input: DatarobotEndpointInputSchemas.projectsPredictionExplanationsList,
		output: DatarobotEndpointOutputSchemas.projectsPredictionExplanationsList,
	},
	'projects.projectsPredictionExplanationsRecordsDelete': {
		input:
			DatarobotEndpointInputSchemas.projectsPredictionExplanationsRecordsDelete,
		output:
			DatarobotEndpointOutputSchemas.projectsPredictionExplanationsRecordsDelete,
	},
	'projects.projectsPredictionExplanationsRecordsList': {
		input:
			DatarobotEndpointInputSchemas.projectsPredictionExplanationsRecordsList,
		output:
			DatarobotEndpointOutputSchemas.projectsPredictionExplanationsRecordsList,
	},
	'projects.projectsPredictionExplanationsRecordsRetrieve': {
		input:
			DatarobotEndpointInputSchemas.projectsPredictionExplanationsRecordsRetrieve,
		output:
			DatarobotEndpointOutputSchemas.projectsPredictionExplanationsRecordsRetrieve,
	},
	'projects.projectsPredictionsCreate': {
		input: DatarobotEndpointInputSchemas.projectsPredictionsCreate,
		output: DatarobotEndpointOutputSchemas.projectsPredictionsCreate,
	},
	'projects.projectsPredictionsList': {
		input: DatarobotEndpointInputSchemas.projectsPredictionsList,
		output: DatarobotEndpointOutputSchemas.projectsPredictionsList,
	},
	'projects.projectsPredictionsMetadataList': {
		input: DatarobotEndpointInputSchemas.projectsPredictionsMetadataList,
		output: DatarobotEndpointOutputSchemas.projectsPredictionsMetadataList,
	},
	'projects.projectsPredictionsMetadataRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsPredictionsMetadataRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsPredictionsMetadataRetrieve,
	},
	'projects.projectsPredictionsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsPredictionsRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsPredictionsRetrieve,
	},
	'projects.projectsPrimeFilesCreate': {
		input: DatarobotEndpointInputSchemas.projectsPrimeFilesCreate,
		output: DatarobotEndpointOutputSchemas.projectsPrimeFilesCreate,
	},
	'projects.projectsPrimeFilesDownloadList': {
		input: DatarobotEndpointInputSchemas.projectsPrimeFilesDownloadList,
		output: DatarobotEndpointOutputSchemas.projectsPrimeFilesDownloadList,
	},
	'projects.projectsPrimeFilesList': {
		input: DatarobotEndpointInputSchemas.projectsPrimeFilesList,
		output: DatarobotEndpointOutputSchemas.projectsPrimeFilesList,
	},
	'projects.projectsPrimeFilesRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsPrimeFilesRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsPrimeFilesRetrieve,
	},
	'projects.projectsPrimeModelsCreate': {
		input: DatarobotEndpointInputSchemas.projectsPrimeModelsCreate,
		output: DatarobotEndpointOutputSchemas.projectsPrimeModelsCreate,
	},
	'projects.projectsPrimeModelsList': {
		input: DatarobotEndpointInputSchemas.projectsPrimeModelsList,
		output: DatarobotEndpointOutputSchemas.projectsPrimeModelsList,
	},
	'projects.projectsPrimeModelsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsPrimeModelsRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsPrimeModelsRetrieve,
	},
	'projects.projectsRatingTableModelsCreate': {
		input: DatarobotEndpointInputSchemas.projectsRatingTableModelsCreate,
		output: DatarobotEndpointOutputSchemas.projectsRatingTableModelsCreate,
	},
	'projects.projectsRatingTableModelsList': {
		input: DatarobotEndpointInputSchemas.projectsRatingTableModelsList,
		output: DatarobotEndpointOutputSchemas.projectsRatingTableModelsList,
	},
	'projects.projectsRatingTableModelsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsRatingTableModelsRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsRatingTableModelsRetrieve,
	},
	'projects.projectsRatingTablesCreate': {
		input: DatarobotEndpointInputSchemas.projectsRatingTablesCreate,
		output: DatarobotEndpointOutputSchemas.projectsRatingTablesCreate,
	},
	'projects.projectsRatingTablesFileList': {
		input: DatarobotEndpointInputSchemas.projectsRatingTablesFileList,
		output: DatarobotEndpointOutputSchemas.projectsRatingTablesFileList,
	},
	'projects.projectsRatingTablesList': {
		input: DatarobotEndpointInputSchemas.projectsRatingTablesList,
		output: DatarobotEndpointOutputSchemas.projectsRatingTablesList,
	},
	'projects.projectsRatingTablesPatch': {
		input: DatarobotEndpointInputSchemas.projectsRatingTablesPatch,
		output: DatarobotEndpointOutputSchemas.projectsRatingTablesPatch,
	},
	'projects.projectsRatingTablesRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsRatingTablesRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsRatingTablesRetrieve,
	},
	'projects.projectsRecommendedModelsList': {
		input: DatarobotEndpointInputSchemas.projectsRecommendedModelsList,
		output: DatarobotEndpointOutputSchemas.projectsRecommendedModelsList,
	},
	'projects.projectsRecommendedModelsRecommendedModelList': {
		input:
			DatarobotEndpointInputSchemas.projectsRecommendedModelsRecommendedModelList,
		output:
			DatarobotEndpointOutputSchemas.projectsRecommendedModelsRecommendedModelList,
	},
	'projects.projectsRelationshipQualityAssessmentsCreate': {
		input:
			DatarobotEndpointInputSchemas.projectsRelationshipQualityAssessmentsCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsRelationshipQualityAssessmentsCreate,
	},
	'projects.projectsRelationshipsConfigurationList': {
		input: DatarobotEndpointInputSchemas.projectsRelationshipsConfigurationList,
		output:
			DatarobotEndpointOutputSchemas.projectsRelationshipsConfigurationList,
	},
	'projects.projectsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsRetrieve,
	},
	'projects.projectsRuleFitFilesCreate': {
		input: DatarobotEndpointInputSchemas.projectsRuleFitFilesCreate,
		output: DatarobotEndpointOutputSchemas.projectsRuleFitFilesCreate,
	},
	'projects.projectsRuleFitFilesDownloadList': {
		input: DatarobotEndpointInputSchemas.projectsRuleFitFilesDownloadList,
		output: DatarobotEndpointOutputSchemas.projectsRuleFitFilesDownloadList,
	},
	'projects.projectsRuleFitFilesList': {
		input: DatarobotEndpointInputSchemas.projectsRuleFitFilesList,
		output: DatarobotEndpointOutputSchemas.projectsRuleFitFilesList,
	},
	'projects.projectsRuleFitFilesRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsRuleFitFilesRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsRuleFitFilesRetrieve,
	},
	'projects.projectsSecondaryDatasetsConfigurationsCreate': {
		input:
			DatarobotEndpointInputSchemas.projectsSecondaryDatasetsConfigurationsCreate,
		output:
			DatarobotEndpointOutputSchemas.projectsSecondaryDatasetsConfigurationsCreate,
	},
	'projects.projectsSecondaryDatasetsConfigurationsDelete': {
		input:
			DatarobotEndpointInputSchemas.projectsSecondaryDatasetsConfigurationsDelete,
		output:
			DatarobotEndpointOutputSchemas.projectsSecondaryDatasetsConfigurationsDelete,
	},
	'projects.projectsSecondaryDatasetsConfigurationsList': {
		input:
			DatarobotEndpointInputSchemas.projectsSecondaryDatasetsConfigurationsList,
		output:
			DatarobotEndpointOutputSchemas.projectsSecondaryDatasetsConfigurationsList,
	},
	'projects.projectsSecondaryDatasetsConfigurationsRetrieve': {
		input:
			DatarobotEndpointInputSchemas.projectsSecondaryDatasetsConfigurationsRetrieve,
		output:
			DatarobotEndpointOutputSchemas.projectsSecondaryDatasetsConfigurationsRetrieve,
	},
	'projects.projectsSegmentChampionPutMany': {
		input: DatarobotEndpointInputSchemas.projectsSegmentChampionPutMany,
		output: DatarobotEndpointOutputSchemas.projectsSegmentChampionPutMany,
	},
	'projects.projectsSegmentationTaskJobResultsRetrieve': {
		input:
			DatarobotEndpointInputSchemas.projectsSegmentationTaskJobResultsRetrieve,
		output:
			DatarobotEndpointOutputSchemas.projectsSegmentationTaskJobResultsRetrieve,
	},
	'projects.projectsSegmentationTasksCreate': {
		input: DatarobotEndpointInputSchemas.projectsSegmentationTasksCreate,
		output: DatarobotEndpointOutputSchemas.projectsSegmentationTasksCreate,
	},
	'projects.projectsSegmentationTasksList': {
		input: DatarobotEndpointInputSchemas.projectsSegmentationTasksList,
		output: DatarobotEndpointOutputSchemas.projectsSegmentationTasksList,
	},
	'projects.projectsSegmentationTasksMappingsList': {
		input: DatarobotEndpointInputSchemas.projectsSegmentationTasksMappingsList,
		output:
			DatarobotEndpointOutputSchemas.projectsSegmentationTasksMappingsList,
	},
	'projects.projectsSegmentationTasksRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsSegmentationTasksRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsSegmentationTasksRetrieve,
	},
	'projects.projectsSegmentsPatch': {
		input: DatarobotEndpointInputSchemas.projectsSegmentsPatch,
		output: DatarobotEndpointOutputSchemas.projectsSegmentsPatch,
	},
	'projects.projectsShapMatricesCreate': {
		input: DatarobotEndpointInputSchemas.projectsShapMatricesCreate,
		output: DatarobotEndpointOutputSchemas.projectsShapMatricesCreate,
	},
	'projects.projectsShapMatricesList': {
		input: DatarobotEndpointInputSchemas.projectsShapMatricesList,
		output: DatarobotEndpointOutputSchemas.projectsShapMatricesList,
	},
	'projects.projectsShapMatricesRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsShapMatricesRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsShapMatricesRetrieve,
	},
	'projects.projectsStatusList': {
		input: DatarobotEndpointInputSchemas.projectsStatusList,
		output: DatarobotEndpointOutputSchemas.projectsStatusList,
	},
	'projects.projectsTimeSeriesFeatureLogFileList': {
		input: DatarobotEndpointInputSchemas.projectsTimeSeriesFeatureLogFileList,
		output: DatarobotEndpointOutputSchemas.projectsTimeSeriesFeatureLogFileList,
	},
	'projects.projectsTimeSeriesFeatureLogList': {
		input: DatarobotEndpointInputSchemas.projectsTimeSeriesFeatureLogList,
		output: DatarobotEndpointOutputSchemas.projectsTimeSeriesFeatureLogList,
	},
	'projects.projectsTrainingPredictionsCreate': {
		input: DatarobotEndpointInputSchemas.projectsTrainingPredictionsCreate,
		output: DatarobotEndpointOutputSchemas.projectsTrainingPredictionsCreate,
	},
	'projects.projectsTypeTransformFeaturesCreate': {
		input: DatarobotEndpointInputSchemas.projectsTypeTransformFeaturesCreate,
		output: DatarobotEndpointOutputSchemas.projectsTypeTransformFeaturesCreate,
	},
	'projects.trainingPredictionsList': {
		input: DatarobotEndpointInputSchemas.trainingPredictionsList,
		output: DatarobotEndpointOutputSchemas.trainingPredictionsList,
	},
	'quotaTemplates.quotaTemplatesList': {
		input: DatarobotEndpointInputSchemas.quotaTemplatesList,
		output: DatarobotEndpointOutputSchemas.quotaTemplatesList,
	},
	'quotaTemplates.quotaTemplatesRetrieve': {
		input: DatarobotEndpointInputSchemas.quotaTemplatesRetrieve,
		output: DatarobotEndpointOutputSchemas.quotaTemplatesRetrieve,
	},
	'quotas.quotasCreate': {
		input: DatarobotEndpointInputSchemas.quotasCreate,
		output: DatarobotEndpointOutputSchemas.quotasCreate,
	},
	'quotas.quotasDelete': {
		input: DatarobotEndpointInputSchemas.quotasDelete,
		output: DatarobotEndpointOutputSchemas.quotasDelete,
	},
	'quotas.quotasList': {
		input: DatarobotEndpointInputSchemas.quotasList,
		output: DatarobotEndpointOutputSchemas.quotasList,
	},
	'quotas.quotasPatch': {
		input: DatarobotEndpointInputSchemas.quotasPatch,
		output: DatarobotEndpointOutputSchemas.quotasPatch,
	},
	'quotas.quotasRetrieve': {
		input: DatarobotEndpointInputSchemas.quotasRetrieve,
		output: DatarobotEndpointOutputSchemas.quotasRetrieve,
	},
	'recipes.recipesDelete': {
		input: DatarobotEndpointInputSchemas.recipesDelete,
		output: DatarobotEndpointOutputSchemas.recipesDelete,
	},
	'recipes.recipesDownsamplingPutMany': {
		input: DatarobotEndpointInputSchemas.recipesDownsamplingPutMany,
		output: DatarobotEndpointOutputSchemas.recipesDownsamplingPutMany,
	},
	'recipes.recipesFromDataStoreCreate': {
		input: DatarobotEndpointInputSchemas.recipesFromDataStoreCreate,
		output: DatarobotEndpointOutputSchemas.recipesFromDataStoreCreate,
	},
	'recipes.recipesFromDatasetCreate': {
		input: DatarobotEndpointInputSchemas.recipesFromDatasetCreate,
		output: DatarobotEndpointOutputSchemas.recipesFromDatasetCreate,
	},
	'recipes.recipesFromRecipeCreate': {
		input: DatarobotEndpointInputSchemas.recipesFromRecipeCreate,
		output: DatarobotEndpointOutputSchemas.recipesFromRecipeCreate,
	},
	'recipes.recipesInputsList': {
		input: DatarobotEndpointInputSchemas.recipesInputsList,
		output: DatarobotEndpointOutputSchemas.recipesInputsList,
	},
	'recipes.recipesInputsPutMany': {
		input: DatarobotEndpointInputSchemas.recipesInputsPutMany,
		output: DatarobotEndpointOutputSchemas.recipesInputsPutMany,
	},
	'recipes.recipesInsightsList': {
		input: DatarobotEndpointInputSchemas.recipesInsightsList,
		output: DatarobotEndpointOutputSchemas.recipesInsightsList,
	},
	'recipes.recipesList': {
		input: DatarobotEndpointInputSchemas.recipesList,
		output: DatarobotEndpointOutputSchemas.recipesList,
	},
	'recipes.recipesOperationsPutMany': {
		input: DatarobotEndpointInputSchemas.recipesOperationsPutMany,
		output: DatarobotEndpointOutputSchemas.recipesOperationsPutMany,
	},
	'recipes.recipesOperationsRetrieve': {
		input: DatarobotEndpointInputSchemas.recipesOperationsRetrieve,
		output: DatarobotEndpointOutputSchemas.recipesOperationsRetrieve,
	},
	'recipes.recipesPatch': {
		input: DatarobotEndpointInputSchemas.recipesPatch,
		output: DatarobotEndpointOutputSchemas.recipesPatch,
	},
	'recipes.recipesPreviewCreate': {
		input: DatarobotEndpointInputSchemas.recipesPreviewCreate,
		output: DatarobotEndpointOutputSchemas.recipesPreviewCreate,
	},
	'recipes.recipesPreviewList': {
		input: DatarobotEndpointInputSchemas.recipesPreviewList,
		output: DatarobotEndpointOutputSchemas.recipesPreviewList,
	},
	'recipes.recipesRelationshipQualityAssessmentsCreate': {
		input:
			DatarobotEndpointInputSchemas.recipesRelationshipQualityAssessmentsCreate,
		output:
			DatarobotEndpointOutputSchemas.recipesRelationshipQualityAssessmentsCreate,
	},
	'recipes.recipesRetrieve': {
		input: DatarobotEndpointInputSchemas.recipesRetrieve,
		output: DatarobotEndpointOutputSchemas.recipesRetrieve,
	},
	'recipes.recipesSettingsPatchMany': {
		input: DatarobotEndpointInputSchemas.recipesSettingsPatchMany,
		output: DatarobotEndpointOutputSchemas.recipesSettingsPatchMany,
	},
	'recipes.recipesSqlCreate': {
		input: DatarobotEndpointInputSchemas.recipesSqlCreate,
		output: DatarobotEndpointOutputSchemas.recipesSqlCreate,
	},
	'recipes.recipesTimeseriesTransformationPlansCreate': {
		input:
			DatarobotEndpointInputSchemas.recipesTimeseriesTransformationPlansCreate,
		output:
			DatarobotEndpointOutputSchemas.recipesTimeseriesTransformationPlansCreate,
	},
	'recipes.recipesTimeseriesTransformationPlansRetrieve': {
		input:
			DatarobotEndpointInputSchemas.recipesTimeseriesTransformationPlansRetrieve,
		output:
			DatarobotEndpointOutputSchemas.recipesTimeseriesTransformationPlansRetrieve,
	},
	'registeredModels.registeredModelsDelete': {
		input: DatarobotEndpointInputSchemas.registeredModelsDelete,
		output: DatarobotEndpointOutputSchemas.registeredModelsDelete,
	},
	'registeredModels.registeredModelsDeploymentsList': {
		input: DatarobotEndpointInputSchemas.registeredModelsDeploymentsList,
		output: DatarobotEndpointOutputSchemas.registeredModelsDeploymentsList,
	},
	'registeredModels.registeredModelsList': {
		input: DatarobotEndpointInputSchemas.registeredModelsList,
		output: DatarobotEndpointOutputSchemas.registeredModelsList,
	},
	'registeredModels.registeredModelsPatch': {
		input: DatarobotEndpointInputSchemas.registeredModelsPatch,
		output: DatarobotEndpointOutputSchemas.registeredModelsPatch,
	},
	'registeredModels.registeredModelsRetrieve': {
		input: DatarobotEndpointInputSchemas.registeredModelsRetrieve,
		output: DatarobotEndpointOutputSchemas.registeredModelsRetrieve,
	},
	'registeredModels.registeredModelsSharedRolesList': {
		input: DatarobotEndpointInputSchemas.registeredModelsSharedRolesList,
		output: DatarobotEndpointOutputSchemas.registeredModelsSharedRolesList,
	},
	'registeredModels.registeredModelsSharedRolesPatchMany': {
		input: DatarobotEndpointInputSchemas.registeredModelsSharedRolesPatchMany,
		output: DatarobotEndpointOutputSchemas.registeredModelsSharedRolesPatchMany,
	},
	'registeredModels.registeredModelsVersionsDeploymentsList': {
		input:
			DatarobotEndpointInputSchemas.registeredModelsVersionsDeploymentsList,
		output:
			DatarobotEndpointOutputSchemas.registeredModelsVersionsDeploymentsList,
	},
	'registeredModels.registeredModelsVersionsList': {
		input: DatarobotEndpointInputSchemas.registeredModelsVersionsList,
		output: DatarobotEndpointOutputSchemas.registeredModelsVersionsList,
	},
	'registeredModels.registeredModelsVersionsRetrieve': {
		input: DatarobotEndpointInputSchemas.registeredModelsVersionsRetrieve,
		output: DatarobotEndpointOutputSchemas.registeredModelsVersionsRetrieve,
	},
	'relationshipsConfigurations.relationshipsConfigurationsCreate': {
		input: DatarobotEndpointInputSchemas.relationshipsConfigurationsCreate,
		output: DatarobotEndpointOutputSchemas.relationshipsConfigurationsCreate,
	},
	'relationshipsConfigurations.relationshipsConfigurationsDelete': {
		input: DatarobotEndpointInputSchemas.relationshipsConfigurationsDelete,
		output: DatarobotEndpointOutputSchemas.relationshipsConfigurationsDelete,
	},
	'relationshipsConfigurations.relationshipsConfigurationsPut': {
		input: DatarobotEndpointInputSchemas.relationshipsConfigurationsPut,
		output: DatarobotEndpointOutputSchemas.relationshipsConfigurationsPut,
	},
	'relationshipsConfigurations.relationshipsConfigurationsRetrieve': {
		input: DatarobotEndpointInputSchemas.relationshipsConfigurationsRetrieve,
		output: DatarobotEndpointOutputSchemas.relationshipsConfigurationsRetrieve,
	},
	'relationshipsConfigurations.relationshipsConfigurationsRetrieveExtended': {
		input:
			DatarobotEndpointInputSchemas.relationshipsConfigurationsRetrieveExtended,
		output:
			DatarobotEndpointOutputSchemas.relationshipsConfigurationsRetrieveExtended,
	},
	'remoteEvents.remoteEventsCreate': {
		input: DatarobotEndpointInputSchemas.remoteEventsCreate,
		output: DatarobotEndpointOutputSchemas.remoteEventsCreate,
	},
	'scheduledJobs.scheduledJobsList': {
		input: DatarobotEndpointInputSchemas.scheduledJobsList,
		output: DatarobotEndpointOutputSchemas.scheduledJobsList,
	},
	'seatLicenseAllocations.seatLicenseAllocationsCreate': {
		input: DatarobotEndpointInputSchemas.seatLicenseAllocationsCreate,
		output: DatarobotEndpointOutputSchemas.seatLicenseAllocationsCreate,
	},
	'seatLicenseAllocations.seatLicenseAllocationsDelete': {
		input: DatarobotEndpointInputSchemas.seatLicenseAllocationsDelete,
		output: DatarobotEndpointOutputSchemas.seatLicenseAllocationsDelete,
	},
	'seatLicenseAllocations.seatLicenseAllocationsEvaluateCreate': {
		input: DatarobotEndpointInputSchemas.seatLicenseAllocationsEvaluateCreate,
		output: DatarobotEndpointOutputSchemas.seatLicenseAllocationsEvaluateCreate,
	},
	'seatLicenseAllocations.seatLicenseAllocationsList': {
		input: DatarobotEndpointInputSchemas.seatLicenseAllocationsList,
		output: DatarobotEndpointOutputSchemas.seatLicenseAllocationsList,
	},
	'seatLicenseAllocations.seatLicenseAllocationsPatch': {
		input: DatarobotEndpointInputSchemas.seatLicenseAllocationsPatch,
		output: DatarobotEndpointOutputSchemas.seatLicenseAllocationsPatch,
	},
	'seatLicenseAllocations.seatLicenseAllocationsRetrieve': {
		input: DatarobotEndpointInputSchemas.seatLicenseAllocationsRetrieve,
		output: DatarobotEndpointOutputSchemas.seatLicenseAllocationsRetrieve,
	},
	'secureConfigs.secureConfigsCreate': {
		input: DatarobotEndpointInputSchemas.secureConfigsCreate,
		output: DatarobotEndpointOutputSchemas.secureConfigsCreate,
	},
	'secureConfigs.secureConfigsDelete': {
		input: DatarobotEndpointInputSchemas.secureConfigsDelete,
		output: DatarobotEndpointOutputSchemas.secureConfigsDelete,
	},
	'secureConfigs.secureConfigsList': {
		input: DatarobotEndpointInputSchemas.secureConfigsList,
		output: DatarobotEndpointOutputSchemas.secureConfigsList,
	},
	'secureConfigs.secureConfigsPatch': {
		input: DatarobotEndpointInputSchemas.secureConfigsPatch,
		output: DatarobotEndpointOutputSchemas.secureConfigsPatch,
	},
	'secureConfigs.secureConfigsRetrieve': {
		input: DatarobotEndpointInputSchemas.secureConfigsRetrieve,
		output: DatarobotEndpointOutputSchemas.secureConfigsRetrieve,
	},
	'secureConfigs.secureConfigsSharedRolesList': {
		input: DatarobotEndpointInputSchemas.secureConfigsSharedRolesList,
		output: DatarobotEndpointOutputSchemas.secureConfigsSharedRolesList,
	},
	'secureConfigs.secureConfigsSharedRolesPatchMany': {
		input: DatarobotEndpointInputSchemas.secureConfigsSharedRolesPatchMany,
		output: DatarobotEndpointOutputSchemas.secureConfigsSharedRolesPatchMany,
	},
	'secureConfigs.secureConfigsValuesList': {
		input: DatarobotEndpointInputSchemas.secureConfigsValuesList,
		output: DatarobotEndpointOutputSchemas.secureConfigsValuesList,
	},
	'sparkSessions.sparkSessionsDeleteMany': {
		input: DatarobotEndpointInputSchemas.sparkSessionsDeleteMany,
		output: DatarobotEndpointOutputSchemas.sparkSessionsDeleteMany,
	},
	'status.statusDelete': {
		input: DatarobotEndpointInputSchemas.statusDelete,
		output: DatarobotEndpointOutputSchemas.statusDelete,
	},
	'status.statusList': {
		input: DatarobotEndpointInputSchemas.statusList,
		output: DatarobotEndpointOutputSchemas.statusList,
	},
	'status.statusRetrieve': {
		input: DatarobotEndpointInputSchemas.statusRetrieve,
		output: DatarobotEndpointOutputSchemas.statusRetrieve,
	},
	'stringEncryptions.stringEncryptionsCreate': {
		input: DatarobotEndpointInputSchemas.stringEncryptionsCreate,
		output: DatarobotEndpointOutputSchemas.stringEncryptionsCreate,
	},
	'tenantUsageResources.tenantUsageResourcesActiveTenantsList': {
		input: DatarobotEndpointInputSchemas.tenantUsageResourcesActiveTenantsList,
		output:
			DatarobotEndpointOutputSchemas.tenantUsageResourcesActiveTenantsList,
	},
	'tenantUsageResources.tenantUsageResourcesActiveUsersList': {
		input: DatarobotEndpointInputSchemas.tenantUsageResourcesActiveUsersList,
		output: DatarobotEndpointOutputSchemas.tenantUsageResourcesActiveUsersList,
	},
	'tenantUsageResources.tenantUsageResourcesCategoriesList': {
		input: DatarobotEndpointInputSchemas.tenantUsageResourcesCategoriesList,
		output: DatarobotEndpointOutputSchemas.tenantUsageResourcesCategoriesList,
	},
	'tenantUsageResources.tenantUsageResourcesDeploymentsList': {
		input: DatarobotEndpointInputSchemas.tenantUsageResourcesDeploymentsList,
		output: DatarobotEndpointOutputSchemas.tenantUsageResourcesDeploymentsList,
	},
	'tenantUsageResources.tenantUsageResourcesExportList': {
		input: DatarobotEndpointInputSchemas.tenantUsageResourcesExportList,
		output: DatarobotEndpointOutputSchemas.tenantUsageResourcesExportList,
	},
	'tenantUsageResources.tenantUsageResourcesList': {
		input: DatarobotEndpointInputSchemas.tenantUsageResourcesList,
		output: DatarobotEndpointOutputSchemas.tenantUsageResourcesList,
	},
	'tenantUsageResources.tenantUsageResourcesUsageOverTimeList': {
		input: DatarobotEndpointInputSchemas.tenantUsageResourcesUsageOverTimeList,
		output:
			DatarobotEndpointOutputSchemas.tenantUsageResourcesUsageOverTimeList,
	},
	'tenants.tenantsActiveUsersList': {
		input: DatarobotEndpointInputSchemas.tenantsActiveUsersList,
		output: DatarobotEndpointOutputSchemas.tenantsActiveUsersList,
	},
	'tenants.tenantsResourceCategoriesList': {
		input: DatarobotEndpointInputSchemas.tenantsResourceCategoriesList,
		output: DatarobotEndpointOutputSchemas.tenantsResourceCategoriesList,
	},
	'tenants.tenantsUsageExportList': {
		input: DatarobotEndpointInputSchemas.tenantsUsageExportList,
		output: DatarobotEndpointOutputSchemas.tenantsUsageExportList,
	},
	'tenants.tenantsUsageList': {
		input: DatarobotEndpointInputSchemas.tenantsUsageList,
		output: DatarobotEndpointOutputSchemas.tenantsUsageList,
	},
	'tenants.tenantsUtilizationResourcesExportList': {
		input: DatarobotEndpointInputSchemas.tenantsUtilizationResourcesExportList,
		output:
			DatarobotEndpointOutputSchemas.tenantsUtilizationResourcesExportList,
	},
	'tenants.tenantsUtilizationResourcesList': {
		input: DatarobotEndpointInputSchemas.tenantsUtilizationResourcesList,
		output: DatarobotEndpointOutputSchemas.tenantsUtilizationResourcesList,
	},
	'tenants.tenantsUtilizationResourcesRetrieve': {
		input: DatarobotEndpointInputSchemas.tenantsUtilizationResourcesRetrieve,
		output: DatarobotEndpointOutputSchemas.tenantsUtilizationResourcesRetrieve,
	},
	'usageDataExports.usageDataExportsCreate': {
		input: DatarobotEndpointInputSchemas.usageDataExportsCreate,
		output: DatarobotEndpointOutputSchemas.usageDataExportsCreate,
	},
	'usageDataExports.usageDataExportsRetrieve': {
		input: DatarobotEndpointInputSchemas.usageDataExportsRetrieve,
		output: DatarobotEndpointOutputSchemas.usageDataExportsRetrieve,
	},
	'usageDataExports.usageDataExportsSupportedEventsList': {
		input: DatarobotEndpointInputSchemas.usageDataExportsSupportedEventsList,
		output: DatarobotEndpointOutputSchemas.usageDataExportsSupportedEventsList,
	},
	'useCases.useCasesAllNotebooks': {
		input: DatarobotEndpointInputSchemas.useCasesAllNotebooks,
		output: DatarobotEndpointOutputSchemas.useCasesAllNotebooks,
	},
	'useCases.useCasesAllResourcesList': {
		input: DatarobotEndpointInputSchemas.useCasesAllResourcesList,
		output: DatarobotEndpointOutputSchemas.useCasesAllResourcesList,
	},
	'useCases.useCasesApplicationsList': {
		input: DatarobotEndpointInputSchemas.useCasesApplicationsList,
		output: DatarobotEndpointOutputSchemas.useCasesApplicationsList,
	},
	'useCases.useCasesCreate': {
		input: DatarobotEndpointInputSchemas.useCasesCreate,
		output: DatarobotEndpointOutputSchemas.useCasesCreate,
	},
	'useCases.useCasesCreateOne': {
		input: DatarobotEndpointInputSchemas.useCasesCreateOne,
		output: DatarobotEndpointOutputSchemas.useCasesCreateOne,
	},
	'useCases.useCasesCustomApplicationsList': {
		input: DatarobotEndpointInputSchemas.useCasesCustomApplicationsList,
		output: DatarobotEndpointOutputSchemas.useCasesCustomApplicationsList,
	},
	'useCases.useCasesDataList': {
		input: DatarobotEndpointInputSchemas.useCasesDataList,
		output: DatarobotEndpointOutputSchemas.useCasesDataList,
	},
	'useCases.useCasesDatasetsList': {
		input: DatarobotEndpointInputSchemas.useCasesDatasetsList,
		output: DatarobotEndpointOutputSchemas.useCasesDatasetsList,
	},
	'useCases.useCasesDatasetsRetrieve': {
		input: DatarobotEndpointInputSchemas.useCasesDatasetsRetrieve,
		output: DatarobotEndpointOutputSchemas.useCasesDatasetsRetrieve,
	},
	'useCases.useCasesDelete': {
		input: DatarobotEndpointInputSchemas.useCasesDelete,
		output: DatarobotEndpointOutputSchemas.useCasesDelete,
	},
	'useCases.useCasesDeploymentsList': {
		input: DatarobotEndpointInputSchemas.useCasesDeploymentsList,
		output: DatarobotEndpointOutputSchemas.useCasesDeploymentsList,
	},
	'useCases.useCasesFilesList': {
		input: DatarobotEndpointInputSchemas.useCasesFilesList,
		output: DatarobotEndpointOutputSchemas.useCasesFilesList,
	},
	'useCases.useCasesFilesRetrieve': {
		input: DatarobotEndpointInputSchemas.useCasesFilesRetrieve,
		output: DatarobotEndpointOutputSchemas.useCasesFilesRetrieve,
	},
	'useCases.useCasesFilterMetadataList': {
		input: DatarobotEndpointInputSchemas.useCasesFilterMetadataList,
		output: DatarobotEndpointOutputSchemas.useCasesFilterMetadataList,
	},
	'useCases.useCasesList': {
		input: DatarobotEndpointInputSchemas.useCasesList,
		output: DatarobotEndpointOutputSchemas.useCasesList,
	},
	'useCases.useCasesModelsForComparisonList': {
		input: DatarobotEndpointInputSchemas.useCasesModelsForComparisonList,
		output: DatarobotEndpointOutputSchemas.useCasesModelsForComparisonList,
	},
	'useCases.useCasesMultilinkCreate': {
		input: DatarobotEndpointInputSchemas.useCasesMultilinkCreate,
		output: DatarobotEndpointOutputSchemas.useCasesMultilinkCreate,
	},
	'useCases.useCasesNotebooksList': {
		input: DatarobotEndpointInputSchemas.useCasesNotebooksList,
		output: DatarobotEndpointOutputSchemas.useCasesNotebooksList,
	},
	'useCases.useCasesPatch': {
		input: DatarobotEndpointInputSchemas.useCasesPatch,
		output: DatarobotEndpointOutputSchemas.useCasesPatch,
	},
	'useCases.useCasesPlaygroundsList': {
		input: DatarobotEndpointInputSchemas.useCasesPlaygroundsList,
		output: DatarobotEndpointOutputSchemas.useCasesPlaygroundsList,
	},
	'useCases.useCasesProjectsList': {
		input: DatarobotEndpointInputSchemas.useCasesProjectsList,
		output: DatarobotEndpointOutputSchemas.useCasesProjectsList,
	},
	'useCases.useCasesReferenceDelete': {
		input: DatarobotEndpointInputSchemas.useCasesReferenceDelete,
		output: DatarobotEndpointOutputSchemas.useCasesReferenceDelete,
	},
	'useCases.useCasesReferenceMove': {
		input: DatarobotEndpointInputSchemas.useCasesReferenceMove,
		output: DatarobotEndpointOutputSchemas.useCasesReferenceMove,
	},
	'useCases.useCasesRegisteredModelsList': {
		input: DatarobotEndpointInputSchemas.useCasesRegisteredModelsList,
		output: DatarobotEndpointOutputSchemas.useCasesRegisteredModelsList,
	},
	'useCases.useCasesResourcesList': {
		input: DatarobotEndpointInputSchemas.useCasesResourcesList,
		output: DatarobotEndpointOutputSchemas.useCasesResourcesList,
	},
	'useCases.useCasesRetrieve': {
		input: DatarobotEndpointInputSchemas.useCasesRetrieve,
		output: DatarobotEndpointOutputSchemas.useCasesRetrieve,
	},
	'useCases.useCasesSharedRolesList': {
		input: DatarobotEndpointInputSchemas.useCasesSharedRolesList,
		output: DatarobotEndpointOutputSchemas.useCasesSharedRolesList,
	},
	'useCases.useCasesSharedRolesPatchMany': {
		input: DatarobotEndpointInputSchemas.useCasesSharedRolesPatchMany,
		output: DatarobotEndpointOutputSchemas.useCasesSharedRolesPatchMany,
	},
	'useCases.useCasesVectorDatabasesList': {
		input: DatarobotEndpointInputSchemas.useCasesVectorDatabasesList,
		output: DatarobotEndpointOutputSchemas.useCasesVectorDatabasesList,
	},
	'useCases.useCasesVectorDatabasesRelatedCustomModelsList': {
		input:
			DatarobotEndpointInputSchemas.useCasesVectorDatabasesRelatedCustomModelsList,
		output:
			DatarobotEndpointOutputSchemas.useCasesVectorDatabasesRelatedCustomModelsList,
	},
	'useCases.useCasesVectorDatabasesRelatedDeploymentsList': {
		input:
			DatarobotEndpointInputSchemas.useCasesVectorDatabasesRelatedDeploymentsList,
		output:
			DatarobotEndpointOutputSchemas.useCasesVectorDatabasesRelatedDeploymentsList,
	},
	'useCases.useCasesVectorDatabasesRelatedRegisteredModelsList': {
		input:
			DatarobotEndpointInputSchemas.useCasesVectorDatabasesRelatedRegisteredModelsList,
		output:
			DatarobotEndpointOutputSchemas.useCasesVectorDatabasesRelatedRegisteredModelsList,
	},
	'useCasesWithShortenedInfo.useCasesWithShortenedInfoList': {
		input: DatarobotEndpointInputSchemas.useCasesWithShortenedInfoList,
		output: DatarobotEndpointOutputSchemas.useCasesWithShortenedInfoList,
	},
	'userBlueprints.userBlueprintsCreate': {
		input: DatarobotEndpointInputSchemas.userBlueprintsCreate,
		output: DatarobotEndpointOutputSchemas.userBlueprintsCreate,
	},
	'userBlueprints.userBlueprintsDelete': {
		input: DatarobotEndpointInputSchemas.userBlueprintsDelete,
		output: DatarobotEndpointOutputSchemas.userBlueprintsDelete,
	},
	'userBlueprints.userBlueprintsDeleteMany': {
		input: DatarobotEndpointInputSchemas.userBlueprintsDeleteMany,
		output: DatarobotEndpointOutputSchemas.userBlueprintsDeleteMany,
	},
	'userBlueprints.userBlueprintsFromBlueprintIdCreate': {
		input: DatarobotEndpointInputSchemas.userBlueprintsFromBlueprintIdCreate,
		output: DatarobotEndpointOutputSchemas.userBlueprintsFromBlueprintIdCreate,
	},
	'userBlueprints.userBlueprintsFromCustomTaskVersionIdCreate': {
		input:
			DatarobotEndpointInputSchemas.userBlueprintsFromCustomTaskVersionIdCreate,
		output:
			DatarobotEndpointOutputSchemas.userBlueprintsFromCustomTaskVersionIdCreate,
	},
	'userBlueprints.userBlueprintsFromUserBlueprintIdCreate': {
		input:
			DatarobotEndpointInputSchemas.userBlueprintsFromUserBlueprintIdCreate,
		output:
			DatarobotEndpointOutputSchemas.userBlueprintsFromUserBlueprintIdCreate,
	},
	'userBlueprints.userBlueprintsList': {
		input: DatarobotEndpointInputSchemas.userBlueprintsList,
		output: DatarobotEndpointOutputSchemas.userBlueprintsList,
	},
	'userBlueprints.userBlueprintsPatch': {
		input: DatarobotEndpointInputSchemas.userBlueprintsPatch,
		output: DatarobotEndpointOutputSchemas.userBlueprintsPatch,
	},
	'userBlueprints.userBlueprintsRetrieve': {
		input: DatarobotEndpointInputSchemas.userBlueprintsRetrieve,
		output: DatarobotEndpointOutputSchemas.userBlueprintsRetrieve,
	},
	'userBlueprints.userBlueprintsSharedRolesList': {
		input: DatarobotEndpointInputSchemas.userBlueprintsSharedRolesList,
		output: DatarobotEndpointOutputSchemas.userBlueprintsSharedRolesList,
	},
	'userBlueprints.userBlueprintsSharedRolesPatchMany': {
		input: DatarobotEndpointInputSchemas.userBlueprintsSharedRolesPatchMany,
		output: DatarobotEndpointOutputSchemas.userBlueprintsSharedRolesPatchMany,
	},
	'userNotifications.userNotificationsDelete': {
		input: DatarobotEndpointInputSchemas.userNotificationsDelete,
		output: DatarobotEndpointOutputSchemas.userNotificationsDelete,
	},
	'userNotifications.userNotificationsDeleteMany': {
		input: DatarobotEndpointInputSchemas.userNotificationsDeleteMany,
		output: DatarobotEndpointOutputSchemas.userNotificationsDeleteMany,
	},
	'userNotifications.userNotificationsList': {
		input: DatarobotEndpointInputSchemas.userNotificationsList,
		output: DatarobotEndpointOutputSchemas.userNotificationsList,
	},
	'userNotifications.userNotificationsPatch': {
		input: DatarobotEndpointInputSchemas.userNotificationsPatch,
		output: DatarobotEndpointOutputSchemas.userNotificationsPatch,
	},
	'userNotifications.userNotificationsPatchMany': {
		input: DatarobotEndpointInputSchemas.userNotificationsPatchMany,
		output: DatarobotEndpointOutputSchemas.userNotificationsPatchMany,
	},
	'users.usersCreate': {
		input: DatarobotEndpointInputSchemas.usersCreate,
		output: DatarobotEndpointOutputSchemas.usersCreate,
	},
	'users.usersInviteCreate': {
		input: DatarobotEndpointInputSchemas.usersInviteCreate,
		output: DatarobotEndpointOutputSchemas.usersInviteCreate,
	},
	'users.usersList': {
		input: DatarobotEndpointInputSchemas.usersList,
		output: DatarobotEndpointOutputSchemas.usersList,
	},
	'users.usersRateLimitUsageDelete': {
		input: DatarobotEndpointInputSchemas.usersRateLimitUsageDelete,
		output: DatarobotEndpointOutputSchemas.usersRateLimitUsageDelete,
	},
	'users.usersRateLimitUsageDeleteMany': {
		input: DatarobotEndpointInputSchemas.usersRateLimitUsageDeleteMany,
		output: DatarobotEndpointOutputSchemas.usersRateLimitUsageDeleteMany,
	},
	'users.usersRateLimitUsageList': {
		input: DatarobotEndpointInputSchemas.usersRateLimitUsageList,
		output: DatarobotEndpointOutputSchemas.usersRateLimitUsageList,
	},
	'users.usersRetrieve': {
		input: DatarobotEndpointInputSchemas.usersRetrieve,
		output: DatarobotEndpointOutputSchemas.usersRetrieve,
	},
	'valueTrackers.valueTrackersActivitiesList': {
		input: DatarobotEndpointInputSchemas.valueTrackersActivitiesList,
		output: DatarobotEndpointOutputSchemas.valueTrackersActivitiesList,
	},
	'valueTrackers.valueTrackersAttachmentsCreate': {
		input: DatarobotEndpointInputSchemas.valueTrackersAttachmentsCreate,
		output: DatarobotEndpointOutputSchemas.valueTrackersAttachmentsCreate,
	},
	'valueTrackers.valueTrackersAttachmentsDelete': {
		input: DatarobotEndpointInputSchemas.valueTrackersAttachmentsDelete,
		output: DatarobotEndpointOutputSchemas.valueTrackersAttachmentsDelete,
	},
	'valueTrackers.valueTrackersAttachmentsList': {
		input: DatarobotEndpointInputSchemas.valueTrackersAttachmentsList,
		output: DatarobotEndpointOutputSchemas.valueTrackersAttachmentsList,
	},
	'valueTrackers.valueTrackersAttachmentsRetrieve': {
		input: DatarobotEndpointInputSchemas.valueTrackersAttachmentsRetrieve,
		output: DatarobotEndpointOutputSchemas.valueTrackersAttachmentsRetrieve,
	},
	'valueTrackers.valueTrackersCreate': {
		input: DatarobotEndpointInputSchemas.valueTrackersCreate,
		output: DatarobotEndpointOutputSchemas.valueTrackersCreate,
	},
	'valueTrackers.valueTrackersDelete': {
		input: DatarobotEndpointInputSchemas.valueTrackersDelete,
		output: DatarobotEndpointOutputSchemas.valueTrackersDelete,
	},
	'valueTrackers.valueTrackersList': {
		input: DatarobotEndpointInputSchemas.valueTrackersList,
		output: DatarobotEndpointOutputSchemas.valueTrackersList,
	},
	'valueTrackers.valueTrackersPatch': {
		input: DatarobotEndpointInputSchemas.valueTrackersPatch,
		output: DatarobotEndpointOutputSchemas.valueTrackersPatch,
	},
	'valueTrackers.valueTrackersRealizedValueOverTimeList': {
		input: DatarobotEndpointInputSchemas.valueTrackersRealizedValueOverTimeList,
		output:
			DatarobotEndpointOutputSchemas.valueTrackersRealizedValueOverTimeList,
	},
	'valueTrackers.valueTrackersRetrieve': {
		input: DatarobotEndpointInputSchemas.valueTrackersRetrieve,
		output: DatarobotEndpointOutputSchemas.valueTrackersRetrieve,
	},
	'valueTrackers.valueTrackersSharedRolesList': {
		input: DatarobotEndpointInputSchemas.valueTrackersSharedRolesList,
		output: DatarobotEndpointOutputSchemas.valueTrackersSharedRolesList,
	},
	'valueTrackers.valueTrackersSharedRolesPatchMany': {
		input: DatarobotEndpointInputSchemas.valueTrackersSharedRolesPatchMany,
		output: DatarobotEndpointOutputSchemas.valueTrackersSharedRolesPatchMany,
	},
	'version.versionList': {
		input: DatarobotEndpointInputSchemas.versionList,
		output: DatarobotEndpointOutputSchemas.versionList,
	},
} satisfies RequiredPluginEndpointSchemas<typeof datarobotEndpointsNested>;

const datarobotEndpointMeta = {
	'accessRoles.accessRolesCreate': {
		riskLevel: 'write',
		description: 'Create a new custom access role.',
	},
	'accessRoles.accessRolesDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a custom access role by role ID',
	},
	'accessRoles.accessRolesList': {
		riskLevel: 'read',
		description: 'Retrieve a list of access roles.',
	},
	'accessRoles.accessRolesPatch': {
		riskLevel: 'write',
		description: 'Update a custom access role by role ID',
	},
	'accessRoles.accessRolesRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve an access role by role ID',
	},
	'accessRoles.accessRolesUsersList': {
		riskLevel: 'read',
		description:
			'Retrieve a list of the users using this access role by role ID',
	},
	'account.accountRateLimitUsageList': {
		riskLevel: 'read',
		description: 'Retrieve rate limit resource usage.',
	},
	'applicationTemplates.applicationTemplatesCloneCreate': {
		riskLevel: 'write',
		description:
			'Clone an application template into a codespace by application template ID',
	},
	'applicationTemplates.applicationTemplatesCreate': {
		riskLevel: 'write',
		description: 'Create an application template.',
	},
	'applicationTemplates.applicationTemplatesDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an application template by application template ID',
	},
	'applicationTemplates.applicationTemplatesList': {
		riskLevel: 'read',
		description: 'List the application templates the user has access to.',
	},
	'applicationTemplates.applicationTemplatesMediaCreate': {
		riskLevel: 'write',
		description:
			'Upload an application template image/gif.  by application template ID',
	},
	'applicationTemplates.applicationTemplatesMediaDeleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an application template image/gif.  by application template ID',
	},
	'applicationTemplates.applicationTemplatesMediaList': {
		riskLevel: 'read',
		description:
			'Retrieve an application template image by application template ID',
	},
	'applicationTemplates.applicationTemplatesPatch': {
		riskLevel: 'write',
		description: 'Update an application template by application template ID',
	},
	'applicationTemplates.applicationTemplatesRepositoryUrlsList': {
		riskLevel: 'read',
		description: 'Get the resolved clone URL by application template ID',
	},
	'applications.applicationUserRoleRetrieve': {
		riskLevel: 'read',
		description: 'Get application user role by application ID',
	},
	'applications.applicationsAccessControlList': {
		riskLevel: 'read',
		description: 'A list of users with access by application ID',
	},
	'applications.applicationsAccessControlPatchMany': {
		riskLevel: 'write',
		description: 'Update access control by application ID',
	},
	'applications.applicationsCreate': {
		riskLevel: 'write',
		description: 'Create an application',
	},
	'applications.applicationsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an application by application ID',
	},
	'applications.applicationsDeploymentsCreate': {
		riskLevel: 'write',
		description: 'Links a deployment by application ID',
	},
	'applications.applicationsDeploymentsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete link between application by application ID',
	},
	'applications.applicationsDuplicateCreate': {
		riskLevel: 'write',
		description: 'Create a duplicate of the application by application ID',
	},
	'applications.applicationsList': {
		riskLevel: 'read',
		description:
			'Paginated list of applications created by the currently authenticated user.',
	},
	'applications.applicationsPatch': {
		riskLevel: 'write',
		description: "Update an application's name and/ by application ID",
	},
	'applications.applicationsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve an application by application ID',
	},
	'applications.applicationsSharedRolesList': {
		riskLevel: 'read',
		description:
			'Get a list of users, groups and organizations that have an access by application ID',
	},
	'applications.applicationsSharedRolesPatchMany': {
		riskLevel: 'write',
		description: 'Share an application by application ID',
	},
	'applications.applicationsVerifyCreate': {
		riskLevel: 'write',
		description: 'Verify ability',
	},
	'approvalPolicies.approvalPoliciesCreate': {
		riskLevel: 'write',
		description: 'Create a new Approval Policy.',
	},
	'approvalPolicies.approvalPoliciesDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an Approval Policy by approval policy ID',
	},
	'approvalPolicies.approvalPoliciesList': {
		riskLevel: 'read',
		description: 'List Approval Policies.',
	},
	'approvalPolicies.approvalPoliciesPut': {
		riskLevel: 'write',
		description: 'Update an Approval Policy by approval policy ID',
	},
	'approvalPolicies.approvalPoliciesRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve an Approval Policy by approval policy ID',
	},
	'approvalPolicies.approvalPoliciesShareableChangeRequestsList': {
		riskLevel: 'read',
		description:
			'Retrieve associated Change Requests Info by approval policy ID',
	},
	'automatedDocuments.automatedDocumentsCreate': {
		riskLevel: 'write',
		description: 'Request generation of automated document',
	},
	'automatedDocuments.automatedDocumentsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete automated document by document ID',
	},
	'automatedDocuments.automatedDocumentsList': {
		riskLevel: 'read',
		description: 'List all generated documents.',
	},
	'automatedDocuments.automatedDocumentsRetrieve': {
		riskLevel: 'read',
		description: 'Download generated document by document ID',
	},
	'batchJobs.batchJobsCsvUploadPutMany': {
		riskLevel: 'write',
		description: 'Stream CSV data by batch job ID',
	},
	'batchJobs.batchJobsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Cancel a Batch job by batch job ID',
	},
	'batchJobs.batchJobsDownloadList': {
		riskLevel: 'read',
		description: 'Download the scored data set of a batch job by batch job ID',
	},
	'batchJobs.batchJobsFromJobDefinitionCreate': {
		riskLevel: 'write',
		description: 'Launch a Batch job',
	},
	'batchJobs.batchJobsList': {
		riskLevel: 'read',
		description: 'List batch jobs',
	},
	'batchJobs.batchJobsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve Batch job by batch job ID',
	},
	'batchMonitoring.batchMonitoringCreate': {
		riskLevel: 'write',
		description: 'Creates a new Batch Monitoring job',
	},
	'batchPredictions.batchPredictionsCreate': {
		riskLevel: 'write',
		description: 'Creates a new Batch Prediction job',
	},
	'batchPredictions.batchPredictionsCsvUploadFinalizeMultipartCreate': {
		riskLevel: 'write',
		description: 'Finalize a multipart upload by prediction job ID',
	},
	'batchPredictions.batchPredictionsCsvUploadPartPut': {
		riskLevel: 'write',
		description: 'Upload CSV data by prediction job ID',
	},
	'batchPredictions.batchPredictionsCsvUploadPutMany': {
		riskLevel: 'write',
		description:
			'Creates a new_model_id Batch Prediction job by prediction job ID',
	},
	'batchPredictions.batchPredictionsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Cancel a Batch Prediction job by prediction job ID',
	},
	'batchPredictions.batchPredictionsDownloadList': {
		riskLevel: 'read',
		description:
			'Download the scored data set of a batch prediction job by prediction job ID',
	},
	'batchPredictions.batchPredictionsFromExistingCreate': {
		riskLevel: 'write',
		description: 'Create a new a Batch Prediction job based',
	},
	'batchPredictions.batchPredictionsFromJobDefinitionCreate': {
		riskLevel: 'write',
		description: 'Launch a Batch Prediction job',
	},
	'batchPredictions.batchPredictionsList': {
		riskLevel: 'read',
		description: 'List batch prediction jobs',
	},
	'batchPredictions.batchPredictionsPatch': {
		riskLevel: 'write',
		description: 'Update a Batch Prediction job by prediction job ID',
	},
	'batchPredictions.batchPredictionsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve Batch Prediction job by prediction job ID',
	},
	'calendars.calendarsAccessControlList': {
		riskLevel: 'read',
		description: 'Get a list of users who have access by calendar ID',
	},
	'calendars.calendarsAccessControlPatchMany': {
		riskLevel: 'write',
		description: 'Update the access control by calendar ID',
	},
	'calendars.calendarsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a calendar by calendar ID',
	},
	'calendars.calendarsFileUploadCreate': {
		riskLevel: 'write',
		description: 'Create a calendar',
	},
	'calendars.calendarsFromCountryCodeCreate': {
		riskLevel: 'write',
		description: 'Initialize generation of preloaded calendars.',
	},
	'calendars.calendarsFromDatasetCreate': {
		riskLevel: 'write',
		description: 'Create a calendar from a dataset',
	},
	'calendars.calendarsList': {
		riskLevel: 'read',
		description: 'List all available calendars',
	},
	'calendars.calendarsPatch': {
		riskLevel: 'write',
		description: "Update a calendar's name by calendar ID",
	},
	'calendars.calendarsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve information about a calendar by calendar ID',
	},
	'catalogItems.catalogItemsList': {
		riskLevel: 'read',
		description: 'List all catalog items accessible by the user.',
	},
	'catalogItems.catalogItemsPatch': {
		riskLevel: 'write',
		description: 'Update the name, description, or tags by catalog ID',
	},
	'catalogItems.catalogItemsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieves latest version information, by ID by catalog ID',
	},
	'changeRequests.changeRequestsCreate': {
		riskLevel: 'write',
		description: 'Create Change Request.',
	},
	'changeRequests.changeRequestsList': {
		riskLevel: 'read',
		description: 'List Change Requests.',
	},
	'changeRequests.changeRequestsPatch': {
		riskLevel: 'write',
		description: 'Update Change Request by change request ID',
	},
	'changeRequests.changeRequestsRequestReviewCreate': {
		riskLevel: 'write',
		description: 'Request Change Request Review by change request ID',
	},
	'changeRequests.changeRequestsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve Change Request by change request ID',
	},
	'changeRequests.changeRequestsReviewsCreate': {
		riskLevel: 'write',
		description: 'Create review by change request ID',
	},
	'changeRequests.changeRequestsReviewsList': {
		riskLevel: 'read',
		description: 'List Change Request reviews by change request ID',
	},
	'changeRequests.changeRequestsReviewsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve review by change request ID',
	},
	'changeRequests.changeRequestsStatusPatchMany': {
		riskLevel: 'write',
		description: 'Resolve by change request ID',
	},
	'changeRequests.changeRequestsSuggestedReviewersList': {
		riskLevel: 'read',
		description: 'List suggested reviewers by change request ID',
	},
	'codeSnippets.codeSnippetsCreate': {
		riskLevel: 'write',
		description: 'Retrieve a code snippet.',
	},
	'codeSnippets.codeSnippetsDownloadCreate': {
		riskLevel: 'write',
		description: 'Create download (no_code_applications)',
	},
	'codeSnippets.codeSnippetsList': {
		riskLevel: 'read',
		description: 'Retrieve available code snippets.',
	},
	'comments.commentsCreate': {
		riskLevel: 'write',
		description: 'Post a comment',
	},
	'comments.commentsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a comment by comment ID',
	},
	'comments.commentsList': {
		riskLevel: 'read',
		description: 'List comments by entitytype',
	},
	'comments.commentsPatch': {
		riskLevel: 'write',
		description: 'Update a comment by comment ID',
	},
	'comments.commentsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a comment by comment ID',
	},
	'complianceDocTemplates.complianceDocTemplatesCreate': {
		riskLevel: 'write',
		description: 'Create a new compliance documentation template',
	},
	'complianceDocTemplates.complianceDocTemplatesDefaultList': {
		riskLevel: 'read',
		description: 'Retrieve the default documentation template',
	},
	'complianceDocTemplates.complianceDocTemplatesDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a compliance documentation template by template ID',
	},
	'complianceDocTemplates.complianceDocTemplatesList': {
		riskLevel: 'read',
		description: 'List compliance documentation templates',
	},
	'complianceDocTemplates.complianceDocTemplatesPatch': {
		riskLevel: 'write',
		description:
			'Update an existing model compliance documentation template by template ID',
	},
	'complianceDocTemplates.complianceDocTemplatesRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a documentation template by template ID',
	},
	'complianceDocTemplates.complianceDocTemplatesSharedRolesList': {
		riskLevel: 'read',
		description: "Get the template's access control list by template ID",
	},
	'complianceDocTemplates.complianceDocTemplatesSharedRolesPatchMany': {
		riskLevel: 'write',
		description: "Update the template's access controls by template ID",
	},
	'credentials.credentialsAssociationsListForCredential': {
		riskLevel: 'read',
		description: 'List all objects associated by credential ID',
	},
	'credentials.credentialsAssociationsListForObject': {
		riskLevel: 'read',
		description: 'List credentials associated by association ID',
	},
	'credentials.credentialsAssociationsPatchMany': {
		riskLevel: 'write',
		description: 'Add objects associated by credential ID',
	},
	'credentials.credentialsAssociationsPut': {
		riskLevel: 'write',
		description: 'Set default credentials by credential ID',
	},
	'credentials.credentialsCreate': {
		riskLevel: 'write',
		description: 'Store a new set of credentials which can be used',
	},
	'credentials.credentialsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete the credentials set by credential ID',
	},
	'credentials.credentialsList': {
		riskLevel: 'read',
		description: 'List credentials.',
	},
	'credentials.credentialsPatch': {
		riskLevel: 'write',
		description: 'Update specified credentials by credential ID',
	},
	'credentials.credentialsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve the credentials set by credential ID',
	},
	'customApplicationSources.customApplicationSourcesCreate': {
		riskLevel: 'write',
		description: 'Create a custom application source.',
	},
	'customApplicationSources.customApplicationSourcesDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a custom application source by app source ID',
	},
	'customApplicationSources.customApplicationSourcesFromCustomTemplateCreate': {
		riskLevel: 'write',
		description: 'Create a custom application source',
	},
	'customApplicationSources.customApplicationSourcesList': {
		riskLevel: 'read',
		description: 'The list of custom application sources created',
	},
	'customApplicationSources.customApplicationSourcesPatch': {
		riskLevel: 'write',
		description: "Update a custom application source's name by app source ID",
	},
	'customApplicationSources.customApplicationSourcesRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a custom application source by app source ID',
	},
	'customApplicationSources.customApplicationSourcesSharedRolesList': {
		riskLevel: 'read',
		description:
			'Get a list of users, groups, and organizations with access by app source ID',
	},
	'customApplicationSources.customApplicationSourcesSharedRolesPatchMany': {
		riskLevel: 'write',
		description: 'Share an application source by app source ID',
	},
	'customApplicationSources.customApplicationSourcesVersionsArchiveList': {
		riskLevel: 'read',
		description:
			'Download Custom Application Source version files as a zip archive by app source ID',
	},
	'customApplicationSources.customApplicationSourcesVersionsCreate': {
		riskLevel: 'write',
		description: 'Create a custom application source version by app source ID',
	},
	'customApplicationSources.customApplicationSourcesVersionsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a custom application source version if it is still mutable by app source ID',
	},
	'customApplicationSources.customApplicationSourcesVersionsFromCodespaceCreate':
		{
			riskLevel: 'write',
			description:
				'Update the custom application source version by app source ID',
		},
	'customApplicationSources.customApplicationSourcesVersionsItemsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a file by app source ID',
	},
	'customApplicationSources.customApplicationSourcesVersionsList': {
		riskLevel: 'read',
		description:
			'Paginated list of custom application source versions of the specified by app source ID',
	},
	'customApplicationSources.customApplicationSourcesVersionsPatch': {
		riskLevel: 'write',
		description: 'Update a custom application source version by app source ID',
	},
	'customApplicationSources.customApplicationSourcesVersionsRetrieve': {
		riskLevel: 'read',
		description:
			'Retrieve a custom application source version by app source ID',
	},
	'customApplicationSources.customApplicationSourcesVersionsToCodespaceCreate':
		{
			riskLevel: 'write',
			description: 'Update a codespace by app source ID',
		},
	'customApplications.customApplicationsCreate': {
		riskLevel: 'write',
		description: 'Create a custom application',
	},
	'customApplications.customApplicationsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an application by application ID',
	},
	'customApplications.customApplicationsHistoryList': {
		riskLevel: 'read',
		description:
			"Retrieve an application's publication history by application ID",
	},
	'customApplications.customApplicationsList': {
		riskLevel: 'read',
		description:
			'The list of applications created by the currently authenticated user.',
	},
	'customApplications.customApplicationsLogsList': {
		riskLevel: 'read',
		description: "Retrieve an application's logs by application ID",
	},
	'customApplications.customApplicationsMigrateToWorkloadCreate': {
		riskLevel: 'write',
		description: 'Create Migrate To Workload by application ID',
	},
	'customApplications.customApplicationsPatch': {
		riskLevel: 'write',
		description: "Update an application's name by application ID",
	},
	'customApplications.customApplicationsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve an application by application ID',
	},
	'customApplications.customApplicationsSharedRolesList': {
		riskLevel: 'read',
		description:
			'Get a list of users, groups and organizations that have an access by application ID',
	},
	'customApplications.customApplicationsSharedRolesPatchMany': {
		riskLevel: 'write',
		description: 'Share an application by application ID',
	},
	'customApplications.customApplicationsUsagesDownloadList': {
		riskLevel: 'read',
		description: "Download an application's access logs by application ID",
	},
	'customApplications.customApplicationsUsagesList': {
		riskLevel: 'read',
		description: "Retrieve an application's usages by application ID",
	},
	'customJobs.customJobsCreate': {
		riskLevel: 'write',
		description: 'Create a custom job.',
	},
	'customJobs.customJobsCustomMetricsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a custom metric associated by custom job ID',
	},
	'customJobs.customJobsCustomMetricsList': {
		riskLevel: 'read',
		description: 'List all of the custom metrics associated by custom job ID',
	},
	'customJobs.customJobsCustomMetricsPatch': {
		riskLevel: 'write',
		description: 'Update custom metric associated by custom job ID',
	},
	'customJobs.customJobsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete custom job by custom job ID',
	},
	'customJobs.customJobsFromGalleryTemplateCreate': {
		riskLevel: 'write',
		description: 'Create a custom jobs from a gallery template',
	},
	'customJobs.customJobsFromHostedCustomMetricGalleryTemplateCreate': {
		riskLevel: 'write',
		description: 'Creates a custom job',
	},
	'customJobs.customJobsHostedCustomMetricTemplateCreate': {
		riskLevel: 'write',
		description: 'Creates a template by custom job ID',
	},
	'customJobs.customJobsHostedCustomMetricTemplateList': {
		riskLevel: 'read',
		description: 'Retrieve a template by custom job ID',
	},
	'customJobs.customJobsHostedCustomMetricTemplatePatchMany': {
		riskLevel: 'write',
		description: 'Updates a template by custom job ID',
	},
	'customJobs.customJobsItemsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve custom job file content by custom job ID',
	},
	'customJobs.customJobsList': {
		riskLevel: 'read',
		description: 'List custom jobs.',
	},
	'customJobs.customJobsPatch': {
		riskLevel: 'write',
		description: 'Update custom job by custom job ID',
	},
	'customJobs.customJobsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve custom job by custom job ID',
	},
	'customJobs.customJobsRunsCreate': {
		riskLevel: 'write',
		description: 'Create a custom job run by custom job ID',
	},
	'customJobs.customJobsRunsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Cancel custom job run by custom job ID',
	},
	'customJobs.customJobsRunsItemsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve custom job run file content by custom job ID',
	},
	'customJobs.customJobsRunsList': {
		riskLevel: 'read',
		description: 'List custom job runs by custom job ID',
	},
	'customJobs.customJobsRunsLogsDeleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'De,ete custom job run logs by custom job ID',
	},
	'customJobs.customJobsRunsLogsList': {
		riskLevel: 'read',
		description: 'Retrieve custom job run logs by custom job ID',
	},
	'customJobs.customJobsRunsPatch': {
		riskLevel: 'write',
		description: 'Update custom job run by custom job ID',
	},
	'customJobs.customJobsRunsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve custom job run by custom job ID',
	},
	'customJobs.customJobsSharedRolesList': {
		riskLevel: 'read',
		description: "Get Custom Job's access control list by custom job ID",
	},
	'customJobs.customJobsSharedRolesPatchMany': {
		riskLevel: 'write',
		description: "Update Custom Job's controls by custom job ID",
	},
	'customModels.customModelsAccessControlList': {
		riskLevel: 'read',
		description: 'Get a list of users who have access by custom model ID',
	},
	'customModels.customModelsAccessControlPatchMany': {
		riskLevel: 'write',
		description: 'Grant access or update roles by custom model ID',
	},
	'customModels.customModelsCreate': {
		riskLevel: 'write',
		description: 'Create custom model.',
	},
	'customModels.customModelsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete custom model by custom model ID',
	},
	'customModels.customModelsDownloadList': {
		riskLevel: 'read',
		description:
			'Download the latest custom model version content by custom model ID',
	},
	'customModels.customModelsFromCustomModelCreate': {
		riskLevel: 'write',
		description: 'Clone custom model.',
	},
	'customModels.customModelsFromModelTemplateCreate': {
		riskLevel: 'write',
		description: 'Create a custom model',
	},
	'customModels.customModelsList': {
		riskLevel: 'read',
		description: 'List custom models.',
	},
	'customModels.customModelsPatch': {
		riskLevel: 'write',
		description: 'Update custom model by custom model ID',
	},
	'customModels.customModelsPredictionExplanationsInitializationCreate': {
		riskLevel: 'write',
		description: 'Create a new prediction explanations initialization',
	},
	'customModels.customModelsRetrieve': {
		riskLevel: 'read',
		description: 'Get custom model by custom model ID',
	},
	'customModels.customModelsTrainingDataPatchMany': {
		riskLevel: 'write',
		description: 'Assign training data by custom model ID',
	},
	'customModels.customModelsVersionCreateFromLatest': {
		riskLevel: 'write',
		description: 'Update custom model version files by custom model ID',
	},
	'customModels.customModelsVersionsConversionsCreate': {
		riskLevel: 'write',
		description: 'Generates JAR file by custom model ID',
	},
	'customModels.customModelsVersionsConversionsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Stop a given custom model conversion by custom model ID',
	},
	'customModels.customModelsVersionsConversionsList': {
		riskLevel: 'read',
		description: 'Get a list by custom model ID',
	},
	'customModels.customModelsVersionsConversionsRetrieve': {
		riskLevel: 'read',
		description: 'Get a given custom model conversion by custom model ID',
	},
	'customModels.customModelsVersionsCreate': {
		riskLevel: 'write',
		description: 'Create custom model version by custom model ID',
	},
	'customModels.customModelsVersionsDependencyBuildCreate': {
		riskLevel: 'write',
		description:
			"Start a custom model version's dependency build by custom model ID",
	},
	'customModels.customModelsVersionsDependencyBuildDeleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Cancel dependency build by custom model ID',
	},
	'customModels.customModelsVersionsDependencyBuildList': {
		riskLevel: 'read',
		description:
			"Retrieve the custom model version's dependency build status by custom model ID",
	},
	'customModels.customModelsVersionsDependencyBuildLogList': {
		riskLevel: 'read',
		description:
			"Retrieve the custom model version's dependency build log by custom model ID",
	},
	'customModels.customModelsVersionsDownloadList': {
		riskLevel: 'read',
		description: 'Download custom model version content by custom model ID',
	},
	'customModels.customModelsVersionsFeatureImpactCreate': {
		riskLevel: 'write',
		description: 'Create custom model feature impact by custom model ID',
	},
	'customModels.customModelsVersionsFeatureImpactList': {
		riskLevel: 'read',
		description: 'Get custom model feature impact by custom model ID',
	},
	'customModels.customModelsVersionsFromCodespaceCreate': {
		riskLevel: 'write',
		description: 'Create a new custom model version by custom model ID',
	},
	'customModels.customModelsVersionsFromRepositoryCreate': {
		riskLevel: 'write',
		description: 'Create a version from a repository',
	},
	'customModels.customModelsVersionsFromRepositoryPatchMany': {
		riskLevel: 'write',
		description:
			'Create custom model version from remote repository by custom model ID',
	},
	'customModels.customModelsVersionsList': {
		riskLevel: 'read',
		description: 'List custom model versions by custom model ID',
	},
	'customModels.customModelsVersionsPatch': {
		riskLevel: 'write',
		description: 'Update custom model version by custom model ID',
	},
	'customModels.customModelsVersionsPredictionExplanationsInitializationCreate':
		{
			riskLevel: 'write',
			description:
				'Create a new prediction explanations initialization by custom model ID',
		},
	'customModels.customModelsVersionsRetrieve': {
		riskLevel: 'read',
		description: 'Get custom model version by custom model ID',
	},
	'customModels.customModelsVersionsToCodespaceCreate': {
		riskLevel: 'write',
		description: 'Update a codespace by custom model ID',
	},
	'customModels.customModelsVersionsWithTrainingDataPatchMany': {
		riskLevel: 'write',
		description: 'Add or replace training and holdout data by custom model ID',
	},
	'customTasks.customTaskVersionCreateFromLatest': {
		riskLevel: 'write',
		description: 'Update custom task version files by custom task ID',
	},
	'customTasks.customTasksAccessControlList': {
		riskLevel: 'read',
		description: 'Get a list of users who have access by custom task ID',
	},
	'customTasks.customTasksAccessControlPatchMany': {
		riskLevel: 'write',
		description: 'Grant access or update roles by custom task ID',
	},
	'customTasks.customTasksCreate': {
		riskLevel: 'write',
		description: 'Create a custom task',
	},
	'customTasks.customTasksDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete custom task by custom task ID',
	},
	'customTasks.customTasksDownloadList': {
		riskLevel: 'read',
		description:
			'Download the latest custom task version content by custom task ID',
	},
	'customTasks.customTasksFromCustomTaskCreate': {
		riskLevel: 'write',
		description: 'Clone custom task.',
	},
	'customTasks.customTasksList': {
		riskLevel: 'read',
		description: 'List custom tasks.',
	},
	'customTasks.customTasksPatch': {
		riskLevel: 'write',
		description: 'Update custom task by custom task ID',
	},
	'customTasks.customTasksRetrieve': {
		riskLevel: 'read',
		description: 'Get custom task by custom task ID',
	},
	'customTasks.customTasksVersionsCreate': {
		riskLevel: 'write',
		description: 'Create custom task version by custom task ID',
	},
	'customTasks.customTasksVersionsDependencyBuildCreate': {
		riskLevel: 'write',
		description:
			"Start a custom task version's dependency build by custom task ID",
	},
	'customTasks.customTasksVersionsDependencyBuildDeleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Cancel dependency build by custom task ID',
	},
	'customTasks.customTasksVersionsDependencyBuildList': {
		riskLevel: 'read',
		description:
			"Retrieve the custom task version's dependency build status by custom task ID",
	},
	'customTasks.customTasksVersionsDependencyBuildLogList': {
		riskLevel: 'read',
		description:
			"Retrieve the custom task version's dependency build log by custom task ID",
	},
	'customTasks.customTasksVersionsDownloadList': {
		riskLevel: 'read',
		description: 'Download custom task version content by custom task ID',
	},
	'customTasks.customTasksVersionsFromRepositoryCreate': {
		riskLevel: 'write',
		description: 'Create a version from a repository',
	},
	'customTasks.customTasksVersionsFromRepositoryPatchMany': {
		riskLevel: 'write',
		description:
			'Create custom task version from remote repository by custom task ID',
	},
	'customTasks.customTasksVersionsList': {
		riskLevel: 'read',
		description: 'List custom task versions by custom task ID',
	},
	'customTasks.customTasksVersionsPatch': {
		riskLevel: 'write',
		description: 'Update custom task version by custom task ID',
	},
	'customTasks.customTasksVersionsRetrieve': {
		riskLevel: 'read',
		description: 'Get custom task version by custom task ID',
	},
	'dataEngineWorkspaceStates.dataEngineWorkspaceStatesCreate': {
		riskLevel: 'write',
		description: 'Create Data Engine workspace state.',
	},
	'dataEngineWorkspaceStates.dataEngineWorkspaceStatesFromDataEngineQueryGeneratorCreate':
		{
			riskLevel: 'write',
			description: 'Create Data Engine workspace state',
		},
	'dataEngineWorkspaceStates.dataEngineWorkspaceStatesRetrieve': {
		riskLevel: 'read',
		description: 'Read Data Engine workspace state by workspace state ID',
	},
	'dataSlices.dataSlicesCreate': {
		riskLevel: 'write',
		description: 'Request',
	},
	'dataSlices.dataSlicesDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a data slice by data slice ID',
	},
	'dataSlices.dataSlicesDeleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Data slices bulk deletion.',
	},
	'dataSlices.dataSlicesRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a Data Slice by data slice ID',
	},
	'dataSlices.dataSlicesSliceSizesCreate': {
		riskLevel: 'write',
		description:
			'Compute the number of rows available after applying a data slice by data slice ID',
	},
	'dataSlices.dataSlicesSliceSizesList': {
		riskLevel: 'read',
		description:
			'Returns the number of rows available after applying a data slice by data slice ID',
	},
	'dataStages.dataStagesCreate': {
		riskLevel: 'write',
		description: 'Create a data stage',
	},
	'dataStages.dataStagesFinalizeCreate': {
		riskLevel: 'write',
		description: 'Finalize a data stage by data stage ID',
	},
	'dataStages.dataStagesPartsPut': {
		riskLevel: 'write',
		description: 'Upload a part by data stage ID',
	},
	'datasetDefinitions.datasetDefinitionsAnalyzeCreate': {
		riskLevel: 'write',
		description: 'Analyze a dataset definition by dataset definition ID',
	},
	'datasetDefinitions.datasetDefinitionsChunkDefinitionsAnalyzeCreate': {
		riskLevel: 'write',
		description: 'Analyze a chunk definition by dataset definition ID',
	},
	'datasetDefinitions.datasetDefinitionsChunkDefinitionsCreate': {
		riskLevel: 'write',
		description: 'Create a chunk definition based by dataset definition ID',
	},
	'datasetDefinitions.datasetDefinitionsChunkDefinitionsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Soft delete a chunk definition based by dataset definition ID',
	},
	'datasetDefinitions.datasetDefinitionsChunkDefinitionsList': {
		riskLevel: 'read',
		description: 'Retrieve a list chunk definitions by dataset definition ID',
	},
	'datasetDefinitions.datasetDefinitionsChunkDefinitionsPatch': {
		riskLevel: 'write',
		description: 'Update a chunk definition based by dataset definition ID',
	},
	'datasetDefinitions.datasetDefinitionsChunkDefinitionsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a chunk definition based by dataset definition ID',
	},
	'datasetDefinitions.datasetDefinitionsCreate': {
		riskLevel: 'write',
		description: 'Create a dataset definition.',
	},
	'datasetDefinitions.datasetDefinitionsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Soft delete a dataset definition based by dataset definition ID',
	},
	'datasetDefinitions.datasetDefinitionsList': {
		riskLevel: 'read',
		description: 'List all dataset definitions',
	},
	'datasetDefinitions.datasetDefinitionsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a dataset definition based by dataset definition ID',
	},
	'datasetDefinitions.datasetDefinitionsVersionsList': {
		riskLevel: 'read',
		description:
			'List all dataset definition versions by dataset definition ID',
	},
	'datasets.datasetsAccessControlList': {
		riskLevel: 'read',
		description: 'List dataset access by dataset ID',
	},
	'datasets.datasetsAccessControlPatchMany': {
		riskLevel: 'write',
		description: 'Modify dataset access by dataset ID',
	},
	'datasets.datasetsAllFeaturesDetailsList': {
		riskLevel: 'read',
		description: 'Get dataset features by dataset ID',
	},
	'datasets.datasetsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete dataset by dataset ID',
	},
	'datasets.datasetsDeletedPatchMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Recover deleted dataset by dataset ID',
	},
	'datasets.datasetsDocumentsDataQualityLogFileList': {
		riskLevel: 'read',
		description:
			'Retrieve a text file containing the documents data quality log by dataset ID',
	},
	'datasets.datasetsDocumentsDataQualityLogList': {
		riskLevel: 'read',
		description:
			'Retrieve the documents data quality log content by dataset ID',
	},
	'datasets.datasetsFeatureHistogramsRetrieve': {
		riskLevel: 'read',
		description: 'Get dataset feature histogram by dataset ID',
	},
	'datasets.datasetsFeatureTransformsCreate': {
		riskLevel: 'write',
		description: 'Create dataset feature transform by dataset ID',
	},
	'datasets.datasetsFeatureTransformsList': {
		riskLevel: 'read',
		description: 'List dataset feature transforms by dataset ID',
	},
	'datasets.datasetsFeatureTransformsRetrieve': {
		riskLevel: 'read',
		description: 'Get dataset feature transform by dataset ID',
	},
	'datasets.datasetsFeaturelistsCreate': {
		riskLevel: 'write',
		description: 'Create dataset featurelist by dataset ID',
	},
	'datasets.datasetsFeaturelistsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete dataset featurelist by dataset ID',
	},
	'datasets.datasetsFeaturelistsList': {
		riskLevel: 'read',
		description: 'Retrieve dataset featurelists by dataset ID',
	},
	'datasets.datasetsFeaturelistsPatch': {
		riskLevel: 'write',
		description: 'Update dataset featurelist by dataset ID',
	},
	'datasets.datasetsFeaturelistsRetrieve': {
		riskLevel: 'read',
		description: 'Get dataset featurelist by dataset ID',
	},
	'datasets.datasetsFileList': {
		riskLevel: 'read',
		description: 'Retrieve original dataset data by dataset ID',
	},
	'datasets.datasetsFromDataEngineWorkspaceStateCreate': {
		riskLevel: 'write',
		description: 'Create dataset',
	},
	'datasets.datasetsFromDataSourceCreate': {
		riskLevel: 'write',
		description: 'Create a dataset from a data source',
	},
	'datasets.datasetsFromFileCreate': {
		riskLevel: 'write',
		description: 'Create a dataset from a file',
	},
	'datasets.datasetsFromHDFSCreate': {
		riskLevel: 'write',
		description: 'Create a dataset from a hdfs',
	},
	'datasets.datasetsFromRecipeCreate': {
		riskLevel: 'write',
		description: 'Create a dataset from a recipe',
	},
	'datasets.datasetsFromStageCreate': {
		riskLevel: 'write',
		description: 'Create a dataset from a stage',
	},
	'datasets.datasetsFromURLCreate': {
		riskLevel: 'write',
		description: 'Create a dataset from an URL',
	},
	'datasets.datasetsImagesDataQualityLogFileList': {
		riskLevel: 'read',
		description:
			'Retrieve a text file containing the images data quality log by dataset ID',
	},
	'datasets.datasetsImagesDataQualityLogList': {
		riskLevel: 'read',
		description: 'Retrieve the images data quality log content by dataset ID',
	},
	'datasets.datasetsList': {
		riskLevel: 'read',
		description: 'List datasets',
	},
	'datasets.datasetsPatch': {
		riskLevel: 'write',
		description: 'Modify dataset by dataset ID',
	},
	'datasets.datasetsPatchMany': {
		riskLevel: 'write',
		description: 'Execute bulk dataset action',
	},
	'datasets.datasetsPermissionsList': {
		riskLevel: 'read',
		description: 'Describe dataset permissions by dataset ID',
	},
	'datasets.datasetsProjectsList': {
		riskLevel: 'read',
		description: 'Get dataset projects by dataset ID',
	},
	'datasets.datasetsRefreshJobsCreate': {
		riskLevel: 'write',
		description: 'Schedule dataset refresh by dataset ID',
	},
	'datasets.datasetsRefreshJobsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes an existing dataset refresh job by dataset ID',
	},
	'datasets.datasetsRefreshJobsExecutionResultsList': {
		riskLevel: 'read',
		description: 'Results of dataset refresh job by dataset ID',
	},
	'datasets.datasetsRefreshJobsList': {
		riskLevel: 'read',
		description: 'Information about scheduled jobs by dataset ID',
	},
	'datasets.datasetsRefreshJobsPatch': {
		riskLevel: 'write',
		description: 'Update a dataset refresh job by dataset ID',
	},
	'datasets.datasetsRefreshJobsRetrieve': {
		riskLevel: 'read',
		description:
			'Gets configuration of a user scheduled dataset refresh job by job ID',
	},
	'datasets.datasetsRelationshipsCreate': {
		riskLevel: 'write',
		description: 'Create dataset relationship by dataset ID',
	},
	'datasets.datasetsRelationshipsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete dataset relationship by dataset ID',
	},
	'datasets.datasetsRelationshipsList': {
		riskLevel: 'read',
		description: 'List related datasets  by dataset ID',
	},
	'datasets.datasetsRelationshipsPatch': {
		riskLevel: 'write',
		description: 'Update dataset relationship by dataset ID',
	},
	'datasets.datasetsRetrieve': {
		riskLevel: 'read',
		description: 'Get dataset details by dataset ID',
	},
	'datasets.datasetsSharedRolesList': {
		riskLevel: 'read',
		description: 'List dataset shared roles by dataset ID',
	},
	'datasets.datasetsSharedRolesPatchMany': {
		riskLevel: 'write',
		description: 'Modify dataset shared roles by dataset ID',
	},
	'datasets.datasetsVersionsAllFeaturesDetailsList': {
		riskLevel: 'read',
		description: 'Retrieve all features details by ID',
	},
	'datasets.datasetsVersionsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete dataset version by dataset ID',
	},
	'datasets.datasetsVersionsDeletedPatchMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Recover deleted dataset version by dataset ID',
	},
	'datasets.datasetsVersionsDocumentsDataQualityLogFileList': {
		riskLevel: 'read',
		description: 'Retrieve file by ID',
	},
	'datasets.datasetsVersionsDocumentsDataQualityLogList': {
		riskLevel: 'read',
		description: 'Retrieve documents data quality log by ID',
	},
	'datasets.datasetsVersionsFeatureHistogramsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve feature histograms by ID',
	},
	'datasets.datasetsVersionsFeaturelistsList': {
		riskLevel: 'read',
		description: 'Retrieve featurelists by ID',
	},
	'datasets.datasetsVersionsFeaturelistsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve featurelists by ID',
	},
	'datasets.datasetsVersionsFileList': {
		riskLevel: 'read',
		description: 'Retrieve file by ID',
	},
	'datasets.datasetsVersionsFromDataEngineWorkspaceStateCreate': {
		riskLevel: 'write',
		description: 'Create dataset version by dataset ID',
	},
	'datasets.datasetsVersionsFromDataSourceCreate': {
		riskLevel: 'write',
		description: 'Create a version from a data source',
	},
	'datasets.datasetsVersionsFromFileCreate': {
		riskLevel: 'write',
		description: 'Create a version from a file',
	},
	'datasets.datasetsVersionsFromHDFSCreate': {
		riskLevel: 'write',
		description: 'Create a version from a hdfs',
	},
	'datasets.datasetsVersionsFromLatestVersionCreate': {
		riskLevel: 'write',
		description: 'Create a version from a latest version',
	},
	'datasets.datasetsVersionsFromRecipeCreate': {
		riskLevel: 'write',
		description: 'Create a version from a recipe',
	},
	'datasets.datasetsVersionsFromStageCreate': {
		riskLevel: 'write',
		description: 'Create a version from a stage',
	},
	'datasets.datasetsVersionsFromURLCreate': {
		riskLevel: 'write',
		description: 'Create a version from an URL',
	},
	'datasets.datasetsVersionsFromVersionCreate': {
		riskLevel: 'write',
		description: 'Create a version from a version',
	},
	'datasets.datasetsVersionsList': {
		riskLevel: 'read',
		description: 'List dataset versions by dataset ID',
	},
	'datasets.datasetsVersionsProjectsList': {
		riskLevel: 'read',
		description: 'Get dataset projects by version by dataset ID',
	},
	'datasets.datasetsVersionsRetrieve': {
		riskLevel: 'read',
		description: 'Get dataset details by version by dataset ID',
	},
	'deletedCustomJobs.deletedCustomJobsList': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'List deleted custom jobs.',
	},
	'deletedDeployments.deletedDeploymentsList': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'List deleted deployments',
	},
	'deletedDeployments.deletedDeploymentsPatchMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Erase deleted deployments',
	},
	'deletedProjects.deletedProjectsList': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Retrieve the list of soft-deleted projects.',
	},
	'deletedProjects.deletedProjectsPatch': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Recover soft-deleted project by project ID',
	},
	'deployments.deploymentsAccuracyList': {
		riskLevel: 'read',
		description: 'Retrieve accuracy metric by deployment ID',
	},
	'deployments.deploymentsAccuracyMetricsList': {
		riskLevel: 'read',
		description: 'Endpoint by deployment ID',
	},
	'deployments.deploymentsAccuracyMetricsPutMany': {
		riskLevel: 'write',
		description: 'Update deployment accuracy metrics settings by deployment ID',
	},
	'deployments.deploymentsAccuracyOverBatchList': {
		riskLevel: 'read',
		description: 'Accuracy over batch by deployment ID',
	},
	'deployments.deploymentsAccuracyOverSpaceList': {
		riskLevel: 'read',
		description: 'Retrieve accuracy over space by deployment ID',
	},
	'deployments.deploymentsAccuracyOverTimeList': {
		riskLevel: 'read',
		description: 'Retrieve accuracy over time by deployment ID',
	},
	'deployments.deploymentsActualsDataExportsCreate': {
		riskLevel: 'write',
		description: 'Create a deployment actuals data export by deployment ID',
	},
	'deployments.deploymentsActualsDataExportsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an actual export by deployment ID',
	},
	'deployments.deploymentsActualsDataExportsList': {
		riskLevel: 'read',
		description:
			'Retrieve a list of asynchronous actuals data exports by deployment ID',
	},
	'deployments.deploymentsActualsDataExportsPatch': {
		riskLevel: 'write',
		description: 'Update actuals data export by deployment ID',
	},
	'deployments.deploymentsActualsDataExportsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single actuals data export by deployment ID',
	},
	'deployments.deploymentsActualsFromDatasetCreate': {
		riskLevel: 'write',
		description: 'Submit actuals values by deployment ID',
	},
	'deployments.deploymentsActualsFromJSONCreate': {
		riskLevel: 'write',
		description: 'Create a actuals from a JSON',
	},
	'deployments.deploymentsAgentCardDeleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete the agent card by deployment ID',
	},
	'deployments.deploymentsAgentCardList': {
		riskLevel: 'read',
		description: 'Retrieve the agent card by deployment ID',
	},
	'deployments.deploymentsAgentCardPutMany': {
		riskLevel: 'write',
		description: 'Create by deployment ID',
	},
	'deployments.deploymentsBatchServiceStatsList': {
		riskLevel: 'read',
		description: 'Retrieve service health metrics by deployment ID',
	},
	'deployments.deploymentsCapabilitiesList': {
		riskLevel: 'read',
		description: 'Retrieve capabilities by deployment ID',
	},
	'deployments.deploymentsChallengerPredictionsCreate': {
		riskLevel: 'write',
		description: 'Score challenger models by deployment ID',
	},
	'deployments.deploymentsChallengerReplaySettingsList': {
		riskLevel: 'read',
		description: 'Retrieve challenger replay settings by deployment ID',
	},
	'deployments.deploymentsChallengerReplaySettingsPatchMany': {
		riskLevel: 'write',
		description: 'Update challenger replay settings by deployment ID',
	},
	'deployments.deploymentsChallengersCreate': {
		riskLevel: 'write',
		description: 'Create challenger model by deployment ID',
	},
	'deployments.deploymentsChallengersDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete challenger model by deployment ID',
	},
	'deployments.deploymentsChallengersList': {
		riskLevel: 'read',
		description: 'List challenger models by deployment ID',
	},
	'deployments.deploymentsChallengersPatch': {
		riskLevel: 'write',
		description: 'Update challenger model by deployment ID',
	},
	'deployments.deploymentsChallengersRetrieve': {
		riskLevel: 'read',
		description: 'Get challenger model by deployment ID',
	},
	'deployments.deploymentsChampionModelPackageList': {
		riskLevel: 'read',
		description:
			'Retrieve information about the champion model package by deployment ID',
	},
	'deployments.deploymentsCustomMetricsBatchSummaryRetrieve': {
		riskLevel: 'read',
		description:
			'Retrieve the summary of deployment batch custom metric by deployment ID',
	},
	'deployments.deploymentsCustomMetricsBulkBatchSummaryRetrieve': {
		riskLevel: 'read',
		description:
			'Retrieve the bulk summary of deployment batch custom metrics by deployment ID',
	},
	'deployments.deploymentsCustomMetricsBulkSummaryRetrieve': {
		riskLevel: 'read',
		description:
			'Retrieve the bulk summary of deployment custom metrics by deployment ID',
	},
	'deployments.deploymentsCustomMetricsBulkUploadCreate': {
		riskLevel: 'write',
		description: 'Bulk upload custom metric values by deployment ID',
	},
	'deployments.deploymentsCustomMetricsCreate': {
		riskLevel: 'write',
		description: 'Create a deployment custom metric by deployment ID',
	},
	'deployments.deploymentsCustomMetricsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a custom metric by deployment ID',
	},
	'deployments.deploymentsCustomMetricsFromCustomJobCreate': {
		riskLevel: 'write',
		description: 'Create a custom metrics from a custom job',
	},
	'deployments.deploymentsCustomMetricsFromDatasetCreate': {
		riskLevel: 'write',
		description: 'Upload custom metric values by deployment ID',
	},
	'deployments.deploymentsCustomMetricsFromJSONCreate': {
		riskLevel: 'write',
		description: 'Create a custom metrics from a JSON',
	},
	'deployments.deploymentsCustomMetricsList': {
		riskLevel: 'read',
		description: 'Retrieve a list of custom metrics by deployment ID',
	},
	'deployments.deploymentsCustomMetricsPatch': {
		riskLevel: 'write',
		description: 'Update given custom metric settings by deployment ID',
	},
	'deployments.deploymentsCustomMetricsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single custom metric metadata by deployment ID',
	},
	'deployments.deploymentsCustomMetricsSummaryRetrieve': {
		riskLevel: 'read',
		description:
			'Retrieve the summary of deployment custom metric by deployment ID',
	},
	'deployments.deploymentsCustomMetricsValuesOverBatchList': {
		riskLevel: 'read',
		description: 'Retrieve custom metric values over batch by deployment ID',
	},
	'deployments.deploymentsCustomMetricsValuesOverSpaceList': {
		riskLevel: 'read',
		description: 'Retrieve custom metric values over space by deployment ID',
	},
	'deployments.deploymentsCustomMetricsValuesOverTimeList': {
		riskLevel: 'read',
		description: 'Retrieve custom metric values over time by deployment ID',
	},
	'deployments.deploymentsDataQualityViewList': {
		riskLevel: 'read',
		description: 'Retrieve metadata of the data by deployment ID',
	},
	'deployments.deploymentsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete deployment by deployment ID',
	},
	'deployments.deploymentsFairnessScoresOverTimeList': {
		riskLevel: 'read',
		description:
			'Retrieve fairness over time info of the deployment by deployment ID',
	},
	'deployments.deploymentsFeatureDriftList': {
		riskLevel: 'read',
		description: 'Retrieve feature drift scores by deployment ID',
	},
	'deployments.deploymentsFeatureDriftOverBatchList': {
		riskLevel: 'read',
		description: 'Retrieve drift over batch info by deployment ID',
	},
	'deployments.deploymentsFeatureDriftOverSpaceList': {
		riskLevel: 'read',
		description:
			'Retrieve feature drift scores over space through geospatial monitoring by deployment ID',
	},
	'deployments.deploymentsFeatureDriftOverTimeList': {
		riskLevel: 'read',
		description: 'Retrieve drift over time info by deployment ID',
	},
	'deployments.deploymentsFeaturesList': {
		riskLevel: 'read',
		description: 'Get deployment features by deployment ID',
	},
	'deployments.deploymentsFromLearningModelCreate': {
		riskLevel: 'write',
		description: 'Create deployment',
	},
	'deployments.deploymentsFromModelPackageCreate': {
		riskLevel: 'write',
		description: 'Create a deployment from a model package',
	},
	'deployments.deploymentsHealthSettingsDefaultsList': {
		riskLevel: 'read',
		description: 'Retrieve default deployment health settings by deployment ID',
	},
	'deployments.deploymentsHealthSettingsList': {
		riskLevel: 'read',
		description: 'Retrieve deployment health settings by deployment ID',
	},
	'deployments.deploymentsHealthSettingsPatchMany': {
		riskLevel: 'write',
		description: 'Update deployment health settings by deployment ID',
	},
	'deployments.deploymentsHumilityStatsList': {
		riskLevel: 'read',
		description: 'Retrieve humility stats by deployment ID',
	},
	'deployments.deploymentsHumilityStatsOverTimeList': {
		riskLevel: 'read',
		description: 'Retrieve humility stats over time by deployment ID',
	},
	'deployments.deploymentsLimitsList': {
		riskLevel: 'read',
		description: 'Get deployment limits.',
	},
	'deployments.deploymentsList': {
		riskLevel: 'read',
		description: 'List deployments',
	},
	'deployments.deploymentsMigrateDPStoServerlessCreate': {
		riskLevel: 'write',
		description: "Update a deployment's prediction environment from dedicated",
	},
	'deployments.deploymentsModelHistoryList': {
		riskLevel: 'read',
		description:
			'Retrieve champion model history of deployment by deployment ID',
	},
	'deployments.deploymentsModelPatchMany': {
		riskLevel: 'write',
		description: 'Model Replacement by deployment ID',
	},
	'deployments.deploymentsModelSecondaryDatasetConfigurationHistoryList': {
		riskLevel: 'read',
		description:
			'List the secondary datasets configuration history by deployment ID',
	},
	'deployments.deploymentsModelSecondaryDatasetConfigurationList': {
		riskLevel: 'read',
		description: 'Retrieve secondary datasets configuration by deployment ID',
	},
	'deployments.deploymentsModelSecondaryDatasetConfigurationPatchMany': {
		riskLevel: 'write',
		description: 'Update the secondary datasets configuration by deployment ID',
	},
	'deployments.deploymentsModelValidationCreate': {
		riskLevel: 'write',
		description: 'Model Replacement Validation by deployment ID',
	},
	'deployments.deploymentsMonitoringBatchLimitsList': {
		riskLevel: 'read',
		description: 'Get the limits related by deployment ID',
	},
	'deployments.deploymentsMonitoringBatchesCreate': {
		riskLevel: 'write',
		description: 'Create a monitoring batch by deployment ID',
	},
	'deployments.deploymentsMonitoringBatchesDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a monitoring batch by deployment ID',
	},
	'deployments.deploymentsMonitoringBatchesList': {
		riskLevel: 'read',
		description: 'List monitoring batches by deployment ID',
	},
	'deployments.deploymentsMonitoringBatchesModelsList': {
		riskLevel: 'read',
		description:
			'List information about models that have data by deployment ID',
	},
	'deployments.deploymentsMonitoringBatchesModelsPatch': {
		riskLevel: 'write',
		description: 'Update information about model data by deployment ID',
	},
	'deployments.deploymentsMonitoringBatchesModelsRetrieve': {
		riskLevel: 'read',
		description: 'Get information about a model that has data by deployment ID',
	},
	'deployments.deploymentsMonitoringBatchesPatch': {
		riskLevel: 'write',
		description: 'Update a monitoring batch by deployment ID',
	},
	'deployments.deploymentsMonitoringBatchesRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a monitoring batch by deployment ID',
	},
	'deployments.deploymentsMonitoringDataDeletionsCreate': {
		riskLevel: 'write',
		description: 'Endpoint by deployment ID',
	},
	'deployments.deploymentsOnDemandReportsCreate': {
		riskLevel: 'write',
		description: 'Add report by deployment ID',
	},
	'deployments.deploymentsPatch': {
		riskLevel: 'write',
		description: 'Update deployment by deployment ID',
	},
	'deployments.deploymentsPredictionDataExportsCreate': {
		riskLevel: 'write',
		description: 'Create a deployment prediction data export by deployment ID',
	},
	'deployments.deploymentsPredictionDataExportsList': {
		riskLevel: 'read',
		description: 'A list prediction data exports by deployment ID',
	},
	'deployments.deploymentsPredictionDataExportsPatch': {
		riskLevel: 'write',
		description: 'Update prediction data export by deployment ID',
	},
	'deployments.deploymentsPredictionDataExportsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single prediction data export by deployment ID',
	},
	'deployments.deploymentsPredictionInputsFromDatasetCreate': {
		riskLevel: 'write',
		description: 'Submit external deployment prediction data by deployment ID',
	},
	'deployments.deploymentsPredictionResultsList': {
		riskLevel: 'read',
		description: 'Retrieve predictions results by deployment ID',
	},
	'deployments.deploymentsPredictionsOverBatchList': {
		riskLevel: 'read',
		description: 'Retrieve prediction metadata over batches by deployment ID',
	},
	'deployments.deploymentsPredictionsOverSpaceList': {
		riskLevel: 'read',
		description:
			'Retrieve predictions stats over space through geospatial monitoring by deployment ID',
	},
	'deployments.deploymentsPredictionsOverTimeList': {
		riskLevel: 'read',
		description:
			'Retrieve metrics about predictions over time by deployment ID',
	},
	'deployments.deploymentsPredictionsVsActualsOverBatchList': {
		riskLevel: 'read',
		description:
			'Retrieve metrics about predictions and actuals, such as mean predicted & actual value, predicted & by deployment ID',
	},
	'deployments.deploymentsPredictionsVsActualsOverSpaceList': {
		riskLevel: 'read',
		description: 'Retrieve predictions vs by deployment ID',
	},
	'deployments.deploymentsPredictionsVsActualsOverTimeList': {
		riskLevel: 'read',
		description:
			'Retrieve predictions vs actuals over time info by deployment ID',
	},
	'deployments.deploymentsQuotaConsumersList': {
		riskLevel: 'read',
		description: 'Retrieve deployment consumers by deployment ID',
	},
	'deployments.deploymentsRetrainingPoliciesCreate': {
		riskLevel: 'write',
		description: 'Create retraining policies by ID',
	},
	'deployments.deploymentsRetrainingPoliciesDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete retraining policies by ID',
	},
	'deployments.deploymentsRetrainingPoliciesList': {
		riskLevel: 'read',
		description: 'Endpoint by deployment ID',
	},
	'deployments.deploymentsRetrainingPoliciesPatch': {
		riskLevel: 'write',
		description: 'Modify retraining policies by ID',
	},
	'deployments.deploymentsRetrainingPoliciesRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve retraining policies by ID',
	},
	'deployments.deploymentsRetrainingPoliciesRunsCreate': {
		riskLevel: 'write',
		description: 'Create runs by ID',
	},
	'deployments.deploymentsRetrainingPoliciesRunsList': {
		riskLevel: 'read',
		description: 'Retrieve runs by ID',
	},
	'deployments.deploymentsRetrainingPoliciesRunsPatch': {
		riskLevel: 'write',
		description: 'Modify runs by ID',
	},
	'deployments.deploymentsRetrainingPoliciesRunsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve runs by ID',
	},
	'deployments.deploymentsRetrainingSettingsList': {
		riskLevel: 'read',
		description: 'Retrieve retraining settings by ID',
	},
	'deployments.deploymentsRetrainingSettingsPatchMany': {
		riskLevel: 'write',
		description: 'Modify retraining settings by ID',
	},
	'deployments.deploymentsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve deployment by deployment ID',
	},
	'deployments.deploymentsRuntimeParametersList': {
		riskLevel: 'read',
		description: 'List runtime parameters by deployment ID',
	},
	'deployments.deploymentsRuntimeParametersPutMany': {
		riskLevel: 'write',
		description: 'Update runtime parameters by deployment ID',
	},
	'deployments.deploymentsScoringCodeBuildsCreate': {
		riskLevel: 'write',
		description: 'Build Java package containing Scoring Code by deployment ID',
	},
	'deployments.deploymentsScoringCodeList': {
		riskLevel: 'read',
		description: 'Retrieve Scoring Code by deployment ID',
	},
	'deployments.deploymentsSegmentAttributesList': {
		riskLevel: 'read',
		description: 'Retrieve Segment attributes by ID',
	},
	'deployments.deploymentsSegmentValuesList': {
		riskLevel: 'read',
		description: 'Retrieve Segment values by ID',
	},
	'deployments.deploymentsServiceStatsList': {
		riskLevel: 'read',
		description: 'Retrieve service stats by ID',
	},
	'deployments.deploymentsServiceStatsOverBatchList': {
		riskLevel: 'read',
		description: 'Retrieve service health metric over batch by deployment ID',
	},
	'deployments.deploymentsServiceStatsOverTimeList': {
		riskLevel: 'read',
		description: 'Retrieve service health metric over time by deployment ID',
	},
	'deployments.deploymentsSettingsChecklistList': {
		riskLevel: 'read',
		description: 'Retrieve deployment settings checklist by deployment ID',
	},
	'deployments.deploymentsSettingsList': {
		riskLevel: 'read',
		description: 'Retrieve deployment settings by deployment ID',
	},
	'deployments.deploymentsSettingsPatchMany': {
		riskLevel: 'write',
		description: 'Update deployment settings by deployment ID',
	},
	'deployments.deploymentsSharedRolesList': {
		riskLevel: 'read',
		description:
			'Get the model deployment access control list by deployment ID',
	},
	'deployments.deploymentsSharedRolesPatchMany': {
		riskLevel: 'write',
		description: 'Update the model deployment access controls by deployment ID',
	},
	'deployments.deploymentsStatusPatchMany': {
		riskLevel: 'write',
		description: 'Change deployment status by deployment ID',
	},
	'deployments.deploymentsTargetDriftList': {
		riskLevel: 'read',
		description: 'Retrieve target drift by deployment ID',
	},
	'deployments.deploymentsTrainingDataExportsCreate': {
		riskLevel: 'write',
		description: 'Create a deployment training data export by deployment ID',
	},
	'deployments.deploymentsTrainingDataExportsList': {
		riskLevel: 'read',
		description: 'The list of training data exports by deployment ID',
	},
	'deployments.deploymentsTrainingDataExportsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve details by deployment ID',
	},
	'entitlements.entitlementsApplyEntitlementSetsCreate': {
		riskLevel: 'write',
		description: 'Apply entitlement set leases.',
	},
	'entitlements.entitlementsEntitlementSetLeasesList': {
		riskLevel: 'read',
		description: 'Retrieve entitlement set leases.',
	},
	'entitlements.entitlementsEvaluateCreate': {
		riskLevel: 'write',
		description: 'Evaluate entitlements.',
	},
	'entityNotificationChannels.entityNotificationChannelsCreate': {
		riskLevel: 'write',
		description: 'Create an entity notification channel.',
	},
	'entityNotificationChannels.entityNotificationChannelsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an entity notification channel by relatedentitytype',
	},
	'entityNotificationChannels.entityNotificationChannelsList': {
		riskLevel: 'read',
		description: 'List notification channels related by relatedentitytype',
	},
	'entityNotificationChannels.entityNotificationChannelsPut': {
		riskLevel: 'write',
		description: 'Update an entity notification channel by relatedentitytype',
	},
	'entityNotificationChannels.entityNotificationChannelsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve an entity notification channel by relatedentitytype',
	},
	'entityNotificationPolicies.entityNotificationPoliciesCreate': {
		riskLevel: 'write',
		description: 'Create an entity notification policy.',
	},
	'entityNotificationPolicies.entityNotificationPoliciesDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an entity notification policy by relatedentitytype',
	},
	'entityNotificationPolicies.entityNotificationPoliciesList': {
		riskLevel: 'read',
		description: 'List entity notification policies by relatedentitytype',
	},
	'entityNotificationPolicies.entityNotificationPoliciesPut': {
		riskLevel: 'write',
		description: 'Update an entity notification policy by relatedentitytype',
	},
	'entityNotificationPolicies.entityNotificationPoliciesRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve an entity notification policy by relatedentitytype',
	},
	'entityNotificationPolicyTemplates.entityNotificationPolicyTemplatesCreate': {
		riskLevel: 'write',
		description: 'Create an entity notification policy template.',
	},
	'entityNotificationPolicyTemplates.entityNotificationPolicyTemplatesDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an entity notification policy template by relatedentitytype',
	},
	'entityNotificationPolicyTemplates.entityNotificationPolicyTemplatesList': {
		riskLevel: 'read',
		description:
			'List entity notification policy templates by relatedentitytype',
	},
	'entityNotificationPolicyTemplates.entityNotificationPolicyTemplatesPut': {
		riskLevel: 'write',
		description:
			'Update an entity notification policy template by relatedentitytype',
	},
	'entityNotificationPolicyTemplates.entityNotificationPolicyTemplatesRelatedPoliciesList':
		{
			riskLevel: 'read',
			description:
				'Retrieve list of all policies that are created from this template and are visible by relatedentitytype',
		},
	'entityNotificationPolicyTemplates.entityNotificationPolicyTemplatesRetrieve':
		{
			riskLevel: 'read',
			description:
				'Retrieve an entity notification policy template by relatedentitytype',
		},
	'entityNotificationPolicyTemplates.entityNotificationPolicyTemplatesSharedRolesList':
		{
			riskLevel: 'read',
			description:
				'Get the registered model access control list by relatedentitytype',
		},
	'entityNotificationPolicyTemplates.entityNotificationPolicyTemplatesSharedRolesPatchMany':
		{
			riskLevel: 'write',
			description: 'Update the registered model controls by relatedentitytype',
		},
	'entityTags.entityTagsCreate': {
		riskLevel: 'write',
		description: 'Get entity tag.',
	},
	'entityTags.entityTagsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an entity tag by entity tag ID',
	},
	'entityTags.entityTagsList': {
		riskLevel: 'read',
		description: 'Retrieve the list of entity tags.',
	},
	'entityTags.entityTagsPatch': {
		riskLevel: 'write',
		description: 'Update entity tag by entity tag ID',
	},
	'eventLogs.eventLogsEventsList': {
		riskLevel: 'read',
		description: 'Retrieve all the available events',
	},
	'eventLogs.eventLogsList': {
		riskLevel: 'read',
		description: 'Retrieve one page of audit log records.',
	},
	'eventLogs.eventLogsPredictionUsageList': {
		riskLevel: 'read',
		description: 'Retrieve prediction usage data.',
	},
	'eventLogs.eventLogsRetrieve': {
		riskLevel: 'read',
		description: 'Get the audit record by ID by record ID',
	},
	'executionEnvironments.executionEnvironmentsAccessControlList': {
		riskLevel: 'read',
		description: 'Get a list of users who have access by environment ID',
	},
	'executionEnvironments.executionEnvironmentsAccessControlPatchMany': {
		riskLevel: 'write',
		description: 'Grant access by environment ID',
	},
	'executionEnvironments.executionEnvironmentsCreate': {
		riskLevel: 'write',
		description: 'Create an execution environment.',
	},
	'executionEnvironments.executionEnvironmentsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Destroy an execution environment by environment ID',
	},
	'executionEnvironments.executionEnvironmentsList': {
		riskLevel: 'read',
		description: 'List execution environments.',
	},
	'executionEnvironments.executionEnvironmentsPatch': {
		riskLevel: 'write',
		description: 'Update an execution environment by environment ID',
	},
	'executionEnvironments.executionEnvironmentsRetrieve': {
		riskLevel: 'read',
		description: 'Get an execution environment by environment ID',
	},
	'executionEnvironments.executionEnvironmentsVersionsBuildLogList': {
		riskLevel: 'read',
		description:
			'Download the execution environment build log by environment ID',
	},
	'executionEnvironments.executionEnvironmentsVersionsCancelBuildPatchMany': {
		riskLevel: 'write',
		description: 'Stop the execution environment build by environment ID',
	},
	'executionEnvironments.executionEnvironmentsVersionsCreate': {
		riskLevel: 'write',
		description: 'Create an execution environment version by environment ID',
	},
	'executionEnvironments.executionEnvironmentsVersionsDownloadCreate': {
		riskLevel: 'write',
		description: 'Request on-demand image build by environment ID',
	},
	'executionEnvironments.executionEnvironmentsVersionsDownloadList': {
		riskLevel: 'read',
		description: 'Submit image tarball build by environment ID',
	},
	'executionEnvironments.executionEnvironmentsVersionsList': {
		riskLevel: 'read',
		description: 'List execution environment versions by environment ID',
	},
	'executionEnvironments.executionEnvironmentsVersionsRetrieve': {
		riskLevel: 'read',
		description: 'Get an execution environment version by environment ID',
	},
	'externalDataDrivers.externalDataDriversConfigurationList': {
		riskLevel: 'read',
		description: 'Driver configuration details by driver ID',
	},
	'externalDataDrivers.externalDataDriversCreate': {
		riskLevel: 'write',
		description: 'Create a new JDBC driver.',
	},
	'externalDataDrivers.externalDataDriversDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete the driver by driver ID',
	},
	'externalDataDrivers.externalDataDriversList': {
		riskLevel: 'read',
		description: 'List drivers',
	},
	'externalDataDrivers.externalDataDriversPatch': {
		riskLevel: 'write',
		description: 'Update properties of an existing JDBC Driver by driver ID',
	},
	'externalDataDrivers.externalDataDriversRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve driver details by driver ID',
	},
	'externalDataSources.externalDataSourcesAccessControlList': {
		riskLevel: 'read',
		description: "Get the data source's access control list by data source ID",
	},
	'externalDataSources.externalDataSourcesAccessControlPatchMany': {
		riskLevel: 'write',
		description: "Update the data source's access controls by data source ID",
	},
	'externalDataSources.externalDataSourcesCreate': {
		riskLevel: 'write',
		description: 'Create a data source.',
	},
	'externalDataSources.externalDataSourcesDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete the data source by data source ID',
	},
	'externalDataSources.externalDataSourcesList': {
		riskLevel: 'read',
		description: 'List data sources.',
	},
	'externalDataSources.externalDataSourcesPatch': {
		riskLevel: 'write',
		description: 'Update the data source by data source ID',
	},
	'externalDataSources.externalDataSourcesPermissionsList': {
		riskLevel: 'read',
		description: 'Describe data source permissions by data source ID',
	},
	'externalDataSources.externalDataSourcesRetrieve': {
		riskLevel: 'read',
		description: 'Data source details by data source ID',
	},
	'externalDataSources.externalDataSourcesSharedRolesList': {
		riskLevel: 'read',
		description: 'Retrieve shared roles by ID',
	},
	'externalDataSources.externalDataSourcesSharedRolesPatchMany': {
		riskLevel: 'write',
		description: 'Modify data source shared roles by data source ID',
	},
	'externalDataStores.externalDataStoresAccessControlPatchMany': {
		riskLevel: 'write',
		description: "Update the data store's access controls by data store ID",
	},
	'externalDataStores.externalDataStoresColumnsCreate': {
		riskLevel: 'write',
		description: "Retrieves a data store's data columns by data store ID",
	},
	'externalDataStores.externalDataStoresColumnsInfoCreate': {
		riskLevel: 'write',
		description: "Retrieves a data store's column metadata by data store ID",
	},
	'externalDataStores.externalDataStoresCreate': {
		riskLevel: 'write',
		description: 'Create a data store.',
	},
	'externalDataStores.externalDataStoresCredentialsList': {
		riskLevel: 'read',
		description: 'List credentials associated by data store ID',
	},
	'externalDataStores.externalDataStoresDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete the data store by data store ID',
	},
	'externalDataStores.externalDataStoresList': {
		riskLevel: 'read',
		description: 'List data stores.',
	},
	'externalDataStores.externalDataStoresPatch': {
		riskLevel: 'write',
		description: 'Update a data store configuration by data store ID',
	},
	'externalDataStores.externalDataStoresPermissionsList': {
		riskLevel: 'read',
		description: 'Describe data store permissions by data store ID',
	},
	'externalDataStores.externalDataStoresRetrieve': {
		riskLevel: 'read',
		description: 'Data store details by data store ID',
	},
	'externalDataStores.externalDataStoresSchemasCreate': {
		riskLevel: 'write',
		description: "Retrieves a data store's data schemas by data store ID",
	},
	'externalDataStores.externalDataStoresSharedRolesList': {
		riskLevel: 'read',
		description: "Get the data store's access control list by data store ID",
	},
	'externalDataStores.externalDataStoresSharedRolesPatchMany': {
		riskLevel: 'write',
		description: 'Modify data store shared roles by data store ID',
	},
	'externalDataStores.externalDataStoresStandardUserDefinedFunctionsCreate': {
		riskLevel: 'write',
		description:
			'Start a job to create a standard user-defined function of the given type by data store ID',
	},
	'externalDataStores.externalDataStoresStandardUserDefinedFunctionsDetectCreate':
		{
			riskLevel: 'write',
			description:
				'Start the job that detects standard user-defined functions for the given data store, credentials by data store ID',
		},
	'externalDataStores.externalDataStoresStandardUserDefinedFunctionsList': {
		riskLevel: 'read',
		description:
			'Retrieve detected standard user-defined functions by data store ID',
	},
	'externalDataStores.externalDataStoresTablesCreate': {
		riskLevel: 'write',
		description:
			"Retrieves a data store's database tables (including views) by data store ID",
	},
	'externalDataStores.externalDataStoresTestCreate': {
		riskLevel: 'write',
		description: 'Test data store connection by data store ID',
	},
	'externalDataStores.externalDataStoresVerifySQLCreate': {
		riskLevel: 'write',
		description: 'Verify a SQL query by data store ID',
	},
	'externalOAuth.externalOAuthAuthorizedProvidersDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete OAuth Provider Authorization by authorized provider ID',
	},
	'externalOAuth.externalOAuthAuthorizedProvidersList': {
		riskLevel: 'read',
		description: 'List OAuth Provider Authorizations',
	},
	'externalOAuth.externalOAuthAuthorizedProvidersTokenCreate': {
		riskLevel: 'write',
		description:
			"Acquire OAuth Provider Authorization's Access Token by authorized provider ID",
	},
	'externalOAuth.externalOAuthAuthorizedProvidersUserinfoList': {
		riskLevel: 'read',
		description: 'Get User Information by authorized provider ID',
	},
	'externalOAuth.externalOAuthJobsRetrieve': {
		riskLevel: 'read',
		description: 'Get OAuth Provider Job by job ID',
	},
	'externalOAuth.externalOAuthProvidersAuthorizeCreate': {
		riskLevel: 'write',
		description: 'Authorize OAuth Provider by provider ID',
	},
	'externalOAuth.externalOAuthProvidersCallbackCreate': {
		riskLevel: 'write',
		description: 'OAuth Provider Callback',
	},
	'externalOAuth.externalOAuthProvidersCreate': {
		riskLevel: 'write',
		description: 'Create OAuth Provider',
	},
	'externalOAuth.externalOAuthProvidersDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete OAuth Provider by provider ID',
	},
	'externalOAuth.externalOAuthProvidersList': {
		riskLevel: 'read',
		description: 'List OAuth Providers',
	},
	'externalOAuth.externalOAuthProvidersPatch': {
		riskLevel: 'write',
		description: 'Update OAuth Provider by provider ID',
	},
	'externalOAuth.externalOAuthProvidersRetrieve': {
		riskLevel: 'read',
		description: 'Get OAuth Provider by provider ID',
	},
	'files.filesAddFromDataSourceCreate': {
		riskLevel: 'write',
		description:
			'Add file(s) into an existing files catalog item by catalog ID',
	},
	'files.filesAddFromFileCreate': {
		riskLevel: 'write',
		description: 'Create a file from a file',
	},
	'files.filesAddFromURLCreate': {
		riskLevel: 'write',
		description: 'Create a file from an URL',
	},
	'files.filesAllFilesDeleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete files or folders by catalog ID',
	},
	'files.filesAllFilesList': {
		riskLevel: 'read',
		description: 'List all files associated by catalog ID',
	},
	'files.filesAllFilesPatchMany': {
		riskLevel: 'write',
		description: 'Rename a file by catalog ID',
	},
	'files.filesCloneCreate': {
		riskLevel: 'write',
		description: 'Create a duplicate files collection by catalog ID',
	},
	'files.filesCopyBatchCreate': {
		riskLevel: 'write',
		description: 'Copy multiple files by catalog ID',
	},
	'files.filesCopyCreate': {
		riskLevel: 'write',
		description: 'Copy a file by catalog ID',
	},
	'files.filesCreate': {
		riskLevel: 'write',
		description: 'Create an empty files catalog item.',
	},
	'files.filesDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete the file by catalog ID',
	},
	'files.filesDeletedPatchMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Recover a deleted file by catalog ID',
	},
	'files.filesDownloadsCreate': {
		riskLevel: 'write',
		description: 'Retrieve data by catalog ID',
	},
	'files.filesFileList': {
		riskLevel: 'read',
		description: 'Retrieve the requested data by streaming it by catalog ID',
	},
	'files.filesFromDataSourceCreate': {
		riskLevel: 'write',
		description: 'Create a files catalog item',
	},
	'files.filesFromFileCreate': {
		riskLevel: 'write',
		description: 'Create a file from a file',
	},
	'files.filesFromStageCreate': {
		riskLevel: 'write',
		description: 'Apply staged files by catalog ID',
	},
	'files.filesFromURLCreate': {
		riskLevel: 'write',
		description: 'Create a file from an URL',
	},
	'files.filesLinksCreate': {
		riskLevel: 'write',
		description: 'Create links by ID',
	},
	'files.filesPatchMany': {
		riskLevel: 'write',
		description: 'Execute bulk files action',
	},
	'files.filesSharedRolesList': {
		riskLevel: 'read',
		description: 'List entity shared roles by catalog ID',
	},
	'files.filesSharedRolesPatchMany': {
		riskLevel: 'write',
		description: 'Modify entity shared roles by catalog ID',
	},
	'files.filesStagesCreate': {
		riskLevel: 'write',
		description: 'Create an empty stage by catalog ID',
	},
	'files.filesStagesUploadCreate': {
		riskLevel: 'write',
		description: 'Stage file by catalog ID',
	},
	'files.filesVersionsAllFilesList': {
		riskLevel: 'read',
		description: 'Retrieve all files by ID',
	},
	'files.filesVersionsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete file version by catalog ID',
	},
	'files.filesVersionsDeletedPatchMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Recover deleted file version by catalog ID',
	},
	'files.filesVersionsDownloadsCreate': {
		riskLevel: 'write',
		description: 'Create downloads by ID',
	},
	'files.filesVersionsFileList': {
		riskLevel: 'read',
		description: 'Retrieve file by ID',
	},
	'files.filesVersionsLinksCreate': {
		riskLevel: 'write',
		description: 'Create links by ID',
	},
	'files.filesVersionsList': {
		riskLevel: 'read',
		description: 'List catalog versions by catalog ID',
	},
	'genai.copySupportedInsightsPlaygroundsTargetPlaygroundIdSupportedInsightsSourcePlaygroundIdPut':
		{
			riskLevel: 'write',
			description: 'Copy supported insights by target playground ID',
		},
	'genai.createChatChatsPost': {
		riskLevel: 'write',
		description: 'Create chat',
	},
	'genai.createChatExportJobPlaygroundsPlaygroundIdTraceDatasetsPost': {
		riskLevel: 'write',
		description: 'Create playground prompt trace dataset by playground ID',
	},
	'genai.createChatPromptChatPromptsPost': {
		riskLevel: 'write',
		description: 'Create chat prompt',
	},
	'genai.createComparisonChatComparisonChatsPost': {
		riskLevel: 'write',
		description: 'Create comparison chat',
	},
	'genai.createComparisonPromptComparisonPromptsPost': {
		riskLevel: 'write',
		description: 'Create comparison prompt',
	},
	'genai.createCostMetricConfigurationCostMetricConfigurationsPost': {
		riskLevel: 'write',
		description: 'Create cost metric configuration',
	},
	'genai.createCustomModelEmbeddingValidationCustomModelEmbeddingValidationsPost':
		{
			riskLevel: 'write',
			description: 'Validate custom model embedding',
		},
	'genai.createCustomModelLlmValidationCustomModelLLMValidationsPost': {
		riskLevel: 'write',
		description: 'Validate custom model LLM',
	},
	'genai.createCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsPost':
		{
			riskLevel: 'write',
			description: 'Validate custom model vector database',
		},
	'genai.createCustomModelVectorDatabaseVectorDatabasesFromCustomModelDeploymentPost':
		{
			riskLevel: 'write',
			description: 'Create a vector databases from a custom model deployment',
		},
	'genai.createCustomModelVersionCustomModelVersionsPost': {
		riskLevel: 'write',
		description: 'Create custom model version',
	},
	'genai.createEvaluationDatasetConfigurationEvaluationDatasetConfigurationsPost':
		{
			riskLevel: 'write',
			description: 'Create evaluation dataset configuration',
		},
	'genai.createEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsPost':
		{
			riskLevel: 'write',
			description: 'Create evaluation dataset metric aggregation',
		},
	'genai.createFromChatPromptLlmBlueprintsFromChatPromptPost': {
		riskLevel: 'write',
		description: 'Create a LLM blueprints from a chat prompt',
	},
	'genai.createFromLlmBlueprintLlmBlueprintsFromLLMBlueprintPost': {
		riskLevel: 'write',
		description: 'Duplicate LLM blueprint',
	},
	'genai.createLlmBlueprintLlmBlueprintsPost': {
		riskLevel: 'write',
		description: 'Create LLM blueprint',
	},
	'genai.createLlmTestConfigurationLlmTestConfigurationsPost': {
		riskLevel: 'write',
		description: 'Create LLM test configuration',
	},
	'genai.createLlmTestResultLlmTestResultsPost': {
		riskLevel: 'write',
		description: 'Create LLM test result',
	},
	'genai.createLlmTestSuiteLlmTestSuitesPost': {
		riskLevel: 'write',
		description: 'Create LLM test suite',
	},
	'genai.createOotbMetricConfigurationPlaygroundsPlaygroundIdOotbMetricConfigurationsPost':
		{
			riskLevel: 'write',
			description: 'Create OOTB metric configuration by playground ID',
		},
	'genai.createPlaygroundPlaygroundsPost': {
		riskLevel: 'write',
		description: 'Create playground',
	},
	'genai.createPromptTemplatePromptTemplatesPost': {
		riskLevel: 'write',
		description: 'Create prompt template',
	},
	'genai.createPromptTemplateVersionPromptTemplatesPromptTemplateIdVersionsPost':
		{
			riskLevel: 'write',
			description: 'Create prompt template version by prompt template ID',
		},
	'genai.createSidecarModelMetricValidationSidecarModelMetricValidationsPost': {
		riskLevel: 'write',
		description: 'Validate sidecar model metric',
	},
	'genai.createVectorDatabaseCustomModelVersionVectorDatabasesVectorDatabaseIdCustomModelVersionsPost':
		{
			riskLevel: 'write',
			description: 'Create custom model version by vector database ID',
		},
	'genai.createVectorDatabaseDeploymentVectorDatabasesVectorDatabaseIdDeploymentsPost':
		{
			riskLevel: 'write',
			description: 'Create new custom model version by vector database ID',
		},
	'genai.createVectorDatabaseVectorDatabasesPost': {
		riskLevel: 'write',
		description: 'Create vector database',
	},
	'genai.deleteChatChatsChatIdDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete chat by chat ID',
	},
	'genai.deleteChatPromptChatPromptsChatPromptIdDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete chat prompt by chat prompt ID',
	},
	'genai.deleteComparisonChatComparisonChatsComparisonChatIdDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete comparison chat by comparison chat ID',
	},
	'genai.deleteComparisonPromptComparisonPromptsComparisonPromptIdDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete comparison prompt by comparison prompt ID',
	},
	'genai.deleteCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdDelete':
		{
			riskLevel: 'destructive',
			irreversible: true,
			description:
				'Delete cost metric configuration by cost metric configuration ID',
		},
	'genai.deleteCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdDelete':
		{
			riskLevel: 'destructive',
			irreversible: true,
			description: 'Delete custom model embedding validation by validation ID',
		},
	'genai.deleteCustomModelLlmValidationCustomModelLLMValidationsValidationIdDelete':
		{
			riskLevel: 'destructive',
			irreversible: true,
			description: 'Delete custom model LLM validation by validation ID',
		},
	'genai.deleteCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdDelete':
		{
			riskLevel: 'destructive',
			irreversible: true,
			description:
				'Delete custom model vector database validation by validation ID',
		},
	'genai.deleteEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdDelete':
		{
			riskLevel: 'destructive',
			irreversible: true,
			description:
				'Delete evaluation dataset configuration by evaluation dataset configuration ID',
		},
	'genai.deleteEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsDelete':
		{
			riskLevel: 'destructive',
			irreversible: true,
			description: 'Delete evaluation dataset metric aggregation',
		},
	'genai.deleteLlmBlueprintLlmBlueprintsLlmBlueprintIdDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete LLM blueprint by LLM blueprint ID',
	},
	'genai.deleteLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdDelete':
		{
			riskLevel: 'destructive',
			irreversible: true,
			description: 'Delete LLM test configuration by LLM test configuration ID',
		},
	'genai.deleteLlmTestResultLlmTestResultsLlmTestResultIdDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete LLM test result by LLM test result ID',
	},
	'genai.deleteLlmTestSuiteLlmTestSuitesLlmTestSuiteIdDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete LLM test suite by LLM test suite ID',
	},
	'genai.deleteNemoMetricPlaygroundsPlaygroundIdNemoConfigurationMetricIdDelete':
		{
			riskLevel: 'destructive',
			irreversible: true,
			description: 'Delete a NeMo metric by playground ID',
		},
	'genai.deleteOotbMetricConfigurationOotbMetricConfigurationsOotbMetricConfigurationIdDelete':
		{
			riskLevel: 'destructive',
			irreversible: true,
			description:
				'Delete OOTB metric configuration by ootb metric configuration ID',
		},
	'genai.deletePlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationDelete':
		{
			riskLevel: 'destructive',
			irreversible: true,
			description: 'Delete the NeMo configuration by playground ID',
		},
	'genai.deletePlaygroundPlaygroundsPlaygroundIdDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete playground by playground ID',
	},
	'genai.deleteSearchStudySyftrSearchSearchStudyIdDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete existing search study by ID by search study ID',
	},
	'genai.deleteSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdDelete':
		{
			riskLevel: 'destructive',
			irreversible: true,
			description: 'Delete sidecar model metric validation by validation ID',
		},
	'genai.deleteVectorDatabaseVectorDatabasesVectorDatabaseIdDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete vector database by vector database ID',
	},
	'genai.downloadTextAndEmbeddingsAssetVectorDatabasesVectorDatabaseIdTextAndEmbeddingsGet':
		{
			riskLevel: 'read',
			description: 'Retrieve text chunks and embeddings by vector database ID',
		},
	'genai.editChatChatsChatIdPatch': {
		riskLevel: 'write',
		description: 'Edit chat by chat ID',
	},
	'genai.editComparisonChatComparisonChatsComparisonChatIdPatch': {
		riskLevel: 'write',
		description: 'Edit comparison chat by comparison chat ID',
	},
	'genai.editLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdPatch':
		{
			riskLevel: 'write',
			description: 'Edit LLM test configuration by LLM test configuration ID',
		},
	'genai.editLlmTestSuiteLlmTestSuitesLlmTestSuiteIdPatch': {
		riskLevel: 'write',
		description: 'Edit LLM test suite by LLM test suite ID',
	},
	'genai.editSearchStudySyftrSearchSearchStudyIdPatch': {
		riskLevel: 'write',
		description: 'Edit search study by search study ID',
	},
	'genai.exportVectorDatabaseDatasetVectorDatabasesVectorDatabaseIdDatasetExportJobsPost':
		{
			riskLevel: 'write',
			description: 'Export vector database dataset by vector database ID',
		},
	'genai.fromCustomModelChatAgentsFromCustomModelCustomModelIdChatPost': {
		riskLevel: 'write',
		description: 'Request chat completion by custom model ID',
	},
	'genai.generateSyntheticDatasetSyntheticEvaluationDatasetGenerationsPost': {
		riskLevel: 'write',
		description: 'Generate synthetic evaluation dataset',
	},
	'genai.getChatChatsChatIdGet': {
		riskLevel: 'read',
		description: 'Retrieve chat by chat ID',
	},
	'genai.getChatPromptChatPromptsChatPromptIdGet': {
		riskLevel: 'read',
		description: 'Retrieve chat prompt by chat prompt ID',
	},
	'genai.getChatResponseAgentsFromCustomModelCustomModelIdChatChatCompletionIdGet':
		{
			riskLevel: 'read',
			description: 'Obtain chat completion response by custom model ID',
		},
	'genai.getComparisonChatComparisonChatsComparisonChatIdGet': {
		riskLevel: 'read',
		description: 'Retrieve comparison chat by comparison chat ID',
	},
	'genai.getComparisonPromptComparisonPromptsComparisonPromptIdGet': {
		riskLevel: 'read',
		description: 'Retrieve comparison prompt by comparison prompt ID',
	},
	'genai.getCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdGet':
		{
			riskLevel: 'read',
			description:
				'Retrieve cost metric configuration by cost metric configuration ID',
		},
	'genai.getCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdGet':
		{
			riskLevel: 'read',
			description:
				'Retrieve custom model embedding validation status by validation ID',
		},
	'genai.getCustomModelLlmValidationCustomModelLLMValidationsValidationIdGet': {
		riskLevel: 'read',
		description: 'Retrieve custom model LLM validation status by validation ID',
	},
	'genai.getCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdGet':
		{
			riskLevel: 'read',
			description:
				'Retrieve custom model vector database validation status by validation ID',
		},
	'genai.getEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdGet':
		{
			riskLevel: 'read',
			description:
				'Retrieve evaluation dataset configuration by evaluation dataset configuration ID',
		},
	'genai.getLlmBlueprintLlmBlueprintsLlmBlueprintIdGet': {
		riskLevel: 'read',
		description: 'Retrieve LLM blueprint by LLM blueprint ID',
	},
	'genai.getLlmLlmsLlmIdGet': {
		riskLevel: 'read',
		description: 'Get LLM by LLM ID',
	},
	'genai.getLlmTestConfigurationLlmTestConfigurationsLlmTestConfigurationIdGet':
		{
			riskLevel: 'read',
			description:
				'Retrieve LLM test configuration by LLM test configuration ID',
		},
	'genai.getLlmTestResultLlmTestResultsLlmTestResultIdGet': {
		riskLevel: 'read',
		description: 'Retrieve LLM test result by LLM test result ID',
	},
	'genai.getLlmTestSuiteLlmTestSuitesLlmTestSuiteIdGet': {
		riskLevel: 'read',
		description: 'Retrieve LLM test suite by LLM test suite ID',
	},
	'genai.getOotbMetricConfigurationOotbMetricConfigurationsOotbMetricConfigurationIdGet':
		{
			riskLevel: 'read',
			description:
				'Get OOTB metric configuration by ootb metric configuration ID',
		},
	'genai.getPlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationGet':
		{
			riskLevel: 'read',
			description: 'Retrive the NeMo configuration by playground ID',
		},
	'genai.getPlaygroundPlaygroundsPlaygroundIdGet': {
		riskLevel: 'read',
		description: 'Retrieve playground by playground ID',
	},
	'genai.getPromptTemplatePromptTemplatesPromptTemplateIdGet': {
		riskLevel: 'read',
		description: 'Get prompt template by prompt template ID',
	},
	'genai.getPromptTemplateVersionPromptTemplatesPromptTemplateIdVersionsPromptTemplateVersionIdGet':
		{
			riskLevel: 'read',
			description: 'Get prompt template version by prompt template ID',
		},
	'genai.getSearchStudySyftrSearchSearchStudyIdGet': {
		riskLevel: 'read',
		description: 'Get existing search study by ID by search study ID',
	},
	'genai.getSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdGet':
		{
			riskLevel: 'read',
			description:
				'Retrieve sidecar model metric validation status by validation ID',
		},
	'genai.getStatusStatusStatusIdGet': {
		riskLevel: 'read',
		description: 'Retrieve job status by status ID',
	},
	'genai.getSupportedEmbeddingsVectorDatabasesSupportedEmbeddingsGet': {
		riskLevel: 'read',
		description: 'List supported embedding models',
	},
	'genai.getSupportedInsightsPlaygroundsPlaygroundIdSupportedInsightsGet': {
		riskLevel: 'read',
		description: 'List supported insights by playground ID',
	},
	'genai.getSupportedLanguagesVectorDatabasesVectorDatabaseIdSupportedSyntheticDatasetGenerationLanguagesGet':
		{
			riskLevel: 'read',
			description: 'List supported languages by vector database ID',
		},
	'genai.getSupportedRetrievalSettingsVectorDatabasesSupportedRetrievalSettingsGet':
		{
			riskLevel: 'read',
			description: 'List supported vector database retrieval settings',
		},
	'genai.getSupportedTextChunkingConfigsVectorDatabasesSupportedTextChunkingsGet':
		{
			riskLevel: 'read',
			description: 'List supported text chunking methods',
		},
	'genai.getUserLimitCounterForVectorDatabasesUserLimitsVectorDatabasesGet': {
		riskLevel: 'read',
		description: 'Retrieve vector database creation count',
	},
	'genai.getVectorDatabaseLatestVersionVectorDatabasesVectorDatabaseIdLatestVersionGet':
		{
			riskLevel: 'read',
			description:
				'Retrieve vector database latest version by vector database ID',
		},
	'genai.getVectorDatabaseVectorDatabasesVectorDatabaseIdGet': {
		riskLevel: 'read',
		description: 'Retrieve vector database by vector database ID',
	},
	'genai.listChatPromptsChatPromptsGet': {
		riskLevel: 'read',
		description: 'List chat prompts',
	},
	'genai.listChatsChatsGet': {
		riskLevel: 'read',
		description: 'List chats',
	},
	'genai.listComparisonChatsComparisonChatsGet': {
		riskLevel: 'read',
		description: 'List comparison chats',
	},
	'genai.listComparisonPromptsComparisonPromptsGet': {
		riskLevel: 'read',
		description: 'List comparison prompts',
	},
	'genai.listCustomModelEmbeddingsCustomModelEmbeddingValidationsGet': {
		riskLevel: 'read',
		description: 'List custom model embedding validations',
	},
	'genai.listCustomModelLlmValidationsCustomModelLLMValidationsGet': {
		riskLevel: 'read',
		description: 'List custom model LLM validations',
	},
	'genai.listCustomModelVectorDatabaseValidationsCustomModelVectorDatabaseValidationsGet':
		{
			riskLevel: 'read',
			description: 'List custom model vector database validations',
		},
	'genai.listEvaluationDatasetConfigurationEvaluationDatasetConfigurationsGet':
		{
			riskLevel: 'read',
			description: 'List evaluation dataset configurations',
		},
	'genai.listEvaluationDatasetMetricAggregationAggregatedByLlmBlueprintEvaluationDatasetMetricAggregationsAggregateByLLMBlueprintGet':
		{
			riskLevel: 'read',
			description:
				'List evaluation dataset metric aggregations aggregated by llm blueprint.',
		},
	'genai.listEvaluationDatasetMetricAggregationEvaluationDatasetMetricAggregationsGet':
		{
			riskLevel: 'read',
			description: 'List evaluation dataset metric aggregations',
		},
	'genai.listEvaluationDatasetMetricAggregationUniqueFieldValuesEvaluationDatasetMetricAggregationsUniqueFieldValuesUniqueFieldGet':
		{
			riskLevel: 'read',
			description:
				'List evaluation dataset metric aggregations unique computed metrics by uniquefield',
		},
	'genai.listLlmBlueprintsLlmBlueprintsGet': {
		riskLevel: 'read',
		description: 'List LLM blueprints',
	},
	'genai.listLlmTestConfigurationNonOotbDatasetsLlmTestConfigurationsNonOotbDatasetsGet':
		{
			riskLevel: 'read',
			description: 'List non out-of-the-box datasets',
		},
	'genai.listLlmTestConfigurationOotbDatasetsLlmTestConfigurationsOotbDatasetsGet':
		{
			riskLevel: 'read',
			description: 'List out-of-the-box datasets',
		},
	'genai.listLlmTestConfigurationSupportedInsightsLlmTestConfigurationsSupportedInsightsGet':
		{
			riskLevel: 'read',
			description: 'List supported insights',
		},
	'genai.listLlmTestConfigurationsLlmTestConfigurationsGet': {
		riskLevel: 'read',
		description: 'List LLM test configuration',
	},
	'genai.listLlmTestResultsLlmTestResultsGet': {
		riskLevel: 'read',
		description: 'List LLM test results',
	},
	'genai.listLlmTestSuitesLlmTestSuitesGet': {
		riskLevel: 'read',
		description: 'List LLM test suites',
	},
	'genai.listLlmsLlmsGet': {
		riskLevel: 'read',
		description: 'List LLMs',
	},
	'genai.listOotbMetricConfigurationsPlaygroundsPlaygroundIdOotbMetricConfigurationsGet':
		{
			riskLevel: 'read',
			description: 'List OOTB metric configurations by playground ID',
		},
	'genai.listPlaygroundsPlaygroundsGet': {
		riskLevel: 'read',
		description: 'List playgrounds',
	},
	'genai.listPromptTemplateVersionsPromptTemplatesPromptTemplateIdVersionsGet':
		{
			riskLevel: 'read',
			description: 'List prompt template versions by prompt template ID',
		},
	'genai.listPromptTemplatesPromptTemplatesGet': {
		riskLevel: 'read',
		description: 'List prompt templates',
	},
	'genai.listPromptTemplatesVersionsPromptTemplatesVersionsGet': {
		riskLevel: 'read',
		description: 'List prompt templates versions',
	},
	'genai.listSearchStudySyftrSearchGet': {
		riskLevel: 'read',
		description: 'List search studies by use case ID.',
	},
	'genai.listSidecarModelValidationsSidecarModelMetricValidationsGet': {
		riskLevel: 'read',
		description: 'List sidecar model metric validations',
	},
	'genai.listVectorDatabasesVectorDatabasesGet': {
		riskLevel: 'read',
		description: 'List vector databases',
	},
	'genai.playgroundTraceMetadataPlaygroundsPlaygroundIdTraceMetadataGet': {
		riskLevel: 'read',
		description: 'Retrieve playground prompt traces metadata by playground ID',
	},
	'genai.playgroundTracePlaygroundsPlaygroundIdTraceGet': {
		riskLevel: 'read',
		description: 'Retrieve playground prompt traces by playground ID',
	},
	'genai.revalidateCustomModelEmbeddingValidationCustomModelEmbeddingValidationsValidationIdRevalidatePost':
		{
			riskLevel: 'write',
			description: 'Revalidate custom model embedding by validation ID',
		},
	'genai.revalidateCustomModelLlmValidationCustomModelLLMValidationsValidationIdRevalidatePost':
		{
			riskLevel: 'write',
			description: 'Revalidate custom model LLM by validation ID',
		},
	'genai.revalidateCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdRevalidatePost':
		{
			riskLevel: 'write',
			description: 'Revalidate custom model vector database by validation ID',
		},
	'genai.revalidateSidecarModelValidationSidecarModelMetricValidationsValidationIdRevalidatePost':
		{
			riskLevel: 'write',
			description: 'Revalidate sidecar model metric by validation ID',
		},
	'genai.runAgenticSearchSyftrSearchPost': {
		riskLevel: 'write',
		description: 'Run agentic search.',
	},
	'genai.updateChatPromptDataChatPromptsChatPromptIdPatch': {
		riskLevel: 'write',
		description: 'Edit chat prompt by chat prompt ID',
	},
	'genai.updateComparisonPromptComparisonPromptsComparisonPromptIdPatch': {
		riskLevel: 'write',
		description: 'Edit comparison prompt by comparison prompt ID',
	},
	'genai.updateConnectedVectorDatabaseVectorDatabasesVectorDatabaseIdExternalVectorDatabaseDocumentsPatch':
		{
			riskLevel: 'write',
			description: 'Add documents by vector database ID',
		},
	'genai.updateCostMetricConfigurationCostMetricConfigurationsCostMetricConfigurationIdPatch':
		{
			riskLevel: 'write',
			description:
				'Edit cost metric configuration by cost metric configuration ID',
		},
	'genai.updateCustomModelLlmValidationCustomModelLLMValidationsValidationIdPatch':
		{
			riskLevel: 'write',
			description: 'Edit custom model LLM validation by validation ID',
		},
	'genai.updateCustomModelValidationCustomModelEmbeddingValidationsValidationIdPatch':
		{
			riskLevel: 'write',
			description: 'Edit custom model embedding validation by validation ID',
		},
	'genai.updateCustomModelVectorDatabaseValidationCustomModelVectorDatabaseValidationsValidationIdPatch':
		{
			riskLevel: 'write',
			description:
				'Edit custom model vector database validation by validation ID',
		},
	'genai.updateEvaluationDatasetConfigurationEvaluationDatasetConfigurationsEvaluationDatasetConfigurationIdPatch':
		{
			riskLevel: 'write',
			description:
				'Edit evaluation dataset configuration by evaluation dataset configuration ID',
		},
	'genai.updateLlmBlueprintLlmBlueprintsLlmBlueprintIdPatch': {
		riskLevel: 'write',
		description: 'Edit LLM blueprint by LLM blueprint ID',
	},
	'genai.updatePlaygroundPlaygroundsPlaygroundIdPatch': {
		riskLevel: 'write',
		description: 'Edit playground by playground ID',
	},
	'genai.updateSidecarModelMetricValidationSidecarModelMetricValidationsValidationIdPatch':
		{
			riskLevel: 'write',
			description: 'Edit sidecar model metric validation by validation ID',
		},
	'genai.updateVectorDatabaseVectorDatabasesVectorDatabaseIdPatch': {
		riskLevel: 'write',
		description: 'Edit vector database by vector database ID',
	},
	'genai.upsertPlaygroundNemoConfigurationPlaygroundsPlaygroundIdNemoConfigurationPost':
		{
			riskLevel: 'write',
			description: 'Update/insert the NeMo configuration by playground ID',
		},
	'groups.groupsCreate': {
		riskLevel: 'write',
		description: 'Create a user group.',
	},
	'groups.groupsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a user group by group ID',
	},
	'groups.groupsDeleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete multiple user groups.',
	},
	'groups.groupsList': {
		riskLevel: 'read',
		description: 'List user groups.',
	},
	'groups.groupsPatch': {
		riskLevel: 'write',
		description: 'Update a user group by group ID',
	},
	'groups.groupsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a user group by group ID',
	},
	'groups.groupsUsersCreate': {
		riskLevel: 'write',
		description: 'Add users by group ID',
	},
	'groups.groupsUsersDeleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove users by group ID',
	},
	'groups.groupsUsersList': {
		riskLevel: 'read',
		description: 'List users by group ID',
	},
	'guardConfigurations.guardConfigurationsCreate': {
		riskLevel: 'write',
		description: 'Create a guard configuration.',
	},
	'guardConfigurations.guardConfigurationsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a guard config by config ID',
	},
	'guardConfigurations.guardConfigurationsList': {
		riskLevel: 'read',
		description: 'The list of resource tags.',
	},
	'guardConfigurations.guardConfigurationsPatch': {
		riskLevel: 'write',
		description: 'Update a guard config by config ID',
	},
	'guardConfigurations.guardConfigurationsPredictionEnvironmentsInUseList': {
		riskLevel: 'read',
		description: 'Show the prediction environments in use',
	},
	'guardConfigurations.guardConfigurationsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve info about a guard configuration by config ID',
	},
	'guardConfigurations.guardConfigurationsToNewCustomModelVersionCreate': {
		riskLevel: 'write',
		description: 'Apply moderation configuration',
	},
	'guardTemplates.guardTemplatesList': {
		riskLevel: 'read',
		description: 'List guard templates.',
	},
	'guardTemplates.guardTemplatesRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve information about a guard template by template ID',
	},
	'imageAugmentationLists.imageAugmentationListsCreate': {
		riskLevel: 'write',
		description: 'Creates a new augmentation list based',
	},
	'imageAugmentationLists.imageAugmentationListsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an existing augmentation lists by id by augmentation ID',
	},
	'imageAugmentationLists.imageAugmentationListsList': {
		riskLevel: 'read',
		description: 'List of augmentation lists',
	},
	'imageAugmentationLists.imageAugmentationListsPatch': {
		riskLevel: 'write',
		description: 'Update an existing augmentation list by augmentation ID',
	},
	'imageAugmentationLists.imageAugmentationListsRetrieve': {
		riskLevel: 'read',
		description: 'Returns a single augmentation list by augmentation ID',
	},
	'imageAugmentationLists.imageAugmentationListsSamplesCreate': {
		riskLevel: 'write',
		description:
			'Requests the creation of sample augmentations based by augmentation ID',
	},
	'imageAugmentationLists.imageAugmentationListsSamplesList': {
		riskLevel: 'read',
		description:
			'Retrieve latest Augmentation Samples generated by augmentation ID',
	},
	'insights.insightsConfusionMatrixCreate': {
		riskLevel: 'write',
		description: 'Request calculation of Confusion Matrix chart',
	},
	'insights.insightsConfusionMatrixModelsList': {
		riskLevel: 'read',
		description:
			'The list of paginated Confusion Matrix chart insights by entity ID',
	},
	'insights.insightsFeatureEffectsCreate': {
		riskLevel: 'write',
		description: 'Request calculation of Feature Effects',
	},
	'insights.insightsFeatureEffectsModelsList': {
		riskLevel: 'read',
		description: 'The list of paginated Feature Effects insights by entity ID',
	},
	'insights.insightsFeatureImpactCreate': {
		riskLevel: 'write',
		description: 'Request calculation of Feature Impact',
	},
	'insights.insightsFeatureImpactModelsList': {
		riskLevel: 'read',
		description: 'The list of paginated Feature Impact insights by entity ID',
	},
	'insights.insightsLiftChartCreate': {
		riskLevel: 'write',
		description: 'Request calculation of Lift chart',
	},
	'insights.insightsLiftChartModelsList': {
		riskLevel: 'read',
		description: 'The list of paginated lift chart insights by entity ID',
	},
	'insights.insightsModelsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete insights by insightname',
	},
	'insights.insightsResidualsCreate': {
		riskLevel: 'write',
		description: 'Request calculation of Residuals chart',
	},
	'insights.insightsResidualsModelsList': {
		riskLevel: 'read',
		description: 'The list of paginated Residuals insights by entity ID',
	},
	'insights.insightsRocCurveCreate': {
		riskLevel: 'write',
		description: 'Request calculation of ROC curve',
	},
	'insights.insightsRocCurveModelsList': {
		riskLevel: 'read',
		description: 'The list of paginated ROC curve insights by entity ID',
	},
	'insights.insightsShapDistributionsCreate': {
		riskLevel: 'write',
		description: 'Request calculation of SHAP Distributions',
	},
	'insights.insightsShapDistributionsModelsList': {
		riskLevel: 'read',
		description:
			'The list of paginated SHAP Distributions insights by entity ID',
	},
	'insights.insightsShapImpactCreate': {
		riskLevel: 'write',
		description: 'Request calculation of SHAP Impact',
	},
	'insights.insightsShapImpactModelsList': {
		riskLevel: 'read',
		description: 'The list of paginated SHAP Impact insights by entity ID',
	},
	'insights.insightsShapMatrixCreate': {
		riskLevel: 'write',
		description: 'Request calculation of SHAP Matrix',
	},
	'insights.insightsShapMatrixModelsList': {
		riskLevel: 'read',
		description: 'The list of paginated SHAP Matrix insights by entity ID',
	},
	'insights.insightsShapPreviewCreate': {
		riskLevel: 'write',
		description: 'Request calculation of SHAP Preview',
	},
	'insights.insightsShapPreviewModelsList': {
		riskLevel: 'read',
		description: 'The list of paginated SHAP Preview insights by entity ID',
	},
	'mlops.mlopsComputeBundlesList': {
		riskLevel: 'read',
		description: 'List resource bundles.',
	},
	'mlops.mlopsComputeBundlesRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve resource bundle by resource request bundle ID',
	},
	'mlops.mlopsPortablePredictionServerImageList': {
		riskLevel: 'read',
		description:
			'Downloads the latest Portable Prediction Server (PPS) Docker image',
	},
	'mlops.mlopsPortablePredictionServerImageMetadataList': {
		riskLevel: 'read',
		description: 'Fetches currently active PPS Docker image metadata',
	},
	'modelPackages.modelPackagesArchiveCreate': {
		riskLevel: 'write',
		description: 'Archive a model package by model package ID',
	},
	'modelPackages.modelPackagesCapabilitiesList': {
		riskLevel: 'read',
		description: 'Retrieve capabilities by model package ID',
	},
	'modelPackages.modelPackagesFeaturesList': {
		riskLevel: 'read',
		description: 'Retrieve feature list by model package ID',
	},
	'modelPackages.modelPackagesFromJSONCreate': {
		riskLevel: 'write',
		description: 'Create a model package',
	},
	'modelPackages.modelPackagesFromLeaderboardCreate': {
		riskLevel: 'write',
		description: 'Create model package',
	},
	'modelPackages.modelPackagesFromLearningModelCreate': {
		riskLevel: 'write',
		description: 'Create a model packages from a learning model',
	},
	'modelPackages.modelPackagesList': {
		riskLevel: 'read',
		description: 'List model packages',
	},
	'modelPackages.modelPackagesModelLogsList': {
		riskLevel: 'read',
		description:
			"The list of the model package's model logs by model package ID",
	},
	'modelPackages.modelPackagesRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve info about a model package by model package ID',
	},
	'modelPackages.modelPackagesSharedRolesList': {
		riskLevel: 'read',
		description:
			"Get the model package's access control list by model package ID",
	},
	'notebookCodeSnippets.notebookCodeSnippetsList': {
		riskLevel: 'read',
		description: 'Retrieve Notebook Code Snippets',
	},
	'notebookCodeSnippets.notebookCodeSnippetsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve Notebook Code Snippets by snippet ID',
	},
	'notebookCodeSnippets.notebookCodeSnippetsTagsList': {
		riskLevel: 'read',
		description: 'Retrieve Tags',
	},
	'notebookEnvironmentVariables.notebookEnvironmentVariablesCreate': {
		riskLevel: 'write',
		description: 'Create Notebook Environment Variables by notebook ID',
	},
	'notebookEnvironmentVariables.notebookEnvironmentVariablesDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete Notebook Environment Variables by notebook ID',
	},
	'notebookEnvironmentVariables.notebookEnvironmentVariablesDelete2': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete notebook environment variables by ID',
	},
	'notebookEnvironmentVariables.notebookEnvironmentVariablesPatch': {
		riskLevel: 'write',
		description: 'Modify Notebook Environment Variables by notebook ID',
	},
	'notebookEnvironmentVariables.notebookEnvironmentVariablesRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve Notebook Environment Variables by notebook ID',
	},
	'notebookExecutionEnvironments.notebookExecutionEnvironmentsList': {
		riskLevel: 'read',
		description: 'Retrieve Notebook Execution Environments',
	},
	'notebookExecutionEnvironments.notebookExecutionEnvironmentsMachinesList': {
		riskLevel: 'read',
		description: 'Retrieve Machines',
	},
	'notebookExecutionEnvironments.notebookExecutionEnvironmentsNotebooksList': {
		riskLevel: 'read',
		description: 'Retrieve Notebooks by environment ID',
	},
	'notebookExecutionEnvironments.notebookExecutionEnvironmentsPatch': {
		riskLevel: 'write',
		description: 'Modify Notebook Execution Environments by notebook ID',
	},
	'notebookExecutionEnvironments.notebookExecutionEnvironmentsPortsCreate': {
		riskLevel: 'write',
		description: 'Create Ports by notebook ID',
	},
	'notebookExecutionEnvironments.notebookExecutionEnvironmentsPortsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete Ports by notebook ID',
	},
	'notebookExecutionEnvironments.notebookExecutionEnvironmentsPortsDelete2': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete ports by ID',
	},
	'notebookExecutionEnvironments.notebookExecutionEnvironmentsPortsList': {
		riskLevel: 'read',
		description: 'Retrieve Ports by notebook ID',
	},
	'notebookExecutionEnvironments.notebookExecutionEnvironmentsPortsPatch': {
		riskLevel: 'write',
		description: 'Modify Ports by notebook ID',
	},
	'notebookExecutionEnvironments.notebookExecutionEnvironmentsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve Notebook Execution Environments by notebook ID',
	},
	'notebookExecutionEnvironments.notebookExecutionEnvironmentsVersionsList': {
		riskLevel: 'read',
		description:
			'List Notebook Execution Environments versions by environment ID',
	},
	'notebookJobs.notebookJobsCancelCreate': {
		riskLevel: 'write',
		description: 'Cancel Notebook jobs by notebook schedule ID',
	},
	'notebookJobs.notebookJobsCreate': {
		riskLevel: 'write',
		description: 'Create Notebook jobs',
	},
	'notebookJobs.notebookJobsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete Notebook jobs by notebook schedule ID',
	},
	'notebookJobs.notebookJobsList': {
		riskLevel: 'read',
		description: 'Retrieve Notebook jobs',
	},
	'notebookJobs.notebookJobsManualRunCreate': {
		riskLevel: 'write',
		description: 'Create Manual Run',
	},
	'notebookJobs.notebookJobsPatch': {
		riskLevel: 'write',
		description: 'Modify Notebook jobs by notebook schedule ID',
	},
	'notebookJobs.notebookJobsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve Notebook jobs by notebook schedule ID',
	},
	'notebookJobs.notebookJobsRunHistoryList': {
		riskLevel: 'read',
		description: 'Retrieve Run history',
	},
	'notebookRevisions.notebookRevisionsCellsList': {
		riskLevel: 'read',
		description: 'Retrieve Cells by notebook ID',
	},
	'notebookRevisions.notebookRevisionsCreate': {
		riskLevel: 'write',
		description: 'Create Notebook Revisions by notebook ID',
	},
	'notebookRevisions.notebookRevisionsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete Notebook Revisions by notebook ID',
	},
	'notebookRevisions.notebookRevisionsDelete2': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete notebook revisions by ID',
	},
	'notebookRevisions.notebookRevisionsFromRevisionCloneCreate': {
		riskLevel: 'write',
		description: 'Create Clone by notebook ID',
	},
	'notebookRevisions.notebookRevisionsFromRevisionRestoreCreate': {
		riskLevel: 'write',
		description: 'Create Restore by notebook ID',
	},
	'notebookRevisions.notebookRevisionsPatch': {
		riskLevel: 'write',
		description: 'Modify Notebook Revisions by notebook ID',
	},
	'notebookRevisions.notebookRevisionsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve Notebook Revisions by notebook ID',
	},
	'notebookRevisions.notebookRevisionsRetrieve2': {
		riskLevel: 'read',
		description: 'Retrieve notebook revisions by ID',
	},
	'notebookRevisions.notebookRevisionsToFileList': {
		riskLevel: 'read',
		description: 'Retrieve To File by notebook ID',
	},
	'notebooks.notebookSharedRolesList': {
		riskLevel: 'read',
		description: 'Get the notebook access control list by notebook ID',
	},
	'notebooks.notebooksBatchClearCellsExecutionCountPatch': {
		riskLevel: 'write',
		description: 'Modify Batch Clear Cells Execution Count by notebook ID',
	},
	'notebooks.notebooksBulkLinkUseCaseCreate': {
		riskLevel: 'write',
		description: 'Create Bulk Link Use Case',
	},
	'notebooks.notebooksCellsBatchClearOutputPatch': {
		riskLevel: 'write',
		description: 'Modify Batch Clear Output by notebook ID',
	},
	'notebooks.notebooksCellsBatchCreateCreate': {
		riskLevel: 'write',
		description: 'Create Batch Create by notebook ID',
	},
	'notebooks.notebooksCellsBatchDeleteCreate': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Create Batch Delete by notebook ID',
	},
	'notebooks.notebooksCellsBatchUpdateMetadataPatch': {
		riskLevel: 'write',
		description: 'Modify Batch Update Metadata by notebook ID',
	},
	'notebooks.notebooksCellsBatchUpdateSourcesPatch': {
		riskLevel: 'write',
		description: 'Modify Batch Update Sources by notebook ID',
	},
	'notebooks.notebooksCellsCreate': {
		riskLevel: 'write',
		description: 'Create Cells by notebook ID',
	},
	'notebooks.notebooksCellsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete Cells by notebook ID',
	},
	'notebooks.notebooksCellsList': {
		riskLevel: 'read',
		description: 'Retrieve Cells by notebook ID',
	},
	'notebooks.notebooksCellsOutputPatch': {
		riskLevel: 'write',
		description: 'Modify Output by notebook ID',
	},
	'notebooks.notebooksCellsPatch': {
		riskLevel: 'write',
		description: 'Modify Cells by notebook ID',
	},
	'notebooks.notebooksCreate': {
		riskLevel: 'write',
		description: 'Create Notebooks',
	},
	'notebooks.notebooksDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete Notebooks by notebook ID',
	},
	'notebooks.notebooksFilterOptionsList': {
		riskLevel: 'read',
		description: 'Retrieve Filter Options',
	},
	'notebooks.notebooksFromFileCreate': {
		riskLevel: 'write',
		description: 'Create From File',
	},
	'notebooks.notebooksFromUrlCreate': {
		riskLevel: 'write',
		description: 'Create From URL',
	},
	'notebooks.notebooksList': {
		riskLevel: 'read',
		description: 'Retrieve Notebooks',
	},
	'notebooks.notebooksPatch': {
		riskLevel: 'write',
		description: 'Modify Notebooks by notebook ID',
	},
	'notebooks.notebooksReorderCellsPatch': {
		riskLevel: 'write',
		description: 'Modify Reorder Cells by notebook ID',
	},
	'notebooks.notebooksRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve Notebooks by notebook ID',
	},
	'notebooks.notebooksSharedRolesList': {
		riskLevel: 'read',
		description: 'Get access control lists',
	},
	'notebooks.notebooksStatePatch': {
		riskLevel: 'write',
		description: 'Modify State by notebook ID',
	},
	'notebooks.notebooksToCodespaceCreate': {
		riskLevel: 'write',
		description: 'Create To Codespace by notebook ID',
	},
	'notebooks.notebooksToFileList': {
		riskLevel: 'read',
		description: 'Retrieve To File by notebook ID',
	},
	'notificationChannelTemplates.notificationChannelTemplatesCreate': {
		riskLevel: 'write',
		description: 'Create a notification channel template.',
	},
	'notificationChannelTemplates.notificationChannelTemplatesDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a notification channel template by channel ID',
	},
	'notificationChannelTemplates.notificationChannelTemplatesList': {
		riskLevel: 'read',
		description: 'List notification channel templates.',
	},
	'notificationChannelTemplates.notificationChannelTemplatesPolicyTemplatesList':
		{
			riskLevel: 'read',
			description:
				'Retrieve list of all policy templates that are using this channel and are visible by channel ID',
		},
	'notificationChannelTemplates.notificationChannelTemplatesPut': {
		riskLevel: 'write',
		description: 'Update a notification channel template by channel ID',
	},
	'notificationChannelTemplates.notificationChannelTemplatesRelatedPoliciesList':
		{
			riskLevel: 'read',
			description:
				'Retrieve list of all policies that are created from this template and are visible by channel ID',
		},
	'notificationChannelTemplates.notificationChannelTemplatesRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a notification channel template by channel ID',
	},
	'notificationChannelTemplates.notificationChannelTemplatesSharedRolesList': {
		riskLevel: 'read',
		description: 'Get the channel template access control list by channel ID',
	},
	'notificationChannelTemplates.notificationChannelTemplatesSharedRolesPatchMany':
		{
			riskLevel: 'write',
			description: 'Update the channel template controls by channel ID',
		},
	'notificationEvents.notificationEventsList': {
		riskLevel: 'read',
		description: 'The list of event types and groups the user can include',
	},
	'ocrJobResources.ocrJobResourcesCreate': {
		riskLevel: 'write',
		description: 'Create an OCR job resource.',
	},
	'ocrJobResources.ocrJobResourcesErrorReportList': {
		riskLevel: 'read',
		description: 'Retrieve the OCR job error report by job resource ID',
	},
	'ocrJobResources.ocrJobResourcesErrorReportPutMany': {
		riskLevel: 'write',
		description: 'Save the OCR job error report by job resource ID',
	},
	'ocrJobResources.ocrJobResourcesJobProgressList': {
		riskLevel: 'read',
		description: 'Retrieve per-file OCR job progress by job resource ID',
	},
	'ocrJobResources.ocrJobResourcesJobStatusList': {
		riskLevel: 'read',
		description: 'Retrieve OCR job status by job resource ID',
	},
	'ocrJobResources.ocrJobResourcesList': {
		riskLevel: 'read',
		description: "Retrieve user's OCR job resources.",
	},
	'ocrJobResources.ocrJobResourcesRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve an OCR job resource by job resource ID',
	},
	'ocrJobResources.ocrJobResourcesStartCreate': {
		riskLevel: 'write',
		description: 'Create/start OCR job by job resource ID',
	},
	'organizations.organizationsJobsList': {
		riskLevel: 'read',
		description: 'List organization jobs by organization ID',
	},
	'organizations.organizationsList': {
		riskLevel: 'read',
		description: 'List organizations.',
	},
	'organizations.organizationsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve an organization by organization ID',
	},
	'organizations.organizationsUsersCreate': {
		riskLevel: 'write',
		description: 'Add user by organization ID',
	},
	'organizations.organizationsUsersList': {
		riskLevel: 'read',
		description: 'List organization users by organization ID',
	},
	'organizations.organizationsUsersPatch': {
		riskLevel: 'write',
		description: 'Patch an organization user by organization ID',
	},
	'organizations.organizationsUsersRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a user by organization ID',
	},
	'otel.otelLogsDeleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete all OpenTelemetry logs by entitytype',
	},
	'otel.otelLogsList': {
		riskLevel: 'read',
		description: 'Retrieve OpenTelemetry logs by entitytype',
	},
	'otel.otelLogsPodInfoList': {
		riskLevel: 'read',
		description: 'List pods and containers found by entitytype',
	},
	'otel.otelMetricsAutocollectedValuesList': {
		riskLevel: 'read',
		description:
			'Get aggregated values of OpenTelemetry metrics that DataRobot automatically collects by entitytype',
	},
	'otel.otelMetricsConfigsCreate': {
		riskLevel: 'write',
		description: 'Create an OpenTelemetry metric configuration by entitytype',
	},
	'otel.otelMetricsConfigsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete an OpenTelemetry metric configuration by entitytype',
	},
	'otel.otelMetricsConfigsList': {
		riskLevel: 'read',
		description: 'List the OpenTelemetry metric configurations by entitytype',
	},
	'otel.otelMetricsConfigsPatch': {
		riskLevel: 'write',
		description: 'Update an OpenTelemetry metric configuration by entitytype',
	},
	'otel.otelMetricsConfigsPutMany': {
		riskLevel: 'write',
		description:
			'Set all the OpenTelemetry metric configurations by entitytype',
	},
	'otel.otelMetricsConfigsRetrieve': {
		riskLevel: 'read',
		description: 'Get the OpenTelemetry metric configuration by entitytype',
	},
	'otel.otelMetricsConsumersList': {
		riskLevel: 'read',
		description: 'Retrieve resource consumers by entitytype',
	},
	'otel.otelMetricsDeleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete all OpenTelemetry metrics by entitytype',
	},
	'otel.otelMetricsPodInfoList': {
		riskLevel: 'read',
		description: 'Retrieve pod info by ID',
	},
	'otel.otelMetricsSummaryList': {
		riskLevel: 'read',
		description:
			'List reported OpenTelemetry metrics of the specified entity by entitytype',
	},
	'otel.otelMetricsValueOverTimeList': {
		riskLevel: 'read',
		description:
			'Get a single OpenTelemetry metric value of the specified entity over time by entitytype',
	},
	'otel.otelMetricsValuesList': {
		riskLevel: 'read',
		description:
			'Get OpenTelemetry metrics values of the specified entity over a single time by entitytype',
	},
	'otel.otelMetricsValuesOverTimeList': {
		riskLevel: 'read',
		description:
			'Get OpenTelemetry configured metrics values of the specified entity over time by entitytype',
	},
	'otel.otelMetricsValuesOverTimeSegmentsCreate': {
		riskLevel: 'write',
		description: 'Get OpenTelemetry metric values by entitytype',
	},
	'otel.otelMetricsValuesOverTimeSegmentsRetrieve': {
		riskLevel: 'read',
		description:
			'Get OpenTelemetry metric values, grouped by segment attribute by entitytype',
	},
	'otel.otelMetricsValuesSegmentsRetrieve': {
		riskLevel: 'read',
		description: 'Get OpenTelemetry metric values, grouped by entitytype',
	},
	'otel.otelStatsList': {
		riskLevel: 'read',
		description: 'Gets OTel statistics',
	},
	'otel.otelTracesDeleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete OpenTelemetry traces by entitytype',
	},
	'otel.tracingList': {
		riskLevel: 'read',
		description: 'List OpenTelemetry traces by entitytype',
	},
	'otel.tracingRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve the specified OpenTelemetry trace by entitytype',
	},
	'pinnedUsecases.pinnedUsecasesList': {
		riskLevel: 'read',
		description: 'Retrieve Pinned Usecases',
	},
	'pinnedUsecases.pinnedUsecasesPatchMany': {
		riskLevel: 'write',
		description: 'Modify Pinned Usecases',
	},
	'predictionServers.predictionServersList': {
		riskLevel: 'read',
		description: 'List prediction servers.',
	},
	'projects.computedTrainingPredictionsList': {
		riskLevel: 'read',
		description: 'Retrieve training predictions by project ID',
	},
	'projects.configureAndStartAutopilot': {
		riskLevel: 'write',
		description: 'Start modeling by project ID',
	},
	'projects.projectsAccessControlList': {
		riskLevel: 'read',
		description: 'Get the project access control list by project ID',
	},
	'projects.projectsAccessControlPatchMany': {
		riskLevel: 'write',
		description: "Update the project's access controls by project ID",
	},
	'projects.projectsAnomalyAssessmentRecordsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete the anomaly assessment record by project ID',
	},
	'projects.projectsAnomalyAssessmentRecordsExplanationsList': {
		riskLevel: 'read',
		description: 'Retrieve anomaly assessment record by project ID',
	},
	'projects.projectsAnomalyAssessmentRecordsList': {
		riskLevel: 'read',
		description: 'Retrieve anomaly assessment records by project ID',
	},
	'projects.projectsAnomalyAssessmentRecordsPredictionsPreviewList': {
		riskLevel: 'read',
		description: 'Retrieve predictions preview by project ID',
	},
	'projects.projectsAutopilotCreate': {
		riskLevel: 'write',
		description: 'Pause by project ID',
	},
	'projects.projectsAutopilotsCreate': {
		riskLevel: 'write',
		description: 'Start autopilot by project ID',
	},
	'projects.projectsBatchTypeTransformFeaturesCreate': {
		riskLevel: 'write',
		description:
			'Create multiple new features by changing the type of existing features by project ID',
	},
	'projects.projectsBatchTypeTransformFeaturesResultRetrieve': {
		riskLevel: 'read',
		description:
			'Retrieve the result of a batch variable type transformation by project ID',
	},
	'projects.projectsBiasMitigatedModelsCreate': {
		riskLevel: 'write',
		description: 'Add a request by project ID',
	},
	'projects.projectsBiasMitigatedModelsList': {
		riskLevel: 'read',
		description: 'List of bias mitigated models by project ID',
	},
	'projects.projectsBiasMitigationFeatureInfoCreateOne': {
		riskLevel: 'write',
		description: 'Submit a job by project ID',
	},
	'projects.projectsBiasMitigationFeatureInfoList': {
		riskLevel: 'read',
		description: 'Get bias mitigation data quality information by project ID',
	},
	'projects.projectsBiasVsAccuracyInsightsList': {
		riskLevel: 'read',
		description: 'List Bias vs Accuracy insights by project ID',
	},
	'projects.projectsBlenderModelsBlendCheckCreate': {
		riskLevel: 'write',
		description: 'Check if models can be blended by project ID',
	},
	'projects.projectsBlenderModelsCreate': {
		riskLevel: 'write',
		description: 'Create a blender by project ID',
	},
	'projects.projectsBlenderModelsList': {
		riskLevel: 'read',
		description: 'List all blenders by project ID',
	},
	'projects.projectsBlenderModelsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a blender by project ID',
	},
	'projects.projectsBlueprintsBlueprintChartList': {
		riskLevel: 'read',
		description: 'Retrieve a blueprint chart by blueprint id.',
	},
	'projects.projectsBlueprintsBlueprintDocsList': {
		riskLevel: 'read',
		description: 'Retrieve blueprint tasks documentation by project ID',
	},
	'projects.projectsBlueprintsJsonList': {
		riskLevel: 'read',
		description:
			'Retrieve the JSON representation of a datarobot blueprint by project ID',
	},
	'projects.projectsBlueprintsList': {
		riskLevel: 'read',
		description: 'List blueprints by project ID',
	},
	'projects.projectsBlueprintsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a blueprint by its ID.',
	},
	'projects.projectsCalendarEventsList': {
		riskLevel: 'read',
		description: 'List available calendar events by project ID',
	},
	'projects.projectsCombinedModelsList': {
		riskLevel: 'read',
		description: 'Retrieve all existing combined models by project ID',
	},
	'projects.projectsCombinedModelsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve an existing combined model by project ID',
	},
	'projects.projectsCombinedModelsSegmentsDownloadList': {
		riskLevel: 'read',
		description: 'Download Combined Model segments info by project ID',
	},
	'projects.projectsCombinedModelsSegmentsList': {
		riskLevel: 'read',
		description: 'Retrieve Combined Model segments info by project ID',
	},
	'projects.projectsCreate': {
		riskLevel: 'write',
		description: 'Create a project.',
	},
	'projects.projectsCrossSeriesPropertiesCreate': {
		riskLevel: 'write',
		description: 'Validate columns by project ID',
	},
	'projects.projectsDataSlicesList': {
		riskLevel: 'read',
		description: 'List paginated Data Slices by project ID',
	},
	'projects.projectsDatetimeModelsAccuracyOverTimePlotsList': {
		riskLevel: 'read',
		description: 'Retrieve the data by project ID',
	},
	'projects.projectsDatetimeModelsAccuracyOverTimePlotsMetadataList': {
		riskLevel: 'read',
		description: 'Retrieve the metadata by project ID',
	},
	'projects.projectsDatetimeModelsAccuracyOverTimePlotsPreviewList': {
		riskLevel: 'read',
		description: 'Retrieve the preview by project ID',
	},
	'projects.projectsDatetimeModelsAnomalyOverTimePlotsList': {
		riskLevel: 'read',
		description: 'Retrieve anomaly over time plots by ID',
	},
	'projects.projectsDatetimeModelsAnomalyOverTimePlotsMetadataList': {
		riskLevel: 'read',
		description: 'Retrieve metadata by ID',
	},
	'projects.projectsDatetimeModelsAnomalyOverTimePlotsPreviewList': {
		riskLevel: 'read',
		description: 'Retrieve preview by ID',
	},
	'projects.projectsDatetimeModelsBacktestStabilityPlotList': {
		riskLevel: 'read',
		description:
			'Retrieve a plot displaying the stability of the datetime model across by project ID',
	},
	'projects.projectsDatetimeModelsBacktestsCreate': {
		riskLevel: 'write',
		description:
			'Score all the available backtests of a datetime model by project ID',
	},
	'projects.projectsDatetimeModelsCreate': {
		riskLevel: 'write',
		description: 'Train a new datetime model by project ID',
	},
	'projects.projectsDatetimeModelsDatasetAccuracyOverTimePlotsMetadataList': {
		riskLevel: 'read',
		description:
			'Retrieve the metadata of the Accuracy Over Time (AOT) chart by project ID',
	},
	'projects.projectsDatetimeModelsDatasetAccuracyOverTimePlotsPreviewList': {
		riskLevel: 'read',
		description:
			'Retrieve a preview of the Accuracy Over Time (AOT) chart by project ID',
	},
	'projects.projectsDatetimeModelsDatasetAccuracyOverTimePlotsRetrieve': {
		riskLevel: 'read',
		description:
			'Retrieve the Accuracy Over Time (AOT) chart data by project ID',
	},
	'projects.projectsDatetimeModelsDatetimeTrendPlotsCreate': {
		riskLevel: 'write',
		description: 'Computes Datetime Trend plots by project ID',
	},
	'projects.projectsDatetimeModelsFeatureEffectsCreate': {
		riskLevel: 'write',
		description: 'Add a request by project ID',
	},
	'projects.projectsDatetimeModelsFeatureEffectsList': {
		riskLevel: 'read',
		description: 'Retrieve Feature Effects by project ID',
	},
	'projects.projectsDatetimeModelsFeatureEffectsMetadataList': {
		riskLevel: 'read',
		description:
			'Retrieve Feature Effects metadata for each backtest by project ID',
	},
	'projects.projectsDatetimeModelsForecastDistanceStabilityPlotList': {
		riskLevel: 'read',
		description:
			'Retrieve a plot displaying the stability of the time series model across by project ID',
	},
	'projects.projectsDatetimeModelsForecastVsActualPlotsList': {
		riskLevel: 'read',
		description: 'Retrieve forecast vs actual plots by ID',
	},
	'projects.projectsDatetimeModelsForecastVsActualPlotsMetadataList': {
		riskLevel: 'read',
		description: 'Retrieve metadata by ID',
	},
	'projects.projectsDatetimeModelsForecastVsActualPlotsPreviewList': {
		riskLevel: 'read',
		description: 'Retrieve preview by ID',
	},
	'projects.projectsDatetimeModelsFromModelCreate': {
		riskLevel: 'write',
		description: 'Retrain an existing datetime model by project ID',
	},
	'projects.projectsDatetimeModelsList': {
		riskLevel: 'read',
		description: 'List datetime partitioned project models by project ID',
	},
	'projects.projectsDatetimeModelsMulticlassFeatureEffectsCreate': {
		riskLevel: 'write',
		description: 'Compute feature effects by project ID',
	},
	'projects.projectsDatetimeModelsMulticlassFeatureEffectsList': {
		riskLevel: 'read',
		description: 'Retrieve feature effects by project ID',
	},
	'projects.projectsDatetimeModelsMultiseriesHistogramsList': {
		riskLevel: 'read',
		description: 'Retrieve the histograms by project ID',
	},
	'projects.projectsDatetimeModelsMultiseriesScoresCreate': {
		riskLevel: 'write',
		description: 'Request the computation of per-series scores by project ID',
	},
	'projects.projectsDatetimeModelsMultiseriesScoresFileList': {
		riskLevel: 'read',
		description: 'Retrieve the CSV file by project ID',
	},
	'projects.projectsDatetimeModelsMultiseriesScoresList': {
		riskLevel: 'read',
		description: 'List the scores per individual series by project ID',
	},
	'projects.projectsDatetimeModelsRetrieve': {
		riskLevel: 'read',
		description: 'Get datetime model by project ID',
	},
	'projects.projectsDatetimePartitioningCreate': {
		riskLevel: 'write',
		description:
			'Preview the fully specified datetime partitioning generated by the requested configuration by project ID',
	},
	'projects.projectsDatetimePartitioningList': {
		riskLevel: 'read',
		description: 'Retrieve datetime partitioning configuration by project ID',
	},
	'projects.projectsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a project by project ID',
	},
	'projects.projectsDeploymentReadyModelsCreate': {
		riskLevel: 'write',
		description: 'Prepare a model by project ID',
	},
	'projects.projectsDiscardedFeaturesList': {
		riskLevel: 'read',
		description: 'Get discarded features by project ID',
	},
	'projects.projectsDocumentPagesFileList': {
		riskLevel: 'read',
		description: 'Returns a file by project ID',
	},
	'projects.projectsDocumentTextExtractionSamplesList': {
		riskLevel: 'read',
		description:
			'Lists metadata on all computed document text extraction samples by project ID',
	},
	'projects.projectsDocumentThumbnailBinsList': {
		riskLevel: 'read',
		description:
			'Lists document thumbnail bins for every target value or range including the metadata for one by project ID',
	},
	'projects.projectsDocumentThumbnailSamplesList': {
		riskLevel: 'read',
		description: 'List all metadata by project ID',
	},
	'projects.projectsDocumentThumbnailsList': {
		riskLevel: 'read',
		description:
			'Returns a list of document thumbnail metadata elements by project ID',
	},
	'projects.projectsDocumentsDataQualityLogFileList': {
		riskLevel: 'read',
		description:
			'Retrieve a text file containing the documents data quality log by project ID',
	},
	'projects.projectsDocumentsDataQualityLogList': {
		riskLevel: 'read',
		description:
			'Retrieve the documents data quality log content by project ID',
	},
	'projects.projectsDuplicateImagesList': {
		riskLevel: 'read',
		description:
			'Get a list of duplicate images containing the number of occurrences of each by project ID',
	},
	'projects.projectsEureqaDistributionPlotRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve Eureqa model details plot by project ID',
	},
	'projects.projectsEureqaModelDetailRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve eureqa model detail by ID',
	},
	'projects.projectsEureqaModelsCreate': {
		riskLevel: 'write',
		description: 'Create a new model by project ID',
	},
	'projects.projectsEureqaModelsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve the pareto front by project ID',
	},
	'projects.projectsExternalScoresCreate': {
		riskLevel: 'write',
		description: 'Compute model scores by project ID',
	},
	'projects.projectsExternalScoresList': {
		riskLevel: 'read',
		description: 'The list of scores on prediction datasets by project ID',
	},
	'projects.projectsExternalTimeSeriesBaselineDataValidationJobsCreate': {
		riskLevel: 'write',
		description: 'Validate baseline data by project ID',
	},
	'projects.projectsExternalTimeSeriesBaselineDataValidationJobsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve the baseline validation job by project ID',
	},
	'projects.projectsFeatureAssociationFeaturelistsList': {
		riskLevel: 'read',
		description:
			'List all featurelists with feature association matrix availability flags by project ID',
	},
	'projects.projectsFeatureAssociationMatrixCreate': {
		riskLevel: 'write',
		description: 'Compute the feature association matrix by project ID',
	},
	'projects.projectsFeatureAssociationMatrixDetailsList': {
		riskLevel: 'read',
		description: 'Retrieval by project ID',
	},
	'projects.projectsFeatureAssociationMatrixList': {
		riskLevel: 'read',
		description:
			'Retrieve pairwise feature association statistics by project ID',
	},
	'projects.projectsFeatureDiscoveryDatasetDownloadList': {
		riskLevel: 'read',
		description: 'Download the project dataset by project ID',
	},
	'projects.projectsFeatureDiscoveryLogsDownloadList': {
		riskLevel: 'read',
		description:
			'Retrieve a text file containing the feature discovery log by project ID',
	},
	'projects.projectsFeatureDiscoveryLogsList': {
		riskLevel: 'read',
		description: 'Retrieve the feature discovery log content by project ID',
	},
	'projects.projectsFeatureDiscoveryRecipeSQLsDownloadList': {
		riskLevel: 'read',
		description: 'Download the feature discovery SQL recipe by project ID',
	},
	'projects.projectsFeatureDiscoveryRecipeSqlExportsCreate': {
		riskLevel: 'write',
		description: 'Generate the feature discovery SQL recipe by project ID',
	},
	'projects.projectsFeatureHistogramsRetrieve': {
		riskLevel: 'read',
		description: 'Get the feature histogram by project ID',
	},
	'projects.projectsFeatureLineagesRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve the Feature Discovery lineage by project ID',
	},
	'projects.projectsFeaturelistsCreate': {
		riskLevel: 'write',
		description: 'Create a new featurelist by project ID',
	},
	'projects.projectsFeaturelistsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a specified featurelist by project ID',
	},
	'projects.projectsFeaturelistsList': {
		riskLevel: 'read',
		description: 'List featurelists by project ID',
	},
	'projects.projectsFeaturelistsPatch': {
		riskLevel: 'write',
		description: 'Update an existing featurelist by project ID',
	},
	'projects.projectsFeaturelistsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a feature list by project ID',
	},
	'projects.projectsFeaturesFrequentValuesList': {
		riskLevel: 'read',
		description: 'Retrieve the frequent values information by project ID',
	},
	'projects.projectsFeaturesList': {
		riskLevel: 'read',
		description: 'List project features by project ID',
	},
	'projects.projectsFeaturesMetricsList': {
		riskLevel: 'read',
		description: 'List feature metrics by project ID',
	},
	'projects.projectsFeaturesMultiseriesPropertiesList': {
		riskLevel: 'read',
		description: 'Retrieve potential multiseries ID columns by project ID',
	},
	'projects.projectsFeaturesRetrieve': {
		riskLevel: 'read',
		description: 'Get a project feature by project ID',
	},
	'projects.projectsFrozenDatetimeModelsCreate': {
		riskLevel: 'write',
		description: 'Train a frozen datetime model by project ID',
	},
	'projects.projectsFrozenModelsCreate': {
		riskLevel: 'write',
		description: 'Train a new frozen model by project ID',
	},
	'projects.projectsFrozenModelsList': {
		riskLevel: 'read',
		description: 'List all frozen models by project ID',
	},
	'projects.projectsFrozenModelsRetrieve': {
		riskLevel: 'read',
		description: 'Look up a particular frozen model by project ID',
	},
	'projects.projectsGeometryFeaturePlotsCreate': {
		riskLevel: 'write',
		description: 'Create a map of one location feature by project ID',
	},
	'projects.projectsGeometryFeaturePlotsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a map of one location feature by project ID',
	},
	'projects.projectsImageActivationMapsList': {
		riskLevel: 'read',
		description: 'List all Image Activation Maps by project ID',
	},
	'projects.projectsImageBinsList': {
		riskLevel: 'read',
		description: 'List image bins and covers by project ID',
	},
	'projects.projectsImageEmbeddingsList': {
		riskLevel: 'read',
		description: 'List all Image Embeddings by project ID',
	},
	'projects.projectsImageSamplesList': {
		riskLevel: 'read',
		description: 'Retrieve image samples by ID',
	},
	'projects.projectsImagesDataQualityLogFileList': {
		riskLevel: 'read',
		description:
			'Retrieve a text file containing the images data quality log by project ID',
	},
	'projects.projectsImagesDataQualityLogList': {
		riskLevel: 'read',
		description: 'Retrieve the images data quality log content by project ID',
	},
	'projects.projectsImagesFileList': {
		riskLevel: 'read',
		description: 'Retrieve file by ID',
	},
	'projects.projectsImagesList': {
		riskLevel: 'read',
		description: 'Returns a list of image metadata elements by project ID',
	},
	'projects.projectsImagesRetrieve': {
		riskLevel: 'read',
		description: 'Returns a single image metadata by project ID',
	},
	'projects.projectsIncrementalLearningModelsFromModelCreate': {
		riskLevel: 'write',
		description:
			'Train a new incremental learning model based on an existing model and external data, that was not by project ID',
	},
	'projects.projectsJobsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Cancel a job by project ID',
	},
	'projects.projectsJobsList': {
		riskLevel: 'read',
		description: 'List project jobs by project ID',
	},
	'projects.projectsJobsRetrieve': {
		riskLevel: 'read',
		description: 'Get a job by project ID',
	},
	'projects.projectsList': {
		riskLevel: 'read',
		description: 'List projects.',
	},
	'projects.projectsModelJobsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Cancel a modeling job by project ID',
	},
	'projects.projectsModelJobsList': {
		riskLevel: 'read',
		description: 'List modeling jobs by project ID',
	},
	'projects.projectsModelJobsRetrieve': {
		riskLevel: 'read',
		description: 'Look up a specific modeling job by project ID',
	},
	'projects.projectsModelRecordsList': {
		riskLevel: 'read',
		description: 'Retrieve model records, supports filtering by project ID',
	},
	'projects.projectsModelingFeaturelistsCreate': {
		riskLevel: 'write',
		description: 'Create a new modeling featurelist by project ID',
	},
	'projects.projectsModelingFeaturelistsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a specified modeling featurelist by project ID',
	},
	'projects.projectsModelingFeaturelistsList': {
		riskLevel: 'read',
		description: 'List all modeling featurelists by project ID',
	},
	'projects.projectsModelingFeaturelistsPatch': {
		riskLevel: 'write',
		description: 'Update an existing modeling featurelist by project ID',
	},
	'projects.projectsModelingFeaturelistsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single modeling featurelist by ID by project ID',
	},
	'projects.projectsModelingFeaturesFromDiscardedFeaturesCreate': {
		riskLevel: 'write',
		description: 'Restore discarded time series features by project ID',
	},
	'projects.projectsModelingFeaturesList': {
		riskLevel: 'read',
		description: 'List project modeling features by project ID',
	},
	'projects.projectsModelingFeaturesRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve project modeling feature by project ID',
	},
	'projects.projectsModelsAdvancedTuningCreate': {
		riskLevel: 'write',
		description: 'Create advanced tuning by ID',
	},
	'projects.projectsModelsAdvancedTuningParametersList': {
		riskLevel: 'read',
		description:
			'Retrieve information about all advanced tuning parameters available by project ID',
	},
	'projects.projectsModelsAnomalyAssessmentInitializationCreate': {
		riskLevel: 'write',
		description: 'Calculate the anomaly assessment insight by project ID',
	},
	'projects.projectsModelsAnomalyInsightsFileList': {
		riskLevel: 'read',
		description: 'Retrieve a CSV file of the raw data displayed by project ID',
	},
	'projects.projectsModelsAnomalyInsightsTableList': {
		riskLevel: 'read',
		description: 'Retrieve a table of the raw data displayed by project ID',
	},
	'projects.projectsModelsBlueprintChartList': {
		riskLevel: 'read',
		description: 'Retrieve a reduced model blueprint chart by model id.',
	},
	'projects.projectsModelsBlueprintDocsList': {
		riskLevel: 'read',
		description: 'Retrieve task documentation by project ID',
	},
	'projects.projectsModelsClusterInsightsCreate': {
		riskLevel: 'write',
		description: 'Compute Cluster Insights by project ID',
	},
	'projects.projectsModelsClusterInsightsDownloadList': {
		riskLevel: 'read',
		description: 'Download Cluster Insights result by project ID',
	},
	'projects.projectsModelsClusterInsightsList': {
		riskLevel: 'read',
		description: 'Retrieve Cluster Insights by project ID',
	},
	'projects.projectsModelsClusterNamesList': {
		riskLevel: 'read',
		description: 'Retrieve cluster names assigned by project ID',
	},
	'projects.projectsModelsClusterNamesPatchMany': {
		riskLevel: 'write',
		description: 'Update cluster names assigned by project ID',
	},
	'projects.projectsModelsConfusionChartsClassDetailsList': {
		riskLevel: 'read',
		description:
			'Calculates and sends frequency of class in distributed among other classes by project ID',
	},
	'projects.projectsModelsConfusionChartsList': {
		riskLevel: 'read',
		description: 'Retrieve all available confusion charts by project ID',
	},
	'projects.projectsModelsConfusionChartsMetadataList': {
		riskLevel: 'read',
		description: 'Retrieve metadata by project ID',
	},
	'projects.projectsModelsConfusionChartsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve the confusion chart data by project ID',
	},
	'projects.projectsModelsCreate': {
		riskLevel: 'write',
		description: 'Train a new model by project ID',
	},
	'projects.projectsModelsCrossClassAccuracyScoresCreate': {
		riskLevel: 'write',
		description: 'Start Cross Class Accuracy calculations by project ID',
	},
	'projects.projectsModelsCrossClassAccuracyScoresList': {
		riskLevel: 'read',
		description: 'List Cross Class Accuracy scores by project ID',
	},
	'projects.projectsModelsCrossValidationCreate': {
		riskLevel: 'write',
		description: 'Run cross validation by project ID',
	},
	'projects.projectsModelsCrossValidationScoresList': {
		riskLevel: 'read',
		description: 'Get cross validation scores by project ID',
	},
	'projects.projectsModelsDataDisparityInsightsCreate': {
		riskLevel: 'write',
		description: 'Start insight calculations by project ID',
	},
	'projects.projectsModelsDataDisparityInsightsList': {
		riskLevel: 'read',
		description: 'Get Cross Class Data Disparity results by project ID',
	},
	'projects.projectsModelsDatasetConfusionChartsClassDetailsList': {
		riskLevel: 'read',
		description:
			'Calculate and sends frequency of class in distributed among other classes by project ID',
	},
	'projects.projectsModelsDatasetConfusionChartsList': {
		riskLevel: 'read',
		description:
			'List of Confusion Charts objects on external datasets by project ID',
	},
	'projects.projectsModelsDatasetConfusionChartsMetadataList': {
		riskLevel: 'read',
		description: 'Retrieve metadata by ID',
	},
	'projects.projectsModelsDatasetConfusionChartsRetrieve': {
		riskLevel: 'read',
		description:
			'Retrieve Confusion Chart objects on external datasets by project ID',
	},
	'projects.projectsModelsDatasetLiftChartsList': {
		riskLevel: 'read',
		description:
			'Retrieve List of Lift chart data on prediction datasets by project ID',
	},
	'projects.projectsModelsDatasetMulticlassLiftChartsList': {
		riskLevel: 'read',
		description:
			'Retrieve List of Multiclass Lift chart data on prediction datasets by project ID',
	},
	'projects.projectsModelsDatasetResidualsChartsList': {
		riskLevel: 'read',
		description: 'The list of residuals chart objects by project ID',
	},
	'projects.projectsModelsDatasetRocCurvesList': {
		riskLevel: 'read',
		description:
			'List of ROC curve objects on prediction datasets for a project with filtering option by DEPRECATED by project ID',
	},
	'projects.projectsModelsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a model by project ID',
	},
	'projects.projectsModelsFairnessInsightsCreate': {
		riskLevel: 'write',
		description: 'Create fairness insights by ID',
	},
	'projects.projectsModelsFairnessInsightsList': {
		riskLevel: 'read',
		description: 'List calculated Per Class Bias insights by project ID',
	},
	'projects.projectsModelsFeatureEffectsCreate': {
		riskLevel: 'write',
		description: 'Create feature effects by ID',
	},
	'projects.projectsModelsFeatureEffectsList': {
		riskLevel: 'read',
		description: 'Retrieve feature effects by ID',
	},
	'projects.projectsModelsFeatureEffectsMetadataList': {
		riskLevel: 'read',
		description: 'Retrieve Feature Effects metadata by project ID',
	},
	'projects.projectsModelsFeatureImpactCreate': {
		riskLevel: 'write',
		description: 'Create feature impact by ID',
	},
	'projects.projectsModelsFeatureImpactList': {
		riskLevel: 'read',
		description: 'Retrieve feature impact scores by project ID',
	},
	'projects.projectsModelsFeatureListsClusterInsightsList': {
		riskLevel: 'read',
		description: 'Retrieve cluster insights by ID',
	},
	'projects.projectsModelsFeaturesList': {
		riskLevel: 'read',
		description: 'List the features used by project ID',
	},
	'projects.projectsModelsFromModelCreate': {
		riskLevel: 'write',
		description: 'Retrain a model by project ID',
	},
	'projects.projectsModelsGridSearchScoresList': {
		riskLevel: 'read',
		description: 'Retrieve grid search scores by project ID',
	},
	'projects.projectsModelsImageActivationMapsCreate': {
		riskLevel: 'write',
		description:
			'Request the computation of image activation maps by project ID',
	},
	'projects.projectsModelsImageActivationMapsList': {
		riskLevel: 'read',
		description: 'Retrieve Image Activation Maps by project ID',
	},
	'projects.projectsModelsImageEmbeddingsCreate': {
		riskLevel: 'write',
		description: 'Request the computation of image embeddings by project ID',
	},
	'projects.projectsModelsImageEmbeddingsList': {
		riskLevel: 'read',
		description: 'Retrieve ImageEmbeddings by project ID',
	},
	'projects.projectsModelsLabelwiseRocCurvesList': {
		riskLevel: 'read',
		description: 'Retrieve labelwise ROC curves by project ID',
	},
	'projects.projectsModelsLiftChartList': {
		riskLevel: 'read',
		description: 'Retrieve all available lift charts by project ID',
	},
	'projects.projectsModelsLiftChartRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve the lift chart data by project ID',
	},
	'projects.projectsModelsList': {
		riskLevel: 'read',
		description: 'List project models by project ID',
	},
	'projects.projectsModelsLogsList': {
		riskLevel: 'read',
		description: 'Retrieve an archive (tar by project ID',
	},
	'projects.projectsModelsMissingReportList': {
		riskLevel: 'read',
		description:
			"Retrieve a summary of how the model's subtasks handle missing values by project ID",
	},
	'projects.projectsModelsMulticlassFeatureEffectsCreate': {
		riskLevel: 'write',
		description: 'Create multiclass feature effects by ID',
	},
	'projects.projectsModelsMulticlassFeatureEffectsList': {
		riskLevel: 'read',
		description: 'Retrieve multiclass feature effects by ID',
	},
	'projects.projectsModelsMulticlassFeatureImpactList': {
		riskLevel: 'read',
		description: 'Retrieve multiclass feature impact by ID',
	},
	'projects.projectsModelsMulticlassLiftChartList': {
		riskLevel: 'read',
		description: 'Retrieve multiclass lift chart by ID',
	},
	'projects.projectsModelsMulticlassLiftChartRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve the multiclass lift chart data by project ID',
	},
	'projects.projectsModelsMultilabelLiftChartsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve labelwise lift charts by project ID',
	},
	'projects.projectsModelsNumIterationsTrainedList': {
		riskLevel: 'read',
		description: 'Get number of iterations trained by project ID',
	},
	'projects.projectsModelsParametersList': {
		riskLevel: 'read',
		description: 'Retrieve model parameters by project ID',
	},
	'projects.projectsModelsPatch': {
		riskLevel: 'write',
		description: "Update a model's attributes by project ID",
	},
	'projects.projectsModelsPredictionExplanationsInitializationCreate': {
		riskLevel: 'write',
		description:
			'Create a new prediction explanations initialization by project ID',
	},
	'projects.projectsModelsPredictionExplanationsInitializationDeleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete an existing PredictionExplanationsInitialization by project ID',
	},
	'projects.projectsModelsPredictionExplanationsInitializationList': {
		riskLevel: 'read',
		description:
			'Retrieve the current PredictionExplanationsInitialization by project ID',
	},
	'projects.projectsModelsPredictionIntervalsCreate': {
		riskLevel: 'write',
		description: 'Calculate prediction intervals by project ID',
	},
	'projects.projectsModelsPredictionIntervalsList': {
		riskLevel: 'read',
		description:
			'Retrieve prediction intervals that are already calculated by project ID',
	},
	'projects.projectsModelsPrimeInfoList': {
		riskLevel: 'read',
		description: 'Check a Model for Prime Eligibility by project ID',
	},
	'projects.projectsModelsPrimeRulesetsCreate': {
		riskLevel: 'write',
		description: 'Create Rulesets by project ID',
	},
	'projects.projectsModelsPrimeRulesetsList': {
		riskLevel: 'read',
		description: 'List rulesets by project ID',
	},
	'projects.projectsModelsResidualsList': {
		riskLevel: 'read',
		description: 'Retrieve all residuals charts by project ID',
	},
	'projects.projectsModelsResidualsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve the residuals chart data by project ID',
	},
	'projects.projectsModelsRetrieve': {
		riskLevel: 'read',
		description: 'Get model by project ID',
	},
	'projects.projectsModelsRocCurveList': {
		riskLevel: 'read',
		description: 'Retrieve all available ROC curves by project ID',
	},
	'projects.projectsModelsRocCurveRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve the ROC curve data by project ID',
	},
	'projects.projectsModelsScoringCodeList': {
		riskLevel: 'read',
		description: 'Retrieve scoring code by project ID',
	},
	'projects.projectsModelsShapImpactCreate': {
		riskLevel: 'write',
		description: 'Create SHAP-based Feature Impact by project ID',
	},
	'projects.projectsModelsShapImpactList': {
		riskLevel: 'read',
		description: 'Retrieve Feature Impact for a model by project ID',
	},
	'projects.projectsModelsSupportedCapabilitiesList': {
		riskLevel: 'read',
		description: 'Get supported capabilities by project ID',
	},
	'projects.projectsModelsTrainingArtifactList': {
		riskLevel: 'read',
		description: 'Retrieve training artifact by ID by project ID',
	},
	'projects.projectsModelsWordCloudList': {
		riskLevel: 'read',
		description: 'Retrieve word cloud data by project ID',
	},
	'projects.projectsMulticategoricalInvalidFormatFileList': {
		riskLevel: 'read',
		description: 'Get file by project ID',
	},
	'projects.projectsMulticategoricalInvalidFormatList': {
		riskLevel: 'read',
		description: 'Retrieve multicategorical data quality log by project ID',
	},
	'projects.projectsMultiseriesIdsCrossSeriesPropertiesList': {
		riskLevel: 'read',
		description:
			'Retrieve eligible cross-series group-by columns by project ID',
	},
	'projects.projectsMultiseriesNamesList': {
		riskLevel: 'read',
		description: 'List the names of a multiseries project by project ID',
	},
	'projects.projectsMultiseriesPropertiesCreate': {
		riskLevel: 'write',
		description: 'Detect multiseries properties by project ID',
	},
	'projects.projectsOptimizedDatetimePartitioningsCreate': {
		riskLevel: 'write',
		description:
			'Create an optimized datetime partitioning configuration using the target by project ID',
	},
	'projects.projectsOptimizedDatetimePartitioningsDatetimePartitioningInputList':
		{
			riskLevel: 'read',
			description:
				'Retrieve the optimized datetime partitioning input by project ID',
		},
	'projects.projectsOptimizedDatetimePartitioningsDatetimePartitioningLogFileList':
		{
			riskLevel: 'read',
			description:
				'Retrieve a text file containing the datetime partitioning log by project ID',
		},
	'projects.projectsOptimizedDatetimePartitioningsDatetimePartitioningLogList':
		{
			riskLevel: 'read',
			description: 'Retrieve the datetime partitioning log by project ID',
		},
	'projects.projectsOptimizedDatetimePartitioningsList': {
		riskLevel: 'read',
		description:
			'Lists all created optimized datetime partitioning configurations by project ID',
	},
	'projects.projectsOptimizedDatetimePartitioningsRetrieve': {
		riskLevel: 'read',
		description:
			'Retrieve the optimized datetime partitioning configuration by project ID',
	},
	'projects.projectsPatch': {
		riskLevel: 'write',
		description: 'Update a project by project ID',
	},
	'projects.projectsPayoffMatricesCreate': {
		riskLevel: 'write',
		description: 'Create a payoff matrix by project ID',
	},
	'projects.projectsPayoffMatricesDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a payoff matrix by project ID',
	},
	'projects.projectsPayoffMatricesList': {
		riskLevel: 'read',
		description: 'List all payoff matrices by project ID',
	},
	'projects.projectsPayoffMatricesPut': {
		riskLevel: 'write',
		description: 'Update a payoff matrix by project ID',
	},
	'projects.projectsPredictJobsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Cancel a queued prediction job by project ID',
	},
	'projects.projectsPredictJobsList': {
		riskLevel: 'read',
		description: 'List all prediction jobs by project ID',
	},
	'projects.projectsPredictJobsRetrieve': {
		riskLevel: 'read',
		description: 'Look up a particular prediction job by project ID',
	},
	'projects.projectsPredictionDatasetsDataSourceUploadsCreate': {
		riskLevel: 'write',
		description: 'Upload a dataset by project ID',
	},
	'projects.projectsPredictionDatasetsDatasetUploadsCreate': {
		riskLevel: 'write',
		description: 'Create prediction dataset by project ID',
	},
	'projects.projectsPredictionDatasetsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a dataset that was uploaded by project ID',
	},
	'projects.projectsPredictionDatasetsFileUploadsCreate': {
		riskLevel: 'write',
		description: 'Upload a file by project ID',
	},
	'projects.projectsPredictionDatasetsList': {
		riskLevel: 'read',
		description: 'List prediction datasets uploaded by project ID',
	},
	'projects.projectsPredictionDatasetsRetrieve': {
		riskLevel: 'read',
		description: 'Get the metadata of a specific dataset by project ID',
	},
	'projects.projectsPredictionDatasetsUrlUploadsCreate': {
		riskLevel: 'write',
		description: 'Create URL uploads by ID',
	},
	'projects.projectsPredictionExplanationsCreate': {
		riskLevel: 'write',
		description: 'Create a new PredictionExplanations object ( by project ID',
	},
	'projects.projectsPredictionExplanationsList': {
		riskLevel: 'read',
		description: 'Retrieve stored Prediction Explanations by project ID',
	},
	'projects.projectsPredictionExplanationsRecordsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete saved Prediction Explanations by project ID',
	},
	'projects.projectsPredictionExplanationsRecordsList': {
		riskLevel: 'read',
		description: 'List PredictionExplanationsRecord objects by project ID',
	},
	'projects.projectsPredictionExplanationsRecordsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a PredictionExplanationsRecord object by project ID',
	},
	'projects.projectsPredictionsCreate': {
		riskLevel: 'write',
		description: 'Make new predictions by project ID',
	},
	'projects.projectsPredictionsList': {
		riskLevel: 'read',
		description: 'Get the list of prediction records by project ID',
	},
	'projects.projectsPredictionsMetadataList': {
		riskLevel: 'read',
		description: 'Get the list of prediction metadata records by project ID',
	},
	'projects.projectsPredictionsMetadataRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve metadata by project ID',
	},
	'projects.projectsPredictionsRetrieve': {
		riskLevel: 'read',
		description: 'Get a completed set of predictions by project ID',
	},
	'projects.projectsPrimeFilesCreate': {
		riskLevel: 'write',
		description: 'Create a Prime File by project ID',
	},
	'projects.projectsPrimeFilesDownloadList': {
		riskLevel: 'read',
		description: 'Download code by project ID',
	},
	'projects.projectsPrimeFilesList': {
		riskLevel: 'read',
		description: 'Get Prime files by project ID',
	},
	'projects.projectsPrimeFilesRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve metadata about a DataRobot Prime file by project ID',
	},
	'projects.projectsPrimeModelsCreate': {
		riskLevel: 'write',
		description: 'Create a Prime Model from a Ruleset by project ID',
	},
	'projects.projectsPrimeModelsList': {
		riskLevel: 'read',
		description: 'List all Prime models by project ID',
	},
	'projects.projectsPrimeModelsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve Prime model details by project ID',
	},
	'projects.projectsRatingTableModelsCreate': {
		riskLevel: 'write',
		description: 'Create new models by project ID',
	},
	'projects.projectsRatingTableModelsList': {
		riskLevel: 'read',
		description: 'List rating table models by project ID',
	},
	'projects.projectsRatingTableModelsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a rating table model by project ID',
	},
	'projects.projectsRatingTablesCreate': {
		riskLevel: 'write',
		description: 'Upload a modified rating table file by project ID',
	},
	'projects.projectsRatingTablesFileList': {
		riskLevel: 'read',
		description: 'Retrieve the rating table file by project ID',
	},
	'projects.projectsRatingTablesList': {
		riskLevel: 'read',
		description: 'List rating tables by project ID',
	},
	'projects.projectsRatingTablesPatch': {
		riskLevel: 'write',
		description: 'Update an uploaded rating table by project ID',
	},
	'projects.projectsRatingTablesRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve rating table information by project ID',
	},
	'projects.projectsRecommendedModelsList': {
		riskLevel: 'read',
		description: 'List recommended models by project ID',
	},
	'projects.projectsRecommendedModelsRecommendedModelList': {
		riskLevel: 'read',
		description: 'Get the recommended model by project ID',
	},
	'projects.projectsRelationshipQualityAssessmentsCreate': {
		riskLevel: 'write',
		description: 'Submit a relationship quality assessment job by project ID',
	},
	'projects.projectsRelationshipsConfigurationList': {
		riskLevel: 'read',
		description: 'Retrieve relationships configuration by project ID',
	},
	'projects.projectsRetrieve': {
		riskLevel: 'read',
		description: 'Get project by project ID',
	},
	'projects.projectsRuleFitFilesCreate': {
		riskLevel: 'write',
		description: 'Create a RuleFit code file by project ID',
	},
	'projects.projectsRuleFitFilesDownloadList': {
		riskLevel: 'read',
		description: 'Download RuleFit code by project ID',
	},
	'projects.projectsRuleFitFilesList': {
		riskLevel: 'read',
		description: 'Get RuleFit code files by project ID',
	},
	'projects.projectsRuleFitFilesRetrieve': {
		riskLevel: 'read',
		description: 'Get RuleFit code file information by project ID',
	},
	'projects.projectsSecondaryDatasetsConfigurationsCreate': {
		riskLevel: 'write',
		description: 'Create secondary dataset configurations by project ID',
	},
	'projects.projectsSecondaryDatasetsConfigurationsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Soft-delete a secondary dataset configuration by project ID',
	},
	'projects.projectsSecondaryDatasetsConfigurationsList': {
		riskLevel: 'read',
		description: 'List all secondary dataset configurations by project ID',
	},
	'projects.projectsSecondaryDatasetsConfigurationsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve secondary dataset configuration by ID by project ID',
	},
	'projects.projectsSegmentChampionPutMany': {
		riskLevel: 'write',
		description: 'Update champion model by project ID',
	},
	'projects.projectsSegmentationTaskJobResultsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve segmentation task statuses by project ID',
	},
	'projects.projectsSegmentationTasksCreate': {
		riskLevel: 'write',
		description: 'Create segmentation tasks by project ID',
	},
	'projects.projectsSegmentationTasksList': {
		riskLevel: 'read',
		description: 'List segmentation tasks by project ID',
	},
	'projects.projectsSegmentationTasksMappingsList': {
		riskLevel: 'read',
		description: 'Retrieve series ID by project ID',
	},
	'projects.projectsSegmentationTasksRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve segmentation task by project ID',
	},
	'projects.projectsSegmentsPatch': {
		riskLevel: 'write',
		description: 'Update child segment project by project ID',
	},
	'projects.projectsShapMatricesCreate': {
		riskLevel: 'write',
		description:
			'Calculate a matrix with SHAP-based prediction explanations scores by project ID',
	},
	'projects.projectsShapMatricesList': {
		riskLevel: 'read',
		description: 'List SHAP matrix records by project ID',
	},
	'projects.projectsShapMatricesRetrieve': {
		riskLevel: 'read',
		description:
			'Return matrix with SHAP-based prediction explanations scores by project ID',
	},
	'projects.projectsStatusList': {
		riskLevel: 'read',
		description: 'Check project status by project ID',
	},
	'projects.projectsTimeSeriesFeatureLogFileList': {
		riskLevel: 'read',
		description:
			'Retrieve a text file containing the time series project feature log by project ID',
	},
	'projects.projectsTimeSeriesFeatureLogList': {
		riskLevel: 'read',
		description:
			'Retrieve the feature derivation log content and log length by project ID',
	},
	'projects.projectsTrainingPredictionsCreate': {
		riskLevel: 'write',
		description: 'Submits a job by project ID',
	},
	'projects.projectsTypeTransformFeaturesCreate': {
		riskLevel: 'write',
		description:
			'Create a new feature by changing the type of an existing one by project ID',
	},
	'projects.trainingPredictionsList': {
		riskLevel: 'read',
		description: 'List training prediction jobs by project ID',
	},
	'quotaTemplates.quotaTemplatesList': {
		riskLevel: 'read',
		description: 'Retrieve Quota Templates',
	},
	'quotaTemplates.quotaTemplatesRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve Quota Templates by quota template ID',
	},
	'quotas.quotasCreate': {
		riskLevel: 'write',
		description: 'Create Quotas',
	},
	'quotas.quotasDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete Quotas by quota ID',
	},
	'quotas.quotasList': {
		riskLevel: 'read',
		description: 'Retrieve Quotas',
	},
	'quotas.quotasPatch': {
		riskLevel: 'write',
		description: 'Modify Quotas by quota ID',
	},
	'quotas.quotasRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve Quotas by quota ID',
	},
	'recipes.recipesDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Deletes the wrangling recipe by recipe ID',
	},
	'recipes.recipesDownsamplingPutMany': {
		riskLevel: 'write',
		description: 'Updates the downsampling by recipe ID',
	},
	'recipes.recipesFromDataStoreCreate': {
		riskLevel: 'write',
		description: 'Create a recipe and a data source',
	},
	'recipes.recipesFromDatasetCreate': {
		riskLevel: 'write',
		description: 'Create a recipe given dataset.',
	},
	'recipes.recipesFromRecipeCreate': {
		riskLevel: 'write',
		description: 'Clone given wrangling recipe.',
	},
	'recipes.recipesInputsList': {
		riskLevel: 'read',
		description: 'Gets inputs by recipe ID',
	},
	'recipes.recipesInputsPutMany': {
		riskLevel: 'write',
		description: 'Sets the input of the given recipe by recipe ID',
	},
	'recipes.recipesInsightsList': {
		riskLevel: 'read',
		description: 'Retrieve recipe insights by recipe ID',
	},
	'recipes.recipesList': {
		riskLevel: 'read',
		description: 'List recipes.',
	},
	'recipes.recipesOperationsPutMany': {
		riskLevel: 'write',
		description: 'Update the operations by recipe ID',
	},
	'recipes.recipesOperationsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a recipe operation details by recipe ID',
	},
	'recipes.recipesPatch': {
		riskLevel: 'write',
		description: 'Patched wrangling recipe by recipe ID',
	},
	'recipes.recipesPreviewCreate': {
		riskLevel: 'write',
		description: 'Start the job by recipe ID',
	},
	'recipes.recipesPreviewList': {
		riskLevel: 'read',
		description: 'Retrieve a wrangling preview by recipe ID',
	},
	'recipes.recipesRelationshipQualityAssessmentsCreate': {
		riskLevel: 'write',
		description: 'Submit a relationship quality assessment job by recipe ID',
	},
	'recipes.recipesRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a wrangling recipe by recipe ID',
	},
	'recipes.recipesSettingsPatchMany': {
		riskLevel: 'write',
		description: 'Updates recipe settings by recipe ID',
	},
	'recipes.recipesSqlCreate': {
		riskLevel: 'write',
		description: 'Build SQL query by recipe ID',
	},
	'recipes.recipesTimeseriesTransformationPlansCreate': {
		riskLevel: 'write',
		description: 'Generate a time series transformation plan by recipe ID',
	},
	'recipes.recipesTimeseriesTransformationPlansRetrieve': {
		riskLevel: 'read',
		description:
			'Retrieve generated time series transformation plan by recipe ID',
	},
	'registeredModels.registeredModelsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Archive a registered model by registered model ID',
	},
	'registeredModels.registeredModelsDeploymentsList': {
		riskLevel: 'read',
		description: 'List deployments associated by registered model ID',
	},
	'registeredModels.registeredModelsList': {
		riskLevel: 'read',
		description: 'List registered models.',
	},
	'registeredModels.registeredModelsPatch': {
		riskLevel: 'write',
		description: 'Update a registered model by registered model ID',
	},
	'registeredModels.registeredModelsRetrieve': {
		riskLevel: 'read',
		description:
			'Retrieve information about a registered model by registered model ID',
	},
	'registeredModels.registeredModelsSharedRolesList': {
		riskLevel: 'read',
		description:
			'Get the registered model access control list by registered model ID',
	},
	'registeredModels.registeredModelsSharedRolesPatchMany': {
		riskLevel: 'write',
		description: 'Update the registered model controls by registered model ID',
	},
	'registeredModels.registeredModelsVersionsDeploymentsList': {
		riskLevel: 'read',
		description: 'List all deployments associated by registered model ID',
	},
	'registeredModels.registeredModelsVersionsList': {
		riskLevel: 'read',
		description: "List the registered model's versions by registered model ID",
	},
	'registeredModels.registeredModelsVersionsRetrieve': {
		riskLevel: 'read',
		description: "Get the registered model's version by registered model ID",
	},
	'relationshipsConfigurations.relationshipsConfigurationsCreate': {
		riskLevel: 'write',
		description: 'Create a relationships configuration',
	},
	'relationshipsConfigurations.relationshipsConfigurationsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description:
			'Delete a relationships configuration by relationships configuration ID',
	},
	'relationshipsConfigurations.relationshipsConfigurationsPut': {
		riskLevel: 'write',
		description:
			'Replace a relationships configuration by relationships configuration ID',
	},
	'relationshipsConfigurations.relationshipsConfigurationsRetrieve': {
		riskLevel: 'read',
		description:
			'Retrieve a relationships configuration by relationships configuration ID',
	},
	'relationshipsConfigurations.relationshipsConfigurationsRetrieveExtended': {
		riskLevel: 'read',
		description:
			'Retrieve the relationships configuration by relationships configuration ID',
	},
	'remoteEvents.remoteEventsCreate': {
		riskLevel: 'write',
		description: 'Post a remote deployment event.',
	},
	'scheduledJobs.scheduledJobsList': {
		riskLevel: 'read',
		description:
			'List scheduled deployment batch prediction jobs a user can view',
	},
	'seatLicenseAllocations.seatLicenseAllocationsCreate': {
		riskLevel: 'write',
		description: 'Allocate seat licenses.',
	},
	'seatLicenseAllocations.seatLicenseAllocationsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a seat license allocation by allocation ID',
	},
	'seatLicenseAllocations.seatLicenseAllocationsEvaluateCreate': {
		riskLevel: 'write',
		description: 'Evaluate the seat license',
	},
	'seatLicenseAllocations.seatLicenseAllocationsList': {
		riskLevel: 'read',
		description: 'List seat license allocations.',
	},
	'seatLicenseAllocations.seatLicenseAllocationsPatch': {
		riskLevel: 'write',
		description: 'Update a seat license allocation by allocation ID',
	},
	'seatLicenseAllocations.seatLicenseAllocationsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a seat license allocation by allocation ID',
	},
	'secureConfigs.secureConfigsCreate': {
		riskLevel: 'write',
		description: 'Create a secure configuration.',
	},
	'secureConfigs.secureConfigsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete secure configuration by secure config ID',
	},
	'secureConfigs.secureConfigsList': {
		riskLevel: 'read',
		description: 'Retrieve a list of secure configurations.',
	},
	'secureConfigs.secureConfigsPatch': {
		riskLevel: 'write',
		description: 'Update a secure configuration by secure config ID',
	},
	'secureConfigs.secureConfigsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a secure configuration by secure config ID',
	},
	'secureConfigs.secureConfigsSharedRolesList': {
		riskLevel: 'read',
		description:
			'Get a list of users, groups, and organizations that have access by secure config ID',
	},
	'secureConfigs.secureConfigsSharedRolesPatchMany': {
		riskLevel: 'write',
		description: 'Share a secure configuration by secure config ID',
	},
	'secureConfigs.secureConfigsValuesList': {
		riskLevel: 'read',
		description: 'Retrieve a list of values by secure config ID',
	},
	'sparkSessions.sparkSessionsDeleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Stop wrangling session.',
	},
	'status.statusDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a task by status ID',
	},
	'status.statusList': {
		riskLevel: 'read',
		description: 'List tasks',
	},
	'status.statusRetrieve': {
		riskLevel: 'read',
		description: 'Get task status by status ID',
	},
	'stringEncryptions.stringEncryptionsCreate': {
		riskLevel: 'write',
		description: 'Encrypt a string',
	},
	'tenantUsageResources.tenantUsageResourcesActiveTenantsList': {
		riskLevel: 'read',
		description: 'Get active tenants',
	},
	'tenantUsageResources.tenantUsageResourcesActiveUsersList': {
		riskLevel: 'read',
		description: 'Get active users',
	},
	'tenantUsageResources.tenantUsageResourcesCategoriesList': {
		riskLevel: 'read',
		description: 'Get the available resource categories.',
	},
	'tenantUsageResources.tenantUsageResourcesDeploymentsList': {
		riskLevel: 'read',
		description: 'Get usage resources grouped by deployment ID.',
	},
	'tenantUsageResources.tenantUsageResourcesExportList': {
		riskLevel: 'read',
		description: 'Export usage',
	},
	'tenantUsageResources.tenantUsageResourcesList': {
		riskLevel: 'read',
		description: 'Get usage resources',
	},
	'tenantUsageResources.tenantUsageResourcesUsageOverTimeList': {
		riskLevel: 'read',
		description: 'Get daily usage over time',
	},
	'tenants.tenantsActiveUsersList': {
		riskLevel: 'read',
		description: 'Get tenant active users by tenant ID',
	},
	'tenants.tenantsResourceCategoriesList': {
		riskLevel: 'read',
		description: 'Get the available resource categories by tenant ID',
	},
	'tenants.tenantsUsageExportList': {
		riskLevel: 'read',
		description: 'Export tenant usage by tenant ID',
	},
	'tenants.tenantsUsageList': {
		riskLevel: 'read',
		description: 'Get tenant usage by tenant ID',
	},
	'tenants.tenantsUtilizationResourcesExportList': {
		riskLevel: 'read',
		description: 'Export CPU/GPU resource utilization.',
	},
	'tenants.tenantsUtilizationResourcesList': {
		riskLevel: 'read',
		description: 'Get CPU/GPU resource utilization.',
	},
	'tenants.tenantsUtilizationResourcesRetrieve': {
		riskLevel: 'read',
		description: 'Get CPU/GPU resource utilization by resourcetype',
	},
	'usageDataExports.usageDataExportsCreate': {
		riskLevel: 'write',
		description: 'Create a customer usage data artifact request',
	},
	'usageDataExports.usageDataExportsRetrieve': {
		riskLevel: 'read',
		description:
			'Retrieve a prepared customer usage data artifact by artifact ID',
	},
	'usageDataExports.usageDataExportsSupportedEventsList': {
		riskLevel: 'read',
		description: 'Describe supported available audit events with',
	},
	'useCases.useCasesAllNotebooks': {
		riskLevel: 'read',
		description: 'Get the list of the notebooks',
	},
	'useCases.useCasesAllResourcesList': {
		riskLevel: 'read',
		description: 'Get the list of the references associated',
	},
	'useCases.useCasesApplicationsList': {
		riskLevel: 'read',
		description: 'Get the list of the applications associated by use case ID',
	},
	'useCases.useCasesCreate': {
		riskLevel: 'write',
		description: 'Get a use case.',
	},
	'useCases.useCasesCreateOne': {
		riskLevel: 'write',
		description: 'Link entity by use case ID',
	},
	'useCases.useCasesCustomApplicationsList': {
		riskLevel: 'read',
		description:
			'The list of the custom applications referenced by a use case by use case ID',
	},
	'useCases.useCasesDataList': {
		riskLevel: 'read',
		description: 'List datasets by use case ID',
	},
	'useCases.useCasesDatasetsList': {
		riskLevel: 'read',
		description: 'Get the list of the datasets associated by use case ID',
	},
	'useCases.useCasesDatasetsRetrieve': {
		riskLevel: 'read',
		description: 'Get the dataset details by use case ID',
	},
	'useCases.useCasesDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a Use Case by use case ID',
	},
	'useCases.useCasesDeploymentsList': {
		riskLevel: 'read',
		description: 'Get the deployments associated by use case ID',
	},
	'useCases.useCasesFilesList': {
		riskLevel: 'read',
		description: 'Get the list of the catalog files associated by use case ID',
	},
	'useCases.useCasesFilesRetrieve': {
		riskLevel: 'read',
		description: 'Get the file details by use case ID',
	},
	'useCases.useCasesFilterMetadataList': {
		riskLevel: 'read',
		description:
			'Get filtering metadata information from Use Cases associated by use case ID',
	},
	'useCases.useCasesList': {
		riskLevel: 'read',
		description: 'Retrieve the list of use cases.',
	},
	'useCases.useCasesModelsForComparisonList': {
		riskLevel: 'read',
		description:
			'Gets a list of models from projects associated with a Use Case by use case ID',
	},
	'useCases.useCasesMultilinkCreate': {
		riskLevel: 'write',
		description: 'Link multiple entities by use case ID',
	},
	'useCases.useCasesNotebooksList': {
		riskLevel: 'read',
		description: 'Get the list of the notebooks associated by use case ID',
	},
	'useCases.useCasesPatch': {
		riskLevel: 'write',
		description: 'Update a Use Case by use case ID',
	},
	'useCases.useCasesPlaygroundsList': {
		riskLevel: 'read',
		description: 'Get the list of the playgrounds associated by use case ID',
	},
	'useCases.useCasesProjectsList': {
		riskLevel: 'read',
		description: 'Get the list of the projects associated by use case ID',
	},
	'useCases.useCasesReferenceDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Remove a related entity by use case ID',
	},
	'useCases.useCasesReferenceMove': {
		riskLevel: 'write',
		description: 'Move entity from one Use Case by use case ID',
	},
	'useCases.useCasesRegisteredModelsList': {
		riskLevel: 'read',
		description:
			'The list of the registered models referenced by a use case by use case ID',
	},
	'useCases.useCasesResourcesList': {
		riskLevel: 'read',
		description: 'Get the list of the references associated by use case ID',
	},
	'useCases.useCasesRetrieve': {
		riskLevel: 'read',
		description: 'Get a use case by use case ID',
	},
	'useCases.useCasesSharedRolesList': {
		riskLevel: 'read',
		description: "Get the use case's access control list by use case ID",
	},
	'useCases.useCasesSharedRolesPatchMany': {
		riskLevel: 'write',
		description: "Update the Use Case's access control list by use case ID",
	},
	'useCases.useCasesVectorDatabasesList': {
		riskLevel: 'read',
		description: 'Get a list of vector databases associated by use case ID',
	},
	'useCases.useCasesVectorDatabasesRelatedCustomModelsList': {
		riskLevel: 'read',
		description:
			'Get a list of custom models that are associated by use case ID',
	},
	'useCases.useCasesVectorDatabasesRelatedDeploymentsList': {
		riskLevel: 'read',
		description: 'Get a list of deployments that are associated by use case ID',
	},
	'useCases.useCasesVectorDatabasesRelatedRegisteredModelsList': {
		riskLevel: 'read',
		description:
			'Get a list of registered models that are associated by use case ID',
	},
	'useCasesWithShortenedInfo.useCasesWithShortenedInfoList': {
		riskLevel: 'read',
		description: 'Use an endpoint',
	},
	'userBlueprints.userBlueprintsCreate': {
		riskLevel: 'write',
		description: 'Create a user blueprint.',
	},
	'userBlueprints.userBlueprintsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a user blueprint by user blueprint ID',
	},
	'userBlueprints.userBlueprintsDeleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete user blueprints.',
	},
	'userBlueprints.userBlueprintsFromBlueprintIdCreate': {
		riskLevel: 'write',
		description: 'Clone a blueprint',
	},
	'userBlueprints.userBlueprintsFromCustomTaskVersionIdCreate': {
		riskLevel: 'write',
		description: 'Create a user blueprint',
	},
	'userBlueprints.userBlueprintsFromUserBlueprintIdCreate': {
		riskLevel: 'write',
		description: 'Clone a user blueprint.',
	},
	'userBlueprints.userBlueprintsList': {
		riskLevel: 'read',
		description: 'List user blueprints.',
	},
	'userBlueprints.userBlueprintsPatch': {
		riskLevel: 'write',
		description: 'Update a user blueprint by user blueprint ID',
	},
	'userBlueprints.userBlueprintsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a user blueprint by user blueprint ID',
	},
	'userBlueprints.userBlueprintsSharedRolesList': {
		riskLevel: 'read',
		description:
			'Get the list of users, groups and organizations by user blueprint ID',
	},
	'userBlueprints.userBlueprintsSharedRolesPatchMany': {
		riskLevel: 'write',
		description: 'Share a user blueprint by user blueprint ID',
	},
	'userNotifications.userNotificationsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete user notification by user notification ID',
	},
	'userNotifications.userNotificationsDeleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete all user notifications',
	},
	'userNotifications.userNotificationsList': {
		riskLevel: 'read',
		description: 'The list of user notifications.',
	},
	'userNotifications.userNotificationsPatch': {
		riskLevel: 'write',
		description: 'Mark as read by user notification ID',
	},
	'userNotifications.userNotificationsPatchMany': {
		riskLevel: 'write',
		description: 'Mark all as read',
	},
	'users.usersCreate': {
		riskLevel: 'write',
		description: 'Create a User and add them',
	},
	'users.usersInviteCreate': {
		riskLevel: 'write',
		description: 'Invite multiple users by email',
	},
	'users.usersList': {
		riskLevel: 'read',
		description: 'Retrieve a list of existing users.',
	},
	'users.usersRateLimitUsageDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete rate limit usage by ID',
	},
	'users.usersRateLimitUsageDeleteMany': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Reset resource usage by user ID',
	},
	'users.usersRateLimitUsageList': {
		riskLevel: 'read',
		description: 'List resource usage by user ID',
	},
	'users.usersRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a single user by id by user ID',
	},
	'valueTrackers.valueTrackersActivitiesList': {
		riskLevel: 'read',
		description:
			'Retrieve the activities of a value tracker by value tracker ID',
	},
	'valueTrackers.valueTrackersAttachmentsCreate': {
		riskLevel: 'write',
		description: 'Attach the list of resources by value tracker ID',
	},
	'valueTrackers.valueTrackersAttachmentsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Removes a resource by value tracker ID',
	},
	'valueTrackers.valueTrackersAttachmentsList': {
		riskLevel: 'read',
		description: 'Get the list of resources attached by value tracker ID',
	},
	'valueTrackers.valueTrackersAttachmentsRetrieve': {
		riskLevel: 'read',
		description: 'Get a resource that is attached by value tracker ID',
	},
	'valueTrackers.valueTrackersCreate': {
		riskLevel: 'write',
		description: 'Create a new value tracker.',
	},
	'valueTrackers.valueTrackersDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a value tracker by value tracker ID',
	},
	'valueTrackers.valueTrackersList': {
		riskLevel: 'read',
		description: 'List value trackers the requesting user has access to.',
	},
	'valueTrackers.valueTrackersPatch': {
		riskLevel: 'write',
		description: 'Update a value tracker by value tracker ID',
	},
	'valueTrackers.valueTrackersRealizedValueOverTimeList': {
		riskLevel: 'read',
		description: 'Retrieve realized value information by value tracker ID',
	},
	'valueTrackers.valueTrackersRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a value tracker by value tracker ID',
	},
	'valueTrackers.valueTrackersSharedRolesList': {
		riskLevel: 'read',
		description:
			'Get the list of users, groups and organizations that have access by value tracker ID',
	},
	'valueTrackers.valueTrackersSharedRolesPatchMany': {
		riskLevel: 'write',
		description: 'Share a value tracker by value tracker ID',
	},
	'version.versionList': {
		riskLevel: 'read',
		description: 'Retrieve version information.',
	},
} satisfies RequiredPluginEndpointMeta<typeof datarobotEndpointsNested>;

function mergeErrorHandlers(
	builtIn: CorsairErrorHandler,
	overrides?: CorsairErrorHandler,
): CorsairErrorHandler {
	const { DEFAULT: builtInDefault, ...builtInRest } = builtIn;
	const { DEFAULT: overrideDefault, ...overrideRest } = overrides ?? {};
	return {
		...builtInRest,
		...overrideRest,
		DEFAULT: overrideDefault ?? builtInDefault,
	};
}

const defaultAuthType: AuthTypes = 'api_key' as const;

export const datarobotAuthConfig = {
	api_key: {
		account: ['one'] as const,
	},
} as const satisfies PluginAuthConfig;

export type BaseDatarobotPlugin<T extends DatarobotPluginOptions> =
	CorsairPlugin<
		'datarobot',
		typeof DatarobotSchema,
		typeof datarobotEndpointsNested,
		{},
		T,
		typeof defaultAuthType,
		typeof datarobotAuthConfig
	>;

export type InternalDatarobotPlugin =
	BaseDatarobotPlugin<DatarobotPluginOptions>;
export type ExternalDatarobotPlugin<T extends DatarobotPluginOptions> =
	BaseDatarobotPlugin<T>;

export function datarobot<const T extends DatarobotPluginOptions>(
	incomingOptions: DatarobotPluginOptions & T = {} as DatarobotPluginOptions &
		T,
): ExternalDatarobotPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? defaultAuthType,
	};
	return {
		id: 'datarobot',
		schema: DatarobotSchema,
		options,
		hooks: options.hooks,
		endpoints: datarobotEndpointsNested,
		webhooks: {},
		endpointMeta: datarobotEndpointMeta,
		endpointSchemas: datarobotEndpointSchemas,
		authConfig: datarobotAuthConfig,
		pluginWebhookMatcher: () => false,
		errorHandlers: mergeErrorHandlers(errorHandlers, options.errorHandlers),
		keyBuilder: async (ctx: DatarobotKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) {
				return options.key;
			}
			if (source === 'endpoint' && ctx.authType === 'api_key') {
				const key = await ctx.keys.get_api_key();
				if (!key) {
					throw new AuthMissingError('datarobot', 'api_key');
				}
				return key;
			}
			throw new AuthMissingError('datarobot', 'api_key');
		},
	} satisfies InternalDatarobotPlugin;
}

export { DatarobotAPIError, makeDatarobotRequest } from './client';
export type {
	DatarobotEndpointInputs,
	DatarobotEndpointOutputs,
} from './endpoints/types';
export {
	DatarobotEndpointInputSchemas,
	DatarobotEndpointOutputSchemas,
} from './endpoints/types';
