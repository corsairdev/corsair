import { logEventFromContext } from 'corsair/core';
import { FELT_SYNC_EXPORT_TIMEOUT_MS, makeFeltRequest } from '../client';
import type { FeltEndpoints } from '../index';
import type {
	PrintLayout,
	PrintPage,
	PrintPageDetail,
	PrintPageExport,
} from './types';
import { FeltEndpointInputSchemas, FeltEndpointOutputSchemas } from './types';

export const PrintPages = {
	listLayouts: (async (ctx, rawInput) => {
		const input =
			FeltEndpointInputSchemas.printPagesListLayouts.parse(rawInput);
		const response = await makeFeltRequest<PrintLayout[]>(
			`/maps/${encodeURIComponent(input.map_id)}/print_layouts`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed =
			FeltEndpointOutputSchemas.printPagesListLayouts.parse(response);
		await logEventFromContext(
			ctx,
			'felt.printPages.listLayouts',
			{ map_id: input.map_id, count: parsed.length },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['printPagesListLayouts'],

	createLayout: (async (ctx, rawInput) => {
		const input =
			FeltEndpointInputSchemas.printPagesCreateLayout.parse(rawInput);
		const { map_id, ...body } = input;
		const response = await makeFeltRequest<PrintLayout>(
			`/maps/${encodeURIComponent(map_id)}/print_layouts`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);
		const parsed =
			FeltEndpointOutputSchemas.printPagesCreateLayout.parse(response);
		await logEventFromContext(
			ctx,
			'felt.printPages.createLayout',
			{ map_id, id: parsed.id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['printPagesCreateLayout'],

	updateLayout: (async (ctx, rawInput) => {
		const input =
			FeltEndpointInputSchemas.printPagesUpdateLayout.parse(rawInput);
		const { map_id, layout_id, ...body } = input;
		const response = await makeFeltRequest<PrintLayout>(
			`/maps/${encodeURIComponent(map_id)}/print_layouts/${encodeURIComponent(layout_id)}`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);
		const parsed =
			FeltEndpointOutputSchemas.printPagesUpdateLayout.parse(response);
		await logEventFromContext(
			ctx,
			'felt.printPages.updateLayout',
			{ map_id, layout_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['printPagesUpdateLayout'],

	deleteLayout: (async (ctx, rawInput) => {
		const input =
			FeltEndpointInputSchemas.printPagesDeleteLayout.parse(rawInput);
		await makeFeltRequest<void>(
			`/maps/${encodeURIComponent(input.map_id)}/print_layouts/${encodeURIComponent(input.layout_id)}`,
			ctx.key,
			{
				method: 'DELETE',
			},
		);
		const parsed = FeltEndpointOutputSchemas.printPagesDeleteLayout.parse({
			success: true,
			id: input.layout_id,
		});
		await logEventFromContext(
			ctx,
			'felt.printPages.deleteLayout',
			{ map_id: input.map_id, layout_id: input.layout_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['printPagesDeleteLayout'],

	listPages: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.printPagesListPages.parse(rawInput);
		const response = await makeFeltRequest<PrintPage[]>(
			`/maps/${encodeURIComponent(input.map_id)}/print_pages`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed =
			FeltEndpointOutputSchemas.printPagesListPages.parse(response);
		await logEventFromContext(
			ctx,
			'felt.printPages.listPages',
			{ map_id: input.map_id, count: parsed.length },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['printPagesListPages'],

	createPage: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.printPagesCreatePage.parse(rawInput);
		const { map_id, ...body } = input;
		const response = await makeFeltRequest<PrintPageDetail>(
			`/maps/${encodeURIComponent(map_id)}/print_pages`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);
		const parsed =
			FeltEndpointOutputSchemas.printPagesCreatePage.parse(response);
		await logEventFromContext(
			ctx,
			'felt.printPages.createPage',
			{ map_id, id: parsed.id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['printPagesCreatePage'],

	getPage: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.printPagesGetPage.parse(rawInput);
		const response = await makeFeltRequest<PrintPageDetail>(
			`/maps/${encodeURIComponent(input.map_id)}/print_pages/${encodeURIComponent(input.page_id)}`,
			ctx.key,
			{
				method: 'GET',
			},
		);
		const parsed = FeltEndpointOutputSchemas.printPagesGetPage.parse(response);
		await logEventFromContext(
			ctx,
			'felt.printPages.getPage',
			{ map_id: input.map_id, page_id: input.page_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['printPagesGetPage'],

	updatePage: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.printPagesUpdatePage.parse(rawInput);
		const { map_id, page_id, ...body } = input;
		const response = await makeFeltRequest<PrintPageDetail>(
			`/maps/${encodeURIComponent(map_id)}/print_pages/${encodeURIComponent(page_id)}`,
			ctx.key,
			{
				method: 'POST',
				body,
			},
		);
		const parsed =
			FeltEndpointOutputSchemas.printPagesUpdatePage.parse(response);
		await logEventFromContext(
			ctx,
			'felt.printPages.updatePage',
			{ map_id, page_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['printPagesUpdatePage'],

	deletePage: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.printPagesDeletePage.parse(rawInput);
		await makeFeltRequest<void>(
			`/maps/${encodeURIComponent(input.map_id)}/print_pages/${encodeURIComponent(input.page_id)}`,
			ctx.key,
			{
				method: 'DELETE',
			},
		);
		const parsed = FeltEndpointOutputSchemas.printPagesDeletePage.parse({
			success: true,
			id: input.page_id,
		});
		await logEventFromContext(
			ctx,
			'felt.printPages.deletePage',
			{ map_id: input.map_id, page_id: input.page_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['printPagesDeletePage'],

	exportPage: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.printPagesExportPage.parse(rawInput);
		const response = await makeFeltRequest<PrintPageExport>(
			`/maps/${encodeURIComponent(input.map_id)}/print_pages/${encodeURIComponent(input.page_id)}/exports`,
			ctx.key,
			{
				method: 'POST',
				timeoutMs: FELT_SYNC_EXPORT_TIMEOUT_MS,
			},
		);
		const parsed =
			FeltEndpointOutputSchemas.printPagesExportPage.parse(response);
		await logEventFromContext(
			ctx,
			'felt.printPages.exportPage',
			{ map_id: input.map_id, page_id: input.page_id, export_id: parsed.id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['printPagesExportPage'],

	upsertItems: (async (ctx, rawInput) => {
		const input =
			FeltEndpointInputSchemas.printPagesUpsertItems.parse(rawInput);
		const response = await makeFeltRequest<PrintPageDetail>(
			`/maps/${encodeURIComponent(input.map_id)}/print_pages/${encodeURIComponent(input.page_id)}/items`,
			ctx.key,
			{
				method: 'POST',
				body: { items: input.items },
			},
		);
		const parsed =
			FeltEndpointOutputSchemas.printPagesUpsertItems.parse(response);
		await logEventFromContext(
			ctx,
			'felt.printPages.upsertItems',
			{
				map_id: input.map_id,
				page_id: input.page_id,
				count: input.items.length,
			},
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['printPagesUpsertItems'],

	deleteItem: (async (ctx, rawInput) => {
		const input = FeltEndpointInputSchemas.printPagesDeleteItem.parse(rawInput);
		await makeFeltRequest<void>(
			`/maps/${encodeURIComponent(input.map_id)}/print_pages/${encodeURIComponent(input.page_id)}/items/${encodeURIComponent(input.item_id)}`,
			ctx.key,
			{
				method: 'DELETE',
			},
		);
		const parsed = FeltEndpointOutputSchemas.printPagesDeleteItem.parse({
			success: true,
			id: input.item_id,
		});
		await logEventFromContext(
			ctx,
			'felt.printPages.deleteItem',
			{ map_id: input.map_id, page_id: input.page_id, item_id: input.item_id },
			'completed',
		);
		return parsed;
	}) as FeltEndpoints['printPagesDeleteItem'],
};
