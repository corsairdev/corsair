import { z } from 'zod';

export const OutlookMessage = z.object({
	id: z.string(),
	subject: z.string().optional(),
	bodyPreview: z.string().optional(),
	from: z.string().optional(),
	toRecipients: z.string().optional(),
	ccRecipients: z.string().optional(),
	isRead: z.boolean().optional(),
	isDraft: z.boolean().optional(),
	hasAttachments: z.boolean().optional(),
	importance: z.string().optional(),
	conversationId: z.string().optional(),
	parentFolderId: z.string().optional(),
	sentDateTime: z.coerce.date().nullable().optional(),
	receivedDateTime: z.coerce.date().nullable().optional(),
	createdAt: z.coerce.date().nullable().optional(),
	webLink: z.string().optional(),
});

export const OutlookEvent = z.object({
	id: z.string(),
	subject: z.string().optional(),
	bodyPreview: z.string().optional(),
	start: z.string().optional(),
	end: z.string().optional(),
	isAllDay: z.boolean().optional(),
	isCancelled: z.boolean().optional(),
	isOrganizer: z.boolean().optional(),
	isOnlineMeeting: z.boolean().optional(),
	location: z.string().optional(),
	calendarId: z.string().optional(),
	organizer: z.string().optional(),
	importance: z.string().optional(),
	sensitivity: z.string().optional(),
	showAs: z.string().optional(),
	webLink: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const OutlookCalendar = z.object({
	id: z.string(),
	name: z.string().optional(),
	color: z.string().optional(),
	hexColor: z.string().optional(),
	isDefaultCalendar: z.boolean().optional(),
	canEdit: z.boolean().optional(),
	canShare: z.boolean().optional(),
	owner: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const OutlookContact = z.object({
	id: z.string(),
	displayName: z.string().optional(),
	givenName: z.string().optional(),
	surname: z.string().optional(),
	emailAddresses: z.string().optional(),
	mobilePhone: z.string().optional(),
	businessPhones: z.string().optional(),
	jobTitle: z.string().optional(),
	companyName: z.string().optional(),
	department: z.string().optional(),
	officeLocation: z.string().optional(),
	parentFolderId: z.string().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export const OutlookMailFolder = z.object({
	id: z.string(),
	displayName: z.string().optional(),
	parentFolderId: z.string().optional(),
	totalItemCount: z.number().optional(),
	unreadItemCount: z.number().optional(),
	childFolderCount: z.number().optional(),
	isHidden: z.boolean().optional(),
	createdAt: z.coerce.date().nullable().optional(),
});

export type OutlookMessage = z.infer<typeof OutlookMessage>;
export type OutlookEvent = z.infer<typeof OutlookEvent>;
export type OutlookCalendar = z.infer<typeof OutlookCalendar>;
export type OutlookContact = z.infer<typeof OutlookContact>;
export type OutlookMailFolder = z.infer<typeof OutlookMailFolder>;
