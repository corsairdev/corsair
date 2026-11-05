import { logEventFromContext } from 'corsair/core';
import type { BigmlEndpoints } from '../index';
import { auditPayload } from './logging';
import { bigmlCall, compact } from './shared';
import type { BigmlEndpointOutputs } from './types';

/**
 * Not cached locally, deliberately - see `schema/database.ts`'s
 * `BigmlExternalConnectorEntity` doc comment: BigML echoes a connector's
 * `connection` object back verbatim on every read, including any
 * `password`/`user` supplied at creation. Mirroring that object would write
 * a live credential into this plugin's local store.
 */

/** Creates an external data connector (a live database/warehouse connection). */
export const create: BigmlEndpoints['externalConnectorsCreate'] = async (
	ctx,
	input,
) => {
	const result = await bigmlCall<
		BigmlEndpointOutputs['externalConnectorsCreate']
	>(ctx, 'externalconnector', {
		method: 'POST',
		body: compact({
			source: input.source ?? input.engine,
			engine: input.engine,
			connection: input.connection,
			name: input.name,
			category: input.category,
			description: input.description,
			tags: input.tags,
			project: input.project,
		}),
	});

	// `connection` (and therefore any credential inside it) is excluded by
	// name, not merely by omission - `logging.ts`'s `NEVER_LOG_VALUE` denies
	// it a second, independent way.
	await logEventFromContext(
		ctx,
		'bigml.externalConnectors.create',
		auditPayload(input, ['source', 'name']),
		'completed',
	);
	return result;
};

/** Retrieves a single external data connector. */
export const get: BigmlEndpoints['externalConnectorsGet'] = async (
	ctx,
	input,
) => {
	const result = await bigmlCall<BigmlEndpointOutputs['externalConnectorsGet']>(
		ctx,
		input.externalConnectorId,
	);

	await logEventFromContext(
		ctx,
		'bigml.externalConnectors.get',
		auditPayload(input, ['externalConnectorId']),
		'completed',
	);
	return result;
};
