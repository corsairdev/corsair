import { logEventFromContext } from 'corsair/core';
import type { DatarobotEndpoints } from '..';
import { makeDatarobotRequest } from '../client';
import { buildDatarobotPath, splitDatarobotInput } from '../utils';
import { DatarobotEndpointOutputSchemas } from './types';

/** Encrypt a string */
/** Official: POST /api/v2/stringEncryptions/ (`stringEncryptions_create`) */
export const stringEncryptionsCreate: DatarobotEndpoints['stringEncryptionsCreate'] =
	async (ctx, input) => {
		const path = buildDatarobotPath('/api/v2/stringEncryptions/', input);
		const { query, body } = splitDatarobotInput(input, [], []);
		const response = await makeDatarobotRequest(path, ctx, {
			method: 'POST',
			query,
			body,
		});
		const parsed =
			DatarobotEndpointOutputSchemas.stringEncryptionsCreate.parse(response);
		await logEventFromContext(
			ctx,
			'datarobot.stringEncryptions.stringEncryptionsCreate',
			input ?? {},
			'completed',
		);
		return parsed;
	};
