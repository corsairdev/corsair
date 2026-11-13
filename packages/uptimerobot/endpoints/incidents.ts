import type { UptimeRobotEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	UptimeRobotEndpointInputSchemas as Inputs,
	UptimeRobotEndpointOutputSchemas as Outputs,
} from './types';

export const list: UptimeRobotEndpoints['incidentsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'incidents.list',
			input: Inputs.incidentsList,
			output: Outputs.incidentsList,
		},
		input,
		({
			limit,
			cursor,
			monitor_id,
			monitor_name,
			started_after,
			started_before,
			status,
			type,
			cause,
		}) => ({
			method: 'GET',
			path: '/incidents',
			query: {
				limit,
				cursor,
				monitor_id,
				monitor_name,
				started_after,
				started_before,
				status,
				type,
				cause,
			},
		}),
		{
			// A filtered page can be short, or empty, while nextLink is set, so
			// paging continues on the link rather than on the item count.
			log: (_, result) => ({
				count: result.data?.length ?? 0,
				hasMore: result.nextLink != null,
			}),
		},
	);

export const get: UptimeRobotEndpoints['incidentsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'incidents.get',
			input: Inputs.incidentsGet,
			output: Outputs.incidentsGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/incidents/${segment(id)}` }),
		{ log: (_, result) => ({ id: result.id ?? undefined }) },
	);

export const comments: UptimeRobotEndpoints['incidentsComments'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'incidents.comments',
			input: Inputs.incidentsComments,
			output: Outputs.incidentsComments,
		},
		input,
		({ id, limit, cursor }) => ({
			method: 'GET',
			path: `/incidents/${segment(id)}/comments`,
			query: { limit, cursor },
		}),
		{ log: (_, result) => ({ count: result.data?.length ?? 0 }) },
	);

export const addComment: UptimeRobotEndpoints['incidentsAddComment'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'incidents.addComment',
			input: Inputs.incidentsAddComment,
			output: Outputs.incidentsAddComment,
		},
		input,
		({ id, content, publishOnStatusPage }) => ({
			method: 'POST',
			path: `/incidents/${segment(id)}/comments`,
			body: { content, publishOnStatusPage },
		}),
		{
			// The spec documents 201 with no body; echo what was posted then, so the
			// output schema has an object to check.
			shape: (raw, parsed) =>
				raw ?? {
					comment: parsed.content,
					publishOnStatusPage: parsed.publishOnStatusPage ?? false,
				},
			log: (parsed, result) => ({
				incident: parsed.id,
				id: result.id ?? undefined,
				published: parsed.publishOnStatusPage ?? false,
			}),
		},
	);
