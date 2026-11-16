import {
	describeSurveymonkeyError,
	normalizeSurveymonkeyBase,
	SURVEYMONKEY_API_BASE,
	SurveymonkeyAPIError,
	segment,
} from './client';

describe('surveymonkey path segments', () => {
	it('encodes an id', () => {
		expect(segment('a/b')).toBe('a%2Fb');
	});

	it('refuses a dot segment, which a URL parser would resolve upward', () => {
		expect(() => segment('..')).toThrow(/not a valid id/);
		expect(() => segment('.')).toThrow(/not a valid id/);
	});
});

describe('SurveyMonkey base normalization', () => {
	it('accepts the documented host', () => {
		expect(normalizeSurveymonkeyBase('api.surveymonkey.com')).toBe(
			SURVEYMONKEY_API_BASE,
		);
	});

	it('accepts a pasted address and drops the path', () => {
		expect(normalizeSurveymonkeyBase('https://api.surveymonkey.com/v3')).toBe(
			SURVEYMONKEY_API_BASE,
		);
		expect(normalizeSurveymonkeyBase('https://api.surveymonkey.com/v3/')).toBe(
			SURVEYMONKEY_API_BASE,
		);
		expect(normalizeSurveymonkeyBase('https://api.surveymonkey.com/')).toBe(
			SURVEYMONKEY_API_BASE,
		);
	});

	it('accepts another datacenter under the same domain', () => {
		// The token exchange reports access_url per account, and the vendor says
		// an account may live elsewhere under its own domain.
		expect(normalizeSurveymonkeyBase('api.eu.surveymonkey.com')).toBe(
			'https://api.eu.surveymonkey.com/v3',
		);
	});

	it('accepts the Canadian datacenter, which is under surveymonkey.ca', () => {
		expect(normalizeSurveymonkeyBase('https://api.surveymonkey.ca')).toBe(
			'https://api.surveymonkey.ca/v3',
		);
		expect(() =>
			normalizeSurveymonkeyBase('surveymonkey.ca.evil.test'),
		).toThrow();
	});

	it('lowercases the host', () => {
		expect(normalizeSurveymonkeyBase('API.SurveyMonkey.COM')).toBe(
			SURVEYMONKEY_API_BASE,
		);
	});

	it('rejects another domain, so the token cannot be redirected', () => {
		expect(() => normalizeSurveymonkeyBase('api.example.com')).toThrow(
			/surveymonkey\.ca host/,
		);
		expect(() => normalizeSurveymonkeyBase('https://evil.test/v3')).toThrow(
			/surveymonkey\.ca host/,
		);
	});

	it('rejects a lookalike domain that only ends with the same letters', () => {
		expect(() => normalizeSurveymonkeyBase('not-surveymonkey.com')).toThrow();
		expect(() =>
			normalizeSurveymonkeyBase('surveymonkey.com.evil.test'),
		).toThrow();
	});

	it('rejects an IP address, a port and an empty value', () => {
		expect(() => normalizeSurveymonkeyBase('127.0.0.1')).toThrow();
		expect(() =>
			normalizeSurveymonkeyBase('api.surveymonkey.com:8080'),
		).toThrow();
		expect(() => normalizeSurveymonkeyBase('  ')).toThrow(/required/);
	});

	it('rejects a non-https address and an embedded credential', () => {
		expect(() =>
			normalizeSurveymonkeyBase('http://api.surveymonkey.com'),
		).toThrow(/https/);
		expect(() =>
			normalizeSurveymonkeyBase('https://user:pass@api.surveymonkey.com'),
		).toThrow(/credentials/);
	});
});

describe('surveymonkey error descriptions', () => {
	it('reads the nested error envelope', () => {
		const described = describeSurveymonkeyError(
			401,
			{
				error: {
					id: '1011',
					name: 'Authorization Error',
					message: 'The authorization token provided was invalid.',
					docs: 'https://developer.surveymonkey.com/api/v3/#error-codes',
					http_status_code: 401,
				},
			},
			'fallback',
		);

		expect(described.message).toBe(
			'SurveyMonkey 401: Authorization Error: The authorization token provided was invalid.',
		);
		expect(described.code).toBe('1011');
		expect(described.errorName).toBe('Authorization Error');
		expect(described.docs).toContain('error-codes');
	});

	it('reads the revoked-token shape', () => {
		// Documented under token revocations: status is 1 and the text is errmsg.
		expect(
			describeSurveymonkeyError(
				403,
				{ status: 1, errmsg: 'Client revoked access grant' },
				'fallback',
			).message,
		).toBe('SurveyMonkey 403: Client revoked access grant');
	});

	it('does not repeat the name when the message already has it', () => {
		expect(
			describeSurveymonkeyError(
				400,
				{ error: { name: 'Bad Request', message: 'Bad Request' } },
				'fallback',
			).message,
		).toBe('SurveyMonkey 400: Bad Request');
	});

	it('falls back to the transport message when the body is HTML', () => {
		expect(
			describeSurveymonkeyError(404, '<html>Not Found</html>', 'Not Found')
				.message,
		).toBe('SurveyMonkey 404: Not Found');
	});

	it('leaves the message bare when there is no status', () => {
		expect(describeSurveymonkeyError(undefined, null, 'boom').message).toBe(
			'boom',
		);
	});

	it('accepts a numeric error id and stringifies it', () => {
		expect(
			describeSurveymonkeyError(400, { error: { id: 1004 } }, 'x').code,
		).toBe('1004');
	});
});

describe('surveymonkey api error', () => {
	it('classifies its status', () => {
		expect(new SurveymonkeyAPIError('x', { status: 401 }).isAuthError).toBe(
			true,
		);
		expect(new SurveymonkeyAPIError('x', { status: 403 }).isAuthError).toBe(
			true,
		);
		expect(new SurveymonkeyAPIError('x', { status: 404 }).isNotFound).toBe(
			true,
		);
		expect(new SurveymonkeyAPIError('x', { status: 429 }).isRateLimit).toBe(
			true,
		);
		expect(new SurveymonkeyAPIError('x', { status: 400 }).isValidation).toBe(
			true,
		);
		expect(new SurveymonkeyAPIError('x', { status: 500 }).isValidation).toBe(
			false,
		);
	});

	it('keeps the cause when one is given', () => {
		const cause = new Error('inner');
		expect(new SurveymonkeyAPIError('outer', { cause }).cause).toBe(cause);
	});
});
