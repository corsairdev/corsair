import * as Endpoints from './endpoints/endpoints';
import {
	CANDIDATE,
	CANDIDATE_ID,
	CANDIDATE_PAGE,
	CANDIDATE_PAGE_MORE,
	DEPARTMENT_PAGE,
	LOCATION_PAGE,
	OFFER,
	OFFER_ID,
	OFFER_PAGE,
} from './test-fixtures';
import { invoke, lastRequest, respond, spyOnFetch } from './test-support';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('the company prefix', () => {
	it('sends every call under /c/<company>', async () => {
		respond(fetchMock, OFFER_PAGE);

		await invoke(Endpoints.offersList, {}, 'northwind');

		expect(lastRequest(fetchMock).path).toBe('/c/northwind/offers');
	});

	it('fails before sending when the company id is missing', async () => {
		const error = await invoke(Endpoints.offersList, {}, '').catch(
			(caught: Error) => caught,
		);

		expect((error as Error).message).toContain('auth-missing:recruitee');
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('candidates.list', () => {
	it('searches the candidates route with filters', async () => {
		respond(fetchMock, CANDIDATE_PAGE);

		const result = (await invoke(Endpoints.candidatesList, {
			query: 'john',
			offer_id: OFFER_ID,
			stage: 'Applied',
			limit: 10,
			offset: 0,
		})) as Awaited<ReturnType<typeof Endpoints.candidatesList>>;

		const request = lastRequest(fetchMock);
		// `/candidates` is the create route; the search route filters.
		expect(request.path).toBe('/c/1111/search/new/candidates');
		expect(request.query).toEqual({
			query: 'john',
			offer_id: String(OFFER_ID),
			stage: 'Applied',
			limit: '10',
			offset: '0',
		});
		expect(result.candidates[0]?.name).toBe('John Smith');
		expect(result.next_offset).toBeNull();
	});

	it('offers the next offset when a full page came back with more to read', async () => {
		respond(fetchMock, CANDIDATE_PAGE_MORE);

		const result = (await invoke(Endpoints.candidatesList, {
			limit: 1,
			offset: 0,
		})) as Awaited<ReturnType<typeof Endpoints.candidatesList>>;

		expect(result.next_offset).toBe(1);
		expect(result.meta?.total).toBe(5);
	});

	it('stops on a short page even when records remain', async () => {
		respond(fetchMock, CANDIDATE_PAGE_MORE);

		const result = (await invoke(Endpoints.candidatesList, {
			limit: 10,
			offset: 0,
		})) as Awaited<ReturnType<typeof Endpoints.candidatesList>>;

		expect(result.next_offset).toBeNull();
	});
});

describe('candidates.get', () => {
	it('reads one candidate by id', async () => {
		respond(fetchMock, { candidate: CANDIDATE });

		const result = (await invoke(Endpoints.candidatesGet, {
			candidate_id: CANDIDATE_ID,
		})) as Awaited<ReturnType<typeof Endpoints.candidatesGet>>;

		expect(lastRequest(fetchMock).path).toBe(
			`/c/1111/candidates/${CANDIDATE_ID}`,
		);
		expect(result.candidate.emails).toEqual(['john@example.com']);
		expect(result.candidate.stage).toBe('Applied');
	});
});

describe('candidates.create', () => {
	it('wraps the record in candidate and assigns the offer beside it', async () => {
		respond(fetchMock, { candidate: CANDIDATE }, 201);

		const result = (await invoke(Endpoints.candidatesCreate, {
			name: 'John Smith',
			emails: ['john@example.com'],
			phones: ['555-0100'],
			offer_id: OFFER_ID,
		})) as Awaited<ReturnType<typeof Endpoints.candidatesCreate>>;

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('POST');
		expect(request.path).toBe('/c/1111/candidates');
		expect(request.json()).toEqual({
			candidate: {
				name: 'John Smith',
				emails: ['john@example.com'],
				phones: ['555-0100'],
			},
			// The offer assignment sits beside the record, not inside it.
			offers: [OFFER_ID],
		});
		expect(result.candidate.id).toBe(CANDIDATE_ID);
	});

	it('rejects a candidate with no name, which the API requires', async () => {
		await expect(
			invoke(Endpoints.candidatesCreate, { emails: ['john@example.com'] }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('candidates.update and delete', () => {
	it('patches the candidate under its wrapper', async () => {
		respond(fetchMock, { candidate: CANDIDATE });

		await invoke(Endpoints.candidatesUpdate, {
			candidate_id: CANDIDATE_ID,
			stage: 'Interview',
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PATCH');
		expect(request.path).toBe(`/c/1111/candidates/${CANDIDATE_ID}`);
		expect(request.json()).toEqual({ candidate: { stage: 'Interview' } });
	});

	it('deletes a candidate and reports the id', async () => {
		respond(fetchMock, {});

		const result = (await invoke(Endpoints.candidatesDelete, {
			candidate_id: CANDIDATE_ID,
		})) as Awaited<ReturnType<typeof Endpoints.candidatesDelete>>;

		expect(lastRequest(fetchMock).method).toBe('DELETE');
		expect(result).toEqual({ success: true, candidate_id: CANDIDATE_ID });
	});
});

describe('offers', () => {
	it('lists offers with a status filter', async () => {
		respond(fetchMock, OFFER_PAGE);

		const result = (await invoke(Endpoints.offersList, {
			status: 'published',
		})) as Awaited<ReturnType<typeof Endpoints.offersList>>;

		expect(lastRequest(fetchMock).path).toBe('/c/1111/offers');
		expect(lastRequest(fetchMock).query).toEqual({ status: 'published' });
		expect(result.offers[0]?.title).toBe('Senior Backend Engineer');
	});

	it('reads one offer by id', async () => {
		respond(fetchMock, { offer: OFFER });

		const result = (await invoke(Endpoints.offersGet, {
			offer_id: OFFER_ID,
		})) as Awaited<ReturnType<typeof Endpoints.offersGet>>;

		expect(result.offer.slug).toBe('senior-backend-engineer');
		expect(result.offer.department_id).toBe(7);
	});

	it('creates an offer under its wrapper', async () => {
		respond(fetchMock, { offer: OFFER }, 201);

		await invoke(Endpoints.offersCreate, {
			title: 'Senior Backend Engineer',
			kind: 'job',
			department_id: 7,
		});

		expect(lastRequest(fetchMock).json()).toEqual({
			offer: {
				title: 'Senior Backend Engineer',
				kind: 'job',
				department_id: 7,
			},
		});
	});

	it('rejects an offer kind the API does not define', async () => {
		await expect(
			invoke(Endpoints.offersCreate, { title: 'x', kind: 'contract' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('updates an offer', async () => {
		respond(fetchMock, { offer: OFFER });

		await invoke(Endpoints.offersUpdate, {
			offer_id: OFFER_ID,
			status: 'draft',
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe(`/c/1111/offers/${OFFER_ID}`);
		expect(request.json()).toEqual({ offer: { status: 'draft' } });
	});
});

describe('departments and locations', () => {
	it('lists departments with their offer counts', async () => {
		respond(fetchMock, DEPARTMENT_PAGE);

		const result = (await invoke(Endpoints.departmentsList, {})) as Awaited<
			ReturnType<typeof Endpoints.departmentsList>
		>;

		expect(lastRequest(fetchMock).path).toBe('/c/1111/departments');
		expect(result.departments[0]?.offers_count).toBe(3);
	});

	it('lists locations with their offer counts', async () => {
		respond(fetchMock, LOCATION_PAGE);

		const result = (await invoke(Endpoints.locationsList, {})) as Awaited<
			ReturnType<typeof Endpoints.locationsList>
		>;

		expect(result.locations[0]?.country_code).toBe('DE');
		expect(result.locations[0]?.offers_count).toBe(2);
	});
});

describe('list envelope', () => {
	it('fails rather than inventing an empty list when the key is missing', async () => {
		respond(fetchMock, {});

		await expect(invoke(Endpoints.offersList, {})).rejects.toThrow();
	});
});
