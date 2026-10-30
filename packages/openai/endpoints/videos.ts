import { logEventFromContext } from 'corsair/core';
import {
	downloadOpenaiFile,
	makeOpenaiRequest,
	multipartOpenaiRequest,
} from '../client';
import type { OpenaiEndpoints } from '../index';
import type {
	VideosCreateRemixResponse,
	VideosCreateResponse,
	VideosDeleteResponse,
	VideosListResponse,
	VideosRetrieveResponse,
} from '../schema/videos';

export const create: OpenaiEndpoints['videosCreate'] = async (ctx, input) => {
	const ref = input.inputReference;
	const refName = input.inputReferenceFileName;
	const hasRef = ref !== undefined;
	const hasName = refName !== undefined;
	// Defense in depth: Zod also enforces this pair; throw if only one is set.
	if (hasRef !== hasName) {
		throw new Error(
			'inputReference and inputReferenceFileName must both be provided or both omitted',
		);
	}

	// Locals after the paired-field guard are defined together; no assertion needed.
	const files =
		hasRef && hasName && ref !== undefined && refName !== undefined
			? [
					{
						field: 'input_reference',
						file: ref,
						fileName: refName,
					},
				]
			: [];

	const result =
		files.length > 0
			? await multipartOpenaiRequest<VideosCreateResponse>('videos', ctx.key, {
					files,
					fields: {
						prompt: input.prompt,
						model: input.model,
						size: input.size,
						seconds: input.seconds,
					},
				})
			: await makeOpenaiRequest<VideosCreateResponse>('videos', ctx.key, {
					method: 'POST',
					body: {
						prompt: input.prompt,
						model: input.model,
						size: input.size,
						seconds: input.seconds,
					},
				});

	await logEventFromContext(
		ctx,
		'openai.videos.create',
		{
			prompt: input.prompt,
			model: input.model,
			size: input.size,
			seconds: input.seconds,
		},
		'completed',
	);
	return result;
};

export const list: OpenaiEndpoints['videosList'] = async (ctx, input) => {
	const result = await makeOpenaiRequest<VideosListResponse>(
		'videos',
		ctx.key,
		{
			method: 'GET',
			query: {
				limit: input.limit,
				order: input.order,
				after: input.after,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'openai.videos.list',
		{ ...input },
		'completed',
	);
	return result;
};

export const retrieve: OpenaiEndpoints['videosRetrieve'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<VideosRetrieveResponse>(
		`videos/${input.videoId}`,
		ctx.key,
		{ method: 'GET' },
	);

	await logEventFromContext(
		ctx,
		'openai.videos.retrieve',
		{ ...input },
		'completed',
	);
	return result;
};

export const deleteVideo: OpenaiEndpoints['videosDelete'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<VideosDeleteResponse>(
		`videos/${input.videoId}`,
		ctx.key,
		{ method: 'DELETE' },
	);

	await logEventFromContext(
		ctx,
		'openai.videos.delete',
		{ ...input },
		'completed',
	);
	return result;
};

export const createRemix: OpenaiEndpoints['videosCreateRemix'] = async (
	ctx,
	input,
) => {
	const result = await makeOpenaiRequest<VideosCreateRemixResponse>(
		`videos/${input.videoId}/remix`,
		ctx.key,
		{ method: 'POST', body: { prompt: input.prompt } },
	);

	await logEventFromContext(
		ctx,
		'openai.videos.createRemix',
		{ ...input },
		'completed',
	);
	return result;
};

export const download: OpenaiEndpoints['videosDownload'] = async (
	ctx,
	input,
) => {
	const buffer = await downloadOpenaiFile(
		`videos/${input.videoId}/content`,
		ctx.key,
	);
	const contentBase64 = Buffer.from(buffer).toString('base64');

	await logEventFromContext(
		ctx,
		'openai.videos.download',
		{ ...input },
		'completed',
	);
	return { videoId: input.videoId, contentBase64 };
};
