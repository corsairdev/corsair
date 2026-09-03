# @corsair-dev/datarobot

DataRobot plugin for Corsair.

## Install

```bash
pnpm add @corsair-dev/datarobot
```

## Endpoints

| Operation | Operation ID | Risk | Description |
|-----------|--------------|------|-------------|
| `batchPredictions.batchPredictionsCreate` | `datarobot.api.batchPredictions.batchPredictionsCreate` | `write` | Creates a new Batch Prediction job |
| `batchPredictions.batchPredictionsDelete` | `datarobot.api.batchPredictions.batchPredictionsDelete` | `destructive` | Cancel a Batch Prediction job by prediction job ID |
| `batchPredictions.batchPredictionsFromExistingCreate` | `datarobot.api.batchPredictions.batchPredictionsFromExistingCreate` | `write` | Create a new a Batch Prediction job based |
| `batchPredictions.batchPredictionsFromJobDefinitionCreate` | `datarobot.api.batchPredictions.batchPredictionsFromJobDefinitionCreate` | `write` | Launch a Batch Prediction job |
| `batchPredictions.batchPredictionsList` | `datarobot.api.batchPredictions.batchPredictionsList` | `read` | List batch prediction jobs |
| `batchPredictions.batchPredictionsRetrieve` | `datarobot.api.batchPredictions.batchPredictionsRetrieve` | `read` | Retrieve Batch Prediction job by prediction job ID |
| `catalogItems.catalogItemsList` | `datarobot.api.catalogItems.catalogItemsList` | `read` | List all catalog items accessible by the user. |
| `catalogItems.catalogItemsRetrieve` | `datarobot.api.catalogItems.catalogItemsRetrieve` | `read` | Retrieves latest version information, by ID by catalog ID |
| `credentials.credentialsCreate` | `datarobot.api.credentials.credentialsCreate` | `write` | Store a new set of credentials which can be used |
| `credentials.credentialsDelete` | `datarobot.api.credentials.credentialsDelete` | `destructive` | Delete the credentials set by credential ID |
| `credentials.credentialsList` | `datarobot.api.credentials.credentialsList` | `read` | List credentials. |
| `credentials.credentialsRetrieve` | `datarobot.api.credentials.credentialsRetrieve` | `read` | Retrieve the credentials set by credential ID |
| `customModels.customModelsCreate` | `datarobot.api.customModels.customModelsCreate` | `write` | Create custom model. |
| `customModels.customModelsDelete` | `datarobot.api.customModels.customModelsDelete` | `destructive` | Delete custom model by custom model ID |
| `customModels.customModelsList` | `datarobot.api.customModels.customModelsList` | `read` | List custom models. |
| `customModels.customModelsRetrieve` | `datarobot.api.customModels.customModelsRetrieve` | `read` | Get custom model by custom model ID |
| `customModels.customModelsVersionsCreate` | `datarobot.api.customModels.customModelsVersionsCreate` | `write` | Create custom model version by custom model ID |
| `customModels.customModelsVersionsList` | `datarobot.api.customModels.customModelsVersionsList` | `read` | List custom model versions by custom model ID |
| `datasets.datasetsAllFeaturesDetailsList` | `datarobot.api.datasets.datasetsAllFeaturesDetailsList` | `read` | Get dataset features by dataset ID |
| `datasets.datasetsDelete` | `datarobot.api.datasets.datasetsDelete` | `destructive` | Delete dataset by dataset ID |
| `datasets.datasetsFeaturelistsList` | `datarobot.api.datasets.datasetsFeaturelistsList` | `read` | Retrieve dataset featurelists by dataset ID |
| `datasets.datasetsFileList` | `datarobot.api.datasets.datasetsFileList` | `read` | Retrieve original dataset data by dataset ID |
| `datasets.datasetsFromDataSourceCreate` | `datarobot.api.datasets.datasetsFromDataSourceCreate` | `write` | Create a dataset from a data source |
| `datasets.datasetsFromFileCreate` | `datarobot.api.datasets.datasetsFromFileCreate` | `write` | Create a dataset from a file |
| `datasets.datasetsFromURLCreate` | `datarobot.api.datasets.datasetsFromURLCreate` | `write` | Create a dataset from an URL |
| `datasets.datasetsList` | `datarobot.api.datasets.datasetsList` | `read` | List datasets |
| `datasets.datasetsPatch` | `datarobot.api.datasets.datasetsPatch` | `write` | Modify dataset by dataset ID |
| `datasets.datasetsProjectsList` | `datarobot.api.datasets.datasetsProjectsList` | `read` | Get dataset projects by dataset ID |
| `datasets.datasetsRetrieve` | `datarobot.api.datasets.datasetsRetrieve` | `read` | Get dataset details by dataset ID |
| `datasets.datasetsVersionsDelete` | `datarobot.api.datasets.datasetsVersionsDelete` | `destructive` | Delete dataset version by dataset ID |
| `datasets.datasetsVersionsFromFileCreate` | `datarobot.api.datasets.datasetsVersionsFromFileCreate` | `write` | Create a version from a file |
| `datasets.datasetsVersionsFromURLCreate` | `datarobot.api.datasets.datasetsVersionsFromURLCreate` | `write` | Create a version from an URL |
| `datasets.datasetsVersionsList` | `datarobot.api.datasets.datasetsVersionsList` | `read` | List dataset versions by dataset ID |
| `datasets.datasetsVersionsRetrieve` | `datarobot.api.datasets.datasetsVersionsRetrieve` | `read` | Get dataset details by version by dataset ID |
| `deployments.deploymentsAccuracyList` | `datarobot.api.deployments.deploymentsAccuracyList` | `read` | Retrieve accuracy metric by deployment ID |
| `deployments.deploymentsAccuracyOverTimeList` | `datarobot.api.deployments.deploymentsAccuracyOverTimeList` | `read` | Retrieve accuracy over time by deployment ID |
| `deployments.deploymentsCapabilitiesList` | `datarobot.api.deployments.deploymentsCapabilitiesList` | `read` | Retrieve capabilities by deployment ID |
| `deployments.deploymentsDelete` | `datarobot.api.deployments.deploymentsDelete` | `destructive` | Delete deployment by deployment ID |
| `deployments.deploymentsFeaturesList` | `datarobot.api.deployments.deploymentsFeaturesList` | `read` | Get deployment features by deployment ID |
| `deployments.deploymentsFromLearningModelCreate` | `datarobot.api.deployments.deploymentsFromLearningModelCreate` | `write` | Create deployment |
| `deployments.deploymentsFromModelPackageCreate` | `datarobot.api.deployments.deploymentsFromModelPackageCreate` | `write` | Create a deployment from a model package |
| `deployments.deploymentsList` | `datarobot.api.deployments.deploymentsList` | `read` | List deployments |
| `deployments.deploymentsModelHistoryList` | `datarobot.api.deployments.deploymentsModelHistoryList` | `read` | Retrieve champion model history of deployment by deployment ID |
| `deployments.deploymentsModelPatchMany` | `datarobot.api.deployments.deploymentsModelPatchMany` | `write` | Model Replacement by deployment ID |
| `deployments.deploymentsPatch` | `datarobot.api.deployments.deploymentsPatch` | `write` | Update deployment by deployment ID |
| `deployments.deploymentsPredictionsOverTimeList` | `datarobot.api.deployments.deploymentsPredictionsOverTimeList` | `read` | Retrieve metrics about predictions over time by deployment ID |
| `deployments.deploymentsRetrieve` | `datarobot.api.deployments.deploymentsRetrieve` | `read` | Retrieve deployment by deployment ID |
| `deployments.deploymentsServiceStatsList` | `datarobot.api.deployments.deploymentsServiceStatsList` | `read` | Retrieve service stats by ID |
| `deployments.deploymentsSettingsList` | `datarobot.api.deployments.deploymentsSettingsList` | `read` | Retrieve deployment settings by deployment ID |
| `deployments.deploymentsSettingsPatchMany` | `datarobot.api.deployments.deploymentsSettingsPatchMany` | `write` | Update deployment settings by deployment ID |
| `deployments.deploymentsSharedRolesList` | `datarobot.api.deployments.deploymentsSharedRolesList` | `read` | Get the model deployment access control list by deployment ID |
| `modelPackages.modelPackagesFeaturesList` | `datarobot.api.modelPackages.modelPackagesFeaturesList` | `read` | Retrieve feature list by model package ID |
| `modelPackages.modelPackagesFromLeaderboardCreate` | `datarobot.api.modelPackages.modelPackagesFromLeaderboardCreate` | `write` | Create model package |
| `modelPackages.modelPackagesList` | `datarobot.api.modelPackages.modelPackagesList` | `read` | List model packages |
| `modelPackages.modelPackagesRetrieve` | `datarobot.api.modelPackages.modelPackagesRetrieve` | `read` | Retrieve info about a model package by model package ID |
| `predictionServers.predictionServersList` | `datarobot.api.predictionServers.predictionServersList` | `read` | List prediction servers. |
| `projects.configureAndStartAutopilot` | `datarobot.api.projects.configureAndStartAutopilot` | `write` | Start modeling by project ID |
| `projects.projectsAccessControlList` | `datarobot.api.projects.projectsAccessControlList` | `read` | Get the project access control list by project ID |
| `projects.projectsAutopilotCreate` | `datarobot.api.projects.projectsAutopilotCreate` | `write` | Pause by project ID |
| `projects.projectsAutopilotsCreate` | `datarobot.api.projects.projectsAutopilotsCreate` | `write` | Start autopilot by project ID |
| `projects.projectsBlueprintsList` | `datarobot.api.projects.projectsBlueprintsList` | `read` | List blueprints by project ID |
| `projects.projectsBlueprintsRetrieve` | `datarobot.api.projects.projectsBlueprintsRetrieve` | `read` | Retrieve a blueprint by its ID. |
| `projects.projectsCreate` | `datarobot.api.projects.projectsCreate` | `write` | Create a project. |
| `projects.projectsDatetimeModelsList` | `datarobot.api.projects.projectsDatetimeModelsList` | `read` | List datetime partitioned project models by project ID |
| `projects.projectsDelete` | `datarobot.api.projects.projectsDelete` | `destructive` | Delete a project by project ID |
| `projects.projectsDeploymentReadyModelsCreate` | `datarobot.api.projects.projectsDeploymentReadyModelsCreate` | `write` | Prepare a model by project ID |
| `projects.projectsFeaturelistsCreate` | `datarobot.api.projects.projectsFeaturelistsCreate` | `write` | Create a new featurelist by project ID |
| `projects.projectsFeaturelistsDelete` | `datarobot.api.projects.projectsFeaturelistsDelete` | `destructive` | Delete a specified featurelist by project ID |
| `projects.projectsFeaturelistsList` | `datarobot.api.projects.projectsFeaturelistsList` | `read` | List featurelists by project ID |
| `projects.projectsFeaturelistsPatch` | `datarobot.api.projects.projectsFeaturelistsPatch` | `write` | Update an existing featurelist by project ID |
| `projects.projectsFeaturelistsRetrieve` | `datarobot.api.projects.projectsFeaturelistsRetrieve` | `read` | Retrieve a feature list by project ID |
| `projects.projectsFeaturesList` | `datarobot.api.projects.projectsFeaturesList` | `read` | List project features by project ID |
| `projects.projectsFeaturesRetrieve` | `datarobot.api.projects.projectsFeaturesRetrieve` | `read` | Get a project feature by project ID |
| `projects.projectsJobsDelete` | `datarobot.api.projects.projectsJobsDelete` | `destructive` | Cancel a job by project ID |
| `projects.projectsJobsList` | `datarobot.api.projects.projectsJobsList` | `read` | List project jobs by project ID |
| `projects.projectsJobsRetrieve` | `datarobot.api.projects.projectsJobsRetrieve` | `read` | Get a job by project ID |
| `projects.projectsList` | `datarobot.api.projects.projectsList` | `read` | List projects. |
| `projects.projectsModelingFeaturelistsCreate` | `datarobot.api.projects.projectsModelingFeaturelistsCreate` | `write` | Create a new modeling featurelist by project ID |
| `projects.projectsModelingFeaturelistsList` | `datarobot.api.projects.projectsModelingFeaturelistsList` | `read` | List all modeling featurelists by project ID |
| `projects.projectsModelsCreate` | `datarobot.api.projects.projectsModelsCreate` | `write` | Train a new model by project ID |
| `projects.projectsModelsDelete` | `datarobot.api.projects.projectsModelsDelete` | `destructive` | Delete a model by project ID |
| `projects.projectsModelsFromModelCreate` | `datarobot.api.projects.projectsModelsFromModelCreate` | `write` | Retrain a model by project ID |
| `projects.projectsModelsList` | `datarobot.api.projects.projectsModelsList` | `read` | List project models by project ID |
| `projects.projectsModelsRetrieve` | `datarobot.api.projects.projectsModelsRetrieve` | `read` | Get model by project ID |
| `projects.projectsPatch` | `datarobot.api.projects.projectsPatch` | `write` | Update a project by project ID |
| `projects.projectsPredictionDatasetsDelete` | `datarobot.api.projects.projectsPredictionDatasetsDelete` | `destructive` | Delete a dataset that was uploaded by project ID |
| `projects.projectsPredictionDatasetsList` | `datarobot.api.projects.projectsPredictionDatasetsList` | `read` | List prediction datasets uploaded by project ID |
| `projects.projectsPredictionDatasetsRetrieve` | `datarobot.api.projects.projectsPredictionDatasetsRetrieve` | `read` | Get the metadata of a specific dataset by project ID |
| `projects.projectsPredictionsCreate` | `datarobot.api.projects.projectsPredictionsCreate` | `write` | Make new predictions by project ID |
| `projects.projectsPredictionsList` | `datarobot.api.projects.projectsPredictionsList` | `read` | Get the list of prediction records by project ID |
| `projects.projectsPredictionsRetrieve` | `datarobot.api.projects.projectsPredictionsRetrieve` | `read` | Get a completed set of predictions by project ID |
| `projects.projectsRecommendedModelsList` | `datarobot.api.projects.projectsRecommendedModelsList` | `read` | List recommended models by project ID |
| `projects.projectsRetrieve` | `datarobot.api.projects.projectsRetrieve` | `read` | Get project by project ID |
| `projects.projectsStatusList` | `datarobot.api.projects.projectsStatusList` | `read` | Check project status by project ID |
| `projects.projectsTrainingPredictionsCreate` | `datarobot.api.projects.projectsTrainingPredictionsCreate` | `write` | Submits a job by project ID |
| `projects.trainingPredictionsList` | `datarobot.api.projects.trainingPredictionsList` | `read` | List training prediction jobs by project ID |
| `status.statusList` | `datarobot.api.status.statusList` | `read` | List tasks |
| `status.statusRetrieve` | `datarobot.api.status.statusRetrieve` | `read` | Get task status by status ID |
| `useCases.useCasesCreate` | `datarobot.api.useCases.useCasesCreate` | `write` | Get a use case. |
| `useCases.useCasesDatasetsList` | `datarobot.api.useCases.useCasesDatasetsList` | `read` | Get the list of the datasets associated by use case ID |
| `useCases.useCasesDelete` | `datarobot.api.useCases.useCasesDelete` | `destructive` | Delete a Use Case by use case ID |
| `useCases.useCasesDeploymentsList` | `datarobot.api.useCases.useCasesDeploymentsList` | `read` | Get the deployments associated by use case ID |
| `useCases.useCasesList` | `datarobot.api.useCases.useCasesList` | `read` | Retrieve the list of use cases. |
| `useCases.useCasesPatch` | `datarobot.api.useCases.useCasesPatch` | `write` | Update a Use Case by use case ID |
| `useCases.useCasesProjectsList` | `datarobot.api.useCases.useCasesProjectsList` | `read` | Get the list of the projects associated by use case ID |
| `useCases.useCasesRetrieve` | `datarobot.api.useCases.useCasesRetrieve` | `read` | Get a use case by use case ID |
| `version.versionList` | `datarobot.api.version.versionList` | `read` | Retrieve version information. |

## Auth

Auth: API key. Corsair prompts your tenant for credentials on first use.

## Webhooks

No webhooks.

## Reference

Full docs, types, and examples: https://docs.corsair.dev/plugins/datarobot

## License

Apache-2.0
