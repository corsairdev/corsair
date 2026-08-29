import { logEventFromContext } from 'corsair/core';

import type { DocupostEndpoints } from '..';
import { makeDocupostRequest } from '../client';
import type { DocupostEndpointOutputs } from './types';

export const sendLetter: DocupostEndpoints['sendLetter'] = async (
	ctx,
	input,
) => {
	const { pdf, html, ...query } = input;

	const response = await makeDocupostRequest<
		DocupostEndpointOutputs['sendLetter']
	>('sendletter', ctx.key, {
		method: 'POST',
		query: {
			...query,
			...(pdf ? { pdf } : {}),
		},
		body: html ? { html } : undefined,
	});

	await logEventFromContext(
		ctx,
		'docupost.send_letter',
		{ ...input },
		'completed',
	);

	return response;
};
