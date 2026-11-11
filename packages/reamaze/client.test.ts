import {
	DEFAULT_REAMAZE_HOST,
	describeReamazeError,
	normalizeReamazeHost,
	parseCredentials,
	pathSegment,
	ReamazeAPIError,
	reamazeBase,
} from './client';

describe('Re:amaze host normalization', () => {
	it('accepts a bare hostname', () => {
		expect(normalizeReamazeHost('acme.reamaze.io')).toBe('acme.reamaze.io');
	});

	it('accepts the brand name on its own', () => {
		expect(normalizeReamazeHost('acme')).toBe('acme.reamaze.io');
		expect(normalizeReamazeHost('acme-support-2')).toBe(
			'acme-support-2.reamaze.io',
		);
	});

	it('accepts the brand address on reamaze.com and builds the API host', () => {
		expect(normalizeReamazeHost('https://acme.reamaze.com/')).toBe(
			'acme.reamaze.io',
		);
	});

	it('lowercases the brand', () => {
		expect(normalizeReamazeHost('Acme.Reamaze.IO')).toBe('acme.reamaze.io');
	});

	it('strips a scheme', () => {
		expect(normalizeReamazeHost('https://acme.reamaze.io')).toBe(
			'acme.reamaze.io',
		);
	});

	it('strips trailing slashes', () => {
		expect(normalizeReamazeHost('https://acme.reamaze.io/')).toBe(
			'acme.reamaze.io',
		);
		expect(normalizeReamazeHost('acme.reamaze.io///')).toBe('acme.reamaze.io');
	});

	// The host is built from the brand name, so nothing a tenant stores can
	// point a request, and the Basic credentials on it, at another machine.
	it.each([
		'internal.example.com',
		'https://internal.example.com',
		'https://169.254.169.254',
		'169.254.169.254',
		'acme.reamaze.io.example.com',
		'example.com/.reamaze.io',
		'https://example.com/#.reamaze.io',
		'https://example.com/?next=.reamaze.io',
		'acme.reamaze.io@example.com',
		'acme.reamaze.io:8443',
		'https://acme.reamaze.io:8443',
		'staging.acme.reamaze.io',
		'acme.reamaze.io.',
		'.reamaze.io',
		'-acme',
		'acme-',
		'ac me',
		'acme\n.example.com',
		`${'a'.repeat(64)}.reamaze.io`,
	])('rejects %j, which is not a Re:amaze brand', (host) => {
		expect(() => normalizeReamazeHost(host)).toThrow(/brand/);
	});

	it('rejects http, because the API is HTTPS only', () => {
		expect(() => normalizeReamazeHost('http://acme.reamaze.io')).toThrow(
			/https/,
		);
	});

	it('rejects a host carrying credentials', () => {
		expect(() =>
			normalizeReamazeHost('https://user:pass@acme.reamaze.io'),
		).toThrow(/credentials/);
	});

	it('rejects a host with a path', () => {
		expect(() => normalizeReamazeHost('acme.reamaze.io/api/v1')).toThrow(
			/brand/,
		);
	});

	it('rejects an empty host', () => {
		expect(() => normalizeReamazeHost('  ')).toThrow(/required/);
	});

	it('builds the /api/v1 base from the normalized host', () => {
		expect(reamazeBase('https://acme.reamaze.io/')).toBe(
			'https://acme.reamaze.io/api/v1',
		);
		expect(reamazeBase('acme')).toBe('https://acme.reamaze.io/api/v1');
	});

	it('pins the documented default host as a placeholder, not a real brand', () => {
		expect(DEFAULT_REAMAZE_HOST).toBe('example.reamaze.io');
	});
});

describe('Re:amaze credential parsing', () => {
	it('reads an email and token pair', () => {
		expect(
			parseCredentials(JSON.stringify({ email: 'a@b.com', token: 'tok' })),
		).toEqual({ email: 'a@b.com', token: 'tok' });
	});

	it('throws on a non-JSON key', () => {
		expect(() => parseCredentials('not-json')).toThrow(/must be a JSON object/);
	});

	it('throws when the token is empty', () => {
		expect(() =>
			parseCredentials(JSON.stringify({ email: 'a@b.com', token: '' })),
		).toThrow(/non-empty email and token/);
	});

	it('throws when the email is missing', () => {
		expect(() => parseCredentials(JSON.stringify({ token: 'tok' }))).toThrow(
			/non-empty email and token/,
		);
	});

	it('throws on a JSON string rather than an object', () => {
		expect(() => parseCredentials(JSON.stringify('a@b.com:tok'))).toThrow(
			/non-empty email and token/,
		);
	});
});

describe('Re:amaze path segments', () => {
	it('keeps an @ readable, as every documented contact path does', () => {
		expect(pathSegment('bob@example.com')).toBe('bob@example.com');
	});

	it('still encodes a space and a slash', () => {
		expect(pathSegment('my slug')).toBe('my%20slug');
		expect(pathSegment('a/b')).toBe('a%2Fb');
	});
});

describe('Re:amaze error description', () => {
	it('reads the unknown-resource shape', () => {
		const described = describeReamazeError(
			404,
			{ errors: 'Not Found' },
			'fallback',
		);

		expect(described.message).toBe('Re:amaze 404: Not Found');
		expect(described.details).toEqual(['Not Found']);
	});

	it('reads the unknown-route shape, which adds a status field', () => {
		const described = describeReamazeError(
			404,
			{ status: 404, error: 'Not Found' },
			'fallback',
		);

		expect(described.message).toBe('Re:amaze 404: Not Found');
	});

	it('reads a validation map of field to messages', () => {
		const described = describeReamazeError(
			422,
			{ errors: { name: ["can't be blank"] } },
			'fallback',
		);

		expect(described.message).toBe("Re:amaze 422: name can't be blank");
		expect(described.details).toEqual(["name can't be blank"]);
	});

	it('falls back when the body is not the documented shape', () => {
		const described = describeReamazeError(500, 'plain text', 'gateway');
		expect(described.message).toBe('Re:amaze 500: gateway');
	});

	it('omits the status prefix when it is unknown', () => {
		expect(
			describeReamazeError(undefined, { error: 'boom' }, 'f').message,
		).toBe('boom');
	});
});

describe('Re:amaze error classification', () => {
	it('treats 401 and 403 as auth errors', () => {
		expect(new ReamazeAPIError('x', { status: 401 }).isAuthError).toBe(true);
		expect(new ReamazeAPIError('x', { status: 403 }).isAuthError).toBe(true);
		expect(new ReamazeAPIError('x', { status: 404 }).isAuthError).toBe(false);
	});

	it('classifies 404 as not found', () => {
		expect(new ReamazeAPIError('x', { status: 404 }).isNotFound).toBe(true);
		expect(new ReamazeAPIError('x', { status: 500 }).isNotFound).toBe(false);
	});

	it('classifies 429 as a rate limit', () => {
		expect(new ReamazeAPIError('x', { status: 429 }).isRateLimit).toBe(true);
	});

	it('classifies 422 as unprocessable', () => {
		expect(new ReamazeAPIError('x', { status: 422 }).isUnprocessable).toBe(
			true,
		);
	});
});
