import { logEventFromContext } from 'corsair/core';
import { BeaconstacAPIError, makeBeaconstacRequest } from '../client';
import type { BeaconstacEndpoints } from '../index';
import type { BeaconstacEndpointOutputs } from './types';

type Ctx = Parameters<BeaconstacEndpoints['placesCreate']>[0];

async function call<T>(
	ctx: Ctx,
	event: string,
	meta: Record<string, unknown>,
	path: string,
	options: Parameters<typeof makeBeaconstacRequest>[2] = {},
): Promise<T> {
	const response = await makeBeaconstacRequest<T>(path, ctx.key, options);
	if (response === undefined) {
		throw new BeaconstacAPIError(`Empty response from ${path}`);
	}
	await logEventFromContext(ctx, event, meta, 'completed');
	return response;
}

function withoutKeys<T extends Record<string, unknown>>(
	input: T,
	keys: string[],
): Record<string, unknown> {
	const body = { ...input };
	for (const key of keys) delete body[key];
	return body;
}

export const placesCreate: BeaconstacEndpoints['placesCreate'] = (ctx, input) =>
	call(
		ctx,
		'beaconstac.places.create',
		{ name: input.name },
		'/api/2.0/places/',
		{
			method: 'POST',
			body: input,
		},
	);

export const placesList: BeaconstacEndpoints['placesList'] = (ctx, input) =>
	call(
		ctx,
		'beaconstac.places.list',
		{ page: input.page },
		'/api/2.0/places/',
		{
			query: input,
		},
	);

export const placesUpdate: BeaconstacEndpoints['placesUpdate'] = (ctx, input) =>
	call(
		ctx,
		'beaconstac.places.update',
		{ place_id: input.place_id },
		`/api/2.0/places/${input.place_id}/`,
		{ method: 'PUT', body: withoutKeys(input, ['place_id']) },
	);

export const qrTemplatesCreate: BeaconstacEndpoints['qrTemplatesCreate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'beaconstac.qrTemplates.create',
		{ name: input.name },
		'/api/2.0/qrtemplates/',
		{ method: 'POST', body: input },
	);

export const qrTemplatesList: BeaconstacEndpoints['qrTemplatesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'beaconstac.qrTemplates.list',
		{ organization: input.organization },
		'/api/2.0/qrtemplates/',
		{ query: input },
	);

export const qrTemplatesDelete: BeaconstacEndpoints['qrTemplatesDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'beaconstac.qrTemplates.delete',
		{ id: input.id },
		`/api/2.0/qrtemplates/${input.id}/`,
		{ method: 'DELETE' },
	);

export const tagsCreate: BeaconstacEndpoints['tagsCreate'] = (ctx, input) =>
	call(ctx, 'beaconstac.tags.create', { name: input.name }, '/api/2.0/tags/', {
		method: 'POST',
		body: input,
	});

export const tagsList: BeaconstacEndpoints['tagsList'] = (ctx, input) =>
	call(ctx, 'beaconstac.tags.list', { page: input.page }, '/api/2.0/tags/', {
		query: input,
	});

export const tagsUpdate: BeaconstacEndpoints['tagsUpdate'] = (ctx, input) =>
	call(
		ctx,
		'beaconstac.tags.update',
		{ tag_id: input.tag_id },
		`/api/2.0/tags/${input.tag_id}/`,
		{ method: 'PUT', body: withoutKeys(input, ['tag_id']) },
	);

export const tagsDelete: BeaconstacEndpoints['tagsDelete'] = (ctx, input) =>
	call(
		ctx,
		'beaconstac.tags.delete',
		{ tag_id: input.tag_id },
		`/api/2.0/tags/${input.tag_id}/`,
		{ method: 'DELETE' },
	);

export const usersCreate: BeaconstacEndpoints['usersCreate'] = (ctx, input) =>
	call(
		ctx,
		'beaconstac.users.create',
		{ username: input.username },
		'/api/2.0/users/add/',
		{ method: 'POST', body: input },
	);

export const usersList: BeaconstacEndpoints['usersList'] = (ctx, input) =>
	call(ctx, 'beaconstac.users.list', { page: input.page }, '/api/2.0/users/', {
		query: input,
	});

export const usersGet: BeaconstacEndpoints['usersGet'] = (ctx, input) =>
	call(
		ctx,
		'beaconstac.users.get',
		{ id: input.id },
		`/api/2.0/users/${input.id}/`,
	);

export const usersUpdate: BeaconstacEndpoints['usersUpdate'] = (ctx, input) =>
	call(
		ctx,
		'beaconstac.users.update',
		{ user_id: input.user_id },
		`/api/2.0/users/${input.user_id}/`,
		{ method: 'PUT', body: withoutKeys(input, ['user_id']) },
	);

export const qrcodesGet: BeaconstacEndpoints['qrcodesGet'] = (ctx, input) =>
	call(
		ctx,
		'beaconstac.qrcodes.get',
		{ id: input.id },
		`/api/2.0/qrcodes/${input.id}/`,
	);

export const qrcodesUpdate: BeaconstacEndpoints['qrcodesUpdate'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'beaconstac.qrcodes.update',
		{ qrcode_id: input.qrcode_id },
		`/api/2.0/qrcodes/${input.qrcode_id}/`,
		{ method: 'PUT', body: withoutKeys(input, ['qrcode_id']) },
	);

export const qrcodesDelete: BeaconstacEndpoints['qrcodesDelete'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'beaconstac.qrcodes.delete',
		{ id: input.id },
		`/api/2.0/qrcodes/${input.id}/`,
		{ method: 'DELETE' },
	);

export const bulkQrcodesList: BeaconstacEndpoints['bulkQrcodesList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'beaconstac.bulkQrcodes.list',
		{ page: input.page },
		'/api/2.0/bulkqrcodes/',
		{ query: input },
	);

export const organizationsList: BeaconstacEndpoints['organizationsList'] = (
	ctx,
	input,
) =>
	call(
		ctx,
		'beaconstac.organizations.list',
		{ page: input.page },
		'/api/2.0/organizations/',
		{ query: input },
	);

function reportingBody(input: {
	product_type: string;
	from_timestamp: number;
	to_timestamp: number;
}) {
	return {
		product_type: input.product_type,
		from: String(input.from_timestamp),
		to: String(input.to_timestamp),
	};
}

export const analyticsPeriodOverview: BeaconstacEndpoints['analyticsPeriodOverview'] =
	(ctx, input) =>
		call<BeaconstacEndpointOutputs['analyticsPeriodOverview']>(
			ctx,
			'beaconstac.analytics.periodOverview',
			{ organization: input.organization },
			'/reporting/2.0/',
			{
				method: 'POST',
				query: {
					organization: input.organization,
					method: 'Products.getPeriodOverview',
				},
				body: reportingBody(input),
			},
		);

export const analyticsProductOverview: BeaconstacEndpoints['analyticsProductOverview'] =
	(ctx, input) =>
		call<BeaconstacEndpointOutputs['analyticsProductOverview']>(
			ctx,
			'beaconstac.analytics.productOverview',
			{ organization: input.organization },
			'/reporting/2.0/',
			{
				method: 'POST',
				query: {
					organization: input.organization,
					method: 'Products.getOverview',
				},
				body: reportingBody(input),
			},
		);
