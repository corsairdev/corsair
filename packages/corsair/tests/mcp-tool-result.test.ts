import { describe, expect, it } from '@jest/globals';
import { AuthMissingError, PermissionRequiredError } from 'corsair';
import {
	formatRunScriptError,
	formatRunScriptResult,
	isAgentFacingActionMessage,
} from '../../mcp/src/core/tool-result';

describe('isAgentFacingActionMessage', () => {
	it('detects auth-missing and approval messages', () => {
		expect(
			isAgentFacingActionMessage(
				'[auth-missing:gmail] Authentication required. Direct the user to connect their account: https://hub.example/connect/token',
			),
		).toBe(true);
		expect(
			isAgentFacingActionMessage(
				'Approval required. Visit https://hub.example/approve/token to approve or deny, then tell the agent to retry this action.',
			),
		).toBe(true);
	});

	it('ignores normal API payloads', () => {
		expect(isAgentFacingActionMessage('{"ok":true}')).toBe(false);
		expect(isAgentFacingActionMessage(null)).toBe(false);
	});
});

describe('formatRunScriptResult', () => {
	it('marks approval-required return values as MCP errors', () => {
		const result = formatRunScriptResult(
			'Approval required. Visit https://hub.example/approve/token to approve or deny, then tell the agent to retry this action.',
		);

		expect(result.isError).toBe(true);
		expect(result.content[0]?.text).toContain('Approval required');
	});

	it('redacts unrelated credentials in returned action messages', () => {
		const url = 'https://hub.example/approve?token=approval-token';
		const result = formatRunScriptResult(
			`Approval required. Visit ${url} to approve. Authorization: Bearer unrelated-secret`,
		);
		const text = result.content[0]?.text ?? '';

		expect(text).toContain(url);
		expect(text).not.toContain('unrelated-secret');
	});

	it('serializes BigInt values without throwing', () => {
		const result = formatRunScriptResult({ v: 10n });

		expect(result.isError).toBeUndefined();
		expect(result.content[0]?.text).toContain('"v": "10"');
	});

	it('serializes circular values without throwing', () => {
		const result: { self?: unknown } = {};
		result.self = result;

		expect(formatRunScriptResult(result).content[0]?.text).toContain(
			'"self": "[Circular]"',
		);
	});

	it('preserves repeated non-circular references', () => {
		const shared = { value: 'shared' };

		expect(
			formatRunScriptResult({ first: shared, second: shared }).content[0]?.text,
		).toBe(JSON.stringify({ first: shared, second: shared }, null, 2));
	});

	it('redacts request data from returned errors', () => {
		const error = Object.assign(new Error('request failed'), {
			request: {
				body: { email: 'member@example.com' },
				headers: { authorization: 'Bearer secret-token' },
			},
		});

		const text = formatRunScriptResult(error).content[0]?.text ?? '';

		expect(text).not.toContain('member@example.com');
		expect(text).not.toContain('secret-token');
		expect(text).toContain('[REDACTED]');
	});

	it('redacts nested sensitive fields from returned errors', () => {
		const error = Object.assign(new Error('request failed'), {
			config: {
				accessToken: 'access-secret',
				headers: { 'x-api-key': 'header-secret' },
				idToken: 'identity-secret',
				refreshToken: 'refresh-secret',
			},
		});

		const text = formatRunScriptResult(error).content[0]?.text ?? '';

		expect(text).not.toContain('access-secret');
		expect(text).not.toContain('header-secret');
		expect(text).not.toContain('identity-secret');
		expect(text).not.toContain('refresh-secret');
		expect(text).toContain('[REDACTED]');
	});

	it('redacts custom error JSON output', () => {
		const error = Object.assign(new Error('request failed'), {
			toJSON: () => ({ authorization: 'Bearer secret-token' }),
		});

		const text = formatRunScriptResult(error).content[0]?.text ?? '';

		expect(text).not.toContain('secret-token');
		expect(text).toContain('request failed');
	});

	it('redacts custom JSON output from nested returned errors', () => {
		const error = Object.assign(new Error('request failed'), {
			toJSON: () => ({ authorization: 'Bearer secret-token' }),
		});

		const text = formatRunScriptResult({ error }).content[0]?.text ?? '';

		expect(text).not.toContain('secret-token');
		expect(text).toContain('request failed');
	});

	it('redacts sensitive descendants of nested returned errors', () => {
		const error = Object.assign(new Error('request failed'), {
			details: { accessToken: 'secret-token' },
		});

		const text = formatRunScriptResult({ error }).content[0]?.text ?? '';

		expect(text).not.toContain('secret-token');
		expect(text).toContain('[REDACTED]');
	});

	it('redacts custom JSON output from accessor-returned errors', () => {
		const error = Object.assign(new Error('request failed'), {
			toJSON: () => ({ authorization: 'Bearer secret-token' }),
		});
		const result = Object.defineProperty({}, 'error', {
			enumerable: true,
			get: () => error,
		});

		const text = formatRunScriptResult(result).content[0]?.text ?? '';

		expect(text).not.toContain('secret-token');
		expect(text).toContain('request failed');
	});

	it('handles self-returning toJSON methods', () => {
		const value = { toJSON: () => value };

		expect(formatRunScriptResult(value).content[0]?.text).toContain(
			'[Circular]',
		);
	});
});

describe('formatRunScriptError', () => {
	it('marks PermissionRequiredError as an MCP error without verbose wrapping', () => {
		const result = formatRunScriptError(
			new PermissionRequiredError(
				'Approval required. Visit https://hub.example/approve/token to approve or deny, then tell the agent to retry this action.',
			),
		);

		expect(result.isError).toBe(true);
		expect(result.content[0]?.text).toContain('Approval required');
		expect(result.content[0]?.text).not.toContain('Error running snippet');
	});

	it('preserves actionable approval URLs with query tokens', () => {
		const message =
			'Approval required. Visit https://hub.example/approve?id=permission-id&token=approval-token to approve or deny, then tell the agent to retry this action.';

		expect(
			formatRunScriptError(new PermissionRequiredError(message)).content[0]
				?.text,
		).toBe(message);
	});

	it('redacts unrelated credentials while preserving an actionable URL', () => {
		const url =
			'https://hub.example/approve?id=permission-id&token=approval-token';
		const message = `Approval required. Visit ${url} to approve. Authorization: Bearer unrelated-secret`;
		const text = formatRunScriptError(new PermissionRequiredError(message))
			.content[0]?.text;

		expect(text).toContain(url);
		expect(text).not.toContain('unrelated-secret');
		expect(text).toContain('Authorization: [REDACTED]');
	});

	it('preserves the action URL when another URL appears first', () => {
		const url =
			'https://hub.example/approve?id=permission-id&token=approval-token';
		const message = `See https://docs.example/help?token=docs-token. Approval required. Visit ${url} to approve.`;
		const text = formatRunScriptError(new PermissionRequiredError(message))
			.content[0]?.text;

		expect(text).toContain(url);
		expect(text).not.toContain('docs-token');
	});

	it('preserves the connect URL while redacting other credentials in auth-missing errors', () => {
		const url = 'https://hub.example/connect?token=connect-secret&state=$$keep';
		const message = `[auth-missing:gmail] Authentication required. Direct the user to connect their account: ${url} Authorization: Bearer unrelated-secret`;
		const text = formatRunScriptError(
			new AuthMissingError('gmail', 'oauth_2', message),
		).content[0]?.text;

		expect(text).toContain(url);
		expect(text).toContain('connect-secret');
		expect(text).not.toContain('unrelated-secret');
	});

	it('marks AuthMissingError as an MCP error without verbose wrapping', () => {
		const result = formatRunScriptError(
			new AuthMissingError(
				'gmail',
				'oauth_2',
				'[auth-missing:gmail] Authentication required. Direct the user to connect their account: https://hub.example/connect/token',
			),
		);

		expect(result.isError).toBe(true);
		expect(result.content[0]?.text).toContain('[auth-missing:gmail]');
	});

	it('serializes BigInt properties on errors without throwing', () => {
		const error = Object.assign(new Error('failed'), { details: { v: 10n } });

		expect(formatRunScriptError(error).content[0]?.text).toContain('"v": "10"');
	});

	it('redacts BigInt values in sensitive error fields', () => {
		const error = Object.assign(new Error('failed'), { token: 123456789n });
		const text = formatRunScriptError(error).content[0]?.text ?? '';

		expect(text).not.toContain('123456789');
		expect(text).toContain('"token": "[REDACTED]"');
	});

	it('serializes circular error causes without throwing', () => {
		const cause: { self?: unknown } = {};
		cause.self = cause;
		const error = new Error('failed', { cause });

		expect(formatRunScriptError(error).content[0]?.text).toContain(
			'"self": "[Circular]"',
		);
	});

	it('includes messages from wrapped errors', () => {
		const error = new Error('outer failure', {
			cause: new Error('inner failure'),
		});

		expect(formatRunScriptError(error).content[0]?.text).toContain(
			'inner failure',
		);
	});

	it('redacts sensitive text from nested errors', () => {
		const error = Object.assign(new Error('outer failure'), {
			details: new Error('member@example.com Bearer secret-token'),
		});

		const text = formatRunScriptError(error).content[0]?.text ?? '';

		expect(text).not.toContain('member@example.com');
		expect(text).not.toContain('secret-token');
		expect(text).toContain('[REDACTED]');
	});

	it('redacts complete Basic authorization values', () => {
		const error = new Error('Authorization: Basic dXNlcjpwYXNz');
		const text = formatRunScriptError(error).content[0]?.text ?? '';

		expect(text).not.toContain('Basic');
		expect(text).not.toContain('dXNlcjpwYXNz');
		expect(text).toContain('Authorization: [REDACTED]');
	});

	it('redacts non-Error throws', () => {
		const text =
			formatRunScriptError('Authorization: Bearer secret-token').content[0]
				?.text ?? '';

		expect(text).not.toContain('secret-token');
		expect(text).toContain('Authorization: [REDACTED]');
	});

	it('serializes self-referential errors without throwing', () => {
		const error = new Error('failed');
		Object.defineProperty(error, 'cause', { value: error });

		expect(formatRunScriptError(error).content[0]?.text).toContain(
			'"cause": "[Circular]"',
		);
	});

	it('redacts nested request data from error details', () => {
		const error = Object.assign(new Error('request failed'), {
			request: {
				body: { email: 'member@example.com' },
				headers: { authorization: 'Bearer secret-token' },
			},
		});

		const text = formatRunScriptError(error).content[0]?.text ?? '';

		expect(text).not.toContain('member@example.com');
		expect(text).not.toContain('secret-token');
		expect(text).toContain('[REDACTED]');
	});

	it('returns an MCP error when an error property cannot be read', () => {
		const error = new Error('request failed');
		Object.defineProperty(error, 'details', {
			get() {
				throw new Error('unreadable details');
			},
		});

		expect(() => formatRunScriptError(error)).not.toThrow();
		expect(formatRunScriptError(error).content[0]?.text).toContain(
			'[Unreadable property]',
		);
	});

	it('returns an MCP error when an error message cannot be read', () => {
		const error = new Error('request failed');
		Object.defineProperty(error, 'message', {
			get() {
				throw new Error('unreadable message');
			},
		});

		expect(() => formatRunScriptError(error)).not.toThrow();
		expect(formatRunScriptError(error).content[0]?.text).toContain(
			'[Unreadable error message]',
		);
	});

	it('returns a redacted MCP error when error properties cannot be enumerated', () => {
		const error = new Proxy(new Error('Bearer secret-token'), {
			ownKeys() {
				throw new Error('unreadable properties');
			},
		});

		const text = formatRunScriptError(error).content[0]?.text ?? '';

		expect(text).not.toContain('secret-token');
		expect(text).toContain('Bearer [REDACTED]');
	});

	it('redacts serialization fallback text', () => {
		const error = new Error('request failed');
		const value = {
			error,
			toJSON() {
				throw new Error('cannot serialize');
			},
			toString: () => 'Bearer fallback-secret',
		};

		const text = formatRunScriptError(value).content[0]?.text ?? '';

		expect(text).not.toContain('fallback-secret');
		expect(text).toContain('Bearer [REDACTED]');
	});

	it('handles values whose prototype cannot be inspected', () => {
		const value = new Proxy(
			{},
			{
				getPrototypeOf() {
					throw new Error('unreadable prototype');
				},
			},
		);

		expect(() => formatRunScriptError(value)).not.toThrow();
		expect(formatRunScriptError(value).isError).toBe(true);
		expect(() => formatRunScriptResult(value)).not.toThrow();
	});

	it('treats __proto__ as data while normalizing errors', () => {
		const value = Object.defineProperty({}, '__proto__', {
			enumerable: true,
			value: { authorization: 'Bearer secret-token' },
		});
		const text = formatRunScriptError(value).content[0]?.text ?? '';

		expect(text).not.toContain('secret-token');
		expect(text).toContain('[REDACTED]');
	});
});
