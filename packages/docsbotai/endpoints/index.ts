import { makeDocsbotaiRequest } from '../client';
import type { DocsbotaiContext } from '../index';
import { rememberUploadUrl, uploadToStorage } from '../upload';
import type {
	DocsbotaiEndpointInputs,
	DocsbotaiEndpointOutputs,
	DocsbotaiOperationName,
} from './types';
import {
	DocsbotaiEndpointInputSchemas,
	DocsbotaiEndpointOutputSchemas,
} from './types';

type Route = {
	host?: 'admin' | 'chat';
	method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
	path: string;
	mode?: 'query' | 'body';
};
const routes = {
	listTeams: { path: '/teams' },
	getTeam: { path: '/teams/{teamId}' },
	updateTeam: { method: 'PUT', path: '/teams/{teamId}', mode: 'body' },
	listTeamMembers: { path: '/teams/{teamId}/members' },
	listBots: { path: '/teams/{teamId}/bots', mode: 'query' },
	getBot: { path: '/teams/{teamId}/bots/{botId}' },
	createBot: { method: 'POST', path: '/teams/{teamId}/bots', mode: 'body' },
	updateBot: {
		method: 'PUT',
		path: '/teams/{teamId}/bots/{botId}',
		mode: 'body',
	},
	deleteBot: { method: 'DELETE', path: '/teams/{teamId}/bots/{botId}' },
	listSources: { path: '/teams/{teamId}/bots/{botId}/sources', mode: 'query' },
	getSource: { path: '/teams/{teamId}/bots/{botId}/sources/{sourceId}' },
	createSource: {
		method: 'POST',
		path: '/teams/{teamId}/bots/{botId}/sources',
		mode: 'body',
	},
	retrySource: {
		method: 'PUT',
		path: '/teams/{teamId}/bots/{botId}/sources/{sourceId}',
	},
	deleteSource: {
		method: 'DELETE',
		path: '/teams/{teamId}/bots/{botId}/sources/{sourceId}',
	},
	getUploadUrl: {
		path: '/teams/{teamId}/bots/{botId}/upload-url',
		mode: 'query',
	},
	listQuestions: {
		path: '/teams/{teamId}/bots/{botId}/questions',
		mode: 'query',
	},
	deleteQuestion: {
		method: 'DELETE',
		path: '/teams/{teamId}/bots/{botId}/questions/{questionId}',
	},
	listConversations: {
		path: '/teams/{teamId}/bots/{botId}/conversations',
		mode: 'query',
	},
	deleteConversation: {
		method: 'DELETE',
		path: '/teams/{teamId}/bots/{botId}/conversations/{conversationId}',
	},
	listLeads: { path: '/teams/{teamId}/bots/{botId}/leads', mode: 'query' },
	deleteLead: {
		method: 'DELETE',
		path: '/teams/{teamId}/bots/{botId}/leads/{leadId}',
	},
	listResearchJobs: {
		path: '/teams/{teamId}/bots/{botId}/research',
		mode: 'query',
	},
	getStats: { path: '/teams/{teamId}/bots/{botId}/stats', mode: 'query' },
	getReports: { path: '/teams/{teamId}/bots/{botId}/reports', mode: 'query' },
	captureLead: {
		host: 'chat',
		method: 'POST',
		path: '/teams/{teamId}/bots/{botId}/conversations/{conversationId}/lead',
		mode: 'body',
	},
	getTicket: {
		host: 'chat',
		path: '/teams/{teamId}/bots/{botId}/conversations/{conversationId}/ticket',
	},
	rateAnswer: {
		host: 'chat',
		method: 'PUT',
		path: '/teams/{teamId}/bots/{botId}/rate/{answerId}',
		mode: 'body',
	},
	search: {
		host: 'chat',
		method: 'POST',
		path: '/teams/{teamId}/bots/{botId}/search',
		mode: 'body',
	},
	listWebhooks: { path: '/teams/{teamId}/bots/{botId}/webhooks' },
	getWebhook: { path: '/teams/{teamId}/bots/{botId}/webhooks/{webhookId}' },
	createWebhook: {
		method: 'POST',
		path: '/teams/{teamId}/bots/{botId}/webhooks',
		mode: 'body',
	},
	updateWebhook: {
		method: 'PATCH',
		path: '/teams/{teamId}/bots/{botId}/webhooks/{webhookId}',
		mode: 'body',
	},
	deleteWebhook: {
		method: 'DELETE',
		path: '/teams/{teamId}/bots/{botId}/webhooks/{webhookId}',
	},
} as const satisfies Record<
	Exclude<DocsbotaiOperationName, 'uploadFile'>,
	Route
>;

function endpoint<K extends keyof typeof routes>(name: K) {
	return async (
		ctx: DocsbotaiContext,
		input: DocsbotaiEndpointInputs[K],
	): Promise<DocsbotaiEndpointOutputs[K]> => {
		const parsed = DocsbotaiEndpointInputSchemas[name].parse(input);
		// The shared router handles many validated input shapes and dynamic path keys.
		const data: Record<string, unknown> = { ...parsed };
		const route: Route = routes[name];
		const path = route.path.replace(/\{(\w+)\}/g, (_match, key: string) => {
			const value = data[key];
			delete data[key];
			if (typeof value !== 'string')
				throw new Error(`Missing path parameter ${key}`);
			return encodeURIComponent(value);
		});
		// Provider responses are untrusted until the operation's output schema parses them.
		const response = await makeDocsbotaiRequest<unknown>(
			route.host ?? 'admin',
			path,
			ctx.key,
			{
				method: route.method,
				body: route.mode === 'body' ? data : undefined,
				query:
					route.mode === 'query'
						? (data as Record<string, string | number | boolean | undefined>)
						: undefined,
			},
		);
		return DocsbotaiEndpointOutputSchemas[name].parse(
			response,
		) as DocsbotaiEndpointOutputs[K];
	};
}

export const Teams = {
	list: endpoint('listTeams'),
	get: endpoint('getTeam'),
	update: endpoint('updateTeam'),
	listMembers: endpoint('listTeamMembers'),
};
export const Bots = {
	list: endpoint('listBots'),
	get: endpoint('getBot'),
	create: endpoint('createBot'),
	update: endpoint('updateBot'),
	delete: endpoint('deleteBot'),
	stats: endpoint('getStats'),
	reports: endpoint('getReports'),
};
async function uploadFile(
	ctx: DocsbotaiContext,
	input: DocsbotaiEndpointInputs['uploadFile'],
): Promise<void> {
	const { uploadUrl, data } =
		DocsbotaiEndpointInputSchemas.uploadFile.parse(input);
	await uploadToStorage(ctx.key, uploadUrl, data);
	return DocsbotaiEndpointOutputSchemas.uploadFile.parse(undefined);
}

const requestUploadUrl = endpoint('getUploadUrl');
async function getUploadUrl(
	ctx: DocsbotaiContext,
	input: DocsbotaiEndpointInputs['getUploadUrl'],
): Promise<DocsbotaiEndpointOutputs['getUploadUrl']> {
	const result = await requestUploadUrl(ctx, input);
	rememberUploadUrl(ctx.key, result.url);
	return result;
}

export const Sources = {
	list: endpoint('listSources'),
	get: endpoint('getSource'),
	create: endpoint('createSource'),
	retry: endpoint('retrySource'),
	delete: endpoint('deleteSource'),
	getUploadUrl,
	uploadFile,
};
export const Questions = {
	list: endpoint('listQuestions'),
	delete: endpoint('deleteQuestion'),
	rate: endpoint('rateAnswer'),
};
export const Conversations = {
	list: endpoint('listConversations'),
	delete: endpoint('deleteConversation'),
	captureLead: endpoint('captureLead'),
	ticket: endpoint('getTicket'),
};
export const Leads = {
	list: endpoint('listLeads'),
	delete: endpoint('deleteLead'),
};
export const Research = { list: endpoint('listResearchJobs') };
export const Search = { search: endpoint('search') };
export const Webhooks = {
	list: endpoint('listWebhooks'),
	get: endpoint('getWebhook'),
	create: endpoint('createWebhook'),
	update: endpoint('updateWebhook'),
	delete: endpoint('deleteWebhook'),
};
export * from './types';
