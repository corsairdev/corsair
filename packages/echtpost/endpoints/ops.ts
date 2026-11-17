import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import { z } from 'zod';
import type { EchtpostQuery } from '../client';
import { echtpostRequest } from '../client';
import type { EchtpostContext } from '../context';
import { EchtpostTemplateEntity } from '../schema/database';
import { fontOf } from './list';
import {
	CancelSchema,
	CardCreateInputSchema,
	CardFromTemplateInputSchema,
	CardIdInputSchema,
	CardSchema,
	CardsListInputSchema,
	ContactCreateInputSchema,
	ContactIdInputSchema,
	ContactSchema,
	ContactsListInputSchema,
	ContactUpdateInputSchema,
	CreditsSchema,
	DeletedSchema,
	EmptyInputSchema,
	GroupCreateInputSchema,
	GroupIdInputSchema,
	GroupSchema,
	GroupsListInputSchema,
	GroupUpdateInputSchema,
	MeSchema,
	MotiveIdInputSchema,
	MotiveSchema,
	MotivesListInputSchema,
	PreviewFitInputSchema,
	PreviewFitSchema,
	TemplateIdInputSchema,
	TemplateSchema,
} from './types';

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';

/**
 * One operation: parse the input, send the request, parse the response,
 * log the event with ids only (bodies hold names and addresses).
 */
function op<I extends z.ZodType, O extends z.ZodType>(spec: {
	event: string;
	input: I;
	output: O;
	method: Method;
	path: (parsed: z.output<I>) => string;
	query?: (parsed: z.output<I>) => EchtpostQuery;
	// unknown: the JSON body each operation sends.
	body?: (parsed: z.output<I>) => Record<string, unknown>;
	// unknown: the raw response; shape() turns it into the output.
	shape?: (raw: unknown, parsed: z.output<I>) => unknown;
	log?: (
		parsed: z.output<I>,
		result: z.output<O>,
	) => Record<string, string | number | boolean | undefined>;
	after?: (ctx: EchtpostContext, result: z.output<O>) => Promise<void>;
}): CorsairEndpoint<EchtpostContext, z.input<I>, z.output<O>> {
	return async (ctx, input) => {
		const parsed = spec.input.parse(input ?? {});
		const raw = await echtpostRequest<unknown>(
			ctx.key,
			spec.method,
			spec.path(parsed),
			{ query: spec.query?.(parsed), body: spec.body?.(parsed) },
		);
		const result = spec.output.parse(
			spec.shape ? spec.shape(raw, parsed) : raw,
		);
		await spec.after?.(ctx, result);
		await logEventFromContext(
			ctx,
			`echtpost.${spec.event}`,
			spec.log?.(parsed, result) ?? {},
			'completed',
		);
		return result;
	};
}

const at = (base: string, id: string) => `${base}/${encodeURIComponent(id)}`;

// unknown: a list response must be an array; anything else is an error.
function arrayOf(raw: unknown, what: string): unknown[] {
	if (!Array.isArray(raw)) {
		throw new Error(`EchtPost ${what} response was not an array`);
	}
	return raw;
}

// List queries: booleans become "true"/"false", the rest pass as is.
// unknown: a parsed list input; every value is a query value.
function queryOf(parsed: Record<string, unknown>): EchtpostQuery {
	const out: EchtpostQuery = {};
	for (const [key, value] of Object.entries(parsed)) {
		if (value === undefined) continue;
		out[key] = typeof value === 'boolean' ? String(value) : (value as string);
	}
	return out;
}

const Deleted = DeletedSchema;

// ── Account ──

export const accountGet = op({
	event: 'account.get',
	input: EmptyInputSchema,
	output: MeSchema,
	method: 'GET',
	path: () => '/me',
});

export const accountCredits = op({
	event: 'account.credits',
	input: EmptyInputSchema,
	output: CreditsSchema,
	method: 'GET',
	path: () => '/credits',
});

// ── Contacts (recipients) ──

export const ContactsListOutputSchema = z.object({
	contacts: z.array(ContactSchema),
});
export const contactsList = op({
	event: 'contacts.list',
	input: ContactsListInputSchema,
	output: ContactsListOutputSchema,
	method: 'GET',
	path: () => '/contacts',
	query: queryOf,
	shape: (raw) => ({ contacts: arrayOf(raw, 'contacts') }),
	log: (_p, r) => ({ count: r.contacts.length }),
});

export const contactsGet = op({
	event: 'contacts.get',
	input: ContactIdInputSchema,
	output: ContactSchema,
	method: 'GET',
	path: (p) => at('/contacts', p.id),
	log: (p) => ({ id: p.id }),
});

export const contactsCreate = op({
	event: 'contacts.create',
	input: ContactCreateInputSchema,
	output: ContactSchema,
	method: 'POST',
	path: () => '/contacts',
	body: (p) => p,
	log: (_p, r) => ({ id: r.id }),
});

export const contactsUpdate = op({
	event: 'contacts.update',
	input: ContactUpdateInputSchema,
	output: ContactSchema,
	method: 'PATCH',
	path: (p) => at('/contacts', p.id),
	body: ({ id: _id, ...fields }) => fields,
	log: (p) => ({ id: p.id }),
});

export const contactsDelete = op({
	event: 'contacts.delete',
	input: ContactIdInputSchema,
	output: Deleted,
	method: 'DELETE',
	path: (p) => at('/contacts', p.id),
	shape: (_raw, p) => ({ deleted: true, id: p.id }),
	log: (p) => ({ id: p.id }),
});

// ── Groups ──

export const GroupsListOutputSchema = z.object({
	groups: z.array(GroupSchema),
});
export const groupsList = op({
	event: 'groups.list',
	input: GroupsListInputSchema,
	output: GroupsListOutputSchema,
	method: 'GET',
	path: () => '/groups',
	query: queryOf,
	shape: (raw) => ({ groups: arrayOf(raw, 'groups') }),
	log: (_p, r) => ({ count: r.groups.length }),
});

export const groupsGet = op({
	event: 'groups.get',
	input: GroupIdInputSchema,
	output: GroupSchema,
	method: 'GET',
	path: (p) => at('/groups', p.id),
	log: (p) => ({ id: p.id }),
});

export const groupsCreate = op({
	event: 'groups.create',
	input: GroupCreateInputSchema,
	output: GroupSchema,
	method: 'POST',
	path: () => '/groups',
	body: (p) => p,
	log: (_p, r) => ({ id: r.id }),
});

export const groupsUpdate = op({
	event: 'groups.update',
	input: GroupUpdateInputSchema,
	output: GroupSchema,
	method: 'PATCH',
	path: (p) => at('/groups', p.id),
	body: ({ id: _id, ...fields }) => fields,
	log: (p) => ({ id: p.id }),
});

export const groupsDelete = op({
	event: 'groups.delete',
	input: GroupIdInputSchema,
	output: Deleted,
	method: 'DELETE',
	path: (p) => at('/groups', p.id),
	shape: (_raw, p) => ({ deleted: true, id: p.id }),
	log: (p) => ({ id: p.id }),
});

// ── Templates ──

export const templatesGet = op({
	event: 'templates.get',
	input: TemplateIdInputSchema,
	output: TemplateSchema,
	method: 'GET',
	path: (p) => at('/templates', p.id),
	log: (p) => ({ id: p.id }),
	after: async (ctx, t) => {
		if (!ctx.db?.templates) return;
		const row = EchtpostTemplateEntity.safeParse({
			id: String(t.id),
			motive_id: t.motive_id ?? undefined,
			content: t.content ?? undefined,
			content_ps: t.content_ps ?? undefined,
			content_vertical: t.content_vertical ?? undefined,
			font: fontOf(t.font),
			qr_code_url: t.qr_code_url ?? undefined,
			preview_url: t.preview_url ?? undefined,
			source: t.source ?? undefined,
			created_at: t.created_at ?? undefined,
			updated_at: t.updated_at ?? undefined,
		});
		if (!row.success) return;
		try {
			await ctx.db.templates.upsertByEntityId(row.data.id, row.data);
		} catch {
			console.warn('Failed to save Echtpost template');
		}
	},
});

// ── Motives ──

export const MotivesListOutputSchema = z.object({
	motives: z.array(MotiveSchema),
});
export const motivesList = op({
	event: 'motives.list',
	input: MotivesListInputSchema,
	output: MotivesListOutputSchema,
	method: 'GET',
	path: () => '/motives',
	query: queryOf,
	shape: (raw) => ({ motives: arrayOf(raw, 'motives') }),
	log: (_p, r) => ({ count: r.motives.length }),
});

export const motivesGet = op({
	event: 'motives.get',
	input: MotiveIdInputSchema,
	output: MotiveSchema,
	method: 'GET',
	path: (p) => at('/motives', p.id),
	log: (p) => ({ id: p.id }),
});

// ── Cards ──

export const CardsListOutputSchema = z.object({ cards: z.array(CardSchema) });
export const cardsList = op({
	event: 'cards.list',
	input: CardsListInputSchema,
	output: CardsListOutputSchema,
	method: 'GET',
	path: () => '/cards',
	query: queryOf,
	shape: (raw) => ({ cards: arrayOf(raw, 'cards') }),
	log: (_p, r) => ({ count: r.cards.length }),
});

export const cardsGet = op({
	event: 'cards.get',
	input: CardIdInputSchema,
	output: CardSchema,
	method: 'GET',
	path: (p) => at('/cards', p.id),
	log: (p) => ({ id: p.id }),
});

/** Prints and posts a real card to every recipient and bills the account. */
export const cardsCreate = op({
	event: 'cards.create',
	input: CardCreateInputSchema,
	output: CardSchema,
	method: 'POST',
	path: () => '/cards',
	body: (p) => p,
	log: (_p, r) => ({ id: r.id, recipients: r.contacts_count ?? undefined }),
});

/** Same as cards.create, from a saved template. */
export const cardsCreateFromTemplate = op({
	event: 'cards.createFromTemplate',
	input: CardFromTemplateInputSchema,
	output: CardSchema,
	method: 'POST',
	path: () => '/cards/from_template',
	body: (p) => p,
	log: (_p, r) => ({ id: r.id, recipients: r.contacts_count ?? undefined }),
});

export const cardsPreviewFit = op({
	event: 'cards.previewFit',
	input: PreviewFitInputSchema,
	output: PreviewFitSchema,
	method: 'POST',
	path: () => '/cards/preview_fit',
	body: (p) => p,
	log: (_p, r) => ({ fits: r.fits }),
});

/** Cancels a card that has not been printed yet; it can't be restored. */
export const cardsCancel = op({
	event: 'cards.cancel',
	input: CardIdInputSchema,
	output: CancelSchema,
	method: 'DELETE',
	path: (p) => at('/cards', p.id),
	log: (p, r) => ({ id: p.id, status: r.status ?? undefined }),
});
