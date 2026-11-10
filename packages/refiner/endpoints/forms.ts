import type { RefinerEndpoints } from '..';
import { call } from './call';
import {
	RefinerEndpointInputSchemas as Inputs,
	RefinerEndpointOutputSchemas as Outputs,
} from './types';

export const list: RefinerEndpoints['formsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'forms.list',
			input: Inputs.formsList,
			output: Outputs.formsList,
		},
		input,
		({ list: which, page, page_length, include_config, include_info }) => ({
			method: 'GET',
			path: '/forms',
			query: {
				list: which,
				page,
				page_length,
				include_config,
				include_info,
			},
			replayable: true,
		}),
		{
			log: (_, result) => ({
				count: result.items?.length ?? 0,
				total: result.pagination?.items_count ?? undefined,
			}),
		},
	);

/**
 * Publish or unpublish a survey. `published` defaults to true, so a call with only
 * `form_uuid` takes a draft live.
 */
export const publish: RefinerEndpoints['formsPublish'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'forms.publish',
			input: Inputs.formsPublish,
			output: Outputs.formsPublish,
		},
		input,
		({ form_uuid, published }) => ({
			method: 'POST',
			path: '/forms/publish',
			body: {
				form_uuid,
				published: published === undefined ? undefined : published ? 1 : 0,
			},
			// Publishing an already-published survey leaves it published.
			replayable: true,
		}),
		{
			log: (parsed) => ({
				formUuid: parsed.form_uuid,
				published: parsed.published !== false,
			}),
		},
	);

/**
 * Refiner archives rather than deletes: the route is `DELETE /forms`, but the docs
 * say "archive", and an archived survey still appears under `all_with_archived`.
 */
export const archive: RefinerEndpoints['formsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'forms.archive',
			input: Inputs.formsDelete,
			output: Outputs.formsDelete,
		},
		input,
		({ form_uuid }) => ({
			method: 'DELETE',
			path: '/forms',
			body: { form_uuid },
			// Archiving an archived survey leaves it archived.
			replayable: true,
		}),
		{
			log: (parsed) => ({ formUuid: parsed.form_uuid }),
		},
	);

export const duplicate: RefinerEndpoints['formsDuplicate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'forms.duplicate',
			input: Inputs.formsDuplicate,
			output: Outputs.formsDuplicate,
		},
		input,
		({ form_uuid, name }) => ({
			method: 'POST',
			path: '/forms/duplicate',
			body: { form_uuid, name },
			// A replay creates a second copy under the same name.
			replayable: false,
		}),
		{
			log: (_, result) => ({ newFormUuid: result.new_form_uuid ?? undefined }),
		},
	);

export const history: RefinerEndpoints['formsHistory'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'forms.history',
			input: Inputs.formsHistory,
			output: Outputs.formsHistory,
		},
		input,
		({ form_uuid, page, page_length }) => ({
			method: 'GET',
			path: '/forms/history',
			query: { form_uuid, page, page_length },
			replayable: true,
		}),
		{
			log: (_, result) => ({
				versions: result.items?.length ?? 0,
				total: result.pagination?.items_count ?? undefined,
			}),
		},
	);
