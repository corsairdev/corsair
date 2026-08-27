import type { DocusignClient } from '../client';
import type {
	CreateEnvelopeParams,
	CreateRecipientViewUrlParams,
	GetEnvelopeParams,
	SendEnvelopeParams,
} from './types';

export const createEnvelope = async (
	client: DocusignClient,
	params: CreateEnvelopeParams,
) => {
	return client.request('/envelopes', {
		method: 'POST',
		body: JSON.stringify(params),
	});
};

export const getEnvelope = async (
	client: DocusignClient,
	params: GetEnvelopeParams,
) => {
	return client.request(`/envelopes/${params.envelopeId}`);
};

export const sendEnvelope = async (
	client: DocusignClient,
	params: SendEnvelopeParams,
) => {
	return client.request(`/envelopes/${params.envelopeId}`, {
		method: 'PUT',
		body: JSON.stringify({ status: 'sent' }),
	});
};

export const createRecipientViewUrl = async (
	client: DocusignClient,
	params: CreateRecipientViewUrlParams,
) => {
	const {
		envelopeId,
		authenticationMethod = 'none',
		recipientId = '1',
		...rest
	} = params;

	return client.request(`/envelopes/${envelopeId}/views/recipient`, {
		method: 'POST',
		body: JSON.stringify({
			authenticationMethod,
			recipientId,
			...rest,
		}),
	});
};
