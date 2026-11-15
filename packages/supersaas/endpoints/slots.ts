import type { SupersaasEndpoints } from '..';
import { segment } from '../client';
import { call, created, deletion } from './shared';
import {
	SupersaasEndpointInputSchemas as Inputs,
	SupersaasEndpointOutputSchemas as Outputs,
} from './types';

export const list: SupersaasEndpoints['slotsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'slots.list',
			input: Inputs.slotsList,
			output: Outputs.slotsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/slots', query }),
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
		({ slot_id }) => ({ method: 'GET', path: `/slots/${segment(slot_id)}` }),
		{ log: ({ slot_id }) => ({ slotId: slot_id }) },
	);

/** Slots exist only on a capacity-type schedule. */
export const create: SupersaasEndpoints['slotsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'slots.create',
			input: Inputs.slotsCreate,
			output: Outputs.slotsCreate,
		},
		input,
		(slot) => ({ method: 'POST', path: '/slots', body: { slot } }),
		{
			shape: (raw, parsed) => created(raw, String(parsed.schedule_id)),
			log: (parsed) => ({
				scheduleId: parsed.schedule_id,
				start: parsed.start,
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
		({ slot_id, ...slot }) => ({
			method: 'PUT',
			path: `/slots/${segment(slot_id)}`,
			body: { slot },
		}),
		{ log: ({ slot_id }) => ({ slotId: slot_id }) },
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
		({ slot_id }) => ({
			method: 'DELETE',
			path: `/slots/${segment(slot_id)}`,
		}),
		{
			shape: (raw, { slot_id }) => deletion(raw, slot_id),
			log: ({ slot_id }) => ({ slotId: slot_id }),
		},
	);
