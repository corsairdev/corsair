import { logEventFromContext } from 'corsair/core';
import type { FirefliesEndpoints } from '..';
import { makeFirefliesRequest } from '../client';
import type { FirefliesEndpointOutputs } from './types';

// AudioUploadInput uses custom_language (not language)
const UPLOAD_AUDIO_MUTATION = `
  mutation UploadAudio($url: String!, $title: String, $webhook: String, $custom_language: String, $client_reference_id: String) {
    uploadAudio(input: { url: $url, title: $title, webhook: $webhook, custom_language: $custom_language, client_reference_id: $client_reference_id }) {
      success
      title
      message
    }
  }
`;

export const upload: FirefliesEndpoints['audioUpload'] = async (ctx, input) => {
	const response = await makeFirefliesRequest<
		FirefliesEndpointOutputs['audioUpload']
	>(UPLOAD_AUDIO_MUTATION, ctx.key, {
		url: input.url,
		title: input.title,
		webhook: input.webhook,
		custom_language: input.custom_language,
		client_reference_id: input.client_reference_id,
	});

	await logEventFromContext(
		ctx,
		'fireflies.audio.upload',
		{ ...input },
		'completed',
	);
	return response;
};
