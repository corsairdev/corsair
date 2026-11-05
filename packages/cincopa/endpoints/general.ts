import { logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import { CINCOPA_API_BASE, makeCincopaRequest } from '../client';
import type { CincopaContext } from '../index';
import {
	CincopaEndpointInputSchemas,
	CincopaEndpointOutputSchemas,
} from './types';

function parseRetryAfterMs(response: Response): number | undefined {
	const value = response.headers.get('Retry-After');
	if (!value) return undefined;

	const seconds = Number(value);
	if (Number.isFinite(seconds) && seconds >= 0) {
		return seconds * 1000;
	}

	const date = Date.parse(value);
	if (Number.isNaN(date)) return undefined;
	return Math.max(0, date - Date.now());
}

function buildUploadIframeUrl(params: {
	fid?: string;
	rrid?: string;
	apiToken?: string;
}): URL {
	const url = new URL('upload.iframe', CINCOPA_API_BASE);
	if (params.apiToken) url.searchParams.set('api_token', params.apiToken);
	if (params.fid) url.searchParams.set('fid', params.fid);
	if (params.rrid) url.searchParams.set('rrid', params.rrid);
	return url;
}

export const ping = async (
	ctx: CincopaContext & { key: string },
	// unknown: endpoint inputs are validated by Zod before the provider call.
	input: unknown,
) => {
	CincopaEndpointInputSchemas.ping.parse(input ?? {});

	// unknown: provider JSON is validated by the output Zod schema below.
	const raw = await makeCincopaRequest<unknown>('ping.json', ctx.key, {
		method: 'GET',
	});

	const response = CincopaEndpointOutputSchemas.ping.parse(raw);

	await logEventFromContext(ctx, 'cincopa.ping', {}, 'completed');
	return response;
};

export const getUploadIframe = async (
	ctx: CincopaContext & { key: string },
	// unknown: endpoint inputs are validated by Zod before the provider call.
	input: unknown,
) => {
	const parsed = CincopaEndpointInputSchemas.getUploadIframe.parse(input ?? {});

	// Authenticated fetch URL stays server-side; callers never receive the token.
	const requestUrl = buildUploadIframeUrl({
		fid: parsed.fid,
		rrid: parsed.rrid,
		apiToken: ctx.key,
	});
	const publicUrl = buildUploadIframeUrl({
		fid: parsed.fid,
		rrid: parsed.rrid,
	});

	const res = await fetch(requestUrl);
	const html = await res.text();
	if (!res.ok) {
		const retryAfter = parseRetryAfterMs(res);
		throw new ApiError(
			{ method: 'GET', url: publicUrl.toString() },
			{
				url: publicUrl.toString(),
				ok: false,
				status: res.status,
				statusText: res.statusText,
				body: html,
			},
			`Cincopa iframe request failed with status ${res.status}`,
			retryAfter !== undefined ? { retryAfter } : undefined,
		);
	}

	const safeHtml = ctx.key ? html.split(ctx.key).join('[REDACTED]') : html;

	const response = CincopaEndpointOutputSchemas.getUploadIframe.parse({
		url: publicUrl.toString(),
		html: safeHtml,
	});

	await logEventFromContext(
		ctx,
		'cincopa.upload.getIframe',
		{ ...parsed },
		'completed',
	);
	return response;
};
