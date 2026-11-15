import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { makeFinageRequest } from './client';
import { FinageEndpointOutputSchemas } from './endpoints/types';

function loadLocalEnv() {
	try {
		const contents = readFileSync(resolve(__dirname, '.env.local'), 'utf8');
		for (const line of contents.split('\n')) {
			const match = /^([A-Z0-9_]+)=(.*)$/.exec(line.replace(/\r$/, ''));
			if (match?.[1] && match[2] !== undefined && !process.env[match[1]]) {
				process.env[match[1]] = match[2];
			}
		}
	} catch {
		// The live test can use an exported environment variable instead.
	}
}

loadLocalEnv();

// Engineered opt-in: the read-only smoke test runs only when the caller both
// enables LIVE_TEST and supplies a key. Normal package tests skip it.
const apiKey = process.env.FINAGE_API_KEY;
const enabled = process.env.LIVE_TEST === '1' && Boolean(apiKey);
const describeLive = enabled ? describe : describe.skip;

describeLive('Finage live API', () => {
	it('returns and validates a latest stock quote', async () => {
		if (!apiKey) {
			throw new Error('FINAGE_API_KEY is required for the live test');
		}
		const response = await makeFinageRequest('/last/stock/AAPL', apiKey);
		const parsed =
			FinageEndpointOutputSchemas.getStockLastQuote.safeParse(response);
		expect(parsed.success).toBe(true);
		if (!parsed.success) {
			throw new Error(JSON.stringify(parsed.error.issues));
		}
		expect(parsed.data).toHaveProperty('symbol');
	});
});
