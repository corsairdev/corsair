import { asRecord } from 'corsair/core';
import type { MoosendEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	MoosendEndpointInputSchemas as Inputs,
	MoosendEndpointOutputSchemas as Outputs,
} from './types';

/** Lists every active mailing list in the account. */
export const list: MoosendEndpoints['listsList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.list',
			input: Inputs.listsList,
			output: Outputs.listsList,
		},
		input,
		({ withStatistics, shortBy, sortMethod }) => ({
			replayable: true,
			method: 'GET',
			path: '/lists.json',
			query: {
				withStatistics: withStatistics === false ? 'false' : undefined,
				shortBy,
				sortMethod,
			},
		}),
		{
			shape: (raw) => ({ mailingLists: raw }),
			log: (_, result) => ({ lists: result.mailingLists.length }),
		},
	);

/** Lists mailing lists one page at a time. */
export const listPaged: MoosendEndpoints['listsListPaged'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'lists.listPaged',
			input: Inputs.listsListPaged,
			output: Outputs.listsListPaged,
		},
		input,
		({ page, pageSize, shortBy, sortMethod }) => ({
			replayable: true,
			method: 'GET',
			path: `/lists/${segment(page)}/${segment(pageSize)}.json`,
			query: { shortBy, sortMethod },
		}),
		{
			shape: (raw) => {
				// The context keys are snake_case; the schema exposes camelCase.
				const body = asRecord(raw);
				if (!body) {
					throw new Error('Moosend answered no paging context');
				}
				const items = body.mailing_lists;
				return {
					mailingLists: Array.isArray(items) ? items : [],
					paging: body.paging,
				};
			},
			log: (_, result) => ({ lists: result.mailingLists.length }),
		},
	);

/** Reads one mailing list, with or without subscriber statistics. */
export const get: MoosendEndpoints['listsGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.get',
			input: Inputs.listsGet,
			output: Outputs.listsGet,
		},
		input,
		({ mailingListId, withStatistics }) => ({
			replayable: true,
			method: 'GET',
			path: `/lists/${segment(mailingListId)}/details.json`,
			query: { withStatistics: withStatistics === false ? 'false' : undefined },
		}),
		{
			shape: (raw) => ({ mailingList: raw }),
			log: ({ mailingListId }) => ({ mailingListId }),
		},
	);

export const create: MoosendEndpoints['listsCreate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.create',
			input: Inputs.listsCreate,
			output: Outputs.listsCreate,
		},
		input,
		({ name, confirmationPage, redirectAfterUnsubscribePage }) => ({
			method: 'POST',
			path: '/lists/create.json',
			// Body keys follow Moosend's request models (lowercase).
			body: {
				name,
				confirmation_page: confirmationPage,
				redirect_after_unsubscribe_page: redirectAfterUnsubscribePage,
			},
			mediaType: 'application/json',
		}),
		{
			shape: (raw) => ({ mailingList: raw }),
			log: (_, result) => ({ id: result.mailingList.id ?? undefined }),
		},
	);

export const update: MoosendEndpoints['listsUpdate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.update',
			input: Inputs.listsUpdate,
			output: Outputs.listsUpdate,
		},
		input,
		({
			mailingListId,
			name,
			confirmationPage,
			redirectAfterUnsubscribePage,
		}) => ({
			method: 'POST',
			path: `/lists/${segment(mailingListId)}/update.json`,
			body: {
				name,
				confirmation_page: confirmationPage,
				redirect_after_unsubscribe_page: redirectAfterUnsubscribePage,
			},
			mediaType: 'application/json',
		}),
		{
			shape: (raw) => ({ mailingList: raw }),
			log: ({ mailingListId }) => ({ mailingListId }),
		},
	);

/** Deletes a mailing list and all its subscriber data. Cannot be undone. */
export const remove: MoosendEndpoints['listsDelete'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'lists.delete',
			input: Inputs.listsDelete,
			output: Outputs.listsDelete,
		},
		input,
		({ mailingListId }) => ({
			method: 'DELETE',
			path: `/lists/${segment(mailingListId)}/delete.json`,
		}),
		{
			log: ({ mailingListId }) => ({ mailingListId }),
		},
	);
