import { resolveFileInput } from 'corsair/http';
import type { SaperlyEndpoints } from '../index';
import { callSaperly, idempotencyHeaders } from './call';
import {
	CreateCustomVoiceInputSchema,
	CreateCustomVoiceRequestSchema,
	CustomVoiceSchema,
	SaperlyEndpointInputSchemas,
	SaperlyEndpointOutputSchemas,
	StatusSchema,
} from './types';

export const list: SaperlyEndpoints['listVoices'] = async (ctx, input) => {
	return callSaperly(
		ctx,
		'saperly.voices.list',
		SaperlyEndpointInputSchemas.listVoices,
		SaperlyEndpointOutputSchemas.listVoices,
		input,
		(body) => ({
			method: 'GET',
			url: '/voices',
			query: { language: body.language },
		}),
		(body, voices) => ({
			language: body.language ?? null,
			count: voices.length,
		}),
	);
};

export const listCustom: SaperlyEndpoints['listCustomVoices'] = async (
	ctx,
	input,
) => {
	return callSaperly(
		ctx,
		'saperly.customVoices.list',
		SaperlyEndpointInputSchemas.listCustomVoices,
		SaperlyEndpointOutputSchemas.listCustomVoices,
		input,
		() => ({ method: 'GET', url: '/custom-voices' }),
		(_input, voices) => ({ count: voices.length }),
	);
};

export const createCustom: SaperlyEndpoints['createCustomVoice'] = async (
	ctx,
	input,
) => {
	const given = CreateCustomVoiceInputSchema.parse(input);
	// A link or base64 becomes the sample here; a Blob is sent as it was given.
	// Saperly documents no size limit, so core's 25 MB download cap applies.
	const audio =
		given.audio instanceof Blob
			? given.audio
			: (await resolveFileInput(given.audio, { fallbackName: 'voice-sample' }))
					.file;
	return callSaperly(
		ctx,
		'saperly.customVoices.create',
		CreateCustomVoiceRequestSchema,
		CustomVoiceSchema,
		{ ...given, audio },
		(body) => ({
			method: 'POST',
			url: '/custom-voices',
			headers: idempotencyHeaders(body.idempotencyKey),
			formData: {
				name: body.name,
				language: body.language,
				gender: body.gender,
				audio: body.audio,
			},
		}),
		(body, voice) => ({ voiceId: voice.id, name: body.name }),
	);
};

export const getCustom: SaperlyEndpoints['getCustomVoice'] = async (
	ctx,
	input,
) => {
	return callSaperly(
		ctx,
		'saperly.customVoices.get',
		SaperlyEndpointInputSchemas.getCustomVoice,
		CustomVoiceSchema,
		input,
		(body) => ({
			method: 'GET',
			url: '/custom-voices/{id}',
			path: { id: body.id },
		}),
		(body) => ({ voiceId: body.id }),
	);
};

export const deleteCustom: SaperlyEndpoints['deleteCustomVoice'] = async (
	ctx,
	input,
) => {
	return callSaperly(
		ctx,
		'saperly.customVoices.delete',
		SaperlyEndpointInputSchemas.deleteCustomVoice,
		StatusSchema,
		input,
		(body) => ({
			method: 'DELETE',
			url: '/custom-voices/{id}',
			path: { id: body.id },
		}),
		(body, result) => ({ voiceId: body.id, status: result.status }),
	);
};
