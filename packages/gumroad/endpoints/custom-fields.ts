import type { GumroadEndpoints } from '..';
import { formEntries } from '../client';
import { call } from './call';

export const list: GumroadEndpoints['customFieldsList'] = (ctx, input) =>
	call(
		ctx,
		'customFieldsList',
		'customFields.list',
		`/products/${encodeURIComponent(input.product_id)}/custom_fields`,
		input,
	);

export const create: GumroadEndpoints['customFieldsCreate'] = (ctx, input) =>
	call(
		ctx,
		'customFieldsCreate',
		'customFields.create',
		`/products/${encodeURIComponent(input.product_id)}/custom_fields`,
		input,
		{
			method: 'POST',
			toForm: (parsed) =>
				formEntries({ name: parsed.name, required: parsed.required }),
		},
	);

export const update: GumroadEndpoints['customFieldsUpdate'] = (ctx, input) =>
	call(
		ctx,
		'customFieldsUpdate',
		'customFields.update',
		`/products/${encodeURIComponent(input.product_id)}/custom_fields/${encodeURIComponent(input.name)}`,
		input,
		{
			method: 'PUT',
			toForm: (parsed) => formEntries({ required: parsed.required }),
		},
	);

export const remove: GumroadEndpoints['customFieldsDelete'] = (ctx, input) =>
	call(
		ctx,
		'customFieldsDelete',
		'customFields.delete',
		`/products/${encodeURIComponent(input.product_id)}/custom_fields/${encodeURIComponent(input.name)}`,
		input,
		{ method: 'DELETE' },
	);
