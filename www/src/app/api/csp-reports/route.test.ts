import assert from 'node:assert/strict';
import test from 'node:test';
import { POST } from './route';

test('records a redacted CSP violation and acknowledges it', async () => {
	const originalWarn = console.warn;
	let loggedViolation: unknown;
	console.warn = (_message, violation) => {
		loggedViolation = violation;
	};

	try {
		const response = await POST(
			new Request('https://corsair.dev/api/csp-reports', {
				body: JSON.stringify({
					'csp-report': {
						'blocked-uri': 'https://cdn.example.com/script.js?token=secret',
						'document-uri': 'https://corsair.dev/oss?email=user@example.com',
						'effective-directive': 'script-src-elem',
						'violated-directive': 'script-src-elem https://scripts.example.com',
					},
				}),
				headers: { 'content-type': 'application/csp-report' },
				method: 'POST',
			}),
		);

		assert.equal(response.status, 204);
		assert.deepEqual(loggedViolation, {
			blockedUri: 'https://cdn.example.com/script.js',
			documentUri: 'https://corsair.dev/oss',
			effectiveDirective: 'script-src-elem',
			violatedDirective: 'script-src-elem https://scripts.example.com',
		});
	} finally {
		console.warn = originalWarn;
	}
});

test('acknowledges malformed reports without logging them', async () => {
	const originalWarn = console.warn;
	let called = false;
	console.warn = () => {
		called = true;
	};

	try {
		const response = await POST(
			new Request('https://corsair.dev/api/csp-reports', {
				body: '{',
				headers: { 'content-type': 'application/csp-report' },
				method: 'POST',
			}),
		);

		assert.equal(response.status, 204);
		assert.equal(called, false);
	} finally {
		console.warn = originalWarn;
	}
});
