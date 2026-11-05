import {
	batchPredictionsCreate,
	batchPredictionsDelete,
	batchPredictionsFromExistingCreate,
	batchPredictionsFromJobDefinitionCreate,
	batchPredictionsList,
	batchPredictionsRetrieve,
} from './batch-predictions';
export const BatchPredictions = {
	batchPredictionsCreate,
	batchPredictionsDelete,
	batchPredictionsFromExistingCreate,
	batchPredictionsFromJobDefinitionCreate,
	batchPredictionsList,
	batchPredictionsRetrieve,
};

import { catalogItemsList, catalogItemsRetrieve } from './catalog-items';
export const CatalogItems = { catalogItemsList, catalogItemsRetrieve };

import {
	credentialsCreate,
	credentialsDelete,
	credentialsList,
	credentialsRetrieve,
} from './credentials';
export const Credentials = {
	credentialsCreate,
	credentialsDelete,
	credentialsList,
	credentialsRetrieve,
};

import {
	customModelsCreate,
	customModelsDelete,
	customModelsList,
	customModelsRetrieve,
	customModelsVersionsCreate,
	customModelsVersionsList,
} from './custom-models';
export const CustomModels = {
	customModelsCreate,
	customModelsDelete,
	customModelsList,
	customModelsRetrieve,
	customModelsVersionsCreate,
	customModelsVersionsList,
};

import {
	datasetsAllFeaturesDetailsList,
	datasetsDelete,
	datasetsFeaturelistsList,
	datasetsFileList,
	datasetsFromDataSourceCreate,
	datasetsFromFileCreate,
	datasetsFromURLCreate,
	datasetsList,
	datasetsPatch,
	datasetsProjectsList,
	datasetsRetrieve,
	datasetsVersionsDelete,
	datasetsVersionsFromFileCreate,
	datasetsVersionsFromURLCreate,
	datasetsVersionsList,
	datasetsVersionsRetrieve,
} from './datasets';
export const Datasets = {
	datasetsAllFeaturesDetailsList,
	datasetsDelete,
	datasetsFeaturelistsList,
	datasetsFileList,
	datasetsFromDataSourceCreate,
	datasetsFromFileCreate,
	datasetsFromURLCreate,
	datasetsList,
	datasetsPatch,
	datasetsProjectsList,
	datasetsRetrieve,
	datasetsVersionsDelete,
	datasetsVersionsFromFileCreate,
	datasetsVersionsFromURLCreate,
	datasetsVersionsList,
	datasetsVersionsRetrieve,
};

import {
	deploymentsAccuracyList,
	deploymentsAccuracyOverTimeList,
	deploymentsCapabilitiesList,
	deploymentsDelete,
	deploymentsFeaturesList,
	deploymentsFromLearningModelCreate,
	deploymentsFromModelPackageCreate,
	deploymentsList,
	deploymentsModelHistoryList,
	deploymentsModelPatchMany,
	deploymentsPatch,
	deploymentsPredictionsOverTimeList,
	deploymentsRetrieve,
	deploymentsServiceStatsList,
	deploymentsSettingsList,
	deploymentsSettingsPatchMany,
	deploymentsSharedRolesList,
} from './deployments';
export const Deployments = {
	deploymentsAccuracyList,
	deploymentsAccuracyOverTimeList,
	deploymentsCapabilitiesList,
	deploymentsDelete,
	deploymentsFeaturesList,
	deploymentsFromLearningModelCreate,
	deploymentsFromModelPackageCreate,
	deploymentsList,
	deploymentsModelHistoryList,
	deploymentsModelPatchMany,
	deploymentsPatch,
	deploymentsPredictionsOverTimeList,
	deploymentsRetrieve,
	deploymentsServiceStatsList,
	deploymentsSettingsList,
	deploymentsSettingsPatchMany,
	deploymentsSharedRolesList,
};

import {
	modelPackagesFeaturesList,
	modelPackagesFromLeaderboardCreate,
	modelPackagesList,
	modelPackagesRetrieve,
} from './model-packages';
export const ModelPackages = {
	modelPackagesFeaturesList,
	modelPackagesFromLeaderboardCreate,
	modelPackagesList,
	modelPackagesRetrieve,
};

import { predictionServersList } from './prediction-servers';
export const PredictionServers = { predictionServersList };

import {
	configureAndStartAutopilot,
	projectsAccessControlList,
	projectsAutopilotCreate,
	projectsAutopilotsCreate,
	projectsBlueprintsList,
	projectsBlueprintsRetrieve,
	projectsCreate,
	projectsDatetimeModelsList,
	projectsDelete,
	projectsDeploymentReadyModelsCreate,
	projectsFeaturelistsCreate,
	projectsFeaturelistsDelete,
	projectsFeaturelistsList,
	projectsFeaturelistsPatch,
	projectsFeaturelistsRetrieve,
	projectsFeaturesList,
	projectsFeaturesRetrieve,
	projectsJobsDelete,
	projectsJobsList,
	projectsJobsRetrieve,
	projectsList,
	projectsModelingFeaturelistsCreate,
	projectsModelingFeaturelistsList,
	projectsModelsCreate,
	projectsModelsDelete,
	projectsModelsFromModelCreate,
	projectsModelsList,
	projectsModelsRetrieve,
	projectsPatch,
	projectsPredictionDatasetsDelete,
	projectsPredictionDatasetsList,
	projectsPredictionDatasetsRetrieve,
	projectsPredictionsCreate,
	projectsPredictionsList,
	projectsPredictionsRetrieve,
	projectsRecommendedModelsList,
	projectsRetrieve,
	projectsStatusList,
	projectsTrainingPredictionsCreate,
	trainingPredictionsList,
} from './projects';
export const Projects = {
	configureAndStartAutopilot,
	projectsAccessControlList,
	projectsAutopilotCreate,
	projectsAutopilotsCreate,
	projectsBlueprintsList,
	projectsBlueprintsRetrieve,
	projectsCreate,
	projectsDatetimeModelsList,
	projectsDelete,
	projectsDeploymentReadyModelsCreate,
	projectsFeaturelistsCreate,
	projectsFeaturelistsDelete,
	projectsFeaturelistsList,
	projectsFeaturelistsPatch,
	projectsFeaturelistsRetrieve,
	projectsFeaturesList,
	projectsFeaturesRetrieve,
	projectsJobsDelete,
	projectsJobsList,
	projectsJobsRetrieve,
	projectsList,
	projectsModelingFeaturelistsCreate,
	projectsModelingFeaturelistsList,
	projectsModelsCreate,
	projectsModelsDelete,
	projectsModelsFromModelCreate,
	projectsModelsList,
	projectsModelsRetrieve,
	projectsPatch,
	projectsPredictionDatasetsDelete,
	projectsPredictionDatasetsList,
	projectsPredictionDatasetsRetrieve,
	projectsPredictionsCreate,
	projectsPredictionsList,
	projectsPredictionsRetrieve,
	projectsRecommendedModelsList,
	projectsRetrieve,
	projectsStatusList,
	projectsTrainingPredictionsCreate,
	trainingPredictionsList,
};

import { statusList, statusRetrieve } from './status';
export const Status = { statusList, statusRetrieve };

import {
	useCasesCreate,
	useCasesDatasetsList,
	useCasesDelete,
	useCasesDeploymentsList,
	useCasesList,
	useCasesPatch,
	useCasesProjectsList,
	useCasesRetrieve,
} from './use-cases';
export const UseCases = {
	useCasesCreate,
	useCasesDatasetsList,
	useCasesDelete,
	useCasesDeploymentsList,
	useCasesList,
	useCasesPatch,
	useCasesProjectsList,
	useCasesRetrieve,
};

import { versionList } from './version';
export const Version = { versionList };
