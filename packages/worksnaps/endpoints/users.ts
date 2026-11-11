import type { WorksnapsEndpoints } from '..';
import { segment } from '../client';
import { toXml } from '../xml';
import { call } from './call';
import {
	WorksnapsEndpointInputSchemas as Inputs,
	WorksnapsEndpointOutputSchemas as Outputs,
} from './types';

export const me: WorksnapsEndpoints['meGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'me.get', input: Inputs.meGet, output: Outputs.meGet },
		input,
		() => ({ method: 'GET', path: '/me.xml' }),
		{
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

/** Totals for one project over a period. */
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
		({ project_id, from_timestamp, to_timestamp }) => ({
			method: 'GET',
			path: `/projects/${segment(project_id)}/reports`,
			query: { from_timestamp, to_timestamp },
		}),
		{
			// The report shape is defined by the API and varies by period, so the
			// fields are reported rather than assumed.
			log: (_, result) => ({
				fields: Object.keys(result.report ?? {}).length,
			}),
		},
	);

/** Totals across every project. */
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
		({ from_timestamp, to_timestamp }) => ({
			method: 'GET',
			path: '/summary_reports',
			query: { from_timestamp, to_timestamp },
		}),
		{
			log: (_, result) => ({
				fields: Object.keys(result.summary_report ?? {}).length,
			}),
		},
	);
