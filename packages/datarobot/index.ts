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
	BatchPredictions,
	CatalogItems,
	Credentials,
	CustomModels,
	Datasets,
	Deployments,
	ModelPackages,
	PredictionServers,
	Projects,
	Status,
	UseCases,
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
	batchPredictionsCreate: DatarobotEndpoint<'batchPredictionsCreate'>;
	batchPredictionsDelete: DatarobotEndpoint<'batchPredictionsDelete'>;
	batchPredictionsFromExistingCreate: DatarobotEndpoint<'batchPredictionsFromExistingCreate'>;
	batchPredictionsFromJobDefinitionCreate: DatarobotEndpoint<'batchPredictionsFromJobDefinitionCreate'>;
	batchPredictionsList: DatarobotEndpoint<'batchPredictionsList'>;
	batchPredictionsRetrieve: DatarobotEndpoint<'batchPredictionsRetrieve'>;
	catalogItemsList: DatarobotEndpoint<'catalogItemsList'>;
	catalogItemsRetrieve: DatarobotEndpoint<'catalogItemsRetrieve'>;
	credentialsCreate: DatarobotEndpoint<'credentialsCreate'>;
	credentialsDelete: DatarobotEndpoint<'credentialsDelete'>;
	credentialsList: DatarobotEndpoint<'credentialsList'>;
	credentialsRetrieve: DatarobotEndpoint<'credentialsRetrieve'>;
	customModelsCreate: DatarobotEndpoint<'customModelsCreate'>;
	customModelsDelete: DatarobotEndpoint<'customModelsDelete'>;
	customModelsList: DatarobotEndpoint<'customModelsList'>;
	customModelsRetrieve: DatarobotEndpoint<'customModelsRetrieve'>;
	customModelsVersionsCreate: DatarobotEndpoint<'customModelsVersionsCreate'>;
	customModelsVersionsList: DatarobotEndpoint<'customModelsVersionsList'>;
	datasetsAllFeaturesDetailsList: DatarobotEndpoint<'datasetsAllFeaturesDetailsList'>;
	datasetsDelete: DatarobotEndpoint<'datasetsDelete'>;
	datasetsFeaturelistsList: DatarobotEndpoint<'datasetsFeaturelistsList'>;
	datasetsFileList: DatarobotEndpoint<'datasetsFileList'>;
	datasetsFromDataSourceCreate: DatarobotEndpoint<'datasetsFromDataSourceCreate'>;
	datasetsFromFileCreate: DatarobotEndpoint<'datasetsFromFileCreate'>;
	datasetsFromURLCreate: DatarobotEndpoint<'datasetsFromURLCreate'>;
	datasetsList: DatarobotEndpoint<'datasetsList'>;
	datasetsPatch: DatarobotEndpoint<'datasetsPatch'>;
	datasetsProjectsList: DatarobotEndpoint<'datasetsProjectsList'>;
	datasetsRetrieve: DatarobotEndpoint<'datasetsRetrieve'>;
	datasetsVersionsDelete: DatarobotEndpoint<'datasetsVersionsDelete'>;
	datasetsVersionsFromFileCreate: DatarobotEndpoint<'datasetsVersionsFromFileCreate'>;
	datasetsVersionsFromURLCreate: DatarobotEndpoint<'datasetsVersionsFromURLCreate'>;
	datasetsVersionsList: DatarobotEndpoint<'datasetsVersionsList'>;
	datasetsVersionsRetrieve: DatarobotEndpoint<'datasetsVersionsRetrieve'>;
	deploymentsAccuracyList: DatarobotEndpoint<'deploymentsAccuracyList'>;
	deploymentsAccuracyOverTimeList: DatarobotEndpoint<'deploymentsAccuracyOverTimeList'>;
	deploymentsCapabilitiesList: DatarobotEndpoint<'deploymentsCapabilitiesList'>;
	deploymentsDelete: DatarobotEndpoint<'deploymentsDelete'>;
	deploymentsFeaturesList: DatarobotEndpoint<'deploymentsFeaturesList'>;
	deploymentsFromLearningModelCreate: DatarobotEndpoint<'deploymentsFromLearningModelCreate'>;
	deploymentsFromModelPackageCreate: DatarobotEndpoint<'deploymentsFromModelPackageCreate'>;
	deploymentsList: DatarobotEndpoint<'deploymentsList'>;
	deploymentsModelHistoryList: DatarobotEndpoint<'deploymentsModelHistoryList'>;
	deploymentsModelPatchMany: DatarobotEndpoint<'deploymentsModelPatchMany'>;
	deploymentsPatch: DatarobotEndpoint<'deploymentsPatch'>;
	deploymentsPredictionsOverTimeList: DatarobotEndpoint<'deploymentsPredictionsOverTimeList'>;
	deploymentsRetrieve: DatarobotEndpoint<'deploymentsRetrieve'>;
	deploymentsServiceStatsList: DatarobotEndpoint<'deploymentsServiceStatsList'>;
	deploymentsSettingsList: DatarobotEndpoint<'deploymentsSettingsList'>;
	deploymentsSettingsPatchMany: DatarobotEndpoint<'deploymentsSettingsPatchMany'>;
	deploymentsSharedRolesList: DatarobotEndpoint<'deploymentsSharedRolesList'>;
	modelPackagesFeaturesList: DatarobotEndpoint<'modelPackagesFeaturesList'>;
	modelPackagesFromLeaderboardCreate: DatarobotEndpoint<'modelPackagesFromLeaderboardCreate'>;
	modelPackagesList: DatarobotEndpoint<'modelPackagesList'>;
	modelPackagesRetrieve: DatarobotEndpoint<'modelPackagesRetrieve'>;
	predictionServersList: DatarobotEndpoint<'predictionServersList'>;
	configureAndStartAutopilot: DatarobotEndpoint<'configureAndStartAutopilot'>;
	projectsAccessControlList: DatarobotEndpoint<'projectsAccessControlList'>;
	projectsAutopilotCreate: DatarobotEndpoint<'projectsAutopilotCreate'>;
	projectsAutopilotsCreate: DatarobotEndpoint<'projectsAutopilotsCreate'>;
	projectsBlueprintsList: DatarobotEndpoint<'projectsBlueprintsList'>;
	projectsBlueprintsRetrieve: DatarobotEndpoint<'projectsBlueprintsRetrieve'>;
	projectsCreate: DatarobotEndpoint<'projectsCreate'>;
	projectsDatetimeModelsList: DatarobotEndpoint<'projectsDatetimeModelsList'>;
	projectsDelete: DatarobotEndpoint<'projectsDelete'>;
	projectsDeploymentReadyModelsCreate: DatarobotEndpoint<'projectsDeploymentReadyModelsCreate'>;
	projectsFeaturelistsCreate: DatarobotEndpoint<'projectsFeaturelistsCreate'>;
	projectsFeaturelistsDelete: DatarobotEndpoint<'projectsFeaturelistsDelete'>;
	projectsFeaturelistsList: DatarobotEndpoint<'projectsFeaturelistsList'>;
	projectsFeaturelistsPatch: DatarobotEndpoint<'projectsFeaturelistsPatch'>;
	projectsFeaturelistsRetrieve: DatarobotEndpoint<'projectsFeaturelistsRetrieve'>;
	projectsFeaturesList: DatarobotEndpoint<'projectsFeaturesList'>;
	projectsFeaturesRetrieve: DatarobotEndpoint<'projectsFeaturesRetrieve'>;
	projectsJobsDelete: DatarobotEndpoint<'projectsJobsDelete'>;
	projectsJobsList: DatarobotEndpoint<'projectsJobsList'>;
	projectsJobsRetrieve: DatarobotEndpoint<'projectsJobsRetrieve'>;
	projectsList: DatarobotEndpoint<'projectsList'>;
	projectsModelingFeaturelistsCreate: DatarobotEndpoint<'projectsModelingFeaturelistsCreate'>;
	projectsModelingFeaturelistsList: DatarobotEndpoint<'projectsModelingFeaturelistsList'>;
	projectsModelsCreate: DatarobotEndpoint<'projectsModelsCreate'>;
	projectsModelsDelete: DatarobotEndpoint<'projectsModelsDelete'>;
	projectsModelsFromModelCreate: DatarobotEndpoint<'projectsModelsFromModelCreate'>;
	projectsModelsList: DatarobotEndpoint<'projectsModelsList'>;
	projectsModelsRetrieve: DatarobotEndpoint<'projectsModelsRetrieve'>;
	projectsPatch: DatarobotEndpoint<'projectsPatch'>;
	projectsPredictionDatasetsDelete: DatarobotEndpoint<'projectsPredictionDatasetsDelete'>;
	projectsPredictionDatasetsList: DatarobotEndpoint<'projectsPredictionDatasetsList'>;
	projectsPredictionDatasetsRetrieve: DatarobotEndpoint<'projectsPredictionDatasetsRetrieve'>;
	projectsPredictionsCreate: DatarobotEndpoint<'projectsPredictionsCreate'>;
	projectsPredictionsList: DatarobotEndpoint<'projectsPredictionsList'>;
	projectsPredictionsRetrieve: DatarobotEndpoint<'projectsPredictionsRetrieve'>;
	projectsRecommendedModelsList: DatarobotEndpoint<'projectsRecommendedModelsList'>;
	projectsRetrieve: DatarobotEndpoint<'projectsRetrieve'>;
	projectsStatusList: DatarobotEndpoint<'projectsStatusList'>;
	projectsTrainingPredictionsCreate: DatarobotEndpoint<'projectsTrainingPredictionsCreate'>;
	trainingPredictionsList: DatarobotEndpoint<'trainingPredictionsList'>;
	statusList: DatarobotEndpoint<'statusList'>;
	statusRetrieve: DatarobotEndpoint<'statusRetrieve'>;
	useCasesCreate: DatarobotEndpoint<'useCasesCreate'>;
	useCasesDatasetsList: DatarobotEndpoint<'useCasesDatasetsList'>;
	useCasesDelete: DatarobotEndpoint<'useCasesDelete'>;
	useCasesDeploymentsList: DatarobotEndpoint<'useCasesDeploymentsList'>;
	useCasesList: DatarobotEndpoint<'useCasesList'>;
	useCasesPatch: DatarobotEndpoint<'useCasesPatch'>;
	useCasesProjectsList: DatarobotEndpoint<'useCasesProjectsList'>;
	useCasesRetrieve: DatarobotEndpoint<'useCasesRetrieve'>;
	versionList: DatarobotEndpoint<'versionList'>;
};

const datarobotEndpointsNested = {
	batchPredictions: {
		batchPredictionsCreate: BatchPredictions.batchPredictionsCreate,
		batchPredictionsDelete: BatchPredictions.batchPredictionsDelete,
		batchPredictionsFromExistingCreate:
			BatchPredictions.batchPredictionsFromExistingCreate,
		batchPredictionsFromJobDefinitionCreate:
			BatchPredictions.batchPredictionsFromJobDefinitionCreate,
		batchPredictionsList: BatchPredictions.batchPredictionsList,
		batchPredictionsRetrieve: BatchPredictions.batchPredictionsRetrieve,
	},
	catalogItems: {
		catalogItemsList: CatalogItems.catalogItemsList,
		catalogItemsRetrieve: CatalogItems.catalogItemsRetrieve,
	},
	credentials: {
		credentialsCreate: Credentials.credentialsCreate,
		credentialsDelete: Credentials.credentialsDelete,
		credentialsList: Credentials.credentialsList,
		credentialsRetrieve: Credentials.credentialsRetrieve,
	},
	customModels: {
		customModelsCreate: CustomModels.customModelsCreate,
		customModelsDelete: CustomModels.customModelsDelete,
		customModelsList: CustomModels.customModelsList,
		customModelsRetrieve: CustomModels.customModelsRetrieve,
		customModelsVersionsCreate: CustomModels.customModelsVersionsCreate,
		customModelsVersionsList: CustomModels.customModelsVersionsList,
	},
	datasets: {
		datasetsAllFeaturesDetailsList: Datasets.datasetsAllFeaturesDetailsList,
		datasetsDelete: Datasets.datasetsDelete,
		datasetsFeaturelistsList: Datasets.datasetsFeaturelistsList,
		datasetsFileList: Datasets.datasetsFileList,
		datasetsFromDataSourceCreate: Datasets.datasetsFromDataSourceCreate,
		datasetsFromFileCreate: Datasets.datasetsFromFileCreate,
		datasetsFromURLCreate: Datasets.datasetsFromURLCreate,
		datasetsList: Datasets.datasetsList,
		datasetsPatch: Datasets.datasetsPatch,
		datasetsProjectsList: Datasets.datasetsProjectsList,
		datasetsRetrieve: Datasets.datasetsRetrieve,
		datasetsVersionsDelete: Datasets.datasetsVersionsDelete,
		datasetsVersionsFromFileCreate: Datasets.datasetsVersionsFromFileCreate,
		datasetsVersionsFromURLCreate: Datasets.datasetsVersionsFromURLCreate,
		datasetsVersionsList: Datasets.datasetsVersionsList,
		datasetsVersionsRetrieve: Datasets.datasetsVersionsRetrieve,
	},
	deployments: {
		deploymentsAccuracyList: Deployments.deploymentsAccuracyList,
		deploymentsAccuracyOverTimeList:
			Deployments.deploymentsAccuracyOverTimeList,
		deploymentsCapabilitiesList: Deployments.deploymentsCapabilitiesList,
		deploymentsDelete: Deployments.deploymentsDelete,
		deploymentsFeaturesList: Deployments.deploymentsFeaturesList,
		deploymentsFromLearningModelCreate:
			Deployments.deploymentsFromLearningModelCreate,
		deploymentsFromModelPackageCreate:
			Deployments.deploymentsFromModelPackageCreate,
		deploymentsList: Deployments.deploymentsList,
		deploymentsModelHistoryList: Deployments.deploymentsModelHistoryList,
		deploymentsModelPatchMany: Deployments.deploymentsModelPatchMany,
		deploymentsPatch: Deployments.deploymentsPatch,
		deploymentsPredictionsOverTimeList:
			Deployments.deploymentsPredictionsOverTimeList,
		deploymentsRetrieve: Deployments.deploymentsRetrieve,
		deploymentsServiceStatsList: Deployments.deploymentsServiceStatsList,
		deploymentsSettingsList: Deployments.deploymentsSettingsList,
		deploymentsSettingsPatchMany: Deployments.deploymentsSettingsPatchMany,
		deploymentsSharedRolesList: Deployments.deploymentsSharedRolesList,
	},
	modelPackages: {
		modelPackagesFeaturesList: ModelPackages.modelPackagesFeaturesList,
		modelPackagesFromLeaderboardCreate:
			ModelPackages.modelPackagesFromLeaderboardCreate,
		modelPackagesList: ModelPackages.modelPackagesList,
		modelPackagesRetrieve: ModelPackages.modelPackagesRetrieve,
	},
	predictionServers: {
		predictionServersList: PredictionServers.predictionServersList,
	},
	projects: {
		configureAndStartAutopilot: Projects.configureAndStartAutopilot,
		projectsAccessControlList: Projects.projectsAccessControlList,
		projectsAutopilotCreate: Projects.projectsAutopilotCreate,
		projectsAutopilotsCreate: Projects.projectsAutopilotsCreate,
		projectsBlueprintsList: Projects.projectsBlueprintsList,
		projectsBlueprintsRetrieve: Projects.projectsBlueprintsRetrieve,
		projectsCreate: Projects.projectsCreate,
		projectsDatetimeModelsList: Projects.projectsDatetimeModelsList,
		projectsDelete: Projects.projectsDelete,
		projectsDeploymentReadyModelsCreate:
			Projects.projectsDeploymentReadyModelsCreate,
		projectsFeaturelistsCreate: Projects.projectsFeaturelistsCreate,
		projectsFeaturelistsDelete: Projects.projectsFeaturelistsDelete,
		projectsFeaturelistsList: Projects.projectsFeaturelistsList,
		projectsFeaturelistsPatch: Projects.projectsFeaturelistsPatch,
		projectsFeaturelistsRetrieve: Projects.projectsFeaturelistsRetrieve,
		projectsFeaturesList: Projects.projectsFeaturesList,
		projectsFeaturesRetrieve: Projects.projectsFeaturesRetrieve,
		projectsJobsDelete: Projects.projectsJobsDelete,
		projectsJobsList: Projects.projectsJobsList,
		projectsJobsRetrieve: Projects.projectsJobsRetrieve,
		projectsList: Projects.projectsList,
		projectsModelingFeaturelistsCreate:
			Projects.projectsModelingFeaturelistsCreate,
		projectsModelingFeaturelistsList: Projects.projectsModelingFeaturelistsList,
		projectsModelsCreate: Projects.projectsModelsCreate,
		projectsModelsDelete: Projects.projectsModelsDelete,
		projectsModelsFromModelCreate: Projects.projectsModelsFromModelCreate,
		projectsModelsList: Projects.projectsModelsList,
		projectsModelsRetrieve: Projects.projectsModelsRetrieve,
		projectsPatch: Projects.projectsPatch,
		projectsPredictionDatasetsDelete: Projects.projectsPredictionDatasetsDelete,
		projectsPredictionDatasetsList: Projects.projectsPredictionDatasetsList,
		projectsPredictionDatasetsRetrieve:
			Projects.projectsPredictionDatasetsRetrieve,
		projectsPredictionsCreate: Projects.projectsPredictionsCreate,
		projectsPredictionsList: Projects.projectsPredictionsList,
		projectsPredictionsRetrieve: Projects.projectsPredictionsRetrieve,
		projectsRecommendedModelsList: Projects.projectsRecommendedModelsList,
		projectsRetrieve: Projects.projectsRetrieve,
		projectsStatusList: Projects.projectsStatusList,
		projectsTrainingPredictionsCreate:
			Projects.projectsTrainingPredictionsCreate,
		trainingPredictionsList: Projects.trainingPredictionsList,
	},
	status: {
		statusList: Status.statusList,
		statusRetrieve: Status.statusRetrieve,
	},
	useCases: {
		useCasesCreate: UseCases.useCasesCreate,
		useCasesDatasetsList: UseCases.useCasesDatasetsList,
		useCasesDelete: UseCases.useCasesDelete,
		useCasesDeploymentsList: UseCases.useCasesDeploymentsList,
		useCasesList: UseCases.useCasesList,
		useCasesPatch: UseCases.useCasesPatch,
		useCasesProjectsList: UseCases.useCasesProjectsList,
		useCasesRetrieve: UseCases.useCasesRetrieve,
	},
	version: {
		versionList: Version.versionList,
	},
} as const;

export const datarobotEndpointSchemas = {
	'batchPredictions.batchPredictionsCreate': {
		input: DatarobotEndpointInputSchemas.batchPredictionsCreate,
		output: DatarobotEndpointOutputSchemas.batchPredictionsCreate,
	},
	'batchPredictions.batchPredictionsDelete': {
		input: DatarobotEndpointInputSchemas.batchPredictionsDelete,
		output: DatarobotEndpointOutputSchemas.batchPredictionsDelete,
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
	'batchPredictions.batchPredictionsRetrieve': {
		input: DatarobotEndpointInputSchemas.batchPredictionsRetrieve,
		output: DatarobotEndpointOutputSchemas.batchPredictionsRetrieve,
	},
	'catalogItems.catalogItemsList': {
		input: DatarobotEndpointInputSchemas.catalogItemsList,
		output: DatarobotEndpointOutputSchemas.catalogItemsList,
	},
	'catalogItems.catalogItemsRetrieve': {
		input: DatarobotEndpointInputSchemas.catalogItemsRetrieve,
		output: DatarobotEndpointOutputSchemas.catalogItemsRetrieve,
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
	'credentials.credentialsRetrieve': {
		input: DatarobotEndpointInputSchemas.credentialsRetrieve,
		output: DatarobotEndpointOutputSchemas.credentialsRetrieve,
	},
	'customModels.customModelsCreate': {
		input: DatarobotEndpointInputSchemas.customModelsCreate,
		output: DatarobotEndpointOutputSchemas.customModelsCreate,
	},
	'customModels.customModelsDelete': {
		input: DatarobotEndpointInputSchemas.customModelsDelete,
		output: DatarobotEndpointOutputSchemas.customModelsDelete,
	},
	'customModels.customModelsList': {
		input: DatarobotEndpointInputSchemas.customModelsList,
		output: DatarobotEndpointOutputSchemas.customModelsList,
	},
	'customModels.customModelsRetrieve': {
		input: DatarobotEndpointInputSchemas.customModelsRetrieve,
		output: DatarobotEndpointOutputSchemas.customModelsRetrieve,
	},
	'customModels.customModelsVersionsCreate': {
		input: DatarobotEndpointInputSchemas.customModelsVersionsCreate,
		output: DatarobotEndpointOutputSchemas.customModelsVersionsCreate,
	},
	'customModels.customModelsVersionsList': {
		input: DatarobotEndpointInputSchemas.customModelsVersionsList,
		output: DatarobotEndpointOutputSchemas.customModelsVersionsList,
	},
	'datasets.datasetsAllFeaturesDetailsList': {
		input: DatarobotEndpointInputSchemas.datasetsAllFeaturesDetailsList,
		output: DatarobotEndpointOutputSchemas.datasetsAllFeaturesDetailsList,
	},
	'datasets.datasetsDelete': {
		input: DatarobotEndpointInputSchemas.datasetsDelete,
		output: DatarobotEndpointOutputSchemas.datasetsDelete,
	},
	'datasets.datasetsFeaturelistsList': {
		input: DatarobotEndpointInputSchemas.datasetsFeaturelistsList,
		output: DatarobotEndpointOutputSchemas.datasetsFeaturelistsList,
	},
	'datasets.datasetsFileList': {
		input: DatarobotEndpointInputSchemas.datasetsFileList,
		output: DatarobotEndpointOutputSchemas.datasetsFileList,
	},
	'datasets.datasetsFromDataSourceCreate': {
		input: DatarobotEndpointInputSchemas.datasetsFromDataSourceCreate,
		output: DatarobotEndpointOutputSchemas.datasetsFromDataSourceCreate,
	},
	'datasets.datasetsFromFileCreate': {
		input: DatarobotEndpointInputSchemas.datasetsFromFileCreate,
		output: DatarobotEndpointOutputSchemas.datasetsFromFileCreate,
	},
	'datasets.datasetsFromURLCreate': {
		input: DatarobotEndpointInputSchemas.datasetsFromURLCreate,
		output: DatarobotEndpointOutputSchemas.datasetsFromURLCreate,
	},
	'datasets.datasetsList': {
		input: DatarobotEndpointInputSchemas.datasetsList,
		output: DatarobotEndpointOutputSchemas.datasetsList,
	},
	'datasets.datasetsPatch': {
		input: DatarobotEndpointInputSchemas.datasetsPatch,
		output: DatarobotEndpointOutputSchemas.datasetsPatch,
	},
	'datasets.datasetsProjectsList': {
		input: DatarobotEndpointInputSchemas.datasetsProjectsList,
		output: DatarobotEndpointOutputSchemas.datasetsProjectsList,
	},
	'datasets.datasetsRetrieve': {
		input: DatarobotEndpointInputSchemas.datasetsRetrieve,
		output: DatarobotEndpointOutputSchemas.datasetsRetrieve,
	},
	'datasets.datasetsVersionsDelete': {
		input: DatarobotEndpointInputSchemas.datasetsVersionsDelete,
		output: DatarobotEndpointOutputSchemas.datasetsVersionsDelete,
	},
	'datasets.datasetsVersionsFromFileCreate': {
		input: DatarobotEndpointInputSchemas.datasetsVersionsFromFileCreate,
		output: DatarobotEndpointOutputSchemas.datasetsVersionsFromFileCreate,
	},
	'datasets.datasetsVersionsFromURLCreate': {
		input: DatarobotEndpointInputSchemas.datasetsVersionsFromURLCreate,
		output: DatarobotEndpointOutputSchemas.datasetsVersionsFromURLCreate,
	},
	'datasets.datasetsVersionsList': {
		input: DatarobotEndpointInputSchemas.datasetsVersionsList,
		output: DatarobotEndpointOutputSchemas.datasetsVersionsList,
	},
	'datasets.datasetsVersionsRetrieve': {
		input: DatarobotEndpointInputSchemas.datasetsVersionsRetrieve,
		output: DatarobotEndpointOutputSchemas.datasetsVersionsRetrieve,
	},
	'deployments.deploymentsAccuracyList': {
		input: DatarobotEndpointInputSchemas.deploymentsAccuracyList,
		output: DatarobotEndpointOutputSchemas.deploymentsAccuracyList,
	},
	'deployments.deploymentsAccuracyOverTimeList': {
		input: DatarobotEndpointInputSchemas.deploymentsAccuracyOverTimeList,
		output: DatarobotEndpointOutputSchemas.deploymentsAccuracyOverTimeList,
	},
	'deployments.deploymentsCapabilitiesList': {
		input: DatarobotEndpointInputSchemas.deploymentsCapabilitiesList,
		output: DatarobotEndpointOutputSchemas.deploymentsCapabilitiesList,
	},
	'deployments.deploymentsDelete': {
		input: DatarobotEndpointInputSchemas.deploymentsDelete,
		output: DatarobotEndpointOutputSchemas.deploymentsDelete,
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
	'deployments.deploymentsList': {
		input: DatarobotEndpointInputSchemas.deploymentsList,
		output: DatarobotEndpointOutputSchemas.deploymentsList,
	},
	'deployments.deploymentsModelHistoryList': {
		input: DatarobotEndpointInputSchemas.deploymentsModelHistoryList,
		output: DatarobotEndpointOutputSchemas.deploymentsModelHistoryList,
	},
	'deployments.deploymentsModelPatchMany': {
		input: DatarobotEndpointInputSchemas.deploymentsModelPatchMany,
		output: DatarobotEndpointOutputSchemas.deploymentsModelPatchMany,
	},
	'deployments.deploymentsPatch': {
		input: DatarobotEndpointInputSchemas.deploymentsPatch,
		output: DatarobotEndpointOutputSchemas.deploymentsPatch,
	},
	'deployments.deploymentsPredictionsOverTimeList': {
		input: DatarobotEndpointInputSchemas.deploymentsPredictionsOverTimeList,
		output: DatarobotEndpointOutputSchemas.deploymentsPredictionsOverTimeList,
	},
	'deployments.deploymentsRetrieve': {
		input: DatarobotEndpointInputSchemas.deploymentsRetrieve,
		output: DatarobotEndpointOutputSchemas.deploymentsRetrieve,
	},
	'deployments.deploymentsServiceStatsList': {
		input: DatarobotEndpointInputSchemas.deploymentsServiceStatsList,
		output: DatarobotEndpointOutputSchemas.deploymentsServiceStatsList,
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
	'modelPackages.modelPackagesFeaturesList': {
		input: DatarobotEndpointInputSchemas.modelPackagesFeaturesList,
		output: DatarobotEndpointOutputSchemas.modelPackagesFeaturesList,
	},
	'modelPackages.modelPackagesFromLeaderboardCreate': {
		input: DatarobotEndpointInputSchemas.modelPackagesFromLeaderboardCreate,
		output: DatarobotEndpointOutputSchemas.modelPackagesFromLeaderboardCreate,
	},
	'modelPackages.modelPackagesList': {
		input: DatarobotEndpointInputSchemas.modelPackagesList,
		output: DatarobotEndpointOutputSchemas.modelPackagesList,
	},
	'modelPackages.modelPackagesRetrieve': {
		input: DatarobotEndpointInputSchemas.modelPackagesRetrieve,
		output: DatarobotEndpointOutputSchemas.modelPackagesRetrieve,
	},
	'predictionServers.predictionServersList': {
		input: DatarobotEndpointInputSchemas.predictionServersList,
		output: DatarobotEndpointOutputSchemas.predictionServersList,
	},
	'projects.configureAndStartAutopilot': {
		input: DatarobotEndpointInputSchemas.configureAndStartAutopilot,
		output: DatarobotEndpointOutputSchemas.configureAndStartAutopilot,
	},
	'projects.projectsAccessControlList': {
		input: DatarobotEndpointInputSchemas.projectsAccessControlList,
		output: DatarobotEndpointOutputSchemas.projectsAccessControlList,
	},
	'projects.projectsAutopilotCreate': {
		input: DatarobotEndpointInputSchemas.projectsAutopilotCreate,
		output: DatarobotEndpointOutputSchemas.projectsAutopilotCreate,
	},
	'projects.projectsAutopilotsCreate': {
		input: DatarobotEndpointInputSchemas.projectsAutopilotsCreate,
		output: DatarobotEndpointOutputSchemas.projectsAutopilotsCreate,
	},
	'projects.projectsBlueprintsList': {
		input: DatarobotEndpointInputSchemas.projectsBlueprintsList,
		output: DatarobotEndpointOutputSchemas.projectsBlueprintsList,
	},
	'projects.projectsBlueprintsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsBlueprintsRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsBlueprintsRetrieve,
	},
	'projects.projectsCreate': {
		input: DatarobotEndpointInputSchemas.projectsCreate,
		output: DatarobotEndpointOutputSchemas.projectsCreate,
	},
	'projects.projectsDatetimeModelsList': {
		input: DatarobotEndpointInputSchemas.projectsDatetimeModelsList,
		output: DatarobotEndpointOutputSchemas.projectsDatetimeModelsList,
	},
	'projects.projectsDelete': {
		input: DatarobotEndpointInputSchemas.projectsDelete,
		output: DatarobotEndpointOutputSchemas.projectsDelete,
	},
	'projects.projectsDeploymentReadyModelsCreate': {
		input: DatarobotEndpointInputSchemas.projectsDeploymentReadyModelsCreate,
		output: DatarobotEndpointOutputSchemas.projectsDeploymentReadyModelsCreate,
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
	'projects.projectsFeaturesList': {
		input: DatarobotEndpointInputSchemas.projectsFeaturesList,
		output: DatarobotEndpointOutputSchemas.projectsFeaturesList,
	},
	'projects.projectsFeaturesRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsFeaturesRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsFeaturesRetrieve,
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
	'projects.projectsModelingFeaturelistsCreate': {
		input: DatarobotEndpointInputSchemas.projectsModelingFeaturelistsCreate,
		output: DatarobotEndpointOutputSchemas.projectsModelingFeaturelistsCreate,
	},
	'projects.projectsModelingFeaturelistsList': {
		input: DatarobotEndpointInputSchemas.projectsModelingFeaturelistsList,
		output: DatarobotEndpointOutputSchemas.projectsModelingFeaturelistsList,
	},
	'projects.projectsModelsCreate': {
		input: DatarobotEndpointInputSchemas.projectsModelsCreate,
		output: DatarobotEndpointOutputSchemas.projectsModelsCreate,
	},
	'projects.projectsModelsDelete': {
		input: DatarobotEndpointInputSchemas.projectsModelsDelete,
		output: DatarobotEndpointOutputSchemas.projectsModelsDelete,
	},
	'projects.projectsModelsFromModelCreate': {
		input: DatarobotEndpointInputSchemas.projectsModelsFromModelCreate,
		output: DatarobotEndpointOutputSchemas.projectsModelsFromModelCreate,
	},
	'projects.projectsModelsList': {
		input: DatarobotEndpointInputSchemas.projectsModelsList,
		output: DatarobotEndpointOutputSchemas.projectsModelsList,
	},
	'projects.projectsModelsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsModelsRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsModelsRetrieve,
	},
	'projects.projectsPatch': {
		input: DatarobotEndpointInputSchemas.projectsPatch,
		output: DatarobotEndpointOutputSchemas.projectsPatch,
	},
	'projects.projectsPredictionDatasetsDelete': {
		input: DatarobotEndpointInputSchemas.projectsPredictionDatasetsDelete,
		output: DatarobotEndpointOutputSchemas.projectsPredictionDatasetsDelete,
	},
	'projects.projectsPredictionDatasetsList': {
		input: DatarobotEndpointInputSchemas.projectsPredictionDatasetsList,
		output: DatarobotEndpointOutputSchemas.projectsPredictionDatasetsList,
	},
	'projects.projectsPredictionDatasetsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsPredictionDatasetsRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsPredictionDatasetsRetrieve,
	},
	'projects.projectsPredictionsCreate': {
		input: DatarobotEndpointInputSchemas.projectsPredictionsCreate,
		output: DatarobotEndpointOutputSchemas.projectsPredictionsCreate,
	},
	'projects.projectsPredictionsList': {
		input: DatarobotEndpointInputSchemas.projectsPredictionsList,
		output: DatarobotEndpointOutputSchemas.projectsPredictionsList,
	},
	'projects.projectsPredictionsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsPredictionsRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsPredictionsRetrieve,
	},
	'projects.projectsRecommendedModelsList': {
		input: DatarobotEndpointInputSchemas.projectsRecommendedModelsList,
		output: DatarobotEndpointOutputSchemas.projectsRecommendedModelsList,
	},
	'projects.projectsRetrieve': {
		input: DatarobotEndpointInputSchemas.projectsRetrieve,
		output: DatarobotEndpointOutputSchemas.projectsRetrieve,
	},
	'projects.projectsStatusList': {
		input: DatarobotEndpointInputSchemas.projectsStatusList,
		output: DatarobotEndpointOutputSchemas.projectsStatusList,
	},
	'projects.projectsTrainingPredictionsCreate': {
		input: DatarobotEndpointInputSchemas.projectsTrainingPredictionsCreate,
		output: DatarobotEndpointOutputSchemas.projectsTrainingPredictionsCreate,
	},
	'projects.trainingPredictionsList': {
		input: DatarobotEndpointInputSchemas.trainingPredictionsList,
		output: DatarobotEndpointOutputSchemas.trainingPredictionsList,
	},
	'status.statusList': {
		input: DatarobotEndpointInputSchemas.statusList,
		output: DatarobotEndpointOutputSchemas.statusList,
	},
	'status.statusRetrieve': {
		input: DatarobotEndpointInputSchemas.statusRetrieve,
		output: DatarobotEndpointOutputSchemas.statusRetrieve,
	},
	'useCases.useCasesCreate': {
		input: DatarobotEndpointInputSchemas.useCasesCreate,
		output: DatarobotEndpointOutputSchemas.useCasesCreate,
	},
	'useCases.useCasesDatasetsList': {
		input: DatarobotEndpointInputSchemas.useCasesDatasetsList,
		output: DatarobotEndpointOutputSchemas.useCasesDatasetsList,
	},
	'useCases.useCasesDelete': {
		input: DatarobotEndpointInputSchemas.useCasesDelete,
		output: DatarobotEndpointOutputSchemas.useCasesDelete,
	},
	'useCases.useCasesDeploymentsList': {
		input: DatarobotEndpointInputSchemas.useCasesDeploymentsList,
		output: DatarobotEndpointOutputSchemas.useCasesDeploymentsList,
	},
	'useCases.useCasesList': {
		input: DatarobotEndpointInputSchemas.useCasesList,
		output: DatarobotEndpointOutputSchemas.useCasesList,
	},
	'useCases.useCasesPatch': {
		input: DatarobotEndpointInputSchemas.useCasesPatch,
		output: DatarobotEndpointOutputSchemas.useCasesPatch,
	},
	'useCases.useCasesProjectsList': {
		input: DatarobotEndpointInputSchemas.useCasesProjectsList,
		output: DatarobotEndpointOutputSchemas.useCasesProjectsList,
	},
	'useCases.useCasesRetrieve': {
		input: DatarobotEndpointInputSchemas.useCasesRetrieve,
		output: DatarobotEndpointOutputSchemas.useCasesRetrieve,
	},
	'version.versionList': {
		input: DatarobotEndpointInputSchemas.versionList,
		output: DatarobotEndpointOutputSchemas.versionList,
	},
} satisfies RequiredPluginEndpointSchemas<typeof datarobotEndpointsNested>;

const datarobotEndpointMeta = {
	'batchPredictions.batchPredictionsCreate': {
		riskLevel: 'write',
		description: 'Creates a new Batch Prediction job',
	},
	'batchPredictions.batchPredictionsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Cancel a Batch Prediction job by prediction job ID',
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
	'batchPredictions.batchPredictionsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve Batch Prediction job by prediction job ID',
	},
	'catalogItems.catalogItemsList': {
		riskLevel: 'read',
		description: 'List all catalog items accessible by the user.',
	},
	'catalogItems.catalogItemsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieves latest version information, by ID by catalog ID',
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
	'credentials.credentialsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve the credentials set by credential ID',
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
	'customModels.customModelsList': {
		riskLevel: 'read',
		description: 'List custom models.',
	},
	'customModels.customModelsRetrieve': {
		riskLevel: 'read',
		description: 'Get custom model by custom model ID',
	},
	'customModels.customModelsVersionsCreate': {
		riskLevel: 'write',
		description: 'Create custom model version by custom model ID',
	},
	'customModels.customModelsVersionsList': {
		riskLevel: 'read',
		description: 'List custom model versions by custom model ID',
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
	'datasets.datasetsFeaturelistsList': {
		riskLevel: 'read',
		description: 'Retrieve dataset featurelists by dataset ID',
	},
	'datasets.datasetsFileList': {
		riskLevel: 'read',
		description: 'Retrieve original dataset data by dataset ID',
	},
	'datasets.datasetsFromDataSourceCreate': {
		riskLevel: 'write',
		description: 'Create a dataset from a data source',
	},
	'datasets.datasetsFromFileCreate': {
		riskLevel: 'write',
		description: 'Create a dataset from a file',
	},
	'datasets.datasetsFromURLCreate': {
		riskLevel: 'write',
		description: 'Create a dataset from an URL',
	},
	'datasets.datasetsList': {
		riskLevel: 'read',
		description: 'List datasets',
	},
	'datasets.datasetsPatch': {
		riskLevel: 'write',
		description: 'Modify dataset by dataset ID',
	},
	'datasets.datasetsProjectsList': {
		riskLevel: 'read',
		description: 'Get dataset projects by dataset ID',
	},
	'datasets.datasetsRetrieve': {
		riskLevel: 'read',
		description: 'Get dataset details by dataset ID',
	},
	'datasets.datasetsVersionsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete dataset version by dataset ID',
	},
	'datasets.datasetsVersionsFromFileCreate': {
		riskLevel: 'write',
		description: 'Create a version from a file',
	},
	'datasets.datasetsVersionsFromURLCreate': {
		riskLevel: 'write',
		description: 'Create a version from an URL',
	},
	'datasets.datasetsVersionsList': {
		riskLevel: 'read',
		description: 'List dataset versions by dataset ID',
	},
	'datasets.datasetsVersionsRetrieve': {
		riskLevel: 'read',
		description: 'Get dataset details by version by dataset ID',
	},
	'deployments.deploymentsAccuracyList': {
		riskLevel: 'read',
		description: 'Retrieve accuracy metric by deployment ID',
	},
	'deployments.deploymentsAccuracyOverTimeList': {
		riskLevel: 'read',
		description: 'Retrieve accuracy over time by deployment ID',
	},
	'deployments.deploymentsCapabilitiesList': {
		riskLevel: 'read',
		description: 'Retrieve capabilities by deployment ID',
	},
	'deployments.deploymentsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete deployment by deployment ID',
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
	'deployments.deploymentsList': {
		riskLevel: 'read',
		description: 'List deployments',
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
	'deployments.deploymentsPatch': {
		riskLevel: 'write',
		description: 'Update deployment by deployment ID',
	},
	'deployments.deploymentsPredictionsOverTimeList': {
		riskLevel: 'read',
		description:
			'Retrieve metrics about predictions over time by deployment ID',
	},
	'deployments.deploymentsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve deployment by deployment ID',
	},
	'deployments.deploymentsServiceStatsList': {
		riskLevel: 'read',
		description: 'Retrieve service stats by ID',
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
	'modelPackages.modelPackagesFeaturesList': {
		riskLevel: 'read',
		description: 'Retrieve feature list by model package ID',
	},
	'modelPackages.modelPackagesFromLeaderboardCreate': {
		riskLevel: 'write',
		description: 'Create model package',
	},
	'modelPackages.modelPackagesList': {
		riskLevel: 'read',
		description: 'List model packages',
	},
	'modelPackages.modelPackagesRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve info about a model package by model package ID',
	},
	'predictionServers.predictionServersList': {
		riskLevel: 'read',
		description: 'List prediction servers.',
	},
	'projects.configureAndStartAutopilot': {
		riskLevel: 'write',
		description: 'Start modeling by project ID',
	},
	'projects.projectsAccessControlList': {
		riskLevel: 'read',
		description: 'Get the project access control list by project ID',
	},
	'projects.projectsAutopilotCreate': {
		riskLevel: 'write',
		description: 'Pause by project ID',
	},
	'projects.projectsAutopilotsCreate': {
		riskLevel: 'write',
		description: 'Start autopilot by project ID',
	},
	'projects.projectsBlueprintsList': {
		riskLevel: 'read',
		description: 'List blueprints by project ID',
	},
	'projects.projectsBlueprintsRetrieve': {
		riskLevel: 'read',
		description: 'Retrieve a blueprint by its ID.',
	},
	'projects.projectsCreate': {
		riskLevel: 'write',
		description: 'Create a project.',
	},
	'projects.projectsDatetimeModelsList': {
		riskLevel: 'read',
		description: 'List datetime partitioned project models by project ID',
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
	'projects.projectsFeaturesList': {
		riskLevel: 'read',
		description: 'List project features by project ID',
	},
	'projects.projectsFeaturesRetrieve': {
		riskLevel: 'read',
		description: 'Get a project feature by project ID',
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
	'projects.projectsModelingFeaturelistsCreate': {
		riskLevel: 'write',
		description: 'Create a new modeling featurelist by project ID',
	},
	'projects.projectsModelingFeaturelistsList': {
		riskLevel: 'read',
		description: 'List all modeling featurelists by project ID',
	},
	'projects.projectsModelsCreate': {
		riskLevel: 'write',
		description: 'Train a new model by project ID',
	},
	'projects.projectsModelsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a model by project ID',
	},
	'projects.projectsModelsFromModelCreate': {
		riskLevel: 'write',
		description: 'Retrain a model by project ID',
	},
	'projects.projectsModelsList': {
		riskLevel: 'read',
		description: 'List project models by project ID',
	},
	'projects.projectsModelsRetrieve': {
		riskLevel: 'read',
		description: 'Get model by project ID',
	},
	'projects.projectsPatch': {
		riskLevel: 'write',
		description: 'Update a project by project ID',
	},
	'projects.projectsPredictionDatasetsDelete': {
		riskLevel: 'destructive',
		irreversible: true,
		description: 'Delete a dataset that was uploaded by project ID',
	},
	'projects.projectsPredictionDatasetsList': {
		riskLevel: 'read',
		description: 'List prediction datasets uploaded by project ID',
	},
	'projects.projectsPredictionDatasetsRetrieve': {
		riskLevel: 'read',
		description: 'Get the metadata of a specific dataset by project ID',
	},
	'projects.projectsPredictionsCreate': {
		riskLevel: 'write',
		description: 'Make new predictions by project ID',
	},
	'projects.projectsPredictionsList': {
		riskLevel: 'read',
		description: 'Get the list of prediction records by project ID',
	},
	'projects.projectsPredictionsRetrieve': {
		riskLevel: 'read',
		description: 'Get a completed set of predictions by project ID',
	},
	'projects.projectsRecommendedModelsList': {
		riskLevel: 'read',
		description: 'List recommended models by project ID',
	},
	'projects.projectsRetrieve': {
		riskLevel: 'read',
		description: 'Get project by project ID',
	},
	'projects.projectsStatusList': {
		riskLevel: 'read',
		description: 'Check project status by project ID',
	},
	'projects.projectsTrainingPredictionsCreate': {
		riskLevel: 'write',
		description: 'Submits a job by project ID',
	},
	'projects.trainingPredictionsList': {
		riskLevel: 'read',
		description: 'List training prediction jobs by project ID',
	},
	'status.statusList': {
		riskLevel: 'read',
		description: 'List tasks',
	},
	'status.statusRetrieve': {
		riskLevel: 'read',
		description: 'Get task status by status ID',
	},
	'useCases.useCasesCreate': {
		riskLevel: 'write',
		description: 'Get a use case.',
	},
	'useCases.useCasesDatasetsList': {
		riskLevel: 'read',
		description: 'Get the list of the datasets associated by use case ID',
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
	'useCases.useCasesList': {
		riskLevel: 'read',
		description: 'Retrieve the list of use cases.',
	},
	'useCases.useCasesPatch': {
		riskLevel: 'write',
		description: 'Update a Use Case by use case ID',
	},
	'useCases.useCasesProjectsList': {
		riskLevel: 'read',
		description: 'Get the list of the projects associated by use case ID',
	},
	'useCases.useCasesRetrieve': {
		riskLevel: 'read',
		description: 'Get a use case by use case ID',
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
