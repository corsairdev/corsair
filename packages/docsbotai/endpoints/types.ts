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

export const teamSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		createdAt: z.string().optional(),
		status: z.string().optional(),
		questionCount: z.number().optional(),
		pageCount: z.number().optional(),
		sourceCount: z.number().optional(),
		chunkCount: z.number().optional(),
		botCount: z.number().optional(),
		openAIKey: nullableText,
		plan: metadata.optional(),
		roles: metadata.optional(),
	})
	.passthrough();
const memberSchema = z
	.object({
		uid: z.string(),
		displayName: z.string().optional(),
		email: z.string().optional(),
		photoURL: z.string().optional(),
		role: z.string().optional(),
	})
	.passthrough();
export const botSchema = z
	.object({
		id: z.string(),
		name: z.string().optional(),
		description: nullableText,
		privacy: z.string().optional(),
		indexId: nullableText,
		model: nullableText,
		embeddingModel: nullableText,
		customPrompt: nullableText,
		language: nullableText,
		createdAt: z.string().optional(),
		status: z.string().optional(),
		questionCount: z.number().optional(),
		pageCount: z.number().optional(),
		sourceCount: z.number().optional(),
		chunkCount: z.number().optional(),
		rateLimitMessages: z.number().optional(),
		rateLimitSeconds: z.number().optional(),
		rateLimitIPAllowlist: z.array(z.string()).optional(),
		logRetentionDays: z.number().optional(),
		recordIP: z.boolean().optional(),
		classify: z.boolean().optional(),
		allowedDomains: z.array(z.string()).optional(),
		color: z.string().optional(),
		icon: z.string().optional(),
		alignment: z.string().optional(),
		botIcon: z.union([z.string(), z.literal(false)]).optional(),
		logo: z.string().optional(),
		branding: z.boolean().optional(),
		supportLink: z.string().optional(),
		showButtonLabel: z.union([z.string(), z.literal(false)]).optional(),
		showCopyButton: z.boolean().optional(),
		hideSources: z.boolean().optional(),
		allowSourceDownloads: z.boolean().optional(),
		labels: metadata.optional(),
		tools: metadata.optional(),
		glossary: z
			.array(z.object({ word: z.string(), translation: z.string() }))
			.optional(),
		retrieverTags: z
			.array(z.object({ key: z.string(), description: z.string() }))
			.optional(),
	})
	.passthrough();
export const sourceSchema = z
	.object({
		id: z.string(),
		type: z.string().optional(),
		status: z.string().optional(),
		title: nullableText,
		url: nullableText,
		file: nullableText,
		files: z
			.array(z.object({ p: z.string(), n: z.number().optional() }))
			.optional(),
		processedPages: z
			.object({ count: z.number(), total: z.number() })
			.optional(),
		faqs: z
			.array(z.object({ question: z.string(), answer: z.string() }))
			.optional(),
		indexedUrls: z
			.array(z.object({ source: z.string(), title: z.string() }))
			.optional(),
		warnsList: z.array(z.string()).optional(),
		carbonFiles: z
			.union([
				z.number(),
				z.array(
					z
						.object({
							id: z.string().optional(),
							type: z.string().optional(),
							name: z.string().optional(),
							url: z.string().optional(),
						})
						.passthrough(),
				),
			])
			.optional(),
		createdAt: z.string().optional(),
		pageCount: z.number().optional(),
		chunkCount: z.number().optional(),
		tags: z.array(z.string()).optional(),
		scheduleInterval: z.string().optional(),
		processImages: z.boolean().optional(),
		ocr: z.boolean().optional(),
	})
	.passthrough();
const messageSchema = z.object({ message: z.string() }).passthrough();
const conversationSchema = z
	.object({
		id: z.string(),
		createdAt: z.string().optional(),
		updatedAt: z.string().optional(),
		title: nullableText,
		summary: nullableText,
		sentiment: nullableText,
		model: nullableText,
		email: nullableText,
		metadata: metadata.nullable().optional(),
		answered: z.boolean().optional(),
		resolved: z.string().optional(),
		escalated: z.string().optional(),
		alias: z.string().optional(),
		ip: z.string().optional(),
		truncated: z.boolean().optional(),
		topic: z.string().optional(),
		testing: z.boolean().optional(),
		channel: z.string().optional(),
	})
	.passthrough();
const leadSchema = z
	.object({
		id: z.string(),
		createdAt: z.string().optional(),
		updatedAt: nullableText,
		metadata: metadata.optional(),
		ip: z.string().optional(),
		alias: z.string().optional(),
		email: nullableText,
	})
	.passthrough();
const questionSchema = z
	.object({
		id: z.string(),
		createdAt: z.string().optional(),
		question: nullableText,
		answer: nullableText,
		standaloneQuestion: nullableText,
		sources: z.array(metadata).nullable().optional(),
		rating: z.number().optional(),
		escalation: z.boolean().optional(),
		deleted: z.boolean().optional(),
		couldAnswer: z.boolean().nullable().optional(),
		metadata: metadata.optional(),
	})
	.passthrough();
const researchSchema = z
	.object({
		jobId: z.string(),
		status: z.string().optional(),
		title: nullableText,
		question: nullableText,
		response: metadata.nullable().optional(),
		createdAt: nullableText,
		completedAt: nullableText,
		cancelledAt: nullableText,
	})
	.passthrough();
const webhookSchema = z
	.object({
		id: z.string(),
		targetUrl: z.string().optional(),
		events: z.array(z.string()).optional(),
		status: z.string().optional(),
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
	getStats: z.object({
		...bot,
		timeDelta: z.number().min(0).max(365).optional(),
		startDate: z.string().optional(),
		endDate: z.string().optional(),
	}),
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
			page: z.number().nullable().optional(),
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
	getStats: z
		.object({
			totalCount: z.number().optional(),
			totalMessages: z.number().optional(),
			totalConversations: z.number().optional(),
			resolutionRate: z.string().optional(),
			couldAnswerRate: z.string().optional(),
			deflectionRate: z.string().optional(),
			timeSaved: z.number().optional(),
			labels: z.array(z.string()).optional(),
			countData: z.array(z.number()).optional(),
			negativeData: z.array(z.number()).optional(),
			positiveData: z.array(z.number()).optional(),
			couldAnswerData: z.array(z.number()).optional(),
			escalatedData: z.array(z.number()).optional(),
			messagesData: z.array(z.number()).optional(),
			percentageLabels: z.array(z.string()).optional(),
			counts: z.array(z.number()).optional(),
			escalatedLabels: z.array(z.string()).optional(),
			escalatedCounts: z.array(z.number()).optional(),
			answerLabels: z.array(z.string()).optional(),
			answerCounts: z.array(z.number()).optional(),
			conversationData: z.array(z.number()).optional(),
			resolvedConfirmedData: z.array(z.number()).optional(),
			resolvedAssumedData: z.array(z.number()).optional(),
			unresolvedData: z.array(z.number()).optional(),
			escalatedHandledData: z.array(z.number()).optional(),
			escalatedTriggeredData: z.array(z.number()).optional(),
			csatData: z.array(z.number()).optional(),
			answeredRateData: z.array(z.number()).optional(),
			conversationDeflectionData: z.array(z.number()).optional(),
			avgSentimentData: z.array(z.number()).optional(),
			resolvedLabels: z.array(z.string()).optional(),
			resolvedCounts: z.array(z.number()).optional(),
			conversationEscalatedLabels: z.array(z.string()).optional(),
			conversationEscalatedCounts: z.array(z.number()).optional(),
			sentimentLabels: z.array(z.string()).optional(),
			sentimentCounts: z.array(z.number()).optional(),
			conversationAnsweredLabels: z.array(z.string()).optional(),
			conversationAnsweredCounts: z.array(z.number()).optional(),
			conversationTopicLabels: z.array(z.string()).optional(),
			conversationTopicData: z
				.record(z.string(), z.array(z.number()))
				.optional(),
			conversationTopicPieLabels: z.array(z.string()).optional(),
			conversationTopicCounts: z.array(z.number()).optional(),
		})
		.passthrough(),
	getReports: z.object({
		availableReports: z.array(z.string()),
		report: z
			.object({
				month: z.string().optional(),
				totalQuestions: z.number().optional(),
				resolved: z.number().optional(),
				unresolved: z.number().optional(),
			})
			.passthrough()
			.nullable(),
	}),
	captureLead: z.boolean(),
	getTicket: z.object({ subject: z.string(), message: z.string() }),
	rateAnswer: z.boolean(),
	search: results,
	listWebhooks: z.array(webhookSchema),
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
