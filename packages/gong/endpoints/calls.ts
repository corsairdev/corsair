import { logEventFromContext } from 'corsair/core';
import type { GongContext, GongEndpoints } from '..';
import { gongRequest } from '../client';
import type { GongCallsOutputs } from './calls-types';
import type { GongFamilyContext } from './family-context';
import { gongCredentials } from './family-context';

function credentials(ctx: GongFamilyContext) {
	return gongCredentials(ctx);
}

function baseUrl(ctx: GongContext): string {
	const value = ctx.options.baseUrl;
	if (!value)
		throw new Error(
			'Gong baseUrl is required; use the workspace API URL from Gong',
		);
	const parsed = new URL(value);
	if (
		parsed.protocol !== 'https:' ||
		parsed.username ||
		parsed.password ||
		parsed.search ||
		parsed.hash
	) {
		throw new Error(
			'Gong baseUrl must be an HTTPS origin or API base path without credentials, query, or fragment',
		);
	}
	return parsed.toString().replace(/\/$/, '');
}

async function call<T>(
	ctx: GongContext,
	method: 'GET' | 'POST',
	path: string,
	input: Record<string, unknown>,
	query?: Record<string, unknown>,
	body?: unknown,
): Promise<T> {
	const result = await gongRequest<T>({
		baseUrl: baseUrl(ctx),
		credentials: credentials(ctx),
		method,
		path,
		query,
		body,
	});
	await logEventFromContext(
		ctx,
		`gong.calls.${path.replaceAll('/', '.')}`,
		{ input },
		'completed',
	);
	return result;
}

export const listCalls: GongEndpoints['callsListCalls'] = (ctx, input) =>
	call<GongCallsOutputs['listCalls']>(ctx, 'GET', '/v2/calls', input, input);
export const getCall: GongEndpoints['callsGetCall'] = (ctx, input) =>
	/^[0-9]{1,20}$/.test(input.id)
		? call<GongCallsOutputs['getCall']>(
				ctx,
				'GET',
				`/v2/calls/${encodeURIComponent(input.id)}`,
				input,
			)
		: Promise.reject(new Error('Unsafe Gong call id'));
export const listCallsExtensive: GongEndpoints['callsListCallsExtensive'] = (
	ctx,
	input,
) =>
	call<GongCallsOutputs['listCallsExtensive']>(
		ctx,
		'POST',
		'/v2/calls/extensive',
		input,
		undefined,
		input,
	);
export const getCallTranscripts: GongEndpoints['callsGetCallTranscripts'] = (
	ctx,
	input,
) =>
	call<GongCallsOutputs['getCallTranscripts']>(
		ctx,
		'POST',
		'/v2/calls/transcript',
		input,
		undefined,
		input,
	);
export const addCall: GongEndpoints['callsAddCall'] = (ctx, input) =>
	call<GongCallsOutputs['addCall']>(
		ctx,
		'POST',
		'/v2/calls',
		input,
		undefined,
		input,
	);
export const addCallRecording: GongEndpoints['callsAddCallRecording'] = async (
	ctx,
	input,
) => {
	const options = ctx.options;
	if (!options.baseUrl)
		throw new Error(
			'Gong baseUrl is required; use the workspace API URL from Gong',
		);
	if (!/^\d{1,20}$/.test(input.id))
		throw new Error('Gong call id must contain 1 to 20 digits');
	const result = await gongRequest<GongCallsOutputs['addCallRecording']>({
		baseUrl: options.baseUrl,
		credentials: gongCredentials(ctx),
		method: 'PUT',
		path: `/v2/calls/${encodeURIComponent(input.id)}/media`,
		formData: { mediaFile: input.mediaFile },
	});
	await logEventFromContext(
		ctx,
		'gong.calls.addCallRecording',
		{ id: input.id },
		'completed',
	);
	return result;
};
