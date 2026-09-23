/**
 * Live PDF.co tests. These run only when `PDFCO_API_KEY` is set; otherwise
 * they are skipped so CI stays green without credentials. When live, they
 * exercise the real API through the same schema-validated client the
 * endpoints use.
 */

import { makePdfcoRequest } from './client';
import { PdfcoEndpointOutputSchemas } from './endpoints/types';
import { pdfco, pdfcoAuthConfig } from './index';

const LIVE_KEY: string = process.env.PDFCO_API_KEY ?? '';
const describeLive = LIVE_KEY.length > 0 ? describe : describe.skip;

// Public sample file taken from the PDF.co Getting Started docs
// (https://developer.pdf.co/api), so no fixture upload is required.
const SAMPLE_PDF =
	'https://pdfco-test-files.s3.us-west-2.amazonaws.com/pdf-to-csv/sample.pdf';

describe('Pdfco plugin registration', () => {
	const plugin = pdfco();

	it('registers the pdfco plugin with api_key auth', () => {
		expect(plugin.id).toBe('pdfco');
		expect(plugin.options?.authType).toBe('api_key');
		expect(Object.keys(pdfcoAuthConfig)).toEqual(['api_key']);
	});

	it('exposes 34 documented operations', () => {
		expect(Object.keys(plugin.endpoints ?? {})).toHaveLength(34);
	});

	it('registers no webhooks', () => {
		expect(plugin.webhooks).toEqual({});
		expect(plugin.webhookSchemas).toEqual({});
	});
});

describeLive('Pdfco live API', () => {
	it('reads the account credit balance', async () => {
		const out = await makePdfcoRequest('/v1/account/credit/balance', LIVE_KEY, {
			method: 'GET',
			schema: PdfcoEndpointOutputSchemas.accountBalance,
		});
		expect(typeof out.remainingCredits).toBe('number');
	});

	it('reads info for the public sample PDF', async () => {
		const out = await makePdfcoRequest('/v1/pdf/info', LIVE_KEY, {
			schema: PdfcoEndpointOutputSchemas.pdfInfoReader,
			body: { url: SAMPLE_PDF },
		});
		expect(out.error).toBe(false);
		expect(typeof out.info?.PageCount).toBe('number');
	});

	it('rejects a job check for an unknown job id', async () => {
		await expect(
			makePdfcoRequest('/v1/job/check', LIVE_KEY, {
				schema: PdfcoEndpointOutputSchemas.jobCheck,
				body: { jobid: 'no-such-job-id' },
			}),
		).rejects.toThrow();
	});
});
