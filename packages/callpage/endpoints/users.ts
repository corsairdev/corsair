import { logEventFromContext } from 'corsair/core';
import { makeCallPageRequest } from '../client';
import type { CallPageEndpoints } from '../index';
import type { CallPageEndpointOutputs } from './types';

export const list: CallPageEndpoints['usersList'] = async (ctx, input) => {
  const result = await makeCallPageRequest<CallPageEndpointOutputs['usersList']>('/api/v1/external/users/all', ctx.key, { query: input });
  await logEventFromContext(ctx, 'callpage.users.list', input, 'completed');
  return result;
};

export const get: CallPageEndpoints['usersGet'] = async (ctx, input) => {
  const result = await makeCallPageRequest<CallPageEndpointOutputs['usersGet']>('/api/v1/external/users/get', ctx.key, { query: input });
  await logEventFromContext(ctx, 'callpage.users.get', input, 'completed');
  return result;
};

export const create: CallPageEndpoints['usersCreate'] = async (ctx, input) => {
  const result = await makeCallPageRequest<CallPageEndpointOutputs['usersCreate']>('/api/v1/external/users/create', ctx.key, { method: 'POST', body: input });
  await logEventFromContext(ctx, 'callpage.users.create', input, 'completed');
  return result;
};

export const update: CallPageEndpoints['usersUpdate'] = async (ctx, input) => {
  const result = await makeCallPageRequest<CallPageEndpointOutputs['usersUpdate']>('/api/v1/external/users/update', ctx.key, { method: 'POST', body: input });
  await logEventFromContext(ctx, 'callpage.users.update', input, 'completed');
  return result;
};

export const remove: CallPageEndpoints['usersDelete'] = async (ctx, input) => {
  const result = await makeCallPageRequest<CallPageEndpointOutputs['usersDelete']>('/api/v1/external/users/delete', ctx.key, { method: 'POST', body: input });
  await logEventFromContext(ctx, 'callpage.users.delete', input, 'completed');
  return result;
};
