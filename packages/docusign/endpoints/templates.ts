import { DocusignClient } from '../client';
import type {
	DocusignExecutionContext,
	GetTemplateParams,
	ListTemplatesParams,
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

export const listTemplates = async (
	ctxOrClient: DocusignExecutionContext,
	params?: ListTemplatesParams,
) => {
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (params?.count) query.append('count', String(params.count));
	if (params?.startPosition)
		query.append('start_position', String(params.startPosition));
	const qs = query.toString() ? `?${query.toString()}` : '';
	return client.request(`/templates${qs}`);
};

export const getTemplate = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetTemplateParams,
) => {
	const client = resolveClient(ctxOrClient);
	return client.request(`/templates/${params.templateId}`);
};
