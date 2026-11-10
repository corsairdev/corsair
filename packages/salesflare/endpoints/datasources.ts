import { logEventFromContext } from 'corsair/core';
import type { SalesflareEndpoints } from '..';
import { makeSalesflareRequest } from '../client';
import { salesflarePathParameter } from './path';
import type { SalesflareEndpointOutputs } from './types';

export const listEmailDataSources: SalesflareEndpoints['listEmailDataSources'] =
	async (ctx, input) => {
		const response = await makeSalesflareRequest<
			SalesflareEndpointOutputs['listEmailDataSources']
		>(ctx, '/datasources/email', { method: 'GET', query: input });
		await logEventFromContext(
			ctx,
			'salesflare.datasources.listEmailDataSources',
			input,
			'completed',
		);
		return response;
	};

export const updateEmailDataSource: SalesflareEndpoints['updateEmailDataSource'] =
	async (ctx, input) => {
		const { id, ...body } = input;
		const response = await makeSalesflareRequest<
			SalesflareEndpointOutputs['updateEmailDataSource']
		>(ctx, salesflarePathParameter('/datasources/email/{id}', 'id', input.id), {
			method: 'PUT',
			body: body,
		});
		await logEventFromContext(
			ctx,
			'salesflare.datasources.updateEmailDataSource',
			input,
			'completed',
		);
		return response;
	};
