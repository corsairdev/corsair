import type { Smtp2goEndpoints } from '..';
import { pickBody } from '../client';
import { call } from './call';
import {
	Smtp2goEndpointInputSchemas as Inputs,
	Smtp2goEndpointOutputSchemas as Outputs,
} from './types';

// NOTE: /email/status/{email_id} does not exist: live probes answer a
// plain-text 404 for both GET and POST. A sent email's status comes from
// searchSent (filter by email_id) or activity.search instead.

export const send: Smtp2goEndpoints['emailSend'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'email.send',
			input: Inputs.emailSend,
			output: Outputs.emailSend,
		},
		input,
		(parsed) => ({
			path: '/email/send',
			body: pickBody(parsed),
			replayable: false,
		}),
		{
			log: (parsed, result) => ({
				recipients: parsed.to.length,
				succeeded: result.data.succeeded ?? 0,
				failed: result.data.failed ?? 0,
			}),
		},
	);

export const sendMime: Smtp2goEndpoints['emailSendMime'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'email.sendMime',
			input: Inputs.emailSendMime,
			output: Outputs.emailSendMime,
		},
		input,
		(parsed) => ({
			path: '/email/mime',
			body: pickBody(parsed),
			replayable: false,
		}),
		{
			log: (_, result) => ({
				succeeded: result.data.succeeded ?? 0,
				failed: result.data.failed ?? 0,
			}),
		},
	);

export const sendBatch: Smtp2goEndpoints['emailSendBatch'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'email.sendBatch',
			input: Inputs.emailSendBatch,
			output: Outputs.emailSendBatch,
		},
		input,
		(parsed) => ({
			path: '/email/batch',
			body: pickBody(parsed),
			replayable: false,
		}),
		{
			log: (parsed) => ({ messages: parsed.emails.length }),
		},
	);

export const searchSent: Smtp2goEndpoints['emailSearchSent'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'email.searchSent',
			input: Inputs.emailSearchSent,
			output: Outputs.emailSearchSent,
		},
		input,
		(parsed) => ({
			path: '/email/search',
			body: pickBody(parsed),
			replayable: true,
		}),
		{
			log: (_, result) => ({ returned: result.data.emails.length }),
		},
	);

export const searchScheduled: Smtp2goEndpoints['emailSearchScheduled'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'email.searchScheduled',
			input: Inputs.emailSearchScheduled,
			output: Outputs.emailSearchScheduled,
		},
		input,
		(parsed) => ({
			path: '/email/scheduled/search',
			body: pickBody(parsed),
			replayable: true,
		}),
		{
			log: (_, result) => ({ returned: result.data.length }),
		},
	);

export const cancelScheduled: Smtp2goEndpoints['emailCancelScheduled'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'email.cancelScheduled',
			input: Inputs.emailCancelScheduled,
			output: Outputs.emailCancelScheduled,
		},
		input,
		(parsed) => ({
			path: '/email/scheduled/remove',
			body: pickBody(parsed),
			replayable: false,
		}),
		{
			log: (parsed) => ({ scheduleId: parsed.schedule_id }),
		},
	);
