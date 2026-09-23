import { logEventFromContext } from 'corsair/core';
import type { WhoisfreaksEndpoints } from '..';
import { makeWhoisfreaksRequest } from '../client';
import type { WhoisfreaksEndpointOutputs } from './types';

export const getDomainerFilesStatus: WhoisfreaksEndpoints['getDomainerFilesStatus'] =
	async (ctx, _input) => {
		const response = await makeWhoisfreaksRequest<
			WhoisfreaksEndpointOutputs['getDomainerFilesStatus']
		>('/v3.4/status', ctx.key, {
			method: 'GET',
		});

		await logEventFromContext(
			ctx,
			'whoisfreaks.domainer.files_status',
			{},
			'completed',
		);

		return response;
	};

export const Domainer = {
	filesStatus: getDomainerFilesStatus,
};
