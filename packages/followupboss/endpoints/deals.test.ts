import { logEventFromContext } from 'corsair/core';
import {
	appointmentOutcomesCreate,
	appointmentOutcomesDelete,
	appointmentOutcomesGet,
	appointmentOutcomesList,
	appointmentOutcomesUpdate,
	dealAttachmentsCreate,
	dealAttachmentsDelete,
	dealAttachmentsGet,
	dealAttachmentsUpdate,
	dealCustomFieldsCreate,
	dealCustomFieldsDelete,
	dealCustomFieldsGet,
	dealCustomFieldsList,
	dealCustomFieldsUpdate,
	dealsCreate,
	dealsDelete,
	dealsGet,
	dealsList,
	dealsUpdate,
	pipelinesCreate,
	pipelinesDelete,
	pipelinesGet,
	pipelinesList,
	pipelinesUpdate,
	stagesCreate,
	stagesDelete,
	stagesGet,
	stagesList,
	stagesUpdate,
} from './deals';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'fub-test-key';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type,
// so the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

function invoke(endpoint: AnyEndpoint, input: unknown) {
	// The fake context only carries what call() reads: ctx.key and the
	// systemName/systemKey identification options, which stay unset so the
	// X-System header falls back to 'corsair'.
	return endpoint({ key: API_KEY, options: {} } as never, input as never);
}

let fetchMock: jest.SpyInstance;

// unknown: response bodies are arbitrary JSON.
function respond(body: unknown, status = 200) {
	fetchMock.mockResolvedValueOnce(
		new Response(JSON.stringify(body), {
			status,
			headers: { 'Content-Type': 'application/json' },
		}),
	);
}

function respondEmpty(status: number) {
	fetchMock.mockResolvedValueOnce(new Response(null, { status }));
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		headers: new Headers(init.headers),
		// unknown: the request body is whatever the endpoint serialized.
		body: init.body ? (JSON.parse(String(init.body)) as unknown) : undefined,
	};
}

// FUB authenticates with the API key as the Basic username and an empty
// password, and identifies the calling system with X-System.
function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://api.followupboss.com');
	expect(sent.path).toMatch(/^\/v1\//);
	expect(sent.headers.get('authorization')).toBe(
		`Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
	);
	expect(sent.headers.get('x-system')).toBe('corsair');
	expect(sent.headers.get('x-system-key')).toBeNull();
}

// Fixtures modeled on the response examples in the FUB deals-family docs,
// with made-up deals and accounts; they live inline so this suite owns them.
const metadata = {
	collection: 'deals',
	offset: 0,
	limit: 10,
	total: 1,
	next: null,
	nextLink: null,
};

const deal = {
	id: 2146,
	name: 'adding deal',
	description: 'A deal for an example',
	pipelineId: 100,
	stageId: 5,
	enteredStageAt: '2017-04-14T18:31:20Z',
	type: 0,
	status: 'Active',
	price: 216000,
	createdAt: '2017-04-14T18:31:19Z',
	orderWeight: 6000,
	projectedCloseDate: null,
	people: [{ id: 10, name: 'Yolanda Smith', avatar: '' }],
	users: [{ id: 1, name: 'John Smith' }],
	customField1: 'A sample custom field.',
	agentCommission: 50,
	teamCommission: 50,
};

const pipeline = {
	id: 1,
	name: 'Contact Pipeline',
	description: 'A pipeline for contacts',
	orderWeight: 1000,
	stages: [
		{
			id: 1,
			name: 'Contact',
			description: '',
			orderWeight: 3000,
			color: '#FFFFFF',
		},
		{ id: 2, name: 'Lead', description: '', orderWeight: 4000, color: '' },
	],
};

const stage = {
	id: 7,
	name: 'Pending',
	orderWeight: 7000,
	isProtected: false,
	peopleCount: 10,
};

const dealCustomField = {
	id: 6,
	label: 'Looking for',
	name: 'customLookingFor',
	type: 'dropdown',
	choices: ['Apartment', 'Townhouse', 'Detached House'],
	orderWeight: 3,
	hideIfEmpty: false,
	readOnly: false,
};

const dealAttachment = {
	id: 10,
	dealId: 1,
	fileName: 'test.jpg',
	fileSize: null,
	mimeType: 'link',
	uri: 'https://test.com/myfile',
	thumbnailUri: null,
	status: 'created',
	createdAt: '2022-11-16T19:09:45Z',
	createdById: 1,
	createdByName: 'Olivia Admin',
};

const appointmentOutcome = {
	id: 3,
	name: 'Listing obtained',
	orderWeight: 3000,
};

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('deals', () => {
	it('list keeps every deal and the _metadata block', async () => {
		respond({ deals: [deal], _metadata: metadata });

		const result = await invoke(dealsList, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/deals',
			body: undefined,
		});
		expect(lastRequest().query).toEqual({});
		expect(result).toEqual({ deals: [deal], _metadata: metadata });
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'followupboss.deals.list',
			{ count: 1 },
			'completed',
		);
	});

	it('list sends the status enum, the include flags and the id filters', async () => {
		respond({ deals: [] });

		await invoke(dealsList, {
			pipelineId: 100,
			userId: 21,
			personId: 950,
			includeDeleted: 1,
			includeArchived: 1,
			status: 'Active',
			limit: 25,
			offset: 50,
		});

		expect(lastRequest().query).toEqual({
			pipelineId: '100',
			userId: '21',
			personId: '950',
			includeDeleted: '1',
			includeArchived: '1',
			status: 'Active',
			limit: '25',
			offset: '50',
		});
	});

	it('get unwraps the single-deal envelope and keeps the flat custom fields', async () => {
		respond({ deals: [deal] });

		const result = await invoke(dealsGet, { id: 2146 });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/deals/2146',
			body: undefined,
		});
		expect(result).toEqual(deal);
	});

	it('create POSTs the deal body and parses the bare 200 deal', async () => {
		respond(deal);

		const result = await invoke(dealsCreate, {
			name: 'adding deal',
			stageId: 5,
			description: 'A deal for an example',
			peopleIds: [10],
			userIds: [1],
			price: 216000,
			projectedCloseDate: '2026-08-01',
			agentCommission: 50,
			teamCommission: 50,
		});

		// POST /deals answers 200 with the bare deal, not 201.
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/deals',
			body: {
				name: 'adding deal',
				stageId: 5,
				description: 'A deal for an example',
				peopleIds: [10],
				userIds: [1],
				price: 216000,
				projectedCloseDate: '2026-08-01',
				agentCommission: 50,
				teamCommission: 50,
			},
		});
		expect(lastRequest().headers.get('content-type')).toBe('application/json');
		expect(result).toEqual(deal);
	});

	it('update PUTs the fields without the id, using the documented commission spellings', async () => {
		respond(deal);

		const result = await invoke(dealsUpdate, {
			id: 2146,
			stageId: 16,
			agentCommision: 50,
			teamComission: 50,
		});

		// The PUT contract spells these two fields `agentCommision` and
		// `teamComission` (one `s`); the documented spellings are sent as-is.
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/deals/2146',
			body: { stageId: 16, agentCommision: 50, teamComission: 50 },
		});
		expect(result).toEqual(deal);
	});

	it('sends deal custom fields as top-level custom* keys on create and update', async () => {
		respond(deal);
		await invoke(dealsCreate, {
			name: 'adding deal',
			stageId: 5,
			customFields: {
				customClosingDate: '2026-12-01',
				customLender: 'Acme Bank',
			},
		});
		expect(lastRequest().body).toEqual({
			name: 'adding deal',
			stageId: 5,
			customClosingDate: '2026-12-01',
			customLender: 'Acme Bank',
		});

		respond(deal);
		await invoke(dealsUpdate, {
			id: 2146,
			customFields: { customClosingDate: null },
		});
		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/deals/2146',
			body: { customClosingDate: null },
		});
		expect(lastRequest().body).not.toHaveProperty('customFields');
	});

	it('list rejects a non-object reply instead of reading it as no deals', async () => {
		respond('oops');

		await expect(invoke(dealsList, {})).rejects.toMatchObject({
			name: 'ZodError',
		});
	});

	it('refuses custom field keys that could overwrite deal fields', async () => {
		await expect(
			invoke(dealsCreate, {
				name: 'adding deal',
				stageId: 5,
				customFields: { stageId: 999 },
			}),
		).rejects.toMatchObject({ name: 'ZodError' });
		await expect(
			invoke(dealsUpdate, { id: 2146, customFields: { price: 1 } }),
		).rejects.toMatchObject({ name: 'ZodError' });
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('delete answers {id, resource} from the empty 200 body', async () => {
		respond({});

		const result = await invoke(dealsDelete, { id: 2146 });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/deals/2146',
			body: undefined,
		});
		expect(result).toEqual({ id: 2146, resource: {} });
	});
});

describe('pipelines', () => {
	it('list filters by the exact pipeline name', async () => {
		respond({
			pipelines: [pipeline],
			_metadata: { ...metadata, collection: 'pipelines' },
		});

		const result = await invoke(pipelinesList, { name: 'Contact Pipeline' });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/pipelines',
		});
		expect(lastRequest().query).toEqual({ name: 'Contact Pipeline' });
		expect(result).toEqual({
			pipelines: [pipeline],
			_metadata: { ...metadata, collection: 'pipelines' },
		});
	});

	it('create POSTs the pipeline with its stage objects', async () => {
		respond(pipeline);

		const result = await invoke(pipelinesCreate, {
			name: 'Buyer pipeline',
			description: 'A pipeline for buyers',
			orderWeight: 1000,
			stages: [
				{
					name: 'First Stage',
					description: '',
					orderWeight: 1000,
					color: '#FFFFFF',
					closedStage: false,
				},
				{
					name: 'Second Stage',
					description: '',
					orderWeight: 2000,
					closedStage: true,
				},
			],
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/pipelines',
			body: {
				name: 'Buyer pipeline',
				description: 'A pipeline for buyers',
				orderWeight: 1000,
				stages: [
					{
						name: 'First Stage',
						description: '',
						orderWeight: 1000,
						color: '#FFFFFF',
						closedStage: false,
					},
					{
						name: 'Second Stage',
						description: '',
						orderWeight: 2000,
						closedStage: true,
					},
				],
			},
		});
		expect(result).toEqual(pipeline);
	});

	it('get unwraps the single-pipeline envelope', async () => {
		respond({ pipelines: [pipeline] });

		const result = await invoke(pipelinesGet, { id: 1 });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/pipelines/1',
		});
		expect(result).toEqual(pipeline);
	});

	it('update PUTs stages, keeping the ids of existing ones', async () => {
		respond(pipeline);

		const result = await invoke(pipelinesUpdate, {
			id: 1,
			stages: [{ id: 1, name: 'Contact', closedStage: false }],
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/pipelines/1',
			body: { stages: [{ id: 1, name: 'Contact', closedStage: false }] },
		});
		expect(result).toEqual(pipeline);
	});

	it('delete answers {id, resource} from the empty 200 body', async () => {
		respond({});

		const result = await invoke(pipelinesDelete, { id: 1 });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/pipelines/1',
		});
		expect(result).toEqual({ id: 1, resource: {} });
	});
});

describe('stages', () => {
	it('list sends the sort and paging params', async () => {
		respond({
			stages: [stage],
			_metadata: { ...metadata, collection: 'stages', total: 8 },
		});

		const result = await invoke(stagesList, {
			sort: 'orderWeight',
			limit: 20,
			offset: 0,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/stages',
		});
		expect(lastRequest().query).toEqual({
			sort: 'orderWeight',
			limit: '20',
			offset: '0',
		});
		expect(result).toEqual({
			stages: [stage],
			_metadata: { ...metadata, collection: 'stages', total: 8 },
		});
	});

	it('create POSTs the stage name and order weight', async () => {
		respond(stage);

		const result = await invoke(stagesCreate, {
			name: 'Pending',
			orderWeight: 7000,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/stages',
			body: { name: 'Pending', orderWeight: 7000 },
		});
		expect(result).toEqual(stage);
	});

	it('get unwraps the single-stage envelope', async () => {
		respond({ stages: [stage] });

		const result = await invoke(stagesGet, { id: 7 });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/stages/7',
		});
		expect(result).toEqual(stage);
	});

	it('update PUTs the fields without the id', async () => {
		respond(stage);

		const result = await invoke(stagesUpdate, { id: 7, name: 'Pending' });

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/stages/7',
			body: { name: 'Pending' },
		});
		expect(result).toEqual(stage);
	});

	it('delete reassigns action plans via the required assignStageId query', async () => {
		respond({});

		const result = await invoke(stagesDelete, { id: 7, assignStageId: 2 });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/stages/7',
		});
		expect(lastRequest().query).toEqual({ assignStageId: '2' });
		expect(result).toEqual({ id: 7, resource: {} });
	});
});

describe('dealCustomFields', () => {
	it('list parses the `dealCustomfields` envelope the docs publish', async () => {
		const dateField = {
			id: 2,
			label: 'Birthday',
			name: 'customBirthday',
			type: 'date',
			orderWeight: 1,
			hideIfEmpty: true,
			readOnly: false,
		};
		respond({
			dealCustomfields: [dateField, dealCustomField],
			_metadata: { ...metadata, collection: 'dealCustomfields', total: 2 },
		});

		const result = await invoke(dealCustomFieldsList, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/dealCustomFields',
			body: undefined,
		});
		expect(lastRequest().query).toEqual({});
		expect(result).toEqual({
			dealCustomfields: [dateField, dealCustomField],
			_metadata: { ...metadata, collection: 'dealCustomfields', total: 2 },
		});
	});

	it('list also accepts the camelCase envelope spelling from the wire', async () => {
		respond({ dealCustomFields: [dealCustomField] });

		const result = await invoke(dealCustomFieldsList, {});

		expect(result).toEqual({ dealCustomfields: [dealCustomField] });
	});

	it('list sends the label and sort filters', async () => {
		respond({ dealCustomfields: [] });

		await invoke(dealCustomFieldsList, { label: 'Close price', sort: '-id' });

		expect(lastRequest().query).toEqual({ label: 'Close price', sort: '-id' });
	});

	it('create POSTs the label and type with the dropdown choices', async () => {
		respond(dealCustomField);

		const result = await invoke(dealCustomFieldsCreate, {
			label: 'Looking for',
			type: 'dropdown',
			choices: ['Apartment', 'Townhouse', 'Detached House'],
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/dealCustomFields',
			body: {
				label: 'Looking for',
				type: 'dropdown',
				choices: ['Apartment', 'Townhouse', 'Detached House'],
			},
		});
		expect(result).toEqual(dealCustomField);
	});

	it('get unwraps the single-field envelope', async () => {
		respond({ dealCustomfields: [dealCustomField] });

		const result = await invoke(dealCustomFieldsGet, { id: 6 });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/dealCustomFields/6',
		});
		expect(result).toEqual(dealCustomField);
	});

	it('update PUTs the required label and type plus the dropdown choice map', async () => {
		respond(dealCustomField);

		const result = await invoke(dealCustomFieldsUpdate, {
			id: 6,
			label: 'Looking for',
			type: 'dropdown',
			dropdownChoiceMap: [0, 2, 1],
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/dealCustomFields/6',
			body: {
				label: 'Looking for',
				type: 'dropdown',
				dropdownChoiceMap: [0, 2, 1],
			},
		});
		expect(result).toEqual(dealCustomField);
	});

	it('delete answers {id, resource} from the empty 200 body', async () => {
		// The contract documents an empty body for this 200.
		respondEmpty(200);

		const result = await invoke(dealCustomFieldsDelete, { id: 6 });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/dealCustomFields/6',
		});
		expect(result).toEqual({ id: 6, resource: null });
	});
});

describe('dealAttachments', () => {
	it('create POSTs the file fields and parses the 201 attachment', async () => {
		respond(dealAttachment, 201);

		const result = await invoke(dealAttachmentsCreate, {
			dealId: 1,
			uri: 'https://test.com/myfile',
			fileName: 'test.jpg',
			fileSize: 4,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/dealAttachments',
			body: {
				dealId: 1,
				uri: 'https://test.com/myfile',
				fileName: 'test.jpg',
				fileSize: 4,
			},
		});
		expect(lastRequest().headers.get('content-type')).toBe('application/json');
		expect(result).toEqual(dealAttachment);
	});

	it('get parses the bare attachment that the docs publish with a 201', async () => {
		respond(dealAttachment, 201);

		const result = await invoke(dealAttachmentsGet, { id: 10 });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/dealAttachments/10',
		});
		expect(result).toEqual(dealAttachment);
	});

	it('update PUTs the file fields without the id', async () => {
		respond(dealAttachment, 201);

		const result = await invoke(dealAttachmentsUpdate, {
			id: 10,
			dealId: 1,
			uri: 'https://test.com/myfile',
			fileName: 'renamed.jpg',
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/dealAttachments/10',
			body: {
				dealId: 1,
				uri: 'https://test.com/myfile',
				fileName: 'renamed.jpg',
			},
		});
		expect(result).toEqual(dealAttachment);
	});

	it('delete answers {id, resource} from the empty 200 body', async () => {
		respond({});

		const result = await invoke(dealAttachmentsDelete, { id: 10 });

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/dealAttachments/10',
		});
		expect(result).toEqual({ id: 10, resource: {} });
	});
});

describe('appointmentOutcomes', () => {
	it('list parses the lowercase `appointmentoutcomes` envelope', async () => {
		const noShow = { id: 1, name: 'No show', orderWeight: 1000 };
		respond({
			appointmentoutcomes: [noShow, appointmentOutcome],
			_metadata: { ...metadata, collection: 'appointmentoutcomes', total: 2 },
		});

		const result = await invoke(appointmentOutcomesList, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/appointmentOutcomes',
			body: undefined,
		});
		expect(lastRequest().query).toEqual({});
		expect(result).toEqual({
			appointmentoutcomes: [noShow, appointmentOutcome],
			_metadata: { ...metadata, collection: 'appointmentoutcomes', total: 2 },
		});
	});

	it('list also accepts the camelCase envelope spelling from the wire', async () => {
		respond({ appointmentOutcomes: [appointmentOutcome] });

		const result = await invoke(appointmentOutcomesList, {});

		expect(result).toEqual({ appointmentoutcomes: [appointmentOutcome] });
	});

	it('list sends the sort filter', async () => {
		respond({ appointmentoutcomes: [] });

		await invoke(appointmentOutcomesList, { sort: '-orderWeight' });

		expect(lastRequest().query).toEqual({ sort: '-orderWeight' });
	});

	it('create POSTs the outcome name and order weight', async () => {
		respond(appointmentOutcome);

		const result = await invoke(appointmentOutcomesCreate, {
			name: 'Listing obtained',
			orderWeight: 3000,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/v1/appointmentOutcomes',
			body: { name: 'Listing obtained', orderWeight: 3000 },
		});
		expect(result).toEqual(appointmentOutcome);
	});

	it('get unwraps the single-outcome envelope', async () => {
		respond({ appointmentoutcomes: [appointmentOutcome] });

		const result = await invoke(appointmentOutcomesGet, { id: 3 });

		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/v1/appointmentOutcomes/3',
		});
		expect(result).toEqual(appointmentOutcome);
	});

	it('update PUTs the fields without the id', async () => {
		const renamed = { ...appointmentOutcome, name: 'Listing signed' };
		respond(renamed);

		const result = await invoke(appointmentOutcomesUpdate, {
			id: 3,
			name: 'Listing signed',
		});

		expect(lastRequest()).toMatchObject({
			method: 'PUT',
			path: '/v1/appointmentOutcomes/3',
			body: { name: 'Listing signed' },
		});
		expect(result).toEqual(renamed);
	});

	it('delete reassigns appointments via the required assignOutcomeId query and parses the [] 200 body', async () => {
		// The contract documents an empty JSON array as the 200 body here.
		respond([]);

		const result = await invoke(appointmentOutcomesDelete, {
			id: 3,
			assignOutcomeId: 9,
		});

		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: '/v1/appointmentOutcomes/3',
		});
		expect(lastRequest().query).toEqual({ assignOutcomeId: '9' });
		expect(result).toEqual({ id: 3, resource: null });
	});
});

describe('input validation happens before any request', () => {
	// Every endpoint here rejects an empty input at the schema, so no fetch
	// is ever attempted and no queued response is consumed. The list
	// endpoints and appointmentOutcomes.create take fully optional input and
	// are therefore absent.
	const emptyInputs: [string, AnyEndpoint][] = [
		['deals.get', dealsGet],
		['deals.create', dealsCreate],
		['deals.update', dealsUpdate],
		['deals.delete', dealsDelete],
		['pipelines.get', pipelinesGet],
		['pipelines.create', pipelinesCreate],
		['pipelines.update', pipelinesUpdate],
		['pipelines.delete', pipelinesDelete],
		['stages.get', stagesGet],
		['stages.create', stagesCreate],
		['stages.update', stagesUpdate],
		['stages.delete', stagesDelete],
		['dealCustomFields.get', dealCustomFieldsGet],
		['dealCustomFields.create', dealCustomFieldsCreate],
		['dealCustomFields.update', dealCustomFieldsUpdate],
		['dealCustomFields.delete', dealCustomFieldsDelete],
		['dealAttachments.create', dealAttachmentsCreate],
		['dealAttachments.get', dealAttachmentsGet],
		['dealAttachments.update', dealAttachmentsUpdate],
		['dealAttachments.delete', dealAttachmentsDelete],
		['appointmentOutcomes.get', appointmentOutcomesGet],
		['appointmentOutcomes.update', appointmentOutcomesUpdate],
		['appointmentOutcomes.delete', appointmentOutcomesDelete],
	];

	it.each(emptyInputs)(
		'rejects an empty input to %s with a ZodError',
		async (_operation, endpoint) => {
			await expect(invoke(endpoint, {})).rejects.toMatchObject({
				name: 'ZodError',
			});
			expect(fetchMock).not.toHaveBeenCalled();
			expect(mockLog).not.toHaveBeenCalled();
		},
	);
});
