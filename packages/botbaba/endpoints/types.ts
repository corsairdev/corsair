import { z } from 'zod';

/**
 * Shared entity and operation shapes for the Botbaba chatbot platform.
 *
 * Botbaba does not publish a public OpenAPI spec. Shapes are modeled from
 * Composio's integration catalog (bots, conversations, messages, deployments,
 * analytics) and standard WhatsApp chatbot platform conventions.
 */

const S = z.string().nullable().optional();
const N = z.number().nullable().optional();
const B = z.boolean().nullable().optional();

/* -------------------------------------------------------------------------- */
/* entities                                                                    */
/* -------------------------------------------------------------------------- */

export const BotbabaBotSchema = z
	.object({
		id: z.string(),
		name: z.string(),
		description: S,
		status: S,
		channel: S,
		welcomeMessage: S,
		greetingMessage: S,
		isActive: B,
		createdAt: S,
		updatedAt: S,
	})
	.loose();
export type BotbabaBot = z.infer<typeof BotbabaBotSchema>;

export const BotbabaConversationSchema = z
	.object({
		id: z.string(),
		botId: z.string(),
		userId: S,
		userName: S,
		channel: S,
		status: S,
		messageCount: N,
		createdAt: S,
		updatedAt: S,
	})
	.loose();
export type BotbabaConversation = z.infer<typeof BotbabaConversationSchema>;

export const BotbabaMessageSchema = z
	.object({
		id: z.string(),
		conversationId: z.string(),
		content: z.string(),
		sender: S,
		type: S,
		createdAt: S,
	})
	.loose();
export type BotbabaMessage = z.infer<typeof BotbabaMessageSchema>;

export const BotbabaDeploymentSchema = z
	.object({
		id: z.string(),
		botId: z.string(),
		channel: z.string(),
		status: S,
		deployedAt: S,
	})
	.loose();
export type BotbabaDeployment = z.infer<typeof BotbabaDeploymentSchema>;

export const BotbabaAnalyticsSummarySchema = z
	.object({
		botId: z.string(),
		totalConversations: N,
		totalMessages: N,
		activeUsers: N,
		averageResponseTime: N,
		period: S,
		startDate: S,
		endDate: S,
	})
	.loose();
export type BotbabaAnalyticsSummary = z.infer<
	typeof BotbabaAnalyticsSummarySchema
>;

/* -------------------------------------------------------------------------- */
/* endpoint input schemas                                                      */
/* -------------------------------------------------------------------------- */

const BotsCreateInput = z.object({
	name: z.string(),
	description: z.string().optional(),
	channel: z.string().optional(),
	welcomeMessage: z.string().optional(),
	greetingMessage: z.string().optional(),
});

const BotsGetInput = z.object({
	botId: z.string(),
});

const BotsListInput = z
	.object({
		page: z.number().optional(),
		limit: z.number().optional(),
		status: z.string().optional(),
	})
	.optional()
	.default({});

const BotsUpdateInput = z.object({
	botId: z.string(),
	name: z.string().optional(),
	description: z.string().optional(),
	welcomeMessage: z.string().optional(),
	greetingMessage: z.string().optional(),
	isActive: z.boolean().optional(),
});

const BotsDeleteInput = z.object({
	botId: z.string(),
});

const ConversationsListInput = z.object({
	botId: z.string(),
	page: z.number().optional(),
	limit: z.number().optional(),
	status: z.string().optional(),
});

const ConversationsGetInput = z.object({
	conversationId: z.string(),
});

const MessagesSendInput = z.object({
	botId: z.string(),
	conversationId: z.string(),
	content: z.string(),
	type: z.string().optional(),
});

const MessagesListInput = z.object({
	conversationId: z.string(),
	page: z.number().optional(),
	limit: z.number().optional(),
});

const DeploymentsDeployInput = z.object({
	botId: z.string(),
	channel: z.string(),
});

const DeploymentsGetStatusInput = z.object({
	botId: z.string(),
	deploymentId: z.string().optional(),
});

const AnalyticsGetSummaryInput = z.object({
	botId: z.string(),
	period: z.string().optional(),
	startDate: z.string().optional(),
	endDate: z.string().optional(),
});

/* -------------------------------------------------------------------------- */
/* endpoint output schemas                                                     */
/* -------------------------------------------------------------------------- */

const BotsCreateOutput = BotbabaBotSchema;
const BotsGetOutput = BotbabaBotSchema;
const BotsListOutput = z.object({
	bots: z.array(BotbabaBotSchema),
	total: N,
	page: N,
	limit: N,
});
const BotsUpdateOutput = BotbabaBotSchema;
const BotsDeleteOutput = z.object({}).loose();

const ConversationsListOutput = z.object({
	conversations: z.array(BotbabaConversationSchema),
	total: N,
	page: N,
	limit: N,
});
const ConversationsGetOutput = BotbabaConversationSchema;

const MessagesSendOutput = BotbabaMessageSchema;
const MessagesListOutput = z.object({
	messages: z.array(BotbabaMessageSchema),
	total: N,
	page: N,
	limit: N,
});

const DeploymentsDeployOutput = BotbabaDeploymentSchema;
const DeploymentsGetStatusOutput = BotbabaDeploymentSchema;

const AnalyticsGetSummaryOutput = BotbabaAnalyticsSummarySchema;

/* -------------------------------------------------------------------------- */
/* collected schema maps                                                       */
/* -------------------------------------------------------------------------- */

export const BotbabaEndpointInputSchemas = {
	botsCreate: BotsCreateInput,
	botsGet: BotsGetInput,
	botsList: BotsListInput,
	botsUpdate: BotsUpdateInput,
	botsDelete: BotsDeleteInput,
	conversationsList: ConversationsListInput,
	conversationsGet: ConversationsGetInput,
	messagesSend: MessagesSendInput,
	messagesList: MessagesListInput,
	deploymentsDeploy: DeploymentsDeployInput,
	deploymentsGetStatus: DeploymentsGetStatusInput,
	analyticsGetSummary: AnalyticsGetSummaryInput,
} as const;

export const BotbabaEndpointOutputSchemas = {
	botsCreate: BotsCreateOutput,
	botsGet: BotsGetOutput,
	botsList: BotsListOutput,
	botsUpdate: BotsUpdateOutput,
	botsDelete: BotsDeleteOutput,
	conversationsList: ConversationsListOutput,
	conversationsGet: ConversationsGetOutput,
	messagesSend: MessagesSendOutput,
	messagesList: MessagesListOutput,
	deploymentsDeploy: DeploymentsDeployOutput,
	deploymentsGetStatus: DeploymentsGetStatusOutput,
	analyticsGetSummary: AnalyticsGetSummaryOutput,
} as const;

/* -------------------------------------------------------------------------- */
/* inferred TypeScript types                                                   */
/* -------------------------------------------------------------------------- */

export type BotbabaEndpointInputs = {
	[K in keyof typeof BotbabaEndpointInputSchemas]: z.infer<
		(typeof BotbabaEndpointInputSchemas)[K]
	>;
};

export type BotbabaEndpointOutputs = {
	[K in keyof typeof BotbabaEndpointOutputSchemas]: z.infer<
		(typeof BotbabaEndpointOutputSchemas)[K]
	>;
};
