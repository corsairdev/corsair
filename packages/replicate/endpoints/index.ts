import {
	accountGet,
	collectionsGet,
	collectionsList,
	deploymentsCreate,
	deploymentsDelete,
	deploymentsGet,
	deploymentsList,
	deploymentsPredictionsCreate,
	filesCreate,
	filesDelete,
	filesGet,
	filesList,
	hardwareList,
	modelsExamplesList,
	modelsGet,
	modelsList,
	modelsPredictionsCreate,
	modelsReadmeGet,
	modelsUpdate,
	modelsVersionsGet,
	modelsVersionsList,
	predictionsCancel,
	predictionsCreate,
	predictionsGet,
	predictionsList,
	search,
	trainingsCancel,
	trainingsCreate,
	trainingsGet,
	trainingsList,
	webhooksDefaultSecretGet,
} from './operations';

export const Account = { get: accountGet };
export const Collections = { list: collectionsList, get: collectionsGet };
export const Deployments = {
	list: deploymentsList,
	create: deploymentsCreate,
	delete: deploymentsDelete,
	get: deploymentsGet,
	predictionsCreate: deploymentsPredictionsCreate,
};
export const Files = {
	list: filesList,
	create: filesCreate,
	delete: filesDelete,
	get: filesGet,
};
export const Hardware = { list: hardwareList };
export const Models = {
	list: modelsList,
	get: modelsGet,
	update: modelsUpdate,
	examplesList: modelsExamplesList,
	predictionsCreate: modelsPredictionsCreate,
	readmeGet: modelsReadmeGet,
	versionsGet: modelsVersionsGet,
	versionsList: modelsVersionsList,
};
export const Predictions = {
	list: predictionsList,
	create: predictionsCreate,
	get: predictionsGet,
	cancel: predictionsCancel,
};
export const Search = { search };
export const Trainings = {
	create: trainingsCreate,
	get: trainingsGet,
	list: trainingsList,
	cancel: trainingsCancel,
};
export const Webhooks = { defaultSecretGet: webhooksDefaultSecretGet };

export {
	accountGet,
	collectionsGet,
	collectionsList,
	deploymentsCreate,
	deploymentsDelete,
	deploymentsGet,
	deploymentsList,
	deploymentsPredictionsCreate,
	filesCreate,
	filesDelete,
	filesGet,
	filesList,
	hardwareList,
	modelsExamplesList,
	modelsGet,
	modelsList,
	modelsPredictionsCreate,
	modelsReadmeGet,
	modelsUpdate,
	modelsVersionsGet,
	modelsVersionsList,
	predictionsCancel,
	predictionsCreate,
	predictionsGet,
	predictionsList,
	search,
	trainingsCancel,
	trainingsCreate,
	trainingsGet,
	trainingsList,
	webhooksDefaultSecretGet,
};

export * from './types';
