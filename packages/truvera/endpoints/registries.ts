import type { TruveraEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	TruveraEndpointInputSchemas,
	TruveraEndpointOutputSchemas,
} from './types';

export const create: TruveraEndpoints['registriesCreate'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'registries.create',
			input: TruveraEndpointInputSchemas.createRegistry,
			output: TruveraEndpointOutputSchemas.createRegistry,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'registries',
			body: {
				...(parsed.type === undefined ? {} : { type: parsed.type }),
				...(parsed.add_only === undefined ? {} : { addOnly: parsed.add_only }),
				...(parsed.policy === undefined ? {} : { policy: parsed.policy }),
			},
		}),
		{
			// `id` is the job; the new registry's own id is `data.id`.
			log: (_parsed, result) => ({
				registry_id:
					typeof result.data?.id === 'string' ? result.data.id : undefined,
				job_id: result.id ?? undefined,
			}),
		},
	);

export const list: TruveraEndpoints['registriesList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'registries.list',
			input: TruveraEndpointInputSchemas.listRegistries,
			output: TruveraEndpointOutputSchemas.listRegistries,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: 'registries',
			query: { offset: parsed.offset, limit: parsed.limit },
		}),
		{ log: (_parsed, result) => ({ registries: result.length }) },
	);

export const get: TruveraEndpoints['registriesGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'registries.get',
			input: TruveraEndpointInputSchemas.getRegistry,
			output: TruveraEndpointOutputSchemas.getRegistry,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `registries/${segment(parsed.registry_id)}`,
		}),
		{ log: (parsed) => ({ registry_id: parsed.registry_id }) },
	);

export const remove: TruveraEndpoints['registriesDelete'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'registries.delete',
			input: TruveraEndpointInputSchemas.deleteRegistry,
			output: TruveraEndpointOutputSchemas.deleteRegistry,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `registries/${segment(parsed.registry_id)}`,
		}),
		{ log: (parsed) => ({ registry_id: parsed.registry_id }) },
	);

export const revokeInRegistry: TruveraEndpoints['registriesRevoke'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'registries.revoke',
			input: TruveraEndpointInputSchemas.revokeInRegistry,
			output: TruveraEndpointOutputSchemas.revokeInRegistry,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `registries/${segment(parsed.registry_id)}`,
			body: { action: parsed.action, credentialIds: parsed.credential_ids },
		}),
		{
			log: (parsed) => ({
				registry_id: parsed.registry_id,
				action: parsed.action,
				credentials: parsed.credential_ids.length,
			}),
		},
	);

export const revocationStatus: TruveraEndpoints['registriesRevocationStatus'] =
	async (ctx, input) =>
		call(
			ctx,
			{
				event: 'registries.revocationStatus',
				input: TruveraEndpointInputSchemas.getRevocationStatus,
				output: TruveraEndpointOutputSchemas.getRevocationStatus,
			},
			input,
			(parsed) => ({
				method: 'GET',
				path: `revocationStatus/${segment(parsed.registry_id)}/${segment(parsed.revocation_id)}`,
			}),
			{
				log: (parsed) => ({
					registry_id: parsed.registry_id,
					revocation_id: parsed.revocation_id,
				}),
			},
		);
