import type { ReamazeEndpoints } from '..';
import { pathSegment } from '../client';
import { call, unwrapArray, unwrapObject } from './call';
import {
	ReamazeEndpointInputSchemas as Inputs,
	ReamazeEndpointOutputSchemas as Outputs,
} from './types';

export const list: ReamazeEndpoints['incidentsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'incidents.list',
			input: Inputs.incidentsList,
			output: Outputs.incidentsList,
		},
		input,
		() => ({
			method: 'GET',
			path: '/incidents',
		}),
		{
			// Verified live: a bare array, empty on an instance with no incidents.
			shape: (raw) => ({ incidents: unwrapArray(raw, 'incident list') }),
			log: (_, result) => ({ count: result.incidents.length }),
		},
	);

export const get: ReamazeEndpoints['incidentsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'incidents.get',
			input: Inputs.incidentsGet,
			output: Outputs.incidentsGet,
		},
		input,
		({ identifier }) => ({
			method: 'GET',
			path: `/incidents/${pathSegment(identifier)}`,
		}),
		{
			shape: (raw) => unwrapObject(raw, 'incident'),
			log: (parsed) => ({ identifier: parsed.identifier }),
		},
	);

export const create: ReamazeEndpoints['incidentsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'incidents.create',
			input: Inputs.incidentsCreate,
			output: Outputs.incidentsCreate,
		},
		input,
		({ title, updates_attributes, incidents_systems_attributes }) => ({
			method: 'POST',
			path: '/incidents',
			body: {
				incident: { title, updates_attributes, incidents_systems_attributes },
			},
		}),
		{
			shape: (raw) => unwrapObject(raw, 'created incident'),
			log: (parsed) => ({ title: parsed.title }),
		},
	);

export const update: ReamazeEndpoints['incidentsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'incidents.update',
			input: Inputs.incidentsUpdate,
			output: Outputs.incidentsUpdate,
		},
		input,
		({
			identifier,
			title,
			updates_attributes,
			incidents_systems_attributes,
		}) => ({
			// PUT. The vendor heading for this route says PUT while its curl example
			// sends `-X POST`. The router settles it: without credentials, POST to
			// this path answers 404 `{"status":404,"error":"Not Found"}`, which is
			// the no-such-route body, and PUT answers 401.
			method: 'PUT',
			path: `/incidents/${pathSegment(identifier)}`,
			body: {
				incident: { title, updates_attributes, incidents_systems_attributes },
			},
		}),
		{
			shape: (raw) => unwrapObject(raw, 'updated incident'),
			log: (parsed) => ({ identifier: parsed.identifier }),
		},
	);
