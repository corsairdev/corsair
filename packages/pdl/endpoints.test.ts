import type { z } from 'zod';
import type { PdlEndpointInputs } from './endpoints/types';
import {
	PdlEndpointInputSchemas,
	PdlEndpointOutputSchemas,
} from './endpoints/types';

const inputs = PdlEndpointInputSchemas;
const outputs = PdlEndpointOutputSchemas;

type AnySchema = z.ZodTypeAny;

function accepts(schema: AnySchema, value: unknown): boolean {
	return schema.safeParse(value).success;
}

describe('person.enrich input', () => {
	it('accepts the documented fields', () => {
		expect(
			accepts(inputs.personEnrich, {
				pdl_id: 'person_abc',
				first_name: 'grace',
				middle_name: 'brewster',
				last_name: 'hopper',
				location: 'new york',
				street_address: '1 boardwalk',
				locality: 'new york city',
				region: 'new york',
				country: 'us',
				postal_code: '10001',
				company: 'us navy',
				school: 'vassar college',
				phone: '+14155550100',
				email: 'grace@navy.mil',
				email_hash: 'abc123',
				profile: 'linkedin.com/in/gracehopper',
				lid: '145691313',
				birth_date: '1906-12',
				min_likelihood: 8,
				include_if_matched: true,
				required: ['job_company_name', 'skills'],
				data_include: ['names', 'emails'],
				titlecase: true,
				pretty: true,
			}),
		).toBe(true);
	});

	it('accepts each direct key on its own', () => {
		expect(accepts(inputs.personEnrich, { profile: 'linkedin.com/in/g' })).toBe(
			true,
		);
		expect(accepts(inputs.personEnrich, { email: 'g@navy.mil' })).toBe(true);
		expect(accepts(inputs.personEnrich, { phone: '+14155550100' })).toBe(true);
		expect(accepts(inputs.personEnrich, { email_hash: 'abc' })).toBe(true);
		expect(accepts(inputs.personEnrich, { lid: '145691313' })).toBe(true);
	});

	it('accepts a name plus one context field', () => {
		expect(
			accepts(inputs.personEnrich, {
				name: 'grace hopper',
				company: 'us navy',
			}),
		).toBe(true);
		expect(
			accepts(inputs.personEnrich, {
				first_name: 'grace',
				last_name: 'hopper',
				school: 'vassar college',
			}),
		).toBe(true);
		expect(
			accepts(inputs.personEnrich, {
				name: 'grace hopper',
				locality: 'new york city',
			}),
		).toBe(true);
	});

	it('rejects calls below the documented minimum', () => {
		expect(accepts(inputs.personEnrich, {})).toBe(false);
		expect(accepts(inputs.personEnrich, { name: 'grace hopper' })).toBe(false);
		expect(
			accepts(inputs.personEnrich, {
				first_name: 'grace',
				last_name: 'hopper',
			}),
		).toBe(false);
		expect(accepts(inputs.personEnrich, { company: 'us navy' })).toBe(false);
	});

	it('rejects a phone without the leading +', () => {
		expect(
			accepts(inputs.personEnrich, {
				phone: '14155550100',
				email: 'g@navy.mil',
			}),
		).toBe(false);
	});

	it('rejects min_likelihood outside 1-10 and unknown keys', () => {
		expect(
			accepts(inputs.personEnrich, {
				profile: 'linkedin.com/in/g',
				min_likelihood: 0,
			}),
		).toBe(false);
		expect(
			accepts(inputs.personEnrich, {
				profile: 'linkedin.com/in/g',
				min_likelihood: 11,
			}),
		).toBe(false);
		expect(
			accepts(inputs.personEnrich, {
				profile: 'linkedin.com/in/g',
				from: 'x',
			}),
		).toBe(false);
	});
});

describe('person.search input', () => {
	it('accepts a query or sql with the paging params', () => {
		expect(
			accepts(inputs.personSearch, {
				query: {
					bool: {
						must: [{ term: { location_country: 'mexico' } }],
					},
				},
				size: 10,
			}),
		).toBe(true);
		expect(
			accepts(inputs.personSearch, {
				sql: 'SELECT * FROM person WHERE location_country=?',
				scroll_token: 'abc',
				titlecase: true,
				pretty: true,
			}),
		).toBe(true);
	});

	it('requires exactly one of query and sql', () => {
		expect(accepts(inputs.personSearch, {})).toBe(false);
		expect(
			accepts(inputs.personSearch, {
				query: { match_all: {} },
				sql: 'SELECT * FROM person',
			}),
		).toBe(false);
	});

	it('bounds size to 1-100', () => {
		expect(
			accepts(inputs.personSearch, { query: { match_all: {} }, size: 1 }),
		).toBe(true);
		expect(
			accepts(inputs.personSearch, { query: { match_all: {} }, size: 100 }),
		).toBe(true);
		expect(
			accepts(inputs.personSearch, { query: { match_all: {} }, size: 0 }),
		).toBe(false);
		expect(
			accepts(inputs.personSearch, { query: { match_all: {} }, size: 101 }),
		).toBe(false);
	});

	it('validates the dataset list, including - prefixed exclusions', () => {
		expect(
			accepts(inputs.personSearch, {
				query: { match_all: {} },
				dataset: 'all',
			}),
		).toBe(true);
		expect(
			accepts(inputs.personSearch, {
				query: { match_all: {} },
				dataset: 'phone,mobile_phone,-resume',
			}),
		).toBe(true);
		expect(
			accepts(inputs.personSearch, {
				query: { match_all: {} },
				dataset: '-email',
			}),
		).toBe(true);
		expect(
			accepts(inputs.personSearch, {
				query: { match_all: {} },
				dataset: 'banana',
			}),
		).toBe(false);
		expect(
			accepts(inputs.personSearch, {
				query: { match_all: {} },
				dataset: 'phone,',
			}),
		).toBe(false);
	});
});

describe('person.identify input', () => {
	it('takes the same identity fields plus the identify controls', () => {
		expect(
			accepts(inputs.personIdentify, {
				name: 'grace hopper',
				company: 'us navy',
				include_if_matched: true,
				pretty: true,
			}),
		).toBe(true);
	});

	it('has no client-side minimum gate (PDL answers 400 itself)', () => {
		expect(accepts(inputs.personIdentify, {})).toBe(true);
	});
});

describe('person.bulk input', () => {
	const item = { params: { profile: 'linkedin.com/in/a' } };

	it('accepts 1 to 100 requests with optional controls', () => {
		expect(
			accepts(inputs.personBulk, {
				requests: [item],
				required: ['job_company_name'],
				include_if_matched: true,
			}),
		).toBe(true);
		expect(
			accepts(inputs.personBulk, {
				requests: Array.from({ length: 100 }, () => ({ ...item })),
			}),
		).toBe(true);
	});

	it('rejects 0 and 101 requests', () => {
		expect(accepts(inputs.personBulk, { requests: [] })).toBe(false);
		expect(
			accepts(inputs.personBulk, {
				requests: Array.from({ length: 101 }, () => ({ ...item })),
			}),
		).toBe(false);
	});

	it('rejects items with unknown keys', () => {
		expect(
			accepts(inputs.personBulk, {
				requests: [{ params: { profile: 'x' }, extra: true }],
			}),
		).toBe(false);
	});
});

describe('company.enrich input', () => {
	it('accepts the documented fields', () => {
		expect(
			accepts(inputs.companyEnrich, {
				pdl_id: 'co_9',
				name: 'people data labs',
				profile: 'linkedin.com/company/pdl',
				ticker: 'PDL',
				website: 'peopledatalabs.com',
				locality: 'portland',
				region: 'oregon',
				country: 'us',
				postal_code: '97205',
				street_address: '555 main st',
				location: 'portland, oregon',
				min_likelihood: 5,
				include_if_matched: false,
				required: ['tags'],
				data_include: ['website'],
				titlecase: true,
				pretty: true,
			}),
		).toBe(true);
	});

	it('requires one of name, ticker, website, profile', () => {
		expect(accepts(inputs.companyEnrich, {})).toBe(false);
		expect(accepts(inputs.companyEnrich, { country: 'us' })).toBe(false);
		expect(accepts(inputs.companyEnrich, { ticker: 'PDL' })).toBe(true);
		expect(accepts(inputs.companyEnrich, { name: 'pdl' })).toBe(true);
	});
});

describe('company.search input', () => {
	it('accepts query or sql and paging, but no dataset', () => {
		expect(
			accepts(inputs.companySearch, {
				query: { term: { tags: 'mobile' } },
			}),
		).toBe(true);
		expect(
			accepts(inputs.companySearch, { sql: 'SELECT * FROM company' }),
		).toBe(true);
		expect(
			accepts(inputs.companySearch, {
				query: { term: { tags: 'mobile' } },
				dataset: 'all',
			}),
		).toBe(false);
		expect(accepts(inputs.companySearch, {})).toBe(false);
	});
});

describe('job.search input', () => {
	it('accepts the documented structured filters', () => {
		expect(
			accepts(inputs.jobSearch, {
				id: 'job_1',
				title: 'software engineer',
				company_website: 'peopledatalabs.com',
				location: 'portland, oregon',
				salary_range_min: 120_000,
				salary_range_max: 180_000,
				remote_work_policy: 'full',
				inferred_skills: 'python',
				is_active: true,
				size: 50,
				scroll_token: 'abc',
				pretty: true,
			}),
		).toBe(true);
	});

	it('requires exactly one of the filters or a raw query', () => {
		expect(
			accepts(inputs.jobSearch, {
				title: 'engineer',
				query: { term: { title: 'engineer' } },
			}),
		).toBe(false);
		expect(accepts(inputs.jobSearch, {})).toBe(false);
		expect(accepts(inputs.jobSearch, { size: 10 })).toBe(false);
		expect(
			accepts(inputs.jobSearch, {
				query: { term: { title: 'engineer' } },
			}),
		).toBe(true);
	});

	it('types the filters strictly', () => {
		expect(accepts(inputs.jobSearch, { is_active: 'yes' })).toBe(false);
		expect(accepts(inputs.jobSearch, { salary_range_min: '120000' })).toBe(
			false,
		);
	});
});

describe('ip.enrich input', () => {
	it('accepts ipv4 and ipv6 addresses with the return flags', () => {
		expect(
			accepts(inputs.ipEnrich, {
				ip: '174.110.144.98',
				return_ip_location: true,
				return_ip_metadata: true,
				return_if_unmatched: false,
				return_person: true,
				min_confidence: 'very high',
				pretty: true,
				titlecase: true,
			}),
		).toBe(true);
		expect(accepts(inputs.ipEnrich, { ip: '2606:4700::6810:85e5' })).toBe(true);
	});

	it('rejects malformed addresses and unknown confidences', () => {
		expect(accepts(inputs.ipEnrich, { ip: 'not-an-ip' })).toBe(false);
		expect(accepts(inputs.ipEnrich, { ip: '999.999.999.999' })).toBe(false);
		expect(
			accepts(inputs.ipEnrich, { ip: '174.110.144.98', min_confidence: 'max' }),
		).toBe(false);
	});
});

describe('autocomplete input', () => {
	it('accepts the documented params with text defaulting to empty', () => {
		const parsed = inputs.autocomplete.parse({ field: 'job_title' });
		expect(parsed.text).toBe('');
		expect(
			accepts(inputs.autocomplete, {
				field: 'school',
				text: 'har',
				size: 10,
				titlecase: true,
				pretty: true,
			}),
		).toBe(true);
	});

	it('typechecks an input that omits the defaulted text', () => {
		const input: PdlEndpointInputs['autocomplete'] = { field: 'job_title' };
		expect(inputs.autocomplete.parse(input)).toEqual({
			field: 'job_title',
			text: '',
		});
	});

	it('requires a field and bounds size', () => {
		expect(accepts(inputs.autocomplete, {})).toBe(false);
		expect(accepts(inputs.autocomplete, { field: 'job_title', size: 0 })).toBe(
			false,
		);
		expect(
			accepts(inputs.autocomplete, { field: 'job_title', size: 101 }),
		).toBe(false);
	});
});

describe('cleaner inputs', () => {
	it('company and school take one of name, website, profile', () => {
		expect(accepts(inputs.companyClean, {})).toBe(false);
		expect(
			accepts(inputs.companyClean, { website: 'www.peopledatalabs.com' }),
		).toBe(true);
		expect(accepts(inputs.schoolClean, { name: 'harverd' })).toBe(true);
		expect(
			accepts(inputs.schoolClean, {
				profile: 'linkedin.com/school/harvard-university',
			}),
		).toBe(true);
	});

	it('location takes a required location string', () => {
		expect(accepts(inputs.locationClean, {})).toBe(false);
		expect(accepts(inputs.locationClean, { location: 'san fransisco' })).toBe(
			true,
		);
	});
});

describe('output schemas', () => {
	it('parses the person.enrich success envelope', () => {
		const parsed = outputs.personEnrich.parse({
			found: true,
			status: 200,
			likelihood: 7,
			data: { pdl_id: 'person_abc', full_name: 'grace hopper' },
		});
		expect(parsed).toMatchObject({
			found: true,
			likelihood: 7,
			data: { pdl_id: 'person_abc' },
		});
	});

	it('rejects a person.enrich success with likelihood outside 1-10', () => {
		expect(
			accepts(outputs.personEnrich, {
				found: true,
				status: 200,
				likelihood: 11,
				data: {},
			}),
		).toBe(false);
	});

	it('accepts the no-match result and requires found on every branch', () => {
		expect(accepts(outputs.personEnrich, { found: false })).toBe(true);
		expect(accepts(outputs.personEnrich, { status: 200 })).toBe(false);
	});

	it('bounds identify match_score to 1-99', () => {
		expect(
			accepts(outputs.personIdentify, {
				found: true,
				status: 200,
				matches: [{ match_score: 99, data: [{}] }],
			}),
		).toBe(true);
		expect(
			accepts(outputs.personIdentify, {
				found: true,
				status: 200,
				matches: [{ match_score: 100, data: [{}] }],
			}),
		).toBe(false);
		expect(
			accepts(outputs.personIdentify, {
				found: true,
				status: 200,
				matches: [{ match_score: 0, data: [{}] }],
			}),
		).toBe(false);
	});

	it('keeps company.enrich flat fields under company', () => {
		const parsed = outputs.companyEnrich.parse({
			found: true,
			status: 200,
			likelihood: 9,
			company: { id: 'co_9', name: 'people data labs' },
		});
		expect(parsed).toMatchObject({
			company: { name: 'people data labs' },
		});
	});

	it('parses search pages with an optional scroll_token', () => {
		expect(
			outputs.personSearch.parse({
				status: 200,
				data: [],
				total: 0,
			}),
		).toMatchObject({ total: 0 });
		expect(
			outputs.personSearch.safeParse({ status: 200, data: [], total: -1 })
				.success,
		).toBe(false);
	});

	it('parses job pages with a numeric or string dataset_version', () => {
		expect(
			outputs.jobSearch.parse({
				status: 200,
				data: [{ title: 'engineer' }],
				total: 1,
				scroll_token: 'abc',
				dataset_version: 34,
			}),
		).toMatchObject({ dataset_version: 34 });
		expect(
			outputs.jobSearch.safeParse({
				status: 200,
				data: [],
				total: 0,
				dataset_version: '34.0',
			}).success,
		).toBe(true);
	});

	it('parses the bulk response array with failed items inline', () => {
		const parsed = outputs.personBulk.parse([
			{ status: 200, likelihood: 6, data: { pdl_id: 'p1' } },
			{ status: 400 },
		]);
		expect(parsed[1]).toEqual({ status: 400 });
	});

	it('parses the ip.enrich composite and its no-match result', () => {
		const parsed = outputs.ipEnrich.parse({
			found: true,
			status: 200,
			data: {
				ip: { address: '174.110.144.98' },
				company: { confidence: 'very high' },
			},
			dataset_version: '12.0',
		});
		expect(parsed).toMatchObject({
			data: { company: { confidence: 'very high' } },
		});
		expect(accepts(outputs.ipEnrich, { found: false })).toBe(true);
	});

	it('keeps cleaner extras beside an optional status', () => {
		const parsed = outputs.companyClean.parse({
			status: 200,
			name: 'people data labs',
		});
		expect(parsed.name).toBe('people data labs');
		expect(accepts(outputs.locationClean, { name: 'san francisco' })).toBe(
			true,
		);
	});
});
