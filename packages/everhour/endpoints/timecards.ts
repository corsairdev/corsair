import { makeEverhourRequest } from '../client';
import type { EverhourEndpoints } from '../index';
import type { EverhourTimecard } from '../schema/database';

export const clockIn: EverhourEndpoints['clockIn'] = async (ctx, options) => {
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

export const clockOut: EverhourEndpoints['clockOut'] = async (ctx, options) => {
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

export const getTimecard: EverhourEndpoints['getTimecard'] = async (
	ctx,
	options,
) => {
	return makeEverhourRequest<EverhourTimecard>(
		`/users/${options.userId}/timecards/${options.date}`,
		ctx.key,
	);
};

export const listTimecards: EverhourEndpoints['listTimecards'] = async (
	ctx,
	options = {},
) => {
	return makeEverhourRequest<EverhourTimecard[]>('/timecards', ctx.key, {
		method: 'GET',
		query: options,
	});
};

export const listUserTimecards: EverhourEndpoints['listUserTimecards'] = async (
	ctx,
	options,
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

export const updateTimecard: EverhourEndpoints['updateTimecard'] = async (
	ctx,
	options,
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

export const deleteTimecard: EverhourEndpoints['deleteTimecard'] = async (
	ctx,
	options,
) => {
	return makeEverhourRequest<void>(
		`/users/${options.userId}/timecards/${options.date}`,
		ctx.key,
		{
			method: 'DELETE',
		},
	);
};
