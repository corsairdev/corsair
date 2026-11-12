import type { KnackContext } from '..';
import { segment } from '../client';
import { callKnack, requireKnackCredentials } from './call';
import type { KnackEndpointInputs, KnackEndpointOutputs } from './types';
import {
	KnackApplicationsGetInputSchema,
	KnackApplicationsGetResponseSchema,
	KnackObjectsGetInputSchema,
	KnackObjectsGetResponseSchema,
	KnackObjectsListInputSchema,
	KnackObjectsListResponseSchema,
} from './types';

/**
 * The app's full metadata: its objects, each object's fields, and the record
 * count per object. This is what tells a caller which `field_N` keys exist
 * before they write anything, so it doubles as schema discovery.
 *
 * The application id is part of the credential pair rather than an input, so
 * there is no way to ask for an app the account is not connected to.
 */
export const applicationsGet = (
	ctx: KnackContext,
	input: KnackEndpointInputs['applicationsGet'],
): Promise<KnackEndpointOutputs['applicationsGet']> =>
	callKnack(
		ctx,
		{
			event: 'applications.get',
			input: KnackApplicationsGetInputSchema,
			output: KnackApplicationsGetResponseSchema,
		},
		input,
		() => ({
			method: 'GET',
			path: `/applications/${segment(requireKnackCredentials(ctx.key).applicationId)}`,
		}),
		{
			log: (_parsed, result) => ({
				application: result.application.name ?? undefined,
				objects: result.application.objects?.length ?? 0,
			}),
		},
	);

export const objectsList = (
	ctx: KnackContext,
	input: KnackEndpointInputs['objectsList'],
): Promise<KnackEndpointOutputs['objectsList']> =>
	callKnack(
		ctx,
		{
			event: 'objects.list',
			input: KnackObjectsListInputSchema,
			output: KnackObjectsListResponseSchema,
		},
		input,
		() => ({ method: 'GET', path: '/objects' }),
		{
			log: (_parsed, result) => ({ objects: result.objects.length }),
		},
	);

/**
 * One object's definition. Knack answers `200 {}` for a key that is not in the
 * app, so a missing `object` is raised as an error rather than returned as a
 * blank table.
 */
export const objectsGet = (
	ctx: KnackContext,
	input: KnackEndpointInputs['objectsGet'],
): Promise<KnackEndpointOutputs['objectsGet']> =>
	callKnack(
		ctx,
		{
			event: 'objects.get',
			input: KnackObjectsGetInputSchema,
			output: KnackObjectsGetResponseSchema,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/objects/${segment(parsed.object_key)}`,
		}),
		{
			// A missing object is an empty body with a 200, so this turns it into
			// the error a caller expects for a key that is not in their app.
			shape: (raw) => {
				const parsed = KnackObjectsGetResponseSchema.parse(raw);
				if (!parsed.object) {
					throw new Error(
						'Knack returned no object. A key that is not in this app answers an empty body rather than a 404.',
					);
				}
				return parsed;
			},
			log: (parsed) => ({ object_key: parsed.object_key }),
		},
	);
