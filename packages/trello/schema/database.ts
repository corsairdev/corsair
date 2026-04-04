import { z } from 'zod';

export const TrelloBoard = z.object({
	id: z.string(),
	name: z.string().optional(),
	desc: z.string().optional(),
	closed: z.boolean().optional(),
	idOrganization: z.string().nullable().optional(),
	url: z.string().optional(),
	shortUrl: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const TrelloList = z.object({
	id: z.string(),
	name: z.string().optional(),
	closed: z.boolean().optional(),
	idBoard: z.string().optional(),
	pos: z.number().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const TrelloCard = z.object({
	id: z.string(),
	name: z.string().optional(),
	desc: z.string().optional(),
	closed: z.boolean().optional(),
	idBoard: z.string().optional(),
	idList: z.string().optional(),
	pos: z.number().optional(),
	due: z.string().nullable().optional(),
	dueComplete: z.boolean().optional(),
	url: z.string().optional(),
	shortUrl: z.string().optional(),
	idMembers: z.array(z.string()).optional(),
	idLabels: z.array(z.string()).optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const TrelloMember = z.object({
	id: z.string(),
	username: z.string().optional(),
	fullName: z.string().optional(),
	email: z.string().nullable().optional(),
	avatarUrl: z.string().nullable().optional(),
	initials: z.string().optional(),
	memberType: z.string().optional(),
});

export const TrelloLabel = z.object({
	id: z.string(),
	name: z.string().optional(),
	color: z.string().nullable().optional(),
	idBoard: z.string().optional(),
});

export type TrelloBoard = z.infer<typeof TrelloBoard>;
export type TrelloList = z.infer<typeof TrelloList>;
export type TrelloCard = z.infer<typeof TrelloCard>;
export type TrelloMember = z.infer<typeof TrelloMember>;
export type TrelloLabel = z.infer<typeof TrelloLabel>;
