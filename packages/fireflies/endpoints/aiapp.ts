import { logEventFromContext } from 'corsair/core';
import type { FirefliesEndpoints } from '..';
import { makeFirefliesRequest } from '../client';
import type { FirefliesEndpointOutputs } from './types';

// apps(app_id, transcript_id, skip, limit) returns Apps { outputs: AppOutput[] }
const AI_APP_OUTPUTS_QUERY = `
  query AiAppOutputs($transcript_id: String, $app_id: String, $limit: Float, $skip: Float) {
    apps(transcript_id: $transcript_id, app_id: $app_id, limit: $limit, skip: $skip) {
      outputs {
        transcript_id user_id app_id created_at title prompt response
      }
    }
  }
`;

export const getOutputs: FirefliesEndpoints['aiAppGetOutputs'] = async (
	ctx,
	input,
) => {
	const response = await makeFirefliesRequest<
		FirefliesEndpointOutputs['aiAppGetOutputs']
	>(AI_APP_OUTPUTS_QUERY, ctx.key, {
		transcript_id: input.transcriptId,
		app_id: input.appId,
		limit: input.limit,
		skip: input.skip,
	});

	await logEventFromContext(
		ctx,
		'fireflies.aiApp.getOutputs',
		{ ...input },
		'completed',
	);
	return response;
};
