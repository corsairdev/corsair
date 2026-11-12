import { logEventFromContext } from 'corsair/core';
import type { CloudflareBrowserRenderingEndpoints } from '..';
import {
	getCloudflareBrowserRenderingRequestTimeoutOptions,
	makeCloudflareBrowserRenderingRequest,
} from '../client';
import {
	CloudflareBrowserRenderingEndpointInputSchemas,
	CloudflareBrowserRenderingEndpointOutputSchemas,
} from './types';

function crawlPath(accountId: string, jobId?: string): string {
	const basePath = `/accounts/${encodeURIComponent(accountId)}/browser-run/crawl`;
	return jobId === undefined
		? basePath
		: `${basePath}/${encodeURIComponent(jobId)}`;
}

export const crawlStart: CloudflareBrowserRenderingEndpoints['crawlStart'] =
	async (ctx, input) => {
		const parsedInput =
			CloudflareBrowserRenderingEndpointInputSchemas.crawlStart.parse(input);
		const response = await makeCloudflareBrowserRenderingRequest(
			crawlPath(parsedInput.accountId),
			ctx.key,
			{
				method: 'POST',
				body: parsedInput.body,
				...getCloudflareBrowserRenderingRequestTimeoutOptions(
					ctx.options.requestTimeoutMs,
				),
			},
		);
		const parsed =
			CloudflareBrowserRenderingEndpointOutputSchemas.crawlStart.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'cloudflarebrowserrendering.crawl.start',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};

export const crawlGet: CloudflareBrowserRenderingEndpoints['crawlGet'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		CloudflareBrowserRenderingEndpointInputSchemas.crawlGet.parse(input);
	const response = await makeCloudflareBrowserRenderingRequest(
		crawlPath(parsedInput.accountId, parsedInput.jobId),
		ctx.key,
		{
			method: 'GET',
			query: {
				cursor: parsedInput.cursor,
				limit: parsedInput.limit,
				status: parsedInput.status,
			},
			...getCloudflareBrowserRenderingRequestTimeoutOptions(
				ctx.options.requestTimeoutMs,
			),
		},
	);
	const parsed =
		CloudflareBrowserRenderingEndpointOutputSchemas.crawlGet.parse(response);
	await logEventFromContext(
		ctx,
		'cloudflarebrowserrendering.crawl.get',
		{ count: parsed.records.length },
		'completed',
	);
	return parsed;
};

export const crawlCancel: CloudflareBrowserRenderingEndpoints['crawlCancel'] =
	async (ctx, input) => {
		const parsedInput =
			CloudflareBrowserRenderingEndpointInputSchemas.crawlCancel.parse(input);
		const response = await makeCloudflareBrowserRenderingRequest(
			crawlPath(parsedInput.accountId, parsedInput.jobId),
			ctx.key,
			{
				method: 'DELETE',
				...getCloudflareBrowserRenderingRequestTimeoutOptions(
					ctx.options.requestTimeoutMs,
				),
			},
		);
		const parsed =
			CloudflareBrowserRenderingEndpointOutputSchemas.crawlCancel.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'cloudflarebrowserrendering.crawl.cancel',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};
