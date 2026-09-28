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

	it('serializes circular error causes without throwing', () => {
		const cause: { self?: unknown } = {};
		cause.self = cause;
		const error = new Error('failed', { cause });

		expect(formatRunScriptError(error).content[0]?.text).toContain(
			'"self": "[Circular]"',
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
});
