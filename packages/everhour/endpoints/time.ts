import { makeEverhourRequest } from '../client';
import type { EverhourEndpoints } from '../index';
import type {
	EverhourTimeEntry,
	EverhourTimesheetApproval,
} from '../schema/database';

export const listUserTime: EverhourEndpoints['listUserTime'] = async (
	ctx,
	options,
) => {
	return makeEverhourRequest<EverhourTimeEntry[]>(
		`/users/${options.userId}/time`,
		ctx.key,
		{
			method: 'GET',
			query: options.query,
		},
	);
};

export const listUserTimesheets: EverhourEndpoints['listUserTimesheets'] =
	async (ctx, options) => {
		// Timesheet rows have no fixed provider shape; callers narrow fields before use.
		return makeEverhourRequest<Record<string, unknown>[]>(
			`/users/${options.userId}/timesheets`,
			ctx.key,
			{
				method: 'GET',
				query: options.query,
			},
		);
	};

export const logTime: EverhourEndpoints['logTime'] = async (ctx, options) => {
	return makeEverhourRequest<EverhourTimeEntry>('/time', ctx.key, {
		method: 'POST',
		body: options,
	});
};

export const updateTimeEntry: EverhourEndpoints['updateTimeEntry'] = async (
	ctx,
	options,
) => {
	const { timeId, ...body } = options;
	return makeEverhourRequest<EverhourTimeEntry>(`/time/${timeId}`, ctx.key, {
		method: 'PUT',
		body,
	});
};

export const deleteTimeEntry: EverhourEndpoints['deleteTimeEntry'] = async (
	ctx,
	options,
) => {
	return makeEverhourRequest<void>(`/time/${options.timeId}`, ctx.key, {
		method: 'DELETE',
	});
};

export const requestTimesheetApproval: EverhourEndpoints['requestTimesheetApproval'] =
	async (ctx, options) => {
		const { timesheetId, ...body } = options;
		return makeEverhourRequest<EverhourTimesheetApproval>(
			`/timesheets/${timesheetId}/approval`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);
	};

export const discardTimesheetApproval: EverhourEndpoints['discardTimesheetApproval'] =
	async (ctx, options) => {
		const { timesheetId, ...body } = options;
		return makeEverhourRequest<EverhourTimesheetApproval>(
			`/timesheets/${timesheetId}/discard-approval`,
			ctx.key,
			{
				method: 'PUT',
				body,
			},
		);
	};
