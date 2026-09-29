import { z } from 'zod';

export const ConvoloAiAgent = z.object({
	id: z.string(),
	name: z.string().optional(),
	email: z.string().optional(),
	status: z.boolean().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	updatedAt: z.coerce.date().nullable().optional(),
});

export const ConvoloAiCall = z.object({
	id: z.string(),
	callId: z.string().optional(),
	status: z.string().optional(),
	widgetId: z.string().optional(),
	leadNumber: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const ConvoloAiLead = z.object({
	id: z.string(),
	name: z.string().optional(),
	phone: z.string().optional(),
	email: z.string().optional(),
	status: z.string().optional(),
	rating: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const ConvoloAiWidget = z.object({
	id: z.string(),
	siteName: z.string().optional(),
	status: z.boolean().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type ConvoloAiAgent = z.infer<typeof ConvoloAiAgent>;
export type ConvoloAiCall = z.infer<typeof ConvoloAiCall>;
export type ConvoloAiLead = z.infer<typeof ConvoloAiLead>;
export type ConvoloAiWidget = z.infer<typeof ConvoloAiWidget>;
