import type { PrismicEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	PrismicEndpointInputSchemas as Inputs,
	PrismicEndpointOutputSchemas as Outputs,
} from './types';

/**
 * Creates one page in the repository.
 *
 * Prismic saves it as a draft in a migration release, which is published from the
 * UI or the client library afterwards. It accepts one page per request and one
 * request per second per repository.
 */
export const create: PrismicEndpoints['migrationCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'migration.create',
			input: Inputs.migrationCreate,
			output: Outputs.migrationCreate,
		},
		input,
		({ title, type, uid, lang, data, tags, alternate_language_id }) => ({
			method: 'POST',
			api: 'migration',
			url: '/documents',
			body: {
				title,
				type,
				uid,
				lang,
				data,
				tags,
				alternate_language_id,
			},
		}),
		{
			log: ({ type, lang }, result) => ({
				documentId: result.id ?? undefined,
				type,
				lang,
			}),
		},
	);

/**
 * Updates one existing page. `type`, `lang` and `alternate_language_id` cannot be
 * changed, so they are not part of the input.
 */
export const update: PrismicEndpoints['migrationUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'migration.update',
			input: Inputs.migrationUpdate,
			output: Outputs.migrationUpdate,
		},
		input,
		({ id, uid, data, title, tags }) => ({
			method: 'PUT',
			api: 'migration',
			url: `/documents/${segment(id)}/`,
			body: { uid, data, title, tags },
		}),
		{ log: ({ id }) => ({ documentId: id }) },
	);
