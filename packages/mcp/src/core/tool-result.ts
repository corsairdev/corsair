import type { CallToolResult } from '@modelcontextprotocol/sdk/types.js';
import { AuthMissingError, PermissionRequiredError } from 'corsair';

type TextToolResult = Omit<CallToolResult, 'content'> & {
	content: [{ type: 'text'; text: string }];
};

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
		isInstanceOf(err, AuthMissingError) ||
		isInstanceOf(err, PermissionRequiredError) ||
		(isInstanceOf(err, Error) &&
			isAgentFacingActionMessage(readErrorMessage(err)))
	);
}

export function toolErrorResult(message: string): TextToolResult {
	return {
		isError: true,
		content: [{ type: 'text', text: message }],
	};
}

const SENSITIVE_ERROR_FIELDS = new Set([
	'access_token',
	'accesstoken',
	'api_key',
	'apikey',
	'authorization',
	'client_secret',
	'clientsecret',
	'cookie',
	'id_token',
	'idtoken',
	'password',
	'private_key',
	'privatekey',
	'refresh_token',
	'refreshtoken',
	'request',
	'response',
	'secret',
	'set-cookie',
	'token',
	'x-api-key',
	'x-auth-token',
]);

function redactSensitiveText(value: string): string {
	return value
		.replace(
			/(\bauthorization\b\s*[:=]\s*)(?:(?:Bearer|Basic|Token)\s+)?[^\s,;]+/gi,
			'$1[REDACTED]',
		)
		.replace(/(Bearer\s+)[^\s,;]+/gi, '$1[REDACTED]')
		.replace(/([?&](?:api[_-]?key|key|token|appid)=)[^&#\s]*/gi, '$1[REDACTED]')
		.replace(
			/(\b(?:api[_-]?key|client[_-]?secret|cookie|password|secret|token)\b\s*[:=]\s*)[^\s,;]+/gi,
			'$1[REDACTED]',
		)
		.replace(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi, '[REDACTED]');
}

function redactActionMessage(value: string): string {
	const actionUrlMatch = value.match(
		/(?:Approval required\. Visit|connect their account:)\s+(https?:\/\/[^\s]+)/i,
	);
	const actionUrl = actionUrlMatch?.[1];
	const protectedValue = actionUrl
		? value.replace(actionUrl, '__CORSAIR_ACTION_URL__')
		: value;

	return redactSensitiveText(protectedValue).replace(
		'__CORSAIR_ACTION_URL__',
		actionUrl ?? '',
	);
}

// Script values cross plugin boundaries without a shared schema.
function safeString(value: unknown): string {
	try {
		return String(value);
	} catch {
		return '[Unserializable value]';
	}
}

function isInstanceOf<T>(
	value: unknown,
	constructor: abstract new (...args: never[]) => T,
): value is T {
	try {
		return value instanceof constructor;
	} catch {
		return false;
	}
}

function readErrorMessage(err: Error): string {
	try {
		return safeString(err.message);
	} catch {
		return '[Unreadable error message]';
	}
}

function errorMessage(err: Error): string {
	return redactSensitiveText(readErrorMessage(err));
}

// `unknown` preserves arbitrary script output until it is safely serialized.
function safeSerialize(value: unknown, redactSensitiveFields = false): string {
	const ancestors = new Set<object>();
	let encounteredError = false;

	function normalize(nestedValue: unknown, redact: boolean): unknown {
		if (typeof nestedValue === 'bigint') {
			return nestedValue.toString();
		}

		if (typeof nestedValue === 'string') {
			return redact ? redactSensitiveText(nestedValue) : nestedValue;
		}

		if (typeof nestedValue !== 'object' || nestedValue === null) {
			return nestedValue;
		}

		if (ancestors.has(nestedValue)) {
			return '[Circular]';
		}

		const isError = isInstanceOf(nestedValue, Error);
		const redactNested = redact || isError;
		encounteredError ||= isError;
		ancestors.add(nestedValue);

		if (!isError) {
			try {
				const toJSON = Reflect.get(nestedValue, 'toJSON');
				if (typeof toJSON === 'function') {
					try {
						return normalize(
							Reflect.apply(toJSON, nestedValue, []),
							redactNested,
						);
					} finally {
						ancestors.delete(nestedValue);
					}
				}
			} catch {
				ancestors.delete(nestedValue);
				return '[Unreadable object]';
			}
		}

		try {
			const keys = isError
				? Object.getOwnPropertyNames(nestedValue)
				: Object.keys(nestedValue);
			const normalized: unknown[] | Record<string, unknown> = Array.isArray(
				nestedValue,
			)
				? new Array(nestedValue.length)
				: Object.create(null);

			for (const key of keys) {
				if (isError && key === 'toJSON') {
					continue;
				}

				if (redactNested && SENSITIVE_ERROR_FIELDS.has(key.toLowerCase())) {
					Reflect.set(normalized, key, '[REDACTED]');
					continue;
				}

				try {
					Reflect.set(
						normalized,
						key,
						normalize(
							nestedValue[key as keyof typeof nestedValue],
							redactNested,
						),
					);
				} catch {
					Reflect.set(normalized, key, '[Unreadable property]');
				}
			}

			return normalized;
		} catch {
			return isError
				? {
						message: errorMessage(nestedValue),
						details: '[Unreadable properties]',
					}
				: '[Unreadable object]';
		} finally {
			ancestors.delete(nestedValue);
		}
	}

	try {
		return (
			JSON.stringify(normalize(value, redactSensitiveFields), null, 2) ??
			redactSensitiveText(safeString(value))
		);
	} catch {
		const text = safeString(value);
		return redactSensitiveFields || encounteredError
			? redactSensitiveText(text)
			: text;
	}
}

export function formatRunScriptResult(result: unknown): TextToolResult {
	if (isAgentFacingActionMessage(result)) {
		return toolErrorResult(redactActionMessage(result));
	}

	return {
		content: [
			{
				type: 'text',
				text: safeSerialize(result ?? null, isInstanceOf(result, Error)),
			},
		],
	};
}

export function formatRunScriptError(err: unknown): TextToolResult {
	if (isActionToolError(err)) {
		return toolErrorResult(
			redactActionMessage(
				isInstanceOf(err, Error) ? readErrorMessage(err) : safeString(err),
			),
		);
	}

	const message = isInstanceOf(err, Error)
		? errorMessage(err)
		: redactSensitiveText(safeString(err));
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
