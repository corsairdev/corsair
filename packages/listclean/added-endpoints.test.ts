/**
 * The seven operations added for full coverage of Listclean's spec
 * (https://api.listclean.xyz/v1/spec.json): the chunked CSV upload flow, the
 * CSV result download and the account profile. Each test checks the request
 * against the spec (method, path, body) and parses the spec's own example
 * response through the output schema.
 */

import { isCalendarDate } from './endpoints/types';
import { domainOf } from './endpoints/verify';
import {
	BASE,
	captureError,
	endpoints,
	installFetchMock,
	jsonResponse,
	lastCall,
	makeCtx,
	mockFetch,
	ok,
	restoreFetchMock,
	sentBody,
} from './test-helpers';

beforeEach(installFetchMock);
afterEach(restoreFetchMock);

// Spec examples, copied from the 200 responses in spec.json.
const UPLOADS_LIST = [
	{ upload_id: 1327, status: 'COMPLETED', progress: '100%' },
];
const UPLOAD_STATUS = {
	status: 'inprocess',
	progress: 21,
	chunk_details: { total_chunk_count: '2', uploaded_chunk_count: 0 },
	request_id: 312,
};
const PROFILE = {
	name: 'Joe',
	address: '245, Highway Street',
	city: 'New York',
	country: 'USA',
	phone_number: '1111 2222 3333',
	skype_id: 'mime_post',
	company_name: 'Your Company, LLP',
	website: 'example.com',
	twitter_handle: '@mime_post',
	linkedin: '',
	billing_name: '',
	billing_company_name: '',
	billing_address: '',
};

function messageOnly(message: string): Response {
	return jsonResponse({ success: 1, error_code: 0, message });
}

describe('uploads', () => {
	it('lists uploads with GET /uploads/ and reads both progress spellings', async () => {
		mockFetch(ok(UPLOADS_LIST));

		const result = await endpoints.uploads.listUploads(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/uploads/`);
		expect(lastCall().init.method).toBe('GET');
		expect(result).toEqual(UPLOADS_LIST);
	});

	it('starts an upload with POST /uploads/ and the documented body', async () => {
		mockFetch(ok({ upload_id: 1327 }));

		const result = await endpoints.uploads.startUpload(makeCtx(), {
			filename: 'My file.csv',
			file_type: 'csv',
			total_chunk_count: 24,
			max_chunk_size: 64000,
			separator_char: ',',
			enclosure_char: '"',
			escape_char: '',
			fast_process: 0,
		});

		expect(lastCall().url).toBe(`${BASE}/uploads/`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({
			filename: 'My file.csv',
			file_type: 'csv',
			total_chunk_count: 24,
			max_chunk_size: 64000,
			separator_char: ',',
			enclosure_char: '"',
			escape_char: '',
			fast_process: 0,
		});
		expect(result.upload_id).toBe(1327);
	});

	it('refuses a start with a missing required field or a two-character separator', async () => {
		const missing = await captureError(
			endpoints.uploads.startUpload(makeCtx(), {
				filename: 'a.csv',
				file_type: 'csv',
				total_chunk_count: 1,
			} as never),
		);
		expect((missing as Error).name).toBe('ZodError');

		const wide = await captureError(
			endpoints.uploads.startUpload(makeCtx(), {
				filename: 'a.csv',
				file_type: 'csv',
				total_chunk_count: 1,
				max_chunk_size: 10,
				separator_char: ';;',
			}),
		);
		expect((wide as Error).name).toBe('ZodError');
	});

	it('sends a chunk to POST /uploads/{upload_id} without the id in the body', async () => {
		mockFetch(messageOnly('Chunk uploaded successfully'));

		const result = await endpoints.uploads.uploadChunk(makeCtx(), {
			upload_id: 1327,
			chunk_sequence_number: 1,
			content: Buffer.from('email\nuser@example.com\n').toString('base64'),
			md5_checksum: '0a52067b38f4485d42eb5f7040d476b3',
		});

		expect(lastCall().url).toBe(`${BASE}/uploads/1327`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({
			chunk_sequence_number: 1,
			content: 'ZW1haWwKdXNlckBleGFtcGxlLmNvbQo=',
			md5_checksum: '0a52067b38f4485d42eb5f7040d476b3',
		});
		expect(result.message).toBe('Chunk uploaded successfully');
	});

	it('refuses a chunk that is not base64 or a checksum that is not md5', async () => {
		const raw = await captureError(
			endpoints.uploads.uploadChunk(makeCtx(), {
				upload_id: 1,
				chunk_sequence_number: 1,
				content: 'email,user@example.com',
			}),
		);
		expect((raw as Error).name).toBe('ZodError');

		const md5 = await captureError(
			endpoints.uploads.uploadChunk(makeCtx(), {
				upload_id: 1,
				chunk_sequence_number: 1,
				content: 'AAAA',
				md5_checksum: 'abc',
			}),
		);
		expect((md5 as Error).name).toBe('ZodError');
	});

	it('reads an upload status with GET /uploads/{upload_id}', async () => {
		mockFetch(ok(UPLOAD_STATUS));

		const result = await endpoints.uploads.getUpload(makeCtx(), {
			upload_id: 1327,
		});

		expect(lastCall().url).toBe(`${BASE}/uploads/1327`);
		expect(lastCall().init.method).toBe('GET');
		expect(result).toEqual(UPLOAD_STATUS);
	});
});

describe('lists.getListResultsCsv', () => {
	it('downloads GET /downloads/{list_id}/{type} and returns the CSV text', async () => {
		const csv = 'email,status,remarks\nuser@example.com,clean,Valid\n';
		mockFetch(
			new Response(csv, {
				status: 200,
				headers: { 'Content-Type': 'application/octet-stream' },
			}),
		);

		const result = await endpoints.lists.getListResultsCsv(makeCtx(), {
			list_id: 159261,
			type: 'dirty',
		});

		expect(lastCall().url).toBe(`${BASE}/downloads/159261/dirty`);
		expect(lastCall().init.method).toBe('GET');
		expect(result.csv).toBe(csv);
	});

	it('refuses a type outside clean, dirty and unknown', async () => {
		const error = await captureError(
			endpoints.lists.getListResultsCsv(makeCtx(), {
				list_id: 1,
				type: 'all',
			} as never),
		);
		expect((error as Error).name).toBe('ZodError');
	});
});

describe('account profile', () => {
	it('reads GET /account/profile/ and parses the spec example', async () => {
		mockFetch(ok(PROFILE));

		const result = await endpoints.account.getProfile(makeCtx(), {});

		expect(lastCall().url).toBe(`${BASE}/account/profile/`);
		expect(result).toEqual(PROFILE);
	});

	it('updates with POST /account/profile/, sending only the given fields', async () => {
		mockFetch(messageOnly('Profile updated successfully'));

		const result = await endpoints.account.updateProfile(makeCtx(), {
			company_name: 'Example Co',
			website: 'example.com',
		});

		expect(lastCall().url).toBe(`${BASE}/account/profile/`);
		expect(lastCall().init.method).toBe('POST');
		expect(sentBody()).toEqual({
			company_name: 'Example Co',
			website: 'example.com',
		});
		expect(result.message).toBe('Profile updated successfully');
	});

	it('refuses an empty update', async () => {
		const empty = await captureError(
			endpoints.account.updateProfile(makeCtx(), {}),
		);
		expect((empty as Error).name).toBe('ZodError');
	});
});

describe('input checks from review', () => {
	it('rejects impossible calendar dates and keeps leap days', async () => {
		expect(isCalendarDate('2024-02-29')).toBe(true);
		expect(isCalendarDate('2026-02-29')).toBe(false);
		expect(isCalendarDate('2026-13-01')).toBe(false);
		expect(isCalendarDate('2026-04-31')).toBe(false);

		const error = await captureError(
			endpoints.verify.getVerificationLogs(makeCtx(), {
				start_date: '2026-13-01',
				end_date: '2026-11-05',
			}),
		);
		expect((error as Error).name).toBe('ZodError');
	});

	it('accepts an end_date of today in a zone ahead of UTC, and refuses one further out', async () => {
		const ahead = new Date(Date.now() + 10 * 3_600_000)
			.toISOString()
			.slice(0, 10);
		const start = new Date(Date.now() - 5 * 86_400_000)
			.toISOString()
			.slice(0, 10);
		mockFetch(ok({}));
		await endpoints.verify.getAnalytics(makeCtx(), {
			start_date: start,
			end_date: ahead,
		});

		const future = new Date(Date.now() + 3 * 86_400_000)
			.toISOString()
			.slice(0, 10);
		const error = await captureError(
			endpoints.verify.getAnalytics(makeCtx(), {
				start_date: start,
				end_date: future,
			}),
		);
		expect((error as Error).name).toBe('ZodError');
	});

	it('logs a domain only when it is a plain hostname', () => {
		expect(domainOf('a@Example.COM')).toBe('example.com');
		expect(domainOf('alice@example.com (Alice Smith)')).toBeUndefined();
		expect(domainOf('no-at-sign')).toBeUndefined();
		expect(domainOf('a@localhost')).toBeUndefined();
	});
});
