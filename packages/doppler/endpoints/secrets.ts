import { logEventFromContext } from 'corsair/core';
import type { DopplerEndpoints } from '../index';
import { auditPayload } from './logging';
import { compact, dopplerCall } from './shared';
import type { DopplerEndpointOutputs } from './types';

/**
 * Not mirrored, never logged. Every route in this family reads or writes
 * live secret values (`raw`/`computed`) or a bulk `{name: value}` map.
 * `auditPayload` is only ever given identifier keys (`project`, `config`,
 * `name`) below - never `secrets`, `value`, or anything derived from them
 * beyond a bare count or the list of *names* touched. See
 * `endpoints/logging.ts`.
 */

/** Lists all secrets in a config, values included. */
export const list: DopplerEndpoints['secretsList'] = async (ctx, input) => {
	const result = await dopplerCall<{
		secrets: DopplerEndpointOutputs['secretsList'];
	}>(ctx, 'configs/config/secrets', {
		query: compact({
			project: input.project,
			config: input.config,
			include_dynamic_secrets: input.includeDynamicSecrets,
			include_managed_secrets: input.includeManagedSecrets,
		}),
	});

	await logEventFromContext(
		ctx,
		'doppler.secrets.list',
		{
			...auditPayload(input, ['project', 'config']),
			returned: Object.keys(result.secrets).length,
		},
		'completed',
	);
	return result.secrets;
};

/** Retrieves a single secret's value by name. */
export const get: DopplerEndpoints['secretsGet'] = async (ctx, input) => {
	const result = await dopplerCall<{
		name: string;
		value: Omit<DopplerEndpointOutputs['secretsGet'], 'name'>;
	}>(ctx, 'configs/config/secret', {
		query: { project: input.project, config: input.config, name: input.name },
	});

	await logEventFromContext(
		ctx,
		'doppler.secrets.get',
		auditPayload(input, ['project', 'config', 'name']),
		'completed',
	);
	return { name: result.name, ...result.value };
};

/** Deletes a secret. */
export const remove: DopplerEndpoints['secretsDelete'] = async (ctx, input) => {
	const result = await dopplerCall<DopplerEndpointOutputs['secretsDelete']>(
		ctx,
		'configs/config/secret',
		{
			method: 'DELETE',
			query: { project: input.project, config: input.config, name: input.name },
		},
	);

	await logEventFromContext(
		ctx,
		'doppler.secrets.delete',
		auditPayload(input, ['project', 'config', 'name']),
		'completed',
	);
	return result;
};

/** Bulk-sets secrets in a config. Pass `null` for a value to delete that secret. */
export const update: DopplerEndpoints['secretsUpdate'] = async (ctx, input) => {
	const result = await dopplerCall<{
		secrets: DopplerEndpointOutputs['secretsUpdate'];
	}>(ctx, 'configs/config/secrets', {
		method: 'POST',
		body: {
			project: input.project,
			config: input.config,
			secrets: input.secrets,
		},
	});

	await logEventFromContext(
		ctx,
		'doppler.secrets.update',
		{
			...auditPayload(input, ['project', 'config']),
			secretNames: Object.keys(input.secrets),
		},
		'completed',
	);
	return result.secrets;
};

/** Downloads a config's secrets rendered in a given format (json/env/yaml/docker/...). */
export const download: DopplerEndpoints['secretsDownload'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<DopplerEndpointOutputs['secretsDownload']>(
		ctx,
		'configs/config/secrets/download',
		{
			query: compact({
				project: input.project,
				config: input.config,
				format: input.format,
				name_transformer: input.nameTransformer,
				include_dynamic_secrets: input.includeDynamicSecrets,
				dynamic_secrets_ttl_sec: input.dynamicSecretsTtlSec,
				secrets: input.secrets?.join(','),
			}),
		},
	);

	await logEventFromContext(
		ctx,
		'doppler.secrets.download',
		auditPayload(input, ['project', 'config', 'format']),
		'completed',
	);
	return result;
};

/** Lists secret names in a config, without values. */
export const names: DopplerEndpoints['secretsNames'] = async (ctx, input) => {
	const result = await dopplerCall<{
		names: DopplerEndpointOutputs['secretsNames'];
	}>(ctx, 'configs/config/secrets/names', {
		query: compact({
			project: input.project,
			config: input.config,
			include_dynamic_secrets: input.includeDynamicSecrets,
			include_managed_secrets: input.includeManagedSecrets,
		}),
	});

	await logEventFromContext(
		ctx,
		'doppler.secrets.names',
		{
			...auditPayload(input, ['project', 'config']),
			returned: result.names.length,
		},
		'completed',
	);
	return result.names;
};

/**
 * Sets a secret's note - the current, documented route
 * (`POST /v3/projects/project/note`, project-scoped, no `config`).
 * See `endpoints/secrets.ts`'s header for why `updateNoteViaConfig` below is
 * a genuinely distinct second route, not a duplicate of this one.
 */
export const updateNote: DopplerEndpoints['secretsUpdateNote'] = async (
	ctx,
	input,
) => {
	const result = await dopplerCall<DopplerEndpointOutputs['secretsUpdateNote']>(
		ctx,
		'projects/project/note',
		{
			method: 'POST',
			query: { project: input.project },
			body: { secret: input.secret, note: input.note },
		},
	);

	await logEventFromContext(
		ctx,
		'doppler.secrets.updateNote',
		auditPayload(input, ['project', 'secret']),
		'completed',
	);
	return result;
};

/**
 * Sets a secret's note via the config-scoped route
 * (`POST /v3/configs/config/secrets/note`). Not in the current public docs -
 * only in the CLI, whose own source marks it deprecated in favour of
 * `updateNote` above - but confirmed still live this session (a structural
 * 400, not a route-absent 404), so it is implemented as the genuinely
 * distinct operation the catalog lists it as.
 */
export const updateNoteViaConfig: DopplerEndpoints['secretsUpdateNoteViaConfig'] =
	async (ctx, input) => {
		const result = await dopplerCall<
			DopplerEndpointOutputs['secretsUpdateNoteViaConfig']
		>(ctx, 'configs/config/secrets/note', {
			method: 'POST',
			query: { project: input.project, config: input.config },
			body: { secret: input.secret, note: input.note },
		});

		await logEventFromContext(
			ctx,
			'doppler.secrets.updateNoteViaConfig',
			auditPayload(input, ['project', 'config', 'secret']),
			'completed',
		);
		return result;
	};
