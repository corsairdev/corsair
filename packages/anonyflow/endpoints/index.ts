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
	const apiKey = context.key ?? '';
	const response = await makeAnonyflowRequest<{
		status: boolean;
		value: string[];
	}>('/anony-value', apiKey, {
		method: 'POST',
		body: { data: [input.text] },
	});
	return {
		anonymizedText: response.value[0] ?? '',
	};
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
	const apiKey = context.key ?? '';
	const response = await makeAnonyflowRequest<{
		status: boolean;
		value: string[];
	}>('/deanony-value', apiKey, {
		method: 'POST',
		body: { data: [input.anonymizedText] },
	});
	return {
		originalText: response.value[0] ?? '',
	};
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
	const apiKey = context.key ?? '';
	return makeAnonyflowRequest<AnonymizePacketOutput>('/anony-packet', apiKey, {
		method: 'POST',
		body: {
			data: input.data,
			keys: input.keys,
		},
	});
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
	const apiKey = context.key ?? '';
	return makeAnonyflowRequest<DeanonymizePacketOutput>(
		'/deanony-packet',
		apiKey,
		{
			method: 'POST',
			body: {
				data: input.data,
				keys: input.keys,
			},
		},
	);
}

/**
 * Retrieves the connection status of the Anonyflow API key.
 * Note: The GET /test endpoint returns a status object.
 * Verified: Returns a boolean status matching the Composio/Metorial action signature.
 *
 * @param context The Corsair plugin context.
 * @param _input Unused request options.
 * @returns A promise resolving to the API status response.
 */
async function getStatus(
	context: AnonyflowContext,
	_input: GetStatusInput,
): Promise<GetStatusOutput> {
	const apiKey = context.key ?? '';
	return makeAnonyflowRequest<GetStatusOutput>('/test', apiKey, {
		method: 'GET',
	});
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
