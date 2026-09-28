import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { AuthMissingError, PermissionRequiredError } from 'corsair';

export function isAgentFacingActionMessage(value: unknown): value is string {
	if (typeof value !== 'string') {
		return false;
	}

	return (
		value.includes('[auth-missing:') ||
		value.startsWith('Approval required. Visit') ||
		value.includes(' requires user approval before it can run') ||
		value.includes(' was denied by the user') ||
		value.includes(' is blocked by the permission policy') ||
		value.includes(' timed out waiting for approval') ||
		value.includes('Could not create approval link')
	);
}

export function isActionToolError(err: unknown): boolean {
	return (
		err instanceof AuthMissingError ||
		err instanceof PermissionRequiredError ||
		(err instanceof Error && isAgentFacingActionMessage(err.message))
	);
}

export function toolErrorResult(message: string): CallToolResult {
	return {
		isError: true,
		content: [{ type: 'text', text: message }],
	};
}

function safeSerialize(value: unknown): string {
	const ancestors: object[] = [];

	try {
		return (
			JSON.stringify(
				value,
				function (_key, nestedValue: unknown) {
					while (ancestors.length > 0 && ancestors.at(-1) !== this) {
						ancestors.pop();
					}

					if (typeof nestedValue === 'bigint') {
						return nestedValue.toString();
					}

					if (typeof nestedValue === 'object' && nestedValue !== null) {
						if (ancestors.includes(nestedValue)) {
							return '[Circular]';
						}

						ancestors.push(nestedValue);
					}

					return nestedValue;
				},
				2,
			) ?? String(value)
		);
	} catch {
		try {
			return String(value);
		} catch {
			return '[Unserializable value]';
		}
	}
}

export function formatRunScriptResult(result: unknown): CallToolResult {
	if (isAgentFacingActionMessage(result)) {
		return toolErrorResult(result);
	}

	return {
		content: [
			{
				type: 'text',
				text: safeSerialize(result ?? null),
			},
		],
	};
}

export function formatRunScriptError(err: unknown): CallToolResult {
	const message = err instanceof Error ? err.message : String(err);

	if (isActionToolError(err)) {
		return toolErrorResult(message);
	}

	const extra =
		err instanceof Error && err.cause ? `\nCause: ${String(err.cause)}` : '';
	const full = safeSerialize(
		err instanceof Error
			? Object.fromEntries(
					Object.getOwnPropertyNames(err).map((key) => [
						key,
						err[key as keyof Error],
					]),
				)
			: err,
	);

	return toolErrorResult(`Error running snippet: ${message}${extra}\n${full}`);
}

export function callToolResultToText(result: CallToolResult): string {
	const text = result.content
		.filter((c) => c.type === 'text')
		.map((c) => ('text' in c ? c.text : ''))
		.join('\n');

	if (result.isError) {
		throw new Error(text);
	}

	return text;
}
