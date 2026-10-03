import { logEventFromContext } from 'corsair/core';
import { CuttlyAPIError, makeCuttlyRequest } from '../client';
import type { CuttlyEndpoints } from '../index';
import {
	CuttlyEndpointInputSchemas,
	CuttlyEndpointOutputSchemas,
} from './types';

const shortenErrors: Record<number, string> = {
	2: 'Cutt.ly rejected the destination URL',
	3: 'The requested Cutt.ly custom alias is already in use',
	4: 'Cutt.ly rejected the API key',
	5: 'Cutt.ly rejected the destination URL',
	6: 'Cutt.ly blocked the destination domain',
	8: 'Cutt.ly monthly link limit reached',
};

const updateErrors: Record<number, string> = {
	2: 'Cutt.ly could not save the link update',
	3: 'The Cutt.ly link does not exist or is not owned by this account',
	4: 'Cutt.ly rejected the destination URL',
};

function assertSuccessfulStatus(
	status: number,
	accepted: readonly number[],
	errors: Record<number, string>,
): void {
	if (accepted.includes(status)) return;
	throw new CuttlyAPIError(
		errors[status] ?? 'Cutt.ly API request failed',
		status,
	);
}

export const shorten: CuttlyEndpoints['shorten'] = async (ctx, rawInput) => {
	const input = CuttlyEndpointInputSchemas.shorten.parse(rawInput);
	const response = CuttlyEndpointOutputSchemas.shorten.parse(
		await makeCuttlyRequest(ctx.key, {
			short: input.url,
			name: input.alias,
			userDomain: input.useCustomDomain ? 1 : undefined,
			public: input.publicStats ? 1 : undefined,
			noTitle: input.noTitle ? 1 : undefined,
		}),
	);
	assertSuccessfulStatus(response.url.status, [1, 7], shortenErrors);
	await logEventFromContext(
		ctx,
		'cuttly.links.shorten',
		{ status: response.url.status, shortUrl: response.url.shortLink },
		'completed',
	);
	return response;
};

export const update: CuttlyEndpoints['update'] = async (ctx, rawInput) => {
	const input = CuttlyEndpointInputSchemas.update.parse(rawInput);
	const response = CuttlyEndpointOutputSchemas.update.parse(
		await makeCuttlyRequest(ctx.key, {
			edit: input.shortUrl,
			source: input.url,
			name: input.alias,
		}),
	);
	assertSuccessfulStatus(response.url.status, [1], updateErrors);
	await logEventFromContext(
		ctx,
		'cuttly.links.update',
		{ status: response.url.status, shortUrl: input.shortUrl },
		'completed',
	);
	return response;
};

export const analytics: CuttlyEndpoints['analytics'] = async (
	ctx,
	rawInput,
) => {
	const input = CuttlyEndpointInputSchemas.analytics.parse(rawInput);
	const response = CuttlyEndpointOutputSchemas.analytics.parse(
		await makeCuttlyRequest(ctx.key, {
			stats: input.shortUrl,
			date_from: input.dateFrom,
			date_to: input.dateTo,
		}),
	);
	assertSuccessfulStatus(response.stats.status, [1], {});
	await logEventFromContext(
		ctx,
		'cuttly.links.analytics',
		{ status: response.stats.status, shortUrl: input.shortUrl },
		'completed',
	);
	return response;
};
