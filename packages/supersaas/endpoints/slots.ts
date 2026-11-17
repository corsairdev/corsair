import type { SupersaasEndpoints } from '..';
import { segment } from '../client';
import { call, created, deletion, updated } from './shared';
import {
	SupersaasEndpointInputSchemas as Inputs,
	SupersaasEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Slots exist only on a capacity-type schedule. Every route takes the schedule
 * as a top-level `schedule_id` query parameter, never inside `slot`.
 */
export const list: SupersaasEndpoints['slotsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'slots.list',
			input: Inputs.slotsList,
			output: Outputs.slotsList,
		},
		input,
		({ schedule_id, from, to, limit, offset }) => ({
			method: 'GET',
			path: '/slots',
			// The slot list names its window start and finish.
			query: { schedule_id, start: from, finish: to, limit, offset },
		}),
		{ log: (_, result) => ({ count: result.length }) },
	);

export const get: SupersaasEndpoints['slotsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'slots.get',
			input: Inputs.slotsGet,
			output: Outputs.slotsGet,
		},
		input,
		({ schedule_id, slot_id }) => ({
			method: 'GET',
			path: `/slots/${segment(slot_id)}`,
			query: { schedule_id },
		}),
		{ log: ({ slot_id }) => ({ slotId: slot_id }) },
	);

export const create: SupersaasEndpoints['slotsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'slots.create',
			input: Inputs.slotsCreate,
			output: Outputs.slotsCreate,
		},
		input,
		({ schedule_id, ...slot }) => ({
			method: 'POST',
			path: '/slots',
			query: { schedule_id },
			body: { slot },
			responseHeader: 'Location',
		}),
		{
			shape: (raw) => created(raw),
			log: (parsed, result) => ({
				scheduleId: parsed.schedule_id,
				slotId: result.id,
			}),
		},
	);

export const update: SupersaasEndpoints['slotsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'slots.update',
			input: Inputs.slotsUpdate,
			output: Outputs.slotsUpdate,
		},
		input,
		({ schedule_id, slot_id, ...slot }) => ({
			method: 'PUT',
			path: `/slots/${segment(slot_id)}`,
			query: { schedule_id },
			body: { slot },
		}),
		{
			shape: (raw, { slot_id }) => updated(raw, slot_id),
			log: ({ slot_id }) => ({ slotId: slot_id }),
		},
	);

export const remove: SupersaasEndpoints['slotsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'slots.delete',
			input: Inputs.slotsDelete,
			output: Outputs.slotsDelete,
		},
		input,
		({ schedule_id, slot_id }) => ({
			method: 'DELETE',
			path: `/slots/${segment(slot_id)}`,
			query: { schedule_id },
		}),
		{
			shape: (raw, { slot_id }) => deletion(raw, slot_id),
			log: ({ slot_id }) => ({ slotId: slot_id }),
		},
	);
