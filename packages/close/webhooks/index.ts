import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import type { CloseWebhooksType } from '../index';
import type {
	CloseActivityNoteCreatedEvent,
	CloseContactCreatedEvent,
	CloseLeadCreatedEvent,
	CloseLeadUpdatedEvent,
	CloseOpportunityCreatedEvent,
	CloseTaskCreatedEvent,
} from './types';

function parseBody(body: unknown): Record<string, unknown> | null {
	if (typeof body === 'string') {
		try {
			return JSON.parse(body) as Record<string, unknown>;
		} catch {
			return null;
		}
	}
	if (typeof body === 'object' && body !== null) {
		return body as Record<string, unknown>;
	}
	return null;
}

export const leadCreated: CloseWebhooksType['leadCreated'] = {
	match: (req: RawWebhookRequest) => {
		const body = parseBody(req.body);
		return body?.event_type === 'lead.created';
	},
	handler: async (_ctx, request: WebhookRequest<CloseLeadCreatedEvent>) => {
		return {
			success: true,
			data: request.payload,
		};
	},
};

export const leadUpdated: CloseWebhooksType['leadUpdated'] = {
	match: (req: RawWebhookRequest) => {
		const body = parseBody(req.body);
		return body?.event_type === 'lead.updated';
	},
	handler: async (_ctx, request: WebhookRequest<CloseLeadUpdatedEvent>) => {
		return {
			success: true,
			data: request.payload,
		};
	},
};

export const contactCreated: CloseWebhooksType['contactCreated'] = {
	match: (req: RawWebhookRequest) => {
		const body = parseBody(req.body);
		return body?.event_type === 'contact.created';
	},
	handler: async (_ctx, request: WebhookRequest<CloseContactCreatedEvent>) => {
		return {
			success: true,
			data: request.payload,
		};
	},
};

export const opportunityCreated: CloseWebhooksType['opportunityCreated'] = {
	match: (req: RawWebhookRequest) => {
		const body = parseBody(req.body);
		return body?.event_type === 'opportunity.created';
	},
	handler: async (
		_ctx,
		request: WebhookRequest<CloseOpportunityCreatedEvent>,
	) => {
		return {
			success: true,
			data: request.payload,
		};
	},
};

export const taskCreated: CloseWebhooksType['taskCreated'] = {
	match: (req: RawWebhookRequest) => {
		const body = parseBody(req.body);
		return body?.event_type === 'task.created';
	},
	handler: async (_ctx, request: WebhookRequest<CloseTaskCreatedEvent>) => {
		return {
			success: true,
			data: request.payload,
		};
	},
};

export const activityNoteCreated: CloseWebhooksType['activityNoteCreated'] = {
	match: (req: RawWebhookRequest) => {
		const body = parseBody(req.body);
		return body?.event_type === 'activity.note.created';
	},
	handler: async (
		_ctx,
		request: WebhookRequest<CloseActivityNoteCreatedEvent>,
	) => {
		return {
			success: true,
			data: request.payload,
		};
	},
};

export const CloseWebhooks = {
	leadCreated,
	leadUpdated,
	contactCreated,
	opportunityCreated,
	taskCreated,
	activityNoteCreated,
};

export * from './oauth-tenant-link';
export * from './tenant-matcher';
export * from './types';
