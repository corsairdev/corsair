import { logEventFromContext } from 'corsair/core';
import type { UnioneEndpoints } from '..';
import { makeUnioneRequest } from '../client';
import { maybeUpsert } from '../db';
import { defaultEventDumpStartTime } from './time';
import type { UnioneEndpointOutputs } from './types';

export const create: UnioneEndpoints['eventDump']['create'] = async (
	ctx,
	input,
) => {
	const response = await makeUnioneRequest<
		UnioneEndpointOutputs['eventDumpCreate']
	>('event-dump/create.json', ctx.key, { body: { ...input } });

	// `event-dump/create` returns only dump_id; the status is unknown until
	// event-dump/get reports it, so no status is recorded here.
	if (response.dump_id) {
		await maybeUpsert(ctx.db.eventDumps, response.dump_id, {
			dump_id: response.dump_id,
		});
	}
	await logEventFromContext(
		ctx,
		'unione.eventDump.create',
		{ ...input },
		'completed',
	);
	return response;
};

/**
 * UniOne has no "fetch this send job" method. Delivery history for a job_id is
 * reachable only by exporting the matching events, so this creates a filtered
 * dump and returns its dump_id for the caller to poll with `get`.
 */
export const createForJob: UnioneEndpoints['eventDump']['createForJob'] =
	async (ctx, input) => {
		const filter: Record<string, string> = { job_id: input.job_id };
		if (input.email) filter.email = input.email;
		if (input.status) filter.status = input.status;

		const response = await makeUnioneRequest<
			UnioneEndpointOutputs['eventDumpCreateForJob']
		>('event-dump/create.json', ctx.key, {
			body: {
				start_time:
					input.start_time ?? defaultEventDumpStartTime(input.end_time),
				end_time: input.end_time,
				filter,
			},
		});

		if (response.dump_id) {
			await maybeUpsert(ctx.db.eventDumps, response.dump_id, {
				dump_id: response.dump_id,
			});
		}
		await logEventFromContext(
			ctx,
			'unione.eventDump.createForJob',
			{ ...input },
			'completed',
		);
		return response;
	};

export const get: UnioneEndpoints['eventDump']['get'] = async (ctx, input) => {
	const response = await makeUnioneRequest<
		UnioneEndpointOutputs['eventDumpGet']
	>('event-dump/get.json', ctx.key, { body: { dump_id: input.dump_id } });

	const dump = response.event_dump;
	if (dump?.dump_id) {
		await maybeUpsert(ctx.db.eventDumps, dump.dump_id, {
			dump_id: dump.dump_id,
			dump_status: dump.dump_status,
		});
	}
	await logEventFromContext(
		ctx,
		'unione.eventDump.get',
		{ ...input },
		'completed',
	);
	return response;
};

export const list: UnioneEndpoints['eventDump']['list'] = async (ctx) => {
	const response = await makeUnioneRequest<
		UnioneEndpointOutputs['eventDumpList']
	>('event-dump/list.json', ctx.key, { body: {} });

	for (const dump of response.event_dumps ?? []) {
		await maybeUpsert(ctx.db.eventDumps, dump.dump_id, {
			dump_id: dump.dump_id,
			dump_status: dump.dump_status,
		});
	}
	await logEventFromContext(ctx, 'unione.eventDump.list', {}, 'completed');
	return response;
};

export const remove: UnioneEndpoints['eventDump']['delete'] = async (
	ctx,
	input,
) => {
	const response = await makeUnioneRequest<
		UnioneEndpointOutputs['eventDumpDelete']
	>('event-dump/delete.json', ctx.key, { body: { dump_id: input.dump_id } });

	await logEventFromContext(
		ctx,
		'unione.eventDump.delete',
		{ ...input },
		'completed',
	);
	return response;
};
