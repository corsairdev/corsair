import { logEventFromContext } from 'corsair/core';
import type { GeminiEndpoints } from '..';
import { GEMINI_API_BASE, makeGeminiRequest } from '../client';
import type { VideoFile, VideoOperation } from '../schema/videos';
import type { GetVideosOperationResponse, WaitForVideoResponse } from './types';

type VideoFileResult =
	| { ok: true; videoFile: VideoFile }
	| { ok: false; code?: number; message?: string };

export const generateVideos: GeminiEndpoints['generateVideos'] = async (
	ctx,
	input,
) => {
	const response = await makeGeminiRequest<VideoOperation>(
		// Generative Language API requires the /models/ segment for model-scoped methods
		`/models/${input.model}:predictLongRunning`,
		ctx.key,
		{
			method: 'POST',
			body: {
				instances: [{ prompt: input.prompt, image: input.image }],
				parameters: input.parameters,
			},
		},
	);

	await logEventFromContext(
		ctx,
		'gemini.videos.generateVideos',
		{ ...input },
		'completed',
	);
	return { operationName: response.name, done: response.done };
};

export const getVideosOperation: GeminiEndpoints['getVideosOperation'] = async (
	ctx,
	input,
) => {
	const response = await makeGeminiRequest<GetVideosOperationResponse>(
		`/${input.operationName}`,
		ctx.key,
		{ method: 'GET' },
	);

	// Log failed when the LRO payload carries an error (HTTP can still be 200).
	await logEventFromContext(
		ctx,
		'gemini.videos.getVideosOperation',
		{ ...input },
		response.error ? 'failed' : 'completed',
	);
	return response;
};

async function fetchVideoFile(
	uri: string,
	apiKey: string,
): Promise<VideoFileResult> {
	const downloadUrl = uri.startsWith('http')
		? uri
		: `${GEMINI_API_BASE}/${uri}`;
	const videoResponse = await fetch(downloadUrl, {
		headers: { 'x-goog-api-key': apiKey },
	});
	if (!videoResponse.ok) {
		return {
			ok: false,
			code: videoResponse.status,
			message: `Failed to download generated video: ${videoResponse.statusText}`,
		};
	}

	const bytes = await videoResponse.arrayBuffer();
	const contentBase64 = Buffer.from(bytes).toString('base64');
	const mimeType = videoResponse.headers.get('content-type') ?? 'video/mp4';
	return { ok: true, videoFile: { mimeType, contentBase64 } };
}

/** Logs the poll outcome with a status that actually matches what happened. */
async function logWaitForVideoResult(
	ctx: Parameters<GeminiEndpoints['waitForVideo']>[0],
	input: Parameters<GeminiEndpoints['waitForVideo']>[1],
	result: WaitForVideoResponse,
): Promise<void> {
	const status = result.error
		? 'failed'
		: result.done
			? 'completed'
			: 'pending';
	await logEventFromContext(
		ctx,
		'gemini.videos.waitForVideo',
		{ ...input },
		status,
	);
}

export const waitForVideo: GeminiEndpoints['waitForVideo'] = async (
	ctx,
	input,
) => {
	const deadline = Date.now() + input.timeoutMs;

	let operation = await makeGeminiRequest<GetVideosOperationResponse>(
		`/${input.operationName}`,
		ctx.key,
		{ method: 'GET' },
	);

	while (
		!operation.done &&
		!operation.error &&
		Date.now() + input.pollIntervalMs <= deadline
	) {
		await new Promise((resolve) => setTimeout(resolve, input.pollIntervalMs));
		operation = await makeGeminiRequest<GetVideosOperationResponse>(
			`/${input.operationName}`,
			ctx.key,
			{ method: 'GET' },
		);
	}

	if (operation.error) {
		const result: WaitForVideoResponse = {
			operationName: input.operationName,
			done: true,
			error: operation.error,
		};
		await logWaitForVideoResult(ctx, input, result);
		return result;
	}

	if (!operation.done) {
		const result: WaitForVideoResponse = {
			operationName: input.operationName,
			done: false,
		};
		await logWaitForVideoResult(ctx, input, result);
		return result;
	}

	const uri =
		operation.response?.generateVideoResponse?.generatedSamples?.[0]?.video
			?.uri;
	if (!uri) {
		const result: WaitForVideoResponse = {
			operationName: input.operationName,
			done: true,
		};
		await logWaitForVideoResult(ctx, input, result);
		return result;
	}

	const fileResult = await fetchVideoFile(uri, ctx.key);
	const result: WaitForVideoResponse = fileResult.ok
		? {
				operationName: input.operationName,
				done: true,
				data: { video_file: fileResult.videoFile },
			}
		: {
				operationName: input.operationName,
				done: true,
				error: { code: fileResult.code, message: fileResult.message },
			};
	await logWaitForVideoResult(ctx, input, result);
	return result;
};
