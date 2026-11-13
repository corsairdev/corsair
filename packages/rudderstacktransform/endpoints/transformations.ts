import type { RudderStackTransformationEndpoints } from '..';
import { call, segment } from './call';
import {
	RudderStackTransformationEndpointInputSchemas as Inputs,
	RudderStackTransformationEndpointOutputSchemas as Outputs,
} from './types';

export const list: RudderStackTransformationEndpoints['transformationsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'transformations.list',
			input: Inputs.transformationsList,
			output: Outputs.transformationsList,
		},
		input,
		() => ({ method: 'GET', path: '/transformations', replayable: true }),
		{
			log: (_, result) => ({
				count: result.transformations?.length ?? 0,
			}),
		},
	);

/**
 * Creating without `publish` only writes a revision: the code is not live and no
 * destination can be connected until it is published.
 */
export const create: RudderStackTransformationEndpoints['transformationsCreate'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'transformations.create',
				input: Inputs.transformationsCreate,
				output: Outputs.transformationsCreate,
			},
			input,
			({
				name,
				language,
				description,
				code,
				destinationIds,
				events,
				publish,
			}) => ({
				method: 'POST',
				path: '/transformations',
				query: { publish },
				body: { name, language, description, code, destinationIds, events },
				// Creating twice makes two transformations with different IDs, and
				// there is no idempotency key to collapse them.
				replayable: false,
			}),
			{
				log: (parsed, result) => ({
					transformationId: result.id ?? undefined,
					language: parsed.language,
					published: parsed.publish === true,
				}),
			},
		);

export const get: RudderStackTransformationEndpoints['transformationsGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'transformations.get',
			input: Inputs.transformationsGet,
			output: Outputs.transformationsGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/transformations/${segment(id)}`,
			replayable: true,
		}),
		{
			log: (_, result) => ({ name: result.name ?? undefined }),
		},
	);

/**
 * An update always creates a revision. `publish: true` also makes it live, which
 * is the difference between a draft edit and a deploy.
 */
export const update: RudderStackTransformationEndpoints['transformationsUpdate'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'transformations.update',
				input: Inputs.transformationsUpdate,
				output: Outputs.transformationsUpdate,
			},
			input,
			({ id, name, description, code, publish }) => ({
				method: 'POST',
				path: `/transformations/${segment(id)}`,
				query: { publish },
				body: { name, description, code },
				// Each replay appends another revision, so a retry leaves history the
				// caller did not ask for.
				replayable: false,
			}),
			{
				log: (parsed, result) => ({
					transformationId: result.id ?? undefined,
					versionId: result.versionId ?? undefined,
					published: parsed.publish === true,
				}),
			},
		);

export const remove: RudderStackTransformationEndpoints['transformationsDelete'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'transformations.delete',
				input: Inputs.transformationsDelete,
				output: Outputs.transformationsDelete,
			},
			input,
			({ id }) => ({
				method: 'DELETE',
				path: `/transformations/${segment(id)}`,
				// A second delete finds nothing and answers 404; the first one has
				// already taken effect, so it is not replayed.
				replayable: false,
			}),
			{
				// An empty 200 arrives as undefined, and the output schema expects an
				// object.
				shape: () => ({}),
				log: (parsed) => ({ transformationId: parsed.id }),
			},
		);

export const listVersions: RudderStackTransformationEndpoints['transformationsListVersions'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'transformations.listVersions',
				input: Inputs.transformationsListVersions,
				output: Outputs.transformationsListVersions,
			},
			input,
			({ id, count, orderBy }) => ({
				method: 'GET',
				path: `/transformations/${segment(id)}/versions`,
				query: { count, orderBy },
				replayable: true,
			}),
			{
				log: (_, result) => ({
					count: result.TransformationVersions?.length ?? 0,
				}),
			},
		);

export const getVersion: RudderStackTransformationEndpoints['transformationsGetVersion'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'transformations.getVersion',
				input: Inputs.transformationsGetVersion,
				output: Outputs.transformationsGetVersion,
			},
			input,
			({ id, versionId }) => ({
				method: 'GET',
				path: `/transformations/${segment(id)}/versions/${segment(versionId)}`,
				replayable: true,
			}),
			{
				log: (_, result) => ({
					versionId: result.versionId ?? undefined,
					language: result.language ?? undefined,
				}),
			},
		);

/**
 * A destination can have only one transformation connected, so this replaces any
 * transformation already on it. The transformation must be published first.
 */
export const connect: RudderStackTransformationEndpoints['transformationsConnect'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'transformations.connect',
				input: Inputs.transformationsConnect,
				output: Outputs.transformationsConnect,
			},
			input,
			({ id, destinationId }) => ({
				method: 'POST',
				path: `/transformations/${segment(id)}/connectToDestination`,
				body: { destinationId },
				// Connecting again to the same destination is idempotent: it leaves the
				// same connection in place, so a retry cannot attach a second one.
				replayable: true,
			}),
			{
				log: (parsed, result) => ({
					transformationId: result.id ?? parsed.id,
					destinations: result.destinations?.length ?? 0,
				}),
			},
		);

export const disconnect: RudderStackTransformationEndpoints['transformationsDisconnect'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'transformations.disconnect',
				input: Inputs.transformationsDisconnect,
				output: Outputs.transformationsDisconnect,
			},
			input,
			({ id, destinationId }) => ({
				method: 'POST',
				path: `/transformations/${segment(id)}/disconnectFromDestination`,
				body: { destinationId },
				// Removing a connection that is already gone leaves it gone.
				replayable: true,
			}),
			{
				log: (parsed) => ({ transformationId: parsed.id }),
			},
		);
