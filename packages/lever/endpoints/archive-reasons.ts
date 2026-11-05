import { logEventFromContext } from 'corsair/core';
import type { LeverEndpoints } from '..';
import { makeLeverRequest } from '../client';
import { leverPathParameter } from './path';
import type { LeverEndpointOutputs } from './types';

export const listArchiveReasons: LeverEndpoints['listArchiveReasons'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<
		LeverEndpointOutputs['listArchiveReasons']
	>(ctx, '/archive_reasons', {
		method: 'GET',
		query: input,
	});
	await logEventFromContext(
		ctx,
		'lever.archiveReasons.list',
		input,
		'completed',
	);
	return response;
};

export const retrieveArchiveReason: LeverEndpoints['retrieveArchiveReason'] =
	async (ctx, input) => {
		const response = await makeLeverRequest<
			LeverEndpointOutputs['retrieveArchiveReason']
		>(
			ctx,
			leverPathParameter(
				'/archive_reasons/{archiveReasonId}',
				'archiveReasonId',
				input.archiveReasonId,
			),
			{ method: 'GET' },
		);
		await logEventFromContext(
			ctx,
			'lever.archiveReasons.retrieve',
			input,
			'completed',
		);
		return response;
	};

export const listStages: LeverEndpoints['listStages'] = async (ctx, input) => {
	const response = await makeLeverRequest<LeverEndpointOutputs['listStages']>(
		ctx,
		'/stages',
		{
			method: 'GET',
			query: input,
		},
	);
	await logEventFromContext(ctx, 'lever.stages.list', input, 'completed');
	return response;
};

export const retrieveStage: LeverEndpoints['retrieveStage'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<
		LeverEndpointOutputs['retrieveStage']
	>(ctx, leverPathParameter('/stages/{stageId}', 'stageId', input.stageId), {
		method: 'GET',
	});
	await logEventFromContext(ctx, 'lever.stages.retrieve', input, 'completed');
	return response;
};
