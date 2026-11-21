import type { JsonObject } from './client';
import {
	HotspotSystemEndpointOutputSchemas as Outputs,
	PersonSchema,
	VoucherSchema,
} from './endpoints/types';

/**
 * The documents below are the examples the published Swagger file gives for
 * each response, copied verbatim from
 * https://www.hotspotsystem.com/apidocs/src/hss_v2_swagger.json. A schema that
 * demands more than the provider sends would fail here.
 */
const person = {
	id: '123456',
	user_name: 'EuropeHQ',
	name: 'Europe HQ',
	email: 'help@example.com',
	company_name: 'Example Ltd',
	address: 'Liszt Ferenc ter 10',
	city: 'Budapest',
	state: null,
	zip: 'H-1061',
	country_code: 'HU',
	phone: '+3613010817',
	social_network: null,
	social_id: null,
	social_username: null,
	social_link: null,
	social_gender: null,
	social_age_range: null,
	social_followers_count: null,
	registered_at: '2016-01-15 08:00:00',
};

const voucher = {
	serial: '1229604629-75349',
	voucher_code: '1h-296823',
	limit_tl: 0,
	simultaneous_use: 1,
	limit_dl: 0,
	limit_ul: 0,
	usage_exp: null,
	validity: 60,
	price_enduser: 600,
	currency: 'HUF',
};

const paidTransaction = {
	id: 890,
	operator: 'jgonda',
	location_id: 1,
	user_name: 'mmitchell92',
	customer: 'Mark mitchell',
	action_date_gmt: '2016-05-28T15:35:56.000Z',
	amount: 7.5,
	currency: 'EUR',
	user_agent: 'Mozilla/5.0',
	newsletter: 0,
	company_name: null,
	email: 'mark@example.com',
	address: null,
	city: null,
	state: null,
	zip: null,
	country_code: null,
	phone: '447850477290',
	language: 'en',
	smscountry: null,
};

const macTransaction = {
	id: 552,
	operator: 'jgonda',
	location_id: 1,
	user_name: '0C-74-C2-82-FE-E0',
	action_date_gmt: '2016-06-20T12:23:24.000Z',
	package_id: 'd2',
	user_agent: 'Mozilla/5.0',
	customer: 'badilovskii',
	newsletter: 0,
	company_name: null,
	email: 'example@example.com',
	address: null,
	city: null,
	state: null,
	zip: null,
	country_code: null,
	phone: null,
	q1: null,
	a1: '4107',
	q2: null,
	a2: null,
	q3: null,
	a3: null,
	q4: null,
	a4: null,
	q5: null,
	a5: null,
};

function page(item: JsonObject) {
	return { metadata: { total_count: 1 }, items: [item] };
}

describe('output schemas accept the documented examples', () => {
	const cases: Array<[keyof typeof Outputs, JsonObject]> = [
		['ping.check', { ping: 'pong' }],
		['me.get', { userId: 1, operator: 'John Doe' }],
		['locations.list', page({ id: '1', name: 'Location 1' })],
		['locations.options', { items: [{ id: '1', name: 'Location 1' }] }],
		['customers.list', page(person)],
		['subscribers.list', page(person)],
		['vouchers.list', page(voucher)],
		['transactions.paid', page(paidTransaction)],
		['transactions.voucher', page(paidTransaction)],
		['transactions.social', page({ ...paidTransaction, social_id: '1020' })],
		['transactions.mac', page(macTransaction)],
		['locations.customers', page(person)],
		['locations.subscribers', page(person)],
		['locations.vouchers', page(voucher)],
		['locations.paidTransactions', page(paidTransaction)],
		['locations.voucherTransactions', page(paidTransaction)],
		['locations.socialTransactions', page(paidTransaction)],
		['locations.macTransactions', page(macTransaction)],
	];

	it.each(cases)('%s parses its documented example', (operation, document) => {
		const parsed = Outputs[operation].safeParse(document);
		expect(parsed.error?.issues ?? []).toEqual([]);
		expect(parsed.success).toBe(true);
	});

	it('returns next_offset when the page carries one', () => {
		const parsed = Outputs['locations.list'].safeParse({
			...page({ id: '1', name: 'One' }),
			next_offset: 10,
		});
		expect(parsed.success).toBe(true);
		expect(parsed.success && parsed.data.next_offset).toBe(10);
	});

	it('leaves next_offset absent on the last page', () => {
		const parsed = Outputs['locations.list'].parse(page({ id: '1' }));
		expect(parsed.next_offset).toBeUndefined();
	});
});

describe('output schemas reject a wrong-shaped body', () => {
	it('refuses a page with no items array', () => {
		expect(Outputs['locations.list'].safeParse({ metadata: {} }).success).toBe(
			false,
		);
		expect(Outputs['locations.list'].safeParse({ items: 'nope' }).success).toBe(
			false,
		);
	});

	it('refuses a bodyless answer, which is not the documented shape', () => {
		// A 200 with no body must not read as an empty page.
		expect(Outputs['vouchers.list'].safeParse(undefined).success).toBe(false);
		expect(Outputs['vouchers.list'].safeParse(null).success).toBe(false);
	});

	it('refuses a voucher whose validity is a string', () => {
		expect(
			VoucherSchema.safeParse({ ...voucher, validity: '60' }).success,
		).toBe(false);
	});

	it('accepts a person with every optional field absent', () => {
		expect(PersonSchema.safeParse({}).success).toBe(true);
	});
});

describe('output schemas tolerate what the provider adds', () => {
	it('keeps a field the docs do not list', () => {
		const parsed = PersonSchema.parse({ id: '1', brand_new_field: 'kept' });
		expect(parsed.brand_new_field).toBe('kept');
	});
});
