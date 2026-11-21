import type { PersonaEndpoints } from '..';
import { attributesBody, call, metaBody, pageQuery, segment } from './call';
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
		({
			status,
			accountId,
			referenceId,
			inquiryTemplateId,
			templateId,
			...page
		}) => ({
			method: 'GET',
			path: '/inquiries',
			query: {
				...pageQuery(page),
				'filter[status]': status,
				'filter[account-id]': accountId,
				'filter[reference-id]': referenceId,
				'filter[inquiry-template-id]': inquiryTemplateId,
				'filter[template-id]': templateId,
			},
		}),
		{
			log: (_, result) => ({
				count: result.data.length,
				hasMore: Boolean(result.links?.next),
			}),
		},
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
			path: `/inquiries/${segment(inquiryId)}`,
		}),
		{ log: (_, result) => ({ id: result.data.id }) },
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
		({ attributes, meta }) => ({
			method: 'POST',
			path: '/inquiries',
			body: { data: { attributes }, ...(meta ? { meta } : {}) },
		}),
		{ log: (_, result) => ({ id: result.data.id }) },
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
			path: `/inquiries/${segment(inquiryId)}`,
			body: attributesBody(attributes),
		}),
		{ log: (_, result) => ({ id: result.data.id }) },
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
			path: `/inquiries/${segment(inquiryId)}`,
		}),
		{ log: (_, result) => ({ id: result.data.id }) },
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
		({ inquiryId, comment }) => ({
			method: 'POST',
			path: `/inquiries/${segment(inquiryId)}/approve`,
			body: metaBody({ comment }),
		}),
		{ log: (_, result) => ({ id: result.data.id }) },
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
		({ inquiryId, comment }) => ({
			method: 'POST',
			path: `/inquiries/${segment(inquiryId)}/decline`,
			body: metaBody({ comment }),
		}),
		{ log: (_, result) => ({ id: result.data.id }) },
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
			path: `/inquiries/${segment(inquiryId)}/mark-for-review`,
		}),
		{ log: (_, result) => ({ id: result.data.id }) },
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
			({ inquiryId, expiresInSeconds }) => ({
				method: 'POST',
				path: `/inquiries/${segment(inquiryId)}/generate-one-time-link`,
				body: metaBody({ 'expires-in-seconds': expiresInSeconds }),
			}),
			{ log: (_, result) => ({ id: result.data.id }) },
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
		({ inquiryId, tagName, tagId }) => ({
			method: 'POST',
			path: `/inquiries/${segment(inquiryId)}/add-tag`,
			body: metaBody({ 'tag-name': tagName, 'tag-id': tagId }),
		}),
		{ log: (_, result) => ({ id: result.data.id }) },
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
		({ inquiryId, tagName, tagId }) => ({
			method: 'POST',
			path: `/inquiries/${segment(inquiryId)}/remove-tag`,
			body: metaBody({ 'tag-name': tagName, 'tag-id': tagId }),
		}),
		{ log: (_, result) => ({ id: result.data.id }) },
	);
