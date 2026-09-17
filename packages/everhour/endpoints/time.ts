import { makeEverhourRequest } from '../client';
import type {
	EverhourTimeEntry,
	EverhourTimesheetApproval,
} from '../schema/database';

export const listUserTime = async (
	ctx: any,
	options: { userId: string; query?: Record<string, any> },
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

export const listUserTimesheets = async (
	ctx: any,
	options: { userId: string; query?: Record<string, any> },
) => {
	return makeEverhourRequest<any[]>(
		`/users/${options.userId}/timesheets`,
		ctx.key,
		{
			method: 'GET',
			query: options.query,
		},
	);
};

export const logTime = async (
	ctx: any,
	options: {
		time: number;
		date?: string;
		task?: string;
		user?: number;
		comment?: string;
	},
) => {
	return makeEverhourRequest<EverhourTimeEntry>('/time', ctx.key, {
		method: 'POST',
		body: options,
	});
};

export const updateTimeEntry = async (
	ctx: any,
	options: {
		timeId: string;
		time: number;
		date?: string;
		task?: string;
		user?: number;
		comment?: string;
	},
) => {
	const { timeId, ...body } = options;
	return makeEverhourRequest<EverhourTimeEntry>(`/time/${timeId}`, ctx.key, {
		method: 'PUT',
		body,
	});
};

export const deleteTimeEntry = async (
	ctx: any,
	options: { timeId: string },
) => {
	return makeEverhourRequest<void>(`/time/${options.timeId}`, ctx.key, {
		method: 'DELETE',
	});
};

export const requestTimesheetApproval = async (
	ctx: any,
	options: {
		timesheetId: string;
		comment?: string;
		reviewer?: number;
		sendNotification?: boolean;
	},
) => {
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

export const discardTimesheetApproval = async (
	ctx: any,
	options: {
		timesheetId: string;
		comment?: string;
		reviewer?: number;
		sendNotification?: boolean;
	},
) => {
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
