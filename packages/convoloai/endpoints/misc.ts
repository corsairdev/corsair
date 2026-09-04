import { logEventFromContext } from 'corsair/core';
import { makeConvoloAiRequest } from '../client';
import type { ConvoloAiEndpointOutputs, ConvoloAiEndpoints } from '../index';

export const getCustomWidgetParams: ConvoloAiEndpoints['getCustomWidgetParams'] =
	async (ctx, input) => {
		const response = await makeConvoloAiRequest<
			ConvoloAiEndpointOutputs['getCustomWidgetParams']
		>('api/v2/ext/get-custom-params', ctx.key, {
			method: 'GET',
			query: {
				widget_key: input.widget_key,
				api_key: input.api_key,
			},
		});

		await logEventFromContext(
			ctx,
			'convoloai.getCustomWidgetParams',
			{ widget_key: '***', api_key: '***' },
			'completed',
		);

		return response;
	};

export const getOpenApiDocument: ConvoloAiEndpoints['getOpenApiDocument'] =
	async (ctx, input) => {
		const response = await makeConvoloAiRequest<
			ConvoloAiEndpointOutputs['getOpenApiDocument']
		>('api/v1/openapi', ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'convoloai.getOpenApiDocument',
			{ ...input },
			'completed',
		);

		return response;
	};
