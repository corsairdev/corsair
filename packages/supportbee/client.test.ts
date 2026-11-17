import {
	describeSupportbeeError,
	normalizeSupportbeeCompany,
	SupportbeeAPIError,
	supportbeeBase,
} from './client';

describe('SupportBee company normalization', () => {
	it('accepts a bare hostname', () => {
		expect(normalizeSupportbeeCompany('acme.supportbee.com')).toBe(
			'acme.supportbee.com',
		);
	});

	it('accepts the company name on its own', () => {
		expect(normalizeSupportbeeCompany('acme')).toBe('acme.supportbee.com');
		expect(normalizeSupportbeeCompany('acme-support-2')).toBe(
			'acme-support-2.supportbee.com',
		);
	});

	it('accepts a pasted desk address and drops the path', () => {
		expect(
			normalizeSupportbeeCompany('https://acme.supportbee.com/tickets'),
		).toBe('acme.supportbee.com');
		expect(normalizeSupportbeeCompany('https://acme.supportbee.com/')).toBe(
			'acme.supportbee.com',
		);
	});

	it('lowercases the company', () => {
		expect(normalizeSupportbeeCompany('Acme.SupportBee.COM')).toBe(
			'acme.supportbee.com',
		);
	});

	it('rejects another domain, so a request cannot be redirected', () => {
		expect(() => normalizeSupportbeeCompany('acme.example.com')).toThrow(
			/SupportBee desk/,
		);
		expect(() => normalizeSupportbeeCompany('https://evil.test/')).toThrow(
			/SupportBee desk/,
		);
	});

	it('rejects an IP address or a port', () => {
		expect(() => normalizeSupportbeeCompany('127.0.0.1')).toThrow();
		expect(() =>
			normalizeSupportbeeCompany('acme.supportbee.com:8080'),
		).toThrow();
	});

	it('rejects a nested subdomain, an empty value and a non-https address', () => {
		expect(() => normalizeSupportbeeCompany('a.b.supportbee.com')).toThrow();
		expect(() => normalizeSupportbeeCompany('   ')).toThrow(/required/);
		expect(() =>
			normalizeSupportbeeCompany('http://acme.supportbee.com'),
		).toThrow(/https/);
	});

	it('rejects credentials in the address', () => {
		expect(() =>
			normalizeSupportbeeCompany('https://user:pass@acme.supportbee.com'),
		).toThrow(/credentials/);
	});

	it('builds the base every documented path hangs off', () => {
		expect(supportbeeBase('acme')).toBe('https://acme.supportbee.com');
	});
});

describe('supportbee error descriptions', () => {
	it('reads the documented validation body', () => {
		const described = describeSupportbeeError(
			400,
			{ errors: { subject: ["can't be blank"] } },
			'fallback',
		);

		expect(described.message).toBe("SupportBee 400: subject can't be blank");
		expect(described.details).toEqual(["subject can't be blank"]);
	});

	it('reads a bare error string', () => {
		expect(
			describeSupportbeeError(403, { error: 'Access denied' }, 'fallback')
				.message,
		).toBe('SupportBee 403: Access denied');
	});

	it('reads an array of messages', () => {
		expect(
			describeSupportbeeError(400, { errors: ['one', 'two'] }, 'fallback')
				.details,
		).toEqual(['one', 'two']);
	});

	it('falls back to the transport message when the body is HTML', () => {
		// An unknown route answers the desk's HTML page, so there is no JSON.
		expect(
			describeSupportbeeError(404, '<html>Not found</html>', 'Not Found')
				.message,
		).toBe('SupportBee 404: Not Found');
	});

	it('leaves the message bare when there is no status', () => {
		expect(describeSupportbeeError(undefined, null, 'boom').message).toBe(
			'boom',
		);
	});

	it('keeps the code when the body carries one', () => {
		expect(
			describeSupportbeeError(400, { error: 'bad', code: 'E_BAD' }, 'x').code,
		).toBe('E_BAD');
	});
});

describe('supportbee api error', () => {
	it('classifies its status', () => {
		expect(new SupportbeeAPIError('x', { status: 401 }).isAuthError).toBe(true);
		expect(new SupportbeeAPIError('x', { status: 404 }).isNotFound).toBe(true);
		expect(new SupportbeeAPIError('x', { status: 429 }).isRateLimit).toBe(true);
		expect(new SupportbeeAPIError('x', { status: 500 }).isRateLimit).toBe(
			false,
		);
	});

	it('keeps the cause when one is given', () => {
		const cause = new Error('inner');
		expect(new SupportbeeAPIError('outer', { cause }).cause).toBe(cause);
	});
});
