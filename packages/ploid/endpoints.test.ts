import {
	EnrichInputSchema,
	EnrichResponseSchema,
	PersonInputSchema,
	PersonOrRunResponseSchema,
	ResolveInputSchema,
	ResolveResponseSchema,
	SearchCandidatesInputSchema,
	SearchCandidatesResponseSchema,
	SearchInputSchema,
	SearchResponseSchema,
} from './endpoints/types';

describe('input bounds and enums', () => {
	it('accepts search num_results at 5000 and rejects 5001', () => {
		expect(() =>
			SearchInputSchema.parse({ query: 'founders', num_results: 5000 }),
		).not.toThrow();
		expect(() =>
			SearchInputSchema.parse({ query: 'founders', num_results: 5001 }),
		).toThrow();
	});

	it('rejects an unknown search type and an unsupported filter key', () => {
		expect(() =>
			SearchInputSchema.parse({ query: 'founders', type: 'thorough' }),
		).toThrow();
		// company_domain in filters returns 422 unsupported_filters.
		expect(() =>
			SearchInputSchema.parse({
				filters: { company_domain: 'acme.com' },
			}),
		).toThrow();
	});

	it('rejects condition-less filter objects before the wire', () => {
		// {} as the whole filters value: no query, no filter.
		expect(() => SearchInputSchema.parse({ filters: {} })).toThrow();
		// A filter key whose object carries no condition.
		expect(() => SearchInputSchema.parse({ filters: { title: {} } })).toThrow();
		expect(() =>
			SearchInputSchema.parse({ filters: { location: {} } }),
		).toThrow();
		expect(() =>
			SearchInputSchema.parse({ filters: { company_size: {} } }),
		).toThrow();
		expect(() =>
			SearchInputSchema.parse({
				filters: { company: { employee_count: {} } },
			}),
		).toThrow();
		// A single real condition is enough.
		expect(() =>
			SearchInputSchema.parse({
				filters: { title: { any_of: ['founder'] } },
			}),
		).not.toThrow();
		expect(() =>
			SearchInputSchema.parse({
				filters: { company_size: { min: 10 } },
			}),
		).not.toThrow();
	});

	it('caps criteria at five strings of 500 chars', () => {
		expect(() =>
			SearchInputSchema.parse({
				query: 'founders',
				criteria: Array.from({ length: 5 }, () => 'a'.repeat(500)),
			}),
		).not.toThrow();
		expect(() =>
			SearchInputSchema.parse({
				query: 'founders',
				criteria: Array.from({ length: 6 }, () => 'has raised funding'),
			}),
		).toThrow();
		expect(() =>
			SearchInputSchema.parse({
				query: 'founders',
				criteria: ['a'.repeat(501)],
			}),
		).toThrow();
	});

	it('bounds freshness to 365 days', () => {
		expect(() =>
			SearchInputSchema.parse({
				query: 'founders',
				freshness: { max_age_days: 365 },
			}),
		).not.toThrow();
		expect(() =>
			SearchInputSchema.parse({
				query: 'founders',
				freshness: { max_age_days: 366 },
			}),
		).toThrow();
	});

	it('accepts candidates limit at 10 and rejects 11 and short names', () => {
		expect(() =>
			SearchCandidatesInputSchema.parse({ name: 'Ann Li', limit: 10 }),
		).not.toThrow();
		expect(() =>
			SearchCandidatesInputSchema.parse({ name: 'Ann Li', limit: 11 }),
		).toThrow();
		expect(() => SearchCandidatesInputSchema.parse({ name: 'A' })).toThrow();
	});

	it('requires a resolve clue beyond the name', () => {
		expect(() =>
			ResolveInputSchema.parse({ name: 'Example Person', role: 'Founder' }),
		).not.toThrow();
		expect(() =>
			ResolveInputSchema.parse({ name: 'Example Person' }),
		).toThrow();
	});

	it('validates resolve phone and address shapes', () => {
		expect(() =>
			ResolveInputSchema.parse({
				name: 'Example Person',
				phone: '+1 (555) 010-0000',
			}),
		).not.toThrow();
		expect(() =>
			ResolveInputSchema.parse({ name: 'Example Person', phone: 'five' }),
		).toThrow();
		expect(() =>
			ResolveInputSchema.parse({ name: 'Example Person', address: 'x' }),
		).toThrow();
	});

	it('accepts exactly one person identifier and rejects mixing', () => {
		expect(() =>
			PersonInputSchema.parse({ identifier: { person_id: 'per_1' } }),
		).not.toThrow();
		expect(() =>
			PersonInputSchema.parse({
				identifier: { name: 'Example Person', company_domain: 'acme.com' },
			}),
		).not.toThrow();
		expect(() =>
			PersonInputSchema.parse({ identifier: { name: 'Example Person' } }),
		).toThrow();
		expect(() =>
			PersonInputSchema.parse({
				identifier: {
					person_id: 'per_1',
					linkedin_url: 'https://linkedin.com/in/example',
				},
			}),
		).toThrow();
	});

	it('bounds enrich fields to three unique values', () => {
		expect(() =>
			EnrichInputSchema.parse({
				identifier: { person_id: 'per_1' },
				fields: ['work_email', 'personal_email', 'phone'],
			}),
		).not.toThrow();
		expect(() =>
			EnrichInputSchema.parse({
				identifier: { person_id: 'per_1' },
				fields: ['work_email', 'work_email'],
			}),
		).toThrow();
	});

	it('rejects an enrich identifier with no match shape', () => {
		expect(() =>
			EnrichInputSchema.parse({
				identifier: { name: 'Example Person' },
				fields: ['phone'],
			}),
		).toThrow();
		expect(() =>
			EnrichInputSchema.parse({
				identifier: {
					linkedin_url: 'https://example.com/in/nope',
				},
				fields: ['phone'],
			}),
		).toThrow();
	});
});

describe('response shapes', () => {
	it('parses a search response with an empty results array', () => {
		const parsed = SearchResponseSchema.parse({
			data: {
				results: [],
				grounding: {
					status: 'complete',
					results: [],
					source_counts: {},
					provider_outcomes: {},
					search_time_ms: 5,
				},
				search_time_ms: 5,
				rows_indexed: 10,
				coverage: {
					has_more: false,
					candidates_seen: 10,
					candidates_checked: 2,
				},
				request: { query: 'x', category: 'people', num_results: 10 },
			},
			meta: { request_id: 'req_1' },
		});
		expect(parsed.data.results).toEqual([]);
	});

	it('parses a 202 People Set handoff', () => {
		const parsed = SearchResponseSchema.parse({
			data: {
				mode: 'async',
				set_id: 'set_1',
				search_id: 'sea_1',
				status: 'running',
				criteria: [],
				pricing: {},
				set_url: 'https://api.ploid.com/v1/sets/set_1',
				items_url: 'https://api.ploid.com/v1/sets/set_1/items',
				events_url: 'https://api.ploid.com/v1/sets/set_1/events',
				request: { query: 'x', category: 'people', num_results: 500 },
			},
			meta: { request_id: 'req_2' },
		});
		expect(parsed.data.mode).toBe('async');
	});

	it('parses a zero-match candidates response', () => {
		const parsed = SearchCandidatesResponseSchema.parse({
			data: {
				source: 'ploid_people_index',
				matches: [],
				returned: 0,
				limit: 5,
				usage: { acu_used: 1 },
			},
			meta: {
				request_id: 'req_3',
				usage: {
					acu_used: 1,
					billed: ['candidate_preview'],
					free: [],
					not_found: [],
				},
			},
		});
		expect(parsed.data.returned).toBe(0);
	});

	it('parses a no-match resolve as data, not an error', () => {
		const parsed = ResolveResponseSchema.parse({
			data: {
				found: false,
				person: null,
				confidence: 0,
				summary: 'No match.',
				sources: [],
			},
			meta: { request_id: 'req_4', credits_charged: 0 },
		});
		expect(parsed.data.found).toBe(false);
		expect(parsed.data.person).toBeNull();
	});

	it('parses a person 202 run and a person 200 unsure null profile', () => {
		const run = PersonOrRunResponseSchema.parse({
			data: { run_id: 'run_1', status: 'queued' },
			meta: { request_id: 'req_5' },
		});
		expect(run.data).toMatchObject({ run_id: 'run_1', status: 'queued' });

		const unsure = PersonOrRunResponseSchema.parse({
			data: null,
			meta: {
				request_id: 'req_6',
				resolution: 'unsure',
				reason: 'ambiguous_identity',
			},
		});
		expect(unsure.data).toBeNull();
	});

	it('parses an enrich response with every field status', () => {
		const parsed = EnrichResponseSchema.parse({
			data: {
				work_email: {
					value: 'example@acme.com',
					status: 'found',
					confidence: 'strong',
					source: 'public_web',
					last_seen: '2026-01-01T00:00:00Z',
				},
				personal_email: {
					value: null,
					status: 'not_found',
					confidence: null,
					source: null,
					last_seen: null,
				},
				phone: {
					value: null,
					status: 'unavailable',
					confidence: null,
					source: null,
					last_seen: null,
				},
			},
			meta: {
				request_id: 'req_7',
				warnings: [],
				usage: {
					acu_used: 1,
					acu_remaining: 49,
					acu_value_usd: 0.1,
					billed: ['work_email'],
					free: [],
					not_found: ['personal_email'],
				},
			},
		});
		expect(parsed.data.work_email?.status).toBe('found');
		expect(parsed.data.phone?.status).toBe('unavailable');
	});

	it('keeps vendor-added response fields', () => {
		const parsed = ResolveResponseSchema.parse({
			data: {
				found: true,
				person: { person_id: 'per_1', name: 'Example', future_field: { a: 1 } },
				confidence: 0.5,
				another_new_field: true,
			},
			meta: { request_id: 'req_8' },
		});
		expect(parsed.data.another_new_field).toBe(true);
	});
});
