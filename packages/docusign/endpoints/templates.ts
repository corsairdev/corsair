import { resolveClient } from './context';
import type {
	DocusignExecutionContext,
	GetTemplateParams,
	ListTemplatesParams,
} from './types';

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
