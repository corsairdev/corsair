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
	SEARCH_HIT,
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
	it('sends the filters as one filters_json array and reads hits', async () => {
		respond(fetchMock, CANDIDATE_PAGE);

		const result = (await invoke(Endpoints.candidatesList, {
			query: 'john',
			offer_id: OFFER_ID,
			stage: 'Applied',
			status: 'qualified',
			department_id: 7,
			location_id: 2,
			limit: 10,
			page: 1,
		})) as Awaited<ReturnType<typeof Endpoints.candidatesList>>;

		const request = lastRequest(fetchMock);
		// `/candidates` is the create route; the search route filters.
		expect(request.path).toBe('/c/1111/search/new/candidates');
		expect(request.query).toEqual({
			filters_json: JSON.stringify([
				{ field: 'all', query: 'john' },
				{ field: 'status', in: ['qualified'] },
				{ filter: 'jobs', id: { in: [OFFER_ID] } },
				{ filter: 'stages', name: { in: ['Applied'] } },
				{ filter: 'jobs', department_id: { in: [7] } },
				{ filter: 'jobs', 'locations.id': { in: [2] } },
			]),
			limit: '10',
			page: '1',
		});
		expect(result.candidates[0]?.name).toBe('John Smith');
		expect(result.candidates[0]?.placements?.[0]?.stage?.name).toBe('Applied');
		expect(result.total).toBe(1);
		expect(result.next_page).toBeNull();
	});

	it('sends no filters_json when no filter is set', async () => {
		respond(fetchMock, CANDIDATE_PAGE);

		await invoke(Endpoints.candidatesList, {});

		expect(lastRequest(fetchMock).query).toEqual({});
	});

	it('joins sort_by and sort_direction the way the search expects', async () => {
		respond(fetchMock, CANDIDATE_PAGE);

		await invoke(Endpoints.candidatesList, { sort_by: 'created_at' });
		expect(lastRequest(fetchMock).query.sort_by).toBe('created_at_desc');

		respond(fetchMock, CANDIDATE_PAGE);
		await invoke(Endpoints.candidatesList, {
			sort_by: 'candidate_name',
			sort_direction: 'asc',
		});
		expect(lastRequest(fetchMock).query.sort_by).toBe('candidate_name_asc');
	});

	it('offers the next page when the total says more remain', async () => {
		respond(fetchMock, CANDIDATE_PAGE_MORE);

		const result = (await invoke(Endpoints.candidatesList, {
			limit: 1,
		})) as Awaited<ReturnType<typeof Endpoints.candidatesList>>;

		expect(result.next_page).toBe(2);
		expect(result.total).toBe(5);
	});

	it('offers the next page even when the caller left limit to Recruitee', async () => {
		respond(fetchMock, {
			hits: Array.from({ length: 60 }, () => SEARCH_HIT),
			total: 75,
		});

		const result = (await invoke(Endpoints.candidatesList, {})) as Awaited<
			ReturnType<typeof Endpoints.candidatesList>
		>;

		expect(result.next_page).toBe(2);
	});

	it('stops on the last page', async () => {
		respond(fetchMock, CANDIDATE_PAGE_MORE);

		const result = (await invoke(Endpoints.candidatesList, {
			limit: 1,
			page: 5,
		})) as Awaited<ReturnType<typeof Endpoints.candidatesList>>;

		expect(result.next_page).toBeNull();
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
		expect(result.candidate.placements?.[0]?.stage_id).toBe(13946406);
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
			name: 'John A. Smith',
		});

		const request = lastRequest(fetchMock);
		expect(request.method).toBe('PATCH');
		expect(request.path).toBe(`/c/1111/candidates/${CANDIDATE_ID}`);
		expect(request.json()).toEqual({ candidate: { name: 'John A. Smith' } });
	});

	it('sends no stage on the profile update, which the route ignores', async () => {
		respond(fetchMock, { candidate: CANDIDATE });

		await invoke(Endpoints.candidatesUpdate, {
			candidate_id: CANDIDATE_ID,
			stage: 'Interview',
		});

		// Stage moves belong to the placement, so the field is not in the schema.
		expect(lastRequest(fetchMock).json()).toEqual({ candidate: {} });
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
	it('sends the list filters as the arrays the route reads', async () => {
		respond(fetchMock, OFFER_PAGE);

		const result = (await invoke(Endpoints.offersList, {
			status: 'published',
			department_id: 7,
			location_id: 2,
			page: 2,
			limit: 25,
		})) as Awaited<ReturnType<typeof Endpoints.offersList>>;

		expect(lastRequest(fetchMock).path).toBe('/c/1111/offers');
		// A bare `status` is ignored by Recruitee and every offer comes back.
		expect(lastRequest(fetchMock).query).toEqual({
			'statuses[]': 'published',
			'department_ids[]': '7',
			'location_ids[]': '2',
			page: '2',
			limit: '25',
		});
		expect(result.offers[0]?.title).toBe('Senior Backend Engineer');
		expect(result.total).toBe(1);
	});

	it('pages offers by meta.total_count', async () => {
		respond(fetchMock, {
			meta: { limit: 2, page: 1, total_count: 3 },
			offers: [OFFER, OFFER],
		});

		const result = (await invoke(Endpoints.offersList, {
			limit: 2,
		})) as Awaited<ReturnType<typeof Endpoints.offersList>>;

		expect(result.next_page).toBe(2);
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
			location_ids: [2],
		});

		expect(lastRequest(fetchMock).json()).toEqual({
			offer: {
				title: 'Senior Backend Engineer',
				kind: 'job',
				department_id: 7,
				location_ids: [2],
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
			title: 'Staff Backend Engineer',
		});

		const request = lastRequest(fetchMock);
		expect(request.path).toBe(`/c/1111/offers/${OFFER_ID}`);
		expect(request.json()).toEqual({
			offer: { title: 'Staff Backend Engineer' },
		});
	});
});

describe('departments and locations', () => {
	it('lists departments with their offer counts', async () => {
		respond(fetchMock, DEPARTMENT_PAGE);

		const result = (await invoke(Endpoints.departmentsList, {})) as Awaited<
			ReturnType<typeof Endpoints.departmentsList>
		>;

		expect(lastRequest(fetchMock).path).toBe('/c/1111/departments');
		expect(lastRequest(fetchMock).query).toEqual({});
		expect(result.departments[0]?.offers_count).toBe(3);
	});

	it('lists locations with their offer counts', async () => {
		respond(fetchMock, LOCATION_PAGE);

		const result = (await invoke(Endpoints.locationsList, {})) as Awaited<
			ReturnType<typeof Endpoints.locationsList>
		>;

		expect(lastRequest(fetchMock).query).toEqual({});
		expect(result.locations[0]?.country_code).toBe('DE');
		expect(result.total).toBe(1);
		expect(result.next_page).toBeNull();
	});
});

describe('list envelope', () => {
	it('fails rather than inventing an empty list when the key is missing', async () => {
		respond(fetchMock, {});

		await expect(invoke(Endpoints.offersList, {})).rejects.toThrow();
	});
});
