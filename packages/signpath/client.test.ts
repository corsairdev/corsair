import util from 'node:util';
import { describeSignpathError, SignpathAPIError, segment } from './client';

describe('describeSignpathError', () => {
	it('prefers detail over title and prefixes the status', () => {
		expect(
			describeSignpathError(
				400,
				{ title: 'Bad Request', detail: "Project 'a' exists." },
				'fallback',
			),
		).toBe("SignPath 400: Project 'a' exists.");
	});

	it('falls back to title when detail is absent', () => {
		expect(describeSignpathError(403, { title: 'Forbidden' }, 'f')).toBe(
			'SignPath 403: Forbidden',
		);
	});

	it('uses the fallback for a non-JSON body', () => {
		expect(describeSignpathError(502, '<html>Bad gateway</html>', 'oops')).toBe(
			'SignPath 502: oops',
		);
	});

	it('does not prefix when there is no status', () => {
		expect(describeSignpathError(undefined, { detail: 'boom' }, 'f')).toBe(
			'boom',
		);
	});
});

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
