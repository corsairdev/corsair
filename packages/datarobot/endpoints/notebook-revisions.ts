import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Retrieve Cells by notebook ID */
/** Official: GET /api/v2/notebookRevisions/{notebookId}/{revisionId}/cells/ (`notebookRevisions_cells_list`) */
export const notebookRevisionsCellsList: DatarobotEndpoints['notebookRevisionsCellsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookRevisions/{notebookId}/{revisionId}/cells/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['notebookId', 'revisionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookRevisionsCellsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebookRevisions.notebookRevisionsCellsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create Notebook Revisions by notebook ID */
/** Official: POST /api/v2/notebookRevisions/{notebookId}/ (`notebookRevisions_create`) */
export const notebookRevisionsCreate: DatarobotEndpoints['notebookRevisionsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookRevisions/{notebookId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['notebookId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookRevisionsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebookRevisions.notebookRevisionsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete Notebook Revisions by notebook ID */
/** Official: DELETE /api/v2/notebookRevisions/{notebookId}/ (`notebookRevisions_delete`) */
export const notebookRevisionsDelete: DatarobotEndpoints['notebookRevisionsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookRevisions/{notebookId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['notebookId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookRevisionsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebookRevisions.notebookRevisionsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete notebook revisions by ID */
/** Official: DELETE /api/v2/notebookRevisions/{notebookId}/{revisionId}/ (`notebookRevisions_delete`) */
export const notebookRevisionsDelete2: DatarobotEndpoints['notebookRevisionsDelete2'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookRevisions/{notebookId}/{revisionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['notebookId', 'revisionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookRevisionsDelete2.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebookRevisions.notebookRevisionsDelete2',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create Clone by notebook ID */
/** Official: POST /api/v2/notebookRevisions/fromRevision/{notebookId}/{revisionId}/clone/ (`notebookRevisions_fromRevision_clone_create`) */
export const notebookRevisionsFromRevisionCloneCreate: DatarobotEndpoints['notebookRevisionsFromRevisionCloneCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookRevisions/fromRevision/{notebookId}/{revisionId}/clone/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['notebookId', 'revisionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookRevisionsFromRevisionCloneCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebookRevisions.notebookRevisionsFromRevisionCloneCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create Restore by notebook ID */
/** Official: POST /api/v2/notebookRevisions/fromRevision/{notebookId}/{revisionId}/restore/ (`notebookRevisions_fromRevision_restore_create`) */
export const notebookRevisionsFromRevisionRestoreCreate: DatarobotEndpoints['notebookRevisionsFromRevisionRestoreCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookRevisions/fromRevision/{notebookId}/{revisionId}/restore/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['notebookId', 'revisionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookRevisionsFromRevisionRestoreCreate.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebookRevisions.notebookRevisionsFromRevisionRestoreCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Modify Notebook Revisions by notebook ID */
/** Official: PATCH /api/v2/notebookRevisions/{notebookId}/{revisionId}/ (`notebookRevisions_patch`) */
export const notebookRevisionsPatch: DatarobotEndpoints['notebookRevisionsPatch'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookRevisions/{notebookId}/{revisionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['notebookId', 'revisionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'PATCH',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookRevisionsPatch.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebookRevisions.notebookRevisionsPatch',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Notebook Revisions by notebook ID */
/** Official: GET /api/v2/notebookRevisions/{notebookId}/ (`notebookRevisions_retrieve`) */
export const notebookRevisionsRetrieve: DatarobotEndpoints['notebookRevisionsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookRevisions/{notebookId}/',
			input,
		);
		const { query } = splitDatarobotInput(
			input,
			['notebookId'],
			['ListNotebookRevisionsQuerySchema'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookRevisionsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebookRevisions.notebookRevisionsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve notebook revisions by ID */
/** Official: GET /api/v2/notebookRevisions/{notebookId}/{revisionId}/ (`notebookRevisions_retrieve`) */
export const notebookRevisionsRetrieve2: DatarobotEndpoints['notebookRevisionsRetrieve2'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookRevisions/{notebookId}/{revisionId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['notebookId', 'revisionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookRevisionsRetrieve2.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebookRevisions.notebookRevisionsRetrieve2',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve To File by notebook ID */
/** Official: GET /api/v2/notebookRevisions/{notebookId}/{revisionId}/toFile/ (`notebookRevisions_toFile_list`) */
export const notebookRevisionsToFileList: DatarobotEndpoints['notebookRevisionsToFileList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookRevisions/{notebookId}/{revisionId}/toFile/',
			input,
		);
		const { query, body } = splitDatarobotInput(
			input,
			['notebookId', 'revisionId'],
			[],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookRevisionsToFileList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebookRevisions.notebookRevisionsToFileList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
