import util from 'node:util';
import { SignpathAPIError, segment } from './client';

describe('SignpathAPIError', () => {
	it('reads the trace id from the problem body', () => {
		const error = new SignpathAPIError('x', {
			status: 400,
			body: { detail: 'bad', traceId: '00-ab-01' },
		});

		expect(error.traceId).toBe('00-ab-01');
		expect(error.status).toBe(400);
	});

	it('classifies auth and permission errors', () => {
		expect(new SignpathAPIError('x', { status: 401 }).isAuthError).toBe(true);
		expect(new SignpathAPIError('x', { status: 403 }).isPermissionError).toBe(
			true,
		);
	});

	it('keeps an API token out of the message and out of util.inspect', () => {
		const token = 'super-secret-token-value';
		const error = new SignpathAPIError(`SignPath 401: Unauthorized`, {
			status: 401,
			body: { detail: 'Malformed Authorization header' },
		});

		expect(error.message).not.toContain(token);
		expect(util.inspect(error)).not.toContain(token);
		expect(JSON.stringify(error)).not.toContain(token);
	});
});

describe('segment', () => {
	it('encodes a slash so a slug cannot escape its path segment', () => {
		expect(segment('a/b')).toBe('a%2Fb');
	});

	it('encodes a space', () => {
		expect(segment('a b')).toBe('a%20b');
	});
});
