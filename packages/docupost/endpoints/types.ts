import { z } from 'zod';

const AccountBalanceInputSchema = z.object({});

export type AccountBalanceInput = z.infer<typeof AccountBalanceInputSchema>;

const AccountBalanceResponseSchema = z.record(z.string(), z.unknown());

export type AccountBalanceResponse = z.infer<
	typeof AccountBalanceResponseSchema
>;

const SendLetterInputSchema = z.object({
	to_name: z.string(),
	to_address: z.string(),
	to_city: z.string(),
	to_state: z.string(),
	to_zip: z.string(),
	from_name: z.string(),
	from_address: z.string(),
	from_city: z.string(),
	from_state: z.string(),
	from_zip: z.string(),
	pdf_url: z.string().url().optional(),
	html: z.string().optional(),
});

export type SendLetterInput = z.infer<typeof SendLetterInputSchema>;

const SendLetterResponseSchema = z.record(z.string(), z.unknown());

export type SendLetterResponse = z.infer<typeof SendLetterResponseSchema>;

const SendPostcardInputSchema = z.object({
	to_name: z.string(),
	to_address: z.string(),
	to_city: z.string(),
	to_state: z.string(),
	to_zip: z.string(),
	from_name: z.string(),
	from_address: z.string(),
	from_city: z.string(),
	from_state: z.string(),
	from_zip: z.string(),
	front_image_url: z.string().url(),
	back_image_url: z.string().url(),
});

export type SendPostcardInput = z.infer<typeof SendPostcardInputSchema>;

const SendPostcardResponseSchema = z.record(z.string(), z.unknown());

export type SendPostcardResponse = z.infer<typeof SendPostcardResponseSchema>;

export type DocupostEndpointInputs = {
	accountBalance: AccountBalanceInput;
	sendLetter: SendLetterInput;
	sendPostcard: SendPostcardInput;
};

export type DocupostEndpointOutputs = {
	accountBalance: AccountBalanceResponse;
	sendLetter: SendLetterResponse;
	sendPostcard: SendPostcardResponse;
};

export const DocupostEndpointInputSchemas = {
	accountBalance: AccountBalanceInputSchema,
	sendLetter: SendLetterInputSchema,
	sendPostcard: SendPostcardInputSchema,
} as const;

export const DocupostEndpointOutputSchemas = {
	accountBalance: AccountBalanceResponseSchema,
	sendLetter: SendLetterResponseSchema,
	sendPostcard: SendPostcardResponseSchema,
} as const;
