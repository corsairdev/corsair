import { z } from 'zod';

// 1. Anonymize Value
const AnonymizeInputSchema = z.object({
	text: z.string().describe('The raw text to anonymize'),
});
export type AnonymizeInput = z.infer<typeof AnonymizeInputSchema>;

const AnonymizeOutputSchema = z.object({
	anonymizedText: z.string(),
	id: z.string().optional(),
});
export type AnonymizeOutput = z.infer<typeof AnonymizeOutputSchema>;

// 2. Deanonymize Value
const DeanonymizeInputSchema = z.object({
	anonymizedText: z.string().describe('The anonymized text to decode'),
	id: z.string().optional().describe('Optional mapping ID'),
});
export type DeanonymizeInput = z.infer<typeof DeanonymizeInputSchema>;

const DeanonymizeOutputSchema = z.object({
	originalText: z.string(),
});
export type DeanonymizeOutput = z.infer<typeof DeanonymizeOutputSchema>;

// 3. Anonymize Packet
const AnonymizePacketInputSchema = z.object({
	data: z
		.record(z.string(), z.unknown())
		.describe('The data packet to anonymize'),
	keys: z
		.array(z.string())
		.describe('The keys within the data packet to anonymize'),
});
export type AnonymizePacketInput = z.infer<typeof AnonymizePacketInputSchema>;

const AnonymizePacketOutputSchema = z.object({
	status: z.boolean(),
	value: z.record(z.string(), z.unknown()),
});
export type AnonymizePacketOutput = z.infer<typeof AnonymizePacketOutputSchema>;

// 4. Deanonymize Packet
const DeanonymizePacketInputSchema = z.object({
	data: z
		.record(z.string(), z.unknown())
		.describe('The data packet to deanonymize'),
	keys: z
		.array(z.string())
		.describe('The keys within the data packet to deanonymize'),
});
export type DeanonymizePacketInput = z.infer<
	typeof DeanonymizePacketInputSchema
>;

const DeanonymizePacketOutputSchema = z.object({
	status: z.boolean(),
	value: z.record(z.string(), z.unknown()),
});
export type DeanonymizePacketOutput = z.infer<
	typeof DeanonymizePacketOutputSchema
>;

// 5. Get Status
const GetStatusInputSchema = z.object({});
export type GetStatusInput = z.infer<typeof GetStatusInputSchema>;

const GetStatusOutputSchema = z.object({
	status: z.boolean(),
});
export type GetStatusOutput = z.infer<typeof GetStatusOutputSchema>;

// --- MAPPINGS FOR CORSAIR ---

export type AnonyflowEndpointInputs = {
	anonymize: AnonymizeInput;
	deanonymize: DeanonymizeInput;
	anonymizePacket: AnonymizePacketInput;
	deanonymizePacket: DeanonymizePacketInput;
	getStatus: GetStatusInput;
};

export type AnonyflowEndpointOutputs = {
	anonymize: AnonymizeOutput;
	deanonymize: DeanonymizeOutput;
	anonymizePacket: AnonymizePacketOutput;
	deanonymizePacket: DeanonymizePacketOutput;
	getStatus: GetStatusOutput;
};

export const AnonyflowEndpointInputSchemas = {
	anonymize: AnonymizeInputSchema,
	deanonymize: DeanonymizeInputSchema,
	anonymizePacket: AnonymizePacketInputSchema,
	deanonymizePacket: DeanonymizePacketInputSchema,
	getStatus: GetStatusInputSchema,
} as const;

export const AnonyflowEndpointOutputSchemas = {
	anonymize: AnonymizeOutputSchema,
	deanonymize: DeanonymizeOutputSchema,
	anonymizePacket: AnonymizePacketOutputSchema,
	deanonymizePacket: DeanonymizePacketOutputSchema,
	getStatus: GetStatusOutputSchema,
} as const;
