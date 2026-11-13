import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { UserlistWebhookHandlers } from '../index';
import {
	CompanyCreatedPayloadSchema,
	CompanyUpdatedPayloadSchema,
	createUserlistMatch,
	UserCreatedPayloadSchema,
	UserSubscribedPayloadSchema,
	UserUnsubscribedPayloadSchema,
	UserUpdatedPayloadSchema,
	verifyUserlistWebhookSignature,
} from './types';

/**
 * User, company and relationship notifications share one shape: verify the
 * signature, parse, log, and answer what arrived.
 *
 * No entity rows are written, because this plugin declares no entities. The
 * payload is returned to the host, which decides what to store. The fields each
 * topic's `log` picks (the user's identifier and email on user topics) do go to
 * `corsair_events` when a database is configured.
 */
async function handle<Payload extends z.ZodType>(
	ctx: { key: string },
	request: {
		// unknown: the host's parsed body; the topic's schema narrows it.
		payload: unknown;
		rawBody?: string;
		// unknown: header values arrive as a string or a string array.
		headers: Record<string, unknown>;
	},
	schema: Payload,
	event: string,
	// unknown: the payload is the schema's output, read after parsing.
	log: (payload: z.output<Payload>) => Record<string, unknown>,
): Promise<
	| { success: true; data: z.output<Payload> }
	| { success: false; statusCode: number; error: string }
> {
	const verification = verifyUserlistWebhookSignature(
		request as never,
		ctx.key,
	);
	if (!verification.valid) {
		return {
			success: false,
			statusCode: 401,
			error: verification.error ?? 'Signature verification failed',
		};
	}

	const parsed = schema.safeParse(request.payload);
	if (!parsed.success) {
		return {
			success: false,
			statusCode: 400,
			error: 'Unrecognised webhook payload',
		};
	}

	await logEventFromContext(
		ctx as never,
		`userlist.webhook.${event}`,
		log(parsed.data),
		'completed',
	);

	return { success: true, data: parsed.data };
}

export const userCreated: UserlistWebhookHandlers['userCreated'] = {
	match: createUserlistMatch('user_created'),
	handler: async (ctx, request) =>
		handle(
			ctx,
			request,
			UserCreatedPayloadSchema,
			'user_created',
			(payload) => ({
				id: payload.user.identifier ?? undefined,
				email: payload.user.email ?? undefined,
			}),
		),
};

export const userUpdated: UserlistWebhookHandlers['userUpdated'] = {
	match: createUserlistMatch('user_updated'),
	handler: async (ctx, request) =>
		handle(
			ctx,
			request,
			UserUpdatedPayloadSchema,
			'user_updated',
			(payload) => ({
				id: payload.user.identifier ?? undefined,
				email: payload.user.email ?? undefined,
			}),
		),
};

/** Carries the topic whose subscription changed, which is what varies. */
export const userSubscribed: UserlistWebhookHandlers['userSubscribed'] = {
	match: createUserlistMatch('user_subscribed'),
	handler: async (ctx, request) =>
		handle(
			ctx,
			request,
			UserSubscribedPayloadSchema,
			'user_subscribed',
			(payload) => ({
				id: payload.user.identifier ?? undefined,
				topic: payload.properties?.topic_id ?? undefined,
			}),
		),
};

export const userUnsubscribed: UserlistWebhookHandlers['userUnsubscribed'] = {
	match: createUserlistMatch('user_unsubscribed'),
	handler: async (ctx, request) =>
		handle(
			ctx,
			request,
			UserUnsubscribedPayloadSchema,
			'user_unsubscribed',
			(payload) => ({
				id: payload.user.identifier ?? undefined,
				topic: payload.properties?.topic_id ?? undefined,
			}),
		),
};

export const companyCreated: UserlistWebhookHandlers['companyCreated'] = {
	match: createUserlistMatch('company_created'),
	handler: async (ctx, request) =>
		handle(
			ctx,
			request,
			CompanyCreatedPayloadSchema,
			'company_created',
			(payload) => ({ id: payload.company.identifier ?? undefined }),
		),
};

export const companyUpdated: UserlistWebhookHandlers['companyUpdated'] = {
	match: createUserlistMatch('company_updated'),
	handler: async (ctx, request) =>
		handle(
			ctx,
			request,
			CompanyUpdatedPayloadSchema,
			'company_updated',
			(payload) => ({ id: payload.company.identifier ?? undefined }),
		),
};
