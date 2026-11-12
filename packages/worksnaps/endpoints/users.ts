import type { WorksnapsEndpoints } from '..';
import { segment } from '../client';
import { toXml } from '../xml';
import { call } from './call';
import {
	WorksnapsEndpointInputSchemas as Inputs,
	WorksnapsEndpointOutputSchemas as Outputs,
} from './types';

// unknown: the parsed document, before the output schema sees it.
function withoutApiToken(raw: unknown): unknown {
	if (!raw || typeof raw !== 'object' || !('user' in raw)) return raw;
	const user = raw.user;
	if (!user || typeof user !== 'object' || Array.isArray(user)) return raw;
	const { api_token: _token, ...rest } = user as Record<string, unknown>;
	return { ...raw, user: rest };
}

export const me: WorksnapsEndpoints['meGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'me.get', input: Inputs.meGet, output: Outputs.meGet },
		input,
		() => ({ method: 'GET', path: '/me.xml' }),
		{
			// /me.xml also returns the account's own api_token. It is the
			// credential this plugin already holds, so it is dropped rather than
			// handed to the caller.
			shape: (raw) => withoutApiToken(raw),
			log: (_, result) => ({
				id: result.user?.id ?? undefined,
				login: result.user?.login ?? undefined,
			}),
		},
	);

export const list: WorksnapsEndpoints['usersList'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'users.list', input: Inputs.usersList, output: Outputs.usersList },
		input,
		() => ({ method: 'GET', path: '/users.xml' }),
		{
			// Users are people, so only the count is logged.
			log: (_, result) => ({ count: result.users?.length ?? 0 }),
		},
	);

export const get: WorksnapsEndpoints['usersGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'users.get', input: Inputs.usersGet, output: Outputs.usersGet },
		input,
		({ user_id }) => ({
			method: 'GET',
			path: `/users/${segment(user_id)}.xml`,
		}),
		{
			log: (_, result) => ({
				id: result.user?.id ?? undefined,
				login: result.user?.login ?? undefined,
			}),
		},
	);

/**
 * Creates a user. The docs call this **privileged**: it needs the partner API
 * token rather than an ordinary user's, so a 403 here is the expected answer for
 * a normal key rather than a misconfiguration.
 */
export const create: WorksnapsEndpoints['usersCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.create',
			input: Inputs.usersCreate,
			output: Outputs.usersCreate,
		},
		input,
		({ login, email, first_name, last_name, password, timezone_id }) => ({
			method: 'POST',
			path: '/users.xml',
			body: toXml('user', {
				login,
				email,
				first_name,
				last_name,
				password,
				timezone_id,
			}),
		}),
		{
			// The password is in the request and must not reach the log.
			log: (parsed, result) => ({
				id: result.user?.id ?? undefined,
				login: parsed.login,
			}),
		},
	);

export const update: WorksnapsEndpoints['usersUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'users.update',
			input: Inputs.usersUpdate,
			output: Outputs.usersUpdate,
		},
		input,
		({ user_id, email, first_name, last_name, timezone_id }) => ({
			method: 'PUT',
			path: `/users/${segment(user_id)}.xml`,
			body: toXml('user', { email, first_name, last_name, timezone_id }),
		}),
		{
			log: (parsed, result) => ({
				id: result.user?.id ?? parsed.user_id,
				login: result.user?.login ?? undefined,
			}),
		},
	);

/** Time per user and task in one project, over at most 30 days. */
export const projectReport: WorksnapsEndpoints['projectReport'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'reports.project',
			input: Inputs.projectReport,
			output: Outputs.projectReport,
		},
		input,
		({ project_id, name, user_ids, from_timestamp, to_timestamp }) => ({
			method: 'GET',
			path: `/projects/${segment(project_id)}/reports`,
			query: {
				name: name ?? 'time_summary',
				user_ids: user_ids.join(';'),
				from_timestamp,
				to_timestamp,
			},
		}),
		{
			log: (parsed, result) => ({
				name: parsed.name ?? 'time_summary',
				count: (result.time_summary ?? result.time_entries ?? []).length,
			}),
		},
	);

/** Time across the projects you manage, by user, project, task and day. */
export const summaryReport: WorksnapsEndpoints['summaryReport'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'reports.summary',
			input: Inputs.summaryReport,
			output: Outputs.summaryReport,
		},
		input,
		({ from_date, to_date, timezone_offset, project_ids, user_ids }) => ({
			method: 'GET',
			path: '/summary_reports',
			// `name` is a constant the API requires; without it the call is a 403.
			query: {
				name: 'manager_report',
				from_date,
				to_date,
				timezone_offset,
				project_ids: project_ids?.join(';'),
				user_ids: user_ids?.join(';'),
			},
		}),
		{
			log: (_, result) => ({ count: result.manager_report.length }),
		},
	);
