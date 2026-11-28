import type { Smtp2goEndpoints } from '..';
import { pickBody } from '../client';
import { call } from './call';
import {
	Smtp2goEndpointInputSchemas as Inputs,
	Smtp2goEndpointOutputSchemas as Outputs,
} from './types';

export const list: Smtp2goEndpoints['domainsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.list',
			input: Inputs.domainsList,
			output: Outputs.domainsList,
		},
		input,
		(parsed) => ({
			path: '/domain/view',
			body: pickBody(parsed),
			replayable: true,
		}),
		{
			log: (_, result) => ({ returned: result.data.domains.length }),
		},
	);

export const add: Smtp2goEndpoints['domainsAdd'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.add',
			input: Inputs.domainsAdd,
			output: Outputs.domainsAdd,
		},
		input,
		(parsed) => ({
			path: '/domain/add',
			body: pickBody(parsed),
			replayable: false,
		}),
		{
			log: (parsed) => ({ domain: parsed.domain }),
		},
	);

export const verify: Smtp2goEndpoints['domainsVerify'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.verify',
			input: Inputs.domainsVerify,
			output: Outputs.domainsVerify,
		},
		input,
		(parsed) => ({
			path: '/domain/verify',
			body: pickBody(parsed),
			replayable: false,
		}),
		{
			log: (parsed) => ({ domain: parsed.domain }),
		},
	);

export const remove: Smtp2goEndpoints['domainsRemove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'domains.remove',
			input: Inputs.domainsRemove,
			output: Outputs.domainsRemove,
		},
		input,
		(parsed) => ({
			path: '/domain/remove',
			body: pickBody(parsed),
			replayable: false,
		}),
		{
			log: (parsed) => ({ domain: parsed.domain }),
		},
	);
