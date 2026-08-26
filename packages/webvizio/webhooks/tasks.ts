import { logEventFromContext } from 'corsair/core';
import type { WebvizioWebhooks } from '../index';
import { createWebvizioMatch } from './types';

export const taskCreated: WebvizioWebhooks['taskCreated'] = {
	match: createWebvizioMatch('task.created'),
	handler: async (ctx, request) => {
		const event = request.payload;

		await logEventFromContext(
			ctx,
			'webvizio.webhook.taskCreated',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const taskUpdated: WebvizioWebhooks['taskUpdated'] = {
	match: createWebvizioMatch('task.updated'),
	handler: async (ctx, request) => {
		const event = request.payload;

		await logEventFromContext(
			ctx,
			'webvizio.webhook.taskUpdated',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};

export const taskDeleted: WebvizioWebhooks['taskDeleted'] = {
	match: createWebvizioMatch('task.deleted'),
	handler: async (ctx, request) => {
		const event = request.payload;

		await logEventFromContext(
			ctx,
			'webvizio.webhook.taskDeleted',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
