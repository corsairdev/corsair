import { HERE_HOSTS, makeHereRequest } from '../client';
import type { HereEndpoints } from '../index';
import { runHereEndpoint } from './call';
import {
	GetIncidentByIdInputSchema,
	GetIncidentByIdResponseSchema,
	GetTrafficFlowInputSchema,
	GetTrafficFlowResponseSchema,
	GetTrafficIncidentsInputSchema,
	GetTrafficIncidentsResponseSchema,
} from './types';

export const getTrafficFlow: HereEndpoints['getTrafficFlow'] = (ctx, input) =>
	runHereEndpoint(
		ctx,
		'here.traffic.getTrafficFlow',
		GetTrafficFlowInputSchema,
		GetTrafficFlowResponseSchema,
		input,
		(validated, apiKey) =>
			makeHereRequest(HERE_HOSTS.traffic, '/v7/flow', apiKey, {
				query: {
					in: validated.in,
					locationReferencing: validated.locationReferencing ?? 'shape',
					minJamFactor: validated.minJamFactor,
					maxJamFactor: validated.maxJamFactor,
				},
			}),
	);

export const getTrafficIncidents: HereEndpoints['getTrafficIncidents'] = (
	ctx,
	input,
) =>
	runHereEndpoint(
		ctx,
		'here.traffic.getTrafficIncidents',
		GetTrafficIncidentsInputSchema,
		GetTrafficIncidentsResponseSchema,
		input,
		(validated, apiKey) =>
			makeHereRequest(HERE_HOSTS.traffic, '/v7/incidents', apiKey, {
				query: {
					in: validated.in,
					locationReferencing: validated.locationReferencing ?? 'shape',
				},
			}),
	);

export const getIncidentById: HereEndpoints['getIncidentById'] = (ctx, input) =>
	runHereEndpoint(
		ctx,
		'here.traffic.getIncidentById',
		GetIncidentByIdInputSchema,
		GetIncidentByIdResponseSchema,
		input,
		(validated, apiKey) =>
			makeHereRequest(
				HERE_HOSTS.traffic,
				`/v7/incidents/${encodeURIComponent(validated.id)}`,
				apiKey,
				{
					query: {
						locationReferencing: validated.locationReferencing ?? 'shape',
					},
				},
			),
	);
