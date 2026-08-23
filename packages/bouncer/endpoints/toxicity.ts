import { logEventFromContext } from 'corsair/core';
import type { BouncerEndpoints } from '..';
import { makeBouncerRequest } from '../client';
import type { BouncerEndpointOutputs } from './types';

export const createToxicityListJob: BouncerEndpoints['createToxicityListJob'] =
	async (ctx, input) => {
		const body = Array.isArray(input.emails)
			? input.emails.map((e) => (typeof e === 'string' ? { email: e } : e))
			: input;

		const response = await makeBouncerRequest<
			BouncerEndpointOutputs['createToxicityListJob']
		>('toxicity', ctx.key, {
			method: 'POST',
			body: body as unknown as Record<string, unknown>,
		});

		await logEventFromContext(
			ctx,
			'bouncer.toxicity.createToxicityListJob',
			{ count: Array.isArray(input.emails) ? input.emails.length : 0 },
			'completed',
		);
		return response;
	};

export const checkToxicityListJobStatus: BouncerEndpoints['checkToxicityListJobStatus'] =
	async (ctx, input) => {
		const response = await makeBouncerRequest<
			BouncerEndpointOutputs['checkToxicityListJobStatus']
		>(`toxicity/${encodeURIComponent(input.jobId)}`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'bouncer.toxicity.checkToxicityListJobStatus',
			{ jobId: input.jobId },
			'completed',
		);
		return response;
	};

export const deleteToxicityListJob: BouncerEndpoints['deleteToxicityListJob'] =
	async (ctx, input) => {
		const response = await makeBouncerRequest<
			BouncerEndpointOutputs['deleteToxicityListJob']
		>(`toxicity/${encodeURIComponent(input.jobId)}`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'bouncer.toxicity.deleteToxicityListJob',
			{ jobId: input.jobId },
			'completed',
		);
		return response;
	};
