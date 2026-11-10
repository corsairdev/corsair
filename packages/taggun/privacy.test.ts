/**
 * What every operation leaves in `corsair_events`.
 *
 * A receipt is personal financial data: where someone shopped, what they paid,
 * and the address of the store. The caller gets all of it back, but the event
 * log keeps only what describes the call (ids, counts, pass/fail), never what
 * the receipt says, the document itself, its URL or the headers that unlock it.
 * The suite runs all 15 operations so a handler added later is covered too.
 */
import { createCorsair } from 'corsair/core';
import { createIntegrationAndAccount, createTestDatabase } from 'corsair/tests';
import { taggun } from './index';
import {
	CAMPAIGN_IDS,
	CAMPAIGN_SETTINGS,
	CAMPAIGN_VALIDATION_PASSED,
	CREATE_ACK,
	DELETE_ACK,
	SIMPLE_RECEIPT,
	UPDATE_ACK,
	VERBOSE_RECEIPT,
} from './test-fixtures';
import { PNG_BYTES, pngFile, respond, spyOnFetch } from './test-support';

const API_KEY = 'taggun-key-CANARY-0193';
const MERCHANT = 'Canary Bistro 4417';
const ADDRESS = '12 Canary Hidden Lane';
const TOTAL = 9137.53;
const SIGNATURE = 'CANARYSIG77';
const DOCUMENT_URL = `https://receipts.example.com/r/42?sig=${SIGNATURE}`;
const HEADER_VALUE = 'Bearer CANARY-HEADER-5521';
const IMAGE = PNG_BYTES.toString('base64');

const receiptFields = {
	merchantName: { data: MERCHANT, confidenceLevel: 0.9 },
	merchantAddress: { data: ADDRESS, confidenceLevel: 0.9 },
	totalAmount: { data: TOTAL, confidenceLevel: 0.9 },
};

const SIMPLE = { ...SIMPLE_RECEIPT, ...receiptFields };
const VERBOSE = { ...VERBOSE_RECEIPT, ...receiptFields };
const VALIDATION = {
	...CAMPAIGN_VALIDATION_PASSED,
	merchantName: MERCHANT,
	merchantAddress: ADDRESS,
	totalAmount: TOTAL,
};

async function createClient() {
	const testDb = createTestDatabase();
	await createIntegrationAndAccount(testDb.db, 'taggun', 'default');
	const corsair = createCorsair({
		plugins: [taggun({ key: API_KEY })],
		database: testDb.db,
		kek: process.env.CORSAIR_KEK ?? '0123456789abcdef0123456789abcdef',
	});
	return { corsair, testDb };
}

let fetchMock: jest.SpyInstance;

beforeEach(() => {
	fetchMock = spyOnFetch();
});

afterEach(() => {
	jest.restoreAllMocks();
});

describe('event log privacy', () => {
	it('logs no receipt contents, document, URL, header or key from any operation', async () => {
		const { corsair, testDb } = await createClient();
		try {
			const api = corsair.taggun.api;
			const url = {
				url: DOCUMENT_URL,
				headers: { Authorization: HEADER_VALUE },
			};
			const encoded = {
				image: IMAGE,
				filename: 'receipt.png',
				contentType: 'image/png',
			};
			const rules = { merchantName: { allowed: [MERCHANT] } };

			respond(fetchMock, SIMPLE);
			const simple = await api.simple.url(url);
			respond(fetchMock, SIMPLE);
			await api.simple.encoded(encoded);
			respond(fetchMock, SIMPLE);
			await api.simple.file({ file: pngFile() });
			respond(fetchMock, VERBOSE);
			await api.verbose.url(url);
			respond(fetchMock, VERBOSE);
			await api.verbose.encoded(encoded);
			respond(fetchMock, VERBOSE);
			await api.verbose.file({ file: pngFile() });
			respond(fetchMock, CAMPAIGN_IDS);
			await api.campaigns.list({});
			respond(fetchMock, CAMPAIGN_SETTINGS);
			await api.campaigns.get({ campaignId: 'coffee-june-2026' });
			respond(fetchMock, CREATE_ACK, 201);
			await api.campaigns.create({
				campaignId: 'coffee-june-2026',
				settings: CAMPAIGN_SETTINGS,
			});
			respond(fetchMock, UPDATE_ACK);
			await api.campaigns.update({
				campaignId: 'coffee-june-2026',
				settings: CAMPAIGN_SETTINGS,
			});
			respond(fetchMock, DELETE_ACK);
			await api.campaigns.delete({ campaignId: 'coffee-june-2026' });
			respond(fetchMock, VALIDATION);
			await api.campaigns.validateFile({
				campaignId: 'coffee-june-2026',
				file: pngFile(),
			});
			respond(fetchMock, VALIDATION);
			await api.campaigns.validateUrl({
				campaignId: 'coffee-june-2026',
				...url,
			});
			respond(fetchMock, VALIDATION);
			await api.receiptValidation.file({ file: pngFile(), validation: rules });
			respond(fetchMock, VALIDATION);
			await api.receiptValidation.url({ ...url, validation: rules });

			// The caller still gets the receipt: this is about the log only.
			expect(simple.merchantName?.data).toBe(MERCHANT);
			expect(fetchMock).toHaveBeenCalledTimes(15);

			const events = await testDb.db
				.selectFrom('corsair_events')
				.selectAll()
				.execute();
			expect(events).toHaveLength(15);
			const written = JSON.stringify(events);
			for (const secret of [
				MERCHANT,
				ADDRESS,
				String(TOTAL),
				DOCUMENT_URL,
				SIGNATURE,
				HEADER_VALUE,
				IMAGE.slice(0, 40),
				API_KEY,
			]) {
				expect(written).not.toContain(secret);
			}
		} finally {
			testDb.cleanup();
		}
	});
});
