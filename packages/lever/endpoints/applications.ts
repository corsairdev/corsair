import { logEventFromContext } from 'corsair/core';
import type { LeverEndpoints } from '..';
import { makeLeverRequest } from '../client';
import { leverPathParameter } from './path';
import type { LeverEndpointOutputs } from './types';

export const listApplications: LeverEndpoints['listApplications'] = async (
	ctx,
	input,
) => {
	const path = leverPathParameter(
		'/opportunities/{opportunityId}/applications',
		'opportunityId',
		input.opportunityId,
	);
	const response = await makeLeverRequest<
		LeverEndpointOutputs['listApplications']
	>(ctx, path, { method: 'GET' });
	await logEventFromContext(ctx, 'lever.applications.list', input, 'completed');
	return response;
};

export const retrieveApplication: LeverEndpoints['retrieveApplication'] =
	async (ctx, input) => {
		let path = leverPathParameter(
			'/opportunities/{opportunityId}/applications/{applicationId}',
			'opportunityId',
			input.opportunityId,
		);
		path = leverPathParameter(path, 'applicationId', input.applicationId);
		const response = await makeLeverRequest<
			LeverEndpointOutputs['retrieveApplication']
		>(ctx, path, { method: 'GET' });
		await logEventFromContext(
			ctx,
			'lever.applications.retrieve',
			input,
			'completed',
		);
		return response;
	};

export const listDeletedApplications: LeverEndpoints['listDeletedApplications'] =
	async (ctx, input) => {
		const response = await makeLeverRequest<
			LeverEndpointOutputs['listDeletedApplications']
		>(ctx, '/applications/deleted', {
			method: 'GET',
			query: input,
		});
		await logEventFromContext(
			ctx,
			'lever.applications.listDeleted',
			input,
			'completed',
		);
		return response;
	};
