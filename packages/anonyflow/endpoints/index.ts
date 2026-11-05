import { AnonyflowAPIError, makeAnonyflowRequest } from '../client';
import type { AnonyflowContext } from '../index';
import type {
	AnonymizeInput,
	AnonymizeOutput,
	AnonymizePacketInput,
	AnonymizePacketOutput,
	DeanonymizeInput,
	DeanonymizeOutput,
	DeanonymizePacketInput,
	DeanonymizePacketOutput,
	TestConnectionInput,
	TestConnectionOutput,
} from './types';
import {
	AnonyflowEndpointInputSchemas,
	AnonyflowEndpointOutputSchemas,
} from './types';

function extractValue(response: unknown): string {
	if (typeof response === 'string' && response.length > 0) {
		return response;
	}
	if (response === null || typeof response !== 'object') {
		throw new AnonyflowAPIError('Anonyflow returned an empty or invalid value');
	}

	const payload = response as Record<string, unknown>;
	if (payload.status === false) {
		throw new AnonyflowAPIError('Anonyflow rejected the request');
	}

	const value = payload.value;
	if (typeof value === 'string' && value.length > 0) {
		return value;
	}
	if (
		Array.isArray(value) &&
		typeof value[0] === 'string' &&
		value[0].length > 0
	) {
		return value[0];
	}

	throw new AnonyflowAPIError('Anonyflow returned an empty or invalid value');
}

function requirePacketSuccess(response: unknown): {
	status: true;
	value: Record<string, unknown>;
} {
	if (
		response !== null &&
		typeof response === 'object' &&
		(response as { status?: unknown }).status === false
	) {
		throw new AnonyflowAPIError('Anonyflow rejected the request');
	}
	return response as { status: true; value: Record<string, unknown> };
}

async function anonymize(
	context: AnonyflowContext,
	input: AnonymizeInput,
): Promise<AnonymizeOutput> {
	const validatedInput = AnonyflowEndpointInputSchemas.anonymize.parse(input);
	const response = await makeAnonyflowRequest<unknown>(
		'/anony-value',
		context.key ?? '',
		{
			method: 'POST',
			body: { data: validatedInput.text },
		},
	);
	return AnonyflowEndpointOutputSchemas.anonymize.parse({
		anonymizedText: extractValue(response),
	});
}

async function deanonymize(
	context: AnonyflowContext,
	input: DeanonymizeInput,
): Promise<DeanonymizeOutput> {
	const validatedInput = AnonyflowEndpointInputSchemas.deanonymize.parse(input);
	const response = await makeAnonyflowRequest<unknown>(
		'/deanony-value',
		context.key ?? '',
		{
			method: 'POST',
			body: { data: validatedInput.anonymizedText },
		},
	);
	return AnonyflowEndpointOutputSchemas.deanonymize.parse({
		originalText: extractValue(response),
	});
}

async function anonymizePacket(
	context: AnonyflowContext,
	input: AnonymizePacketInput,
): Promise<AnonymizePacketOutput> {
	const validatedInput =
		AnonyflowEndpointInputSchemas.anonymizePacket.parse(input);
	const response = await makeAnonyflowRequest<unknown>(
		'/anony-packet',
		context.key ?? '',
		{
			method: 'POST',
			body: {
				data: validatedInput.data,
				keys: validatedInput.keys,
			},
		},
	);
	return AnonyflowEndpointOutputSchemas.anonymizePacket.parse(
		requirePacketSuccess(response),
	);
}

async function deanonymizePacket(
	context: AnonyflowContext,
	input: DeanonymizePacketInput,
): Promise<DeanonymizePacketOutput> {
	const validatedInput =
		AnonyflowEndpointInputSchemas.deanonymizePacket.parse(input);
	const response = await makeAnonyflowRequest<unknown>(
		'/deanony-packet',
		context.key ?? '',
		{
			method: 'POST',
			body: {
				data: validatedInput.data,
				keys: validatedInput.keys,
			},
		},
	);
	return AnonyflowEndpointOutputSchemas.deanonymizePacket.parse(
		requirePacketSuccess(response),
	);
}

async function testConnection(
	context: AnonyflowContext,
	input: TestConnectionInput,
): Promise<TestConnectionOutput> {
	AnonyflowEndpointInputSchemas.testConnection.parse(input);
	const response = await makeAnonyflowRequest<unknown>(
		'/test',
		context.key ?? '',
		{
			method: 'GET',
		},
	);

	if (
		response !== null &&
		typeof response === 'object' &&
		(response as { status?: unknown }).status === false
	) {
		throw new AnonyflowAPIError('Anonyflow rejected the request');
	}

	return AnonyflowEndpointOutputSchemas.testConnection.parse(response);
}

export const AnonyflowOperations = {
	anonymize,
	deanonymize,
	anonymizePacket,
	deanonymizePacket,
	testConnection,
};
