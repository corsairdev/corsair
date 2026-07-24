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
});
