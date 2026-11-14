import { AuthMissingError, logEventFromContext } from 'corsair/core';
import { ApiError } from 'corsair/http';
import {
	clearGagelistToken,
	GagelistAPIError,
	isReplayableGagelistError,
} from './client';
import { Account, Calibrations, Gages } from './endpoints';
import { errorHandlers } from './error-handlers';
import {
	accountStatus,
	calibrationDetail,
	calibrations,
	customFields,
	customValuesUpdated,
	gageDetail,
	gages,
	invalidClient,
	notFound,
	refused,
	unauthorized,
	updated,
} from './test-fixtures';

jest.mock('corsair/core', () => ({
	...jest.requireActual('corsair/core'),
	logEventFromContext: jest.fn().mockResolvedValue(null),
}));

const mockLog = jest.mocked(logEventFromContext);
const CLIENT_ID = 'gagelist-client-id';
const CLIENT_SECRET = 'gagelist-client-secret';

// never parameters: every concrete endpoint is assignable to this because
// parameters are contravariant. Each endpoint returns its own output type, so
// the shared return is unknown.
type AnyEndpoint = (ctx: never, input: never) => Promise<unknown>;

// unknown: negative cases pass values no schema accepts.
function invoke(endpoint: AnyEndpoint, input: unknown) {
	return endpoint(
		contextFor(CLIENT_ID, CLIENT_SECRET) as never,
		input as never,
	);
}

// The endpoints read the client pair the key builder put in `ctx.key`.
function contextFor(clientId: string, clientSecret?: string) {
	return {
		key: JSON.stringify({ clientId, clientSecret }),
		options: {},
	};
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

// unknown: a token response body is arbitrary JSON.
function respondToken(accessToken = 'token-1') {
	respond({
		access_token: accessToken,
		token_type: 'bearer',
		expires_in: 3600,
	});
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
		rawBody: init.body,
		// unknown: the request body is whatever the endpoint serialized.
		jsonBody:
			init.body && String(init.body).startsWith('{')
				? (JSON.parse(String(init.body)) as unknown)
				: undefined,
	};
}

/** The caught rejection, without a cast at each call site. */
// unknown: a promise can reject with any value, so the rejection reason has no
// static type; each caller asserts only on the fields it checks.
async function caught(promise: Promise<unknown>): Promise<unknown> {
	return promise.catch((error: unknown) => error);
}

beforeEach(() => {
	fetchMock = jest.spyOn(globalThis, 'fetch');
	mockLog.mockClear();
	// Each test starts without a cached token, so the token call is visible.
	clearGagelistToken({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET });
});

afterEach(() => {
	fetchMock.mockRestore();
});

describe('the token', () => {
	it('mints a bearer token from the client pair before the first call', async () => {
		respondToken();
		respond(gages);

		await invoke(Gages.list, {});
		const calls = fetchMock.mock.calls as [string, RequestInit][];

		// The first call is the token endpoint, form-encoded rather than JSON.
		const [tokenUrl, tokenInit] = calls[0] as [string, RequestInit];
		expect(tokenUrl).toBe('https://gagelist.net/api/token');
		expect(tokenInit.method).toBe('POST');
		expect(new Headers(tokenInit.headers).get('content-type')).toContain(
			'application/x-www-form-urlencoded',
		);
		const form = new URLSearchParams(String(tokenInit.body));
		expect(form.get('grant_type')).toBe('password');
		expect(form.get('client_id')).toBe(CLIENT_ID);
		expect(form.get('client_secret')).toBe(CLIENT_SECRET);

		// The second carries the token.
		expect(lastRequest().headers.get('authorization')).toBe('Bearer token-1');
	});

	it('reuses the token across calls', async () => {
		respondToken();
		respond(gages);

		await invoke(Gages.list, {});
		respond(gages);
		await invoke(Gages.list, {});

		// One token call and two API calls.
		expect(fetchMock).toHaveBeenCalledTimes(3);
	});

	it('surfaces a refused client pair', async () => {
		respond(invalidClient, 400);

		await expect(invoke(Gages.list, {})).rejects.toMatchObject({
			name: 'ApiError',
			status: 400,
			body: { error: 'invalid_client' },
			message:
				'GageList 400: GageList refused a field in the request (invalid_client)',
		});
	});

	it('throws when the token response carries no access_token', async () => {
		respond({ token_type: 'bearer' });

		const error = await caught(invoke(Gages.list, {}));

		expect((error as Error).message).toContain('no access_token');
		expect(fetchMock).toHaveBeenCalledTimes(1);
	});

	it('mints a fresh token after a 401', async () => {
		respondToken();
		respond(unauthorized, 401);
		// The next call mints a new token, then succeeds.
		respondToken('token-2');
		respond(gages);

		await expect(invoke(Gages.list, {})).rejects.toMatchObject({ status: 401 });
		await invoke(Gages.list, {});

		expect(lastRequest().headers.get('authorization')).toBe('Bearer token-2');
	});

	it('does not hand a cached token to the same client id with another secret', async () => {
		respondToken('token-right');
		respond(accountStatus);
		await invoke(Account.accountStatus, {});

		// Same client id, wrong secret: GageList must see a new token request,
		// and its refusal must reach the caller.
		respond(invalidClient, 400);
		await expect(
			Account.accountStatus(
				contextFor(CLIENT_ID, 'someone-elses-guess') as never,
				{} as never,
			),
		).rejects.toBeInstanceOf(ApiError);
		expect(lastRequest().path).toBe('/api/token');
	});

	it('never puts the client secret in an error', async () => {
		respond(invalidClient, 400);

		const error = await caught(invoke(Gages.list, {}));

		expect(JSON.stringify(error)).not.toContain(CLIENT_SECRET);
		expect(String(error)).not.toContain(CLIENT_SECRET);
		expect(require('node:util').inspect(error)).not.toContain(CLIENT_SECRET);
	});
});

describe('credentials', () => {
	it('raises AuthMissingError, and sends nothing, when the pair has no secret', async () => {
		await expect(
			Account.accountStatus(contextFor(CLIENT_ID) as never, {} as never),
		).rejects.toBeInstanceOf(AuthMissingError);
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('gages.list', () => {
	it('POSTs the paging in the body and reports the next page', async () => {
		respondToken();
		respond(gages);

		const result = (await invoke(Gages.list, {
			start: 0,
			record_number: 2,
		})) as typeof gages & { next_start: number | null };

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/GageList/api/Gage/List',
			jsonBody: { start: 0, record_number: 2 },
		});
		expect(result.data).toHaveLength(2);
		// 42 total, 2 returned from 0, so another page exists.
		expect(result.next_start).toBe(2);
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'gagelist.gages.list',
			{ count: 2, total: 42 },
			'completed',
		);
	});

	it('uses the documented default page size when none is given', async () => {
		respondToken();
		respond(gages);

		await invoke(Gages.list, {});

		expect(lastRequest().jsonBody).toEqual({ start: 0, record_number: 50 });
	});

	it('reports no next page on the last one', async () => {
		respondToken();
		respond({ ...gages, total: 2, count: 2 });

		await expect(invoke(Gages.list, { start: 0 })).resolves.toMatchObject({
			next_start: null,
		});
	});

	it('marks a failed list as a replayable read, though it is a POST', async () => {
		respondToken();
		respond({ Message: 'Server error' }, 503);

		const error = await caught(invoke(Gages.list, {}));
		expect(error).toMatchObject({ status: 503, request: { method: 'POST' } });
		expect(isReplayableGagelistError(error as Error)).toBe(true);
	});

	it('rejects a negative start before calling', async () => {
		await expect(invoke(Gages.list, { start: -1 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('rejects a body that is not a gage list', async () => {
		respondToken();
		respond({ unexpected: true });

		await expect(invoke(Gages.list, {})).rejects.toMatchObject({
			name: 'ZodError',
		});
	});
});

describe('gages.get', () => {
	it('GETs one gage by ID', async () => {
		respondToken();
		respond(gageDetail);

		await expect(invoke(Gages.get, { id: 12 })).resolves.toMatchObject({
			data: { Id: 12, SerialNumber: 'SN-1001' },
		});
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/GageList/api/Gage/Detail/12',
		});
	});

	it('surfaces an unknown record', async () => {
		respondToken();
		respond(notFound, 404);

		await expect(invoke(Gages.get, { id: 999 })).rejects.toMatchObject({
			status: 404,
			message: 'GageList 404: no record with that ID',
		});
	});
});

describe('gages.create', () => {
	it('POSTs the record and returns the new ID', async () => {
		respondToken();
		respond({ data: 99, success: true, message: 'Gage created' });

		await expect(
			invoke(Gages.create, {
				SerialNumber: 'SN-1001',
				Type: 'Caliper',
				Manufacturer: 'Mitutoyo',
				Years: 1,
			}),
		).resolves.toMatchObject({ data: 99 });
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/GageList/api/Gage/Create',
			jsonBody: {
				SerialNumber: 'SN-1001',
				Type: 'Caliper',
				Manufacturer: 'Mitutoyo',
				Years: 1,
			},
		});
	});

	it('sends the DateAquired spelling GageList binds to', async () => {
		respondToken();
		respond({ data: 99, success: true, message: 'ok' });

		await invoke(Gages.create, { DateAquired: '2025-01-10T00:00:00Z' });

		expect(lastRequest().jsonBody).toEqual({
			DateAquired: '2025-01-10T00:00:00Z',
		});
	});

	it('surfaces a refused record', async () => {
		respondToken();
		respond(refused, 400);

		await expect(
			invoke(Gages.create, { SerialNumber: '' }),
		).rejects.toMatchObject({
			status: 400,
			message: 'GageList 400: GageList refused a field in the request',
		});
	});

	it('keeps the record GageList echoes out of the error', async () => {
		respondToken();
		respond(
			{
				Message: 'Invalid ResponsibleUser: person@example.test, serial SN-4471',
			},
			400,
		);

		const error = await caught(
			invoke(Gages.create, { SerialNumber: 'SN-4471' }),
		);

		expect(error).toBeInstanceOf(ApiError);
		const text = `${(error as Error).message} ${JSON.stringify(error)}`;
		expect(text).not.toContain('person@example.test');
		expect(text).not.toContain('SN-4471');
	});

	it('rejects a negative interval before calling', async () => {
		await expect(invoke(Gages.create, { Years: -1 })).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('gages.update', () => {
	it('POSTs the whole record with its Id', async () => {
		respondToken();
		respond(updated);

		await expect(
			invoke(Gages.update, { Id: 12, Location: 'Bench 4' }),
		).resolves.toMatchObject({ data: 0, success: true });

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/GageList/api/Gage/Update',
			jsonBody: { Id: 12, Location: 'Bench 4' },
		});
	});

	it('keeps the test templates on a create and update', async () => {
		respondToken();
		respond(updated);

		const TestTemplates = [
			{
				Id: 0,
				EquipmentRefId: 12,
				TestNumber: '1',
				Parameter: 'Length',
				ExpectedResult: '25.00',
				RefStandardID: 'GB-1',
			},
		];
		await invoke(Gages.update, { Id: 12, TestTemplates });

		expect(lastRequest().jsonBody).toEqual({ Id: 12, TestTemplates });
	});

	it('takes a record read from gages.get, nulls included, as the update body', async () => {
		respondToken();
		respond(updated);

		// A read answers null for empty fields, and the update takes the record back.
		const { Id, OtherInformation, ImageName, Location } = gageDetail.data;
		await invoke(Gages.update, {
			Id,
			OtherInformation,
			ImageName,
			Location: `${Location} (moved)`,
		});

		expect(lastRequest().jsonBody).toEqual({
			Id: 12,
			OtherInformation: null,
			Location: 'Bench 3 (moved)',
		});
	});

	it('rejects an update with no Id', async () => {
		await expect(
			invoke(Gages.update, { Location: 'Bench 4' }),
		).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('gages.delete', () => {
	it('POSTs to the Delete path rather than using DELETE', async () => {
		respondToken();
		respond(updated);

		await invoke(Gages.remove, { id: 12 });

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/GageList/api/Gage/Delete/12',
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'gagelist.gages.delete',
			{ gageId: 12 },
			'completed',
		);
	});
});

describe('calibrations', () => {
	it('lists the records and names the gage each belongs to', async () => {
		respondToken();
		respond(calibrations);

		const result = (await invoke(Calibrations.list, {})) as typeof calibrations;

		expect(result.data[0]?.EquipmentRefId).toBe(12);
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/GageList/api/Calibration/List',
		});
	});

	it('GETs one record', async () => {
		respondToken();
		respond(calibrationDetail);

		await expect(invoke(Calibrations.get, { id: 500 })).resolves.toMatchObject({
			data: { Id: 500, EquipmentAsFound: '0.01' },
		});
	});

	it('creates a record against a gage', async () => {
		respondToken();
		respond({ data: 501, success: true, message: 'ok' });

		await invoke(Calibrations.create, {
			EquipmentRefId: 12,
			EquipmentAsFound: '0.01',
			EquipmentAsLeft: '0.00',
			CalibrationDueDate: '2027-04-24T00:00:00Z',
		});

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/GageList/api/Calibration/Create',
		});
	});

	it('updates a record', async () => {
		respondToken();
		respond(updated);

		await invoke(Calibrations.update, { Id: 500, Uncertainty: '0.003' });

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/GageList/api/Calibration/Update',
		});
	});

	it('keeps the measured tests and the documented calibration fields on an update', async () => {
		respondToken();
		respond(updated);

		const CalibrationTests = [
			{
				Id: 0,
				CalibrationRefId: 500,
				TestNumber: '1',
				Parameter: 'Length',
				ExpectedResult: '25.00',
				RefStandardID: 'GB-1',
				AsFound: '25.01',
				AsLeft: '25.00',
				ChkAsLeft: 'true',
				PassFail: 'Pass',
			},
		];
		await invoke(Calibrations.update, {
			Id: 500,
			DateCalibrated: '2026-04-24T00:00:00Z',
			CalibrationTechinician: 'Lab tech',
			ControlNumber: 'CN-1001',
			CalibrationTests,
		});

		expect(lastRequest().jsonBody).toEqual({
			Id: 500,
			DateCalibrated: '2026-04-24T00:00:00Z',
			CalibrationTechinician: 'Lab tech',
			ControlNumber: 'CN-1001',
			CalibrationTests,
		});
	});

	it('deletes a record', async () => {
		respondToken();
		respond(updated);

		await invoke(Calibrations.remove, { id: 500 });

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/GageList/api/Calibration/Delete/500',
		});
	});

	it('returns the certificate PDF bytes intact, base64-encoded', async () => {
		respondToken();
		// A PDF header followed by the binary marker bytes a text decode mangles.
		const pdf = new Uint8Array([
			0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x34, 0x0a, 0x25, 0xe2, 0xe3,
			0xcf, 0xd3, 0x0a,
		]);
		fetchMock.mockResolvedValueOnce(
			new Response(pdf, {
				status: 200,
				headers: { 'Content-Type': 'application/pdf' },
			}),
		);

		await expect(
			invoke(Calibrations.certificate, { id: 500 }),
		).resolves.toEqual({
			certificate: Buffer.from(pdf).toString('base64'),
			encoding: 'base64',
			contentType: 'application/pdf',
			byteLength: pdf.byteLength,
		});
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/GageList/api/Calibration/GetCertificate/500',
		});
		expect(lastRequest().headers.get('Authorization')).toBe('Bearer token-1');
	});

	it('keeps a JSON string answer as text', async () => {
		respondToken();
		respond('JVBERi0xLjQK');

		await expect(
			invoke(Calibrations.certificate, { id: 500 }),
		).resolves.toEqual({
			certificate: 'JVBERi0xLjQK',
			encoding: 'text',
			contentType: 'application/json',
		});
	});

	it('keeps a non-string certificate body rather than losing it', async () => {
		respondToken();
		respond({ href: '/files/cert-500.pdf' });

		await expect(
			invoke(Calibrations.certificate, { id: 500 }),
		).resolves.toMatchObject({
			certificate: '{"href":"/files/cert-500.pdf"}',
			encoding: 'text',
		});
	});

	it('surfaces an unknown record on the certificate route', async () => {
		respondToken();
		respond(notFound, 404);

		const error = await caught(invoke(Calibrations.certificate, { id: 9 }));
		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({ status: 404 });
		expect((error as Error).message).toBe(
			'GageList 404: no record with that ID',
		);
	});

	it('maps a connection that drops while the PDF downloads to a retried transport failure', async () => {
		respondToken();
		const dropped = new TypeError('terminated');
		// unknown: a partial Response with only the fields the certificate route reads;
		// a full Response cannot be built with an arrayBuffer that rejects.
		fetchMock.mockResolvedValueOnce({
			ok: true,
			status: 200,
			statusText: 'OK',
			headers: new Headers({ 'Content-Type': 'application/pdf' }),
			arrayBuffer: () => Promise.reject(dropped),
		} as unknown as Response);

		const error = await caught(invoke(Calibrations.certificate, { id: 500 }));

		expect(error).toBeInstanceOf(GagelistAPIError);
		expect(error).toMatchObject({ transport: true, method: 'GET' });
		expect(errorHandlers.NETWORK_ERROR.match(error as Error)).toBe(true);
		await expect(
			errorHandlers.NETWORK_ERROR.handler(error as Error),
		).resolves.toMatchObject({ maxRetries: 2 });
	});
});

describe('manufacturers', () => {
	it('lists them', async () => {
		respondToken();
		respond({
			total: 1,
			count: 1,
			data: [{ Id: 7, Name: 'Mitutoyo', Website: 'https://mitutoyo.example' }],
			success: true,
		});

		await expect(invoke(Account.manufacturers, {})).resolves.toMatchObject({
			data: [{ Id: 7, Name: 'Mitutoyo' }],
		});
		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/GageList/api/Manufacturer/List',
		});
	});

	it('creates one', async () => {
		respondToken();
		respond({ data: 8, success: true });

		await invoke(Account.manufacturersCreate, { Name: 'Starrett' });

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/GageList/api/Manufacturer/Create',
			jsonBody: { Name: 'Starrett' },
		});
	});

	it('rejects a manufacturer with no name', async () => {
		await expect(invoke(Account.manufacturersCreate, {})).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});

	it('updates and deletes one', async () => {
		respondToken();
		respond(updated);
		await invoke(Account.manufacturersUpdate, { Id: 7, Name: 'Mitutoyo Corp' });
		expect(lastRequest()).toMatchObject({
			path: '/GageList/api/Manufacturer/Update',
		});

		respond(updated);
		await invoke(Account.manufacturersRemove, { id: 7 });
		expect(lastRequest()).toMatchObject({
			path: '/GageList/api/Manufacturer/Delete/7',
		});
	});
});

describe('customFields', () => {
	it('lists the fields with the ForType string GageList returns', async () => {
		respondToken();
		respond(customFields);

		const result = await invoke(Account.customFields, {});

		expect(result).toMatchObject({
			total: 2,
			data: [
				{ Id: 3, FieldName: 'Cost centre', ForType: 'Gage' },
				{ Id: 4, FieldName: 'Witness', ForType: 'Calibration' },
			],
		});
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/GageList/api/CustomField/GetCustomFields',
		});
	});

	it('POSTs a bare array, not an object', async () => {
		respondToken();
		respond(customValuesUpdated);

		await expect(
			invoke(Account.customFieldValues, {
				values: [
					{ Id: 0, FieldId: 3, RefID: 12, RefType: 1, FieldValue: 'CC-1' },
				],
			}),
		).resolves.toMatchObject({ data: [11, 12] });

		// This route takes the array itself, which is the one body of its kind.
		expect(lastRequest().rawBody).toBe(
			'[{"Id":0,"FieldId":3,"RefID":12,"RefType":1,"FieldValue":"CC-1"}]',
		);
	});

	it.each([
		[{ values: [] }],
		[
			{
				values: [{ Id: 0, FieldId: 3, RefID: 12, RefType: 3, FieldValue: 'x' }],
			},
		],
		[
			{
				values: [{ FieldId: 3, RefID: 12, RefType: 1, FieldValue: 'x' }],
			},
		],
	])('rejects %j before calling', async (input) => {
		await expect(invoke(Account.customFieldValues, input)).rejects.toThrow();
		expect(fetchMock).not.toHaveBeenCalled();
	});
});

describe('account.status', () => {
	it('reads the plan limits and usage', async () => {
		respondToken();
		respond(accountStatus);

		await expect(invoke(Account.accountStatus, {})).resolves.toMatchObject({
			data: { MaxGages: 5000, TotalGages: 42, GagesPastDue: 1 },
		});
		expect(mockLog).toHaveBeenCalledWith(
			expect.anything(),
			'gagelist.account.status',
			{ totalGages: 42, maxGages: 5000, pastDue: 1 },
			'completed',
		);
	});
});

describe('error envelopes', () => {
	it('reads the ASP.NET Message field', async () => {
		respondToken();
		respond(unauthorized, 401);

		await expect(invoke(Gages.list, {})).rejects.toMatchObject({
			name: 'ApiError',
			status: 401,
			message:
				'GageList 401: GageList refused the token or the client credentials',
		});
	});

	it('keeps no response or request body on the error, so an echoed record cannot follow it into a log', async () => {
		respondToken();
		respond(refused, 400);

		const error = (await caught(invoke(Gages.list, {}))) as ApiError;

		expect(error.body).toBeUndefined();
		expect(error.request).not.toHaveProperty('body');
	});

	it('marks a 5xx on a POST list route as replayable and a 5xx create as not', async () => {
		respondToken();
		respond({ Message: 'boom' }, 503);
		const listError = await caught(invoke(Gages.list, {}));
		expect(errorHandlers.SERVER_ERROR.match(listError as Error)).toBe(true);

		respond({ Message: 'boom' }, 503);
		const createError = await caught(
			invoke(Gages.create, { SerialNumber: 'SN-1' }),
		);
		expect(errorHandlers.SERVER_ERROR.match(createError as Error)).toBe(false);
	});

	it('marks a transport failure and keeps the method', async () => {
		respondToken();
		fetchMock.mockRejectedValueOnce(new TypeError('fetch failed'));

		await expect(invoke(Gages.list, {})).rejects.toMatchObject({
			transport: true,
			method: 'POST',
			message: 'fetch failed',
		});
	});

	it('carries the status on the typed error', async () => {
		respondToken();
		respond(notFound, 404);

		const error = await caught(invoke(Gages.get, { id: 1 }));

		expect(error).toBeInstanceOf(ApiError);
		expect(error).toMatchObject({ status: 404 });
	});
});
