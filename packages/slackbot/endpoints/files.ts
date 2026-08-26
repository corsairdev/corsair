import { logEventFromContext } from 'corsair/core';
import { makeSlackbotRequest, SlackbotAPIError } from '../client';
import type { SlackbotEndpoints } from '../index';
import type { SlackbotEndpointOutputs } from './types';

export const info: SlackbotEndpoints['filesInfo'] = async (ctx, input) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['filesInfo']
	>('files.info', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'slackbot.files.info',
		{ ...input },
		'completed',
	);
	return result;
};

export const list: SlackbotEndpoints['filesList'] = async (ctx, input) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['filesList']
	>('files.list', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'slackbot.files.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const remove: SlackbotEndpoints['filesDelete'] = async (ctx, input) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['filesDelete']
	>('files.delete', ctx.key, { method: 'POST', body: input });

	if (result.ok && ctx.db.files) {
		try {
			await ctx.db.files.deleteByEntityId(input.file);
		} catch (error) {
			console.warn('Failed to evict deleted file from cache:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slackbot.files.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const commentsDelete: SlackbotEndpoints['filesCommentsDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['filesCommentsDelete']
	>('files.comments.delete', ctx.key, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'slackbot.files.commentsDelete',
		{ ...input },
		'completed',
	);
	return result;
};

export const sharePublicUrl: SlackbotEndpoints['filesSharePublicUrl'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['filesSharePublicUrl']
	>('files.sharedPublicURL', ctx.key, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'slackbot.files.sharePublicUrl',
		{ ...input },
		'completed',
	);
	return result;
};

export const revokePublicUrl: SlackbotEndpoints['filesRevokePublicUrl'] =
	async (ctx, input) => {
		const result = await makeSlackbotRequest<
			SlackbotEndpointOutputs['filesRevokePublicUrl']
		>('files.revokePublicURL', ctx.key, { method: 'POST', body: input });
		await logEventFromContext(
			ctx,
			'slackbot.files.revokePublicUrl',
			{ ...input },
			'completed',
		);
		return result;
	};

// ── Remote files ────────────────────────────────────────────────────────────
// Remote files reference content hosted outside Slack; Slack stores only the
// metadata and renders a link unfurl.

export const remoteAdd: SlackbotEndpoints['filesRemoteAdd'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['filesRemoteAdd']
	>('files.remote.add', ctx.key, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'slackbot.files.remoteAdd',
		{ ...input },
		'completed',
	);
	return result;
};

export const remoteInfo: SlackbotEndpoints['filesRemoteInfo'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['filesRemoteInfo']
	>('files.remote.info', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'slackbot.files.remoteInfo',
		{ ...input },
		'completed',
	);
	return result;
};

export const remoteList: SlackbotEndpoints['filesRemoteList'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['filesRemoteList']
	>('files.remote.list', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'slackbot.files.remoteList',
		{ ...input },
		'completed',
	);
	return result;
};

export const remoteUpdate: SlackbotEndpoints['filesRemoteUpdate'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['filesRemoteUpdate']
	>('files.remote.update', ctx.key, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'slackbot.files.remoteUpdate',
		{ ...input },
		'completed',
	);
	return result;
};

export const remoteRemove: SlackbotEndpoints['filesRemoteRemove'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['filesRemoteRemove']
	>('files.remote.remove', ctx.key, { method: 'POST', body: input });
	await logEventFromContext(
		ctx,
		'slackbot.files.remoteRemove',
		{ ...input },
		'completed',
	);
	return result;
};

export const remoteShare: SlackbotEndpoints['filesRemoteShare'] = async (
	ctx,
	input,
) => {
	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['filesRemoteShare']
	>('files.remote.share', ctx.key, { method: 'GET', query: input });
	await logEventFromContext(
		ctx,
		'slackbot.files.remoteShare',
		{ ...input },
		'completed',
	);
	return result;
};

// ── Upload and download ─────────────────────────────────────────────────────

interface UploadUrlResponse {
	ok: boolean;
	error?: string;
	upload_url?: string;
	file_id?: string;
}

/**
 * Slack retired `files.upload` in favour of a three-step external flow:
 * reserve an upload URL, PUT the bytes to it, then finalise (and optionally
 * share) the file. All three steps are wrapped here so callers pass content
 * once and get the finished file back.
 */
export const upload: SlackbotEndpoints['filesUpload'] = async (ctx, input) => {
	const bytes = Buffer.from(input.content, 'base64');

	const reservation = await makeSlackbotRequest<UploadUrlResponse>(
		'files.getUploadURLExternal',
		ctx.key,
		{
			method: 'GET',
			query: { filename: input.filename, length: bytes.byteLength },
		},
	);

	if (!reservation.upload_url || !reservation.file_id) {
		throw new SlackbotAPIError(
			'files.getUploadURLExternal returned no upload target',
			reservation.error,
		);
	}

	const uploadResponse = await fetch(reservation.upload_url, {
		method: 'POST',
		headers: { 'Content-Type': 'application/octet-stream' },
		body: new Uint8Array(bytes),
	});

	if (!uploadResponse.ok) {
		throw new SlackbotAPIError(
			`Upload to Slack storage failed with status ${uploadResponse.status}`,
			'upload_failed',
		);
	}

	const result = await makeSlackbotRequest<
		SlackbotEndpointOutputs['filesUpload']
	>('files.completeUploadExternal', ctx.key, {
		method: 'POST',
		body: {
			files: [
				{
					id: reservation.file_id,
					title: input.title ?? input.filename,
					alt_txt: input.alt_txt,
					snippet_type: input.snippet_type,
				},
			],
			channel_id: input.channel_id,
			initial_comment: input.initial_comment,
			thread_ts: input.thread_ts,
		},
	});

	const uploaded = result.files?.[0];
	if (result.ok && uploaded?.id && ctx.db.files) {
		try {
			await ctx.db.files.upsertByEntityId(uploaded.id, {
				id: uploaded.id,
				name: uploaded.name ?? input.filename,
				title: uploaded.title ?? input.title,
				mimetype: uploaded.mimetype,
				filetype: uploaded.filetype,
				size: uploaded.size ?? bytes.byteLength,
				user: uploaded.user,
				created: uploaded.created,
				permalink: uploaded.permalink,
			});
		} catch (error) {
			console.warn('Failed to cache uploaded file:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'slackbot.files.upload',
		{ filename: input.filename, channel_id: input.channel_id },
		'completed',
	);
	return result;
};

/**
 * Resolves a file's private URL and fetches its bytes. Slack serves
 * `url_private` only to an authenticated caller, so the bot token is attached
 * explicitly. Content is returned base64-encoded; `max_bytes` (default 25 MB)
 * caps the transfer so a large upload cannot exhaust the process heap.
 */
export const download: SlackbotEndpoints['filesDownload'] = async (
	ctx,
	input,
) => {
	const maxBytes = input.max_bytes ?? 25 * 1024 * 1024;

	const metadata = await makeSlackbotRequest<
		SlackbotEndpointOutputs['filesInfo']
	>('files.info', ctx.key, { method: 'GET', query: { file: input.file } });

	const url = metadata.file?.url_private_download ?? metadata.file?.url_private;
	if (!url) {
		throw new SlackbotAPIError(
			`File ${input.file} exposes no private download URL`,
			'no_download_url',
		);
	}

	// Slack advertises the size up front, so an oversized file is rejected
	// before any bytes are transferred.
	const declaredSize = metadata.file?.size;
	if (typeof declaredSize === 'number' && declaredSize > maxBytes) {
		throw new SlackbotAPIError(
			`File ${input.file} is ${declaredSize} bytes, above the ${maxBytes} byte limit`,
			'file_too_large',
		);
	}

	const response = await fetch(url, {
		headers: { Authorization: `Bearer ${ctx.key}` },
	});

	if (!response.ok) {
		throw new SlackbotAPIError(
			`Download failed with status ${response.status}`,
			'download_failed',
		);
	}

	const buffer = Buffer.from(await response.arrayBuffer());
	// Re-check: Slack omits `size` on some file types, so the declared-size
	// guard above cannot be the only one.
	if (buffer.byteLength > maxBytes) {
		throw new SlackbotAPIError(
			`Downloaded ${buffer.byteLength} bytes, above the ${maxBytes} byte limit`,
			'file_too_large',
		);
	}

	await logEventFromContext(
		ctx,
		'slackbot.files.download',
		{ ...input },
		'completed',
	);

	return {
		ok: true,
		file: metadata.file,
		content: buffer.toString('base64'),
		content_type: response.headers.get('content-type') ?? undefined,
		byte_size: buffer.byteLength,
	};
};
