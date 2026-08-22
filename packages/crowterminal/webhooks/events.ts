import type { CorsairWebhook, WebhookRequest } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { CrowterminalContext } from '../index';
import type {
	CrowterminalWebhookPayload,
	DataIngestedEvent,
	PostingCompletedEvent,
	PostingFailedEvent,
	SkillUpdatedEvent,
	SkillVersionCreatedEvent,
	ValidationBlockedEvent,
} from './types';
import {
	createCrowterminalMatch,
	verifyCrowterminalWebhookSignature,
} from './types';

function createCrowterminalWebhook<TEvent extends CrowterminalWebhookPayload>(
	eventType: TEvent['event'],
): CorsairWebhook<CrowterminalContext, TEvent, TEvent> {
	return {
		match: createCrowterminalMatch(eventType),
		handler: async (
			ctx: CrowterminalContext,
			request: WebhookRequest<TEvent>,
		) => {
			const verification = verifyCrowterminalWebhookSignature(request, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error ?? 'Signature verification failed',
				};
			}

			const event = request.payload;
			if (event.event !== eventType) {
				return { success: true, data: undefined };
			}

			await logEventFromContext(
				ctx,
				`crowterminal.webhook.${event.event}`,
				{ ...event },
				'completed',
			);
			return { success: true, data: event };
		},
	};
}

export const skillUpdated =
	createCrowterminalWebhook<SkillUpdatedEvent>('skill.updated');
export const skillVersionCreated =
	createCrowterminalWebhook<SkillVersionCreatedEvent>('skill.version_created');
export const dataIngested =
	createCrowterminalWebhook<DataIngestedEvent>('data.ingested');
export const validationBlocked =
	createCrowterminalWebhook<ValidationBlockedEvent>('validation.blocked');
export const postingCompleted =
	createCrowterminalWebhook<PostingCompletedEvent>('posting.completed');
export const postingFailed =
	createCrowterminalWebhook<PostingFailedEvent>('posting.failed');
