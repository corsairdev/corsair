import type { UptimeRobotContext, UptimeRobotEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	UptimeRobotEndpointInputSchemas as Inputs,
	UptimeRobotEndpointOutputSchemas as Outputs,
} from './types';

export const list: UptimeRobotEndpoints['monitorsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'monitors.list',
			input: Inputs.monitorsList,
			output: Outputs.monitorsList,
		},
		input,
		({ limit, cursor, name, url, status, tags, groupId, customField }) => ({
			method: 'GET',
			path: '/monitors',
			query: {
				limit,
				cursor,
				name,
				url,
				// UptimeRobot takes one comma-separated value per filter, and
				// corsair/http would otherwise repeat the key.
				status: status?.join(','),
				tags: tags?.join(','),
				groupId,
				customField,
			},
		}),
		{
			log: (_, result) => ({
				count: result.data?.length ?? 0,
				hasMore: result.nextLink != null,
			}),
		},
	);

export const get: UptimeRobotEndpoints['monitorsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'monitors.get',
			input: Inputs.monitorsGet,
			output: Outputs.monitorsGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/monitors/${segment(id)}` }),
		{ log: (_, result) => ({ id: result.id ?? undefined }) },
	);

export const create: UptimeRobotEndpoints['monitorsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'monitors.create',
			input: Inputs.monitorsCreate,
			output: Outputs.monitorsCreate,
		},
		input,
		(parsed) => ({ method: 'POST', path: '/monitors', body: parsed }),
		{
			log: (parsed, result) => ({
				id: result.id ?? undefined,
				type: parsed.type,
			}),
		},
	);

export const update: UptimeRobotEndpoints['monitorsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'monitors.update',
			input: Inputs.monitorsUpdate,
			output: Outputs.monitorsUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PATCH',
			path: `/monitors/${segment(id)}`,
			body,
		}),
		{ log: (_, result) => ({ id: result.id ?? undefined }) },
	);

export const remove: UptimeRobotEndpoints['monitorsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'monitors.delete',
			input: Inputs.monitorsDelete,
			output: Outputs.monitorsDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/monitors/${segment(id)}` }),
		{
			// UptimeRobot answers 204 with no body.
			shape: (_, parsed) => ({ id: parsed.id, deleted: true }),
			log: ({ id }) => ({ id }),
		},
	);

/** Pause and start both answer the monitor as it now stands. */
function act(
	ctx: UptimeRobotContext,
	action: 'pause' | 'start',
	// unknown: raw caller input, parsed by call().
	input: unknown,
) {
	return call(
		ctx,
		{
			event: `monitors.${action}`,
			input: Inputs.monitorsPause,
			output: Outputs.monitorsPause,
		},
		input,
		({ id }) => ({
			method: 'POST',
			path: `/monitors/${segment(id)}/${action}`,
			// UptimeRobot requires a JSON content type on these actions, and the
			// transport only sets one when a body is present, so an empty object is
			// sent rather than nothing.
			body: {},
		}),
		{
			log: (_, result) => ({
				id: result.id ?? undefined,
				status: result.status ?? undefined,
			}),
		},
	);
}

export const pause: UptimeRobotEndpoints['monitorsPause'] = (ctx, input) =>
	act(ctx, 'pause', input);

export const start: UptimeRobotEndpoints['monitorsStart'] = (ctx, input) =>
	act(ctx, 'start', input);

export const reset: UptimeRobotEndpoints['monitorsReset'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'monitors.reset',
			input: Inputs.monitorsReset,
			output: Outputs.monitorsReset,
		},
		input,
		({ id }) => ({
			method: 'POST',
			path: `/monitors/${segment(id)}/reset`,
			// Same as pause and start: without a JSON content type UptimeRobot
			// answers 415, so an empty object is sent.
			body: {},
		}),
		{
			// UptimeRobot answers 201 with no body. Resetting discards the
			// monitor's history, so say so rather than returning an empty object.
			shape: (_, parsed) => ({ id: parsed.id, reset: true }),
			log: ({ id }) => ({ id }),
		},
	);
