import { logEventFromContext } from 'corsair/core';
import { NanonetsAPIError } from './client';
import { Files, Integrations, Models, Predictions } from './endpoints';
import {
	asyncPendingEnvelope,
	error400,
	error404,
	filesListResponse,
	integrationsArray,
	modelId,
	modelObject,
	predictionEnvelope,
	queryRows,
	requestFileId,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const API_KEY = 'nn-test-key';
const PAGE_ID = 'b1d5c0a2-3e47-4e89-9f21-7c8f5a3d6e10';

// Parameters are contravariant, so every concrete endpoint is assignable to
// the never-parameter function type; T keeps each call's own output type.
// unknown: negative cases pass values no schema accepts.
function invoke<T>(
	endpoint: (ctx: never, input: never) => Promise<T>,
	input: unknown,
): Promise<T> {
	// The fake context only carries what the endpoints read (ctx.key).
	return endpoint({ key: API_KEY } as never, input as never);
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

// The workflow actions document no response body at all.
function respondEmpty() {
	fetchMock.mockResolvedValueOnce(new Response(null, { status: 200 }));
}

function lastRequest() {
	const [url, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	const parsed = new URL(url);
	const headers = new Headers(init.headers);
	return {
		origin: parsed.origin,
		path: parsed.pathname,
		query: Object.fromEntries(parsed.searchParams),
		method: init.method,
		authorization: headers.get('authorization'),
		contentType: headers.get('content-type'),
	};
}

function lastInit() {
	const [, init] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
	return init;
}

function expectAuthenticated() {
	const sent = lastRequest();
	expect(sent.origin).toBe('https://app.nanonets.com');
	expect(sent.authorization).toBe(
		`Basic ${Buffer.from(`${API_KEY}:`).toString('base64')}`,
	);
	expect(sent.authorization).not.toMatch(/^Bearer /);
}

// unknown: a rejection can be any value until the instanceof check narrows it.
async function rejectsWith(
	promise: Promise<unknown>,
): Promise<NanonetsAPIError> {
	const error = await promise.catch((e: unknown) => e);
	expect(error).toBeInstanceOf(NanonetsAPIError);
	if (!(error instanceof NanonetsAPIError)) throw error;
	return error;
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('predictions.createFromFile', () => {
	it('POSTs multipart form data to LabelFile/ and parses the envelope', async () => {
		respond(predictionEnvelope);

		const result = await invoke(Predictions.createFromFile, {
			model_id: modelId,
			base64_data: 'aGVsbG8gbmFub25ldHM=',
			request_metadata: 'invoice-0042',
			pages_to_process: '1,2',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/api/v2/OCR/Model/${modelId}/LabelFile/`,
		});
		expect(lastRequest().query).toEqual({});
		const body = lastInit().body;
		expect(body).toBeInstanceOf(FormData);
		const form = body as FormData;
		expect(form.get('base64_data')).toBe('aGVsbG8gbmFub25ldHM=');
		expect(form.get('request_metadata')).toBe('invoice-0042');
		expect(form.get('pages_to_process')).toBe('1,2');
		expect([...form.keys()].sort()).toEqual([
			'base64_data',
			'pages_to_process',
			'request_metadata',
		]);
		expect(result.message).toBe('Success');
		expect(result.result?.[0]?.prediction?.[0]).toMatchObject({
			label: 'total_amount',
			ocr_text: '120.00',
		});
		expect(result.signed_urls?.['invoice.png']?.original).toBe(
			'https://files.nanonets.com/signed/invoice.png?exp=4h',
		);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'nanonets.predictions.createFromFile',
			{ model_id: modelId, async: false, request_file_id: requestFileId },
			'completed',
		);
	});

	it('adds ?async=true only when async is set', async () => {
		respond(asyncPendingEnvelope);

		await invoke(Predictions.createFromFile, {
			model_id: modelId,
			base64_data: 'aGVsbG8gbmFub25ldHM=',
			async: true,
			l: 'de',
		});

		expect(lastRequest().query).toEqual({ async: 'true', l: 'de' });

		respond(predictionEnvelope);

		await invoke(Predictions.createFromFile, {
			model_id: modelId,
			base64_data: 'aGVsbG8gbmFub25ldHM=',
		});

		const [cleanUrl] = fetchMock.mock.calls.at(-1) as [string, RequestInit];
		expect(cleanUrl).toBe(
			`https://app.nanonets.com/api/v2/OCR/Model/${modelId}/LabelFile/`,
		);
	});
});

describe('predictions.createFromUrls', () => {
	it('POSTs a urlencoded body with repeated urls entries', async () => {
		respond(predictionEnvelope);

		const result = await invoke(Predictions.createFromUrls, {
			model_id: modelId,
			urls: ['https://img.example/a.png', 'https://img.example/b.png'],
			request_metadata: 'invoice-0042',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/api/v2/OCR/Model/${modelId}/LabelUrls/`,
		});
		const body = lastInit().body;
		expect(typeof body).toBe('string');
		const params = new URLSearchParams(body as string);
		expect(params.getAll('urls')).toEqual([
			'https://img.example/a.png',
			'https://img.example/b.png',
		]);
		expect(params.get('request_metadata')).toBe('invoice-0042');
		expect(lastRequest().contentType).toBe('application/x-www-form-urlencoded');
		expect(result.result?.[0]?.prediction?.[0]?.ocr_text).toBe('120.00');
	});

	it('still parses a 206 partial response', async () => {
		respond(asyncPendingEnvelope, 206);

		const result = await invoke(Predictions.createFromUrls, {
			model_id: modelId,
			urls: ['https://img.example/a.png'],
			async: true,
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/api/v2/OCR/Model/${modelId}/LabelUrls/`,
		});
		expect(lastRequest().query).toEqual({ async: 'true' });
		expect(result.message).toBe('pending');
		expect(result.result?.[0]?.request_file_id).toBe(requestFileId);
	});
});

describe('predictions.listFiles', () => {
	it('GETs ImageLevelInferences with the day window', async () => {
		respond(filesListResponse);

		const result = await invoke(Predictions.listFiles, {
			model_id: modelId,
			start_day_interval: 20357,
			current_batch_day: 20360,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: `/api/v2/Inferences/Model/${modelId}/ImageLevelInferences`,
		});
		expect(lastRequest().query).toEqual({
			start_day_interval: '20357',
			current_batch_day: '20360',
		});
		expect(result.moderated_images).toHaveLength(1);
		expect(result.moderated_images?.[0]).toMatchObject({
			request_file_id: requestFileId,
			approval_status: 'approved',
		});
		expect(result.unmoderated_images).toEqual([]);
		expect(result.moderated_images_count).toBe(1);
		expect(result.unmoderated_images_count).toBe(0);
	});
});

describe('predictions.getFileByPageId', () => {
	it('GETs the page by id', async () => {
		respond(predictionEnvelope);

		const result = await invoke(Predictions.getFileByPageId, {
			model_id: modelId,
			id: PAGE_ID,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: `/api/v2/Inferences/Model/${modelId}/ImageLevelInferences/${PAGE_ID}`,
		});
		expect(result.result?.[0]?.id).toBe(PAGE_ID);
		expect(result.result?.[0]?.prediction?.[0]?.label).toBe('total_amount');
	});

	it('surfaces a 404 model-missing error', async () => {
		respond(error404, 404);

		const error = await rejectsWith(
			invoke(Predictions.getFileByPageId, {
				model_id: modelId,
				id: 'missing-page',
			}),
		);
		expect(error.status).toBe(404);
		expect(error.code).toBe(404);
		expect(error.body).toEqual(error404);
	});
});

describe('predictions.getFileByFileId', () => {
	it('GETs GetPredictions by request file id', async () => {
		respond(predictionEnvelope);

		const result = await invoke(Predictions.getFileByFileId, {
			model_id: modelId,
			request_file_id: requestFileId,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: `/api/v2/Inferences/Model/${modelId}/InferenceRequestFiles/GetPredictions/${requestFileId}`,
		});
		expect(result.result?.[0]?.request_file_id).toBe(requestFileId);
	});

	it('surfaces a 404 for an unknown file', async () => {
		respond(error404, 404);

		const error = await rejectsWith(
			invoke(Predictions.getFileByFileId, {
				model_id: modelId,
				request_file_id: 'missing-file',
			}),
		);
		expect(error).toBeInstanceOf(NanonetsAPIError);
		expect(error.status).toBe(404);
	});
});

describe('models.uploadTrainingUrls', () => {
	it('POSTs a bare JSON array of urls to UploadUrls/', async () => {
		respond(modelObject);

		const result = await invoke(Models.uploadTrainingUrls, {
			model_id: modelId,
			urls: [
				'https://img.example/train-1.png',
				'https://img.example/train-2.png',
			],
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/api/v2/OCR/Model/${modelId}/UploadUrls/`,
		});
		const body = lastInit().body;
		expect(typeof body).toBe('string');
		expect(JSON.parse(body as string)).toEqual([
			'https://img.example/train-1.png',
			'https://img.example/train-2.png',
		]);
		expect(lastRequest().contentType).toBe('application/json');
		expect(result.state).toBe(5);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'nanonets.models.uploadTrainingUrls',
			{ model_id: modelId, urls: 2 },
			'completed',
		);
	});
});

describe('models.train', () => {
	it('POSTs Train/ with no body and parses the model object', async () => {
		respond(modelObject);

		const result = await invoke(Models.train, { model_id: modelId });

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/api/v2/OCR/Model/${modelId}/Train/`,
		});
		expect(lastInit().body).toBeUndefined();
		expect(result.state).toBe(5);
		expect(result.message).toBe('Model trained successfully');
	});

	it('surfaces a 400 model-not-ready error', async () => {
		respond(error400, 400);

		const error = await rejectsWith(
			invoke(Models.train, { model_id: modelId }),
		);
		expect(error.status).toBe(400);
		expect(error.code).toBe(400);
		expect(error.message).toBe('Nanonets 400: No file attached');
	});
});

describe('models.updateGuidelines', () => {
	it('POSTs the guidelines to the ObjectDetection model endpoint', async () => {
		respond(modelObject);

		const result = await invoke(Models.updateGuidelines, {
			model_id: modelId,
			field_instructions: 'Extract the invoice total.',
			table_instructions: 'Extract line items as a table.',
			ai_guidelines: true,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/api/v2/ObjectDetection/Model/${modelId}`,
		});
		const body = lastInit().body;
		expect(JSON.parse(body as string)).toEqual({
			field_instructions: 'Extract the invoice total.',
			table_instructions: 'Extract line items as a table.',
			ai_guidelines: true,
		});
		expect(result.state).toBe(5);
	});
});

describe('files.approve', () => {
	it('POSTs Verify/{id} and resolves an empty 200 body', async () => {
		respondEmpty();

		const result = await invoke(Files.approve, {
			model_id: modelId,
			request_file_id: requestFileId,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/api/v2/Inferences/Model/${modelId}/ImageLevelInferences/Verify/${requestFileId}`,
		});
		expect(lastInit().body).toBeUndefined();
		expect(result).toEqual({});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'nanonets.files.approve',
			{ model_id: modelId, request_file_id: requestFileId },
			'completed',
		);
	});
});

describe('files.unapprove', () => {
	it('POSTs UnVerify/{id} and resolves an empty 200 body', async () => {
		respondEmpty();

		const result = await invoke(Files.unapprove, {
			model_id: modelId,
			request_file_id: requestFileId,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/api/v2/Inferences/Model/${modelId}/ImageLevelInferences/UnVerify/${requestFileId}`,
		});
		expect(result).toEqual({});
	});
});

describe('files.delete', () => {
	it('DELETEs InferenceRequestFiles/{file_id}', async () => {
		respondEmpty();

		const result = await invoke(Files.delete, {
			model_id: modelId,
			file_id: requestFileId,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'DELETE',
			path: `/api/v2/Inferences/Model/${modelId}/InferenceRequestFiles/${requestFileId}`,
		});
		expect(result).toEqual({});
	});

	it('surfaces a 404 for an unknown file', async () => {
		respond(error404, 404);

		const error = await rejectsWith(
			invoke(Files.delete, {
				model_id: modelId,
				file_id: 'missing-file',
			}),
		);
		expect(error.status).toBe(404);
		expect(error.body).toEqual(error404);
	});
});

describe('files.updateFields', () => {
	it('PATCHes the boxes as JSON text with use_ui_version=true', async () => {
		respondEmpty();

		const moderated_boxes = [
			{
				id: 'c3a7e1f5-2b49-4d58-8e6a-0f9c4b2d7a33',
				label: 'total_amount',
				xmin: 412,
				ymin: 88,
				xmax: 528,
				ymax: 104,
				ocr_text: '120.00',
			},
			{ label: 'tax_amount', ocr_text: '9.60', is_new: true },
		];

		const result = await invoke(Files.updateFields, {
			model_id: modelId,
			moderated_boxes,
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'PATCH',
			path: `/api/v2/Inferences/Model/${modelId}/ImageLevelInference`,
		});
		expect(lastRequest().query).toEqual({ use_ui_version: 'true' });
		const body = lastInit().body;
		expect(body).toBe(JSON.stringify({ moderated_boxes }));
		expect(lastRequest().contentType).toBe('text/plain;charset=UTF-8');
		expect(result).toEqual({});
	});
});

describe('files.assign', () => {
	it('POSTs member and file_ids to the team endpoint', async () => {
		respondEmpty();

		const result = await invoke(Files.assign, {
			model_id: modelId,
			member: 'ops@example.com',
			file_ids: [requestFileId],
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/api/v2/team/members/model/${modelId}/assign/files`,
		});
		const body = lastInit().body;
		expect(JSON.parse(body as string)).toEqual({
			member: 'ops@example.com',
			file_ids: [requestFileId],
		});
		expect(result).toEqual({});
	});
});

describe('files.retryExports', () => {
	it('POSTs file_ids to retryallexports', async () => {
		respondEmpty();

		const result = await invoke(Files.retryExports, {
			model_id: modelId,
			file_ids: [requestFileId],
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/api/v2/Inferences/Model/${modelId}/ImageLevelInferences/retryallexports`,
		});
		const body = lastInit().body;
		expect(JSON.parse(body as string)).toEqual({ file_ids: [requestFileId] });
		expect(result).toEqual({});
	});
});

describe('files.retryPredictions', () => {
	it('POSTs file_ids to RetryPrediction', async () => {
		respondEmpty();

		const result = await invoke(Files.retryPredictions, {
			model_id: modelId,
			file_ids: [requestFileId],
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: `/api/v2/ObjectDetection/Model/${modelId}/RetryPrediction`,
		});
		const body = lastInit().body;
		expect(JSON.parse(body as string)).toEqual({ file_ids: [requestFileId] });
		expect(result).toEqual({});
	});
});

describe('integrations.list', () => {
	it('GETs externalIntegrations and wraps the array', async () => {
		respond(integrationsArray);

		const result = await invoke(Integrations.list, {});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/api/v2/externalIntegrations',
		});
		expect(lastInit().body).toBeUndefined();
		expect(result.integrations).toHaveLength(1);
		expect(result.integrations[0]).toMatchObject({
			id: '5c1f8b2e-9a4d-4e67-8b3c-2f6d0a9e7b41',
			type: 'postgresql',
			status: 'active',
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'nanonets.integrations.list',
			{ count: 1 },
			'completed',
		);
	});

	it('rejects a wrapped payload instead of reading it as an empty list', async () => {
		respond({ data: integrationsArray });

		await expect(invoke(Integrations.list, {})).rejects.toBeInstanceOf(Error);
	});
});

describe('integrations.executeQuery', () => {
	it('POSTs the query and wraps the rows', async () => {
		respond(queryRows);

		const result = await invoke(Integrations.executeQuery, {
			external_integration_id: '5c1f8b2e-9a4d-4e67-8b3c-2f6d0a9e7b41',
			query: 'select * from passports',
		});

		expectAuthenticated();
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/api/v2/externalIntegrations/5c1f8b2e-9a4d-4e67-8b3c-2f6d0a9e7b41/executequery',
		});
		const body = lastInit().body;
		expect(JSON.parse(body as string)).toEqual({
			query: 'select * from passports',
		});
		expect(result.rows).toHaveLength(2);
		expect(result.rows[0]).toMatchObject({
			passport_number: 'N8734459',
			nationality: 'ITA',
		});
	});

	it('rejects a wrapped rows payload instead of reading it as none', async () => {
		respond({ data: queryRows });

		await expect(
			invoke(Integrations.executeQuery, {
				external_integration_id: '5c1f8b2e-9a4d-4e67-8b3c-2f6d0a9e7b41',
				query: 'select * from passports',
			}),
		).rejects.toBeInstanceOf(Error);
	});

	it('treats an empty body as zero rows', async () => {
		respondEmpty();

		await expect(
			invoke(Integrations.executeQuery, {
				external_integration_id: '5c1f8b2e-9a4d-4e67-8b3c-2f6d0a9e7b41',
				query: 'select * from passports',
			}),
		).resolves.toEqual({ rows: [] });
	});

	it('surfaces a 404 for an unknown integration', async () => {
		respond(error404, 404);

		const error = await rejectsWith(
			invoke(Integrations.executeQuery, {
				external_integration_id: 'missing-integration',
				query: 'select 1',
			}),
		);
		expect(error.status).toBe(404);
		expect(error.body).toEqual(error404);
	});
});

describe('input validation', () => {
	it('rejects a missing model_id without fetching', async () => {
		await expect(
			invoke(Predictions.listFiles, {
				start_day_interval: 20357,
				current_batch_day: 20360,
			}),
		).rejects.toBeInstanceOf(Error);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects an empty urls array without fetching', async () => {
		await expect(
			invoke(Predictions.createFromUrls, { model_id: modelId, urls: [] }),
		).rejects.toBeInstanceOf(Error);
		await expect(
			invoke(Models.uploadTrainingUrls, { model_id: modelId, urls: [] }),
		).rejects.toBeInstanceOf(Error);
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects ai_guidelines: false without fetching', async () => {
		await expect(
			invoke(Models.updateGuidelines, {
				model_id: modelId,
				field_instructions: 'Extract the total.',
				table_instructions: 'Extract line items.',
				ai_guidelines: false,
			}),
		).rejects.toBeInstanceOf(Error);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});
