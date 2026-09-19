import { logEventFromContext } from 'corsair/core';
import type { BouncerEndpoints } from '..';
import { makeBouncerRequest } from '../client';
import {
	CheckToxicityListJobStatusResponseSchema,
	CreateToxicityListJobResponseSchema,
	DeleteToxicityListJobResponseSchema,
	GetToxicityListResultsResponseSchema,
} from './types';

// The toxicity list surface is served from `v1`, not the `v1.1` used by the
// email, domain and credits endpoints.
// https://docs.usebouncer.com/api-reference/toxicity/toxicity-create
//
// As elsewhere, every handler parses the registered output schema before
// returning, so a drifting provider response fails loudly here.

export const createToxicityListJob: BouncerEndpoints['createToxicityListJob'] =
	async (ctx, input) => {
		const raw = await makeBouncerRequest<unknown>('v1/toxicity/list', ctx.key, {
			method: 'POST',
			// A bare array of address strings: objects are rejected here.
			body: input.emails,
		});
		const response = CreateToxicityListJobResponseSchema.parse(raw);

		await logEventFromContext(
			ctx,
			'bouncer.toxicity.createToxicityListJob',
			{ jobId: response.id, count: input.emails.length },
			'completed',
		);
		return response;
	};

export const checkToxicityListJobStatus: BouncerEndpoints['checkToxicityListJobStatus'] =
	async (ctx, input) => {
		const raw = await makeBouncerRequest<unknown>(
			`v1/toxicity/list/${encodeURIComponent(input.jobId)}`,
			ctx.key,
			{ method: 'GET' },
		);
		const response = CheckToxicityListJobStatusResponseSchema.parse(raw);

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
		const raw = await makeBouncerRequest<unknown>(
			`v1/toxicity/list/${encodeURIComponent(input.jobId)}/data`,
			ctx.key,
			{ method: 'GET' },
		);
		const response = GetToxicityListResultsResponseSchema.parse(raw);

		await logEventFromContext(
			ctx,
			'bouncer.toxicity.getToxicityListResults',
			{ jobId: input.jobId, count: response.length },
			'completed',
		);
		return response;
	};

export const deleteToxicityListJob: BouncerEndpoints['deleteToxicityListJob'] =
	async (ctx, input) => {
		// Bouncer answers 200 with an empty body, so there is nothing to decode.
		const raw = await makeBouncerRequest<unknown>(
			`v1/toxicity/list/${encodeURIComponent(input.jobId)}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		const response = DeleteToxicityListJobResponseSchema.parse(raw ?? {});

		await logEventFromContext(
			ctx,
			'bouncer.toxicity.deleteToxicityListJob',
			{ jobId: input.jobId },
			'completed',
		);
		return response;
	};
