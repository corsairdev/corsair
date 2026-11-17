import type { MistralAiEndpoints } from '../index';
import { callMistralAi, decodeBase64 } from './shared';
import {
	MistralAiEndpointInputSchemas,
	MistralAiEndpointOutputSchemas,
} from './types';

/** Lists voices one page at a time. */
export const list: MistralAiEndpoints['voicesList'] = async (ctx, rawInput) => {
	const input = MistralAiEndpointInputSchemas.voicesList.parse(rawInput ?? {});
	return callMistralAi(ctx, '/v2/audio/voices', {
		query: input,
		output: MistralAiEndpointOutputSchemas.voicesList,
		event: 'voices.list',
	});
};

export const get: MistralAiEndpoints['voicesGet'] = async (ctx, rawInput) => {
	const input = MistralAiEndpointInputSchemas.voicesGet.parse(rawInput);
	return callMistralAi(ctx, '/v1/audio/voices/{voice_id}', {
		path: { voice_id: input.voice_id },
		output: MistralAiEndpointOutputSchemas.voicesGet,
		event: 'voices.get',
		logged: { voice_id: input.voice_id },
	});
};

export const create: MistralAiEndpoints['voicesCreate'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.voicesCreate.parse(rawInput);
	// Malformed base64 is refused before anything is sent; a data: URL prefix
	// or URL-safe alphabet goes out as plain standard base64, as Mistral expects.
	const body = input.sample_audio
		? {
				...input,
				sample_audio: Buffer.from(
					decodeBase64(input.sample_audio, 'sample_audio'),
				).toString('base64'),
			}
		: input;
	return callMistralAi(ctx, '/v1/audio/voices', {
		method: 'POST',
		body,
		output: MistralAiEndpointOutputSchemas.voicesCreate,
		event: 'voices.create',
	});
};

export const update: MistralAiEndpoints['voicesUpdate'] = async (
	ctx,
	rawInput,
) => {
	const { voice_id, ...body } =
		MistralAiEndpointInputSchemas.voicesUpdate.parse(rawInput);
	return callMistralAi(ctx, '/v1/audio/voices/{voice_id}', {
		method: 'PATCH',
		path: { voice_id },
		body,
		output: MistralAiEndpointOutputSchemas.voicesUpdate,
		event: 'voices.update',
		logged: { voice_id },
	});
};

export const remove: MistralAiEndpoints['voicesDelete'] = async (
	ctx,
	rawInput,
) => {
	const input = MistralAiEndpointInputSchemas.voicesDelete.parse(rawInput);
	return callMistralAi(ctx, '/v1/audio/voices/{voice_id}', {
		method: 'DELETE',
		path: { voice_id: input.voice_id },
		output: MistralAiEndpointOutputSchemas.voicesDelete,
		event: 'voices.delete',
		logged: { voice_id: input.voice_id },
	});
};
