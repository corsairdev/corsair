import type { MoceanEndpoints } from '..';
import { moceanForm } from '../client';
import { call } from './call';
import {
	MoceanEndpointInputSchemas as Inputs,
	MoceanEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Sends one SMS to up to 500 receivers. Marked destructive: it sends a
 * message and charges the account per destination.
 */
export const send: MoceanEndpoints['smsSend'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'sms.send',
			input: Inputs.smsSend,
			output: Outputs.smsSend,
		},
		input,
		(parsed) => ({
			family: 'sms',
			// Mocean answers a send with HTTP 202 and per-receiver results, so a
			// lost answer may still have been delivered and charged.
			replayable: false,
			method: 'POST',
			path: '/sms',
			body: moceanForm({
				'mocean-from': parsed.mocean_from,
				'mocean-to': parsed.mocean_to,
				'mocean-text': parsed.mocean_text,
				'mocean-udh': parsed.mocean_udh,
				'mocean-coding': parsed.mocean_coding,
				'mocean-dlr-mask': parsed.mocean_dlr_mask,
				'mocean-dlr-url': parsed.mocean_dlr_url,
				'mocean-schedule': parsed.mocean_schedule,
				'mocean-mclass': parsed.mocean_mclass,
				'mocean-alt-dcs': parsed.mocean_alt_dcs,
				'mocean-charset': parsed.mocean_charset,
				'mocean-validity': parsed.mocean_validity,
			}),
			mediaType: 'application/x-www-form-urlencoded',
		}),
		{
			log: (_, result) => ({
				receivers: result.messages.length,
				failed: result.messages.filter((message) => message.status !== 0)
					.length,
			}),
		},
	);

/** Reads one message's final status by its msgid. */
export const status: MoceanEndpoints['smsStatus'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'sms.status',
			input: Inputs.smsStatus,
			output: Outputs.smsStatus,
		},
		input,
		({ mocean_msgid }) => ({
			family: 'sms',
			replayable: true,
			method: 'GET',
			path: '/report/message',
			query: { 'mocean-msgid': mocean_msgid, 'mocean-resp-format': 'json' },
		}),
		{
			log: ({ mocean_msgid }) => ({ msgid: mocean_msgid }),
		},
	);
