import type { WebhookRequest } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { PubloraWebhooks } from '../index';
import {
	createPubloraMatch,
	PostDemotedEventSchema,
	PostFailedEventSchema,
	PostPublishedEventSchema,
	PostScheduledEventSchema,
	verifyPubloraWebhookSignature,
} from './types';

type Handled<T> =
	| { success: true; data: T }
	| { success: false; statusCode: number; error: string };

/**
 * Verifies the signature, then parses the envelope against the event's
 * schema. A delivery that is signed but does not match the documented shape
 * is answered with 400, so Publora's retry log shows it.
 */
async function handle<Schema extends z.ZodType>(
	ctx: Parameters<PubloraWebhooks['published']['handler']>[0],
	request: WebhookRequest<unknown>,
	schema: Schema,
	event: string,
): Promise<Handled<z.infer<Schema>>> {
	const verification = verifyPubloraWebhookSignature(request, ctx.key);
	if (!verification.valid) {
		return { success: false, statusCode: 401, error: verification.error };
	}

	const parsed = schema.safeParse(request.payload);
	if (!parsed.success) {
		return {
			success: false,
			statusCode: 400,
			error: `Payload does not match the ${event} event`,
		};
	}

	const data = (parsed.data as { data: Record<string, unknown> }).data;
	await logEventFromContext(
		ctx,
		`publora.webhook.${event}`,
		{ postGroupId: data.postGroupId, platform: data.platform },
		'completed',
	);
	return { success: true, data: parsed.data };
}

export const published: PubloraWebhooks['published'] = {
	match: createPubloraMatch('post.published'),
	handler: async (ctx, request) =>
		handle(ctx, request, PostPublishedEventSchema, 'post.published'),
};

export const failed: PubloraWebhooks['failed'] = {
	match: createPubloraMatch('post.failed'),
	handler: async (ctx, request) =>
		handle(ctx, request, PostFailedEventSchema, 'post.failed'),
};

export const scheduled: PubloraWebhooks['scheduled'] = {
	match: createPubloraMatch('post.scheduled'),
	handler: async (ctx, request) =>
		handle(ctx, request, PostScheduledEventSchema, 'post.scheduled'),
};

export const demoted: PubloraWebhooks['demoted'] = {
	match: createPubloraMatch('post.demoted'),
	handler: async (ctx, request) =>
		handle(ctx, request, PostDemotedEventSchema, 'post.demoted'),
};
