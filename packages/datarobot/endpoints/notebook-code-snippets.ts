import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Retrieve Notebook Code Snippets */
/** Official: GET /api/v2/notebookCodeSnippets/ (`notebookCodeSnippets_list`) */
export const notebookCodeSnippetsList: DatarobotEndpoints['notebookCodeSnippetsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/notebookCodeSnippets/', input);
		const { query } = splitDatarobotInput(
			input,
			[],
			['ListSnippetsQuerySchema'],
		);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookCodeSnippetsList.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.notebookCodeSnippets.notebookCodeSnippetsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Notebook Code Snippets by snippet ID */
/** Official: GET /api/v2/notebookCodeSnippets/{snippetId}/ (`notebookCodeSnippets_retrieve`) */
export const notebookCodeSnippetsRetrieve: DatarobotEndpoints['notebookCodeSnippetsRetrieve'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookCodeSnippets/{snippetId}/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, ['snippetId'], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookCodeSnippetsRetrieve.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebookCodeSnippets.notebookCodeSnippetsRetrieve',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve Tags */
/** Official: GET /api/v2/notebookCodeSnippets/tags/ (`notebookCodeSnippets_tags_list`) */
export const notebookCodeSnippetsTagsList: DatarobotEndpoints['notebookCodeSnippetsTagsList'] =
	async (ctx, input) => {
		const path = buildDatarobotPath(
			'/api/v2/notebookCodeSnippets/tags/',
			input,
		);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'GET',
			query: undefined,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.notebookCodeSnippetsTagsList.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'datarobot.notebookCodeSnippets.notebookCodeSnippetsTagsList',
			input ?? {},
			'completed',
		);
		return parsed;
	};
