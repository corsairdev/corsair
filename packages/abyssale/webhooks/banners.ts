import { logEventFromContext } from 'corsair/core';
import { cacheBanner } from '../cache-banner';
import type { AbyssaleWebhooks } from '../index';
import {
	createAbyssaleMatch,
	NewBannerBatchEventSchema,
	NewBannerEventSchema,
	verifyAndParseEvent,
} from './types';

export const created: AbyssaleWebhooks['newBanner'] = {
	match: createAbyssaleMatch('NEW_BANNER'),

	handler: async (ctx, request) => {
		const guard = verifyAndParseEvent(
			request,
			ctx.key,
			NewBannerEventSchema,
			'NEW_BANNER',
		);
		if (!guard.ok) {
			return {
				success: false,
				statusCode: guard.statusCode,
				error: guard.error,
			};
		}

		const event = guard.event;
		const corsairEntityId = await cacheBanner(ctx, {
			id: event.id,
			version: event.version,
			sharing_id: event.sharing_id,
			file: event.file,
			format: event.format,
			template: event.template,
		});

		await logEventFromContext(
			ctx,
			'abyssale.webhook.newBanner',
			{
				banner_id: event.id,
				template_id: event.template?.id,
				format_id: event.format?.id,
			},
			'completed',
		);

		return {
			success: true,
			corsairEntityId,
			data: event,
		};
	},
};

export const batchCompleted: AbyssaleWebhooks['newBannerBatch'] = {
	match: createAbyssaleMatch('NEW_BANNER_BATCH'),

	handler: async (ctx, request) => {
		const guard = verifyAndParseEvent(
			request,
			ctx.key,
			NewBannerBatchEventSchema,
			'NEW_BANNER_BATCH',
		);
		if (!guard.ok) {
			return {
				success: false,
				statusCode: guard.statusCode,
				error: guard.error,
			};
		}

		const event = guard.event;
		const entityIds = await Promise.all(
			event.banners.map((banner) => cacheBanner(ctx, banner)),
		);
		const firstEntityId = entityIds.find(Boolean);

		await logEventFromContext(
			ctx,
			'abyssale.webhook.newBannerBatch',
			{
				generation_request_id: event.generation_request_id,
				banner_count: event.banners.length,
				error_count: event.errors.length,
			},
			'completed',
		);

		return firstEntityId
			? { success: true, corsairEntityId: firstEntityId, data: event }
			: { success: true, data: event };
	},
};
