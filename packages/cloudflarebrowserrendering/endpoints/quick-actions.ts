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

function accountPath(accountId: string, action: string): string {
	return `/accounts/${encodeURIComponent(accountId)}/browser-run/${action}`;
}

export const contentFetch: CloudflareBrowserRenderingEndpoints['contentFetch'] =
	async (ctx, input) => {
		const parsedInput =
			CloudflareBrowserRenderingEndpointInputSchemas.contentFetch.parse(input);
		const response = await makeCloudflareBrowserRenderingRequest(
			accountPath(parsedInput.accountId, 'content'),
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
			CloudflareBrowserRenderingEndpointOutputSchemas.contentFetch.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'cloudflarebrowserrendering.content.fetch',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};

export const markdownConvert: CloudflareBrowserRenderingEndpoints['markdownConvert'] =
	async (ctx, input) => {
		const parsedInput =
			CloudflareBrowserRenderingEndpointInputSchemas.markdownConvert.parse(
				input,
			);
		const response = await makeCloudflareBrowserRenderingRequest(
			accountPath(parsedInput.accountId, 'markdown'),
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
			CloudflareBrowserRenderingEndpointOutputSchemas.markdownConvert.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'cloudflarebrowserrendering.markdown.convert',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};

export const snapshotCapture: CloudflareBrowserRenderingEndpoints['snapshotCapture'] =
	async (ctx, input) => {
		const parsedInput =
			CloudflareBrowserRenderingEndpointInputSchemas.snapshotCapture.parse(
				input,
			);
		const response = await makeCloudflareBrowserRenderingRequest(
			accountPath(parsedInput.accountId, 'snapshot'),
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
			CloudflareBrowserRenderingEndpointOutputSchemas.snapshotCapture.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'cloudflarebrowserrendering.snapshot.capture',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};

export const accessibilityTreeCapture: CloudflareBrowserRenderingEndpoints['accessibilityTreeCapture'] =
	async (ctx, input) => {
		const parsedInput =
			CloudflareBrowserRenderingEndpointInputSchemas.accessibilityTreeCapture.parse(
				input,
			);
		const response = await makeCloudflareBrowserRenderingRequest(
			accountPath(parsedInput.accountId, 'accessibilityTree'),
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
			CloudflareBrowserRenderingEndpointOutputSchemas.accessibilityTreeCapture.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'cloudflarebrowserrendering.accessibilityTree.capture',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};

export const scrapeExtract: CloudflareBrowserRenderingEndpoints['scrapeExtract'] =
	async (ctx, input) => {
		const parsedInput =
			CloudflareBrowserRenderingEndpointInputSchemas.scrapeExtract.parse(input);
		const response = await makeCloudflareBrowserRenderingRequest(
			accountPath(parsedInput.accountId, 'scrape'),
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
			CloudflareBrowserRenderingEndpointOutputSchemas.scrapeExtract.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'cloudflarebrowserrendering.scrape.extract',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	};

export const jsonExtract: CloudflareBrowserRenderingEndpoints['jsonExtract'] =
	async (ctx, input) => {
		const parsedInput =
			CloudflareBrowserRenderingEndpointInputSchemas.jsonExtract.parse(input);
		const response = await makeCloudflareBrowserRenderingRequest(
			accountPath(parsedInput.accountId, 'json'),
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
			CloudflareBrowserRenderingEndpointOutputSchemas.jsonExtract.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'cloudflarebrowserrendering.json.extract',
			{ count: 1 },
			'completed',
		);
		return parsed;
	};

export const linksList: CloudflareBrowserRenderingEndpoints['linksList'] =
	async (ctx, input) => {
		const parsedInput =
			CloudflareBrowserRenderingEndpointInputSchemas.linksList.parse(input);
		const response = await makeCloudflareBrowserRenderingRequest(
			accountPath(parsedInput.accountId, 'links'),
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
			CloudflareBrowserRenderingEndpointOutputSchemas.linksList.parse(response);
		await logEventFromContext(
			ctx,
			'cloudflarebrowserrendering.links.list',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	};
