import { asRecord } from 'corsair/core';
import type { FollowUpBossEndpoints } from '..';
import { segment } from '../client';
import { call, envelopeMany, envelopeMeta, envelopeOne } from './call';
import {
	FollowUpBossEndpointInputSchemas as Inputs,
	FollowUpBossEndpointOutputSchemas as Outputs,
} from './types';

export const list: FollowUpBossEndpoints['tasksList'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'tasks.list', input: Inputs.tasksList, output: Outputs.tasksList },
		input,
		(query) => ({ method: 'GET', path: '/tasks', query }),
		{
			shape: (raw) => ({
				tasks: envelopeMany(raw, 'tasks'),
				_metadata: envelopeMeta(raw),
			}),
			log: (_, result) => ({ count: result.tasks.length }),
		},
	);

export const create: FollowUpBossEndpoints['tasksCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.create',
			input: Inputs.tasksCreate,
			output: Outputs.tasksCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/tasks', body }),
		{
			shape: (raw) => envelopeOne(raw, 'tasks'),
			log: (_, result) => ({ taskId: result.id ?? undefined }),
		},
	);

export const get: FollowUpBossEndpoints['tasksGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'tasks.get', input: Inputs.tasksGet, output: Outputs.tasksGet },
		input,
		({ id }) => ({ method: 'GET', path: `/tasks/${segment(id)}` }),
		{
			shape: (raw) => envelopeOne(raw, 'tasks'),
			log: ({ id }) => ({ taskId: id }),
		},
	);

export const update: FollowUpBossEndpoints['tasksUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.update',
			input: Inputs.tasksUpdate,
			output: Outputs.tasksUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: `/tasks/${segment(id)}`,
			body,
		}),
		{
			shape: (raw) => envelopeOne(raw, 'tasks'),
			log: ({ id }) => ({ taskId: id }),
		},
	);

export const remove: FollowUpBossEndpoints['tasksDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tasks.delete',
			input: Inputs.tasksDelete,
			output: Outputs.tasksDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/tasks/${segment(id)}` }),
		{
			// unknown: FUB may echo the deleted task in the 200 body.
			shape: (raw, { id }) => ({ id, resource: asRecord(raw) }),
			log: ({ id }) => ({ taskId: id }),
		},
	);
