import { logEventFromContext } from 'corsair/core';
import type { GmicloudEndpoints } from '..';
import { makeGmicloudRequest } from '../client';
import { forgetRecord, saveRecords } from './persistence';
import {
	GmicloudEndpointInputSchemas,
	GmicloudEndpointOutputSchemas,
} from './types';

export const list: GmicloudEndpoints['sandboxTemplatesList'] = async (
	ctx,
	input,
) => {
	const { idc_name, page, page_size } =
		GmicloudEndpointInputSchemas.sandboxTemplatesList.parse(input);
	const result = GmicloudEndpointOutputSchemas.sandboxTemplatesList.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v2/templates',
			query: { idc_name, page, page_size },
		}),
	);
	await saveRecords(ctx.db.sandboxTemplates, result.items);
	await logEventFromContext(
		ctx,
		'gmicloud.sandboxTemplates.list',
		{ count: result.items.length },
		'completed',
	);
	return result;
};

export const create: GmicloudEndpoints['sandboxTemplatesCreate'] = async (
	ctx,
	input,
) => {
	const { idempotency_key, ...body } =
		GmicloudEndpointInputSchemas.sandboxTemplatesCreate.parse(input);
	const result = GmicloudEndpointOutputSchemas.sandboxTemplatesCreate.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'POST',
			url: 'v2/templates',
			headers: { 'Idempotency-Key': idempotency_key },
			body,
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.sandboxTemplates.create',
		{},
		'completed',
	);
	return result;
};

export const get: GmicloudEndpoints['sandboxTemplatesGet'] = async (
	ctx,
	input,
) => {
	const { id, idc_name } =
		GmicloudEndpointInputSchemas.sandboxTemplatesGet.parse(input);
	const result = GmicloudEndpointOutputSchemas.sandboxTemplatesGet.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v2/templates/{id}',
			path: { id },
			query: { idc_name },
		}),
	);
	await saveRecords(ctx.db.sandboxTemplates, [result.data]);
	await logEventFromContext(
		ctx,
		'gmicloud.sandboxTemplates.get',
		{ id },
		'completed',
	);
	return result;
};

export const update: GmicloudEndpoints['sandboxTemplatesUpdate'] = async (
	ctx,
	input,
) => {
	const { id, idc_name, ...body } =
		GmicloudEndpointInputSchemas.sandboxTemplatesUpdate.parse(input);
	const result = GmicloudEndpointOutputSchemas.sandboxTemplatesUpdate.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'PATCH',
			url: 'v2/templates/{id}',
			path: { id },
			query: { idc_name },
			body,
		}),
	);
	await saveRecords(ctx.db.sandboxTemplates, [result.data]);
	await logEventFromContext(
		ctx,
		'gmicloud.sandboxTemplates.update',
		{ id },
		'completed',
	);
	return result;
};

export const remove: GmicloudEndpoints['sandboxTemplatesDelete'] = async (
	ctx,
	input,
) => {
	const { id, idc_name } =
		GmicloudEndpointInputSchemas.sandboxTemplatesDelete.parse(input);
	const result = GmicloudEndpointOutputSchemas.sandboxTemplatesDelete.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'DELETE',
			url: 'v2/templates/{id}',
			path: { id },
			query: { idc_name },
		}),
	);
	await forgetRecord(ctx.db.sandboxTemplates, id);
	await logEventFromContext(
		ctx,
		'gmicloud.sandboxTemplates.delete',
		{ id },
		'completed',
	);
	return result;
};

export const listBuilds: GmicloudEndpoints['sandboxTemplatesListBuilds'] =
	async (ctx, input) => {
		const { template_id, page, page_size } =
			GmicloudEndpointInputSchemas.sandboxTemplatesListBuilds.parse(input);
		const result =
			GmicloudEndpointOutputSchemas.sandboxTemplatesListBuilds.parse(
				await makeGmicloudRequest(ctx, {
					api: 'console',
					method: 'GET',
					url: 'v2/templates/{template_id}/builds',
					path: { template_id },
					query: { page, page_size },
				}),
			);
		await logEventFromContext(
			ctx,
			'gmicloud.sandboxTemplates.listBuilds',
			{ template_id },
			'completed',
		);
		return result;
	};

export const getBuild: GmicloudEndpoints['sandboxTemplatesGetBuild'] = async (
	ctx,
	input,
) => {
	const { template_id, id } =
		GmicloudEndpointInputSchemas.sandboxTemplatesGetBuild.parse(input);
	const result = GmicloudEndpointOutputSchemas.sandboxTemplatesGetBuild.parse(
		await makeGmicloudRequest(ctx, {
			api: 'console',
			method: 'GET',
			url: 'v2/templates/{template_id}/builds/{id}',
			path: { template_id, id },
		}),
	);
	await logEventFromContext(
		ctx,
		'gmicloud.sandboxTemplates.getBuild',
		{ template_id, id },
		'completed',
	);
	return result;
};

export const getBuildLogs: GmicloudEndpoints['sandboxTemplatesGetBuildLogs'] =
	async (ctx, input) => {
		const { template_id, id, offset, limit, level } =
			GmicloudEndpointInputSchemas.sandboxTemplatesGetBuildLogs.parse(input);
		const result =
			GmicloudEndpointOutputSchemas.sandboxTemplatesGetBuildLogs.parse(
				await makeGmicloudRequest(ctx, {
					api: 'console',
					method: 'GET',
					url: 'v2/templates/{template_id}/builds/{id}/logs',
					path: { template_id, id },
					query: { offset, limit, level },
				}),
			);
		await logEventFromContext(
			ctx,
			'gmicloud.sandboxTemplates.getBuildLogs',
			{ template_id, id },
			'completed',
		);
		return result;
	};
