import type { HotspotSystemEndpoints } from '..';
import { segment } from '../client';
import { readPage } from './call';
import {
	fieldsQuery,
	HotspotSystemEndpointInputSchemas as Inputs,
	HotspotSystemEndpointOutputSchemas as Outputs,
} from './types';

/** The four query parameters every list shares, in the form the API expects. */
function listQuery(parsed: {
	fields?: string[];
	sort?: string;
	limit?: number;
	offset?: number;
}) {
	return {
		fields: fieldsQuery(parsed.fields),
		sort: parsed.sort,
		limit: parsed.limit,
		offset: parsed.offset,
	};
}

function locationPath(locationId: string | number, suffix: string): string {
	return `/locations/${segment(locationId)}/${suffix}`;
}

export const locationsList: HotspotSystemEndpoints['locationsList'] = (
	ctx,
	input,
) =>
	readPage(
		ctx,
		{
			event: 'locations.list',
			input: Inputs['locations.list'],
			output: Outputs['locations.list'],
		},
		input,
		(parsed) => ({ path: '/locations', query: listQuery(parsed) }),
		{ log: (result) => ({ count: result.items.length }) },
	);

/**
 * The `options` form is the same locations as `{ id, name }` pairs with no
 * paging, for filling a picker. It takes no query parameters.
 */
export const locationsOptions: HotspotSystemEndpoints['locationsOptions'] = (
	ctx,
	input,
) =>
	readPage(
		ctx,
		{
			event: 'locations.options',
			input: Inputs['locations.options'],
			output: Outputs['locations.options'],
		},
		input,
		() => ({ path: '/locations/options' }),
		{ log: (result) => ({ count: result.items.length }) },
	);

export const locationsCustomers: HotspotSystemEndpoints['locationsCustomers'] =
	(ctx, input) =>
		readPage(
			ctx,
			{
				event: 'locations.customers',
				input: Inputs['locations.customers'],
				output: Outputs['locations.customers'],
			},
			input,
			({ location_id, ...rest }) => ({
				path: locationPath(location_id, 'customers'),
				query: listQuery(rest),
			}),
			{ log: (result) => ({ count: result.items.length }) },
		);

export const locationsSubscribers: HotspotSystemEndpoints['locationsSubscribers'] =
	(ctx, input) =>
		readPage(
			ctx,
			{
				event: 'locations.subscribers',
				input: Inputs['locations.subscribers'],
				output: Outputs['locations.subscribers'],
			},
			input,
			({ location_id, ...rest }) => ({
				path: locationPath(location_id, 'subscribers'),
				query: listQuery(rest),
			}),
			{ log: (result) => ({ count: result.items.length }) },
		);

export const locationsVouchers: HotspotSystemEndpoints['locationsVouchers'] = (
	ctx,
	input,
) =>
	readPage(
		ctx,
		{
			event: 'locations.vouchers',
			input: Inputs['locations.vouchers'],
			output: Outputs['locations.vouchers'],
		},
		input,
		({ location_id, ...rest }) => ({
			path: locationPath(location_id, 'vouchers'),
			query: listQuery(rest),
		}),
		{ log: (result) => ({ count: result.items.length }) },
	);

/** The four per-location transaction reads differ only in their path suffix. */
function locationTransactions(
	suffix: 'paid' | 'voucher' | 'social' | 'mac',
	operation:
		| 'locations.paidTransactions'
		| 'locations.voucherTransactions'
		| 'locations.socialTransactions'
		| 'locations.macTransactions',
) {
	return (ctx: Parameters<typeof readPage>[0], input: never) =>
		readPage(
			ctx,
			{
				event: operation,
				input: Inputs[operation],
				output: Outputs[operation],
			},
			input,
			({
				location_id,
				...rest
			}: { location_id: string | number } & Parameters<
				typeof listQuery
			>[0]) => ({
				path: locationPath(location_id, `transactions/${suffix}`),
				query: listQuery(rest),
			}),
			{
				// The page shape varies by operation, so only the count is read.
				log: (result) => ({ count: result.items.length }),
			},
		);
}

export const locationsPaidTransactions: HotspotSystemEndpoints['locationsPaidTransactions'] =
	locationTransactions('paid', 'locations.paidTransactions');
export const locationsVoucherTransactions: HotspotSystemEndpoints['locationsVoucherTransactions'] =
	locationTransactions('voucher', 'locations.voucherTransactions');
export const locationsSocialTransactions: HotspotSystemEndpoints['locationsSocialTransactions'] =
	locationTransactions('social', 'locations.socialTransactions');
export const locationsMacTransactions: HotspotSystemEndpoints['locationsMacTransactions'] =
	locationTransactions('mac', 'locations.macTransactions');
