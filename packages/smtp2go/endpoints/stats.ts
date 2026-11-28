import type { Smtp2goEndpoints } from '..';
import { pickBody } from '../client';
import { call } from './call';
import {
	Smtp2goEndpointInputSchemas as Inputs,
	Smtp2goEndpointOutputSchemas as Outputs,
} from './types';

// All six stats endpoints are reads over the last 30 days unless a date
// range is passed, so every request is replayable.

export const bounces: Smtp2goEndpoints['statsBounces'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stats.bounces',
			input: Inputs.statsBounces,
			output: Outputs.statsBounces,
		},
		input,
		(parsed) => ({
			path: '/stats/email_bounces',
			body: pickBody(parsed),
			replayable: true,
		}),
	);

export const cycle: Smtp2goEndpoints['statsCycle'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stats.cycle',
			input: Inputs.statsCycle,
			output: Outputs.statsCycle,
		},
		input,
		() => ({
			path: '/stats/email_cycle',
			body: {},
			replayable: true,
		}),
		{
			log: (_, result) => ({
				used: result.data.cycle_used ?? 0,
				remaining: result.data.cycle_remaining ?? 0,
			}),
		},
	);

export const spam: Smtp2goEndpoints['statsSpam'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stats.spam',
			input: Inputs.statsSpam,
			output: Outputs.statsSpam,
		},
		input,
		(parsed) => ({
			path: '/stats/email_spam',
			body: pickBody(parsed),
			replayable: true,
		}),
	);

export const unsubscribes: Smtp2goEndpoints['statsUnsubscribes'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'stats.unsubscribes',
			input: Inputs.statsUnsubscribes,
			output: Outputs.statsUnsubscribes,
		},
		input,
		(parsed) => ({
			path: '/stats/email_unsubs',
			body: pickBody(parsed),
			replayable: true,
		}),
	);

export const history: Smtp2goEndpoints['statsHistory'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stats.history',
			input: Inputs.statsHistory,
			output: Outputs.statsHistory,
		},
		input,
		(parsed) => ({
			path: '/stats/email_history',
			body: pickBody(parsed),
			replayable: true,
		}),
	);

export const summary: Smtp2goEndpoints['statsSummary'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'stats.summary',
			input: Inputs.statsSummary,
			output: Outputs.statsSummary,
		},
		input,
		(parsed) => ({
			path: '/stats/email_summary',
			body: pickBody(parsed),
			replayable: true,
		}),
	);
