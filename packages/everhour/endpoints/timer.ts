import { makeEverhourRequest } from '../client';
import type { EverhourEndpoints } from '../index';

// Record intersection keeps undocumented timer fields; known fields stay typed.
export type TimerResponse = Record<string, unknown> & {
	id?: string;
	task_id?: string;
	start_time?: string;
	status?: 'active' | 'stopped';
	duration?: number;
	startedAt?: string;
	// The timer task payload varies by provider integration; narrow before use.
	task?: unknown;
};

export const getCurrentTimer: EverhourEndpoints['getCurrentTimer'] = async (
	ctx,
) => {
	return makeEverhourRequest<TimerResponse>('/timers/current', ctx.key);
};

export const startTimer: EverhourEndpoints['startTimer'] = async (
	ctx,
	options,
) => {
	return makeEverhourRequest<TimerResponse>('/timers', ctx.key, {
		method: 'POST',
		body: options,
	});
};

export const stopTimer: EverhourEndpoints['stopTimer'] = async (ctx) => {
	return makeEverhourRequest<TimerResponse>('/timers/current', ctx.key, {
		method: 'DELETE',
	});
};
