import { logEventFromContext } from 'corsair/core';
import { clearGagelistToken, GagelistAPIError } from './client';
import { Account, Calibrations, Gages } from './endpoints';
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
	// The fake context carries what the endpoints read: the option pair, and the
	// stored pair behind it.
	const ctx = {
		key: CLIENT_ID,
		options: { clientId: CLIENT_ID, clientSecret: CLIENT_SECRET },
		keys: {
			get_api_key: jest.fn().mockResolvedValue(CLIENT_ID),
			get_api_secret: jest.fn().mockResolvedValue(CLIENT_SECRET),
		},
	};
	return endpoint(ctx as never, input as never);
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
			status: 400,
			message: 'GageList 400: invalid_client',
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
		const ctx = {
			key: CLIENT_ID,
			options: { clientId: CLIENT_ID, clientSecret: 'someone-elses-guess' },
			keys: {
				get_api_key: jest.fn().mockResolvedValue(null),
				get_api_secret: jest.fn().mockResolvedValue(null),
			},
		};
		await expect(
			Account.accountStatus(ctx as never, {} as never),
		).rejects.toBeInstanceOf(GagelistAPIError);
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
			message: 'GageList 404: Record not found',
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
			isValidationError: true,
			message: 'GageList 400: Serial number is required',
		});
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

		await invoke(Gages.update, { Id: 12, Location: 'Bench 4' });

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/GageList/api/Gage/Update',
			jsonBody: { Id: 12, Location: 'Bench 4' },
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

	it('deletes a record', async () => {
		respondToken();
		respond(updated);

		await invoke(Calibrations.remove, { id: 500 });

		expect(lastRequest()).toMatchObject({
			method: 'POST',
			path: '/GageList/api/Calibration/Delete/500',
		});
	});

	it('renders a certificate as a string', async () => {
		respondToken();
		respond('JVBERi0xLjQK');

		await expect(
			invoke(Calibrations.certificate, { id: 500 }),
		).resolves.toEqual({ certificate: 'JVBERi0xLjQK' });
		expect(lastRequest()).toMatchObject({
			method: 'GET',
			path: '/GageList/api/Calibration/GetCertificate/500',
		});
	});

	it('keeps a non-string certificate body rather than losing it', async () => {
		respondToken();
		respond({ href: '/files/cert-500.pdf' });

		await expect(
			invoke(Calibrations.certificate, { id: 500 }),
		).resolves.toEqual({ certificate: '{"href":"/files/cert-500.pdf"}' });
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
	it('lists the fields with their RefType', async () => {
		respondToken();
		respond(customFields);

		const result = (await invoke(
			Account.customFields,
			{},
		)) as typeof customFields;

		expect(result.data[0]?.RefType).toBe(1);
		expect(result.data[1]?.RefType).toBe(2);
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
			status: 401,
			isAuthError: true,
			message: 'GageList 401: Authorization has been denied for this request.',
		});
	});

	it('keeps no body on the error, so an echoed record cannot follow it into a log', async () => {
		respondToken();
		respond(refused, 400);

		const error = await caught(invoke(Gages.list, {}));

		expect(error).not.toHaveProperty('body');
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

		expect(error).toBeInstanceOf(GagelistAPIError);
		expect(error).toMatchObject({ status: 404, isNotFound: true });
	});
});
