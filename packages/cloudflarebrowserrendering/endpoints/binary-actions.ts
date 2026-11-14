import { logEventFromContext } from 'corsair/core';
import type { CloudflareBrowserRenderingEndpoints } from '..';
import {
	getCloudflareBrowserRenderingRequestTimeoutOptions,
	makeCloudflareBrowserRenderingBinaryRequest,
} from '../client';
import {
	CloudflareBrowserRenderingEndpointInputSchemas,
	CloudflareBrowserRenderingEndpointOutputSchemas,
} from './types';

function accountPath(accountId: string, action: string): string {
	return `/accounts/${encodeURIComponent(accountId)}/browser-run/${action}`;
}

export const screenshotCapture: CloudflareBrowserRenderingEndpoints['screenshotCapture'] =
	async (ctx, input) => {
		const parsedInput =
			CloudflareBrowserRenderingEndpointInputSchemas.screenshotCapture.parse(
				input,
			);
		const response = await makeCloudflareBrowserRenderingBinaryRequest(
			accountPath(parsedInput.accountId, 'screenshot'),
			ctx.key,
			parsedInput.body,
			{
				query: {
					browser: parsedInput.browser,
					cacheTTL: parsedInput.cacheTTL,
				},
				...getCloudflareBrowserRenderingRequestTimeoutOptions(
					ctx.options.requestTimeoutMs,
				),
			},
		);
		const parsed =
			CloudflareBrowserRenderingEndpointOutputSchemas.screenshotCapture.parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'cloudflarebrowserrendering.screenshot.capture',
			{ byteLength: parsed.byteLength },
			'completed',
		);
		return parsed;
	};

export const pdfRender: CloudflareBrowserRenderingEndpoints['pdfRender'] =
	async (ctx, input) => {
		const parsedInput =
			CloudflareBrowserRenderingEndpointInputSchemas.pdfRender.parse(input);
		const response = await makeCloudflareBrowserRenderingBinaryRequest(
			accountPath(parsedInput.accountId, 'pdf'),
			ctx.key,
			parsedInput.body,
			{
				query: {
					browser: parsedInput.browser,
					cacheTTL: parsedInput.cacheTTL,
				},
				...getCloudflareBrowserRenderingRequestTimeoutOptions(
					ctx.options.requestTimeoutMs,
				),
			},
		);
		const parsed =
			CloudflareBrowserRenderingEndpointOutputSchemas.pdfRender.parse(response);
		await logEventFromContext(
			ctx,
			'cloudflarebrowserrendering.pdf.render',
			{ byteLength: parsed.byteLength },
			'completed',
		);
		return parsed;
	};
