import { DocusignClient } from '../client';
import type {
	CreateEnvelopeParams,
	CreateRecipientViewUrlParams,
	DocusignExecutionContext,
	GetEnvelopeParams,
	SendEnvelopeParams,
} from './types';

function resolveClient(
	contextOrClient: DocusignExecutionContext | unknown,
): DocusignClient {
	if (contextOrClient instanceof DocusignClient) {
		return contextOrClient;
	}
	if (
		contextOrClient &&
		typeof contextOrClient === 'object' &&
		'client' in contextOrClient &&
		(contextOrClient as { client: unknown }).client
	) {
		const candidate = (contextOrClient as { client: unknown }).client;
		if (
			candidate instanceof DocusignClient ||
			typeof (candidate as { request?: unknown }).request === 'function'
		) {
			return candidate as DocusignClient;
		}
	}
	if (
		contextOrClient &&
		typeof (contextOrClient as { request?: unknown }).request === 'function'
	) {
		return contextOrClient as DocusignClient;
	}
	throw new Error(
		'Invalid execution context: DocuSign client is not initialized or accessible.',
	);
}

export const createEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateEnvelopeParams,
) => {
	const client = resolveClient(ctxOrClient);
	return client.request('/envelopes', {
		method: 'POST',
		body: JSON.stringify(params),
	});
};

export const getEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetEnvelopeParams,
) => {
	const client = resolveClient(ctxOrClient);
	return client.request(`/envelopes/${params.envelopeId}`);
};

export const sendEnvelope = async (
	ctxOrClient: DocusignExecutionContext,
	params: SendEnvelopeParams,
) => {
	const client = resolveClient(ctxOrClient);
	return client.request(`/envelopes/${params.envelopeId}`, {
		method: 'PUT',
		body: JSON.stringify({ status: 'sent' }),
	});
};

export const createRecipientViewUrl = async (
	ctxOrClient: DocusignExecutionContext,
	params: CreateRecipientViewUrlParams,
) => {
	const client = resolveClient(ctxOrClient);
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
