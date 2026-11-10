import { Campaigns, ReceiptValidation, Simple, Verbose } from './endpoints';
import type {
	CampaignValidateFileResponse,
	ReceiptValidateUrlResponse,
} from './endpoints/types';
import {
	CAMPAIGN_IDS,
	CAMPAIGN_SETTINGS,
	CAMPAIGN_VALIDATION_PASSED,
	CREATE_ACK,
	DELETE_ACK,
	RECEIPT_VALIDATION_VERDICTS,
	SIMPLE_RECEIPT,
	UPDATE_ACK,
	VERBOSE_RECEIPT,
} from './test-fixtures';
import {
	captureError,
	invoke,
	lastRequest,
	pngFile,
	respond,
	spyOnFetch,
} from './test-support';

const API_KEY = 'taggun-test-key';

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	fetchMock.mockRestore();
});

function sent() {
	return lastRequest(fetchMock);
}

function expectAuthenticated() {
	const request = sent();
	expect(request.origin).toBe('https://api.taggun.io');
	// Taggun reads the key from this header; the request must not carry it as a
	// bearer token or a query parameter, where it would land in logs.
	expect(request.headers.get('apikey')).toBe(API_KEY);
	expect(request.headers.get('authorization')).toBeNull();
	expect(request.query).toEqual({});
}

describe('simple.url', () => {
	it('POSTs the URL as JSON and keeps the core fields', async () => {
		respond(fetchMock, SIMPLE_RECEIPT);

		const result = (await invoke(Simple.url, {
			url: 'https://files.example.com/receipt.png',
		})) as { totalAmount?: { data?: number } };

		expectAuthenticated();
		expect(sent()).toMatchObject({
			method: 'POST',
			path: '/api/receipt/v1/simple/url',
		});
		expect(sent().contentType).toBe('application/json');
		expect(sent().json()).toEqual({
			url: 'https://files.example.com/receipt.png',
		});
		expect(result.totalAmount?.data).toBe(14.42);
	});

	it('forwards every documented hint, including headers for a protected URL', async () => {
		respond(fetchMock, SIMPLE_RECEIPT);

		await invoke(Simple.url, {
			url: 'https://files.example.com/receipt.png',
			headers: { Authorization: 'Bearer storage-token' },
			language: 'en',
			near: 'Kalamazoo, MI, USA',
			ipAddress: '32.4.2.223',
			ignoreMerchantName: 'Cicily',
			refresh: true,
			incognito: true,
			userId: 'user-1',
			containerId: 'container-1',
			subAccountId: 'sub-1',
			referenceId: 'ref-1',
			extractTime: true,
		});

		expect(sent().json()).toEqual({
			url: 'https://files.example.com/receipt.png',
			headers: { Authorization: 'Bearer storage-token' },
			language: 'en',
			near: 'Kalamazoo, MI, USA',
			ipAddress: '32.4.2.223',
			ignoreMerchantName: 'Cicily',
			refresh: true,
			incognito: true,
			userId: 'user-1',
			containerId: 'container-1',
			subAccountId: 'sub-1',
			referenceId: 'ref-1',
			extractTime: true,
		});
	});

	it('leaves unsent hints out of the body rather than sending null', async () => {
		respond(fetchMock, SIMPLE_RECEIPT);

		await invoke(Simple.url, { url: 'https://files.example.com/receipt.png' });

		expect(Object.keys(sent().json())).toEqual(['url']);
	});
});

describe('simple.encoded', () => {
	it('POSTs the base64 document as JSON with its name and type', async () => {
		respond(fetchMock, SIMPLE_RECEIPT);

		await invoke(Simple.encoded, {
			image: 'aGVsbG8=',
			filename: 'receipt.jpg',
			contentType: 'image/jpeg',
		});

		expectAuthenticated();
		expect(sent()).toMatchObject({
			method: 'POST',
			path: '/api/receipt/v1/simple/encoded',
		});
		expect(sent().json()).toEqual({
			image: 'aGVsbG8=',
			filename: 'receipt.jpg',
			contentType: 'image/jpeg',
		});
	});
});

describe('simple.file', () => {
	it('uploads the file as multipart and sends hints as form fields', async () => {
		respond(fetchMock, SIMPLE_RECEIPT);

		await invoke(Simple.file, {
			file: pngFile(),
			incognito: true,
			extractTime: true,
			subAccountId: 'sub-1',
		});

		expectAuthenticated();
		expect(sent()).toMatchObject({
			method: 'POST',
			path: '/api/receipt/v1/simple/file',
		});
		// No media type is set by hand: fetch generates the multipart boundary,
		// and a hand-set Content-Type would omit it.
		expect(sent().contentType).toBe('');
		const form = sent().form();
		expect(form).toBeInstanceOf(FormData);
		expect(form.get('incognito')).toBe('true');
		expect(form.get('extractTime')).toBe('true');
		expect(form.get('subAccountId')).toBe('sub-1');
		expect(form.get('file')).toBeInstanceOf(Blob);
		// An unsent hint must not arrive as the string "undefined".
		expect(form.get('language')).toBeNull();
	});
});

describe('verbose.url', () => {
	it('POSTs the URL and returns line items and the tracking id', async () => {
		respond(fetchMock, VERBOSE_RECEIPT);

		const result = (await invoke(Verbose.url, {
			url: 'https://files.example.com/receipt.png',
			extractLineItems: false,
		})) as {
			trackingId?: string;
			entities?: {
				productLineItems?: { data?: { name?: { data?: string } } }[];
			};
		};

		expectAuthenticated();
		expect(sent()).toMatchObject({
			method: 'POST',
			path: '/api/receipt/v1/verbose/url',
		});
		expect(sent().json()).toEqual({
			url: 'https://files.example.com/receipt.png',
			extractLineItems: false,
		});
		expect(result.trackingId).toBe('T-20241008-6053437');
		expect(result.entities?.productLineItems).toHaveLength(2);
	});

	it('omits extractLineItems when unset, keeping the provider default', async () => {
		respond(fetchMock, VERBOSE_RECEIPT);

		await invoke(Verbose.url, { url: 'https://files.example.com/receipt.png' });

		expect(sent().json()).toEqual({
			url: 'https://files.example.com/receipt.png',
		});
	});
});

describe('verbose.encoded', () => {
	it('POSTs the base64 document as JSON', async () => {
		respond(fetchMock, VERBOSE_RECEIPT);

		await invoke(Verbose.encoded, {
			image: 'aGVsbG8=',
			filename: 'invoice.pdf',
			contentType: 'application/pdf',
		});

		expectAuthenticated();
		expect(sent()).toMatchObject({
			method: 'POST',
			path: '/api/receipt/v1/verbose/encoded',
		});
		expect(sent().json()).toEqual({
			image: 'aGVsbG8=',
			filename: 'invoice.pdf',
			contentType: 'application/pdf',
		});
	});
});

describe('verbose.file', () => {
	it('uploads the file as multipart with extractLineItems', async () => {
		respond(fetchMock, VERBOSE_RECEIPT);

		await invoke(Verbose.file, { file: pngFile(), extractLineItems: false });

		expectAuthenticated();
		expect(sent()).toMatchObject({
			method: 'POST',
			path: '/api/receipt/v1/verbose/file',
		});
		const form = sent().form();
		expect(form.get('extractLineItems')).toBe('false');
		expect(form.get('file')).toBeInstanceOf(Blob);
	});
});

describe('campaigns.list', () => {
	it('GETs the settings list and returns the campaign ids', async () => {
		respond(fetchMock, CAMPAIGN_IDS);

		const result = await invoke(Campaigns.list, {});

		expectAuthenticated();
		expect(sent()).toMatchObject({
			method: 'GET',
			path: '/api/validation/v1/campaign/settings/list',
		});
		expect(result).toEqual(CAMPAIGN_IDS);
	});
});

describe('campaigns.get', () => {
	it('GETs one campaign by the id in the path', async () => {
		respond(fetchMock, CAMPAIGN_SETTINGS);

		const result = (await invoke(Campaigns.get, {
			campaignId: 'coffee june/2026',
		})) as { merchantNames?: { allowList?: string[] } };

		expectAuthenticated();
		expect(sent().method).toBe('GET');
		// The id is user-chosen text, so a slash in it must not add a path
		// segment and reach a different route.
		expect(sent().path).toBe(
			'/api/validation/v1/campaign/settings/coffee%20june%2F2026',
		);
		expect(result.merchantNames?.allowList).toEqual(['Fresh Market']);
	});
});

describe('campaigns.create', () => {
	it('POSTs the settings object to the create path', async () => {
		respond(fetchMock, CREATE_ACK, 201);

		const result = (await invoke(Campaigns.create, {
			campaignId: 'coffee-june-2026',
			settings: CAMPAIGN_SETTINGS,
		})) as { statusCode?: number };

		expectAuthenticated();
		expect(sent()).toMatchObject({
			method: 'POST',
			path: '/api/validation/v1/campaign/settings/create/coffee-june-2026',
		});
		expect(sent().json()).toEqual(CAMPAIGN_SETTINGS);
		expect(result.statusCode).toBe(201);
	});
});

describe('campaigns.update', () => {
	it('PUTs the settings object to the update path', async () => {
		respond(fetchMock, UPDATE_ACK);

		const result = (await invoke(Campaigns.update, {
			campaignId: 'coffee-june-2026',
			settings: { merchantNames: { allowList: ['Fresh Market'] } },
		})) as { result?: string };

		expectAuthenticated();
		expect(sent()).toMatchObject({
			method: 'PUT',
			path: '/api/validation/v1/campaign/settings/update/coffee-june-2026',
		});
		// A replace, so only the sections the caller named are sent.
		expect(sent().json()).toEqual({
			merchantNames: { allowList: ['Fresh Market'] },
		});
		expect(result.result).toContain('Successfully updated');
	});
});

describe('campaigns.delete', () => {
	it('DELETEs the update-style path and returns the acknowledgement', async () => {
		respond(fetchMock, DELETE_ACK);

		// `delete` is a reserved word, so the function is named `remove` and
		// registered under the `delete:` key.
		const result = (await invoke(Campaigns.remove, {
			campaignId: 'coffee-june-2026',
		})) as { result?: string };

		expectAuthenticated();
		expect(sent()).toMatchObject({
			method: 'DELETE',
			path: '/api/validation/v1/campaign/settings/delete/coffee-june-2026',
		});
		expect(result.result).toContain('Successfully remove');
	});
});

describe('campaigns.validateFile', () => {
	it('uploads the file with campaignId in the form', async () => {
		respond(fetchMock, CAMPAIGN_VALIDATION_PASSED);

		const result = (await invoke(Campaigns.validateFile, {
			campaignId: 'october-cola-24',
			file: pngFile(),
			language: 'en',
			incognito: true,
		})) as { successful?: boolean };

		expectAuthenticated();
		expect(sent()).toMatchObject({
			method: 'POST',
			path: '/api/validation/v1/campaign/receipt-validation/file',
		});
		const form = sent().form();
		expect(form.get('campaignId')).toBe('october-cola-24');
		expect(form.get('language')).toBe('en');
		expect(form.get('incognito')).toBe('true');
		expect(form.get('file')).toBeInstanceOf(Blob);
		expect(result.successful).toBe(true);
	});
});

describe('campaigns.validateUrl', () => {
	it('POSTs campaignId and the URL as JSON', async () => {
		respond(fetchMock, CAMPAIGN_VALIDATION_PASSED);

		await invoke(Campaigns.validateUrl, {
			campaignId: 'october-cola-24',
			url: 'https://example.com/receipts/receipt-123.jpg',
			referenceId: 'ref-1',
		});

		expectAuthenticated();
		expect(sent()).toMatchObject({
			method: 'POST',
			path: '/api/validation/v1/campaign/receipt-validation/url',
		});
		expect(sent().json()).toEqual({
			campaignId: 'october-cola-24',
			url: 'https://example.com/receipts/receipt-123.jpg',
			referenceId: 'ref-1',
		});
	});
});

describe('receiptValidation.file', () => {
	it('serialises the inline rules into the multipart validation field', async () => {
		respond(fetchMock, CAMPAIGN_VALIDATION_PASSED);

		const rules = {
			date: {
				start: '2026-06-01T00:00:00.000Z',
				end: '2026-06-30T23:59:59.999Z',
			},
			merchantName: { allowed: ['H-E-B'] },
		};

		await invoke(ReceiptValidation.file, {
			file: pngFile(),
			validation: rules,
			additionalExtractionFields: ['modelNumber'],
			subAccountId: 'sub-1',
		});

		expectAuthenticated();
		expect(sent()).toMatchObject({
			method: 'POST',
			path: '/api/validation/v1/receipt-validation/file',
		});
		const form = sent().form();
		// A multipart field cannot carry an object, so the rules travel as JSON.
		expect(JSON.parse(String(form.get('validation')))).toEqual(rules);
		expect(JSON.parse(String(form.get('additionalExtractionFields')))).toEqual([
			'modelNumber',
		]);
		expect(form.get('subAccountId')).toBe('sub-1');
		expect(form.get('file')).toBeInstanceOf(Blob);
	});
});

describe('receiptValidation.url', () => {
	it('POSTs the URL and the inline rules as JSON', async () => {
		respond(fetchMock, CAMPAIGN_VALIDATION_PASSED);

		const rules = { merchantName: { allowed: ['H-E-B'] } };

		await invoke(ReceiptValidation.url, {
			url: 'https://example.com/receipts/receipt-123.png',
			validation: rules,
			incognito: false,
		});

		expectAuthenticated();
		expect(sent()).toMatchObject({
			method: 'POST',
			path: '/api/validation/v1/receipt-validation/url',
		});
		expect(sent().json()).toEqual({
			url: 'https://example.com/receipts/receipt-123.png',
			validation: rules,
			incognito: false,
		});
	});
});

describe('the validation result', () => {
	it('reads fields wrapped with their verdict, as the generated spec types them', async () => {
		respond(fetchMock, RECEIPT_VALIDATION_VERDICTS);

		const result = (await invoke(ReceiptValidation.url, {
			url: 'https://example.com/receipts/receipt-123.png',
			validation: { merchantName: { allowed: ['H-E-B'] } },
		})) as ReceiptValidateUrlResponse;

		expect(result.successful).toBe(false);
		expect(result.merchantName).toEqual(
			RECEIPT_VALIDATION_VERDICTS.merchantName,
		);
		expect(result.receiptNumber).toBe(21556789);
		expect(result.smartValidate?.is_credit_card).toEqual({
			data: true,
			valid: true,
			expected: 'true',
		});
	});

	it('still reads the bare values of the campaign examples', async () => {
		respond(fetchMock, CAMPAIGN_VALIDATION_PASSED);

		const result = (await invoke(Campaigns.validateFile, {
			campaignId: 'coffee-june-2026',
			file: pngFile(),
		})) as CampaignValidateFileResponse;

		expect(result.merchantName).toBe('Walmart');
		expect(result.smartValidate?.is_credit_card).toBe(true);
	});
});

describe('an error path', () => {
	it('surfaces a 403 as a TaggunAPIError rather than a bare fetch failure', async () => {
		respond(fetchMock, { message: 'Invalid authentication credentials' }, 403);

		const error = await captureError(invoke(Campaigns.list, {}));

		expect(error).toBeInstanceOf(Error);
		expect((error as Error).message).toContain(
			'Invalid authentication credentials',
		);
	});
});
