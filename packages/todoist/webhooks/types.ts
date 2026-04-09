import type {
	CorsairWebhookMatcher,
	RawWebhookRequest,
	WebhookRequest,
} from 'corsair/core';
import * as crypto from 'crypto';

export interface TodoistWebhookPayload<TData = { [key: string]: any }> {
	event_name: string;
	triggered_at?: string;
	created_at?: string;
	event_data?: TData;
	data?: TData;
	[key: string]: any;
}

type ItemBaseData = {
	id: string;
	project_id: string;
	section_id?: string | null;
	content: string;
	description?: string;
	priority?: number;
	parent_id?: string | null;
	labels?: string[];
	[key: string]: any;
};

export interface ItemAddedEvent extends TodoistWebhookPayload<ItemBaseData> {
	event_name: 'item:added';
}

export interface ItemUpdatedEvent extends TodoistWebhookPayload<ItemBaseData> {
	event_name: 'item:updated';
}

export interface ItemDeletedEvent
	extends TodoistWebhookPayload<{
		id: string;
		project_id?: string;
		content?: string;
		[key: string]: any;
	}> {
	event_name: 'item:deleted';
}

export interface ItemCompletedEvent
	extends TodoistWebhookPayload<{
		id: string;
		project_id?: string;
		content?: string;
		[key: string]: any;
	}> {
	event_name: 'item:completed';
}

export interface ItemUncompletedEvent
	extends TodoistWebhookPayload<{
		id: string;
		project_id?: string;
		content?: string;
		[key: string]: any;
	}> {
	event_name: 'item:uncompleted';
}

export interface NoteAddedEvent
	extends TodoistWebhookPayload<{
		id: string;
		item_id?: string;
		project_id?: string;
		content: string;
		posted_uid?: string;
		[key: string]: any;
	}> {
	event_name: 'note:added';
}

export interface NoteUpdatedEvent
	extends TodoistWebhookPayload<{
		id: string;
		item_id?: string;
		project_id?: string;
		content: string;
		posted_uid?: string;
		[key: string]: any;
	}> {
	event_name: 'note:updated';
}

export interface NoteDeletedEvent
	extends TodoistWebhookPayload<{
		id: string;
		item_id?: string;
		project_id?: string;
		[key: string]: any;
	}> {
	event_name: 'note:deleted';
}

export interface ProjectAddedEvent
	extends TodoistWebhookPayload<{
		id: string;
		name: string;
		color?: string;
		parent_id?: string;
		[key: string]: any;
	}> {
	event_name: 'project:added';
}

export interface ProjectUpdatedEvent
	extends TodoistWebhookPayload<{
		id: string;
		name: string;
		color?: string;
		parent_id?: string;
		[key: string]: any;
	}> {
	event_name: 'project:updated';
}

export interface ProjectDeletedEvent
	extends TodoistWebhookPayload<{
		id: string;
		name?: string;
		[key: string]: any;
	}> {
	event_name: 'project:deleted';
}

export interface ProjectArchivedEvent
	extends TodoistWebhookPayload<{
		id: string;
		name?: string;
		[key: string]: any;
	}> {
	event_name: 'project:archived';
}

export interface ProjectUnarchivedEvent
	extends TodoistWebhookPayload<{
		id: string;
		name?: string;
		[key: string]: any;
	}> {
	event_name: 'project:unarchived';
}

export type TodoistWebhookOutputs = {
	itemAdded: ItemAddedEvent;
	itemUpdated: ItemUpdatedEvent;
	itemDeleted: ItemDeletedEvent;
	itemCompleted: ItemCompletedEvent;
	itemUncompleted: ItemUncompletedEvent;
	noteAdded: NoteAddedEvent;
	noteUpdated: NoteUpdatedEvent;
	noteDeleted: NoteDeletedEvent;
	projectAdded: ProjectAddedEvent;
	projectUpdated: ProjectUpdatedEvent;
	projectDeleted: ProjectDeletedEvent;
	projectArchived: ProjectArchivedEvent;
	projectUnarchived: ProjectUnarchivedEvent;
};

function parseBody(body: unknown): unknown {
	return typeof body === 'string' ? JSON.parse(body) : body;
}

export function createTodoistMatch(eventType: string): CorsairWebhookMatcher {
	return (request: RawWebhookRequest) => {
		// type assertion because the body is unknown
		const parsedBody = parseBody(request.body) as TodoistWebhookPayload;
		return parsedBody.event_name === eventType;
	};
}

export function verifyTodoistWebhookSignature(
	request: WebhookRequest<unknown>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: false, error: 'No secret provided' };
	}

	const signatureHeader = request.headers['x-todoist-hmac-sha256'];
	const signature =
		typeof signatureHeader === 'string'
			? signatureHeader
			: Array.isArray(signatureHeader)
				? signatureHeader[0]
				: undefined;

	if (!signature) {
		return { valid: false, error: 'Missing x-todoist-hmac-sha256 header' };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	try {
		const expectedSignature = crypto
			.createHmac('sha256', secret)
			.update(rawBody)
			.digest('base64');

		const isValid = crypto.timingSafeEqual(
			Buffer.from(signature),
			Buffer.from(expectedSignature),
		);

		return { valid: isValid, error: isValid ? undefined : 'Invalid signature' };
	} catch (error) {
		return {
			valid: false,
			error: `Signature verification failed: ${error instanceof Error ? error.message : 'unknown error'}`,
		};
	}
}
