import type {
	CompanyenrichEndpointInputs,
	CompanyenrichEndpointOutputs,
} from './endpoints/types';
import {
	CompanyExpandSchema,
	CompanyenrichEndpointInputSchemas,
	CompanyenrichEndpointOutputSchemas,
	CompanySearchFilterSchema,
	CompanySearchQuerySchema,
	PersonExpandSchema,
	PersonPastExperienceSearchFilterSchema,
} from './endpoints/types';
import { CompanyenrichSchema } from './schema';

const companyId = '00000000-0000-4000-8000-000000000001';
const companyResponse = {
	id: companyId,
	domain: 'example.com',
	website: 'https://example.com',
	logoUrl: 'https://example.com/logo.png',
	updatedAt: '2026-10-19T00:00:00.000Z',
};
const personResponse = { id: 101, socials: {}, experiences: [] };
const countryResponse = {
	code: 'US',
	name: 'United States',
	latitude: 38,
	longitude: -97,
};

const validInputs = {
	companiesGet: { companyId, expand: ['financial'] },
	companiesEnrichByDomain: { domain: 'example.com', waitForEnrichment: true },
	companiesEnrichByProperties: { name: 'Example Inc' },
	companiesEnrichBatch: { domains: ['example.com'] },
	companiesAutocomplete: { query: 'example' },
	companiesWorkforce: { id: companyId },
	companiesSearch: {
		pageSize: 10,
		filter: { domain: 'example.com' },
	},
	companiesSearchCount: { filter: { type: 'private' } },
	companiesSearchPreview: { lookalike: { domains: ['example.com'] } },
	peopleGet: { personId: 101, expand: ['education'] },
	peopleEnrich: { email: 'person@example.com' },
	peopleFindEmail: { personId: 101, domain: 'example.com' },
	peopleSearch: {
		pageSize: 10,
		filter: { position: 'Engineer' },
	},
	peopleSearchCount: { filter: { country: 'US' } },
	peopleSearchPreview: { filter: { position: 'Engineer' } },
	geoRegions: {},
	geoGetCountry: { countryCode: 'US' },
	geoSearchCountries: { query: 'United', pageSize: 10 },
	geoSearchStates: { countryCodes: ['US'], query: 'California' },
	geoSearchCities: { stateIds: [1], countryCodes: ['US'] },
	industriesList: {},
	keywordsAutocomplete: { query: 'technology' },
	technologiesAutocomplete: { query: 'react' },
	positionsAutocomplete: { query: 'engineer' },
	accountMe: {},
} satisfies CompanyenrichEndpointInputs;

const validOutputs = {
	companiesGet: companyResponse,
	companiesEnrichByDomain: companyResponse,
	companiesEnrichByProperties: companyResponse,
	companiesEnrichBatch: {
		items: [
			{ domain: 'example.com', status: 'found', company: companyResponse },
		],
	},
	companiesAutocomplete: {
		items: [
			{
				id: companyId,
				name: 'Example Inc',
				domain: 'example.com',
				logoUrl: 'https://example.com/logo.png',
			},
		],
	},
	companiesWorkforce: {
		companyId,
		domain: 'example.com',
		observedEmployeeCount: 10,
		departmentHeadcount: {},
		unclassifiedHeadcount: 0,
		historyFrom: '2025-01-01',
		historyTo: '2026-01-01',
		history: [],
	},
	companiesSearch: {
		items: [companyResponse],
		nextCursor: 'next-company-page',
	},
	companiesSearchCount: { count: 1, total: 1 },
	companiesSearchPreview: {
		items: [
			{
				id: companyId,
				logoUrl: 'https://example.com/logo.png',
				updatedAt: '2026-10-19T00:00:00.000Z',
			},
		],
		total: 1,
	},
	peopleGet: personResponse,
	peopleEnrich: personResponse,
	peopleFindEmail: {
		personId: 101,
		domain: 'example.com',
		status: 'found',
		email: 'person@example.com',
		certainty: 'high',
	},
	peopleSearch: { items: [personResponse], nextCursor: 'next-person-page' },
	peopleSearchCount: { count: 1, total: 1 },
	peopleSearchPreview: {
		items: [{ id: 101, experiences: [{ isCurrent: true }] }],
		total: 1,
	},
	geoRegions: {
		items: [
			{
				id: 'americas',
				name: 'Americas',
				parentId: null,
				countryCodes: ['US'],
			},
		],
	},
	geoGetCountry: countryResponse,
	geoSearchCountries: {
		items: [countryResponse],
		nextCursor: 'next-country-page',
	},
	geoSearchStates: {
		items: [{ id: 1, name: 'California', code: 'CA', countryCode: 'US' }],
		nextCursor: 'next-state-page',
	},
	geoSearchCities: {
		items: [{ id: 1, name: 'San Francisco', countryCode: 'US', stateId: 1 }],
		nextCursor: 'next-city-page',
	},
	industriesList: { items: [{ name: 'Technology', naicsCodes: ['54'] }] },
	keywordsAutocomplete: { items: ['technology'] },
	technologiesAutocomplete: { items: ['React'] },
	positionsAutocomplete: { items: ['Engineer'] },
	accountMe: {
		userId: '00000000-0000-4000-8000-000000000002',
		credits: { used: 0, total: 100 },
		capabilities: {
			lists: false,
			previews: true,
			companySearchLimit: 100,
			companySearchAsyncLimit: 0,
			peopleSearchLimit: 100,
			searchTermLimit: 250,
		},
	},
} satisfies CompanyenrichEndpointOutputs;

const inputCases = [
	[
		'companiesGet',
		CompanyenrichEndpointInputSchemas.companiesGet,
		validInputs.companiesGet,
	],
	[
		'companiesEnrichByDomain',
		CompanyenrichEndpointInputSchemas.companiesEnrichByDomain,
		validInputs.companiesEnrichByDomain,
	],
	[
		'companiesEnrichByProperties',
		CompanyenrichEndpointInputSchemas.companiesEnrichByProperties,
		validInputs.companiesEnrichByProperties,
	],
	[
		'companiesEnrichBatch',
		CompanyenrichEndpointInputSchemas.companiesEnrichBatch,
		validInputs.companiesEnrichBatch,
	],
	[
		'companiesAutocomplete',
		CompanyenrichEndpointInputSchemas.companiesAutocomplete,
		validInputs.companiesAutocomplete,
	],
	[
		'companiesWorkforce',
		CompanyenrichEndpointInputSchemas.companiesWorkforce,
		validInputs.companiesWorkforce,
	],
	[
		'companiesSearch',
		CompanyenrichEndpointInputSchemas.companiesSearch,
		validInputs.companiesSearch,
	],
	[
		'companiesSearchCount',
		CompanyenrichEndpointInputSchemas.companiesSearchCount,
		validInputs.companiesSearchCount,
	],
	[
		'companiesSearchPreview',
		CompanyenrichEndpointInputSchemas.companiesSearchPreview,
		validInputs.companiesSearchPreview,
	],
	[
		'peopleGet',
		CompanyenrichEndpointInputSchemas.peopleGet,
		validInputs.peopleGet,
	],
	[
		'peopleEnrich',
		CompanyenrichEndpointInputSchemas.peopleEnrich,
		validInputs.peopleEnrich,
	],
	[
		'peopleFindEmail',
		CompanyenrichEndpointInputSchemas.peopleFindEmail,
		validInputs.peopleFindEmail,
	],
	[
		'peopleSearch',
		CompanyenrichEndpointInputSchemas.peopleSearch,
		validInputs.peopleSearch,
	],
	[
		'peopleSearchCount',
		CompanyenrichEndpointInputSchemas.peopleSearchCount,
		validInputs.peopleSearchCount,
	],
	[
		'peopleSearchPreview',
		CompanyenrichEndpointInputSchemas.peopleSearchPreview,
		validInputs.peopleSearchPreview,
	],
	[
		'geoRegions',
		CompanyenrichEndpointInputSchemas.geoRegions,
		validInputs.geoRegions,
	],
	[
		'geoGetCountry',
		CompanyenrichEndpointInputSchemas.geoGetCountry,
		validInputs.geoGetCountry,
	],
	[
		'geoSearchCountries',
		CompanyenrichEndpointInputSchemas.geoSearchCountries,
		validInputs.geoSearchCountries,
	],
	[
		'geoSearchStates',
		CompanyenrichEndpointInputSchemas.geoSearchStates,
		validInputs.geoSearchStates,
	],
	[
		'geoSearchCities',
		CompanyenrichEndpointInputSchemas.geoSearchCities,
		validInputs.geoSearchCities,
	],
	[
		'industriesList',
		CompanyenrichEndpointInputSchemas.industriesList,
		validInputs.industriesList,
	],
	[
		'keywordsAutocomplete',
		CompanyenrichEndpointInputSchemas.keywordsAutocomplete,
		validInputs.keywordsAutocomplete,
	],
	[
		'technologiesAutocomplete',
		CompanyenrichEndpointInputSchemas.technologiesAutocomplete,
		validInputs.technologiesAutocomplete,
	],
	[
		'positionsAutocomplete',
		CompanyenrichEndpointInputSchemas.positionsAutocomplete,
		validInputs.positionsAutocomplete,
	],
	[
		'accountMe',
		CompanyenrichEndpointInputSchemas.accountMe,
		validInputs.accountMe,
	],
] as const;

const outputCases = [
	[
		'companiesGet',
		CompanyenrichEndpointOutputSchemas.companiesGet,
		validOutputs.companiesGet,
	],
	[
		'companiesEnrichByDomain',
		CompanyenrichEndpointOutputSchemas.companiesEnrichByDomain,
		validOutputs.companiesEnrichByDomain,
	],
	[
		'companiesEnrichByProperties',
		CompanyenrichEndpointOutputSchemas.companiesEnrichByProperties,
		validOutputs.companiesEnrichByProperties,
	],
	[
		'companiesEnrichBatch',
		CompanyenrichEndpointOutputSchemas.companiesEnrichBatch,
		validOutputs.companiesEnrichBatch,
	],
	[
		'companiesAutocomplete',
		CompanyenrichEndpointOutputSchemas.companiesAutocomplete,
		validOutputs.companiesAutocomplete,
	],
	[
		'companiesWorkforce',
		CompanyenrichEndpointOutputSchemas.companiesWorkforce,
		validOutputs.companiesWorkforce,
	],
	[
		'companiesSearch',
		CompanyenrichEndpointOutputSchemas.companiesSearch,
		validOutputs.companiesSearch,
	],
	[
		'companiesSearchCount',
		CompanyenrichEndpointOutputSchemas.companiesSearchCount,
		validOutputs.companiesSearchCount,
	],
	[
		'companiesSearchPreview',
		CompanyenrichEndpointOutputSchemas.companiesSearchPreview,
		validOutputs.companiesSearchPreview,
	],
	[
		'peopleGet',
		CompanyenrichEndpointOutputSchemas.peopleGet,
		validOutputs.peopleGet,
	],
	[
		'peopleEnrich',
		CompanyenrichEndpointOutputSchemas.peopleEnrich,
		validOutputs.peopleEnrich,
	],
	[
		'peopleFindEmail',
		CompanyenrichEndpointOutputSchemas.peopleFindEmail,
		validOutputs.peopleFindEmail,
	],
	[
		'peopleSearch',
		CompanyenrichEndpointOutputSchemas.peopleSearch,
		validOutputs.peopleSearch,
	],
	[
		'peopleSearchCount',
		CompanyenrichEndpointOutputSchemas.peopleSearchCount,
		validOutputs.peopleSearchCount,
	],
	[
		'peopleSearchPreview',
		CompanyenrichEndpointOutputSchemas.peopleSearchPreview,
		validOutputs.peopleSearchPreview,
	],
	[
		'geoRegions',
		CompanyenrichEndpointOutputSchemas.geoRegions,
		validOutputs.geoRegions,
	],
	[
		'geoGetCountry',
		CompanyenrichEndpointOutputSchemas.geoGetCountry,
		validOutputs.geoGetCountry,
	],
	[
		'geoSearchCountries',
		CompanyenrichEndpointOutputSchemas.geoSearchCountries,
		validOutputs.geoSearchCountries,
	],
	[
		'geoSearchStates',
		CompanyenrichEndpointOutputSchemas.geoSearchStates,
		validOutputs.geoSearchStates,
	],
	[
		'geoSearchCities',
		CompanyenrichEndpointOutputSchemas.geoSearchCities,
		validOutputs.geoSearchCities,
	],
	[
		'industriesList',
		CompanyenrichEndpointOutputSchemas.industriesList,
		validOutputs.industriesList,
	],
	[
		'keywordsAutocomplete',
		CompanyenrichEndpointOutputSchemas.keywordsAutocomplete,
		validOutputs.keywordsAutocomplete,
	],
	[
		'technologiesAutocomplete',
		CompanyenrichEndpointOutputSchemas.technologiesAutocomplete,
		validOutputs.technologiesAutocomplete,
	],
	[
		'positionsAutocomplete',
		CompanyenrichEndpointOutputSchemas.positionsAutocomplete,
		validOutputs.positionsAutocomplete,
	],
	[
		'accountMe',
		CompanyenrichEndpointOutputSchemas.accountMe,
		validOutputs.accountMe,
	],
] as const;

describe('Companyenrich schema', () => {
	it('declares a semver version and an empty entity map', () => {
		expect(CompanyenrichSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(CompanyenrichSchema.entities).toEqual({});
	});

	describe('endpoint input schemas', () => {
		it.each(inputCases)(
			'%s accepts a documented input and rejects null',
			(_name, schema, value) => {
				expect(schema.safeParse(value).success).toBe(true);
				expect(schema.safeParse(null).success).toBe(false);
			},
		);
	});

	describe('endpoint output schemas', () => {
		it.each(outputCases)(
			'%s accepts a documented response and rejects null',
			(_name, schema, value) => {
				expect(schema.safeParse(value).success).toBe(true);
				expect(schema.safeParse(null).success).toBe(false);
			},
		);
	});

	it('accepts fractional credit balances from account.me', () => {
		// ApiCreditV2Info documents used/total as doubles that include
		// fractional credits.
		expect(
			CompanyenrichEndpointOutputSchemas.accountMe.safeParse({
				...validOutputs.accountMe,
				credits: { used: 0.5, total: 100.25 },
			}).success,
		).toBe(true);
	});

	it('validates CompanyEnrich enum and UUID constraints', () => {
		expect(CompanyExpandSchema.safeParse('workforce').success).toBe(true);
		expect(CompanyExpandSchema.safeParse('employees').success).toBe(false);
		expect(PersonExpandSchema.safeParse('education').success).toBe(true);
		expect(PersonExpandSchema.safeParse('workforce').success).toBe(false);
		expect(
			CompanyenrichEndpointInputSchemas.companiesGet.safeParse({
				companyId: 'not-a-uuid',
			}).success,
		).toBe(false);
	});

	it('requires an identifying company property and a valid email address', () => {
		expect(
			CompanyenrichEndpointInputSchemas.companiesEnrichByProperties.safeParse(
				{},
			).success,
		).toBe(false);
		expect(
			CompanyenrichEndpointInputSchemas.peopleEnrich.safeParse({
				email: 'invalid',
			}).success,
		).toBe(false);
	});

	it('rejects incompatible search modes and empty advanced filters', () => {
		expect(
			CompanySearchQuerySchema.safeParse({
				semantic: { query: 'SaaS companies' },
				lookalike: { domains: ['example.com'] },
			}).success,
		).toBe(false);
		expect(CompanySearchFilterSchema.safeParse({ domain: {} }).success).toBe(
			false,
		);
		expect(
			CompanySearchQuerySchema.safeParse({
				filter: {
					query: null,
					country: null,
					foundedYear: { min: null, max: null },
				},
			}).success,
		).toBe(false);
	});

	it('does not expose unsupported past-experience exclusions', () => {
		expect(
			PersonPastExperienceSearchFilterSchema.safeParse({
				seniority: { notIn: ['intern'] },
			}).success,
		).toBe(false);
		expect(
			PersonPastExperienceSearchFilterSchema.safeParse({
				seniority: { in: ['senior'] },
			}).success,
		).toBe(true);
	});

	it('accepts local-business and enum values CompanyEnrich adds later in responses', () => {
		const company = {
			...companyResponse,
			type: 'cooperative',
			employees: '10K-50K',
			revenue: 'over-10b',
			categories: ['local-business', 'marketplace'],
		};
		expect(
			CompanyenrichEndpointOutputSchemas.companiesGet.safeParse(company)
				.success,
		).toBe(true);
		expect(
			CompanyenrichEndpointOutputSchemas.peopleGet.safeParse({
				...personResponse,
				seniority: 'staff',
				department: 'engineering-technical/quantum',
			}).success,
		).toBe(true);
		expect(
			CompanyenrichEndpointOutputSchemas.companiesEnrichBatch.safeParse({
				items: [{ domain: 'example.com', status: 'queued' }],
			}).success,
		).toBe(true);
		expect(
			CompanyenrichEndpointOutputSchemas.peopleFindEmail.safeParse({
				personId: 101,
				domain: 'example.com',
				status: 'found',
				email: 'person@example.com',
				certainty: 'low',
			}).success,
		).toBe(true);
		// Request filters stay strict, but take the documented local-business value.
		expect(
			CompanySearchFilterSchema.safeParse({ categories: 'local-business' })
				.success,
		).toBe(true);
		expect(
			CompanySearchFilterSchema.safeParse({ categories: 'marketplace' })
				.success,
		).toBe(false);
	});
});
