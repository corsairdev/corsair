import type { CommCareEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	CommCareEndpointInputSchemas as Inputs,
	CommCareEndpointOutputSchemas as Outputs,
} from './types';

// v0.5 list helper: flatten the Tastypie next-page link. A missing
// `objects` array is left as-is so the output schema rejects a malformed
// body.
function listWithMeta(raw: unknown): unknown {
	const record = raw as {
		objects?: unknown;
		meta?: { next?: string } | null;
		nextPageUrl?: string;
	} | null;
	if (!record || typeof record !== 'object') return raw;
	return {
		...record,
		nextPageUrl: record.meta?.next ?? undefined,
	};
}

export const list: CommCareEndpoints['groupsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'groups.list',
			input: Inputs.groupsList,
			output: Outputs.groupsList,
		},
		input,
		(domain) => ({
			method: 'GET',
			path: `/a/${segment(domain)}/api/group/v1/`,
			replaySafe: true,
		}),
		{
			shape: listWithMeta,
			log: (_, result) => ({
				count: result.objects.length,
				totalCount: result.meta?.total_count ?? undefined,
			}),
		},
	);

export const get: CommCareEndpoints['groupsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'groups.get',
			input: Inputs.groupsGet,
			output: Outputs.groupsGet,
		},
		input,
		(domain, { groupId }) => ({
			method: 'GET',
			path: `/a/${segment(domain)}/api/group/v1/${segment(groupId)}/`,
			replaySafe: true,
		}),
	);

export const create: CommCareEndpoints['groupsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'groups.create',
			input: Inputs.groupsCreate,
			output: Outputs.groupsCreate,
		},
		input,
		(domain, { name, reporting, users }) => ({
			method: 'POST',
			path: `/a/${segment(domain)}/api/group/v1/`,
			body: {
				name,
				...(reporting !== undefined ? { reporting } : {}),
				...(users !== undefined ? { users } : {}),
			},
		}),
		{
			log: (parsed) => ({ name: parsed.name }),
		},
	);

export const update: CommCareEndpoints['groupsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'groups.update',
			input: Inputs.groupsUpdate,
			output: Outputs.groupsUpdate,
		},
		input,
		(domain, { groupId, name, reporting, users }) => ({
			method: 'PUT',
			path: `/a/${segment(domain)}/api/group/v1/${segment(groupId)}/`,
			body: {
				...(name !== undefined ? { name } : {}),
				...(reporting !== undefined ? { reporting } : {}),
				...(users !== undefined ? { users } : {}),
			},
		}),
		{
			log: ({ groupId }) => ({ groupId }),
		},
	);
