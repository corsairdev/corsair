import type { AgentyEndpoint } from './factory';
import { executeAgentyOperation, getRoute } from './factory';

const deleteScheduleRoute = getRoute('deleteSchedule');
export const deleteSchedule: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, deleteScheduleRoute);
};

const getScheduleRoute = getRoute('getSchedule');
export const getSchedule: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, getScheduleRoute);
};

const toggleScheduleRoute = getRoute('toggleSchedule');
export const toggleSchedule: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, toggleScheduleRoute);
};

const updateScheduleRoute = getRoute('updateSchedule');
export const updateSchedule: AgentyEndpoint = async (ctx, input = {}) => {
	return executeAgentyOperation(ctx, input, updateScheduleRoute);
};

export const SchedulerEndpoints = {
	deleteSchedule,
	getSchedule,
	toggleSchedule,
	updateSchedule,
} as const;
