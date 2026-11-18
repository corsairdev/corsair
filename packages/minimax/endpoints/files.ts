import { logEventFromContext } from 'corsair/core';
import type { MinimaxEndpoints } from '..';
import { makeMinimaxRequest } from '../client';
import type {
	FilesDeleteOutput,
	FilesListOutput,
	FilesRetrieveOutput,
} from './types';
import {
	MinimaxEndpointInputSchemas,
	MinimaxEndpointOutputSchemas,
} from './types';

export const list: MinimaxEndpoints['filesList'] = async (ctx, input) => {
	const parsedInput = MinimaxEndpointInputSchemas.filesList.parse(input);

	const response = await makeMinimaxRequest<FilesListOutput>(
		'/v1/files/list',
		ctx.key,
		{ method: 'GET', query: { purpose: parsedInput.purpose } },
	);

	const parsed = MinimaxEndpointOutputSchemas.filesList.parse(response);

	await logEventFromContext(
		ctx,
		'minimax.files.list',
		{ purpose: parsedInput.purpose, count: parsed.files.length },
		'completed',
	);

	return parsed;
};

export const retrieve: MinimaxEndpoints['filesRetrieve'] = async (
	ctx,
	input,
) => {
	const parsedInput = MinimaxEndpointInputSchemas.filesRetrieve.parse(input);

	const response = await makeMinimaxRequest<FilesRetrieveOutput>(
		'/v1/files/retrieve',
		ctx.key,
		{ method: 'GET', query: { file_id: parsedInput.file_id } },
	);

	const parsed = MinimaxEndpointOutputSchemas.filesRetrieve.parse(response);

	await logEventFromContext(
		ctx,
		'minimax.files.retrieve',
		{ fileId: parsedInput.file_id },
		'completed',
	);

	return parsed;
};

export const remove: MinimaxEndpoints['filesDelete'] = async (ctx, input) => {
	const parsedInput = MinimaxEndpointInputSchemas.filesDelete.parse(input);

	const response = await makeMinimaxRequest<FilesDeleteOutput>(
		'/v1/files/delete',
		ctx.key,
		{ method: 'POST', body: parsedInput },
	);

	const parsed = MinimaxEndpointOutputSchemas.filesDelete.parse(response);

	await logEventFromContext(
		ctx,
		'minimax.files.delete',
		{ fileId: parsedInput.file_id, purpose: parsedInput.purpose },
		'completed',
	);

	return parsed;
};
