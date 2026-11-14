import { logEventFromContext } from 'corsair/core';
import type { HyperbrowserEndpoints } from '..';
import { makeHyperbrowserRequest } from '../client';
import type {
	CreateCrawlJobOutput,
	CreateWebCrawlJobOutput,
	GetCrawlJobOutput,
	GetCrawlJobStatusOutput,
	GetWebCrawlJobOutput,
	GetWebCrawlJobStatusOutput,
} from './types';
import {
	CreateCrawlJobInputSchema,
	CreateCrawlJobOutputSchema,
	CreateWebCrawlJobInputSchema,
	CreateWebCrawlJobOutputSchema,
	GetCrawlJobInputSchema,
	GetCrawlJobOutputSchema,
	GetCrawlJobStatusInputSchema,
	GetCrawlJobStatusOutputSchema,
	GetWebCrawlJobInputSchema,
	GetWebCrawlJobOutputSchema,
	GetWebCrawlJobStatusInputSchema,
	GetWebCrawlJobStatusOutputSchema,
} from './types';

export const Crawl = {
	create: (async (ctx, input) => {
		const parsedInput = CreateCrawlJobInputSchema.parse(input);
		const response = await makeHyperbrowserRequest<CreateCrawlJobOutput>(
			'/api/crawl',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);
		const parsed = CreateCrawlJobOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.crawl.create',
			{ jobId: parsed.jobId },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['crawl.create'],

	get: (async (ctx, input) => {
		const parsedInput = GetCrawlJobInputSchema.parse(input);
		const query: Record<string, number | undefined> = {};
		if (parsedInput.page !== undefined) query.page = parsedInput.page;
		if (parsedInput.batchSize !== undefined)
			query.batchSize = parsedInput.batchSize;

		const response = await makeHyperbrowserRequest<GetCrawlJobOutput>(
			`/api/crawl/${encodeURIComponent(parsedInput.id)}`,
			ctx.key,
			{
				method: 'GET',
				query,
			},
		);
		const parsed = GetCrawlJobOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.crawl.get',
			{
				jobId: parsed.jobId,
				status: parsed.status,
				totalCrawledPages: parsed.totalCrawledPages,
			},
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['crawl.get'],

	getStatus: (async (ctx, input) => {
		const parsedInput = GetCrawlJobStatusInputSchema.parse(input);
		const response = await makeHyperbrowserRequest<GetCrawlJobStatusOutput>(
			`/api/crawl/${encodeURIComponent(parsedInput.id)}/status`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed = GetCrawlJobStatusOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.crawl.getStatus',
			{ jobId: parsedInput.id, status: parsed.status },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['crawl.getStatus'],

	createWeb: (async (ctx, input) => {
		const parsedInput = CreateWebCrawlJobInputSchema.parse(input);
		const response = await makeHyperbrowserRequest<CreateWebCrawlJobOutput>(
			'/api/web/crawl',
			ctx.key,
			{
				method: 'POST',
				body: parsedInput,
			},
		);
		const parsed = CreateWebCrawlJobOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.crawl.createWeb',
			{ jobId: parsed.jobId },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['crawl.createWeb'],

	getWeb: (async (ctx, input) => {
		const parsedInput = GetWebCrawlJobInputSchema.parse(input);
		const query: Record<string, number | undefined> = {};
		if (parsedInput.page !== undefined) query.page = parsedInput.page;
		if (parsedInput.batchSize !== undefined)
			query.batchSize = parsedInput.batchSize;

		const response = await makeHyperbrowserRequest<GetWebCrawlJobOutput>(
			`/api/web/crawl/${encodeURIComponent(parsedInput.id)}`,
			ctx.key,
			{
				method: 'GET',
				query,
			},
		);
		const parsed = GetWebCrawlJobOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.crawl.getWeb',
			{
				jobId: parsed.jobId,
				status: parsed.status,
				totalPages: parsed.totalPages,
			},
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['crawl.getWeb'],

	getWebStatus: (async (ctx, input) => {
		const parsedInput = GetWebCrawlJobStatusInputSchema.parse(input);
		const response = await makeHyperbrowserRequest<GetWebCrawlJobStatusOutput>(
			`/api/web/crawl/${encodeURIComponent(parsedInput.id)}/status`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed = GetWebCrawlJobStatusOutputSchema.parse(response);
		await logEventFromContext(
			ctx,
			'hyperbrowser.crawl.getWebStatus',
			{ jobId: parsedInput.id, status: parsed.status },
			'completed',
		);
		return parsed;
	}) as HyperbrowserEndpoints['crawl.getWebStatus'],
};
