import type {
	BindEndpoints,
	CorsairErrorHandler,
	CorsairPlugin,
	CorsairPluginContext,
	KeyBuilderContext,
	PickAuth,
	PluginAuthConfig,
	PluginPermissionsConfig,
	RequiredPluginEndpointMeta,
	RequiredPluginEndpointSchemas,
} from 'corsair/core';
import { AuthMissingError } from 'corsair/core';
import {
	Bots,
	Conversations,
	DocsbotaiEndpointInputSchemas as inputs,
	Leads,
	DocsbotaiEndpointOutputSchemas as outputs,
	Questions,
	Research,
	Search,
	Sources,
	Teams,
	Webhooks,
} from './endpoints';
import { errorHandlers } from './error-handlers';
import { DocsbotaiSchema } from './schema';

const endpoints = {
	teams: Teams,
	bots: Bots,
	sources: Sources,
	questions: Questions,
	conversations: Conversations,
	leads: Leads,
	research: Research,
	search: Search,
	webhooks: Webhooks,
} as const;
export type DocsbotaiPluginOptions = {
	authType?: PickAuth<'api_key'>;
	key?: string;
	hooks?: InternalDocsbotaiPlugin['hooks'];
	errorHandlers?: CorsairErrorHandler;
	permissions?: PluginPermissionsConfig<typeof endpoints>;
};
export type DocsbotaiContext = CorsairPluginContext<
	typeof DocsbotaiSchema,
	DocsbotaiPluginOptions
>;
export type DocsbotaiKeyBuilderContext =
	KeyBuilderContext<DocsbotaiPluginOptions>;
export type DocsbotaiBoundEndpoints = BindEndpoints<typeof endpoints>;

export const docsbotaiEndpointSchemas = {
	'teams.list': { input: inputs.listTeams, output: outputs.listTeams },
	'teams.get': { input: inputs.getTeam, output: outputs.getTeam },
	'teams.update': { input: inputs.updateTeam, output: outputs.updateTeam },
	'teams.listMembers': {
		input: inputs.listTeamMembers,
		output: outputs.listTeamMembers,
	},
	'bots.list': { input: inputs.listBots, output: outputs.listBots },
	'bots.get': { input: inputs.getBot, output: outputs.getBot },
	'bots.create': { input: inputs.createBot, output: outputs.createBot },
	'bots.update': { input: inputs.updateBot, output: outputs.updateBot },
	'bots.delete': { input: inputs.deleteBot, output: outputs.deleteBot },
	'bots.stats': { input: inputs.getStats, output: outputs.getStats },
	'bots.reports': { input: inputs.getReports, output: outputs.getReports },
	'sources.list': { input: inputs.listSources, output: outputs.listSources },
	'sources.get': { input: inputs.getSource, output: outputs.getSource },
	'sources.create': {
		input: inputs.createSource,
		output: outputs.createSource,
	},
	'sources.retry': { input: inputs.retrySource, output: outputs.retrySource },
	'sources.delete': {
		input: inputs.deleteSource,
		output: outputs.deleteSource,
	},
	'sources.getUploadUrl': {
		input: inputs.getUploadUrl,
		output: outputs.getUploadUrl,
	},
	'sources.uploadFile': {
		input: inputs.uploadFile,
		output: outputs.uploadFile,
	},
	'questions.list': {
		input: inputs.listQuestions,
		output: outputs.listQuestions,
	},
	'questions.delete': {
		input: inputs.deleteQuestion,
		output: outputs.deleteQuestion,
	},
	'questions.rate': { input: inputs.rateAnswer, output: outputs.rateAnswer },
	'conversations.list': {
		input: inputs.listConversations,
		output: outputs.listConversations,
	},
	'conversations.delete': {
		input: inputs.deleteConversation,
		output: outputs.deleteConversation,
	},
	'conversations.captureLead': {
		input: inputs.captureLead,
		output: outputs.captureLead,
	},
	'conversations.ticket': {
		input: inputs.getTicket,
		output: outputs.getTicket,
	},
	'leads.list': { input: inputs.listLeads, output: outputs.listLeads },
	'leads.delete': { input: inputs.deleteLead, output: outputs.deleteLead },
	'research.list': {
		input: inputs.listResearchJobs,
		output: outputs.listResearchJobs,
	},
	'search.search': { input: inputs.search, output: outputs.search },
	'webhooks.list': { input: inputs.listWebhooks, output: outputs.listWebhooks },
	'webhooks.get': { input: inputs.getWebhook, output: outputs.getWebhook },
	'webhooks.create': {
		input: inputs.createWebhook,
		output: outputs.createWebhook,
	},
	'webhooks.update': {
		input: inputs.updateWebhook,
		output: outputs.updateWebhook,
	},
	'webhooks.delete': {
		input: inputs.deleteWebhook,
		output: outputs.deleteWebhook,
	},
} as const satisfies RequiredPluginEndpointSchemas<typeof endpoints>;

const read = (description: string) => ({
	riskLevel: 'read' as const,
	description,
});
const write = (description: string) => ({
	riskLevel: 'write' as const,
	description,
});
const destructive = (description: string) => ({
	riskLevel: 'destructive' as const,
	description,
});
const docsbotaiEndpointMeta = {
	'teams.list': read('List teams'),
	'teams.get': read('Get a team'),
	'teams.update': write('Update a team'),
	'teams.listMembers': read('List team members'),
	'bots.list': read('List bots'),
	'bots.get': read('Get a bot'),
	'bots.create': write('Create a bot'),
	'bots.update': write('Update a bot'),
	'bots.delete': destructive('Delete a bot'),
	'bots.stats': read('Get bot statistics'),
	'bots.reports': read('Get monthly reports'),
	'sources.list': read('List sources'),
	'sources.get': read('Get a source'),
	'sources.create': write('Create a source'),
	'sources.retry': write('Retry a failed source'),
	'sources.delete': destructive('Delete a source'),
	'sources.getUploadUrl': read('Get a presigned source upload URL'),
	'sources.uploadFile': write('Upload bytes to a presigned source URL'),
	'questions.list': read('List questions'),
	'questions.delete': destructive('Delete a question'),
	'questions.rate': write('Rate an answer'),
	'conversations.list': read('List conversations'),
	'conversations.delete': destructive('Delete a conversation'),
	'conversations.captureLead': write('Capture a lead'),
	'conversations.ticket': write('Generate a support ticket'),
	'leads.list': read('List leads'),
	'leads.delete': destructive('Delete a lead'),
	'research.list': read('List research jobs'),
	'search.search': read('Search bot content'),
	'webhooks.list': read('List webhook subscriptions'),
	'webhooks.get': read('Get a webhook subscription'),
	'webhooks.create': write('Create a webhook subscription'),
	'webhooks.update': write('Update a webhook subscription'),
	'webhooks.delete': destructive('Delete a webhook subscription'),
} as const satisfies RequiredPluginEndpointMeta<typeof endpoints>;

export const docsbotaiAuthConfig = {
	api_key: {},
} as const satisfies PluginAuthConfig;
export type BaseDocsbotaiPlugin<T extends DocsbotaiPluginOptions> =
	CorsairPlugin<
		'docsbotai',
		typeof DocsbotaiSchema,
		typeof endpoints,
		{},
		T,
		'api_key'
	>;
export type InternalDocsbotaiPlugin =
	BaseDocsbotaiPlugin<DocsbotaiPluginOptions>;
export function docsbotai<const T extends DocsbotaiPluginOptions>(
	incomingOptions: DocsbotaiPluginOptions & T = {} as DocsbotaiPluginOptions &
		T,
): BaseDocsbotaiPlugin<T> {
	const options = {
		...incomingOptions,
		authType: incomingOptions.authType ?? 'api_key',
	};
	return {
		id: 'docsbotai',
		authConfig: docsbotaiAuthConfig,
		schema: DocsbotaiSchema,
		options,
		hooks: options.hooks,
		endpoints,
		webhooks: {},
		endpointMeta: docsbotaiEndpointMeta,
		endpointSchemas: docsbotaiEndpointSchemas,
		errorHandlers: { ...errorHandlers, ...options.errorHandlers },
		keyBuilder: async (ctx: DocsbotaiKeyBuilderContext, source) => {
			if (source === 'endpoint' && options.key) return options.key;
			if (source === 'endpoint' && ctx.authType === 'api_key')
				return (await ctx.keys.get_api_key()) ?? '';
			throw new AuthMissingError('docsbotai', 'api_key');
		},
	} as BaseDocsbotaiPlugin<T>;
}
export type {
	DocsbotaiEndpointInputs,
	DocsbotaiEndpointOutputs,
	DocsbotaiOperationName,
} from './endpoints/types';
