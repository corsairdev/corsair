import { logEventFromContext } from 'corsair/core';
import type { MagicHourEndpoints } from '..';
import { makeMagicHourRequest } from '../client';
import type { MagicHourEndpointOutputs } from './types';
import {
	MagicHourEndpointInputSchemas,
	MagicHourEndpointOutputSchemas,
} from './types';

// Each operation creates an asynchronous video project: it returns the new
// project id immediately and the caller polls `GET /v1/video-projects/{id}`
// for status and downloads. Events log the id/credit count only, never the
// prompts, scripts, or file paths in the request.

export const talkingPhoto: MagicHourEndpoints['videosTalkingPhoto'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MagicHourEndpointInputSchemas.videosTalkingPhoto.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['videosTalkingPhoto']
	>('/v1/ai-talking-photo', ctx.key, { method: 'POST', body: parsedInput });

	const parsed =
		MagicHourEndpointOutputSchemas.videosTalkingPhoto.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.videos.talkingPhoto',
		{ id: parsed.id },
		'completed',
	);

	return parsed;
};

export const ugcAd: MagicHourEndpoints['videosUgcAd'] = async (ctx, input) => {
	const parsedInput = MagicHourEndpointInputSchemas.videosUgcAd.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['videosUgcAd']
	>('/v1/ai-ugc-ad', ctx.key, { method: 'POST', body: parsedInput });

	const parsed = MagicHourEndpointOutputSchemas.videosUgcAd.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.videos.ugcAd',
		{ id: parsed.id },
		'completed',
	);

	return parsed;
};

export const videoEditor: MagicHourEndpoints['videosVideoEditor'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MagicHourEndpointInputSchemas.videosVideoEditor.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['videosVideoEditor']
	>('/v1/ai-video-editor', ctx.key, { method: 'POST', body: parsedInput });

	const parsed =
		MagicHourEndpointOutputSchemas.videosVideoEditor.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.videos.videoEditor',
		{ id: parsed.id },
		'completed',
	);

	return parsed;
};

export const videoTranslator: MagicHourEndpoints['videosVideoTranslator'] =
	async (ctx, input) => {
		const parsedInput =
			MagicHourEndpointInputSchemas.videosVideoTranslator.parse(input);

		const response = await makeMagicHourRequest<
			MagicHourEndpointOutputs['videosVideoTranslator']
		>('/v1/ai-video-translator', ctx.key, {
			method: 'POST',
			body: parsedInput,
		});

		const parsed =
			MagicHourEndpointOutputSchemas.videosVideoTranslator.parse(response);

		await logEventFromContext(
			ctx,
			'magichour.videos.videoTranslator',
			{ id: parsed.id },
			'completed',
		);

		return parsed;
	};

export const animation: MagicHourEndpoints['videosAnimation'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MagicHourEndpointInputSchemas.videosAnimation.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['videosAnimation']
	>('/v1/animation', ctx.key, { method: 'POST', body: parsedInput });

	const parsed = MagicHourEndpointOutputSchemas.videosAnimation.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.videos.animation',
		{ id: parsed.id },
		'completed',
	);

	return parsed;
};

export const audioToVideo: MagicHourEndpoints['videosAudioToVideo'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MagicHourEndpointInputSchemas.videosAudioToVideo.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['videosAudioToVideo']
	>('/v1/audio-to-video', ctx.key, { method: 'POST', body: parsedInput });

	const parsed =
		MagicHourEndpointOutputSchemas.videosAudioToVideo.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.videos.audioToVideo',
		{ id: parsed.id },
		'completed',
	);

	return parsed;
};

export const autoSubtitleGenerator: MagicHourEndpoints['videosAutoSubtitleGenerator'] =
	async (ctx, input) => {
		const parsedInput =
			MagicHourEndpointInputSchemas.videosAutoSubtitleGenerator.parse(input);

		const response = await makeMagicHourRequest<
			MagicHourEndpointOutputs['videosAutoSubtitleGenerator']
		>('/v1/auto-subtitle-generator', ctx.key, {
			method: 'POST',
			body: parsedInput,
		});

		const parsed =
			MagicHourEndpointOutputSchemas.videosAutoSubtitleGenerator.parse(
				response,
			);

		await logEventFromContext(
			ctx,
			'magichour.videos.autoSubtitleGenerator',
			{ id: parsed.id },
			'completed',
		);

		return parsed;
	};

export const characterReplace: MagicHourEndpoints['videosCharacterReplace'] =
	async (ctx, input) => {
		const parsedInput =
			MagicHourEndpointInputSchemas.videosCharacterReplace.parse(input);

		const response = await makeMagicHourRequest<
			MagicHourEndpointOutputs['videosCharacterReplace']
		>('/v1/character-replace', ctx.key, { method: 'POST', body: parsedInput });

		const parsed =
			MagicHourEndpointOutputSchemas.videosCharacterReplace.parse(response);

		await logEventFromContext(
			ctx,
			'magichour.videos.characterReplace',
			{ id: parsed.id },
			'completed',
		);

		return parsed;
	};

export const faceSwap: MagicHourEndpoints['videosFaceSwap'] = async (
	ctx,
	input,
) => {
	const parsedInput = MagicHourEndpointInputSchemas.videosFaceSwap.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['videosFaceSwap']
	>('/v1/face-swap', ctx.key, { method: 'POST', body: parsedInput });

	const parsed = MagicHourEndpointOutputSchemas.videosFaceSwap.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.videos.faceSwap',
		{ id: parsed.id },
		'completed',
	);

	return parsed;
};

export const imageToVideo: MagicHourEndpoints['videosImageToVideo'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MagicHourEndpointInputSchemas.videosImageToVideo.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['videosImageToVideo']
	>('/v1/image-to-video', ctx.key, { method: 'POST', body: parsedInput });

	const parsed =
		MagicHourEndpointOutputSchemas.videosImageToVideo.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.videos.imageToVideo',
		{ id: parsed.id },
		'completed',
	);

	return parsed;
};

export const lipSync: MagicHourEndpoints['videosLipSync'] = async (
	ctx,
	input,
) => {
	const parsedInput = MagicHourEndpointInputSchemas.videosLipSync.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['videosLipSync']
	>('/v1/lip-sync', ctx.key, { method: 'POST', body: parsedInput });

	const parsed = MagicHourEndpointOutputSchemas.videosLipSync.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.videos.lipSync',
		{ id: parsed.id },
		'completed',
	);

	return parsed;
};

export const textToVideo: MagicHourEndpoints['videosTextToVideo'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MagicHourEndpointInputSchemas.videosTextToVideo.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['videosTextToVideo']
	>('/v1/text-to-video', ctx.key, { method: 'POST', body: parsedInput });

	const parsed =
		MagicHourEndpointOutputSchemas.videosTextToVideo.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.videos.textToVideo',
		{ id: parsed.id },
		'completed',
	);

	return parsed;
};

export const videoToVideo: MagicHourEndpoints['videosVideoToVideo'] = async (
	ctx,
	input,
) => {
	const parsedInput =
		MagicHourEndpointInputSchemas.videosVideoToVideo.parse(input);

	const response = await makeMagicHourRequest<
		MagicHourEndpointOutputs['videosVideoToVideo']
	>('/v1/video-to-video', ctx.key, { method: 'POST', body: parsedInput });

	const parsed =
		MagicHourEndpointOutputSchemas.videosVideoToVideo.parse(response);

	await logEventFromContext(
		ctx,
		'magichour.videos.videoToVideo',
		{ id: parsed.id },
		'completed',
	);

	return parsed;
};
