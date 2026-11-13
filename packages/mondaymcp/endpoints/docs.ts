import { logEventFromContext } from 'corsair/core';
import type { MondayMcpEndpoints } from '..';
import { makeMondayMcpToolCall } from '../client';
import {
	MondayMcpEndpointInputSchemas,
	MondayMcpEndpointOutputSchemas,
} from './types';

// Docs, dashboards & views family: create_doc, update_doc, read_docs,
// create_dashboard, create_widget, all_widgets_schema, create_view,
// update_view, create_view_table, update_view_table.
export const docsCreate: MondayMcpEndpoints['docs.create'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['docs.create'].parse(input);
	const result = await makeMondayMcpToolCall(ctx.key, 'create_doc', parsed);
	const output = MondayMcpEndpointOutputSchemas['docs.create'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.docs.create',
		{ ...parsed },
		'completed',
	);
	return output;
};

export const docsUpdate: MondayMcpEndpoints['docs.update'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['docs.update'].parse(input);
	const result = await makeMondayMcpToolCall(ctx.key, 'update_doc', parsed);
	const output = MondayMcpEndpointOutputSchemas['docs.update'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.docs.update',
		{ ...parsed },
		'completed',
	);
	return output;
};

export const docsRead: MondayMcpEndpoints['docs.read'] = async (ctx, input) => {
	const parsed = MondayMcpEndpointInputSchemas['docs.read'].parse(input);
	const result = await makeMondayMcpToolCall(ctx.key, 'read_docs', parsed);
	const output = MondayMcpEndpointOutputSchemas['docs.read'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.docs.read',
		{ ...parsed },
		'completed',
	);
	return output;
};

export const dashboardsCreate: MondayMcpEndpoints['dashboards.create'] = async (
	ctx,
	input,
) => {
	const parsed =
		MondayMcpEndpointInputSchemas['dashboards.create'].parse(input);
	const result = await makeMondayMcpToolCall(
		ctx.key,
		'create_dashboard',
		parsed,
	);
	const output =
		MondayMcpEndpointOutputSchemas['dashboards.create'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.dashboards.create',
		{ ...parsed },
		'completed',
	);
	return output;
};

export const dashboardsCreateWidget: MondayMcpEndpoints['dashboards.createWidget'] =
	async (ctx, input) => {
		const parsed =
			MondayMcpEndpointInputSchemas['dashboards.createWidget'].parse(input);
		const result = await makeMondayMcpToolCall(
			ctx.key,
			'create_widget',
			parsed,
		);
		const output =
			MondayMcpEndpointOutputSchemas['dashboards.createWidget'].parse(result);
		await logEventFromContext(
			ctx,
			'mondaymcp.dashboards.createWidget',
			{ ...parsed },
			'completed',
		);
		return output;
	};

export const dashboardsAllWidgetsSchema: MondayMcpEndpoints['dashboards.allWidgetsSchema'] =
	async (ctx, input) => {
		const parsed =
			MondayMcpEndpointInputSchemas['dashboards.allWidgetsSchema'].parse(input);
		const result = await makeMondayMcpToolCall(
			ctx.key,
			'all_widgets_schema',
			parsed,
		);
		const output =
			MondayMcpEndpointOutputSchemas['dashboards.allWidgetsSchema'].parse(
				result,
			);
		await logEventFromContext(
			ctx,
			'mondaymcp.dashboards.allWidgetsSchema',
			{ ...parsed },
			'completed',
		);
		return output;
	};

export const viewsCreate: MondayMcpEndpoints['views.create'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['views.create'].parse(input);
	const result = await makeMondayMcpToolCall(ctx.key, 'create_view', parsed);
	const output = MondayMcpEndpointOutputSchemas['views.create'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.views.create',
		{ ...parsed },
		'completed',
	);
	return output;
};

export const viewsUpdate: MondayMcpEndpoints['views.update'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['views.update'].parse(input);
	const result = await makeMondayMcpToolCall(ctx.key, 'update_view', parsed);
	const output = MondayMcpEndpointOutputSchemas['views.update'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.views.update',
		{ ...parsed },
		'completed',
	);
	return output;
};

export const viewsCreateTable: MondayMcpEndpoints['views.createTable'] = async (
	ctx,
	input,
) => {
	const parsed =
		MondayMcpEndpointInputSchemas['views.createTable'].parse(input);
	const result = await makeMondayMcpToolCall(
		ctx.key,
		'create_view_table',
		parsed,
	);
	const output =
		MondayMcpEndpointOutputSchemas['views.createTable'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.views.createTable',
		{ ...parsed },
		'completed',
	);
	return output;
};

export const viewsUpdateTable: MondayMcpEndpoints['views.updateTable'] = async (
	ctx,
	input,
) => {
	const parsed =
		MondayMcpEndpointInputSchemas['views.updateTable'].parse(input);
	const result = await makeMondayMcpToolCall(
		ctx.key,
		'update_view_table',
		parsed,
	);
	const output =
		MondayMcpEndpointOutputSchemas['views.updateTable'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.views.updateTable',
		{ ...parsed },
		'completed',
	);
	return output;
};
