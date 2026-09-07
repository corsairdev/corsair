import { makeEverhourRequest } from '../client';
import type { EverhourTimeEntry } from '../schema/database';

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
	return makeEverhourRequest<EverhourTimeEntry>(
		`/time/${options.timeId}`,
		ctx.key,
		{
			method: 'PUT',
			body: options,
		},
	);
};

export const deleteTimeEntry = async (
	ctx: any,
	options: { timeId: string },
) => {
	return makeEverhourRequest<void>(`/time/${options.timeId}`, ctx.key, {
		method: 'DELETE',
	});
};
