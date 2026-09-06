import { makeEverhourRequest } from '../client';

export interface TimerResponse {
	id?: string;
	task_id?: string;
	start_time?: string;
	status?: 'active' | 'stopped';
	duration?: number;
	startedAt?: string;
	task?: any;
}

export const getCurrentTimer = async (ctx: any) => {
	return makeEverhourRequest<TimerResponse>('/timers/current', ctx.key);
};

export const startTimer = async (
	ctx: any,
	options: { task?: string; userDate?: string; comment?: string } = {},
) => {
	const endpoint = options.task
		? `/timers/start_for/${options.task}`
		: '/timers';
	return makeEverhourRequest<TimerResponse>(endpoint, ctx.key, {
		method: 'POST',
		body: options,
	});
};

export const stopTimer = async (ctx: any) => {
	return makeEverhourRequest<TimerResponse>('/timers/current', ctx.key, {
		method: 'DELETE',
	});
};
