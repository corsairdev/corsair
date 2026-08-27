import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Retrieve a code snippet. */
/** Official: POST /api/v2/codeSnippets/ (`codeSnippets_create`) */
export const codeSnippetsCreate: DatarobotEndpoints['codeSnippetsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/codeSnippets/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.codeSnippetsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.codeSnippets.codeSnippetsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Create download (no_code_applications) */
/** Official: POST /api/v2/codeSnippets/download/ (`codeSnippetsDownload_create`) */
export const codeSnippetsDownloadCreate: DatarobotEndpoints['codeSnippetsDownloadCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/codeSnippets/download/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.codeSnippetsDownloadCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.codeSnippets.codeSnippetsDownloadCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};

/** Retrieve available code snippets. */
/** Official: GET /api/v2/codeSnippets/ (`codeSnippets_list`) */
export const codeSnippetsList: DatarobotEndpoints['codeSnippetsList'] = async (
	ctx,
	input,
) => {
	const path = buildDatarobotPath('/api/v2/codeSnippets/', input);
	const { query } = splitDatarobotInput(
		input,
		[],
		['templateType', 'language', 'filters'],
	);
	const response = await makeDatarobotRequest(path, ctx, {
		method: 'GET',
		query,
	});
	const parsed =
		DatarobotEndpointOutputSchemas.codeSnippetsList.parse(response);
	await logEventFromContext(
		ctx,
		'datarobot.codeSnippets.codeSnippetsList',
		input ?? {},
		'completed',
	);
	return parsed;
};
