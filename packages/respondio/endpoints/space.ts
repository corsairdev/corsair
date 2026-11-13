import type { RespondioEndpoints } from '..';
import { cursorFrom, segment } from '../client';
import { call } from './call';
import {
	RespondioEndpointInputSchemas as Inputs,
	RespondioEndpointOutputSchemas as Outputs,
} from './types';

export const listUsers: RespondioEndpoints['spaceListUsers'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'space.listUsers',
			input: Inputs.spaceListUsers,
			output: Outputs.spaceListUsers,
		},
		input,
		({ limit, cursorId }) => ({
			method: 'GET',
			path: '/space/user',
			query: { limit, cursorId: cursorFrom(cursorId) },
			replayable: true,
		}),
		{
			log: (_, result) => ({ count: result.items?.length ?? 0 }),
		},
	);

export const getUser: RespondioEndpoints['spaceGetUser'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'space.getUser',
			input: Inputs.spaceGetUser,
			output: Outputs.spaceGetUser,
		},
		input,
		({ id }) => ({
			method: 'GET',
			path: `/space/user/${segment(id)}`,
			replayable: true,
		}),
		{
			log: (_, result) => ({ userId: result.id ?? undefined }),
		},
	);

export const listChannels: RespondioEndpoints['spaceChannels'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'space.listChannels',
			input: Inputs.spaceChannels,
			output: Outputs.spaceChannels,
		},
		input,
		({ limit, cursorId }) => ({
			method: 'GET',
			path: '/space/channel',
			query: { limit, cursorId: cursorFrom(cursorId) },
			replayable: true,
		}),
		{
			log: (_, result) => ({
				count: result.items?.length ?? 0,
				// The channel ID is what a custom_payload message needs, so its presence
				// is worth reporting.
				channels: result.items?.length ?? 0,
			}),
		},
	);

export const listTemplates: RespondioEndpoints['spaceTemplates'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'space.listTemplates',
			input: Inputs.spaceTemplates,
			output: Outputs.spaceTemplates,
		},
		input,
		({ channelId, limit, cursorId }) => ({
			method: 'GET',
			path: `/space/channel/${segment(channelId)}/template`,
			query: { limit, cursorId: cursorFrom(cursorId) },
			replayable: true,
		}),
		{
			log: (_, result) => ({ count: result.items?.length ?? 0 }),
		},
	);

/** The closing notes a conversation can be closed with. */
export const listClosingNotes: RespondioEndpoints['spaceClosingNotes'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'space.listClosingNotes',
			input: Inputs.spaceClosingNotes,
			output: Outputs.spaceClosingNotes,
		},
		input,
		({ limit, cursorId }) => ({
			method: 'GET',
			path: '/space/closing_notes',
			query: { limit, cursorId: cursorFrom(cursorId) },
			replayable: true,
		}),
		{
			log: (_, result) => ({ count: result.items?.length ?? 0 }),
		},
	);

/**
 * The custom field definitions, which are what a contact write needs: a field's
 * `value` must match its type, and only this route tells you the type and, for a
 * list field, its allowed options.
 */
export const listCustomFields: RespondioEndpoints['spaceCustomFields'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'space.listCustomFields',
			input: Inputs.spaceCustomFields,
			output: Outputs.spaceCustomFields,
		},
		input,
		({ limit, cursorId }) => ({
			method: 'GET',
			path: '/space/custom_field',
			query: { limit, cursorId: cursorFrom(cursorId) },
			replayable: true,
		}),
		{
			log: (_, result) => ({ count: result.items?.length ?? 0 }),
		},
	);
