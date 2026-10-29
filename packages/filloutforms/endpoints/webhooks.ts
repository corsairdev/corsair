import { logEventFromContext } from 'corsair/core';
import { makeFilloutRequest, ZITE_API_BASE } from '../client';
import type { FilloutFormsEndpoints } from '../index';
import type { FilloutFormsEndpointOutputs } from './types';

export const createFormWebhook: FilloutFormsEndpoints['createFormWebhook'] =
	async (ctx, input) => {
		const response = await makeFilloutRequest<
			FilloutFormsEndpointOutputs['createFormWebhook']
		>('webhook/create', ctx.key, {
			method: 'POST',
			body: { formId: input.formId, url: input.url },
		});
		await logEventFromContext(
			ctx,
			'filloutforms.webhooks.createForm',
			{ formId: input.formId },
			'completed',
		);
		return response;
	};

export const removeFormWebhook: FilloutFormsEndpoints['removeFormWebhook'] =
	async (ctx, input) => {
		const response = await makeFilloutRequest<
			FilloutFormsEndpointOutputs['removeFormWebhook']
		>('webhook/delete', ctx.key, {
			method: 'POST',
			body: { webhookId: input.webhookId },
		});
		await logEventFromContext(
			ctx,
			'filloutforms.webhooks.removeForm',
			{ webhookId: input.webhookId },
			'completed',
		);
		return response ?? {};
	};

export const createDatabaseWebhook: FilloutFormsEndpoints['createDatabaseWebhook'] =
	async (ctx, input) => {
		const body: Record<string, unknown> = {
			url: input.url,
			events: input.events,
		};
		if (input.tableId !== undefined) body.tableId = input.tableId;
		const response = await makeFilloutRequest<
			FilloutFormsEndpointOutputs['createDatabaseWebhook']
		>(`bases/${encodeURIComponent(input.databaseId)}/webhooks`, ctx.key, {
			method: 'POST',
			baseUrl: ZITE_API_BASE,
			body,
		});
		await logEventFromContext(
			ctx,
			'filloutforms.webhooks.createDatabase',
			{ databaseId: input.databaseId, events: input.events },
			'completed',
		);
		return response;
	};

export const listDatabaseWebhooks: FilloutFormsEndpoints['listDatabaseWebhooks'] =
	async (ctx, input) => {
		const response = await makeFilloutRequest<
			FilloutFormsEndpointOutputs['listDatabaseWebhooks']
		>(`bases/${encodeURIComponent(input.databaseId)}/webhooks`, ctx.key, {
			method: 'GET',
			baseUrl: ZITE_API_BASE,
		});
		await logEventFromContext(
			ctx,
			'filloutforms.webhooks.listDatabase',
			{ databaseId: input.databaseId },
			'completed',
		);
		return response;
	};

export const deleteDatabaseWebhook: FilloutFormsEndpoints['deleteDatabaseWebhook'] =
	async (ctx, input) => {
		const response = await makeFilloutRequest<
			FilloutFormsEndpointOutputs['deleteDatabaseWebhook']
		>(
			`bases/${encodeURIComponent(input.databaseId)}/webhooks/${encodeURIComponent(String(input.webhookId))}`,
			ctx.key,
			{ method: 'DELETE', baseUrl: ZITE_API_BASE },
		);
		await logEventFromContext(
			ctx,
			'filloutforms.webhooks.deleteDatabase',
			{ databaseId: input.databaseId, webhookId: input.webhookId },
			'completed',
		);
		return response ?? {};
	};
