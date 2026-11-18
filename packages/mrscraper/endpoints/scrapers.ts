import { logEventFromContext } from 'corsair/core';
import type { MrscraperEndpoints } from '..';
import { makeMrscraperRequest } from '../client';
import type { MrscraperEndpointOutputs } from './types';
import {
	MrscraperEndpointInputSchemas,
	MrscraperEndpointOutputSchemas,
} from './types';

// ── AI scrapers ─────────────────────────────────────────────────────────────

export const aiInit: MrscraperEndpoints['scrapersAiInit'] = async (
	ctx,
	input,
) => {
	const parsed = MrscraperEndpointInputSchemas.scrapersAiInit.parse(input);

	const response = await makeMrscraperRequest<
		MrscraperEndpointOutputs['scrapersAiInit']
	>('/scrapers-ai', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		MrscraperEndpointOutputSchemas.scrapersAiInit.parse(response);

	await logEventFromContext(ctx, 'mrscraper.scrapers.aiInit', {}, 'completed');

	return parsedResponse;
};

export const aiRerun: MrscraperEndpoints['scrapersAiRerun'] = async (
	ctx,
	input,
) => {
	const parsed = MrscraperEndpointInputSchemas.scrapersAiRerun.parse(input);

	const response = await makeMrscraperRequest<
		MrscraperEndpointOutputs['scrapersAiRerun']
	>('/scrapers-ai-rerun', ctx.key, {
		method: 'POST',
		headers: { Accept: 'application/json' },
		body: parsed,
	});

	const parsedResponse =
		MrscraperEndpointOutputSchemas.scrapersAiRerun.parse(response);

	await logEventFromContext(
		ctx,
		'mrscraper.scrapers.aiRerun',
		{ scraperId: parsed.scraperId },
		'completed',
	);

	return parsedResponse;
};

export const aiRerunBulk: MrscraperEndpoints['scrapersAiRerunBulk'] = async (
	ctx,
	input,
) => {
	const parsed = MrscraperEndpointInputSchemas.scrapersAiRerunBulk.parse(input);

	const response = await makeMrscraperRequest<
		MrscraperEndpointOutputs['scrapersAiRerunBulk']
	>('/scrapers-ai-rerun/bulk', ctx.key, { method: 'POST', body: parsed });

	const parsedResponse =
		MrscraperEndpointOutputSchemas.scrapersAiRerunBulk.parse(response);

	await logEventFromContext(
		ctx,
		'mrscraper.scrapers.aiRerunBulk',
		{ scraperId: parsed.scraperId, urlCount: parsed.urls.length },
		'completed',
	);

	return parsedResponse;
};

// ── Manual scrapers ─────────────────────────────────────────────────────────

export const manualRerun: MrscraperEndpoints['scrapersManualRerun'] = async (
	ctx,
	input,
) => {
	const parsed = MrscraperEndpointInputSchemas.scrapersManualRerun.parse(input);

	const response = await makeMrscraperRequest<
		MrscraperEndpointOutputs['scrapersManualRerun']
	>('/scrapers-manual-rerun', ctx.key, {
		method: 'POST',
		headers: { Accept: 'application/json' },
		body: parsed,
	});

	const parsedResponse =
		MrscraperEndpointOutputSchemas.scrapersManualRerun.parse(response);

	await logEventFromContext(
		ctx,
		'mrscraper.scrapers.manualRerun',
		{ scraperId: parsed.scraperId },
		'completed',
	);

	return parsedResponse;
};

export const manualRerunBulk: MrscraperEndpoints['scrapersManualRerunBulk'] =
	async (ctx, input) => {
		const parsed =
			MrscraperEndpointInputSchemas.scrapersManualRerunBulk.parse(input);

		const response = await makeMrscraperRequest<
			MrscraperEndpointOutputs['scrapersManualRerunBulk']
		>('/scrapers-manual-rerun/bulk', ctx.key, {
			method: 'POST',
			headers: { Accept: 'application/json' },
			body: parsed,
		});

		const parsedResponse =
			MrscraperEndpointOutputSchemas.scrapersManualRerunBulk.parse(response);

		await logEventFromContext(
			ctx,
			'mrscraper.scrapers.manualRerunBulk',
			{ scraperId: parsed.scraperId, urlCount: parsed.urls.length },
			'completed',
		);

		return parsedResponse;
	};

export const manualHeal: MrscraperEndpoints['scrapersManualHeal'] = async (
	ctx,
	input,
) => {
	const parsed = MrscraperEndpointInputSchemas.scrapersManualHeal.parse(input);

	const response = await makeMrscraperRequest<
		MrscraperEndpointOutputs['scrapersManualHeal']
	>(`/scrapers-manual/${encodeURIComponent(parsed.scraperId)}/heal`, ctx.key, {
		method: 'POST',
		headers: { Accept: 'application/json' },
	});

	const parsedResponse =
		MrscraperEndpointOutputSchemas.scrapersManualHeal.parse(response);

	await logEventFromContext(
		ctx,
		'mrscraper.scrapers.manualHeal',
		{ scraperId: parsed.scraperId },
		'completed',
	);

	return parsedResponse;
};

// ── Bulk cancel ─────────────────────────────────────────────────────────────

export const cancelBulkByScraper: MrscraperEndpoints['scrapersCancelBulkByScraper'] =
	async (ctx, input) => {
		const parsed =
			MrscraperEndpointInputSchemas.scrapersCancelBulkByScraper.parse(input);

		const response = await makeMrscraperRequest<
			MrscraperEndpointOutputs['scrapersCancelBulkByScraper']
		>(
			`/scrapers-bulks/${encodeURIComponent(parsed.scraperId)}/cancel`,
			ctx.key,
			{ method: 'PATCH' },
		);

		const parsedResponse =
			MrscraperEndpointOutputSchemas.scrapersCancelBulkByScraper.parse(
				response,
			);

		await logEventFromContext(
			ctx,
			'mrscraper.scrapers.cancelBulkByScraper',
			{ scraperId: parsed.scraperId },
			'completed',
		);

		return parsedResponse;
	};

export const cancelBulkByResult: MrscraperEndpoints['scrapersCancelBulkByResult'] =
	async (ctx, input) => {
		const parsed =
			MrscraperEndpointInputSchemas.scrapersCancelBulkByResult.parse(input);

		const response = await makeMrscraperRequest<
			MrscraperEndpointOutputs['scrapersCancelBulkByResult']
		>(
			`/scrapers-bulks/result/${encodeURIComponent(parsed.resultId)}/cancel`,
			ctx.key,
			{ method: 'PATCH' },
		);

		const parsedResponse =
			MrscraperEndpointOutputSchemas.scrapersCancelBulkByResult.parse(response);

		await logEventFromContext(
			ctx,
			'mrscraper.scrapers.cancelBulkByResult',
			{ resultId: parsed.resultId },
			'completed',
		);

		return parsedResponse;
	};
