import type { TruveraEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	TruveraEndpointInputSchemas,
	TruveraEndpointOutputSchemas,
} from './types';

export const list: TruveraEndpoints['didsList'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'dids.list',
			input: TruveraEndpointInputSchemas.listDids,
			output: TruveraEndpointOutputSchemas.listDids,
		},
		input,
		() => ({ method: 'GET', path: 'dids' }),
		{ log: (_parsed, result) => ({ dids: result.length }) },
	);

export const create: TruveraEndpoints['didsCreate'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'dids.create',
			input: TruveraEndpointInputSchemas.createDid,
			output: TruveraEndpointOutputSchemas.createDid,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: 'dids',
			body: {
				...(parsed.type === undefined ? {} : { type: parsed.type }),
				...(parsed.key_type === undefined ? {} : { keyType: parsed.key_type }),
				...(parsed.controller === undefined
					? {}
					: { controller: parsed.controller }),
				...(parsed.didcomm_service_url === undefined
					? {}
					: { didcommServiceUrl: parsed.didcomm_service_url }),
				...(parsed.include_didcomm_service === undefined
					? {}
					: { includeDidcommService: parsed.include_didcomm_service }),
			},
		}),
		{ log: (parsed, result) => ({ did: result.did ?? parsed.type }) },
	);

export const get: TruveraEndpoints['didsGet'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'dids.get',
			input: TruveraEndpointInputSchemas.getDid,
			output: TruveraEndpointOutputSchemas.getDid,
		},
		input,
		(parsed) => ({ method: 'GET', path: `dids/${segment(parsed.did)}` }),
		{ log: (parsed) => ({ did: parsed.did }) },
	);

export const getMetadata: TruveraEndpoints['didsMetadata'] = async (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'dids.metadata',
			input: TruveraEndpointInputSchemas.getDidMetadata,
			output: TruveraEndpointOutputSchemas.getDidMetadata,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `dids/${segment(parsed.did)}/metadata`,
		}),
		{ log: (parsed) => ({ did: parsed.did }) },
	);

export const remove: TruveraEndpoints['didsDelete'] = async (ctx, input) =>
	call(
		ctx,
		{
			event: 'dids.delete',
			input: TruveraEndpointInputSchemas.deleteDid,
			output: TruveraEndpointOutputSchemas.deleteDid,
		},
		input,
		(parsed) => ({ method: 'DELETE', path: `dids/${segment(parsed.did)}` }),
		{ log: (parsed) => ({ did: parsed.did }) },
	);
