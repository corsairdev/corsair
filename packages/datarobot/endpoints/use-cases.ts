import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Get the list of the notebooks */
/** Official: GET /api/v2/useCases/notebooks/ (`use_cases_all_notebooks`) */
export const useCasesAllNotebooks: DatarobotEndpoints['useCasesAllNotebooks'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/useCases/notebooks/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			['offset', 'limit', 'includeName'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesAllNotebooks.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesAllNotebooks',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the list of the references associated */
/** Official: GET /api/v2/useCases/allResources/ (`useCasesAllResources_list`) */
export const useCasesAllResourcesList: DatarobotEndpoints['useCasesAllResourcesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/useCases/allResources/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			[
				'offset',
				'limit',
				'sort',
				'orderBy',
				'daysSinceLastActivity',
				'recipeStatus',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesAllResourcesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesAllResourcesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the list of the applications associated by use case ID */
/** Official: GET /api/v2/useCases/{useCaseId}/applications/ (`useCasesApplications_list`) */
export const useCasesApplicationsList: DatarobotEndpoints['useCasesApplicationsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/applications/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['useCaseId'],
			['offset', 'limit', 'search', 'sort', 'orderBy'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesApplicationsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesApplicationsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get a use case. */
/** Official: POST /api/v2/useCases/ (`useCases_create`) */
export const useCasesCreate: DatarobotEndpoints['useCasesCreate'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/useCases/', input);
	const { query, body } = splitDatarobotInput(input, [], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'POST',
		query,
		body,
	});
	const parsed = DatarobotEndpointOutputSchemas.useCasesCreate.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.useCases.useCasesCreate',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Link entity by use case ID */
/** Official: POST /api/v2/useCases/{useCaseId}/{referenceCollectionType}/{entityId}/ (`useCases_createOne`) */
export const useCasesCreateOne: DatarobotEndpoints['useCasesCreateOne'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/{referenceCollectionType}/{entityId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['useCaseId', 'referenceCollectionType', 'entityId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesCreateOne.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesCreateOne',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** The list of the custom applications referenced by a use case by use case ID */
/** Official: GET /api/v2/useCases/{useCaseId}/customApplications/ (`useCasesCustomApplications_list`) */
export const useCasesCustomApplicationsList: DatarobotEndpoints['useCasesCustomApplicationsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/customApplications/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['useCaseId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesCustomApplicationsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesCustomApplicationsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List datasets by use case ID */
/** Official: GET /api/v2/useCases/{useCaseId}/data/ (`useCasesData_list`) */
export const useCasesDataList: DatarobotEndpoints['useCasesDataList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/useCases/{useCaseId}/data/', input);
	const { query } = splitDatarobotInput(
		input,
		['useCaseId'],
		[
			'offset',
			'limit',
			'orderBy',
			'search',
			'dataType',
			'dataSourceType',
			'recipeStatus',
			'creatorUserId',
			'creatorUsername',
		],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.useCasesDataList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.useCases.useCasesDataList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Get the list of the datasets associated by use case ID */
/** Official: GET /api/v2/useCases/{useCaseId}/datasets/ (`useCasesDatasets_list`) */
export const useCasesDatasetsList: DatarobotEndpoints['useCasesDatasetsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/datasets/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['useCaseId'],
			['offset', 'limit', 'sort', 'orderBy', 'search'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesDatasetsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesDatasetsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the dataset details by use case ID */
/** Official: GET /api/v2/useCases/{useCaseId}/datasets/{datasetId}/ (`useCasesDatasets_retrieve`) */
export const useCasesDatasetsRetrieve: DatarobotEndpoints['useCasesDatasetsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/datasets/{datasetId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['useCaseId', 'datasetId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesDatasetsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesDatasetsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete a Use Case by use case ID */
/** Official: DELETE /api/v2/useCases/{useCaseId}/ (`useCases_delete`) */
export const useCasesDelete: DatarobotEndpoints['useCasesDelete'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/useCases/{useCaseId}/', input);
	const { query, body } = splitDatarobotInput(input, ['useCaseId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'DELETE',
		query: undefined,
	});
	const parsed = DatarobotEndpointOutputSchemas.useCasesDelete.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.useCases.useCasesDelete',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Get the deployments associated by use case ID */
/** Official: GET /api/v2/useCases/{useCaseId}/deployments/ (`useCasesDeployments_list`) */
export const useCasesDeploymentsList: DatarobotEndpoints['useCasesDeploymentsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/deployments/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['useCaseId'],
			['offset', 'limit', 'orderBy', 'search'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesDeploymentsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesDeploymentsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the list of the catalog files associated by use case ID */
/** Official: GET /api/v2/useCases/{useCaseId}/files/ (`useCasesFiles_list`) */
export const useCasesFilesList: DatarobotEndpoints['useCasesFilesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/files/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['useCaseId'],
			['offset', 'limit', 'orderBy', 'search'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesFilesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesFilesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the file details by use case ID */
/** Official: GET /api/v2/useCases/{useCaseId}/files/{fileId}/ (`useCasesFiles_retrieve`) */
export const useCasesFilesRetrieve: DatarobotEndpoints['useCasesFilesRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/files/{fileId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['useCaseId', 'fileId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesFilesRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesFilesRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get filtering metadata information from Use Cases associated by use case ID */
/** Official: GET /api/v2/useCases/{useCaseId}/filterMetadata/ (`useCasesFilterMetadata_list`) */
export const useCasesFilterMetadataList: DatarobotEndpoints['useCasesFilterMetadataList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/filterMetadata/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['useCaseId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesFilterMetadataList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesFilterMetadataList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the list of use cases. */
/** Official: GET /api/v2/useCases/ (`useCases_list`) */
export const useCasesList: DatarobotEndpoints['useCasesList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/useCases/', input);
	const { query } = splitDatarobotInput(
		input,
		[],
		[
			'offset',
			'limit',
			'search',
			'projectId',
			'applicationId',
			'entityId',
			'entityType',
			'sort',
			'orderBy',
			'usecaseType',
			'riskLevel',
			'stage',
			'createdBy',
			'showOrgUseCases',
		],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.useCasesList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.useCases.useCasesList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Gets a list of models from projects associated with a Use Case by use case ID */
/** Official: GET /api/v2/useCases/{useCaseId}/modelsForComparison/ (`useCasesModelsForComparison_list`) */
export const useCasesModelsForComparisonList: DatarobotEndpoints['useCasesModelsForComparisonList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/modelsForComparison/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['useCaseId'],
			[
				'offset',
				'limit',
				'orderBy',
				'binarySortMetric',
				'binarySortPartition',
				'regressionSortMetric',
				'regressionSortPartition',
				'numberTopModels',
				'samplePct',
				'modelFamily',
				'includeAllStarredModels',
				'trainingDatasetId',
				'targetFeature',
				'scoringCodeOnly',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesModelsForComparisonList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesModelsForComparisonList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Link multiple entities by use case ID */
/** Official: POST /api/v2/useCases/{useCaseId}/multilink/ (`useCasesMultilink_create`) */
export const useCasesMultilinkCreate: DatarobotEndpoints['useCasesMultilinkCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/multilink/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['useCaseId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesMultilinkCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesMultilinkCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the list of the notebooks associated by use case ID */
/** Official: GET /api/v2/useCases/{useCaseId}/notebooks/ (`useCasesNotebooks_list`) */
export const useCasesNotebooksList: DatarobotEndpoints['useCasesNotebooksList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/notebooks/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['useCaseId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesNotebooksList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesNotebooksList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update a Use Case by use case ID */
/** Official: PATCH /api/v2/useCases/{useCaseId}/ (`useCases_patch`) */
export const useCasesPatch: DatarobotEndpoints['useCasesPatch'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/useCases/{useCaseId}/', input);
	const { query, body } = splitDatarobotInput(input, ['useCaseId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'PATCH',
		query,
		body,
	});
	const parsed = DatarobotEndpointOutputSchemas.useCasesPatch.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.useCases.useCasesPatch',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Get the list of the playgrounds associated by use case ID */
/** Official: GET /api/v2/useCases/{useCaseId}/playgrounds/ (`useCasesPlaygrounds_list`) */
export const useCasesPlaygroundsList: DatarobotEndpoints['useCasesPlaygroundsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/playgrounds/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['useCaseId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesPlaygroundsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesPlaygroundsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the list of the projects associated by use case ID */
/** Official: GET /api/v2/useCases/{useCaseId}/projects/ (`useCasesProjects_list`) */
export const useCasesProjectsList: DatarobotEndpoints['useCasesProjectsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/projects/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['useCaseId'],
			['offset', 'limit', 'search', 'sort', 'orderBy'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesProjectsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesProjectsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Remove a related entity by use case ID */
/** Official: DELETE /api/v2/useCases/{useCaseId}/{referenceCollectionType}/{entityId}/ (`useCases_reference_delete`) */
export const useCasesReferenceDelete: DatarobotEndpoints['useCasesReferenceDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/{referenceCollectionType}/{entityId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['useCaseId', 'referenceCollectionType', 'entityId'],
			['deleteResource'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesReferenceDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesReferenceDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Move entity from one Use Case by use case ID */
/** Official: PATCH /api/v2/useCases/{useCaseId}/{referenceCollectionType}/{entityId}/ (`useCases_reference_move`) */
export const useCasesReferenceMove: DatarobotEndpoints['useCasesReferenceMove'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/{referenceCollectionType}/{entityId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['useCaseId', 'referenceCollectionType', 'entityId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesReferenceMove.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesReferenceMove',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** The list of the registered models referenced by a use case by use case ID */
/** Official: GET /api/v2/useCases/{useCaseId}/registeredModels/ (`useCasesRegisteredModels_list`) */
export const useCasesRegisteredModelsList: DatarobotEndpoints['useCasesRegisteredModelsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/registeredModels/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['useCaseId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesRegisteredModelsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesRegisteredModelsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get the list of the references associated by use case ID */
/** Official: GET /api/v2/useCases/{useCaseId}/resources/ (`useCasesResources_list`) */
export const useCasesResourcesList: DatarobotEndpoints['useCasesResourcesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/resources/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['useCaseId'],
			[
				'offset',
				'limit',
				'sort',
				'orderBy',
				'daysSinceLastActivity',
				'recipeStatus',
			],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesResourcesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesResourcesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get a use case by use case ID */
/** Official: GET /api/v2/useCases/{useCaseId}/ (`useCases_retrieve`) */
export const useCasesRetrieve: DatarobotEndpoints['useCasesRetrieve'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/useCases/{useCaseId}/', input);
	const { query, body } = splitDatarobotInput(input, ['useCaseId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query: undefined,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.useCasesRetrieve.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.useCases.useCasesRetrieve',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Get the use case's access control list by use case ID */
/** Official: GET /api/v2/useCases/{useCaseId}/sharedRoles/ (`useCasesSharedRoles_list`) */
export const useCasesSharedRolesList: DatarobotEndpoints['useCasesSharedRolesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/sharedRoles/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['useCaseId'],
			['offset', 'limit', 'id'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesSharedRolesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesSharedRolesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Update the Use Case's access control list by use case ID */
/** Official: PATCH /api/v2/useCases/{useCaseId}/sharedRoles/ (`useCasesSharedRoles_patchMany`) */
export const useCasesSharedRolesPatchMany: DatarobotEndpoints['useCasesSharedRolesPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/sharedRoles/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['useCaseId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesSharedRolesPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesSharedRolesPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get a list of vector databases associated by use case ID */
/** Official: GET /api/v2/useCases/{useCaseId}/vectorDatabases/ (`useCasesVectorDatabases_list`) */
export const useCasesVectorDatabasesList: DatarobotEndpoints['useCasesVectorDatabasesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/vectorDatabases/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['useCaseId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesVectorDatabasesList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesVectorDatabasesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get a list of custom models that are associated by use case ID */
/** Official: GET /api/v2/useCases/{useCaseId}/vectorDatabases/{vectorDatabaseId}/relatedCustomModels/ (`useCasesVectorDatabasesRelatedCustomModels_list`) */
export const useCasesVectorDatabasesRelatedCustomModelsList: DatarobotEndpoints['useCasesVectorDatabasesRelatedCustomModelsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/vectorDatabases/{vectorDatabaseId}/relatedCustomModels/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['useCaseId', 'vectorDatabaseId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesVectorDatabasesRelatedCustomModelsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesVectorDatabasesRelatedCustomModelsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get a list of deployments that are associated by use case ID */
/** Official: GET /api/v2/useCases/{useCaseId}/vectorDatabases/{vectorDatabaseId}/relatedDeployments/ (`useCasesVectorDatabasesRelatedDeployments_list`) */
export const useCasesVectorDatabasesRelatedDeploymentsList: DatarobotEndpoints['useCasesVectorDatabasesRelatedDeploymentsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/vectorDatabases/{vectorDatabaseId}/relatedDeployments/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['useCaseId', 'vectorDatabaseId'],
			['offset', 'limit', 'targetType', 'status', 'includeModelInfo'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesVectorDatabasesRelatedDeploymentsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesVectorDatabasesRelatedDeploymentsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get a list of registered models that are associated by use case ID */
/** Official: GET /api/v2/useCases/{useCaseId}/vectorDatabases/{vectorDatabaseId}/relatedRegisteredModels/ (`useCasesVectorDatabasesRelatedRegisteredModels_list`) */
export const useCasesVectorDatabasesRelatedRegisteredModelsList: DatarobotEndpoints['useCasesVectorDatabasesRelatedRegisteredModelsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/useCases/{useCaseId}/vectorDatabases/{vectorDatabaseId}/relatedRegisteredModels/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['useCaseId', 'vectorDatabaseId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.useCasesVectorDatabasesRelatedRegisteredModelsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.useCases.useCasesVectorDatabasesRelatedRegisteredModelsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
