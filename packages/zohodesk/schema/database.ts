import { z } from 'zod';

// Only fields that both the list and the get responses carry. Upserts replace
// the stored row, so a list call must not wipe a field only a get returns.
// Timestamps stay as Zoho's ISO strings.

export const ZohoDeskTicket = z.object({
	id: z.string(),
	ticketNumber: z.string().nullable().optional(),
	subject: z.string().nullable().optional(),
	status: z.string().nullable().optional(),
	statusType: z.string().nullable().optional(),
	priority: z.string().nullable().optional(),
	channel: z.string().nullable().optional(),
	category: z.string().nullable().optional(),
	departmentId: z.string().nullable().optional(),
	contactId: z.string().nullable().optional(),
	accountId: z.string().nullable().optional(),
	assigneeId: z.string().nullable().optional(),
	teamId: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	dueDate: z.string().nullable().optional(),
	closedTime: z.string().nullable().optional(),
	createdTime: z.string().nullable().optional(),
	webUrl: z.string().nullable().optional(),
});

export const ZohoDeskContact = z.object({
	id: z.string(),
	firstName: z.string().nullable().optional(),
	lastName: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	secondaryEmail: z.string().nullable().optional(),
	phone: z.string().nullable().optional(),
	mobile: z.string().nullable().optional(),
	type: z.string().nullable().optional(),
	accountId: z.string().nullable().optional(),
	ownerId: z.string().nullable().optional(),
	createdTime: z.string().nullable().optional(),
	webUrl: z.string().nullable().optional(),
});

export type ZohoDeskTicket = z.infer<typeof ZohoDeskTicket>;
export type ZohoDeskContact = z.infer<typeof ZohoDeskContact>;
