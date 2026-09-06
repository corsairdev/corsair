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

export const getCurrentTimer = async (apiKey: string) => {
	return makeEverhourRequest<TimerResponse>('/timers/current', apiKey);
};

export const startTimer = async (
	apiKey: string,
	options: { task?: string; userDate?: string; comment?: string } = {},
) => {
	const endpoint = options.task
		? `/timers/start_for/${options.task}`
		: '/timers';
	return makeEverhourRequest<TimerResponse>(endpoint, apiKey, {
		method: 'POST',
		body: options,
	});
};

export const stopTimer = async (apiKey: string) => {
	return makeEverhourRequest<TimerResponse>('/timers/current', apiKey, {
		method: 'DELETE',
	});
};
