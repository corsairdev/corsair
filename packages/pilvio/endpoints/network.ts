import type { PilvioEndpoints } from '..';
import { call } from './call';
import {
	PilvioEndpointInputSchemas as Inputs,
	PilvioEndpointOutputSchemas as Outputs,
} from './types';

const NETWORK = '/v1/network/network';
const FIREWALLS = '/v1/network/firewalls';

export const listNetworks: PilvioEndpoints['networksList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'networks.list',
			input: Inputs.networksList,
			output: Outputs.networksList,
		},
		input,
		() => ({ method: 'GET', path: `${NETWORK}s` }),
		{ log: (_, networks) => ({ count: networks.length }) },
	);

export const getNetwork: PilvioEndpoints['networksGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'networks.get',
			input: Inputs.networksGet,
			output: Outputs.networksGet,
		},
		input,
		({ uuid }) => ({
			method: 'GET',
			path: `${NETWORK}/${encodeURIComponent(uuid)}`,
		}),
		{ log: (_, network) => ({ networkUuid: network.uuid ?? undefined }) },
	);

export const createNetwork: PilvioEndpoints['networksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'networks.create',
			input: Inputs.networksCreate,
			output: Outputs.networksCreate,
		},
		input,
		({ name }) => ({
			method: 'POST',
			path: NETWORK,
			query: { name },
		}),
		{ log: (_, network) => ({ networkUuid: network.uuid ?? undefined }) },
	);

export const deleteNetwork: PilvioEndpoints['networksDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'networks.delete',
			input: Inputs.networksDelete,
			output: Outputs.networksDelete,
		},
		input,
		({ uuid }) => ({
			method: 'DELETE',
			path: `${NETWORK}/${encodeURIComponent(uuid)}`,
		}),
		{ log: ({ uuid }) => ({ networkUuid: uuid }) },
	);

export const listFirewalls: PilvioEndpoints['firewallsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'firewalls.list',
			input: Inputs.firewallsList,
			output: Outputs.firewallsList,
		},
		input,
		() => ({ method: 'GET', path: FIREWALLS }),
		{ log: (_, firewalls) => ({ count: firewalls.length }) },
	);

export const createFirewall: PilvioEndpoints['firewallsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'firewalls.create',
			input: Inputs.firewallsCreate,
			output: Outputs.firewallsCreate,
		},
		input,
		({ displayName, billingAccountId, rules }) => ({
			method: 'POST',
			path: FIREWALLS,
			json: true,
			body: {
				display_name: displayName,
				billing_account_id: billingAccountId,
				rules: rules.map((rule) => ({
					protocol: rule.protocol,
					direction: rule.direction,
					port_start: rule.portStart,
					port_end: rule.portEnd,
					endpoint_spec_type: rule.endpointSpecType,
					endpoint_spec: rule.endpointSpec,
				})),
			},
		}),
		{ log: (_, firewall) => ({ firewallUuid: firewall.uuid ?? undefined }) },
	);

export const deleteFirewall: PilvioEndpoints['firewallsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'firewalls.delete',
			input: Inputs.firewallsDelete,
			output: Outputs.firewallsDelete,
		},
		input,
		({ uuid }) => ({
			method: 'DELETE',
			path: `${FIREWALLS}/${encodeURIComponent(uuid)}`,
		}),
		{ log: ({ uuid }) => ({ firewallUuid: uuid }) },
	);
