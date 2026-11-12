import { logEventFromContext } from 'corsair/core';
import type { UserlistWebhookHandlers } from '../index';
import {
	createUserlistMatch,
	FormSubmittedPayloadSchema,
	MessageBouncedPayloadSchema,
	MessageClickedPayloadSchema,
	MessageEnqueuedPayloadSchema,
	MessageOpenedPayloadSchema,
	MessageReportedPayloadSchema,
	RelationshipCreatedPayloadSchema,
	RelationshipUpdatedPayloadSchema,
	verifyUserlistWebhookSignature,
} from './types';

/**
 * Relationship, form and message notifications. Each verifies the signature,
 * parses its own payload and logs a couple of safe fields — never the message
 * body or the form answers, which are the recipient's.
 */

export const relationshipCreated: UserlistWebhookHandlers['relationshipCreated'] =
	{
		match: createUserlistMatch('relationship_created'),
		handler: async (ctx, request) => {
			const verification = verifyUserlistWebhookSignature(request, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error ?? 'Signature verification failed',
				};
			}

			const parsed = RelationshipCreatedPayloadSchema.safeParse(
				request.payload,
			);
			if (!parsed.success) {
				return {
					success: false,
					statusCode: 400,
					error: 'Unrecognised webhook payload',
				};
			}

			await logEventFromContext(
				ctx,
				'userlist.webhook.relationship_created',
				{
					user: parsed.data.user?.identifier ?? undefined,
					company: parsed.data.company?.identifier ?? undefined,
				},
				'completed',
			);

			return { success: true, data: parsed.data };
		},
	};

export const relationshipUpdated: UserlistWebhookHandlers['relationshipUpdated'] =
	{
		match: createUserlistMatch('relationship_updated'),
		handler: async (ctx, request) => {
			const verification = verifyUserlistWebhookSignature(request, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					statusCode: 401,
					error: verification.error ?? 'Signature verification failed',
				};
			}

			const parsed = RelationshipUpdatedPayloadSchema.safeParse(
				request.payload,
			);
			if (!parsed.success) {
				return {
					success: false,
					statusCode: 400,
					error: 'Unrecognised webhook payload',
				};
			}

			await logEventFromContext(
				ctx,
				'userlist.webhook.relationship_updated',
				{
					user: parsed.data.user?.identifier ?? undefined,
					company: parsed.data.company?.identifier ?? undefined,
				},
				'completed',
			);

			return { success: true, data: parsed.data };
		},
	};

export const formSubmitted: UserlistWebhookHandlers['formSubmitted'] = {
	match: createUserlistMatch('form_submitted'),
	handler: async (ctx, request) => {
		const verification = verifyUserlistWebhookSignature(request, ctx.key);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error ?? 'Signature verification failed',
			};
		}

		const parsed = FormSubmittedPayloadSchema.safeParse(request.payload);
		if (!parsed.success) {
			return {
				success: false,
				statusCode: 400,
				error: 'Unrecognised webhook payload',
			};
		}

		// The answers live in `properties`; only the field count is logged,
		// since a hosted form may collect anything.
		await logEventFromContext(
			ctx,
			'userlist.webhook.form_submitted',
			{
				user: parsed.data.user?.identifier ?? undefined,
				answers: parsed.data.properties
					? Object.keys(parsed.data.properties).length
					: 0,
			},
			'completed',
		);

		return { success: true, data: parsed.data };
	},
};

/** The five message notifications differ only in which event they report. */
function messageHandler(
	event:
		| 'message_enqueued'
		| 'message_opened'
		| 'message_clicked'
		| 'message_bounced'
		| 'message_reported',
) {
	const schemas = {
		message_enqueued: MessageEnqueuedPayloadSchema,
		message_opened: MessageOpenedPayloadSchema,
		message_clicked: MessageClickedPayloadSchema,
		message_bounced: MessageBouncedPayloadSchema,
		message_reported: MessageReportedPayloadSchema,
	} as const;

	const schema = schemas[event];

	return {
		match: createUserlistMatch(event),
		handler: async (
			ctx: {
				key: string;
			},
			request: {
				payload: unknown;
				rawBody?: string;
				headers: Record<string, unknown>;
			},
		) => {
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
				{
					id: parsed.data.properties?.message_id ?? undefined,
					user: parsed.data.user?.identifier ?? undefined,
				},
				'completed',
			);

			return { success: true, data: parsed.data };
		},
	};
}

export const messageEnqueued: UserlistWebhookHandlers['messageEnqueued'] =
	messageHandler(
		'message_enqueued',
	) as UserlistWebhookHandlers['messageEnqueued'];

export const messageOpened: UserlistWebhookHandlers['messageOpened'] =
	messageHandler('message_opened') as UserlistWebhookHandlers['messageOpened'];

export const messageClicked: UserlistWebhookHandlers['messageClicked'] =
	messageHandler(
		'message_clicked',
	) as UserlistWebhookHandlers['messageClicked'];

export const messageBounced: UserlistWebhookHandlers['messageBounced'] =
	messageHandler(
		'message_bounced',
	) as UserlistWebhookHandlers['messageBounced'];

export const messageReported: UserlistWebhookHandlers['messageReported'] =
	messageHandler(
		'message_reported',
	) as UserlistWebhookHandlers['messageReported'];
