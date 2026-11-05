import { logEventFromContext } from 'corsair/core';
import type { LeverEndpoints } from '..';
import { makeLeverBinaryRequest, makeLeverRequest } from '../client';
import { leverPathParameter } from './path';
import type { LeverEndpointOutputs } from './types';

const withResumePath = (opportunityId: string, resumeId?: string): string => {
	const base = leverPathParameter(
		'/opportunities/{opportunityId}/resumes',
		'opportunityId',
		opportunityId,
	);
	return resumeId === undefined
		? base
		: leverPathParameter(`${base}/{resumeId}`, 'resumeId', resumeId);
};

export const listResumes: LeverEndpoints['listResumes'] = async (
	ctx,
	input,
) => {
	const { opportunityId, ...query } = input;
	const response = await makeLeverRequest<LeverEndpointOutputs['listResumes']>(
		ctx,
		withResumePath(opportunityId),
		{ method: 'GET', query },
	);
	await logEventFromContext(ctx, 'lever.resumes.list', input, 'completed');
	return response;
};

export const retrieveResume: LeverEndpoints['retrieveResume'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<
		LeverEndpointOutputs['retrieveResume']
	>(ctx, withResumePath(input.opportunityId, input.resumeId), {
		method: 'GET',
	});
	await logEventFromContext(ctx, 'lever.resumes.retrieve', input, 'completed');
	return response;
};

// Downloads return the raw bytes base64-encoded with their content type.
export const downloadResume: LeverEndpoints['downloadResume'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverBinaryRequest(
		ctx,
		`${withResumePath(input.opportunityId, input.resumeId)}/download`,
		{ headers: { Accept: 'application/octet-stream' } },
	);
	await logEventFromContext(ctx, 'lever.resumes.download', input, 'completed');
	return response;
};
