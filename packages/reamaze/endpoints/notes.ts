import type { ReamazeEndpoints } from '..';
import { pathSegment } from '../client';
import { call, unwrapArray, unwrapObject } from './call';
import {
	ReamazeEndpointInputSchemas as Inputs,
	ReamazeEndpointOutputSchemas as Outputs,
} from './types';

// Verified live: `GET /contacts/{email}/notes` answers a **bare array**. The
// plugin wraps it under `notes`, and a non-array body throws.

export const list: ReamazeEndpoints['notesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'notes.list',
			input: Inputs.notesList,
			output: Outputs.notesList,
		},
		input,
		({ contact }) => ({
			method: 'GET',
			path: `/contacts/${pathSegment(contact)}/notes`,
		}),
		{
			shape: (raw) => ({ notes: unwrapArray(raw, 'contact notes') }),
			log: (parsed, result) => ({
				contact: parsed.contact,
				count: result.notes.length,
			}),
		},
	);

export const create: ReamazeEndpoints['notesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'notes.create',
			input: Inputs.notesCreate,
			output: Outputs.notesCreate,
		},
		input,
		({ contact, body, creator_email, created_at }) => ({
			method: 'POST',
			path: `/contacts/${pathSegment(contact)}/notes`,
			// Notes are the one resource whose payload is not wrapped in a named
			// key; the body carries the fields directly.
			body: { body, creator_email, created_at },
		}),
		{
			// The documented answer is every note for the contact, which is the same
			// bare array the list route returns.
			shape: (raw) => ({ notes: unwrapArray(raw, 'contact notes') }),
			log: (parsed, result) => ({
				contact: parsed.contact,
				count: result.notes.length,
			}),
		},
	);

export const update: ReamazeEndpoints['notesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'notes.update',
			input: Inputs.notesUpdate,
			output: Outputs.notesUpdate,
		},
		input,
		({ contact, id, body, creator_email, created_at }) => ({
			method: 'PUT',
			path: `/contacts/${pathSegment(contact)}/notes/${pathSegment(id)}`,
			body: { body, creator_email, created_at },
		}),
		{
			shape: (raw) => ({ notes: unwrapArray(raw, 'contact notes') }),
			log: (parsed, result) => ({
				contact: parsed.contact,
				id: parsed.id,
				count: result.notes.length,
			}),
		},
	);

export const remove: ReamazeEndpoints['notesDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'notes.delete',
			input: Inputs.notesDelete,
			output: Outputs.notesDelete,
		},
		input,
		({ contact, id }) => ({
			method: 'DELETE',
			path: `/contacts/${pathSegment(contact)}/notes/${pathSegment(id)}`,
		}),
		{
			// A successful delete answers 200 with no body, so the identifiers are
			// echoed back rather than parsed from one. A non-empty string body is
			// not a success and is rejected: before this, any string was reported as
			// a completed delete.
			shape: (raw, { contact, id }) => {
				if (typeof raw === 'string' && raw.trim().length > 0) {
					throw new Error(
						`Re:amaze returned an unexpected note delete body: ${raw.slice(0, 120)}`,
					);
				}
				if (raw !== undefined && raw !== null && typeof raw === 'object') {
					unwrapObject(raw, 'note delete');
				}
				return { deleted: true as const, contact, id };
			},
			log: ({ contact, id }) => ({ contact, id: String(id) }),
		},
	);
