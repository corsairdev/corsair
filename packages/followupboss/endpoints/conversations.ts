import { asRecord } from 'corsair/core';
import type { FollowUpBossEndpoints } from '..';
import { segment } from '../client';
import { call, envelopeMany, envelopeMeta, envelopeOne } from './call';
import {
	FollowUpBossEndpointInputSchemas as Inputs,
	FollowUpBossEndpointOutputSchemas as Outputs,
} from './types';

// ── calls ──────────────────────────────────────────────────────────────────

export const callsList: FollowUpBossEndpoints['callsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'calls.list',
			input: Inputs.callsList,
			output: Outputs.callsList,
		},
		input,
		(query) => ({ method: 'GET', path: '/calls', query }),
		{
			shape: (raw) => ({
				calls: envelopeMany(raw, 'calls'),
				_metadata: envelopeMeta(raw),
			}),
			log: (_, result) => ({ count: result.calls.length }),
		},
	);

export const callsCreate: FollowUpBossEndpoints['callsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'calls.create',
			input: Inputs.callsCreate,
			output: Outputs.callsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/calls', body }),
		{
			shape: (raw) => envelopeOne(raw, 'calls'),
			log: ({ personId }) => ({ personId }),
		},
	);

export const callsGet: FollowUpBossEndpoints['callsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'calls.get',
			input: Inputs.callsGet,
			output: Outputs.callsGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/calls/${segment(id)}` }),
		{
			shape: (raw) => envelopeOne(raw, 'calls'),
			log: ({ id }) => ({ callId: id }),
		},
	);

export const callsUpdate: FollowUpBossEndpoints['callsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'calls.update',
			input: Inputs.callsUpdate,
			output: Outputs.callsUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: `/calls/${segment(id)}`,
			body,
		}),
		{
			shape: (raw) => envelopeOne(raw, 'calls'),
			log: ({ id }) => ({ callId: id }),
		},
	);

// ── text messages ──────────────────────────────────────────────────────────

export const textMessagesList: FollowUpBossEndpoints['textMessagesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'textMessages.list',
			input: Inputs.textMessagesList,
			output: Outputs.textMessagesList,
		},
		input,
		(query) => ({ method: 'GET', path: '/textMessages', query }),
		{
			shape: (raw) => ({
				textMessages: envelopeMany(raw, 'textMessages'),
				_metadata: envelopeMeta(raw),
			}),
			log: (_, result) => ({ count: result.textMessages.length }),
		},
	);

export const textMessagesCreate: FollowUpBossEndpoints['textMessagesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'textMessages.create',
			input: Inputs.textMessagesCreate,
			output: Outputs.textMessagesCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/textMessages', body }),
		{
			shape: (raw) => envelopeOne(raw, 'textMessages'),
			log: ({ personId }) => ({ personId }),
		},
	);

export const textMessagesGet: FollowUpBossEndpoints['textMessagesGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'textMessages.get',
			input: Inputs.textMessagesGet,
			output: Outputs.textMessagesGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/textMessages/${segment(id)}` }),
		{
			shape: (raw) => envelopeOne(raw, 'textMessages'),
			log: ({ id }) => ({ textMessageId: id }),
		},
	);

// ── notes ──────────────────────────────────────────────────────────────────

export const notesCreate: FollowUpBossEndpoints['notesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'notes.create',
			input: Inputs.notesCreate,
			output: Outputs.notesCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/notes', body }),
		{
			shape: (raw) => envelopeOne(raw, 'notes'),
			log: ({ personId }) => ({ personId }),
		},
	);

export const notesGet: FollowUpBossEndpoints['notesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'notes.get',
			input: Inputs.notesGet,
			output: Outputs.notesGet,
		},
		input,
		({ id, includeThreadedReplies, includeReactions }) => ({
			method: 'GET',
			path: `/notes/${segment(id)}`,
			query: { includeThreadedReplies, includeReactions },
		}),
		{
			// A single fetch arrives as `{ notes: [note] }`.
			shape: (raw) => envelopeOne(raw, 'notes'),
			log: ({ id }) => ({ noteId: id }),
		},
	);

export const notesUpdate: FollowUpBossEndpoints['notesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'notes.update',
			input: Inputs.notesUpdate,
			output: Outputs.notesUpdate,
		},
		input,
		({ id, ...body }) => ({
			method: 'PUT',
			path: `/notes/${segment(id)}`,
			body,
		}),
		{
			shape: (raw) => envelopeOne(raw, 'notes'),
			log: ({ id }) => ({ noteId: id }),
		},
	);

export const notesDelete: FollowUpBossEndpoints['notesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'notes.delete',
			input: Inputs.notesDelete,
			output: Outputs.notesDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/notes/${segment(id)}` }),
		{
			// unknown: FUB may echo the deleted note in the 200 body.
			shape: (raw, { id }) => ({ id, resource: asRecord(raw) }),
			log: ({ id }) => ({ noteId: id }),
		},
	);

// ── events ─────────────────────────────────────────────────────────────────

export const eventsList: FollowUpBossEndpoints['eventsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.list',
			input: Inputs.eventsList,
			output: Outputs.eventsList,
		},
		input,
		({ type, ...query }) => ({
			method: 'GET',
			path: '/events',
			query: {
				...query,
				// The provider contract takes this filter as a comma-separated list.
				type: type ? type.join(',') : undefined,
			},
		}),
		{
			shape: (raw) => ({
				events: envelopeMany(raw, 'events'),
				_metadata: envelopeMeta(raw),
			}),
			log: (_, result) => ({ count: result.events.length }),
		},
	);

export const eventsGet: FollowUpBossEndpoints['eventsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'events.get',
			input: Inputs.eventsGet,
			output: Outputs.eventsGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/events/${segment(id)}` }),
		{
			shape: (raw) => envelopeOne(raw, 'events'),
			log: ({ id }) => ({ eventId: id }),
		},
	);

export const eventsCreate: FollowUpBossEndpoints['eventsCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'events.create',
			input: Inputs.eventsCreate,
			output: Outputs.eventsCreate,
		},
		input,
		(body) => ({ method: 'POST', path: '/events', body }),
		{
			// FUB answers 200 when the person already existed, 201 when created
			// and 204 with no body, so the envelope is optional.
			shape: (raw) => (raw === undefined ? {} : (asRecord(raw) ?? {})),
			log: (_, result) => ({ eventId: result.event?.id ?? undefined }),
		},
	);
