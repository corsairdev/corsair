import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Get the notebook access control list by notebook ID */
/** Official: GET /api/v2/notebooks/{notebookId}/sharedRoles/ (`notebookSharedRoles_list`) */
export const notebookSharedRolesList: DatarobotEndpoints['notebookSharedRolesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebooks/{notebookId}/sharedRoles/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['notebookId'],
			['offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookSharedRolesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebooks.notebookSharedRolesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Modify Batch Clear Cells Execution Count by notebook ID */
/** Official: PATCH /api/v2/notebooks/{notebookId}/batchClearCellsExecutionCount/ (`notebooks_batchClearCellsExecutionCount_patch`) */
export const notebooksBatchClearCellsExecutionCountPatch: DatarobotEndpoints['notebooksBatchClearCellsExecutionCountPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebooks/{notebookId}/batchClearCellsExecutionCount/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['notebookId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebooksBatchClearCellsExecutionCountPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebooks.notebooksBatchClearCellsExecutionCountPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create Bulk Link Use Case */
/** Official: POST /api/v2/notebooks/bulkLinkUseCase/ (`notebooks_bulkLinkUseCase_create`) */
export const notebooksBulkLinkUseCaseCreate: DatarobotEndpoints['notebooksBulkLinkUseCaseCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebooks/bulkLinkUseCase/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebooksBulkLinkUseCaseCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebooks.notebooksBulkLinkUseCaseCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Modify Batch Clear Output by notebook ID */
/** Official: PATCH /api/v2/notebooks/{notebookId}/cells/batchClearOutput/ (`notebooks_cells_batchClearOutput_patch`) */
export const notebooksCellsBatchClearOutputPatch: DatarobotEndpoints['notebooksCellsBatchClearOutputPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebooks/{notebookId}/cells/batchClearOutput/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['notebookId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebooksCellsBatchClearOutputPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebooks.notebooksCellsBatchClearOutputPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create Batch Create by notebook ID */
/** Official: POST /api/v2/notebooks/{notebookId}/cells/batchCreate/ (`notebooks_cells_batchCreate_create`) */
export const notebooksCellsBatchCreateCreate: DatarobotEndpoints['notebooksCellsBatchCreateCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebooks/{notebookId}/cells/batchCreate/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['notebookId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebooksCellsBatchCreateCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebooks.notebooksCellsBatchCreateCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create Batch Delete by notebook ID */
/** Official: POST /api/v2/notebooks/{notebookId}/cells/batchDelete/ (`notebooks_cells_batchDelete_create`) */
export const notebooksCellsBatchDeleteCreate: DatarobotEndpoints['notebooksCellsBatchDeleteCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebooks/{notebookId}/cells/batchDelete/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['notebookId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebooksCellsBatchDeleteCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebooks.notebooksCellsBatchDeleteCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Modify Batch Update Metadata by notebook ID */
/** Official: PATCH /api/v2/notebooks/{notebookId}/cells/batchUpdateMetadata/ (`notebooks_cells_batchUpdateMetadata_patch`) */
export const notebooksCellsBatchUpdateMetadataPatch: DatarobotEndpoints['notebooksCellsBatchUpdateMetadataPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebooks/{notebookId}/cells/batchUpdateMetadata/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['notebookId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebooksCellsBatchUpdateMetadataPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebooks.notebooksCellsBatchUpdateMetadataPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Modify Batch Update Sources by notebook ID */
/** Official: PATCH /api/v2/notebooks/{notebookId}/cells/batchUpdateSources/ (`notebooks_cells_batchUpdateSources_patch`) */
export const notebooksCellsBatchUpdateSourcesPatch: DatarobotEndpoints['notebooksCellsBatchUpdateSourcesPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebooks/{notebookId}/cells/batchUpdateSources/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['notebookId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebooksCellsBatchUpdateSourcesPatch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebooks.notebooksCellsBatchUpdateSourcesPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create Cells by notebook ID */
/** Official: POST /api/v2/notebooks/{notebookId}/cells/ (`notebooks_cells_create`) */
export const notebooksCellsCreate: DatarobotEndpoints['notebooksCellsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebooks/{notebookId}/cells/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['notebookId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebooksCellsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebooks.notebooksCellsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete Cells by notebook ID */
/** Official: DELETE /api/v2/notebooks/{notebookId}/cells/{cellId}/ (`notebooks_cells_delete`) */
export const notebooksCellsDelete: DatarobotEndpoints['notebooksCellsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebooks/{notebookId}/cells/{cellId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['notebookId', 'cellId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebooksCellsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebooks.notebooksCellsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Cells by notebook ID */
/** Official: GET /api/v2/notebooks/{notebookId}/cells/ (`notebooks_cells_list`) */
export const notebooksCellsList: DatarobotEndpoints['notebooksCellsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebooks/{notebookId}/cells/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['notebookId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebooksCellsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebooks.notebooksCellsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Modify Output by notebook ID */
/** Official: PATCH /api/v2/notebooks/{notebookId}/cells/{cellId}/output/ (`notebooks_cells_output_patch`) */
export const notebooksCellsOutputPatch: DatarobotEndpoints['notebooksCellsOutputPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebooks/{notebookId}/cells/{cellId}/output/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['notebookId', 'cellId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebooksCellsOutputPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebooks.notebooksCellsOutputPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Modify Cells by notebook ID */
/** Official: PATCH /api/v2/notebooks/{notebookId}/cells/{cellId}/ (`notebooks_cells_patch`) */
export const notebooksCellsPatch: DatarobotEndpoints['notebooksCellsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebooks/{notebookId}/cells/{cellId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['notebookId', 'cellId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebooksCellsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebooks.notebooksCellsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create Notebooks */
/** Official: POST /api/v2/notebooks/ (`notebooks_create`) */
export const notebooksCreate: DatarobotEndpoints['notebooksCreate'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/notebooks/', input);
	const { query, body } = splitDatarobotInput(input, [], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'POST',
		query,
		body,
	});
	const parsed = DatarobotEndpointOutputSchemas.notebooksCreate.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.notebooks.notebooksCreate',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Delete Notebooks by notebook ID */
/** Official: DELETE /api/v2/notebooks/{notebookId}/ (`notebooks_delete`) */
export const notebooksDelete: DatarobotEndpoints['notebooksDelete'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/notebooks/{notebookId}/', input);
	const { query, body } = splitDatarobotInput(input, ['notebookId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'DELETE',
		query: undefined,
	});
	const parsed = DatarobotEndpointOutputSchemas.notebooksDelete.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.notebooks.notebooksDelete',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Retrieve Filter Options */
/** Official: GET /api/v2/notebooks/filterOptions/ (`notebooks_filterOptions_list`) */
export const notebooksFilterOptionsList: DatarobotEndpoints['notebooksFilterOptionsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/notebooks/filterOptions/', input);
		const { query } = splitDatarobotInput(input, [], ['FilterOptionsQuery']);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebooksFilterOptionsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebooks.notebooksFilterOptionsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create From File */
/** Official: POST /api/v2/notebooks/fromFile/ (`notebooks_fromFile_create`) */
export const notebooksFromFileCreate: DatarobotEndpoints['notebooksFromFileCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/notebooks/fromFile/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebooksFromFileCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebooks.notebooksFromFileCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create From URL */
/** Official: POST /api/v2/notebooks/fromUrl/ (`notebooks_fromUrl_create`) */
export const notebooksFromUrlCreate: DatarobotEndpoints['notebooksFromUrlCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/notebooks/fromUrl/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebooksFromUrlCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebooks.notebooksFromUrlCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Notebooks */
/** Official: GET /api/v2/notebooks/ (`notebooks_list`) */
export const notebooksList: DatarobotEndpoints['notebooksList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/notebooks/', input);
	const { query } = splitDatarobotInput(input, [], ['ListNotebooksQuery']);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.notebooksList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.notebooks.notebooksList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Modify Notebooks by notebook ID */
/** Official: PATCH /api/v2/notebooks/{notebookId}/ (`notebooks_patch`) */
export const notebooksPatch: DatarobotEndpoints['notebooksPatch'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/notebooks/{notebookId}/', input);
	const { query, body } = splitDatarobotInput(input, ['notebookId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'PATCH',
		query,
		body,
	});
	const parsed = DatarobotEndpointOutputSchemas.notebooksPatch.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.notebooks.notebooksPatch',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Modify Reorder Cells by notebook ID */
/** Official: PATCH /api/v2/notebooks/{notebookId}/reorderCells/ (`notebooks_reorderCells_patch`) */
export const notebooksReorderCellsPatch: DatarobotEndpoints['notebooksReorderCellsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebooks/{notebookId}/reorderCells/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['notebookId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebooksReorderCellsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebooks.notebooksReorderCellsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Notebooks by notebook ID */
/** Official: GET /api/v2/notebooks/{notebookId}/ (`notebooks_retrieve`) */
export const notebooksRetrieve: DatarobotEndpoints['notebooksRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/notebooks/{notebookId}/', input);
		const { query, body } = splitDatarobotInput(input, ['notebookId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebooksRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebooks.notebooksRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Get access control lists */
/** Official: GET /api/v2/notebooks/sharedRoles/ (`notebooksSharedRoles_list`) */
export const notebooksSharedRolesList: DatarobotEndpoints['notebooksSharedRolesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/notebooks/sharedRoles/', input);
		const { query } = splitDatarobotInput(input, [], ['notebookIds']);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebooksSharedRolesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebooks.notebooksSharedRolesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Modify State by notebook ID */
/** Official: PATCH /api/v2/notebooks/{notebookId}/state/ (`notebooks_state_patch`) */
export const notebooksStatePatch: DatarobotEndpoints['notebooksStatePatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebooks/{notebookId}/state/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['notebookId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebooksStatePatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebooks.notebooksStatePatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create To Codespace by notebook ID */
/** Official: POST /api/v2/notebooks/{notebookId}/toCodespace/ (`notebooks_toCodespace_create`) */
export const notebooksToCodespaceCreate: DatarobotEndpoints['notebooksToCodespaceCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebooks/{notebookId}/toCodespace/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['notebookId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebooksToCodespaceCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebooks.notebooksToCodespaceCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve To File by notebook ID */
/** Official: GET /api/v2/notebooks/{notebookId}/toFile/ (`notebooks_toFile_list`) */
export const notebooksToFileList: DatarobotEndpoints['notebooksToFileList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebooks/{notebookId}/toFile/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['notebookId'],
			['ExportNotebookQuerySchema'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebooksToFileList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebooks.notebooksToFileList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
