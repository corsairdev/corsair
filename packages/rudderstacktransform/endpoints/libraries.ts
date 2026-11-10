import type { RudderStackTransformationEndpoints } from '..';
import { call, segment } from './call';
import {
	RudderStackTransformationEndpointInputSchemas as Inputs,
	RudderStackTransformationEndpointOutputSchemas as Outputs,
} from './types';

export const create: RudderStackTransformationEndpoints['librariesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'libraries.create',
			input: Inputs.librariesCreate,
			output: Outputs.librariesCreate,
		},
		input,
		({ name, language, code, description, publish }) => ({
			method: 'POST',
			path: '/libraries',
			query: { publish },
			body: { name, language, code, description },
			// Two creates make two libraries, and the import name a transformation
			// depends on is derived from the name, so a duplicate is not harmless.
			replayable: false,
		}),
		{
			log: (_, result) => ({
				libraryId: result.id ?? undefined,
				importName: result.importName ?? undefined,
			}),
		},
	);

export const list: RudderStackTransformationEndpoints['librariesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'libraries.list',
			input: Inputs.librariesList,
			output: Outputs.librariesList,
		},
		input,
		() => ({ method: 'GET', path: '/libraries', replayable: true }),
		{
			log: (_, result) => ({ count: result.libraries?.length ?? 0 }),
		},
	);

export const get: RudderStackTransformationEndpoints['librariesGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'libraries.get',
			input: Inputs.librariesGet,
			output: Outputs.librariesGet,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/libraries/${segment(id)}`,
			replayable: true,
		}),
		{
			log: (_, result) => ({ importName: result.importName ?? undefined }),
		},
	);

export const listVersions: RudderStackTransformationEndpoints['librariesListVersions'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'libraries.listVersions',
				input: Inputs.librariesListVersions,
				output: Outputs.librariesListVersions,
			},
			input,
			({ id, count, orderBy }) => ({
				method: 'GET',
				path: `/libraries/${segment(id)}/versions`,
				query: { count, orderBy },
				replayable: true,
			}),
			{
				log: (_, result) => ({
					count: result.libraryVersions?.length ?? 0,
					published:
						result.libraryVersions?.filter((row) => row.isPublished === true)
							.length ?? 0,
				}),
			},
		);

export const getVersion: RudderStackTransformationEndpoints['librariesGetVersion'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'libraries.getVersion',
				input: Inputs.librariesGetVersion,
				output: Outputs.librariesGetVersion,
			},
			input,
			({ id, versionId }) => ({
				method: 'GET',
				path: `/libraries/${segment(id)}/versions/${segment(versionId)}`,
				replayable: true,
			}),
			{
				log: (_, result) => ({
					versionId: result.versionId ?? undefined,
					isPublished: result.isPublished ?? undefined,
				}),
			},
		);

/**
 * `language` is required even though it cannot change, because RudderStack
 * validates it against the library's existing one; passing the wrong value is a
 * rejection rather than a conversion. The name cannot be changed here.
 */
export const update: RudderStackTransformationEndpoints['librariesUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'libraries.update',
			input: Inputs.librariesUpdate,
			output: Outputs.librariesUpdate,
		},
		input,
		({ id, code, language, description, publish }) => ({
			method: 'POST',
			path: `/libraries/${segment(id)}`,
			query: { publish },
			body: { code, language, description },
			// Each replay writes another revision, so it is not retried.
			replayable: false,
		}),
		{
			log: (parsed, result) => ({
				libraryId: result.id ?? parsed.id,
				versionId: result.versionId ?? undefined,
				published: parsed.publish === true,
			}),
		},
	);

export const remove: RudderStackTransformationEndpoints['librariesDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'libraries.delete',
			input: Inputs.librariesDelete,
			output: Outputs.librariesDelete,
		},
		input,
		({ id }) => ({
			method: 'DELETE',
			path: `/libraries/${segment(id)}`,
			// A transformation importing the library would break either way, and a
			// second delete would just 404.
			replayable: false,
		}),
		{
			// An empty 200 arrives as undefined, and the output schema expects an
			// object.
			shape: () => ({}),
			log: (parsed) => ({ libraryId: parsed.id }),
		},
	);

/**
 * One route publishes both kinds of revision: pass transformation version IDs,
 * library version IDs, or both. RudderStack runs the code on its servers first,
 * so a failing test rejects the whole call rather than publishing part of it.
 */
export const publish: RudderStackTransformationEndpoints['librariesPublish'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'libraries.publish',
			input: Inputs.librariesPublish,
			output: Outputs.librariesPublish,
		},
		input,
		({ transformations, libraries }) => ({
			method: 'POST',
			path: '/libraries/publish',
			body: { transformations, libraries },
			// Publishing is idempotent once a revision is live, so a retry cannot
			// duplicate anything.
			replayable: true,
		}),
		{
			log: (parsed, result) => ({
				transformations: parsed.transformations?.length ?? 0,
				libraries: parsed.libraries?.length ?? 0,
				published: result.published ?? undefined,
			}),
		},
	);
