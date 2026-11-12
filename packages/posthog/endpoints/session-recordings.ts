import type { PostHogEndpoints } from '../index';
import { callPostHogApi } from './api';
import type { PostHogEndpointOutputs } from './types';

// Recordings live under the environment path; for most teams the environment
// id is the project id.
const E = '/api/environments/{project_id}';

export const list: PostHogEndpoints['sessionRecordingsList'] = async (
	ctx,
	input,
) =>
	callPostHogApi<PostHogEndpointOutputs['sessionRecordingsList']>(
		ctx,
		'posthog.sessionRecordings.list',
		`${E}/session_recordings/`,
		{ query: { ...input } },
		{ ...input },
	);

export const get: PostHogEndpoints['sessionRecordingsGet'] = async (
	ctx,
	input,
) =>
	callPostHogApi<PostHogEndpointOutputs['sessionRecordingsGet']>(
		ctx,
		'posthog.sessionRecordings.get',
		`${E}/session_recordings/${encodeURIComponent(input.id)}/`,
		{},
		{ id: input.id },
	);
