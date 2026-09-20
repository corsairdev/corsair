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
import { verifyCloseWebhookSignature } from './types';

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

async function handleVerifiedWebhook<T>(
	ctx: { key?: string },
	request: WebhookRequest<T>,
) {
	const verification = verifyCloseWebhookSignature(request, ctx.key);
	if (!verification.valid) {
		return {
			success: false,
			statusCode: 401,
			error: verification.error || 'Signature verification failed',
		};
	}

	return {
		success: true,
		data: request.payload,
	};
}

export const leadCreated: CloseWebhooksType['leadCreated'] = {
	match: (req: RawWebhookRequest) => {
		const body = parseBody(req.body);
		return body?.event_type === 'lead.created';
	},
	handler: async (ctx, request: WebhookRequest<CloseLeadCreatedEvent>) =>
		handleVerifiedWebhook(ctx, request),
};

export const leadUpdated: CloseWebhooksType['leadUpdated'] = {
	match: (req: RawWebhookRequest) => {
		const body = parseBody(req.body);
		return body?.event_type === 'lead.updated';
	},
	handler: async (ctx, request: WebhookRequest<CloseLeadUpdatedEvent>) =>
		handleVerifiedWebhook(ctx, request),
};

export const contactCreated: CloseWebhooksType['contactCreated'] = {
	match: (req: RawWebhookRequest) => {
		const body = parseBody(req.body);
		return body?.event_type === 'contact.created';
	},
	handler: async (ctx, request: WebhookRequest<CloseContactCreatedEvent>) =>
		handleVerifiedWebhook(ctx, request),
};

export const opportunityCreated: CloseWebhooksType['opportunityCreated'] = {
	match: (req: RawWebhookRequest) => {
		const body = parseBody(req.body);
		return body?.event_type === 'opportunity.created';
	},
	handler: async (ctx, request: WebhookRequest<CloseOpportunityCreatedEvent>) =>
		handleVerifiedWebhook(ctx, request),
};

export const taskCreated: CloseWebhooksType['taskCreated'] = {
	match: (req: RawWebhookRequest) => {
		const body = parseBody(req.body);
		return body?.event_type === 'task.created';
	},
	handler: async (ctx, request: WebhookRequest<CloseTaskCreatedEvent>) =>
		handleVerifiedWebhook(ctx, request),
};

export const activityNoteCreated: CloseWebhooksType['activityNoteCreated'] = {
	match: (req: RawWebhookRequest) => {
		const body = parseBody(req.body);
		return body?.event_type === 'activity.note.created';
	},
	handler: async (
		ctx,
		request: WebhookRequest<CloseActivityNoteCreatedEvent>,
	) => handleVerifiedWebhook(ctx, request),
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
