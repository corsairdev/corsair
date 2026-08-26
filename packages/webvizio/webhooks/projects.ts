import { logEventFromContext } from 'corsair/core';
import type { WebvizioWebhooks } from '../index';
import { createWebvizioMatch, verifyWebvizioWebhookSignature } from './types';

export const projectCreated: WebvizioWebhooks['projectCreated'] = {
	match: createWebvizioMatch('project.created'),
	handler: async (ctx, request) => {
		if (ctx.key) {
			const verification = verifyWebvizioWebhookSignature(request, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					error: verification.error || 'Invalid webhook signature',
				};
			}
		}

		const event = request.payload;
		let corsairEntityId = '';

		const projectData = (event.payload ?? event.data ?? event) as Record<
			string,
			any
		>;
		const entityKey = (projectData?.uuid ||
			(projectData?.id ? String(projectData.id) : '')) as string;

		if (ctx.db.projects && entityKey) {
			try {
				const entity = await ctx.db.projects.upsertByEntityId(entityKey, {
					uuid: projectData.uuid,
					id: projectData.id,
					name: projectData.name,
					description: projectData.description,
					url: projectData.url,
					created_at: projectData.created_at || event.created_at,
					updated_at: projectData.updated_at,
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to save project to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'webvizio.webhook.projectCreated',
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

export const projectUpdated: WebvizioWebhooks['projectUpdated'] = {
	match: createWebvizioMatch('project.updated'),
	handler: async (ctx, request) => {
		if (ctx.key) {
			const verification = verifyWebvizioWebhookSignature(request, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					error: verification.error || 'Invalid webhook signature',
				};
			}
		}

		const event = request.payload;
		let corsairEntityId = '';

		const projectData = (event.payload ?? event.data ?? event) as Record<
			string,
			any
		>;
		const entityKey = (projectData?.uuid ||
			(projectData?.id ? String(projectData.id) : '')) as string;

		if (ctx.db.projects && entityKey) {
			try {
				const entity = await ctx.db.projects.upsertByEntityId(entityKey, {
					uuid: projectData.uuid,
					id: projectData.id,
					name: projectData.name,
					description: projectData.description,
					url: projectData.url,
					created_at: projectData.created_at || event.created_at,
					updated_at: projectData.updated_at,
				});
				corsairEntityId = entity?.id || '';
			} catch (error) {
				console.warn('Failed to update project in database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'webvizio.webhook.projectUpdated',
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

export const projectDeleted: WebvizioWebhooks['projectDeleted'] = {
	match: createWebvizioMatch('project.deleted'),
	handler: async (ctx, request) => {
		if (ctx.key) {
			const verification = verifyWebvizioWebhookSignature(request, ctx.key);
			if (!verification.valid) {
				return {
					success: false,
					error: verification.error || 'Invalid webhook signature',
				};
			}
		}

		const event = request.payload;

		await logEventFromContext(
			ctx,
			'webvizio.webhook.projectDeleted',
			{ ...event },
			'completed',
		);

		return {
			success: true,
			data: event,
		};
	},
};
