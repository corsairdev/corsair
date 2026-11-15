import type { KontentEndpoints } from '..';
import { definedQuery, segment } from '../client';
import { call, listShape } from './call';
import {
	filterParams,
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
			preview: parsed.preview,
			query: definedQuery({
				skip: parsed.skip,
				limit: parsed.limit,
				depth: parsed.depth,
				order: parsed.order,
				// Kontent ignores a bare `type` or `collection` parameter and
				// answers every item, so both go out as system-property filters.
				'system.type': parsed.type,
				language: parsed.language,
				'system.collection': parsed.collection,
				// Each filter is its own parameter (`elements.price[gt]=10`).
				...(parsed.in_filter ? filterParams(parsed.in_filter) : {}),
				// Repeated `elements` keys get a 400; Kontent wants one list.
				elements: parsed.elements?.join(','),
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
			preview,
			query: definedQuery({
				depth,
				language,
				elements: elements?.join(','),
			}),
		}),
		{
			log: (_, result) => ({
				codename: result.item.system.codename ?? undefined,
				type: result.item.system.type ?? undefined,
			}),
		},
	);
