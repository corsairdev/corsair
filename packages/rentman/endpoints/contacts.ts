import type { RentmanEndpoints } from '..';
import { segment } from '../client';
import { call, operatorKey, queryOf } from './call';
import { deletedShape, pagedShape, singleShape } from './shape';
import {
	RentmanEndpointInputSchemas as Inputs,
	RentmanEndpointOutputSchemas as Outputs,
} from './types';

/**
 * A projection and an expansion are comma-separated values rather than repeated
 * parameters, so the array an input takes is joined here.
 */
export function listQuery(parsed: {
	limit?: number;
	cursor?: string;
	fields?: string[];
	expand?: string[];
	sort?: string;
}): Record<string, string | number | boolean | undefined> {
	return queryOf({
		limit: parsed.limit,
		cursor: parsed.cursor,
		fields: parsed.fields?.join(','),
		expand: parsed.expand?.join(','),
		sort: parsed.sort,
	});
}

/**
 * Flattens a `{ gt, lt, … }` filter into the `field[operator]=value` keys
 * Rentman reads. An operator the caller left unset is dropped rather than sent
 * as `undefined`.
 */
export function filterQuery(
	field: string,
	filter: Record<string, string | number | undefined> | undefined,
): Record<string, string | number> {
	if (!filter) return {};
	const out: Record<string, string | number> = {};
	for (const [operator, value] of Object.entries(filter)) {
		if (value !== undefined) out[operatorKey(field, operator)] = value;
	}
	return out;
}

export const list: RentmanEndpoints['contactsList'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.list',
			input: Inputs.contactsList,
			output: Outputs.contactsList,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: '/contacts',
			replayable: true,
			query: {
				...listQuery(parsed),
				...queryOf({
					country: parsed.country,
					type: parsed.type,
					folder: parsed.folder,
				}),
				...filterQuery('modified', parsed.modified),
			},
		}),
		{
			shape: pagedShape('contacts'),
			log: (_, result) => ({
				count: result.contacts.length,
				hasNext: result.next_cursor !== null,
			}),
		},
	);

export const get: RentmanEndpoints['contactsGet'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.get',
			input: Inputs.contactsGet,
			output: Outputs.contactsGet,
		},
		input,
		(parsed) => ({
			method: 'GET',
			path: `/contacts/${segment(parsed.contact_id)}`,
			replayable: true,
			query: queryOf({
				fields: parsed.fields?.join(','),
				expand: parsed.expand?.join(','),
			}),
		}),
		{
			shape: singleShape('contact'),
			log: (_, result) => ({ contactId: result.contact.id ?? 0 }),
		},
	);

/**
 * The address blocks arrive as three nested objects but are sent flat, so the
 * prefix is folded into each field name.
 */
function flattenAddress(
	target: Record<string, unknown>,
	// unknown: the parsed address block, whose fields are read by name here.
	block: unknown,
	prefix: string,
): void {
	if (typeof block !== 'object' || block === null) return;
	for (const [field, value] of Object.entries(block)) {
		if (value !== undefined) target[`${prefix}_${field}`] = value;
	}
}

export const create: RentmanEndpoints['contactsCreate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.create',
			input: Inputs.contactsCreate,
			output: Outputs.contactsCreate,
		},
		input,
		(parsed) => {
			// unknown: the body mixes the scalar contact fields with the address
			// prefixes folded in below, so its values are provider shapes rather
			// than one declared type.
			const body: Record<string, unknown> = queryOf({
				folder: parsed.folder,
				type: parsed.type,
				ext_name_line: parsed.ext_name_line,
				name: parsed.name,
				firstname: parsed.firstname,
				surname: parsed.surname,
				surfix: parsed.surfix,
				gender: parsed.gender,
				code: parsed.code,
				accounting_code: parsed.accounting_code,
				vendor_accounting_code: parsed.vendor_accounting_code,
				country: parsed.country,
				longitude: parsed.longitude,
				latitude: parsed.latitude,
				distance: parsed.distance,
				travel_time: parsed.travel_time,
				email: parsed.email,
				phone: parsed.phone,
			});
			flattenAddress(body, parsed.mailing_address, 'mailing');
			flattenAddress(body, parsed.visit_address, 'visit');
			flattenAddress(body, parsed.invoice_address, 'invoice');
			return {
				method: 'POST',
				path: '/contacts',
				replayable: false,
				body,
			};
		},
		{
			shape: singleShape('contact'),
			log: (_, result) => ({ contactId: result.contact.id ?? 0 }),
		},
	);

export const update: RentmanEndpoints['contactsUpdate'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.update',
			input: Inputs.contactsUpdate,
			output: Outputs.contactsUpdate,
		},
		input,
		(parsed) => {
			const { contact_id: contactId, ...rest } = parsed;
			// unknown: the body mixes the scalar contact fields with the address
			// prefixes folded in below, so its values are provider shapes rather
			// than one declared type.
			const body: Record<string, unknown> = queryOf({
				folder: rest.folder,
				type: rest.type,
				ext_name_line: rest.ext_name_line,
				name: rest.name,
				firstname: rest.firstname,
				surname: rest.surname,
				surfix: rest.surfix,
				gender: rest.gender,
				code: rest.code,
				accounting_code: rest.accounting_code,
				vendor_accounting_code: rest.vendor_accounting_code,
				country: rest.country,
				longitude: rest.longitude,
				latitude: rest.latitude,
				distance: rest.distance,
				travel_time: rest.travel_time,
				email: rest.email,
				phone: rest.phone,
			});
			flattenAddress(body, rest.mailing_address, 'mailing');
			flattenAddress(body, rest.visit_address, 'visit');
			flattenAddress(body, rest.invoice_address, 'invoice');
			return {
				method: 'PUT',
				path: `/contacts/${segment(contactId)}`,
				replayable: false,
				body,
			};
		},
		{
			shape: singleShape('contact'),
			log: (parsed) => ({ contactId: parsed.contact_id }),
		},
	);

export const remove: RentmanEndpoints['contactsDelete'] = (ctx, input) =>
	call(
		ctx,
		{
			event: 'contacts.delete',
			input: Inputs.contactsDelete,
			output: Outputs.contactsDelete,
		},
		input,
		(parsed) => ({
			method: 'DELETE',
			path: `/contacts/${segment(parsed.contact_id)}`,
			replayable: false,
		}),
		{
			shape: deletedShape('contact_id'),
			log: (parsed) => ({ contactId: parsed.contact_id }),
		},
	);
