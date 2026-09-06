import { makeEverhourRequest } from '../client';
import type { EverhourTimeEntry } from '../schema/database';

export const listUserTime = async (
	apiKey: string,
	options: { userId: string; query?: Record<string, any> },
) => {
	return makeEverhourRequest<EverhourTimeEntry[]>(
		`/users/${options.userId}/time`,
		apiKey,
		{
			method: 'GET',
			query: options.query,
		},
	);
};

export const listUserTimesheets = async (
	apiKey: string,
	options: { userId: string; query?: Record<string, any> },
) => {
	return makeEverhourRequest<any[]>(
		`/users/${options.userId}/timesheets`,
		apiKey,
		{
			method: 'GET',
			query: options.query,
		},
	);
};

export const logTime = async (
	apiKey: string,
	options: {
		time: number;
		date?: string;
		task?: string;
		user?: number;
		comment?: string;
	},
) => {
	return makeEverhourRequest<EverhourTimeEntry>('/time', apiKey, {
		method: 'POST',
		body: options,
	});
};

export const updateTimeEntry = async (
	apiKey: string,
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
		apiKey,
		{
			method: 'PUT',
			body: options,
		},
	);
};

export const deleteTimeEntry = async (
	apiKey: string,
	options: { timeId: string },
) => {
	return makeEverhourRequest<void>(`/time/${options.timeId}`, apiKey, {
		method: 'DELETE',
	});
};
