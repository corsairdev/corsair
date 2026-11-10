import {
	DEFAULT_SERVICENOW_HOST,
	describeServicenowError,
	normalizeServicenowHost,
	parseCredentials,
	ServicenowAPIError,
	servicenowBase,
} from './client';

describe('ServiceNow host normalization', () => {
	it('accepts the instance host', () => {
		expect(normalizeServicenowHost('acme.service-now.com')).toBe(
			'acme.service-now.com',
		);
	});

	it('builds the host from an instance name alone', () => {
		expect(normalizeServicenowHost('acme')).toBe('acme.service-now.com');
		expect(normalizeServicenowHost('dev-12345')).toBe(
			'dev-12345.service-now.com',
		);
	});

	it('accepts a government cloud instance', () => {
		expect(normalizeServicenowHost('agency.servicenowservices.com')).toBe(
			'agency.servicenowservices.com',
		);
	});

	it('strips a scheme', () => {
		expect(normalizeServicenowHost('https://acme.service-now.com')).toBe(
			'acme.service-now.com',
		);
	});

	it('strips trailing slashes', () => {
		expect(normalizeServicenowHost('https://acme.service-now.com/')).toBe(
			'acme.service-now.com',
		);
		expect(normalizeServicenowHost('acme.service-now.com///')).toBe(
			'acme.service-now.com',
		);
	});

	it('lowercases the host', () => {
		expect(normalizeServicenowHost('ACME.Service-Now.com')).toBe(
			'acme.service-now.com',
		);
	});

	// The host is tenant input when it comes from the stored `host` key. A free
	// hostname would send the request, and the Basic credentials with it, to any
	// server the runtime can reach.
	it.each([
		['another domain', 'stored.example.com'],
		['a pasted URL on another domain', 'https://internal.example.com/'],
		['an internal name with a port', 'localhost:8443'],
		['an IPv4 address', '169.254.169.254'],
		['an IPv6 address', 'https://[::1]/'],
		['a lookalike suffix', 'acme.service-now.com.example.com'],
		['a lookalike domain', 'acmeservice-now.com'],
		['a nested subdomain', 'internal.acme.service-now.com'],
		['the bare domain', 'service-now.com'],
		['an empty instance name', '.service-now.com'],
		['a port', 'acme.service-now.com:8443'],
		['a pasted URL with a port', 'https://acme.service-now.com:8443'],
		['a path smuggled before the domain', 'example.com/.service-now.com'],
		['a fragment smuggled before the domain', 'example.com#.service-now.com'],
		['userinfo without a scheme', 'acme.service-now.com@example.com'],
		['a leading hyphen', '-acme.service-now.com'],
		['a trailing dot', 'acme.service-now.com.'],
		['an underscore', 'ac_me'],
	])('rejects %s', (_, host) => {
		expect(() => normalizeServicenowHost(host)).toThrow(
			/instance name or \{instance\}\.service-now\.com/,
		);
	});

	it('rejects http, because the API is HTTPS only', () => {
		expect(() =>
			normalizeServicenowHost('http://acme.service-now.com'),
		).toThrow(/https/);
	});

	it('rejects a host carrying credentials', () => {
		expect(() =>
			normalizeServicenowHost('https://user:pass@acme.service-now.com'),
		).toThrow(/credentials/);
	});

	it('rejects a host with a path', () => {
		expect(() =>
			normalizeServicenowHost('acme.service-now.com/api/now'),
		).toThrow(/instance name/);
	});

	it('rejects an empty host', () => {
		expect(() => normalizeServicenowHost('  ')).toThrow(/required/);
	});

	it('builds the /api/now base from the normalized host', () => {
		expect(servicenowBase('https://acme.service-now.com/')).toBe(
			'https://acme.service-now.com/api/now',
		);
		expect(servicenowBase('acme')).toBe('https://acme.service-now.com/api/now');
	});

	it('pins the documented default host as a placeholder, not a real instance', () => {
		expect(DEFAULT_SERVICENOW_HOST).toBe('dev00000.service-now.com');
	});
});

describe('ServiceNow credential parsing', () => {
	it('reads a username and password pair', () => {
		expect(
			parseCredentials(JSON.stringify({ username: 'admin', password: 'pw' })),
		).toEqual({ username: 'admin', password: 'pw' });
	});

	it('throws on a non-JSON key', () => {
		expect(() => parseCredentials('not-json')).toThrow(/must be a JSON object/);
	});

	it('throws when the password is empty', () => {
		expect(() =>
			parseCredentials(JSON.stringify({ username: 'admin', password: '' })),
		).toThrow(/non-empty username and password/);
	});

	it('throws when the username is missing', () => {
		expect(() => parseCredentials(JSON.stringify({ password: 'pw' }))).toThrow(
			/non-empty username and password/,
		);
	});

	it('throws on a JSON string rather than an object', () => {
		expect(() => parseCredentials(JSON.stringify('admin:pw'))).toThrow(
			/non-empty username and password/,
		);
	});
});

describe('ServiceNow error description', () => {
	it('reads message and detail', () => {
		const described = describeServicenowError(
			401,
			{
				error: {
					message: 'User Not Authenticated',
					detail: 'Required to provide Auth information',
				},
			},
			'fallback',
		);

		expect(described.message).toBe('ServiceNow 401: User Not Authenticated');
		expect(described.detail).toBe('Required to provide Auth information');
	});

	it('omits detail when the body has none', () => {
		const described = describeServicenowError(
			404,
			{ error: { message: 'No Record found' } },
			'fallback',
		);

		expect(described.detail).toBeUndefined();
	});

	it('falls back when the body is not the documented shape', () => {
		const described = describeServicenowError(500, 'plain text', 'gateway');
		expect(described.message).toBe('ServiceNow 500: gateway');
	});
});

describe('ServiceNow error classification', () => {
	it('treats 401 and 403 as auth errors', () => {
		expect(new ServicenowAPIError('x', { status: 401 }).isAuthError).toBe(true);
		expect(new ServicenowAPIError('x', { status: 403 }).isAuthError).toBe(true);
		expect(new ServicenowAPIError('x', { status: 404 }).isAuthError).toBe(
			false,
		);
	});

	it('classifies 404 as not found', () => {
		expect(new ServicenowAPIError('x', { status: 404 }).isNotFound).toBe(true);
		expect(new ServicenowAPIError('x', { status: 500 }).isNotFound).toBe(false);
	});
});
