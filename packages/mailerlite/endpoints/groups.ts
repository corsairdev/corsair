import type { MailerLiteContext, MailerLiteEndpoints } from '..';
import { segment } from '../client';
import { call } from './call';
import {
	MailerLiteEndpointInputSchemas as Inputs,
	MailerLiteEndpointOutputSchemas as Outputs,
} from './types';

export const list: MailerLiteEndpoints['groupsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'groups.list',
			input: Inputs.groupsList,
			output: Outputs.groupsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/groups',
			query: {
				'filter[name]': parsed.filterName,
				sort: parsed.sort,
				limit: parsed.limit,
				page: parsed.page,
			},
			replayable: true,
		}),
		{ log: (_, result) => ({ count: result.data.length }) },
	);

export const create: MailerLiteEndpoints['groupsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'groups.create',
			input: Inputs.groupsCreate,
			output: Outputs.groupsCreate,
		},
		input,
		({ name }) => ({
			method: 'POST',
			path: '/groups',
			body: { name },
			replayable: false,
		}),
		{ log: (_, result) => ({ groupId: result.data.id }) },
	);

export const remove: MailerLiteEndpoints['groupsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'groups.delete',
			input: Inputs.groupsDelete,
			output: Outputs.groupsDelete,
		},
		input,
		({ groupId }) => ({
			method: 'DELETE',
			path: `/groups/${segment(groupId)}`,
			replayable: false,
		}),
		{
			// The delete answers 204 with no body; the result is derived here.
			shape: (_, { groupId }) => ({ deleted: true, id: groupId }),
			log: (_, result) => ({ groupId: result.id }),
		},
	);
