import { makeEverhourRequest } from '../client';
import type { EverhourTimecard } from '../schema/database';

export const clockIn = async (
	ctx: any,
	options: { userId: string; userDate?: string },
) => {
	const { userId, userDate } = options;
	return makeEverhourRequest<EverhourTimecard>(
		`/users/${userId}/timecards/clock-in`,
		ctx.key,
		{
			method: 'POST',
			body: { userDate },
		},
	);
};

export const clockOut = async (
	ctx: any,
	options: { userId: string; userDate?: string },
) => {
	const { userId, userDate } = options;
	return makeEverhourRequest<EverhourTimecard>(
		`/users/${userId}/timecards/clock-out`,
		ctx.key,
		{
			method: 'POST',
			body: { userDate },
		},
	);
};

export const getTimecard = async (
	ctx: any,
	options: { userId: string; date: string },
) => {
	return makeEverhourRequest<EverhourTimecard>(
		`/users/${options.userId}/timecards/${options.date}`,
		ctx.key,
	);
};

export const listTimecards = async (
	ctx: any,
	options: { from?: string; to?: string } = {},
) => {
	return makeEverhourRequest<EverhourTimecard[]>('/timecards', ctx.key, {
		method: 'GET',
		query: options,
	});
};

export const listUserTimecards = async (
	ctx: any,
	options: { userId: string; from?: string; to?: string },
) => {
	const { userId, from, to } = options;
	return makeEverhourRequest<EverhourTimecard[]>(
		`/users/${userId}/timecards`,
		ctx.key,
		{
			method: 'GET',
			query: { from, to },
		},
	);
};

export const updateTimecard = async (
	ctx: any,
	options: {
		userId: string;
		date: string;
		clockIn?: string;
		clockOut?: string;
		breakTime?: number;
	},
) => {
	const { userId, date, ...body } = options;
	return makeEverhourRequest<EverhourTimecard>(
		`/users/${userId}/timecards/${date}`,
		ctx.key,
		{
			method: 'PUT',
			body,
		},
	);
};

export const deleteTimecard = async (
	ctx: any,
	options: { userId: string; date: string },
) => {
	return makeEverhourRequest<void>(
		`/users/${options.userId}/timecards/${options.date}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
};
