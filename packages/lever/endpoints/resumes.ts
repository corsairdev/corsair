import { logEventFromContext } from 'corsair/core';
import type { LeverEndpoints } from '..';
import { makeLeverRequest } from '../client';
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
	const response = await makeLeverRequest<LeverEndpointOutputs['listResumes']>(
		ctx,
		withResumePath(input.opportunityId),
		{ method: 'GET' },
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

// Downloads stream raw bytes, so their output stays untyped.
export const downloadResume: LeverEndpoints['downloadResume'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<
		LeverEndpointOutputs['downloadResume']
	>(ctx, `${withResumePath(input.opportunityId, input.resumeId)}/download`, {
		method: 'GET',
		headers: { Accept: 'application/octet-stream' },
	});
	await logEventFromContext(ctx, 'lever.resumes.download', input, 'completed');
	return response;
};
