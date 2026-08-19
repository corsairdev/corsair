import { logEventFromContext } from 'corsair/core';
import type { BigmlEndpoints } from '../index';
import { BigmlConfigurationEntity } from '../schema/database';
import { auditPayload } from './logging';
import { cacheEntities, cacheEntity } from './persist';
import { bigmlCall, listQuery } from './shared';
import type { BigmlEndpointOutputs } from './types';

const LABEL = 'configuration';

/** Retrieves a single saved configuration. */
export const get: BigmlEndpoints['configurationsGet'] = async (ctx, input) => {
	const result = await bigmlCall<BigmlEndpointOutputs['configurationsGet']>(
		ctx,
		input.configurationId,
	);

	await cacheEntity(ctx.db.configurations, BigmlConfigurationEntity, result, {
		label: LABEL,
	});
	await logEventFromContext(
		ctx,
		'bigml.configurations.get',
		auditPayload(input, ['configurationId']),
		'completed',
	);
	return result;
};

/** Lists saved configurations in the account. */
export const list: BigmlEndpoints['configurationsList'] = async (
	ctx,
	input,
) => {
	const result = await bigmlCall<BigmlEndpointOutputs['configurationsList']>(
		ctx,
		'configuration',
		{ query: listQuery(input) },
	);

	await cacheEntities(
		ctx.db.configurations,
		BigmlConfigurationEntity,
		result.objects,
		{ label: LABEL },
	);
	await logEventFromContext(
		ctx,
		'bigml.configurations.list',
		{ returned: result.objects.length },
		'completed',
	);
	return result;
};
