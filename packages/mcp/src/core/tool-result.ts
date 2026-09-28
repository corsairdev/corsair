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
		(err instanceof Error && isAgentFacingActionMessage(errorMessage(err)))
	);
}

export function toolErrorResult(message: string): CallToolResult {
	return {
		isError: true,
		content: [{ type: 'text', text: message }],
	};
}

const SENSITIVE_ERROR_FIELDS = new Set([
	'api_key',
	'apikey',
	'authorization',
	'client_secret',
	'clientsecret',
	'cookie',
	'password',
	'private_key',
	'privatekey',
	'request',
	'response',
	'secret',
	'set-cookie',
	'token',
]);

function safeString(value: unknown): string {
	try {
		return String(value);
	} catch {
		return '[Unserializable value]';
	}
}

function errorMessage(err: Error): string {
	try {
		return safeString(err.message);
	} catch {
		return '[Unreadable error message]';
	}
}

function safeSerialize(value: unknown, redactSensitiveFields = false): string {
	const ancestors: object[] = [];
	const serializedErrors = new WeakMap<Error, Record<string, unknown>>();

	function errorProperties(err: Error): Record<string, unknown> {
		const cached = serializedErrors.get(err);
		if (cached) {
			return cached;
		}

		const properties: Record<string, unknown> = {};
		serializedErrors.set(err, properties);

		for (const key of Object.getOwnPropertyNames(err)) {
			try {
				properties[key] = err[key as keyof Error];
			} catch {
				properties[key] = '[Unreadable property]';
			}
		}

		return properties;
	}

	try {
		return (
			JSON.stringify(
				value,
				function (_key, nestedValue: unknown) {
					const serializableValue =
						nestedValue instanceof Error
							? errorProperties(nestedValue)
							: nestedValue;

					while (ancestors.length > 0 && ancestors.at(-1) !== this) {
						ancestors.pop();
					}

					if (typeof serializableValue === 'bigint') {
						return serializableValue.toString();
					}

					if (
						redactSensitiveFields &&
						SENSITIVE_ERROR_FIELDS.has(_key.toLowerCase())
					) {
						return '[REDACTED]';
					}

					if (
						typeof serializableValue === 'object' &&
						serializableValue !== null
					) {
						if (ancestors.includes(serializableValue)) {
							return '[Circular]';
						}

						ancestors.push(serializableValue);
					}

					return serializableValue;
				},
				2,
			) ?? safeString(value)
		);
	} catch {
		return safeString(value);
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
	const message = err instanceof Error ? errorMessage(err) : safeString(err);

	if (isActionToolError(err)) {
		return toolErrorResult(message);
	}

	const full = safeSerialize(err, true);

	return toolErrorResult(`Error running snippet: ${message}\n${full}`);
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
