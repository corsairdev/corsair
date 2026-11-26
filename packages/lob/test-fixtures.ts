import type { z } from 'zod';
import {
	AddressListResponseSchema,
	AutocompleteResponseSchema,
	IntlVerificationSchema,
	LobAddressSchema,
	LobLetterSchema,
	LobPostcardSchema,
	UsVerificationSchema,
	ZipLookupResponseSchema,
} from './endpoints/types-base';

// Response bodies the Lob API sends per its OpenAPI spec examples (spec
// v1.22.0). Every fixture parses through the matching output schema, so a
// schema change that breaks the real payload shape fails here first.

export const usVerificationOk = {
	id: 'us_ver_c7cb63d68f8d6',
	recipient: 'LOB.COM',
	primary_line: '210 KING ST',
	secondary_line: '',
	urbanization: '',
	last_line: 'SAN FRANCISCO CA 94107-1702',
	deliverability: 'deliverable',
	valid_address: true,
	components: {
		primary_number: '210',
		street_predirection: '',
		street_name: 'KING',
		street_suffix: 'ST',
		street_postdirection: '',
		secondary_designator: 'STE',
		secondary_number: '6100',
		pmb_designator: '',
		pmb_number: '',
		extra_secondary_designator: '',
		extra_secondary_number: '',
		city: 'SAN FRANCISCO',
		state: 'CA',
		zip_code: '94107',
		zip_code_plus_4: '1702',
		zip_code_type: 'standard',
		delivery_point_barcode: '210170294170',
		address_type: 'commercial',
		record_type: 'highrise',
		default_building_address: false,
		county: 'SAN FRANCISCO COUNTY',
		county_fips: '06075',
		carrier_route: 'C038',
		carrier_route_type: 'city_delivery',
		po_box_only_flag: 'N',
	},
	deliverability_analysis: {
		dpv_confirmation: 'Y',
		dpv_cmra: 'N',
		dpv_vacant: 'N',
		dpv_active: 'Y',
		dpv_inactive_reason: '',
		dpv_throwback: 'N',
		dpv_non_delivery_day_flag: 'N',
		dpv_non_delivery_day_values: '',
		dpv_no_secure_location: 'N',
		dpv_door_not_accessible: 'N',
		dpv_footnotes: ['N1'],
		ews_match: false,
		lacs_indicator: '',
		lacs_return_code: '',
		suite_return_code: '',
	},
	lob_confidence_score: { score: 0.9, level: 'high' },
	object: 'us_verification',
};

export const usRowError = {
	error: {
		message: 'primary_line is required',
		status_code: 422,
		code: 'bad_request',
	},
};

export const usVerificationError = {
	id: 'us_ver_never_delivers',
	recipient: 'MISSING ADDRESS',
	primary_line: '1 NOWHERE RD',
	last_line: 'DELULU CA 99999',
	deliverability: 'undeliverable',
	valid_address: false,
	object: 'us_verification',
};

export const intlVerificationOk = {
	id: 'intl_ver_9cd76de56d6f9',
	recipient: 'JOHN APPLESEED',
	primary_line: '123 PARAMOUNT RD',
	secondary_line: '',
	last_line: 'TORONTO ON M5V 2T6',
	country: 'CANADA',
	coverage: 'STREET',
	deliverability: 'deliverable',
	status: 'LV4',
	components: {
		primary_number: '123',
		street_name: 'PARAMOUNT RD',
		city: 'TORONTO',
		state: 'ON',
		postal_code: 'M5V 2T6',
	},
	object: 'intl_verification',
};

export const autocompleteOk = {
	id: 'us_auto_6dc3c810e7f9',
	suggestions: [
		{
			primary_line: '185 INDUSTRIAL PARKWAY RD',
			city: 'SAINT FRANCIS',
			state: 'MN',
			zip_code: '55070',
			object: 'us_autocompletion',
		},
	],
	object: 'us_autocompletion',
};

export const zipLookupOk = {
	id: 'us_zip_4ab82888e99a',
	zip_code: '94107',
	cities: [
		{
			city: 'SAN FRANCISCO',
			state: 'CA',
			county: 'SAN FRANCISCO COUNTY',
			county_fips: '06075',
			preferred: true,
		},
	],
	zip_code_type: 'standard',
	object: 'us_zip_lookup',
};

export const addressOk = {
	id: 'adr_d0c7d5ac3f7e6b4',
	name: 'JORDAN LEE',
	company: 'ACME LOGISTICS',
	phone: null,
	email: null,
	address_line1: '210 KING ST STE 6100',
	address_line2: null,
	address_city: 'SAN FRANCISCO',
	address_state: 'CA',
	address_zip: '94107-1741',
	address_country: 'UNITED STATES',
	metadata: { team: 'ops' },
	recipient_moved: null,
	date_created: '2026-01-08T03:01:07.651Z',
	date_modified: '2026-01-08T03:01:07.651Z',
	deleted: false,
	object: 'address',
};

export const addressDeleted = {
	id: 'adr_d0c7d5ac3f7e6b4',
	deleted: true,
};

export const addressListOk = {
	object: 'list',
	next_url:
		'https://api.lob.com/v1/addresses?after=adr_d0c7d5ac3f7e6b4&limit=2',
	previous_url: null,
	count: 1,
	total_count: 1,
	data: [addressOk],
};

export const postcardOk = {
	id: 'psc_208e45e48d271294',
	description: null,
	metadata: {},
	to: {
		id: 'adr_210a8d4b0b76d77b',
		description: null,
		name: null,
		company: 'LOB',
		phone: null,
		email: null,
		address_line1: '210 KING ST STE 6100',
		address_line2: null,
		address_city: 'SAN FRANCISCO',
		address_state: 'CA',
		address_zip: '94107-1741',
		address_country: 'UNITED STATES',
		metadata: {},
		date_created: '2018-12-08T03:01:07.651Z',
		date_modified: '2018-12-08T03:01:07.651Z',
		object: 'address',
	},
	url: 'https://lob-assets.com/postcards/psc_208e45e48d271294.pdf?version=v1&expires=1619218302&signature=NfHHLBSr5tOHA_Z4kij4dKqZG8f3vMDtwvuFVeeF9pV_lylcjLsVVODhNCE5hR6-2slUr6t9WMNsi429Pj7_DA',
	carrier: 'USPS',
	front_template_id: null,
	back_template_id: null,
	date_created: '2021-03-24T22:51:42.838Z',
	date_modified: '2021-03-24T22:51:42.838Z',
	send_date: '2021-03-24T22:51:42.838Z',
	use_type: 'marketing',
	fsc: false,
	status: 'rendered',
	object: 'postcard',
};

export const letterOk = {
	id: 'ltr_489a2ce9d621bde',
	description: null,
	metadata: {},
	to: {
		id: 'adr_210a8d4b0b76d77b',
		address_line1: '210 KING ST STE 6100',
		address_city: 'SAN FRANCISCO',
		address_state: 'CA',
		address_zip: '94107-1741',
		address_country: 'UNITED STATES',
		object: 'address',
	},
	from: {
		id: 'adr_fa64eaa6b3f335',
		address_line1: '185 INDUSTRIAL PARKWAY RD',
		address_city: 'SAINT FRANCIS',
		address_state: 'MN',
		address_zip: '55070',
		address_country: 'UNITED STATES',
		object: 'address',
	},
	carrier: 'USPS',
	url: 'https://lob-assets.com/letters/ltr_489a2ce9d621bde.pdf?version=v1&expires=1619218302&signature=abc',
	extra_service: null,
	color: false,
	double_sided: true,
	address_placement: 'top_first_page',
	mail_type: 'usps_first_class',
	use_type: 'operational',
	tracking_events: [],
	date_created: '2026-02-12T18:44:36.399Z',
	date_modified: '2026-02-12T18:44:36.399Z',
	object: 'letter',
};

export const certifiedLetterOk = {
	...letterOk,
	id: 'ltr_certified9aa1',
	extra_service: 'certified',
	tracking_number: '9407100000000000000000',
	tracking_events: [
		{
			id: 'evt_5aa2c9b3bd9b6a8',
			date_created: '2026-02-13T12:00:00.000Z',
			name: 'In Transit to Next Facility',
			location: 'SAINT FRANCIS MN',
			object: 'tracking_event',
		},
	],
};

export const balanceOk = { balance: 42.5 };

export const unauthorized = {
	error: {
		message: 'Missing authentication',
		status_code: 401,
		code: 'unauthorized',
	},
};

export const rateLimited = {
	error: {
		message:
			'Rate limit exceeded. Please wait 5 seconds and try your request again.',
		status_code: 429,
		code: 'rate_limit_exceeded',
	},
};

// Each fixture parses through its schema here, so the fixtures and the output
// contracts cannot drift apart silently: a schema change that the real
// payload would fail now fails at import time.
// unknown: fixture bodies are arbitrary JSON until the schema narrows them.
function parsed<T extends z.ZodType>(schema: T, value: unknown): z.output<T> {
	return schema.parse(value);
}

export const fixtures = {
	usVerification: () => parsed(UsVerificationSchema, usVerificationOk),
	usRowErrorVerification: () =>
		parsed(UsVerificationSchema, usVerificationError),
	intlVerification: () => parsed(IntlVerificationSchema, intlVerificationOk),
	autocomplete: () => parsed(AutocompleteResponseSchema, autocompleteOk),
	zipLookup: () => parsed(ZipLookupResponseSchema, zipLookupOk),
	address: () => parsed(LobAddressSchema, addressOk),
	addressList: () => parsed(AddressListResponseSchema, addressListOk),
	postcard: () => parsed(LobPostcardSchema, postcardOk),
	letter: () => parsed(LobLetterSchema, letterOk),
	certifiedLetter: () => parsed(LobLetterSchema, certifiedLetterOk),
};
