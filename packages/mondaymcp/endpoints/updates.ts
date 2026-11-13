import { logEventFromContext } from 'corsair/core';
import type { MondayMcpEndpoints } from '..';
import { makeMondayMcpToolCall } from '../client';
import { safeEventPayload } from '../safe-event';
import {
	MondayMcpEndpointInputSchemas,
	MondayMcpEndpointOutputSchemas,
} from './types';

// Updates, notifications, search, assets & meetings family: create_update,
// get_updates, create_notification, search, get_assets, get_asset_upload_url,
// finalize_asset_upload, get_notetaker_meetings.
export const updatesCreate: MondayMcpEndpoints['updates.create'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['updates.create'].parse(input);
	const result = await makeMondayMcpToolCall(ctx.key, 'create_update', parsed);
	const output = MondayMcpEndpointOutputSchemas['updates.create'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.updates.create',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const updatesList: MondayMcpEndpoints['updates.list'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['updates.list'].parse(input);
	const result = await makeMondayMcpToolCall(ctx.key, 'get_updates', parsed);
	const output = MondayMcpEndpointOutputSchemas['updates.list'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.updates.list',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const notificationsCreate: MondayMcpEndpoints['notifications.create'] =
	async (ctx, input) => {
		const parsed =
			MondayMcpEndpointInputSchemas['notifications.create'].parse(input);
		const result = await makeMondayMcpToolCall(
			ctx.key,
			'create_notification',
			parsed,
		);
		const output =
			MondayMcpEndpointOutputSchemas['notifications.create'].parse(result);
		await logEventFromContext(
			ctx,
			'mondaymcp.notifications.create',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};

export const searchQuery: MondayMcpEndpoints['search.query'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['search.query'].parse(input);
	const result = await makeMondayMcpToolCall(ctx.key, 'search', parsed);
	const output = MondayMcpEndpointOutputSchemas['search.query'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.search.query',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const assetsGet: MondayMcpEndpoints['assets.get'] = async (
	ctx,
	input,
) => {
	const parsed = MondayMcpEndpointInputSchemas['assets.get'].parse(input);
	const result = await makeMondayMcpToolCall(ctx.key, 'get_assets', parsed);
	const output = MondayMcpEndpointOutputSchemas['assets.get'].parse(result);
	await logEventFromContext(
		ctx,
		'mondaymcp.assets.get',
		{ ...safeEventPayload(parsed) },
		'completed',
	);
	return output;
};

export const assetsGetUploadUrl: MondayMcpEndpoints['assets.getUploadUrl'] =
	async (ctx, input) => {
		const parsed =
			MondayMcpEndpointInputSchemas['assets.getUploadUrl'].parse(input);
		const result = await makeMondayMcpToolCall(
			ctx.key,
			'get_asset_upload_url',
			parsed,
		);
		const output =
			MondayMcpEndpointOutputSchemas['assets.getUploadUrl'].parse(result);
		await logEventFromContext(
			ctx,
			'mondaymcp.assets.getUploadUrl',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};

export const assetsFinalizeUpload: MondayMcpEndpoints['assets.finalizeUpload'] =
	async (ctx, input) => {
		const parsed =
			MondayMcpEndpointInputSchemas['assets.finalizeUpload'].parse(input);
		const result = await makeMondayMcpToolCall(
			ctx.key,
			'finalize_asset_upload',
			parsed,
		);
		const output =
			MondayMcpEndpointOutputSchemas['assets.finalizeUpload'].parse(result);
		await logEventFromContext(
			ctx,
			'mondaymcp.assets.finalizeUpload',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};

export const meetingsGetNotetaker: MondayMcpEndpoints['meetings.getNotetaker'] =
	async (ctx, input) => {
		const parsed =
			MondayMcpEndpointInputSchemas['meetings.getNotetaker'].parse(input);
		const result = await makeMondayMcpToolCall(
			ctx.key,
			'get_notetaker_meetings',
			parsed,
		);
		const output =
			MondayMcpEndpointOutputSchemas['meetings.getNotetaker'].parse(result);
		await logEventFromContext(
			ctx,
			'mondaymcp.meetings.getNotetaker',
			{ ...safeEventPayload(parsed) },
			'completed',
		);
		return output;
	};
