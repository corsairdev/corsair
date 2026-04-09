import { logEventFromContext } from 'corsair/core';
import type { TypeformEndpoints } from '..';
import { makeTypeformRequest } from '../client';
import type { TypeformEndpointOutputs } from './types';

export const list: TypeformEndpoints['webhooksConfigList'] = async (
	ctx,
	input,
) => {
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['webhooksConfigList']
	>(`/forms/${input.form_id}/webhooks`, ctx.key);

	if (response.webhooks && ctx.db.webhookConfigs) {
		for (const webhook of response.webhooks) {
			const id = webhook.id;
			if (id) {
				try {
					// id narrowed to string; spread + override to satisfy DB entity requirement
					await ctx.db.webhookConfigs.upsertByEntityId(id, { ...webhook, id });
				} catch (error) {
					console.warn('Failed to save webhook config to database:', error);
				}
			}
		}
	}

	await logEventFromContext(
		ctx,
		'typeform.webhooksConfig.list',
		{ form_id: input.form_id },
		'completed',
	);

	return response;
};

export const get: TypeformEndpoints['webhooksConfigGet'] = async (
	ctx,
	input,
) => {
	const response = await makeTypeformRequest<
		TypeformEndpointOutputs['webhooksConfigGet']
	>(`/forms/${input.form_id}/webhooks/${input.tag}`, ctx.key);

	const id = response.id;
	if (id && ctx.db.webhookConfigs) {
		try {
			// id narrowed to string; spread + override to satisfy DB entity requirement
			await ctx.db.webhookConfigs.upsertByEntityId(id, { ...response, id });
		} catch (error) {
			console.warn('Failed to save webhook config to database:', error);
		}
	}

	await logEventFromContext(
		ctx,
		'typeform.webhooksConfig.get',
		{ form_id: input.form_id, tag: input.tag },
		'completed',
	);

	return response;
};

export const createOrUpdate: TypeformEndpoints['webhooksConfigCreateOrUpdate'] =
	async (ctx, input) => {
		const { form_id, tag, ...body } = input;
		const response = await makeTypeformRequest<
			TypeformEndpointOutputs['webhooksConfigCreateOrUpdate']
		>(`/forms/${form_id}/webhooks/${tag}`, ctx.key, {
			method: 'PUT',
			body: body,
		});

		const id = response.id;
		if (id && ctx.db.webhookConfigs) {
			try {
				// id narrowed to string; spread + override to satisfy DB entity requirement
				await ctx.db.webhookConfigs.upsertByEntityId(id, { ...response, id });
			} catch (error) {
				console.warn('Failed to save webhook config to database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'typeform.webhooksConfig.createOrUpdate',
			{ form_id, tag },
			'completed',
		);

		return response;
	};

export const deleteWebhookConfig: TypeformEndpoints['webhooksConfigDelete'] =
	async (ctx, input) => {
		// Look up DB entity ID before deletion so we can remove it from the local store
		let webhookEntityId: string | undefined;
		if (ctx.db.webhookConfigs) {
			try {
				const existing = await ctx.db.webhookConfigs.search({
					data: { tag: input.tag, form_id: input.form_id },
				});
				webhookEntityId = existing[0]?.id;
			} catch {
				// ignore — best-effort pre-fetch
			}
		}

		const response = await makeTypeformRequest<
			TypeformEndpointOutputs['webhooksConfigDelete']
		>(`/forms/${input.form_id}/webhooks/${input.tag}`, ctx.key, {
			method: 'DELETE',
		});

		if (webhookEntityId && ctx.db.webhookConfigs) {
			try {
				await ctx.db.webhookConfigs.deleteByEntityId(webhookEntityId);
			} catch (error) {
				console.warn('Failed to delete webhook config from database:', error);
			}
		}

		await logEventFromContext(
			ctx,
			'typeform.webhooksConfig.delete',
			{ form_id: input.form_id, tag: input.tag },
			'completed',
		);

		return response;
	};
