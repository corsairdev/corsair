import type { ReamazeEndpoints } from '..';
import { pathSegment } from '../client';
import { call, unwrapList, unwrapObject } from './call';
import {
	ReamazeEndpointInputSchemas as Inputs,
	ReamazeEndpointOutputSchemas as Outputs,
} from './types';

export const list: ReamazeEndpoints['identitiesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'identities.list',
			input: Inputs.identitiesList,
			output: Outputs.identitiesList,
		},
		input,
		({ email }) => ({
			method: 'GET',
			path: `/contacts/${pathSegment(email)}/identities`,
		}),
		{
			shape: (raw) => ({
				...unwrapObject(raw, 'identity list'),
				identities: unwrapList(raw, 'identities', 'identity list'),
			}),
			log: (parsed, result) => ({
				email: parsed.email,
				count: result.identities.length,
			}),
		},
	);

export const create: ReamazeEndpoints['identitiesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'identities.create',
			input: Inputs.identitiesCreate,
			output: Outputs.identitiesCreate,
		},
		input,
		({ email, type, identifier }) => ({
			method: 'POST',
			path: `/contacts/${pathSegment(email)}/identities`,
			body: { identity: { type, identifier } },
		}),
		{
			shape: (raw) => ({
				...unwrapObject(raw, 'contact identities'),
				identities: unwrapList(raw, 'identities', 'contact identities'),
			}),
			log: (parsed, result) => ({
				email: parsed.email,
				type: parsed.type,
				count: result.identities.length,
			}),
		},
	);
