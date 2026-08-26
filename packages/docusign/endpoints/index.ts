import type { DocusignClient } from '../client';
import type {
	CreateEnvelopeParams,
	GetEnvelopeParams,
	ListTemplatesParams,
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
	params: GetEnvelopeParams,
) => {
	return client.request(`/envelopes/${params.envelopeId}`, {
		method: 'PUT',
		body: JSON.stringify({ status: 'sent' }),
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
	params: { templateId: string },
) => {
	return client.request(`/templates/${params.templateId}`);
};

export * from './types';
