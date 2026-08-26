import type { RawWebhookRequest } from 'corsair/core';
import { readBodyRecord } from 'corsair/core';
import { verifyHmacSignature } from 'corsair/http';
import { z } from 'zod';

export const WebvizioProjectEventPayloadSchema = z
	.object({
		uuid: z.string().nullish(),
		id: z.union([z.string(), z.number()]).nullish(),
		name: z.string().nullish(),
		description: z.string().nullish(),
		url: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.passthrough();

export const WebvizioTaskEventPayloadSchema = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		uuid: z.string().nullish(),
		project_id: z.union([z.string(), z.number()]).nullish(),
		project_uuid: z.string().nullish(),
		title: z.string().nullish(),
		status: z.string().nullish(),
		created_at: z.string().nullish(),
		updated_at: z.string().nullish(),
	})
	.passthrough();

export const WebvizioCommentEventPayloadSchema = z
	.object({
		id: z.union([z.string(), z.number()]).nullish(),
		task_id: z.union([z.string(), z.number()]).nullish(),
		project_id: z.union([z.string(), z.number()]).nullish(),
		project_uuid: z.string().nullish(),
		text: z.string().nullish(),
		created_at: z.string().nullish(),
	})
	.passthrough();

export const createWebvizioEventSchema = <T extends z.ZodTypeAny>(
	dataSchema: T,
) =>
	z
		.object({
			event: z.string(),
			payload: dataSchema.nullish(),
			data: dataSchema.nullish(),
			created_at: z.string().nullish(),
			timestamp: z.union([z.string(), z.number()]).nullish(),
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

export function verifyWebvizioWebhookSignature(
	request: {
		headers: Record<string, string | string[] | undefined>;
		rawBody?: string;
		body?: unknown;
		payload?: unknown;
	},
	webhookSecret?: string,
): { valid: boolean; error?: string } {
	if (!webhookSecret) {
		return { valid: true };
	}

	const headers = request.headers;
	const signature = Array.isArray(headers['x-webvizio-signature'])
		? headers['x-webvizio-signature'][0]
		: (headers['x-webvizio-signature'] as string | undefined);

	if (!signature) {
		return {
			valid: false,
			error: 'Missing x-webvizio-signature header',
		};
	}

	const rawBody =
		request.rawBody ||
		(typeof request.body === 'string'
			? request.body
			: JSON.stringify(request.payload ?? request.body ?? {}));

	const isValid = verifyHmacSignature(
		rawBody,
		webhookSecret,
		signature,
		'sha256',
	);
	if (!isValid && signature !== webhookSecret) {
		return { valid: false, error: 'Invalid Webvizio webhook signature' };
	}

	return { valid: true };
}
