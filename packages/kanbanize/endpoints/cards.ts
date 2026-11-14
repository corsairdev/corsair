import { asRecord } from 'corsair/core';
import type { KanbanizeEndpoints } from '..';
import { queryFor, segment, withIdField } from '../client';
import { call, deletedResult } from './call';
import {
	KanbanizeEndpointInputSchemas as Inputs,
	KanbanizeEndpointOutputSchemas as Outputs,
} from './types';

/** Cards per page when the caller names no `per_page`. */
const DEFAULT_PER_PAGE = 200;

/**
 * The card list is the one paginated read: `{ data: { pagination, data } }`.
 * `next_page` is derived here rather than through a transform, because the docs
 * generator reads a transform's input side and would never show the field.
 * A body that is missing its arrays is passed through so the output schema
 * rejects it, rather than being turned into a fake empty page.
 */
// unknown: the raw body is an untyped envelope until the output schema runs.
function listShape(
	raw: unknown,
	parsed: { page?: number | undefined; per_page?: number | undefined },
) {
	const outer = asRecord(raw);
	const inner = asRecord(outer?.data);
	if (!outer || !inner) return raw;

	const cards = inner.data;
	const pagination = asRecord(inner.pagination);
	const page = parsed.page ?? 1;
	const totalPages = pagination?.all_pages;
	const pageSize = parsed.per_page ?? DEFAULT_PER_PAGE;
	const nextPage =
		typeof totalPages === 'number'
			? page < totalPages
				? page + 1
				: null
			: Array.isArray(cards) && cards.length >= pageSize
				? page + 1
				: null;

	return {
		...outer,
		data: { ...inner, data: cards },
		next_page: nextPage,
	};
}

/**
 * `POST /cards` and `PATCH /cards/{card_id}` answer with `data` as an array
 * holding the one card written. The plugin returns that card as `data`, the
 * same shape `cards.get` returns. An empty or missing array is passed on so
 * the output schema rejects it.
 */
// unknown: the raw body is an untyped envelope until the output schema runs.
function writtenCard(raw: unknown): unknown {
	const outer = asRecord(raw);
	if (!outer || !Array.isArray(outer.data) || outer.data.length === 0) {
		return raw;
	}
	return { ...outer, data: outer.data[0] };
}

export const list: KanbanizeEndpoints['cardsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'cards.list',
			input: Inputs.cardsList,
			output: Outputs.cardsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/cards',
			query: queryFor({
				card_ids: parsed.card_ids,
				board_ids: parsed.board_ids,
				workflow_ids: parsed.workflow_ids,
				state: parsed.state,
				column_ids: parsed.column_ids,
				lane_ids: parsed.lane_ids,
				owner_user_ids: parsed.owner_user_ids,
				type_ids: parsed.type_ids,
				custom_ids: parsed.custom_ids,
				is_blocked: parsed.is_blocked,
				priorities: parsed.priorities,
				sizes: parsed.sizes,
				colors: parsed.colors,
				last_column_ids: parsed.last_column_ids,
				last_lane_ids: parsed.last_lane_ids,
				version_ids: parsed.version_ids,
				archived_from_date: parsed.archived_from_date,
				archived_to_date: parsed.archived_to_date,
				discarded_from_date: parsed.discarded_from_date,
				discarded_to_date: parsed.discarded_to_date,
				created_from_date: parsed.created_from_date,
				created_to_date: parsed.created_to_date,
				last_modified_from_date: parsed.last_modified_from_date,
				last_modified_to_date: parsed.last_modified_to_date,
				deadline_from_date: parsed.deadline_from_date,
				deadline_to_date: parsed.deadline_to_date,
				page: parsed.page,
				per_page: parsed.per_page,
				fields: withIdField(parsed.fields, 'card_id'),
				expand: parsed.expand,
			}),
		}),
		{
			shape: listShape,
			log: (_, result) => ({
				count: result.data.data.length,
				totalPages: result.data.pagination?.all_pages ?? undefined,
			}),
		},
	);

export const get: KanbanizeEndpoints['cardsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'cards.get',
			input: Inputs.cardsGet,
			output: Outputs.cardsGet,
		},
		input,
		({ card_id }) => ({
			method: 'GET',
			path: `/cards/${segment(card_id)}`,
		}),
		{ log: (_, result) => ({ cardId: result.data.card_id }) },
	);

export const create: KanbanizeEndpoints['cardsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'cards.create',
			input: Inputs.cardsCreate,
			output: Outputs.cardsCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/cards',
			body: Object.fromEntries(
				Object.entries(parsed).filter(([, value]) => value !== undefined),
			),
		}),
		{
			shape: writtenCard,
			log: (_, result) => ({
				cardId: result.data.card_id,
				boardId: result.data.board_id ?? undefined,
			}),
		},
	);

export const update: KanbanizeEndpoints['cardsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'cards.update',
			input: Inputs.cardsUpdate,
			output: Outputs.cardsUpdate,
		},
		input,
		({ card_id, ...changes }) => ({
			method: 'PATCH',
			path: `/cards/${segment(card_id)}`,
			body: Object.fromEntries(
				Object.entries(changes).filter(([, value]) => value !== undefined),
			),
		}),
		{
			shape: writtenCard,
			log: ({ card_id }) => ({ cardId: card_id }),
		},
	);

export const remove: KanbanizeEndpoints['cardsRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'cards.delete',
			input: Inputs.cardsRemove,
			output: Outputs.cardsRemove,
		},
		input,
		({ card_id, exceeding_reason }) => ({
			method: 'DELETE',
			path: `/cards/${segment(card_id)}`,
			query: queryFor({ exceeding_reason }),
		}),
		{
			shape: () => deletedResult(),
			log: ({ card_id }) => ({ cardId: card_id }),
		},
	);
