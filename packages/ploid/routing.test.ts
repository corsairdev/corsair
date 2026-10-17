import { logEventFromContext } from 'corsair/core';
import { makePloidRequest } from './client';
import { Account, Contacts, Person, Search } from './endpoints';
import { rememberPerson } from './endpoints/cache';
import type { Person as PersonRow } from './schema/database';

jest.mock('corsair/core', () => ({
	logEventFromContext: jest.fn().mockResolvedValue(undefined),
	AuthMissingError: class AuthMissingError extends Error {},
}));

jest.mock('./client', () => {
	// jest.requireActual is typed as any. The module's own type is the real export.
	const actual = jest.requireActual('./client') as typeof import('./client');
	return {
		...actual,
		makePloidRequest: jest.fn(),
	};
});

const mockRequest = jest.mocked(makePloidRequest);
const mockLog = jest.mocked(logEventFromContext);

// unknown: tests call endpoints with a stub context, not the full plugin context.
type AnyEndpoint = (ctx: unknown, input: unknown) => Promise<unknown>;

function createContext() {
	return {
		key: 'test-key',
		options: { baseUrl: 'https://api.ploid.com' },
		$getAccountId: async () => 'account-1',
		db: {
			people: {
				findByEntityId: jest.fn().mockResolvedValue(null),
				upsertByEntityId: jest.fn().mockResolvedValue(undefined),
				deleteByEntityId: jest.fn().mockResolvedValue(true),
			},
		},
	};
}

const searchResponse = {
	data: {
		results: [
			{
				url: 'https://linkedin.com/in/example',
				title: 'Example at Acme',
				score: 0.9,
				person: { person_id: 'per_1', name: 'Example Person' },
			},
		],
		grounding: { status: 'not_needed' },
		search_time_ms: 12,
		rows_indexed: 1000,
		coverage: { has_more: false, candidates_seen: 10, candidates_checked: 0 },
		request: {
			query: 'founders in berlin',
			category: 'people',
			num_results: 10,
		},
	},
	meta: { request_id: 'req_1' },
};

const resolveResponse = {
	data: {
		found: true,
		person: {
			person_id: 'per_1',
			name: 'Example Person',
			headline: 'Founder at Acme',
			company: 'Acme',
			location: 'Berlin',
			profiles: { linkedin: 'https://linkedin.com/in/example' },
			identity_verified: false,
		},
		confidence: 0.87,
		summary: 'Likely the Acme founder.',
		sources: ['https://acme.com'],
	},
	meta: { request_id: 'req_2' },
};

const personRunResponse = {
	data: {
		run_id: 'run_1',
		status: 'queued',
		poll_url: '/v1/person/runs/run_1',
	},
	meta: { request_id: 'req_3' },
};

// A completed research run answers with the reviewed profile.
const personProfileResponse = {
	data: {
		person_id: 'per_1',
		summary: 'Founder of Acme.',
		identity: {
			name: 'Example Person',
			linkedin_url: 'https://linkedin.com/in/example',
			headline: 'Founder',
			company: 'Acme',
			location: 'Berlin',
			confidence: 0.93,
		},
	},
	meta: { request_id: 'req_7' },
};

describe('Ploid endpoint routing', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('search.search posts the query to /v1/search', async () => {
		mockRequest.mockResolvedValue(searchResponse);
		const ctx = createContext();

		const result = await (Search.search as AnyEndpoint)(ctx, {
			query: 'founders in berlin',
			num_results: 10,
		});

		expect(result).toMatchObject({
			data: { results: [{ person: { person_id: 'per_1' } }] },
		});
		expect(mockRequest).toHaveBeenCalledWith('/v1/search', 'test-key', {
			method: 'POST',
			body: { query: 'founders in berlin', num_results: 10 },
			baseUrl: 'https://api.ploid.com',
		});
	});

	it('search.search rejects a request with neither query nor filters', async () => {
		const ctx = createContext();

		await expect(
			(Search.search as AnyEndpoint)(ctx, { num_results: 10 }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('search.search accepts filters without a query', async () => {
		mockRequest.mockResolvedValue(searchResponse);
		const ctx = createContext();

		await (Search.search as AnyEndpoint)(ctx, {
			filters: { title: 'founder', location: { cities: ['Berlin'] } },
		});

		expect(mockRequest).toHaveBeenCalledWith('/v1/search', 'test-key', {
			method: 'POST',
			body: { filters: { title: 'founder', location: { cities: ['Berlin'] } } },
			baseUrl: 'https://api.ploid.com',
		});
	});

	it('search.candidates posts the name and filters to /v1/search/candidates', async () => {
		mockRequest.mockResolvedValue({
			data: {
				matches: [{ person_id: 'per_1', name: 'Example Person' }],
				returned: 1,
			},
			meta: { request_id: 'req_4' },
		});
		const ctx = createContext();

		await (Search.candidates as AnyEndpoint)(ctx, {
			name: 'Example Person',
			company: 'Acme',
			limit: 3,
		});

		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/search/candidates',
			'test-key',
			{
				method: 'POST',
				body: { name: 'Example Person', company: 'Acme', limit: 3 },
				baseUrl: 'https://api.ploid.com',
			},
		);
	});

	it('search.candidates rejects a limit above 10', async () => {
		const ctx = createContext();

		await expect(
			(Search.candidates as AnyEndpoint)(ctx, {
				name: 'Example Person',
				limit: 11,
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('person.resolve posts name plus clue to /v1/resolve and caches the person', async () => {
		mockRequest.mockResolvedValue(resolveResponse);
		const ctx = createContext();

		await (Person.resolve as AnyEndpoint)(ctx, {
			name: 'Example Person',
			company: 'Acme',
		});

		expect(mockRequest).toHaveBeenCalledWith('/v1/resolve', 'test-key', {
			method: 'POST',
			body: { name: 'Example Person', company: 'Acme' },
			baseUrl: 'https://api.ploid.com',
		});
		expect(ctx.db.people.upsertByEntityId).toHaveBeenCalledWith(
			'per_1',
			expect.objectContaining({
				personId: 'per_1',
				name: 'Example Person',
				company: 'Acme',
				linkedinUrl: 'https://linkedin.com/in/example',
			}),
		);
	});

	it('person.resolve rejects a name with no clue', async () => {
		const ctx = createContext();

		await expect(
			(Person.resolve as AnyEndpoint)(ctx, { name: 'Example Person' }),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('person.get posts the identifier to /v1/person', async () => {
		mockRequest.mockResolvedValue(personRunResponse);
		const ctx = createContext();

		await (Person.get as AnyEndpoint)(ctx, {
			identifier: { linkedin_url: 'https://linkedin.com/in/example' },
		});

		expect(mockRequest).toHaveBeenCalledWith('/v1/person', 'test-key', {
			method: 'POST',
			body: { identifier: { linkedin_url: 'https://linkedin.com/in/example' } },
			baseUrl: 'https://api.ploid.com',
		});
	});

	it('person.getRun polls the run path', async () => {
		mockRequest.mockResolvedValue(personRunResponse);
		const ctx = createContext();

		await (Person.getRun as AnyEndpoint)(ctx, { id: 'run_1' });

		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/person/runs/{id}',
			'test-key',
			{
				method: 'GET',
				path: { id: 'run_1' },
				baseUrl: 'https://api.ploid.com',
			},
		);
	});

	it('person.get returns and caches a populated profile', async () => {
		mockRequest.mockResolvedValue(personProfileResponse);
		const ctx = createContext();

		const result = await (Person.get as AnyEndpoint)(ctx, {
			identifier: { person_id: 'per_1' },
		});

		expect(result).toMatchObject({
			data: {
				person_id: 'per_1',
				identity: { name: 'Example Person', company: 'Acme' },
			},
		});
		expect(ctx.db.people.upsertByEntityId).toHaveBeenCalledWith(
			'per_1',
			expect.objectContaining({
				personId: 'per_1',
				name: 'Example Person',
				company: 'Acme',
				linkedinUrl: 'https://linkedin.com/in/example',
			}),
		);
	});

	it('person.getRun returns and caches the profile once the run finishes', async () => {
		mockRequest.mockResolvedValue(personProfileResponse);
		const ctx = createContext();

		const result = await (Person.getRun as AnyEndpoint)(ctx, { id: 'run_1' });

		expect(result).toMatchObject({
			data: { person_id: 'per_1', identity: { name: 'Example Person' } },
		});
		expect(ctx.db.people.upsertByEntityId).toHaveBeenCalledWith(
			'per_1',
			expect.objectContaining({ personId: 'per_1', name: 'Example Person' }),
		);
	});

	it('person.cancelRun deletes the run path', async () => {
		mockRequest.mockResolvedValue(personRunResponse);
		const ctx = createContext();

		await (Person.cancelRun as AnyEndpoint)(ctx, { id: 'run_1' });

		expect(mockRequest).toHaveBeenCalledWith(
			'/v1/person/runs/{id}',
			'test-key',
			{
				method: 'DELETE',
				path: { id: 'run_1' },
				baseUrl: 'https://api.ploid.com',
			},
		);
	});

	it('contacts.enrich posts a flat body with response_format standard', async () => {
		mockRequest.mockResolvedValue({
			data: {
				work_email: {
					value: 'example@acme.com',
					status: 'found',
					confidence: 'verified',
					source: 'public_web',
					last_seen: null,
				},
			},
			meta: {
				request_id: 'req_5',
				usage: { acu_used: 1, billed: ['work_email'], free: [], not_found: [] },
				warnings: [],
			},
		});
		const ctx = createContext();

		await (Contacts.enrich as AnyEndpoint)(ctx, {
			identifier: { person_id: 'per_1' },
			fields: ['work_email'],
		});

		expect(mockRequest).toHaveBeenCalledWith('/v1/enrich', 'test-key', {
			method: 'POST',
			body: {
				person_id: 'per_1',
				fields: ['work_email'],
				response_format: 'standard',
			},
			baseUrl: 'https://api.ploid.com',
		});
		expect(ctx.db.people.upsertByEntityId).toHaveBeenCalledWith(
			'per_1',
			expect.objectContaining({
				workEmail: {
					value: 'example@acme.com',
					status: 'found',
					confidence: 'verified',
					source: 'public_web',
					lastSeen: null,
				},
			}),
		);
	});

	it('contacts.enrich rejects an empty fields array', async () => {
		const ctx = createContext();

		await expect(
			(Contacts.enrich as AnyEndpoint)(ctx, {
				identifier: { person_id: 'per_1' },
				fields: [],
			}),
		).rejects.toThrow();
		expect(mockRequest).not.toHaveBeenCalled();
	});

	it('account.credits and account.usage GET their paths', async () => {
		mockRequest.mockResolvedValue({
			data: {
				plan: 'FREE',
				acu: { included: 50, purchased: 0, used: 0, available: 50, overage: 0 },
			},
			meta: { request_id: 'req_6' },
		});
		const ctx = createContext();

		await (Account.credits as AnyEndpoint)(ctx, {});
		await (Account.usage as AnyEndpoint)(ctx, {});

		expect(mockRequest).toHaveBeenNthCalledWith(
			1,
			'/v1/account/credits',
			'test-key',
			{
				method: 'GET',
				baseUrl: 'https://api.ploid.com',
			},
		);
		expect(mockRequest).toHaveBeenNthCalledWith(
			2,
			'/v1/account/usage',
			'test-key',
			{
				method: 'GET',
				baseUrl: 'https://api.ploid.com',
			},
		);
	});
});

describe('Ploid person cache merge', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('keeps identity fields when a sparse enrich patches the row', async () => {
		const ctx = createContext();
		ctx.db.people.findByEntityId.mockResolvedValue({
			data: {
				personId: 'per_1',
				name: 'Example Person',
				company: 'Acme',
				linkedinUrl: 'https://linkedin.com/in/example',
				identityVerified: false,
			},
		});

		await rememberPerson(ctx, {
			providerId: 'per_1',
			phone: { value: '+15550100', status: 'found', confidence: 'guess' },
		});

		expect(ctx.db.people.upsertByEntityId).toHaveBeenCalledWith(
			'per_1',
			expect.objectContaining({
				personId: 'per_1',
				name: 'Example Person',
				company: 'Acme',
				linkedinUrl: 'https://linkedin.com/in/example',
				phone: { value: '+15550100', status: 'found', confidence: 'guess' },
			}),
		);
	});

	it('lets a failed save surface as a warning, not an endpoint failure', async () => {
		const ctx = createContext();
		ctx.db.people.findByEntityId.mockRejectedValue(new Error('db down'));

		await expect(
			rememberPerson(ctx, { providerId: 'per_1', name: 'Example Person' }),
		).resolves.toBeUndefined();
	});

	it('serializes concurrent saves for one person so no patch is lost', async () => {
		const store = new Map<string, { data: PersonRow }>();
		const ctx = {
			$getAccountId: async () => 'account-1',
			db: {
				people: {
					findByEntityId: async (id: string) => store.get(id) ?? null,
					upsertByEntityId: async (id: string, data: PersonRow) => {
						store.set(id, { data });
					},
				},
			},
		};

		// Two enriches race: one adds the email, the other the phone. Both
		// reads must not observe the same pre-save row.
		const emailSave = rememberPerson(ctx, {
			providerId: 'per_1',
			workEmail: { value: 'example@acme.com', status: 'found' },
		});
		const phoneSave = rememberPerson(ctx, {
			providerId: 'per_1',
			phone: { value: '+15550100', status: 'found' },
		});
		await Promise.all([emailSave, phoneSave]);

		expect(store.get('per_1')?.data).toMatchObject({
			personId: 'per_1',
			workEmail: { value: 'example@acme.com', status: 'found' },
			phone: { value: '+15550100', status: 'found' },
		});
	});

	it('keeps queueing saves after one link fails', async () => {
		const store = new Map<string, { data: PersonRow }>();
		let reads = 0;
		const ctx = {
			$getAccountId: async () => 'account-1',
			db: {
				people: {
					findByEntityId: async (id: string) => {
						reads += 1;
						if (reads === 1) throw new Error('db down');
						return store.get(id) ?? null;
					},
					upsertByEntityId: async (id: string, data: PersonRow) => {
						store.set(id, { data });
					},
				},
			},
		};

		await rememberPerson(ctx, { providerId: 'per_1', name: 'First' });
		await rememberPerson(ctx, { providerId: 'per_1', company: 'Acme' });

		expect(store.get('per_1')?.data).toMatchObject({
			personId: 'per_1',
			company: 'Acme',
		});
	});

	it('dedupes sources across re-resolves', async () => {
		const store = new Map<string, { data: PersonRow }>();
		const ctx = {
			$getAccountId: async () => 'account-1',
			db: {
				people: {
					findByEntityId: async (id: string) => store.get(id) ?? null,
					upsertByEntityId: async (id: string, data: PersonRow) => {
						store.set(id, { data });
					},
				},
			},
		};

		await rememberPerson(ctx, {
			providerId: 'per_1',
			sources: ['https://acme.com', 'https://news.com'],
		});
		await rememberPerson(ctx, {
			providerId: 'per_1',
			sources: ['https://acme.com'],
		});

		expect(store.get('per_1')?.data?.sources).toEqual([
			'https://acme.com',
			'https://news.com',
		]);
	});
});

describe('Ploid contact cache policy', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	function storeContext() {
		const store = new Map<string, { data: PersonRow }>();
		const ctx = {
			key: 'test-key',
			options: { baseUrl: 'https://api.ploid.com' },
			$getAccountId: async () => 'account-1',
			db: {
				people: {
					findByEntityId: async (id: string) => store.get(id) ?? null,
					upsertByEntityId: async (id: string, data: PersonRow) => {
						store.set(id, { data });
					},
				},
			},
		};
		return { ctx, store };
	}

	it('keeps a found phone when a later enrich reports it unavailable', async () => {
		mockRequest.mockResolvedValueOnce({
			data: {
				phone: {
					value: '+15550100',
					status: 'found',
					confidence: 'verified',
					source: 'public_web',
					last_seen: null,
				},
			},
			meta: {
				request_id: 'req_8',
				usage: { acu_used: 10, billed: ['phone'], free: [], not_found: [] },
				warnings: [],
			},
		});
		mockRequest.mockResolvedValueOnce({
			data: {
				phone: {
					value: null,
					status: 'unavailable',
					confidence: null,
					source: null,
					last_seen: null,
				},
			},
			meta: {
				request_id: 'req_9',
				usage: { acu_used: 0, billed: [], free: ['phone'], not_found: [] },
				warnings: [],
			},
		});
		const { ctx, store } = storeContext();

		await (Contacts.enrich as AnyEndpoint)(ctx, {
			identifier: { person_id: 'per_1' },
			fields: ['phone'],
		});
		await (Contacts.enrich as AnyEndpoint)(ctx, {
			identifier: { person_id: 'per_1' },
			fields: ['phone'],
		});

		// The unavailable result must not wipe the found value; the found
		// write also carries the provenance source.
		expect(store.get('per_1')?.data?.phone).toMatchObject({
			value: '+15550100',
			status: 'found',
			source: 'public_web',
		});
	});

	it('logs the unsure outcome as its own mode', async () => {
		mockRequest.mockResolvedValue({
			data: null,
			meta: { request_id: 'req_10', resolution: 'unsure' },
		});
		const { ctx } = storeContext();

		await (Person.get as AnyEndpoint)(ctx, {
			identifier: { person_id: 'per_1' },
		});

		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'ploid.person.get',
			expect.objectContaining({ mode: 'unsure' }),
			'completed',
		);
	});

	it('does not make separate accounts wait on each other', async () => {
		function accountContext(account: string, releaseGate: () => Promise<void>) {
			const store = new Map<string, { data: PersonRow }>();
			const ctx = {
				$getAccountId: async () => account,
				db: {
					people: {
						findByEntityId: async (id: string) => store.get(id) ?? null,
						upsertByEntityId: async (id: string, data: PersonRow) => {
							await releaseGate();
							store.set(id, { data });
						},
					},
				},
			};
			return { ctx, store };
		}

		// Account A's save parks inside its own database call.
		let releaseA: () => void = () => {};
		const gateA = new Promise<void>((resolve) => {
			releaseA = resolve;
		});
		const a = accountContext('tenant-a', () => gateA);
		const b = accountContext('tenant-b', async () => {});

		const aSave = rememberPerson(a.ctx, {
			providerId: 'per_1',
			name: 'A Person',
		});
		// With a shared queue key this save would queue behind A's parked
		// write and this await would never settle.
		await rememberPerson(b.ctx, { providerId: 'per_1', name: 'B Person' });
		expect(b.store.get('per_1')?.data).toMatchObject({ name: 'B Person' });

		releaseA();
		await aSave;
		expect(a.store.get('per_1')?.data).toMatchObject({ name: 'A Person' });
	});
});
