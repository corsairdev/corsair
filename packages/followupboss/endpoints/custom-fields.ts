import { asRecord } from 'corsair/core';
import type { FollowUpBossEndpoints } from '..';
import { segment } from '../client';
import { call, envelopeMany, envelopeMeta, envelopeOne } from './call';
import {
	CustomFieldsInputSchemas as Inputs,
	CustomFieldsOutputSchemas as Outputs,
} from './custom-fields-types';

export const list: FollowUpBossEndpoints['customFieldsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customFields.list',
			input: Inputs.customFieldsList,
			output: Outputs.customFieldsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/customFields', query }),
		{
			shape: (raw) => ({
				customfields: envelopeMany(raw, 'customfields'),
				_metadata: envelopeMeta(raw),
			}),
			log: (_, result) => ({ count: result.customfields.length }),
		},
	);

export const get: FollowUpBossEndpoints['customFieldsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'customFields.get',
			input: Inputs.customFieldsGet,
			output: Outputs.customFieldsGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/customFields/${segment(id)}` }),
		{
			shape: (raw) => envelopeOne(raw, 'customfields'),
			log: ({ id }) => ({ customFieldId: id }),
		},
	);

export const create: FollowUpBossEndpoints['customFieldsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'customFields.create',
			input: Inputs.customFieldsCreate,
			output: Outputs.customFieldsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/customFields', body }),
		{
			// Unlike most FUB creates, this one answers 200 instead of 201.
			shape: (raw) => envelopeOne(raw, 'customfields'),
			log: (_, result) => ({ customFieldId: result.id ?? undefined }),
		},
	);

export const update: FollowUpBossEndpoints['customFieldsUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'customFields.update',
			input: Inputs.customFieldsUpdate,
			output: Outputs.customFieldsUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: `/customFields/${segment(id)}`,
			body,
		}),
		{
			shape: (raw) => envelopeOne(raw, 'customfields'),
			log: ({ id }) => ({ customFieldId: id }),
		},
	);

export const remove: FollowUpBossEndpoints['customFieldsDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'customFields.delete',
			input: Inputs.customFieldsDelete,
			output: Outputs.customFieldsDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/customFields/${segment(id)}` }),
		{
			// unknown: FUB may echo the deleted field in the 200 body.
			shape: (raw, { id }) => ({ id, resource: asRecord(raw) }),
			log: ({ id }) => ({ customFieldId: id }),
		},
	);
