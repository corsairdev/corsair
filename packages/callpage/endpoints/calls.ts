import { logEventFromContext } from 'corsair/core';
import { makeCallPageRequest } from '../client';
import type { CallPageEndpoints } from '../index';
import { saveCalls } from './persist';
import type { CallPageEndpointOutputs } from './types';
import {
	CallHistoryWireSchema,
	CallPageEndpointInputSchemas,
	CallRecordWireSchema,
} from './types';

export const get: CallPageEndpoints['callsGet'] = async (ctx, rawInput) => {
	const input = CallPageEndpointInputSchemas.callsGet.parse(rawInput);
	const result = await makeCallPageRequest<CallPageEndpointOutputs['callsGet']>(
		`/api/v3/external/calls/${input.callId}`,
		ctx.key,
		{ schema: CallRecordWireSchema },
	);
	await saveCalls(ctx, [result]);
	await logEventFromContext(ctx, 'callpage.calls.get', input, 'completed');
	return result;
};

export const history: CallPageEndpoints['callsHistory'] = async (
	ctx,
	rawInput,
) => {
	const input = CallPageEndpointInputSchemas.callsHistory.parse(rawInput);
	const result = await makeCallPageRequest<
		CallPageEndpointOutputs['callsHistory']
	>('/api/v3/external/calls/history', ctx.key, {
		query: input,
		schema: CallHistoryWireSchema,
	});
	await saveCalls(ctx, result);
	await logEventFromContext(ctx, 'callpage.calls.history', input, 'completed');
	return result;
};
