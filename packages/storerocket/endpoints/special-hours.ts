import type { StorerocketEndpoints } from '..';
import { call } from './call';
import {
	StorerocketEndpointInputSchemas as Inputs,
	StorerocketEndpointOutputSchemas as Outputs,
} from './types';

export const list: StorerocketEndpoints['specialHoursList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'specialHours.list',
			input: Inputs.specialHoursList,
			output: Outputs.specialHoursList,
		},
		input,
		({ projectId }) => ({
			method: 'GET',
			path: `/projects/${encodeURIComponent(projectId)}/special-hours`,
		}),
		{
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const get: StorerocketEndpoints['specialHoursGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'specialHours.get',
			input: Inputs.specialHoursGet,
			output: Outputs.specialHoursGet,
		},
		input,
		({ projectId, ruleId }) => ({
			method: 'GET',
			path: `/projects/${encodeURIComponent(projectId)}/special-hours/${encodeURIComponent(ruleId)}`,
		}),
		{
			log: (_, result) => ({ ruleId: result.data.id ?? undefined }),
		},
	);

export const create: StorerocketEndpoints['specialHoursCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'specialHours.create',
			input: Inputs.specialHoursCreate,
			output: Outputs.specialHoursCreate,
		},
		input,
		({ projectId, idempotencyKey, ...body }) => ({
			method: 'POST',
			path: `/projects/${encodeURIComponent(projectId)}/special-hours`,
			body,
			idempotencyKey,
		}),
		{
			log: (_, result) => ({ ruleId: result.data.id ?? undefined }),
		},
	);

export const update: StorerocketEndpoints['specialHoursUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'specialHours.update',
			input: Inputs.specialHoursUpdate,
			output: Outputs.specialHoursUpdate,
		},
		input,
		({ projectId, ruleId, idempotencyKey, ...body }) => ({
			method: 'PATCH',
			path: `/projects/${encodeURIComponent(projectId)}/special-hours/${encodeURIComponent(ruleId)}`,
			body,
			idempotencyKey,
		}),
		{
			log: (_, result) => ({ ruleId: result.data.id ?? undefined }),
		},
	);

// The documented delete answers 204 with no body, so the endpoint shapes
// that to an explicit contract instead of parsing an empty body.
export const remove: StorerocketEndpoints['specialHoursDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'specialHours.delete',
			input: Inputs.specialHoursDelete,
			output: Outputs.specialHoursDelete,
		},
		input,
		({ projectId, ruleId }) => ({
			method: 'DELETE',
			path: `/projects/${encodeURIComponent(projectId)}/special-hours/${encodeURIComponent(ruleId)}`,
		}),
		{
			shape: (_raw, parsed) => ({ id: parsed.ruleId, success: true }),
			log: () => ({ deleted: true }),
		},
	);
