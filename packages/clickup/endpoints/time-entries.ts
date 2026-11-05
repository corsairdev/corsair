import { logEventFromContext } from 'corsair/core';
import { makeClickupRequest } from '../client';
import type { ClickupRequestContext } from './context';
import type {
	TimeEntriesCreateInput,
	TimeEntriesCreateResponse,
	TimeEntriesDeleteInput,
	TimeEntriesDeleteResponse,
	TimeEntriesGetInput,
	TimeEntriesGetResponse,
	TimeEntriesHistoryInput,
	TimeEntriesHistoryResponse,
	TimeEntriesRangeInput,
	TimeEntriesRangeResponse,
	TimeEntriesRunningInput,
	TimeEntriesRunningResponse,
	TimeEntriesStartInput,
	TimeEntriesStartResponse,
	TimeEntriesStopInput,
	TimeEntriesStopResponse,
	TimeEntriesUpdateInput,
	TimeEntriesUpdateResponse,
	TimeEntryTagsAddInput,
	TimeEntryTagsAddResponse,
	TimeEntryTagsGetAllInput,
	TimeEntryTagsGetAllResponse,
	TimeEntryTagsRemoveInput,
	TimeEntryTagsRemoveResponse,
	TimeEntryTagsUpdateInput,
	TimeEntryTagsUpdateResponse,
} from './types';

export async function range(
	ctx: ClickupRequestContext,
	input: TimeEntriesRangeInput,
): Promise<TimeEntriesRangeResponse> {
	const { team_id, ...query } = input;
	const response = await makeClickupRequest<TimeEntriesRangeResponse>(
		`team/${team_id}/time_entries`,
		ctx.key,
		{ method: 'GET', query },
	);

	await logEventFromContext(
		ctx,
		'clickup.timeEntries.range',
		{ team_id },
		'completed',
	);
	return response;
}

export async function get(
	ctx: ClickupRequestContext,
	input: TimeEntriesGetInput,
): Promise<TimeEntriesGetResponse> {
	const response = await makeClickupRequest<TimeEntriesGetResponse>(
		`team/${input.team_id}/time_entries/${input.timer_id}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.timeEntries.get',
		{ team_id: input.team_id },
		'completed',
	);
	return response;
}

export async function create(
	ctx: ClickupRequestContext,
	input: TimeEntriesCreateInput,
): Promise<TimeEntriesCreateResponse> {
	const { team_id, ...body } = input;
	const response = await makeClickupRequest<TimeEntriesCreateResponse>(
		`team/${team_id}/time_entries`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.timeEntries.create',
		{ team_id },
		'completed',
	);
	return response;
}

export async function update(
	ctx: ClickupRequestContext,
	input: TimeEntriesUpdateInput,
): Promise<TimeEntriesUpdateResponse> {
	const { team_id, timer_id, ...body } = input;
	const response = await makeClickupRequest<TimeEntriesUpdateResponse>(
		`team/${team_id}/time_entries/${timer_id}`,
		ctx.key,
		{ method: 'PUT', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.timeEntries.update',
		{ team_id },
		'completed',
	);
	return response;
}

export async function deleteFn(
	ctx: ClickupRequestContext,
	input: TimeEntriesDeleteInput,
): Promise<TimeEntriesDeleteResponse> {
	const response = await makeClickupRequest<TimeEntriesDeleteResponse>(
		`team/${input.team_id}/time_entries/${input.timer_id}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'clickup.timeEntries.delete',
		{ team_id: input.team_id },
		'completed',
	);
	return response;
}

export async function running(
	ctx: ClickupRequestContext,
	input: TimeEntriesRunningInput,
): Promise<TimeEntriesRunningResponse> {
	const response = await makeClickupRequest<TimeEntriesRunningResponse>(
		`team/${input.team_id}/time_entries/current`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.timeEntries.running',
		{ team_id: input.team_id },
		'completed',
	);
	return response;
}

export async function start(
	ctx: ClickupRequestContext,
	input: TimeEntriesStartInput,
): Promise<TimeEntriesStartResponse> {
	const { team_id, ...body } = input;
	const response = await makeClickupRequest<TimeEntriesStartResponse>(
		`team/${team_id}/time_entries/start`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.timeEntries.start',
		{ team_id },
		'completed',
	);
	return response;
}

export async function stop(
	ctx: ClickupRequestContext,
	input: TimeEntriesStopInput,
): Promise<TimeEntriesStopResponse> {
	const response = await makeClickupRequest<TimeEntriesStopResponse>(
		`team/${input.team_id}/time_entries/stop`,
		ctx.key,
		{ method: 'POST' },
	);

	await logEventFromContext(
		ctx,
		'clickup.timeEntries.stop',
		{ team_id: input.team_id },
		'completed',
	);
	return response;
}

export async function history(
	ctx: ClickupRequestContext,
	input: TimeEntriesHistoryInput,
): Promise<TimeEntriesHistoryResponse> {
	const response = await makeClickupRequest<TimeEntriesHistoryResponse>(
		`team/${input.team_id}/time_entries/${input.timer_id}/history`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.timeEntries.history',
		{ team_id: input.team_id },
		'completed',
	);
	return response;
}

export async function tagsGetAll(
	ctx: ClickupRequestContext,
	input: TimeEntryTagsGetAllInput,
): Promise<TimeEntryTagsGetAllResponse> {
	const response = await makeClickupRequest<TimeEntryTagsGetAllResponse>(
		`team/${input.team_id}/time_entries/tags`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'clickup.timeEntries.tagsGetAll',
		{ team_id: input.team_id },
		'completed',
	);
	return response;
}

export async function tagsAdd(
	ctx: ClickupRequestContext,
	input: TimeEntryTagsAddInput,
): Promise<TimeEntryTagsAddResponse> {
	const { team_id, ...body } = input;
	const response = await makeClickupRequest<TimeEntryTagsAddResponse>(
		`team/${team_id}/time_entries/tags`,
		ctx.key,
		{ method: 'POST', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.timeEntries.tagsAdd',
		{ team_id },
		'completed',
	);
	return response;
}

export async function tagsRemove(
	ctx: ClickupRequestContext,
	input: TimeEntryTagsRemoveInput,
): Promise<TimeEntryTagsRemoveResponse> {
	const { team_id, ...body } = input;
	const response = await makeClickupRequest<TimeEntryTagsRemoveResponse>(
		`team/${team_id}/time_entries/tags`,
		ctx.key,
		{ method: 'DELETE', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.timeEntries.tagsRemove',
		{ team_id },
		'completed',
	);
	return response;
}

export async function tagsUpdate(
	ctx: ClickupRequestContext,
	input: TimeEntryTagsUpdateInput,
): Promise<TimeEntryTagsUpdateResponse> {
	const { team_id, ...body } = input;
	const response = await makeClickupRequest<TimeEntryTagsUpdateResponse>(
		`team/${team_id}/time_entries/tags`,
		ctx.key,
		{ method: 'PUT', body },
	);

	await logEventFromContext(
		ctx,
		'clickup.timeEntries.tagsUpdate',
		{ team_id },
		'completed',
	);
	return response;
}
