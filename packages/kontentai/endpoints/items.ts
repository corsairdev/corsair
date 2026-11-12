import type { KontentEndpoints } from '..';
import { definedQuery, segment } from '../client';
import { call, listShape } from './call';
import {
	KontentEndpointInputSchemas as Inputs,
	KONTENT_DEFAULT_LIMIT,
	KontentEndpointOutputSchemas as Outputs,
} from './types';

export const list: KontentEndpoints['itemsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'items.list',
			input: Inputs.itemsList,
			output: Outputs.itemsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/items',
			previewToken: parsed.preview,
			query: definedQuery({
				skip: parsed.skip,
				limit: parsed.limit,
				depth: parsed.depth,
				order: parsed.order,
				type: parsed.type,
				language: parsed.language,
				collection: parsed.collection,
				// Kontent calls the filter parameter `in_filter`, not `filter`.
				in_filter: parsed.in_filter,
				elements: parsed.elements,
			}),
		}),
		{
			shape: (raw, parsed) =>
				listShape(raw, parsed, 'items', KONTENT_DEFAULT_LIMIT),
			log: (_, result) => ({
				count: result.items.length,
				total: result.pagination?.count ?? undefined,
			}),
		},
	);

export const get: KontentEndpoints['itemsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'items.get',
			input: Inputs.itemsGet,
			output: Outputs.itemsGet,
		},
		input,
		({ codename, depth, language, elements, preview }) => ({
			method: 'GET',
			path: `/items/${segment(codename)}`,
			previewToken: preview,
			query: definedQuery({ depth, language, elements }),
		}),
		{
			log: (_, result) => ({
				codename: result.item.system.codename ?? undefined,
				type: result.item.system.type ?? undefined,
			}),
		},
	);
