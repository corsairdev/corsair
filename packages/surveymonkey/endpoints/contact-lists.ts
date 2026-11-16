import type { SurveymonkeyEndpoints } from '..';
import { segment } from '../client';
import { call, listBody, queryOf, unwrapList } from './call';
import {
	SurveymonkeyEndpointInputSchemas as Inputs,
	SurveymonkeyEndpointOutputSchemas as Outputs,
} from './types';

export const list: SurveymonkeyEndpoints['contactListsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contactLists.list',
			input: Inputs.contactListsList,
			output: Outputs.contactListsList,
		},
		input,
		({ page, per_page }) => ({
			method: 'GET',
			path: '/contact_lists',
			query: queryOf({ page, per_page }),
		}),
		{
			shape: (raw) => ({
				...listBody(raw, 'contact list'),
				data: unwrapList(raw, 'contact list'),
			}),
			log: (_, result) => ({ count: result.data.length }),
		},
	);

export const create: SurveymonkeyEndpoints['contactListsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contactLists.create',
			input: Inputs.contactListsCreate,
			output: Outputs.contactListsCreate,
		},
		input,
		({ name }) => ({
			method: 'POST',
			path: '/contact_lists',
			body: { name },
		}),
		{
			log: (_, result) => ({ contactListId: result.id }),
		},
	);

export const get: SurveymonkeyEndpoints['contactListsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contactLists.get',
			input: Inputs.contactListsGet,
			output: Outputs.contactListsGet,
		},
		input,
		({ contact_list_id }) => ({
			method: 'GET',
			path: `/contact_lists/${segment(contact_list_id)}`,
		}),
		{
			log: (parsed) => ({ contactListId: parsed.contact_list_id }),
		},
	);

export const update: SurveymonkeyEndpoints['contactListsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contactLists.update',
			input: Inputs.contactListsUpdate,
			output: Outputs.contactListsUpdate,
		},
		input,
		({ contact_list_id, name }) => ({
			method: 'PATCH',
			path: `/contact_lists/${segment(contact_list_id)}`,
			body: { name },
		}),
		{
			log: (parsed) => ({ contactListId: parsed.contact_list_id }),
		},
	);

export const remove: SurveymonkeyEndpoints['contactListsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'contactLists.delete',
			input: Inputs.contactListsDelete,
			output: Outputs.contactListsDelete,
		},
		input,
		({ contact_list_id }) => ({
			method: 'DELETE',
			path: `/contact_lists/${segment(contact_list_id)}`,
		}),
		{
			shape: (_, parsed) => ({
				contact_list_id: parsed.contact_list_id,
				deleted: true,
			}),
			log: (parsed) => ({ contactListId: parsed.contact_list_id }),
		},
	);

export const copy: SurveymonkeyEndpoints['contactListsCopy'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contactLists.copy',
			input: Inputs.contactListsCopy,
			output: Outputs.contactListsCopy,
		},
		input,
		({ contact_list_id, name }) => ({
			method: 'POST',
			path: `/contact_lists/${segment(contact_list_id)}/copy`,
			body: name === undefined ? {} : { name },
		}),
		{
			log: (parsed, result) => ({
				sourceListId: parsed.contact_list_id,
				contactListId: result.id,
			}),
		},
	);

/**
 * A merge copies every contact from `list_id` into the list in the URL
 * (`contact_list_id`) and answers that list. `list_id` keeps its contacts.
 */
export const merge: SurveymonkeyEndpoints['contactListsMerge'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contactLists.merge',
			input: Inputs.contactListsMerge,
			output: Outputs.contactListsMerge,
		},
		input,
		({ contact_list_id, list_id }) => ({
			method: 'POST',
			path: `/contact_lists/${segment(contact_list_id)}/merge`,
			body: { list_id },
		}),
		{
			// unknown: the documented answer is the target list, `{ id, name, href }`.
			shape: (raw: unknown, parsed) => ({
				...(raw !== null && typeof raw === 'object' ? raw : {}),
				source_list_id: parsed.list_id,
				target_list_id: parsed.contact_list_id,
			}),
			log: (parsed) => ({
				sourceListId: parsed.list_id,
				targetListId: parsed.contact_list_id,
			}),
		},
	);
