import {
	WizaEndpointInputSchemas,
	WizaEndpointOutputSchemas,
} from './endpoints/types';
import { WizaSchema } from './schema';

describe('Wiza schema', () => {
	it('declares a semver version and entities', () => {
		expect(WizaSchema.version).toMatch(/^\d+\.\d+\.\d+$/);
		expect(Object.keys(WizaSchema.entities)).toEqual(
			expect.arrayContaining(['reveals', 'lists', 'prospects']),
		);
	});
});

describe('Wiza endpoint input schemas', () => {
	it('accepts an empty credits input', () => {
		expect(WizaEndpointInputSchemas.creditsGet.safeParse({}).success).toBe(
			true,
		);
	});

	it('accepts a reveal by linkedin profile url', () => {
		const result = WizaEndpointInputSchemas.individualRevealsStart.safeParse({
			individual_reveal: {
				profile_url: 'https://www.linkedin.com/in/satyanadella',
			},
			enrichment_level: 'partial',
		});
		expect(result.success).toBe(true);
	});

	it('accepts a reveal by name and company', () => {
		const result = WizaEndpointInputSchemas.individualRevealsStart.safeParse({
			individual_reveal: { full_name: 'Jane Doe', company: 'Acme' },
			enrichment_level: 'full',
			email_options: { accept_work: true },
		});
		expect(result.success).toBe(true);
	});

	it('rejects a reveal without any identifier', () => {
		const result = WizaEndpointInputSchemas.individualRevealsStart.safeParse({
			individual_reveal: { company: 'Acme' },
			enrichment_level: 'partial',
		});
		expect(result.success).toBe(false);
	});

	it('rejects an invalid enrichment level', () => {
		const result = WizaEndpointInputSchemas.individualRevealsStart.safeParse({
			individual_reveal: { email: 'jane@acme.com' },
			enrichment_level: 'everything',
		});
		expect(result.success).toBe(false);
	});

	it('accepts string and number ids for reveals and lists', () => {
		expect(
			WizaEndpointInputSchemas.individualRevealsGet.safeParse({ id: 42 })
				.success,
		).toBe(true);
		expect(
			WizaEndpointInputSchemas.listsGet.safeParse({ id: 'lst_1' }).success,
		).toBe(true);
	});

	it('accepts prospect search filters and caps size at 30', () => {
		const ok = WizaEndpointInputSchemas.prospectsSearch.safeParse({
			size: 5,
			filters: {
				job_title: [{ v: 'VP of Sales', s: 'i' }],
				location: [{ v: 'San Francisco', b: 'city' }],
			},
		});
		expect(ok.success).toBe(true);
		const tooBig = WizaEndpointInputSchemas.prospectsSearch.safeParse({
			size: 50,
			filters: {},
		});
		expect(tooBig.success).toBe(false);
	});
});

describe('Wiza endpoint output schemas', () => {
	it('parses a credits response with unlimited emails', () => {
		const result = WizaEndpointOutputSchemas.creditsGet.safeParse({
			credits: {
				email_credits: 'unlimited',
				phone_credits: 100,
				export_credits: 0,
				api_credits: 100,
			},
		});
		expect(result.success).toBe(true);
	});

	it('parses a started reveal response', () => {
		const result = WizaEndpointOutputSchemas.individualRevealsStart.safeParse({
			status: { code: 200, message: '' },
			type: 'individual_reveal',
			data: { id: 7, status: 'queued', is_complete: false },
		});
		expect(result.success).toBe(true);
	});

	it('parses a finished reveal with contact data', () => {
		const result = WizaEndpointOutputSchemas.individualRevealsGet.safeParse({
			status: { code: 200 },
			type: 'individual_reveal',
			data: {
				id: 7,
				status: 'finished',
				is_complete: true,
				name: 'Jane Doe',
				email: 'jane@acme.com',
				email_status: 'valid',
				emails: [{ email: 'jane@acme.com', email_status: 'valid' }],
				phones: [{ number: '+15550000000', type: 'mobile' }],
			},
		});
		expect(result.success).toBe(true);
	});

	it('rejects a reveal response with an unknown status', () => {
		const result = WizaEndpointOutputSchemas.individualRevealsGet.safeParse({
			status: { code: 200 },
			data: { id: 7, status: 'exploded', is_complete: false },
		});
		expect(result.success).toBe(false);
	});

	it('parses a list response', () => {
		const result = WizaEndpointOutputSchemas.listsGet.safeParse({
			status: { code: 200 },
			type: 'list',
			data: {
				id: 15,
				name: 'VP of Sales in San Francisco',
				status: 'queued',
				created_at: '2024-01-01T00:00:00Z',
				finished_at: null,
				enrichment_level: 'partial',
			},
		});
		expect(result.success).toBe(true);
	});

	it('parses a prospect search response', () => {
		const result = WizaEndpointOutputSchemas.prospectsSearch.safeParse({
			status: { code: 200 },
			data: {
				total: 8210,
				profiles: [
					{
						full_name: 'Jane Doe',
						linkedin_url: 'linkedin.com/in/janedoe',
						job_title: 'VP of Sales',
						job_company_name: 'Acme',
						location_name: 'san francisco, california, united states',
					},
				],
			},
		});
		expect(result.success).toBe(true);
	});
});
