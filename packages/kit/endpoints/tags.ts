import { asRecord } from 'corsair/core';
import type { KitEndpoints } from '..';
import { definedQuery, segment } from '../client';
import { call } from './call';
import {
	KitEndpointInputSchemas as Inputs,
	KitEndpointOutputSchemas as Outputs,
} from './types';

export const list: KitEndpoints['tagsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.list',
			input: Inputs.tagsList,
			output: Outputs.tagsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/v4/tags',
			query: definedQuery({
				after: parsed.after,
				before: parsed.before,
				per_page: parsed.per_page,
				include:
					parsed.include && parsed.include.length > 0
						? parsed.include.join(',')
						: undefined,
			}),
		}),
		{ log: (_, result) => ({ count: result.tags.length }) },
	);

export const create: KitEndpoints['tagsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.create',
			input: Inputs.tagsCreate,
			output: Outputs.tagsCreate,
		},
		input,
		({ name }) => ({ method: 'POST', path: '/v4/tags', body: { name } }),
		{ log: (_, result) => ({ tagId: result.tag.id }) },
	);

export const update: KitEndpoints['tagsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.update',
			input: Inputs.tagsUpdate,
			output: Outputs.tagsUpdate,
		},
		input,
		({ tagId, name }) => ({
			method: 'PUT',
			path: `/v4/tags/${segment(tagId)}`,
			body: { name },
		}),
		{ log: ({ tagId }) => ({ tagId }) },
	);

// Tagging by email address answers 200 or 201 with the tagged subscriber. The
// result keeps the shape the untag returns and adds the subscriber's ID.
export const tagSubscriber: KitEndpoints['tagsTagSubscriber'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'tags.tagSubscriber',
			input: Inputs.tagsTagSubscriber,
			output: Outputs.tagsTagSubscriber,
		},
		input,
		({ tagId, email_address }) => ({
			method: 'POST',
			path: `/v4/tags/${segment(tagId)}/subscribers`,
			body: { email_address },
		}),
		{
			// unknown: raw is Kit's `{ subscriber }` body; only its ID is kept.
			// A body without a numeric subscriber ID is not a tagging Kit
			// confirmed, so it fails rather than reporting success.
			shape: (raw: unknown, { tagId, email_address }) => {
				const id = asRecord(asRecord(raw)?.subscriber)?.id;
				if (typeof id !== 'number' || !Number.isInteger(id)) {
					throw new Error('Kit answered the tagging without a subscriber ID');
				}
				return {
					success: true as const,
					tag_id: tagId,
					email_address,
					subscriber_id: id,
				};
			},
			// The address is not logged, only the tag it went on.
			log: ({ tagId }) => ({ tagId }),
		},
	);

export const untagSubscriber: KitEndpoints['tagsUntagSubscriber'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'tags.untagSubscriber',
			input: Inputs.tagsUntagSubscriber,
			output: Outputs.tagsUntagSubscriber,
		},
		input,
		({ tagId, email_address }) => ({
			method: 'DELETE',
			path: `/v4/tags/${segment(tagId)}/subscribers`,
			query: definedQuery({ email_address }),
		}),
		{
			shape: (_, { tagId, email_address }) => ({
				success: true as const,
				tag_id: tagId,
				email_address,
			}),
			log: ({ tagId }) => ({ tagId }),
		},
	);
