import { logEventFromContext } from 'corsair/core';
import { toFileOutput } from 'corsair/http';

// Matches core's DOWNLOAD_MAX_BYTES (async-core/public-download.ts), which corsair/http does not export.
const DOWNLOAD_MAX_BYTES = 25 * 1024 * 1024;

import { downloadSlackFile, makeSlackRequest, SlackAPIError } from '../client';
import type { SlackBoundEndpoints, SlackEndpoints } from '../index';
import type { SlackEndpointOutputs } from './types';
import { userKey } from './user-key';

export const get: SlackEndpoints['filesGet'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['filesGet']>(
		'files.info',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);

	if (result.ok && result.file && ctx.db.files) {
		try {
			await ctx.db.files.upsertByEntityId(result.file.id, {
				...result.file,
			});
		} catch (error) {
			console.warn('Failed to save file to database:', error);
		}
	}

	await logEventFromContext(ctx, 'slack.files.get', { ...input }, 'completed');
	return result;
};

export const list: SlackEndpoints['filesList'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['filesList']>(
		'files.list',
		ctx.key,
		{
			method: 'GET',
			query: input,
		},
	);

	if (result.ok && result.files && ctx.db.files) {
		try {
			for (const file of result.files) {
				if (file.id) {
					await ctx.db.files.upsertByEntityId(file.id, {
						...file,
					});
				}
			}
		} catch (error) {
			console.warn('Failed to save files to database:', error);
		}
	}

	await logEventFromContext(ctx, 'slack.files.list', { ...input }, 'completed');
	return result;
};

export const upload: SlackEndpoints['filesUpload'] = async (ctx, input) => {
	const result = await makeSlackRequest<SlackEndpointOutputs['filesUpload']>(
		'files.upload',
		ctx.key,
		{
			method: 'POST',
			body: input,
		},
	);

	if (result.ok && result.file) {
		const endpoints = ctx.endpoints as SlackBoundEndpoints;
		await endpoints.files.get({ file: result.file.id });
	}

	await logEventFromContext(
		ctx,
		'slack.files.upload',
		{ ...input },
		'completed',
	);
	return result;
};

// Slack: send the token only to a Slack file host; a remote file's url_private
// is app-supplied and can point anywhere.
// https://docs.slack.dev/reference/objects/file-object
function isSlackFileUrl(url: string): boolean {
	try {
		const { protocol, hostname } = new URL(url);
		return protocol === 'https:' && hostname === 'files.slack.com';
	} catch {
		return false;
	}
}

export const download: SlackEndpoints['filesDownload'] = async (ctx, input) => {
	const token = await userKey(ctx);
	const info = await makeSlackRequest<SlackEndpointOutputs['filesGet']>(
		'files.info',
		token,
		{ method: 'GET', query: { file: input.file } },
	);
	const file = info.file;
	const url = file?.url_private_download ?? file?.url_private;
	const external = file?.is_external === true || file?.mode === 'external';
	if (!file || !url || external || !isSlackFileUrl(url)) {
		throw new SlackAPIError(
			`File ${input.file} is not hosted by Slack or has no private download URL, so it cannot be downloaded.`,
			'file_not_downloadable',
		);
	}

	// request() buffers the whole body, so the size files.info reports is the only
	// guard before the allocation.
	if (typeof file.size === 'number' && file.size > DOWNLOAD_MAX_BYTES) {
		throw new SlackAPIError(
			`File ${input.file} is ${file.size} bytes, over the ${DOWNLOAD_MAX_BYTES}-byte download limit.`,
			'file_too_large',
		);
	}

	const { bytes, contentType } = await downloadSlackFile(url, token, {
		id: input.file,
		mimetype: file.mimetype,
	});

	await logEventFromContext(
		ctx,
		'slack.files.download',
		{ ...input },
		'completed',
	);
	return toFileOutput(bytes, contentType ?? file.mimetype, {
		...(file.name ? { filename: file.name } : {}),
	});
};
