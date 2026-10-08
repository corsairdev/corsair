import { z } from 'zod';

// Filevine Project — https://developer.filevine.io/docs/v2-us/31e991e1bfac1-filevine-api-v2
// Project is the spine entity (matter/case) carrying phase, client, and custom sections.
export const FilevineProject = z.object({
	id: z.number().describe('Filevine native project ID'),
	projectId: z.number().optional(),
	projectName: z.string().optional(),
	name: z.string().optional(),
	number: z.string().optional(),
	projectTypeId: z.number().optional(),
	clientId: z.number().optional(),
	phaseName: z.string().optional(),
	isArchived: z.boolean().optional(),
	createdDate: z.string().optional(),
	modifiedDate: z.string().optional(),
});
export type FilevineProject = z.infer<typeof FilevineProject>;

// Filevine Contact — global contact cards + project attachments
export const FilevineContact = z.object({
	id: z.number().describe('Filevine native contact ID'),
	contactId: z.number().optional(),
	firstName: z.string().optional(),
	lastName: z.string().optional(),
	fullName: z.string().optional(),
	organization: z.string().optional(),
	emails: z.array(z.string()).optional(),
	phones: z.array(z.string()).optional(),
	createdDate: z.string().optional(),
	modifiedDate: z.string().optional(),
});
export type FilevineContact = z.infer<typeof FilevineContact>;

// Filevine Document — project-scoped files with folders/tags/versioning
export const FilevineDocument = z.object({
	id: z.number().describe('Filevine native document ID'),
	documentId: z.number().optional(),
	projectId: z.number().optional(),
	folderId: z.number().optional(),
	filename: z.string().optional(),
	size: z.number().optional(),
	contentType: z.string().optional(),
	tags: z.array(z.string()).optional(),
	sharedToPortal: z.boolean().optional(),
	version: z.number().optional(),
	uploadedBy: z.number().optional(),
	createdDate: z.string().optional(),
	modifiedDate: z.string().optional(),
});
export type FilevineDocument = z.infer<typeof FilevineDocument>;

// Filevine Note — project activity stream (note/task/portalMessage/phoneCall/text)
export const FilevineNote = z.object({
	id: z.number().describe('Filevine native note ID'),
	noteId: z.number().optional(),
	projectId: z.number().optional(),
	body: z.string().optional(),
	kind: z
		.enum(['note', 'task', 'portalMessage', 'phoneCall', 'text'])
		.optional(),
	pinned: z.boolean().optional(),
	authorId: z.number().optional(),
	mentions: z.array(z.number()).optional(),
	attachedDocuments: z.array(z.number()).optional(),
	createdDate: z.string().optional(),
	modifiedDate: z.string().optional(),
});
export type FilevineNote = z.infer<typeof FilevineNote>;

// Filevine Deadline — calendaring milestones with assignee + reminders
export const FilevineDeadline = z.object({
	id: z.number().describe('Filevine native deadline ID'),
	deadlineId: z.number().optional(),
	projectId: z.number().optional(),
	name: z.string().optional(),
	dueDate: z.string().optional(),
	status: z.enum(['open', 'completed', 'missed']).optional(),
	assigneeId: z.number().optional(),
	reminders: z
		.array(
			z.object({
				triggerOffsetMinutes: z.number().optional(),
				notifyUserIds: z.array(z.number()).optional(),
			}),
		)
		.optional(),
	createdDate: z.string().optional(),
});
export type FilevineDeadline = z.infer<typeof FilevineDeadline>;

// Filevine Task — assignable to-dos with priority/due dates
export const FilevineTask = z.object({
	id: z.number().describe('Filevine native task ID'),
	taskId: z.number().optional(),
	projectId: z.number().optional(),
	title: z.string().optional(),
	body: z.string().optional(),
	status: z.enum(['open', 'inProgress', 'completed', 'cancelled']).optional(),
	priority: z.enum(['low', 'normal', 'high', 'urgent']).optional(),
	dueDate: z.string().optional(),
	assigneeId: z.number().optional(),
	completedDate: z.string().optional(),
});
export type FilevineTask = z.infer<typeof FilevineTask>;

// Filevine Webhook Subscription
export const FilevineSubscription = z.object({
	id: z.string().describe('Filevine subscription ID'),
	subscriptionId: z.string().optional(),
	name: z.string().optional(),
	description: z.string().optional(),
	endpoint: z.string().optional(),
	signingKey: z.string().optional(),
	events: z.array(z.string()).optional(),
	createdDate: z.string().optional(),
});
export type FilevineSubscription = z.infer<typeof FilevineSubscription>;
