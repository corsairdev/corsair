import type { HypeAuditorEndpoints } from '..';
import { call } from './call';
import {
	featuresQuery,
	HypeAuditorEndpointInputSchemas as Inputs,
	HypeAuditorEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Every report read is marked not replayable, even though it is a GET: the
 * first request for a report charges a credit, and the docs say the credit is
 * taken at the moment of the request, before the report exists. A retry after
 * a dropped connection could therefore charge twice.
 *
 * The second request for the same creator is free, which is why the caller is
 * given `retry_after_seconds` on a pending answer instead of the plugin
 * polling: polling here would hide a credit decision inside a read.
 */
const NOT_REPLAYABLE = { replayable: false } as const;

export const instagram: HypeAuditorEndpoints['reportsInstagram'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'reports.instagram',
			input: Inputs['reports.instagram'],
			output: Outputs['reports.instagram'],
		},
		input,
		(parsed) => ({
			// The two identifiers are separate documented actions, so the action
			// follows which one the caller sent.
			action: parsed.user_id ? 'auditor.reportByUserId/' : 'auditor.report/',
			query: {
				username: parsed.username,
				user_id: parsed.user_id,
				type: parsed.type,
				features: featuresQuery(parsed.features),
			},
			...NOT_REPLAYABLE,
		}),
		{ log: (parsed) => ({ type: parsed.type }) },
	);

export const youtube: HypeAuditorEndpoints['reportsYoutube'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'reports.youtube',
			input: Inputs['reports.youtube'],
			output: Outputs['reports.youtube'],
		},
		input,
		(parsed) => ({
			action: 'auditor.youtube/',
			query: {
				channel: parsed.channel,
				type: parsed.type,
				features: featuresQuery(parsed.features),
			},
			...NOT_REPLAYABLE,
		}),
		{ log: (parsed) => ({ type: parsed.type }) },
	);

export const tiktok: HypeAuditorEndpoints['reportsTiktok'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'reports.tiktok',
			input: Inputs['reports.tiktok'],
			output: Outputs['reports.tiktok'],
		},
		input,
		(parsed) => ({
			action: parsed.user_id ? 'auditor.tiktokByUserId/' : 'auditor.tiktok/',
			query: {
				channel: parsed.channel,
				user_id: parsed.user_id,
				type: parsed.type,
			},
			...NOT_REPLAYABLE,
		}),
		{ log: (parsed) => ({ type: parsed.type }) },
	);

/** Twitch, Twitter and Snapchat take only the channel, and no report type. */
function channelReport(
	action: string,
	event: 'reports.twitch' | 'reports.twitter' | 'reports.snapchat',
) {
	return (ctx: Parameters<typeof call>[0], input: { channel: string }) =>
		call(
			ctx,
			{
				event,
				input: Inputs[event],
				output: Outputs[event],
			},
			input,
			(parsed) => ({
				action,
				query: { channel: parsed.channel },
				...NOT_REPLAYABLE,
			}),
		);
}

export const twitch: HypeAuditorEndpoints['reportsTwitch'] = channelReport(
	'auditor.twitch/',
	'reports.twitch',
);
export const twitter: HypeAuditorEndpoints['reportsTwitter'] = channelReport(
	'auditor.twitter/',
	'reports.twitter',
);
export const snapchat: HypeAuditorEndpoints['reportsSnapchat'] = channelReport(
	'auditor.snapchat/',
	'reports.snapchat',
);
