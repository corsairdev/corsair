import type { HypeAuditorEndpoints } from '..';
import { call } from './call';
import {
	HypeAuditorEndpointInputSchemas as Inputs,
	HypeAuditorEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Media and history reads are free and change nothing, so they stay plain
 * reads and are safe to replay. They are the part of the API a caller can poll
 * against while a report is being built.
 */
export const instagramMedia: HypeAuditorEndpoints['mediaInstagram'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'media.instagram',
			input: Inputs['media.instagram'],
			output: Outputs['media.instagram'],
		},
		input,
		({ channel }) => ({
			action: 'auditor.reportMedia/',
			query: { username: channel },
		}),
	);

export const youtubeMedia: HypeAuditorEndpoints['mediaYoutube'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'media.youtube',
			input: Inputs['media.youtube'],
			output: Outputs['media.youtube'],
		},
		input,
		({ channel, page }) => ({
			action: 'auditor.youtubeMedia/',
			query: { channel, page },
		}),
	);

export const tiktokMedia: HypeAuditorEndpoints['mediaTiktok'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'media.tiktok',
			input: Inputs['media.tiktok'],
			output: Outputs['media.tiktok'],
		},
		input,
		({ channel }) => ({
			action: 'auditor.tiktokMedia/',
			query: { channelId: channel },
		}),
	);

export const instagramHistory: HypeAuditorEndpoints['historyInstagram'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'history.instagram',
			input: Inputs['history.instagram'],
			output: Outputs['history.instagram'],
		},
		input,
		({ channel }) => ({
			action: 'auditor.instagramHistory/',
			query: { username: channel },
		}),
	);

export const youtubeHistory: HypeAuditorEndpoints['historyYoutube'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'history.youtube',
			input: Inputs['history.youtube'],
			output: Outputs['history.youtube'],
		},
		input,
		({ channel }) => ({
			// The dotted form: the docs page names `auditor.youtubeHistory`, but
			// that action answers `405 code 3 Unknown method passed` live, while
			// `auditor.youtube.history` is accepted. Every other network answers
			// both spellings, so this one is the odd case.
			action: 'auditor.youtube.history/',
			query: { channel },
		}),
	);

export const tiktokHistory: HypeAuditorEndpoints['historyTiktok'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'history.tiktok',
			input: Inputs['history.tiktok'],
			output: Outputs['history.tiktok'],
		},
		input,
		({ channel }) => ({
			action: 'auditor.tiktokHistory/',
			query: { channel },
		}),
	);

export const twitchHistory: HypeAuditorEndpoints['historyTwitch'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'history.twitch',
			input: Inputs['history.twitch'],
			output: Outputs['history.twitch'],
		},
		input,
		({ channel }) => ({
			action: 'auditor.twitchHistory/',
			query: { channel },
		}),
	);

export const twitterHistory: HypeAuditorEndpoints['historyTwitter'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'history.twitter',
			input: Inputs['history.twitter'],
			output: Outputs['history.twitter'],
		},
		input,
		({ channel }) => ({
			action: 'auditor.twitterHistory/',
			query: { channel },
		}),
	);

export const youtubeMentions: HypeAuditorEndpoints['mentionsYoutube'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'mentions.youtube',
			input: Inputs['mentions.youtube'],
			output: Outputs['mentions.youtube'],
		},
		input,
		({ channel }) => ({
			action: 'auditor.youtubeBrandMentions/',
			query: { channel },
		}),
	);

export const tiktokMentions: HypeAuditorEndpoints['mentionsTiktok'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'mentions.tiktok',
			input: Inputs['mentions.tiktok'],
			output: Outputs['mentions.tiktok'],
		},
		input,
		({ channel }) => ({
			action: 'auditor.tiktokBrandMentions/',
			query: { channel },
		}),
	);
