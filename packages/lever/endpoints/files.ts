import { logEventFromContext } from 'corsair/core';
import type { LeverEndpoints } from '..';
import { makeLeverBinaryRequest, makeLeverRequest } from '../client';
import { leverPathParameter } from './path';
import type { LeverEndpointOutputs } from './types';

const withFilePath = (opportunityId: string, suffix = ''): string => {
	let path = leverPathParameter(
		'/opportunities/{opportunityId}/files',
		'opportunityId',
		opportunityId,
	);
	if (suffix) path = leverPathParameter(`${path}/{fileId}`, 'fileId', suffix);
	return path;
};

export const listFiles: LeverEndpoints['listFiles'] = async (ctx, input) => {
	const { opportunityId, ...query } = input;
	const response = await makeLeverRequest<LeverEndpointOutputs['listFiles']>(
		ctx,
		withFilePath(opportunityId),
		{ method: 'GET', query },
	);
	await logEventFromContext(ctx, 'lever.files.list', input, 'completed');
	return response;
};

export const retrieveFile: LeverEndpoints['retrieveFile'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<LeverEndpointOutputs['retrieveFile']>(
		ctx,
		withFilePath(input.opportunityId, input.fileId),
		{ method: 'GET' },
	);
	await logEventFromContext(ctx, 'lever.files.retrieve', input, 'completed');
	return response;
};

// The documented multipart upload for this family is excluded: the shared
// JSON client cannot express a binary multipart/form-data body (30MB file
// limit). Downloads return the raw bytes base64-encoded with their content
// type.
export const downloadFile: LeverEndpoints['downloadFile'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverBinaryRequest(
		ctx,
		withFilePath(input.opportunityId, input.fileId) + '/download',
		{ headers: { Accept: 'application/octet-stream' } },
	);
	await logEventFromContext(ctx, 'lever.files.download', input, 'completed');
	return response;
};

export const deleteFile: LeverEndpoints['deleteFile'] = async (ctx, input) => {
	const response = await makeLeverRequest<LeverEndpointOutputs['deleteFile']>(
		ctx,
		withFilePath(input.opportunityId, input.fileId),
		{ method: 'DELETE', query: { perform_as: input.perform_as } },
	);
	await logEventFromContext(ctx, 'lever.files.delete', input, 'completed');
	return response;
};
