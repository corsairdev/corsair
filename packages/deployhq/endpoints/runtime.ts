import type { CorsairEndpoint } from 'corsair/core';
import { logEventFromContext } from 'corsair/core';
import type {
	DeployHQCredentials,
	DeployHQJsonValue,
	DeployHQQueryValue,
} from '../client';
import { makeDeployHQRequest } from '../client';
import type { DeployHQContext } from '../index';
import { deployHQOperations } from './openapi-operations';

export type DeployHQOperationKey = keyof typeof deployHQOperations;
export type DeployHQOperationInput<Key extends DeployHQOperationKey> =
	(typeof deployHQOperations)[Key]['inputSchema']['_input'];
export type DeployHQOperationOutput<Key extends DeployHQOperationKey> =
	(typeof deployHQOperations)[Key]['outputSchema']['_output'];

function readInputValue(input: object, key: string): unknown {
	// `unknown` because a dynamic property is read from parsed endpoint input and must still be narrowed.
	return Object.getOwnPropertyDescriptor(input, key)?.value;
}

function toJsonValue(value: unknown): DeployHQJsonValue {
	// `unknown` because parsed schema output is accessed dynamically by parameter name.
	if (
		value === null ||
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean'
	)
		return value;
	if (Array.isArray(value)) return value.map(toJsonValue);
	if (typeof value === 'object') {
		const result: { [key: string]: DeployHQJsonValue } = {};
		for (const [key, nestedValue] of Object.entries(value)) {
			if (nestedValue !== undefined) result[key] = toJsonValue(nestedValue);
		}
		return result;
	}
	throw new Error('DeployHQ request input contains a non-JSON value.');
}

function queryValue(value: unknown): DeployHQQueryValue {
	// `unknown` because query fields are selected dynamically from parsed endpoint input.
	if (
		typeof value === 'string' ||
		typeof value === 'number' ||
		typeof value === 'boolean'
	)
		return value;
	return undefined;
}

export async function runDeployHQOperation<Key extends DeployHQOperationKey>(
	operationKey: Key,
	input: DeployHQOperationInput<Key>,
	credentials: DeployHQCredentials,
): Promise<DeployHQOperationOutput<Key>> {
	const operation = deployHQOperations[operationKey];
	const parsedInput = operation.inputSchema.parse(input);
	let path: string = operation.path;
	for (const parameter of operation.pathParameters) {
		const value = readInputValue(parsedInput, parameter);
		if (typeof value !== 'string' && typeof value !== 'number') {
			throw new Error(`Missing DeployHQ path parameter: ${parameter}`);
		}
		if (value === '.' || value === '..') {
			throw new Error(
				`DeployHQ path parameter ${parameter} cannot be a dot segment.`,
			);
		}
		path = path.replaceAll(`{${parameter}}`, encodeURIComponent(String(value)));
	}
	const query: Record<string, DeployHQQueryValue> = {};
	for (const parameter of operation.queryParameters) {
		query[parameter] = queryValue(readInputValue(parsedInput, parameter));
	}
	const formData: Record<string, string | boolean> = {};
	for (const parameter of operation.formParameters) {
		const value = readInputValue(parsedInput, parameter);
		if (typeof value === 'string' || typeof value === 'boolean')
			formData[parameter] = value;
		else if (typeof value === 'number') formData[parameter] = String(value);
	}
	const rawBody = readInputValue(parsedInput, 'body');
	const requestBody =
		operation.bodyKind === 'none' || rawBody === undefined
			? undefined
			: toJsonValue(rawBody);
	// `unknown` because the provider response is untrusted until the operation-specific output schema parses it.
	const response: unknown = await makeDeployHQRequest(path, credentials, {
		method: operation.method,
		query,
		binary: operationKey === 'invoices.getAccountInvoice',
		signup: operationKey === 'signup.createSignup',
		...(operation.bodyKind === 'form'
			? { formData }
			: requestBody !== undefined
				? { body: requestBody }
				: {}),
		public: operation.public,
	});
	return operation.outputSchema.parse(response);
}

export function executeDeployHQOperation<Key extends DeployHQOperationKey>(
	operationKey: Key,
): CorsairEndpoint<
	DeployHQContext,
	DeployHQOperationInput<Key>,
	DeployHQOperationOutput<Key>
> {
	return async (context, input) => {
		const operation = deployHQOperations[operationKey];
		const storedAccountSubdomain = context.keys
			? await context.keys.get_account_subdomain()
			: null;
		const credentials: DeployHQCredentials = {
			accountSubdomain:
				context.options.accountSubdomain ?? storedAccountSubdomain ?? undefined,
			...(operation.public
				? {}
				: {
						apiKey: context.key,
						username:
							context.options.username ??
							(await context.keys.get_username()) ??
							undefined,
					}),
		};
		const result = await runDeployHQOperation(operationKey, input, credentials);
		await logEventFromContext(
			context,
			`deployhq.${operationKey}`,
			{ method: operation.method },
			'completed',
		);
		return result;
	};
}
