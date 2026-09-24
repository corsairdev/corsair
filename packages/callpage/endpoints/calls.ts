import { logEventFromContext } from 'corsair/core';
import { makeCallPageRequest } from '../client';
import type { CallPageEndpoints } from '../index';
import type { CallPageEndpointOutputs } from './types';

export const get: CallPageEndpoints['callsGet'] = async (ctx, input) => {
  const result = await makeCallPageRequest<CallPageEndpointOutputs['callsGet']>(`/api/v3/external/calls/${input.callId}`, ctx.key);
  await logEventFromContext(ctx, 'callpage.calls.get', input, 'completed');
  return result;
};

export const history: CallPageEndpoints['callsHistory'] = async (ctx, input) => {
  const result = await makeCallPageRequest<CallPageEndpointOutputs['callsHistory']>('/api/v3/external/calls/history', ctx.key, { query: input });
  await logEventFromContext(ctx, 'callpage.calls.history', input, 'completed');
  return result;
};
