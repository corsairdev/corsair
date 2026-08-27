import { DocusignClient } from '../client';
import type { GetTemplateParams, ListTemplatesParams } from './types';

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

export const listTemplates = async (
	clientOrContext: any,
	params?: ListTemplatesParams,
) => {
	const client = resolveClient(clientOrContext);
	const query = new URLSearchParams();
	if (params?.count) query.append('count', String(params.count));
	if (params?.startPosition)
		query.append('start_position', String(params.startPosition));
	const qs = query.toString() ? `?${query.toString()}` : '';
	return client.request(`/templates${qs}`);
};

export const getTemplate = async (
	clientOrContext: any,
	params: GetTemplateParams,
) => {
	const client = resolveClient(clientOrContext);
	return client.request(`/templates/${params.templateId}`);
};
