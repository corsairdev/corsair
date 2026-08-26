import type { DocusignClient } from '../client';

export const listTemplates = async (
	client: DocusignClient,
	params?: { count?: number; startPosition?: number },
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
	{ templateId }: { templateId: string },
) => {
	return client.request(`/templates/${templateId}`);
};
