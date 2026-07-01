import {
	getShannonEntropy,
	isPotentialSecretValue,
	maskSensitiveData,
	obfuscateExecutionRecord,
	obfuscateValue,
	shouldObfuscateField,
} from '../core/utils/masking';

describe('Shannon Entropy & Potential Secret Heuristics', () => {
	test('getShannonEntropy', () => {
		expect(getShannonEntropy('')).toBe(0);
		// All characters unique
		expect(getShannonEntropy('abcd')).toBeCloseTo(2.0, 1);
		// All characters same
		expect(getShannonEntropy('aaaa')).toBe(0);
	});

	test('isPotentialSecretValue - known prefixes', () => {
		expect(isPotentialSecretValue('sk-proj-1234567890abcdef')).toBe(true);
		expect(isPotentialSecretValue('Bearer abcdef1234567890')).toBe(true);
		expect(isPotentialSecretValue('bearer abcdef1234567890')).toBe(true);
		expect(isPotentialSecretValue('ghp_abcdef1234567890')).toBe(true);
		expect(isPotentialSecretValue('xoxb-abcdef1234567890')).toBe(true);
		expect(isPotentialSecretValue('key-abcdef1234567890')).toBe(true);
	});

	test('isPotentialSecretValue - high entropy vs normal strings', () => {
		// Random base64/hex string (high entropy, length >= 16)
		expect(isPotentialSecretValue('a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6')).toBe(
			true,
		);

		// Short string
		expect(isPotentialSecretValue('abc')).toBe(false);

		// String with spaces
		expect(
			isPotentialSecretValue(
				'this is a very long descriptive sentence with high character count',
			),
		).toBe(false);

		// URL
		expect(
			isPotentialSecretValue('https://example.com/api/v1/auth/token'),
		).toBe(false);

		// Email
		expect(isPotentialSecretValue('user@example.com')).toBe(false);

		// ISO Date string
		expect(isPotentialSecretValue('2026-07-01T10:00:00.000Z')).toBe(false);
	});
});

describe('Field Obfuscation Rules', () => {
	test('shouldObfuscateField', () => {
		expect(shouldObfuscateField('api_key')).toBe(true);
		expect(shouldObfuscateField('token')).toBe(true);
		expect(shouldObfuscateField('clientSecret')).toBe(true);
		expect(shouldObfuscateField('password')).toBe(true);
		expect(shouldObfuscateField('credential')).toBe(true);
		expect(shouldObfuscateField('username')).toBe(false);
		expect(shouldObfuscateField('email')).toBe(false);
	});

	test('obfuscateValue', () => {
		expect(obfuscateValue(null)).toBe('***');
		expect(obfuscateValue('short')).toBe('***');
		expect(obfuscateValue('secret_value_long')).toBe('secr…ong (17 chars)');
		expect(obfuscateValue(12345)).toBe('***');
	});
});

describe('Recursive Mask Sensitive Data', () => {
	test('flat object key-based masking', () => {
		const input = {
			username: 'johndoe',
			api_key: 'supersecretkeyhere',
		};
		const masked = maskSensitiveData(input) as typeof input;
		expect(masked.username).toBe('johndoe');
		expect(masked.api_key).toBe('supe…ere (18 chars)');
	});

	test('recursive object masking', () => {
		const input = {
			user: {
				name: 'John',
				credentials: {
					password: 'mysecurepassword',
					role: 'admin',
				},
			},
			innocent_key: 'ghp_secrettokenwithknownprefix', // matches value-shape heuristic
		};
		const masked = maskSensitiveData(input) as any;
		expect(masked.user.name).toBe('John');
		expect(masked.user.credentials.password).toBe('myse…ord (16 chars)');
		expect(masked.user.credentials.role).toBe('admin');
		expect(masked.innocent_key).toBe('ghp_…fix (30 chars)');
	});

	test('array recursive masking', () => {
		const input = [
			{
				id: 1,
				secret: 'shhh-secret-value',
			},
			{
				id: 2,
				token: 'Bearer xyz1234567890',
			},
			'normal-primitive-value',
			'sk-anothersecretvalue', // matches value-shape heuristic
		];
		const masked = maskSensitiveData(input) as any[];
		expect(masked[0].id).toBe(1);
		expect(masked[0].secret).toBe('shhh…lue (17 chars)');
		expect(masked[1].id).toBe(2);
		expect(masked[1].token).toBe('Bear…890 (20 chars)');
		expect(masked[2]).toBe('normal-primitive-value');
		expect(masked[3]).toBe('sk-a…lue (21 chars)');
	});

	test('circular reference safety', () => {
		const input: any = {
			name: 'circularObj',
		};
		input.self = input;

		const masked = maskSensitiveData(input) as any;
		expect(masked.name).toBe('circularObj');
		expect(masked.self).toBe('[Circular]');
	});

	test('sibling shared reference safety', () => {
		const shared = { value: 'some-value' };
		const input = {
			first: shared,
			second: shared,
		};

		const masked = maskSensitiveData(input) as any;
		expect(masked.first.value).toBe('some-value');
		expect(masked.second.value).toBe('some-value');
	});
});

describe('obfuscateExecutionRecord', () => {
	test('masks both input and output fields', () => {
		const row = {
			id: 'exec-123',
			tenant_id: 'default',
			input: {
				apiKey: 'my-custom-api-key',
				url: 'https://api.github.com',
			},
			output: {
				token: 'ghp_1234567890abcdef',
				status: 'success',
			},
		};

		const masked = obfuscateExecutionRecord(row) as any;
		expect(masked.id).toBe('exec-123');
		expect(masked.tenant_id).toBe('default');
		expect(masked.input.apiKey).toBe('my-c…key (17 chars)');
		expect(masked.input.url).toBe('https://api.github.com');
		expect(masked.output.token).toBe('ghp_…def (20 chars)');
		expect(masked.output.status).toBe('success');
	});
});
