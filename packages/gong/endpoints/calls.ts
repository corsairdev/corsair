import { logEventFromContext } from 'corsair/core';
import type { GongContext, GongEndpoints } from '..';
import type { GongOpaqueRecord, GongOpaqueValue } from '../client';
import { gongRequest } from '../client';
import type { GongCallsOutputs } from './calls-types';
import type { GongFamilyContext } from './family-context';
import { gongCredentials, gongEventPayload } from './family-context';

function credentials(ctx: GongFamilyContext) {
	return gongCredentials(ctx);
}

// Gong call filters and records are provider-defined; registered Zod schemas validate each public operation.
async function call<T>(
	ctx: GongContext,
	operation: string,
	method: 'GET' | 'POST',
	path: string,
	input: GongOpaqueRecord,
	query?: GongOpaqueRecord,
	body?: GongOpaqueValue,
): Promise<T> {
	const result = await gongRequest<T>({
		baseUrl: ctx.options.baseUrl,
		credentials: credentials(ctx),
		method,
		path,
		query,
		body,
	});
	await logEventFromContext(
		ctx,
		`gong.calls.${operation}`,
		gongEventPayload(input),
		'completed',
	);
	return result;
}

export const listCalls: GongEndpoints['callsListCalls'] = (ctx, input) =>
	call<GongCallsOutputs['listCalls']>(
		ctx,
		'listCalls',
		'GET',
		'/v2/calls',
		input,
		input,
	);
export const getCall: GongEndpoints['callsGetCall'] = (ctx, input) =>
	/^[0-9]{1,20}$/.test(input.id)
		? call<GongCallsOutputs['getCall']>(
				ctx,
				'getCall',
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
		'listCallsExtensive',
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
		'getCallTranscripts',
		'POST',
		'/v2/calls/transcript',
		input,
		undefined,
		input,
	);
export const addCall: GongEndpoints['callsAddCall'] = (ctx, input) =>
	call<GongCallsOutputs['addCall']>(
		ctx,
		'addCall',
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
