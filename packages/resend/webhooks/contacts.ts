import { logEventFromContext } from 'corsair/core';
import type { ResendWebhooks } from '../index';
import { createResendMatch, verifyResendWebhookSignature } from './types';

export const contactCreated: ResendWebhooks['contactCreated'] = {
	match: createResendMatch('contact.created'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyResendWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.type !== 'contact.created') {
			return {
				success: true,
				data: undefined,
			};
		}

		// Reject if contact already exists (stale event after deletion)
		let corsairEntityId = '';

		if (ctx.db.contacts && event.data.contact_id) {
			try {
				// Check if contact was previously deleted (tombstone check).
				// `data.deleted` is not part of the typed schema — Resend's
				// contact payload may carry it on stale events — so we read it
				// through an unknown narrow.
				const previouslyDeleted = await ctx.db.contacts.findByEntityId(
					event.data.contact_id,
				);
				const tombstoneDeleted = Boolean(
					(previouslyDeleted?.data as { deleted?: unknown } | undefined)
						?.deleted,
				);
				if (previouslyDeleted && tombstoneDeleted) {
					// Contact was deleted, don't recreate
					return {
						success: true,
						data: event,
					};
				}
				const entity = await ctx.db.contacts.upsertByEntityId(
					event.data.contact_id,
					{
						...event.data,
						id: event.data.contact_id,
						created_at: new Date(event.data.created_at ?? ''),
					},
				);

				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save contact to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'resend.webhook.contactCreated',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};

export const contactUpdated: ResendWebhooks['contactUpdated'] = {
	match: createResendMatch('contact.updated'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyResendWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.type !== 'contact.updated') {
			return {
				success: true,
				data: undefined,
			};
		}

		// Reject if contact was previously deleted (stale event after deletion)
		let corsairEntityId = '';

		if (ctx.db.contacts && event.data.contact_id) {
			try {
				// Check if contact was previously deleted (tombstone check).
				const previouslyDeleted = await ctx.db.contacts.findByEntityId(
					event.data.contact_id,
				);
				const tombstoneDeleted = Boolean(
					(previouslyDeleted?.data as { deleted?: unknown } | undefined)
						?.deleted,
				);
				if (previouslyDeleted && tombstoneDeleted) {
					// Contact was deleted, don't update
					return {
						success: true,
						data: event,
					};
				}
				const entity = await ctx.db.contacts.upsertByEntityId(
					event.data.contact_id,
					{
						...event.data,
						id: event.data.contact_id,
						created_at: new Date(event.data.created_at ?? ''),
					},
				);

				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update contact in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'resend.webhook.contactUpdated',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};

export const contactDeleted: ResendWebhooks['contactDeleted'] = {
	match: createResendMatch('contact.deleted'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyResendWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.type !== 'contact.deleted') {
			return {
				success: true,
				data: undefined,
			};
		}

		// Persist deletion state (tombstone) to prevent stale recreate events.
		// The `deleted` flag lives outside the typed ResendContact schema, so
		// we round-trip it via an unknown narrow.
		if (ctx.db.contacts && event.data.contact_id) {
			try {
				const tombstone = {
					...(event.data as Record<string, unknown>),
					id: event.data.contact_id,
					deleted: true,
				} as unknown as Parameters<
					typeof ctx.db.contacts.upsertByEntityId
				>[1];
				await ctx.db.contacts.upsertByEntityId(event.data.contact_id, tombstone);
			} catch (error) {
				console.warn('Failed to persist deletion tombstone:', error);
			}
		}

		if (ctx.db.contacts && event.data.contact_id) {
			try {
				await ctx.db.contacts.deleteByEntityId(event.data.contact_id);
			} catch (error) {
				console.warn('Failed to delete contact from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'resend.webhook.contactDeleted',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
