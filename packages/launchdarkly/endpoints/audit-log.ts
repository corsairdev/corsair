import { logEventFromContext } from 'corsair/core';
import { makeLaunchDarklyRequest } from '../client';
import type { LaunchDarklyEndpoints } from '../index';
import {
	LaunchDarklyEndpointInputSchemas,
	LaunchDarklyEndpointOutputSchemas,
} from './types';

export const list: LaunchDarklyEndpoints['auditLogList'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		LaunchDarklyEndpointInputSchemas.auditLogList.parse(input);
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(
		'/api/v2/auditlog',
		ctx.key,
		{
			method: 'GET',
			query: {
				before: parsedInput.before,
				after: parsedInput.after,
				limit: parsedInput.limit,
				q: parsedInput.q,
				spec: parsedInput.spec,
				member: parsedInput.member,
				token: parsedInput.token,
			},
		},
	);
	const parsed = LaunchDarklyEndpointOutputSchemas.auditLogList.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.auditLog.list',
		{ count: parsed.items.length },
		'completed',
	);
	return parsed;
};

export const get: LaunchDarklyEndpoints['auditLogGet'] = async (ctx, input) => {
	const parsedInput = LaunchDarklyEndpointInputSchemas.auditLogGet.parse(input);
	const path = `/api/v2/auditlog/${encodeURIComponent(parsedInput.id)}`;
	// `unknown` because response is untrusted JSON narrowed by Zod schema parse.
	const response: unknown = await makeLaunchDarklyRequest(path, ctx.key, {
		method: 'GET',
	});
	const parsed = LaunchDarklyEndpointOutputSchemas.auditLogGet.parse(response);
	await logEventFromContext(
		ctx,
		'launchdarkly.auditLog.get',
		{ id: parsed._id },
		'completed',
	);
	return parsed;
};

export const AuditLog = {
	list,
	get,
};
