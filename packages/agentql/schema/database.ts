import { z } from 'zod';

export const AgentQLQueryResult = z
	.object({
		query: z.string().optional(),
		prompt: z.string().optional(),
		url: z.string().optional(),
		sourceType: z.enum(['url', 'html']).optional(),
		data: z.record(z.string(), z.unknown()),
		generatedQuery: z.string().nullable().optional(),
		requestId: z.string().optional(),
		updatedAt: z.coerce.date().optional(),
	})
	.loose();

export const AgentQLDocumentQueryResult = z
	.object({
		fileName: z.string().optional(),
		query: z.string().optional(),
		prompt: z.string().optional(),
		data: z.record(z.string(), z.unknown()),
		generatedQuery: z.string().nullable().optional(),
		requestId: z.string().optional(),
		updatedAt: z.coerce.date().optional(),
	})
	.loose();

export const AgentQLBrowserSession = z
	.object({
		sessionId: z.string(),
		cdpUrl: z.string(),
		baseUrl: z.string(),
		browserUaPreset: z.string().optional(),
		browserProfile: z.string().optional(),
		inactivityTimeoutSeconds: z.number().int().optional(),
		shutdownMode: z.string().optional(),
		subUserId: z.string().nullable().optional(),
		branding: z.boolean().optional(),
		browserStartupUrl: z.string().nullable().optional(),
		updatedAt: z.coerce.date().optional(),
	})
	.loose();

export const AgentQLAccountUsage = z
	.object({
		currentSubscription: z
			.record(z.string(), z.unknown())
			.nullable()
			.optional(),
		apiKeyUsage: z.record(z.string(), z.unknown()),
		totalAccountUsage: z.record(z.string(), z.unknown()),
		updatedAt: z.coerce.date().optional(),
	})
	.loose();

export type AgentQLQueryResult = z.infer<typeof AgentQLQueryResult>;
export type AgentQLDocumentQueryResult = z.infer<
	typeof AgentQLDocumentQueryResult
>;
export type AgentQLBrowserSession = z.infer<typeof AgentQLBrowserSession>;
export type AgentQLAccountUsage = z.infer<typeof AgentQLAccountUsage>;
