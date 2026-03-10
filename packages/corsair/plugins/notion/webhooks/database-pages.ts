import { logEventFromContext } from '../../utils/events';
import type { NotionWebhooks } from '..';
import { createNotionMatch, verifyNotionWebhookSignature } from './types';

export const pageCreated: NotionWebhooks['pageCreated'] = {
	match: createNotionMatch('page.created'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyNotionWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.type !== 'page.created') {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid event type',
			};
		}

		// Save entity to database if available
		if (event.entity && ctx.db.pages) {
			try {
				const entity = event.entity;
				if (entity.id && entity.object === 'page') {
					const parentId =
						entity.parent &&
						typeof entity.parent === 'object' &&
						entity.parent !== null
							? 'page_id' in entity.parent
								? String(entity.parent.page_id)
								: 'database_id' in entity.parent
									? String(entity.parent.database_id)
									: 'block_id' in entity.parent
										? String(entity.parent.block_id)
										: undefined
							: undefined;

					const databaseId =
						entity.parent &&
						typeof entity.parent === 'object' &&
						entity.parent !== null
							? 'database_id' in entity.parent
								? String(entity.parent.database_id)
								: undefined
							: event.data.database_id;

					await ctx.db.pages.upsertByEntityId(entity.id, {
						...entity,
						id: entity.id,
						object: entity.object,
						database_id: databaseId,
						parent_id: parentId,
						parent_type:
							entity.parent &&
							typeof entity.parent === 'object' &&
							entity.parent !== null
								? 'type' in entity.parent
									? String(entity.parent.type)
									: undefined
								: undefined,
						properties_json: JSON.stringify(entity.properties || {}),
					});
				}
			} catch (error) {
				console.warn('Failed to save page from webhook to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'notion.webhook.pageCreated',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const pageUpdated: NotionWebhooks['pageUpdated'] = {
	match: createNotionMatch('page.updated'),

	handler: async (ctx, request) => {
		const webhookSecret = ctx.key;
		const verification = verifyNotionWebhookSignature(request, webhookSecret);
		if (!verification.valid) {
			return {
				success: false,
				statusCode: 401,
				error: verification.error || 'Signature verification failed',
			};
		}

		const event = request.payload;

		if (event.type !== 'page.updated') {
			return {
				success: false,
				statusCode: 400,
				error: 'Invalid event type',
			};
		}

		// Save entity to database if available
		if (event.entity && ctx.db.pages) {
			try {
				const entity = event.entity;
				if (entity.id && entity.object === 'page') {
					const parentId =
						entity.parent &&
						typeof entity.parent === 'object' &&
						entity.parent !== null
							? 'page_id' in entity.parent
								? String(entity.parent.page_id)
								: 'database_id' in entity.parent
									? String(entity.parent.database_id)
									: 'block_id' in entity.parent
										? String(entity.parent.block_id)
										: undefined
							: undefined;

					const databaseId =
						entity.parent &&
						typeof entity.parent === 'object' &&
						entity.parent !== null
							? 'database_id' in entity.parent
								? String(entity.parent.database_id)
								: undefined
							: event.data.database_id;

					await ctx.db.pages.upsertByEntityId(entity.id, {
						...entity,
						id: entity.id,
						object: entity.object,
						database_id: databaseId,
						parent_id: parentId,
						parent_type:
							entity.parent &&
							typeof entity.parent === 'object' &&
							entity.parent !== null
								? 'type' in entity.parent
									? String(entity.parent.type)
									: undefined
								: undefined,
						properties_json: JSON.stringify(entity.properties || {}),
					});
				}
			} catch (error) {
				console.warn('Failed to save page from webhook to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'notion.webhook.pageUpdated',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
