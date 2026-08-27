import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Request generation of automated document */
/** Official: POST /api/v2/automatedDocuments/ (`automatedDocuments_create`) */
export const automatedDocumentsCreate: DatarobotEndpoints['automatedDocumentsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/automatedDocuments/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.automatedDocumentsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.automatedDocuments.automatedDocumentsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Delete automated document by document ID */
/** Official: DELETE /api/v2/automatedDocuments/{documentId}/ (`automatedDocuments_delete`) */
export const automatedDocumentsDelete: DatarobotEndpoints['automatedDocumentsDelete'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/automatedDocuments/{documentId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['documentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'DELETE',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.automatedDocumentsDelete.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.automatedDocuments.automatedDocumentsDelete',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** List all generated documents. */
/** Official: GET /api/v2/automatedDocuments/ (`automatedDocuments_list`) */
export const automatedDocumentsList: DatarobotEndpoints['automatedDocumentsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/automatedDocuments/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			['offset', 'limit', 'documentType', 'outputFormat', 'locale', 'entityId'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.automatedDocumentsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.automatedDocuments.automatedDocumentsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Download generated document by document ID */
/** Official: GET /api/v2/automatedDocuments/{documentId}/ (`automatedDocuments_retrieve`) */
export const automatedDocumentsRetrieve: DatarobotEndpoints['automatedDocumentsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/automatedDocuments/{documentId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['documentId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.automatedDocumentsRetrieve.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.automatedDocuments.automatedDocumentsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};
