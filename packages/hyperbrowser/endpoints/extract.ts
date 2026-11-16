import { logEventFromContext } from 'corsair/core';
import type { HyperbrowserEndpoints } from '..';
import { makeHyperbrowserRequest } from '../client';
import type {
	CreateExtractJobOutput,
	GetExtractJobOutput,
	GetExtractJobStatusOutput,
} from './types';
import {
	CreateExtractJobInputSchema,
	CreateExtractJobOutputSchema,
	GetExtractJobInputSchema,
	GetExtractJobOutputSchema,
	GetExtractJobStatusInputSchema,
	GetExtractJobStatusOutputSchema,
} from './types';

export const Extract = {
	create: (async (ctx, input) => {
		const parsedInput = CreateExtractJobInputSchema.parse(input);
		const response = await makeHyperbrowserRequest<CreateExtractJobOutput>(
			'/api/extract',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);
		const parsed = CreateExtractJobOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.extract.create',
			{ jobId: parsed.jobId, urlCount: parsedInput.urls.length },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['extract.create'],

	get: (async (ctx, input) => {
		const parsedInput = GetExtractJobInputSchema.parse(input);
		const response = await makeHyperbrowserRequest<GetExtractJobOutput>(
			`/api/extract/${encodeURIComponent(parsedInput.id)}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed = GetExtractJobOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.extract.get',
			{ jobId: parsed.jobId, status: parsed.status },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['extract.get'],

	getStatus: (async (ctx, input) => {
		const parsedInput = GetExtractJobStatusInputSchema.parse(input);
		const response = await makeHyperbrowserRequest<GetExtractJobStatusOutput>(
			`/api/extract/${encodeURIComponent(parsedInput.id)}/status`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed = GetExtractJobStatusOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.extract.getStatus',
			{ jobId: parsedInput.id, status: parsed.status },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['extract.getStatus'],
};
