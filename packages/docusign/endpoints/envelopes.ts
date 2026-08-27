import { resolveClient } from './context';
import type {
	CreateEnvelopeParams,
	CreateRecipientViewUrlParams,
	DocusignExecutionContext,
	GetEnvelopeParams,
	SendEnvelopeParams,
} from './types';
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
