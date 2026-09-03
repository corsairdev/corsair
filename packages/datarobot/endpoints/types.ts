import { z } from 'zod';

/** Loose object so live DataRobot payloads keep undocumented fields. */
export const DatarobotObjectSchema = z.object({}).loose();
export const DatarobotListSchema = z
	.object({
		count: z.number().optional(),
		next: z.string().nullable().optional(),
		previous: z.string().nullable().optional(),
		data: z.array(z.unknown().optional()).optional(),
	})
	.loose();

// batchPredictions_create POST /api/v2/batchPredictions/
export const BatchPredictionsCreateInputSchema = z.object({}).loose();
export type BatchPredictionsCreateInput = z.infer<
	typeof BatchPredictionsCreateInputSchema
>;
export const BatchPredictionsCreateResponseSchema = DatarobotObjectSchema;
export type BatchPredictionsCreateResponse = z.infer<
	typeof BatchPredictionsCreateResponseSchema
>;

// batchPredictions_delete DELETE /api/v2/batchPredictions/{predictionJobId}/
export const BatchPredictionsDeleteInputSchema = z
	.object({
		predictionJobId: z.string(),
		partNumber: z.string(),
	})
	.loose();
export type BatchPredictionsDeleteInput = z.infer<
	typeof BatchPredictionsDeleteInputSchema
>;
export const BatchPredictionsDeleteResponseSchema = DatarobotObjectSchema;
export type BatchPredictionsDeleteResponse = z.infer<
	typeof BatchPredictionsDeleteResponseSchema
>;

// batchPredictionsFromExisting_create POST /api/v2/batchPredictions/fromExisting/
export const BatchPredictionsFromExistingCreateInputSchema = z
	.object({})
	.loose();
export type BatchPredictionsFromExistingCreateInput = z.infer<
	typeof BatchPredictionsFromExistingCreateInputSchema
>;
export const BatchPredictionsFromExistingCreateResponseSchema =
	DatarobotObjectSchema;
export type BatchPredictionsFromExistingCreateResponse = z.infer<
	typeof BatchPredictionsFromExistingCreateResponseSchema
>;

// batchPredictionsFromJobDefinition_create POST /api/v2/batchPredictions/fromJobDefinition/
export const BatchPredictionsFromJobDefinitionCreateInputSchema = z
	.object({})
	.loose();
export type BatchPredictionsFromJobDefinitionCreateInput = z.infer<
	typeof BatchPredictionsFromJobDefinitionCreateInputSchema
>;
export const BatchPredictionsFromJobDefinitionCreateResponseSchema =
	DatarobotObjectSchema;
export type BatchPredictionsFromJobDefinitionCreateResponse = z.infer<
	typeof BatchPredictionsFromJobDefinitionCreateResponseSchema
>;

// batchPredictions_list GET /api/v2/batchPredictions/
export const BatchPredictionsListInputSchema = z
	.object({
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
		status: z.string().optional(),
		source: z.string().optional(),
		deploymentId: z.string().optional(),
		modelId: z.string().optional(),
		jobId: z.string().optional(),
		orderBy: z.enum(['created', '-created', 'status', '-status']).optional(),
		allJobs: z.boolean().optional(),
		cutoffHours: z.number().int().optional(),
		startDateTime: z.string().optional(),
		endDateTime: z.string().optional(),
		batchPredictionJobDefinitionId: z.string().optional(),
		hostname: z.string().optional(),
		intakeType: z.string().optional(),
		outputType: z.string().optional(),
	})
	.loose();
export type BatchPredictionsListInput = z.infer<
	typeof BatchPredictionsListInputSchema
>;
export const BatchPredictionsListResponseSchema = DatarobotListSchema;
export type BatchPredictionsListResponse = z.infer<
	typeof BatchPredictionsListResponseSchema
>;

// batchPredictions_retrieve GET /api/v2/batchPredictions/{predictionJobId}/
export const BatchPredictionsRetrieveInputSchema = z
	.object({
		predictionJobId: z.string(),
		partNumber: z.string(),
	})
	.loose();
export type BatchPredictionsRetrieveInput = z.infer<
	typeof BatchPredictionsRetrieveInputSchema
>;
export const BatchPredictionsRetrieveResponseSchema = DatarobotObjectSchema;
export type BatchPredictionsRetrieveResponse = z.infer<
	typeof BatchPredictionsRetrieveResponseSchema
>;

// catalogItems_list GET /api/v2/catalogItems/
export const CatalogItemsListInputSchema = z
	.object({
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
		initialCacheSize: z.number().int().optional(),
		useCache: z.enum(['false', 'False', 'true', 'True']).optional(),
		orderBy: z
			.enum([
				'originalName',
				'-originalName',
				'catalogName',
				'-catalogName',
				'description',
				'-description',
				'created',
				'-created',
				'relevance',
				'-relevance',
			])
			.optional(),
		searchFor: z.string().optional(),
		tag: z.string().optional(),
		accessType: z.enum(['owner', 'shared', 'any', 'created']).optional(),
		datasourceType: z.string().optional(),
		category: z.string().optional(),
		filterFailed: z.enum(['false', 'False', 'true', 'True']).optional(),
		ownerUserId: z.string().optional(),
		ownerUsername: z.string().optional(),
		type: z
			.enum([
				'dataset',
				'snapshot_dataset',
				'remote_dataset',
				'user_blueprint',
				'files',
			])
			.optional(),
		isUxrPreviewable: z.boolean().optional(),
	})
	.loose();
export type CatalogItemsListInput = z.infer<typeof CatalogItemsListInputSchema>;
export const CatalogItemsListResponseSchema = DatarobotListSchema;
export type CatalogItemsListResponse = z.infer<
	typeof CatalogItemsListResponseSchema
>;

// catalogItems_retrieve GET /api/v2/catalogItems/{catalogId}/
export const CatalogItemsRetrieveInputSchema = z
	.object({
		catalogId: z.string(),
	})
	.loose();
export type CatalogItemsRetrieveInput = z.infer<
	typeof CatalogItemsRetrieveInputSchema
>;
export const CatalogItemsRetrieveResponseSchema = DatarobotObjectSchema;
export type CatalogItemsRetrieveResponse = z.infer<
	typeof CatalogItemsRetrieveResponseSchema
>;

// credentials_create POST /api/v2/credentials/
export const CredentialsCreateInputSchema = z.object({}).loose();
export type CredentialsCreateInput = z.infer<
	typeof CredentialsCreateInputSchema
>;
export const CredentialsCreateResponseSchema = DatarobotObjectSchema;
export type CredentialsCreateResponse = z.infer<
	typeof CredentialsCreateResponseSchema
>;

// credentials_delete DELETE /api/v2/credentials/{credentialId}/
export const CredentialsDeleteInputSchema = z
	.object({
		credentialId: z.string(),
	})
	.loose();
export type CredentialsDeleteInput = z.infer<
	typeof CredentialsDeleteInputSchema
>;
export const CredentialsDeleteResponseSchema = DatarobotObjectSchema;
export type CredentialsDeleteResponse = z.infer<
	typeof CredentialsDeleteResponseSchema
>;

// credentials_list GET /api/v2/credentials/
export const CredentialsListInputSchema = z
	.object({
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
		types: z.string().optional(),
		orderBy: z.enum(['creationDate', '-creationDate']).optional(),
	})
	.loose();
export type CredentialsListInput = z.infer<typeof CredentialsListInputSchema>;
export const CredentialsListResponseSchema = DatarobotListSchema;
export type CredentialsListResponse = z.infer<
	typeof CredentialsListResponseSchema
>;

// credentials_retrieve GET /api/v2/credentials/{credentialId}/
export const CredentialsRetrieveInputSchema = z
	.object({
		credentialId: z.string(),
	})
	.loose();
export type CredentialsRetrieveInput = z.infer<
	typeof CredentialsRetrieveInputSchema
>;
export const CredentialsRetrieveResponseSchema = DatarobotObjectSchema;
export type CredentialsRetrieveResponse = z.infer<
	typeof CredentialsRetrieveResponseSchema
>;

// customModels_create POST /api/v2/customModels/
export const CustomModelsCreateInputSchema = z.object({}).loose();
export type CustomModelsCreateInput = z.infer<
	typeof CustomModelsCreateInputSchema
>;
export const CustomModelsCreateResponseSchema = DatarobotObjectSchema;
export type CustomModelsCreateResponse = z.infer<
	typeof CustomModelsCreateResponseSchema
>;

// customModels_delete DELETE /api/v2/customModels/{customModelId}/
export const CustomModelsDeleteInputSchema = z
	.object({
		customModelId: z.string(),
	})
	.loose();
export type CustomModelsDeleteInput = z.infer<
	typeof CustomModelsDeleteInputSchema
>;
export const CustomModelsDeleteResponseSchema = DatarobotObjectSchema;
export type CustomModelsDeleteResponse = z.infer<
	typeof CustomModelsDeleteResponseSchema
>;

// customModels_list GET /api/v2/customModels/
export const CustomModelsListInputSchema = z
	.object({
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
		customModelType: z.enum(['training', 'inference']).optional(),
		targetType: z
			.enum([
				'Binary',
				'Regression',
				'Multiclass',
				'Anomaly',
				'Transform',
				'TextGeneration',
				'GeoPoint',
				'Unstructured',
				'VectorDatabase',
				'AgenticWorkflow',
				'MCP',
				'Multilabel',
			])
			.optional(),
		isDeployed: z.enum(['false', 'False', 'true', 'True']).optional(),
		orderBy: z.enum(['created', '-created', 'updated', '-updated']).optional(),
		searchFor: z.string().optional(),
		tagKeys: z.string().optional(),
		tagValues: z.string().optional(),
	})
	.loose();
export type CustomModelsListInput = z.infer<typeof CustomModelsListInputSchema>;
export const CustomModelsListResponseSchema = DatarobotListSchema;
export type CustomModelsListResponse = z.infer<
	typeof CustomModelsListResponseSchema
>;

// customModels_retrieve GET /api/v2/customModels/{customModelId}/
export const CustomModelsRetrieveInputSchema = z
	.object({
		customModelId: z.string(),
	})
	.loose();
export type CustomModelsRetrieveInput = z.infer<
	typeof CustomModelsRetrieveInputSchema
>;
export const CustomModelsRetrieveResponseSchema = DatarobotObjectSchema;
export type CustomModelsRetrieveResponse = z.infer<
	typeof CustomModelsRetrieveResponseSchema
>;

// customModelsVersions_create POST /api/v2/customModels/{customModelId}/versions/
export const CustomModelsVersionsCreateInputSchema = z
	.object({
		customModelId: z.string(),
	})
	.loose();
export type CustomModelsVersionsCreateInput = z.infer<
	typeof CustomModelsVersionsCreateInputSchema
>;
export const CustomModelsVersionsCreateResponseSchema = DatarobotObjectSchema;
export type CustomModelsVersionsCreateResponse = z.infer<
	typeof CustomModelsVersionsCreateResponseSchema
>;

// customModelsVersions_list GET /api/v2/customModels/{customModelId}/versions/
export const CustomModelsVersionsListInputSchema = z
	.object({
		customModelId: z.string(),
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
		mainBranchCommitSha: z.string().optional(),
	})
	.loose();
export type CustomModelsVersionsListInput = z.infer<
	typeof CustomModelsVersionsListInputSchema
>;
export const CustomModelsVersionsListResponseSchema = DatarobotObjectSchema;
export type CustomModelsVersionsListResponse = z.infer<
	typeof CustomModelsVersionsListResponseSchema
>;

// datasetsAllFeaturesDetails_list GET /api/v2/datasets/{datasetId}/allFeaturesDetails/
export const DatasetsAllFeaturesDetailsListInputSchema = z
	.object({
		datasetId: z.string(),
		limit: z.number().int().optional(),
		offset: z.number().int().optional(),
		orderBy: z
			.enum([
				'featureType',
				'name',
				'id',
				'unique',
				'missing',
				'stddev',
				'mean',
				'median',
				'min',
				'max',
				'dataQualityIssues',
				'-featureType',
				'-name',
				'-id',
				'-unique',
				'-missing',
				'-stddev',
				'-mean',
				'-median',
				'-min',
				'-max',
				'-dataQualityIssues',
			])
			.optional(),
		includePlot: z.enum(['false', 'False', 'true', 'True']).optional(),
		searchFor: z.string().optional(),
		featurelistId: z.string().optional(),
		includeDataQuality: z.enum(['false', 'False', 'true', 'True']).optional(),
	})
	.loose();
export type DatasetsAllFeaturesDetailsListInput = z.infer<
	typeof DatasetsAllFeaturesDetailsListInputSchema
>;
export const DatasetsAllFeaturesDetailsListResponseSchema =
	DatarobotObjectSchema;
export type DatasetsAllFeaturesDetailsListResponse = z.infer<
	typeof DatasetsAllFeaturesDetailsListResponseSchema
>;

// datasets_delete DELETE /api/v2/datasets/{datasetId}/
export const DatasetsDeleteInputSchema = z
	.object({
		datasetId: z.string(),
	})
	.loose();
export type DatasetsDeleteInput = z.infer<typeof DatasetsDeleteInputSchema>;
export const DatasetsDeleteResponseSchema = DatarobotObjectSchema;
export type DatasetsDeleteResponse = z.infer<
	typeof DatasetsDeleteResponseSchema
>;

// datasetsFeaturelists_list GET /api/v2/datasets/{datasetId}/featurelists/
export const DatasetsFeaturelistsListInputSchema = z
	.object({
		datasetId: z.string(),
		limit: z.number().int().optional(),
		offset: z.number().int().optional(),
		orderBy: z
			.enum([
				'name',
				'description',
				'featuresNumber',
				'creationDate',
				'userCreated',
				'-name',
				'-description',
				'-featuresNumber',
				'-creationDate',
				'-userCreated',
			])
			.optional(),
		searchFor: z.string().optional(),
	})
	.loose();
export type DatasetsFeaturelistsListInput = z.infer<
	typeof DatasetsFeaturelistsListInputSchema
>;
export const DatasetsFeaturelistsListResponseSchema = DatarobotObjectSchema;
export type DatasetsFeaturelistsListResponse = z.infer<
	typeof DatasetsFeaturelistsListResponseSchema
>;

// datasetsFile_list GET /api/v2/datasets/{datasetId}/file/
export const DatasetsFileListInputSchema = z
	.object({
		datasetId: z.string(),
	})
	.loose();
export type DatasetsFileListInput = z.infer<typeof DatasetsFileListInputSchema>;
export const DatasetsFileListResponseSchema = DatarobotObjectSchema;
export type DatasetsFileListResponse = z.infer<
	typeof DatasetsFileListResponseSchema
>;

// datasetsFromDataSource_create POST /api/v2/datasets/fromDataSource/
export const DatasetsFromDataSourceCreateInputSchema = z.object({}).loose();
export type DatasetsFromDataSourceCreateInput = z.infer<
	typeof DatasetsFromDataSourceCreateInputSchema
>;
export const DatasetsFromDataSourceCreateResponseSchema = DatarobotObjectSchema;
export type DatasetsFromDataSourceCreateResponse = z.infer<
	typeof DatasetsFromDataSourceCreateResponseSchema
>;

// datasetsFromFile_create POST /api/v2/datasets/fromFile/
export const DatasetsFromFileCreateInputSchema = z.object({}).loose();
export type DatasetsFromFileCreateInput = z.infer<
	typeof DatasetsFromFileCreateInputSchema
>;
export const DatasetsFromFileCreateResponseSchema = DatarobotObjectSchema;
export type DatasetsFromFileCreateResponse = z.infer<
	typeof DatasetsFromFileCreateResponseSchema
>;

// datasetsFromURL_create POST /api/v2/datasets/fromURL/
export const DatasetsFromURLCreateInputSchema = z.object({}).loose();
export type DatasetsFromURLCreateInput = z.infer<
	typeof DatasetsFromURLCreateInputSchema
>;
export const DatasetsFromURLCreateResponseSchema = DatarobotObjectSchema;
export type DatasetsFromURLCreateResponse = z.infer<
	typeof DatasetsFromURLCreateResponseSchema
>;

// datasets_list GET /api/v2/datasets/
export const DatasetsListInputSchema = z
	.object({
		category: z.enum(['TRAINING', 'PREDICTION', 'SAMPLE']).optional(),
		orderBy: z.enum(['created', '-created']).optional(),
		limit: z.number().int().optional(),
		offset: z.number().int().optional(),
		filterFailed: z.enum(['false', 'False', 'true', 'True']).optional(),
		datasetVersionIds: z.string().optional(),
		useCaseIds: z.string().optional(),
		vectorDatabaseEligibleOnly: z
			.enum(['false', 'False', 'true', 'True'])
			.optional(),
		vectorDatabaseMetadataEligibleOnly: z
			.enum(['false', 'False', 'true', 'True'])
			.optional(),
		isDeleted: z.enum(['false', 'False', 'true', 'True']).optional(),
	})
	.loose();
export type DatasetsListInput = z.infer<typeof DatasetsListInputSchema>;
export const DatasetsListResponseSchema = DatarobotListSchema;
export type DatasetsListResponse = z.infer<typeof DatasetsListResponseSchema>;

// datasets_patch PATCH /api/v2/datasets/{datasetId}/
export const DatasetsPatchInputSchema = z
	.object({
		datasetId: z.string(),
	})
	.loose();
export type DatasetsPatchInput = z.infer<typeof DatasetsPatchInputSchema>;
export const DatasetsPatchResponseSchema = DatarobotObjectSchema;
export type DatasetsPatchResponse = z.infer<typeof DatasetsPatchResponseSchema>;

// datasetsProjects_list GET /api/v2/datasets/{datasetId}/projects/
export const DatasetsProjectsListInputSchema = z
	.object({
		datasetId: z.string(),
		limit: z.number().int().optional(),
		offset: z.number().int().optional(),
	})
	.loose();
export type DatasetsProjectsListInput = z.infer<
	typeof DatasetsProjectsListInputSchema
>;
export const DatasetsProjectsListResponseSchema = DatarobotObjectSchema;
export type DatasetsProjectsListResponse = z.infer<
	typeof DatasetsProjectsListResponseSchema
>;

// datasets_retrieve GET /api/v2/datasets/{datasetId}/
export const DatasetsRetrieveInputSchema = z
	.object({
		datasetId: z.string(),
	})
	.loose();
export type DatasetsRetrieveInput = z.infer<typeof DatasetsRetrieveInputSchema>;
export const DatasetsRetrieveResponseSchema = DatarobotObjectSchema;
export type DatasetsRetrieveResponse = z.infer<
	typeof DatasetsRetrieveResponseSchema
>;

// datasetsVersions_delete DELETE /api/v2/datasets/{datasetId}/versions/{datasetVersionId}/
export const DatasetsVersionsDeleteInputSchema = z
	.object({
		datasetId: z.string(),
		datasetVersionId: z.string(),
	})
	.loose();
export type DatasetsVersionsDeleteInput = z.infer<
	typeof DatasetsVersionsDeleteInputSchema
>;
export const DatasetsVersionsDeleteResponseSchema = DatarobotObjectSchema;
export type DatasetsVersionsDeleteResponse = z.infer<
	typeof DatasetsVersionsDeleteResponseSchema
>;

// datasetsVersionsFromFile_create POST /api/v2/datasets/{datasetId}/versions/fromFile/
export const DatasetsVersionsFromFileCreateInputSchema = z
	.object({
		datasetId: z.string(),
	})
	.loose();
export type DatasetsVersionsFromFileCreateInput = z.infer<
	typeof DatasetsVersionsFromFileCreateInputSchema
>;
export const DatasetsVersionsFromFileCreateResponseSchema =
	DatarobotObjectSchema;
export type DatasetsVersionsFromFileCreateResponse = z.infer<
	typeof DatasetsVersionsFromFileCreateResponseSchema
>;

// datasetsVersionsFromURL_create POST /api/v2/datasets/{datasetId}/versions/fromURL/
export const DatasetsVersionsFromURLCreateInputSchema = z
	.object({
		datasetId: z.string(),
	})
	.loose();
export type DatasetsVersionsFromURLCreateInput = z.infer<
	typeof DatasetsVersionsFromURLCreateInputSchema
>;
export const DatasetsVersionsFromURLCreateResponseSchema =
	DatarobotObjectSchema;
export type DatasetsVersionsFromURLCreateResponse = z.infer<
	typeof DatasetsVersionsFromURLCreateResponseSchema
>;

// datasetsVersions_list GET /api/v2/datasets/{datasetId}/versions/
export const DatasetsVersionsListInputSchema = z
	.object({
		datasetId: z.string(),
		category: z.enum(['TRAINING', 'PREDICTION', 'SAMPLE']).optional(),
		orderBy: z.enum(['created', '-created']).optional(),
		limit: z.number().int().optional(),
		offset: z.number().int().optional(),
		filterFailed: z.enum(['false', 'False', 'true', 'True']).optional(),
	})
	.loose();
export type DatasetsVersionsListInput = z.infer<
	typeof DatasetsVersionsListInputSchema
>;
export const DatasetsVersionsListResponseSchema = DatarobotObjectSchema;
export type DatasetsVersionsListResponse = z.infer<
	typeof DatasetsVersionsListResponseSchema
>;

// datasetsVersions_retrieve GET /api/v2/datasets/{datasetId}/versions/{datasetVersionId}/
export const DatasetsVersionsRetrieveInputSchema = z
	.object({
		datasetId: z.string(),
		datasetVersionId: z.string(),
	})
	.loose();
export type DatasetsVersionsRetrieveInput = z.infer<
	typeof DatasetsVersionsRetrieveInputSchema
>;
export const DatasetsVersionsRetrieveResponseSchema = DatarobotObjectSchema;
export type DatasetsVersionsRetrieveResponse = z.infer<
	typeof DatasetsVersionsRetrieveResponseSchema
>;

// deploymentsAccuracy_list GET /api/v2/deployments/{deploymentId}/accuracy/
export const DeploymentsAccuracyListInputSchema = z
	.object({
		deploymentId: z.string(),
		start: z.string().optional(),
		end: z.string().optional(),
		modelId: z.string().optional(),
		batchId: z.string().optional(),
		segmentAttribute: z.string().optional(),
		segmentValue: z.string().optional(),
		targetClass: z.string().optional(),
		metric: z
			.enum([
				'AUC',
				'Accuracy',
				'Balanced Accuracy',
				'F1',
				'FPR',
				'FVE Binomial',
				'FVE Gamma',
				'FVE Multinomial',
				'FVE Poisson',
				'FVE Tweedie',
				'Gamma Deviance',
				'Gini Norm',
				'Kolmogorov-Smirnov',
				'LogLoss',
				'MAE',
				'MAPE',
				'MCC',
				'NPV',
				'PPV',
				'Poisson Deviance',
				'R Squared',
				'RMSE',
				'RMSLE',
				'Rate@Top10%',
				'Rate@Top5%',
				'TNR',
				'TPR',
				'Tweedie Deviance',
				'WGS84 MAE',
				'WGS84 RMSE',
			])
			.optional(),
		baselineModelId: z.string().optional(),
	})
	.loose();
export type DeploymentsAccuracyListInput = z.infer<
	typeof DeploymentsAccuracyListInputSchema
>;
export const DeploymentsAccuracyListResponseSchema = DatarobotObjectSchema;
export type DeploymentsAccuracyListResponse = z.infer<
	typeof DeploymentsAccuracyListResponseSchema
>;

// deploymentsAccuracyOverTime_list GET /api/v2/deployments/{deploymentId}/accuracyOverTime/
export const DeploymentsAccuracyOverTimeListInputSchema = z
	.object({
		deploymentId: z.string(),
		start: z.string().optional(),
		end: z.string().optional(),
		bucketSize: z.string().optional(),
		modelId: z.string().optional(),
		metric: z
			.enum([
				'AUC',
				'Accuracy',
				'Balanced Accuracy',
				'F1',
				'FPR',
				'FVE Binomial',
				'FVE Gamma',
				'FVE Multinomial',
				'FVE Poisson',
				'FVE Tweedie',
				'Gamma Deviance',
				'Gini Norm',
				'Kolmogorov-Smirnov',
				'LogLoss',
				'MAD',
				'MAE',
				'MAPE',
				'MCC',
				'NPV',
				'PPV',
				'Poisson Deviance',
				'R Squared',
				'RMSE',
				'RMSLE',
				'Rate@Top10%',
				'Rate@Top5%',
				'TNR',
				'TPR',
				'Tweedie Deviance',
				'WGS84 MAE',
				'WGS84 RMSE',
			])
			.optional(),
		segmentAttribute: z.string().optional(),
		segmentValue: z.string().optional(),
		targetClass: z.string().optional(),
	})
	.loose();
export type DeploymentsAccuracyOverTimeListInput = z.infer<
	typeof DeploymentsAccuracyOverTimeListInputSchema
>;
export const DeploymentsAccuracyOverTimeListResponseSchema =
	DatarobotObjectSchema;
export type DeploymentsAccuracyOverTimeListResponse = z.infer<
	typeof DeploymentsAccuracyOverTimeListResponseSchema
>;

// deploymentsCapabilities_list GET /api/v2/deployments/{deploymentId}/capabilities/
export const DeploymentsCapabilitiesListInputSchema = z
	.object({
		deploymentId: z.string(),
	})
	.loose();
export type DeploymentsCapabilitiesListInput = z.infer<
	typeof DeploymentsCapabilitiesListInputSchema
>;
export const DeploymentsCapabilitiesListResponseSchema = DatarobotObjectSchema;
export type DeploymentsCapabilitiesListResponse = z.infer<
	typeof DeploymentsCapabilitiesListResponseSchema
>;

// deployments_delete DELETE /api/v2/deployments/{deploymentId}/
export const DeploymentsDeleteInputSchema = z
	.object({
		deploymentId: z.string(),
		ignoreManagementAgent: z
			.enum(['false', 'False', 'true', 'True'])
			.optional(),
	})
	.loose();
export type DeploymentsDeleteInput = z.infer<
	typeof DeploymentsDeleteInputSchema
>;
export const DeploymentsDeleteResponseSchema = DatarobotObjectSchema;
export type DeploymentsDeleteResponse = z.infer<
	typeof DeploymentsDeleteResponseSchema
>;

// deploymentsFeatures_list GET /api/v2/deployments/{deploymentId}/features/
export const DeploymentsFeaturesListInputSchema = z
	.object({
		deploymentId: z.string(),
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
		includeNonPredictionFeatures: z
			.enum(['false', 'False', 'true', 'True'])
			.optional(),
		forSegmentedAnalysis: z.enum(['false', 'False', 'true', 'True']).optional(),
		search: z.string().optional(),
		orderBy: z.enum(['name', '-name', 'importance', '-importance']).optional(),
	})
	.loose();
export type DeploymentsFeaturesListInput = z.infer<
	typeof DeploymentsFeaturesListInputSchema
>;
export const DeploymentsFeaturesListResponseSchema = DatarobotObjectSchema;
export type DeploymentsFeaturesListResponse = z.infer<
	typeof DeploymentsFeaturesListResponseSchema
>;

// deploymentsFromLearningModel_create POST /api/v2/deployments/fromLearningModel/
export const DeploymentsFromLearningModelCreateInputSchema = z
	.object({})
	.loose();
export type DeploymentsFromLearningModelCreateInput = z.infer<
	typeof DeploymentsFromLearningModelCreateInputSchema
>;
export const DeploymentsFromLearningModelCreateResponseSchema =
	DatarobotObjectSchema;
export type DeploymentsFromLearningModelCreateResponse = z.infer<
	typeof DeploymentsFromLearningModelCreateResponseSchema
>;

// deploymentsFromModelPackage_create POST /api/v2/deployments/fromModelPackage/
export const DeploymentsFromModelPackageCreateInputSchema = z
	.object({})
	.loose();
export type DeploymentsFromModelPackageCreateInput = z.infer<
	typeof DeploymentsFromModelPackageCreateInputSchema
>;
export const DeploymentsFromModelPackageCreateResponseSchema =
	DatarobotObjectSchema;
export type DeploymentsFromModelPackageCreateResponse = z.infer<
	typeof DeploymentsFromModelPackageCreateResponseSchema
>;

// deployments_list GET /api/v2/deployments/
export const DeploymentsListInputSchema = z
	.object({
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
		orderBy: z
			.enum([
				'label',
				'-label',
				'serviceHealth',
				'-serviceHealth',
				'modelHealth',
				'-modelHealth',
				'accuracyHealth',
				'-accuracyHealth',
				'recentPredictions',
				'-recentPredictions',
				'lastPredictionTimestamp',
				'-lastPredictionTimestamp',
				'currentModelDeployedTimestamp',
				'-currentModelDeployedTimestamp',
				'createdAtTimestamp',
				'-createdAtTimestamp',
				'importance',
				'-importance',
				'fairnessHealth',
				'-fairnessHealth',
				'customMetricsHealth',
				'-customMetricsHealth',
				'actualsTimelinessHealth',
				'-actualsTimelinessHealth',
				'predictionsTimelinessHealth',
				'-predictionsTimelinessHealth',
			])
			.optional(),
		search: z.string().optional(),
		serviceHealth: z
			.array(z.union([z.string().optional(), z.number().optional()]))
			.optional(),
		modelHealth: z
			.array(z.union([z.string().optional(), z.number().optional()]))
			.optional(),
		accuracyHealth: z
			.array(z.union([z.string().optional(), z.number().optional()]))
			.optional(),
		role: z.enum(['OWNER', 'USER']).optional(),
		status: z
			.array(z.union([z.string().optional(), z.number().optional()]))
			.optional(),
		importance: z
			.array(z.union([z.string().optional(), z.number().optional()]))
			.optional(),
		lastPredictionTimestampStart: z.string().optional(),
		lastPredictionTimestampEnd: z.string().optional(),
		predictionUsageDailyAvgGreaterThan: z.number().int().optional(),
		predictionUsageDailyAvgLessThan: z.number().int().optional(),
		defaultPredictionServerId: z
			.array(z.union([z.string().optional(), z.number().optional()]))
			.optional(),
		buildEnvironmentType: z
			.array(z.union([z.string().optional(), z.number().optional()]))
			.optional(),
		executionEnvironmentType: z
			.array(z.union([z.string().optional(), z.number().optional()]))
			.optional(),
		predictionEnvironmentPlatform: z
			.array(z.union([z.string().optional(), z.number().optional()]))
			.optional(),
		createdByMe: z.enum(['false', 'False', 'true', 'True']).optional(),
		createdBy: z.string().optional(),
		championModelExecutionType: z
			.enum(['custom_inference_model', 'external', 'dedicated'])
			.optional(),
		championModelTargetType: z.string().optional(),
		tagKeys: z.string().optional(),
		tagValues: z.string().optional(),
		isA2AAgent: z.enum(['false', 'False', 'true', 'True']).optional(),
		predictionEnvironmentTagKeys: z.string().optional(),
		predictionEnvironmentTagValues: z.string().optional(),
	})
	.loose();
export type DeploymentsListInput = z.infer<typeof DeploymentsListInputSchema>;
export const DeploymentsListResponseSchema = DatarobotListSchema;
export type DeploymentsListResponse = z.infer<
	typeof DeploymentsListResponseSchema
>;

// deploymentsModelHistory_list GET /api/v2/deployments/{deploymentId}/modelHistory/
export const DeploymentsModelHistoryListInputSchema = z
	.object({
		deploymentId: z.string(),
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
	})
	.loose();
export type DeploymentsModelHistoryListInput = z.infer<
	typeof DeploymentsModelHistoryListInputSchema
>;
export const DeploymentsModelHistoryListResponseSchema = DatarobotObjectSchema;
export type DeploymentsModelHistoryListResponse = z.infer<
	typeof DeploymentsModelHistoryListResponseSchema
>;

// deploymentsModel_patchMany PATCH /api/v2/deployments/{deploymentId}/model/
export const DeploymentsModelPatchManyInputSchema = z
	.object({
		deploymentId: z.string(),
	})
	.loose();
export type DeploymentsModelPatchManyInput = z.infer<
	typeof DeploymentsModelPatchManyInputSchema
>;
export const DeploymentsModelPatchManyResponseSchema = DatarobotObjectSchema;
export type DeploymentsModelPatchManyResponse = z.infer<
	typeof DeploymentsModelPatchManyResponseSchema
>;

// deployments_patch PATCH /api/v2/deployments/{deploymentId}/
export const DeploymentsPatchInputSchema = z
	.object({
		deploymentId: z.string(),
	})
	.loose();
export type DeploymentsPatchInput = z.infer<typeof DeploymentsPatchInputSchema>;
export const DeploymentsPatchResponseSchema = DatarobotObjectSchema;
export type DeploymentsPatchResponse = z.infer<
	typeof DeploymentsPatchResponseSchema
>;

// deploymentsPredictionsOverTime_list GET /api/v2/deployments/{deploymentId}/predictionsOverTime/
export const DeploymentsPredictionsOverTimeListInputSchema = z
	.object({
		deploymentId: z.string(),
		start: z.string().optional(),
		end: z.string().optional(),
		bucketSize: z.enum(['PT1H', 'P1D', 'P7D', 'P1M']).optional(),
		segmentAttribute: z.string().optional(),
		segmentValue: z.string().optional(),
		modelId: z.string().optional(),
		targetClass: z.string().optional(),
		includePercentiles: z.enum(['false', 'False', 'true', 'True']).optional(),
	})
	.loose();
export type DeploymentsPredictionsOverTimeListInput = z.infer<
	typeof DeploymentsPredictionsOverTimeListInputSchema
>;
export const DeploymentsPredictionsOverTimeListResponseSchema =
	DatarobotObjectSchema;
export type DeploymentsPredictionsOverTimeListResponse = z.infer<
	typeof DeploymentsPredictionsOverTimeListResponseSchema
>;

// deployments_retrieve GET /api/v2/deployments/{deploymentId}/
export const DeploymentsRetrieveInputSchema = z
	.object({
		deploymentId: z.string(),
	})
	.loose();
export type DeploymentsRetrieveInput = z.infer<
	typeof DeploymentsRetrieveInputSchema
>;
export const DeploymentsRetrieveResponseSchema = DatarobotObjectSchema;
export type DeploymentsRetrieveResponse = z.infer<
	typeof DeploymentsRetrieveResponseSchema
>;

// deploymentsServiceStats_list GET /api/v2/deployments/{deploymentId}/serviceStats/
export const DeploymentsServiceStatsListInputSchema = z
	.object({
		deploymentId: z.string(),
		start: z.string().optional(),
		end: z.string().optional(),
		executionTimeQuantile: z.number().optional(),
		responseTimeQuantile: z.number().optional(),
		slowRequestsThreshold: z.number().int().optional(),
		segmentAttribute: z
			.enum(['DataRobot-Consumer', 'DataRobot-Remote-IP', 'DataRobot-Host-IP'])
			.optional(),
		segmentValue: z.string().optional(),
		modelId: z.string().optional(),
	})
	.loose();
export type DeploymentsServiceStatsListInput = z.infer<
	typeof DeploymentsServiceStatsListInputSchema
>;
export const DeploymentsServiceStatsListResponseSchema = DatarobotObjectSchema;
export type DeploymentsServiceStatsListResponse = z.infer<
	typeof DeploymentsServiceStatsListResponseSchema
>;

// deploymentsSettings_list GET /api/v2/deployments/{deploymentId}/settings/
export const DeploymentsSettingsListInputSchema = z
	.object({
		deploymentId: z.string(),
	})
	.loose();
export type DeploymentsSettingsListInput = z.infer<
	typeof DeploymentsSettingsListInputSchema
>;
export const DeploymentsSettingsListResponseSchema = DatarobotObjectSchema;
export type DeploymentsSettingsListResponse = z.infer<
	typeof DeploymentsSettingsListResponseSchema
>;

// deploymentsSettings_patchMany PATCH /api/v2/deployments/{deploymentId}/settings/
export const DeploymentsSettingsPatchManyInputSchema = z
	.object({
		deploymentId: z.string(),
	})
	.loose();
export type DeploymentsSettingsPatchManyInput = z.infer<
	typeof DeploymentsSettingsPatchManyInputSchema
>;
export const DeploymentsSettingsPatchManyResponseSchema = DatarobotObjectSchema;
export type DeploymentsSettingsPatchManyResponse = z.infer<
	typeof DeploymentsSettingsPatchManyResponseSchema
>;

// deploymentsSharedRoles_list GET /api/v2/deployments/{deploymentId}/sharedRoles/
export const DeploymentsSharedRolesListInputSchema = z
	.object({
		deploymentId: z.string(),
		id: z.string().optional(),
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
		name: z.string().optional(),
		shareRecipientType: z
			.enum(['user', 'group', 'organization', 'externalApplication'])
			.optional(),
	})
	.loose();
export type DeploymentsSharedRolesListInput = z.infer<
	typeof DeploymentsSharedRolesListInputSchema
>;
export const DeploymentsSharedRolesListResponseSchema = DatarobotObjectSchema;
export type DeploymentsSharedRolesListResponse = z.infer<
	typeof DeploymentsSharedRolesListResponseSchema
>;

// modelPackagesFeatures_list GET /api/v2/modelPackages/{modelPackageId}/features/
export const ModelPackagesFeaturesListInputSchema = z
	.object({
		modelPackageId: z.string(),
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
		includeNonPredictionFeatures: z
			.enum(['false', 'False', 'true', 'True'])
			.optional(),
		forSegmentedAnalysis: z.enum(['false', 'False', 'true', 'True']).optional(),
		search: z.string().optional(),
		orderBy: z.enum(['name', 'importance', '-name', '-importance']).optional(),
	})
	.loose();
export type ModelPackagesFeaturesListInput = z.infer<
	typeof ModelPackagesFeaturesListInputSchema
>;
export const ModelPackagesFeaturesListResponseSchema = DatarobotObjectSchema;
export type ModelPackagesFeaturesListResponse = z.infer<
	typeof ModelPackagesFeaturesListResponseSchema
>;

// modelPackagesFromLeaderboard_create POST /api/v2/modelPackages/fromLeaderboard/
export const ModelPackagesFromLeaderboardCreateInputSchema = z
	.object({})
	.loose();
export type ModelPackagesFromLeaderboardCreateInput = z.infer<
	typeof ModelPackagesFromLeaderboardCreateInputSchema
>;
export const ModelPackagesFromLeaderboardCreateResponseSchema =
	DatarobotObjectSchema;
export type ModelPackagesFromLeaderboardCreateResponse = z.infer<
	typeof ModelPackagesFromLeaderboardCreateResponseSchema
>;

// modelPackages_list GET /api/v2/modelPackages/
export const ModelPackagesListInputSchema = z
	.object({
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
		modelId: z.string().optional(),
		similarTo: z.string().optional(),
		forChallenger: z.boolean().optional(),
		search: z.string().optional(),
		predictionThreshold: z.number().optional(),
		imported: z.boolean().optional(),
		predictionEnvironmentId: z.string().optional(),
		modelKind: z.string().optional(),
		buildStatus: z.enum(['inProgress', 'complete', 'failed']).optional(),
	})
	.loose();
export type ModelPackagesListInput = z.infer<
	typeof ModelPackagesListInputSchema
>;
export const ModelPackagesListResponseSchema = DatarobotListSchema;
export type ModelPackagesListResponse = z.infer<
	typeof ModelPackagesListResponseSchema
>;

// modelPackages_retrieve GET /api/v2/modelPackages/{modelPackageId}/
export const ModelPackagesRetrieveInputSchema = z
	.object({
		modelPackageId: z.string(),
	})
	.loose();
export type ModelPackagesRetrieveInput = z.infer<
	typeof ModelPackagesRetrieveInputSchema
>;
export const ModelPackagesRetrieveResponseSchema = DatarobotObjectSchema;
export type ModelPackagesRetrieveResponse = z.infer<
	typeof ModelPackagesRetrieveResponseSchema
>;

// predictionServers_list GET /api/v2/predictionServers/
export const PredictionServersListInputSchema = z
	.object({
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
	})
	.loose();
export type PredictionServersListInput = z.infer<
	typeof PredictionServersListInputSchema
>;
export const PredictionServersListResponseSchema = DatarobotListSchema;
export type PredictionServersListResponse = z.infer<
	typeof PredictionServersListResponseSchema
>;

// configure_and_start_autopilot PATCH /api/v2/projects/{projectId}/aim/
export const ConfigureAndStartAutopilotInputSchema = z
	.object({
		projectId: z.string(),
	})
	.loose();
export type ConfigureAndStartAutopilotInput = z.infer<
	typeof ConfigureAndStartAutopilotInputSchema
>;
export const ConfigureAndStartAutopilotResponseSchema = DatarobotObjectSchema;
export type ConfigureAndStartAutopilotResponse = z.infer<
	typeof ConfigureAndStartAutopilotResponseSchema
>;

// projectsAccessControl_list GET /api/v2/projects/{projectId}/accessControl/
export const ProjectsAccessControlListInputSchema = z
	.object({
		projectId: z.string(),
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
		username: z.string().optional(),
		userId: z.string().optional(),
	})
	.loose();
export type ProjectsAccessControlListInput = z.infer<
	typeof ProjectsAccessControlListInputSchema
>;
export const ProjectsAccessControlListResponseSchema = DatarobotObjectSchema;
export type ProjectsAccessControlListResponse = z.infer<
	typeof ProjectsAccessControlListResponseSchema
>;

// projectsAutopilot_create POST /api/v2/projects/{projectId}/autopilot/
export const ProjectsAutopilotCreateInputSchema = z
	.object({
		projectId: z.string(),
	})
	.loose();
export type ProjectsAutopilotCreateInput = z.infer<
	typeof ProjectsAutopilotCreateInputSchema
>;
export const ProjectsAutopilotCreateResponseSchema = DatarobotObjectSchema;
export type ProjectsAutopilotCreateResponse = z.infer<
	typeof ProjectsAutopilotCreateResponseSchema
>;

// projectsAutopilots_create POST /api/v2/projects/{projectId}/autopilots/
export const ProjectsAutopilotsCreateInputSchema = z
	.object({
		projectId: z.string(),
	})
	.loose();
export type ProjectsAutopilotsCreateInput = z.infer<
	typeof ProjectsAutopilotsCreateInputSchema
>;
export const ProjectsAutopilotsCreateResponseSchema = DatarobotObjectSchema;
export type ProjectsAutopilotsCreateResponse = z.infer<
	typeof ProjectsAutopilotsCreateResponseSchema
>;

// projectsBlueprints_list GET /api/v2/projects/{projectId}/blueprints/
export const ProjectsBlueprintsListInputSchema = z
	.object({
		projectId: z.string(),
	})
	.loose();
export type ProjectsBlueprintsListInput = z.infer<
	typeof ProjectsBlueprintsListInputSchema
>;
export const ProjectsBlueprintsListResponseSchema = DatarobotObjectSchema;
export type ProjectsBlueprintsListResponse = z.infer<
	typeof ProjectsBlueprintsListResponseSchema
>;

// projectsBlueprints_retrieve GET /api/v2/projects/{projectId}/blueprints/{blueprintId}/
export const ProjectsBlueprintsRetrieveInputSchema = z
	.object({
		projectId: z.string(),
		blueprintId: z.string(),
	})
	.loose();
export type ProjectsBlueprintsRetrieveInput = z.infer<
	typeof ProjectsBlueprintsRetrieveInputSchema
>;
export const ProjectsBlueprintsRetrieveResponseSchema = DatarobotObjectSchema;
export type ProjectsBlueprintsRetrieveResponse = z.infer<
	typeof ProjectsBlueprintsRetrieveResponseSchema
>;

// projects_create POST /api/v2/projects/
export const ProjectsCreateInputSchema = z.object({}).loose();
export type ProjectsCreateInput = z.infer<typeof ProjectsCreateInputSchema>;
export const ProjectsCreateResponseSchema = DatarobotObjectSchema;
export type ProjectsCreateResponse = z.infer<
	typeof ProjectsCreateResponseSchema
>;

// projectsDatetimeModels_list GET /api/v2/projects/{projectId}/datetimeModels/
export const ProjectsDatetimeModelsListInputSchema = z
	.object({
		projectId: z.string(),
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
		bulkOperationId: z.string().optional(),
	})
	.loose();
export type ProjectsDatetimeModelsListInput = z.infer<
	typeof ProjectsDatetimeModelsListInputSchema
>;
export const ProjectsDatetimeModelsListResponseSchema = DatarobotObjectSchema;
export type ProjectsDatetimeModelsListResponse = z.infer<
	typeof ProjectsDatetimeModelsListResponseSchema
>;

// projects_delete DELETE /api/v2/projects/{projectId}/
export const ProjectsDeleteInputSchema = z
	.object({
		projectId: z.string(),
	})
	.loose();
export type ProjectsDeleteInput = z.infer<typeof ProjectsDeleteInputSchema>;
export const ProjectsDeleteResponseSchema = DatarobotObjectSchema;
export type ProjectsDeleteResponse = z.infer<
	typeof ProjectsDeleteResponseSchema
>;

// projectsDeploymentReadyModels_create POST /api/v2/projects/{projectId}/deploymentReadyModels/
export const ProjectsDeploymentReadyModelsCreateInputSchema = z
	.object({
		projectId: z.string(),
	})
	.loose();
export type ProjectsDeploymentReadyModelsCreateInput = z.infer<
	typeof ProjectsDeploymentReadyModelsCreateInputSchema
>;
export const ProjectsDeploymentReadyModelsCreateResponseSchema =
	DatarobotObjectSchema;
export type ProjectsDeploymentReadyModelsCreateResponse = z.infer<
	typeof ProjectsDeploymentReadyModelsCreateResponseSchema
>;

// projectsFeaturelists_create POST /api/v2/projects/{projectId}/featurelists/
export const ProjectsFeaturelistsCreateInputSchema = z
	.object({
		projectId: z.string(),
	})
	.loose();
export type ProjectsFeaturelistsCreateInput = z.infer<
	typeof ProjectsFeaturelistsCreateInputSchema
>;
export const ProjectsFeaturelistsCreateResponseSchema = DatarobotObjectSchema;
export type ProjectsFeaturelistsCreateResponse = z.infer<
	typeof ProjectsFeaturelistsCreateResponseSchema
>;

// projectsFeaturelists_delete DELETE /api/v2/projects/{projectId}/featurelists/{featurelistId}/
export const ProjectsFeaturelistsDeleteInputSchema = z
	.object({
		projectId: z.string(),
		featurelistId: z.string(),
		dryRun: z.enum(['false', 'False', 'true', 'True']).optional(),
		deleteDependencies: z.enum(['false', 'False', 'true', 'True']).optional(),
	})
	.loose();
export type ProjectsFeaturelistsDeleteInput = z.infer<
	typeof ProjectsFeaturelistsDeleteInputSchema
>;
export const ProjectsFeaturelistsDeleteResponseSchema = DatarobotObjectSchema;
export type ProjectsFeaturelistsDeleteResponse = z.infer<
	typeof ProjectsFeaturelistsDeleteResponseSchema
>;

// projectsFeaturelists_list GET /api/v2/projects/{projectId}/featurelists/
export const ProjectsFeaturelistsListInputSchema = z
	.object({
		projectId: z.string(),
		sortBy: z
			.enum([
				'name',
				'description',
				'features',
				'numModels',
				'created',
				'isUserCreated',
				'-name',
				'-description',
				'-features',
				'-numModels',
				'-created',
				'-isUserCreated',
			])
			.optional(),
		searchFor: z.string().optional(),
	})
	.loose();
export type ProjectsFeaturelistsListInput = z.infer<
	typeof ProjectsFeaturelistsListInputSchema
>;
export const ProjectsFeaturelistsListResponseSchema = DatarobotObjectSchema;
export type ProjectsFeaturelistsListResponse = z.infer<
	typeof ProjectsFeaturelistsListResponseSchema
>;

// projectsFeaturelists_patch PATCH /api/v2/projects/{projectId}/featurelists/{featurelistId}/
export const ProjectsFeaturelistsPatchInputSchema = z
	.object({
		projectId: z.string(),
		featurelistId: z.string(),
	})
	.loose();
export type ProjectsFeaturelistsPatchInput = z.infer<
	typeof ProjectsFeaturelistsPatchInputSchema
>;
export const ProjectsFeaturelistsPatchResponseSchema = DatarobotObjectSchema;
export type ProjectsFeaturelistsPatchResponse = z.infer<
	typeof ProjectsFeaturelistsPatchResponseSchema
>;

// projectsFeaturelists_retrieve GET /api/v2/projects/{projectId}/featurelists/{featurelistId}/
export const ProjectsFeaturelistsRetrieveInputSchema = z
	.object({
		projectId: z.string(),
		featurelistId: z.string(),
	})
	.loose();
export type ProjectsFeaturelistsRetrieveInput = z.infer<
	typeof ProjectsFeaturelistsRetrieveInputSchema
>;
export const ProjectsFeaturelistsRetrieveResponseSchema = DatarobotObjectSchema;
export type ProjectsFeaturelistsRetrieveResponse = z.infer<
	typeof ProjectsFeaturelistsRetrieveResponseSchema
>;

// projectsFeatures_list GET /api/v2/projects/{projectId}/features/
export const ProjectsFeaturesListInputSchema = z
	.object({
		projectId: z.string(),
		sortBy: z
			.enum([
				'name',
				'id',
				'importance',
				'featureType',
				'uniqueCount',
				'naCount',
				'mean',
				'stdDev',
				'median',
				'min',
				'max',
				'-name',
				'-id',
				'-importance',
				'-featureType',
				'-uniqueCount',
				'-naCount',
				'-mean',
				'-stdDev',
				'-median',
				'-min',
				'-max',
			])
			.optional(),
		searchFor: z.string().optional(),
		featurelistId: z.string().optional(),
		forSegmentedAnalysis: z.enum(['false', 'False', 'true', 'True']).optional(),
	})
	.loose();
export type ProjectsFeaturesListInput = z.infer<
	typeof ProjectsFeaturesListInputSchema
>;
export const ProjectsFeaturesListResponseSchema = DatarobotObjectSchema;
export type ProjectsFeaturesListResponse = z.infer<
	typeof ProjectsFeaturesListResponseSchema
>;

// projectsFeatures_retrieve GET /api/v2/projects/{projectId}/features/{featureName}/
export const ProjectsFeaturesRetrieveInputSchema = z
	.object({
		projectId: z.string(),
		featureName: z.string(),
	})
	.loose();
export type ProjectsFeaturesRetrieveInput = z.infer<
	typeof ProjectsFeaturesRetrieveInputSchema
>;
export const ProjectsFeaturesRetrieveResponseSchema = DatarobotObjectSchema;
export type ProjectsFeaturesRetrieveResponse = z.infer<
	typeof ProjectsFeaturesRetrieveResponseSchema
>;

// projectsJobs_delete DELETE /api/v2/projects/{projectId}/jobs/{jobId}/
export const ProjectsJobsDeleteInputSchema = z
	.object({
		projectId: z.string(),
		jobId: z.string(),
	})
	.loose();
export type ProjectsJobsDeleteInput = z.infer<
	typeof ProjectsJobsDeleteInputSchema
>;
export const ProjectsJobsDeleteResponseSchema = DatarobotObjectSchema;
export type ProjectsJobsDeleteResponse = z.infer<
	typeof ProjectsJobsDeleteResponseSchema
>;

// projectsJobs_list GET /api/v2/projects/{projectId}/jobs/
export const ProjectsJobsListInputSchema = z
	.object({
		projectId: z.string(),
		status: z.enum(['queue', 'inprogress', 'error']).optional(),
	})
	.loose();
export type ProjectsJobsListInput = z.infer<typeof ProjectsJobsListInputSchema>;
export const ProjectsJobsListResponseSchema = DatarobotObjectSchema;
export type ProjectsJobsListResponse = z.infer<
	typeof ProjectsJobsListResponseSchema
>;

// projectsJobs_retrieve GET /api/v2/projects/{projectId}/jobs/{jobId}/
export const ProjectsJobsRetrieveInputSchema = z
	.object({
		projectId: z.string(),
		jobId: z.string(),
	})
	.loose();
export type ProjectsJobsRetrieveInput = z.infer<
	typeof ProjectsJobsRetrieveInputSchema
>;
export const ProjectsJobsRetrieveResponseSchema = DatarobotObjectSchema;
export type ProjectsJobsRetrieveResponse = z.infer<
	typeof ProjectsJobsRetrieveResponseSchema
>;

// projects_list GET /api/v2/projects/
export const ProjectsListInputSchema = z
	.object({
		projectName: z.string().optional(),
		projectId: z.string().optional(),
		orderBy: z.enum(['projectName', '-projectName']).optional(),
		featureDiscovery: z.enum(['false', 'False', 'true', 'True']).optional(),
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
	})
	.loose();
export type ProjectsListInput = z.infer<typeof ProjectsListInputSchema>;
export const ProjectsListResponseSchema = DatarobotListSchema;
export type ProjectsListResponse = z.infer<typeof ProjectsListResponseSchema>;

// projectsModelingFeaturelists_create POST /api/v2/projects/{projectId}/modelingFeaturelists/
export const ProjectsModelingFeaturelistsCreateInputSchema = z
	.object({
		projectId: z.string(),
	})
	.loose();
export type ProjectsModelingFeaturelistsCreateInput = z.infer<
	typeof ProjectsModelingFeaturelistsCreateInputSchema
>;
export const ProjectsModelingFeaturelistsCreateResponseSchema =
	DatarobotObjectSchema;
export type ProjectsModelingFeaturelistsCreateResponse = z.infer<
	typeof ProjectsModelingFeaturelistsCreateResponseSchema
>;

// projectsModelingFeaturelists_list GET /api/v2/projects/{projectId}/modelingFeaturelists/
export const ProjectsModelingFeaturelistsListInputSchema = z
	.object({
		projectId: z.string(),
		sortBy: z
			.enum([
				'name',
				'description',
				'features',
				'numModels',
				'created',
				'isUserCreated',
				'-name',
				'-description',
				'-features',
				'-numModels',
				'-created',
				'-isUserCreated',
			])
			.optional(),
		searchFor: z.string().optional(),
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
	})
	.loose();
export type ProjectsModelingFeaturelistsListInput = z.infer<
	typeof ProjectsModelingFeaturelistsListInputSchema
>;
export const ProjectsModelingFeaturelistsListResponseSchema =
	DatarobotObjectSchema;
export type ProjectsModelingFeaturelistsListResponse = z.infer<
	typeof ProjectsModelingFeaturelistsListResponseSchema
>;

// projectsModels_create POST /api/v2/projects/{projectId}/models/
export const ProjectsModelsCreateInputSchema = z
	.object({
		projectId: z.string(),
	})
	.loose();
export type ProjectsModelsCreateInput = z.infer<
	typeof ProjectsModelsCreateInputSchema
>;
export const ProjectsModelsCreateResponseSchema = DatarobotObjectSchema;
export type ProjectsModelsCreateResponse = z.infer<
	typeof ProjectsModelsCreateResponseSchema
>;

// projectsModels_delete DELETE /api/v2/projects/{projectId}/models/{modelId}/
export const ProjectsModelsDeleteInputSchema = z
	.object({
		projectId: z.string(),
		modelId: z.string(),
	})
	.loose();
export type ProjectsModelsDeleteInput = z.infer<
	typeof ProjectsModelsDeleteInputSchema
>;
export const ProjectsModelsDeleteResponseSchema = DatarobotObjectSchema;
export type ProjectsModelsDeleteResponse = z.infer<
	typeof ProjectsModelsDeleteResponseSchema
>;

// projectsModelsFromModel_create POST /api/v2/projects/{projectId}/models/fromModel/
export const ProjectsModelsFromModelCreateInputSchema = z
	.object({
		projectId: z.string(),
	})
	.loose();
export type ProjectsModelsFromModelCreateInput = z.infer<
	typeof ProjectsModelsFromModelCreateInputSchema
>;
export const ProjectsModelsFromModelCreateResponseSchema =
	DatarobotObjectSchema;
export type ProjectsModelsFromModelCreateResponse = z.infer<
	typeof ProjectsModelsFromModelCreateResponseSchema
>;

// projectsModels_list GET /api/v2/projects/{projectId}/models/
export const ProjectsModelsListInputSchema = z
	.object({
		projectId: z.string(),
		withMetric: z.string().optional(),
		showInSampleScores: z.boolean().optional(),
		name: z.string().optional(),
		samplePct: z.number().optional(),
		isStarred: z.enum(['false', 'False', 'true', 'True']).optional(),
		orderBy: z
			.enum(['metric', '-metric', 'samplePct', '-samplePct'])
			.optional(),
	})
	.loose();
export type ProjectsModelsListInput = z.infer<
	typeof ProjectsModelsListInputSchema
>;
export const ProjectsModelsListResponseSchema = DatarobotObjectSchema;
export type ProjectsModelsListResponse = z.infer<
	typeof ProjectsModelsListResponseSchema
>;

// projectsModels_retrieve GET /api/v2/projects/{projectId}/models/{modelId}/
export const ProjectsModelsRetrieveInputSchema = z
	.object({
		projectId: z.string(),
		modelId: z.string(),
	})
	.loose();
export type ProjectsModelsRetrieveInput = z.infer<
	typeof ProjectsModelsRetrieveInputSchema
>;
export const ProjectsModelsRetrieveResponseSchema = DatarobotObjectSchema;
export type ProjectsModelsRetrieveResponse = z.infer<
	typeof ProjectsModelsRetrieveResponseSchema
>;

// projects_patch PATCH /api/v2/projects/{projectId}/
export const ProjectsPatchInputSchema = z
	.object({
		projectId: z.string(),
	})
	.loose();
export type ProjectsPatchInput = z.infer<typeof ProjectsPatchInputSchema>;
export const ProjectsPatchResponseSchema = DatarobotObjectSchema;
export type ProjectsPatchResponse = z.infer<typeof ProjectsPatchResponseSchema>;

// projectsPredictionDatasets_delete DELETE /api/v2/projects/{projectId}/predictionDatasets/{datasetId}/
export const ProjectsPredictionDatasetsDeleteInputSchema = z
	.object({
		projectId: z.string(),
		datasetId: z.string(),
	})
	.loose();
export type ProjectsPredictionDatasetsDeleteInput = z.infer<
	typeof ProjectsPredictionDatasetsDeleteInputSchema
>;
export const ProjectsPredictionDatasetsDeleteResponseSchema =
	DatarobotObjectSchema;
export type ProjectsPredictionDatasetsDeleteResponse = z.infer<
	typeof ProjectsPredictionDatasetsDeleteResponseSchema
>;

// projectsPredictionDatasets_list GET /api/v2/projects/{projectId}/predictionDatasets/
export const ProjectsPredictionDatasetsListInputSchema = z
	.object({
		projectId: z.string(),
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
	})
	.loose();
export type ProjectsPredictionDatasetsListInput = z.infer<
	typeof ProjectsPredictionDatasetsListInputSchema
>;
export const ProjectsPredictionDatasetsListResponseSchema =
	DatarobotObjectSchema;
export type ProjectsPredictionDatasetsListResponse = z.infer<
	typeof ProjectsPredictionDatasetsListResponseSchema
>;

// projectsPredictionDatasets_retrieve GET /api/v2/projects/{projectId}/predictionDatasets/{datasetId}/
export const ProjectsPredictionDatasetsRetrieveInputSchema = z
	.object({
		projectId: z.string(),
		datasetId: z.string(),
	})
	.loose();
export type ProjectsPredictionDatasetsRetrieveInput = z.infer<
	typeof ProjectsPredictionDatasetsRetrieveInputSchema
>;
export const ProjectsPredictionDatasetsRetrieveResponseSchema =
	DatarobotObjectSchema;
export type ProjectsPredictionDatasetsRetrieveResponse = z.infer<
	typeof ProjectsPredictionDatasetsRetrieveResponseSchema
>;

// projectsPredictions_create POST /api/v2/projects/{projectId}/predictions/
export const ProjectsPredictionsCreateInputSchema = z
	.object({
		projectId: z.string(),
	})
	.loose();
export type ProjectsPredictionsCreateInput = z.infer<
	typeof ProjectsPredictionsCreateInputSchema
>;
export const ProjectsPredictionsCreateResponseSchema = DatarobotObjectSchema;
export type ProjectsPredictionsCreateResponse = z.infer<
	typeof ProjectsPredictionsCreateResponseSchema
>;

// projectsPredictions_list GET /api/v2/projects/{projectId}/predictions/
export const ProjectsPredictionsListInputSchema = z
	.object({
		projectId: z.string(),
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
		datasetId: z.string().optional(),
		modelId: z.string().optional(),
	})
	.loose();
export type ProjectsPredictionsListInput = z.infer<
	typeof ProjectsPredictionsListInputSchema
>;
export const ProjectsPredictionsListResponseSchema = DatarobotObjectSchema;
export type ProjectsPredictionsListResponse = z.infer<
	typeof ProjectsPredictionsListResponseSchema
>;

// projectsPredictions_retrieve GET /api/v2/projects/{projectId}/predictions/{predictionId}/
export const ProjectsPredictionsRetrieveInputSchema = z
	.object({
		predictionId: z.string(),
		projectId: z.string(),
	})
	.loose();
export type ProjectsPredictionsRetrieveInput = z.infer<
	typeof ProjectsPredictionsRetrieveInputSchema
>;
export const ProjectsPredictionsRetrieveResponseSchema = DatarobotObjectSchema;
export type ProjectsPredictionsRetrieveResponse = z.infer<
	typeof ProjectsPredictionsRetrieveResponseSchema
>;

// projectsRecommendedModels_list GET /api/v2/projects/{projectId}/recommendedModels/
export const ProjectsRecommendedModelsListInputSchema = z
	.object({
		projectId: z.string(),
	})
	.loose();
export type ProjectsRecommendedModelsListInput = z.infer<
	typeof ProjectsRecommendedModelsListInputSchema
>;
export const ProjectsRecommendedModelsListResponseSchema =
	DatarobotObjectSchema;
export type ProjectsRecommendedModelsListResponse = z.infer<
	typeof ProjectsRecommendedModelsListResponseSchema
>;

// projects_retrieve GET /api/v2/projects/{projectId}/
export const ProjectsRetrieveInputSchema = z
	.object({
		projectId: z.string(),
	})
	.loose();
export type ProjectsRetrieveInput = z.infer<typeof ProjectsRetrieveInputSchema>;
export const ProjectsRetrieveResponseSchema = DatarobotObjectSchema;
export type ProjectsRetrieveResponse = z.infer<
	typeof ProjectsRetrieveResponseSchema
>;

// projectsStatus_list GET /api/v2/projects/{projectId}/status/
export const ProjectsStatusListInputSchema = z
	.object({
		projectId: z.string(),
	})
	.loose();
export type ProjectsStatusListInput = z.infer<
	typeof ProjectsStatusListInputSchema
>;
export const ProjectsStatusListResponseSchema = DatarobotObjectSchema;
export type ProjectsStatusListResponse = z.infer<
	typeof ProjectsStatusListResponseSchema
>;

// projectsTrainingPredictions_create POST /api/v2/projects/{projectId}/trainingPredictions/
export const ProjectsTrainingPredictionsCreateInputSchema = z
	.object({
		projectId: z.string(),
	})
	.loose();
export type ProjectsTrainingPredictionsCreateInput = z.infer<
	typeof ProjectsTrainingPredictionsCreateInputSchema
>;
export const ProjectsTrainingPredictionsCreateResponseSchema =
	DatarobotObjectSchema;
export type ProjectsTrainingPredictionsCreateResponse = z.infer<
	typeof ProjectsTrainingPredictionsCreateResponseSchema
>;

// trainingPredictions_list GET /api/v2/projects/{projectId}/trainingPredictions/
export const TrainingPredictionsListInputSchema = z
	.object({
		projectId: z.string(),
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
	})
	.loose();
export type TrainingPredictionsListInput = z.infer<
	typeof TrainingPredictionsListInputSchema
>;
export const TrainingPredictionsListResponseSchema = DatarobotObjectSchema;
export type TrainingPredictionsListResponse = z.infer<
	typeof TrainingPredictionsListResponseSchema
>;

// status_list GET /api/v2/status/
export const StatusListInputSchema = z
	.object({
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
	})
	.loose();
export type StatusListInput = z.infer<typeof StatusListInputSchema>;
export const StatusListResponseSchema = DatarobotListSchema;
export type StatusListResponse = z.infer<typeof StatusListResponseSchema>;

// status_retrieve GET /api/v2/status/{statusId}/
export const StatusRetrieveInputSchema = z
	.object({
		statusId: z.string(),
	})
	.loose();
export type StatusRetrieveInput = z.infer<typeof StatusRetrieveInputSchema>;
export const StatusRetrieveResponseSchema = DatarobotObjectSchema;
export type StatusRetrieveResponse = z.infer<
	typeof StatusRetrieveResponseSchema
>;

// useCases_create POST /api/v2/useCases/
export const UseCasesCreateInputSchema = z.object({}).loose();
export type UseCasesCreateInput = z.infer<typeof UseCasesCreateInputSchema>;
export const UseCasesCreateResponseSchema = DatarobotObjectSchema;
export type UseCasesCreateResponse = z.infer<
	typeof UseCasesCreateResponseSchema
>;

// useCasesDatasets_list GET /api/v2/useCases/{useCaseId}/datasets/
export const UseCasesDatasetsListInputSchema = z
	.object({
		useCaseId: z.string(),
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
		sort: z
			.enum([
				'-columnCount',
				'-createdAt',
				'-createdBy',
				'-dataSourceType',
				'-datasetSize',
				'-datasetSourceType',
				'-lastActivity',
				'-modifiedAt',
				'-modifiedBy',
				'-name',
				'-rowCount',
				'columnCount',
				'createdAt',
				'createdBy',
				'dataSourceType',
				'datasetSize',
				'datasetSourceType',
				'lastActivity',
				'modifiedAt',
				'modifiedBy',
				'name',
				'rowCount',
			])
			.optional(),
		orderBy: z
			.enum([
				'-columnCount',
				'-createdAt',
				'-createdBy',
				'-dataSourceType',
				'-datasetSize',
				'-datasetSourceType',
				'-lastActivity',
				'-modifiedAt',
				'-modifiedBy',
				'-name',
				'-rowCount',
				'columnCount',
				'createdAt',
				'createdBy',
				'dataSourceType',
				'datasetSize',
				'datasetSourceType',
				'lastActivity',
				'modifiedAt',
				'modifiedBy',
				'name',
				'rowCount',
			])
			.optional(),
		search: z.string().optional(),
	})
	.loose();
export type UseCasesDatasetsListInput = z.infer<
	typeof UseCasesDatasetsListInputSchema
>;
export const UseCasesDatasetsListResponseSchema = DatarobotObjectSchema;
export type UseCasesDatasetsListResponse = z.infer<
	typeof UseCasesDatasetsListResponseSchema
>;

// useCases_delete DELETE /api/v2/useCases/{useCaseId}/
export const UseCasesDeleteInputSchema = z
	.object({
		useCaseId: z.string(),
	})
	.loose();
export type UseCasesDeleteInput = z.infer<typeof UseCasesDeleteInputSchema>;
export const UseCasesDeleteResponseSchema = DatarobotObjectSchema;
export type UseCasesDeleteResponse = z.infer<
	typeof UseCasesDeleteResponseSchema
>;

// useCasesDeployments_list GET /api/v2/useCases/{useCaseId}/deployments/
export const UseCasesDeploymentsListInputSchema = z
	.object({
		useCaseId: z.string(),
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
		orderBy: z
			.enum([
				'-createdAt',
				'-createdBy',
				'-lastActivity',
				'-name',
				'-updatedAt',
				'-updatedBy',
				'createdAt',
				'createdBy',
				'lastActivity',
				'name',
				'updatedAt',
				'updatedBy',
			])
			.optional(),
		search: z.string().optional(),
	})
	.loose();
export type UseCasesDeploymentsListInput = z.infer<
	typeof UseCasesDeploymentsListInputSchema
>;
export const UseCasesDeploymentsListResponseSchema = DatarobotObjectSchema;
export type UseCasesDeploymentsListResponse = z.infer<
	typeof UseCasesDeploymentsListResponseSchema
>;

// useCases_list GET /api/v2/useCases/
export const UseCasesListInputSchema = z
	.object({
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
		search: z.string().optional(),
		projectId: z.string().optional(),
		applicationId: z.string().optional(),
		entityId: z.string().optional(),
		entityType: z
			.enum([
				'project',
				'dataset',
				'file',
				'notebook',
				'application',
				'recipe',
				'playground',
				'vectorDatabase',
				'syftrSearchInstance',
				'embeddingModelValidation',
				'customModelVersion',
				'registeredModelVersion',
				'deployment',
				'customApplication',
				'customJob',
			])
			.optional(),
		sort: z
			.enum([
				'-applicationsCount',
				'-createdAt',
				'-createdBy',
				'-customApplicationsCount',
				'-datasetsCount',
				'-description',
				'-filesCount',
				'-id',
				'-name',
				'-notebooksCount',
				'-playgroundsCount',
				'-potentialValue',
				'-projectsCount',
				'-riskLevel',
				'-stage',
				'-updatedAt',
				'-updatedBy',
				'-vectorDatabasesCount',
				'applicationsCount',
				'createdAt',
				'createdBy',
				'customApplicationsCount',
				'datasetsCount',
				'description',
				'filesCount',
				'id',
				'name',
				'notebooksCount',
				'playgroundsCount',
				'potentialValue',
				'projectsCount',
				'riskLevel',
				'stage',
				'updatedAt',
				'updatedBy',
				'vectorDatabasesCount',
			])
			.optional(),
		orderBy: z
			.enum([
				'-applicationsCount',
				'-createdAt',
				'-createdBy',
				'-customApplicationsCount',
				'-datasetsCount',
				'-description',
				'-filesCount',
				'-id',
				'-name',
				'-notebooksCount',
				'-playgroundsCount',
				'-potentialValue',
				'-projectsCount',
				'-riskLevel',
				'-stage',
				'-updatedAt',
				'-updatedBy',
				'-vectorDatabasesCount',
				'applicationsCount',
				'createdAt',
				'createdBy',
				'customApplicationsCount',
				'datasetsCount',
				'description',
				'filesCount',
				'id',
				'name',
				'notebooksCount',
				'playgroundsCount',
				'potentialValue',
				'projectsCount',
				'riskLevel',
				'stage',
				'updatedAt',
				'updatedBy',
				'vectorDatabasesCount',
			])
			.optional(),
		usecaseType: z.enum(['all', 'general', 'walkthrough']).optional(),
		riskLevel: z.string().optional(),
		stage: z.string().optional(),
		createdBy: z.string().optional(),
		showOrgUseCases: z.boolean().optional(),
	})
	.loose();
export type UseCasesListInput = z.infer<typeof UseCasesListInputSchema>;
export const UseCasesListResponseSchema = DatarobotListSchema;
export type UseCasesListResponse = z.infer<typeof UseCasesListResponseSchema>;

// useCases_patch PATCH /api/v2/useCases/{useCaseId}/
export const UseCasesPatchInputSchema = z
	.object({
		useCaseId: z.string(),
	})
	.loose();
export type UseCasesPatchInput = z.infer<typeof UseCasesPatchInputSchema>;
export const UseCasesPatchResponseSchema = DatarobotObjectSchema;
export type UseCasesPatchResponse = z.infer<typeof UseCasesPatchResponseSchema>;

// useCasesProjects_list GET /api/v2/useCases/{useCaseId}/projects/
export const UseCasesProjectsListInputSchema = z
	.object({
		useCaseId: z.string(),
		offset: z.number().int().optional(),
		limit: z.number().int().optional(),
		search: z.string().optional(),
		sort: z
			.enum([
				'-createdAt',
				'-createdBy',
				'-dataset',
				'-featureCount',
				'-fullName',
				'-lastActivity',
				'-models',
				'-name',
				'-projectId',
				'-rowCount',
				'-target',
				'-targetType',
				'-timeAware',
				'-updatedAt',
				'-updatedBy',
				'createdAt',
				'createdBy',
				'dataset',
				'featureCount',
				'fullName',
				'lastActivity',
				'models',
				'name',
				'projectId',
				'rowCount',
				'target',
				'targetType',
				'timeAware',
				'updatedAt',
				'updatedBy',
			])
			.optional(),
		orderBy: z
			.enum([
				'-createdAt',
				'-createdBy',
				'-dataset',
				'-featureCount',
				'-fullName',
				'-lastActivity',
				'-models',
				'-name',
				'-projectId',
				'-rowCount',
				'-target',
				'-targetType',
				'-timeAware',
				'-updatedAt',
				'-updatedBy',
				'createdAt',
				'createdBy',
				'dataset',
				'featureCount',
				'fullName',
				'lastActivity',
				'models',
				'name',
				'projectId',
				'rowCount',
				'target',
				'targetType',
				'timeAware',
				'updatedAt',
				'updatedBy',
			])
			.optional(),
	})
	.loose();
export type UseCasesProjectsListInput = z.infer<
	typeof UseCasesProjectsListInputSchema
>;
export const UseCasesProjectsListResponseSchema = DatarobotObjectSchema;
export type UseCasesProjectsListResponse = z.infer<
	typeof UseCasesProjectsListResponseSchema
>;

// useCases_retrieve GET /api/v2/useCases/{useCaseId}/
export const UseCasesRetrieveInputSchema = z
	.object({
		useCaseId: z.string(),
	})
	.loose();
export type UseCasesRetrieveInput = z.infer<typeof UseCasesRetrieveInputSchema>;
export const UseCasesRetrieveResponseSchema = DatarobotObjectSchema;
export type UseCasesRetrieveResponse = z.infer<
	typeof UseCasesRetrieveResponseSchema
>;

// version_list GET /api/v2/version/
export const VersionListInputSchema = z.object({}).loose();
export type VersionListInput = z.infer<typeof VersionListInputSchema>;
export const VersionListResponseSchema = DatarobotListSchema;
export type VersionListResponse = z.infer<typeof VersionListResponseSchema>;

export const DatarobotEndpointInputSchemas = {
	batchPredictionsCreate: BatchPredictionsCreateInputSchema,
	batchPredictionsDelete: BatchPredictionsDeleteInputSchema,
	batchPredictionsFromExistingCreate:
		BatchPredictionsFromExistingCreateInputSchema,
	batchPredictionsFromJobDefinitionCreate:
		BatchPredictionsFromJobDefinitionCreateInputSchema,
	batchPredictionsList: BatchPredictionsListInputSchema,
	batchPredictionsRetrieve: BatchPredictionsRetrieveInputSchema,
	catalogItemsList: CatalogItemsListInputSchema,
	catalogItemsRetrieve: CatalogItemsRetrieveInputSchema,
	credentialsCreate: CredentialsCreateInputSchema,
	credentialsDelete: CredentialsDeleteInputSchema,
	credentialsList: CredentialsListInputSchema,
	credentialsRetrieve: CredentialsRetrieveInputSchema,
	customModelsCreate: CustomModelsCreateInputSchema,
	customModelsDelete: CustomModelsDeleteInputSchema,
	customModelsList: CustomModelsListInputSchema,
	customModelsRetrieve: CustomModelsRetrieveInputSchema,
	customModelsVersionsCreate: CustomModelsVersionsCreateInputSchema,
	customModelsVersionsList: CustomModelsVersionsListInputSchema,
	datasetsAllFeaturesDetailsList: DatasetsAllFeaturesDetailsListInputSchema,
	datasetsDelete: DatasetsDeleteInputSchema,
	datasetsFeaturelistsList: DatasetsFeaturelistsListInputSchema,
	datasetsFileList: DatasetsFileListInputSchema,
	datasetsFromDataSourceCreate: DatasetsFromDataSourceCreateInputSchema,
	datasetsFromFileCreate: DatasetsFromFileCreateInputSchema,
	datasetsFromURLCreate: DatasetsFromURLCreateInputSchema,
	datasetsList: DatasetsListInputSchema,
	datasetsPatch: DatasetsPatchInputSchema,
	datasetsProjectsList: DatasetsProjectsListInputSchema,
	datasetsRetrieve: DatasetsRetrieveInputSchema,
	datasetsVersionsDelete: DatasetsVersionsDeleteInputSchema,
	datasetsVersionsFromFileCreate: DatasetsVersionsFromFileCreateInputSchema,
	datasetsVersionsFromURLCreate: DatasetsVersionsFromURLCreateInputSchema,
	datasetsVersionsList: DatasetsVersionsListInputSchema,
	datasetsVersionsRetrieve: DatasetsVersionsRetrieveInputSchema,
	deploymentsAccuracyList: DeploymentsAccuracyListInputSchema,
	deploymentsAccuracyOverTimeList: DeploymentsAccuracyOverTimeListInputSchema,
	deploymentsCapabilitiesList: DeploymentsCapabilitiesListInputSchema,
	deploymentsDelete: DeploymentsDeleteInputSchema,
	deploymentsFeaturesList: DeploymentsFeaturesListInputSchema,
	deploymentsFromLearningModelCreate:
		DeploymentsFromLearningModelCreateInputSchema,
	deploymentsFromModelPackageCreate:
		DeploymentsFromModelPackageCreateInputSchema,
	deploymentsList: DeploymentsListInputSchema,
	deploymentsModelHistoryList: DeploymentsModelHistoryListInputSchema,
	deploymentsModelPatchMany: DeploymentsModelPatchManyInputSchema,
	deploymentsPatch: DeploymentsPatchInputSchema,
	deploymentsPredictionsOverTimeList:
		DeploymentsPredictionsOverTimeListInputSchema,
	deploymentsRetrieve: DeploymentsRetrieveInputSchema,
	deploymentsServiceStatsList: DeploymentsServiceStatsListInputSchema,
	deploymentsSettingsList: DeploymentsSettingsListInputSchema,
	deploymentsSettingsPatchMany: DeploymentsSettingsPatchManyInputSchema,
	deploymentsSharedRolesList: DeploymentsSharedRolesListInputSchema,
	modelPackagesFeaturesList: ModelPackagesFeaturesListInputSchema,
	modelPackagesFromLeaderboardCreate:
		ModelPackagesFromLeaderboardCreateInputSchema,
	modelPackagesList: ModelPackagesListInputSchema,
	modelPackagesRetrieve: ModelPackagesRetrieveInputSchema,
	predictionServersList: PredictionServersListInputSchema,
	configureAndStartAutopilot: ConfigureAndStartAutopilotInputSchema,
	projectsAccessControlList: ProjectsAccessControlListInputSchema,
	projectsAutopilotCreate: ProjectsAutopilotCreateInputSchema,
	projectsAutopilotsCreate: ProjectsAutopilotsCreateInputSchema,
	projectsBlueprintsList: ProjectsBlueprintsListInputSchema,
	projectsBlueprintsRetrieve: ProjectsBlueprintsRetrieveInputSchema,
	projectsCreate: ProjectsCreateInputSchema,
	projectsDatetimeModelsList: ProjectsDatetimeModelsListInputSchema,
	projectsDelete: ProjectsDeleteInputSchema,
	projectsDeploymentReadyModelsCreate:
		ProjectsDeploymentReadyModelsCreateInputSchema,
	projectsFeaturelistsCreate: ProjectsFeaturelistsCreateInputSchema,
	projectsFeaturelistsDelete: ProjectsFeaturelistsDeleteInputSchema,
	projectsFeaturelistsList: ProjectsFeaturelistsListInputSchema,
	projectsFeaturelistsPatch: ProjectsFeaturelistsPatchInputSchema,
	projectsFeaturelistsRetrieve: ProjectsFeaturelistsRetrieveInputSchema,
	projectsFeaturesList: ProjectsFeaturesListInputSchema,
	projectsFeaturesRetrieve: ProjectsFeaturesRetrieveInputSchema,
	projectsJobsDelete: ProjectsJobsDeleteInputSchema,
	projectsJobsList: ProjectsJobsListInputSchema,
	projectsJobsRetrieve: ProjectsJobsRetrieveInputSchema,
	projectsList: ProjectsListInputSchema,
	projectsModelingFeaturelistsCreate:
		ProjectsModelingFeaturelistsCreateInputSchema,
	projectsModelingFeaturelistsList: ProjectsModelingFeaturelistsListInputSchema,
	projectsModelsCreate: ProjectsModelsCreateInputSchema,
	projectsModelsDelete: ProjectsModelsDeleteInputSchema,
	projectsModelsFromModelCreate: ProjectsModelsFromModelCreateInputSchema,
	projectsModelsList: ProjectsModelsListInputSchema,
	projectsModelsRetrieve: ProjectsModelsRetrieveInputSchema,
	projectsPatch: ProjectsPatchInputSchema,
	projectsPredictionDatasetsDelete: ProjectsPredictionDatasetsDeleteInputSchema,
	projectsPredictionDatasetsList: ProjectsPredictionDatasetsListInputSchema,
	projectsPredictionDatasetsRetrieve:
		ProjectsPredictionDatasetsRetrieveInputSchema,
	projectsPredictionsCreate: ProjectsPredictionsCreateInputSchema,
	projectsPredictionsList: ProjectsPredictionsListInputSchema,
	projectsPredictionsRetrieve: ProjectsPredictionsRetrieveInputSchema,
	projectsRecommendedModelsList: ProjectsRecommendedModelsListInputSchema,
	projectsRetrieve: ProjectsRetrieveInputSchema,
	projectsStatusList: ProjectsStatusListInputSchema,
	projectsTrainingPredictionsCreate:
		ProjectsTrainingPredictionsCreateInputSchema,
	trainingPredictionsList: TrainingPredictionsListInputSchema,
	statusList: StatusListInputSchema,
	statusRetrieve: StatusRetrieveInputSchema,
	useCasesCreate: UseCasesCreateInputSchema,
	useCasesDatasetsList: UseCasesDatasetsListInputSchema,
	useCasesDelete: UseCasesDeleteInputSchema,
	useCasesDeploymentsList: UseCasesDeploymentsListInputSchema,
	useCasesList: UseCasesListInputSchema,
	useCasesPatch: UseCasesPatchInputSchema,
	useCasesProjectsList: UseCasesProjectsListInputSchema,
	useCasesRetrieve: UseCasesRetrieveInputSchema,
	versionList: VersionListInputSchema,
} as const;
export const DatarobotEndpointOutputSchemas = {
	batchPredictionsCreate: BatchPredictionsCreateResponseSchema,
	batchPredictionsDelete: BatchPredictionsDeleteResponseSchema,
	batchPredictionsFromExistingCreate:
		BatchPredictionsFromExistingCreateResponseSchema,
	batchPredictionsFromJobDefinitionCreate:
		BatchPredictionsFromJobDefinitionCreateResponseSchema,
	batchPredictionsList: BatchPredictionsListResponseSchema,
	batchPredictionsRetrieve: BatchPredictionsRetrieveResponseSchema,
	catalogItemsList: CatalogItemsListResponseSchema,
	catalogItemsRetrieve: CatalogItemsRetrieveResponseSchema,
	credentialsCreate: CredentialsCreateResponseSchema,
	credentialsDelete: CredentialsDeleteResponseSchema,
	credentialsList: CredentialsListResponseSchema,
	credentialsRetrieve: CredentialsRetrieveResponseSchema,
	customModelsCreate: CustomModelsCreateResponseSchema,
	customModelsDelete: CustomModelsDeleteResponseSchema,
	customModelsList: CustomModelsListResponseSchema,
	customModelsRetrieve: CustomModelsRetrieveResponseSchema,
	customModelsVersionsCreate: CustomModelsVersionsCreateResponseSchema,
	customModelsVersionsList: CustomModelsVersionsListResponseSchema,
	datasetsAllFeaturesDetailsList: DatasetsAllFeaturesDetailsListResponseSchema,
	datasetsDelete: DatasetsDeleteResponseSchema,
	datasetsFeaturelistsList: DatasetsFeaturelistsListResponseSchema,
	datasetsFileList: DatasetsFileListResponseSchema,
	datasetsFromDataSourceCreate: DatasetsFromDataSourceCreateResponseSchema,
	datasetsFromFileCreate: DatasetsFromFileCreateResponseSchema,
	datasetsFromURLCreate: DatasetsFromURLCreateResponseSchema,
	datasetsList: DatasetsListResponseSchema,
	datasetsPatch: DatasetsPatchResponseSchema,
	datasetsProjectsList: DatasetsProjectsListResponseSchema,
	datasetsRetrieve: DatasetsRetrieveResponseSchema,
	datasetsVersionsDelete: DatasetsVersionsDeleteResponseSchema,
	datasetsVersionsFromFileCreate: DatasetsVersionsFromFileCreateResponseSchema,
	datasetsVersionsFromURLCreate: DatasetsVersionsFromURLCreateResponseSchema,
	datasetsVersionsList: DatasetsVersionsListResponseSchema,
	datasetsVersionsRetrieve: DatasetsVersionsRetrieveResponseSchema,
	deploymentsAccuracyList: DeploymentsAccuracyListResponseSchema,
	deploymentsAccuracyOverTimeList:
		DeploymentsAccuracyOverTimeListResponseSchema,
	deploymentsCapabilitiesList: DeploymentsCapabilitiesListResponseSchema,
	deploymentsDelete: DeploymentsDeleteResponseSchema,
	deploymentsFeaturesList: DeploymentsFeaturesListResponseSchema,
	deploymentsFromLearningModelCreate:
		DeploymentsFromLearningModelCreateResponseSchema,
	deploymentsFromModelPackageCreate:
		DeploymentsFromModelPackageCreateResponseSchema,
	deploymentsList: DeploymentsListResponseSchema,
	deploymentsModelHistoryList: DeploymentsModelHistoryListResponseSchema,
	deploymentsModelPatchMany: DeploymentsModelPatchManyResponseSchema,
	deploymentsPatch: DeploymentsPatchResponseSchema,
	deploymentsPredictionsOverTimeList:
		DeploymentsPredictionsOverTimeListResponseSchema,
	deploymentsRetrieve: DeploymentsRetrieveResponseSchema,
	deploymentsServiceStatsList: DeploymentsServiceStatsListResponseSchema,
	deploymentsSettingsList: DeploymentsSettingsListResponseSchema,
	deploymentsSettingsPatchMany: DeploymentsSettingsPatchManyResponseSchema,
	deploymentsSharedRolesList: DeploymentsSharedRolesListResponseSchema,
	modelPackagesFeaturesList: ModelPackagesFeaturesListResponseSchema,
	modelPackagesFromLeaderboardCreate:
		ModelPackagesFromLeaderboardCreateResponseSchema,
	modelPackagesList: ModelPackagesListResponseSchema,
	modelPackagesRetrieve: ModelPackagesRetrieveResponseSchema,
	predictionServersList: PredictionServersListResponseSchema,
	configureAndStartAutopilot: ConfigureAndStartAutopilotResponseSchema,
	projectsAccessControlList: ProjectsAccessControlListResponseSchema,
	projectsAutopilotCreate: ProjectsAutopilotCreateResponseSchema,
	projectsAutopilotsCreate: ProjectsAutopilotsCreateResponseSchema,
	projectsBlueprintsList: ProjectsBlueprintsListResponseSchema,
	projectsBlueprintsRetrieve: ProjectsBlueprintsRetrieveResponseSchema,
	projectsCreate: ProjectsCreateResponseSchema,
	projectsDatetimeModelsList: ProjectsDatetimeModelsListResponseSchema,
	projectsDelete: ProjectsDeleteResponseSchema,
	projectsDeploymentReadyModelsCreate:
		ProjectsDeploymentReadyModelsCreateResponseSchema,
	projectsFeaturelistsCreate: ProjectsFeaturelistsCreateResponseSchema,
	projectsFeaturelistsDelete: ProjectsFeaturelistsDeleteResponseSchema,
	projectsFeaturelistsList: ProjectsFeaturelistsListResponseSchema,
	projectsFeaturelistsPatch: ProjectsFeaturelistsPatchResponseSchema,
	projectsFeaturelistsRetrieve: ProjectsFeaturelistsRetrieveResponseSchema,
	projectsFeaturesList: ProjectsFeaturesListResponseSchema,
	projectsFeaturesRetrieve: ProjectsFeaturesRetrieveResponseSchema,
	projectsJobsDelete: ProjectsJobsDeleteResponseSchema,
	projectsJobsList: ProjectsJobsListResponseSchema,
	projectsJobsRetrieve: ProjectsJobsRetrieveResponseSchema,
	projectsList: ProjectsListResponseSchema,
	projectsModelingFeaturelistsCreate:
		ProjectsModelingFeaturelistsCreateResponseSchema,
	projectsModelingFeaturelistsList:
		ProjectsModelingFeaturelistsListResponseSchema,
	projectsModelsCreate: ProjectsModelsCreateResponseSchema,
	projectsModelsDelete: ProjectsModelsDeleteResponseSchema,
	projectsModelsFromModelCreate: ProjectsModelsFromModelCreateResponseSchema,
	projectsModelsList: ProjectsModelsListResponseSchema,
	projectsModelsRetrieve: ProjectsModelsRetrieveResponseSchema,
	projectsPatch: ProjectsPatchResponseSchema,
	projectsPredictionDatasetsDelete:
		ProjectsPredictionDatasetsDeleteResponseSchema,
	projectsPredictionDatasetsList: ProjectsPredictionDatasetsListResponseSchema,
	projectsPredictionDatasetsRetrieve:
		ProjectsPredictionDatasetsRetrieveResponseSchema,
	projectsPredictionsCreate: ProjectsPredictionsCreateResponseSchema,
	projectsPredictionsList: ProjectsPredictionsListResponseSchema,
	projectsPredictionsRetrieve: ProjectsPredictionsRetrieveResponseSchema,
	projectsRecommendedModelsList: ProjectsRecommendedModelsListResponseSchema,
	projectsRetrieve: ProjectsRetrieveResponseSchema,
	projectsStatusList: ProjectsStatusListResponseSchema,
	projectsTrainingPredictionsCreate:
		ProjectsTrainingPredictionsCreateResponseSchema,
	trainingPredictionsList: TrainingPredictionsListResponseSchema,
	statusList: StatusListResponseSchema,
	statusRetrieve: StatusRetrieveResponseSchema,
	useCasesCreate: UseCasesCreateResponseSchema,
	useCasesDatasetsList: UseCasesDatasetsListResponseSchema,
	useCasesDelete: UseCasesDeleteResponseSchema,
	useCasesDeploymentsList: UseCasesDeploymentsListResponseSchema,
	useCasesList: UseCasesListResponseSchema,
	useCasesPatch: UseCasesPatchResponseSchema,
	useCasesProjectsList: UseCasesProjectsListResponseSchema,
	useCasesRetrieve: UseCasesRetrieveResponseSchema,
	versionList: VersionListResponseSchema,
} as const;
export type DatarobotEndpointInputs = {
	batchPredictionsCreate: BatchPredictionsCreateInput;
	batchPredictionsDelete: BatchPredictionsDeleteInput;
	batchPredictionsFromExistingCreate: BatchPredictionsFromExistingCreateInput;
	batchPredictionsFromJobDefinitionCreate: BatchPredictionsFromJobDefinitionCreateInput;
	batchPredictionsList: BatchPredictionsListInput;
	batchPredictionsRetrieve: BatchPredictionsRetrieveInput;
	catalogItemsList: CatalogItemsListInput;
	catalogItemsRetrieve: CatalogItemsRetrieveInput;
	credentialsCreate: CredentialsCreateInput;
	credentialsDelete: CredentialsDeleteInput;
	credentialsList: CredentialsListInput;
	credentialsRetrieve: CredentialsRetrieveInput;
	customModelsCreate: CustomModelsCreateInput;
	customModelsDelete: CustomModelsDeleteInput;
	customModelsList: CustomModelsListInput;
	customModelsRetrieve: CustomModelsRetrieveInput;
	customModelsVersionsCreate: CustomModelsVersionsCreateInput;
	customModelsVersionsList: CustomModelsVersionsListInput;
	datasetsAllFeaturesDetailsList: DatasetsAllFeaturesDetailsListInput;
	datasetsDelete: DatasetsDeleteInput;
	datasetsFeaturelistsList: DatasetsFeaturelistsListInput;
	datasetsFileList: DatasetsFileListInput;
	datasetsFromDataSourceCreate: DatasetsFromDataSourceCreateInput;
	datasetsFromFileCreate: DatasetsFromFileCreateInput;
	datasetsFromURLCreate: DatasetsFromURLCreateInput;
	datasetsList: DatasetsListInput;
	datasetsPatch: DatasetsPatchInput;
	datasetsProjectsList: DatasetsProjectsListInput;
	datasetsRetrieve: DatasetsRetrieveInput;
	datasetsVersionsDelete: DatasetsVersionsDeleteInput;
	datasetsVersionsFromFileCreate: DatasetsVersionsFromFileCreateInput;
	datasetsVersionsFromURLCreate: DatasetsVersionsFromURLCreateInput;
	datasetsVersionsList: DatasetsVersionsListInput;
	datasetsVersionsRetrieve: DatasetsVersionsRetrieveInput;
	deploymentsAccuracyList: DeploymentsAccuracyListInput;
	deploymentsAccuracyOverTimeList: DeploymentsAccuracyOverTimeListInput;
	deploymentsCapabilitiesList: DeploymentsCapabilitiesListInput;
	deploymentsDelete: DeploymentsDeleteInput;
	deploymentsFeaturesList: DeploymentsFeaturesListInput;
	deploymentsFromLearningModelCreate: DeploymentsFromLearningModelCreateInput;
	deploymentsFromModelPackageCreate: DeploymentsFromModelPackageCreateInput;
	deploymentsList: DeploymentsListInput;
	deploymentsModelHistoryList: DeploymentsModelHistoryListInput;
	deploymentsModelPatchMany: DeploymentsModelPatchManyInput;
	deploymentsPatch: DeploymentsPatchInput;
	deploymentsPredictionsOverTimeList: DeploymentsPredictionsOverTimeListInput;
	deploymentsRetrieve: DeploymentsRetrieveInput;
	deploymentsServiceStatsList: DeploymentsServiceStatsListInput;
	deploymentsSettingsList: DeploymentsSettingsListInput;
	deploymentsSettingsPatchMany: DeploymentsSettingsPatchManyInput;
	deploymentsSharedRolesList: DeploymentsSharedRolesListInput;
	modelPackagesFeaturesList: ModelPackagesFeaturesListInput;
	modelPackagesFromLeaderboardCreate: ModelPackagesFromLeaderboardCreateInput;
	modelPackagesList: ModelPackagesListInput;
	modelPackagesRetrieve: ModelPackagesRetrieveInput;
	predictionServersList: PredictionServersListInput;
	configureAndStartAutopilot: ConfigureAndStartAutopilotInput;
	projectsAccessControlList: ProjectsAccessControlListInput;
	projectsAutopilotCreate: ProjectsAutopilotCreateInput;
	projectsAutopilotsCreate: ProjectsAutopilotsCreateInput;
	projectsBlueprintsList: ProjectsBlueprintsListInput;
	projectsBlueprintsRetrieve: ProjectsBlueprintsRetrieveInput;
	projectsCreate: ProjectsCreateInput;
	projectsDatetimeModelsList: ProjectsDatetimeModelsListInput;
	projectsDelete: ProjectsDeleteInput;
	projectsDeploymentReadyModelsCreate: ProjectsDeploymentReadyModelsCreateInput;
	projectsFeaturelistsCreate: ProjectsFeaturelistsCreateInput;
	projectsFeaturelistsDelete: ProjectsFeaturelistsDeleteInput;
	projectsFeaturelistsList: ProjectsFeaturelistsListInput;
	projectsFeaturelistsPatch: ProjectsFeaturelistsPatchInput;
	projectsFeaturelistsRetrieve: ProjectsFeaturelistsRetrieveInput;
	projectsFeaturesList: ProjectsFeaturesListInput;
	projectsFeaturesRetrieve: ProjectsFeaturesRetrieveInput;
	projectsJobsDelete: ProjectsJobsDeleteInput;
	projectsJobsList: ProjectsJobsListInput;
	projectsJobsRetrieve: ProjectsJobsRetrieveInput;
	projectsList: ProjectsListInput;
	projectsModelingFeaturelistsCreate: ProjectsModelingFeaturelistsCreateInput;
	projectsModelingFeaturelistsList: ProjectsModelingFeaturelistsListInput;
	projectsModelsCreate: ProjectsModelsCreateInput;
	projectsModelsDelete: ProjectsModelsDeleteInput;
	projectsModelsFromModelCreate: ProjectsModelsFromModelCreateInput;
	projectsModelsList: ProjectsModelsListInput;
	projectsModelsRetrieve: ProjectsModelsRetrieveInput;
	projectsPatch: ProjectsPatchInput;
	projectsPredictionDatasetsDelete: ProjectsPredictionDatasetsDeleteInput;
	projectsPredictionDatasetsList: ProjectsPredictionDatasetsListInput;
	projectsPredictionDatasetsRetrieve: ProjectsPredictionDatasetsRetrieveInput;
	projectsPredictionsCreate: ProjectsPredictionsCreateInput;
	projectsPredictionsList: ProjectsPredictionsListInput;
	projectsPredictionsRetrieve: ProjectsPredictionsRetrieveInput;
	projectsRecommendedModelsList: ProjectsRecommendedModelsListInput;
	projectsRetrieve: ProjectsRetrieveInput;
	projectsStatusList: ProjectsStatusListInput;
	projectsTrainingPredictionsCreate: ProjectsTrainingPredictionsCreateInput;
	trainingPredictionsList: TrainingPredictionsListInput;
	statusList: StatusListInput;
	statusRetrieve: StatusRetrieveInput;
	useCasesCreate: UseCasesCreateInput;
	useCasesDatasetsList: UseCasesDatasetsListInput;
	useCasesDelete: UseCasesDeleteInput;
	useCasesDeploymentsList: UseCasesDeploymentsListInput;
	useCasesList: UseCasesListInput;
	useCasesPatch: UseCasesPatchInput;
	useCasesProjectsList: UseCasesProjectsListInput;
	useCasesRetrieve: UseCasesRetrieveInput;
	versionList: VersionListInput;
};
export type DatarobotEndpointOutputs = {
	batchPredictionsCreate: BatchPredictionsCreateResponse;
	batchPredictionsDelete: BatchPredictionsDeleteResponse;
	batchPredictionsFromExistingCreate: BatchPredictionsFromExistingCreateResponse;
	batchPredictionsFromJobDefinitionCreate: BatchPredictionsFromJobDefinitionCreateResponse;
	batchPredictionsList: BatchPredictionsListResponse;
	batchPredictionsRetrieve: BatchPredictionsRetrieveResponse;
	catalogItemsList: CatalogItemsListResponse;
	catalogItemsRetrieve: CatalogItemsRetrieveResponse;
	credentialsCreate: CredentialsCreateResponse;
	credentialsDelete: CredentialsDeleteResponse;
	credentialsList: CredentialsListResponse;
	credentialsRetrieve: CredentialsRetrieveResponse;
	customModelsCreate: CustomModelsCreateResponse;
	customModelsDelete: CustomModelsDeleteResponse;
	customModelsList: CustomModelsListResponse;
	customModelsRetrieve: CustomModelsRetrieveResponse;
	customModelsVersionsCreate: CustomModelsVersionsCreateResponse;
	customModelsVersionsList: CustomModelsVersionsListResponse;
	datasetsAllFeaturesDetailsList: DatasetsAllFeaturesDetailsListResponse;
	datasetsDelete: DatasetsDeleteResponse;
	datasetsFeaturelistsList: DatasetsFeaturelistsListResponse;
	datasetsFileList: DatasetsFileListResponse;
	datasetsFromDataSourceCreate: DatasetsFromDataSourceCreateResponse;
	datasetsFromFileCreate: DatasetsFromFileCreateResponse;
	datasetsFromURLCreate: DatasetsFromURLCreateResponse;
	datasetsList: DatasetsListResponse;
	datasetsPatch: DatasetsPatchResponse;
	datasetsProjectsList: DatasetsProjectsListResponse;
	datasetsRetrieve: DatasetsRetrieveResponse;
	datasetsVersionsDelete: DatasetsVersionsDeleteResponse;
	datasetsVersionsFromFileCreate: DatasetsVersionsFromFileCreateResponse;
	datasetsVersionsFromURLCreate: DatasetsVersionsFromURLCreateResponse;
	datasetsVersionsList: DatasetsVersionsListResponse;
	datasetsVersionsRetrieve: DatasetsVersionsRetrieveResponse;
	deploymentsAccuracyList: DeploymentsAccuracyListResponse;
	deploymentsAccuracyOverTimeList: DeploymentsAccuracyOverTimeListResponse;
	deploymentsCapabilitiesList: DeploymentsCapabilitiesListResponse;
	deploymentsDelete: DeploymentsDeleteResponse;
	deploymentsFeaturesList: DeploymentsFeaturesListResponse;
	deploymentsFromLearningModelCreate: DeploymentsFromLearningModelCreateResponse;
	deploymentsFromModelPackageCreate: DeploymentsFromModelPackageCreateResponse;
	deploymentsList: DeploymentsListResponse;
	deploymentsModelHistoryList: DeploymentsModelHistoryListResponse;
	deploymentsModelPatchMany: DeploymentsModelPatchManyResponse;
	deploymentsPatch: DeploymentsPatchResponse;
	deploymentsPredictionsOverTimeList: DeploymentsPredictionsOverTimeListResponse;
	deploymentsRetrieve: DeploymentsRetrieveResponse;
	deploymentsServiceStatsList: DeploymentsServiceStatsListResponse;
	deploymentsSettingsList: DeploymentsSettingsListResponse;
	deploymentsSettingsPatchMany: DeploymentsSettingsPatchManyResponse;
	deploymentsSharedRolesList: DeploymentsSharedRolesListResponse;
	modelPackagesFeaturesList: ModelPackagesFeaturesListResponse;
	modelPackagesFromLeaderboardCreate: ModelPackagesFromLeaderboardCreateResponse;
	modelPackagesList: ModelPackagesListResponse;
	modelPackagesRetrieve: ModelPackagesRetrieveResponse;
	predictionServersList: PredictionServersListResponse;
	configureAndStartAutopilot: ConfigureAndStartAutopilotResponse;
	projectsAccessControlList: ProjectsAccessControlListResponse;
	projectsAutopilotCreate: ProjectsAutopilotCreateResponse;
	projectsAutopilotsCreate: ProjectsAutopilotsCreateResponse;
	projectsBlueprintsList: ProjectsBlueprintsListResponse;
	projectsBlueprintsRetrieve: ProjectsBlueprintsRetrieveResponse;
	projectsCreate: ProjectsCreateResponse;
	projectsDatetimeModelsList: ProjectsDatetimeModelsListResponse;
	projectsDelete: ProjectsDeleteResponse;
	projectsDeploymentReadyModelsCreate: ProjectsDeploymentReadyModelsCreateResponse;
	projectsFeaturelistsCreate: ProjectsFeaturelistsCreateResponse;
	projectsFeaturelistsDelete: ProjectsFeaturelistsDeleteResponse;
	projectsFeaturelistsList: ProjectsFeaturelistsListResponse;
	projectsFeaturelistsPatch: ProjectsFeaturelistsPatchResponse;
	projectsFeaturelistsRetrieve: ProjectsFeaturelistsRetrieveResponse;
	projectsFeaturesList: ProjectsFeaturesListResponse;
	projectsFeaturesRetrieve: ProjectsFeaturesRetrieveResponse;
	projectsJobsDelete: ProjectsJobsDeleteResponse;
	projectsJobsList: ProjectsJobsListResponse;
	projectsJobsRetrieve: ProjectsJobsRetrieveResponse;
	projectsList: ProjectsListResponse;
	projectsModelingFeaturelistsCreate: ProjectsModelingFeaturelistsCreateResponse;
	projectsModelingFeaturelistsList: ProjectsModelingFeaturelistsListResponse;
	projectsModelsCreate: ProjectsModelsCreateResponse;
	projectsModelsDelete: ProjectsModelsDeleteResponse;
	projectsModelsFromModelCreate: ProjectsModelsFromModelCreateResponse;
	projectsModelsList: ProjectsModelsListResponse;
	projectsModelsRetrieve: ProjectsModelsRetrieveResponse;
	projectsPatch: ProjectsPatchResponse;
	projectsPredictionDatasetsDelete: ProjectsPredictionDatasetsDeleteResponse;
	projectsPredictionDatasetsList: ProjectsPredictionDatasetsListResponse;
	projectsPredictionDatasetsRetrieve: ProjectsPredictionDatasetsRetrieveResponse;
	projectsPredictionsCreate: ProjectsPredictionsCreateResponse;
	projectsPredictionsList: ProjectsPredictionsListResponse;
	projectsPredictionsRetrieve: ProjectsPredictionsRetrieveResponse;
	projectsRecommendedModelsList: ProjectsRecommendedModelsListResponse;
	projectsRetrieve: ProjectsRetrieveResponse;
	projectsStatusList: ProjectsStatusListResponse;
	projectsTrainingPredictionsCreate: ProjectsTrainingPredictionsCreateResponse;
	trainingPredictionsList: TrainingPredictionsListResponse;
	statusList: StatusListResponse;
	statusRetrieve: StatusRetrieveResponse;
	useCasesCreate: UseCasesCreateResponse;
	useCasesDatasetsList: UseCasesDatasetsListResponse;
	useCasesDelete: UseCasesDeleteResponse;
	useCasesDeploymentsList: UseCasesDeploymentsListResponse;
	useCasesList: UseCasesListResponse;
	useCasesPatch: UseCasesPatchResponse;
	useCasesProjectsList: UseCasesProjectsListResponse;
	useCasesRetrieve: UseCasesRetrieveResponse;
	versionList: VersionListResponse;
};
