import { logEventFromContext } from 'corsair/core';
import { CINCOPA_API_BASE, CincopaAPIError, makeCincopaRequest } from '../client';
import type { CincopaContext } from '../index';
import {
	CincopaEndpointInputSchemas,
	CincopaEndpointOutputSchemas,
} from './types';

export const ping = async (ctx: CincopaContext & { key: string }, input: unknown) => {
	CincopaEndpointInputSchemas.ping.parse(input ?? {});

	const raw = await makeCincopaRequest<unknown>('ping.json', ctx.key, {
		method: 'GET',
	});

	const response = CincopaEndpointOutputSchemas.ping.parse(raw);

	await logEventFromContext(ctx, 'cincopa.ping', {}, 'completed');
	return response;
};

export const getUploadIframe = async (
	ctx: CincopaContext & { key: string },
	input: unknown,
) => {
	const parsed = CincopaEndpointInputSchemas.getUploadIframe.parse(input ?? {});
	const url = new URL('upload.iframe', CINCOPA_API_BASE);
	url.searchParams.set('api_token', ctx.key);
	if (parsed.fid) url.searchParams.set('fid', parsed.fid);
	if (parsed.rrid) url.searchParams.set('rrid', parsed.rrid);

	const res = await fetch(url);
	const html = await res.text();
	if (!res.ok) {
		throw new CincopaAPIError(
			`Cincopa iframe request failed with status ${res.status}`,
			String(res.status),
		);
	}

	const response = CincopaEndpointOutputSchemas.getUploadIframe.parse({
		url: url.toString(),
		html,
	});

	await logEventFromContext(
		ctx,
		'cincopa.upload.getIframe',
		{ ...parsed },
		'completed',
	);
	return response;
};
