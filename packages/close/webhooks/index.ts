import type { RawWebhookRequest, WebhookRequest } from 'corsair/core';
import { asRecord } from 'corsair/core';
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

function parseCloseEvent(body: unknown): Record<string, unknown> | null {
	const parsed = parseBody(body);
	if (!parsed) return null;
	return asRecord(parsed.event);
}

function matchesCloseEvent(
	body: unknown,
	objectType: string,
	action: string,
): boolean {
	const event = parseCloseEvent(body);
	return event?.object_type === objectType && event?.action === action;
}

function matchesCloseTaskCreated(body: unknown): boolean {
	const event = parseCloseEvent(body);
	if (!event || event.action !== 'created') return false;
	const objectType = event.object_type;
	return (
		objectType === 'task' ||
		(typeof objectType === 'string' && objectType.startsWith('task.'))
	);
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
	match: (req: RawWebhookRequest) =>
		matchesCloseEvent(req.body, 'lead', 'created'),
	handler: async (ctx, request: WebhookRequest<CloseLeadCreatedEvent>) =>
		handleVerifiedWebhook(ctx, request),
};

export const leadUpdated: CloseWebhooksType['leadUpdated'] = {
	match: (req: RawWebhookRequest) =>
		matchesCloseEvent(req.body, 'lead', 'updated'),
	handler: async (ctx, request: WebhookRequest<CloseLeadUpdatedEvent>) =>
		handleVerifiedWebhook(ctx, request),
};

export const contactCreated: CloseWebhooksType['contactCreated'] = {
	match: (req: RawWebhookRequest) =>
		matchesCloseEvent(req.body, 'contact', 'created'),
	handler: async (ctx, request: WebhookRequest<CloseContactCreatedEvent>) =>
		handleVerifiedWebhook(ctx, request),
};

export const opportunityCreated: CloseWebhooksType['opportunityCreated'] = {
	match: (req: RawWebhookRequest) =>
		matchesCloseEvent(req.body, 'opportunity', 'created'),
	handler: async (ctx, request: WebhookRequest<CloseOpportunityCreatedEvent>) =>
		handleVerifiedWebhook(ctx, request),
};

export const taskCreated: CloseWebhooksType['taskCreated'] = {
	match: (req: RawWebhookRequest) => matchesCloseTaskCreated(req.body),
	handler: async (ctx, request: WebhookRequest<CloseTaskCreatedEvent>) =>
		handleVerifiedWebhook(ctx, request),
};

export const activityNoteCreated: CloseWebhooksType['activityNoteCreated'] = {
	match: (req: RawWebhookRequest) =>
		matchesCloseEvent(req.body, 'activity.note', 'created'),
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
