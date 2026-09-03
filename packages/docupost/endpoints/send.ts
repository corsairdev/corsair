import { logEventFromContext } from 'corsair/core';

import type { DocupostEndpoints } from '..';
import { makeDocupostRequest } from '../client';
import type { DocupostEndpointOutputs } from './types';

export const accountBalance: DocupostEndpoints['accountBalance'] = async (
	ctx,
	input,
) => {
	const response = await makeDocupostRequest<
		DocupostEndpointOutputs['accountBalance']
	>('accountbalance', ctx.key, {
		method: 'GET',
	});

	await logEventFromContext(
		ctx,
		'docupost.account.balance',
		{ ...input },
		'completed',
	);

	return response;
};

export const sendLetter: DocupostEndpoints['sendLetter'] = async (
	ctx,
	input,
) => {
	const {
		to_name,
		to_address,
		to_city,
		to_state,
		to_zip,
		from_name,
		from_address,
		from_city,
		from_state,
		from_zip,
		pdf_url,
		html,
	} = input;

	const query: Record<string, string | undefined> = {
		to_name,
		to_address1: to_address,
		to_city,
		to_state,
		to_zip,
		from_name,
		from_address1: from_address,
		from_city,
		from_state,
		from_zip,
		pdf: pdf_url,
	};

	const response = await makeDocupostRequest<
		DocupostEndpointOutputs['sendLetter']
	>('sendletter', ctx.key, {
		method: 'POST',
		query,
		body: html ? { html } : undefined,
	});

	await logEventFromContext(
		ctx,
		'docupost.letter.send',
		{ ...input },
		'completed',
	);

	return response;
};

export const sendPostcard: DocupostEndpoints['sendPostcard'] = async (
	ctx,
	input,
) => {
	const {
		to_name,
		to_address,
		to_city,
		to_state,
		to_zip,
		from_name,
		from_address,
		from_city,
		from_state,
		from_zip,
		front_image_url,
		back_image_url,
	} = input;

	const response = await makeDocupostRequest<
		DocupostEndpointOutputs['sendPostcard']
	>('sendpostcard', ctx.key, {
		method: 'POST',
		query: {
			to_name,
			to_address1: to_address,
			to_city,
			to_state,
			to_zip,
			from_name,
			from_address1: from_address,
			from_city,
			from_state,
			from_zip,
			front_image: front_image_url,
			back_image: back_image_url,
		},
	});

	await logEventFromContext(
		ctx,
		'docupost.postcard.send',
		{ ...input },
		'completed',
	);

	return response;
};
