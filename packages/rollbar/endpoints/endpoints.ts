import { asRecord } from 'corsair/core';
import type { RollbarEndpoints } from '..';
import { segment } from '../client';
import { call, queryOf } from './call';
import { listShape, resultShape } from './shape';
import {
	RollbarEndpointInputSchemas as Inputs,
	RollbarEndpointOutputSchemas as Outputs,
} from './types';

export const itemsList: RollbarEndpoints['itemsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'items.list',
			input: Inputs.itemsList,
			output: Outputs.itemsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/items',
			replayable: true,
			query: queryOf({
				page: parsed.page,
				limit: parsed.limit,
				status: parsed.status,
				environment: parsed.environment,
				framework: parsed.framework,
				query: parsed.query,
				assigned_user: parsed.assigned_user,
				assigned_team: parsed.assigned_team,
				is_snoozed: parsed.is_snoozed,
				// These three are repeatable filters, so the array repeats the key.
				level: parsed.level,
				ids: parsed.ids,
				project_ids: parsed.project_ids,
			}),
		}),
		{
			shape: listShape('items'),
			log: (_, result) => ({
				count: result.items.length,
				total: result.total_count ?? 0,
			}),
		},
	);

export const itemsGet: RollbarEndpoints['itemsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'items.get',
			input: Inputs.itemsGet,
			output: Outputs.itemsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/item/${segment(parsed.item_id)}`,
			replayable: true,
		}),
		{
			shape: resultShape('item'),
			log: (_, result) => ({ itemId: result.item.id ?? 0 }),
		},
	);

export const itemsUpdate: RollbarEndpoints['itemsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'items.update',
			input: Inputs.itemsUpdate,
			output: Outputs.itemsUpdate,
		},
		input,
		(parsed) => ({
			method: 'PATCH',
			path: `/item/${segment(parsed.item_id)}`,
			replayable: false,
			body: queryOf({
				status: parsed.status,
				level: parsed.level,
				title: parsed.title,
				assigned_user_id: parsed.assigned_user_id,
				assigned_team_id: parsed.assigned_team_id,
				resolved_in_version: parsed.resolved_in_version,
				snooze_enabled: parsed.snooze_enabled,
				snooze_expiration_in_seconds: parsed.snooze_expiration_in_seconds,
			}),
		}),
		{
			shape: resultShape('item'),
			log: (parsed, result) => ({
				itemId: parsed.item_id,
				status: result.item.status ?? undefined,
			}),
		},
	);

export const itemComments: RollbarEndpoints['itemComments'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'itemComments.list',
			input: Inputs.itemComments,
			output: Outputs.itemComments,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/item/${segment(parsed.item_id)}/comments`,
			replayable: true,
			query: queryOf({ page: parsed.page }),
		}),
		{
			shape: listShape('comments'),
			log: (_, result) => ({ count: result.comments.length }),
		},
	);

export const itemCommentCreate: RollbarEndpoints['itemCommentCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'itemComments.create',
			input: Inputs.itemCommentCreate,
			output: Outputs.itemCommentCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: `/item/${segment(parsed.item_id)}/comments`,
			replayable: false,
			body: { body: parsed.body },
		}),
		{
			shape: (raw) => {
				const result = asRecord(asRecord(raw)?.result);
				return { comment_id: result?.id, result };
			},
			// The comment text is free-form, so only the item id is logged.
			log: (parsed) => ({ itemId: parsed.item_id }),
		},
	);

export const itemEvents: RollbarEndpoints['itemEvents'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'itemEvents.list',
			input: Inputs.itemEvents,
			output: Outputs.itemEvents,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/item/${segment(parsed.item_id)}/events`,
			replayable: true,
			query: queryOf({ page: parsed.page }),
		}),
		{
			shape: listShape('events'),
			log: (_, result) => ({ count: result.events.length }),
		},
	);

export const occurrencesList: RollbarEndpoints['occurrencesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'occurrences.list',
			input: Inputs.occurrencesList,
			output: Outputs.occurrencesList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/instances',
			replayable: true,
			query: queryOf({
				page: parsed.page,
				limit: parsed.limit,
				project_id: parsed.project_id,
				last_id: parsed.last_id,
			}),
		}),
		{
			// This route names the rows `instances`, which is the API's own word for
			// an occurrence; the plugin keeps its `occurrences` name on the output.
			shape: (raw, parsed) => {
				// unknown: the shaper returns the route's own envelope, whose field
				// names this wrapper re-labels without reading their types.
				const shaped = listShape('instances')(raw, parsed) as Record<
					string,
					unknown
				>;
				return { ...shaped, occurrences: shaped.instances };
			},
			log: (_, result) => ({ count: result.occurrences.length }),
		},
	);

export const occurrencesGet: RollbarEndpoints['occurrencesGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'occurrences.get',
			input: Inputs.occurrencesGet,
			output: Outputs.occurrencesGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/instance/${segment(parsed.occurrence_id)}`,
			replayable: true,
		}),
		{
			// This route names the record `instance`.
			shape: (raw) => {
				const result = asRecord(asRecord(raw)?.result);
				return { occurrence: result?.instance };
			},
			log: (_, result) => ({ occurrenceId: result.occurrence.id ?? 0 }),
		},
	);

export const projectsList: RollbarEndpoints['projectsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'projects.list',
			input: Inputs.projectsList,
			output: Outputs.projectsList,
		},
		input,
		() => ({ method: 'GET', path: '/projects', replayable: true }),
		{
			shape: listShape('projects'),
			log: (_, result) => ({ count: result.projects.length }),
		},
	);

export const deploysList: RollbarEndpoints['deploysList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'deploys.list',
			input: Inputs.deploysList,
			output: Outputs.deploysList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/deploys',
			replayable: true,
			query: queryOf({
				page: parsed.page,
				environment: parsed.environment,
				project_id: parsed.project_id,
			}),
		}),
		{
			shape: listShape('deploys'),
			log: (_, result) => ({ count: result.deploys.length }),
		},
	);

export const deploysCreate: RollbarEndpoints['deploysCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'deploys.create',
			input: Inputs.deploysCreate,
			output: Outputs.deploysCreate,
		},
		input,
		(parsed) => ({
			method: 'POST',
			path: '/deploy/',
			replayable: false,
			body: queryOf({
				environment: parsed.environment,
				revision: parsed.revision,
				project_id: parsed.project_id,
				comment: parsed.comment,
				local_username: parsed.local_username,
				rollbar_username: parsed.rollbar_username,
				status: parsed.status,
			}),
		}),
		{
			shape: (raw) => {
				const result = asRecord(asRecord(raw)?.result);
				return { deploy_id: result?.id, result };
			},
			log: (_, result) => ({ deployId: result.deploy_id ?? 0 }),
		},
	);
