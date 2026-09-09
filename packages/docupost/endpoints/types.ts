import { z } from 'zod';

const AccountBalanceInputSchema = z.object({});

export type AccountBalanceInput = z.infer<typeof AccountBalanceInputSchema>;

const AccountBalanceResponseSchema = z
	.object({
		// unknown is necessary because Docupost reports varying balance keys per account state; a closed value union is infeasible because the provider does not publish a stable shape
		balance: z.unknown().optional(),
	})
	.loose();

export type AccountBalanceResponse = z.infer<
	typeof AccountBalanceResponseSchema
>;

const AddressFields = {
	to_name: z.string().min(1),
	to_address: z.string().min(1),
	to_city: z.string().min(1),
	to_state: z.string().length(2),
	to_zip: z.string().regex(/^\d{5}(-\d{4})?$/),
	from_name: z.string().min(1),
	from_address: z.string().min(1),
	from_city: z.string().min(1),
	from_state: z.string().length(2),
	from_zip: z.string().regex(/^\d{5}(-\d{4})?$/),
};

const SendLetterInputSchema = z
	.object({
		...AddressFields,
		pdf_url: z.string().url().optional(),
		html: z.string().max(9000).optional(),
	})
	.refine((value) => Boolean(value.pdf_url) !== Boolean(value.html), {
		message: 'exactly one of pdf_url or html is required',
	});

export type SendLetterInput = z.infer<typeof SendLetterInputSchema>;

const SendLetterResponseSchema = z
	.object({
		id: z.string().optional(),
		status: z.string().optional(),
	})
	.loose();

export type SendLetterResponse = z.infer<typeof SendLetterResponseSchema>;

const SendPostcardInputSchema = z.object({
	...AddressFields,
	front_image_url: z.string().url(),
	back_image_url: z.string().url(),
});

export type SendPostcardInput = z.infer<typeof SendPostcardInputSchema>;

const SendPostcardResponseSchema = z
	.object({
		id: z.string().optional(),
		status: z.string().optional(),
	})
	.loose();

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
