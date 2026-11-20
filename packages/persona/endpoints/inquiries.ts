import type { PersonaEndpoints } from '..';
import { attributesBody, call } from './call';
import {
	PersonaEndpointInputSchemas as Inputs,
	PersonaEndpointOutputSchemas as Outputs,
} from './types';

export const list: PersonaEndpoints['inquiriesList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'inquiries.list',
			input: Inputs.inquiriesList,
			output: Outputs.inquiriesList,
		},
		input,
		({ pageAfter, pageSize, status }) => ({
			method: 'GET',
			path: '/inquiries',
			query: {
				'page[after]': pageAfter,
				'page[size]': pageSize,
				status,
			},
		}),
		{ log: (_, page) => ({ count: page.data.length }) },
	);

export const get: PersonaEndpoints['inquiriesGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'inquiries.get',
			input: Inputs.inquiriesGet,
			output: Outputs.inquiriesGet,
		},
		input,
		({ inquiryId }) => ({
			method: 'GET',
			path: `/inquiries/${encodeURIComponent(inquiryId)}`,
		}),
		{ log: (_, result) => ({ inquiryId: result.data?.id ?? undefined }) },
	);

export const create: PersonaEndpoints['inquiriesCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'inquiries.create',
			input: Inputs.inquiriesCreate,
			output: Outputs.inquiriesCreate,
		},
		input,
		({ attributes }) => ({
			method: 'POST',
			path: '/inquiries',
			body: attributesBody(attributes),
		}),
		{ log: (_, result) => ({ inquiryId: result.data?.id ?? undefined }) },
	);

export const update: PersonaEndpoints['inquiriesUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'inquiries.update',
			input: Inputs.inquiriesUpdate,
			output: Outputs.inquiriesUpdate,
		},
		input,
		({ inquiryId, attributes }) => ({
			method: 'PATCH',
			path: `/inquiries/${encodeURIComponent(inquiryId)}`,
			body: attributesBody(attributes),
		}),
		{ log: (_, result) => ({ inquiryId: result.data?.id ?? undefined }) },
	);

export const redact: PersonaEndpoints['inquiriesRedact'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'inquiries.redact',
			input: Inputs.inquiriesRedact,
			output: Outputs.inquiriesRedact,
		},
		input,
		({ inquiryId }) => ({
			method: 'DELETE',
			path: `/inquiries/${encodeURIComponent(inquiryId)}`,
		}),
		{
			shape: (raw, { inquiryId }) => {
				if (raw !== undefined && raw !== null && raw !== '') {
					throw new Error(
						`Persona inquiries.redact: unexpected body ${JSON.stringify(raw)}`,
					);
				}
				return { success: true };
			},
			log: (_parsed, result) => ({ success: result.success }),
		},
	);

export const approve: PersonaEndpoints['inquiriesApprove'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'inquiries.approve',
			input: Inputs.inquiriesApprove,
			output: Outputs.inquiriesApprove,
		},
		input,
		({ inquiryId, attributes }) => ({
			method: 'POST',
			path: `/inquiries/${encodeURIComponent(inquiryId)}/approve`,
			body: attributes === undefined ? undefined : attributesBody(attributes),
		}),
		{ log: (_, result) => ({ inquiryId: result.data?.id ?? undefined }) },
	);

export const decline: PersonaEndpoints['inquiriesDecline'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'inquiries.decline',
			input: Inputs.inquiriesDecline,
			output: Outputs.inquiriesDecline,
		},
		input,
		({ inquiryId, attributes }) => ({
			method: 'POST',
			path: `/inquiries/${encodeURIComponent(inquiryId)}/decline`,
			body: attributes === undefined ? undefined : attributesBody(attributes),
		}),
		{ log: (_, result) => ({ inquiryId: result.data?.id ?? undefined }) },
	);

export const markForReview: PersonaEndpoints['inquiriesMarkForReview'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		{
			event: 'inquiries.markForReview',
			input: Inputs.inquiriesMarkForReview,
			output: Outputs.inquiriesMarkForReview,
		},
		input,
		({ inquiryId }) => ({
			method: 'POST',
			path: `/inquiries/${encodeURIComponent(inquiryId)}/mark-for-review`,
		}),
		{ log: (_, result) => ({ inquiryId: result.data?.id ?? undefined }) },
	);

export const generateOneTimeLink: PersonaEndpoints['inquiriesGenerateOneTimeLink'] =
	(ctx, input) =>
		call(
			ctx,
			{
				event: 'inquiries.generateOneTimeLink',
				input: Inputs.inquiriesGenerateOneTimeLink,
				output: Outputs.inquiriesGenerateOneTimeLink,
			},
			input,
			({ inquiryId }) => ({
				method: 'POST',
				path: `/inquiries/${encodeURIComponent(inquiryId)}/generate-one-time-link`,
			}),
			{ log: (_, result) => ({ inquiryId: result.data?.id ?? undefined }) },
		);

export const addTag: PersonaEndpoints['inquiriesAddTag'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'inquiries.addTag',
			input: Inputs.inquiriesAddTag,
			output: Outputs.inquiriesAddTag,
		},
		input,
		({ inquiryId, tag }) => ({
			method: 'POST',
			path: `/inquiries/${encodeURIComponent(inquiryId)}/add-tag`,
			body: attributesBody({ tag }),
		}),
		{ log: (_parsed, result) => ({ success: result.success }) },
	);

export const removeTag: PersonaEndpoints['inquiriesRemoveTag'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'inquiries.removeTag',
			input: Inputs.inquiriesRemoveTag,
			output: Outputs.inquiriesRemoveTag,
		},
		input,
		({ inquiryId, tag }) => ({
			method: 'POST',
			path: `/inquiries/${encodeURIComponent(inquiryId)}/remove-tag`,
			body: attributesBody({ tag }),
		}),
		{ log: (_parsed, result) => ({ success: result.success }) },
	);
