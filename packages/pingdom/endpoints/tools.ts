import type { PingdomEndpoints } from '..';
import { call } from './call';
import {
	PingdomEndpointInputSchemas as Inputs,
	PingdomEndpointOutputSchemas as Outputs,
} from './types';

const V31 = '/api/3.1';

export const listActions: PingdomEndpoints['actionsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'actions.list',
			input: Inputs.actionsList,
			output: Outputs.actionsList,
		},
		input,
		({ checkId, from, to, limit, offset }) => ({
			method: 'GET',
			path: `${V31}/actions`,
			query: { checkid: checkId, from, to, limit, offset },
		}),
		{ log: (_, page) => ({ count: page.actions.alerts.length }) },
	);

export const getCredits: PingdomEndpoints['creditsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'credits.get',
			input: Inputs.creditsGet,
			output: Outputs.creditsGet,
		},
		input,
		() => ({ method: 'GET', path: `${V31}/credits` }),
		{
			log: (_, credits) => ({
				availableChecks: credits.credits.availablechecks ?? undefined,
			}),
		},
	);

export const listProbes: PingdomEndpoints['probesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'probes.list',
			input: Inputs.probesList,
			output: Outputs.probesList,
		},
		input,
		() => ({ method: 'GET', path: `${V31}/probes` }),
		{ log: (_, page) => ({ count: page.probes.length }) },
	);

export const getReference: PingdomEndpoints['referenceGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'reference.get',
			input: Inputs.referenceGet,
			output: Outputs.referenceGet,
		},
		input,
		() => ({ method: 'GET', path: `${V31}/reference` }),
	);

export const runSingle: PingdomEndpoints['singleRun'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'single.run',
			input: Inputs.singleRun,
			output: Outputs.singleRun,
		},
		input,
		({ host, publicName, resolution, integrationIds, userIds, teamIds }) => ({
			method: 'GET',
			path: `${V31}/single`,
			query: {
				host,
				publicname: publicName,
				resolution,
				integrationids: integrationIds?.join(','),
				userids: userIds?.join(','),
				teamids: teamIds?.join(','),
			},
		}),
		{ log: (_, single) => ({ status: single.result.status ?? undefined }) },
	);
