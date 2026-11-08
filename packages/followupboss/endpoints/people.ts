import { asRecord } from 'corsair/core';
import type { FollowUpBossEndpoints } from '..';
import { segment } from '../client';
import { call, envelopeMany, envelopeMeta, envelopeOne } from './call';
import {
	FollowUpBossEndpointInputSchemas as Inputs,
	FollowUpBossEndpointOutputSchemas as Outputs,
} from './types';

// The list filters `id` and `tags` are comma-separated query parameters in the
// provider contract, so the schema's arrays are joined here.
function joinIds(ids: string[]): string {
	return ids.join(',');
}

export const list: FollowUpBossEndpoints['peopleList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'people.list',
			input: Inputs.peopleList,
			output: Outputs.peopleList,
		},
		input,
		({ id, tags, lastActivityAfter, lastActivityBefore, ...query }) => ({
			method: 'GET',
			path: '/people',
			query: {
				...query,
				id: id ? joinIds(id.map(String)) : undefined,
				tags: tags ? joinIds(tags) : undefined,
				lastActivityAfter: lastActivityAfter ?? undefined,
				lastActivityBefore: lastActivityBefore ?? undefined,
			},
		}),
		{
			shape: (raw) => ({
				people: envelopeMany(raw, 'people'),
				_metadata: envelopeMeta(raw),
			}),
			log: (_, result) => ({ count: result.people.length }),
		},
	);

export const get: FollowUpBossEndpoints['peopleGet'] = (ctx, input) =>
	call(
		ctx,
		{ event: 'people.get', input: Inputs.peopleGet, output: Outputs.peopleGet },
		input,
		({ id, fields }) => ({
			method: 'GET',
			path: `/people/${segment(id)}`,
			query: { fields },
		}),
		{
			// A single fetch arrives as `{ people: [person] }`.
			shape: (raw) => envelopeOne(raw, 'people'),
			log: ({ id }) => ({ personId: id }),
		},
	);

export const create: FollowUpBossEndpoints['peopleCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'people.create',
			input: Inputs.peopleCreate,
			output: Outputs.peopleCreate,
		},
		input,
		({ deduplicate, customFields, ...rest }) => ({
			method: 'POST',
			path: '/people',
			query: { deduplicate },
			// FUB takes custom fields as top-level custom* keys, not a nested
			// customFields object; the map merges into the payload.
			body: { ...rest, ...(customFields ?? {}) },
		}),
		{
			// 201 arrives as the created person, either bare or wrapped.
			shape: (raw) => envelopeOne(raw, 'people'),
			log: (_, result) => ({ personId: result.id ?? undefined }),
		},
	);

export const update: FollowUpBossEndpoints['peopleUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'people.update',
			input: Inputs.peopleUpdate,
			output: Outputs.peopleUpdate,
		},
		input,
		({ id, mergeTags, customFields, ...rest }) => ({
			method: 'PUT',
			path: `/people/${segment(id)}`,
			query: { mergeTags },
			// Same top-level custom* merge as create.
			body: { ...rest, ...(customFields ?? {}) },
		}),
		{
			shape: (raw) => envelopeOne(raw, 'people'),
			log: ({ id }) => ({ personId: id }),
		},
	);

export const remove: FollowUpBossEndpoints['peopleDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'people.delete',
			input: Inputs.peopleDelete,
			output: Outputs.peopleDelete,
		},
		input,
		({ id }) => ({ method: 'DELETE', path: `/people/${segment(id)}` }),
		{
			// unknown: FUB may echo the deleted resource in the 200 body.
			shape: (raw, { id }) => ({ id, resource: asRecord(raw) }),
			log: ({ id }) => ({ personId: id }),
		},
	);

export const checkDuplicate: FollowUpBossEndpoints['peopleCheckDuplicate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'people.checkDuplicate',
			input: Inputs.peopleCheckDuplicate,
			output: Outputs.peopleCheckDuplicate,
		},
		input,
		({ email, phone }) => ({
			method: 'GET',
			path: '/people/checkDuplicate',
			query: { email, phone },
		}),
		{
			log: (_, result) => ({ found: result.found }),
		},
	);

export const unclaimed: FollowUpBossEndpoints['peopleUnclaimed'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'people.unclaimed',
			input: Inputs.peopleUnclaimed,
			output: Outputs.peopleUnclaimed,
		},
		input,
		(query) => ({ method: 'GET', path: '/people/unclaimed', query }),
		{
			shape: (raw) => ({
				people: envelopeMany(raw, 'people'),
				_metadata: envelopeMeta(raw),
			}),
			log: (_, result) => ({ count: result.people.length }),
		},
	);

// POST /people/claim/{personId}: the published path template lost the variable
// but the operation declares `personId` as a path parameter, so the documented
// variable form is used. The body mirrors the documented `personId` field.
export const claim: FollowUpBossEndpoints['peopleClaim'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'people.claim',
			input: Inputs.peopleClaim,
			output: Outputs.peopleClaim,
		},
		input,
		({ personId }) => ({
			method: 'POST',
			path: `/people/claim/${segment(personId)}`,
			body: { personId },
		}),
		{
			shape: (raw) => envelopeOne(raw, 'people'),
			log: ({ personId }) => ({ personId }),
		},
	);

// POST /people/ignoreUnclaimed/{personId} answers 204 with no body.
export const ignoreUnclaimed: FollowUpBossEndpoints['peopleIgnoreUnclaimed'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'people.ignoreUnclaimed',
			input: Inputs.peopleIgnoreUnclaimed,
			output: Outputs.peopleIgnoreUnclaimed,
		},
		input,
		({ personId }) => ({
			method: 'POST',
			path: `/people/ignoreUnclaimed/${segment(personId)}`,
			body: { personId },
		}),
		{
			shape: (_, { personId }) => ({ success: true, personId }),
			log: ({ personId }) => ({ personId }),
		},
	);

// ── person attachments ─────────────────────────────────────────────────────

// unknown: picks the documented attachment fields from an already-parsed input.
function attachmentBody({
	personId,
	uri,
	fileName,
	fileSize,
}: Record<string, unknown>): Record<string, unknown> {
	return { personId, uri, fileName, fileSize };
}

export const attachmentCreate: FollowUpBossEndpoints['personAttachmentCreate'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'personAttachments.create',
				input: Inputs.personAttachmentCreate,
				output: Outputs.personAttachmentCreate,
			},
			input,
			(body) => ({
				method: 'POST',
				path: '/personAttachments',
				body: attachmentBody(body),
			}),
			{
				shape: (raw) => envelopeOne(raw, 'personAttachments'),
				log: (_, result) => ({ attachmentId: result.id ?? undefined }),
			},
		);

export const attachmentGet: FollowUpBossEndpoints['personAttachmentGet'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'personAttachments.get',
			input: Inputs.personAttachmentGet,
			output: Outputs.personAttachmentGet,
		},
		input,
		({ id }) => ({ method: 'GET', path: `/personAttachments/${segment(id)}` }),
		{
			shape: (raw) => envelopeOne(raw, 'personAttachments'),
			log: ({ id }) => ({ attachmentId: id }),
		},
	);

export const attachmentUpdate: FollowUpBossEndpoints['personAttachmentUpdate'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'personAttachments.update',
				input: Inputs.personAttachmentUpdate,
				output: Outputs.personAttachmentUpdate,
			},
			input,
			({ id, ...body }) => ({
				method: 'PUT',
				path: `/personAttachments/${segment(id)}`,
				body: attachmentBody(body),
			}),
			{
				shape: (raw) => envelopeOne(raw, 'personAttachments'),
				log: ({ id }) => ({ attachmentId: id }),
			},
		);

export const attachmentDelete: FollowUpBossEndpoints['personAttachmentDelete'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'personAttachments.delete',
				input: Inputs.personAttachmentDelete,
				output: Outputs.personAttachmentDelete,
			},
			input,
			({ id }) => ({
				method: 'DELETE',
				path: `/personAttachments/${segment(id)}`,
			}),
			{
				// unknown: FUB may echo the deleted attachment in the 200 body.
				shape: (raw, { id }) => ({ id, resource: asRecord(raw) }),
				log: ({ id }) => ({ attachmentId: id }),
			},
		);

// ── people relationships ───────────────────────────────────────────────────

export const relationshipsList: FollowUpBossEndpoints['peopleRelationshipsList'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'peopleRelationships.list',
				input: Inputs.peopleRelationshipsList,
				output: Outputs.peopleRelationshipsList,
			},
			input,
			(query) => ({
				method: 'GET',
				path: '/peopleRelationships',
				query,
			}),
			{
				shape: (raw) => ({
					peopleRelationships: envelopeMany(raw, 'peopleRelationships'),
					_metadata: envelopeMeta(raw),
				}),
				log: (_, result) => ({ count: result.peopleRelationships.length }),
			},
		);

export const relationshipsCreate: FollowUpBossEndpoints['peopleRelationshipsCreate'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'peopleRelationships.create',
				input: Inputs.peopleRelationshipsCreate,
				output: Outputs.peopleRelationshipsCreate,
			},
			input,
			(body) => ({ method: 'POST', path: '/peopleRelationships', body }),
			{
				shape: (raw) => envelopeOne(raw, 'peopleRelationships'),
				log: (_, result) => ({ relationshipId: result.id ?? undefined }),
			},
		);

export const relationshipsGet: FollowUpBossEndpoints['peopleRelationshipsGet'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'peopleRelationships.get',
				input: Inputs.peopleRelationshipsGet,
				output: Outputs.peopleRelationshipsGet,
			},
			input,
			({ id }) => ({
				method: 'GET',
				path: `/peopleRelationships/${segment(id)}`,
			}),
			{
				shape: (raw) => envelopeOne(raw, 'peopleRelationships'),
				log: ({ id }) => ({ relationshipId: id }),
			},
		);

export const relationshipsUpdate: FollowUpBossEndpoints['peopleRelationshipsUpdate'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'peopleRelationships.update',
				input: Inputs.peopleRelationshipsUpdate,
				output: Outputs.peopleRelationshipsUpdate,
			},
			input,
			({ id, ...body }) => ({
				method: 'PUT',
				path: `/peopleRelationships/${segment(id)}`,
				body,
			}),
			{
				shape: (raw) => envelopeOne(raw, 'peopleRelationships'),
				log: ({ id }) => ({ relationshipId: id }),
			},
		);

export const relationshipsDelete: FollowUpBossEndpoints['peopleRelationshipsDelete'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'peopleRelationships.delete',
				input: Inputs.peopleRelationshipsDelete,
				output: Outputs.peopleRelationshipsDelete,
			},
			input,
			({ id }) => ({
				method: 'DELETE',
				path: `/peopleRelationships/${segment(id)}`,
			}),
			{
				// unknown: FUB may echo the deleted relationship in the 200 body.
				shape: (raw, { id }) => ({ id, resource: asRecord(raw) }),
				log: ({ id }) => ({ relationshipId: id }),
			},
		);
