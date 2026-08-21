import { logEventFromContext } from 'corsair/core';
import type { UnioneEndpoints } from '..';
import { makeUnioneRequest } from '../client';
import { maybeUpsert } from '../db';
import type { UnioneEndpointOutputs } from './types';

export const create: UnioneEndpoints['eventDump']['create'] = async (
	ctx,
	input,
) => {
	const response = await makeUnioneRequest<
		UnioneEndpointOutputs['eventDumpCreate']
	>('event-dump/create.json', ctx.key, { body: { ...input } });

	await maybeUpsert(ctx.db.eventDumps, response.dump_id, {
		dump_id: response.dump_id ?? '',
		dump_status: 'queued',
	});
	await logEventFromContext(
		ctx,
		'unione.eventDump.create',
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
