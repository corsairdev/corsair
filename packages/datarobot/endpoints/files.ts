import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Add file(s) into an existing files catalog item by catalog ID */
/** Official: POST /api/v2/files/{catalogId}/fromDataSource/ (`filesAddFromDataSource_create`) */
export const filesAddFromDataSourceCreate: DatarobotEndpoints['filesAddFromDataSourceCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/files/{catalogId}/fromDataSource/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['catalogId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.filesAddFromDataSourceCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.files.filesAddFromDataSourceCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a file from a file */
/** Official: POST /api/v2/files/{catalogId}/fromFile/ (`filesAddFromFile_create`) */
export const filesAddFromFileCreate: DatarobotEndpoints['filesAddFromFileCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/files/{catalogId}/fromFile/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['catalogId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.filesAddFromFileCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.files.filesAddFromFileCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a file from an URL */
/** Official: POST /api/v2/files/{catalogId}/fromURL/ (`filesAddFromURL_create`) */
export const filesAddFromURLCreate: DatarobotEndpoints['filesAddFromURLCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/files/{catalogId}/fromURL/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['catalogId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.filesAddFromURLCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.files.filesAddFromURLCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete files or folders by catalog ID */
/** Official: DELETE /api/v2/files/{catalogId}/allFiles/ (`filesAllFiles_deleteMany`) */
export const filesAllFilesDeleteMany: DatarobotEndpoints['filesAllFilesDeleteMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/files/{catalogId}/allFiles/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['catalogId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.filesAllFilesDeleteMany.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.files.filesAllFilesDeleteMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List all files associated by catalog ID */
/** Official: GET /api/v2/files/{catalogId}/allFiles/ (`filesAllFiles_list`) */
export const filesAllFilesList: DatarobotEndpoints['filesAllFilesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/files/{catalogId}/allFiles/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['catalogId'],
			['offset', 'limit', 'fileType', 'prefix', 'recursive'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.filesAllFilesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.files.filesAllFilesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Rename a file by catalog ID */
/** Official: PATCH /api/v2/files/{catalogId}/allFiles/ (`filesAllFiles_patchMany`) */
export const filesAllFilesPatchMany: DatarobotEndpoints['filesAllFilesPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/files/{catalogId}/allFiles/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['catalogId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.filesAllFilesPatchMany.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.files.filesAllFilesPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a duplicate files collection by catalog ID */
/** Official: POST /api/v2/files/{catalogId}/clone/ (`filesClone_create`) */
export const filesCloneCreate: DatarobotEndpoints['filesCloneCreate'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/files/{catalogId}/clone/', input);
	const { query, body } = splitDatarobotInput(input, ['catalogId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'POST',
		query,
		body,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.filesCloneCreate.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.files.filesCloneCreate',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Copy multiple files by catalog ID */
/** Official: POST /api/v2/files/{catalogId}/copyBatch/ (`filesCopyBatch_create`) */
export const filesCopyBatchCreate: DatarobotEndpoints['filesCopyBatchCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/files/{catalogId}/copyBatch/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['catalogId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.filesCopyBatchCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.files.filesCopyBatchCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Copy a file by catalog ID */
/** Official: POST /api/v2/files/{catalogId}/copy/ (`filesCopy_create`) */
export const filesCopyCreate: DatarobotEndpoints['filesCopyCreate'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/files/{catalogId}/copy/', input);
	const { query, body } = splitDatarobotInput(input, ['catalogId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'POST',
		query,
		body,
	});
	const parsed = DatarobotEndpointOutputSchemas.filesCopyCreate.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.files.filesCopyCreate',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Create an empty files catalog item. */
/** Official: POST /api/v2/files/ (`files_create`) */
export const filesCreate: DatarobotEndpoints['filesCreate'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/files/', input);
	const { query, body } = splitDatarobotInput(input, [], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'POST',
		query,
		body,
	});
	const parsed = DatarobotEndpointOutputSchemas.filesCreate.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.files.filesCreate',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Delete the file by catalog ID */
/** Official: DELETE /api/v2/files/{catalogId}/ (`files_delete`) */
export const filesDelete: DatarobotEndpoints['filesDelete'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/files/{catalogId}/', input);
	const { query, body } = splitDatarobotInput(input, ['catalogId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'DELETE',
		query: undefined,
	});
	const parsed = DatarobotEndpointOutputSchemas.filesDelete.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.files.filesDelete',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Recover a deleted file by catalog ID */
/** Official: PATCH /api/v2/files/{catalogId}/deleted/ (`filesDeleted_patchMany`) */
export const filesDeletedPatchMany: DatarobotEndpoints['filesDeletedPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/files/{catalogId}/deleted/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['catalogId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.filesDeletedPatchMany.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.files.filesDeletedPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve data by catalog ID */
/** Official: POST /api/v2/files/{catalogId}/downloads/ (`filesDownloads_create`) */
export const filesDownloadsCreate: DatarobotEndpoints['filesDownloadsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/files/{catalogId}/downloads/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['catalogId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.filesDownloadsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.files.filesDownloadsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve the requested data by streaming it by catalog ID */
/** Official: GET /api/v2/files/{catalogId}/file/ (`filesFile_list`) */
export const filesFileList: DatarobotEndpoints['filesFileList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/files/{catalogId}/file/', input);
	const { query } = splitDatarobotInput(input, ['catalogId'], ['fileName']);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed = DatarobotEndpointOutputSchemas.filesFileList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.files.filesFileList',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Create a files catalog item */
/** Official: POST /api/v2/files/fromDataSource/ (`filesFromDataSource_create`) */
export const filesFromDataSourceCreate: DatarobotEndpoints['filesFromDataSourceCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/files/fromDataSource/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.filesFromDataSourceCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.files.filesFromDataSourceCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a file from a file */
/** Official: POST /api/v2/files/fromFile/ (`filesFromFile_create`) */
export const filesFromFileCreate: DatarobotEndpoints['filesFromFileCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/files/fromFile/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.filesFromFileCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.files.filesFromFileCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Apply staged files by catalog ID */
/** Official: POST /api/v2/files/{catalogId}/fromStage/ (`filesFromStage_create`) */
export const filesFromStageCreate: DatarobotEndpoints['filesFromStageCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/files/{catalogId}/fromStage/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['catalogId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.filesFromStageCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.files.filesFromStageCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create a file from an URL */
/** Official: POST /api/v2/files/fromURL/ (`filesFromURL_create`) */
export const filesFromURLCreate: DatarobotEndpoints['filesFromURLCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/files/fromURL/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.filesFromURLCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.files.filesFromURLCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create links by ID */
/** Official: POST /api/v2/files/{catalogId}/links/ (`filesLinks_create`) */
export const filesLinksCreate: DatarobotEndpoints['filesLinksCreate'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/files/{catalogId}/links/', input);
	const { query, body } = splitDatarobotInput(input, ['catalogId'], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'POST',
		query,
		body,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.filesLinksCreate.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.files.filesLinksCreate',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** Execute bulk files action */
/** Official: PATCH /api/v2/files/ (`files_patchMany`) */
export const filesPatchMany: DatarobotEndpoints['filesPatchMany'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/files/', input);
	const { query, body } = splitDatarobotInput(input, [], []);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'PATCH',
		query,
		body,
	});
	const parsed = DatarobotEndpointOutputSchemas.filesPatchMany.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.files.filesPatchMany',
		input ?? {},
		'completed',
	);
	return parsed;
};

/** List entity shared roles by catalog ID */
/** Official: GET /api/v2/files/{catalogId}/sharedRoles/ (`filesSharedRoles_list`) */
export const filesSharedRolesList: DatarobotEndpoints['filesSharedRolesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/files/{catalogId}/sharedRoles/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['catalogId'],
			['id', 'name', 'shareRecipientType', 'offset', 'limit'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.filesSharedRolesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.files.filesSharedRolesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Modify entity shared roles by catalog ID */
/** Official: PATCH /api/v2/files/{catalogId}/sharedRoles/ (`filesSharedRoles_patchMany`) */
export const filesSharedRolesPatchMany: DatarobotEndpoints['filesSharedRolesPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/files/{catalogId}/sharedRoles/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['catalogId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.filesSharedRolesPatchMany.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.files.filesSharedRolesPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create an empty stage by catalog ID */
/** Official: POST /api/v2/files/{catalogId}/stages/ (`filesStages_create`) */
export const filesStagesCreate: DatarobotEndpoints['filesStagesCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/files/{catalogId}/stages/', input);
		const { query, body } = splitDatarobotInput(input, ['catalogId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.filesStagesCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.files.filesStagesCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Stage file by catalog ID */
/** Official: POST /api/v2/files/{catalogId}/stages/{stageId}/upload/ (`filesStagesUpload_create`) */
export const filesStagesUploadCreate: DatarobotEndpoints['filesStagesUploadCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/files/{catalogId}/stages/{stageId}/upload/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['catalogId', 'stageId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.filesStagesUploadCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.files.filesStagesUploadCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve all files by ID */
/** Official: GET /api/v2/files/{catalogId}/versions/{catalogVersionId}/allFiles/ (`filesVersionsAllFiles_list`) */
export const filesVersionsAllFilesList: DatarobotEndpoints['filesVersionsAllFilesList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/files/{catalogId}/versions/{catalogVersionId}/allFiles/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['catalogId', 'catalogVersionId'],
			['offset', 'limit', 'fileType', 'prefix', 'recursive'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.filesVersionsAllFilesList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.files.filesVersionsAllFilesList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete file version by catalog ID */
/** Official: DELETE /api/v2/files/{catalogId}/versions/{catalogVersionId}/ (`filesVersions_delete`) */
export const filesVersionsDelete: DatarobotEndpoints['filesVersionsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/files/{catalogId}/versions/{catalogVersionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['catalogId', 'catalogVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.filesVersionsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.files.filesVersionsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Recover deleted file version by catalog ID */
/** Official: PATCH /api/v2/files/{catalogId}/versions/{catalogVersionId}/deleted/ (`filesVersionsDeleted_patchMany`) */
export const filesVersionsDeletedPatchMany: DatarobotEndpoints['filesVersionsDeletedPatchMany'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/files/{catalogId}/versions/{catalogVersionId}/deleted/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['catalogId', 'catalogVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.filesVersionsDeletedPatchMany.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.files.filesVersionsDeletedPatchMany',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create downloads by ID */
/** Official: POST /api/v2/files/{catalogId}/versions/{catalogVersionId}/downloads/ (`filesVersionsDownloads_create`) */
export const filesVersionsDownloadsCreate: DatarobotEndpoints['filesVersionsDownloadsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/files/{catalogId}/versions/{catalogVersionId}/downloads/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['catalogId', 'catalogVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.filesVersionsDownloadsCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.files.filesVersionsDownloadsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve file by ID */
/** Official: GET /api/v2/files/{catalogId}/versions/{catalogVersionId}/file/ (`filesVersionsFile_list`) */
export const filesVersionsFileList: DatarobotEndpoints['filesVersionsFileList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/files/{catalogId}/versions/{catalogVersionId}/file/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['catalogId', 'catalogVersionId'],
			['fileName'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.filesVersionsFileList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.files.filesVersionsFileList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create links by ID */
/** Official: POST /api/v2/files/{catalogId}/versions/{catalogVersionId}/links/ (`filesVersionsLinks_create`) */
export const filesVersionsLinksCreate: DatarobotEndpoints['filesVersionsLinksCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/files/{catalogId}/versions/{catalogVersionId}/links/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['catalogId', 'catalogVersionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.filesVersionsLinksCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.files.filesVersionsLinksCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List catalog versions by catalog ID */
/** Official: GET /api/v2/files/{catalogId}/versions/ (`filesVersions_list`) */
export const filesVersionsList: DatarobotEndpoints['filesVersionsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/files/{catalogId}/versions/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['catalogId'],
			['offset', 'limit', 'orderBy'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.filesVersionsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.files.filesVersionsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
