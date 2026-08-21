import { logEventFromContext } from 'corsair/core';
import type { BigmlEndpoints } from '../index';
import { BigmlSourceEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity } from './persist';
import { bigmlCall, compact, listQuery } from './shared';
import type { BigmlEndpointOutputs } from './types';

const LABEL = 'source';

/** Retrieves a single data source. */
export const get: BigmlEndpoints['sourcesGet'] = async (ctx, input) => {
	const result = await bigmlCall<BigmlEndpointOutputs['sourcesGet']>(
		ctx,
		input.sourceId,
	);

	await cacheEntity(ctx.db.sources, BigmlSourceEntity, result, {
		label: LABEL,
	});
	await logEventFromContext(
		ctx,
		'bigml.sources.get',
		auditPayload(input, ['sourceId']),
		'completed',
	);
	return result;
};

/**
 * Updates a source's name, description, tags, parsing configuration, or
 * per-field properties. `PUT` - confirmed live against a real account (a
 * no-op rename returned `202 Accepted`, matching the SDK's `_update`
 * implementation's own `requests.put(...)` call).
 *
 * `sourceParser`/`fields` are confirmed-real BigML capabilities - see
 * `endpoints/types.ts`'s `SourcesUpdateInputSchema` doc comment - but also
 * confirmed live to 400 with `"Cannot update closed source"` once a source
 * has finished processing, which is the ordinary state of any source a
 * caller would already have an id for. Sent through unconditionally rather
 * than special-cased: the API's own error is the correct signal for that
 * case, not a client-side guess about whether the source is still open.
 */
export const update: BigmlEndpoints['sourcesUpdate'] = async (ctx, input) => {
	const result = await bigmlCall<BigmlEndpointOutputs['sourcesUpdate']>(
		ctx,
		input.sourceId,
		{
			method: 'PUT',
			body: compact({
				name: input.name,
				description: input.description,
				tags: input.tags,
				source_parser: input.sourceParser
					? compact({
							header: input.sourceParser.header,
							json_fields: input.sourceParser.jsonFields,
							json_key: input.sourceParser.jsonKey,
							locale: input.sourceParser.locale,
							missing_tokens: input.sourceParser.missingTokens,
							quote: input.sourceParser.quote,
							separator: input.sourceParser.separator,
							trim: input.sourceParser.trim,
						})
					: undefined,
				fields: input.fields
					? Object.fromEntries(
							Object.entries(input.fields).map(([id, field]) => [
								id,
								compact({
									...field,
									missing_tokens: field.missingTokens,
									missingTokens: undefined,
								}),
							]),
						)
					: undefined,
			}),
		},
	);

	await cacheEntity(ctx.db.sources, BigmlSourceEntity, result, {
		label: LABEL,
	});
	await logEventFromContext(
		ctx,
		'bigml.sources.update',
		auditPayload(input, ['sourceId', 'name']),
		'completed',
	);
	return result;
};

/** Lists data sources in the account. */
export const list: BigmlEndpoints['sourcesList'] = async (ctx, input) => {
	const result = await bigmlCall<BigmlEndpointOutputs['sourcesList']>(
		ctx,
		'source',
		{ query: listQuery(input) },
	);

	await cacheEntities(ctx.db.sources, BigmlSourceEntity, result.objects, {
		label: LABEL,
	});
	await logEventFromContext(
		ctx,
		'bigml.sources.list',
		{ returned: result.objects.length },
		'completed',
	);
	return result;
};
