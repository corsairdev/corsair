import { logEventFromContext } from 'corsair/core';
import type { HyperbrowserEndpoints } from '..';
import { makeHyperbrowserRequest } from '../client';
import type {
	CreateBatchScrapeJobOutput,
	CreateScrapeJobOutput,
	GetBatchScrapeJobOutput,
	GetBatchScrapeJobStatusOutput,
	GetScrapeJobOutput,
	GetScrapeJobStatusOutput,
} from './types';
import {
	CreateBatchScrapeJobInputSchema,
	CreateBatchScrapeJobOutputSchema,
	CreateScrapeJobInputSchema,
	CreateScrapeJobOutputSchema,
	GetBatchScrapeJobInputSchema,
	GetBatchScrapeJobOutputSchema,
	GetBatchScrapeJobStatusInputSchema,
	GetBatchScrapeJobStatusOutputSchema,
	GetScrapeJobInputSchema,
	GetScrapeJobOutputSchema,
	GetScrapeJobStatusInputSchema,
	GetScrapeJobStatusOutputSchema,
} from './types';

export const Scrape = {
	create: (async (ctx, input) => {
		const parsedInput = CreateScrapeJobInputSchema.parse(input);
		const response = await makeHyperbrowserRequest<CreateScrapeJobOutput>(
			'/api/scrape',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);
		const parsed = CreateScrapeJobOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.scrape.create',
			{ jobId: parsed.jobId },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['scrape.create'],

	get: (async (ctx, input) => {
		const parsedInput = GetScrapeJobInputSchema.parse(input);
		const response = await makeHyperbrowserRequest<GetScrapeJobOutput>(
			`/api/scrape/${encodeURIComponent(parsedInput.id)}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed = GetScrapeJobOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.scrape.get',
			{ jobId: parsed.jobId, status: parsed.status },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['scrape.get'],

	getStatus: (async (ctx, input) => {
		const parsedInput = GetScrapeJobStatusInputSchema.parse(input);
		const response = await makeHyperbrowserRequest<GetScrapeJobStatusOutput>(
			`/api/scrape/${encodeURIComponent(parsedInput.id)}/status`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed = GetScrapeJobStatusOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.scrape.getStatus',
			{ jobId: parsedInput.id, status: parsed.status },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['scrape.getStatus'],

	createBatch: (async (ctx, input) => {
		const parsedInput = CreateBatchScrapeJobInputSchema.parse(input);
		const response = await makeHyperbrowserRequest<CreateBatchScrapeJobOutput>(
			'/api/scrape/batch',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);
		const parsed = CreateBatchScrapeJobOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.scrape.createBatch',
			{ jobId: parsed.jobId, urlCount: parsedInput.urls.length },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['scrape.createBatch'],

	getBatch: (async (ctx, input) => {
		const parsedInput = GetBatchScrapeJobInputSchema.parse(input);
		const response = await makeHyperbrowserRequest<GetBatchScrapeJobOutput>(
			`/api/scrape/batch/${encodeURIComponent(parsedInput.id)}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed = GetBatchScrapeJobOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.scrape.getBatch',
			{
				jobId: parsed.jobId,
				status: parsed.status,
				totalScrapedPages: parsed.totalScrapedPages,
			},
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['scrape.getBatch'],

	getBatchStatus: (async (ctx, input) => {
		const parsedInput = GetBatchScrapeJobStatusInputSchema.parse(input);
		const response =
			await makeHyperbrowserRequest<GetBatchScrapeJobStatusOutput>(
				`/api/scrape/batch/${encodeURIComponent(parsedInput.id)}/status`,
				ctx.key,
				{
					method: 'GET',
				},
			);
		const parsed = GetBatchScrapeJobStatusOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.scrape.getBatchStatus',
			{ jobId: parsedInput.id, status: parsed.status },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['scrape.getBatchStatus'],
};
