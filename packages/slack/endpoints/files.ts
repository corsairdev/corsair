import { logEventFromContext } from 'corsair/core';
import { toFileOutput } from 'corsair/http';
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

export const download: SlackEndpoints['filesDownload'] = async (ctx, input) => {
	const token = await userKey(ctx);
	const info = await makeSlackRequest<SlackEndpointOutputs['filesGet']>(
		'files.info',
		token,
		{ method: 'GET', query: { file: input.file } },
	);
	const file = info.file;
	const url = file?.url_private_download ?? file?.url_private;
	if (!file || !url) {
		throw new SlackAPIError(
			`File ${input.file} has no private download URL (an external or deleted file).`,
			'file_not_downloadable',
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
