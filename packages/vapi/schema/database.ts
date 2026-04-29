import { z } from 'zod';

export const VapiAssistant = z.object({
	id: z.string(),
	orgId: z.string().optional(),
	name: z.string().nullable().optional(),
	firstMessage: z.string().nullable().optional(),
	serverUrl: z.string().nullable().optional(),
	hipaaEnabled: z.boolean().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const VapiCall = z.object({
	id: z.string(),
	orgId: z.string().optional(),
	type: z.string().optional(),
	status: z.string().optional(),
	endedReason: z.string().nullable().optional(),
	assistantId: z.string().nullable().optional(),
	phoneNumberId: z.string().nullable().optional(),
	squadId: z.string().nullable().optional(),
	cost: z.number().optional(),
	startedAt: z.coerce.date().nullable().optional(),
	endedAt: z.coerce.date().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const VapiPhoneNumber = z.object({
	id: z.string(),
	orgId: z.string().optional(),
	provider: z.string().optional(),
	number: z.string().optional(),
	name: z.string().nullable().optional(),
	assistantId: z.string().nullable().optional(),
	squadId: z.string().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const VapiSquad = z.object({
	id: z.string(),
	orgId: z.string().optional(),
	name: z.string().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const VapiTool = z.object({
	id: z.string(),
	orgId: z.string().optional(),
	type: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const VapiFile = z.object({
	id: z.string(),
	orgId: z.string().optional(),
	name: z.string().optional(),
	originalName: z.string().optional(),
	mimeType: z.string().optional(),
	size: z.number().optional(),
	status: z.string().optional(),
	url: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const VapiKnowledgeBase = z.object({
	id: z.string(),
	orgId: z.string().optional(),
	name: z.string().nullable().optional(),
	fileIds: z.array(z.string()).optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export type VapiAssistant = z.infer<typeof VapiAssistant>;
export type VapiCall = z.infer<typeof VapiCall>;
export type VapiPhoneNumber = z.infer<typeof VapiPhoneNumber>;
export type VapiSquad = z.infer<typeof VapiSquad>;
export type VapiTool = z.infer<typeof VapiTool>;
export type VapiFile = z.infer<typeof VapiFile>;
export type VapiKnowledgeBase = z.infer<typeof VapiKnowledgeBase>;
