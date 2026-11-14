import { logEventFromContext } from 'corsair/core';
import type { z } from 'zod';
import type { EndorsalContext } from '..';
import { makeEndorsalRequest } from '../client';
import type { EndorsalEndpointInputs } from './types';
import {
	EndorsalEndpointInputSchemas,
	EndorsalEndpointOutputSchemas,
} from './types';

type Method = 'GET' | 'POST' | 'PATCH' | 'DELETE';
type RequestSpec = {
	method: Method;
	url: string;
	body?: object;
	query?: Record<string, string | number | boolean | undefined>;
};

async function execute<I, O>(
	ctx: EndorsalContext,
	name: string,
	input: I,
	inputSchema: z.ZodType<I>,
	outputSchema: z.ZodType<O>,
	request: (parsed: I) => RequestSpec,
): Promise<O> {
	const parsedInput = inputSchema.parse(input);
	const spec = request(parsedInput);
	// Provider JSON is untrusted until the endpoint-specific Zod schema parses it.
	const response: unknown = await makeEndorsalRequest<unknown>(
		spec.url,
		ctx.key,
		{
			method: spec.method,
			body: spec.body,
			query: spec.query,
		},
	);
	const parsedOutput = outputSchema.parse(response);
	await logEventFromContext(ctx, `endorsal.${name}`, {}, 'completed');
	return parsedOutput;
}

const idPath = (collection: string, id: string) =>
	`/v1/${collection}/${encodeURIComponent(id)}`;

export const Testimonials = {
	list: (
		ctx: EndorsalContext,
		input: EndorsalEndpointInputs['testimonialsList'],
	) =>
		execute(
			ctx,
			'testimonialsList',
			input,
			EndorsalEndpointInputSchemas.testimonialsList,
			EndorsalEndpointOutputSchemas.testimonialsList,
			() => ({
				method: 'GET',
				url: '/v1/testimonials',
			}),
		),
	get: (
		ctx: EndorsalContext,
		input: EndorsalEndpointInputs['testimonialsGet'],
	) =>
		execute(
			ctx,
			'testimonialsGet',
			input,
			EndorsalEndpointInputSchemas.testimonialsGet,
			EndorsalEndpointOutputSchemas.testimonialsGet,
			({ id }) => ({
				method: 'GET',
				url: idPath('testimonials', id),
			}),
		),
	create: (
		ctx: EndorsalContext,
		input: EndorsalEndpointInputs['testimonialsCreate'],
	) =>
		execute(
			ctx,
			'testimonialsCreate',
			input,
			EndorsalEndpointInputSchemas.testimonialsCreate,
			EndorsalEndpointOutputSchemas.testimonialsCreate,
			(parsed) => ({
				method: 'POST',
				url: '/v1/testimonials',
				body: parsed,
			}),
		),
	update: (
		ctx: EndorsalContext,
		input: EndorsalEndpointInputs['testimonialsUpdate'],
	) =>
		execute(
			ctx,
			'testimonialsUpdate',
			input,
			EndorsalEndpointInputSchemas.testimonialsUpdate,
			EndorsalEndpointOutputSchemas.testimonialsUpdate,
			({ id, fields }) => ({
				method: 'PATCH',
				url: idPath('testimonials', id),
				body: { fields },
			}),
		),
	remove: (
		ctx: EndorsalContext,
		input: EndorsalEndpointInputs['testimonialsDelete'],
	) =>
		execute(
			ctx,
			'testimonialsDelete',
			input,
			EndorsalEndpointInputSchemas.testimonialsDelete,
			EndorsalEndpointOutputSchemas.testimonialsDelete,
			({ id }) => ({
				method: 'DELETE',
				url: idPath('testimonials', id),
			}),
		),
	addTags: (
		ctx: EndorsalContext,
		input: EndorsalEndpointInputs['testimonialsAddTags'],
	) =>
		execute(
			ctx,
			'testimonialsAddTags',
			input,
			EndorsalEndpointInputSchemas.testimonialsAddTags,
			EndorsalEndpointOutputSchemas.testimonialsAddTags,
			({ id, tags }) => ({
				method: 'POST',
				url: `${idPath('testimonials', id)}/tag`,
				body: { tags },
			}),
		),
	search: (
		ctx: EndorsalContext,
		input: EndorsalEndpointInputs['testimonialsSearch'],
	) =>
		execute(
			ctx,
			'testimonialsSearch',
			input,
			EndorsalEndpointInputSchemas.testimonialsSearch,
			EndorsalEndpointOutputSchemas.testimonialsSearch,
			(parsed) => ({
				method: 'POST',
				url: '/v1/testimonials/search',
				body: parsed,
			}),
		),
	byTag: (
		ctx: EndorsalContext,
		input: EndorsalEndpointInputs['testimonialsByTag'],
	) =>
		execute(
			ctx,
			'testimonialsByTag',
			input,
			EndorsalEndpointInputSchemas.testimonialsByTag,
			EndorsalEndpointOutputSchemas.testimonialsByTag,
			({ id }) => ({
				method: 'GET',
				url: `${idPath('tags', id)}/testimonials`,
			}),
		),
	byContact: (
		ctx: EndorsalContext,
		input: EndorsalEndpointInputs['testimonialsByContact'],
	) =>
		execute(
			ctx,
			'testimonialsByContact',
			input,
			EndorsalEndpointInputSchemas.testimonialsByContact,
			EndorsalEndpointOutputSchemas.testimonialsByContact,
			({ id }) => ({
				method: 'GET',
				url: `${idPath('contacts', id)}/testimonials`,
			}),
		),
};

export const Contacts = {
	list: (ctx: EndorsalContext, input: EndorsalEndpointInputs['contactsList']) =>
		execute(
			ctx,
			'contactsList',
			input,
			EndorsalEndpointInputSchemas.contactsList,
			EndorsalEndpointOutputSchemas.contactsList,
			() => ({
				method: 'GET',
				url: '/v1/contacts',
			}),
		),
	create: (
		ctx: EndorsalContext,
		input: EndorsalEndpointInputs['contactsCreate'],
	) =>
		execute(
			ctx,
			'contactsCreate',
			input,
			EndorsalEndpointInputSchemas.contactsCreate,
			EndorsalEndpointOutputSchemas.contactsCreate,
			({ contact, campaignID }) => ({
				method: 'POST',
				url: '/v1/contacts',
				body: contact,
				query: { campaignID },
			}),
		),
	get: (ctx: EndorsalContext, input: EndorsalEndpointInputs['contactsGet']) =>
		execute(
			ctx,
			'contactsGet',
			input,
			EndorsalEndpointInputSchemas.contactsGet,
			EndorsalEndpointOutputSchemas.contactsGet,
			({ id }) => ({
				method: 'GET',
				url: idPath('contacts', id),
			}),
		),
	update: (
		ctx: EndorsalContext,
		input: EndorsalEndpointInputs['contactsUpdate'],
	) =>
		execute(
			ctx,
			'contactsUpdate',
			input,
			EndorsalEndpointInputSchemas.contactsUpdate,
			EndorsalEndpointOutputSchemas.contactsUpdate,
			({ id, fields }) => ({
				method: 'PATCH',
				url: idPath('contacts', id),
				body: { fields },
			}),
		),
	archive: (
		ctx: EndorsalContext,
		input: EndorsalEndpointInputs['contactsArchive'],
	) =>
		execute(
			ctx,
			'contactsArchive',
			input,
			EndorsalEndpointInputSchemas.contactsArchive,
			EndorsalEndpointOutputSchemas.contactsArchive,
			({ id }) => ({
				method: 'DELETE',
				url: idPath('contacts', id),
			}),
		),
	search: (
		ctx: EndorsalContext,
		input: EndorsalEndpointInputs['contactsSearch'],
	) =>
		execute(
			ctx,
			'contactsSearch',
			input,
			EndorsalEndpointInputSchemas.contactsSearch,
			EndorsalEndpointOutputSchemas.contactsSearch,
			(parsed) => ({
				method: 'POST',
				url: '/v1/contacts/search',
				body: parsed,
			}),
		),
};

export const Tags = {
	list: (ctx: EndorsalContext, input: EndorsalEndpointInputs['tagsList']) =>
		execute(
			ctx,
			'tagsList',
			input,
			EndorsalEndpointInputSchemas.tagsList,
			EndorsalEndpointOutputSchemas.tagsList,
			() => ({
				method: 'GET',
				url: '/v1/tags',
			}),
		),
	create: (ctx: EndorsalContext, input: EndorsalEndpointInputs['tagsCreate']) =>
		execute(
			ctx,
			'tagsCreate',
			input,
			EndorsalEndpointInputSchemas.tagsCreate,
			EndorsalEndpointOutputSchemas.tagsCreate,
			(parsed) => ({
				method: 'POST',
				url: '/v1/tags',
				body: parsed,
			}),
		),
	get: (ctx: EndorsalContext, input: EndorsalEndpointInputs['tagsGet']) =>
		execute(
			ctx,
			'tagsGet',
			input,
			EndorsalEndpointInputSchemas.tagsGet,
			EndorsalEndpointOutputSchemas.tagsGet,
			({ id }) => ({
				method: 'GET',
				url: idPath('tags', id),
			}),
		),
	update: (ctx: EndorsalContext, input: EndorsalEndpointInputs['tagsUpdate']) =>
		execute(
			ctx,
			'tagsUpdate',
			input,
			EndorsalEndpointInputSchemas.tagsUpdate,
			EndorsalEndpointOutputSchemas.tagsUpdate,
			({ id, fields }) => ({
				method: 'PATCH',
				url: idPath('tags', id),
				body: { fields },
			}),
		),
	remove: (ctx: EndorsalContext, input: EndorsalEndpointInputs['tagsDelete']) =>
		execute(
			ctx,
			'tagsDelete',
			input,
			EndorsalEndpointInputSchemas.tagsDelete,
			EndorsalEndpointOutputSchemas.tagsDelete,
			({ id }) => ({
				method: 'DELETE',
				url: idPath('tags', id),
			}),
		),
};

export const Widgets = {
	list: (ctx: EndorsalContext, input: EndorsalEndpointInputs['widgetsList']) =>
		execute(
			ctx,
			'widgetsList',
			input,
			EndorsalEndpointInputSchemas.widgetsList,
			EndorsalEndpointOutputSchemas.widgetsList,
			() => ({
				method: 'GET',
				url: '/v1/widgets',
			}),
		),
	get: (ctx: EndorsalContext, input: EndorsalEndpointInputs['widgetsGet']) =>
		execute(
			ctx,
			'widgetsGet',
			input,
			EndorsalEndpointInputSchemas.widgetsGet,
			EndorsalEndpointOutputSchemas.widgetsGet,
			({ id, render }) => ({
				method: 'GET',
				url: idPath('widgets', id),
				query: { render },
			}),
		),
};

export const WallOfLove = {
	get: (ctx: EndorsalContext, input: EndorsalEndpointInputs['wallOfLoveGet']) =>
		execute(
			ctx,
			'wallOfLoveGet',
			input,
			EndorsalEndpointInputSchemas.wallOfLoveGet,
			EndorsalEndpointOutputSchemas.wallOfLoveGet,
			({ render }) => ({
				method: 'GET',
				url: '/v1/wall-of-love',
				query: { render },
			}),
		),
};

export const Campaigns = {
	list: (
		ctx: EndorsalContext,
		input: EndorsalEndpointInputs['campaignsList'],
	) =>
		execute(
			ctx,
			'campaignsList',
			input,
			EndorsalEndpointInputSchemas.campaignsList,
			EndorsalEndpointOutputSchemas.campaignsList,
			() => ({
				method: 'GET',
				url: '/v1/autorequests/campaigns',
			}),
		),
	get: (ctx: EndorsalContext, input: EndorsalEndpointInputs['campaignsGet']) =>
		execute(
			ctx,
			'campaignsGet',
			input,
			EndorsalEndpointInputSchemas.campaignsGet,
			EndorsalEndpointOutputSchemas.campaignsGet,
			({ id }) => ({
				method: 'GET',
				url: `${idPath('autorequests/campaigns', id)}`,
			}),
		),
};

export * from './types';
