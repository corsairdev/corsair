import { logEventFromContext } from 'corsair/core';
import type { SalesflareEndpoints } from '..';
import { makeSalesflareRequest } from '../client';
import { salesflarePathParameter } from './path';
import type { SalesflareEndpointOutputs } from './types';

export const listOpportunities: SalesflareEndpoints['listOpportunities'] =
	async (ctx, input) => {
		const response = await makeSalesflareRequest<
			SalesflareEndpointOutputs['listOpportunities']
		>(ctx, '/opportunities', { method: 'GET', query: input });
		await logEventFromContext(
			ctx,
			'salesflare.opportunities.listOpportunities',
			input,
			'completed',
		);
		return response;
	};

export const createOpportunity: SalesflareEndpoints['createOpportunity'] =
	async (ctx, input) => {
		const response = await makeSalesflareRequest<
			SalesflareEndpointOutputs['createOpportunity']
		>(ctx, '/opportunities', { method: 'POST', body: input });
		await logEventFromContext(
			ctx,
			'salesflare.opportunities.createOpportunity',
			input,
			'completed',
		);
		return response;
	};

export const retrieveOpportunity: SalesflareEndpoints['retrieveOpportunity'] =
	async (ctx, input) => {
		const response = await makeSalesflareRequest<
			SalesflareEndpointOutputs['retrieveOpportunity']
		>(ctx, salesflarePathParameter('/opportunities/{id}', 'id', input.id), {
			method: 'GET',
		});
		await logEventFromContext(
			ctx,
			'salesflare.opportunities.retrieveOpportunity',
			input,
			'completed',
		);
		return response;
	};

export const updateOpportunity: SalesflareEndpoints['updateOpportunity'] =
	async (ctx, input) => {
		const { id, ...body } = input;
		const response = await makeSalesflareRequest<
			SalesflareEndpointOutputs['updateOpportunity']
		>(ctx, salesflarePathParameter('/opportunities/{id}', 'id', input.id), {
			method: 'PUT',
			body: body,
		});
		await logEventFromContext(
			ctx,
			'salesflare.opportunities.updateOpportunity',
			input,
			'completed',
		);
		return response;
	};

export const deleteOpportunity: SalesflareEndpoints['deleteOpportunity'] =
	async (ctx, input) => {
		const response = await makeSalesflareRequest<
			SalesflareEndpointOutputs['deleteOpportunity']
		>(ctx, salesflarePathParameter('/opportunities/{id}', 'id', input.id), {
			method: 'DELETE',
		});
		await logEventFromContext(
			ctx,
			'salesflare.opportunities.deleteOpportunity',
			input,
			'completed',
		);
		return response;
	};
