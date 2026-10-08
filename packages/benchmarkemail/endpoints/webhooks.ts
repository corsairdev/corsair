/**
 * Benchmark Email webhooks endpoints (classic REST API v3.0).
 *
 * @see https://developer.benchmarkemail.com/ (Contacts / Webhooks)
 */
import { logEventFromContext } from 'corsair/core';
import type { BenchmarkEmailEndpoints } from '..';
import { makeBenchmarkEmailRequest } from '../client';
import type { BenchmarkEmailEndpointOutputs } from './types';

export const createWebhook: BenchmarkEmailEndpoints['webhooksCreateWebhook'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['webhooksCreateWebhook']
		>(`Contact/${encodeURIComponent(input.listID)}/Webhooks`, ctx.key, {
			method: 'POST',
			body: input.data,
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.webhooks.createWebhook',
			{ ...input },
			'completed',
		);
		return response;
	};

export const getWebhooks: BenchmarkEmailEndpoints['webhooksGetWebhooks'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['webhooksGetWebhooks']
		>(`Contact/${encodeURIComponent(input.listID)}/Webhooks`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'benchmarkemail.webhooks.getWebhooks',
			{ ...input },
			'completed',
		);
		return response;
	};

export const deleteWebhook: BenchmarkEmailEndpoints['webhooksDeleteWebhook'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['webhooksDeleteWebhook']
		>(
			`Contact/${encodeURIComponent(input.listID)}/Webhooks/${encodeURIComponent(input.id)}`,
			ctx.key,
			{ method: 'DELETE' },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.webhooks.deleteWebhook',
			{ ...input },
			'completed',
		);
		return response;
	};

export const updateWebhook: BenchmarkEmailEndpoints['webhooksUpdateWebhook'] =
	async (ctx, input) => {
		const response = await makeBenchmarkEmailRequest<
			BenchmarkEmailEndpointOutputs['webhooksUpdateWebhook']
		>(
			`Contact/${encodeURIComponent(input.listID)}/Webhooks/${encodeURIComponent(input.id)}`,
			ctx.key,
			{ method: 'PATCH', body: input.data },
		);

		await logEventFromContext(
			ctx,
			'benchmarkemail.webhooks.updateWebhook',
			{ ...input },
			'completed',
		);
		return response;
	};
