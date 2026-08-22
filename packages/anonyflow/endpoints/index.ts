import { makeAnonyflowRequest } from '../client';
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
	GetStatusInput,
	GetStatusOutput,
} from './types';
import {
	AnonyflowEndpointInputSchemas,
	AnonyflowEndpointOutputSchemas,
} from './types';

/**
 * Anonymizes a single text value using Anonyflow's value-based anonymization API.
 * Maps input to the correct request body format and extracts the response value.
 *
 * @param context The Corsair plugin context.
 * @param input The text input to anonymize.
 * @returns A promise resolving to the anonymized text value.
 */
async function anonymize(
	context: AnonyflowContext,
	input: AnonymizeInput,
): Promise<AnonymizeOutput> {
	const validatedInput = AnonyflowEndpointInputSchemas.anonymize.parse(input);
	const apiKey = context.key ?? '';
	const response = await makeAnonyflowRequest<{
		status: boolean;
		value: string[];
	}>('/anony-value', apiKey, {
		method: 'POST',
		body: { data: [validatedInput.text] },
	});
	const output: AnonymizeOutput = {
		anonymizedText: response.value[0] ?? '',
	};
	return AnonyflowEndpointOutputSchemas.anonymize.parse(output);
}

/**
 * Deanonymizes a single text value using Anonyflow's value-based deanonymization API.
 * Maps input to the correct request body format and extracts the decrypted value.
 *
 * @param context The Corsair plugin context.
 * @param input The anonymized text to deanonymize.
 * @returns A promise resolving to the original text.
 */
async function deanonymize(
	context: AnonyflowContext,
	input: DeanonymizeInput,
): Promise<DeanonymizeOutput> {
	const validatedInput = AnonyflowEndpointInputSchemas.deanonymize.parse(input);
	const apiKey = context.key ?? '';
	const response = await makeAnonyflowRequest<{
		status: boolean;
		value: string[];
	}>('/deanony-value', apiKey, {
		method: 'POST',
		body: { data: [validatedInput.anonymizedText] },
	});
	const output: DeanonymizeOutput = {
		originalText: response.value[0] ?? '',
	};
	return AnonyflowEndpointOutputSchemas.deanonymize.parse(output);
}

/**
 * Anonymizes a JSON data packet (object) by applying encryption to specific keys.
 *
 * @param context The Corsair plugin context.
 * @param input The data packet and keys to anonymize.
 * @returns A promise resolving to the anonymized packet response.
 */
async function anonymizePacket(
	context: AnonyflowContext,
	input: AnonymizePacketInput,
): Promise<AnonymizePacketOutput> {
	const validatedInput =
		AnonyflowEndpointInputSchemas.anonymizePacket.parse(input);
	const apiKey = context.key ?? '';
	const response = await makeAnonyflowRequest<unknown>(
		'/anony-packet',
		apiKey,
		{
			method: 'POST',
			body: {
				data: validatedInput.data,
				keys: validatedInput.keys,
			},
		},
	);
	return AnonyflowEndpointOutputSchemas.anonymizePacket.parse(response);
}

/**
 * Deanonymizes a JSON data packet (object) by applying decryption to specific keys.
 *
 * @param context The Corsair plugin context.
 * @param input The anonymized data packet and keys to decrypt.
 * @returns A promise resolving to the deanonymized packet response.
 */
async function deanonymizePacket(
	context: AnonyflowContext,
	input: DeanonymizePacketInput,
): Promise<DeanonymizePacketOutput> {
	const validatedInput =
		AnonyflowEndpointInputSchemas.deanonymizePacket.parse(input);
	const apiKey = context.key ?? '';
	const response = await makeAnonyflowRequest<unknown>(
		'/deanony-packet',
		apiKey,
		{
			method: 'POST',
			body: {
				data: validatedInput.data,
				keys: validatedInput.keys,
			},
		},
	);
	return AnonyflowEndpointOutputSchemas.deanonymizePacket.parse(response);
}

/**
 * Retrieves the connection status of the Anonyflow API key.
 * Note: The GET /test endpoint returns a status object.
 * Verified: Returns a boolean status matching the Composio/Metorial action signature.
 *
 * @param context The Corsair plugin context.
 * @param input The status check request options.
 * @returns A promise resolving to the API status response.
 */
async function getStatus(
	context: AnonyflowContext,
	input: GetStatusInput,
): Promise<GetStatusOutput> {
	const validatedInput = AnonyflowEndpointInputSchemas.getStatus.parse(input);
	const apiKey = context.key ?? '';
	const response = await makeAnonyflowRequest<unknown>('/test', apiKey, {
		method: 'GET',
	});
	return AnonyflowEndpointOutputSchemas.getStatus.parse(response);
}

/**
 * Exported core operations for the Anonyflow plugin.
 */
export const AnonyflowOperations = {
	anonymize,
	deanonymize,
	anonymizePacket,
	deanonymizePacket,
	getStatus,
};
