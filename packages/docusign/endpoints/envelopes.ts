import { DocusignClient } from '../client';
import type {
	CreateEnvelopeParams,
	CreateRecipientViewUrlParams,
	GetEnvelopeParams,
	SendEnvelopeParams,
} from './types';

function resolveClient(contextOrClient: any): DocusignClient {
	if (contextOrClient instanceof DocusignClient) {
		return contextOrClient;
	}
	if (contextOrClient?.client) {
		return contextOrClient.client as DocusignClient;
	}
	if (typeof contextOrClient?.request === 'function') {
		return contextOrClient as DocusignClient;
	}
	throw new Error(
		'Invalid execution context: DocuSign client is not initialized or accessible.',
	);
}

export const createEnvelope = async (
	clientOrContext: any,
	params: CreateEnvelopeParams,
) => {
	const client = resolveClient(clientOrContext);
	return client.request('/envelopes', {
		method: 'POST',
		body: JSON.stringify(params),
	});
};

export const getEnvelope = async (
	clientOrContext: any,
	params: GetEnvelopeParams,
) => {
	const client = resolveClient(clientOrContext);
	return client.request(`/envelopes/${params.envelopeId}`);
};

export const sendEnvelope = async (
	clientOrContext: any,
	params: SendEnvelopeParams,
) => {
	const client = resolveClient(clientOrContext);
	return client.request(`/envelopes/${params.envelopeId}`, {
		method: 'PUT',
		body: JSON.stringify({ status: 'sent' }),
	});
};

export const createRecipientViewUrl = async (
	clientOrContext: any,
	params: CreateRecipientViewUrlParams,
) => {
	const client = resolveClient(clientOrContext);
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
