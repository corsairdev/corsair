import { existsSync } from 'node:fs';
import { join } from 'node:path';
import type { RawWebhookRequest } from 'corsair/core';
import { createBitwardenMatch } from './types';

function request(body: unknown): RawWebhookRequest {
	return { headers: {}, body };
}

describe('bitwarden webhooks', () => {
	it('does not keep the generator example scaffold', () => {
		expect(existsSync(join(__dirname, 'example.ts'))).toBe(false);
	});

	it('never matches incoming requests while webhooks are unimplemented', () => {
		const match = createBitwardenMatch('example');
		expect(match(request({ type: 'example' }))).toBe(false);
		expect(match(request(JSON.stringify({ type: 'example' })))).toBe(false);
	});
});
