import type { RawWebhookRequest } from 'corsair/core';
import { readBodyRecord } from 'corsair/core';
import { z } from 'zod';

export const WebvizioProjectEventPayloadSchema = z
	.object({
		uuid: z.string().optional(),
		id: z.union([z.string(), z.number()]).optional(),
		name: z.string().optional(),
		description: z.string().optional(),
		url: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();

export const WebvizioTaskEventPayloadSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		uuid: z.string().optional(),
		project_id: z.union([z.string(), z.number()]).optional(),
		project_uuid: z.string().optional(),
		title: z.string().optional(),
		status: z.string().optional(),
		created_at: z.string().optional(),
		updated_at: z.string().optional(),
	})
	.passthrough();

export const WebvizioCommentEventPayloadSchema = z
	.object({
		id: z.union([z.string(), z.number()]).optional(),
		task_id: z.union([z.string(), z.number()]).optional(),
		project_id: z.union([z.string(), z.number()]).optional(),
		project_uuid: z.string().optional(),
		text: z.string().optional(),
		created_at: z.string().optional(),
	})
	.passthrough();

export const createWebvizioEventSchema = <T extends z.ZodTypeAny>(
	dataSchema: T,
) =>
	z
		.object({
			event: z.string(),
			payload: dataSchema.optional(),
			data: dataSchema.optional(),
			created_at: z.string().optional(),
			timestamp: z.union([z.string(), z.number()]).optional(),
		})
		.passthrough();

export const ProjectCreatedEventSchema = createWebvizioEventSchema(
	WebvizioProjectEventPayloadSchema,
);
export const ProjectUpdatedEventSchema = createWebvizioEventSchema(
	WebvizioProjectEventPayloadSchema,
);
export const ProjectDeletedEventSchema = createWebvizioEventSchema(
	WebvizioProjectEventPayloadSchema,
);

export const TaskCreatedEventSchema = createWebvizioEventSchema(
	WebvizioTaskEventPayloadSchema,
);
export const TaskUpdatedEventSchema = createWebvizioEventSchema(
	WebvizioTaskEventPayloadSchema,
);
export const TaskDeletedEventSchema = createWebvizioEventSchema(
	WebvizioTaskEventPayloadSchema,
);

export const CommentCreatedEventSchema = createWebvizioEventSchema(
	WebvizioCommentEventPayloadSchema,
);
export const CommentDeletedEventSchema = createWebvizioEventSchema(
	WebvizioCommentEventPayloadSchema,
);

export type ProjectCreatedEvent = z.infer<typeof ProjectCreatedEventSchema>;
export type ProjectUpdatedEvent = z.infer<typeof ProjectUpdatedEventSchema>;
export type ProjectDeletedEvent = z.infer<typeof ProjectDeletedEventSchema>;

export type TaskCreatedEvent = z.infer<typeof TaskCreatedEventSchema>;
export type TaskUpdatedEvent = z.infer<typeof TaskUpdatedEventSchema>;
export type TaskDeletedEvent = z.infer<typeof TaskDeletedEventSchema>;

export type CommentCreatedEvent = z.infer<typeof CommentCreatedEventSchema>;
export type CommentDeletedEvent = z.infer<typeof CommentDeletedEventSchema>;

export const WebvizioWebhookSchemas = {
	'projects.projectCreated': ProjectCreatedEventSchema,
	'projects.projectUpdated': ProjectUpdatedEventSchema,
	'projects.projectDeleted': ProjectDeletedEventSchema,
	'tasks.taskCreated': TaskCreatedEventSchema,
	'tasks.taskUpdated': TaskUpdatedEventSchema,
	'tasks.taskDeleted': TaskDeletedEventSchema,
	'comments.commentCreated': CommentCreatedEventSchema,
	'comments.commentDeleted': CommentDeletedEventSchema,
};

export type WebvizioWebhookOutputs = {
	projectCreated: ProjectCreatedEvent;
	projectUpdated: ProjectUpdatedEvent;
	projectDeleted: ProjectDeletedEvent;
	taskCreated: TaskCreatedEvent;
	taskUpdated: TaskUpdatedEvent;
	taskDeleted: TaskDeletedEvent;
	commentCreated: CommentCreatedEvent;
	commentDeleted: CommentDeletedEvent;
};

export function createWebvizioMatch(eventType: string) {
	return (request: RawWebhookRequest): boolean => {
		const body = readBodyRecord(request);
		const payload =
			typeof (request as any).payload === 'object' &&
			(request as any).payload !== null
				? ((request as any).payload as Record<string, unknown>)
				: undefined;
		const source = body || payload;
		if (!source) return false;
		const event = source.event || source.type || source.event_type;
		return event === eventType;
	};
}
