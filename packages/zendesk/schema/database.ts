import { z } from 'zod';

export const ZendeskTicket = z.object({
	id: z.number(),
	subject: z.string().optional().nullable(),
	description: z.string().optional().nullable(),
	status: z.string().optional().nullable(),
	priority: z.string().optional().nullable(),
	requesterId: z.number().optional().nullable(),
	assigneeId: z.number().optional().nullable(),
	organizationId: z.number().optional().nullable(),
	groupId: z.number().optional().nullable(),
	createdAt: z.coerce.date().optional().nullable(),
	updatedAt: z.coerce.date().optional().nullable(),
});

export const ZendeskUser = z.object({
	id: z.number(),
	name: z.string().optional().nullable(),
	email: z.string().optional().nullable(),
	role: z.string().optional().nullable(),
	active: z.boolean().optional().nullable(),
	timeZone: z.string().optional().nullable(),
	locale: z.string().optional().nullable(),
	createdAt: z.coerce.date().optional().nullable(),
	updatedAt: z.coerce.date().optional().nullable(),
});

export const ZendeskComment = z.object({
	id: z.number(),
	ticketId: z.number().optional().nullable(),
	body: z.string().optional().nullable(),
	authorId: z.number().optional().nullable(),
	public: z.boolean().optional().nullable(),
	createdAt: z.coerce.date().optional().nullable(),
});

export type ZendeskTicket = z.infer<typeof ZendeskTicket>;
export type ZendeskUser = z.infer<typeof ZendeskUser>;
export type ZendeskComment = z.infer<typeof ZendeskComment>;
