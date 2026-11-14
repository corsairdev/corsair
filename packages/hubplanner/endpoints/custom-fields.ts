import { logEventFromContext } from 'corsair/core';
import type { HubPlannerEndpoints } from '..';
import { makeHubPlannerRequest } from '../client';
import type { CustomFieldTemplate } from './types';
import {
	HubPlannerEndpointInputSchemas,
	HubPlannerEndpointOutputSchemas,
} from './types';

export const CustomFields = {
	list: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['customFields.list'].parse(input);
		const response = await makeHubPlannerRequest<CustomFieldTemplate[]>(
			`/${encodeURIComponent(parsedInput.entityType)}/customField/template`,
			ctx.key,
			{ method: 'GET' },
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['customFields.list'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.customFields.list',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['customFields.list'],

	get: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['customFields.get'].parse(input);
		const response = await makeHubPlannerRequest<CustomFieldTemplate>(
			`/${encodeURIComponent(parsedInput.entityType)}/customField/template/${encodeURIComponent(parsedInput.id)}`,
			ctx.key,
			{ method: 'GET' },
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['customFields.get'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.customFields.get',
			{ templateId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['customFields.get'],

	create: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['customFields.create'].parse(input);
		const { entityType, ...body } = parsedInput;
		const response = await makeHubPlannerRequest<CustomFieldTemplate>(
			`/${encodeURIComponent(entityType)}/customField/template`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['customFields.create'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.customFields.create',
			{ templateId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['customFields.create'],

	update: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['customFields.update'].parse(input);
		const { entityType, id, ...body } = parsedInput;
		const response = await makeHubPlannerRequest<CustomFieldTemplate>(
			`/${encodeURIComponent(entityType)}/customField/template/${encodeURIComponent(id)}`,
			ctx.key,
			{
				method: 'PUT',
				body: { _id: id, ...body },
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['customFields.update'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.customFields.update',
			{ templateId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['customFields.update'],

	delete: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['customFields.delete'].parse(input);
		const raw = await makeHubPlannerRequest<unknown>(
			`/${encodeURIComponent(parsedInput.entityType)}/customField/template/${encodeURIComponent(parsedInput.id)}`,
			ctx.key,
			{ method: 'DELETE' },
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['customFields.delete'].parse(raw);
		await logEventFromContext(
			ctx,
			'hubplanner.customFields.delete',
			{ templateId: parsedInput.id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['customFields.delete'],

	search: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['customFields.search'].parse(input);
		const response = await makeHubPlannerRequest<CustomFieldTemplate[]>(
			`/${encodeURIComponent(parsedInput.entityType)}/customField/template/search`,
			ctx.key,
			{
				method: 'POST',
				body: parsedInput.query ?? {},
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['customFields.search'].parse(response);
		await logEventFromContext(
			ctx,
			'hubplanner.customFields.search',
			{ count: parsed.length },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['customFields.search'],

	addChoices: (async (ctx, input) => {
		const parsedInput =
			HubPlannerEndpointInputSchemas['customFields.addChoices'].parse(input);
		const response = await makeHubPlannerRequest<CustomFieldTemplate>(
			`/${encodeURIComponent(parsedInput.entityType)}/customField/template/${encodeURIComponent(parsedInput.id)}/addChoices`,
			ctx.key,
			{
				method: 'POST',
				body: parsedInput.choices,
			},
		);
		const parsed =
			HubPlannerEndpointOutputSchemas['customFields.addChoices'].parse(
				response,
			);
		await logEventFromContext(
			ctx,
			'hubplanner.customFields.addChoices',
			{ templateId: parsed._id },
			'completed',
		);
		return parsed;
	}) as HubPlannerEndpoints['customFields.addChoices'],
};
