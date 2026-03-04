import type { CorsairWebhookMatcher, RawWebhookRequest, WebhookRequest } from '../../../core';

export interface TodoistWebhookPayload {
	type: string;
	created_at: string;
	data: {
		[key: string]: any;
	};
}

export interface ItemAddedEvent extends TodoistWebhookPayload {
	type: 'item:added';
	data: {
		id: string;
		project_id: string;
		section_id?: string;
		content: string;
		description?: string;
		priority?: number;
		parent_id?: string;
		labels?: string[];
		[key: string]: any;
	};
}

export interface ItemUpdatedEvent extends TodoistWebhookPayload {
	type: 'item:updated';
	data: {
		id: string;
		project_id: string;
		section_id?: string;
		content: string;
		description?: string;
		priority?: number;
		parent_id?: string;
		labels?: string[];
		[key: string]: any;
	};
}

export interface ItemDeletedEvent extends TodoistWebhookPayload {
	type: 'item:deleted';
	data: {
		id: string;
		project_id?: string;
		content?: string;
		[key: string]: any;
	};
}

export interface ItemCompletedEvent extends TodoistWebhookPayload {
	type: 'item:completed';
	data: {
		id: string;
		project_id?: string;
		content?: string;
		[key: string]: any;
	};
}

export interface ItemUncompletedEvent extends TodoistWebhookPayload {
	type: 'item:uncompleted';
	data: {
		id: string;
		project_id?: string;
		content?: string;
		[key: string]: any;
	};
}

export interface NoteAddedEvent extends TodoistWebhookPayload {
	type: 'note:added';
	data: {
		id: string;
		item_id?: string;
		project_id?: string;
		content: string;
		posted_uid?: string;
		[key: string]: any;
	};
}

export interface NoteUpdatedEvent extends TodoistWebhookPayload {
	type: 'note:updated';
	data: {
		id: string;
		item_id?: string;
		project_id?: string;
		content: string;
		posted_uid?: string;
		[key: string]: any;
	};
}

export interface NoteDeletedEvent extends TodoistWebhookPayload {
	type: 'note:deleted';
	data: {
		id: string;
		item_id?: string;
		project_id?: string;
		[key: string]: any;
	};
}

export interface ProjectAddedEvent extends TodoistWebhookPayload {
	type: 'project:added';
	data: {
		id: string;
		name: string;
		color?: string;
		parent_id?: string;
		[key: string]: any;
	};
}

export interface ProjectUpdatedEvent extends TodoistWebhookPayload {
	type: 'project:updated';
	data: {
		id: string;
		name: string;
		color?: string;
		parent_id?: string;
		[key: string]: any;
	};
}

export interface ProjectDeletedEvent extends TodoistWebhookPayload {
	type: 'project:deleted';
	data: {
		id: string;
		name?: string;
		[key: string]: any;
	};
}

export interface ProjectArchivedEvent extends TodoistWebhookPayload {
	type: 'project:archived';
	data: {
		id: string;
		name?: string;
		[key: string]: any;
	};
}

export interface ProjectUnarchivedEvent extends TodoistWebhookPayload {
	type: 'project:unarchived';
	data: {
		id: string;
		name?: string;
		[key: string]: any;
	};
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
		const parsedBody = parseBody(request.body) as TodoistWebhookPayload;
		return parsedBody.type === eventType;
	};
}

export function verifyTodoistWebhookSignature(
	request: WebhookRequest<unknown>,
	secret: string,
): { valid: boolean; error?: string } {
	if (!secret) {
		return { valid: true };
	}

	const signatureHeader = request.headers['x-todoist-signature'];
	const signature =
		typeof signatureHeader === 'string'
			? signatureHeader
			: Array.isArray(signatureHeader)
				? signatureHeader[0]
				: undefined;

	if (!signature) {
		return { valid: false, error: 'Missing x-todoist-signature header' };
	}

	const rawBody = request.rawBody;
	if (!rawBody) {
		return {
			valid: false,
			error: 'Missing raw body for signature verification',
		};
	}

	try {
		const crypto = require('crypto');
		const expectedSignature = crypto
			.createHmac('sha256', secret)
			.update(rawBody)
			.digest('hex');

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
