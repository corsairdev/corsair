import type { JigsawstackEndpoints } from '../index';
import { jigsawCall } from './call';

export const speechToText: JigsawstackEndpoints['speechToText'] = async (
	ctx,
	input,
) =>
	jigsawCall(
		ctx,
		'jigsawstack.audio.speechToText',
		'/v1/ai/transcribe',
		'POST',
		input,
		{ body: input },
	);

export const textToSpeech: JigsawstackEndpoints['textToSpeech'] = async (
	ctx,
	input,
) =>
	jigsawCall(
		ctx,
		'jigsawstack.audio.textToSpeech',
		'/v1/ai/tts',
		'POST',
		input,
		{
			body: input,
			binary: true,
		},
	);

export const createVoiceClone: JigsawstackEndpoints['createVoiceClone'] =
	async (ctx, input) =>
		jigsawCall(
			ctx,
			'jigsawstack.audio.createVoiceClone',
			'/v1/ai/tts/clone',
			'POST',
			input,
			{ body: input },
		);
