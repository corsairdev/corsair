import type { StannpEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	StannpEndpointInputSchemas as Inputs,
	StannpEndpointOutputSchemas as Outputs,
} from './types';

export const list: StannpEndpoints['groupsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'groups.list',
			input: Inputs.groupsList,
			output: Outputs.groupsList,
		},
		input,
		({ offset, limit }, base) => ({
			method: 'GET',
			base,
			path: '/v1/groups/list',
			query: { offset, limit },
		}),
		{
			log: (_, result) => ({ count: result.length }),
		},
	);

export const create: StannpEndpoints['groupsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'groups.create',
			input: Inputs.groupsCreate,
			output: Outputs.groupsCreate,
		},
		input,
		({ name, idempotencyKey }, base) => ({
			method: 'POST',
			base,
			path: '/v1/groups/new',
			form: { name },
			idempotencyKey,
		}),
		{
			log: (_, result) => ({ groupId: result }),
		},
	);

export const addRecipients: StannpEndpoints['groupsAddRecipients'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'groups.addRecipients',
			input: Inputs.groupsAddRecipients,
			output: Outputs.groupsAddRecipients,
		},
		input,
		({ group_id, recipients }, base) => ({
			method: 'POST',
			base,
			path: `/v1/groups/add/${segment(group_id)}`,
			form: { recipients: recipients.join(',') },
		}),
		{
			log: ({ group_id }, result) => ({ groupId: group_id, changed: result }),
		},
	);

export const removeRecipients: StannpEndpoints['groupsRemoveRecipients'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'groups.removeRecipients',
			input: Inputs.groupsRemoveRecipients,
			output: Outputs.groupsRemoveRecipients,
		},
		input,
		({ group_id, recipients }, base) => ({
			method: 'POST',
			base,
			path: `/v1/groups/remove/${segment(group_id)}`,
			form: { recipients: recipients.join(',') },
		}),
		{
			log: ({ group_id }, result) => ({ groupId: group_id, changed: result }),
		},
	);

export const purge: StannpEndpoints['groupsPurge'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'groups.purge',
			input: Inputs.groupsPurge,
			output: Outputs.groupsPurge,
		},
		input,
		({ id, delete_recipients, idempotencyKey }, base) => ({
			method: 'POST',
			base,
			path: '/v1/groups/purge',
			form: { id, delete_recipients },
			idempotencyKey,
		}),
		{
			log: ({ id, delete_recipients }) => ({
				groupId: id,
				deletedRecipients: delete_recipients ?? false,
			}),
		},
	);

export const calculate: StannpEndpoints['groupsCalculate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'groups.calculate',
			input: Inputs.groupsCalculate,
			output: Outputs.groupsCalculate,
		},
		input,
		({ group_id }, base) => ({
			method: 'POST',
			base,
			path: `/v1/groups/calculate/${segment(group_id)}`,
		}),
		{
			log: ({ group_id }) => ({ groupId: group_id }),
		},
	);

// `delete` is a reserved word, so the function is named remove and the
// nested map registers it under the delete key.
export const remove: StannpEndpoints['groupsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'groups.delete',
			input: Inputs.groupsDelete,
			output: Outputs.groupsDelete,
		},
		input,
		({ id, delete_recipients, idempotencyKey }, base) => ({
			method: 'POST',
			base,
			path: '/v1/groups/delete',
			form: { id, delete_recipients },
			idempotencyKey,
		}),
		{
			log: ({ id, delete_recipients }) => ({
				groupId: id,
				deletedRecipients: delete_recipients ?? false,
			}),
		},
	);
