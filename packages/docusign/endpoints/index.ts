import type { DocusignClient } from '../client';
import type {
	CreateEnvelopeParams,
	CreateRecipientViewUrlParams,
	GetEnvelopeParams,
	GetTemplateParams,
	ListTemplatesParams,
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

export const listTemplates = async (
	client: DocusignClient,
	params?: ListTemplatesParams,
) => {
	const query = new URLSearchParams();
	if (params?.count) query.append('count', String(params.count));
	if (params?.startPosition)
		query.append('start_position', String(params.startPosition));
	const qs = query.toString() ? `?${query.toString()}` : '';
	return client.request(`/templates${qs}`);
};

export const getTemplate = async (
	client: DocusignClient,
	params: GetTemplateParams,
) => {
	return client.request(`/templates/${params.templateId}`);
};

export * from './types';
