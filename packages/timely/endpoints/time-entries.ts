import type { TimelyEndpoints } from '..';
import {
	bodyFields,
	idPath,
	joinIds,
	resolveTimelyAccountId,
	timelyCall,
} from './shared';
import {
	TimelyEndpointInputSchemas as In,
	TimelyEndpointOutputSchemas as Out,
} from './types';

// Timely calls time entries "hours" (documented paths) and wraps a single
// entry in `{ event: {...} }`.

export const list: TimelyEndpoints['timeEntriesList'] = async (ctx, input) => {
	const parsed = In.timeEntriesList.parse(input ?? {});
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.timeEntries.list',
		input: parsed,
		path: `/${accountId}/hours`,
		query: {
			since: parsed.since,
			upto: parsed.upto,
			day: parsed.day,
			project_id: parsed.project_id,
			user_id: parsed.user_id,
			hour_ids: joinIds(parsed.hour_ids),
			sort: parsed.sort,
			order: parsed.order,
			page: parsed.page,
			per_page: parsed.per_page,
		},
		output: Out.timeEntriesList,
	});
};

export const get: TimelyEndpoints['timeEntriesGet'] = async (ctx, input) => {
	const parsed = In.timeEntriesGet.parse(input);
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.timeEntries.get',
		input: parsed,
		path: `/${accountId}/hours/${idPath(parsed.id)}`,
		output: Out.timeEntriesGet,
	});
};

export const create: TimelyEndpoints['timeEntriesCreate'] = async (
	ctx,
	input,
) => {
	const parsed = In.timeEntriesCreate.parse(input);
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.timeEntries.create',
		input: parsed,
		path: `/${accountId}/hours`,
		method: 'POST',
		body: { event: bodyFields(parsed) },
		output: Out.timeEntriesCreate,
	});
};

export const update: TimelyEndpoints['timeEntriesUpdate'] = async (
	ctx,
	input,
) => {
	const parsed = In.timeEntriesUpdate.parse(input);
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.timeEntries.update',
		input: parsed,
		path: `/${accountId}/hours/${idPath(parsed.id)}`,
		method: 'PUT',
		body: { event: bodyFields(parsed) },
		output: Out.timeEntriesUpdate,
	});
};

export const remove: TimelyEndpoints['timeEntriesDelete'] = async (
	ctx,
	input,
) => {
	const parsed = In.timeEntriesDelete.parse(input);
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	const id = idPath(parsed.id);
	return timelyCall(ctx, {
		event: 'timely.timeEntries.delete',
		input: parsed,
		path: `/${accountId}/hours/${id}`,
		method: 'DELETE',
		output: Out.timeEntriesDelete,
		transform: () => ({ id, deleted: true }),
	});
};

export const bulk: TimelyEndpoints['timeEntriesBulk'] = async (ctx, input) => {
	const parsed = In.timeEntriesBulk.parse(input);
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	const body: Record<string, unknown> = {};
	if (parsed.create?.length) body.create = parsed.create;
	if (parsed.update?.length) body.update = parsed.update;
	if (parsed.delete?.length) body.delete = parsed.delete;
	return timelyCall(ctx, {
		event: 'timely.timeEntries.bulk',
		input: parsed,
		path: `/${accountId}/bulk/hours`,
		method: 'POST',
		body,
		output: Out.timeEntriesBulk,
	});
};

export const startTimer: TimelyEndpoints['timeEntriesStartTimer'] = async (
	ctx,
	input,
) => {
	const parsed = In.timeEntriesStartTimer.parse(input);
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.timeEntries.startTimer',
		input: parsed,
		path: `/${accountId}/hours/${idPath(parsed.id)}/start`,
		method: 'PUT',
		output: Out.timeEntriesStartTimer,
	});
};

export const stopTimer: TimelyEndpoints['timeEntriesStopTimer'] = async (
	ctx,
	input,
) => {
	const parsed = In.timeEntriesStopTimer.parse(input);
	const accountId = await resolveTimelyAccountId(ctx, parsed.accountId);
	return timelyCall(ctx, {
		event: 'timely.timeEntries.stopTimer',
		input: parsed,
		path: `/${accountId}/hours/${idPath(parsed.id)}/stop`,
		method: 'PUT',
		output: Out.timeEntriesStopTimer,
	});
};
