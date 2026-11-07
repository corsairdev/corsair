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

export const list: CommCareEndpoints['usersList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.list',
			input: Inputs.usersList,
			output: Outputs.usersList,
		},
		input,
		(domain, { limit, offset }) => ({
			method: 'GET',
			path: `/a/${segment(domain)}/api/user/v1/`,
			query: { limit, offset },
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

export const get: CommCareEndpoints['usersGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.get',
			input: Inputs.usersGet,
			output: Outputs.usersGet,
		},
		input,
		(domain, { userId }) => ({
			method: 'GET',
			path: `/a/${segment(domain)}/api/user/v1/${segment(userId)}`,
			replaySafe: true,
		}),
	);

export const create: CommCareEndpoints['usersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.create',
			input: Inputs.usersCreate,
			output: Outputs.usersCreate,
		},
		input,
		(
			domain,
			{
				workerUsername,
				password,
				firstName,
				lastName,
				email,
				phoneNumber,
				userData,
			},
		) => ({
			method: 'POST',
			path: `/a/${segment(domain)}/api/user/v1/`,
			body: {
				username: workerUsername,
				password,
				first_name: firstName,
				last_name: lastName,
				...(email !== undefined ? { email } : {}),
				...(phoneNumber !== undefined ? { phone_number: phoneNumber } : {}),
				...(userData !== undefined ? { user_data: userData } : {}),
			},
		}),
		{
			log: (parsed, result) => ({
				userId: result.id ?? undefined,
				username: parsed.workerUsername,
			}),
		},
	);

export const update: CommCareEndpoints['usersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.update',
			input: Inputs.usersUpdate,
			output: Outputs.usersUpdate,
		},
		input,
		(
			domain,
			{ userId, firstName, lastName, email, phoneNumber, userData },
		) => ({
			method: 'PUT',
			path: `/a/${segment(domain)}/api/user/v1/${segment(userId)}`,
			body: {
				...(firstName !== undefined ? { first_name: firstName } : {}),
				...(lastName !== undefined ? { last_name: lastName } : {}),
				...(email !== undefined ? { email } : {}),
				...(phoneNumber !== undefined ? { phone_number: phoneNumber } : {}),
				...(userData !== undefined ? { user_data: userData } : {}),
			},
		}),
		{
			log: ({ userId }) => ({ userId }),
		},
	);

export const remove: CommCareEndpoints['usersDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.delete',
			input: Inputs.usersDelete,
			output: Outputs.usersDelete,
		},
		input,
		(domain, { userId }) => ({
			method: 'DELETE',
			path: `/a/${segment(domain)}/api/user/v1/${segment(userId)}`,
		}),
		{
			// The deletion carries no body.
			shape: (raw) => raw ?? {},
			log: ({ userId }) => ({ userId }),
		},
	);

export const sendPasswordReset: CommCareEndpoints['usersSendPasswordReset'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'users.sendPasswordReset',
			input: Inputs.usersSendPasswordReset,
			output: Outputs.usersSendPasswordReset,
		},
		input,
		(domain, { userId }) => ({
			method: 'POST',
			path: `/a/${segment(domain)}/api/user/v1/${segment(userId)}/email_password_reset/`,
		}),
		{
			// The reset answers 202 with an empty body.
			shape: (raw) => raw ?? {},
			log: ({ userId }) => ({ userId }),
		},
	);
