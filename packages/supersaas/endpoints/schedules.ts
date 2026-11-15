import type { SupersaasContext, SupersaasEndpoints } from '..';
import { call } from './shared';
import {
	SupersaasEndpointInputSchemas as Inputs,
	SupersaasEndpointOutputSchemas as Outputs,
} from './types';

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
		({ schedule_id, from }) => ({
			method: 'GET',
			path: `/changes/${schedule_id}`,
			query: { from },
		}),
		{
			log: ({ schedule_id }, result) => ({
				scheduleId: schedule_id,
				count: result.length,
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
				count: result.length,
			}),
		},
	);

/**
 * One user's appointments. When no schedule is named, SuperSaaS needs the
 * account instead, which comes from the resolved credentials.
 */
export const agenda: SupersaasEndpoints['scheduleAgenda'] = (
	ctx: SupersaasContext,
	input,
) =>
	call(
		ctx,
		{
			event: 'schedule.agenda',
			input: Inputs.scheduleAgenda,
			output: Outputs.scheduleAgenda,
		},
		input,
		({ schedule_id, user, from }) => ({
			method: 'GET',
			path: schedule_id === undefined ? '/agenda' : `/agenda/${schedule_id}`,
			query: {
				user,
				from,
				// The account is only needed when the schedule is omitted, and it
				// comes from the credentials rather than from the caller.
				...(schedule_id === undefined
					? { account: ctx.options.accountName }
					: {}),
			},
		}),
		{
			log: ({ schedule_id, user }, result) => ({
				scheduleId: schedule_id,
				user,
				count: result.length,
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
		({ schedule_id, from }) => ({
			method: 'GET',
			path: `/free/${schedule_id}`,
			query: { from },
		}),
		{
			log: ({ schedule_id }, result) => ({
				scheduleId: schedule_id,
				count: result.length,
			}),
		},
	);
