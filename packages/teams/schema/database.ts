import { z } from 'zod';

export const TeamsTeam = z.object({
	id: z.string(),
	displayName: z.string().optional(),
	description: z.string().nullable().optional(),
	internalId: z.string().optional(),
	classification: z.string().nullable().optional(),
	specialization: z.string().optional(),
	visibility: z.string().optional(),
	webUrl: z.string().optional(),
	isArchived: z.boolean().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const TeamsChannel = z.object({
	id: z.string(),
	teamId: z.string(),
	displayName: z.string().optional(),
	description: z.string().nullable().optional(),
	email: z.string().optional(),
	webUrl: z.string().optional(),
	membershipType: z.string().optional(),
	isFavoriteByDefault: z.boolean().nullable().optional(),
	createdDateTime: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const TeamsMessage = z.object({
	id: z.string(),
	channelId: z.string().optional(),
	chatId: z.string().nullable().optional(),
	teamId: z.string().optional(),
	replyToId: z.string().nullable().optional(),
	messageType: z.string().optional(),
	createdDateTime: z.string().optional(),
	lastModifiedDateTime: z.string().optional(),
	deletedDateTime: z.string().nullable().optional(),
	subject: z.string().nullable().optional(),
	bodyContent: z.string().optional(),
	bodyContentType: z.string().optional(),
	importance: z.string().optional(),
	webUrl: z.string().nullable().optional(),
	fromUserId: z.string().nullable().optional(),
	fromUserDisplayName: z.string().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const TeamsMember = z.object({
	id: z.string(),
	teamId: z.string(),
	displayName: z.string().nullable().optional(),
	userId: z.string().nullable().optional(),
	email: z.string().nullable().optional(),
	tenantId: z.string().nullable().optional(),
	roles: z.array(z.string()).optional(),
});

export const TeamsChat = z.object({
	id: z.string(),
	topic: z.string().nullable().optional(),
	chatType: z.string().optional(),
	webUrl: z.string().optional(),
	tenantId: z.string().optional(),
	createdDateTime: z.string().optional(),
	lastUpdatedDateTime: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type TeamsTeam = z.infer<typeof TeamsTeam>;
export type TeamsChannel = z.infer<typeof TeamsChannel>;
export type TeamsMessage = z.infer<typeof TeamsMessage>;
export type TeamsMember = z.infer<typeof TeamsMember>;
export type TeamsChat = z.infer<typeof TeamsChat>;
