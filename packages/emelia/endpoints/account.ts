import { logEventFromContext } from 'corsair/core';
import type { EmeliaEndpoints } from '..';
import { makeEmeliaRequest } from '../client';
import type { EmeliaEndpointOutputs } from './types';

const ME_QUERY = `
query me {
	me {
		uid
		name
		email
		showMailbox
		picture
		due_invoice
		joinedDate
	}
}
`;

export const me: EmeliaEndpoints['accountMe'] = async (ctx, input) => {
	const response = await makeEmeliaRequest<EmeliaEndpointOutputs['accountMe']>(
		ME_QUERY,
		ctx.key,
	);

	await logEventFromContext(
		ctx,
		'emelia.account.me',
		{ ...input },
		'completed',
	);
	return response;
};
