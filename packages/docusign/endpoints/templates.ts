import { resolveClient } from './context';
import { persistList, persistOne } from './persistence';
import type {
	DocusignExecutionContext,
	GetTemplateParams,
	ListTemplatesParams,
} from './types';
import {
	GetTemplateInputSchema,
	GetTemplateOutputSchema,
	ListTemplatesInputSchema,
	ListTemplatesOutputSchema,
} from './types';

export const listTemplates = async (
	ctxOrClient: DocusignExecutionContext,
	params?: ListTemplatesParams,
) => {
	const input = ListTemplatesInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const query = new URLSearchParams();
	if (input?.count !== undefined) query.append('count', String(input.count));
	if (input?.startPosition !== undefined)
		query.append('start_position', String(input.startPosition));
	const qs = query.toString() ? `?${query.toString()}` : '';
	const data = await client.request(`/templates${qs}`);
	await persistList(
		ctxOrClient,
		'templates',
		data,
		'envelopeTemplates',
		'templateId',
	);
	return ListTemplatesOutputSchema.parse(data);
};

export const getTemplate = async (
	ctxOrClient: DocusignExecutionContext,
	params: GetTemplateParams,
) => {
	const input = GetTemplateInputSchema.parse(params);
	const client = resolveClient(ctxOrClient);
	const data = await client.request(
		`/templates/${encodeURIComponent(input.templateId)}`,
	);
	await persistOne(ctxOrClient, 'templates', data, 'templateId');
	return GetTemplateOutputSchema.parse(data);
};
