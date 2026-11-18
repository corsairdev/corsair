import {
	describeSwaggerhubError,
	SWAGGERHUB_API_BASE,
	SwaggerhubAPIError,
	segment,
	specPath,
} from './client';

describe('swaggerhub paths', () => {
	it('joins owner, name and version', () => {
		expect(specPath('apis', 'admin', 'example', '1.0.0')).toBe(
			'/apis/admin/example/1.0.0',
		);
		expect(specPath('domains', 'admin', 'example')).toBe(
			'/domains/admin/example',
		);
		expect(specPath('templates', 'admin', 'template-1', '1.0.0')).toBe(
			'/templates/admin/template-1/1.0.0',
		);
	});

	it('encodes each segment so a version with a slash survives', () => {
		expect(specPath('apis', 'admin', 'example', 'feature/branch')).toBe(
			'/apis/admin/example/feature%2Fbranch',
		);
	});

	it('encodes a name with a space or a hash', () => {
		expect(segment('my api')).toBe('my%20api');
		expect(segment('a#b')).toBe('a%23b');
	});

	it('keeps the owner case', () => {
		expect(specPath('apis', 'AdminOrg', 'Example', '1.0.0')).toBe(
			'/apis/AdminOrg/Example/1.0.0',
		);
	});

	it('hangs off the one registry host', () => {
		expect(SWAGGERHUB_API_BASE).toBe('https://api.swaggerhub.com');
	});
});

describe('swaggerhub error descriptions', () => {
	it('reads the documented code and message', () => {
		const described = describeSwaggerhubError(
			404,
			{ code: 404, message: 'Unknown API admin/example:1.0.0' },
			'fallback',
		);

		expect(described.message).toBe(
			'SwaggerHub 404: Unknown API admin/example:1.0.0',
		);
		expect(described.code).toBe(404);
	});

	it('reads a bare error field', () => {
		expect(
			describeSwaggerhubError(400, { error: 'Invalid definition' }, 'fallback')
				.message,
		).toBe('SwaggerHub 400: Invalid definition');
	});

	it('falls back to the transport message when the body is HTML', () => {
		expect(
			describeSwaggerhubError(415, '<html>Unsupported</html>', 'Unsupported')
				.message,
		).toBe('SwaggerHub 415: Unsupported');
	});

	it('leaves the message bare when there is no status', () => {
		expect(describeSwaggerhubError(undefined, null, 'boom').message).toBe(
			'boom',
		);
	});

	it('keeps the code only when the body carries a number', () => {
		expect(
			describeSwaggerhubError(400, { code: 'not-a-number' }, 'x').code,
		).toBeUndefined();
	});
});

describe('swaggerhub api error', () => {
	it('classifies its status', () => {
		expect(new SwaggerhubAPIError('x', { status: 401 }).isAuthError).toBe(true);
		expect(new SwaggerhubAPIError('x', { status: 403 }).isAuthError).toBe(true);
		expect(new SwaggerhubAPIError('x', { status: 404 }).isNotFound).toBe(true);
		expect(new SwaggerhubAPIError('x', { status: 429 }).isRateLimit).toBe(true);
		expect(new SwaggerhubAPIError('x', { status: 400 }).isValidation).toBe(
			true,
		);
		expect(new SwaggerhubAPIError('x', { status: 409 }).isConflict).toBe(true);
		expect(
			new SwaggerhubAPIError('x', { status: 415 }).isUnsupportedMedia,
		).toBe(true);
	});

	it('keeps the cause when one is given', () => {
		const cause = new Error('inner');
		expect(new SwaggerhubAPIError('outer', { cause }).cause).toBe(cause);
	});
});
