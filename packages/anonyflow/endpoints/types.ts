import { z } from 'zod';

const AnonymizeInputSchema = z.object({
	text: z.string().describe('The raw text to anonymize'),
});
export type AnonymizeInput = z.infer<typeof AnonymizeInputSchema>;

const AnonymizeOutputSchema = z.object({
	anonymizedText: z.string().min(1),
});
export type AnonymizeOutput = z.infer<typeof AnonymizeOutputSchema>;

const DeanonymizeInputSchema = z.object({
	anonymizedText: z.string().describe('The anonymized text to decode'),
});
export type DeanonymizeInput = z.infer<typeof DeanonymizeInputSchema>;

const DeanonymizeOutputSchema = z.object({
	originalText: z.string().min(1),
});
export type DeanonymizeOutput = z.infer<typeof DeanonymizeOutputSchema>;

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
	status: z.literal(true),
	value: z.record(z.string(), z.unknown()),
});
export type AnonymizePacketOutput = z.infer<typeof AnonymizePacketOutputSchema>;

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
	status: z.literal(true),
	value: z.record(z.string(), z.unknown()),
});
export type DeanonymizePacketOutput = z.infer<
	typeof DeanonymizePacketOutputSchema
>;

export type AnonyflowEndpointInputs = {
	anonymize: AnonymizeInput;
	deanonymize: DeanonymizeInput;
	anonymizePacket: AnonymizePacketInput;
	deanonymizePacket: DeanonymizePacketInput;
};

export type AnonyflowEndpointOutputs = {
	anonymize: AnonymizeOutput;
	deanonymize: DeanonymizeOutput;
	anonymizePacket: AnonymizePacketOutput;
	deanonymizePacket: DeanonymizePacketOutput;
};

export const AnonyflowEndpointInputSchemas = {
	anonymize: AnonymizeInputSchema,
	deanonymize: DeanonymizeInputSchema,
	anonymizePacket: AnonymizePacketInputSchema,
	deanonymizePacket: DeanonymizePacketInputSchema,
} as const;

export const AnonyflowEndpointOutputSchemas = {
	anonymize: AnonymizeOutputSchema,
	deanonymize: DeanonymizeOutputSchema,
	anonymizePacket: AnonymizePacketOutputSchema,
	deanonymizePacket: DeanonymizePacketOutputSchema,
} as const;
