import { z } from 'zod';

// IDs are individual path segments, never paths or URL fragments.
export const id = z
	.string()
	.min(1)
	.refine(
		(value) => value !== '.' && value !== '..' && !/[\\/"'?#]/.test(value),
		'Invalid path segment',
	);
const team = { teamId: id };
const bot = { ...team, botId: id };
const pagination = z
	.object({
		page: z.number().optional(),
		perPage: z.number().optional(),
		totalCount: z.number().optional(),
		hasMorePages: z.boolean().optional(),
		viewableCount: z.number().optional(),
		planLimit: z.number().optional(),
	})
	.passthrough();
const paged = {
	page: z.number().int().nonnegative().optional(),
	perPage: z.number().int().positive().optional(),
};
const nullableText = z.string().nullable().optional();
// DocsBot accepts user-defined metadata and tool configuration without a fixed shape.
const metadata = z.record(z.string(), z.unknown());

// Response schemas accept null for every optional field: DocsBot returns null
// for fields it has not filled (a new source's faqs and indexedUrls).
export const teamSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		createdAt: z.string().nullish(),
		status: z.string().nullish(),
		questionCount: z.number().nullish(),
		pageCount: z.number().nullish(),
		sourceCount: z.number().nullish(),
		chunkCount: z.number().nullish(),
		botCount: z.number().nullish(),
		openAIKey: nullableText,
		plan: metadata.nullish(),
		roles: metadata.nullish(),
	})
	.passthrough();
const memberSchema = z
	.object({
		uid: z.string(),
		displayName: z.string().nullish(),
		email: z.string().nullish(),
		photoURL: z.string().nullish(),
		role: z.string().nullish(),
	})
	.passthrough();
export const botSchema = z
	.object({
		id: z.string(),
		name: z.string().nullish(),
		description: nullableText,
		privacy: z.string().nullish(),
		indexId: nullableText,
		model: nullableText,
		embeddingModel: nullableText,
		customPrompt: nullableText,
		language: nullableText,
		createdAt: z.string().nullish(),
		status: z.string().nullish(),
		questionCount: z.number().nullish(),
		pageCount: z.number().nullish(),
		sourceCount: z.number().nullish(),
		chunkCount: z.number().nullish(),
		rateLimitMessages: z.number().nullish(),
		rateLimitSeconds: z.number().nullish(),
		rateLimitIPAllowlist: z.array(z.string()).nullish(),
		logRetentionDays: z.number().nullish(),
		recordIP: z.boolean().nullish(),
		classify: z.boolean().nullish(),
		allowedDomains: z.array(z.string()).nullish(),
		color: z.string().nullish(),
		icon: z.string().nullish(),
		alignment: z.string().nullish(),
		botIcon: z.union([z.string(), z.literal(false)]).nullish(),
		logo: z.string().nullish(),
		branding: z.boolean().nullish(),
		supportLink: z.string().nullish(),
		showButtonLabel: z.union([z.string(), z.literal(false)]).nullish(),
		showCopyButton: z.boolean().nullish(),
		hideSources: z.boolean().nullish(),
		allowSourceDownloads: z.boolean().nullish(),
		labels: metadata.nullish(),
		tools: metadata.nullish(),
		glossary: z
			.array(z.object({ word: z.string(), translation: z.string() }))
			.nullish(),
		retrieverTags: z
			.array(z.object({ key: z.string(), description: z.string() }))
			.nullish(),
	})
	.passthrough();
export const sourceSchema = z
	.object({
		id: z.string(),
		type: z.string().nullish(),
		status: z.string().nullish(),
		title: nullableText,
		url: nullableText,
		file: nullableText,
		files: z
			.array(z.object({ p: z.string(), n: z.number().nullish() }))
			.nullish(),
		processedPages: z
			.object({ count: z.number(), total: z.number() })
			.nullish(),
		faqs: z
			.array(z.object({ question: z.string(), answer: z.string() }))
			.nullish(),
		indexedUrls: z
			.array(z.object({ source: z.string(), title: z.string() }))
			.nullish(),
		warnsList: z.array(z.string()).nullish(),
		carbonFiles: z
			.union([
				z.number(),
				z.array(
					z
						.object({
							id: z.string().nullish(),
							type: z.string().nullish(),
							name: z.string().nullish(),
							url: z.string().nullish(),
						})
						.passthrough(),
				),
			])
			.nullish(),
		createdAt: z.string().nullish(),
		pageCount: z.number().nullish(),
		chunkCount: z.number().nullish(),
		tags: z.array(z.string()).nullish(),
		scheduleInterval: z.string().nullish(),
		processImages: z.boolean().nullish(),
		ocr: z.boolean().nullish(),
	})
	.passthrough();
const messageSchema = z.object({ message: z.string() }).passthrough();
const conversationSchema = z
	.object({
		id: z.string(),
		createdAt: z.string().nullish(),
		updatedAt: z.string().nullish(),
		title: nullableText,
		summary: nullableText,
		sentiment: nullableText,
		model: nullableText,
		email: nullableText,
		metadata: metadata.nullish(),
		answered: z.boolean().nullish(),
		resolved: z.string().nullish(),
		escalated: z.string().nullish(),
		alias: z.string().nullish(),
		ip: z.string().nullish(),
		truncated: z.boolean().nullish(),
		topic: z.string().nullish(),
		testing: z.boolean().nullish(),
		channel: z.string().nullish(),
	})
	.passthrough();
const leadSchema = z
	.object({
		id: z.string(),
		createdAt: z.string().nullish(),
		updatedAt: nullableText,
		metadata: metadata.nullish(),
		ip: z.string().nullish(),
		alias: z.string().nullish(),
		email: nullableText,
	})
	.passthrough();
const questionSchema = z
	.object({
		id: z.string(),
		createdAt: z.string().nullish(),
		question: nullableText,
		answer: nullableText,
		standaloneQuestion: nullableText,
		sources: z.array(metadata).nullish(),
		rating: z.number().nullish(),
		escalation: z.boolean().nullish(),
		deleted: z.boolean().nullish(),
		couldAnswer: z.boolean().nullish(),
		metadata: metadata.nullish(),
	})
	.passthrough();
const researchSchema = z
	.object({
		jobId: z.string(),
		status: z.string().nullish(),
		title: nullableText,
		question: nullableText,
		response: metadata.nullish(),
		createdAt: nullableText,
		completedAt: nullableText,
		cancelledAt: nullableText,
	})
	.passthrough();
const webhookSchema = z
	.object({
		id: z.string(),
		targetUrl: z.string().nullish(),
		events: z.array(z.string()).nullish(),
		status: z.string().nullish(),
		label: nullableText,
		expirationDate: nullableText,
	})
	.passthrough();
const botFields = {
	name: z.string().optional(),
	description: z.string().optional(),
	privacy: z.enum(['public', 'private']).optional(),
	language: z.string().optional(),
	model: z.string().optional(),
	tools: metadata.optional(),
	retrieverTags: z
		.array(z.object({ key: z.string(), description: z.string() }))
		.optional(),
};

export const DocsbotaiEndpointInputSchemas = {
	listTeams: z.object({}),
	getTeam: z.object(team),
	updateTeam: z.object({
		...team,
		name: z.string().optional(),
		openAIKey: z.union([z.string(), z.literal(false)]).optional(),
	}),
	listTeamMembers: z.object(team),
	listBots: z.object({
		...team,
		page: paged.page,
		pageSize: z.number().int().min(1).max(100).optional(),
		q: z.string().optional(),
		privacy: z.enum(['public', 'private']).optional(),
		sort: z.enum(['name', 'newest', 'ai-credits', 'conversations']).optional(),
		order: z.enum(['asc', 'desc']).optional(),
		view: z.enum(['full', 'summary']).optional(),
	}),
	getBot: z.object(bot),
	createBot: z.object({
		...team,
		...botFields,
		name: z.string().min(1),
		embeddingModel: z.string().optional(),
		copyFrom: z.string().optional(),
	}),
	updateBot: z.object({
		...bot,
		...botFields,
		customPrompt: z.string().optional(),
		allowedDomains: z.array(z.string()).optional(),
		color: z.string().optional(),
		icon: z.string().optional(),
		alignment: z.enum(['left', 'right']).optional(),
		botIcon: z.union([z.string(), z.literal(false)]).optional(),
		logo: z.string().optional(),
		branding: z.boolean().optional(),
		supportLink: z.string().optional(),
		showButtonLabel: z.union([z.string(), z.literal(false)]).optional(),
		showCopyButton: z.boolean().optional(),
		hideSources: z.boolean().optional(),
		allowSourceDownloads: z.boolean().optional(),
		labels: metadata.optional(),
		glossary: z
			.array(z.object({ word: z.string(), translation: z.string() }))
			.optional(),
	}),
	deleteBot: z.object(bot),
	listSources: z.object({
		...bot,
		page: paged.page,
		limit: z.number().int().positive().optional(),
		tags: z.string().optional(),
	}),
	getSource: z.object({ ...bot, sourceId: id }),
	createSource: z.object({
		...bot,
		type: z.enum([
			'url',
			'document',
			'sitemap',
			'wp',
			'urls',
			'csv',
			'rss',
			'qa',
			'youtube',
		]),
		title: z.string().optional(),
		url: z.string().optional(),
		file: z.string().optional(),
		fileDir: z.string().optional(),
		faqs: z
			.array(z.object({ question: z.string(), answer: z.string() }))
			.optional(),
		scheduleInterval: z.enum(['daily', 'weekly', 'monthly', 'none']).optional(),
		processImages: z.boolean().optional(),
		ocr: z.boolean().optional(),
		tags: z.array(z.string()).optional(),
	}),
	retrySource: z.object({ ...bot, sourceId: id }),
	deleteSource: z.object({ ...bot, sourceId: id }),
	getUploadUrl: z.object({ ...bot, fileName: z.string().min(1) }),
	// The signed URL is itself the upload credential; content is raw binary.
	uploadFile: z.object({
		uploadUrl: z.string().url(),
		data: z.instanceof(Uint8Array),
	}),
	listQuestions: z.object({
		...bot,
		...paged,
		ascending: z.boolean().optional(),
		ip: z.string().optional(),
		rating: z.union([z.literal(-1), z.literal(0), z.literal(1)]).optional(),
		escalated: z.boolean().optional(),
		couldAnswer: z.boolean().optional(),
		startDate: z.string().optional(),
		endDate: z.string().optional(),
	}),
	deleteQuestion: z.object({ ...bot, questionId: id }),
	listConversations: z.object({ ...bot, ...paged }),
	deleteConversation: z.object({ ...bot, conversationId: id }),
	listLeads: z.object({
		...bot,
		...paged,
		startDate: z.string().optional(),
		endDate: z.string().optional(),
	}),
	deleteLead: z.object({ ...bot, leadId: id }),
	listResearchJobs: z.object({ ...bot, ...paged }),
	getStats: z
		.object({
			...bot,
			timeDelta: z.number().min(0).max(365).optional(),
			startDate: z.string().optional(),
			endDate: z.string().optional(),
		})
		.refine(
			(value) =>
				(value.startDate === undefined) === (value.endDate === undefined),
			{
				message: 'startDate and endDate must be provided together',
			},
		),
	getReports: z.object({ ...bot, month: z.string().optional() }),
	captureLead: z.object({ ...bot, conversationId: id, metadata }),
	getTicket: z.object({ ...bot, conversationId: id }),
	rateAnswer: z.object({
		...bot,
		answerId: id,
		rating: z.union([z.literal(-1), z.literal(0), z.literal(1)]),
	}),
	search: z.object({
		...bot,
		query: z.string().min(1),
		top_k: z.number().int().nullable().optional(),
		autocut: z.union([z.boolean(), z.number().int()]).optional(),
		alpha: z.number().min(0).max(1).optional(),
		use_glossary: z.boolean().optional(),
		tags: z.array(z.string()).nullable().optional(),
		include_untagged: z.boolean().optional(),
		source_id: z.string().nullable().optional(),
		file_id: z.string().nullable().optional(),
	}),
	listWebhooks: z.object(bot),
	getWebhook: z.object({ ...bot, webhookId: id }),
	createWebhook: z.object({
		...bot,
		targetUrl: z.string().url(),
		events: z.array(
			z.enum([
				'lead.created',
				'deep_research.done',
				'conversation.escalated',
				'conversation.rated',
			]),
		),
		label: z.string().optional(),
		source: z.string().optional(),
		expirationDate: z.string().optional(),
	}),
	updateWebhook: z.object({
		...bot,
		webhookId: id,
		targetUrl: z.string().url().optional(),
		status: z.string().optional(),
		label: z.string().optional(),
		expirationDate: z.string().nullable().optional(),
	}),
	deleteWebhook: z.object({ ...bot, webhookId: id }),
} as const;

const results = z.array(
	z
		.object({
			title: nullableText,
			url: nullableText,
			fileId: nullableText,
			page: z.number().nullish(),
			content: z.string(),
		})
		.passthrough(),
);
export const DocsbotaiEndpointOutputSchemas = {
	listTeams: z.array(teamSchema),
	getTeam: teamSchema,
	updateTeam: teamSchema,
	listTeamMembers: z.array(memberSchema),
	listBots: z.union([
		z.array(botSchema),
		z.object({
			bots: z.array(botSchema),
			totalCount: z.number(),
			page: z.number(),
			pageSize: z.number(),
			totalPages: z.number(),
		}),
	]),
	getBot: botSchema,
	createBot: botSchema,
	updateBot: botSchema,
	deleteBot: messageSchema,
	listSources: z.object({ sources: z.array(sourceSchema), pagination }),
	getSource: sourceSchema,
	createSource: sourceSchema,
	retrySource: sourceSchema,
	deleteSource: messageSchema,
	getUploadUrl: z.object({ url: z.string(), file: z.string() }),
	uploadFile: z.void(),
	listQuestions: z.object({ questions: z.array(questionSchema), pagination }),
	deleteQuestion: messageSchema,
	listConversations: z.object({
		conversations: z.array(conversationSchema),
		pagination,
	}),
	deleteConversation: messageSchema,
	listLeads: z.object({ leads: z.array(leadSchema), pagination }),
	deleteLead: messageSchema,
	listResearchJobs: z.object({ jobs: z.array(researchSchema), pagination }),
	// Daily series hold null for days without data (couldAnswerData, csatData).
	getStats: z
		.object({
			totalCount: z.number().nullish(),
			totalMessages: z.number().nullish(),
			totalConversations: z.number().nullish(),
			resolutionRate: z.string().nullish(),
			couldAnswerRate: z.string().nullish(),
			deflectionRate: z.string().nullish(),
			timeSaved: z.number().nullish(),
			labels: z.array(z.string()).nullish(),
			countData: z.array(z.number().nullable()).nullish(),
			negativeData: z.array(z.number().nullable()).nullish(),
			positiveData: z.array(z.number().nullable()).nullish(),
			couldAnswerData: z.array(z.number().nullable()).nullish(),
			escalatedData: z.array(z.number().nullable()).nullish(),
			messagesData: z.array(z.number().nullable()).nullish(),
			percentageLabels: z.array(z.string()).nullish(),
			counts: z.array(z.number().nullable()).nullish(),
			escalatedLabels: z.array(z.string()).nullish(),
			escalatedCounts: z.array(z.number().nullable()).nullish(),
			answerLabels: z.array(z.string()).nullish(),
			answerCounts: z.array(z.number().nullable()).nullish(),
			conversationData: z.array(z.number().nullable()).nullish(),
			resolvedConfirmedData: z.array(z.number().nullable()).nullish(),
			resolvedAssumedData: z.array(z.number().nullable()).nullish(),
			unresolvedData: z.array(z.number().nullable()).nullish(),
			escalatedHandledData: z.array(z.number().nullable()).nullish(),
			escalatedTriggeredData: z.array(z.number().nullable()).nullish(),
			csatData: z.array(z.number().nullable()).nullish(),
			answeredRateData: z.array(z.number().nullable()).nullish(),
			conversationDeflectionData: z.array(z.number().nullable()).nullish(),
			avgSentimentData: z.array(z.number().nullable()).nullish(),
			resolvedLabels: z.array(z.string()).nullish(),
			resolvedCounts: z.array(z.number().nullable()).nullish(),
			conversationEscalatedLabels: z.array(z.string()).nullish(),
			conversationEscalatedCounts: z.array(z.number().nullable()).nullish(),
			sentimentLabels: z.array(z.string()).nullish(),
			sentimentCounts: z.array(z.number().nullable()).nullish(),
			conversationAnsweredLabels: z.array(z.string()).nullish(),
			conversationAnsweredCounts: z.array(z.number().nullable()).nullish(),
			conversationTopicLabels: z.array(z.string()).nullish(),
			conversationTopicData: z
				.record(z.string(), z.array(z.number().nullable()))
				.nullish(),
			conversationTopicPieLabels: z.array(z.string()).nullish(),
			conversationTopicCounts: z.array(z.number().nullable()).nullish(),
		})
		.passthrough(),
	getReports: z.object({
		availableReports: z.array(z.string()),
		report: z
			.object({
				month: z.string().nullish(),
				totalQuestions: z.number().nullish(),
				resolved: z.number().nullish(),
				unresolved: z.number().nullish(),
			})
			.passthrough()
			.nullable(),
	}),
	captureLead: z.boolean(),
	getTicket: z.object({ subject: z.string(), message: z.string() }),
	rateAnswer: z.boolean(),
	search: results,
	listWebhooks: z.object({ webhooks: z.array(webhookSchema) }).passthrough(),
	getWebhook: webhookSchema,
	createWebhook: webhookSchema,
	updateWebhook: webhookSchema,
	deleteWebhook: messageSchema,
} as const;

export type DocsbotaiOperationName = keyof typeof DocsbotaiEndpointInputSchemas;
export type DocsbotaiEndpointInputs = {
	[K in DocsbotaiOperationName]: z.infer<
		(typeof DocsbotaiEndpointInputSchemas)[K]
	>;
};
export type DocsbotaiEndpointOutputs = {
	[K in DocsbotaiOperationName]: z.infer<
		(typeof DocsbotaiEndpointOutputSchemas)[K]
	>;
};
