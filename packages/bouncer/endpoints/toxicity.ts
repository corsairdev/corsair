import { logEventFromContext } from 'corsair/core';
import type { BouncerEndpoints } from '..';
import { makeBouncerRequest } from '../client';
import type { BouncerEndpointOutputs } from './types';

// The toxicity list surface is served from `v1`, not the `v1.1` used by the
// email, domain and credits endpoints.
// https://docs.usebouncer.com/api-reference/toxicity/toxicity-create

export const createToxicityListJob: BouncerEndpoints['createToxicityListJob'] =
	async (ctx, input) => {
		const response = await makeBouncerRequest<
			BouncerEndpointOutputs['createToxicityListJob']
		>('v1/toxicity/list', ctx.key, {
			method: 'POST',
			// A bare array of address strings: objects are rejected here.
			body: input.emails,
		});

		await logEventFromContext(
			ctx,
			'bouncer.toxicity.createToxicityListJob',
			{ count: input.emails.length },
			'completed',
		);
		return response;
	};

export const checkToxicityListJobStatus: BouncerEndpoints['checkToxicityListJobStatus'] =
	async (ctx, input) => {
		const response = await makeBouncerRequest<
			BouncerEndpointOutputs['checkToxicityListJobStatus']
		>(`v1/toxicity/list/${encodeURIComponent(input.jobId)}`, ctx.key, {
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

export const getToxicityListResults: BouncerEndpoints['getToxicityListResults'] =
	async (ctx, input) => {
		const response = await makeBouncerRequest<
			BouncerEndpointOutputs['getToxicityListResults']
		>(`v1/toxicity/list/${encodeURIComponent(input.jobId)}/data`, ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'bouncer.toxicity.getToxicityListResults',
			{ jobId: input.jobId },
			'completed',
		);
		return response;
	};

export const deleteToxicityListJob: BouncerEndpoints['deleteToxicityListJob'] =
	async (ctx, input) => {
		// Bouncer answers 200 with an empty body, so there is nothing to decode.
		const response = await makeBouncerRequest<
			BouncerEndpointOutputs['deleteToxicityListJob'] | undefined
		>(`v1/toxicity/list/${encodeURIComponent(input.jobId)}`, ctx.key, {
			method: 'DELETE',
		});

		await logEventFromContext(
			ctx,
			'bouncer.toxicity.deleteToxicityListJob',
			{ jobId: input.jobId },
			'completed',
		);
		return response ?? {};
	};
