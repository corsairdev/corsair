import { logEventFromContext } from 'corsair/core';
import type { LeverEndpoints } from '..';
import { makeLeverRequest } from '../client';
import { leverPathParameter } from './path';
import type { LeverEndpointOutputs } from './types';
export const listDispositionStages: LeverEndpoints['listDispositionStages'] =
	async (ctx, input) => {
		const response = await makeLeverRequest<
			LeverEndpointOutputs['listDispositionStages']
		>(ctx, '/disposition_stages', { method: 'GET', query: input });
		await logEventFromContext(
			ctx,
			'lever.dispositionStages.list',
			input,
			'completed',
		);
		return response;
	};

export const retrieveDiversitySurvey: LeverEndpoints['retrieveDiversitySurvey'] =
	async (ctx, input) => {
		const response = await makeLeverRequest<
			LeverEndpointOutputs['retrieveDiversitySurvey']
		>(
			ctx,
			leverPathParameter(
				'/surveys/diversity/{postingId}',
				'postingId',
				input.postingId,
			),
			{ method: 'GET', query: { country_code: input.country_code } },
		);
		await logEventFromContext(
			ctx,
			'lever.surveys.retrieveDiversity',
			input,
			'completed',
		);
		return response;
	};

export const listAuditEvents: LeverEndpoints['listAuditEvents'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<
		LeverEndpointOutputs['listAuditEvents']
	>(ctx, '/audit_events', { method: 'GET', query: input });
	await logEventFromContext(ctx, 'lever.auditEvents.list', input, 'completed');
	return response;
};

export const listSources: LeverEndpoints['listSources'] = async (
	ctx,
	input,
) => {
	const response = await makeLeverRequest<LeverEndpointOutputs['listSources']>(
		ctx,
		'/sources',
		{ method: 'GET', query: input },
	);
	await logEventFromContext(ctx, 'lever.sources.list', input, 'completed');
	return response;
};

export const listTags: LeverEndpoints['listTags'] = async (ctx, input) => {
	const response = await makeLeverRequest<LeverEndpointOutputs['listTags']>(
		ctx,
		'/tags',
		{ method: 'GET', query: input },
	);
	await logEventFromContext(ctx, 'lever.tags.list', input, 'completed');
	return response;
};
