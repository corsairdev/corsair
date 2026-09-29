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

	// `alt_txt` and `snippet_type` belong to the reservation, not the
	// completion - Slack ignores them on completeUploadExternal, so sending
	// them there would drop the alt text and snippet syntax entirely.
	const reservation = await makeSlackbotRequest<UploadUrlResponse>(
		'files.getUploadURLExternal',
		ctx.key,
		{
			method: 'GET',
			query: {
				filename: input.filename,
				length: bytes.byteLength,
				alt_txt: input.alt_txt,
				snippet_type: input.snippet_type,
			},
		},
	);

	if (!reservation.upload_url || !reservation.file_id) {
		throw new SlackbotAPIError(
			'files.getUploadURLExternal returned no upload target',
			reservation.error,
		);
	}

	const uploadResponse = await fetchSlackOwned(reservation.upload_url, {
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
			// completeUploadExternal accepts only id and title per file.
			files: [
				{
					id: reservation.file_id,
					title: input.title ?? input.filename,
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
 * Slack-owned hosts that may receive the bot token.
 *
 * A file record's `url_private` is not guaranteed to point at Slack: remote
 * files (`is_external: true`, `mode: external`) carry a third-party URL in the
 * same field. Attaching `Authorization: Bearer <bot token>` unconditionally
 * would hand the workspace token to whatever host that is, so the header is
 * only ever sent to a verified Slack host.
 */
const SLACK_FILE_HOSTS = new Set([
	'slack.com',
	'slack-edge.com',
	'slack-files.com',
]);

function isSlackOwnedUrl(rawUrl: string): boolean {
	let parsed: URL;
	try {
		parsed = new URL(rawUrl);
	} catch {
		return false;
	}
	if (parsed.protocol !== 'https:') return false;
	const host = parsed.hostname.toLowerCase();
	// Exact match, or a subdomain of a Slack-owned domain. The leading dot
	// prevents `evil-slack.com` from matching `slack.com`.
	for (const domain of SLACK_FILE_HOSTS) {
		if (host === domain || host.endsWith(`.${domain}`)) return true;
	}
	return false;
}

const MAX_SLACK_REDIRECTS = 3;

async function fetchSlackOwned(
	rawUrl: string,
	init: RequestInit,
	hops = 0,
): Promise<Response> {
	if (!isSlackOwnedUrl(rawUrl)) {
		throw new SlackbotAPIError(
			'Refusing to send credentials or file bytes to a non-Slack host',
			'external_file_url',
		);
	}
	if (hops > MAX_SLACK_REDIRECTS) {
		throw new SlackbotAPIError(
			'Too many redirects while contacting a Slack file host',
			'external_file_url',
		);
	}

	const response = await fetch(rawUrl, { ...init, redirect: 'manual' });
	if (response.status >= 300 && response.status < 400) {
		const location = response.headers.get('location');
		if (!location) {
			throw new SlackbotAPIError(
				`Redirect from Slack file host carried no Location`,
				'external_file_url',
			);
		}
		return fetchSlackOwned(
			new URL(location, rawUrl).toString(),
			init,
			hops + 1,
		);
	}
	return response;
}

/**
 * Reads a response body, aborting once `maxBytes` is exceeded.
 *
 * `arrayBuffer()` would buffer the entire response before any size check, so a
 * file whose size Slack does not declare could exhaust memory before it could
 * be rejected. Streaming lets the transfer be cancelled mid-flight.
 */
async function readBounded(
	response: Response,
	maxBytes: number,
	fileId: string,
): Promise<Buffer> {
	const body = response.body;
	if (!body) {
		// No stream available (e.g. a mocked response); fall back to buffering,
		// which is safe because the declared-size guard already ran.
		const buffered = Buffer.from(await response.arrayBuffer());
		if (buffered.byteLength > maxBytes) {
			throw new SlackbotAPIError(
				`Downloaded ${buffered.byteLength} bytes, above the ${maxBytes} byte limit`,
				'file_too_large',
			);
		}
		return buffered;
	}

	const reader = body.getReader();
	const chunks: Buffer[] = [];
	let total = 0;

	try {
		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			if (!value) continue;
			total += value.byteLength;
			if (total > maxBytes) {
				await reader.cancel();
				throw new SlackbotAPIError(
					`File ${fileId} exceeds the ${maxBytes} byte limit`,
					'file_too_large',
				);
			}
			chunks.push(Buffer.from(value));
		}
	} finally {
		reader.releaseLock();
	}

	return Buffer.concat(chunks);
}

/**
 * Resolves a file's private URL and fetches its bytes. Slack serves
 * `url_private` only to an authenticated caller, so the bot token is attached
 * explicitly - but only after confirming the URL is Slack-owned. Content is
 * returned base64-encoded; `max_bytes` (default 25 MB) bounds the transfer.
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

	const declaredSize = metadata.file?.size;
	if (typeof declaredSize === 'number' && declaredSize > maxBytes) {
		throw new SlackbotAPIError(
			`File ${input.file} is ${declaredSize} bytes, above the ${maxBytes} byte limit`,
			'file_too_large',
		);
	}

	const response = await fetchSlackOwned(url, {
		headers: { Authorization: `Bearer ${ctx.key}` },
	});

	if (!response.ok) {
		throw new SlackbotAPIError(
			`Download failed with status ${response.status}`,
			'download_failed',
		);
	}

	// Slack omits `size` on some file types, so the stream is bounded too.
	const buffer = await readBounded(response, maxBytes, input.file);

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
