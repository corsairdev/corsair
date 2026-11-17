import type { SupersaasEndpoints } from '..';
import { call } from './shared';
import type { SupersaasScheduleRead } from './types';
import {
	SupersaasEndpointInputSchemas as Inputs,
	SupersaasEndpointOutputSchemas as Outputs,
} from './types';

/** Rows in a schedule read, whichever envelope it came in. */
function countOf(result: SupersaasScheduleRead): number {
	return (result.bookings?.length ?? 0) + (result.slots?.length ?? 0);
}

/** Recent changes to a schedule, which is how a sync catches up. */
export const changes: SupersaasEndpoints['scheduleChanges'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'schedule.changes',
			input: Inputs.scheduleChanges,
			output: Outputs.scheduleChanges,
		},
		input,
		({ schedule_id, ...query }) => ({
			method: 'GET',
			path: `/changes/${schedule_id}`,
			query,
		}),
		{
			log: ({ schedule_id }, result) => ({
				scheduleId: schedule_id,
				count: countOf(result),
			}),
		},
	);

/** Appointments in a time window. */
export const range: SupersaasEndpoints['scheduleRange'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'schedule.range',
			input: Inputs.scheduleRange,
			output: Outputs.scheduleRange,
		},
		input,
		({ schedule_id, ...query }) => ({
			method: 'GET',
			path: `/range/${schedule_id}`,
			query,
		}),
		{
			log: ({ schedule_id }, result) => ({
				scheduleId: schedule_id,
				count: countOf(result),
			}),
		},
	);

/**
 * One user's appointments. When no schedule is named, SuperSaaS needs the
 * account instead, which comes from the resolved credentials.
 */
export const agenda: SupersaasEndpoints['scheduleAgenda'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'schedule.agenda',
			input: Inputs.scheduleAgenda,
			output: Outputs.scheduleAgenda,
		},
		input,
		({ schedule_id, user, from }, credentials) => ({
			method: 'GET',
			path: schedule_id === undefined ? '/agenda' : `/agenda/${schedule_id}`,
			query: {
				user,
				from,
				// The account is only needed when the schedule is omitted, and it
				// comes from the credentials rather than from the caller.
				...(schedule_id === undefined
					? { account: credentials.accountName }
					: {}),
			},
		}),
		{
			// The user is a login name, often an email, so it is not logged.
			log: ({ schedule_id }, result) => ({
				scheduleId: schedule_id,
				count: countOf(result),
			}),
		},
	);

/** Free spaces in a schedule, which is the availability read. */
export const free: SupersaasEndpoints['scheduleFree'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'schedule.free',
			input: Inputs.scheduleFree,
			output: Outputs.scheduleFree,
		},
		input,
		({ schedule_id, from, maxresults }) => ({
			method: 'GET',
			path: `/free/${schedule_id}`,
			query: { from, maxresults },
		}),
		{
			log: ({ schedule_id }, result) => ({
				scheduleId: schedule_id,
				count: countOf(result),
			}),
		},
	);
