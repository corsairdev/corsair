import { logEventFromContext } from 'corsair/core';
import type { InsightoaiEndpoints } from '..';
import { makeInsightoaiRequest } from '../client';
import type { InsightoaiEndpointOutputs } from './types';

export const createProvider: InsightoaiEndpoints['createProvider'] = async (
	ctx,
	input,
) => {
	const result = await makeInsightoaiRequest<
		InsightoaiEndpointOutputs['createProvider']
	>('/api/v1/provider', ctx.key, {
		method: 'POST',
		body: input,
		authType: ctx.options.authType,
	});

	await logEventFromContext(
		ctx,
		'insightoai.providers.createProvider',
		{ providerName: input.provider_name },
		'completed',
	);
	return result;
};

export const getProviderById: InsightoaiEndpoints['getProviderById'] = async (
	ctx,
	input,
) => {
	const result = await makeInsightoaiRequest<
		InsightoaiEndpointOutputs['getProviderById']
	>(`/api/v1/provider/${input.provider_id}`, ctx.key, {
		method: 'GET',
		authType: ctx.options.authType,
	});

	await logEventFromContext(
		ctx,
		'insightoai.providers.getProviderById',
		{ providerId: input.provider_id },
		'completed',
	);
	return result;
};

export const deleteProviderById: InsightoaiEndpoints['deleteProviderById'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['deleteProviderById']
		>(`/api/v1/provider/${input.provider_id}`, ctx.key, {
			method: 'DELETE',
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.providers.deleteProviderById',
			{ providerId: input.provider_id },
			'completed',
		);
		return result;
	};

export const getSpeechtotextList: InsightoaiEndpoints['getSpeechtotextList'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['getSpeechtotextList']
		>('/api/v1/voice/voicestt', ctx.key, {
			method: 'GET',
			query: { page: input.page, size: input.size },
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.providers.getSpeechtotextList',
			{},
			'completed',
		);
		return result;
	};

export const retrieveListOfUserCustomVoice: InsightoaiEndpoints['retrieveListOfUserCustomVoice'] =
	async (ctx, input) => {
		const result = await makeInsightoaiRequest<
			InsightoaiEndpointOutputs['retrieveListOfUserCustomVoice']
		>('/api/v1/voice', ctx.key, {
			method: 'GET',
			query: { page: input.page, size: input.size },
			authType: ctx.options.authType,
		});

		await logEventFromContext(
			ctx,
			'insightoai.providers.retrieveListOfUserCustomVoice',
			{},
			'completed',
		);
		return result;
	};
